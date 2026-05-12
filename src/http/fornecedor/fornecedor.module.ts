import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoEntity, FornecedorEntity } from 'src/domain/entities';
import { FornecedorController } from 'src/http/fornecedor/fornecedor.controller';
import { FornecedorService } from 'src/http/fornecedor/fornecedor.service';
import { FornecedorRepository } from 'src/infra/repos/fornecedor.repository';
import { EnderecoRepository } from 'src/infra/repos/endereco.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FornecedorEntity, EnderecoEntity])],
  controllers: [FornecedorController],
  providers: [FornecedorService, FornecedorRepository, EnderecoRepository],
  exports: [FornecedorService],
})
export class FornecedorModule {}
