import { Controller } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';

@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}
}
