import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(EnderecoEntity)
    private readonly enderecoRepository: Repository<EnderecoEntity>,
  ) {}
}
