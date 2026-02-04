// eslint-disable-next-line @typescript-eslint/no-require-imports
require('newrelic');

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
