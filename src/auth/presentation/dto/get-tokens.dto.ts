import { ApiProperty } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class GetTokensQueryDto {
  @ApiProperty({ description: '로그인 리다이렉트 시 포함된 인증용 코드', example: 'eyhjewo...' })
  @IsNotEmpty({ message: 'code는 필수 값입니다.' })
  @IsJWT({ message: 'code가 유효한 토큰 형식이 아닙니다.' })
  code: string;
}

export class GetTokensResponseDto {
  @ApiProperty({ description: 'access token', example: 'eyhjewo...' })
  accessToken: string;

  @ApiProperty({ description: 'refresh token', example: 'eyhjewo...' })
  refreshToken: string;

  static from(tokens: { accessToken: string; refreshToken: string }) {
    return plainToInstance(GetTokensResponseDto, tokens);
  }
}
