import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Attempt, ProgressRepository } from "@/model/progress";

export type { Attempt, ProgressRepository } from "@/model/progress";

const STORAGE_KEY = "@fatiamatica/progress-v1";

export const createProgressRepository = (): ProgressRepository => ({
  async saveAttempt(attempt) {
    const attempts = await this.listAttempts();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...attempts, attempt]));
  },
  async listAttempts() {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as Attempt[]) : [];
    } catch (error) {
      throw new Error(`Could not read local progress: ${String(error)}`);
    }
  }
});
