import { Injectable } from '@nestjs/common';

import { GamesService } from '@games/application/games.service';
import { UserMistakeAnalysis } from '@games/domain/user-mistake-analysis.entity';

@Injectable()
export class UsersFacade {
  constructor(private readonly gamesService: GamesService) {}

  /**
   * @description 유저의 실수(많이 틀린 카테고리, 자주 틀린 명령어) 분석 조회
   */
  async getUserAnalysis(userId: bigint): Promise<UserMistakeAnalysis> {
    return this.gamesService.getUserMistakeAnalysis(userId);
  }
}
