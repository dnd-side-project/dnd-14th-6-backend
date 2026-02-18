import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GameResultReport } from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import { GUEST_MAX_VIEWABLE_PROBLEMS } from '../domain/game.business-rules';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';

@Injectable()
export class GameSessionService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}
  /**
   *
   * @description 게임세션 히스토리 조회
   */
  async getSessionHistories(
    filter: GameSessionHistoryFilterEntity,
  ): Promise<GameSessionHistoryList> {
    return this.gameRepository.getSessionHistoryByFilter(filter);
  }

  /*
   * @description 게임종료후 게임결과 리포트 조회
   * - 비회원: gameSessionId만 사용, 결과데이터 일부 열람 제한
   * - 회원: gameSessionId, userId 모두 사용, 전체 열람 가능
   */
  async getGameResultReport(gameSessionId: bigint, userId?: bigint): Promise<GameResultReport> {
    const gameResultReport = await this.gameRepository.findGameResultReport(gameSessionId);

    if (!gameResultReport) {
      throw new NotFoundException('존재하지 않는 게임 세션입니다.');
    }

    if (gameResultReport.isGuest) {
      return gameResultReport.toGuestView(GUEST_MAX_VIEWABLE_PROBLEMS);
    }

    if (userId && userId !== gameResultReport.summary.userId) {
      throw new ForbiddenException('해당 게임 결과 리포트에 접근할 수 없습니다.');
    }

    return gameResultReport;
  }
  // FIXME 게임결과 저장 (createGameSession) 리팩터링 이관 (#41)
  /*
   * @description 게임 세션에 유저 ID 연동
   */
  async attachUserToSession(sessionId: bigint, userId: bigint): Promise<void> {
    const isAttached = await this.gameRepository.updateUserIdToGameSession(sessionId, userId);

    if (!isAttached) {
      throw new NotFoundException('연결할 게임 세션을 찾을 수 없습니다.');
    }
  }
}
