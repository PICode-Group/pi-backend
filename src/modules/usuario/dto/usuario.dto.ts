import { createZodDto } from 'nestjs-zod';
import { updateUsuarioSchema } from '../schemas/update-usuario.schema';
import { createUsuarioSchema } from '../schemas/create-usuario.schema';

export class UpdateUsuarioDto extends createZodDto(updateUsuarioSchema) {}

export class CreateUsuarioDto extends createZodDto(createUsuarioSchema) {}
