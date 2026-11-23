import type { Attempt, PlayerProfile } from "@/model/entities/progress";

export interface IProgressDataSource {
  saveAttempt(attempt: Attempt): Promise<void>;
  listAttempts(): Promise<Attempt[]>;
  getProfile(): Promise<PlayerProfile>;
  saveProfile(profile: PlayerProfile): Promise<void>;
  resetAll(): Promise<void>;
  onProgressChanged(callback: () => void): () => void;
}
