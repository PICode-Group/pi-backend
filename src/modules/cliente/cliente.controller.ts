import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso' })
  async listar() {
    return await this.clienteService.GetAllClientes();
  }
}
