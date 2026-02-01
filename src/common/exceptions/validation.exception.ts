import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(
    status: HttpStatus,
    errors: object | object[],
    message: string = 'Validation failed',
  ) {
    super({ message, errors }, status);
  }

  static of(status: HttpStatus, errors: ValidationError[]) {
    const messages: string[] = [];
    const formattedErrors = errors.map((error) => {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }
      return {
        property: error.property,
        constraints: error.constraints,
      };
    });

    const message = messages.join(', ') || 'Validation failed';

    return new ValidationException(status, formattedErrors, message);
  }

  static badRequest(errors: ValidationError[]) {
    return this.of(HttpStatus.BAD_REQUEST, errors);
  }
}
