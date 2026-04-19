import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntradaEstoqueEntity } from './EntradaEstoque.entity';
import { ProdutoEntity } from './Produto.entity';

@Entity('itens_entrada')
export class ItemEntradaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  entrada_id: number;

  @ManyToOne(() => EntradaEstoqueEntity, (entrada) => entrada.itensEntrada, {
    nullable: false,
  })
  @JoinColumn({ name: 'entrada_id' })
  entradaEstoque: EntradaEstoqueEntity;

  @Column({ type: 'int', nullable: false })
  produto_id: number;

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
