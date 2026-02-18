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

  /**
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

    // FIXME: 플레이한 회원만 볼 수 있도록 수정
    // gameResultReport.summary.userId 와 userId가 다르면 접근제한추가
    if (userId && userId !== gameResultReport.summary.userId) {
      throw new ForbiddenException('해당 게임 결과 리포트에 접근할 수 없습니다.');
    }

    return gameResultReport;
  }
  // FIXME 게임결과 저장 (createGameSession) 리팩터링 이관 (#41)
}
