import { fireEvent, render, screen } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import { Text } from "react-native";
import type { QuizChallenge } from "@/model/entities/game";
import { ActivityShell } from "@/view/components/activityShell";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";

const baseChallenge: QuizChallenge = {
  id: "op-test-1",
  prompt: "Calcule 5/6 − 1/3",
  instruction: "Use as barras divididas em partes iguais.",
  options: ["1/2", "2/3", "1/3"],
  expected: "1/2",
  explanation: "5/6 - 2/6 = 3/6 = 1/2",
  hint: "Transforme 1/3 em 2/6.",
  visualData: {
    leftLabel: "5/6",
    leftFrac: { n: 5, d: 6 },
    rightLabel: "1/3 = 2/6",
    rightFrac: { n: 2, d: 6 },
    opSign: "-",
    resultFrac: { n: 3, d: 6 },
    refNumerator: 1,
    refDenominator: 2
  }
};

describe("Componentes Screen, StageProgress, PizzaAvatar e ActivityShell", () => {
  afterEach(() => {
    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 }
    });
    jest.restoreAllMocks();
  });

  it("Screen exibe saldo de Queijos, botão de som acessível e marca guia ativa em tela ampla e compacta", async () => {
    const onNavigate = jest.fn();
    const onToggleSound = jest.fn();
    const { rerender } = await render(
      <Screen
        navigation
        coins={45}
        soundEnabled
        equippedTopping="pepperoni"
        activeRoute="/pizza"
        onNavigate={onNavigate}
        onToggleSound={onToggleSound}
      >
        <Text>Conteúdo da Pizzaria</Text>
      </Screen>
    );

    expect(screen.getByText(/45\s+Queijos/)).toBeTruthy();
    expect(screen.getByText("Som")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Mapa" }).props.accessibilityState).toEqual({
      selected: true
    });

    await fireEvent.press(screen.getByRole("button", { name: "Ir para o Mapa da Pizzaria" }));
    expect(onNavigate).toHaveBeenCalledWith("/home");

    await fireEvent.press(screen.getByRole("button", { name: "Desligar sons do jogo" }));
    expect(onToggleSound).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("tab", { name: "Oficina" }));
    expect(onNavigate).toHaveBeenCalledWith("/shop");

    ReactNative.Dimensions.set({
      window: { width: 360, height: 540, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 540, scale: 2, fontScale: 1 }
    });

    await rerender(
      <Screen
        navigation={false}
        coins={45}
        soundEnabled={false}
        equippedTopping="olive"
        activeRoute="/about"
        onNavigate={onNavigate}
        onToggleSound={onToggleSound}
      >
        <Text>Sobre compacto</Text>
      </Screen>
    );

    expect(screen.getByText("45 Q")).toBeTruthy();
    expect(screen.getByText("Mudo")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Ligar sons do jogo" }));
    expect(onToggleSound).toHaveBeenCalledTimes(2);
  });

  it("StageHeader e VictoryCard exibem progresso, combo, estrelas e ações de saída", async () => {
    const onBackToMap = jest.fn();
    const onReplay = jest.fn();
    await render(
      <>
        <StageHeader
          title="Equivalência"
          roundIndex={1}
          totalRounds={4}
          coins={30}
          streak={3}
          onBackToMap={onBackToMap}
        />
        <VictoryCard
          worldTitle="Equivalência"
          stars={3}
          chefName="Maria"
          hat="stars"
          onReplay={onReplay}
          onMap={onBackToMap}
        />
      </>
    );

    expect(screen.getByText("Pedido 2/4")).toBeTruthy();
    expect(screen.getByText("Combo ×3")).toBeTruthy();
    expect(screen.getByText("Turno Concluído · Maria")).toBeTruthy();
    expect(screen.getByLabelText("3 de 3 estrelas")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para o Mapa" }));
    await fireEvent.press(screen.getByRole("button", { name: "Novo Turno" }));
    expect(onBackToMap).toHaveBeenCalledTimes(1);
    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  it("ActivityShell renderiza visuais equivalent/decimal/operations e alterna de conferir para vitória (incluindo tela compacta)", async () => {
    const onSelectAnswer = jest.fn();
    const onSubmit = jest.fn();
    const onNextRound = jest.fn();
    const onRestart = jest.fn();
    const onBackToMap = jest.fn();

    const { rerender } = await render(
      <ActivityShell
        screenTitle="Operações"
        visual="operations"
        coins={30}
        streak={0}
        soundEnabled
        equippedTopping="pepperoni"
        equippedHat="chef"
        chefName="Chef"
        activeRoute="/operations"
        challenge={baseChallenge}
        roundIndex={0}
        totalRounds={4}
        answer={null}
        wrongAttempts={[]}
        feedback={null}
        completed={false}
        earnedStars={0}
        onNavigate={jest.fn()}
        onToggleSound={jest.fn()}
        onBackToMap={onBackToMap}
        onSelectAnswer={onSelectAnswer}
        onSubmit={onSubmit}
        onNextRound={onNextRound}
        onRestart={onRestart}
      />
    );

    const checkBtn = screen.getByRole("button", { name: "Conferir resposta" });
    expect(checkBtn.props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText("Resultado ?")).toBeTruthy();

    // Testa feedback correto no visual operations em tela compacta
    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 }
    });

    await rerender(
      <ActivityShell
        screenTitle="Operações"
        visual="operations"
        coins={30}
        streak={2}
        soundEnabled
        equippedTopping="pepperoni"
        equippedHat="chef"
        chefName="Chef"
        activeRoute="/operations"
        challenge={baseChallenge}
        roundIndex={0}
        totalRounds={4}
        answer="1/2"
        wrongAttempts={[]}
        feedback={{ correct: true, message: "Boa!", xp: 15 }}
        completed={false}
        earnedStars={0}
        onNavigate={jest.fn()}
        onToggleSound={jest.fn()}
        onBackToMap={onBackToMap}
        onSelectAnswer={onSelectAnswer}
        onSubmit={onSubmit}
        onNextRound={onNextRound}
        onRestart={onRestart}
      />
    );
    expect(screen.getByText("Próximo desafio")).toBeTruthy();

    // Visual equivalent sem resposta correta ainda ("?") e feedback de dica
    await rerender(
      <ActivityShell
        screenTitle="Equivalentes"
        visual="equivalent"
        coins={30}
        streak={0}
        soundEnabled
        equippedTopping="olive"
        equippedHat="cap"
        chefName="Leo"
        activeRoute="/equivalent"
        challenge={baseChallenge}
        roundIndex={1}
        totalRounds={4}
        answer="2/3"
        wrongAttempts={["1/3"]}
        feedback={{ correct: false, message: "Tente outra!" }}
        completed={false}
        earnedStars={0}
        onNavigate={jest.fn()}
        onToggleSound={jest.fn()}
        onBackToMap={onBackToMap}
        onSelectAnswer={onSelectAnswer}
        onSubmit={onSubmit}
        onNextRound={onNextRound}
        onRestart={onRestart}
      />
    );
    expect(screen.getByText("Fração Equivalente")).toBeTruthy();
    expect(screen.getByText("?")).toBeTruthy();

    // Visual decimal respondido corretamente
    await rerender(
      <ActivityShell
        screenTitle="Decimais"
        visual="decimal"
        coins={40}
        streak={1}
        soundEnabled
        equippedTopping="berry"
        equippedHat="crown"
        chefName="Chef"
        activeRoute="/decimal"
        challenge={{ ...baseChallenge, expected: "0,5" }}
        roundIndex={3}
        totalRounds={4}
        answer="0,5"
        wrongAttempts={[]}
        feedback={{ correct: true, message: "Correto!", xp: 15 }}
        completed={false}
        earnedStars={0}
        onNavigate={jest.fn()}
        onToggleSound={jest.fn()}
        onBackToMap={onBackToMap}
        onSelectAnswer={onSelectAnswer}
        onSubmit={onSubmit}
        onNextRound={onNextRound}
        onRestart={onRestart}
      />
    );

    expect(screen.getByText("0,5")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Pegar estrelas!" }));
    expect(onNextRound).toHaveBeenCalledTimes(1);

    await rerender(
      <ActivityShell
        screenTitle="Equivalentes"
        visual="equivalent"
        coins={40}
        streak={1}
        soundEnabled
        equippedTopping="olive"
        equippedHat="cap"
        chefName="Leo"
        activeRoute="/equivalent"
        challenge={baseChallenge}
        roundIndex={3}
        totalRounds={4}
        answer="1/2"
        wrongAttempts={[]}
        feedback={null}
        completed
        earnedStars={3}
        onNavigate={jest.fn()}
        onToggleSound={jest.fn()}
        onBackToMap={onBackToMap}
        onSelectAnswer={onSelectAnswer}
        onSubmit={onSubmit}
        onNextRound={onNextRound}
        onRestart={onRestart}
      />
    );
    expect(screen.getByText("Fornada Completa!")).toBeTruthy();
  });

  it("PizzaAvatar renderiza todas as variações de chapéu e humor com rótulo acessível", async () => {
    const hats = ["chef", "crown", "cap", "stars"] as const;
    for (const hat of hats) {
      const { unmount } = await render(
        <PizzaAvatar size={64} hat={hat} mood="thinking" label={`Avatar ${hat}`} />
      );
      expect(screen.getByRole("image", { name: `Avatar ${hat}` })).toBeTruthy();
      await unmount();
    }
  });
});
