import { act, renderHook, waitFor } from "@testing-library/react-native";
import { usePathname, useRouter } from "expo-router";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import { DomainError, ValidationError } from "@/model/errors";
import { ActivityUseCases } from "@/usecase/activityUseCases";
import { ProgressUseCases } from "@/usecase/progressUseCases";
import { ShopUseCases } from "@/usecase/shopUseCases";
import { useAboutViewModel } from "@/viewmodel/useAboutViewModel";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";
import { useProgressViewModel } from "@/viewmodel/useProgressViewModel";
import { useRedirectHomeViewModel } from "@/viewmodel/useRedirectHomeViewModel";
import { useShopViewModel } from "@/viewmodel/useShopViewModel";
import { useWelcomeViewModel } from "@/viewmodel/useWelcomeViewModel";

const setup = () => {
  const ds = new MemoryProgressDataSource();
  const sound = new MemorySoundService();
  const progUseCases = new ProgressUseCases(ds, sound);
  const actUseCases = new ActivityUseCases();
  const shUseCases = new ShopUseCases(ds, sound);
  return { ds, sound, progUseCases, actUseCases, shUseCases };
};

describe("Hooks ViewModel principais (Welcome, Home, Shop, Progress, About, Redirect)", () => {
  const push = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue({
      push,
      replace,
      back: jest.fn()
    } as never);
    jest.mocked(usePathname).mockReturnValue("/home");
  });

  it("Hooks principais usam os Use Cases padrão do container", async () => {
    const welcome = await renderHook(() => useWelcomeViewModel());
    await waitFor(() => expect(welcome.result.current[0].profile.chefName).toBe("Chef"));

    const home = await renderHook(() => useHomeViewModel());
    await waitFor(() => expect(home.result.current[0].profile.chefName).toBe("Chef"));

    const shop = await renderHook(() => useShopViewModel());
    await waitFor(() => expect(shop.result.current[0].profile.chefName).toBe("Chef"));

    const progress = await renderHook(() => useProgressViewModel());
    await waitFor(() => expect(progress.result.current[0].loading).toBe(false));

    const about = await renderHook(() => useAboutViewModel());
    await waitFor(() => expect(about.result.current[0].profile.chefName).toBe("Chef"));
  });

  it("useRedirectHomeViewModel redireciona imediatamente e via ação manual", async () => {
    const { result } = await renderHook(() => useRedirectHomeViewModel());
    expect(result.current[0].targetRoute).toBe("/home");
    expect(replace).toHaveBeenCalledWith("/home");

    await act(async () => {
      result.current[1].handleRedirectNow();
    });
    expect(replace).toHaveBeenCalledTimes(2);
  });

  it("useWelcomeViewModel e useAboutViewModel carregam perfil, navegam e capturam DomainError", async () => {
    const { progUseCases, sound } = setup();
    const { result } = await renderHook(() => useWelcomeViewModel(progUseCases));

    await waitFor(() => expect(result.current[0].profile.chefName).toBe("Chef"));

    await act(async () => {
      result.current[1].handleStart();
    });
    expect(push).toHaveBeenCalledWith("/home");
    expect(sound.played).toContain("success");

    await act(async () => {
      result.current[1].handleNavigate("/sandbox");
    });
    expect(push).toHaveBeenCalledWith("/sandbox");

    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));

    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(true));

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Falha ao ler perfil"));
    const aboutHook = await renderHook(() => useAboutViewModel(progUseCases));
    await waitFor(() => expect(aboutHook.result.current[0].error).toBe("Falha ao ler perfil"));
    await act(async () => {
      aboutHook.result.current[1].handleNavigate("/home");
      aboutHook.result.current[1].handleToggleSound();
    });
    expect(push).toHaveBeenCalledWith("/home");

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new Error("Falha inesperada"));
    const unexpectedHook = await renderHook(() => useWelcomeViewModel(progUseCases));
    await waitFor(() => expect(unexpectedHook.result.current[0].profile.chefName).toBe("Chef"));
    expect(unexpectedHook.result.current[0].error).toBeNull();
  });

  it("useHomeViewModel gerencia edição de nome, som e trata DomainError ao salvar", async () => {
    const { progUseCases, actUseCases } = setup();
    const { result } = await renderHook(() => useHomeViewModel(progUseCases, actUseCases));

    await waitFor(() => expect(result.current[0].loading).toBe(false));
    expect(result.current[0].level).toBe(1);
    expect(result.current[0].activeTitle).toBe("Aprendiz do Forno");

    await act(async () => {
      result.current[1].handleStartEditName();
    });
    expect(result.current[0].editingName).toBe(true);

    await act(async () => {
      result.current[1].handleDraftNameChange("Master Sofia");
    });
    await act(async () => {
      result.current[1].handleSaveName();
    });
    await waitFor(() => expect(result.current[0].editingName).toBe(false));
    expect(result.current[0].profile.chefName).toBe("Master Sofia");

    jest.spyOn(progUseCases, "updateChefName").mockRejectedValueOnce(new ValidationError("Nome inválido"));
    await act(async () => {
      result.current[1].handleStartEditName();
    });
    await act(async () => {
      result.current[1].handleSaveName();
    });
    await waitFor(() => expect(result.current[0].error).toBe("Nome inválido"));

    await act(async () => {
      result.current[1].handleNavigate("/pizza");
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(true));
    expect(push).toHaveBeenCalledWith("/pizza");

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro home"));
    const homeErr = await renderHook(() => useHomeViewModel(progUseCases, actUseCases));
    await waitFor(() => expect(homeErr.result.current[0].error).toBe("Erro home"));
  });

  it("useShopViewModel alterna abas, compra chapéu/sabor/título e expõe erro quando saldo não basta", async () => {
    const { ds, progUseCases, shUseCases } = setup();
    await ds.saveProfile({ ...(await ds.getProfile()), coins: 200 });

    const { result } = await renderHook(() => useShopViewModel(progUseCases, shUseCases));
    await waitFor(() => expect(result.current[0].profile.coins).toBe(200));

    await act(async () => {
      result.current[1].handleSelectTab("titles");
    });
    expect(result.current[0].tab).toBe("titles");

    await act(async () => {
      result.current[1].handleSelectHat("cap");
    });
    await waitFor(() => expect(result.current[0].profile.equippedHat).toBe("cap"));

    await act(async () => {
      result.current[1].handleSelectTopping("olive");
    });
    await waitFor(() => expect(result.current[0].profile.equippedTopping).toBe("olive"));

    await act(async () => {
      result.current[1].handleSelectTitle("velocista");
    });
    await waitFor(() => expect(result.current[0].profile.equippedTitle).toBe("velocista"));

    // Com 85 Q restantes, título "lenda" (130 Q) não é comprado e perfil equipado é preservado
    await act(async () => {
      result.current[1].handleSelectTitle("lenda");
    });
    expect(result.current[0].profile.equippedTitle).toBe("velocista");

    // Erro de domínio vindo dos Use Cases é capturado em state.error
    jest.spyOn(shUseCases, "buyOrEquipHat").mockRejectedValueOnce(new DomainError("Erro chapéu"));
    await act(async () => {
      result.current[1].handleSelectHat("crown");
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro chapéu"));

    jest.spyOn(shUseCases, "buyOrEquipTopping").mockRejectedValueOnce(new DomainError("Erro sabor"));
    await act(async () => {
      result.current[1].handleSelectTopping("berry");
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro sabor"));

    jest.spyOn(shUseCases, "buyOrEquipTitle").mockRejectedValueOnce(new DomainError("Falha ao gravar compra"));
    await act(async () => {
      result.current[1].handleSelectTitle("mestre");
    });
    await waitFor(() => expect(result.current[0].error).toBe("Falha ao gravar compra"));

    await act(async () => {
      result.current[1].handleNavigate("/home");
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(true));

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro loja"));
    const shopErr = await renderHook(() => useShopViewModel(progUseCases, shUseCases));
    await waitFor(() => expect(shopErr.result.current[0].error).toBe("Erro loja"));
  });

  it("useProgressViewModel calcula métricas, alterna abas e executa fluxo completo de reset", async () => {
    const { progUseCases } = setup();
    await progUseCases.recordAttempt({
      questionId: "q1",
      worldId: "pizza",
      correct: true,
      answer: "1/2"
    });
    await progUseCases.awardWorldStars("pizza", 3);

    const { result } = await renderHook(() => useProgressViewModel(progUseCases));
    await waitFor(() => expect(result.current[0].loading).toBe(false));

    expect(result.current[0].totalCorrect).toBe(1);
    expect(result.current[0].totalStars).toBe(3);

    await act(async () => {
      result.current[1].handleSelectTab("worlds");
    });
    expect(result.current[0].tab).toBe("worlds");

    await act(async () => {
      result.current[1].handleRequestReset();
    });
    expect(result.current[0].confirmReset).toBe(true);
    await act(async () => {
      result.current[1].handleCancelReset();
    });
    expect(result.current[0].confirmReset).toBe(false);

    await act(async () => {
      result.current[1].handleRequestReset();
    });
    await act(async () => {
      result.current[1].handleConfirmReset();
    });
    await waitFor(() => expect(result.current[0].totalStars).toBe(0));
    expect(result.current[0].totalCorrect).toBe(0);
    expect(result.current[0].confirmReset).toBe(false);

    await act(async () => {
      result.current[1].handleNavigate("/about");
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(false));
    await act(async () => {
      result.current[1].handleToggleSound();
    });
    await waitFor(() => expect(result.current[0].profile.soundEnabled).toBe(true));
    expect(push).toHaveBeenCalledWith("/about");

    jest.spyOn(progUseCases, "resetProgress").mockRejectedValueOnce(new DomainError("Erro reset"));
    await act(async () => {
      result.current[1].handleConfirmReset();
    });
    await waitFor(() => expect(result.current[0].error).toBe("Erro reset"));

    jest.spyOn(progUseCases, "loadProgress").mockRejectedValueOnce(new DomainError("Erro progresso"));
    const progErr = await renderHook(() => useProgressViewModel(progUseCases));
    await waitFor(() => expect(progErr.result.current[0].error).toBe("Erro progresso"));
  });
});
