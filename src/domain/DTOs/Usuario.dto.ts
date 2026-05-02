import { createZodDto } from 'nestjs-zod';
import { updateUsuarioSchema } from '../Schemas/updateUsuario.schema';
import { createUsuarioSchema } from '../Schemas/createUsuario.schema';

export class UpdateUsuarioDto extends createZodDto(updateUsuarioSchema) {}

export class CreateUsuarioDto extends createZodDto(createUsuarioSchema) {}
