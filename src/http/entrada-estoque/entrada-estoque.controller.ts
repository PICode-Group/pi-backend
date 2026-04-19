import { Controller } from '@nestjs/common';
import { EntradaEstoqueService } from 'src/http/entrada-estoque/entrada-estoque.service';

@Controller('entradas-estoque')
export class EntradaEstoqueController {
  constructor(private readonly entradaEstoqueService: EntradaEstoqueService) {}
}
