// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators/public.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UsuarioService } from '../usuario/usuario.service';
import type { Response } from 'express';
import { TipoUsuario, UsuarioEntity } from 'src/domain/entities';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário e realizar login automático' })
  @ApiResponse({ status: 201, description: 'Usuário registrado e logado' })
  async register(@Body() body: RegisterDto, @Res() response: Response) {
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
  @ApiOperation({ summary: 'Realizar login e receber cookie JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() body: LoginDto, @Res() response: Response) {
    const usuario = await this.authService.validateUser(body);
    return this.authService.login(usuario, response);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Realizar logout (limpar cookie JWT)' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  logout(@Res() response: Response) {
    return this.authService.logout(response);
  }

  @Roles(TipoUsuario.ADMIN)
  @Post('create-admin')
  @ApiOperation({ summary: 'Criar um novo usuário ADMIN (Apenas para ADMINs)' })
  @ApiResponse({ status: 201, description: 'Admin criado com sucesso' })
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
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Dados do perfil e permissões' })
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
