import { ApiProperty } from '@nestjs/swagger';

import { ApiResponseDto } from '@common/dto/api-response.dto';

export class TierDto {
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
}

export class TiersResponseDto extends ApiResponseDto {
  @ApiProperty({
    description: '티어 목록',
    type: [TierDto],
  })
  data: TierDto[];
}
