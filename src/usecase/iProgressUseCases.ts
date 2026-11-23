import type { Attempt, PlayerProfile } from "@/model/entities/progress";
import type { SoundEffect } from "@/model/services/iSoundService";

export type AttemptReward = {
  xpEarned: number;
  coinsEarned: number;
  newStreak: number;
  newlyUnlockedAchievements: string[];
  profile: PlayerProfile;
};

export type ProgressSnapshot = {
  profile: PlayerProfile;
  attempts: Attempt[];
};

export interface IProgressUseCases {
  loadProgress(): Promise<ProgressSnapshot>;
  onProgressChanged(callback: () => void): () => void;
  recordAttempt(attempt: Omit<Attempt, "timestamp">): Promise<AttemptReward>;
  awardWorldStars(worldId: string, stars: number): Promise<PlayerProfile>;
  recordArcadeScore(score: number): Promise<PlayerProfile>;
  toggleSound(): Promise<PlayerProfile>;
  updateChefName(rawName: string): Promise<PlayerProfile>;
  resetProgress(): Promise<PlayerProfile>;
  playSound(effect: SoundEffect, enabled: boolean): void;
}
