import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/domain/entities';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
