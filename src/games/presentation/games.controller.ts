import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GamesService } from '../application/games.service';
import { GameSessionService } from '../application/game-session.service';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import { ApiGetGameOptions } from './decorators/get-game-options-swagger.decorator';
import { ApiGetGameHistories } from './decorators/get-game-histories-swagger.decorator';
import {
  GetGameHistoriesQueryDto,
  GetGameHistoriesResponseDto,
} from './dto/get-game-histories.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(
    private readonly gameService: GamesService,
    private readonly gameSessionService: GameSessionService,
  ) {}

  @Get('options')
  @ApiGetGameOptions()
  async getGameOptions(): Promise<GetGameOptionsResponseDto> {
    const gameOptions = await this.gameService.getGameOptions();
    return GetGameOptionsResponseDto.from(gameOptions);
  }

  @Get('sessions')
  @ApiGetGameHistories()
  async getGameHistories(
    @Query() query: GetGameHistoriesQueryDto,
  ): Promise<GetGameHistoriesResponseDto> {
    const gameHistories = await this.gameSessionService.getSessionHistories(query);

    return GetGameHistoriesResponseDto.from(gameHistories, query.page, query.size);
  }
}
