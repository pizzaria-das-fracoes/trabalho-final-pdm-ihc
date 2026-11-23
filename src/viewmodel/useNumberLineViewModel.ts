import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { NumberLineChallenge } from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type NumberLineState = {
  profile: PlayerProfile;
  activeRoute: string;
  challenge: NumberLineChallenge;
  roundIndex: number;
  totalRounds: number;
  totalTicks: number;
  ticks: number[];
  selectedTick: number | null;
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  error: string | null;
};

export type NumberLineActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSelectTick: (tick: number) => void;
  handleCheck: () => void;
  handleNextRound: () => void;
  handleRestart: () => void;
};

export function useNumberLineViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [NumberLineState, NumberLineActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<NumberLineChallenge[]>(() =>
    actUseCases.createNumberLineSession(4)
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedTick, setSelectedTick] = useState<number | null>(null);
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
  const totalTicks = challenge.maxValue * challenge.stepDenominator;
  const ticks = Array.from({ length: totalTicks + 1 }, (_, i) => i);

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

  const handleSelectTick = useCallback(
    (tick: number) => {
      if (feedback?.correct) return;
      progUseCases.playSound("pop", profile.soundEnabled);
      setSelectedTick(tick);
      setFeedback(null);
    },
    [feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleCheck = useCallback(() => {
    if (selectedTick === null) return;
    void (async () => {
      try {
        const pickedValue = selectedTick / challenge.stepDenominator;
        const targetValue = challenge.numerator / challenge.denominator;
        const correct = Math.abs(pickedValue - targetValue) < 0.0001;

        const reward = await progUseCases.recordAttempt({
          questionId: challenge.id,
          worldId: "number-line",
          correct,
          answer: `${selectedTick}/${challenge.stepDenominator}`
        });

        if (!correct) {
          progUseCases.playSound("oops", profile.soundEnabled);
          setMistakes((m) => m + 1);
          setFeedback({
            correct: false,
            message: `Ops, estacionou na casa errada! Dica: ${challenge.hint}`
          });
          return;
        }

        progUseCases.playSound("success", profile.soundEnabled);
        setFeedback({
          correct: true,
          xp: reward.xpEarned,
          message: `Entrega perfeita! ${challenge.numerator}/${challenge.denominator} fica exatamente aqui.`
        });
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [challenge, profile.soundEnabled, progUseCases, selectedTick]);

  const handleNextRound = useCallback(() => {
    void (async () => {
      try {
        const next = roundIndex + 1;
        if (next >= challenges.length) {
          const stars = actUseCases.computeStars(mistakes);
          setEarnedStars(stars);
          await progUseCases.awardWorldStars("number-line", stars);
          progUseCases.playSound("fanfare", profile.soundEnabled);
          setCompleted(true);
          return;
        }
        progUseCases.playSound("pop", profile.soundEnabled);
        setRoundIndex(next);
        setSelectedTick(null);
        setFeedback(null);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenges.length, mistakes, profile.soundEnabled, progUseCases, roundIndex]);

  const handleRestart = useCallback(() => {
    setChallenges(actUseCases.createNumberLineSession(4));
    setRoundIndex(0);
    setSelectedTick(null);
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
      totalTicks,
      ticks,
      selectedTick,
      feedback,
      completed,
      earnedStars,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSelectTick,
      handleCheck,
      handleNextRound,
      handleRestart
    }
  ];
}
