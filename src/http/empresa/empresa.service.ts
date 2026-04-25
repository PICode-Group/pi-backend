import { Injectable } from '@nestjs/common';
import { EmpresaRepository } from 'src/infra/repos/Empresa.repository';

@Injectable()
export class EmpresaService {
  constructor(private readonly empresaRepository: EmpresaRepository) {}

  getEmpresa(id: string) {
    return this.empresaRepository.getEmpresaById(id);
  }
}
