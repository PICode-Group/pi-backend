import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UsuarioEntity } from './Usuario.entity';

@Entity('logs')
export class LogEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  usuario_id: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.logs, {
    nullable: false,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ type: 'varchar', length: 100, nullable: false })
  acao: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricao: string;

  @CreateDateColumn({ type: 'datetime' })
  data_log: Date;
}
