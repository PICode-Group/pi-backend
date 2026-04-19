import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { VendaEntity } from './Venda.entity';
import { EntradaEstoqueEntity } from './EntradaEstoque.entity';
import { LogEntity } from './Log.entity';

export enum TipoUsuario {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
}

export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

@Entity('usuarios')
export class UsuarioEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @Column({ type: 'enum', enum: TipoUsuario })
  tipo: TipoUsuario;

  @Column({ type: 'enum', enum: StatusUsuario, default: StatusUsuario.ATIVO })
  status: StatusUsuario;

  @CreateDateColumn({ type: 'datetime' })
  data_cadastro: Date;

  @OneToMany(() => VendaEntity, (venda) => venda.usuario)
  vendas: VendaEntity[];

  @OneToMany(() => EntradaEstoqueEntity, (entrada) => entrada.usuario)
  entradasEstoque: EntradaEstoqueEntity[];

  @OneToMany(() => LogEntity, (log) => log.usuario)
  logs: LogEntity[];
}
