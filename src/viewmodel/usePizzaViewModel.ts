import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { PizzaOrderChallenge } from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type PizzaState = {
  profile: PlayerProfile;
  activeRoute: string;
  challenge: PizzaOrderChallenge;
  roundIndex: number;
  totalRounds: number;
  denominator: number;
  selected: number[];
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  error: string | null;
};

export type PizzaActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSetDenominator: (rawNext: number) => void;
  handleSetSelectedCount: (rawCount: number) => void;
  handleToggleSlice: (slice: number) => void;
  handleCheck: () => void;
  handleNextRound: () => void;
  handleRestart: () => void;
};

export function usePizzaViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [PizzaState, PizzaActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<PizzaOrderChallenge[]>(() =>
    actUseCases.createPizzaSession(4)
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [denominator, setDenominator] = useState(challenges[0].initialDenominator);
  const [selected, setSelected] = useState<number[]>([]);
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

  const handleSetDenominator = useCallback(
    (rawNext: number) => {
      if (feedback?.correct) return;
      const clamped = Math.min(100, Math.max(2, Math.round(rawNext)));
      if (clamped !== denominator) {
        progUseCases.playSound("pop", profile.soundEnabled);
      }
      setDenominator(clamped);
      setSelected((prev) => prev.filter((idx) => idx < clamped));
      setFeedback(null);
    },
    [denominator, feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleSetSelectedCount = useCallback(
    (rawCount: number) => {
      if (feedback?.correct) return;
      const clamped = Math.min(denominator, Math.max(0, Math.round(rawCount)));
      progUseCases.playSound("pop", profile.soundEnabled);
      setSelected(Array.from({ length: clamped }, (_, i) => i));
      setFeedback(null);
    },
    [denominator, feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleToggleSlice = useCallback(
    (slice: number) => {
      if (feedback?.correct) return;
      progUseCases.playSound("pop", profile.soundEnabled);
      setSelected((current) =>
        current.includes(slice) ? current.filter((item) => item !== slice) : [...current, slice]
      );
      setFeedback(null);
    },
    [feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleCheck = useCallback(() => {
    void (async () => {
      try {
        const correct = actUseCases.checkPizzaAnswer(
          selected.length,
          denominator,
          challenge.targetNumerator,
          challenge.targetDenominator
        );
        const reward = await progUseCases.recordAttempt({
          questionId: challenge.id,
          worldId: "pizza",
          correct,
          answer: `${selected.length}/${denominator}`
        });

        if (!correct) {
          progUseCases.playSound("oops", profile.soundEnabled);
          setMistakes((m) => m + 1);
          setFeedback({
            correct: false,
            message: `Quase! Você pintou ${selected.length} de ${denominator}. Dica: ${challenge.hint}`
          });
          return;
        }

        progUseCases.playSound("success", profile.soundEnabled);
        setFeedback({
          correct: true,
          xp: reward.xpEarned,
          message: `Perfeito! ${selected.length}/${denominator} deixa o cliente super feliz!`
        });
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenge, denominator, profile.soundEnabled, progUseCases, selected.length]);

  const handleNextRound = useCallback(() => {
    void (async () => {
      try {
        const next = roundIndex + 1;
        if (next >= challenges.length) {
          const stars = actUseCases.computeStars(mistakes);
          setEarnedStars(stars);
          await progUseCases.awardWorldStars("pizza", stars);
          progUseCases.playSound("fanfare", profile.soundEnabled);
          setCompleted(true);
          return;
        }
        progUseCases.playSound("pop", profile.soundEnabled);
        setRoundIndex(next);
        setDenominator(challenges[next].initialDenominator);
        setSelected([]);
        setFeedback(null);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenges, mistakes, profile.soundEnabled, progUseCases, roundIndex]);

  const handleRestart = useCallback(() => {
    const fresh = actUseCases.createPizzaSession(4);
    setChallenges(fresh);
    setRoundIndex(0);
    setDenominator(fresh[0].initialDenominator);
    setSelected([]);
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
      denominator,
      selected,
      feedback,
      completed,
      earnedStars,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSetDenominator,
      handleSetSelectedCount,
      handleToggleSlice,
      handleCheck,
      handleNextRound,
      handleRestart
    }
  ];
}
