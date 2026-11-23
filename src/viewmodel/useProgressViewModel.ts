import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { progressUseCases } from "@/di/container";
import {
  ACHIEVEMENTS,
  GAME_WORLDS,
  TITLE_SHOP,
  getLevelFromXp,
  type Achievement,
  type GameWorld
} from "@/model/entities/game";
import { DEFAULT_PROFILE, type Attempt, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type ProgressTab = "achievements" | "worlds";

export type ProgressState = {
  profile: PlayerProfile;
  attempts: Attempt[];
  loading: boolean;
  error: string | null;
  activeRoute: string;
  tab: ProgressTab;
  confirmReset: boolean;
  level: number;
  totalStars: number;
  maxStars: number;
  totalCorrect: number;
  activeTitle: string;
  achievements: readonly Achievement[];
  worlds: readonly GameWorld[];
};

export type ProgressActions = {
  handleNavigate: (route: string) => void;
  handleToggleSound: () => void;
  handleSelectTab: (next: ProgressTab) => void;
  handleRequestReset: () => void;
  handleCancelReset: () => void;
  handleConfirmReset: () => void;
};

export function useProgressViewModel(
  progUseCases: IProgressUseCases = progressUseCases
): [ProgressState, ProgressActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ProgressTab>("achievements");
  const [confirmReset, setConfirmReset] = useState(false);

  const load = useCallback(async () => {
    try {
      const snapshot = await progUseCases.loadProgress();
      setProfile(snapshot.profile);
      setAttempts(snapshot.attempts);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof DomainError) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [progUseCases]);

  useEffect(() => {
    void load();
    return progUseCases.onProgressChanged(() => {
      void load();
    });
  }, [load, progUseCases]);

  const { level } = getLevelFromXp(profile.xp);
  const totalStars = Object.values(profile.worldStars).reduce((a, b) => a + b, 0);
  const totalCorrect = attempts.filter((a) => a.correct).length;
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
    (next: ProgressTab) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setTab(next);
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleRequestReset = useCallback(() => {
    setConfirmReset(true);
  }, []);

  const handleCancelReset = useCallback(() => {
    setConfirmReset(false);
  }, []);

  const handleConfirmReset = useCallback(() => {
    void (async () => {
      try {
        await progUseCases.resetProgress();
        setConfirmReset(false);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [progUseCases]);

  return [
    {
      profile,
      attempts,
      loading,
      error,
      activeRoute: pathname,
      tab,
      confirmReset,
      level,
      totalStars,
      maxStars: GAME_WORLDS.length * 3,
      totalCorrect,
      activeTitle,
      achievements: ACHIEVEMENTS,
      worlds: GAME_WORLDS
    },
    {
      handleNavigate,
      handleToggleSound,
      handleSelectTab,
      handleRequestReset,
      handleCancelReset,
      handleConfirmReset
    }
  ];
}
