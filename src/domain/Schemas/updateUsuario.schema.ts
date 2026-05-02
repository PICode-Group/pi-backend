import { z } from 'zod';

export const updateUsuarioSchema = z.object({
  nome: z.string({ message: ' O nome deve ser uma string ' }).max(100),
});
