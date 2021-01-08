import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const ex = exception.getResponse();
      if (ex instanceof Object) {
        response.status(status).json({
          ...ex,
          timestamp: Date.now(),
          path: request.url,
        });
      } else {
        response.status(status).json({
          message: ex,
          timestamp: Date.now(),
          path: request.url,
        });
      }
    } else if (exception instanceof EntityNotFoundError) {
      response.status(HttpStatus.NOT_FOUND).json({
        message: '资源未找到!',
        timestamp: Date.now(),
        path: request.url,
      });
    } else {
      console.error('服务器内部错误');
      console.error(exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: status,
        timestamp: new Date().toISOString(),
        message: '服务器内部错误',
        error: exception,
        path: request.url,
      });
    }
  }
}
