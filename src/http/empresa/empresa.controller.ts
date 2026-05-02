import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from 'src/domain/DTOs/UpdateEmpresa.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':id')
  getEmpresaById(@Param('id') id: string) {
    return this.empresaService.getEmpresa(id);
  }

  @Put(':id')
  async updateEmpresaById(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    const empresaAtualizada = await this.empresaService.updateEmpresa(
      id,
      updateEmpresaDto,
    );

    return `Atualização na empresa: ${empresaAtualizada.nome_fantasia}`;
  }
}
