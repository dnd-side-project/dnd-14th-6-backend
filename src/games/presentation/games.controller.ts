import {
  Body,
  Controller,
  Get,
  Logger,
  MessageEvent,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from '@auth/presentation/decorators/authenticated-user.decorator';
import { CheckOwnership } from '@auth/presentation/decorators/check-ownership.decorator';
import { JwtAuthGuard } from '@auth/presentation/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@auth/presentation/guards/optional-jwt-auth.guard';
import { UserOwnershipGuard } from '@auth/presentation/guards/user-ownership.guard';
import { Request, Response } from 'express';
import { Subject } from 'rxjs';

import { GameSessionService } from '../application/game-session.service';
import { GameStreamService } from '../application/game-stream.service';
import { GameFacade } from '../application/game.facade';
import { GamesService } from '../application/games.service';
import { ApiGameStream } from './decorators/game-stream-swagger.decorator';
import { ApiGetGameHistories } from './decorators/get-game-histories-swagger.decorator';
import { ApiGetGameOptions } from './decorators/get-game-options-swagger.decorator';
import { ApiGetGameResultReport } from './decorators/get-game-result-report-swagger.decorator';
import { ApiSaveGameSession } from './decorators/save-game-session-swagger.decorator';
import { GameStreamQueryDto } from './dto/game-stream-query.dto';
import {
  GetGameHistoriesQueryDto,
  GetGameHistoriesResponseDto,
} from './dto/get-game-histories.dto';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import {
  GetGameResultReportParamDto,
  GetGameResultReportResponseDto,
} from './dto/get-game-result-report.dto';
import { SaveGameSessionRequestDto, SaveGameSessionResponseDto } from './dto/save-game-session.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(
    private readonly gameFacade: GameFacade,
    private readonly gameService: GamesService,

    private readonly gameStreamService: GameStreamService,
    private readonly gameSessionService: GameSessionService,
  ) {}

  /**
   * @description 게임 옵션 선택 (Public)
   */
  @Get('options')
  @ApiGetGameOptions()
  async getGameOptions(): Promise<GetGameOptionsResponseDto> {
    const gameOptions = await this.gameService.getGameOptions();
    return GetGameOptionsResponseDto.from(gameOptions);
  }

  /**
   * @description 게임 진행 스트림 (Public)
   */
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

  /**
   * @description 게임 세션 저장
   *
   * 회원/비회원 따라 응답 결과가 다름.
   * - Public(비회원): gameSessionId 만 응답
   * - Private(회원): gameSessionId 와 totalScore 응답
   */
  @Post('save')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiSaveGameSession()
  async saveGameSession(
    @Body() dto: SaveGameSessionRequestDto,
    @AuthenticatedUser() user?: { userId: bigint },
  ): Promise<SaveGameSessionResponseDto> {
    const gameSessionResult = await this.gameFacade.saveGameSession({
      categoryId: dto.categoryId,
      difficultyMode: dto.difficultyMode,
      score: dto.score,
      clientAnswers: dto.clientAnswers,
      userId: user?.userId,
    });

    return SaveGameSessionResponseDto.from(
      gameSessionResult.gameSessionId,
      gameSessionResult.totalScore,
    );
  }

  /**
   * @description 게임 세션 히스토리 조회 (본인만 가능)
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @CheckOwnership('userId')
  @ApiGetGameHistories()
  async getGameHistories(
    @Query() query: GetGameHistoriesQueryDto,
  ): Promise<GetGameHistoriesResponseDto> {
    const gameHistories = await this.gameSessionService.getSessionHistories(query);

    return GetGameHistoriesResponseDto.from(gameHistories, query.page, query.size);
  }

  /**
   * @description 게임 결과 리포트 조회 (Public/Private)
   *
   * 회원/비회원 따라 응답 결과가 다름.
   * - Public(비회원): 일부데이터 열람 제한
   * - Private(회원): 전체 데이터 열람 가능
   */
  @Get(':gameSessionId/reports')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiGetGameResultReport()
  async getGameResultReport(
    @Param() param: GetGameResultReportParamDto,
    @AuthenticatedUser() user?: { userId: bigint },
  ): Promise<GetGameResultReportResponseDto> {
    const gameReport = await this.gameSessionService.getGameResultReport(
      param.gameSessionId,
      user?.userId,
    );

    return GetGameResultReportResponseDto.from(gameReport);
  }
}
