import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntradaEntity } from 'src/domain/entities';
import { ItemEntradaController } from 'src/http/item-entrada/item-entrada.controller';
import { ItemEntradaService } from 'src/http/item-entrada/item-entrada.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntradaEntity])],
  controllers: [ItemEntradaController],
  providers: [ItemEntradaService],
  exports: [ItemEntradaService],
})
export class ItemEntradaModule {}
