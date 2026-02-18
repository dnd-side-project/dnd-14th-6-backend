import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_DESCRIPTION = `
## API 문서

### SSE (Server-Sent Events) 엔드포인트 사용법
SSE 엔드포인트는 실시간 데이터 스트리밍을 위해 사용됩니다.

\`\`\`javascript
const eventSource = new EventSource('/api/sse-sample/events');

eventSource.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  eventSource.close();
};
\`\`\`

**Content-Type:** \`text/event-stream\`
`;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('DND 14th 6team API')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('1.0')
    .addTag('SSE', 'Server-Sent Events 관련 API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
