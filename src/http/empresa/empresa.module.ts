import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity } from 'src/domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity])],
  exports: [TypeOrmModule],
})
export class EmpresaModule {}
