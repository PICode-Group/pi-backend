import { Controller } from '@nestjs/common';
import { EnderecoService } from './endereco.service';

@Controller('enderecos')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}
}
