import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ProdutoEntity } from './Produto.entity';

@Entity('categorias')
export class CategoriaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  nome: string;

  @OneToMany(() => ProdutoEntity, (produto) => produto.categoria)
  produtos: ProdutoEntity[];
}
