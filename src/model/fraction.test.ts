/// <reference types="jest" />

import {
  addFractions,
  compareFractions,
  equivalent,
  fraction,
  fractionOfQuantity,
  subtractFractions,
  toFiniteDecimal
} from "./fraction";

describe("fraction model", () => {
  it("normalizes and compares without floats", () => {
    expect(fraction(2, 4)).toEqual({ numerator: 1, denominator: 2 });
    expect(compareFractions(fraction(1, 2), fraction(2, 4))).toBe(0);
    expect(compareFractions(fraction(3, 4), fraction(2, 3))).toBe(1);
  });

  it("supports equivalent, quantity and operations", () => {
    expect(equivalent(fraction(2, 3), fraction(4, 6))).toBe(true);
    expect(fractionOfQuantity(fraction(3, 4), 20)).toBe(15);
    expect(addFractions(fraction(1, 2), fraction(1, 3))).toEqual({ numerator: 5, denominator: 6 });
    expect(subtractFractions(fraction(3, 4), fraction(1, 2))).toEqual({ numerator: 1, denominator: 4 });
  });

  it("distinguishes finite decimals", () => {
    expect(toFiniteDecimal(fraction(1, 4))).toBe(0.25);
    expect(toFiniteDecimal(fraction(1, 3))).toBeNull();
  });

  it("rejects invalid denominators", () => {
    expect(() => fraction(1, 0)).toThrow("denominator");
  });
});
