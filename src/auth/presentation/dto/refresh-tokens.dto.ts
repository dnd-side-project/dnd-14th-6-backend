import { ApiProperty } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

export class RefreshTokensResponseDto {
  @ApiProperty({ description: 'access token', example: 'eyhjewo...' })
  accessToken: string;

  @ApiProperty({ description: 'refresh token', example: 'eyhjewo...' })
  refreshToken: string;

  static from(tokens: { accessToken: string; refreshToken: string }) {
    return plainToInstance(RefreshTokensResponseDto, tokens);
  }
}
