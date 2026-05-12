import { createZodDto } from 'nestjs-zod';
import { createCategoriaSchema, updateCategoriaSchema, findAllCategoriaSchema } from '../schemas/categoria.schema';

export class CreateCategoriaDto extends createZodDto(createCategoriaSchema) {}
export class UpdateCategoriaDto extends createZodDto(updateCategoriaSchema) {}
export class FindAllCategoriaDto extends createZodDto(findAllCategoriaSchema) {}
