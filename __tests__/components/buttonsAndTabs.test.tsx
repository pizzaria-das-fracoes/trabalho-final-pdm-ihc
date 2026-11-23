import { fireEvent, render, screen } from "@testing-library/react-native";
import { ActionButton } from "@/view/components/actionButton";
import { ChipButton } from "@/view/components/chipButton";
import { SegmentedTabs } from "@/view/components/segmentedTabs";
import { SliceCheckbox } from "@/view/components/sliceCheckbox";

describe("Componentes de Botões, Abas e Seleção de Fatias", () => {
  it("ActionButton renderiza rótulo, papel acessível e respeita estado desabilitado", async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      <ActionButton label="Entregar pizza!" variant="primary" onPress={onPress} />
    );

    const button = screen.getByRole("button", { name: "Entregar pizza!" });
    expect(button.props.accessibilityState).toEqual({ disabled: false });

    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(
      <ActionButton label="Entregar pizza!" variant="danger" size="sm" disabled onPress={onPress} />
    );
    const disabledButton = screen.getByRole("button", { name: "Entregar pizza!" });
    expect(disabledButton.props.accessibilityState).toEqual({ disabled: true });
    await fireEvent.press(disabledButton);
    expect(onPress).toHaveBeenCalledTimes(1);

    for (const variant of ["success", "magic", "gold", "outline"] as const) {
      await rerender(
        <ActionButton label="Entregar pizza!" variant={variant} size="sm" onPress={onPress} />
      );
      await fireEvent.press(screen.getByRole("button", { name: "Entregar pizza!" }));
    }
    expect(onPress).toHaveBeenCalledTimes(5);
  });

  it("ChipButton expõe accessibilityLabel customizada e aciona callback quando ativo", async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      <ChipButton
        label="Zerar"
        accessibilityLabel="Zerar fatias selecionadas"
        variant="danger"
        onPress={onPress}
      />
    );

    const chip = screen.getByRole("button", { name: "Zerar fatias selecionadas" });
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(
      <ChipButton
        label="Zerar"
        accessibilityLabel="Zerar fatias selecionadas"
        variant="magic"
        disabled
        onPress={onPress}
      />
    );
    await fireEvent.press(screen.getByRole("button", { name: "Zerar fatias selecionadas" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("SegmentedTabs marca aba ativa e dispara onChange ao selecionar outra aba", async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedTabs
        value="hats"
        onChange={onChange}
        items={[
          { id: "hats", label: "Acessórios" },
          { id: "toppings", label: "Sabores" },
          { id: "titles", label: "Títulos" }
        ]}
      />
    );

    expect(screen.getByRole("tab", { name: "Acessórios" }).props.accessibilityState).toEqual({
      selected: true
    });
    expect(screen.getByRole("tab", { name: "Sabores" }).props.accessibilityState).toEqual({
      selected: false
    });

    await fireEvent.press(screen.getByRole("tab", { name: "Títulos" }));
    expect(onChange).toHaveBeenCalledWith("titles");
  });

  it("SliceCheckbox alterna estado checked acessível e dispara onPress", async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      <SliceCheckbox index={1} denominator={4} checked={false} onPress={onPress} />
    );

    const checkbox = screen.getByRole("checkbox", { name: "Fatia 2 de 4" });
    expect(checkbox.props.accessibilityState).toEqual({ checked: false });
    expect(screen.queryByText("✓")).toBeNull();

    await fireEvent.press(checkbox);
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<SliceCheckbox index={1} denominator={4} checked onPress={onPress} />);
    expect(screen.getByRole("checkbox", { name: "Fatia 2 de 4" }).props.accessibilityState).toEqual({
      checked: true
    });
    expect(screen.getByText("✓")).toBeTruthy();
  });
});
