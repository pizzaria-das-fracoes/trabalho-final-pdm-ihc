/**
 * Por que mockar os ViewModels neste teste:
 * - useShopViewModel e useProgressViewModel persistem compras e apagamento de progresso via DataSource.
 * - Com o mock controlado, testamos todos os estados visuais da Loja (Equipado/Equipar/Preço/Desabilitado
 *   por saldo insuficiente e troca de abas) e da Sala de Troféus (carregando, conquistas bloqueadas/desbloqueadas,
 *   aba de mundos e fluxo de confirmação/cancelamento de reset) sem gravar em storage real.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { ACHIEVEMENTS, GAME_WORLDS, HAT_SHOP, RARITY_META, TITLE_SHOP, TOPPING_SHOP } from "@/model/entities/game";
import { DEFAULT_PROFILE } from "@/model/entities/progress";
import ProgressScreen from "@/view/progress";
import ShopScreen from "@/view/shop";
import {
  useProgressViewModel,
  type ProgressActions,
  type ProgressState
} from "@/viewmodel/useProgressViewModel";
import {
  useShopViewModel,
  type ShopActions,
  type ShopState
} from "@/viewmodel/useShopViewModel";

jest.mock("@/viewmodel/useShopViewModel", () => ({
  useShopViewModel: jest.fn()
}));

jest.mock("@/viewmodel/useProgressViewModel", () => ({
  useProgressViewModel: jest.fn()
}));

const mockedShopVm = jest.mocked(useShopViewModel);
const mockedProgressVm = jest.mocked(useProgressViewModel);

const makeShopMock = (
  stateOverrides: Partial<ShopState> = {},
  actionOverrides: Partial<ShopActions> = {}
): [ShopState, ShopActions] => [
  {
    profile: { ...DEFAULT_PROFILE, coins: 40, unlockedHats: ["chef", "cap"], equippedHat: "chef" },
    activeRoute: "/shop",
    tab: "hats",
    activeTitle: "Aprendiz do Forno",
    hats: HAT_SHOP,
    toppings: TOPPING_SHOP,
    titles: TITLE_SHOP,
    rarityMeta: RARITY_META,
    error: null,
    ...stateOverrides
  },
  {
    handleNavigate: jest.fn(),
    handleToggleSound: jest.fn(),
    handleSelectTab: jest.fn(),
    handleSelectHat: jest.fn(),
    handleSelectTopping: jest.fn(),
    handleSelectTitle: jest.fn(),
    ...actionOverrides
  }
];

const makeProgressMock = (
  stateOverrides: Partial<ProgressState> = {},
  actionOverrides: Partial<ProgressActions> = {}
): [ProgressState, ProgressActions] => [
  {
    profile: { ...DEFAULT_PROFILE, achievements: ["first-slice"], worldStars: { pizza: 3 } },
    attempts: [],
    loading: false,
    error: null,
    activeRoute: "/progress",
    tab: "achievements",
    confirmReset: false,
    level: 2,
    totalStars: 3,
    maxStars: 21,
    totalCorrect: 8,
    activeTitle: "Aprendiz do Forno",
    achievements: ACHIEVEMENTS,
    worlds: GAME_WORLDS,
    ...stateOverrides
  },
  {
    handleNavigate: jest.fn(),
    handleToggleSound: jest.fn(),
    handleSelectTab: jest.fn(),
    handleRequestReset: jest.fn(),
    handleCancelReset: jest.fn(),
    handleConfirmReset: jest.fn(),
    ...actionOverrides
  }
];

describe("Views Shop e Progress com ViewModel mockado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ShopScreen alterna abas Acessórios, Sabores e Títulos respeitando itens bloqueados e equipados", async () => {
    const [, actions] = makeShopMock();
    mockedShopVm.mockReturnValue(makeShopMock({ error: "Saldo insuficiente!" }, actions));

    const { rerender } = await render(<ShopScreen />);

    expect(screen.getByText("Saldo insuficiente!")).toBeTruthy();
    expect(screen.getByText("40 Q")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Equipado" }).props.accessibilityState).toEqual({
      disabled: true
    });

    await fireEvent.press(screen.getByRole("button", { name: "Equipar" }));
    expect(actions.handleSelectHat).toHaveBeenCalledWith("cap");

    const crownButton = screen.getByRole("button", { name: "100 Q" });
    expect(crownButton.props.accessibilityState).toEqual({ disabled: true });

    await fireEvent.press(screen.getByRole("tab", { name: "Sabores" }));
    expect(actions.handleSelectTab).toHaveBeenCalledWith("toppings");

    mockedShopVm.mockReturnValue(
      makeShopMock({ tab: "toppings", profile: { ...DEFAULT_PROFILE, coins: 100 } }, actions)
    );
    await rerender(<ShopScreen />);
    expect(screen.getByText("Em uso")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "40 Q" }));
    expect(actions.handleSelectTopping).toHaveBeenCalledWith("mushroom");

    mockedShopVm.mockReturnValue(
      makeShopMock({ tab: "titles", profile: { ...DEFAULT_PROFILE, coins: 100 } }, actions)
    );
    await rerender(<ShopScreen />);
    expect(screen.getByText("Ativo")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "25 Q" }));
    expect(actions.handleSelectTitle).toHaveBeenCalledWith("velocista");
  });

  it("ProgressScreen exibe métricas, alterna para Estrelas por Mundo e controla confirmação de reset", async () => {
    const [, actions] = makeProgressMock();
    mockedProgressVm.mockReturnValue(makeProgressMock({ loading: true }, actions));

    const { rerender } = await render(<ProgressScreen />);
    expect(screen.getByText("...")).toBeTruthy();
    expect(screen.getByText("★")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Zerar progresso" }));
    expect(actions.handleRequestReset).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("tab", { name: "Estrelas por Mundo" }));
    expect(actions.handleSelectTab).toHaveBeenCalledWith("worlds");

    mockedProgressVm.mockReturnValue(
      makeProgressMock({ loading: false, tab: "worlds", confirmReset: true, error: "Erro" }, actions)
    );
    await rerender(<ProgressScreen />);

    expect(screen.getByText("8 acertos")).toBeTruthy();
    expect(screen.getByText("3/3 ★ →")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Abrir Monte a Pizza" }));
    expect(actions.handleNavigate).toHaveBeenCalledWith("/pizza");

    await fireEvent.press(screen.getByRole("button", { name: "Confirmar" }));
    expect(actions.handleConfirmReset).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
    expect(actions.handleCancelReset).toHaveBeenCalledTimes(1);
  });
});
