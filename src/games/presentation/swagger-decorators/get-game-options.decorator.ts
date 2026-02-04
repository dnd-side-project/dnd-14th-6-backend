import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetGameOptionsResponseDto } from '@/games/presentation/dto/get-game-options.dto';

export function ApiGetGameOptions() {
  return applyDecorators(
    ApiOperation({ summary: '게임 옵션 조회 (카테고리, 난이도)' }),
    ApiOkResponse({
      description: '게임 옵션 조회 성공',
      type: GetGameOptionsResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
    ApiResponse({
      status: 503,
      description: 'Service Unavailable',
    }),
  );
}
