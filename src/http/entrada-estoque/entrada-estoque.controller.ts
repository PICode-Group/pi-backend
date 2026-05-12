import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EntradaEstoqueService } from './entrada-estoque.service';
import { CreateEntradaEstoqueDto, FiltroEntradaDto } from 'src/domain/DTOs/EntradaEstoque.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Estoque')
@Controller('entradas-estoque')
export class EntradaEstoqueController {
  constructor(private readonly service: EntradaEstoqueService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as entradas de estoque' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso' })
  async listar(@Query() filtros: FiltroEntradaDto) {
    return await this.service.listar(filtros);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar nova entrada de estoque' })
  @ApiResponse({ status: 201, description: 'Entrada registrada e estoque atualizado' })
  async registrar(@Body() dados: CreateEntradaEstoqueDto) {
    return await this.service.registrarEntrada(dados);
  }

  @Get('produto/:id/movimentacoes')
  @ApiOperation({ summary: 'Consultar histórico de movimentações de um produto' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  async buscarMovimentacoes(@Param('id') id: string) {
    return await this.service.consultarMovimentacoes(id);
  }
}
