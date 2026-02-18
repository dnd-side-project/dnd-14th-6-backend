import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

import { AppModule } from '../../src/app.module';

interface RefreshTokensApiResponse {
  statusCode: number;
  success: boolean;
  message?: string;
}

describe('POST /api/auth/refresh (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;
  let jwtService: JwtService;
  let validRefreshToken: string;

  const TEST_USER_EMAIL = 'refresh-e2e-user@example.com';

  beforeAll(async () => {
    container = await new GenericContainer('postgres:18-alpine')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'test',
      })
      .start();

    const databaseUrl = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;
    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    const prisma = new PrismaClient({ datasourceUrl: databaseUrl });

    const user = await prisma.user.create({
      data: {
        email: TEST_USER_EMAIL,
        nickname: 'Refresh E2E User',
        provider: 'local',
        providerId: 'refresh-e2e-user',
        profileImage: null,
        githubUrl: null,
        refreshToken: '',
      },
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

    jwtService = app.get(JwtService);
    validRefreshToken = jwtService.sign({ sub: user.id.toString() }, { expiresIn: '14d' });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: validRefreshToken },
    });

    await app.init();
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  it('유효한 refreshToken으로 요청하면 200과 함께 쿠키를 갱신한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: validRefreshToken })
      .expect(200);

    const body = response.body as RefreshTokensApiResponse;
    expect(body.statusCode).toBe(200);
    expect(body.success).toBe(true);

    const setCookieValue = response.headers['set-cookie'];
    const setCookieHeader = typeof setCookieValue === 'string' ? [setCookieValue] : setCookieValue;

    const hasAccessTokenCookie = setCookieHeader?.some((cookie) =>
      cookie.startsWith('accessToken='),
    );
    const hasRefreshTokenCookie = setCookieHeader?.some((cookie) =>
      cookie.startsWith('refreshToken='),
    );
    expect(hasAccessTokenCookie).toBe(true);
    expect(hasRefreshTokenCookie).toBe(true);
  });

  it('DB에 저장된 토큰과 불일치하면 401을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid-token' })
      .expect(401);

    const body = response.body as RefreshTokensApiResponse;

    expect(body.success).toBe(false);
    expect(body.message).toBe('유효하지 않은 토큰입니다.');
  });
});
