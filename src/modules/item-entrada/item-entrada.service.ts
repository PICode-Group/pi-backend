import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntradaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ItemEntradaService {
  constructor(
    @InjectRepository(ItemEntradaEntity)
    private readonly itemEntradaRepository: Repository<ItemEntradaEntity>,
  ) {}
}
