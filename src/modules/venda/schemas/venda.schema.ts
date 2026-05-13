import { z } from 'zod';
import { StatusVenda, TipoPagamento } from 'src/domain/entities';

export const itemVendaSchema = z.object({
  produto_id: z.string().uuid(),
  quantidade: z.number().int().positive(),
});

export const pagamentoVendaSchema = z.object({
  tipo: z.nativeEnum(TipoPagamento),
  valor_pago: z.number().positive(),
});

export const createVendaSchema = z.object({
  cliente_id: z.preprocess((val) => (val ? val : undefined), z.string().uuid().optional()),
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

export const vendaDiretaSchema = z.object({
  cliente_id: z.preprocess((val) => (val ? val : undefined), z.string().uuid().optional()),
  itens: z.array(itemVendaSchema).min(1),
  pagamento: pagamentoVendaSchema,
  desconto: z.number().min(0).optional().default(0),
});

export const vendaResponseSchema = z.object({
  id: z.string().uuid(),
  data_venda: z.date(),
  valor_total: z.preprocess((val) => Number(val), z.number()),
  desconto: z.preprocess((val) => Number(val), z.number()),
  status: z.nativeEnum(StatusVenda),
  cliente: z.object({
    id: z.string(),
    nome: z.string(),
    cpf: z.string(),
  }).nullable().optional(),
  usuario: z.object({
    id: z.string(),
    nome: z.string(),
  }),
  itensVenda: z.array(z.object({
    id: z.string(),
    quantidade: z.number(),
    preco_unitario: z.preprocess((val) => Number(val), z.number()),
    subtotal: z.preprocess((val) => Number(val), z.number()),
    produto: z.object({
      id: z.string(),
      nome: z.string(),
      codigo_barras: z.string(),
    }),
  })),
  pagamentos: z.array(z.object({
    id: z.string(),
    tipo: z.nativeEnum(TipoPagamento),
    valor_pago: z.preprocess((val) => Number(val), z.number()),
    data_pagamento: z.date(),
  })),
});

export const paginatedVendaResponseSchema = z.object({
  data: z.array(vendaResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    lastPage: z.number(),
  }),
});
