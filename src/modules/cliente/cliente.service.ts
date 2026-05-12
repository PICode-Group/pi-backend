import { Injectable } from '@nestjs/common';

import { ClienteRepository } from './repositories/cliente.repository';

@Injectable()
export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
  ) {}

  GetAllClientes() {
    return this.clienteRepository.findAll();
  }
}
