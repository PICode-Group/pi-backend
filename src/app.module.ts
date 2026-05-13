import { Module } from '@nestjs/common';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { EnderecoModule } from './modules/endereco/endereco.module';
import { EntradaEstoqueModule } from './modules/entrada-estoque/entrada-estoque.module';
import { FornecedorModule } from './modules/fornecedor/fornecedor.module';
import { ItemEntradaModule } from './modules/item-entrada/item-entrada.module';
import { ItemVendaModule } from './modules/item-venda/item-venda.module';
import { LogModule } from './modules/log/log.module';
import { PagamentoModule } from './modules/pagamento/pagamento.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { VendaModule } from './modules/venda/venda.module';
import { EnvModule } from './config';
import { DatabaseModule } from './database/database.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { AuthModule } from './modules/auth/auth.module';
import { RelatorioModule } from './modules/relatorio/relatorio.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { RolesGuard } from './core/guards/roles.guard';
import { AuditInterceptor } from './core/interceptors/audit.interceptor';
import { AllExceptionsFilter } from './core/filters/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './domain/entities';

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
    AuthModule,
    RelatorioModule,
    TypeOrmModule.forFeature([LogEntity]), // Necessário para o AuditInterceptor
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
