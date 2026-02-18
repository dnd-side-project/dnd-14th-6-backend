import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import {
  createSwaggerServerErrors,
  createSwaggerUnauthorized,
} from '@common/utils/swagger-error-response.util';

export function ApiLoginByGithub() {
  return applyDecorators(
    ApiOperation({ summary: '깃허브 소셜 로그인 시작' }),
    ApiQuery({
      name: 'redirectUrl',
      required: false,
      type: String,
      description: '로그인 완료 후 리다이렉트할 프론트 경로',
      example: '/game',
    }),
    ApiQuery({
      name: 'gameSessionId',
      required: false,
      type: String,
      description: '비회원 게임 세션 식별자(로그인 후 유저 세션 병합용)',
      example: '123',
    }),
    ApiResponse({
      status: 302,
      description: 'GitHub OAuth 인증 페이지로 리다이렉트',
    }),
    createSwaggerUnauthorized([
      {
        description: '인증 실패',
        message: 'Unauthorized',
      },
    ]),
    ...createSwaggerServerErrors(),
  );
}
