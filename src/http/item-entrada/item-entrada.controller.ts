import { Controller } from '@nestjs/common';
import { ItemEntradaService } from 'src/http/item-entrada/item-entrada.service';

@Controller('itens-entrada')
export class ItemEntradaController {
  constructor(private readonly itemEntradaService: ItemEntradaService) {}
}
