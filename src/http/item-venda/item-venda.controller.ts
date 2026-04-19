import { Controller } from '@nestjs/common';
import { ItemVendaService } from 'src/http/item-venda/item-venda.service';

@Controller('itens-venda')
export class ItemVendaController {
  constructor(private readonly itemVendaService: ItemVendaService) {}
}
