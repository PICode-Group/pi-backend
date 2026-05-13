import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoEntity } from './Produto.entity';

@Entity('categorias')
export class CategoriaEntity {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80, unique: true })
  nome: string;

  @OneToMany(() => ProdutoEntity, (produto) => produto.categoria)
  produtos: ProdutoEntity[];
}
