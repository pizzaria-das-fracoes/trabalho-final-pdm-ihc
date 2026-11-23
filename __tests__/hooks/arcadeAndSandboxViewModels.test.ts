import { act, renderHook, waitFor } from "@testing-library/react-native";
import { usePathname, useRouter } from "expo-router";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import { DomainError } from "@/model/errors";
import { ActivityUseCases } from "@/usecase/activityUseCases";
import { ProgressUseCases } from "@/usecase/progressUseCases";
import { useArcadeViewModel } from "@/viewmodel/useArcadeViewModel";
import { useSandboxViewModel } from "@/viewmodel/useSandboxViewModel";

const setup = () => {
  const ds = new MemoryProgressDataSource();
  const sound = new MemorySoundService();
  const progUseCases = new ProgressUseCases(ds, sound);
  const actUseCases = new ActivityUseCases();
  return { ds, sound, progUseCases, actUseCases };
};

describe("Hooks ViewModel do Arcade e Bancada Mágica", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue({
      push,
      replace: jest.fn(),
      back: jest.fn()
    } as never);
    jest.mocked(usePathname).mockReturnValue("/arcade");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("useArcadeViewModel controla início, acertos, combo, vitória e perda total de vidas", async () => {
    jest.useFakeTimers();
    const { progUseCases, actUseCases } = setup();
    const { result, unmount } = await renderHook(() => useArcadeViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].phase).toBe("ready"));

    await act(async () => {
      result.current[1].handleSetTimedMode("untimed");
    });
    expect(result.current[0].timedMode).toBe(false);

    await act(async () => {
      result.current[1].handleStartGame();
    });
    expect(result.current[0].phase).toBe("playing");

    for (let i = 0; i < result.current[0].totalQuestions; i++) {
      const current = result.current[0].current;
      expect(current).toBeDefined();
      await act(async () => {
        result.current[1].handleAnswerQuestion(current!.answer);
      });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    }

    await waitFor(() => expect(result.current[0].phase).toBe("won"));
    expect(result.current[0].score).toBeGreaterThan(100);
    expect(result.current[0].profile.arcadeHighScore).toBe(result.current[0].score);

    await act(async () => {
      result.current[1].handleStartGame();
    });
    for (let i = 0; i < 3; i++) {
      const current = result.current[0].current!;
      const wrong = current.options.find((o) => o !== current.answer)!;
      await act(async () => {
        result.current[1].handleAnswerQuestion(wrong);
      });
      await act(async () => {
        jest.advanceTimersByTime(1200);
      });
    }

    await waitFor(() => expect(result.current[0].phase).toBe("gameover"));
    await act(async () => {
      result.current[1].handleNavigate("/home");
      result.current[1].handleBackToMap();
      result.current[1].handleToggleSound();
    });
    expect(push).toHaveBeenCalledWith("/home");
    await unmount();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("useArcadeViewModel encerra partida por tempo esgotado no modo cronometrado", async () => {
    jest.useFakeTimers();
    const { progUseCases, actUseCases } = setup();
    const { result, unmount } = await renderHook(() => useArcadeViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].phase).toBe("ready"));
    await act(async () => {
      result.current[1].handleStartGame();
    });
    expect(result.current[0].timedMode).toBe(true);

    for (let sec = 0; sec < 46; sec++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    }

    await waitFor(() => expect(result.current[0].phase).toBe("gameover"));
    await unmount();
    jest.clearAllTimers();
    jest.useRealTimers();

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new Error("Falha inesperada Arcade"));
    const unexpected = await renderHook(() => useArcadeViewModel(progUseCases, actUseCases));
    await waitFor(() => expect(unexpected.result.current[0].profile.chefName).toBe("Chef"));
  });

  it("useSandboxViewModel manipula bandejas, valida soma <= 1 inteiro, reivindica missão e opera modo mistura", async () => {
    const { progUseCases } = setup();
    const { result } = await renderHook(() => useSandboxViewModel(progUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    // Para resolver Desafio 1 (1/2 na Bandeja A sem usar bloco 1/2), limpa A e adiciona dois 1/4
    await act(async () => {
      result.current[1].handleClearTray("A");
      result.current[1].handleSetActiveTray("A");
    });
    await act(async () => {
      result.current[1].handleAddPiece(4);
    });
    await act(async () => {
      result.current[1].handleAddPiece(4);
    });
    expect(result.current[0].missionSolvedNow).toBe(true);

    await act(async () => {
      result.current[1].handleClaimMission();
    });
    await waitFor(() => expect(result.current[0].missionClaimed).toBe(true));

    // Impede ultrapassar 1 inteiro na bandeja ativa (1/2 + 1 inteiro = bloqueado)
    await act(async () => {
      result.current[1].handleAddPiece(1);
    });
    expect(result.current[0].trayA).toHaveLength(2);

    await act(async () => {
      result.current[1].handleSetActiveTray("B");
      result.current[1].handleClearTray("B");
    });
    expect(result.current[0].trayB).toHaveLength(0);

    await act(async () => {
      result.current[1].handleAddPiece(2);
    });
    expect(result.current[0].trayB).toHaveLength(1);
    const addedId = result.current[0].trayB[0].id;
    await act(async () => {
      result.current[1].handleRemovePiece("B", addedId);
    });
    expect(result.current[0].trayB).toHaveLength(0);

    await act(async () => {
      result.current[1].handleToggleHint();
    });
    expect(result.current[0].showHint).toBe(true);
    await act(async () => {
      result.current[1].handleNextMission();
    });
    expect(result.current[0].showHint).toBe(false);

    await act(async () => {
      result.current[1].handleSetMode("mix");
    });
    expect(result.current[0].mode).toBe("mix");
    await act(async () => {
      result.current[1].handleSetPizzaDenA(2);
      result.current[1].handleSetPizzaCountA(2);
      result.current[1].handleSetPizzaDenB(4);
      result.current[1].handleTogglePizzaSliceB(2);
    });
    expect(result.current[0].wholePizzas).toBe(1);

    await act(async () => {
      result.current[1].handleResetMix();
    });
    expect(result.current[0].pizzaDenA).toBe(4);
    expect(result.current[0].pizzaSelA).toEqual([0]);

    await act(async () => {
      result.current[1].handleNavigate("/home");
      result.current[1].handleBackToMap();
      result.current[1].handleToggleSound();
      result.current[1].handleToggleSound();
    });
    expect(push).toHaveBeenCalledWith("/home");

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro bancada"));
    const sbErr = await renderHook(() => useSandboxViewModel(progUseCases));
    await waitFor(() => expect(sbErr.result.current[0].error).toBe("Erro bancada"));
  });

  it("Arcade e Bancada usam os Use Cases padrão do container", async () => {
    const arcade = await renderHook(() => useArcadeViewModel());
    await waitFor(() => expect(arcade.result.current[0].phase).toBe("ready"));

    const sandbox = await renderHook(() => useSandboxViewModel());
    await waitFor(() => expect(sandbox.result.current[0].profile.chefName).toBe("Chef"));
  });
});
