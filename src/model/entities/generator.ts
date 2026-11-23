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
import type {
  CompareChallenge,
  NumberLineChallenge,
  PizzaOrderChallenge,
  QuantityChallenge,
  QuizChallenge
} from "@/model/entities/game";

const shuffle = <T>(items: readonly T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickUnique = <T>(items: readonly T[], count: number): T[] =>
  shuffle(items).slice(0, Math.min(count, items.length));

const CUSTOMERS = ["Leo", "Maya", "Lucas", "Bia", "Téo", "Sofia", "Gabi", "Rafa", "Nina", "Caio"];

const PIZZA_RECIPES: Array<{
  n: number;
  d: number;
  initialD: number;
  allowCut: boolean;
  label: string;
}> = [
  { n: 3, d: 4, initialD: 4, allowCut: false, label: "3 quartos" },
  { n: 2, d: 5, initialD: 5, allowCut: false, label: "2 quintos" },
  { n: 5, d: 8, initialD: 4, allowCut: true, label: "5 oitavos" },
  { n: 1, d: 2, initialD: 6, allowCut: true, label: "exatamente metade" },
  { n: 2, d: 3, initialD: 3, allowCut: false, label: "2 terços" },
  { n: 4, d: 6, initialD: 3, allowCut: true, label: "4 sextos" },
  { n: 3, d: 5, initialD: 5, allowCut: false, label: "3 quintos" },
  { n: 7, d: 8, initialD: 8, allowCut: false, label: "7 oitavos" },
  { n: 5, d: 6, initialD: 6, allowCut: false, label: "5 sextos" },
  { n: 3, d: 4, initialD: 8, allowCut: true, label: "3 quartos (use 8 fatias!)" }
];

export const generatePizzaSession = (count = 4): PizzaOrderChallenge[] => {
  const recipes = pickUnique(PIZZA_RECIPES, count);
  const names = shuffle(CUSTOMERS);
  return recipes.map((r, idx) => ({
    id: `pizza-${r.n}-${r.d}-${Date.now()}-${idx}`,
    customer: `Pedido de ${names[idx % names.length]}: quero ${r.label} da pizza!`,
    targetNumerator: r.n,
    targetDenominator: r.d,
    initialDenominator: r.initialD,
    allowCutChange: r.allowCut,
    hint: r.allowCut
      ? `Ajuste para ${r.d} fatias com + ou - e pinte ${r.n} fatias (ou uma fração equivalente!).`
      : `A pizza tem ${r.d} fatias iguais. Pinte ${r.n} delas!`
  }));
};

const COMPARE_PAIRS: Array<{
  left: [number, number];
  right: [number, number];
}> = [
  { left: [3, 4], right: [2, 3] },
  { left: [1, 2], right: [5, 8] },
  { left: [2, 3], right: [4, 6] },
  { left: [4, 5], right: [3, 4] },
  { left: [3, 5], right: [1, 2] },
  { left: [5, 6], right: [7, 8] },
  { left: [1, 2], right: [3, 6] },
  { left: [2, 5], right: [1, 3] },
  { left: [3, 8], right: [1, 2] },
  { left: [3, 4], right: [6, 8] },
  { left: [5, 6], right: [3, 4] },
  { left: [2, 3], right: [5, 8] }
];

export const generateCompareSession = (count = 4): CompareChallenge[] => {
  const chosen = pickUnique(COMPARE_PAIRS, count);
  return chosen.map((pair, idx) => {
    const swap = Math.random() > 0.5;
    const [ln, ld] = swap ? pair.right : pair.left;
    const [rn, rd] = swap ? pair.left : pair.right;
    const cmp = compareFractions(fraction(ln, ld), fraction(rn, rd));
    const winner: "left" | "right" | "tie" = cmp === 0 ? "tie" : cmp > 0 ? "left" : "right";
    const explanation =
      winner === "tie"
        ? `Empate delicioso! ${ln}/${ld} e ${rn}/${rd} ocupam exatamente o mesmo espaço.`
        : winner === "left"
          ? `${ln}/${ld} tem mais pizza do que ${rn}/${rd}!`
          : `${rn}/${rd} tem mais pizza do que ${ln}/${ld}!`;

    return {
      id: `cmp-${ln}-${ld}-vs-${rn}-${rd}-${Date.now()}-${idx}`,
      left: { numerator: ln, denominator: ld },
      right: { numerator: rn, denominator: rd },
      winner,
      explanation,
      hint: "Compare quanto falta para completar a pizza inteira ou imagine os cortes do mesmo tamanho."
    };
  });
};

const EQUIV_BANK: Array<{
  ref: [number, number];
  correct: [number, number];
  distractors: Array<[number, number]>;
  hint: string;
}> = [
  { ref: [2, 3], correct: [4, 6], distractors: [[3, 5], [2, 5], [5, 8]], hint: "Multiplique cima e baixo por 2." },
  { ref: [1, 2], correct: [3, 6], distractors: [[2, 5], [3, 8], [2, 3]], hint: "O número de cima precisa ser metade do de baixo." },
  { ref: [3, 4], correct: [6, 8], distractors: [[5, 8], [4, 6], [4, 5]], hint: "Dobre o total de fatias: 4 vira 8." },
  { ref: [1, 2], correct: [4, 8], distractors: [[3, 5], [3, 8], [5, 6]], hint: "Metade de 8 fatias são quantas fatias?" },
  { ref: [1, 3], correct: [2, 6], distractors: [[2, 5], [3, 8], [1, 4]], hint: "Corte cada uma das 3 fatias ao meio." },
  { ref: [1, 4], correct: [2, 8], distractors: [[2, 6], [1, 3], [3, 8]], hint: "Se 4 fatias viram 8, 1 fatia vira 2." },
  { ref: [1, 2], correct: [2, 4], distractors: [[2, 3], [2, 5], [3, 8]], hint: "Qual pizza está exatamente pela metade?" }
];

export const generateEquivalentSession = (count = 4): QuizChallenge[] => {
  const picked = pickUnique(EQUIV_BANK, count);
  return picked.map((item, idx) => {
    const [rn, rd] = item.ref;
    const [cn, cd] = item.correct;
    const correctStr = `${cn}/${cd}`;
    const chosenDistractors = pickUnique(item.distractors, 2);
    const allFracs = shuffle([item.correct, ...chosenDistractors]);
    const fractionOptions: Record<string, { numerator: number; denominator: number }> = {};
    const options = allFracs.map(([n, d]) => {
      const key = `${n}/${d}`;
      fractionOptions[key] = { numerator: n, denominator: d };
      return key;
    });

    return {
      id: `eq-${rn}-${rd}-${cn}-${cd}-${Date.now()}-${idx}`,
      prompt: `Qual pizza tem a mesma quantidade que ${rn}/${rd}?`,
      instruction: "Encontre a pizza com o mesmo tamanho pintado, mesmo com cortes diferentes.",
      options,
      expected: correctStr,
      explanation: `${rn}/${rd} e ${correctStr} representam exatamente a mesma quantidade de pizza!`,
      hint: item.hint,
      fractionOptions,
      visualData: { refNumerator: rn, refDenominator: rd }
    };
  });
};

const DECIMAL_FRACS: Array<[number, number]> = [
  [1, 4],
  [1, 2],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [1, 8],
  [3, 8]
];

const formatDecimalBr = (num: number): string => num.toString().replace(".", ",");

export const generateDecimalSession = (count = 4): QuizChallenge[] => {
  const picked = pickUnique(DECIMAL_FRACS, count);
  const allDecimals = DECIMAL_FRACS.map(([n, d]) => formatDecimalBr(toFiniteDecimal(fraction(n, d)) ?? 0));

  return picked.map(([n, d], idx) => {
    const dec = toFiniteDecimal(fraction(n, d)) ?? 0;
    const expected = formatDecimalBr(dec);
    const distractors = pickUnique(
      allDecimals.filter((val) => val !== expected),
      2
    );
    const options = shuffle([expected, ...distractors]);

    return {
      id: `dec-${n}-${d}-${Date.now()}-${idx}`,
      prompt: `Quanto vale ${n}/${d} no medidor digital?`,
      instruction: "Divida o inteiro pelo número de fatias para achar o decimal.",
      options,
      expected,
      explanation: `${n}/${d} equivale a ${expected} (${n} dividido por ${d}).`,
      hint: `Pense em 1 inteiro como 100 centavos e pegue ${n} de ${d} partes.`,
      visualData: { refNumerator: n, refDenominator: d, decimalLabel: "?" }
    };
  });
};

const NL_BANK: Array<{ n: number; d: number; maxValue: number; stepD: number; hint: string }> = [
  { n: 1, d: 2, maxValue: 2, stepD: 4, hint: "1/2 fica exatamente no meio entre 0 e 1!" },
  { n: 3, d: 2, maxValue: 2, stepD: 4, hint: "3/2 é 1 inteiro e mais metade até o 2!" },
  { n: 3, d: 4, maxValue: 2, stepD: 4, hint: "Conte 3 pulinhos de 1/4 a partir do zero." },
  { n: 5, d: 4, maxValue: 2, stepD: 4, hint: "4/4 já é 1. Dê mais 1 pulinho de 1/4 depois do 1!" },
  { n: 7, d: 4, maxValue: 2, stepD: 4, hint: "Falta só 1/4 para chegar no número 2!" },
  { n: 2, d: 3, maxValue: 2, stepD: 3, hint: "Cada inteiro está dividido em 3 pulos. Dê 2 pulos!" },
  { n: 4, d: 3, maxValue: 2, stepD: 3, hint: "3/3 é 1 inteiro. Dê mais 1 pulo de 1/3!" },
  { n: 3, d: 5, maxValue: 2, stepD: 5, hint: "Cada inteiro tem 5 espaços. Pare no 3º tracinho!" },
  { n: 6, d: 5, maxValue: 2, stepD: 5, hint: "5/5 é 1 inteiro. Avance mais 1/5 depois do 1!" }
];

export const generateNumberLineSession = (count = 4): NumberLineChallenge[] => {
  const picked = pickUnique(NL_BANK, count);
  return picked.map((item, idx) => ({
    id: `nl-${item.n}-${item.d}-${Date.now()}-${idx}`,
    label: `Estacione a motoca em ${item.n}/${item.d}`,
    numerator: item.n,
    denominator: item.d,
    maxValue: item.maxValue,
    stepDenominator: item.stepD,
    hint: item.hint
  }));
};

const QUANTITY_BANK: Array<{ n: number; d: number; total: number; item: string }> = [
  { n: 3, d: 4, total: 20, item: "mini-pizzas" },
  { n: 2, d: 3, total: 12, item: "brigadeiros" },
  { n: 1, d: 2, total: 14, item: "coxinhas" },
  { n: 3, d: 5, total: 15, item: "fatias doces" },
  { n: 2, d: 5, total: 20, item: "cupcakes" },
  { n: 3, d: 4, total: 16, item: "biscoitos" },
  { n: 5, d: 6, total: 18, item: "esfihas" },
  { n: 1, d: 3, total: 15, item: "moranguinhos" },
  { n: 4, d: 5, total: 25, item: "beijinhos" }
];

export const generateQuantitySession = (count = 4): QuantityChallenge[] => {
  const picked = pickUnique(QUANTITY_BANK, count);
  return picked.map((q, idx) => {
    const perGroup = q.total / q.d;
    return {
      id: `qty-${q.n}-${q.d}-${q.total}-${Date.now()}-${idx}`,
      prompt: `Separe ${q.n}/${q.d} de ${q.total} ${q.item}!`,
      numerator: q.n,
      denominator: q.d,
      totalItems: q.total,
      itemName: q.item,
      hint: `São ${q.d} bandejas de ${perGroup}. Selecione ${q.n} bandejas!`
    };
  });
};

const OPERATIONS_BANK: Array<{
  a: [number, number];
  b: [number, number];
  op: "+" | "-";
  commonD: number;
}> = [
  { a: [1, 2], b: [1, 3], op: "+", commonD: 6 },
  { a: [3, 4], b: [1, 2], op: "-", commonD: 4 },
  { a: [1, 3], b: [1, 6], op: "+", commonD: 6 },
  { a: [5, 6], b: [1, 3], op: "-", commonD: 6 },
  { a: [1, 2], b: [1, 4], op: "+", commonD: 4 },
  { a: [7, 8], b: [1, 2], op: "-", commonD: 8 },
  { a: [3, 8], b: [1, 4], op: "+", commonD: 8 },
  { a: [2, 3], b: [1, 6], op: "-", commonD: 6 },
  { a: [2, 5], b: [1, 5], op: "+", commonD: 5 }
];

export const generateOperationsSession = (count = 4): QuizChallenge[] => {
  const picked = pickUnique(OPERATIONS_BANK, count);

  return picked.map((item, idx) => {
    const fA = fraction(item.a[0], item.a[1]);
    const fB = fraction(item.b[0], item.b[1]);
    const res = item.op === "+" ? addFractions(fA, fB) : subtractFractions(fA, fB);
    const expected = formatFraction(res);

    const aScaled = (item.a[0] * item.commonD) / item.a[1];
    const bScaled = (item.b[0] * item.commonD) / item.b[1];
    const resScaled = item.op === "+" ? aScaled + bScaled : aScaled - bScaled;

    const candidates = [
      formatFraction(fraction(Math.max(1, item.a[0] + item.b[0]), item.a[1] + item.b[1])),
      formatFraction(fraction(Math.max(1, resScaled + 1), item.commonD)),
      formatFraction(fraction(Math.max(1, resScaled > 1 ? resScaled - 1 : 1), item.commonD)),
      "1/2",
      "5/6",
      "1/4"
    ];
    const distractors: string[] = [];
    for (const c of candidates) {
      if (c !== expected && !distractors.includes(c) && distractors.length < 2) {
        distractors.push(c);
      }
    }

    const leftLabel =
      item.a[1] === item.commonD
        ? `${item.a[0]}/${item.a[1]}`
        : `${item.a[0]}/${item.a[1]} = ${aScaled}/${item.commonD}`;
    const rightLabel =
      item.b[1] === item.commonD
        ? `${item.b[0]}/${item.b[1]}`
        : `${item.b[0]}/${item.b[1]} = ${bScaled}/${item.commonD}`;

    return {
      id: `op-${item.a[0]}-${item.a[1]}-${item.op}-${item.b[0]}-${item.b[1]}-${Date.now()}-${idx}`,
      prompt: `Calcule ${item.a[0]}/${item.a[1]} ${item.op === "+" ? "+" : "−"} ${item.b[0]}/${item.b[1]}`,
      instruction: "Use as barras divididas em partes iguais para descobrir o resultado!",
      options: shuffle([expected, ...distractors]),
      expected,
      explanation: `${leftLabel} ${item.op} ${rightLabel} dá ${resScaled}/${item.commonD}${equivalent(fraction(resScaled, item.commonD), res) && res.denominator !== item.commonD ? ` (que simplifica para ${expected})` : ""}.`,
      hint: `Todas as barras foram divididas em ${item.commonD} partes iguais. Conte o resultado!`,
      visualData: {
        leftLabel,
        leftFrac: { n: aScaled, d: item.commonD },
        rightLabel,
        rightFrac: { n: bScaled, d: item.commonD },
        opSign: item.op,
        resultFrac: { n: resScaled, d: item.commonD }
      }
    };
  });
};

export type ArcadeQuestion = {
  id: string;
  prompt: string;
  pizza?: { n: number; d: number };
  options: string[];
  answer: string;
};

export const generateArcadeSession = (count = 7): ArcadeQuestion[] => {
  const sliceChoices: Array<[number, number]> = [
    [3, 4],
    [2, 5],
    [5, 8],
    [1, 3],
    [3, 6],
    [4, 5],
    [5, 6],
    [3, 8]
  ];
  const sliceQuestions: ArcadeQuestion[] = pickUnique(sliceChoices, 3).map(([n, d], idx) => {
    const correct = `${n}/${d}`;
    const alt1 = `${Math.max(1, d - n)}/${d}`;
    const alt2 = `${n}/${d === 8 ? 6 : d + 1}`;
    const opts = Array.from(new Set([correct, alt1, alt2]));
    while (opts.length < 3) opts.push("1/2");
    return {
      id: `arc-slice-${n}-${d}-${idx}`,
      prompt: "Que fração esta pizza mostra?",
      pizza: { n, d },
      options: shuffle(opts.slice(0, 3)),
      answer: correct
    };
  });

  const decQuestions: ArcadeQuestion[] = generateDecimalSession(2).map((q) => ({
    id: `arc-${q.id}`,
    prompt: q.prompt,
    pizza: { n: q.visualData.refNumerator ?? 1, d: q.visualData.refDenominator ?? 4 },
    options: q.options,
    answer: q.expected
  }));

  const cmpQuestions: ArcadeQuestion[] = generateCompareSession(2).map((c) => {
    const leftStr = `${c.left.numerator}/${c.left.denominator}`;
    const rightStr = `${c.right.numerator}/${c.right.denominator}`;
    const answer = c.winner === "tie" ? "São iguais" : c.winner === "left" ? leftStr : rightStr;
    return {
      id: `arc-${c.id}`,
      prompt: `Qual fração vale mais: ${leftStr} ou ${rightStr}?`,
      options: shuffle([leftStr, rightStr, "São iguais"]),
      answer
    };
  });

  const qtyQuestions: ArcadeQuestion[] = generateQuantitySession(2).map((q) => {
    const correct = fractionOfQuantity(fraction(q.numerator, q.denominator), q.totalItems);
    const opt1 = Math.max(1, correct - 2);
    const opt2 = correct + 3;
    return {
      id: `arc-${q.id}`,
      prompt: `Quanto é ${q.numerator}/${q.denominator} de ${q.totalItems}?`,
      options: shuffle([String(correct), String(opt1), String(opt2)]),
      answer: String(correct)
    };
  });

  return pickUnique([...sliceQuestions, ...decQuestions, ...cmpQuestions, ...qtyQuestions], count);
};
