import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { FornecedorEntity } from './Fornecedor.entity';
import { UsuarioEntity } from './Usuario.entity';
import { ItemEntradaEntity } from './ItemEntrada.entity';

export enum TipoEntrada {
  COMPRA = 'COMPRA',
  DEVOLUCAO = 'DEVOLUCAO',
  AJUSTE = 'AJUSTE',
}

@Entity('entradas_estoque')
export class EntradaEstoqueEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  fornecedor_id: number;

  @ManyToOne(
    () => FornecedorEntity,
    (fornecedor) => fornecedor.entradasEstoque,
    { nullable: true },
  )
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: FornecedorEntity;

  @Column({ type: 'int', nullable: false })
  usuario_id: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.entradasEstoque, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @CreateDateColumn({ type: 'datetime' })
  data_entrada: Date;

  @Column({ type: 'enum', enum: TipoEntrada, default: TipoEntrada.COMPRA })
  tipo: TipoEntrada;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_total: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  observacao: string;

  @OneToMany(
    () => ItemEntradaEntity,
    (itemEntrada) => itemEntrada.entradaEstoque,
  )
  itensEntrada: ItemEntradaEntity[];
}
