import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VendaService } from './venda.service';
import { 
  CreateVendaDto, 
  AdicionarItemDto, 
  AplicarDescontoDto, 
  RegistrarPagamentoDto, 
  FiltroVendaDto,
  VendaDiretaDto,
  VendaResponseDto,
  PaginatedVendaResponseDto 
} from 'src/domain/DTOs/Venda.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Vendas')
@Controller('vendas')
@UseGuards(JwtAuthGuard)
export class VendaController {
  constructor(private readonly service: VendaService) {}

  @Get()
  @ZodSerializerDto(PaginatedVendaResponseDto)
  @ApiOperation({ summary: 'Listar todas as vendas com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de vendas retornada com sucesso' })
  async listar(@Query() filtros: FiltroVendaDto) {
    return await this.service.listar(filtros);
  }

  @Get(':id')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Buscar dados completos de uma venda' })
  @ApiResponse({ status: 200, description: 'Dados da venda retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  async buscarCompleta(@Param('id') id: string) {
    return await this.service.buscarPorId(id);
  }

  @Post()
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Abrir uma nova venda (O vendedor é o usuário logado)' })
  @ApiResponse({ status: 201, description: 'Venda aberta com sucesso' })
  async abrir(@Body() dados: CreateVendaDto, @Request() req: any) {
    const usuarioId = req.user.userId;
    return await this.service.abrirVenda(dados, usuarioId);
  }

  @Post('direta')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Realizar uma venda completa em um único passo' })
  @ApiResponse({ status: 201, description: 'Venda realizada e estoque baixado' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente ou erro no pagamento' })
  async vendaDireta(@Body() dados: VendaDiretaDto, @Request() req: any) {
    const usuarioId = req.user.userId;
    return await this.service.vendaDireta(dados, usuarioId);
  }

  @Post(':id/itens')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Adicionar produto à venda' })
  @ApiResponse({ status: 201, description: 'Item adicionado e total atualizado' })
  @ApiResponse({ status: 400, description: 'Venda não está aberta ou estoque insuficiente' })
  async adicionarItem(@Param('id') id: string, @Body() dados: AdicionarItemDto) {
    return await this.service.adicionarItem(id, dados);
  }

  @Delete(':id/itens/:itemId')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Remover produto da venda' })
  @ApiResponse({ status: 200, description: 'Item removido e total atualizado' })
  async removerItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return await this.service.removerItem(id, itemId);
  }

  @Patch(':id/desconto')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Aplicar desconto na venda' })
  @ApiResponse({ status: 200, description: 'Desconto aplicado com sucesso' })
  @ApiResponse({ status: 400, description: 'Desconto inválido' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async aplicarDesconto(@Param('id') id: string, @Body() dados: AplicarDescontoDto) {
    return await this.service.aplicarDesconto(id, dados);
  }

  @Post(':id/pagamentos')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Registrar pagamento da venda' })
  @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro no pagamento' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async registrarPagamento(@Param('id') id: string, @Body() dados: RegistrarPagamentoDto) {
    return await this.service.registrarPagamento(id, dados);
  }

  @Post(':id/finalizar')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Finalizar venda e baixar estoque' })
  @ApiResponse({ status: 200, description: 'Venda finalizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Pagamentos insuficientes ou erro de estoque' })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async finalizar(@Param('id') id: string) {
    return await this.service.finalizarVenda(id);
  }

  @Post(':id/cancelar')
  @ZodSerializerDto(VendaResponseDto)
  @ApiOperation({ summary: 'Cancelar venda e devolver estoque' })
  @ApiResponse({ status: 200, description: 'Venda cancelada com sucesso' })
  async cancelar(@Param('id') id: string) {
    return await this.service.cancelarVenda(id);
  }
}
