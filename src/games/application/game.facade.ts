import { Injectable } from '@nestjs/common';

import { Transactional } from '@nestjs-cls/transactional';

import { TiersService } from '@tiers/application/tiers.service';
import { UsersService } from '@users/application/users.service';

import {
  SaveGameSessionFacadeRequestDto,
  SaveGameSessionFacadeResponseDto,
} from './facade-dto/save-game-session.facade-dto';
import { GameSessionService } from './game-session.service';

@Injectable()
export class GameFacade {
  constructor(
    private readonly gameSessionService: GameSessionService,
    private readonly userService: UsersService,
    private readonly tiersService: TiersService,
  ) {}

  /*
   * @description 게임 세션 저장
   */
  @Transactional()
  async saveGameSession(
    facadeDto: SaveGameSessionFacadeRequestDto,
  ): Promise<SaveGameSessionFacadeResponseDto> {
    // 클라이언트값의 facadeDto.score가 검증된 점수인지 확인.
    const serverScore = await this.gameSessionService.validateAndCalculateScore(
      facadeDto.categoryId,
      facadeDto.clientAnswers,
    );

    // 게임세션 저장
    const gameSessionId = await this.gameSessionService.createGameSession({
      categoryId: facadeDto.categoryId,
      difficultyMode: facadeDto.difficultyMode,
      score: serverScore,
      clientAnswers: facadeDto.clientAnswers,
      userId: facadeDto.userId,
    });

    let totalScore: bigint | undefined = undefined;
    if (facadeDto.userId) {
      // (회원인경우) 유저의 totalScore에 서버 점수를 증분 업데이트
      totalScore = await this.userService.incrementTotalScore(
        facadeDto.userId,
        BigInt(serverScore),
      );

      // 티어 승급 체크 & 업데이트
      const newTier = await this.tiersService.findTierByScore(totalScore);
      if (newTier) {
        await this.userService.updateTierId(facadeDto.userId, newTier.id);
      }
    }

    return {
      gameSessionId,
      totalScore,
    };
  }
}
