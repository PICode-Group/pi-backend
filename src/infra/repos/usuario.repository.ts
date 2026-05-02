import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from 'src/domain/DTOs/Usuario.dto';
import { StatusUsuario, UsuarioEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

export class UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findUserById(id: string) {
    return await this.usuarioRepository.findOneBy({ id });
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    const user = this.usuarioRepository.create(createUsuarioDto);

    await this.usuarioRepository.save(user);

    return user;
  }

  async deleteUser(usuario: UsuarioEntity) {
    const usuarioAtualizado = await this.usuarioRepository.update(usuario.id, {
      status: StatusUsuario.INATIVO,
    });

    if (usuarioAtualizado.affected < 0) {
      throw new BadRequestException(
        'Não foi possível atualizar usuário apartir das informações fornecidas!',
      );
    }

    return usuario.nome;
  }

  async updateUsuario(usuario: UsuarioEntity) {
    const user = await this.usuarioRepository.save(usuario);

    return user;
  }

  async findUserByEmail(userEmail: string) {
    return this.usuarioRepository.findOne({ where: { login: userEmail } });
  }
}
