import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/domain/entities';
import { UsuarioController } from 'src/http/usuario/usuario.controller';
import { UsuarioService } from 'src/http/usuario/usuario.service';
import { UsuarioRepository } from 'src/infra/repos/usuario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
  exports: [UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}
