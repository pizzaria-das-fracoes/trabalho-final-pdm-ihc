import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { progressUseCases, shopUseCases } from "@/di/container";
import {
  HAT_SHOP,
  RARITY_META,
  TITLE_SHOP,
  TOPPING_SHOP,
  type ShopItem
} from "@/model/entities/game";
import {
  DEFAULT_PROFILE,
  type HatId,
  type ItemRarity,
  type PlayerProfile,
  type TitleId,
  type ToppingId
} from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";
import type { IShopUseCases } from "@/usecase/iShopUseCases";

export type ShopTab = "hats" | "toppings" | "titles";

export type ShopState = {
  profile: PlayerProfile;
  activeRoute: string;
  tab: ShopTab;
  activeTitle: string;
  hats: readonly ShopItem<HatId>[];
  toppings: readonly ShopItem<ToppingId>[];
  titles: readonly ShopItem<TitleId>[];
  rarityMeta: Record<ItemRarity, { label: string }>;
  error: string | null;
};

export type ShopActions = {
  handleNavigate: (route: string) => void;
  handleToggleSound: () => void;
  handleSelectTab: (next: ShopTab) => void;
  handleSelectHat: (hatId: HatId) => void;
  handleSelectTopping: (toppingId: ToppingId) => void;
  handleSelectTitle: (titleId: TitleId) => void;
};

export function useShopViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  shUseCases: IShopUseCases = shopUseCases
): [ShopState, ShopActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [tab, setTab] = useState<ShopTab>("hats");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const snapshot = await progUseCases.loadProgress();
      setProfile(snapshot.profile);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof DomainError) {
        setError(err.message);
      }
    }
  }, [progUseCases]);

  useEffect(() => {
    void load();
    return progUseCases.onProgressChanged(() => {
      void load();
    });
  }, [load, progUseCases]);

  const activeTitle =
    TITLE_SHOP.find((t) => t.id === profile.equippedTitle)?.name ?? "Aprendiz do Forno";

  const handleNavigate = useCallback(
    (route: string) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      router.push(route as Href);
    },
    [profile.soundEnabled, progUseCases, router]
  );

  const handleToggleSound = useCallback(() => {
    const nextEnabled = !profile.soundEnabled;
    if (nextEnabled) {
      progUseCases.playSound("pop", true);
    }
    void progUseCases.toggleSound();
  }, [profile.soundEnabled, progUseCases]);

  const handleSelectTab = useCallback(
    (next: ShopTab) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setTab(next);
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleSelectHat = useCallback(
    (hatId: HatId) => {
      void (async () => {
        try {
          const updated = await shUseCases.buyOrEquipHat(hatId);
          setProfile(updated);
        } catch (err: unknown) {
          if (err instanceof DomainError) {
            setError(err.message);
          }
        }
      })();
    },
    [shUseCases]
  );

  const handleSelectTopping = useCallback(
    (toppingId: ToppingId) => {
      void (async () => {
        try {
          const updated = await shUseCases.buyOrEquipTopping(toppingId);
          setProfile(updated);
        } catch (err: unknown) {
          if (err instanceof DomainError) {
            setError(err.message);
          }
        }
      })();
    },
    [shUseCases]
  );

  const handleSelectTitle = useCallback(
    (titleId: TitleId) => {
      void (async () => {
        try {
          const updated = await shUseCases.buyOrEquipTitle(titleId);
          setProfile(updated);
        } catch (err: unknown) {
          if (err instanceof DomainError) {
            setError(err.message);
          }
        }
      })();
    },
    [shUseCases]
  );

  return [
    {
      profile,
      activeRoute: pathname,
      tab,
      activeTitle,
      hats: HAT_SHOP,
      toppings: TOPPING_SHOP,
      titles: TITLE_SHOP,
      rarityMeta: RARITY_META,
      error
    },
    {
      handleNavigate,
      handleToggleSound,
      handleSelectTab,
      handleSelectHat,
      handleSelectTopping,
      handleSelectTitle
    }
  ];
}
