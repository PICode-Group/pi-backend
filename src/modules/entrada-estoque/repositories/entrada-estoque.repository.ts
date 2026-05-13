import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntradaEstoqueEntity, ItemEntradaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FiltroEntradaDto } from '../dto/entrada-estoque.dto';

@Injectable()
export class EntradaEstoqueRepository {
  constructor(
    @InjectRepository(EntradaEstoqueEntity)
    private readonly repository: Repository<EntradaEstoqueEntity>,
    @InjectRepository(ItemEntradaEntity)
    private readonly itemRepository: Repository<ItemEntradaEntity>,
  ) {}

  async buscarComFiltros(filtros: FiltroEntradaDto) {
    const query = this.repository.createQueryBuilder('entrada');
    query.leftJoinAndSelect('entrada.fornecedor', 'fornecedor');
    query.leftJoinAndSelect('entrada.itensEntrada', 'itens');
    query.leftJoinAndSelect('itens.produto', 'produto');

    if (filtros.fornecedor_id) {
      query.andWhere('entrada.fornecedor_id = :fornecedorId', { fornecedorId: filtros.fornecedor_id });
    }

    if (filtros.tipo) {
      query.andWhere('entrada.tipo = :tipo', { tipo: filtros.tipo });
    }

    if (filtros.data_inicio) {
      query.andWhere('entrada.data_entrada >= :inicio', { inicio: filtros.data_inicio });
    }

    if (filtros.data_fim) {
      query.andWhere('entrada.data_entrada <= :fim', { fim: filtros.data_fim });
    }

    return await query.getMany();
  }

  async salvarEntrada(dados: Partial<EntradaEstoqueEntity>) {
    const entrada = this.repository.create({
      ...dados,
      id: uuid(),
    });
    return await this.repository.save(entrada);
  }

  async salvarItem(dados: Partial<ItemEntradaEntity>) {
    const item = this.itemRepository.create({
      ...dados,
      id: uuid(),
    });
    return await this.itemRepository.save(item);
  }

  async buscarPorId(id: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ['itensEntrada', 'itensEntrada.produto', 'fornecedor'],
    });
  }
}
