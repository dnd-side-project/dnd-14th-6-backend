import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GamesService } from '../application/games.service';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import { ApiGetGameOptions } from './swagger-decorators/get-game-options-swagger.decorator';

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
