import { z } from 'zod';
import { StatusVenda } from '../entities/Venda.entity';
import { TipoPagamento } from '../entities/Pagamento.entity';

export const itemVendaSchema = z.object({
  produto_id: z.string().uuid(),
  quantidade: z.number().int().positive(),
});

export const pagamentoVendaSchema = z.object({
  tipo: z.nativeEnum(TipoPagamento),
  valor_pago: z.number().positive(),
});

export const createVendaSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  usuario_id: z.string().uuid(),
}).strict();

export const adicionarItemSchema = itemVendaSchema;

export const aplicarDescontoSchema = z.object({
  desconto: z.number().min(0),
});

export const registrarPagamentoSchema = pagamentoVendaSchema;

export const filtroVendaSchema = z.object({
  cliente_id: z.string().optional(),
  status: z.nativeEnum(StatusVenda).optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
}).partial();
