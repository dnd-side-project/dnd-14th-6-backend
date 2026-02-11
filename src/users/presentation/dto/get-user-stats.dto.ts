import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';

import { UserStats } from '../../domain/user-stats.entity';
import { BadRequestException } from '@nestjs/common';

export class GetUserStatsParamDto {
  @ApiProperty({
    description: '유저 ID',
    example: '1',
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    try {
      return BigInt(value as string);
    } catch {
      throw new BadRequestException('userId가 유효한 숫자 형식의 문자열이 아닙니다.');
    }
  })
  userId: bigint;
}

export class CategoryScoreDto {
  @ApiProperty({ description: '카테고리 이름', example: 'Git' })
  category: string;

  @ApiProperty({
    description: '해당 카테고리 점수 (BigInt 안정성을 위해 String)',
    example: '17650',
  })
  score: string;
}

export class ScoreDetailDto {
  @ApiProperty({ description: '난이도', example: 'Hard' })
  difficultyMode: string;

  @ApiProperty({
    description: '해당 난이도 총 점수 (BigInt 안정성을 위해 String)',
    example: '32460',
  })
  totalScore: string;

  @ApiProperty({
    description: '카테고리별 점수 목록',
    type: [CategoryScoreDto],
  })
  categoryScores: CategoryScoreDto[];
}

export class TierDto {
  @ApiProperty({ description: '티어 ID', example: 3 })
  id: number;

  @ApiProperty({ description: '티어 이름', example: 'Master' })
  name: string;

  @ApiProperty({
    description: '티어 이미지 URL',
    example: 'https://example.com/master.png',
    nullable: true,
  })
  imageUrl: string | null;
}

export class GetUserStatsResponseDto {
  @ApiProperty({ description: '닉네임', example: 'Jin Park' })
  nickname: string;

  @ApiProperty({
    description: '총 점수 (BigInt 안정성을 위해 String)',
    example: '54610',
  })
  totalScore: string;

  @ApiProperty({
    description: '전체 유저 평균 점수 (BigInt 안정성을 위해 String)',
    example: '190293',
  })
  averageScore: string;

  @ApiProperty({ description: '현재 랭킹', example: 131 })
  ranking: number;

  @ApiProperty({
    description: '티어 정보',
    type: TierDto,
    nullable: true,
  })
  tier: TierDto | null;

  @ApiProperty({
    description: '난이도별 점수 상세 (totalScore 기준 DESC 정렬)',
    type: [ScoreDetailDto],
  })
  scoreDetail: ScoreDetailDto[];

  static from(userStats: UserStats): GetUserStatsResponseDto {
    return plainToInstance(GetUserStatsResponseDto, {
      nickname: userStats.nickname,
      totalScore: userStats.totalScore.toString(),
      averageScore: userStats.averageScore.toString(),
      ranking: userStats.ranking,
      tier: userStats.tier
        ? { id: userStats.tier.id, name: userStats.tier.name, imageUrl: userStats.tier.imageUrl }
        : null,
      scoreDetail: userStats.scoreDetail.map((detail) => ({
        difficultyMode: detail.difficultyMode,
        totalScore: detail.totalScore.toString(),
        categoryScores: detail.categoryScores.map((category) => ({
          category: category.category,
          score: category.score.toString(),
        })),
      })),
    });
  }
}
