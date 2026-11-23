/**
 * Por que mockar o usePizzaViewModel neste teste:
 * - O ViewModel gera pedidos aleatórios no início da sessão, calcula equivalência e grava em DataSource.
 * - Mockar o ViewModel fixa um pedido determinístico e permite validar diretamente todos os caminhos
 *   visuais da PizzaScreen: pedido na comanda, botão Zerar desabilitado/habilitado, input numérico,
 *   feedback positivo, transição para VictoryCard e botão de erro/próximo pedido.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DEFAULT_PROFILE } from "@/model/entities/progress";
import PizzaScreen from "@/view/pizza";
import {
  usePizzaViewModel,
  type PizzaActions,
  type PizzaState
} from "@/viewmodel/usePizzaViewModel";

jest.mock("@/viewmodel/usePizzaViewModel", () => ({
  usePizzaViewModel: jest.fn()
}));

const mockedPizzaVm = jest.mocked(usePizzaViewModel);

const makePizzaMock = (
  stateOverrides: Partial<PizzaState> = {},
  actionOverrides: Partial<PizzaActions> = {}
): [PizzaState, PizzaActions] => [
  {
    profile: DEFAULT_PROFILE,
    activeRoute: "/pizza",
    challenge: {
      id: "pizza-3-4",
      customer: "Pedido de Leo: quero 3 quartos da pizza!",
      targetNumerator: 3,
      targetDenominator: 4,
      initialDenominator: 4,
      allowCutChange: false,
      hint: "Pinte 3 de 4 fatias."
    },
    roundIndex: 0,
    totalRounds: 4,
    denominator: 4,
    selected: [],
    feedback: null,
    completed: false,
    earnedStars: 0,
    error: null,
    ...stateOverrides
  },
  {
    handleNavigate: jest.fn(),
    handleBackToMap: jest.fn(),
    handleToggleSound: jest.fn(),
    handleSetDenominator: jest.fn(),
    handleSetSelectedCount: jest.fn(),
    handleToggleSlice: jest.fn(),
    handleCheck: jest.fn(),
    handleNextRound: jest.fn(),
    handleRestart: jest.fn(),
    ...actionOverrides
  }
];

describe("PizzaScreen com ViewModel mockado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza comanda fixa, controla pintura rápida/zerar e dispara entrega da pizza", async () => {
    const [, actions] = makePizzaMock();
    mockedPizzaVm.mockReturnValue(makePizzaMock({ selected: [0, 1], error: "Aviso de teste" }, actions));

    await render(<PizzaScreen />);

    expect(screen.getByText("Comanda #1 · Balcão")).toBeTruthy();
    expect(screen.getByText("Pedido de Leo: quero 3 quartos da pizza!")).toBeTruthy();
    expect(screen.getByText("2 de 4 fatias")).toBeTruthy();
    expect(screen.getByText("Aviso de teste")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Zerar fatias selecionadas" }));
    expect(actions.handleSetSelectedCount).toHaveBeenCalledWith(0);

    await fireEvent.changeText(screen.getByLabelText("Quantidade de fatias pintadas"), "3");
    expect(actions.handleSetSelectedCount).toHaveBeenCalledWith(3);

    await fireEvent(screen.getByLabelText("Selecionar quantidade de fatias"), "valueChange", 2.6);
    expect(actions.handleSetSelectedCount).toHaveBeenCalledWith(3);

    await fireEvent.press(screen.getByRole("button", { name: "Entregar pizza!" }));
    expect(actions.handleCheck).toHaveBeenCalledTimes(1);
  });

  it("exibe feedback de acerto, botão Pegar estrelas! na última rodada e VictoryCard ao concluir", async () => {
    const [, actions] = makePizzaMock();
    mockedPizzaVm.mockReturnValue(
      makePizzaMock(
        {
          roundIndex: 3,
          selected: [0, 1, 2],
          feedback: { correct: true, message: "Perfeito!", xp: 15 }
        },
        actions
      )
    );

    const { rerender } = await render(<PizzaScreen />);
    expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    expect(actions.handleNextRound).toHaveBeenCalledTimes(1);

    mockedPizzaVm.mockReturnValue(makePizzaMock({ completed: true, earnedStars: 3 }, actions));
    await rerender(<PizzaScreen />);
    expect(screen.getByText("Fornada Completa!")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));
    expect(actions.handleRestart).toHaveBeenCalledTimes(1);
  });
});
