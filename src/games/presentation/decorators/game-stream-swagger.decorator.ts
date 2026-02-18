import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

import {
  createSwaggerBadRequest,
  createSwaggerNotFound,
  createSwaggerServerErrors,
} from '@common/utils/swagger-error-response.util';

import { GameDifficultyMode } from '../../domain/game.business-rules';

export function ApiGameStream() {
  return applyDecorators(
    ApiOperation({ summary: '게임진행 스트림 (SSE) - ( Public )' }),
    ApiQuery({
      name: 'categoryId',
      required: true,
      type: Number,
      description: '카테고리 ID',
    }),
    ApiQuery({
      name: 'difficultyMode',
      required: true,
      enum: GameDifficultyMode,
      description: '난이도 모드',
    }),
    ApiOkResponse({
      description: 'SSE 이벤트 스트림 (text/event-stream)',
      content: {
        'text/event-stream': {
          examples: {
            'timer 이벤트': {
              summary: 'timer 이벤트: 매 1초마다 남은 시간 전송',
              description: '이벤트명: `timer`',
              value: {
                statusCode: 200,
                success: true,
                data: {
                  remainingSeconds: 54,
                },
              },
            },
            'problem 이벤트': {
              summary: 'problem 이벤트: 랜덤 간격으로 문제 전송',
              description: '이벤트명: `problem`',
              value: {
                statusCode: 200,
                success: true,
                data: {
                  problemId: '1',
                  title: 'Git 브랜치 생성',
                  subCategory: 'Branch',
                  text: '새로운 브랜치를 생성하는 명령어는?',
                  answer: 'Z2l0IGJyYW5jaCBuZXctYnJhbmNo',
                  point: 10,
                  difficulty: 'Easy',
                },
              },
            },
            'end 이벤트': {
              summary: 'end 이벤트: 게임 종료 시 전송',
              description: '이벤트명: `end`',
              value: {
                statusCode: 200,
                success: true,
                data: {
                  message: '게임이 종료되었습니다',
                },
              },
            },
          },
        },
      },
    }),
    createSwaggerBadRequest([
      { description: 'categoryId 필수 누락', message: 'categoryId 는 필수값입니다.' },
      { description: 'difficultyMode 필수 누락', message: 'difficultyMode 는 필수값입니다.' },
      {
        description: 'difficultyMode 형식 오류',
        message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
      },
    ]),
    createSwaggerNotFound([
      { description: '존재하지 않는 카테고리', message: '존재하지 않은 카테고리 입니다.' },
    ]),
    ...createSwaggerServerErrors(),
  );
}
