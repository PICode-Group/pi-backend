import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaEntity } from 'src/domain/entities/Venda.entity';
import { ItemVendaEntity } from 'src/domain/entities/ItemVenda.entity';
import { PagamentoEntity } from 'src/domain/entities/Pagamento.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FiltroVendaDto } from 'src/domain/DTOs/Venda.dto';

@Injectable()
export class VendaRepository {
  constructor(
    @InjectRepository(VendaEntity)
    private readonly repository: Repository<VendaEntity>,
    @InjectRepository(ItemVendaEntity)
    private readonly itemRepository: Repository<ItemVendaEntity>,
    @InjectRepository(PagamentoEntity)
    private readonly pagamentoRepository: Repository<PagamentoEntity>,
  ) {}

  async buscarComFiltros(filtros: FiltroVendaDto) {
    const query = this.repository.createQueryBuilder('venda');
    query.leftJoinAndSelect('venda.cliente', 'cliente');
    query.leftJoinAndSelect('venda.usuario', 'usuario');

    if (filtros.cliente_id) {
      query.andWhere('venda.cliente_id = :clienteId', { clienteId: filtros.cliente_id });
    }

    if (filtros.status) {
      query.andWhere('venda.status = :status', { status: filtros.status });
    }

    if (filtros.data_inicio) {
      query.andWhere('venda.data_venda >= :inicio', { inicio: filtros.data_inicio });
    }

    if (filtros.data_fim) {
      query.andWhere('venda.data_venda <= :fim', { fim: filtros.data_fim });
    }

    return await query.getMany();
  }

  async buscarPorId(id: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ['itensVenda', 'itensVenda.produto', 'pagamentos', 'cliente', 'usuario'],
    });
  }

  async salvarVenda(dados: Partial<VendaEntity>) {
    const venda = this.repository.create({
      ...dados,
      id: dados.id || uuid(),
    });
    return await this.repository.save(venda);
  }

  async salvarItem(dados: Partial<ItemVendaEntity>) {
    const item = this.itemRepository.create({
      ...dados,
      id: uuid(),
    });
    return await this.itemRepository.save(item);
  }

  async removerItem(id: string) {
    return await this.itemRepository.delete(id);
  }

  async salvarPagamento(dados: Partial<PagamentoEntity>) {
    const pagamento = this.pagamentoRepository.create({
      ...dados,
      id: uuid(),
    });
    return await this.pagamentoRepository.save(pagamento);
  }
}
