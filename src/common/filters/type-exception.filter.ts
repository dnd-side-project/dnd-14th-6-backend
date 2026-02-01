import { Response, Request } from 'express';
import { ExceptionFilter, Catch, Logger, ArgumentsHost, HttpStatus } from '@nestjs/common';

import { ResponseExceptionDto } from '@common/dto/response-exception.dto';

@Catch(TypeError)
export class TypeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeExceptionFilter.name);

  catch(exception: TypeError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const endpoint = `${request.method} ${request.url}`;

    const errorResponse = {
      message: exception.message || 'Internal Server Error',
      statusCode: 500,
      endpoint,
      stack: exception.stack,
    };

    this.logger.error(errorResponse);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseExceptionDto.of(errorResponse));
  }
}
