import { createZodDto } from 'nestjs-zod';
import { createFornecedorSchema, updateFornecedorSchema } from '../Schemas/fornecedor.schema';

export class CreateFornecedorDto extends createZodDto(createFornecedorSchema) {}
export class UpdateFornecedorDto extends createZodDto(updateFornecedorSchema) {}
