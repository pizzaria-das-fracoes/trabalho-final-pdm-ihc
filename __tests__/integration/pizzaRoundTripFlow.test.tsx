import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { progressUseCases } from "@/di/container";
import PizzaScreen from "@/view/pizza";
import ProgressScreen from "@/view/progress";

describe("Integração Real: Sessão Completa de Pedidos de Pizza até Estrelas na Sala de Troféus", () => {
  beforeEach(async () => {
    await progressUseCases.resetProgress();
  });

  it("completa os 4 pedidos reais de Monte a Pizza, grava estrelas e reflete conquista na Sala de Troféus", async () => {
    const pizzaView = await render(<PizzaScreen />);
    await waitFor(() => expect(screen.getByText("Pedido 1/4")).toBeTruthy());

    for (let round = 1; round <= 4; round++) {
      await waitFor(() => expect(screen.getByText(`Pedido ${round}/4`)).toBeTruthy());

      const fractionImgs = screen.getAllByRole("image", { name: /^Fração \d+ sobre \d+$/ });
      const targetLabel = fractionImgs[0].props.accessibilityLabel as string;
      const match = /Fração (\d+) sobre (\d+)/.exec(targetLabel);
      expect(match).not.toBeNull();
      const targetNum = Number(match![1]);
      const targetDen = Number(match![2]);

      if (round === 1) {
        await fireEvent.press(screen.getByRole("button", { name: "Entregar pizza!" }));
        await waitFor(() =>
          expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy()
        );
      }

      const cutInput = screen.getByLabelText("Quantidade de fatias");
      await fireEvent.changeText(cutInput, String(targetDen));
      await fireEvent(cutInput, "blur");

      await fireEvent.changeText(
        screen.getByLabelText("Quantidade de fatias pintadas"),
        String(targetNum)
      );

      await fireEvent.press(screen.getByRole("button", { name: "Entregar pizza!" }));
      await waitFor(() => expect(screen.getByText("Pedido Perfeito!")).toBeTruthy());

      const advanceLabel = round < 4 ? "Próximo pedido" : "Pegar estrelas!";
      await fireEvent.press(screen.getByRole("button", { name: advanceLabel }));
    }

    await waitFor(() => expect(screen.getByText("Fornada Completa!")).toBeTruthy());
    expect(screen.getByLabelText("2 de 3 estrelas")).toBeTruthy();

    await pizzaView.unmount();

    await render(<ProgressScreen />);
    await waitFor(() => expect(screen.getByText("4 acertos")).toBeTruthy());
    expect(screen.getByText("2/21")).toBeTruthy();
  });
});
