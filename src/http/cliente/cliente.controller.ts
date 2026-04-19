import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  getAllClientes() {
    return 'clientes funcionando!';
  }
}
