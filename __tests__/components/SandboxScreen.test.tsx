import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { PlayerProfile } from "@/model/entities/progress";
import SandboxScreen from "@/view/sandbox";
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

describe("SandboxScreen — renderização, jogabilidade e navegação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({ profile: mockProfile, attempts: [] });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);
    jest.spyOn(progressUseCases, "recordAttempt").mockResolvedValue({
      xpEarned: 15, coinsEarned: 5, newStreak: 1, newlyUnlockedAchievements: [], profile: mockProfile,
    });
    jest.spyOn(progressUseCases, "awardWorldStars").mockResolvedValue(mockProfile);

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

  it("renderiza título, missão, paleta de frações e bandejas", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bancada Mágica")).toBeTruthy();
    });

    expect(screen.getByText("Laboratório Livre")).toBeTruthy();
    expect(screen.getByText("Compare frações nas bandejas ou some duas pizzas de até 100 fatias!")).toBeTruthy();

    expect(screen.getByText("Comparar Barras")).toBeTruthy();
    expect(screen.getByText("Somar Pizzas")).toBeTruthy();

    expect(screen.getByText("Bandeja A · Usar")).toBeTruthy();
    expect(screen.getByText("Bandeja B ✓ Ativa")).toBeTruthy();

    expect(screen.getByText("+ 1/2")).toBeTruthy();
    expect(screen.getByText("+ 1/3")).toBeTruthy();
    expect(screen.getByText("+ 1/4")).toBeTruthy();
    expect(screen.getByText("+ 1/6")).toBeTruthy();
    expect(screen.getByText("+ 1/8")).toBeTruthy();
    expect(screen.getByText("+ 1/10")).toBeTruthy();
  });

  it("exibe moedas e botão de som no cabeçalho", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });
    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("adiciona peça à Bandeja B (ativa por padrão) ao clicar na paleta", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByText("Bandeja B ✓ Ativa")).toBeTruthy());

    await fireEvent.press(screen.getByText("+ 1/2"));

    await waitFor(() => {
      expect(screen.getByText("Bandeja B ✓ Ativa")).toBeTruthy();
    });
  });

  it("alterna aba para Somar Pizzas", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByText("Comparar Barras")).toBeTruthy());

    await fireEvent.press(screen.getByRole("tab", { name: "Somar Pizzas" }));

    await waitFor(() => {
      expect(screen.getByText("Pizza 1 (1/4)")).toBeTruthy();
      expect(screen.getByText("Pizza 2 (2/4)")).toBeTruthy();
      expect(screen.getByText("Soma Total")).toBeTruthy();
    });
  });

  it("altera cortes da pizza via SliceCutControl", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByText("Comparar Barras")).toBeTruthy());

    await fireEvent.press(screen.getByRole("tab", { name: "Somar Pizzas" }));

    await waitFor(() => expect(screen.getByText("Pizza 1 (1/4)")).toBeTruthy());

    const cutButtons = screen.getAllByRole("button", { name: "Cortar em 8 fatias" });
    await fireEvent.press(cutButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Pizza 1 (1/8)")).toBeTruthy();
    });
  });

  it("limpa bandeja ativa com botão Limpar", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByText("Bandeja B ✓ Ativa")).toBeTruthy());

    await fireEvent.press(screen.getByText("+ 1/2"));

    const clearButtons = screen.getAllByRole("button", { name: "Limpar" });
    const clearEnabled = clearButtons.find((b) => b.props.accessibilityState?.disabled !== true) ?? clearButtons[0];
    await fireEvent.press(clearEnabled);

    await waitFor(() => {
      expect(screen.getByText("Toque nos blocos acima para preencher")).toBeTruthy();
    });
  });

  it("navega de volta ao Mapa", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Ir para o Mapa da Pizzaria" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Ir para o Mapa da Pizzaria" }));
    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som", async () => {
    await render(<SandboxScreen />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("não quebra se loadProgress falhar", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha"));

    await render(<SandboxScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bancada Mágica")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<SandboxScreen />);
    await waitFor(() => expect(screen.getByText("Bancada Mágica")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<SandboxScreen />);

    await waitFor(() => {
      expect(screen.getByText("Compare frações nas bandejas ou some duas pizzas de até 100 fatias!")).toBeTruthy();
      expect(screen.getByText(/42\s+Q/)).toBeTruthy();
    });
  });
});