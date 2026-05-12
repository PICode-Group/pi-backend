import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/domain/entities';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService],
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
})
export class CategoriaModule {}
