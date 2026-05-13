import { z } from 'zod';

export const createFornecedorSchema = z.object({
  nome: z.string().min(3).max(100),
  cnpj: z.string().min(14).max(18),
  telefone: z.string().min(10).max(20),
  email: z.string().email(),
  endereco: z.object({
    rua: z.string().min(3).max(100),
    numero: z.string().max(10),
    bairro: z.string().min(3).max(60),
    cidade: z.string().min(3).max(60),
    estado: z.string().length(2),
    cep: z.string().min(8).max(10),
  }).optional(),
}).strict();

export const updateFornecedorSchema = createFornecedorSchema.partial();

export const filtroFornecedorSchema = z.object({
  nome: z.string().optional(),
  cnpj: z.string().optional(),
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)).optional(),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(100).default(10)).optional(),
});
