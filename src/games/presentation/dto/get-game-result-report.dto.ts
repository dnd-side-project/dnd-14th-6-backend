import { ApiProperty } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { GameResultReport } from '../../domain/game-result-report.entity';

class InputDto {
  @ApiProperty({ description: '사용자 입력 답', example: 'git commit -m "init"' })
  input: string;

  @ApiProperty({ description: '정답 여부', example: true })
  isCorrect: boolean;
}

class ReportDto {
  @ApiProperty({ description: '문제 ID', example: '101' })
  problemId: string;

  @ApiProperty({ description: '하위 카테고리', example: 'Branch' })
  subCategory: string;

  @ApiProperty({ description: '문제 지문', example: '다음 중 브랜치를 생성하는 명령어는?' })
  text: string;

  @ApiProperty({
    description: '문제 해설',
    example: 'git branch 명령어로 브랜치를 생성합니다.',
    nullable: true,
  })
  explanation: string | null;

  @ApiProperty({ description: '사용자 입력 정답 이력', type: [InputDto] })
  inputs: InputDto[];

  @ApiProperty({ description: '정답', example: 'git branch feature' })
  answer: string;

  @ApiProperty({ description: '해결 여부', example: true })
  isSolved: boolean;

  @ApiProperty({ description: '시도 횟수', example: 1 })
  tryCount: number;
}

class SummaryDto {
  @ApiProperty({ description: '게임 세션 ID', example: '1' })
  sessionId: string;

  @ApiProperty({ description: '유저 ID (비회원은 null)', example: '1', nullable: true })
  userId: string | null;

  @ApiProperty({ description: '총 획득 점수', example: 170 })
  score: number;

  @ApiProperty({ description: '문제 개수', example: 20 })
  totalProblemCount: number;

  @ApiProperty({ description: '맞춘 문제 개수', example: 17 })
  correctProblemCount: number;

  @ApiProperty({ description: '정답률(%)', example: 85 })
  correctRate: number;
}

export class GetGameResultReportResponseDto {
  @ApiProperty({ description: '비회원 여부', example: false })
  isGuest: boolean;

  @ApiProperty({ description: '게임 결과 요약', type: SummaryDto })
  summary: SummaryDto;

  @ApiProperty({ description: '문제별 결과 리포트', type: [ReportDto] })
  reports: ReportDto[];

  static from(gameResultReport: GameResultReport): GetGameResultReportResponseDto {
    const { summary, reports } = gameResultReport;

    return plainToInstance(GetGameResultReportResponseDto, {
      isGuest: gameResultReport.isGuest,
      summary: {
        sessionId: summary.sessionId.toString(),
        userId: summary.userId?.toString() ?? null,
        score: summary.score,
        totalProblemCount: summary.totalProblemCount,
        correctProblemCount: summary.correctProblemCount,
        correctRate: summary.correctRate,
      },
      reports: reports.map((report) => ({
        problemId: report.problemId.toString(),
        subCategory: report.subCategory,
        text: report.text,
        explanation: report.explanation,
        inputs: report.inputs,
        answer: report.answer,
        isSolved: report.isSolved,
        tryCount: report.tryCount,
      })),
    });
  }
}
