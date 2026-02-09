import { Inject, Injectable } from '@nestjs/common';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameOptions } from '../domain/game-options.entity';
import { UserMistakeAnalysis } from '../domain/user-mistake-analysis.entity';

@Injectable()
export class GamesService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  async getGameOptions(): Promise<GameOptions> {
    const categories = await this.gameRepository.getCategories();
    return GameOptions.from(categories);
  }

  /**
   * @description 사용자의 명령어, 카테고리 실수 분석 조회
   * - 자주 틀린 명령어 Top 5 (서브 카테고리 별)
   * - 자주 틀린 카테고리 (오답 비율 포함)
   */
  async getUserMistakeAnalysis(userId: bigint): Promise<UserMistakeAnalysis> {
    const [frequentWrongCommands, frequentWrongCategories] = await Promise.all([
      this.gameRepository.getFrequentWrongCommands(userId),
      this.gameRepository.getFrequentWrongCategories(userId),
    ]);

    return UserMistakeAnalysis.from({
      frequentWrongCommands,
      frequentWrongCategories,
    });
  }
}
