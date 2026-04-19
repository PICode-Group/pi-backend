import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntradaEstoqueEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class EntradaEstoqueService {
  constructor(
    @InjectRepository(EntradaEstoqueEntity)
    private readonly entradaEstoqueRepository: Repository<EntradaEstoqueEntity>,
  ) {}
}
