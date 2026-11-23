/// <reference types="jest" />

import { AsyncStorageProgressDataSource } from "@/infra/datasources/asyncStorageProgressDataSource";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";

describe("progress data sources", () => {
  it("persists and reads attempts and player profile in memory datasource", async () => {
    const dataSource = new MemoryProgressDataSource();
    await dataSource.resetAll();

    await dataSource.saveAttempt({
      questionId: "qty-3-4-20",
      worldId: "quantity",
      correct: true,
      answer: "15",
      timestamp: "2026-11-17T00:00:00.000Z"
    });

    await expect(dataSource.listAttempts()).resolves.toEqual([
      expect.objectContaining({ questionId: "qty-3-4-20", correct: true })
    ]);

    const profile = await dataSource.getProfile();
    expect(profile.coins).toBe(30);
  });

  it("persists and resets via AsyncStorageProgressDataSource", async () => {
    const dataSource = new AsyncStorageProgressDataSource();
    await dataSource.resetAll();

    await dataSource.saveAttempt({
      questionId: "pizza-3-4",
      worldId: "pizza",
      correct: true,
      answer: "3/4",
      timestamp: "2026-11-17T00:00:00.000Z"
    });

    await expect(dataSource.listAttempts()).resolves.toHaveLength(1);
    const profile = await dataSource.getProfile();
    expect(profile.coins).toBe(30);
  });
});
