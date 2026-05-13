import { createZodDto } from 'nestjs-zod';
import { updateEmpresaSchema } from '../schemas/update-empresa.schema';

export class UpdateEmpresaDto extends createZodDto(updateEmpresaSchema) {}
