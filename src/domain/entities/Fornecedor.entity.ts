import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { EnderecoEntity } from './Endereco.entity';
import { EntradaEstoqueEntity } from './EntradaEstoque.entity';

@Entity('fornecedores')
export class FornecedorEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 18, unique: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'int', nullable: true })
  endereco_id: number;

  @ManyToOne(() => EnderecoEntity, (endereco) => endereco.fornecedores, {
    nullable: true,
  })
  @JoinColumn({ name: 'endereco_id' })
  endereco: EnderecoEntity;

  @CreateDateColumn({ type: 'datetime' })
  data_cadastro: Date;

  @OneToMany(() => EntradaEstoqueEntity, (entrada) => entrada.fornecedor)
  entradasEstoque: EntradaEstoqueEntity[];
}
