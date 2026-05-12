import { z } from 'zod';
import { TipoEntrada } from '../entities/EntradaEstoque.entity';

export const itemEntradaSchema = z.object({
  produto_id: z.string().uuid(),
  quantidade: z.number().int().positive(),
  preco_custo: z.number().positive(),
});

export const createEntradaEstoqueSchema = z.object({
  fornecedor_id: z.string().uuid().optional(),
  usuario_id: z.string().uuid(),
  tipo: z.nativeEnum(TipoEntrada).default(TipoEntrada.COMPRA),
  observacao: z.string().max(200).optional(),
  itens: z.array(itemEntradaSchema).min(1),
}).strict();

export const filtroEntradaSchema = z.object({
  fornecedor_id: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  tipo: z.nativeEnum(TipoEntrada).optional(),
}).partial();
