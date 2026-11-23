import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import { ACHIEVEMENTS, HAT_SHOP, TITLE_SHOP, TOPPING_SHOP } from "@/model/entities/game";
import type { HatId, PlayerProfile, TitleId, ToppingId } from "@/model/entities/progress";
import type { ISoundService } from "@/model/services/iSoundService";
import type { IShopUseCases } from "@/usecase/iShopUseCases";

export class ShopUseCases implements IShopUseCases {
  constructor(
    private readonly progressDataSource: IProgressDataSource,
    private readonly soundService: ISoundService
  ) {}

  private async checkShopAchievements(updated: PlayerProfile): Promise<PlayerProfile> {
    const attempts = await this.progressDataSource.listAttempts();
    const totalCorrect = attempts.filter((a) => a.correct).length;
    const next = { ...updated };
    for (const achievement of ACHIEVEMENTS) {
      if (!next.achievements.includes(achievement.id) && achievement.check(next, totalCorrect)) {
        next.achievements = [...next.achievements, achievement.id];
      }
    }
    return next;
  }

  async buyOrEquipHat(hatId: HatId): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const item = HAT_SHOP.find((entry) => entry.id === hatId);
    if (!item) return profile;

    let updated: PlayerProfile = { ...profile };
    let purchased = false;
    if (!profile.unlockedHats.includes(hatId)) {
      if (profile.coins < item.price) return profile;
      updated = {
        ...updated,
        coins: profile.coins - item.price,
        unlockedHats: [...profile.unlockedHats, hatId],
        equippedHat: hatId
      };
      purchased = true;
    } else {
      updated.equippedHat = hatId;
    }

    updated = await this.checkShopAchievements(updated);
    await this.progressDataSource.saveProfile(updated);
    this.soundService.play(purchased ? "coin" : "pop", updated.soundEnabled);
    return updated;
  }

  async buyOrEquipTopping(toppingId: ToppingId): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const item = TOPPING_SHOP.find((entry) => entry.id === toppingId);
    if (!item) return profile;

    let updated: PlayerProfile = { ...profile };
    let purchased = false;
    if (!profile.unlockedToppings.includes(toppingId)) {
      if (profile.coins < item.price) return profile;
      updated = {
        ...updated,
        coins: profile.coins - item.price,
        unlockedToppings: [...profile.unlockedToppings, toppingId],
        equippedTopping: toppingId
      };
      purchased = true;
    } else {
      updated.equippedTopping = toppingId;
    }

    updated = await this.checkShopAchievements(updated);
    await this.progressDataSource.saveProfile(updated);
    this.soundService.play(purchased ? "coin" : "pop", updated.soundEnabled);
    return updated;
  }

  async buyOrEquipTitle(titleId: TitleId): Promise<PlayerProfile> {
    const profile = await this.progressDataSource.getProfile();
    const item = TITLE_SHOP.find((entry) => entry.id === titleId);
    if (!item) return profile;

    let updated: PlayerProfile = { ...profile };
    let purchased = false;
    if (!profile.unlockedTitles.includes(titleId)) {
      if (profile.coins < item.price) return profile;
      updated = {
        ...updated,
        coins: profile.coins - item.price,
        unlockedTitles: [...profile.unlockedTitles, titleId],
        equippedTitle: titleId
      };
      purchased = true;
    } else {
      updated.equippedTitle = titleId;
    }

    updated = await this.checkShopAchievements(updated);
    await this.progressDataSource.saveProfile(updated);
    this.soundService.play(purchased ? "coin" : "pop", updated.soundEnabled);
    return updated;
  }
}
