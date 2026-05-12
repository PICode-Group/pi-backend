import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  EstoqueBaixoView, 
  VendasPeriodoView, 
  ProdutosMaisVendidosView, 
  FaturamentoVendedorView 
} from 'src/domain/entities';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectRepository(EstoqueBaixoView)
    private estoqueBaixoRepo: Repository<EstoqueBaixoView>,
    
    @InjectRepository(VendasPeriodoView)
    private vendasPeriodoRepo: Repository<VendasPeriodoView>,
    
    @InjectRepository(ProdutosMaisVendidosView)
    private produtosMaisVendidosRepo: Repository<ProdutosMaisVendidosView>,
    
    @InjectRepository(FaturamentoVendedorView)
    private faturamentoVendedorRepo: Repository<FaturamentoVendedorView>,
  ) {}

  async obterEstoqueBaixo() {
    return await this.estoqueBaixoRepo.find();
  }

  async obterVendasPeriodo() {
    return await this.vendasPeriodoRepo.find();
  }

  async obterProdutosMaisVendidos() {
    return await this.produtosMaisVendidosRepo.find();
  }

  async obterPerformanceVendedores() {
    return await this.faturamentoVendedorRepo.find();
  }
}
