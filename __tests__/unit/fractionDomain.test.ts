import {
  addFractions,
  compareFractions,
  equivalent,
  formatFraction,
  fraction,
  fractionOfQuantity,
  subtractFractions,
  toFiniteDecimal
} from "@/model/entities/fraction";
import { ValidationError } from "@/model/errors";

describe("Domínio de Frações — casos de sucesso, falha e borda", () => {
  it("normaliza frações para forma irredutível preservando equivalência matemática", () => {
    expect(fraction(6, 8)).toEqual({ numerator: 3, denominator: 4 });
    expect(fraction(0, 5)).toEqual({ numerator: 0, denominator: 1 });
    expect(fraction(8, 4)).toEqual({ numerator: 2, denominator: 1 });
  });

  it("rejeita denominador menor ou igual a zero com ValidationError", () => {
    expect(() => fraction(3, 0)).toThrow(ValidationError);
    expect(() => fraction(3, -4)).toThrow("denominator must be greater than zero");
  });

  it("rejeita numeradores, denominadores e quantidades não inteiros", () => {
    expect(() => fraction(1.5, 2)).toThrow("numerator must be a safe integer");
    expect(() => fraction(1, Number.NaN)).toThrow("denominator must be a safe integer");
    expect(() => fractionOfQuantity(fraction(1, 2), 2.5)).toThrow("quantity must be a safe integer");
  });

  it("compara frações sem imprecisão de ponto flutuante", () => {
    expect(compareFractions(fraction(1, 3), fraction(2, 6))).toBe(0);
    expect(compareFractions(fraction(5, 8), fraction(1, 2))).toBe(1);
    expect(compareFractions(fraction(2, 7), fraction(1, 3))).toBe(-1);
    expect(equivalent(fraction(9, 12), fraction(3, 4))).toBe(true);
  });

  it("executa soma, subtração e fração de quantidade", () => {
    expect(addFractions(fraction(1, 4), fraction(1, 4))).toEqual({ numerator: 1, denominator: 2 });
    expect(subtractFractions(fraction(3, 4), fraction(3, 4))).toEqual({ numerator: 0, denominator: 1 });
    expect(fractionOfQuantity(fraction(3, 5), 25)).toBe(15);
    expect(fractionOfQuantity(fraction(0, 4), 100)).toBe(0);
  });

  it("identifica decimais exatos vs dízimas e formata frações ou inteiros", () => {
    expect(toFiniteDecimal(fraction(3, 8))).toBe(0.375);
    expect(toFiniteDecimal(fraction(1, 5))).toBe(0.2);
    expect(toFiniteDecimal(fraction(2, 3))).toBeNull();
    expect(toFiniteDecimal(fraction(1, 7))).toBeNull();

    expect(formatFraction(fraction(4, 1))).toBe("4");
    expect(formatFraction(fraction(3, 4))).toBe("3/4");
  });
});
