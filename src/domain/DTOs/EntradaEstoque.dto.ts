import { createZodDto } from 'nestjs-zod';
import { createEntradaEstoqueSchema, filtroEntradaSchema } from '../Schemas/entrada-estoque.schema';

export class CreateEntradaEstoqueDto extends createZodDto(createEntradaEstoqueSchema) {}
export class FiltroEntradaDto extends createZodDto(filtroEntradaSchema) {}
