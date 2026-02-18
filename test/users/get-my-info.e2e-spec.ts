import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '@auth/presentation/guards/jwt-auth.guard';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { ApiResponseDto } from '@common/dto/api-response.dto';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { GetMyInfoResponseDto } from '@users/presentation/dto/get-my-info.dto';

import { AppModule } from '../../src/app.module';
import { createMockAuthGuard } from '../utils/mock-auth.guard';

describe('GET /api/users/me (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;

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

    await prisma.user.create({
      data: {
        email: 'test@test.com',
        nickname: 'testUser',
        provider: 'github',
        providerId: '12345',
        totalScore: 0n,
        refreshToken: 'token',
        createdAt: new Date(),
        updatedAt: new Date(),
        githubUrl: null,
        profileImage: 'https://example.com/profile.png',
        tierId: null,
      },
    });

    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(createMockAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

    await app.init();
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  it('요청한 유저의 id, nickname, profileImage 정보를 응답한다.', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/me').expect(200);
    const body = response.body as { data: GetMyInfoResponseDto } & ApiResponseDto;

    expect(body.data).toEqual({
      id: '1',
      nickname: 'testUser',
      profileImage: 'https://example.com/profile.png',
    });
  });
});
