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
  createSwaggerNotFound,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { GetGameResultReportResponseDto } from '../dto/get-game-result-report.dto';

export function ApiGetGameResultReport() {
  return applyDecorators(
    ApiOperation({ summary: '게임 결과 리포트 조회' }),
    ApiParam({
      name: 'gameSessionId',
      required: true,
      type: 'string',
      description: '조회할 게임 세션 ID',
    }),
    ApiExtraModels(ApiResponseDto, GetGameResultReportResponseDto),
    ApiOkResponse({
      description: '게임 결과 리포트 조회 성공',
      schema: {
        type: 'object',
        $ref: getSchemaPath(ApiResponseDto),
        properties: {
          data: { $ref: getSchemaPath(GetGameResultReportResponseDto) },
        },
      },
    }),
    createSwaggerBadRequest([
      {
        description: 'gameSessionId 형식 오류',
        message: 'gameSessionId이(가) 유효한 숫자 형식이 아닙니다.',
      },
    ]),
    createSwaggerNotFound([
      { description: '존재하지 않는 게임 세션', message: '존재하지 않는 게임 세션입니다.' },
    ]),
    ...createSwaggerServerErrors(),
  );
}
