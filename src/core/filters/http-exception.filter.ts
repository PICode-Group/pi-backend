import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log do erro para debug no terminal
    console.error(`[ExceptionFilter] Erro na rota ${request.url}:`, exception);

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno no servidor';

    // Tratamento amigável para erros comuns do MySQL (suporta código string e numérico)
    if (exception.code === 'ER_ROW_IS_REFERENCED_2' || exception.errno === 1451) {
      status = HttpStatus.CONFLICT;
      message = {
        message: 'Não é possível excluir este registro pois existem outros dados vinculados a ele (ex: vendas, produtos ou entradas).',
        error: 'Conflict',
        statusCode: 409
      };
    }

    if (exception.code === 'ER_DUP_ENTRY' || exception.errno === 1062) {
      status = HttpStatus.CONFLICT;
      message = {
        message: 'Este registro já existe no sistema.',
        error: 'Conflict',
        statusCode: 409
      };
    }

    response.status(status).json({
      ...(typeof message === 'object' ? message : { message }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
