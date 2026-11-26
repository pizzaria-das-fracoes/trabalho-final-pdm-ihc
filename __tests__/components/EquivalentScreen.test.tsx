import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import EquivalentScreen from "@/view/equivalent";
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

const mockEquivalentChallenges: QuizChallenge[] = [
  {
    id: "eq-test-1",
    prompt: "Qual pizza tem a mesma quantidade que 2/3?",
    instruction: "Encontre a fatia disfarçada com outro corte.",
    options: ["3/5", "4/6", "2/5"],
    expected: "4/6",
    explanation: "Cortar cada terço ao meio transforma 2/3 em 4/6!",
    hint: "Multiplique o número de cima e o de baixo por 2.",
    fractionOptions: {
      "3/5": { numerator: 3, denominator: 5 },
      "4/6": { numerator: 4, denominator: 6 },
      "2/5": { numerator: 2, denominator: 5 }
    },
    visualData: { refNumerator: 2, refDenominator: 3 }
  },
  {
    id: "eq-test-2",
    prompt: "Qual opção mostra exatamente metade da pizza?",
    instruction: "Escolha a pizza com metade coberta.",
    options: ["3/6", "2/5", "3/8"],
    expected: "3/6",
    explanation: "3 de 6 fatias é exatamente a metade!",
    hint: "O número de cima precisa ser metade do número de baixo.",
    fractionOptions: {
      "3/6": { numerator: 3, denominator: 6 },
      "2/5": { numerator: 2, denominator: 5 },
      "3/8": { numerator: 3, denominator: 8 }
    },
    visualData: { refNumerator: 1, refDenominator: 2 }
  },
  {
    id: "eq-test-3",
    prompt: "Qual pizza equivale a 3/4?",
    instruction: "Dobre os cortes na cabeça para descobrir!",
    options: ["5/8", "6/8", "4/6"],
    expected: "6/8",
    explanation: "3/4 dobrando os cortes vira 6/8!",
    hint: "Se cortar cada uma das 4 fatias ao meio, ficam 8 fatias no total.",
    fractionOptions: {
      "5/8": { numerator: 5, denominator: 8 },
      "6/8": { numerator: 6, denominator: 8 },
      "4/6": { numerator: 4, denominator: 6 }
    },
    visualData: { refNumerator: 3, refDenominator: 4 }
  },
  {
    id: "eq-test-4",
    prompt: "Qual fração equivale a 1/2?",
    instruction: "Escolha a opção que representa metade.",
    options: ["1/4", "2/4", "3/4"],
    expected: "2/4",
    explanation: "1/2 é igual a 2/4!",
    hint: "Dobre os cortes da pizza de referência.",
    fractionOptions: {
      "1/4": { numerator: 1, denominator: 4 },
      "2/4": { numerator: 2, denominator: 4 },
      "3/4": { numerator: 3, denominator: 4 }
    },
    visualData: { refNumerator: 1, refDenominator: 2 }
  }
];

describe("EquivalentScreen — renderização, jogabilidade e navegação", () => {
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
    jest.spyOn(activityUseCases, "createEquivalentSession").mockReturnValue(mockEquivalentChallenges);
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

  it("renderiza título, prompt, opções e visual de equivalência no primeiro round", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("Fornada Equivalente")).toBeTruthy();
    });

    expect(screen.getByText("Qual pizza tem a mesma quantidade que 2/3?")).toBeTruthy();
    expect(screen.getByText("Encontre a fatia disfarçada com outro corte.")).toBeTruthy();
    expect(screen.getByText("3/5")).toBeTruthy();
    expect(screen.getByText("4/6")).toBeTruthy();
    expect(screen.getByText("2/5")).toBeTruthy();
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    expect(screen.getByText("Fração Equivalente")).toBeTruthy();
    expect(screen.getByText("?")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: true });
  });

  it("exibe moedas e botão de som no cabeçalho via Screen", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });

    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("habilita botão Conferir após selecionar uma resposta", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: true });
    });

    await fireEvent.press(screen.getByText("4/6"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("resposta correta: feedback de sucesso, som success, botão Próximo desafio", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("4/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("4/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Cortar cada terço ao meio transforma 2/3 em 4/6!")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("resposta incorreta: feedback de erro, som oops, dica exibida, botão continua Conferir", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("3/5")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("3/5"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText("Dica do Chef: Multiplique o número de cima e o de baixo por 2.")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança para próximo round após acerto", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("4/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("4/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => {
      expect(screen.getByText("Qual opção mostra exatamente metade da pizza?")).toBeTruthy();
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Conferir resposta" })).toBeTruthy();
    });
  });

  it("completa todos os rounds e exibe VictoryCard com estrelas", async () => {
    await render(<EquivalentScreen />);

    // Round 1
    await waitFor(() => expect(screen.getByText("4/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("4/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 2
    await waitFor(() => expect(screen.getByText("3/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("3/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 3
    await waitFor(() => expect(screen.getByText("6/8")).toBeTruthy());
    await fireEvent.press(screen.getByText("6/8"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    // Round 4 (last)
    await waitFor(() => expect(screen.getByText("2/4")).toBeTruthy());
    await fireEvent.press(screen.getByText("2/4"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });

    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("equivalent", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia a sessão com botão Novo Turno", async () => {
    await render(<EquivalentScreen />);

    // Complete all rounds
    await waitFor(() => expect(screen.getByText("4/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("4/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("3/6")).toBeTruthy());
    await fireEvent.press(screen.getByText("3/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("6/8")).toBeTruthy());
    await fireEvent.press(screen.getByText("6/8"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getByText("2/4")).toBeTruthy());
    await fireEvent.press(screen.getByText("2/4"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    // Restart
    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Qual pizza tem a mesma quantidade que 2/3?")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));

    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som ao clicar no botão de som", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));

    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar com erro não-DomainError", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha de armazenamento"));

    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("Fornada Equivalente")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("exibe resposta esperada no visual quando acerta", async () => {
    await render(<EquivalentScreen />);

    await waitFor(() => {
      expect(screen.getByText("4/6")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("4/6"));
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Cortar cada terço ao meio transforma 2/3 em 4/6!")).toBeTruthy();
      expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    });
  });
});