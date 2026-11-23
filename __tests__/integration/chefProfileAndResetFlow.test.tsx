import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { progressUseCases } from "@/di/container";
import HomeScreen from "@/view/home";
import ProgressScreen from "@/view/progress";

describe("Integração Real: Perfil do Chef, Som e Reset entre View -> ViewModel -> UseCase -> DataSource", () => {
  beforeEach(async () => {
    await progressUseCases.resetProgress();
  });

  it("edita e persiste o nome do Chef e preferência de som entre desmontagem e nova montagem", async () => {
    const firstMount = await render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText("Olá, Chef!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Editar nome" }));
    await fireEvent.changeText(screen.getByLabelText("Nome do Chef"), "Chef Lara");
    await fireEvent.press(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(screen.getByText("Olá, Chef Lara!")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Ligar sons do jogo" })).toBeTruthy()
    );

    await firstMount.unmount();

    await render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText("Olá, Chef Lara!")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Ligar sons do jogo" })).toBeTruthy();
  });

  it("exibe estrelas/acertos gravados nos Use Cases e executa reset completo pela UI", async () => {
    await progressUseCases.updateChefName("Lucas");
    await progressUseCases.recordAttempt({
      questionId: "int-q1",
      worldId: "pizza",
      correct: true,
      answer: "3/4"
    });
    await progressUseCases.awardWorldStars("pizza", 3);

    await render(<ProgressScreen />);
    await waitFor(() => expect(screen.getByText("1 acertos")).toBeTruthy());
    expect(screen.getByText("3/21")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Zerar progresso" }));
    await fireEvent.press(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() => expect(screen.getByText("0 acertos")).toBeTruthy());
    expect(screen.getByText("0/21")).toBeTruthy();

    const snapshot = await progressUseCases.loadProgress();
    expect(snapshot.profile.chefName).toBe("Chef");
    expect(snapshot.attempts).toHaveLength(0);
  });
});
