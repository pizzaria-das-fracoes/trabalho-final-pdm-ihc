import { ACHIEVEMENTS, GAME_WORLDS, getLevelFromXp, SANDBOX_MISSIONS } from "@/model/entities/game";
import {
  generateArcadeSession,
  generateCompareSession,
  generateDecimalSession,
  generateEquivalentSession,
  generateNumberLineSession,
  generateOperationsSession,
  generatePizzaSession,
  generateQuantitySession
} from "@/model/entities/generator";
import { DEFAULT_PROFILE } from "@/model/entities/progress";

describe("Regras de jogo, missões da Bancada e geradores BNCC", () => {
  it("calcula nível e XP restante corretamente nos limites de faixa", () => {
    expect(getLevelFromXp(0)).toEqual({ level: 1, currentXp: 0, nextLevelXp: 100 });
    expect(getLevelFromXp(99)).toEqual({ level: 1, currentXp: 99, nextLevelXp: 100 });
    expect(getLevelFromXp(100)).toEqual({ level: 2, currentXp: 0, nextLevelXp: 100 });
    expect(getLevelFromXp(245)).toEqual({ level: 3, currentXp: 45, nextLevelXp: 100 });
  });

  it("valida regras das missões da Bancada Mágica", () => {
    const [m1, m2, m3, m4] = SANDBOX_MISSIONS;

    expect(
      m1.check(
        [
          { id: "a", n: 1, d: 4 },
          { id: "b", n: 1, d: 4 }
        ],
        [],
        { numerator: 1, denominator: 2 },
        { numerator: 0, denominator: 1 }
      )
    ).toBe(true);
    expect(
      m1.check([{ id: "a", n: 1, d: 2 }], [], { numerator: 1, denominator: 2 }, { numerator: 0, denominator: 1 })
    ).toBe(false);

    expect(
      m2.check(
        [
          { id: "1", n: 1, d: 2 },
          { id: "2", n: 1, d: 3 },
          { id: "3", n: 1, d: 6 }
        ],
        [],
        { numerator: 1, denominator: 1 },
        { numerator: 0, denominator: 1 }
      )
    ).toBe(true);

    expect(
      m3.check(
        [{ id: "a1", n: 1, d: 2 }],
        [
          { id: "b1", n: 1, d: 4 },
          { id: "b2", n: 1, d: 4 }
        ],
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 2 }
      )
    ).toBe(true);
    expect(m3.check([], [], { numerator: 0, denominator: 1 }, { numerator: 0, denominator: 1 })).toBe(false);

    expect(
      m4.check(
        [
          { id: "a1", n: 1, d: 2 },
          { id: "a2", n: 1, d: 8 },
          { id: "a3", n: 1, d: 8 }
        ],
        [],
        { numerator: 3, denominator: 4 },
        { numerator: 0, denominator: 1 }
      )
    ).toBe(true);
  });

  it("verifica critérios de conquistas e catálogo de mundos", () => {
    expect(GAME_WORLDS).toHaveLength(7);
    const firstSlice = ACHIEVEMENTS.find((a) => a.id === "first-slice");
    const starCollector = ACHIEVEMENTS.find((a) => a.id === "star-collector");
    const arcadeHero = ACHIEVEMENTS.find((a) => a.id === "arcade-hero");

    expect(firstSlice?.check(DEFAULT_PROFILE, 0)).toBe(false);
    expect(firstSlice?.check(DEFAULT_PROFILE, 1)).toBe(true);
    expect(starCollector?.check({ ...DEFAULT_PROFILE, worldStars: { pizza: 3, compare: 3 } }, 2)).toBe(true);
    expect(arcadeHero?.check({ ...DEFAULT_PROFILE, arcadeHighScore: 100 }, 0)).toBe(true);
  });

  it("gera sessões válidas sem exceder o tamanho do banco nem repetir perguntas na mesma sessão", () => {
    const pizza = generatePizzaSession(4);
    const compare = generateCompareSession(4);
    const eq = generateEquivalentSession(4);
    const dec = generateDecimalSession(4);
    const ops = generateOperationsSession(4);
    const nl = generateNumberLineSession(4);
    const qty = generateQuantitySession(4);
    const arcade = generateArcadeSession(7);

    expect(pizza).toHaveLength(4);
    expect(compare).toHaveLength(4);
    expect(eq).toHaveLength(4);
    expect(dec).toHaveLength(4);
    expect(ops).toHaveLength(4);
    expect(nl).toHaveLength(4);
    expect(qty).toHaveLength(4);
    expect(arcade).toHaveLength(7);

    expect(new Set(pizza.map((q) => q.id)).size).toBe(4);
    expect(eq.every((q) => q.options.includes(q.expected))).toBe(true);
    expect(dec.every((q) => q.options.includes(q.expected))).toBe(true);
    expect(ops.every((q) => q.options.includes(q.expected))).toBe(true);
    expect(arcade.every((q) => q.options.includes(q.answer) && q.options.length === 3)).toBe(true);
  });

  it("gera os dois sentidos de comparação e os limites dos bancos em execuções determinísticas", () => {
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0);

    expect(generateCompareSession(12).every((q) => q.winner === "left" || q.winner === "right" || q.winner === "tie")).toBe(true);
    expect(generateEquivalentSession(7)).toHaveLength(7);
    expect(generateDecimalSession(9)).toHaveLength(9);
    expect(generateOperationsSession(9)).toHaveLength(9);
    expect(generateNumberLineSession(9)).toHaveLength(9);
    expect(generateQuantitySession(9)).toHaveLength(9);
    expect(generatePizzaSession(10)).toHaveLength(10);
    expect(generateArcadeSession(7)).toHaveLength(7);

    randomSpy.mockReturnValue(0.75);
    expect(generateCompareSession(12).every((q) => q.winner === "left" || q.winner === "right" || q.winner === "tie")).toBe(true);
    expect(generateArcadeSession(7)).toHaveLength(7);

    randomSpy.mockRestore();
  });
});
