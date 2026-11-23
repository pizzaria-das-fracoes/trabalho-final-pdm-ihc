import { fireEvent, render, screen } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import { Pizza } from "@/view/components/pizza";
import { SliceCutControl } from "@/view/components/sliceCutControl";

describe("Componentes Pizza e SliceCutControl", () => {
  afterEach(() => {
    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 }
    });
    jest.restoreAllMocks();
  });

  it("Pizza estática renderiza resumo numérico, papel acessível e mini-guarnições com sabores variados", async () => {
    const { rerender } = await render(
      <Pizza
        denominator={6}
        selected={[0, 2, 4]}
        label="Pizza de comparação 3/6"
        topping="olive"
      />
    );

    expect(screen.getByRole("image", { name: "Pizza de comparação 3/6" })).toBeTruthy();
    expect(screen.getByText("3/6")).toBeTruthy();

    await rerender(
      <Pizza denominator={24} selected={[0, 5]} label="Pizza 24 olive" topping="olive" />
    );
    await rerender(
      <Pizza denominator={50} selected={[0, 5]} label="Pizza 50 berry" topping="berry" />
    );
    await rerender(
      <Pizza denominator={1} selected={[]} label="Pizza 1 vazia" topping="pepperoni" />
    );
    expect(screen.getByText("0/1")).toBeTruthy();
  });

  it("Pizza cobre divisores limite, sabores e os modos com e sem resumo", async () => {
    const onToggleSlice = jest.fn();
    const { rerender } = await render(
      <Pizza
        denominator={12}
        selected={[]}
        label="Pizza divisor 12"
        topping="pepperoni"
        showSummary={false}
      />
    );

    expect(screen.queryByText("0/12")).toBeNull();
    expect(screen.getByRole("image", { name: "Pizza divisor 12" })).toBeTruthy();
    expect(onToggleSlice).not.toHaveBeenCalled();

    await rerender(
      <Pizza denominator={13} selected={[0]} label="Pizza divisor 13" topping="mushroom" onToggleSlice={onToggleSlice} />
    );
    await rerender(
      <Pizza denominator={24} selected={[0, 1]} label="Pizza divisor 24" topping="olive" onToggleSlice={onToggleSlice} />
    );
    await rerender(
      <Pizza denominator={25} selected={[0, 1, 2]} label="Pizza divisor 25" topping="berry" onToggleSlice={onToggleSlice} />
    );
    await rerender(
      <Pizza denominator={36} selected={[0, 1, 2, 3]} label="Pizza divisor 36" topping="pepperoni" />
    );
    await rerender(
      <Pizza denominator={37} selected={[0]} label="Pizza divisor 37" topping="mushroom" showSummary={false} />
    );
    await rerender(
      <Pizza denominator={50} selected={[0]} label="Pizza divisor 50" topping="olive" showSummary={false} />
    );
    await rerender(
      <Pizza denominator={51} selected={[0]} label="Pizza divisor 51" topping="berry" showSummary={false} />
    );
    await rerender(
      <Pizza denominator={101} selected={[0]} label="Pizza divisor limitado" topping="pepperoni" showSummary={false} />
    );
    await rerender(
      <Pizza denominator={0} selected={[0]} label="Pizza divisor mínimo" topping="mushroom" showSummary={false} />
    );

    expect(screen.getByRole("image", { name: "Pizza divisor mínimo" })).toBeTruthy();
  });

  it("Pizza interativa resolve coordenadas offsetX, changedTouches, borda externa e fallback", async () => {
    const onToggleSlice = jest.fn();
    const { rerender } = await render(
      <Pizza
        denominator={4}
        selected={[0]}
        label="Pizza interativa 1/4"
        showSummary={false}
        topping="berry"
        onToggleSlice={onToggleSlice}
      />
    );

    const pizzaButton = screen.getByRole("button", { name: "Pizza interativa 1/4" });

    // Coordenadas de toque válidas (tamanho padrão 176, centro 88) no quadrante inferior esquerdo
    await fireEvent.press(pizzaButton, { nativeEvent: { locationX: 60, locationY: 130 } });
    expect(onToggleSlice).toHaveBeenLastCalledWith(2);

    // Coordenadas via offsetX/offsetY (locationX/Y ausentes)
    await fireEvent.press(pizzaButton, {
      nativeEvent: { locationX: undefined, locationY: undefined, offsetX: 120, offsetY: 120 }
    });
    expect(onToggleSlice).toHaveBeenLastCalledWith(1);

    // Coordenadas via changedTouches (locationX/Y principais ausentes)
    await fireEvent.press(pizzaButton, {
      nativeEvent: {
        locationX: undefined,
        locationY: undefined,
        changedTouches: [{ locationX: 50, locationY: 60 }]
      }
    });
    expect(onToggleSlice).toHaveBeenLastCalledWith(3);

    // Toque fora do raio da pizza é ignorado (não dispara nova alternância)
    const callsBeforeOuterTap = onToggleSlice.mock.calls.length;
    await fireEvent.press(pizzaButton, { nativeEvent: { locationX: 500, locationY: 500 } });
    expect(onToggleSlice.mock.calls.length).toBe(callsBeforeOuterTap);

    // Sem coordenadas válidas, o toque deve ser ignorado em vez de pintar uma fatia arbitrária
    const callsBeforeMissingCoordinates = onToggleSlice.mock.calls.length;
    await fireEvent.press(pizzaButton, {
      nativeEvent: { locationX: undefined, locationY: undefined }
    });
    expect(onToggleSlice.mock.calls.length).toBe(callsBeforeMissingCoordinates);

    await rerender(
      <Pizza
        denominator={1}
        selected={[0]}
        label="Pizza inteira"
        topping="mushroom"
        onToggleSlice={onToggleSlice}
      />
    );
    await fireEvent.press(screen.getByRole("button", { name: "Pizza inteira" }));
    expect(onToggleSlice).toHaveBeenLastCalledWith(0);
  });

  it("SliceCutControl respeita limites min/max, valida entrada digitada em modo compacto e aplica presets", async () => {
    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 }
    });

    const onChange = jest.fn();
    const { rerender } = await render(
      <SliceCutControl value={4} min={2} max={10} presets={[2, 4, 8]} onChange={onChange} />
    );

    expect(screen.getByText("Cortes da pizza (2 a 100)")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Aumentar número de fatias" }));
    expect(onChange).toHaveBeenLastCalledWith(5);

    await fireEvent.press(screen.getByRole("button", { name: "Diminuir número de fatias" }));
    expect(onChange).toHaveBeenLastCalledWith(3);

    await fireEvent.press(screen.getByRole("button", { name: "Cortar em 8 fatias" }));
    expect(onChange).toHaveBeenLastCalledWith(8);

    const input = screen.getByLabelText("Quantidade de fatias");
    await fireEvent.changeText(input, "7a");
    expect(onChange).toHaveBeenLastCalledWith(7);

    // Limpar e desfocar restaura o valor atual sem disparar erro
    await fireEvent.changeText(input, "");
    await fireEvent(input, "blur");

    await fireEvent.changeText(input, "99");
    await fireEvent(input, "blur");
    expect(onChange).toHaveBeenLastCalledWith(10);

    const slider = screen.getByLabelText("Escolher número de fatias");
    await fireEvent(slider, "valueChange", 6);
    expect(onChange).toHaveBeenLastCalledWith(6);

    await rerender(<SliceCutControl value={2} min={2} max={10} onChange={onChange} />);
    const minusBtn = screen.getByRole("button", { name: "Diminuir número de fatias" });
    expect(minusBtn.props.accessibilityState?.disabled ?? minusBtn.props.disabled).toBe(true);
    const callCountBefore = onChange.mock.calls.length;
    await fireEvent.press(minusBtn);
    expect(onChange.mock.calls.length).toBe(callCountBefore);
  });
});
