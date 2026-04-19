import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EnderecoEntity } from './Endereco.entity';

@Entity('empresa')
export class EmpresaEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome_fantasia: string;

  @Column({ type: 'varchar', length: 120 })
  razao_social: string;

  @Column({ type: 'varchar', length: 18 })
  cnpj: string;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'int', nullable: true })
  endereco_id: number;

  @ManyToOne(() => EnderecoEntity, (endereco) => endereco.empresas, {
    nullable: true,
  })
  @JoinColumn({ name: 'endereco_id' })
  endereco: EnderecoEntity;
}
