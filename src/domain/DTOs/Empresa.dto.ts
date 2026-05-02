import { createZodDto } from 'nestjs-zod';
import { updateEmpresaSchema } from '../Schemas/updateEmpresaDto.schema';

export class UpdateEmpresaDto extends createZodDto(updateEmpresaSchema) {}
