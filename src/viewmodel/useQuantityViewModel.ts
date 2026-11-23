import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { QuantityChallenge } from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type QuantityState = {
  profile: PlayerProfile;
  activeRoute: string;
  challenge: QuantityChallenge;
  roundIndex: number;
  totalRounds: number;
  itemsPerGroup: number;
  selectedTotal: number;
  selectedGroups: number[];
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  error: string | null;
};

export type QuantityActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleToggleGroup: (groupIdx: number) => void;
  handleCheck: () => void;
  handleNextRound: () => void;
  handleRestart: () => void;
};

export function useQuantityViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [QuantityState, QuantityActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<QuantityChallenge[]>(() =>
    actUseCases.createQuantitySession(4)
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; xp?: number } | null>(
    null
  );
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
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

  const challenge = challenges[roundIndex];
  const itemsPerGroup = challenge.totalItems / challenge.denominator;
  const selectedTotal = selectedGroups.length * itemsPerGroup;

  const handleNavigate = useCallback(
    (route: string) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      router.push(route as Href);
    },
    [profile.soundEnabled, progUseCases, router]
  );

  const handleBackToMap = useCallback(() => {
    progUseCases.playSound("pop", profile.soundEnabled);
    router.push("/home" as Href);
  }, [profile.soundEnabled, progUseCases, router]);

  const handleToggleSound = useCallback(() => {
    const nextEnabled = !profile.soundEnabled;
    if (nextEnabled) {
      progUseCases.playSound("pop", true);
    }
    void progUseCases.toggleSound();
  }, [profile.soundEnabled, progUseCases]);

  const handleToggleGroup = useCallback(
    (groupIdx: number) => {
      if (feedback?.correct) return;
      progUseCases.playSound("pop", profile.soundEnabled);
      setSelectedGroups((prev) =>
        prev.includes(groupIdx) ? prev.filter((g) => g !== groupIdx) : [...prev, groupIdx]
      );
      setFeedback(null);
    },
    [feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleCheck = useCallback(() => {
    void (async () => {
      try {
        const correct = selectedGroups.length === challenge.numerator;
        const reward = await progUseCases.recordAttempt({
          questionId: challenge.id,
          worldId: "quantity",
          correct,
          answer: `${selectedTotal}`
        });

        if (!correct) {
          progUseCases.playSound("oops", profile.soundEnabled);
          setMistakes((m) => m + 1);
          setFeedback({
            correct: false,
            message: `Você separou ${selectedGroups.length} bandeja(s) (${selectedTotal} ${challenge.itemName}). Dica: ${challenge.hint}`
          });
          return;
        }

        progUseCases.playSound("success", profile.soundEnabled);
        setFeedback({
          correct: true,
          xp: reward.xpEarned,
          message: `Show! ${challenge.numerator}/${challenge.denominator} de ${challenge.totalItems} são ${selectedTotal} ${challenge.itemName}!`
        });
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [challenge, profile.soundEnabled, progUseCases, selectedGroups.length, selectedTotal]);

  const handleNextRound = useCallback(() => {
    void (async () => {
      try {
        const next = roundIndex + 1;
        if (next >= challenges.length) {
          const stars = actUseCases.computeStars(mistakes);
          setEarnedStars(stars);
          await progUseCases.awardWorldStars("quantity", stars);
          progUseCases.playSound("fanfare", profile.soundEnabled);
          setCompleted(true);
          return;
        }
        progUseCases.playSound("pop", profile.soundEnabled);
        setRoundIndex(next);
        setSelectedGroups([]);
        setFeedback(null);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenges.length, mistakes, profile.soundEnabled, progUseCases, roundIndex]);

  const handleRestart = useCallback(() => {
    setChallenges(actUseCases.createQuantitySession(4));
    setRoundIndex(0);
    setSelectedGroups([]);
    setFeedback(null);
    setMistakes(0);
    setCompleted(false);
    setEarnedStars(0);
  }, [actUseCases]);

  return [
    {
      profile,
      activeRoute: pathname,
      challenge,
      roundIndex,
      totalRounds: challenges.length,
      itemsPerGroup,
      selectedTotal,
      selectedGroups,
      feedback,
      completed,
      earnedStars,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleToggleGroup,
      handleCheck,
      handleNextRound,
      handleRestart
    }
  ];
}
