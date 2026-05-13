import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { Roles } from 'src/core/decorators/roles.decorator';
import { TipoUsuario } from 'src/domain/entities';

@Controller('logs')
@Roles(TipoUsuario.ADMIN)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  getAllLogs() {
    return this.logService.allLogs();
  }
}
