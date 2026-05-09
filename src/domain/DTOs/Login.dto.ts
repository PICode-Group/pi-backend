import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '../Schemas/login.schema';

export class LoginDto extends createZodDto(loginSchema) {}
