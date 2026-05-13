/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '../../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUsuarioDto } from '../dto/usuario.dto';
import { StatusUsuario, UsuarioEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findUserById(id: string) {
    return await this.usuarioRepository.findOneBy({ id });
  }

  async registrarUsuario(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    await this.usuarioRepository.save(usuario);

    return usuario;
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const usuario = await this.findUserByEmail(loginDto.login);

    if (usuario && (await usuario.validatePassword(loginDto.senha))) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async deleteUser(usuario: UsuarioEntity) {
    const usuarioAtualizado = await this.usuarioRepository.update(usuario.id, {
      status: StatusUsuario.INATIVO,
    });

    if (usuarioAtualizado.affected === 0) {
      throw new BadRequestException(
        'Não foi possível atualizar usuário a partir das informações fornecidas!',
      );
    }

    return usuario.nome;
  }

  async updateUsuario(usuario: UsuarioEntity) {
    const user = await this.usuarioRepository.save(usuario);

    return user;
  }

  async findUserByEmail(userEmail: string) {
    return await this.usuarioRepository.findOne({ where: { login: userEmail } });
  }
}
