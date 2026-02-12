import { GameDifficultyMode } from '../../domain/game.business-rules';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiGameStream() {
  return applyDecorators(
    ApiOperation({ summary: '게임진행 스트림 (SSE)' }),
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
    ApiResponse({
      status: HttpStatus.OK,
      description: 'SSE 이벤트 스트림 (text/event-stream)',
      content: {
        'text/event-stream': {
          examples: {
            'timer 이벤트': {
              summary: '매 1초마다 남은 시간 전송',
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
              summary: '랜덤 간격으로 문제 전송',
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
              summary: '게임 종료 시 전송',
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
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: '잘못된 요청 파라미터',
      content: {
        'application/json': {
          examples: {
            'categoryId 필수 누락': {
              value: {
                statusCode: 400,
                success: false,
                message: 'categoryId 는 필수값입니다.',
              },
            },
            'difficultyMode 필수 누락': {
              value: {
                statusCode: 400,
                success: false,
                message: 'difficultyMode 는 필수값입니다.',
              },
            },
            'difficultyMode 형식 오류': {
              value: {
                statusCode: 400,
                success: false,
                message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '리소스 찾을 수 없음',
      content: {
        'application/json': {
          examples: {
            '존재하지 않는 카테고리': {
              value: {
                statusCode: 404,
                success: false,
                message: '존재하지 않은 카테고리 입니다.',
              },
            },
          },
        },
      },
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
