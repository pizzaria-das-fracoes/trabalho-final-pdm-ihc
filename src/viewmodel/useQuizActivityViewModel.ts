import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { QuizChallenge, WorldId } from "@/model/entities/game";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export type QuizWorldKind = "equivalent" | "decimal" | "operations";

export type QuizActivityState = {
  profile: PlayerProfile;
  activeRoute: string;
  challenge: QuizChallenge;
  roundIndex: number;
  totalRounds: number;
  answer: string | null;
  wrongAttempts: string[];
  feedback: { correct: boolean; message: string; xp?: number } | null;
  completed: boolean;
  earnedStars: number;
  error: string | null;
};

export type QuizActivityActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSelectAnswer: (option: string) => void;
  handleSubmit: () => void;
  handleNextRound: () => void;
  handleRestart: () => void;
};

const createSessionForWorld = (kind: QuizWorldKind, actUseCases: IActivityUseCases): QuizChallenge[] => {
  if (kind === "equivalent") return actUseCases.createEquivalentSession(4);
  if (kind === "decimal") return actUseCases.createDecimalSession(4);
  return actUseCases.createOperationsSession(4);
};

export function useQuizActivityViewModel(
  worldId: QuizWorldKind,
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [QuizActivityState, QuizActivityActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<QuizChallenge[]>(() =>
    createSessionForWorld(worldId, actUseCases)
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
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

  const handleSelectAnswer = useCallback(
    (option: string) => {
      if (feedback?.correct) return;
      progUseCases.playSound("pop", profile.soundEnabled);
      setAnswer(option);
      setFeedback(null);
    },
    [feedback?.correct, profile.soundEnabled, progUseCases]
  );

  const handleSubmit = useCallback(() => {
    if (answer === null) return;
    void (async () => {
      try {
        const correct = answer === challenge.expected;
        const reward = await progUseCases.recordAttempt({
          questionId: challenge.id,
          worldId: worldId as WorldId,
          correct,
          answer
        });

        if (!correct) {
          progUseCases.playSound("oops", profile.soundEnabled);
          setMistakes((m) => m + 1);
          setWrongAttempts((prev) => (prev.includes(answer) ? prev : [...prev, answer]));
          setAnswer(null);
          setFeedback({ correct: false, message: `Dica do Chef: ${challenge.hint}` });
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
  }, [answer, challenge, profile.soundEnabled, progUseCases, worldId]);

  const handleNextRound = useCallback(() => {
    void (async () => {
      try {
        const next = roundIndex + 1;
        if (next >= challenges.length) {
          const stars = actUseCases.computeStars(mistakes);
          setEarnedStars(stars);
          await progUseCases.awardWorldStars(worldId, stars);
          progUseCases.playSound("fanfare", profile.soundEnabled);
          setCompleted(true);
          return;
        }
        progUseCases.playSound("pop", profile.soundEnabled);
        setRoundIndex(next);
        setAnswer(null);
        setWrongAttempts([]);
        setFeedback(null);
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [actUseCases, challenges.length, mistakes, profile.soundEnabled, progUseCases, roundIndex, worldId]);

  const handleRestart = useCallback(() => {
    setChallenges(createSessionForWorld(worldId, actUseCases));
    setRoundIndex(0);
    setAnswer(null);
    setWrongAttempts([]);
    setFeedback(null);
    setMistakes(0);
    setCompleted(false);
    setEarnedStars(0);
  }, [actUseCases, worldId]);

  return [
    {
      profile,
      activeRoute: pathname,
      challenge,
      roundIndex,
      totalRounds: challenges.length,
      answer,
      wrongAttempts,
      feedback,
      completed,
      earnedStars,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSelectAnswer,
      handleSubmit,
      handleNextRound,
      handleRestart
    }
  ];
}
