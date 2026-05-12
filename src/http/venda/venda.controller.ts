import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VendaService } from './venda.service';
import { 
  CreateVendaDto, 
  AdicionarItemDto, 
  AplicarDescontoDto, 
  RegistrarPagamentoDto, 
  FiltroVendaDto 
} from 'src/domain/DTOs/Venda.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly service: VendaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de vendas retornada com sucesso' })
  async listar(@Query() filtros: FiltroVendaDto) {
    return await this.service.listar(filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar dados completos de uma venda' })
  @ApiResponse({ status: 200, description: 'Dados da venda retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  async buscarCompleta(@Param('id') id: string) {
    return await this.service.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Abrir uma nova venda' })
  @ApiResponse({ status: 201, description: 'Venda aberta com sucesso' })
  async abrir(@Body() dados: CreateVendaDto) {
    return await this.service.abrirVenda(dados);
  }

  @Post(':id/itens')
  @ApiOperation({ summary: 'Adicionar produto à venda' })
  @ApiResponse({ status: 201, description: 'Item adicionado e total atualizado' })
  @ApiResponse({ status: 400, description: 'Venda não está aberta ou estoque insuficiente' })
  async adicionarItem(@Param('id') id: string, @Body() dados: AdicionarItemDto) {
    return await this.service.adicionarItem(id, dados);
  }

  @Delete(':id/itens/:itemId')
  @ApiOperation({ summary: 'Remover produto da venda' })
  @ApiResponse({ status: 200, description: 'Item removido e total atualizado' })
  async removerItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return await this.service.removerItem(id, itemId);
  }

  @Patch(':id/desconto')
  @ApiOperation({ summary: 'Aplicar desconto na venda' })
  @ApiResponse({ status: 200, description: 'Desconto aplicado com sucesso' })
  @ApiResponse({ status: 400, description: 'Desconto inválido' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async aplicarDesconto(@Param('id') id: string, @Body() dados: AplicarDescontoDto) {
    return await this.service.aplicarDesconto(id, dados);
  }

  @Post(':id/pagamentos')
  @ApiOperation({ summary: 'Registrar pagamento da venda' })
  @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro no pagamento' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async registrarPagamento(@Param('id') id: string, @Body() dados: RegistrarPagamentoDto) {
    return await this.service.registrarPagamento(id, dados);
  }

  @Post(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar venda e baixar estoque' })
  @ApiResponse({ status: 200, description: 'Venda finalizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Pagamentos insuficientes ou erro de estoque' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async finalizar(@Param('id') id: string) {
    return await this.service.finalizarVenda(id);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar venda e devolver estoque' })
  @ApiResponse({ status: 200, description: 'Venda cancelada com sucesso' })
  async cancelar(@Param('id') id: string) {
    return await this.service.cancelarVenda(id);
  }
}
