import { GameSessionSortBy, SortOrder } from './game.business-rules';

export class GameSessionHistoryFilterEntity {
  private constructor(
    public readonly userId: bigint,
    public readonly page: number,
    public readonly size: number,
    public readonly sortBy: GameSessionSortBy,
    public readonly sortOrder: SortOrder,
    public readonly search?: string,
    public readonly startDate?: string,
    public readonly endDate?: string,
    public readonly categories?: string[],
    public readonly difficultyModes?: string[],
  ) {}

  static from(
    data: Pick<
      GameSessionHistoryFilterEntity,
      | 'userId'
      | 'page'
      | 'size'
      | 'sortBy'
      | 'sortOrder'
      | 'search'
      | 'startDate'
      | 'endDate'
      | 'categories'
      | 'difficultyModes'
    >,
  ) {
    return new GameSessionHistoryFilterEntity(
      data.userId,
      data.page,
      data.size,
      data.sortBy,
      data.sortOrder,
      data.search,
      data.startDate,
      data.endDate,
      data.categories,
      data.difficultyModes,
    );
  }
}
