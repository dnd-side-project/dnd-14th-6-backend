import { Controller, Sse, MessageEvent, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Observable, interval, map } from 'rxjs';

const SSE_EVENTS_DESCRIPTION = `
서버에서 클라이언트로 실시간 이벤트를 스트리밍합니다.

**사용 방법:**
\`\`\`javascript
const eventSource = new EventSource('/sse-sample/events');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
\`\`\`

**응답 형식:** \`text/event-stream\`
`;

const SSE_ROOM_EVENTS_DESCRIPTION = `
특정 방(roomId)의 실시간 이벤트를 스트리밍합니다.

**사용 방법:**
\`\`\`javascript
const roomId = 'room-123';
const eventSource = new EventSource(\`/sse-sample/events/\${roomId}\`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
\`\`\`
`;

@ApiTags('SSE Sample')
@Controller('sse-sample')
export class SseSampleController {
  @Sse('events')
  @ApiOperation({
    summary: 'SSE 이벤트 스트림',
    description: SSE_EVENTS_DESCRIPTION,
  })
  @ApiResponse({
    status: 200,
    description: 'SSE 연결 성공 - 이벤트 스트림 시작',
    content: {
      'text/event-stream': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: '이벤트 발생 시간',
                },
                message: {
                  type: 'string',
                  description: '이벤트 메시지',
                },
              },
            },
          },
        },
        example: {
          data: {
            timestamp: '2024-01-01T00:00:00.000Z',
            message: 'Hello from SSE',
          },
        },
      },
    },
  })
  events(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(
        () =>
          ({
            data: {
              timestamp: new Date().toISOString(),
              message: 'Hello from SSE',
            },
          }) as MessageEvent,
      ),
    );
  }

  @Sse('events/:roomId')
  @ApiOperation({
    summary: '특정 방의 SSE 이벤트 스트림',
    description: SSE_ROOM_EVENTS_DESCRIPTION,
  })
  @ApiParam({
    name: 'roomId',
    description: '방 ID',
    example: 'room-123',
  })
  @ApiResponse({
    status: 200,
    description: 'SSE 연결 성공 - 해당 방의 이벤트 스트림 시작',
    content: {
      'text/event-stream': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                roomId: {
                  type: 'string',
                  description: '방 ID',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: '이벤트 발생 시간',
                },
                message: {
                  type: 'string',
                  description: '이벤트 메시지',
                },
              },
            },
          },
        },
        example: {
          data: {
            roomId: 'room-123',
            timestamp: '2024-01-01T00:00:00.000Z',
            message: 'Room event',
          },
        },
      },
    },
  })
  roomEvents(@Param('roomId') roomId: string): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(
        () =>
          ({
            data: {
              roomId,
              timestamp: new Date().toISOString(),
              message: 'Room event',
            },
          }) as MessageEvent,
      ),
    );
  }
}
