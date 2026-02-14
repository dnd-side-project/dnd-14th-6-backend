export class FrequentWrongCommand {
  private constructor(
    readonly category: string,
    readonly subCategory: string,
    readonly wrongCount: number,
  ) {}

  static from(
    data: Pick<FrequentWrongCommand, 'category' | 'subCategory' | 'wrongCount'>,
  ): FrequentWrongCommand {
    return new FrequentWrongCommand(data.category, data.subCategory, data.wrongCount);
  }
}

export class FrequentWrongCategory {
  private constructor(
    readonly category: string,
    readonly wrongRatio: number,
    readonly wrongCount: number,
    readonly iconUrl: string | null,
  ) {}

  static from(
    data: Pick<FrequentWrongCategory, 'category' | 'wrongRatio' | 'wrongCount' | 'iconUrl'>,
  ): FrequentWrongCategory {
    return new FrequentWrongCategory(data.category, data.wrongRatio, data.wrongCount, data.iconUrl);
  }
}

export class UserMistakeAnalysis {
  private constructor(
    readonly frequentWrongCommands: FrequentWrongCommand[],
    readonly frequentWrongCategories: FrequentWrongCategory[],
  ) {}

  static from(
    data: Pick<UserMistakeAnalysis, 'frequentWrongCommands' | 'frequentWrongCategories'>,
  ): UserMistakeAnalysis {
    return new UserMistakeAnalysis(data.frequentWrongCommands, data.frequentWrongCategories);
  }
}
