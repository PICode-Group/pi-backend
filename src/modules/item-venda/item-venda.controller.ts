import { Controller } from '@nestjs/common';
import { ItemVendaService } from './item-venda.service';

@Controller('itens-venda')
export class ItemVendaController {
  constructor(private readonly itemVendaService: ItemVendaService) {}
}
