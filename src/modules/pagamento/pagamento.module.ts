import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoEntity } from 'src/domain/entities';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoEntity])],
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export class PagamentoModule {}
