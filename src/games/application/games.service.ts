import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { GameOptions } from '../domain/game-options.entity';
import { GameProblem } from '../domain/game-problem.entity';
import { ProblemDifficulty, calculateServerScore } from '../domain/game.business-rules';
import { CreateGameSessionServiceRequestDto } from './service-dto/create-game-session.service-dto';
import { ClientAnswer } from '../domain/game-client-answers.interface';

@Injectable()
export class GamesService {
  constructor(@Inject(GAME_REPOSITORY) private readonly gameRepository: IGameRepository) {}

  /**
   * @description 게임옵션(카테고리, 게임난이도) 목록 조회
   * - 게임난이도: Easy | Normal | Hard | Random
   */
  async getGameOptions(): Promise<GameOptions> {
    const categories = await this.gameRepository.getCategories();
    return GameOptions.from(categories);
  }

  /**
   *
   * @description 게임세션 저장
   */
  async createGameSession(command: CreateGameSessionServiceRequestDto): Promise<bigint> {
    const serverScore = await this.validateAndCalculateScore(
      command.categoryId,
      command.clientAnswers,
    );

    return this.gameRepository.saveGameSession({
      categoryId: command.categoryId,
      difficultyMode: command.difficultyMode,
      score: serverScore,
      totalProblemCount: command.clientAnswers.length,
      correctProblemCount: command.clientAnswers.filter((a) => a.solved).length,
      logs: command.clientAnswers.map((a) => ({
        problemId: BigInt(a.problemId),
        inputs: a.inputs,
        isSolved: a.solved,
        tryCount: a.inputs.length,
      })),
    });
  }

  /**
   * @description 클라이언트 게임 데이터 검증 후 서버 점수 계산
   */
  private async validateAndCalculateScore(
    categoryId: number,
    clientAnswers: ClientAnswer[],
  ): Promise<number> {
    await this.validateCategory(categoryId);
    const problems = await this.validateGameProblems(clientAnswers);
    this.validateAnswerIntegrity(clientAnswers);
    return this.calculateScore(clientAnswers, problems);
  }

  /**
   *
   * @description 게임 카테고리 검증
   */
  private async validateCategory(categoryId: number): Promise<void> {
    const exists = await this.gameRepository.categoryExists(categoryId);
    if (!exists) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
  }

  /**
   * @description 클라이언트가 푼 게임문제 검증
   */
  private async validateGameProblems(clientAnswers: ClientAnswer[]): Promise<GameProblem[]> {
    if (clientAnswers.length === 0) {
      return [];
    }

    const problemIds = clientAnswers.map((a) => BigInt(a.problemId));
    const uniqueProblemIds = [...new Set(problemIds)];
    const problems = await this.gameRepository.findProblemsByIds(uniqueProblemIds);

    if (problems.length !== uniqueProblemIds.length) {
      const foundIds = new Set(problems.map((p) => p.id));
      const missingIds = problemIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: ${missingIds.join(', ')})`,
      );
    }

    return problems;
  }

  /**
   * @description 클라이언트 문제풀이 정답/오답 검증
   */
  private validateAnswerIntegrity(clientAnswers: ClientAnswer[]): void {
    const invalid = clientAnswers.find(
      (a) => a.solved && !a.inputs.some((input) => input.isCorrect),
    );
    if (invalid) {
      throw new BadRequestException(
        '데이터 무결성 오류: solved가 true이지만 정답 처리된 입력이 없습니다.',
      );
    }
  }

  /**
   * @description 클라이언트 점수 데이터가 올바르게 계산됐는지 재검증
   */
  private calculateScore(clientAnswers: ClientAnswer[], problems: GameProblem[]): number {
    const problemMap = new Map(problems.map((p) => [p.id, p]));
    const solvedDifficulties: ProblemDifficulty[] = clientAnswers
      .filter((a) => a.solved)
      .map((a) => {
        const problem = problemMap.get(BigInt(a.problemId))!;
        return problem.difficulty;
      });

    return calculateServerScore(solvedDifficulties);
  }
}
