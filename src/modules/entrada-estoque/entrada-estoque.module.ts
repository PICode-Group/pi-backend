import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaEstoqueEntity, ItemEntradaEntity, ProdutoEntity } from 'src/domain/entities';
import { EntradaEstoqueController } from './entrada-estoque.controller';
import { EntradaEstoqueService } from './entrada-estoque.service';
import { EntradaEstoqueRepository } from './repositories/entrada-estoque.repository';
import { ProdutoRepository } from '../produto/repositories/produto.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntradaEstoqueEntity, ItemEntradaEntity, ProdutoEntity]),
  ],
  controllers: [EntradaEstoqueController],
  providers: [EntradaEstoqueService, EntradaEstoqueRepository, ProdutoRepository],
  exports: [EntradaEstoqueService],
})
export class EntradaEstoqueModule {}
