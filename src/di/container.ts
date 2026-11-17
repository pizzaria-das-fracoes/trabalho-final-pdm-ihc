import { createProgressRepository } from "@/infra/progress-repository";

export const container = {
  progressRepository: createProgressRepository()
};
