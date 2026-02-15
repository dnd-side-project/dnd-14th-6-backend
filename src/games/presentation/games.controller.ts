import { Controller, Get, Logger, MessageEvent, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Subject } from 'rxjs';

import { GamesService } from '../application/games.service';
import { GameStreamService } from '../application/game-stream.service';
import { GameSessionService } from '../application/game-session.service';

import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import { GameStreamQueryDto } from './dto/game-stream-query.dto';
import {
  GetGameHistoriesQueryDto,
  GetGameHistoriesResponseDto,
} from './dto/get-game-histories.dto';

import { ApiGetGameOptions } from './decorators/get-game-options-swagger.decorator';
import { ApiGetGameHistories } from './decorators/get-game-histories-swagger.decorator';
import { ApiGameStream } from './decorators/game-stream-swagger.decorator';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(
    private readonly gameService: GamesService,

    private readonly gameStreamService: GameStreamService,
    private readonly gameSessionService: GameSessionService,
  ) {}

  @Get('options')
  @ApiGetGameOptions()
  async getGameOptions(): Promise<GetGameOptionsResponseDto> {
    const gameOptions = await this.gameService.getGameOptions();
    return GetGameOptionsResponseDto.from(gameOptions);
  }

  @Get('stream')
  @ApiGameStream()
  async gameStream(
    @Query() query: GameStreamQueryDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.gameStreamService.validateGameStreamParams(query.categoryId);

    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    const disconnectSignal$ = new Subject<void>();
    request.on('close', () => {
      disconnectSignal$.next();
      disconnectSignal$.complete();
    });

    const stream$ = this.gameStreamService.createGameStream(
      query.categoryId,
      query.difficultyMode,
      disconnectSignal$,
    );

    stream$.subscribe({
      next: (event: MessageEvent) => {
        const sseData = JSON.stringify({
          statusCode: 200,
          success: true,
          data: event.data,
        });
        if (event.type) {
          response.write(`event: ${event.type}\n`);
        }
        response.write(`data: ${sseData}\n\n`);
      },
      complete: () => {
        response.end();
      },
      error: (err: Error) => {
        this.logger.error(
          `Game stream error [categoryId=${query.categoryId}, difficultyMode=${query.difficultyMode}]`,
          err.stack,
        );
        response.end();
      },
    });
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
