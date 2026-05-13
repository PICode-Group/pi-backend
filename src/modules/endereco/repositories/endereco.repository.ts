import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EnderecoRepository {
  constructor(
    @InjectRepository(EnderecoEntity)
    private readonly repository: Repository<EnderecoEntity>,
  ) {}

  async criarEndereco(dados: Partial<EnderecoEntity>) {
    const endereco = this.repository.create({
      ...dados,
      id: uuid(),
    });
    return await this.repository.save(endereco);
  }

  async buscarPorId(id: string) {
    return await this.repository.findOneBy({ id });
  }
}
