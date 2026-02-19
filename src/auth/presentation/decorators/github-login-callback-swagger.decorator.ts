import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import {
  createSwaggerServerErrors,
  createSwaggerUnauthorized,
} from '@common/utils/swagger-error-response.util';

export function ApiGithubLoginCallback() {
  return applyDecorators(
    ApiOperation({ summary: '깃허브 소셜 로그인 콜백 처리' }),
    ApiQuery({
      name: 'code',
      required: true,
      type: String,
      description: 'OAuth 인증 코드',
    }),
    ApiQuery({
      name: 'state',
      required: false,
      type: String,
      description: '리다이렉트 URL 및 게임 세션 상태값',
    }),
    ApiResponse({
      status: 302,
      description:
        '로그인 성공 시 state.redirectUrl?code=<1분간 유효한 인가코드> 로, 실패 시 / 경로로 리다이렉트',
    }),
    createSwaggerUnauthorized([
      {
        description: '기본 인증 실패',
        message: 'Unauthorized',
      },
      {
        description: '이메일 정보 없음',
        message: 'Github 계정 이메일 정보가 없어 로그인할 수 없습니다.',
      },
      {
        description: '이름 정보 없음',
        message: 'Github 계정 이름 정보가 없어 로그인할 수 없습니다.',
      },
    ]),
    ...createSwaggerServerErrors(),
  );
}
