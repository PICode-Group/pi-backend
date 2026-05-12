import { createZodDto } from 'nestjs-zod';
import { createProdutoSchema, updateProdutoSchema, filtroProdutoSchema } from '../Schemas/produto.schema';

export class CreateProdutoDto extends createZodDto(createProdutoSchema) {}
export class UpdateProdutoDto extends createZodDto(updateProdutoSchema) {}
export class FiltroProdutoDto extends createZodDto(filtroProdutoSchema) {}
