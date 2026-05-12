import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FornecedorEntity } from 'src/domain/entities/Fornecedor.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FornecedorRepository {
  constructor(
    @InjectRepository(FornecedorEntity)
    private readonly repository: Repository<FornecedorEntity>,
  ) {}

  async buscarTodos() {
    return await this.repository.find({ relations: ['endereco'] });
  }

  async buscarPorId(id: string) {
    return await this.repository.findOne({
      where: { id },
      relations: ['endereco'],
    });
  }

  async buscarPorCnpj(cnpj: string) {
    return await this.repository.findOneBy({ cnpj });
  }

  async buscarPorEmail(email: string) {
    return await this.repository.findOneBy({ email });
  }

  async salvarFornecedor(dados: Partial<FornecedorEntity>) {
    const fornecedor = this.repository.create({
      ...dados,
      id: dados.id || uuid(),
    });
    return await this.repository.save(fornecedor);
  }

  async deletarFornecedor(id: string) {
    return await this.repository.delete(id);
  }
}
