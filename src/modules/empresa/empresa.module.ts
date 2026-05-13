import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity } from 'src/domain/entities';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { EmpresaRepository } from './repositories/empresa.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity])],
  exports: [TypeOrmModule],
  providers: [EmpresaService, EmpresaRepository],
  controllers: [EmpresaController],
})
export class EmpresaModule {}
