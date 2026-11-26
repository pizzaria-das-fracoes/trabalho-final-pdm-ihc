import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import type { PlayerProfile } from "@/model/entities/progress";
import DecimalScreen from "@/view/decimal";
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

const mockDecimalChallenges: QuizChallenge[] = [
  {
    id: "dec-test-1",
    prompt: "Quanto vale 1/4 no medidor digital?",
    instruction: "Pense em 1 inteiro dividido em 4 partes.",
    options: ["0,2", "0,25", "0,4"],
    expected: "0,25",
    explanation: "1 dividido por 4 dá 0,25 — como 25 centavos de 1 real!",
    hint: "Metade é 0,50. A metade da metade é 0,25.",
    visualData: { refNumerator: 1, refDenominator: 4, decimalLabel: "?" }
  },
  {
    id: "dec-test-2",
    prompt: "Qual número com vírgula representa metade (1/2)?",
    instruction: "Escolha o valor que fica bem no meio entre 0 e 1.",
    options: ["0,5", "0,2", "1,2"],
    expected: "0,5",
    explanation: "1/2 é 0,5 — metade de 1 inteiro!",
    hint: "Divida 10 ao meio e pense em décimos: cinco décimos.",
    visualData: { refNumerator: 1, refDenominator: 2, decimalLabel: "?" }
  },
  {
    id: "dec-test-3",
    prompt: "Qual decimal equivale a 3/4 de pizza?",
    instruction: "Junte três pedaços de 0,25!",
    options: ["0,34", "0,75", "0,6"],
    expected: "0,75",
    explanation: "3 vezes 0,25 dá 0,75!",
    hint: "0,25 + 0,25 + 0,25 = ?",
    visualData: { refNumerator: 3, refDenominator: 4, decimalLabel: "?" }
  },
  {
    id: "dec-test-4",
    prompt: "E 1/5 de pizza vale quanto em decimal?",
    instruction: "Divida 1 inteiro em 5 partes iguais.",
    options: ["0,15", "0,2", "0,5"],
    expected: "0,2",
    explanation: "1 dividido por 5 é 0,2 (dois décimos)!",
    hint: "5 moedas de 20 centavos formam 1 real.",
    visualData: { refNumerator: 1, refDenominator: 5, decimalLabel: "?" }
  }
];

const selectOption = async (index: number) => {
  const radios = screen.getAllByRole("radio");
  await fireEvent.press(radios[index]);
};

describe("DecimalScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({ profile: mockProfile, attempts: [] });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordAttempt").mockResolvedValue({
      xpEarned: 15, coinsEarned: 5, newStreak: 1, newlyUnlockedAchievements: [], profile: mockProfile,
    });
    jest.spyOn(progressUseCases, "awardWorldStars").mockResolvedValue(mockProfile);
    jest.spyOn(activityUseCases, "createDecimalSession").mockReturnValue(mockDecimalChallenges);
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

  it("renderiza título, prompt, opções e visual decimal no primeiro round", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => {
      expect(screen.getByText("Fábrica de Decimais")).toBeTruthy();
    });

    expect(screen.getByText("Quanto vale 1/4 no medidor digital?")).toBeTruthy();
    expect(screen.getByText("Pense em 1 inteiro dividido em 4 partes.")).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    expect(screen.getByText("0,??")).toBeTruthy();
  });

  it("exibe moedas e botão de som no cabeçalho", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });
    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("habilita botão após selecionar resposta", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: true });
    });

    await selectOption(1);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Conferir resposta" }).props.accessibilityState).toEqual({ disabled: false });
    });
  });

  it("resposta correta: feedback, som success, botão Próximo desafio", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("1 dividido por 4 dá 0,25 — como 25 centavos de 1 real!")).toBeTruthy();
      expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy();
    expect(progressUseCases.playSound).toHaveBeenCalledWith("success", true);
  });

  it("resposta incorreta: feedback, som oops, dica", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(0);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));

    await waitFor(() => {
      expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
      expect(screen.getByText("Dica do Chef: Metade é 0,50. A metade da metade é 0,25.")).toBeTruthy();
    });
    expect(progressUseCases.playSound).toHaveBeenCalledWith("oops", true);
  });

  it("avança de round após acerto", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => {
      expect(screen.getByText("Qual número com vírgula representa metade (1/2)?")).toBeTruthy();
      expect(screen.getByText("Pedido 2/4")).toBeTruthy();
    });
  });

  it("completa todos os rounds e exibe VictoryCard", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(0);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));

    await waitFor(() => {
      expect(screen.getByText("Fornada Completa!")).toBeTruthy();
      expect(screen.getByText(/Turno Concluído · Chef Teste/)).toBeTruthy();
    });
    expect(progressUseCases.awardWorldStars).toHaveBeenCalledWith("decimal", 3);
    expect(progressUseCases.playSound).toHaveBeenCalledWith("fanfare", true);
  });

  it("reinicia sessão com Novo Turno", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(0);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Próximo desafio" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Próximo desafio" }));
    await waitFor(() => expect(screen.getAllByRole("radio")).toHaveLength(3));
    await selectOption(1);
    await fireEvent.press(screen.getByRole("button", { name: "Conferir resposta" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Pegar estrelas!" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));

    await waitFor(() => {
      expect(screen.getByText("Quanto vale 1/4 no medidor digital?")).toBeTruthy();
      expect(screen.getByText("Pedido 1/4")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Voltar para o Mapa" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));
    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som", async () => {
    await render(<DecimalScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha"));

    await render(<DecimalScreen />);

    await waitFor(() => {
      expect(screen.getByText("Fábrica de Decimais")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<DecimalScreen />);
    await waitFor(() => expect(screen.getByText("Fábrica de Decimais")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<DecimalScreen />);

    await waitFor(() => {
      expect(screen.getByText("Quanto vale 1/4 no medidor digital?")).toBeTruthy();
      expect(screen.getByText(/42\s+Q/)).toBeTruthy();
    });
  });
});