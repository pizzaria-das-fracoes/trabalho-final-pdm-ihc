export type Attempt = {
  questionId: string;
  skillCode: string;
  correct: boolean;
  answer: string;
  timestamp: string;
};

export interface ProgressRepository {
  saveAttempt(attempt: Attempt): Promise<void>;
  listAttempts(): Promise<Attempt[]>;
}
