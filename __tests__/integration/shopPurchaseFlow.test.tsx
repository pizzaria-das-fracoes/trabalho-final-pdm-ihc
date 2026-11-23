import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { progressUseCases } from "@/di/container";
import ShopScreen from "@/view/shop";

describe("Integração Real: Loja e Economia entre View -> ViewModel -> ShopUseCases -> DataSource", () => {
  beforeEach(async () => {
    await progressUseCases.resetProgress();
  });

  it("impede compra sem saldo na aba Acessórios e conclui compra/equipamento na aba Títulos com persistência", async () => {
    const view = await render(<ShopScreen />);

    await waitFor(() => expect(screen.getByText("30 Q")).toBeTruthy());

    const capButton = screen.getByRole("button", { name: "35 Q" });
    expect(capButton.props.accessibilityState).toEqual({ disabled: true });

    await fireEvent.press(screen.getByRole("tab", { name: "Títulos" }));
    const titleButton = await screen.findByRole("button", { name: "25 Q" });
    expect(titleButton.props.accessibilityState).toEqual({ disabled: false });

    await fireEvent.press(titleButton);

    await waitFor(() => expect(screen.getByText("5 Q")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Ativo" })).toBeTruthy();

    await view.unmount();

    const snapshot = await progressUseCases.loadProgress();
    expect(snapshot.profile.coins).toBe(5);
    expect(snapshot.profile.unlockedTitles).toContain("velocista");
    expect(snapshot.profile.equippedTitle).toBe("velocista");
  });
});
