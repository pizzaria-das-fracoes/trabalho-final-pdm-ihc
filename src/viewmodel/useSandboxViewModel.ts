import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { progressUseCases } from "@/di/container";
import { addFractions, compareFractions, formatFraction, fraction, type Fraction } from "@/model/entities/fraction";
import { SANDBOX_MISSIONS, type SandboxMission, type SandboxStripSpec } from "@/model/entities/game";
import { DEFAULT_PROFILE, type Attempt, type PlayerProfile } from "@/model/entities/progress";
import { DomainError } from "@/model/errors";
import type { IProgressUseCases } from "@/usecase/iProgressUseCases";

const sumStrips = (strips: SandboxStripSpec[]): Fraction =>
  strips.reduce((acc, s) => addFractions(acc, fraction(s.n, s.d)), fraction(0, 1));

export type SandboxMode = "compare" | "mix";

export type SandboxState = {
  profile: PlayerProfile;
  activeRoute: string;
  mode: SandboxMode;
  trayA: SandboxStripSpec[];
  trayB: SandboxStripSpec[];
  activeTray: "A" | "B";
  totalA: Fraction;
  totalB: Fraction;
  cmp: -1 | 0 | 1;
  formattedTotalA: string;
  formattedTotalB: string;
  compareSummary: string;
  mission: SandboxMission;
  missionSolvedNow: boolean;
  missionClaimed: boolean;
  showHint: boolean;
  pizzaDenA: number;
  pizzaSelA: number[];
  pizzaDenB: number;
  pizzaSelB: number[];
  sumPizza: Fraction;
  wholePizzas: number;
  remainderNum: number;
  clampedResultDen: number;
  clampedResultNum: number;
  error: string | null;
};

export type SandboxActions = {
  handleNavigate: (route: string) => void;
  handleBackToMap: () => void;
  handleToggleSound: () => void;
  handleSetMode: (next: SandboxMode) => void;
  handleSetActiveTray: (tray: "A" | "B") => void;
  handleClearTray: (tray: "A" | "B") => void;
  handleAddPiece: (d: number) => void;
  handleRemovePiece: (tray: "A" | "B", id: string) => void;
  handleToggleHint: () => void;
  handleNextMission: () => void;
  handleClaimMission: () => void;
  handleSetPizzaDenA: (next: number) => void;
  handleTogglePizzaSliceA: (idx: number) => void;
  handleSetPizzaCountA: (count: number) => void;
  handleSetPizzaDenB: (next: number) => void;
  handleTogglePizzaSliceB: (idx: number) => void;
  handleSetPizzaCountB: (count: number) => void;
  handleResetMix: () => void;
};

export function useSandboxViewModel(
  progUseCases: IProgressUseCases = progressUseCases
): [SandboxState, SandboxActions] {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [mode, setMode] = useState<SandboxMode>("compare");
  const [trayA, setTrayA] = useState<SandboxStripSpec[]>([{ id: "init-a", n: 1, d: 2 }]);
  const [trayB, setTrayB] = useState<SandboxStripSpec[]>([
    { id: "init-b1", n: 1, d: 4 },
    { id: "init-b2", n: 1, d: 4 }
  ]);
  const [activeTray, setActiveTray] = useState<"A" | "B">("B");
  const [missionIdx, setMissionIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const [pizzaDenA, setPizzaDenA] = useState(4);
  const [pizzaSelA, setPizzaSelA] = useState<number[]>([0]);
  const [pizzaDenB, setPizzaDenB] = useState(4);
  const [pizzaSelB, setPizzaSelB] = useState<number[]>([0, 1]);
  const [error, setError] = useState<string | null>(null);

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
    }
  }, [progUseCases]);

  useEffect(() => {
    void load();
    return progUseCases.onProgressChanged(() => {
      void load();
    });
  }, [load, progUseCases]);

  const totalA = sumStrips(trayA);
  const totalB = sumStrips(trayB);
  const cmp = compareFractions(totalA, totalB);
  const formattedTotalA = totalA.numerator === 0 ? "0" : formatFraction(totalA);
  const formattedTotalB = totalB.numerator === 0 ? "0" : formatFraction(totalB);
  const compareSummary =
    cmp === 0
      ? `Mesmo tamanho! ${formatFraction(totalA)} = ${formatFraction(totalB)}`
      : cmp > 0
        ? `Bandeja A tem mais pizza: ${formatFraction(totalA)} > ${formatFraction(totalB)}`
        : `Bandeja B tem mais pizza: ${formatFraction(totalA)} < ${formatFraction(totalB)}`;

  const mission = SANDBOX_MISSIONS[missionIdx];
  const missionSolvedNow = mission.check(trayA, trayB, totalA, totalB);
  const missionClaimed = useMemo(
    () => attempts.some((a) => a.worldId === "sandbox" && a.questionId === mission.id && a.correct),
    [attempts, mission.id]
  );

  const sumPizza = addFractions(
    fraction(pizzaSelA.length, pizzaDenA),
    fraction(pizzaSelB.length, pizzaDenB)
  );
  const wholePizzas = Math.floor(sumPizza.numerator / sumPizza.denominator);
  const remainderNum = sumPizza.numerator % sumPizza.denominator;
  const clampedResultDen = sumPizza.denominator === 1 ? 4 : Math.min(100, sumPizza.denominator);
  const clampedResultNum =
    sumPizza.denominator <= 100
      ? remainderNum
      : Math.round((remainderNum / sumPizza.denominator) * 100);

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

  const handleSetMode = useCallback(
    (next: SandboxMode) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setMode(next);
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleSetActiveTray = useCallback(
    (tray: "A" | "B") => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setActiveTray(tray);
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleClearTray = useCallback(
    (tray: "A" | "B") => {
      progUseCases.playSound("pop", profile.soundEnabled);
      if (tray === "A") setTrayA([]);
      else setTrayB([]);
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleAddPiece = useCallback(
    (d: number) => {
      const current = activeTray === "A" ? trayA : trayB;
      const nextSum = addFractions(sumStrips(current), fraction(1, d));
      if (nextSum.numerator > nextSum.denominator) {
        progUseCases.playSound("oops", profile.soundEnabled);
        return;
      }
      progUseCases.playSound("pop", profile.soundEnabled);
      const piece: SandboxStripSpec = { id: `${Date.now()}-${Math.random()}`, n: 1, d };
      if (activeTray === "A") setTrayA([...trayA, piece]);
      else setTrayB([...trayB, piece]);
    },
    [activeTray, profile.soundEnabled, progUseCases, trayA, trayB]
  );

  const handleRemovePiece = useCallback(
    (tray: "A" | "B", id: string) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      if (tray === "A") setTrayA((prev) => prev.filter((p) => p.id !== id));
      else setTrayB((prev) => prev.filter((p) => p.id !== id));
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleToggleHint = useCallback(() => {
    setShowHint((h) => !h);
  }, []);

  const handleNextMission = useCallback(() => {
    progUseCases.playSound("pop", profile.soundEnabled);
    setShowHint(false);
    setMissionIdx((i) => (i + 1) % SANDBOX_MISSIONS.length);
  }, [profile.soundEnabled, progUseCases]);

  const handleClaimMission = useCallback(() => {
    if (!missionSolvedNow || missionClaimed) return;
    void (async () => {
      try {
        progUseCases.playSound("coin", profile.soundEnabled);
        await progUseCases.recordAttempt({
          questionId: mission.id,
          worldId: "sandbox",
          correct: true,
          answer: formatFraction(totalA)
        });
      } catch (err: unknown) {
        if (err instanceof DomainError) {
          setError(err.message);
        }
      }
    })();
  }, [mission.id, missionClaimed, missionSolvedNow, profile.soundEnabled, progUseCases, totalA]);

  const handleSetPizzaDenA = useCallback(
    (next: number) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setPizzaDenA(next);
      setPizzaSelA((s) => s.filter((x) => x < next));
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleTogglePizzaSliceA = useCallback(
    (idx: number) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setPizzaSelA((s) => (s.includes(idx) ? s.filter((x) => x !== idx) : [...s, idx]));
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleSetPizzaCountA = useCallback((count: number) => {
    const rounded = Math.round(count);
    setPizzaSelA(Array.from({ length: rounded }, (_, i) => i));
  }, []);

  const handleSetPizzaDenB = useCallback(
    (next: number) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setPizzaDenB(next);
      setPizzaSelB((s) => s.filter((x) => x < next));
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleTogglePizzaSliceB = useCallback(
    (idx: number) => {
      progUseCases.playSound("pop", profile.soundEnabled);
      setPizzaSelB((s) => (s.includes(idx) ? s.filter((x) => x !== idx) : [...s, idx]));
    },
    [profile.soundEnabled, progUseCases]
  );

  const handleSetPizzaCountB = useCallback((count: number) => {
    const rounded = Math.round(count);
    setPizzaSelB(Array.from({ length: rounded }, (_, i) => i));
  }, []);

  const handleResetMix = useCallback(() => {
    progUseCases.playSound("pop", profile.soundEnabled);
    setPizzaDenA(4);
    setPizzaSelA([0]);
    setPizzaDenB(4);
    setPizzaSelB([0, 1]);
  }, [profile.soundEnabled, progUseCases]);

  return [
    {
      profile,
      activeRoute: pathname,
      mode,
      trayA,
      trayB,
      activeTray,
      totalA,
      totalB,
      cmp,
      formattedTotalA,
      formattedTotalB,
      compareSummary,
      mission,
      missionSolvedNow,
      missionClaimed,
      showHint,
      pizzaDenA,
      pizzaSelA,
      pizzaDenB,
      pizzaSelB,
      sumPizza,
      wholePizzas,
      remainderNum,
      clampedResultDen,
      clampedResultNum,
      error
    },
    {
      handleNavigate,
      handleBackToMap,
      handleToggleSound,
      handleSetMode,
      handleSetActiveTray,
      handleClearTray,
      handleAddPiece,
      handleRemovePiece,
      handleToggleHint,
      handleNextMission,
      handleClaimMission,
      handleSetPizzaDenA,
      handleTogglePizzaSliceA,
      handleSetPizzaCountA,
      handleSetPizzaDenB,
      handleTogglePizzaSliceB,
      handleSetPizzaCountB,
      handleResetMix
    }
  ];
}
