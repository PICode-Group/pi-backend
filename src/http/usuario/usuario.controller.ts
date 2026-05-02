import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from 'src/domain/DTOs/Usuario.dto';
import { UsuarioService } from 'src/http/usuario/usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':id')
  getUser(@Param(' id ') userId: string) {
    return this.usuarioService.getUserById(userId);
  }

  @Post()
  async createUser(@Body() createUsuarioDto: CreateUsuarioDto) {
    const user = await this.usuarioService.createUsuario(createUsuarioDto);
    if (!user) {
      throw new BadRequestException();
    }
    return { message: ' Usuário criado com sucesso!' };
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() usuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioAtualizado = await this.usuarioService.updateUser(
      userId,
      usuarioDto,
    );

    return usuarioAtualizado;
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const usuarioAtualizado = await this.usuarioService.deleteUserById(userId);

    return { mensagem: `Usuário ${usuarioAtualizado} deletado com sucesso` };
  }
}
