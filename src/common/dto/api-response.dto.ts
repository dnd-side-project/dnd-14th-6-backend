import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
  statusCode: number;

  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;
}
