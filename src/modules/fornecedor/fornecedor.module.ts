import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoEntity, FornecedorEntity } from 'src/domain/entities';
import { FornecedorController } from './fornecedor.controller';
import { FornecedorService } from './fornecedor.service';
import { FornecedorRepository } from './repositories/fornecedor.repository';
import { EnderecoRepository } from '../endereco/repositories/endereco.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FornecedorEntity, EnderecoEntity])],
  controllers: [FornecedorController],
  providers: [FornecedorService, FornecedorRepository, EnderecoRepository],
  exports: [FornecedorService],
})
export class FornecedorModule {}
