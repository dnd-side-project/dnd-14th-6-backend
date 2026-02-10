import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { GameDifficultyMode } from '../../domain/game.business-rules';

export class GameStreamQueryDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'categoryId 는 필수값입니다.' })
  @IsInt({ message: 'categoryId는 정수여야 합니다.' })
  @Min(1, { message: 'categoryId는 1 이상이어야 합니다.' })
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: '게임 난이도',
    enum: GameDifficultyMode,
    example: GameDifficultyMode.Normal,
    required: true,
  })
  @IsNotEmpty({ message: 'difficultyMode 는 필수값입니다.' })
  @IsEnum(GameDifficultyMode, {
    message: 'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
  })
  difficultyMode: GameDifficultyMode;
}
