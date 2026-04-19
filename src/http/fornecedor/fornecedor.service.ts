import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FornecedorEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(FornecedorEntity)
    private readonly fornecedorRepository: Repository<FornecedorEntity>,
  ) {}
}
