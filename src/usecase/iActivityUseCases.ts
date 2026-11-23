import type {
  CompareChallenge,
  NumberLineChallenge,
  PizzaOrderChallenge,
  QuantityChallenge,
  QuizChallenge
} from "@/model/entities/game";
import type { ArcadeQuestion } from "@/model/entities/generator";
import type { PlayerProfile } from "@/model/entities/progress";

export type HomeWorldsSummary = {
  completedWorlds: number;
  totalStars: number;
  maxStars: number;
};

export interface IActivityUseCases {
  createPizzaSession(count?: number): PizzaOrderChallenge[];
  createCompareSession(count?: number): CompareChallenge[];
  createEquivalentSession(count?: number): QuizChallenge[];
  createDecimalSession(count?: number): QuizChallenge[];
  createOperationsSession(count?: number): QuizChallenge[];
  createNumberLineSession(count?: number): NumberLineChallenge[];
  createQuantitySession(count?: number): QuantityChallenge[];
  createArcadeSession(count?: number): ArcadeQuestion[];
  checkPizzaAnswer(
    selectedCount: number,
    denominator: number,
    targetNumerator: number,
    targetDenominator: number
  ): boolean;
  computeStars(mistakes: number): number;
  getHomeWorldsSummary(profile: PlayerProfile): HomeWorldsSummary;
}
