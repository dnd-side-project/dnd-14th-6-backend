import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ApiResponseDto } from '@common/dto/api-response.dto';

import { Tier } from '../../domain/tiers.entity';

export class GetAllTiersResponseDto {
  @ApiProperty({ description: '티어 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '티어 이름', example: 'Bronze' })
  name: string;

  @ApiProperty({ description: '최소 점수', example: 0 })
  minScore: number;

  @ApiProperty({
    description: '티어 이미지 URL',
    example: 'https://example.com/badge.png',
  })
  imageUrl: string | null;

  @ApiProperty({
    description: '티어 아이콘 이미지 URL',
    example: 'https://example.com/icon.png',
  })
  iconUrl: string | null;

  static from(tier: Tier): GetAllTiersResponseDto {
    return plainToInstance(GetAllTiersResponseDto, tier);
  }
}

export class TiersResponseDto extends ApiResponseDto {
  @ApiProperty({
    description: '티어 목록',
    type: [GetAllTiersResponseDto],
  })
  data: GetAllTiersResponseDto[];
}
