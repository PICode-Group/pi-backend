import { z } from 'zod';

export const createCategoriaSchema = z.object({
  nome: z.string().min(2).max(80),
}).strict();

export const updateCategoriaSchema = createCategoriaSchema.partial();
