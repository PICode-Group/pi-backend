import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagamentoEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PagamentoService {
  constructor(
    @InjectRepository(PagamentoEntity)
    private readonly pagamentoRepository: Repository<PagamentoEntity>,
  ) {}
}
