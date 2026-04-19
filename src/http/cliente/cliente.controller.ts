import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';
//todo: organização de clientes
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  getAllClientes() {
    return this.clienteService.GetAllClientes();
  }
}
