import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemVendaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ItemVendaService {
  constructor(
    @InjectRepository(ItemVendaEntity)
    private readonly itemVendaRepository: Repository<ItemVendaEntity>,
  ) {}
}
