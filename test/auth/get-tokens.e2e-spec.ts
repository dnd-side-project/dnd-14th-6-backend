import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import { AuthService } from '@auth/application/auth.service';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

import { AppModule } from '../../src/app.module';

interface GetTokensApiResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

describe('GET /api/auth/token (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;
  let authService: AuthService;
  let jwtService: JwtService;
  let validAuthCode: string;

  const TEST_USER_EMAIL = 'get-tokens-e2e-user@example.com';

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
        nickname: 'Get Tokens E2E User',
        provider: 'local',
        providerId: 'get-tokens-e2e-user',
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

    authService = app.get(AuthService);
    jwtService = app.get(JwtService);
    validAuthCode = authService.createTemporalAuthorizationCode(user.id);

    await app.init();
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  it('유효한 인증 코드로 요청하면 200과 함께 accessToken과 refreshToken을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/token')
      .query({ code: validAuthCode })
      .expect(200);

    const body = response.body as GetTokensApiResponse;
    expect(body.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(typeof body.data?.accessToken).toBe('string');
    expect(typeof body.data?.refreshToken).toBe('string');
  });

  it('잘못된 시크릿으로 서명된 코드로 요청하면 401을 반환한다', async () => {
    const codeWithWrongSecret = jwtService.sign(
      { sub: '1', type: 'auth_code' },
      { expiresIn: '1m', secret: 'wrong-secret' },
    );

    const response = await request(app.getHttpServer())
      .get('/api/auth/token')
      .query({ code: codeWithWrongSecret })
      .expect(401);

    const body = response.body as GetTokensApiResponse;
    expect(body.success).toBe(false);
  });

  it('JWT 형식이 아닌 code로 요청하면 400을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/token')
      .query({ code: 'not-a-jwt-string' })
      .expect(400);

    const body = response.body as GetTokensApiResponse;
    expect(body.success).toBe(false);
  });

  it('code 파라미터 없이 요청하면 400을 반환한다', async () => {
    const response = await request(app.getHttpServer()).get('/api/auth/token').expect(400);

    const body = response.body as GetTokensApiResponse;
    expect(body.success).toBe(false);
  });
});
