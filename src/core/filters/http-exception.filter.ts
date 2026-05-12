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

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno no servidor';

    // Tratamento amigável para erros comuns do MySQL
    if (exception.code === 'ER_ROW_IS_REFERENCED_2') {
      status = HttpStatus.CONFLICT;
      message = {
        message: 'Não é possível excluir este registro pois existem outros dados vinculados a ele.',
        error: 'Conflict',
        statusCode: 409
      };
    }

    if (exception.code === 'ER_DUP_ENTRY') {
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
