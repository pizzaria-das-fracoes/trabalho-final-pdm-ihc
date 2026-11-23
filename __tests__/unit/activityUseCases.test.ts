import { DEFAULT_PROFILE } from "@/model/entities/progress";
import { ActivityUseCases } from "@/usecase/activityUseCases";

describe("ActivityUseCases — correção de pizza, cálculo de estrelas e sessões", () => {
  const useCases = new ActivityUseCases();

  it("valida equivalência na resposta da pizza e rejeita seleção vazia", () => {
    expect(useCases.checkPizzaAnswer(0, 4, 3, 4)).toBe(false);
    expect(useCases.checkPizzaAnswer(-1, 4, 1, 4)).toBe(false);
    expect(useCases.checkPizzaAnswer(3, 4, 3, 4)).toBe(true);
    expect(useCases.checkPizzaAnswer(6, 8, 3, 4)).toBe(true);
    expect(useCases.checkPizzaAnswer(2, 4, 3, 4)).toBe(false);
  });

  it("calcula estrelas por faixa de erros", () => {
    expect(useCases.computeStars(0)).toBe(3);
    expect(useCases.computeStars(1)).toBe(2);
    expect(useCases.computeStars(2)).toBe(2);
    expect(useCases.computeStars(3)).toBe(1);
    expect(useCases.computeStars(9)).toBe(1);
  });

  it("resume mundos concluídos e estrelas totais para o mapa inicial", () => {
    const empty = useCases.getHomeWorldsSummary(DEFAULT_PROFILE);
    expect(empty.completedWorlds).toBe(0);
    expect(empty.totalStars).toBe(0);
    expect(empty.maxStars).toBe(21);

    const active = useCases.getHomeWorldsSummary({
      ...DEFAULT_PROFILE,
      worldStars: { pizza: 3, compare: 2, decimal: 0 }
    });
    expect(active.completedWorlds).toBe(2);
    expect(active.totalStars).toBe(5);
  });

  it("cria todas as sessões de atividades com tamanho padrão e personalizado", () => {
    expect(useCases.createPizzaSession()).toHaveLength(4);
    expect(useCases.createCompareSession()).toHaveLength(4);
    expect(useCases.createEquivalentSession()).toHaveLength(4);
    expect(useCases.createDecimalSession()).toHaveLength(4);
    expect(useCases.createOperationsSession()).toHaveLength(4);
    expect(useCases.createNumberLineSession()).toHaveLength(4);
    expect(useCases.createQuantitySession()).toHaveLength(4);
    expect(useCases.createArcadeSession()).toHaveLength(7);

    expect(useCases.createPizzaSession(2)).toHaveLength(2);
    expect(useCases.createCompareSession(2)).toHaveLength(2);
    expect(useCases.createEquivalentSession(2)).toHaveLength(2);
    expect(useCases.createDecimalSession(2)).toHaveLength(2);
    expect(useCases.createOperationsSession(2)).toHaveLength(2);
    expect(useCases.createNumberLineSession(2)).toHaveLength(2);
    expect(useCases.createQuantitySession(2)).toHaveLength(2);
    expect(useCases.createArcadeSession(5)).toHaveLength(5);
  });
});
