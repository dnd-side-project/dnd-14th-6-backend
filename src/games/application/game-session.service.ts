import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { GameResultReport } from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
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
   */
  async getGameResultReport(gameSessionId: bigint): Promise<GameResultReport> {
    // FIXME 비회원일 경우 결과 데이터 다르게 응답하도록 수정
    // 1. 비회원 - 데이터 응답 제한사항
    // - 문제해설: 1~10번 문제만 문제해설 열람 가능
    // - 문제별 시도횟수: 열람 제한
    // - 획득한 스코어: 열람제한
    // - 정답률: 열람제한

    const gameResultReport = await this.gameRepository.findGameResultReport(gameSessionId);

    if (!gameResultReport) {
      throw new NotFoundException('존재하지 않는 게임 세션입니다.');
    }

    return gameResultReport;
  }
  // FIXME 게임결과 저장 (createGameSession) 리팩터링 이관 (#41)
}
