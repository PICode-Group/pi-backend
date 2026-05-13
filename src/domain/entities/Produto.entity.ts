import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CategoriaEntity } from './Categoria.entity';
import { ItemVendaEntity } from './ItemVenda.entity';
import { ItemEntradaEntity } from './ItemEntrada.entity';

@Entity('produtos')
export class ProdutoEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo_barras: string;

  @Column({ type: 'int', nullable: true })
  categoria_id: number;

  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.produtos, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco_custo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco_venda: number;

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @Column({ type: 'int', default: 0 })
  estoque_minimo: number;

  @Column({ type: 'varchar', length: 255 })
  imagem: string;

  @CreateDateColumn({ type: 'datetime' })
  data_cadastro: Date;

  @OneToMany(() => ItemVendaEntity, (itemVenda) => itemVenda.produto)
  itensVenda: ItemVendaEntity[];

  @OneToMany(() => ItemEntradaEntity, (itemEntrada) => itemEntrada.produto)
  itensEntrada: ItemEntradaEntity[];
}
