import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import { ProgressUseCases } from "@/usecase/progressUseCases";

describe("ProgressUseCases — regras de progresso, combo, estrelas e perfil", () => {
  const createSubject = () => {
    const dataSource = new MemoryProgressDataSource();
    const soundService = new MemorySoundService();
    const useCases = new ProgressUseCases(dataSource, soundService);
    return { dataSource, soundService, useCases };
  };

  it("aplica bônus de combo a partir de 3 acertos seguidos e reinicia sequência no erro", async () => {
    const { useCases } = createSubject();

    const r1 = await useCases.recordAttempt({ questionId: "q1", worldId: "pizza", correct: true, answer: "3/4" });
    expect(r1).toMatchObject({ xpEarned: 20, coinsEarned: 10, newStreak: 1 });
    expect(r1.newlyUnlockedAchievements).toContain("Primeira Fornada");

    const r2 = await useCases.recordAttempt({ questionId: "q2", worldId: "pizza", correct: true, answer: "1/2" });
    expect(r2).toMatchObject({ xpEarned: 20, coinsEarned: 10, newStreak: 2 });

    const r3 = await useCases.recordAttempt({ questionId: "q3", worldId: "pizza", correct: true, answer: "2/3" });
    expect(r3).toMatchObject({ xpEarned: 25, coinsEarned: 15, newStreak: 3 });
    expect(r3.newlyUnlockedAchievements).toContain("Combo Quentinho");

    const miss = await useCases.recordAttempt({ questionId: "q4", worldId: "pizza", correct: false, answer: "1/4" });
    expect(miss).toMatchObject({ xpEarned: 5, coinsEarned: 0, newStreak: 0 });
    expect(miss.profile.bestStreak).toBe(3);
  });

  it("limita estrelas entre 0 e 3 e recompensa apenas evolução positiva no mapa", async () => {
    const { useCases } = createSubject();

    const first = await useCases.awardWorldStars("pizza", 2);
    expect(first.worldStars.pizza).toBe(2);
    expect(first.coins).toBe(60); // 30 iniciais + 2 * 15

    const sameOrLower = await useCases.awardWorldStars("pizza", 1);
    expect(sameOrLower.worldStars.pizza).toBe(2);
    expect(sameOrLower.coins).toBe(65); // bônus de replay +5

    const clampedHigh = await useCases.awardWorldStars("compare", 99);
    expect(clampedHigh.worldStars.compare).toBe(3);
  });

  it("registra recorde do Arcade e desbloqueia conquista Raio da Pizzaria", async () => {
    const { useCases } = createSubject();

    const high = await useCases.recordArcadeScore(120);
    expect(high.arcadeHighScore).toBe(120);
    expect(high.coins).toBe(42);
    expect(high.achievements).toContain("arcade-hero");

    const lower = await useCases.recordArcadeScore(20);
    expect(lower.arcadeHighScore).toBe(120);
    expect(lower.coins).toBe(47);
  });

  it("sanitiza nome do chef, alterna som, notifica assinantes e zera progresso", async () => {
    const { useCases, soundService } = createSubject();
    const listener = jest.fn();
    const unsubscribe = useCases.onProgressChanged(listener);

    const longNamed = await useCases.updateChefName("   Mestre Pizzaiolo Extra Longo   ");
    expect(longNamed.chefName).toBe("Mestre Pizzaiolo E");
    expect(longNamed.chefName.length).toBe(18);

    const emptyNamed = await useCases.updateChefName("    ");
    expect(emptyNamed.chefName).toBe("Chef");

    const muted = await useCases.toggleSound();
    expect(muted.soundEnabled).toBe(false);
    useCases.playSound("pop", muted.soundEnabled);
    useCases.playSound("coin", true);
    expect(soundService.played).toEqual(["coin"]);

    const resetProfile = await useCases.resetProgress();
    expect(resetProfile.coins).toBe(30);
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    const callsBefore = listener.mock.calls.length;
    await useCases.toggleSound();
    expect(listener.mock.calls.length).toBe(callsBefore);
  });
});
