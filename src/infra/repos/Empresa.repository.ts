import { InjectRepository } from '@nestjs/typeorm';
import { EmpresaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

export class EmpresaRepository {
  constructor(
    @InjectRepository(EmpresaEntity)
    private empresaRepository: Repository<EmpresaEntity>,
  ) {}

  getEmpresaById(id: string) {
    return this.empresaRepository.findBy({ id });
  }
}
