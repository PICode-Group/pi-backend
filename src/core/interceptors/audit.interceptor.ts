import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity, UsuarioEntity } from 'src/domain/entities';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Apenas logar ações de mutação (POST, PUT, DELETE, PATCH)
    const methodsToLog = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (!methodsToLog.includes(method)) {
      return next.handle();
    }

    // Pular rotas de login/logout/seed para não poluir
    const pathsToSkip = ['/auth/login', '/auth/logout', '/api'];
    if (pathsToSkip.some(path => url.includes(path))) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        if (user) {
          const acao = this.getAcao(method, url);
          this.logRepository.save({
            id: uuid(),
            usuario: { id: user.sub } as UsuarioEntity,
            acao: acao,
            detalhes: `Método: ${method} | URL: ${url} | Payload: ${JSON.stringify(request.body).substring(0, 500)}`,
            data: new Date(),
          }).catch(err => console.error('Erro ao salvar log de auditoria:', err));
        }
      }),
    );
  }

  private getAcao(method: string, url: string): string {
    const resource = url.split('/')[1]?.toUpperCase() || 'SISTEMA';
    const actionMap: Record<string, string> = {
      POST: 'CRIAÇÃO',
      PUT: 'ATUALIZAÇÃO',
      PATCH: 'ALTERAÇÃO',
      DELETE: 'EXCLUSÃO',
    };
    return `${actionMap[method]} EM ${resource}`;
  }
}
