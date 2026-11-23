import { fireEvent, render, screen } from "@testing-library/react-native";
import { ChoiceList } from "@/view/components/choiceList";
import { Feedback } from "@/view/components/feedback";
import { FractionDisplay } from "@/view/components/fractionDisplay";

describe("Componentes ChoiceList, Feedback e FractionDisplay", () => {
  it("ChoiceList renderiza grupo de opções, desabilita tentativas erradas e seleciona alternativa válida", async () => {
    const onSelect = jest.fn();
    await render(
      <ChoiceList
        options={["2/4", "3/5", "4/6"]}
        selected="4/6"
        wrongAttempts={["3/5"]}
        onSelect={onSelect}
        fractionOptions={{
          "2/4": { numerator: 2, denominator: 4 },
          "3/5": { numerator: 3, denominator: 5 },
          "4/6": { numerator: 4, denominator: 6 }
        }}
        topping="olive"
      />
    );

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0].props.accessibilityState).toEqual({ selected: false, disabled: false });
    expect(radios[1].props.accessibilityState).toEqual({ selected: false, disabled: true });
    expect(radios[2].props.accessibilityState).toEqual({ selected: true, disabled: false });
    expect(screen.getByText("✕")).toBeTruthy();

    await fireEvent.press(radios[1]);
    expect(onSelect).not.toHaveBeenCalled();

    await fireEvent.press(radios[0]);
    expect(onSelect).toHaveBeenCalledWith("2/4");
  });

  it("Feedback exibe mensagem de acerto com recompensa e mensagem de erro com dica", async () => {
    const { rerender } = await render(
      <Feedback correct message="2/4 é equivalente a 1/2!" xp={15} hat="crown" />
    );

    expect(screen.getByText("Pedido Perfeito!")).toBeTruthy();
    expect(screen.getByText("+15 XP · +10 Q")).toBeTruthy();
    expect(screen.getByText("2/4 é equivalente a 1/2!")).toBeTruthy();
    expect(screen.getByRole("image", { name: "Chef Fatia comemorando" })).toBeTruthy();

    await rerender(
      <Feedback correct={false} message="Dica: multiplique numerador e denominador." hat="cap" />
    );
    expect(screen.getByText("Quase lá — tente outro caminho!")).toBeTruthy();
    expect(screen.queryByText(/\+\d+ XP/)).toBeNull();
    expect(screen.getByRole("image", { name: "Chef Fatia dando uma dica" })).toBeTruthy();
  });

  it("FractionDisplay exibe numerador, denominador e legendas didáticas quando solicitadas", async () => {
    await render(<FractionDisplay numerator={3} denominator={8} labels tone="magic" />);

    expect(screen.getByRole("image", { name: "Fração 3 sobre 8" })).toBeTruthy();
    expect(screen.getByText("parte pintada")).toBeTruthy();
    expect(screen.getByText("total de fatias")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
  });
});
