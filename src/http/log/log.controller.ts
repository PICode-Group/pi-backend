import { Controller } from '@nestjs/common';
import { LogService } from 'src/http/log/log.service';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}
}
