import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVendaEntity } from 'src/domain/entities';
import { ItemVendaController } from './item-venda.controller';
import { ItemVendaService } from './item-venda.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVendaEntity])],
  controllers: [ItemVendaController],
  providers: [ItemVendaService],
  exports: [ItemVendaService],
})
export class ItemVendaModule {}
