import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { CreateFornecedorDto, UpdateFornecedorDto, FiltroFornecedorDto } from './dto/fornecedor.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Fornecedores')
@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Get()
  @ApiOperation({ summary: 'Listar fornecedores com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de fornecedores paginada retornada com sucesso' })
  async listar(@Query() filtros: FiltroFornecedorDto) {
    return await this.fornecedorService.listar(filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fornecedor por ID' })
  @ApiResponse({ status: 200, description: 'Fornecedor encontrado' })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado' })
  async buscar(@Param('id') id: string) {
    return await this.fornecedorService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo fornecedor' })
  @ApiResponse({ status: 201, description: 'Fornecedor cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'CNPJ ou Email já cadastrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async criar(@Body() dados: CreateFornecedorDto) {
    return await this.fornecedorService.criar(dados);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de um fornecedor' })
  @ApiResponse({ status: 200, description: 'Fornecedor atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Fornecedor não encontrado' })
  async atualizar(@Param('id') id: string, @Body() dados: UpdateFornecedorDto) {
    return await this.fornecedorService.atualizar(id, dados);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um fornecedor' })
  @ApiResponse({ status: 200, description: 'Fornecedor removido com sucesso' })
  async remover(@Param('id') id: string) {
    return await this.fornecedorService.remover(id);
  }
}
