import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './http/empresa/empresa.module';
import { EnderecoModule } from './http/endereco/endereco.module';
import { EntradaEstoqueModule } from './http/entrada-estoque/entrada-estoque.module';
import { FornecedorModule } from './http/fornecedor/fornecedor.module';
import { ItemEntradaModule } from './http/item-entrada/item-entrada.module';
import { ItemVendaModule } from './http/item-venda/item-venda.module';
import { LogModule } from './http/log/log.module';
import { PagamentoModule } from './http/pagamento/pagamento.module';
import { ProdutoModule } from './http/produto/produto.module';
import { UsuarioModule } from './http/usuario/usuario.module';
import { VendaModule } from './http/venda/venda.module';
import { EnvModule } from './config';
import { DatabaseModule } from './database/database.module';
import { CategoriaModule } from './http/categoria/categoria.module';
import { ClienteModule } from './http/cliente/cliente.module';


@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    CategoriaModule,
    ClienteModule,
    EmpresaModule,
    EnderecoModule,
    EntradaEstoqueModule,
    FornecedorModule,
    ItemEntradaModule,
    ItemVendaModule,
    LogModule,
    PagamentoModule,
    ProdutoModule,
    UsuarioModule,
    VendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
