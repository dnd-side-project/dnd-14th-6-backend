import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ClientAnswer } from '../domain/game-client-answers.interface';
import { GameProblem } from '../domain/game-problem.entity';
import { GameResultReport } from '../domain/game-result-report.entity';
import { GameSessionHistoryFilterEntity } from '../domain/game-session-history-filter.entity';
import { GameSessionHistoryList } from '../domain/game-session-history.entity';
import {
  calculateServerScore,
  GUEST_MAX_VIEWABLE_PROBLEMS,
  ProblemDifficulty,
} from '../domain/game.business-rules';
import { GAME_REPOSITORY, IGameRepository } from '../domain/games.repository.interface';
import { SaveGameSessionEntity, SaveGameSessionLog } from '../domain/save-game-session.entity';
import { CreateGameSessionServiceRequestDto } from './service-dto/create-game-session.service-dto';

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
   * (1) 응답데이터
   * - 비회원: gameSessionId만 사용, 결과데이터 일부 열람 제한
   * - 회원: gameSessionId, userId 모두 사용, 전체 열람 가능
   *
   * (2) 열람제어
   * - 비회원은 다른 비회원의 게임결과 리포트를 열람할 수 있다.
   * - 회원은 비회원의 게임결과 리포트를 열람할 수 있다.
   * - 비회원은 회원의 게임결과 리포트를 열람할 수 없다. (403 예외 발생)
   * - 회원은 다른회원의 게임결과 리포트를 열람할 수 없다. (403 예외 발생)
   */
  async getGameResultReport(gameSessionId: bigint, userId?: bigint): Promise<GameResultReport> {
    const gameResultReport = await this.gameRepository.findGameResultReport(gameSessionId);

    if (!gameResultReport) {
      throw new NotFoundException('존재하지 않는 게임 세션입니다.');
    }

    if (gameResultReport.isGuest) {
      return gameResultReport.toGuestView(GUEST_MAX_VIEWABLE_PROBLEMS);
    }

    if (!userId || userId !== gameResultReport.summary.userId) {
      throw new ForbiddenException('해당 게임 결과 리포트에 접근할 수 없습니다.');
    }

    return gameResultReport;
  }

  /*
   * @description 게임세션 저장
   */
  async createGameSession(serviceDto: CreateGameSessionServiceRequestDto): Promise<bigint> {
    return this.gameRepository.saveGameSession(
      SaveGameSessionEntity.from({
        categoryId: serviceDto.categoryId,
        difficultyMode: serviceDto.difficultyMode,
        score: serviceDto.score,
        userId: serviceDto.userId,
        totalProblemCount: serviceDto.clientAnswers.length,
        correctProblemCount: serviceDto.clientAnswers.filter((a) => a.solved).length,
        logs: serviceDto.clientAnswers.map((a) =>
          SaveGameSessionLog.from({
            problemId: BigInt(a.problemId),
            inputs: a.inputs,
            isSolved: a.solved,
            tryCount: a.inputs.length,
          }),
        ),
      }),
    );
  }

  /*
   * @description 게임 세션에 유저 ID 연동
   */
  async attachUserToSession(sessionId: bigint, userId: bigint): Promise<void> {
    const isAttached = await this.gameRepository.updateUserIdToGameSession(sessionId, userId);

    if (!isAttached) {
      throw new NotFoundException('연결할 게임 세션을 찾을 수 없습니다.');
    }
  }

  /**
   * @description 클라이언트 게임 데이터 검증 후 서버 점수 계산
   */
  async validateAndCalculateScore(
    categoryId: number,
    clientAnswers: ClientAnswer[],
  ): Promise<number> {
    this.validateAnswerIntegrity(clientAnswers);

    const [, problems] = await Promise.all([
      this.validateCategory(categoryId),
      this.validateAndMatchedGameProblems(clientAnswers),
    ]);
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
  private async validateAndMatchedGameProblems(
    clientAnswers: ClientAnswer[],
  ): Promise<GameProblem[]> {
    const problemIds = clientAnswers.map((a) => BigInt(a.problemId));
    const uniqueProblemIds = [...new Set(problemIds)];

    if (uniqueProblemIds.length !== problemIds.length) {
      throw new BadRequestException('clientAnswers에 중복된 problemId가 포함되어 있습니다.');
    }

    const problems = await this.gameRepository.findProblemsByIds(uniqueProblemIds);

    if (problems.length !== uniqueProblemIds.length) {
      const foundIds = new Set(problems.map((p) => p.id));
      const missingIds = uniqueProblemIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `존재하지 않는 문제 ID가 포함되어 있습니다. (problemId: ${missingIds.join(', ')})`,
      );
    }

    return problems;
  }

  /**
   * @description 클라이언트 문제풀이 입력데이터가 정답인지 검증
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
