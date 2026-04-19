import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaEstoqueEntity } from 'src/domain/entities';
import { EntradaEstoqueController } from 'src/http/entrada-estoque/entrada-estoque.controller';
import { EntradaEstoqueService } from 'src/http/entrada-estoque/entrada-estoque.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntradaEstoqueEntity])],
  controllers: [EntradaEstoqueController],
  providers: [EntradaEstoqueService],
  exports: [EntradaEstoqueService],
})
export class EntradaEstoqueModule {}
