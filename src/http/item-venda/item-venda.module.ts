import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVendaEntity } from 'src/domain/entities';
import { ItemVendaController } from 'src/http/item-venda/item-venda.controller';
import { ItemVendaService } from 'src/http/item-venda/item-venda.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVendaEntity])],
  controllers: [ItemVendaController],
  providers: [ItemVendaService],
  exports: [ItemVendaService],
})
export class ItemVendaModule {}
