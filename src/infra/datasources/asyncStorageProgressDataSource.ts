import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import { DEFAULT_PROFILE, type Attempt, type PlayerProfile } from "@/model/entities/progress";
import { DataSourceError } from "@/model/errors";

const ATTEMPTS_KEY = "@fatiamatica/progress-v2";
const PROFILE_KEY = "@fatiamatica/profile-v2";

export class AsyncStorageProgressDataSource implements IProgressDataSource {
  private readonly memoryFallback = new Map<string, string>();
  private readonly listeners = new Set<() => void>();

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private async readKey(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) return value;
    } catch (_err: unknown) {
      // Fallback to in-memory cache when native storage is unavailable
    }
    return this.memoryFallback.get(key) ?? null;
  }

  private async writeKey(key: string, value: string): Promise<void> {
    this.memoryFallback.set(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (_err: unknown) {
      // Keep in-memory cache when native storage is unavailable
    }
  }

  private async removeKey(key: string): Promise<void> {
    this.memoryFallback.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch (_err: unknown) {
      // Keep in-memory cleanup consistent
    }
  }

  async saveAttempt(attempt: Attempt): Promise<void> {
    try {
      const attempts = await this.listAttempts();
      await this.writeKey(ATTEMPTS_KEY, JSON.stringify([...attempts, attempt]));
      this.notify();
    } catch (err: unknown) {
      throw new DataSourceError(err instanceof Error ? err.message : "Erro ao salvar tentativa");
    }
  }

  async listAttempts(): Promise<Attempt[]> {
    const value = await this.readKey(ATTEMPTS_KEY);
    if (!value) return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as Attempt[]) : [];
    } catch (_err: unknown) {
      return [];
    }
  }

  async getProfile(): Promise<PlayerProfile> {
    const value = await this.readKey(PROFILE_KEY);
    if (!value) return { ...DEFAULT_PROFILE };
    try {
      const parsed = JSON.parse(value) as Partial<PlayerProfile>;
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        unlockedHats: Array.isArray(parsed.unlockedHats)
          ? parsed.unlockedHats
          : DEFAULT_PROFILE.unlockedHats,
        unlockedToppings: Array.isArray(parsed.unlockedToppings)
          ? parsed.unlockedToppings
          : DEFAULT_PROFILE.unlockedToppings,
        unlockedTitles: Array.isArray(parsed.unlockedTitles)
          ? parsed.unlockedTitles
          : DEFAULT_PROFILE.unlockedTitles,
        chefName:
          typeof parsed.chefName === "string" && parsed.chefName.trim()
            ? parsed.chefName.trim()
            : DEFAULT_PROFILE.chefName,
        worldStars: parsed.worldStars ?? {},
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : []
      };
    } catch (_err: unknown) {
      return { ...DEFAULT_PROFILE };
    }
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    try {
      await this.writeKey(PROFILE_KEY, JSON.stringify(profile));
      this.notify();
    } catch (err: unknown) {
      throw new DataSourceError(err instanceof Error ? err.message : "Erro ao salvar perfil");
    }
  }

  async resetAll(): Promise<void> {
    try {
      await this.removeKey(ATTEMPTS_KEY);
      await this.removeKey(PROFILE_KEY);
      this.notify();
    } catch (err: unknown) {
      throw new DataSourceError(err instanceof Error ? err.message : "Erro ao redefinir dados");
    }
  }

  onProgressChanged(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
