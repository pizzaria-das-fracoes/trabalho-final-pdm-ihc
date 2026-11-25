import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { ArcadeQuestion } from "@/model/entities/generator";
import type { PlayerProfile } from "@/model/entities/progress";
import ArcadeScreen from "@/view/arcade";
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

const mockQuestions: ArcadeQuestion[] = [
  {
    id: "arc-test-1",
    prompt: "Qual fração esta pizza mostra?",
    pizza: { n: 1, d: 2 },
    options: ["1/2", "1/4", "3/4"],
    answer: "1/2",
  },
  {
    id: "arc-test-2",
    prompt: "Qual fração esta pizza mostra?",
    pizza: { n: 2, d: 3 },
    options: ["1/3", "2/3", "3/6"],
    answer: "2/3",
  },
];

describe("ArcadeScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(activityUseCases, "createArcadeSession").mockReturnValue(mockQuestions);
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({ profile: mockProfile, attempts: [] });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordArcadeScore").mockResolvedValue(mockProfile);

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

  it("renderiza estado pronto: título, moedas, modo e botão iniciar", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo Relâmpago!")).toBeTruthy();
    });

    expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    expect(screen.getByText("Recorde atual: 250 pontos")).toBeTruthy();

    expect(screen.getByText("Sem Relógio")).toBeTruthy();
    expect(screen.getByText("Com Relógio (45s)")).toBeTruthy();

    expect(screen.getByText("Começar Duelo!")).toBeTruthy();
  });

  it("alternna modo de jogo via SegmentedTabs", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByText("Sem Relógio")).toBeTruthy());

    await fireEvent.press(screen.getByRole("tab", { name: "Com Relógio (45s)" }));

    await waitFor(() => expect(screen.getByText("Com Relógio (45s)")).toBeTruthy());
  });

  it("inicia jogo e exibe primeira pergunta", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByText("Começar Duelo!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Começar Duelo!" }));

    await waitFor(() => expect(screen.getByText("Qual fração esta pizza mostra?")).toBeTruthy());
    expect(screen.getAllByText("1/2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1/4").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3/4").length).toBeGreaterThan(0);
  });

  it("resposta correta: feedback mandou bem aparece", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByText("Começar Duelo!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Começar Duelo!" }));

    await waitFor(() => expect(screen.getByText("Qual fração esta pizza mostra?")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "1/2" }));

    await waitFor(() => {
      expect(screen.getByText(/Mandou bem! \+\d+ pts/)).toBeTruthy();
    });
  });

  it("resposta incorreta: feedback com dica da resposta certa", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByText("Começar Duelo!")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Começar Duelo!" }));

    await waitFor(() => expect(screen.getByText("Qual fração esta pizza mostra?")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "3/4" }));

    await waitFor(() => {
      expect(screen.getByText("A resposta certa era 1/2!")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Ir para o Mapa da Pizzaria" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Ir para o Mapa da Pizzaria" }));
    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som", async () => {
    await render(<ArcadeScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha"));

    await render(<ArcadeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo Relâmpago!")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<ArcadeScreen />);
    await waitFor(() => expect(screen.getByText("Duelo Relâmpago!")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<ArcadeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Duelo Relâmpago!")).toBeTruthy();
      expect(screen.getByText(/42\s+Q/)).toBeTruthy();
    });
  });
});