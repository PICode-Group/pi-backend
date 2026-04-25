import { Controller, Get, Param } from '@nestjs/common';
import { EmpresaService } from './empresa.service';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':id')
  getEmpresaById(@Param('id') id: string) {
    return this.empresaService.getEmpresa(id);
  }
}
