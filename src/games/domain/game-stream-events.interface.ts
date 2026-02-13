export interface TimerEventData {
  remainingSeconds: number;
}

export interface ProblemEventData {
  problemId: string;
  title: string;
  subCategory: string;
  text: string;
  answer: string;
  point: number;
  difficulty: string;
}

export interface EndEventData {
  message: string;
}
