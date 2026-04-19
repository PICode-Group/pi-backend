import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from 'src/domain/entities';
import { VendaController } from 'src/http/venda/venda.controller';
import { VendaService } from 'src/http/venda/venda.service';

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity])],
  controllers: [VendaController],
  providers: [VendaService],
  exports: [VendaService],
})
export class VendaModule {}
