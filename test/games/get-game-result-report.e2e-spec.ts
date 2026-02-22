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

import { seedCategories } from '../../prisma/seeds/category.seed';
import { seedGitProblems } from '../../prisma/seeds/seed-problems-git';
import { seedSubCategories } from '../../prisma/seeds/subcategory.seed';
import { seedTiers } from '../../prisma/seeds/tier.seed';
import { AppModule } from '../../src/app.module';

interface SaveSuccessResponse {
  statusCode: number;
  success: boolean;
  data: {
    gameSessionId: string;
  };
}

interface ReportSuccessResponse {
  statusCode: number;
  success: boolean;
  data: {
    isGuest: boolean;
    summary: {
      sessionId: string;
      userId: string | null;
      score: number | null;
      totalProblemCount: number | null;
      correctProblemCount: number | null;
      correctRate: number | null;
    };
    reports: Array<{
      problemId: string;
      subCategory: string;
      text: string | null;
      explanation: string | null;
      inputs: Array<{ input: string; isCorrect: boolean }>;
      answer: string | null;
      isSolved: boolean | null;
      tryCount: number | null;
    }>;
  };
}

interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

const SAVE_REQUEST_BODY = {
  categoryId: 1,
  difficultyMode: 'Easy',
  score: 30,
  clientAnswers: [
    {
      problemId: '73',
      inputs: [
        { input: 'git branch', isCorrect: false },
        { input: 'git remote', isCorrect: true },
      ],
      solved: true,
    },
    {
      problemId: '103',
      inputs: [
        { input: 'git revert', isCorrect: false },
        { input: 'git rolback', isCorrect: false },
      ],
      solved: false,
    },
    {
      problemId: '265',
      inputs: [{ input: 'git tag', isCorrect: true }],
      solved: true,
    },
    {
      problemId: '134',
      inputs: [{ input: 'git config --email "john@example.com"', isCorrect: false }],
      solved: false,
    },
    { problemId: '40', inputs: [], solved: false },
    {
      problemId: '34',
      inputs: [{ input: 'git branch', isCorrect: true }],
      solved: true,
    },
    { problemId: '4', inputs: [], solved: false },
    { problemId: '174', inputs: [], solved: false },
    { problemId: '306', inputs: [], solved: false },
    { problemId: '200', inputs: [], solved: false },
    {
      problemId: '237',
      inputs: [{ input: 'git stasy', isCorrect: false }],
      solved: false,
    },
    { problemId: '69', inputs: [], solved: false },
    { problemId: '11', inputs: [], solved: false },
    { problemId: '10', inputs: [], solved: false },
    { problemId: '6', inputs: [], solved: false },
    { problemId: '307', inputs: [], solved: false },
    { problemId: '7', inputs: [], solved: false },
    { problemId: '109', inputs: [], solved: false },
    { problemId: '241', inputs: [], solved: false },
    {
      problemId: '43',
      inputs: [{ input: 'git delete', isCorrect: false }],
      solved: false,
    },
  ],
};

describe('GET /api/games/:gameSessionId/reports (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;
  let savedGameSessionId: string;
  let memberAccessToken: string;
  let savedMemberGameSessionId: string;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:16-alpine')
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
    await seedTiers(prisma);
    await seedCategories(prisma);
    await seedSubCategories(prisma);
    await seedGitProblems(prisma);
    await prisma.$disconnect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    await app.init();

    // 게임 세션 저장 (리포트 조회를 위한 사전 데이터)
    const saveResponse = await request(app.getHttpServer())
      .post('/api/games/save')
      .send(SAVE_REQUEST_BODY)
      .expect(201);

    const saveBody = saveResponse.body as SaveSuccessResponse;
    savedGameSessionId = saveBody.data.gameSessionId;

    // 회원 생성 및 회원용 게임 세션 저장
    const memberPrisma = new PrismaClient({ datasourceUrl: databaseUrl });
    const memberUser = await memberPrisma.user.create({
      data: {
        email: 'member-report-e2e@example.com',
        nickname: 'MemberReportUser',
        provider: 'github',
        providerId: 'member-report-e2e-user',
        totalScore: 0n,
        refreshToken: '',
        profileImage: null,
        githubUrl: null,
        tierId: 1,
      },
    });
    await memberPrisma.$disconnect();

    const jwtService = app.get(JwtService);
    memberAccessToken = jwtService.sign({ sub: memberUser.id.toString() });

    const memberSaveResponse = await request(app.getHttpServer())
      .post('/api/games/save')
      .set('Authorization', `Bearer ${memberAccessToken}`)
      .send(SAVE_REQUEST_BODY)
      .expect(201);

    const memberSaveBody = memberSaveResponse.body as SaveSuccessResponse;
    savedMemberGameSessionId = memberSaveBody.data.gameSessionId;
  }, 60000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  describe('✅ 성공 케이스', () => {
    describe('비회원', () => {
      it('비회원 게임 결과 리포트를 정상적으로 조회한다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedGameSessionId}/reports`)
          .expect(200);

        const body = response.body as ReportSuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.isGuest).toBe(true);
      });

      it('비회원 summary는 sessionId만 노출되고 나머지는 잠금 처리된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedGameSessionId}/reports`)
          .expect(200);

        const { summary } = (response.body as ReportSuccessResponse).data;
        expect(summary.sessionId).toBe(savedGameSessionId);
        expect(summary.userId).toBeNull();
        expect(summary.score).toBeNull();
        expect(summary.totalProblemCount).toBeNull();
        expect(summary.correctProblemCount).toBeNull();
        expect(summary.correctRate).toBeNull();
      });

      it('비회원 reports는 총 20개가 반환된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedGameSessionId}/reports`)
          .expect(200);

        const { reports } = (response.body as ReportSuccessResponse).data;
        expect(reports).toHaveLength(20);
      });

      it('비회원 문제 1~10은 전체 데이터가 열람 가능하다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedGameSessionId}/reports`)
          .expect(200);

        const { reports } = (response.body as ReportSuccessResponse).data;
        const viewableReports = reports.slice(0, 10);

        // 문제 1~10 공통 검증: text, explanation, answer 열람 가능 / isSolved, tryCount는 null
        for (const report of viewableReports) {
          expect(report.problemId).toBeDefined();
          expect(report.subCategory).toBeDefined();
          expect(report.text).not.toBeNull();
          expect(report.explanation).not.toBeNull();
          expect(report.answer).not.toBeNull();
          expect(report.isSolved).toBeNull();
          expect(report.tryCount).toBeNull();
        }

        // 시도한 문제 검증 (problemId: 73 - 2번 시도)
        const triedReport = viewableReports.find((r) => r.problemId === '73');
        expect(triedReport).toBeDefined();
        expect(triedReport!.isSolved).toBeNull();
        expect(triedReport!.tryCount).toBeNull();
        expect(triedReport!.inputs).toHaveLength(2);

        // 시도한 문제 검증 (problemId: 103 - 2번 시도)
        const anotherTriedReport = viewableReports.find((r) => r.problemId === '103');
        expect(anotherTriedReport).toBeDefined();
        expect(anotherTriedReport!.isSolved).toBeNull();
        expect(anotherTriedReport!.tryCount).toBeNull();
        expect(anotherTriedReport!.inputs).toHaveLength(2);

        // 시도하지 않은 문제 검증 (problemId: 40 - 시도 안함)
        const skippedReport = viewableReports.find((r) => r.problemId === '40');
        expect(skippedReport).toBeDefined();
        expect(skippedReport!.isSolved).toBeNull();
        expect(skippedReport!.tryCount).toBeNull();
        expect(skippedReport!.inputs).toHaveLength(0);
      });

      it('비회원 문제 11~20은 잠금 처리된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedGameSessionId}/reports`)
          .expect(200);

        const { reports } = (response.body as ReportSuccessResponse).data;
        const lockedReports = reports.slice(10);

        expect(lockedReports).toHaveLength(10);

        const firstLockedReport = lockedReports[0];
        expect(firstLockedReport.problemId).toBeDefined();
        expect(firstLockedReport.subCategory).toBeDefined();
        expect(firstLockedReport.text).toBeNull();
        expect(firstLockedReport.explanation).toBeNull();
        expect(firstLockedReport.inputs).toEqual([]);
        expect(firstLockedReport.answer).toBeNull();
        expect(firstLockedReport.isSolved).toBeNull();
        expect(firstLockedReport.tryCount).toBeNull();
      });
    });

    describe('회원', () => {
      it('회원 게임 결과 리포트를 정상적으로 조회한다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedMemberGameSessionId}/reports`)
          .set('Authorization', `Bearer ${memberAccessToken}`)
          .expect(200);

        const body = response.body as ReportSuccessResponse;
        expect(body.success).toBe(true);
        expect(body.data.isGuest).toBe(false);
      });

      it('회원 summary는 전체 데이터가 노출된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedMemberGameSessionId}/reports`)
          .set('Authorization', `Bearer ${memberAccessToken}`)
          .expect(200);

        const { summary } = (response.body as ReportSuccessResponse).data;
        expect(summary.sessionId).toBe(savedMemberGameSessionId);
        expect(summary.userId).not.toBeNull();
        expect(summary.score).not.toBeNull();
        expect(summary.totalProblemCount).toBe(20);
        expect(summary.correctProblemCount).not.toBeNull();
        expect(summary.correctRate).not.toBeNull();
      });

      it('회원 reports는 총 20개가 반환된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedMemberGameSessionId}/reports`)
          .set('Authorization', `Bearer ${memberAccessToken}`)
          .expect(200);

        const { reports } = (response.body as ReportSuccessResponse).data;
        expect(reports).toHaveLength(20);
      });

      it('회원 reports는 isSolved, tryCount가 포함된 전체 데이터가 반환된다.', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/games/${savedMemberGameSessionId}/reports`)
          .set('Authorization', `Bearer ${memberAccessToken}`)
          .expect(200);

        const { reports } = (response.body as ReportSuccessResponse).data;

        // 정답 문제 검증 (problemId: 73 - solved, 2번 시도)
        const solvedReport = reports.find((r) => r.problemId === '73');
        expect(solvedReport).toBeDefined();
        expect(solvedReport!.text).not.toBeNull();
        expect(solvedReport!.explanation).not.toBeNull();
        expect(solvedReport!.answer).not.toBeNull();
        expect(solvedReport!.isSolved).toBe(true);
        expect(solvedReport!.tryCount).toBe(2);
        expect(solvedReport!.inputs).toHaveLength(2);

        // 오답 문제 검증 (problemId: 103 - not solved, 2번 시도)
        const failedReport = reports.find((r) => r.problemId === '103');
        expect(failedReport).toBeDefined();
        expect(failedReport!.isSolved).toBe(false);
        expect(failedReport!.tryCount).toBe(2);
        expect(failedReport!.inputs).toHaveLength(2);

        // 시도하지 않은 문제 검증 (problemId: 40 - 시도 안함)
        const skippedReport = reports.find((r) => r.problemId === '40');
        expect(skippedReport).toBeDefined();
        expect(skippedReport!.isSolved).toBe(false);
        expect(skippedReport!.tryCount).toBe(0);
        expect(skippedReport!.inputs).toHaveLength(0);
      });
    });
  });

  describe('❌ 실패 케이스 - PathParam 유효성 검증', () => {
    it('gameSessionId가 숫자가 아닌 문자열이면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/hi1234/reports')
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('gameSessionId(이)가 유효한 숫자 형식의 문자열이 아닙니다.');
    });

    it('gameSessionId가 음수이면 404 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer()).get('/api/games/-1/reports').expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('존재하지 않는 게임 세션입니다.');
    });

    it('gameSessionId가 소수점이면 400 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer()).get('/api/games/1.5/reports').expect(400);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('gameSessionId(이)가 유효한 숫자 형식의 문자열이 아닙니다.');
    });
  });

  describe('❌ 실패 케이스 - 비즈니스 로직 검증', () => {
    it('존재하지 않는 게임 세션 ID이면 404 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/games/999999/reports')
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('존재하지 않는 게임 세션입니다.');
    });

    it('비회원이 회원의 게임 결과 리포트를 조회하면 403 에러를 응답한다.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/games/${savedMemberGameSessionId}/reports`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('해당 게임 결과 리포트에 접근할 수 없습니다.');
    });

    it('다른 회원의 게임 결과 리포트를 조회하면 403 에러를 응답한다.', async () => {
      const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
      const anotherUser = await prisma.user.create({
        data: {
          email: 'another-member-e2e@example.com',
          nickname: 'AnotherMemberUser',
          provider: 'github',
          providerId: 'another-member-e2e-user',
          totalScore: 0n,
          refreshToken: '',
          profileImage: null,
          githubUrl: null,
          tierId: 1,
        },
      });
      await prisma.$disconnect();

      const jwtService = app.get(JwtService);
      const anotherAccessToken = jwtService.sign({ sub: anotherUser.id.toString() });

      const response = await request(app.getHttpServer())
        .get(`/api/games/${savedMemberGameSessionId}/reports`)
        .set('Authorization', `Bearer ${anotherAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.success).toBe(false);
      expect(body.message).toBe('해당 게임 결과 리포트에 접근할 수 없습니다.');
    });
  });
});
