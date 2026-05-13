import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntradaEstoqueEntity } from './EntradaEstoque.entity';
import { ProdutoEntity } from './Produto.entity';

@Entity('itens_entrada')
export class ItemEntradaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'entrada_id', nullable: false })
  entrada_id: string;

  @ManyToOne(() => EntradaEstoqueEntity, (entrada) => entrada.itensEntrada, {
    nullable: false,
  })
  @JoinColumn({ name: 'entrada_id' })
  entradaEstoque: EntradaEstoqueEntity;

  @Column({ name: 'produto_id', nullable: false })
  produto_id: string;

  @ManyToOne(() => ProdutoEntity, (produto) => produto.itensEntrada, {
    nullable: false,
  })
  @JoinColumn({ name: 'produto_id' })
  produto: ProdutoEntity;

  @Column({ type: 'int', nullable: false })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco_custo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: number;
}
