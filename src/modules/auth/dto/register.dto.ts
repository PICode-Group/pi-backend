import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerSchema = z
  .object({
    nome: z.string({ message: ' O nome deve ser uma string!' }).min(3).max(100),
    login: z
      .email({ message: 'O email precisa ser um válido!' })
      .min(5)
      .max(50),
    senha: z.string().min(8).max(255),
  })
  .strict();

export class RegisterDto extends createZodDto(registerSchema) {}
