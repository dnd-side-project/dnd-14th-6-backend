import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

import { ApiResponseDto } from '@common/dto/api-response.dto';

import { User } from '../../domain/users.entity';

export class GetRanksQueryDto {
  @ApiProperty({
    description: '조회할 페이지 번호',
    minimum: 1,
    default: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    description: '한 페이지당 보여줄 항목 수',
    minimum: 1,
    default: 20,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size: number = 20;

  @ApiPropertyOptional({
    description: '특정 티어 ID 필터링 (없으면 전체 조회)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tierId?: number;
}

export class PaginationMetadataDto {
  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 20 })
  size: number;

  @ApiProperty({ description: '전체 항목 수', example: 120 })
  totalItems: number;

  @ApiProperty({ description: '전체 페이지 수', example: 6 })
  totalPage: number;

  static from(data: {
    page: number;
    size: number;
    totalItems: number;
    totalPage: number;
  }): PaginationMetadataDto {
    return plainToInstance(PaginationMetadataDto, data);
  }
}

export class RankTierDto {
  @ApiProperty({ description: '티어 이름', example: 'Master' })
  name: string;

  @ApiProperty({ description: '티어 이미지 URL', example: 'https://example.com/master.png' })
  imageUrl: string | null;
}

export class RankItemDto {
  @ApiProperty({ description: '랭킹', example: 1 })
  ranking: number;

  @ApiProperty({ description: '닉네임', example: 'Jin Park' })
  nickname: string;

  @ApiProperty({ description: '총 점수', example: 1029342 })
  totalScore: number;

  @ApiProperty({ description: '프로필 이미지', example: 'https://github.com/profile.png' })
  profileImage: string | null;

  @ApiProperty({ description: 'github 링크', example: 'https://github.com/user1' })
  githubUrl: string | null;

  @ApiProperty({ description: '티어 정보', type: RankTierDto, nullable: true })
  tier: RankTierDto | null;

  static from(user: User, ranking: number): RankItemDto {
    const dto = new RankItemDto();

    dto.ranking = ranking;
    dto.nickname = user.nickname;
    dto.totalScore = Number(user.totalScore);
    dto.profileImage = user.profileImage;
    dto.githubUrl = user.githubUrl;
    dto.tier = user.tier ? { name: user.tier.name, imageUrl: user.tier.imageUrl } : null;

    return dto;
  }
}

export class GetRanksResponseDto {
  @ApiProperty({ description: '랭킹 리스트', type: [RankItemDto] })
  ranks: RankItemDto[];

  @ApiProperty({ description: '페이지네이션 메타데이터', type: PaginationMetadataDto })
  metadata: PaginationMetadataDto;

  static from(users: User[], totalItems: number, page: number, size: number): GetRanksResponseDto {
    const ranks = users.map((user, index) => {
      const ranking = (page - 1) * size + index + 1;
      return RankItemDto.from(user, ranking);
    });

    const metadata = PaginationMetadataDto.from({
      page,
      size,
      totalItems,
      totalPage: Math.ceil(totalItems / size),
    });

    return plainToInstance(GetRanksResponseDto, { ranks, metadata });
  }
}

export class RanksResponseDto extends ApiResponseDto {
  @ApiProperty({ description: '랭킹 응답', type: GetRanksResponseDto })
  data: GetRanksResponseDto;
}
