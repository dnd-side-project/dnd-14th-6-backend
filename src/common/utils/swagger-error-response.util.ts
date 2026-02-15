import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface ErrorExample {
  description: string;
  message: string;
}

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

export function createSwaggerForbidden(examples: ErrorExample[]) {
  const exampleObject = {};
  examples.forEach((data) => {
    exampleObject[data.description] = {
      value: {
        statusCode: 403,
        success: false,
        message: data.message,
      },
    };
  });

  return ApiForbiddenResponse({
    description: '접근 권한 없음',
    content: {
      'application/json': {
        examples: exampleObject,
      },
    },
  });
}

export function createSwaggerAuthErrors() {
  return [
    createSwaggerUnauthorized([
      {
        description: '토큰 없음',
        message: '인증이 필요합니다.',
      },
      {
        description: '토큰 만료',
        message: '토큰이 만료되었습니다.',
      },
      {
        description: '유효하지 않은 토큰',
        message: '유효하지 않은 토큰입니다.',
      },
    ]),
    createSwaggerForbidden([
      {
        description: '권한 없음',
        message: '본인의 정보만 조회할 수 있습니다.',
      },
    ]),
    createSwaggerNotFound([
      {
        description: '사용자 없음',
        message: '존재하지 않는 사용자입니다.',
      },
    ]),
  ];
}

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
