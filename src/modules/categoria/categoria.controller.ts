import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto, UpdateCategoriaDto, FindAllCategoriaDto } from './dto/categoria.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria cadastrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Categoria com este nome já existe' })
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return await this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada' })
  async findAll(@Query() query: FindAllCategoriaDto) {
    return await this.categoriaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(@Param('id') id: string) {
    const categoria = await this.categoriaService.findOne(+id);
    if (!categoria) throw new NotFoundException('Categoria não encontrada');
    return categoria;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return await this.categoriaService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async remove(@Param('id') id: string) {
    return await this.categoriaService.remove(+id);
  }
}
