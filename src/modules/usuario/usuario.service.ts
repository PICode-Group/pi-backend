import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from './dto/usuario.dto';
import { StatusUsuario } from 'src/domain/entities';
import { UsuarioRepository } from './repositories/usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async getUserById(userId: string) {
    const user = await this.usuarioRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    const existingUser = await this.usuarioRepository.findUserByEmail(
      createUsuarioDto.login,
    );

    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email');
    }

    return this.usuarioRepository.registrarUsuario(createUsuarioDto);
  }

  async deleteUserById(id: string) {
    const user = await this.getUserById(id);

    if (user.status.includes(StatusUsuario.INATIVO)) {
      throw new NotFoundException('Usuário já foi excluído!');
    }

    return this.usuarioRepository.deleteUser(user);
  }

  async updateUser(usuarioId: string, usuarioDto: UpdateUsuarioDto) {
    const usuario = await this.getUserById(usuarioId);

    Object.assign(usuario, usuarioDto);

    return this.usuarioRepository.updateUsuario(usuario);
  }
}
