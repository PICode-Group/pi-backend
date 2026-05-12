import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatorioService } from './relatorio.service';
import { RelatorioController } from './relatorio.controller';
import { 
  EstoqueBaixoView, 
  VendasPeriodoView, 
  ProdutosMaisVendidosView, 
  FaturamentoVendedorView 
} from 'src/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstoqueBaixoView,
      VendasPeriodoView,
      ProdutosMaisVendidosView,
      FaturamentoVendedorView,
    ]),
  ],
  controllers: [RelatorioController],
  providers: [RelatorioService],
})
export class RelatorioModule {}
