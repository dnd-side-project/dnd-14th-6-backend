import { Injectable } from '@nestjs/common';

import { UsersService } from '@users/application/users.service';

import {
  SaveGameSessionFacadeRequestDto,
  SaveGameSessionFacadeResponseDto,
} from './facade-dto/create-game-session.service-dto';
import { GameSessionService } from './game-session.service';
import { GamesService } from './games.service';

@Injectable()
export class GameFacade {
  constructor(
    private readonly gameService: GamesService,
    private readonly gameSessionService: GameSessionService,
    private readonly userService: UsersService,
  ) {}

  /*
   * @description 게임 세션 저장
   */
  async saveGameSession(
    facadeDto: SaveGameSessionFacadeRequestDto,
  ): Promise<SaveGameSessionFacadeResponseDto> {
    const gameSessionId = await this.gameSessionService.createGameSession({
      categoryId: facadeDto.categoryId,
      difficultyMode: facadeDto.difficultyMode,
      score: facadeDto.score,
      clientAnswers: facadeDto.clientAnswers,
      userId: facadeDto.userId,
    });

    let totalScore: bigint | undefined = undefined;
    if (facadeDto.userId) {
      totalScore = await this.gameSessionService.getTotalScoreByUserId(facadeDto.userId);
      await this.userService.updateTotalScore(facadeDto.userId, totalScore);
    }

    return {
      gameSessionId,
      totalScore,
    };
  }
}
