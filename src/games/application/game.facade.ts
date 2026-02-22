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
   *
   * - 클라이언트의 입력데이터가 올바른 형태인지 유효성 검증하고 서버에서 게임점수를 한번더 재검증합니다. 재검증된 게임점수를 serverScore라 합니다.
   * - 검증된 점수 serverScore 를 게임세션에 테이블에 저장합니다.
   * - 유저의 경우에는 유저의 totalScore에  serverScore 을 누적합니다.
   * - totalScore 업데이트로 티어등급이 유저의 현재 티어등급과 다르다면, 승급되었으므로 totalScore 기반의 티어등급으로 업데이트합니다.
   */
  @Transactional()
  async saveGameSession(
    facadeDto: SaveGameSessionFacadeRequestDto,
  ): Promise<SaveGameSessionFacadeResponseDto> {
    const serverScore = await this.gameSessionService.validateAndCalculateScore(
      facadeDto.categoryId,
      facadeDto.clientAnswers,
    );

    const gameSessionId = await this.gameSessionService.createGameSession({
      categoryId: facadeDto.categoryId,
      difficultyMode: facadeDto.difficultyMode,
      score: serverScore,
      clientAnswers: facadeDto.clientAnswers,
      userId: facadeDto.userId,
    });

    let totalScore: bigint | undefined = undefined;
    if (facadeDto.userId) {
      totalScore = await this.updateTotalScoreAndTierForUser(facadeDto.userId, serverScore);
    }

    return {
      gameSessionId,
      totalScore,
    };
  }

  /*
   * @description (유저용) 게임결과 저장이후 유저의 totalScore와 totalScore 업데이트로 인해 유저의 티어 업데이트
   */
  private async updateTotalScoreAndTierForUser(
    userId: bigint,
    serverScore: number,
  ): Promise<bigint> {
    const totalScore = await this.userService.incrementTotalScore(userId, BigInt(serverScore));

    const currentUser = await this.userService.findById(userId);
    const newTier = await this.tiersService.findTierByUserTotalScore(totalScore);
    if (currentUser.tierId !== newTier.id) {
      await this.userService.updateTierId(userId, newTier.id);
    }

    return totalScore;
  }
}
