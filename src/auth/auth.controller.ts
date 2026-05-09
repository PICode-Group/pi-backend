// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUsuarioDto } from 'src/domain/DTOs/Usuario.dto';
import { LoginDto } from 'src/domain/DTOs/Login.dto';
import { UsuarioService } from 'src/http/usuario/usuario.service';
import type { Response } from 'express';
import { TipoUsuario, UsuarioEntity } from 'src/domain/entities';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUsuarioDto, @Res() response: Response) {
    try {
      const usuario = await this.authService.createUser(body);
      this.authService.login(usuario, response);
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao criar usuário',
        error: error.message,
      });
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Res() response: Response) {
    const usuario = await this.authService.validateUser(body);
    return this.authService.login(usuario, response);
  }

  @Post('logout')
  logout(@Res() response: Response) {
    return this.authService.logout(response);
  }

  // Versão final limpa
  @Roles(TipoUsuario.ADMIN)
  @Post('create-admin')
  async createAdmin(@Body() body: CreateUsuarioDto, @Res() response: Response) {
    const usuario = await this.usuarioService.createUsuario(body);

    return response.json({
      message: 'Admin criado com sucesso',
      usuario: {
        id: usuario.id,
        email: usuario.login,
        nome: usuario.nome,
        role: usuario.tipo,
      },
    });
  }

  @Get('me')
  getProfile(@CurrentUser() user: UsuarioEntity) {
    return {
      user: user,
      permissions: this.getUserPermissions(user.tipo),
    };
  }

  private getUserPermissions(role: TipoUsuario) {
    const permissions = {
      [TipoUsuario.ADMIN]: [
        'create_user',
        'delete_user',
        'update_user',
        'view_all_reports',
        'manage_products',
        'manage_sales',
        'view_dashboard',
      ],
      [TipoUsuario.VENDEDOR]: [
        'create_sale',
        'view_own_sales',
        'view_products',
        'update_own_profile',
      ],
    };

    return permissions[role] || [];
  }
}
