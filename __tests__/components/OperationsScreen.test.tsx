import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import OperationsScreen from "@/view/operations";
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

const mockOperationsChallenges: QuizChallenge[] = [
  {
    id: "op-test-1",
    prompt: "Quanto dá 1/2 + 1/3?",
    instruction: "Transforme tudo em sextos na barra mágica!",
    options: ["2/5", "5/6", "1/6"],
    expected: "5/6",
    explanation: "1/2 = 3/6 e 1/3 = 2/6. Somando os sextos dá 5/6!",
    hint: "Conte quantos quadradinhos estão pintados na soma das duas barras.",
    visualData: {
      leftLabel: "1/2 = 3/6",
      leftFrac: { n: 3, d: 6 },
      rightLabel: "1/3 = 2/6",
      rightFrac: { n: 2, d: 6 },
      opSign: "+",
      resultFrac: { n: 5, d: 6 }
    }
  },
  {
    id: "op-test-2",
    prompt: "Quanto sobra em 3/4 − 1/2?",
    instruction: "Tire metade de três quartos!",
    options: ["1/4", "2/2", "1/2"],
    expected: "1/4",
    explanation: "1/2 é o mesmo que 2/4. Tirando 2/4 de 3/4 sobra 1/4!",
    hint: "Pense em 3 fatias de 4 e coma 2 delas.",
    visualData: {
      leftLabel: "3/4",
      leftFrac: { n: 3, d: 4 },
      rightLabel: "1/2 = 2/4",
      rightFrac: { n: 2, d: 4 },
      opSign: "-",
      resultFrac: { n: 1, d: 4 }
    }
  },
  {
    id: "op-test-3",
    prompt: "Calcule 1/3 + 1/6",
    instruction: "Junte um terço com um sexto.",
    options: ["2/9", "1/2", "1/3"],
    expected: "1/2",
    explanation: "1/3 é igual a 2/6. Somando com 1/6 dá 3/6, que é metade (1/2)!",
    hint: "Transforme 1/3 em 2/6 e some mais 1/6.",
    visualData: {
      leftLabel: "1/3 = 2/6",
      leftFrac: { n: 2, d: 6 },
      rightLabel: "1/6",
      rightFrac: { n: 1, d: 6 },
      opSign: "+",
      resultFrac: { n: 3, d: 6 }
    }
  },
  {
    id: "op-test-4",
    prompt: "Desafio bônus: 2/3 − 1/6",
    instruction: "Tire um sexto de dois terços.",
    options: ["1/2", "1/6", "1/3"],
    expected: "1/2",
    explanation: "2/3 = 4/6. Tirando 1/6 sobra 3/6 = 1/2!",
    hint: "Converta tudo em sextos.",
    visualData: {
      leftLabel: "2/3 = 4/6",
      leftFrac: { n: 4, d: 6 },
      rightLabel: "1/6",
      rightFrac: { n: 1, d: 6 },
      opSign: "-",
      resultFrac: { n: 3, d: 6 }
    }
  }
];

describe("OperationsScreen — renderização, jogabilidade e navegação", () => {
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
    jest.spyOn(activityUseCases, "createOperationsSession").mockReturnValue(mockOperationsChallenges);
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

  it("renderiza título, prompt, opções e visual de operações no primeiro round", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Receita Secreta")).toBeTruthy();
    });

    expect(screen.getByText("Quanto dá 1/2 + 1/3?")).toBeTruthy();
    expect(screen.getByText("Transforme tudo em sextos na barra mágica!")).toBeTruthy();
    expect(screen.getByText("2/5")).toBeTruthy();
    expect(screen.getByText("5/6")).toBeTruthy();
    expect(screen.getByText("1/6")).toBeTruthy();
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    expect(screen.getByText("Resultado ?")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: true });
  });

  it("exibe moedas e botão de som no cabeçalho via Screen", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });

    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("habilita botão Conferir após selecionar uma resposta", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: true });
    });

    await fireEvent.press(screen.getByText("5/6"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("resposta correta: feedback de sucesso, som success, botão Próximo desafio", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("5/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("5/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("1/2 = 3/6 e 1/3 = 2/6. Somando os sextos dá 5/6!")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("resposta incorreta: feedback de erro, som oops, dica exibida, botão continua Conferir", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("2/5")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("2/5"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText("Dica do Chef: Conte quantos quadradinhos estão pintados na soma das duas barras.")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança para próximo round após acerto", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("5/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("5/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => {
      expect(screen.getByText("Quanto sobra em 3/4 − 1/2?")).toBeTruthy();
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    });
  });

  it("completa todos os rounds e exibe VictoryCard com estrelas", async () => {
    await render(<OperationsScreen />);

    // Round 1
    await waitFor(() => expect(screen.getByText("5/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("5/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 2
    await waitFor(() => expect(screen.getByText("1/4")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/4"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 3
    await waitFor(() => expect(screen.getByText("1/2")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/2"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 4 (last)
    await waitFor(() => expect(screen.getByText("1/2")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/2"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });

    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("operations", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia a sessão com botão Novo Turno", async () => {
    await render(<OperationsScreen />);

    // Complete all rounds
    await waitFor(() => expect(screen.getByText("5/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("5/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("1/4")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/4"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("1/2")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/2"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("1/2")).toBeTruthy());
    await fireEvent.press(screen.getByText("1/2"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    // Restart
    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Quanto dá 1/2 + 1/3?")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));

    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som ao clicar no botão de som", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));

    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar com erro não-DomainError", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha de armazenamento"));

    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Receita Secreta")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("exibe dica no visual quando responde incorretamente", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("1/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("1/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText("Dica do Chef: Conte quantos quadradinhos estão pintados na soma das duas barras.")).toBeTruthy();
    });
  });

  it("exibe visual de operações com barras segmentadas e resultado mistério", async () => {
    await render(<OperationsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Resultado ?")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("5/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("1/2 = 3/6 e 1/3 = 2/6. Somando os sextos dá 5/6!")).toBeTruthy();
    });
  });
});