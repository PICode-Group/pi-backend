import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  EnderecoEntity,
  EmpresaEntity,
  ClienteEntity,
  FornecedorEntity,
  UsuarioEntity,
  CategoriaEntity,
  ProdutoEntity,
  VendaEntity,
  ItemVendaEntity,
  PagamentoEntity,
  EntradaEstoqueEntity,
  ItemEntradaEntity,
  LogEntity,
  EstoqueBaixoView,
  VendasPeriodoView,
  ProdutosMaisVendidosView,
  FaturamentoVendedorView,
} from 'src/domain/entities';

const entities = [
  EnderecoEntity,
  EmpresaEntity,
  ClienteEntity,
  FornecedorEntity,
  UsuarioEntity,
  CategoriaEntity,
  ProdutoEntity,
  VendaEntity,
  ItemVendaEntity,
  PagamentoEntity,
  EntradaEstoqueEntity,
  ItemEntradaEntity,
  LogEntity,
  EstoqueBaixoView,
  VendasPeriodoView,
  ProdutosMaisVendidosView,
  FaturamentoVendedorView,
];

export const testTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  entities,
  synchronize: true,
  dropSchema: true,
});

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DB_DATABASE'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  entities,
  synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
  retryAttempts: configService.get<number>('DB_RETRY_ATTEMPTS', 3),
  retryDelay: configService.get<number>('DB_RETRY_DELAY', 3000),
  extra: {
    connectionLimit: configService.get<number>('DB_CONNECTION_LIMIT', 10),
    connectTimeout: configService.get<number>('DB_CONNECT_TIMEOUT', 10000),
  },
});
