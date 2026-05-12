import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendaEntity } from './Venda.entity';
import { EntradaEstoqueEntity } from './EntradaEstoque.entity';
import { LogEntity } from './Log.entity';

import { TipoUsuario } from 'src/modules/auth/enums/tipo-usuario.enum';
import { StatusUsuario } from 'src/modules/auth/enums/status-usuario.enum';

import * as bcrypt from 'bcrypt';

@Entity('usuarios')
export class UsuarioEntity {
  constructor() {}
  @PrimaryGeneratedColumn('uuid')
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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }

  async validatePassword(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha);
  }
}
