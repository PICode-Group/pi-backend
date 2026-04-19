import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorEntity } from 'src/domain/entities';
import { FornecedorController } from 'src/http/fornecedor/fornecedor.controller';
import { FornecedorService } from 'src/http/fornecedor/fornecedor.service';

@Module({
  imports: [TypeOrmModule.forFeature([FornecedorEntity])],
  controllers: [FornecedorController],
  providers: [FornecedorService],
  exports: [FornecedorService],
})
export class FornecedorModule {}
