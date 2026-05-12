import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaEstoqueEntity, ItemEntradaEntity, ProdutoEntity } from 'src/domain/entities';
import { EntradaEstoqueController } from 'src/http/entrada-estoque/entrada-estoque.controller';
import { EntradaEstoqueService } from 'src/http/entrada-estoque/entrada-estoque.service';
import { EntradaEstoqueRepository } from 'src/infra/repos/entrada-estoque.repository';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntradaEstoqueEntity, ItemEntradaEntity, ProdutoEntity]),
  ],
  controllers: [EntradaEstoqueController],
  providers: [EntradaEstoqueService, EntradaEstoqueRepository, ProdutoRepository],
  exports: [EntradaEstoqueService],
})
export class EntradaEstoqueModule {}
