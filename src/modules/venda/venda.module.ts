import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity, ItemVendaEntity, PagamentoEntity, ProdutoEntity } from 'src/domain/entities';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';
import { VendaRepository } from './repositories/venda.repository';
import { ProdutoRepository } from '../produto/repositories/produto.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity, ItemVendaEntity, PagamentoEntity, ProdutoEntity]),
  ],
  controllers: [VendaController],
  providers: [VendaService, VendaRepository, ProdutoRepository],
  exports: [VendaService],
})
export class VendaModule {}
