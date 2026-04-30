import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
      @InjectRepository(ClienteEntity)
      private readonly clientesRepository: Repository<ClienteEntity>,
    ) {}

   async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  findAll() {
    return this.clientesRepository.find();
  }

  findOne(id: number) {
    return this.clientesRepository.findBy({id});
  }

  update(id: number, UpdateClienteDto: UpdateClienteDto) {
    return 
  }

  remove(id: number) {
    return this.clientesRepository.delete(id);
  }
}