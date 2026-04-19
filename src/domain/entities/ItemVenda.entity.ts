import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { VendaEntity } from './Venda.entity';
import { ProdutoEntity } from './Produto.entity';

@Entity('itens_venda')
export class ItemVendaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  venda_id: number;

  @ManyToOne(() => VendaEntity, (venda) => venda.itensVenda, {
    nullable: false,
  })
  @JoinColumn({ name: 'venda_id' })
  venda: VendaEntity;

  @Column({ type: 'int', nullable: false })
  produto_id: number;

  @ManyToOne(() => ProdutoEntity, (produto) => produto.itensVenda, {
    nullable: false,
  })
  @JoinColumn({ name: 'produto_id' })
  produto: ProdutoEntity;

  @Column({ type: 'int', nullable: false })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: number;
}
