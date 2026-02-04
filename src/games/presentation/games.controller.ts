import { Controller, Get } from '@nestjs/common';
import { GamesService } from '@/games/application/games.service';
import { GetGameOptionsResponseDto } from '@/games/presentation/dto/get-game-options.dto';
import { ApiGetGameOptions } from '@/games/presentation/swagger-decorators/get-game-options.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Get('options')
  @ApiGetGameOptions()
  async getGameOptions(): Promise<GetGameOptionsResponseDto> {
    const gameOptions = await this.gameService.getGameOptions();
    return GetGameOptionsResponseDto.from(gameOptions);
  }
}
