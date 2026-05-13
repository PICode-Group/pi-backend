import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioRepository } from '../usuario/repositories/usuario.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/domain/entities';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { LocalStrategy } from './strategies/local.strategies';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
  imports: [
    UsuarioModule,
    TypeOrmModule.forFeature([UsuarioEntity]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
