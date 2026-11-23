import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { activityUseCases, progressUseCases } from "@/di/container";
import type { ArcadeQuestion } from "@/model/entities/generator";
import { DEFAULT_PROFILE, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IActivityUseCases } from "@/usecase/iActivityUseCases";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

export const ARCADE_MAX_LIVES = 3;

export type ArcadePhase = "ready" | "playing" | "won" | "gameover";

export type ArcadeState = {
  profile: PlayerProfile;
  activeRoute: string;
  phase: ArcadePhase;
  timedMode: boolean;
  timeLeft: number;
  lives: number;
  lostHeartIdx: number | null;
  qIdx: number;
  totalQuestions: number;
  current: ArcadeQuestion | undefined;
  score: number;
  combo: number;
  reveal: { picked: string; correct: boolean } | null;
  error: string | null;
};

export type ArcadeActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSetTimedMode: (mode: "timed" | "untimed") => void;
  handleStartGame: () => void;
  handleAnswerQuestion: (option: string) => void;
};

export function useArcadeViewModel(
  progUseCases: IProgressUseCases = progressUseCases,
  actUseCases: IActivityUseCases = activityUseCases
): [ArcadeState, ArcadeActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [questions, setQuestions] = useState<ArcadeQuestion[]>(() =>
    actUseCases.createArcadeSession(7)
  );
  const [phase, setPhase] = useState<ArcadePhase>("ready");
  const [timedMode, setTimedMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45);
  const [lives, setLives] = useState(ARCADE_MAX_LIVES);
  const [lostHeartIdx, setLostHeartIdx] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [reveal, setReveal] = useState<{ picked: string; correct: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing" || !timedMode || reveal !== null) return;
    if (timeLeft <= 0) {
      setPhase("gameover");
      progUseCases.playSound("oops", profile.soundEnabled);
      void progUseCases.recordArcadeScore(score);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timedMode, timeLeft, reveal, score, progUseCases, profile.soundEnabled]);

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

  const handleSetTimedMode = useCallback(
    (mode: "timed" | "untimed") => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setTimedMode(mode === "timed");
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleStartGame = useCallback(() => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    progUseCases.playSound("pop", profile.soundEnabled);
    setQuestions(actUseCases.createArcadeSession(7));
    setQIdx(0);
    setScore(0);
    setCombo(0);
    setLives(ARCADE_MAX_LIVES);
    setLostHeartIdx(null);
    setTimeLeft(45);
    setReveal(null);
    setPhase("playing");
  }, [actUseCases, profile.soundEnabled, progUseCases]);

  const handleAnswerQuestion = useCallback(
    (option: string) => {
      if (reveal !== null || phase !== "playing") return;
      const current = questions[qIdx];
      if (!current) return;

      const correct = option === current.answer;
      setReveal({ picked: option, correct });

      if (correct) {
        progUseCases.playSound("success", profile.soundEnabled);
        const nextCombo = combo + 1;
        const points = 20 + nextCombo * 5;
        const nextScore = score + points;
        setCombo(nextCombo);
        setScore(nextScore);

        revealTimerRef.current = setTimeout(() => {
          void (async () => {
            setReveal(null);
            if (qIdx + 1 >= questions.length) {
              const lifeBonus = lives * 15;
              const finalScore = nextScore + lifeBonus;
              setScore(finalScore);
              setPhase("won");
              progUseCases.playSound("fanfare", profile.soundEnabled);
              await progUseCases.recordArcadeScore(finalScore);
              return;
            }
            setQIdx((i) => i + 1);
          })();
        }, 480);
        return;
      }

      progUseCases.playSound("oops", profile.soundEnabled);
      const nextLives = lives - 1;
      setLostHeartIdx(nextLives);
      setLives(nextLives);
      setCombo(0);

      revealTimerRef.current = setTimeout(() => {
        void (async () => {
          setReveal(null);
          setLostHeartIdx(null);

          if (nextLives <= 0) {
            setPhase("gameover");
            await progUseCases.recordArcadeScore(score);
            return;
          }

          if (qIdx + 1 >= questions.length) {
            setPhase("won");
            progUseCases.playSound("fanfare", profile.soundEnabled);
            await progUseCases.recordArcadeScore(score);
            return;
          }

          setQIdx((i) => i + 1);
        })();
      }, 1150);
    },
    [combo, lives, phase, profile.soundEnabled, progUseCases, qIdx, questions, reveal, score]
  );

  return [
    {
      profile,
      activeRoute: pathname,
      phase,
      timedMode,
      timeLeft,
      lives,
      lostHeartIdx,
      qIdx,
      totalQuestions: questions.length,
      current: questions[qIdx],
      score,
      combo,
      reveal,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSetTimedMode,
      handleStartGame,
      handleAnswerQuestion
    }
  ];
}
