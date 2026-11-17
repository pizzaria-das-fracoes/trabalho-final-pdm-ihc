import type { Attempt, ProgressRepository } from "@/model/progress";

export const recordAttempt = async (
  repository: ProgressRepository,
  attempt: Omit<Attempt, "timestamp">
) => {
  await repository.saveAttempt({ ...attempt, timestamp: new Date().toISOString() });
};
