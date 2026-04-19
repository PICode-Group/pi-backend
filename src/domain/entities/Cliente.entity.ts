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
import { VendaEntity } from './Venda.entity';

@Entity('clientes')
export class ClienteEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  nome: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf: string;

  @Column({ type: 'varchar', length: 11 })
  telefone: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'int', nullable: true })
  endereco_id: number;

  @ManyToOne(() => EnderecoEntity, (endereco) => endereco.clientes, {
    nullable: true,
  })
  @JoinColumn({ name: 'endereco_id' })
  endereco: EnderecoEntity;

  @CreateDateColumn({ type: 'datetime' })
  data_cadastro: Date;

  @OneToMany(() => VendaEntity, (venda) => venda.cliente)
  vendas: VendaEntity[];
}
