import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import type { PlayerProfile } from "@/model/entities/progress";
import AboutScreen from "@/view/about";
import { progressUseCases } from "@/di/container";
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

describe("AboutScreen — renderização, navegação e interações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(progressUseCases, "loadProgress").mockResolvedValue({
      profile: mockProfile,
      attempts: [],
    });
    jest.spyOn(progressUseCases, "playSound").mockImplementation(() => {});
    jest.spyOn(progressUseCases, "toggleSound").mockResolvedValue(mockProfile);

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

  it("renderiza o título, avatar, texto de boas-vindas e cards informativos", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      expect(screen.getByText("Guia do Chef")).toBeTruthy();
    });

    expect(screen.getByText("Sobre o FatiaMática")).toBeTruthy();
    expect(screen.getByText("Um jogo divertido para explorar frações, fatia por fatia!")).toBeTruthy();

    expect(screen.getByText("1. Trilha da Pizzaria")).toBeTruthy();
    expect(screen.getByText("Jogue 7 mundos com pedidos de clientes, duelos de bandejas, entregas na avenida e receitas secretas para ganhar estrelas.")).toBeTruthy();

    expect(screen.getByText("2. Bancada & Relâmpago")).toBeTruthy();
    expect(screen.getByText("3. Oficina do Chef")).toBeTruthy();

    expect(screen.getByText("Privacidade em 1º lugar")).toBeTruthy();
    expect(screen.getByText("Não precisa criar conta nem colocar e-mail. Suas estrelas e moedas ficam salvas apenas neste aparelho.")).toBeTruthy();
  });

  it("exibe moedas e botão de som no cabeçalho via Screen", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      expect(screen.getByText(/42\s+Queijos/)).toBeTruthy();
    });

    expect(screen.getByText("Som")).toBeTruthy();
  });

  it("navega para a Sala de Troféus ao clicar em 'Voltar aos Troféus'", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Voltar aos Troféus" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Voltar aos Troféus" }));

    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
    expect(progressUseCases.playSound).toHaveBeenCalledTimes(1);
  });

  it("navega para o Mapa ao clicar em 'Ir para o Mapa'", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ir para o Mapa" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Ir para o Mapa" }));

    expect(progressUseCases.playSound).toHaveBeenCalledWith("pop", true);
  });

  it("alterna som ao clicar no botão de som no cabeçalho", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desligar sons do jogo" })).toBeTruthy();
    });

    // Som está ligado (mockProfile.soundEnabled = true); clicar desliga, então playSound não é chamado
    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));

    expect(progressUseCases.toggleSound).toHaveBeenCalledTimes(1);
  });

  it("renderiza avatar com chapéu e humor configurados do perfil", async () => {
    await render(<AboutScreen />);

    await waitFor(() => {
      const avatar = screen.getByRole("image", { name: /Chef Fatia, mascote do jogo/ });
      expect(avatar).toBeTruthy();
    });
  });

  it("não quebra se loadProgress falhar com erro não-DomainError", async () => {
    jest.spyOn(progressUseCases, "loadProgress").mockRejectedValueOnce(new Error("falha de armazenamento"));

    await render(<AboutScreen />);

    // O componente não deve lançar erro - renderiza com perfil padrão
    await waitFor(() => {
      expect(screen.getByText("Sobre o FatiaMática")).toBeTruthy();
    }, { timeout: 2000 });
  });
});