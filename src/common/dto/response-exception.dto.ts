export class ResponseExceptionDto {
  readonly success: boolean;
  readonly message: string;
  readonly statusCode: number;

  private constructor(params: {
    message: string;
    statusCode?: number;
    errors?: object | object[];
  }) {
    this.success = false;
    this.message = params.message;
    this.statusCode = params.statusCode || 500;
  }

  static of(params: { message: string; statusCode?: number }) {
    return new ResponseExceptionDto(params);
  }
}
