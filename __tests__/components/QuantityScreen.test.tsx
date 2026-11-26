import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { QuantityChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import QuantityScreen from "@/view/quantity";
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

const mockQuantityChallenges: QuantityChallenge[] = [
  {
    id: "qty-3-4-20",
    prompt: "Separe 3/4 de 20 mini-pizzas!",
    numerator: 3,
    denominator: 4,
    totalItems: 20,
    itemName: "mini-pizzas",
    hint: "São 4 bandejas de 5. Selecione 3 bandejas!"
  },
  {
    id: "qty-2-3-12",
    prompt: "Separe 2/3 de 12 brigadeiros!",
    numerator: 2,
    denominator: 3,
    totalItems: 12,
    itemName: "brigadeiros",
    hint: "São 3 bandejas de 4. Selecione 2 bandejas!"
  },
  {
    id: "qty-1-2-14",
    prompt: "Separe 1/2 de 14 coxinhas!",
    numerator: 1,
    denominator: 2,
    totalItems: 14,
    itemName: "coxinhas",
    hint: "Divida em 2 bandejas iguais e escolha 1 bandeja!"
  },
  {
    id: "qty-3-5-15",
    prompt: "Separe 3/5 de 15 fatias doces!",
    numerator: 3,
    denominator: 5,
    totalItems: 15,
    itemName: "fatias doces",
    hint: "São 5 bandejas de 3. Selecione 3 bandejas!"
  },
];

describe("QuantityScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({ profile: mockProfile, attempts: [] });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordAttempt").mockResolvedValue({
      xpEarned: 15, coinsEarned: 5, newStreak: 1, newlyUnlockedAchievements: [], profile: mockProfile,
    });
    jest.spyOn(progressUseCases, "awardWorldStars").mockResolvedValue(mockProfile);
    jest.spyOn(activityUseCases, "createQuantitySession").mockReturnValue(mockQuantityChallenges);
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

  it("renderiza título, missão e botão desabilitado inicialmente", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Festa dos Pedidos")).toBeTruthy();
    });

    expect(screen.getByText("Preparar Bandejas")).toBeTruthy();
    expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy();
    expect(screen.getByText("Toque nas bandejas abaixo para escolher quantas vão para a festa!")).toBeTruthy();
    expect(screen.getByText("Servir bandejas!")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Servir bandejas!" }).props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
  });

  it("exibe bandejas com acessibilidade e botão de som no cabeçalho", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy();
    });
    expect(screen.getByText("Bandeja 1")).toBeTruthy();
    expect(screen.getByText("Bandeja 2")).toBeTruthy();
    expect(screen.getByText("Bandeja 3")).toBeTruthy();
    expect(screen.getByText("Bandeja 4")).toBeTruthy();
    expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("habilita botão ao selecionar bandejas", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Servir bandejas!")).toBeTruthy());

    expect(screen.getByRole("button", { name: "Servir bandejas!" }).props.accessibilityState).toEqual({ disabled: true });

    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Servir bandejas!" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("resposta correta: feedback, som success, botão Próxima festa", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy());

    // Seleciona 3 bandejas de 5 = 15 mini-pizzas (correto para 3/4 de 20)
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));

    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));

    await waitFor(() => {
      expect(screen.getByText("Show! 3/4 de 20 são 15 mini-pizzas!")).toBeTruthy();
    });

    expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
    expect(screen.getByRole("button", { name: "Próxima festa" })).toBeTruthy();
  });

  it("resposta incorreta: feedback com dica", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy());

    // Seleciona 1 bandeja errada
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));

    await waitFor(() => {
      expect(screen.getByText("Você separou 1 bandeja(s) (5 mini-pizzas). Dica: São 4 bandejas de 5. Selecione 3 bandejas!")).toBeTruthy();
    });
    expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança de round após acerto", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));

    await waitFor(() => expect(screen.getByText("Show! 3/4 de 20 são 15 mini-pizzas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => {
      expect(screen.getByText("Separe 2/3 de 12 brigadeiros!")).toBeTruthy();
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
    });
  });

  it("completa todos os rounds e exibe VictoryCard", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 3/4 de 20 são 15 mini-pizzas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 2/3 de 12 brigadeiros!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 2/3 de 12 são 8 brigadeiros!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 1/2 de 14 coxinhas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 1/2 de 14 são 7 coxinhas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 3/5 de 15 fatias doces!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 3/5 de 15 são 9 fatias doces!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });
    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("quantity", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia sessão com Novo Turno", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 3/4 de 20 são 15 mini-pizzas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 2/3 de 12 brigadeiros!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 2/3 de 12 são 8 brigadeiros!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 1/2 de 14 coxinhas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 1/2 de 14 são 7 coxinhas!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próxima festa" }));

    await waitFor(() => expect(screen.getByText("Separe 3/5 de 15 fatias doces!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 1" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 2" }));
    await fireEvent.press(screen.getByRole("button", { name: "Bandeja 3" }));
    await fireEvent.press(screen.getByRole("button", { name: "Servir bandejas!" }));
    await waitFor(() => expect(screen.getByText("Show! 3/5 de 15 são 9 fatias doces!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));
    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som", async () => {
    await render(<QuantityScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha"));

    await render(<QuantityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Festa dos Pedidos")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<QuantityScreen />);
    await waitFor(() => expect(screen.getByText("Festa dos Pedidos")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<QuantityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Separe 3/4 de 20 mini-pizzas!")).toBeTruthy();
      expect(screen.getByText(/42\s+Q/)).toBeTruthy();
    });
  });
});
