import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { progressUseCases } from "@/di/container";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type WelcomeState = {
  profile: PlayerProfile;
  activeRoute: string;
  error: string | null;
};

export type WelcomeActions = {
  handleStart: () => void;
  handleNavigate: (route: string) => void;
  handleToggleSound: () => void;
};

export function useWelcomeViewModel(
  useCases: IProgressUseCases = progressUseCases
): [WelcomeState, WelcomeActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const snapshot = await useCases.loadProgress();
      setProfile(snapshot.profile);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof DomainError) {
        setError(err.message);
      }
    }
  }, [useCases]);

  useEffect(() => {
    void load();
    return useCases.onProgressChanged(() => {
      void load();
    });
  }, [load, useCases]);

  const handleStart = useCallback(() => {
    useCases.playSound("success", profile.soundEnabled);
    router.push("/home" as Href);
  }, [profile.soundEnabled, router, useCases]);

  const handleNavigate = useCallback(
    (route: string) => {
      useCases.playSound("pop", profile.soundEnabled);
      router.push(route as Href);
    },
    [profile.soundEnabled, router, useCases]
  );

  const handleToggleSound = useCallback(() => {
    const nextEnabled = !profile.soundEnabled;
    if (nextEnabled) {
      useCases.playSound("pop", true);
    }
    void useCases.toggleSound();
  }, [profile.soundEnabled, useCases]);

  return [
    { profile, activeRoute: pathname, error },
    { handleStart, handleNavigate, handleToggleSound }
  ];
}
