import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoEntity } from 'src/domain/entities';
import { EnderecoController } from 'src/http/endereco/endereco.controller';
import { EnderecoService } from 'src/http/endereco/endereco.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnderecoEntity])],
  controllers: [EnderecoController],
  providers: [EnderecoService],
  exports: [EnderecoService],
})
export class EnderecoModule {}
