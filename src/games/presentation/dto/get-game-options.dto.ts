import { ApiResponseDto } from '@common/dto/api-response.dto';
import { GameOptions } from '../../domain/game-options.entity';
import { GameDifficultyMode } from '../../domain/game.business-rules';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

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

export class GetGameOptionsResponseDto extends ApiResponseDto {
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

  static from(gameOptionsEntity: GameOptions): GetGameOptionsResponseDto {
    return plainToInstance(GetGameOptionsResponseDto, {
      categories: gameOptionsEntity.categories,
      difficultyModes: gameOptionsEntity.difficultyModes,
    });
  }
}
