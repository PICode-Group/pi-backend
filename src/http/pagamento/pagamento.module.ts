import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoEntity } from 'src/domain/entities';
import { PagamentoController } from 'src/http/pagamento/pagamento.controller';
import { PagamentoService } from 'src/http/pagamento/pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoEntity])],
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export class PagamentoModule {}
