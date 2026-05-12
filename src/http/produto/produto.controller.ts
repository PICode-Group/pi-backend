import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto, UpdateProdutoDto, FiltroProdutoDto } from 'src/domain/DTOs/Produto.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async listar(@Query() filtros: FiltroProdutoDto) {
    return await this.produtoService.listar(filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async buscar(@Param('id') id: string) {
    return await this.produtoService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Código de barras já cadastrado' })
  async criar(@Body() dados: CreateProdutoDto) {
    return await this.produtoService.criar(dados);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de um produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async atualizar(@Param('id') id: string, @Body() dados: UpdateProdutoDto) {
    return await this.produtoService.atualizar(id, dados);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remover(@Param('id') id: string) {
    return await this.produtoService.remover(id);
  }

  @Post(':id/imagem')
  @ApiOperation({ summary: 'Fazer upload da imagem do produto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo não enviado ou inválido' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadImagem(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    return await this.produtoService.atualizarImagem(id, file.path);
  }

  @Get(':id/estoque')
  @ApiOperation({ summary: 'Consultar estoque atual de um produto' })
  @ApiResponse({ status: 200, description: 'Informações de estoque retornadas' })
  async consultarEstoque(@Param('id') id: string) {
    return await this.produtoService.consultarEstoque(id);
  }
}
