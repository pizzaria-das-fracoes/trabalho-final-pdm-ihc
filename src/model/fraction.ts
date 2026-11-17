export type Fraction = Readonly<{
  numerator: number;
  denominator: number;
}>;

const assertInteger = (value: number, name: string) => {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${name} must be a safe integer`);
  }
};

const gcd = (a: number, b: number): number => {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    [left, right] = [right, left % right];
  }
  return left || 1;
};

export const fraction = (numerator: number, denominator: number): Fraction => {
  assertInteger(numerator, "numerator");
  assertInteger(denominator, "denominator");
  if (denominator <= 0) {
    throw new Error("denominator must be greater than zero");
  }
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

export const compareFractions = (left: Fraction, right: Fraction): -1 | 0 | 1 => {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference === 0 ? 0 : difference > 0 ? 1 : -1;
};

export const equivalent = (left: Fraction, right: Fraction) =>
  compareFractions(left, right) === 0;

export const addFractions = (left: Fraction, right: Fraction) =>
  fraction(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator
  );

export const subtractFractions = (left: Fraction, right: Fraction) =>
  fraction(
    left.numerator * right.denominator - right.numerator * left.denominator,
    left.denominator * right.denominator
  );

export const fractionOfQuantity = (value: Fraction, quantity: number) => {
  assertInteger(quantity, "quantity");
  return (value.numerator * quantity) / value.denominator;
};

export const toFiniteDecimal = (value: Fraction): number | null => {
  let denominator = value.denominator;
  for (const factor of [2, 5]) {
    while (denominator % factor === 0) denominator /= factor;
  }
  return denominator === 1 ? value.numerator / value.denominator : null;
};

export const formatFraction = (value: Fraction) =>
  value.denominator === 1 ? `${value.numerator}` : `${value.numerator}/${value.denominator}`;
