import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { StatusUsuario, TipoUsuario, UsuarioEntity } from 'src/domain/entities';
import { UsuarioRepository } from '../usuario/repositories/usuario.repository';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const usuario = await this.usuarioRepository.findUserByEmail(
      loginDto.login,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaValida = await usuario.validatePassword(loginDto.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Senha incorreta');
    }

    if (usuario.status == StatusUsuario.INATIVO) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const { senha: _, ...result } = usuario;
    return result;
  }

  login(usuario: UsuarioEntity, response: Response) {
    const payload = {
      email: usuario.login,
      sub: usuario.id,
      nome: usuario.nome,
      role: usuario.tipo,
    };

    const token = this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    response.json({
      message: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        email: usuario.login,
        nome: usuario.nome,
        role: usuario.tipo,
      },
    });
  }

  logout(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    response.json({
      message: 'Logout realizado com sucesso',
    });
  }

  async createUser(
    userData: RegisterDto | CreateUsuarioDto,
    requestingUserRole?: TipoUsuario,
  ) {
    const newUser = { ...userData } as CreateUsuarioDto;

    if (requestingUserRole !== TipoUsuario.ADMIN) {
      newUser.tipo = TipoUsuario.VENDEDOR;
    }

    return await this.usuarioRepository.registrarUsuario(newUser);
  }
}
