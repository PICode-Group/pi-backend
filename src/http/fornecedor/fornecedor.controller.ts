import { Controller } from '@nestjs/common';
import { FornecedorService } from 'src/http/fornecedor/fornecedor.service';

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}
}
