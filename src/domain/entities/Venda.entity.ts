import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ClienteEntity } from './Cliente.entity';
import { UsuarioEntity } from './Usuario.entity';
import { ItemVendaEntity } from './ItemVenda.entity';
import { PagamentoEntity } from './Pagamento.entity';

export enum StatusVenda {
  ABERTA = 'ABERTA',
  PAGA = 'PAGA',
  CANCELADA = 'CANCELADA',
}

@Entity('vendas')
export class VendaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'cliente_id', nullable: true })
  cliente_id: string;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.vendas, {
    nullable: true,
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente: ClienteEntity;

  @Column({ name: 'usuario_id', nullable: false })
  usuario_id: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.vendas, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @CreateDateColumn({ type: 'datetime' })
  data_venda: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  desconto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor_total: number;

  @Column({ type: 'enum', enum: StatusVenda, default: StatusVenda.ABERTA })
  status: StatusVenda;

  @OneToMany(() => ItemVendaEntity, (itemVenda) => itemVenda.venda)
  itensVenda: ItemVendaEntity[];

  @OneToMany(() => PagamentoEntity, (pagamento) => pagamento.venda)
  pagamentos: PagamentoEntity[];
}
