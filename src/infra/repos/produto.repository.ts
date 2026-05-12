import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from 'src/domain/entities/Produto.entity';
import { Repository, Like } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FiltroProdutoDto } from 'src/domain/DTOs/Produto.dto';

@Injectable()
export class ProdutoRepository {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly repository: Repository<ProdutoEntity>,
  ) {}

  async buscarComFiltros(filtros: FiltroProdutoDto) {
    const query = this.repository.createQueryBuilder('produto');
    
    query.leftJoinAndSelect('produto.categoria', 'categoria');

    if (filtros.nome) {
      query.andWhere('produto.nome LIKE :nome', { nome: `%${filtros.nome}%` });
    }

    if (filtros.categoria_id) {
      query.andWhere('produto.categoria_id = :catId', { catId: filtros.categoria_id });
    }

    if (filtros.codigo_barras) {
      query.andWhere('produto.codigo_barras = :cod', { cod: filtros.codigo_barras });
    }

    if (filtros.estoque_baixo === 'true') {
      query.andWhere('produto.estoque <= produto.estoque_minimo');
    }

    return await query.getMany();
  }

  async buscarPorId(id: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async buscarPorCodigoBarras(codigo: string) {
    return await this.repository.findOneBy({ codigo_barras: codigo });
  }

  async salvar(dados: Partial<ProdutoEntity>) {
    const produto = this.repository.create({
      ...dados,
      id: dados.id || uuid(),
    });
    return await this.repository.save(produto);
  }

  async deletar(id: string) {
    return await this.repository.delete(id);
  }
}
