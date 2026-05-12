import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEmpresaDto } from './dto/empresa.dto';
import { EmpresaEntity } from 'src/domain/entities';
import { EmpresaRepository } from './repositories/empresa.repository';

@Injectable()
export class EmpresaService {
  constructor(private readonly empresaRepository: EmpresaRepository) {}

  async getEmpresa(id: string) {
    const empresa = await this.empresaRepository.getEmpresaById(id);

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada!');
    }

    return empresa;
  }

  async updateEmpresa(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<EmpresaEntity> {
    const empresaAtualizada = await this.empresaRepository.updateEmpresa(
      id,
      updateEmpresaDto,
    );

    if (!empresaAtualizada) {
      new NotFoundException('Empresa não encontrada!');
    }

    return empresaAtualizada;
  }
}
