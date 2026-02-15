import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { GameDifficultyMode, GameSessionSortBy, SortOrder } from '../../domain/game.business-rules';
import { GameSessionHistoryList } from '../../domain/game-session-history.entity';

export class GetGameHistoriesQueryDto {
  @ApiProperty({
    description: '유저 ID',
    example: '1',
    required: true,
  })
  @IsNotEmpty({ message: 'userId 는 필수값입니다.' })
  @Transform(({ value }) => {
    try {
      return BigInt(value as string);
    } catch {
      throw new BadRequestException('userId가 유효한 숫자 형식의 문자열이 아닙니다.');
    }
  })
  userId: bigint;

  @ApiProperty({
    description: '조회할 페이지 번호',
    minimum: 1,
    default: 1,
    required: true,
  })
  @IsInt({ message: 'page가 정수가 아닙니다.' })
  @Min(1, { message: 'page의 최솟값은 1입니다.' })
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    description: '한 페이지당 보여줄 항목 수',
    minimum: 1,
    default: 5,
    required: true,
  })
  @IsInt({ message: 'size가 정수가 아닙니다.' })
  @Min(1, { message: 'size의 최솟값은 1입니다.' })
  @Type(() => Number)
  size: number = 5;

  @ApiProperty({
    description: '문제 지문, 정답 명령어 기반 검색 키워드',
    example: 'git',
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: '게임 플레이 시작 시간 필터 (YYYY-MM-DD)',
    example: '2026-02-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'startDate는 YYYY-MM-DD 형식이어야 합니다.' })
  startDate?: string;

  @ApiProperty({
    description: '게임 플레이 종료 시간 필터 (YYYY-MM-DD)',
    example: '2026-02-05',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'endDate는 YYYY-MM-DD 형식이어야 합니다.' })
  endDate?: string;

  @ApiProperty({
    description: '게임 카테고리 필터 (,로 구분)',
    type: String,
    isArray: false,
    example: 'Git,Linux',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    (value as string)
      ?.split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  )
  categories?: string[];

  @ApiProperty({
    description: '게임 플레이 난이도 필터 (,로 구분)',
    type: String,
    isArray: false,
    example: 'Hard,Random',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    (value as string)
      ?.split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  )
  @IsEnum(GameDifficultyMode, {
    each: true,
    message: '게임 난이도는 Random, Hard, Normal, Easy 중 하나여야 합니다.',
  })
  difficultyModes?: GameDifficultyMode[];

  @ApiProperty({
    description: '정렬 기준 컬럼 (플레이 시간 순/ 점수 순/ 맞힌 문제 순)',
    enum: GameSessionSortBy,
    default: GameSessionSortBy.PlayedAt,
    required: true,
  })
  @IsEnum(GameSessionSortBy, {
    message: 'sortBy는 playedAt, score, correctProblemCount 중 하나여야 합니다.',
  })
  sortBy: GameSessionSortBy = GameSessionSortBy.PlayedAt;

  @ApiProperty({
    description: '정렬 방향',
    enum: SortOrder,
    default: SortOrder.Desc,
    required: true,
  })
  @IsEnum(SortOrder, { message: 'sortOrder는 asc, desc 중 하나여야 합니다.' })
  sortOrder: SortOrder = SortOrder.Desc;
}

class SessionHistoryDto {
  @ApiProperty({ description: '세션 ID', example: 105 })
  id: string;

  @ApiProperty({
    description: '화면 표시용 제목',
    example: '기능 개발을 위한 브랜치 생성 및 이동 외 19건',
  })
  title: string;

  @ApiProperty({ description: '카테고리', example: 'Git' })
  category: string;

  @ApiProperty({ description: '난이도', example: 'Normal' })
  difficultyMode: string;

  @ApiProperty({ description: '획득 점수', example: 200 })
  score: number;

  @ApiProperty({ description: '총 문제 수', example: 20 })
  totalProblemCount: number;

  @ApiProperty({ description: '정답 수', example: 19 })
  correctProblemCount: number;

  @ApiProperty({
    description: '플레이 일시',
    example: '2025-02-16T12:00:00Z',
  })
  playedAt: Date;
}

class PaginationMetadataDto {
  @ApiProperty({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 10 })
  size: number;

  @ApiProperty({ description: '전체 항목 수', example: 45 })
  totalItems: number;

  @ApiProperty({ description: '전체 페이지 수', example: 5 })
  totalPages: number;
}

export class GetGameHistoriesResponseDto {
  @ApiProperty({ description: '세션 히스토리 목록', type: [SessionHistoryDto] })
  sessions: SessionHistoryDto[];

  @ApiProperty({ description: '페이지네이션 메타데이터', type: PaginationMetadataDto })
  metadata: PaginationMetadataDto;

  static from(
    sessionHistoryList: GameSessionHistoryList,
    page: number,
    size: number,
  ): GetGameHistoriesResponseDto {
    return plainToInstance(GetGameHistoriesResponseDto, {
      sessions: sessionHistoryList.sessionHistories.map((session) => ({
        ...session,
        id: session.id.toString(),
      })),
      metadata: {
        page,
        size,
        totalItems: sessionHistoryList.totalItems,
        totalPages: Math.ceil(sessionHistoryList.totalItems / size),
      },
    });
  }
}
