import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import { ACHIEVEMENTS } from "@/model/entities/game";
import type { Attempt, PlayerProfile } from "@/model/entities/progress";
import type { ISoundService, SoundEffect } from "@/model/services/iSoundService";
import type { AttemptReward, IProgressUseCases, ProgressSnapshot } from "@/usecase/iProgressUseCases";

export class ProgressUseCases implements IProgressUseCases {
  constructor(
    private readonly progressDataSource: IProgressDataSource,
    private readonly soundService: ISoundService
  ) {}

  async loadProgress(): Promise<ProgressSnapshot> {
    const [profile, attempts] = await Promise.all([
      this.progressDataSource.getProfile(),
      this.progressDataSource.listAttempts()
    ]);
    return { profile, attempts };
  }

  onProgressChanged(callback: () => void): () => void {
    return this.progressDataSource.onProgressChanged(callback);
  }

  async recordAttempt(attempt: Omit<Attempt, "timestamp">): Promise<AttemptReward> {
    const fullAttempt: Attempt = { ...attempt, timestamp: new Date().toISOString() };
    await this.progressDataSource.saveAttempt(fullAttempt);

    const [profile, attempts] = await Promise.all([
      this.progressDataSource.getProfile(),
      this.progressDataSource.listAttempts()
    ]);

    const newStreak = attempt.correct ? profile.streak + 1 : 0;
    const bestStreak = Math.max(profile.bestStreak, newStreak);
    const comboBonus = attempt.correct && newStreak >= 3 ? 5 : 0;
    const xpEarned = attempt.correct ? 20 + comboBonus : 5;
    const coinsEarned = attempt.correct ? 10 + (newStreak >= 3 ? 5 : 0) : 0;

    const updated: PlayerProfile = {
      ...profile,
      xp: profile.xp + xpEarned,
      coins: profile.coins + coinsEarned,
      streak: newStreak,
      bestStreak
    };

    const totalCorrect = attempts.filter((a) => a.correct).length;
    const newlyUnlockedAchievements: string[] = [];
    for (const achievement of ACHIEVEMENTS) {
      if (!updated.achievements.includes(achievement.id) && achievement.check(updated, totalCorrect)) {
        updated.achievements = [...updated.achievements, achievement.id];
        newlyUnlockedAchievements.push(achievement.title);
      }
    }

    await this.progressDataSource.saveProfile(updated);

    return {
      xpEarned,
      coinsEarned,
      newStreak,
      newlyUnlockedAchievements,
      profile: updated
    };
  }

  async awardWorldStars(worldId: string, stars: number): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const previous = profile.worldStars[worldId] ?? 0;
    const bestStars = Math.max(previous, Math.min(3, Math.max(0, stars)));
    const bonusCoins = bestStars > previous ? (bestStars - previous) * 15 : 5;

    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins + bonusCoins,
      xp: profile.xp + 25,
      worldStars: { ...profile.worldStars, [worldId]: bestStars }
    };

    const attempts = await this.progressDataSource.listAttempts();
    const totalCorrect = attempts.filter((a) => a.correct).length;
    for (const achievement of ACHIEVEMENTS) {
      if (!updated.achievements.includes(achievement.id) && achievement.check(updated, totalCorrect)) {
        updated.achievements = [...updated.achievements, achievement.id];
      }
    }

    await this.progressDataSource.saveProfile(updated);
    return updated;
  }

  async recordArcadeScore(score: number): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const coinsEarned = Math.max(5, Math.floor(score / 10));
    const updated: PlayerProfile = {
      ...profile,
      coins: profile.coins + coinsEarned,
      xp: profile.xp + Math.max(15, Math.floor(score / 5)),
      arcadeHighScore: Math.max(profile.arcadeHighScore, score)
    };
    const attempts = await this.progressDataSource.listAttempts();
    const totalCorrect = attempts.filter((a) => a.correct).length;
    for (const achievement of ACHIEVEMENTS) {
      if (!updated.achievements.includes(achievement.id) && achievement.check(updated, totalCorrect)) {
        updated.achievements = [...updated.achievements, achievement.id];
      }
    }
    await this.progressDataSource.saveProfile(updated);
    return updated;
  }

  async toggleSound(): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const updated: PlayerProfile = { ...profile, soundEnabled: !profile.soundEnabled };
    await this.progressDataSource.saveProfile(updated);
    return updated;
  }

  async updateChefName(rawName: string): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const clean = rawName.trim().slice(0, 18) || "Chef";
    const updated: PlayerProfile = { ...profile, chefName: clean };
    await this.progressDataSource.saveProfile(updated);
    return updated;
  }

  async resetProgress(): Promise<PlayerProfile> {
    await this.progressDataSource.resetAll();
    return this.progressDataSource.getProfile();
  }

  playSound(effect: SoundEffect, enabled: boolean): void {
    this.soundService.play(effect, enabled);
  }
}
