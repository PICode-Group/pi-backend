import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/domain/entities';

@Module({
  imports: [
       TypeOrmModule.forFeature([ClienteEntity]) 
  ],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
