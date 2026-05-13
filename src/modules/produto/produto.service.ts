import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { CreateProdutoDto, UpdateProdutoDto, FiltroProdutoDto } from './dto/produto.dto';
import { ProdutoRepository } from './repositories/produto.repository';
import { paginate } from 'src/core/utils/pagination.util';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';
import * as path from 'path';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly produtoRepository: ProdutoRepository,
    @InjectRepository(ProdutoEntity)
    private readonly repo: Repository<ProdutoEntity>,
  ) {}

  async listar(filtros: FiltroProdutoDto) {
    const queryBuilder = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categoria', 'c');

    if (filtros.nome) {
      queryBuilder.andWhere('p.nome LIKE :nome', { nome: `%${filtros.nome}%` });
    }
    
    if (filtros.categoria_id) {
      queryBuilder.andWhere('p.categoria_id = :cat', { cat: filtros.categoria_id });
    }

    return await paginate(queryBuilder, { page: filtros.page, limit: filtros.limit });
  }

  async buscarPorId(id: string) {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  async criar(dados: CreateProdutoDto) {
    const existente = await this.produtoRepository.buscarPorCodigoBarras(dados.codigo_barras);
    if (existente) {
      throw new ConflictException('Já existe um produto com este código de barras');
    }

    return await this.produtoRepository.salvar({
      ...dados,
      estoque: (dados as any).estoque_inicial || 0,
    });
  }

  async atualizar(id: string, dados: UpdateProdutoDto) {
    const produto = await this.buscarPorId(id);
    Object.assign(produto, dados);
    return await this.produtoRepository.salvar(produto);
  }

  async remover(id: string) {
    const produto = await this.buscarPorId(id);
    await this.produtoRepository.deletar(id);
    return { mensagem: `Produto ${produto.nome} removido com sucesso` };
  }

  async atualizarImagem(id: string, caminhoImagem: string) {
    const fullPath = path.resolve(caminhoImagem);
    
    try {
      const produto = await this.buscarPorId(id);
      
      if (produto.imagem) {
        const oldPath = path.resolve(produto.imagem);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {
          }
        }
      }

      produto.imagem = caminhoImagem;
      return await this.produtoRepository.salvar(produto);
    } catch (error) {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
        if (fs.existsSync(caminhoImagem)) {
          fs.unlinkSync(caminhoImagem);
          console.log('Arquivo removido com sucesso (usando caminho original)!');
        }
      }
      throw error;
    }
  }

  async consultarEstoque(id: string) {
    const produto = await this.buscarPorId(id);
    return {
      quantidade: produto.estoque,
      estoque_minimo: produto.estoque_minimo,
      status: produto.estoque <= produto.estoque_minimo ? 'BAIXO' : 'NORMAL',
    };
  }
}
