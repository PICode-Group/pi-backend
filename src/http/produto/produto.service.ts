import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto, UpdateProdutoDto, FiltroProdutoDto } from 'src/domain/DTOs/Produto.dto';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';

@Injectable()
export class ProdutoService {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async listar(filtros: FiltroProdutoDto) {
    return await this.produtoRepository.buscarComFiltros(filtros);
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
    const produto = await this.buscarPorId(id);
    produto.imagem = caminhoImagem;
    return await this.produtoRepository.salvar(produto);
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
