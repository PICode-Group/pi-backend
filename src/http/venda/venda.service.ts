import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(VendaEntity)
    private readonly vendaRepository: Repository<VendaEntity>,
  ) {}
}
