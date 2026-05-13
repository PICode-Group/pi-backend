import { z } from 'zod';

export const loginSchema = z
  .object({
    login: z.email(),
    senha: z.string(),
  })
  .strict();
