import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  activityUseCases,
  createProgressDataSource,
  createSoundService,
  progressUseCases,
  shopUseCases
} from "@/di/container";
import { AsyncStorageProgressDataSource } from "@/infra/datasources/asyncStorageProgressDataSource";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { ExpoSoundService } from "@/infra/services/expoSoundService";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import {
  ActivityNotFoundError,
  DataSourceError,
  DomainError,
  ValidationError
} from "@/model/errors";

describe("Infraestrutura, Erros de Domínio e Container DI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ExpoSoundService respeita flag muted, aciona hápticos e sintetiza WebAudio quando AudioContext existe", () => {
    const start = jest.fn();
    const stop = jest.fn();
    const connect = jest.fn();
    const setValueAtTime = jest.fn();
    const exponentialRampToValueAtTime = jest.fn();
    const resume = jest.fn(() => Promise.resolve());

    const FakeAudioContext = jest.fn(() => ({
      state: "suspended",
      currentTime: 0,
      destination: {},
      resume,
      createOscillator: () => ({
        type: "sine",
        frequency: { setValueAtTime, exponentialRampToValueAtTime },
        connect,
        start,
        stop
      }),
      createGain: () => ({
        gain: { setValueAtTime, exponentialRampToValueAtTime },
        connect
      })
    }));

    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: { AudioContext: FakeAudioContext }
    });

    const service = new ExpoSoundService();
    service.play("pop", false);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();

    service.play("pop", true);
    service.play("coin", true);
    service.play("success", true);
    service.play("oops", true);
    service.play("fanfare", true);

    expect(FakeAudioContext).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalled();

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow
    });
  });

  it("ExpoSoundService trata exceções em WebAudio e hápticos sem quebrar o aplicativo", () => {
    jest.spyOn(Haptics, "impactAsync").mockImplementationOnce(() => {
      throw new Error("haptics unavailable");
    });
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: {
        AudioContext: jest.fn(() => {
          throw new Error("audio blocked");
        })
      }
    });

    const service = new ExpoSoundService();
    expect(() => service.play("pop", true)).not.toThrow();

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow
    });
  });

  it("MemorySoundService registra apenas efeitos habilitados", () => {
    const service = new MemorySoundService();
    service.play("pop", false);
    service.play("coin", true);
    service.play("fanfare", true);
    expect(service.played).toEqual(["coin", "fanfare"]);
  });

  it("AsyncStorageProgressDataSource recupera JSON corrompido, usa cache em falha e converte erro em DataSourceError", async () => {
    const ds = new AsyncStorageProgressDataSource();
    await ds.resetAll();

    await AsyncStorage.setItem("@fatiamatica/progress-v2", "{json-invalido");
    await AsyncStorage.setItem("@fatiamatica/profile-v2", "{json-invalido");
    expect(await ds.listAttempts()).toEqual([]);
    expect((await ds.getProfile()).chefName).toBe("Chef");

    const getSpy = jest.spyOn(AsyncStorage, "getItem").mockRejectedValue(new Error("storage offline"));
    const setSpy = jest.spyOn(AsyncStorage, "setItem").mockRejectedValue(new Error("storage offline"));

    await ds.saveAttempt({
      questionId: "fallback-1",
      worldId: "pizza",
      correct: true,
      answer: "1/2",
      timestamp: "2026-11-22T00:00:00.000Z"
    });
    const attempts = await ds.listAttempts();
    expect(attempts).toHaveLength(1);
    expect(attempts[0].questionId).toBe("fallback-1");

    // Erro na serialização de perfil/tentativa ou listener converte-se em DataSourceError
    const unsubscribe = ds.onProgressChanged(() => {
      throw new Error("listener falhou");
    });
    await expect(
      ds.saveAttempt({
        questionId: "err-1",
        worldId: "pizza",
        correct: true,
        answer: "1/2",
        timestamp: "2026-11-22T00:00:00.000Z"
      })
    ).rejects.toBeInstanceOf(DataSourceError);
    await expect(ds.saveProfile(await ds.getProfile())).rejects.toBeInstanceOf(DataSourceError);
    await expect(ds.resetAll()).rejects.toBeInstanceOf(DataSourceError);
    unsubscribe();

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it("container DI e hierarquia DomainError preservam nomes, códigos e instâncias", () => {
    expect(progressUseCases).toBeDefined();
    expect(shopUseCases).toBeDefined();
    expect(activityUseCases).toBeDefined();

    const domain = new DomainError("erro genérico");
    const validation = new ValidationError("entrada inválida");
    const dataSource = new DataSourceError("falha de disco");
    const notFound = new ActivityNotFoundError("mundo inexistente");

    expect(domain.code).toBe("DOMAIN_ERROR");
    expect(validation.code).toBe("VALIDATION_ERROR");
    expect(dataSource.code).toBe("DATASOURCE_ERROR");
    expect(notFound.code).toBe("ACTIVITY_NOT_FOUND");
    expect(notFound).toBeInstanceOf(DomainError);
  });

  it("fábricas do container permitem escolher DataSource e Service em memória ou implementações reais", () => {
    expect(createProgressDataSource(true)).toBeInstanceOf(MemoryProgressDataSource);
    expect(createProgressDataSource(false)).toBeInstanceOf(AsyncStorageProgressDataSource);
    expect(createSoundService(true)).toBeInstanceOf(MemorySoundService);
    expect(createSoundService(false)).toBeInstanceOf(ExpoSoundService);
  });
});
