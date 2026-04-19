import { Controller } from '@nestjs/common';
import { VendaService } from 'src/http/venda/venda.service';

@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}
}
