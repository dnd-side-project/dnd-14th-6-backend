import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface ErrorExample {
  description: string;
  message: string;
}

/**
 * @description BadRequest(400) Swagger 에러 응답 명세를 생성하는 헬퍼 함수
 */
export function createSwaggerBadRequest(examples: ErrorExample[]) {
  const exampleObject = {};
  examples.forEach((data) => {
    exampleObject[data.description] = {
      value: {
        statusCode: 400,
        success: false,
        message: data.message,
      },
    };
  });

  return ApiBadRequestResponse({
    description: '잘못된 요청 파라미터',
    content: {
      'application/json': {
        examples: exampleObject,
      },
    },
  });
}

/**
 * @description NotFound(404) Swagger 에러 응답 명세를 생성하는 헬퍼 함수
 */
export function createSwaggerNotFound(examples: ErrorExample[]) {
  const exampleObject = {};
  examples.forEach((data) => {
    exampleObject[data.description] = {
      value: {
        statusCode: 404,
        success: false,
        message: data.message,
      },
    };
  });

  return ApiNotFoundResponse({
    description: '리소스 찾을 수 없음',
    content: {
      'application/json': {
        examples: exampleObject,
      },
    },
  });
}

/**
 * @description Unauthorized(401) Swagger 응답 명세를 생성하는 헬퍼 함수
 */
export function createSwaggerUnauthorized(examples: ErrorExample[]) {
  const exampleObject = {};
  examples.forEach((data) => {
    exampleObject[data.description] = {
      value: {
        statusCode: 401,
        success: false,
        message: data.message,
      },
    };
  });

  return ApiUnauthorizedResponse({
    description: '인증 실패',
    content: {
      'application/json': {
        examples: exampleObject,
      },
    },
  });
}

/**
 * @description 서버 에러(500, 503) Swagger 응답 명세를 생성하는 헬퍼 함수
 */
export function createSwaggerServerErrors() {
  return [
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
    ApiResponse({
      status: 503,
      description: 'Service Unavailable',
    }),
  ];
}
