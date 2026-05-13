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
} from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { TipoUsuario } from 'src/domain/entities';

@ApiTags('Usuários')
@Controller('usuarios')
@Roles(TipoUsuario.ADMIN)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  getUser(@Param('id') userId: string) {
    return this.usuarioService.getUserById(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso!' })
  @ApiResponse({ status: 400, description: 'Erro na criação do usuário' })
  async createUser(@Body() createUsuarioDto: CreateUsuarioDto) {
    const user = await this.usuarioService.createUsuario(createUsuarioDto);
    if (!user) {
      throw new BadRequestException();
    }
    return { message: ' Usuário criado com sucesso!' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
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
  @ApiOperation({ summary: 'Remover (Inativar) um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  async deleteUser(@Param('id') userId: string) {
    const usuarioAtualizado = await this.usuarioService.deleteUserById(userId);

    return { mensagem: `Usuário ${usuarioAtualizado} deletado com sucesso` };
  }
}
