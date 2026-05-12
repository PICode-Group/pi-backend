import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/domain/entities';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioRepository } from './repositories/usuario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
  exports: [UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}
