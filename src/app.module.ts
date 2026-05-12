import { Module } from '@nestjs/common';
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
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ClienteModule } from './http/cliente/cliente.module';
import { AuthModule } from './auth/auth.module';
import { RelatorioModule } from './http/relatorio/relatorio.module';
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
