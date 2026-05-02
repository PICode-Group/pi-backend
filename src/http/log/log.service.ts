import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async allLogs() {
    const logs = await this.logRepository.find();

    if (!logs) {
      return 'Nenhum log registrado!';
    }

    return logs;
  }
}
