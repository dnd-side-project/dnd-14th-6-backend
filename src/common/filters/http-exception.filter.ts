import { Response, Request } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { ExceptionResponse } from '@common/interfaces/exception-response.interface';
import { ResponseExceptionDto } from '@common/dto/response-exception.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    let endpoint: string;
    try {
      endpoint = decodeURIComponent(`${request.method} ${request.url}`);
    } catch (error) {
      this.logger.error(error);
      endpoint = `${request.method} ${request.url}`;
    }

    const { message, ...rest } = exception.getResponse() as ExceptionResponse;

    const errorResponse = {
      message: exception.message || message,
      statusCode: status,
      endpoint,
      stack: exception.stack,
      ...rest,
    };

    this.logger.error(errorResponse);

    response.status(status).json(ResponseExceptionDto.of(errorResponse));
  }
}
