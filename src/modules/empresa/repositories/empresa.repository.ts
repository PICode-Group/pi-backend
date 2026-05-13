import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEmpresaDto } from '../dto/empresa.dto';
import { EmpresaEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresaRepository {
  constructor(
    @InjectRepository(EmpresaEntity)
    private empresaRepository: Repository<EmpresaEntity>,
  ) {}

  async getEmpresaById(id: string) {
    const empresa = await this.empresaRepository.findOneBy({ id });

    return empresa;
  }

  async updateEmpresa(
    id: string,
    body: UpdateEmpresaDto,
  ): Promise<EmpresaEntity> {
    const empresa = await this.empresaRepository.findOneBy({ id });
    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada!');
    }
    Object.assign(empresa, body);
    await this.empresaRepository.save(empresa);

    return empresa;
  }
}
