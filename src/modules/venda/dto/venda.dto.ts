import { createZodDto } from 'nestjs-zod';
import { 
  createVendaSchema, 
  adicionarItemSchema, 
  aplicarDescontoSchema, 
  registrarPagamentoSchema,
  filtroVendaSchema,
  vendaDiretaSchema,
  vendaResponseSchema,
  paginatedVendaResponseSchema 
} from '../schemas/venda.schema';

export class CreateVendaDto extends createZodDto(createVendaSchema) {}
export class AdicionarItemDto extends createZodDto(adicionarItemSchema) {}
export class AplicarDescontoDto extends createZodDto(aplicarDescontoSchema) {}
export class RegistrarPagamentoDto extends createZodDto(registrarPagamentoSchema) {}
export class FiltroVendaDto extends createZodDto(filtroVendaSchema) {}
export class VendaDiretaDto extends createZodDto(vendaDiretaSchema) {}
export class VendaResponseDto extends createZodDto(vendaResponseSchema) {}
export class PaginatedVendaResponseDto extends createZodDto(paginatedVendaResponseSchema) {}
