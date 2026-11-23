import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { CompareChallenge } from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type CompareChoice = "left" | "right" | "tie";

export type CompareState = {
  profile: PlayerProfile;
  activeRoute: string;
  challenge: CompareChallenge;
  roundIndex: number;
  totalRounds: number;
  choice: CompareChoice | null;
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  error: string | null;
};

export type CompareActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSelectChoice: (value: CompareChoice) => void;
  handleCheck: () => void;
  handleNextRound: () => void;
  handleRestart: () => void;
};

export function useCompareViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [CompareState, CompareActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<CompareChallenge[]>(() =>
    actUseCases.createCompareSession(4)
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [choice, setChoice] = useState<CompareChoice | null>(null);
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

  const handleSelectChoice = useCallback(
    (value: CompareChoice) => {
      if (feedback?.correct) return;
      progUseCases.playSound("pop", profile.soundEnabled);
      setChoice(value);
      setFeedback(null);
    },
    [feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleCheck = useCallback(() => {
    if (!choice) return;
    void (async () => {
      try {
        const correct = choice === challenge.winner;
        const reward = await progUseCases.recordAttempt({
          questionId: challenge.id,
          worldId: "compare",
          correct,
          answer: choice
        });

        if (!correct) {
          progUseCases.playSound("oops", profile.soundEnabled);
          setMistakes((m) => m + 1);
          setFeedback({ correct: false, message: `Ops! Dica: ${challenge.hint}` });
          return;
        }

        progUseCases.playSound("success", profile.soundEnabled);
        setFeedback({
          correct: true,
          xp: reward.xpEarned,
          message: challenge.explanation
        });
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [challenge, choice, profile.soundEnabled, progUseCases]);

  const handleNextRound = useCallback(() => {
    void (async () => {
      try {
        const next = roundIndex + 1;
        if (next >= challenges.length) {
          const stars = actUseCases.computeStars(mistakes);
          setEarnedStars(stars);
          await progUseCases.awardWorldStars("compare", stars);
          progUseCases.playSound("fanfare", profile.soundEnabled);
          setCompleted(true);
          return;
        }
        progUseCases.playSound("pop", profile.soundEnabled);
        setRoundIndex(next);
        setChoice(null);
        setFeedback(null);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenges.length, mistakes, profile.soundEnabled, progUseCases, roundIndex]);

  const handleRestart = useCallback(() => {
    const fresh = actUseCases.createCompareSession(4);
    setChallenges(fresh);
    setRoundIndex(0);
    setChoice(null);
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
      choice,
      feedback,
      completed,
      earnedStars,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSelectChoice,
      handleCheck,
      handleNextRound,
      handleRestart
    }
  ];
}
