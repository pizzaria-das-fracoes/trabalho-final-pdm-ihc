/**
 * Por que mockar os ViewModels neste teste:
 * - Os hooks useWelcomeViewModel e useHomeViewModel acessam DI/AsyncStorage e expo-router.
 * - Isolando esses hooks, validamos exclusivamente a renderização condicional da View:
 *   exibição de erro de domínio, indicador de carregamento, edição inline do nome do Chef,
 *   cards dos mundos BNCC e disparo correto dos callbacks de ação.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { GAME_WORLDS } from "@/model/entities/game";
import { DEFAULT_PROFILE } from "@/model/entities/progress";
import HomeScreen from "@/view/home";
import WelcomeScreen from "@/view/index";
import {
  useHomeViewModel,
  type HomeActions,
  type HomeState
} from "@/viewmodel/useHomeViewModel";
import {
  useWelcomeViewModel,
  type WelcomeActions,
  type WelcomeState
} from "@/viewmodel/useWelcomeViewModel";

jest.mock("@/viewmodel/useWelcomeViewModel", () => ({
  useWelcomeViewModel: jest.fn()
}));

jest.mock("@/viewmodel/useHomeViewModel", () => ({
  useHomeViewModel: jest.fn()
}));

const mockedWelcomeVm = jest.mocked(useWelcomeViewModel);
const mockedHomeVm = jest.mocked(useHomeViewModel);

const makeHomeMock = (
  stateOverrides: Partial<HomeState> = {},
  actionOverrides: Partial<HomeActions> = {}
): [HomeState, HomeActions] => [
  {
    profile: DEFAULT_PROFILE,
    loading: false,
    error: null,
    activeRoute: "/home",
    editingName: false,
    draftName: DEFAULT_PROFILE.chefName,
    level: 1,
    currentXp: 40,
    totalStars: 5,
    maxStars: 21,
    activeTitle: "Aprendiz do Forno",
    nextWorld: GAME_WORLDS[0],
    worlds: GAME_WORLDS,
    ...stateOverrides
  },
  {
    handleNavigate: jest.fn(),
    handleToggleSound: jest.fn(),
    handleStartEditName: jest.fn(),
    handleDraftNameChange: jest.fn(),
    handleSaveName: jest.fn(),
    ...actionOverrides
  }
];

describe("Views Welcome e Home com ViewModel mockado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("WelcomeScreen exibe erro controlado do ViewModel e aciona botões de entrada", async () => {
    const actions: WelcomeActions = {
      handleStart: jest.fn(),
      handleNavigate: jest.fn(),
      handleToggleSound: jest.fn()
    };
    const state: WelcomeState = {
      profile: { ...DEFAULT_PROFILE, equippedHat: "crown", equippedTopping: "berry" },
      activeRoute: "/",
      error: "Falha ao carregar perfil local"
    };
    mockedWelcomeVm.mockReturnValue([state, actions]);

    await render(<WelcomeScreen />);

    expect(screen.getByText("Falha ao carregar perfil local")).toBeTruthy();
    expect(screen.getByText("4/6 saindo do forno!")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Entrar na Pizzaria" }));
    expect(actions.handleStart).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "Abrir Bancada Mágica" }));
    expect(actions.handleNavigate).toHaveBeenCalledWith("/sandbox");
  });

  it("HomeScreen renderiza modo leitura, modo edição de nome e navegação das estações", async () => {
    const [, actions] = makeHomeMock();
    mockedHomeVm.mockReturnValue(
      makeHomeMock(
        {
          loading: true,
          error: "Erro temporário de leitura",
          profile: { ...DEFAULT_PROFILE, chefName: "Ana", worldStars: { pizza: 3 } },
          nextWorld: GAME_WORLDS[1]
        },
        actions
      )
    );

    const { rerender } = await render(<HomeScreen />);

    expect(screen.getByText("Carregando...")).toBeTruthy();
    expect(screen.getByText("Erro temporário de leitura")).toBeTruthy();
    expect(screen.getByText("Olá, Ana!")).toBeTruthy();
    expect(screen.getByText("Repetir →")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Editar nome" }));
    expect(actions.handleStartEditName).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "Abrir Duelo Relâmpago" }));
    expect(actions.handleNavigate).toHaveBeenCalledWith("/arcade");

    mockedHomeVm.mockReturnValue(
      makeHomeMock(
        { editingName: true, draftName: "Chef Bia" },
        actions
      )
    );
    await rerender(<HomeScreen />);

    const input = screen.getByLabelText("Nome do Chef");
    await fireEvent.changeText(input, "Chef Bia");
    expect(actions.handleDraftNameChange).toHaveBeenCalledWith("Chef Bia");

    await fireEvent.press(screen.getByRole("button", { name: "Salvar" }));
    expect(actions.handleSaveName).toHaveBeenCalledTimes(1);
  });
});
