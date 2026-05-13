import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoEntity } from 'src/domain/entities';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';
import { EnderecoRepository } from './repositories/endereco.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnderecoEntity])],
  controllers: [EnderecoController],
  providers: [EnderecoService, EnderecoRepository],
  exports: [EnderecoService, EnderecoRepository],
})
export class EnderecoModule {}
