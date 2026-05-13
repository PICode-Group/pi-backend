import { z } from 'zod';

export const updateEmpresaSchema = z.object({
  nome_fantasia: z
    .string({ message: ' O nome fantasia deve ser uma string ' })
    .max(100),
  razao_social: z.string().max(120),
  cnpj: z.string().max(18),
  telefone: z.string().max(20),
  email: z.email(),
});
