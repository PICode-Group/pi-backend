import { Controller } from '@nestjs/common';
import { UsuarioService } from 'src/http/usuario/usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
}
