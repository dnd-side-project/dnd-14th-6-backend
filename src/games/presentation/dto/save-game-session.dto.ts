import { ApiProperty } from '@nestjs/swagger';

import { plainToInstance, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  DIFFICULTY_MODES,
  GameDifficultyMode,
  MAX_PROBLEMS_PER_GAME,
} from '../../domain/game.business-rules';

export class InputDto {
  @ApiProperty({
    description: '사용자 입력 값',
    example: 'git commit -m',
  })
  @IsString({ message: 'input은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'input은 필수값입니다.' })
  @MaxLength(255, { message: 'input은 최대 255자까지 입력 가능합니다.' })
  input: string;

  @ApiProperty({
    description: '정답 여부',
    example: false,
  })
  @IsBoolean({ message: 'isCorrect는 boolean 타입이어야 합니다.' })
  isCorrect: boolean;
}

export class ClientAnswerDto {
  @ApiProperty({
    description: '문제 ID',
    example: '1',
  })
  @IsNumberString({}, { message: 'problemId는 숫자 형식의 문자열이어야 합니다.' })
  problemId: string;

  @ApiProperty({
    description: '사용자 입력 이력',
    type: [InputDto],
  })
  @IsArray({ message: 'inputs는 배열 형식이어야 합니다.' })
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => InputDto)
  inputs: InputDto[];

  @ApiProperty({
    description: '문제 해결 여부',
    example: true,
  })
  @IsBoolean({ message: 'solved는 boolean 타입이어야 합니다.' })
  solved: boolean;
}

export class SaveGameSessionRequestDto {
  @ApiProperty({
    description: '카테고리 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty({ message: 'categoryId는 필수값입니다.' })
  @IsInt({ message: 'categoryId는 정수여야 합니다.' })
  @Min(1, { message: 'categoryId는 1 이상이어야 합니다.' })
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: '난이도 모드',
    enum: DIFFICULTY_MODES,
    required: true,
    example: 'Normal',
  })
  @IsNotEmpty({ message: 'difficultyMode는 필수값입니다.' })
  @IsEnum(GameDifficultyMode, {
    message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
  })
  difficultyMode: GameDifficultyMode;

  @ApiProperty({
    description: '획득 점수',
    required: true,
    example: 150,
  })
  @IsInt({ message: 'score는 정수여야 합니다.' })
  @Min(0, { message: 'score는 0 이상이어야 합니다.' })
  score: number;

  @ApiProperty({
    description: '클라이언트 답안 목록',
    required: true,
    type: [ClientAnswerDto],
  })
  @IsArray({ message: 'clientAnswers는 배열 형식이어야 합니다.' })
  @ArrayMinSize(MAX_PROBLEMS_PER_GAME, {
    message: `clientAnswers는 정확히 ${MAX_PROBLEMS_PER_GAME}개여야 합니다.`,
  })
  @ArrayMaxSize(MAX_PROBLEMS_PER_GAME, {
    message: `clientAnswers는 정확히 ${MAX_PROBLEMS_PER_GAME}개여야 합니다.`,
  })
  @ValidateNested({ each: true })
  @Type(() => ClientAnswerDto)
  clientAnswers: ClientAnswerDto[];
}

export class SaveGameSessionResponseDto {
  @ApiProperty({
    description: '생성된 게임세션 ID',
    example: '7',
  })
  gameSessionId: string;

  static from(gameSessionId: bigint): SaveGameSessionResponseDto {
    return plainToInstance(SaveGameSessionResponseDto, {
      gameSessionId: String(gameSessionId),
    });
  }
}
