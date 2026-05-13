import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ClienteEntity } from './Cliente.entity';
import { EmpresaEntity } from './Empresa.entity';
import { FornecedorEntity } from './Fornecedor.entity';

@Entity('enderecos')
export class EnderecoEntity {
  constructor() {}
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  rua: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 60 })
  bairro: string;

  @Column({ type: 'varchar', length: 60 })
  cidade: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'varchar', length: 10 })
  cep: string;

  @OneToMany(() => ClienteEntity, (cliente) => cliente.endereco)
  clientes: ClienteEntity[];

  @OneToMany(() => EmpresaEntity, (empresa) => empresa.endereco)
  empresas: EmpresaEntity[];

  @OneToMany(() => FornecedorEntity, (fornecedor) => fornecedor.endereco)
  fornecedores: FornecedorEntity[];
}
