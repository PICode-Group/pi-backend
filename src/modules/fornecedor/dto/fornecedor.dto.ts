import { createZodDto } from 'nestjs-zod';
import { createFornecedorSchema, updateFornecedorSchema, filtroFornecedorSchema } from '../schemas/fornecedor.schema';

export class CreateFornecedorDto extends createZodDto(createFornecedorSchema) {}
export class UpdateFornecedorDto extends createZodDto(updateFornecedorSchema) {}
export class FiltroFornecedorDto extends createZodDto(filtroFornecedorSchema) {}
