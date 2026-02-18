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

import { CheckOwnership } from '@auth/presentation/decorators/check-ownership.decorator';
import { JwtAuthGuard } from '@auth/presentation/guards/jwt-auth.guard';
import { UserOwnershipGuard } from '@auth/presentation/guards/user-ownership.guard';
import { Request, Response } from 'express';
import { Subject } from 'rxjs';

import { GameSessionService } from '../application/game-session.service';
import { GameStreamService } from '../application/game-stream.service';
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

  /**
   * @description 게임 세션 히스토리 조회 (본인만 가능)
   */
  @Post('save')
  @ApiSaveGameSession()
  async saveGameSession(
    @Body() dto: SaveGameSessionRequestDto,
  ): Promise<SaveGameSessionResponseDto> {
    // FIXME: 회원용 AuthGuard 붙이기
    // FIXME: 회원연결시 user_id 매핑
    const gameSessionId = await this.gameService.createGameSession({
      categoryId: dto.categoryId,
      difficultyMode: dto.difficultyMode,
      score: dto.score,
      clientAnswers: dto.clientAnswers,
    });

    // FIXME: (회원 한정) 게임세션 저장후
    // user 도메인이 연관되므로 Facade application 계층 추가
    // user_id에 매핑된 게임세션들의 score들을 합산하여 User.totalScore 업데이트 (#32)
    // 회원인경우에는 totalScore도 같이 리스폰스하도록 응답DTO(SaveGameSessionResponseDto) 업데이트
    return SaveGameSessionResponseDto.from(gameSessionId);
  }

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

  @Get(':gameSessionId/reports')
  @ApiGetGameResultReport()
  async getGameResultReport(
    @Param() param: GetGameResultReportParamDto,
  ): Promise<GetGameResultReportResponseDto> {
    // FIXME: 회원용 AuthGuard 붙이기
    // FIXME: 회원용 userId 파라미터 인자로 붙이기
    const gameReport = await this.gameSessionService.getGameResultReport(param.gameSessionId);

    return GetGameResultReportResponseDto.from(gameReport);
  }
}
