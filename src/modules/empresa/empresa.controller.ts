import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/empresa.dto';
import { Roles } from 'src/core/decorators/roles.decorator';
import { TipoUsuario } from 'src/domain/entities';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.VENDEDOR)
  getEmpresaById(@Param('id') id: string) {
    return this.empresaService.getEmpresa(id);
  }

  @Put(':id')
  @Roles(TipoUsuario.ADMIN)
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
