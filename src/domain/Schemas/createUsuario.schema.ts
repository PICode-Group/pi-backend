import { z } from 'zod';
import { StatusUsuario, TipoUsuario } from '../entities';

export const createUsuarioSchema = z
  .object({
    nome: z.string({ message: ' O nome deve ser uma string!' }).min(3).max(100),
    login: z
      .email({ message: 'O email precisa ser um válido!' })
      .min(5)
      .max(50),
    senha: z.string().min(8).max(255),
    tipo: z.enum(TipoUsuario).default(TipoUsuario.VENDEDOR),
    status: z.enum(StatusUsuario).default(StatusUsuario.ATIVO),
  })
  .strict();
