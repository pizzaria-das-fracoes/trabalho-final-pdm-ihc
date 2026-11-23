import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import { DEFAULT_PROFILE, type Attempt, type PlayerProfile } from "@/model/entities/progress";

export class MemoryProgressDataSource implements IProgressDataSource {
  private attempts: Attempt[] = [];
  private profile: PlayerProfile = { ...DEFAULT_PROFILE };
  private readonly listeners = new Set<() => void>();

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  async saveAttempt(attempt: Attempt): Promise<void> {
    this.attempts = [...this.attempts, attempt];
    this.notify();
  }

  async listAttempts(): Promise<Attempt[]> {
    return [...this.attempts];
  }

  async getProfile(): Promise<PlayerProfile> {
    return {
      ...this.profile,
      unlockedHats: [...this.profile.unlockedHats],
      unlockedToppings: [...this.profile.unlockedToppings],
      unlockedTitles: [...this.profile.unlockedTitles],
      worldStars: { ...this.profile.worldStars },
      achievements: [...this.profile.achievements]
    };
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    this.profile = {
      ...profile,
      unlockedHats: [...profile.unlockedHats],
      unlockedToppings: [...profile.unlockedToppings],
      unlockedTitles: [...profile.unlockedTitles],
      worldStars: { ...profile.worldStars },
      achievements: [...profile.achievements]
    };
    this.notify();
  }

  async resetAll(): Promise<void> {
    this.attempts = [];
    this.profile = { ...DEFAULT_PROFILE };
    this.notify();
  }

  onProgressChanged(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
