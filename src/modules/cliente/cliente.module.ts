import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/domain/entities';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './repositories/cliente.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity])],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  exports: [ClienteService],
})
export class ClienteModule {}
