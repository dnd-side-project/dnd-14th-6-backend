import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';

import { UserMistakeAnalysis } from '@games/domain/user-mistake-analysis.entity';

export class GetUserAnalysisParamDto {
  @ApiProperty({
    description: '유저 ID',
    example: '1',
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
}

export class FrequentWrongCommandDto {
  @ApiProperty({
    description: '서브 카테고리 이름',
    example: 'Branch',
  })
  subCategory: string;

  @ApiProperty({
    description: '오답 횟수',
    example: 12,
  })
  wrongCount: number;
}

export class FrequentWrongCategoryDto {
  @ApiProperty({
    description: '카테고리 이름',
    example: 'Git',
  })
  category: string;

  @ApiProperty({
    description: '오답 비율 (%)',
    example: 48,
  })
  wrongRatio: number;

  @ApiProperty({
    description: '오답 횟수',
    example: 24,
  })
  wrongCount: number;

  @ApiProperty({
    description: '카테고리 아이콘 이미지 URL',
    example: 'https://example.com/icons/git.png',
    nullable: true,
  })
  iconUrl: string;
}

export class GetUserAnalysisResponseDto {
  @ApiProperty({
    description: '서브 카테고리 기준 자주 틀린 명령어 Top 5',
    type: [FrequentWrongCommandDto],
  })
  frequentWrongCommands: FrequentWrongCommandDto[];

  @ApiProperty({
    description: '많이 틀린 카테고리',
    type: [FrequentWrongCategoryDto],
  })
  frequentWrongCategories: FrequentWrongCategoryDto[];

  static from(userMistakeAnalysis: UserMistakeAnalysis) {
    return plainToInstance(GetUserAnalysisResponseDto, userMistakeAnalysis);
  }
}
