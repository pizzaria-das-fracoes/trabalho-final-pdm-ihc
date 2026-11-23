import { act, renderHook, waitFor } from "@testing-library/react-native";
import { usePathname, useRouter } from "expo-router";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import { DomainError } from "@/model/errors";
import { ActivityUseCases } from "@/usecase/activityUseCases";
import { ProgressUseCases } from "@/usecase/progressUseCases";
import { useCompareViewModel } from "@/viewmodel/useCompareViewModel";
import { useNumberLineViewModel } from "@/viewmodel/useNumberLineViewModel";
import { usePizzaViewModel } from "@/viewmodel/usePizzaViewModel";
import { useQuantityViewModel } from "@/viewmodel/useQuantityViewModel";
import { useQuizActivityViewModel } from "@/viewmodel/useQuizActivityViewModel";

const setup = () => {
  const ds = new MemoryProgressDataSource();
  const sound = new MemorySoundService();
  const progUseCases = new ProgressUseCases(ds, sound);
  const actUseCases = new ActivityUseCases();
  return { ds, sound, progUseCases, actUseCases };
};

describe("Hooks ViewModel de atividades pedagógicas", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue({
      push,
      replace: jest.fn(),
      back: jest.fn()
    } as never);
    jest.mocked(usePathname).mockReturnValue("/pizza");
  });

  it("usePizzaViewModel ajusta fatias, navega, alterna som, valida resposta e trata DomainError", async () => {
    const { progUseCases, actUseCases } = setup();
    const { result } = await renderHook(() => usePizzaViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    await act(async () => {
      result.current[1].handleNavigate("/shop");
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(true));

    await act(async () => {
      result.current[1].handleSetDenominator(150);
    });
    expect(result.current[0].denominator).toBe(100);
    await act(async () => {
      result.current[1].handleSetDenominator(8);
    });
    expect(result.current[0].denominator).toBe(8);

    await act(async () => {
      result.current[1].handleToggleSlice(0);
    });
    expect(result.current[0].selected).toEqual([0]);
    await act(async () => {
      result.current[1].handleToggleSlice(0);
    });
    expect(result.current[0].selected).toEqual([]);

    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].feedback?.correct).toBe(false));

    for (let round = 0; round < result.current[0].totalRounds; round++) {
      const ch = result.current[0].challenge;
      await act(async () => {
        result.current[1].handleSetDenominator(ch.targetDenominator);
      });
      await act(async () => {
        result.current[1].handleSetSelectedCount(ch.targetNumerator);
      });
      await act(async () => {
        result.current[1].handleCheck();
      });
      await waitFor(() => expect(result.current[0].feedback?.correct).toBe(true));

      await act(async () => {
        result.current[1].handleNextRound();
      });
    }

    await waitFor(() => expect(result.current[0].completed).toBe(true));
    expect(result.current[0].earnedStars).toBe(2);

    // Simula erro de domínio ao registrar tentativa
    await act(async () => {
      result.current[1].handleRestart();
    });
    jest.spyOn(progUseCases, "recordAttempt").mockRejectedValueOnce(new DomainError("Erro pizza"));
    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro pizza"));

    await act(async () => {
      result.current[1].handleBackToMap();
    });
    expect(push).toHaveBeenCalledWith("/home");
  });

  it("useCompareViewModel avalia palpite errado/certo, navega, alterna som e captura DomainError", async () => {
    const { progUseCases, actUseCases } = setup();
    const { result } = await renderHook(() => useCompareViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    await act(async () => {
      result.current[1].handleNavigate("/home");
      result.current[1].handleBackToMap();
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });

    const first = result.current[0].challenge;
    const wrongChoice = first.winner === "left" ? "right" : "left";
    await act(async () => {
      result.current[1].handleSelectChoice(wrongChoice);
    });
    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].feedback?.correct).toBe(false));

    for (let round = 0; round < result.current[0].totalRounds; round++) {
      const winner = result.current[0].challenge.winner;
      await act(async () => {
        result.current[1].handleSelectChoice(winner);
      });
      await act(async () => {
        result.current[1].handleCheck();
      });
      await waitFor(() => expect(result.current[0].feedback?.correct).toBe(true));
      await act(async () => {
        result.current[1].handleNextRound();
      });
    }

    await waitFor(() => expect(result.current[0].completed).toBe(true));
    await act(async () => {
      result.current[1].handleRestart();
    });
    expect(result.current[0].roundIndex).toBe(0);

    jest.spyOn(progUseCases, "recordAttempt").mockRejectedValueOnce(new DomainError("Erro compare"));
    await act(async () => {
      result.current[1].handleSelectChoice("left");
    });
    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro compare"));
  });

  it("useNumberLineViewModel posiciona motoca na reta numérica, alterna som/rotas e trata DomainError", async () => {
    const { progUseCases, actUseCases } = setup();
    const { result } = await renderHook(() => useNumberLineViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    await act(async () => {
      result.current[1].handleNavigate("/shop");
      result.current[1].handleBackToMap();
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });

    for (let round = 0; round < result.current[0].totalRounds; round++) {
      const ch = result.current[0].challenge;
      const targetTick = Math.round((ch.numerator / ch.denominator) * ch.stepDenominator);
      const wrongTick = targetTick === 0 ? 1 : 0;

      if (round === 0) {
        await act(async () => {
          result.current[1].handleSelectTick(wrongTick);
        });
        await act(async () => {
          result.current[1].handleCheck();
        });
        await waitFor(() => expect(result.current[0].feedback?.correct).toBe(false));
      }

      await act(async () => {
        result.current[1].handleSelectTick(targetTick);
      });
      await act(async () => {
        result.current[1].handleCheck();
      });
      await waitFor(() => expect(result.current[0].feedback?.correct).toBe(true));
      await act(async () => {
        result.current[1].handleNextRound();
      });
    }

    await waitFor(() => expect(result.current[0].completed).toBe(true));
    expect(result.current[0].earnedStars).toBe(2);

    await act(async () => {
      result.current[1].handleRestart();
    });
    jest.spyOn(progUseCases, "recordAttempt").mockRejectedValueOnce(new DomainError("Erro reta"));
    await act(async () => {
      result.current[1].handleSelectTick(0);
    });
    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro reta"));
  });

  it("useQuantityViewModel alterna bandejas, calcula total, reinicia e captura DomainError", async () => {
    const { progUseCases, actUseCases } = setup();
    const { result } = await renderHook(() => useQuantityViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    await act(async () => {
      result.current[1].handleNavigate("/shop");
      result.current[1].handleBackToMap();
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });

    // Alterna seleção e desmarcação de bandeja
    await act(async () => {
      result.current[1].handleToggleGroup(0);
      result.current[1].handleToggleGroup(0);
    });
    expect(result.current[0].selectedGroups).toEqual([]);

    await act(async () => {
      result.current[1].handleCheck();
    });
    await waitFor(() => expect(result.current[0].feedback?.correct).toBe(false));

    for (let round = 0; round < result.current[0].totalRounds; round++) {
      const ch = result.current[0].challenge;
      for (let idx = 0; idx < ch.numerator; idx++) {
        await act(async () => {
          result.current[1].handleToggleGroup(idx);
        });
      }
      expect(result.current[0].selectedTotal).toBe(ch.numerator * result.current[0].itemsPerGroup);

      await act(async () => {
        result.current[1].handleCheck();
      });
      await waitFor(() => expect(result.current[0].feedback?.correct).toBe(true));
      await act(async () => {
        result.current[1].handleNextRound();
      });
    }

    await waitFor(() => expect(result.current[0].completed).toBe(true));
    await act(async () => {
      result.current[1].handleRestart();
    });
    expect(result.current[0].completed).toBe(false);

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro de leitura"));
    const errHook = await renderHook(() => useQuantityViewModel(progUseCases, actUseCases));
    await waitFor(() => expect(errHook.result.current[0].error).toBe("Erro de leitura"));
  });

  it("useQuizActivityViewModel atende mundos equivalent, decimal e operations até conclusão", async () => {
    const { progUseCases, actUseCases } = setup();

    for (const world of ["equivalent", "decimal", "operations"] as const) {
      const { result } = await renderHook(() =>
        useQuizActivityViewModel(world, progUseCases, actUseCases)
      );
      await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

      await act(async () => {
        result.current[1].handleNavigate("/home");
        result.current[1].handleBackToMap();
        result.current[1].handleToggleSound();
      });
      await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
      await act(async () => {
        result.current[1].handleToggleSound();
      });

      const wrong = result.current[0].challenge.options.find(
        (opt) => opt !== result.current[0].challenge.expected
      );
      if (wrong) {
        await act(async () => {
          result.current[1].handleSelectAnswer(wrong);
        });
        await act(async () => {
          result.current[1].handleSubmit();
        });
        await waitFor(() => expect(result.current[0].wrongAttempts).toContain(wrong));
      }

      for (let r = 0; r < result.current[0].totalRounds; r++) {
        await act(async () => {
          result.current[1].handleSelectAnswer(result.current[0].challenge.expected);
        });
        await act(async () => {
          result.current[1].handleSubmit();
        });
        await waitFor(() => expect(result.current[0].feedback?.correct).toBe(true));
        await act(async () => {
          result.current[1].handleNextRound();
        });
      }

      await waitFor(() => expect(result.current[0].completed).toBe(true));
      await act(async () => {
        result.current[1].handleRestart();
      });
      expect(result.current[0].completed).toBe(false);
    }

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro quiz"));
    const errHook = await renderHook(() =>
      useQuizActivityViewModel("equivalent", progUseCases, actUseCases)
    );
    await waitFor(() => expect(errHook.result.current[0].error).toBe("Erro quiz"));
  });

  it("ViewModels pedagógicos usam os Use Cases padrão do container sem injeção explícita", async () => {
    const compare = await renderHook(() => useCompareViewModel());
    await waitFor(() => expect(compare.result.current[0].profile.chefName).toBe("Chef"));

    const numberLine = await renderHook(() => useNumberLineViewModel());
    await waitFor(() => expect(numberLine.result.current[0].profile.chefName).toBe("Chef"));

    const quantity = await renderHook(() => useQuantityViewModel());
    await waitFor(() => expect(quantity.result.current[0].profile.chefName).toBe("Chef"));

    const pizza = await renderHook(() => usePizzaViewModel());
    await waitFor(() => expect(pizza.result.current[0].profile.chefName).toBe("Chef"));

    const quiz = await renderHook(() => useQuizActivityViewModel("equivalent"));
    await waitFor(() => expect(quiz.result.current[0].profile.chefName).toBe("Chef"));
  });
});
