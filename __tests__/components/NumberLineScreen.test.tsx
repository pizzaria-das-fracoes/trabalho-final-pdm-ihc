import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { NumberLineChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import NumberLineScreen from "@/view/number-line";
import { progressUseCases, activityUseCases } from "@/di/container";
import { DEFAULT_PROFILE } from "@/model/entities/progress";

const mockProfile: PlayerProfile = {
  ...DEFAULT_PROFILE,
  chefName: "Chef Teste",
  coins: 42,
  soundEnabled: true,
  equippedTopping: "pepperoni",
  equippedHat: "chef",
  xp: 150,
  worldStars: { pizza: 3, compare: 2, equivalent: 1, "number-line": 0, decimal: 0, quantity: 0, operations: 0 },
  unlockedHats: ["chef", "cap"],
  unlockedToppings: ["pepperoni", "mushroom"],
  unlockedTitles: ["aprendiz", "velocista"],
  streak: 5,
  bestStreak: 7,
  arcadeHighScore: 250,
};

const mockNumberLineChallenges: NumberLineChallenge[] = [
  {
    id: "nl-test-1",
    label: "Estacione a motoca em 1/2",
    numerator: 1,
    denominator: 2,
    maxValue: 2,
    stepDenominator: 4,
    hint: "1/2 fica exatamente no meio entre 0 e 1!"
  },
  {
    id: "nl-test-2",
    label: "Estacione a motoca em 3/2",
    numerator: 3,
    denominator: 2,
    maxValue: 2,
    stepDenominator: 4,
    hint: "3/2 é uma pizza inteira e mais meia pizza (1,5)!"
  },
  {
    id: "nl-test-3",
    label: "Estacione a motoca em 3/4",
    numerator: 3,
    denominator: 4,
    maxValue: 2,
    stepDenominator: 4,
    hint: "Conte 3 pulinhos de 1/4 a partir do zero!"
  },
  {
    id: "nl-test-4",
    label: "Estacione a motoca em 5/4",
    numerator: 5,
    denominator: 4,
    maxValue: 2,
    stepDenominator: 4,
    hint: "4/4 já é 1 inteiro. Dê mais 1 pulinho de 1/4 depois do 1!"
  },
];

describe("NumberLineScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({ profile: mockProfile, attempts: [] });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordAttempt").mockResolvedValue({
      xpEarned: 15, coinsEarned: 5, newStreak: 1, newlyUnlockedAchievements: [], profile: mockProfile,
    });
    jest.spyOn(progressUseCases, "awardWorldStars").mockResolvedValue(mockProfile);
    jest.spyOn(activityUseCases, "createNumberLineSession").mockReturnValue(mockNumberLineChallenges);
    jest.spyOn(activityUseCases, "computeStars").mockReturnValue(3);

    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 },
    });
  });

  it("renderiza título, missão e botão de verificação desabilitado", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Pista do Entregador")).toBeTruthy();
    });

    expect(screen.getByText("Missão de Entrega")).toBeTruthy();
    expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
    expect(screen.getByText("Toque em um ponto da avenida entre 0 e 2 para estacionar!")).toBeTruthy();
    expect(screen.getByText("Estacionar aqui!")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Estacionar aqui!" }).props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
  });

  it("exibe moedas e botão de som no cabeçalho", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });
    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("exibe botões de tick com acessibilidade de parada", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Parada 1 de 8" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Parada 2 de 8" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Parada 8 de 8" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Parada 8 de 8" })).toBeTruthy();
    });
  });

  it("verifica tick correto e exibe feedback de sucesso", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
    });

    // Tick 2 = 2/4 = 1/2 (correto)
    await fireEvent.press(screen.getByRole("button", { name: "Parada 2 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));

    await waitFor(() => {
      expect(screen.getByText("Entrega perfeita! 1/2 fica exatamente aqui.")).toBeTruthy();
    });

    expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("verifica tick incorreto e exibe feedback com dica", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
    });

    // Tick 1 = 1/4 (incorreto)
    await fireEvent.press(screen.getByRole("button", { name: "Parada 1 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText(/Ops, estacionou na casa errada! Dica: 1\/2 fica exatamente no meio entre 0 e 1!/)).toBeTruthy();
    });
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança de round após acerto", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Parada 2 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));

    await waitFor(() => {
      expect(screen.getByText("Entrega perfeita! 1/2 fica exatamente aqui.")).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 3/2")).toBeTruthy();
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
    });
  });

  it("completa todos os rounds e exibe VictoryCard", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 2 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 1/2 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 3/2")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 6 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 3/2 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 3/4")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 3 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 3/4 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 5/4")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 5 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 5/4 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });
    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("number-line", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia sessão com botão Novo Turno", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 2 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 1/2 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 3/2")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 6 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 3/2 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 3/4")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 3 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 3/4 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima entrega" }));

    await waitFor(() => expect(screen.getByText("Estacione a motoca em 5/4")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Parada 5 de 8" }));
    await fireEvent.press(screen.getByRole("button", { name: "Estacionar aqui!" }));
    await waitFor(() => expect(screen.getByText("Entrega perfeita! 5/4 fica exatamente aqui.")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));
    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som", async () => {
    await render(<NumberLineScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha"));

    await render(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Pista do Entregador")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<NumberLineScreen />);
    await waitFor(() => expect(screen.getByText("Pista do Entregador")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<NumberLineScreen />);

    await waitFor(() => {
      expect(screen.getByText("Estacione a motoca em 1/2")).toBeTruthy();
      expect(screen.getByText(/42\s+Q/)).toBeTruthy();
    });
  });
});