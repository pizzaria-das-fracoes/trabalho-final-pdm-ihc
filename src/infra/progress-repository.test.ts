/// <reference types="jest" />

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createProgressRepository } from "./progress-repository";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

describe("progress repository", () => {
  it("persists and reads attempts locally", async () => {
    const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
    let value: string | null = null;
    storage.getItem.mockImplementation(async () => value);
    storage.setItem.mockImplementation(async (_key, next) => {
      value = next;
    });

    const repository = createProgressRepository();
    await repository.saveAttempt({
      questionId: "quantity-3-4-20",
      skillCode: "EF06MA09",
      correct: true,
      answer: "15",
      timestamp: "2026-11-17T00:00:00.000Z"
    });

    await expect(repository.listAttempts()).resolves.toEqual([
      expect.objectContaining({ questionId: "quantity-3-4-20", correct: true })
    ]);
  });
});
