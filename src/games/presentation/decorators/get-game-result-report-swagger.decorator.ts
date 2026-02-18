import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import {
  createSwaggerBadRequest,
  createSwaggerForbidden,
  createSwaggerNotFound,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { GetGameResultReportResponseDto } from '../dto/get-game-result-report.dto';
import {
  GUEST_GAME_RESULT_REPORT_EXAMPLE,
  USER_GAME_RESULT_REPORT_EXAMPLE,
} from './examples/get-game-result-report.example';

export function ApiGetGameResultReport() {
  return applyDecorators(
    ApiOperation({
      summary: '게임 결과 리포트 조회 ( 회원 / 비회원 공용 )',
      description:
        '게임 종료 후 게임결과를 리포트로 나타내줍니다. <br> **(단, 회원/비회원 에 따라 응답데이터가 다릅니다.)**',
    }),
    ApiParam({
      name: 'gameSessionId',
      required: true,
      type: 'string',
      description: '조회할 게임 세션 ID',
    }),
    ApiExtraModels(ApiResponseDto, GetGameResultReportResponseDto),
    ApiOkResponse({
      description: '게임 결과 리포트 조회 성공',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                type: 'object',
                properties: {
                  data: { $ref: getSchemaPath(GetGameResultReportResponseDto) },
                },
              },
            ],
          },
          examples: {
            guest: {
              summary: '비회원 (열람 제한 적용)',
              value: GUEST_GAME_RESULT_REPORT_EXAMPLE,
            },
            user: {
              summary: '회원 (전체 열람)',
              value: USER_GAME_RESULT_REPORT_EXAMPLE,
            },
          },
        },
      },
    }),
    createSwaggerBadRequest([
      {
        description: 'gameSessionId 필수 누락',
        message: 'gameSessionId 는 필수값 입니다.',
      },
      {
        description: 'gameSessionId 형식 오류',
        message: 'gameSessionId(이)가 유효한 숫자 형식이 아닙니다.',
      },
    ]),
    createSwaggerForbidden([
      {
        description: '(회원) 다른 회원의 게임결과 리포트 조회 접근제한',
        message: '해당 게임 결과 리포트에 접근할 수 없습니다.',
      },
    ]),
    createSwaggerNotFound([
      { description: '존재하지 않는 게임 세션', message: '존재하지 않는 게임 세션입니다.' },
    ]),
    ...createSwaggerServerErrors(),
  );
}
