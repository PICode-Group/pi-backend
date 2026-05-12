import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity, ItemVendaEntity, PagamentoEntity, ProdutoEntity } from 'src/domain/entities';
import { VendaController } from 'src/http/venda/venda.controller';
import { VendaService } from 'src/http/venda/venda.service';
import { VendaRepository } from 'src/infra/repos/venda.repository';
import { ProdutoRepository } from 'src/infra/repos/produto.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity, ItemVendaEntity, PagamentoEntity, ProdutoEntity]),
  ],
  controllers: [VendaController],
  providers: [VendaService, VendaRepository, ProdutoRepository],
  exports: [VendaService],
})
export class VendaModule {}
