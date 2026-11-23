import { AsyncStorageProgressDataSource } from "@/infra/datasources/asyncStorageProgressDataSource";
import { MemoryProgressDataSource } from "@/infra/datasources/memoryProgressDataSource";
import { ExpoSoundService } from "@/infra/services/expoSoundService";
import { MemorySoundService } from "@/infra/services/memorySoundService";
import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import type { ISoundService } from "@/model/services/iSoundService";
import { ActivityUseCases } from "@/usecase/activityUseCases";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";
import type { IShopUseCases } from "@/usecase/iShopUseCases";
import { ProgressUseCases } from "@/usecase/progressUseCases";
import { ShopUseCases } from "@/usecase/shopUseCases";

const USE_MEMORY = false;

export const createProgressDataSource = (
  useMemory: boolean = USE_MEMORY
): IProgressDataSource =>
  useMemory ? new MemoryProgressDataSource() : new AsyncStorageProgressDataSource();

export const createSoundService = (
  useMemory: boolean = USE_MEMORY
): ISoundService =>
  useMemory ? new MemorySoundService() : new ExpoSoundService();

const progressDataSource = createProgressDataSource();
const soundService = createSoundService();

export const progressUseCases: IProgressUseCases = new ProgressUseCases(
  progressDataSource,
  soundService
);

export const shopUseCases: IShopUseCases = new ShopUseCases(
  progressDataSource,
  soundService
);

export const activityUseCases: IActivityUseCases = new ActivityUseCases();
