import { z } from 'zod';

export const createProdutoSchema = z.object({
  nome: z.string().min(3).max(100),
  descricao: z.string().min(3),
  codigo_barras: z.string().min(8).max(50),
  categoria_id: z.number().optional(),
  preco_custo: z.number().positive(),
  preco_venda: z.number().positive(),
  estoque_inicial: z.number().int().min(0).default(0),
  estoque_minimo: z.number().int().min(0).default(5),
  imagem: z.string().optional(),
}).strict();

export const updateProdutoSchema = createProdutoSchema.partial();

export const filtroProdutoSchema = z.object({
  nome: z.string().optional(),
  categoria_id: z.string().optional(), // Query params come as strings
  estoque_baixo: z.enum(['true', 'false']).optional(),
  codigo_barras: z.string().optional(),
}).partial();
