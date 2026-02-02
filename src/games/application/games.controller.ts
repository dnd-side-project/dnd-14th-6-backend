import { Controller, Get } from '@nestjs/common';
import { GamesService } from '@games/domain/games.service';
import { GetGameOptionsResponseDto } from '@games/application/dto/game-options.dto';
import { ApiGetGameOptions } from '@games/application/swagger-decorators/get-game-options.decorator';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Get('options')
  @ApiGetGameOptions()
  async getGameOptions(): Promise<GetGameOptionsResponseDto> {
    return await this.gameService.getGameOptions();
  }
}
