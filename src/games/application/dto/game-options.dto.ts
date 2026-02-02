import { GameDifficultyMode } from '@/games/domain/game.business-rules';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '카테고리 이름',
    example: 'Git',
  })
  name: string;
}

export class GetGameOptionsResponseDto {
  @ApiProperty({
    description: '게임 카테고리 목록',
    type: [CategoryDto],
    example: [
      { id: 1, name: 'Git' },
      { id: 2, name: 'Linux' },
      { id: 3, name: 'Docker' },
    ],
  })
  categories: CategoryDto[];

  @ApiProperty({
    description: '게임난이도 목록',
    type: [String],
    enum: ['Easy', 'Normal', 'Hard', 'Random'],
    example: ['Easy', 'Normal', 'Hard', 'Random'],
  })
  difficultyModes: GameDifficultyMode[];
}
