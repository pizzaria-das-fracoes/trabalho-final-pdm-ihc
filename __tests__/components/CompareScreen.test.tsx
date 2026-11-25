import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { CompareChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import CompareScreen from "@/view/compare";
import { progressUseCases } from "@/di/container";
import { activityUseCases } from "@/di/container";
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

const mockCompareChallenges: CompareChallenge[] = [
  {
    id: "cmp-test-1",
    left: { numerator: 3, denominator: 4 },
    right: { numerator: 2, denominator: 3 },
    winner: "left",
    explanation: "3/4 ocupa mais espaço no prato que 2/3 (9/12 contra 8/12)!",
    hint: "Olhe para o espaço em branco que falta para completar cada pizza."
  },
  {
    id: "cmp-test-2",
    left: { numerator: 1, denominator: 2 },
    right: { numerator: 5, denominator: 8 },
    winner: "right",
    explanation: "Metade seria 4/8, então 5/8 passa da metade!",
    hint: "Imagine a Pizza A cortada em 8 pedaços: metade seria 4/8."
  },
  {
    id: "cmp-test-3",
    left: { numerator: 2, denominator: 3 },
    right: { numerator: 4, denominator: 6 },
    winner: "tie",
    explanation: "Empate delicioso! 2/3 e 4/6 são exatamente a mesma quantidade.",
    hint: "Compare a área pintada das duas pizzas com calma."
  },
  {
    id: "cmp-test-4",
    left: { numerator: 4, denominator: 5 },
    right: { numerator: 3, denominator: 4 },
    winner: "left",
    explanation: "4/5 falta apenas 1/5 (menor pedaço) para fechar a pizza inteira!",
    hint: "Falta 1 fatia em cada uma, mas qual fatia faltando é menor?"
  }
];

describe("CompareScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({
      profile: mockProfile,
      attempts: [],
    });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordAttempt").mockResolvedValue({
      xpEarned: 15,
      coinsEarned: 5,
      newStreak: 1,
      newlyUnlockedAchievements: [],
      profile: mockProfile,
    });
    jest.spyOn(progressUseCases, "awardWorldStars").mockResolvedValue(mockProfile);
    jest.spyOn(activityUseCases, "createCompareSession").mockReturnValue(mockCompareChallenges);
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

  it("renderiza título, heading, pizzas e botões de escolha no primeiro round", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo de Pizzas")).toBeTruthy();
    });

    expect(screen.getByText("Quem tem mais pizza no prato?")).toBeTruthy();
    expect(screen.getByText("Toque na bandeja campeã ou escolha Empate se forem iguais!")).toBeTruthy();
    expect(screen.getByText("Pizza A")).toBeTruthy();
    expect(screen.getByText("Pizza B")).toBeTruthy();
    expect(screen.getByText("Empate (=)")).toBeTruthy();
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Escolher Empate" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir duelo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: true });
  });

  it("exibe moedas e botão de som no cabeçalho via Screen", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });

    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("habilita botão Conferir após selecionar uma pizza", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: true });
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("seleciona Pizza A e habilita Conferir", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("seleciona Pizza B e habilita Conferir", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza B" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("seleciona Empate e habilita Conferir", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Empate" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Empate" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("resposta correta (Pizza A): feedback de sucesso, som success, botão Próximo duelo", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));

    await waitFor(() => {
      expect(screen.getByText("3/4 ocupa mais espaço no prato que 2/3 (9/12 contra 8/12)!")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("resposta incorreta: feedback de erro, som oops, dica exibida, botão continua Conferir", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza B" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText("Ops! Dica: Olhe para o espaço em branco que falta para completar cada pizza.")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Conferir duelo" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança para próximo round após acerto", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    await waitFor(() => {
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Conferir duelo" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Conferir duelo" }).props.accessibilityState).toEqual({ disabled: true });
    });
  });

  it("completa todos os rounds e exibe VictoryCard com estrelas", async () => {
    await render(<CompareScreen />);

    // Round 1: left
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    // Round 2: right
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza B" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    // Round 3: tie
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Empate" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Empate" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    // Round 4 (last): left
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });

    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("compare", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia a sessão com botão Novo Turno", async () => {
    await render(<CompareScreen />);

    // Complete all rounds
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza B" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Empate" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Empate" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    // Restart
    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Quem tem mais pizza no prato?")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));

    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som ao clicar no botão de som", async () => {
    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));

    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar com erro não-DomainError", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha de armazenamento"));

    await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo de Pizzas")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("exibe resultado com Empate correto", async () => {
    await render(<CompareScreen />);

    // Skip to round 3 where tie is the winner
    // Round 1: left
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza A" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza A" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    // Round 2: right
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Pizza B" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Pizza B" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo duelo!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo duelo!" }));

    // Round 3: tie
    await waitFor(() => expect(screen.getByRole("button", { name: "Escolher Empate" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Escolher Empate" }));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir duelo" }));

    await waitFor(() => {
      expect(screen.getByText("Empate delicioso! 2/3 e 4/6 são exatamente a mesma quantidade.")).toBeTruthy();
    });

    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("renderiza layout compacto com pizza menor e 'Empate\n(=)'", async () => {
    const { rerender } = await render(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo de Pizzas")).toBeTruthy();
    });

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });

    await rerender(<CompareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Quem tem mais pizza no prato?")).toBeTruthy();
    });

    expect(screen.getByText("Empate\n(=)")).toBeTruthy();
    expect(screen.getByText(/42\s+Q/)).toBeTruthy();
  });
});