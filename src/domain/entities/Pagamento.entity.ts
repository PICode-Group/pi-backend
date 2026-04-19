import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { VendaEntity } from './Venda.entity';

export enum TipoPagamento {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO',
}

@Entity('pagamentos')
export class PagamentoEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  venda_id: number;

  @ManyToOne(() => VendaEntity, (venda) => venda.pagamentos, {
    nullable: false,
  })
  @JoinColumn({ name: 'venda_id' })
  venda: VendaEntity;

  @Column({ type: 'enum', enum: TipoPagamento, nullable: false })
  tipo: TipoPagamento;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor_pago: number;

  @CreateDateColumn({ type: 'datetime' })
  data_pagamento: Date;
}
