import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import {
  GAME_WORLDS,
  TITLE_SHOP,
  getLevelFromXp,
  type GameWorld
} from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type HomeState = {
  profile: PlayerProfile;
  loading: boolean;
  error: string | null;
  activeRoute: string;
  editingName: boolean;
  draftName: string;
  level: number;
  currentXp: number;
  totalStars: number;
  maxStars: number;
  activeTitle: string;
  nextWorld: GameWorld;
  worlds: readonly GameWorld[];
};

export type HomeActions = {
  handleNavigate: (route: string) => void;
  handleToggleSound: () => void;
  handleStartEditName: () => void;
  handleDraftNameChange: (value: string) => void;
  handleSaveName: () => void;
};

export function useHomeViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [HomeState, HomeActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.chefName);

  const load = useCallback(async () => {
    try {
      const snapshot = await progUseCases.loadProgress();
      setProfile(snapshot.profile);
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

  const { level, currentXp } = getLevelFromXp(profile.xp);
  const summary = actUseCases.getHomeWorldsSummary(profile);
  const activeTitle =
    TITLE_SHOP.find((t) => t.id === profile.equippedTitle)?.name ?? "Aprendiz do Forno";
  const nextWorld =
    GAME_WORLDS.find((w) => (profile.worldStars[w.id] ?? 0) < 3) ?? GAME_WORLDS[0];

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

  const handleStartEditName = useCallback(() => {
    setDraftName(profile.chefName);
    setEditingName(true);
  }, [profile.chefName]);

  const handleDraftNameChange = useCallback((value: string) => {
    setDraftName(value);
  }, []);

  const handleSaveName = useCallback(() => {
    void (async () => {
      try {
        const updated = await progUseCases.updateChefName(draftName);
        setProfile(updated);
        setEditingName(false);
        progUseCases.playSound("success", updated.soundEnabled);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [draftName, progUseCases]);

  return [
    {
      profile,
      loading,
      error,
      activeRoute: pathname,
      editingName,
      draftName,
      level,
      currentXp,
      totalStars: summary.totalStars,
      maxStars: summary.maxStars,
      activeTitle,
      nextWorld,
      worlds: GAME_WORLDS
    },
    {
      handleNavigate,
      handleToggleSound,
      handleStartEditName,
      handleDraftNameChange,
      handleSaveName
    }
  ];
}
