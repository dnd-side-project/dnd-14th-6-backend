import { Response, Request } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { ResponseExceptionDto } from '@common/dto/response-exception.dto';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof TypeError || exception instanceof HttpException) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let endpoint: string;
    try {
      endpoint = decodeURIComponent(`${request.method} ${request.url}`);
    } catch (error) {
      this.logger.error(error);

      endpoint = `${request.method} ${request.url}`;
    }

    const errorResponse = {
      message: exception.message || 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      endpoint,
      stack: exception.stack,
    };

    this.logger.error(errorResponse);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseExceptionDto.of(errorResponse));
  }
}
