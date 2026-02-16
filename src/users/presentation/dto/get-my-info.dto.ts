import { ApiProperty } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { User } from '@users/domain/users.entity';

export class GetMyInfoResponseDto {
  @ApiProperty({ description: '유저 ID', example: '121' })
  id: string;

  @ApiProperty({ description: '유저 닉네임', example: 'John' })
  nickname: string;

  @ApiProperty({
    description: '유저 프로필 사진 (없을 경우 default image)',
    example: 'https://example.com/profile.png',
  })
  profileImage: string;

  static from(user: User) {
    return plainToInstance(GetMyInfoResponseDto, {
      id: user.id.toString(),
      nickname: user.nickname,
      profileImage: user.profileImage,
    });
  }
}
