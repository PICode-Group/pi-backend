import { Controller } from '@nestjs/common';
import { ProdutoService } from 'src/http/produto/produto.service';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}
}
