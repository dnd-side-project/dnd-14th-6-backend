export interface ClientAnswerInput {
  input: string;
  isCorrect: boolean;
}

export interface ClientAnswer {
  problemId: string;
  inputs: ClientAnswerInput[];
  solved: boolean;
}
