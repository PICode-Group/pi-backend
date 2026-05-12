import { createZodDto } from 'nestjs-zod';
import { 
  createVendaSchema, 
  adicionarItemSchema, 
  aplicarDescontoSchema, 
  registrarPagamentoSchema,
  filtroVendaSchema 
} from '../Schemas/venda.schema';

export class CreateVendaDto extends createZodDto(createVendaSchema) {}
export class AdicionarItemDto extends createZodDto(adicionarItemSchema) {}
export class AplicarDescontoDto extends createZodDto(aplicarDescontoSchema) {}
export class RegistrarPagamentoDto extends createZodDto(registrarPagamentoSchema) {}
export class FiltroVendaDto extends createZodDto(filtroVendaSchema) {}
