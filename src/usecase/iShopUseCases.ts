import type { HatId, PlayerProfile, TitleId, ToppingId } from "@/model/entities/progress";

export interface IShopUseCases {
  buyOrEquipHat(hatId: HatId): Promise<PlayerProfile>;
  buyOrEquipTopping(toppingId: ToppingId): Promise<PlayerProfile>;
  buyOrEquipTitle(titleId: TitleId): Promise<PlayerProfile>;
}
