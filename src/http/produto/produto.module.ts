import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity, ProdutoEntity } from 'src/domain/entities';
import { ProdutoController } from 'src/http/produto/produto.controller';
import { ProdutoService } from 'src/http/produto/produto.service';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoEntity, CategoriaEntity])],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoRepository],
  exports: [ProdutoService],
})
export class ProdutoModule {}
