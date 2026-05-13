import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(ClienteEntity)
    private clienteRepository: Repository<ClienteEntity>,
  ) {}

  findAll() {
    return this.clienteRepository.find();
  }
}
