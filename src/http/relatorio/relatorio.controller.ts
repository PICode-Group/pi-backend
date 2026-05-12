import { Controller, Get, UseGuards } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TipoUsuario } from 'src/auth/enums/tipo-usuario.enum';

@ApiTags('Relatórios')
@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Get('estoque-baixo')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.VENDEDOR)
  @ApiOperation({ summary: 'Listar produtos com estoque igual ou abaixo do mínimo' })
  @ApiResponse({ status: 200, description: 'Relatório de estoque baixo retornado com sucesso' })
  async estoqueBaixo() {
    return await this.relatorioService.obterEstoqueBaixo();
  }

  @Get('vendas-periodo')
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Resumo de faturamento diário (Apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Relatório de faturamento retornado com sucesso' })
  async vendasPeriodo() {
    return await this.relatorioService.obterVendasPeriodo();
  }

  @Get('produtos-mais-vendidos')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.VENDEDOR)
  @ApiOperation({ summary: 'Ranking de produtos por volume de vendas' })
  @ApiResponse({ status: 200, description: 'Ranking de produtos retornado com sucesso' })
  async produtosMaisVendidos() {
    return await this.relatorioService.obterProdutosMaisVendidos();
  }

  @Get('performance-vendedores')
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Ranking de performance da equipe de vendas (Apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Relatório de vendedores retornado com sucesso' })
  async performanceVendedores() {
    return await this.relatorioService.obterPerformanceVendedores();
  }
}
