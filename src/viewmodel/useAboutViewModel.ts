import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { progressUseCases } from "@/di/container";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type AboutState = {
  profile: PlayerProfile;
  activeRoute: string;
  error: string | null;
};

export type AboutActions = {
  handleNavigate: (route: string) => void;
  handleToggleSound: () => void;
};

export function useAboutViewModel(
  progUseCases: IProgressUseCases = progressUseCases
): [AboutState, AboutActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
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

  return [
    { profile, activeRoute: pathname, error },
    { handleNavigate, handleToggleSound }
  ];
}
