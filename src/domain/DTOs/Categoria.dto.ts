import { createZodDto } from 'nestjs-zod';
import { createCategoriaSchema, updateCategoriaSchema } from '../Schemas/categoria.schema';

export class CreateCategoriaDto extends createZodDto(createCategoriaSchema) {}
export class UpdateCategoriaDto extends createZodDto(updateCategoriaSchema) {}
