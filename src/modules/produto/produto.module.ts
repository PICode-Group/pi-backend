import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity, ProdutoEntity } from 'src/domain/entities';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoRepository } from './repositories/produto.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoEntity, CategoriaEntity])],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoRepository],
  exports: [ProdutoService],
})
export class ProdutoModule {}
