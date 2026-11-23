import { equivalent, fraction } from "@/model/entities/fraction";
import {
  GAME_WORLDS,
  type CompareChallenge,
  type NumberLineChallenge,
  type PizzaOrderChallenge,
  type QuantityChallenge,
  type QuizChallenge
} from "@/model/entities/game";
import {
  generateArcadeSession,
  generateCompareSession,
  generateDecimalSession,
  generateEquivalentSession,
  generateNumberLineSession,
  generateOperationsSession,
  generatePizzaSession,
  generateQuantitySession,
  type ArcadeQuestion
} from "@/model/entities/generator";
import type { PlayerProfile } from "@/model/entities/progress";
import type { HomeWorldsSummary, IActivityUseCases } from "@/usecase/iActivityUseCases";

export class ActivityUseCases implements IActivityUseCases {
  createPizzaSession(count = 4): PizzaOrderChallenge[] {
    return generatePizzaSession(count);
  }

  createCompareSession(count = 4): CompareChallenge[] {
    return generateCompareSession(count);
  }

  createEquivalentSession(count = 4): QuizChallenge[] {
    return generateEquivalentSession(count);
  }

  createDecimalSession(count = 4): QuizChallenge[] {
    return generateDecimalSession(count);
  }

  createOperationsSession(count = 4): QuizChallenge[] {
    return generateOperationsSession(count);
  }

  createNumberLineSession(count = 4): NumberLineChallenge[] {
    return generateNumberLineSession(count);
  }

  createQuantitySession(count = 4): QuantityChallenge[] {
    return generateQuantitySession(count);
  }

  createArcadeSession(count = 7): ArcadeQuestion[] {
    return generateArcadeSession(count);
  }

  checkPizzaAnswer(
    selectedCount: number,
    denominator: number,
    targetNumerator: number,
    targetDenominator: number
  ): boolean {
    if (selectedCount <= 0) return false;
    return equivalent(
      fraction(selectedCount, denominator),
      fraction(targetNumerator, targetDenominator)
    );
  }

  computeStars(mistakes: number): number {
    if (mistakes === 0) return 3;
    if (mistakes <= 2) return 2;
    return 1;
  }

  getHomeWorldsSummary(profile: PlayerProfile): HomeWorldsSummary {
    const completedWorlds = Object.values(profile.worldStars).filter((stars) => stars > 0).length;
    const totalStars = Object.values(profile.worldStars).reduce((acc, stars) => acc + stars, 0);
    return {
      completedWorlds,
      totalStars,
      maxStars: GAME_WORLDS.length * 3
    };
  }
}
