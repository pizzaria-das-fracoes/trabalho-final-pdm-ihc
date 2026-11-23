import type { HatId, ItemRarity, PlayerProfile, TitleId, ToppingId } from "@/model/entities/progress";

export type WorldId =
  | "pizza"
  | "compare"
  | "equivalent"
  | "number-line"
  | "decimal"
  | "quantity"
  | "operations";

export type GameWorld = {
  id: WorldId;
  order: number;
  title: string;
  subtitle: string;
  route: string;
  category: string;
  numerator: number;
  denominator: number;
  accent: "action" | "success" | "gold" | "magic";
};

export const GAME_WORLDS: GameWorld[] = [
  {
    id: "pizza",
    order: 1,
    title: "Monte a Pizza",
    subtitle: "Corte e pinte as fatias do pedido do cliente.",
    route: "/pizza",
    category: "Fornada Inicial",
    numerator: 3,
    denominator: 4,
    accent: "action"
  },
  {
    id: "compare",
    order: 2,
    title: "Duelo de Pizzas",
    subtitle: "Descubra qual bandeja tem mais pizza.",
    route: "/compare",
    category: "Arena",
    numerator: 3,
    denominator: 4,
    accent: "success"
  },
  {
    id: "equivalent",
    order: 3,
    title: "Fornada Equivalente",
    subtitle: "Encontre pizzas do mesmo tamanho cortadas diferente.",
    route: "/equivalent",
    category: "Truques",
    numerator: 2,
    denominator: 3,
    accent: "magic"
  },
  {
    id: "number-line",
    order: 4,
    title: "Pista do Entregador",
    subtitle: "Estacione a motoca no ponto exato da avenida.",
    route: "/number-line",
    category: "Corrida",
    numerator: 3,
    denominator: 4,
    accent: "gold"
  },
  {
    id: "decimal",
    order: 5,
    title: "Fábrica de Decimais",
    subtitle: "Transforme fatias em números com vírgula.",
    route: "/decimal",
    category: "Laboratório",
    numerator: 1,
    denominator: 4,
    accent: "magic"
  },
  {
    id: "quantity",
    order: 6,
    title: "Festa dos Pedidos",
    subtitle: "Separe bandejas de docinhos e mini-pizzas.",
    route: "/quantity",
    category: "Banquete",
    numerator: 3,
    denominator: 4,
    accent: "action"
  },
  {
    id: "operations",
    order: 7,
    title: "Receita Secreta",
    subtitle: "Junte e tire porções para fechar a massa.",
    route: "/operations",
    category: "Mestre Chef",
    numerator: 5,
    denominator: 6,
    accent: "success"
  }
];

export type PizzaOrderChallenge = {
  id: string;
  customer: string;
  targetNumerator: number;
  targetDenominator: number;
  initialDenominator: number;
  allowCutChange: boolean;
  hint: string;
};

export const PIZZA_CHALLENGES: PizzaOrderChallenge[] = [
  {
    id: "pizza-3-4",
    customer: "Pedido do Leo: quero 3 quartos da pizza!",
    targetNumerator: 3,
    targetDenominator: 4,
    initialDenominator: 4,
    allowCutChange: false,
    hint: "A pizza já está cortada em 4 partes. Pinte 3 fatias!"
  },
  {
    id: "pizza-2-5",
    customer: "Pedido da Maya: capriche em 2 quintos!",
    targetNumerator: 2,
    targetDenominator: 5,
    initialDenominator: 5,
    allowCutChange: false,
    hint: "São 5 fatias iguais no prato. Escolha 2 delas."
  },
  {
    id: "pizza-5-8",
    customer: "Pedido do Chef: corte em 8 e pinte 5 oitavos!",
    targetNumerator: 5,
    targetDenominator: 8,
    initialDenominator: 4,
    allowCutChange: true,
    hint: "Use os botões + e - para cortar a pizza em 8 fatias e pinte 5."
  },
  {
    id: "pizza-1-2-equiv",
    customer: "Pedido Especial: faça exatamente metade da pizza!",
    targetNumerator: 1,
    targetDenominator: 2,
    initialDenominator: 6,
    allowCutChange: true,
    hint: "Metade de 6 fatias são 3 fatias, ou corte em 2 e pinte 1!"
  }
];

export type CompareChallenge = {
  id: string;
  left: { numerator: number; denominator: number };
  right: { numerator: number; denominator: number };
  winner: "left" | "right" | "tie";
  explanation: string;
  hint: string;
};

export const COMPARE_CHALLENGES: CompareChallenge[] = [
  {
    id: "compare-3-4-2-3",
    left: { numerator: 3, denominator: 4 },
    right: { numerator: 2, denominator: 3 },
    winner: "left",
    explanation: "3/4 ocupa mais espaço no prato que 2/3 (9/12 contra 8/12)!",
    hint: "Olhe para o espaço em branco que falta para completar cada pizza."
  },
  {
    id: "compare-1-2-5-8",
    left: { numerator: 1, denominator: 2 },
    right: { numerator: 5, denominator: 8 },
    winner: "right",
    explanation: "Metade seria 4/8, então 5/8 passa da metade!",
    hint: "Imagine a Pizza A cortada em 8 pedaços: metade seria 4/8."
  },
  {
    id: "compare-2-3-4-6",
    left: { numerator: 2, denominator: 3 },
    right: { numerator: 4, denominator: 6 },
    winner: "tie",
    explanation: "Empate delicioso! 2/3 e 4/6 são exatamente a mesma quantidade.",
    hint: "Compare a área pintada das duas pizzas com calma."
  },
  {
    id: "compare-4-5-3-4",
    left: { numerator: 4, denominator: 5 },
    right: { numerator: 3, denominator: 4 },
    winner: "left",
    explanation: "4/5 falta apenas 1/5 (menor pedaço) para fechar a pizza inteira!",
    hint: "Falta 1 fatia em cada uma, mas qual fatia faltando é menor?"
  }
];

export type QuizChallenge = {
  id: string;
  prompt: string;
  instruction: string;
  options: string[];
  expected: string;
  explanation: string;
  hint: string;
  fractionOptions?: Record<string, { numerator: number; denominator: number }>;
  visualData: {
    refNumerator?: number;
    refDenominator?: number;
    decimalLabel?: string;
    totalItems?: number;
    groups?: number;
    selectedGroups?: number;
    leftLabel?: string;
    leftFrac?: { n: number; d: number };
    rightLabel?: string;
    rightFrac?: { n: number; d: number };
    opSign?: "+" | "-";
    resultFrac?: { n: number; d: number };
  };
};

export const EQUIVALENT_CHALLENGES: QuizChallenge[] = [
  {
    id: "eq-2-3",
    prompt: "Qual pizza tem a mesma quantidade que 2/3?",
    instruction: "Encontre a fatia disfarçada com outro corte.",
    options: ["3/5", "4/6", "2/5"],
    expected: "4/6",
    explanation: "Cortar cada terço ao meio transforma 2/3 em 4/6!",
    hint: "Multiplique o número de cima e o de baixo por 2.",
    fractionOptions: {
      "3/5": { numerator: 3, denominator: 5 },
      "4/6": { numerator: 4, denominator: 6 },
      "2/5": { numerator: 2, denominator: 5 }
    },
    visualData: { refNumerator: 2, refDenominator: 3 }
  },
  {
    id: "eq-1-2",
    prompt: "Qual opção mostra exatamente metade da pizza?",
    instruction: "Escolha a pizza com metade coberta.",
    options: ["3/6", "2/5", "3/8"],
    expected: "3/6",
    explanation: "3 de 6 fatias é exatamente a metade!",
    hint: "O número de cima precisa ser metade do número de baixo.",
    fractionOptions: {
      "3/6": { numerator: 3, denominator: 6 },
      "2/5": { numerator: 2, denominator: 5 },
      "3/8": { numerator: 3, denominator: 8 }
    },
    visualData: { refNumerator: 1, refDenominator: 2 }
  },
  {
    id: "eq-3-4",
    prompt: "Qual pizza equivale a 3/4?",
    instruction: "Dobre os cortes na cabeça para descobrir!",
    options: ["5/8", "6/8", "4/6"],
    expected: "6/8",
    explanation: "3/4 dobrando os cortes vira 6/8!",
    hint: "Se cortar cada uma das 4 fatias ao meio, ficam 8 fatias no total.",
    fractionOptions: {
      "5/8": { numerator: 5, denominator: 8 },
      "6/8": { numerator: 6, denominator: 8 },
      "4/6": { numerator: 4, denominator: 6 }
    },
    visualData: { refNumerator: 3, refDenominator: 4 }
  }
];

export const DECIMAL_CHALLENGES: QuizChallenge[] = [
  {
    id: "dec-1-4",
    prompt: "Quanto vale 1/4 no medidor digital?",
    instruction: "Pense em 1 inteiro dividido em 4 partes.",
    options: ["0,2", "0,25", "0,4"],
    expected: "0,25",
    explanation: "1 dividido por 4 dá 0,25 — como 25 centavos de 1 real!",
    hint: "Metade é 0,50. A metade da metade é 0,25.",
    visualData: { refNumerator: 1, refDenominator: 4, decimalLabel: "?" }
  },
  {
    id: "dec-1-2",
    prompt: "Qual número com vírgula representa metade (1/2)?",
    instruction: "Escolha o valor que fica bem no meio entre 0 e 1.",
    options: ["0,5", "0,2", "1,2"],
    expected: "0,5",
    explanation: "1/2 é 0,5 — metade de 1 inteiro!",
    hint: "Divida 10 ao meio e pense em décimos: cinco décimos.",
    visualData: { refNumerator: 1, refDenominator: 2, decimalLabel: "?" }
  },
  {
    id: "dec-3-4",
    prompt: "Qual decimal equivale a 3/4 de pizza?",
    instruction: "Junte três pedaços de 0,25!",
    options: ["0,34", "0,75", "0,6"],
    expected: "0,75",
    explanation: "3 vezes 0,25 dá 0,75!",
    hint: "0,25 + 0,25 + 0,25 = ?",
    visualData: { refNumerator: 3, refDenominator: 4, decimalLabel: "?" }
  },
  {
    id: "dec-1-5",
    prompt: "E 1/5 de pizza vale quanto em decimal?",
    instruction: "Divida 1 inteiro em 5 partes iguais.",
    options: ["0,15", "0,2", "0,5"],
    expected: "0,2",
    explanation: "1 dividido por 5 é 0,2 (dois décimos)!",
    hint: "5 moedas de 20 centavos formam 1 real.",
    visualData: { refNumerator: 1, refDenominator: 5, decimalLabel: "?" }
  }
];

export const OPERATIONS_CHALLENGES: QuizChallenge[] = [
  {
    id: "op-half-third",
    prompt: "Quanto dá 1/2 + 1/3?",
    instruction: "Transforme tudo em sextos na barra mágica!",
    options: ["2/5", "5/6", "1/6"],
    expected: "5/6",
    explanation: "1/2 = 3/6 e 1/3 = 2/6. Somando os sextos dá 5/6!",
    hint: "Conte quantos quadradinhos estão pintados na soma das duas barras.",
    visualData: {
      leftLabel: "1/2 = 3/6",
      leftFrac: { n: 3, d: 6 },
      rightLabel: "1/3 = 2/6",
      rightFrac: { n: 2, d: 6 },
      opSign: "+",
      resultFrac: { n: 5, d: 6 }
    }
  },
  {
    id: "op-3-4-minus-1-2",
    prompt: "Quanto sobra em 3/4 − 1/2?",
    instruction: "Tire metade de três quartos!",
    options: ["1/4", "2/2", "1/2"],
    expected: "1/4",
    explanation: "1/2 é o mesmo que 2/4. Tirando 2/4 de 3/4 sobra 1/4!",
    hint: "Pense em 3 fatias de 4 e coma 2 delas.",
    visualData: {
      leftLabel: "3/4",
      leftFrac: { n: 3, d: 4 },
      rightLabel: "1/2 = 2/4",
      rightFrac: { n: 2, d: 4 },
      opSign: "-",
      resultFrac: { n: 1, d: 4 }
    }
  },
  {
    id: "op-1-3-plus-1-6",
    prompt: "Calcule 1/3 + 1/6",
    instruction: "Junte um terço com um sexto.",
    options: ["2/9", "1/2", "1/3"],
    expected: "1/2",
    explanation: "1/3 é igual a 2/6. Somando com 1/6 dá 3/6, que é metade (1/2)!",
    hint: "Transforme 1/3 em 2/6 e some mais 1/6.",
    visualData: {
      leftLabel: "1/3 = 2/6",
      leftFrac: { n: 2, d: 6 },
      rightLabel: "1/6",
      rightFrac: { n: 1, d: 6 },
      opSign: "+",
      resultFrac: { n: 3, d: 6 }
    }
  }
];

export type NumberLineChallenge = {
  id: string;
  label: string;
  numerator: number;
  denominator: number;
  maxValue: number;
  stepDenominator: number;
  hint: string;
};

export const NUMBER_LINE_CHALLENGES: NumberLineChallenge[] = [
  {
    id: "nl-1-2",
    label: "Estacione a motoca em 1/2",
    numerator: 1,
    denominator: 2,
    maxValue: 2,
    stepDenominator: 4,
    hint: "1/2 fica exatamente no meio entre 0 e 1!"
  },
  {
    id: "nl-3-2",
    label: "Estacione a motoca em 3/2",
    numerator: 3,
    denominator: 2,
    maxValue: 2,
    stepDenominator: 4,
    hint: "3/2 é uma pizza inteira e mais meia pizza (1,5)!"
  },
  {
    id: "nl-3-4",
    label: "Estacione a motoca em 3/4",
    numerator: 3,
    denominator: 4,
    maxValue: 2,
    stepDenominator: 4,
    hint: "Conte 3 pulinhos de 1/4 a partir do zero!"
  },
  {
    id: "nl-5-4",
    label: "Estacione a motoca em 5/4",
    numerator: 5,
    denominator: 4,
    maxValue: 2,
    stepDenominator: 4,
    hint: "4/4 já é 1 inteiro. Dê mais 1 pulinho de 1/4 depois do 1!"
  }
];

export type QuantityChallenge = {
  id: string;
  prompt: string;
  numerator: number;
  denominator: number;
  totalItems: number;
  itemName: string;
  hint: string;
};

export const QUANTITY_CHALLENGES: QuantityChallenge[] = [
  {
    id: "qty-3-4-20",
    prompt: "Separe 3/4 de 20 mini-pizzas!",
    numerator: 3,
    denominator: 4,
    totalItems: 20,
    itemName: "mini-pizzas",
    hint: "São 4 bandejas de 5. Selecione 3 bandejas!"
  },
  {
    id: "qty-2-3-12",
    prompt: "Separe 2/3 de 12 brigadeiros!",
    numerator: 2,
    denominator: 3,
    totalItems: 12,
    itemName: "brigadeiros",
    hint: "São 3 bandejas de 4. Selecione 2 bandejas!"
  },
  {
    id: "qty-1-2-14",
    prompt: "Separe 1/2 de 14 coxinhas!",
    numerator: 1,
    denominator: 2,
    totalItems: 14,
    itemName: "coxinhas",
    hint: "Divida em 2 bandejas iguais e escolha 1 bandeja!"
  },
  {
    id: "qty-3-5-15",
    prompt: "Separe 3/5 de 15 fatias doces!",
    numerator: 3,
    denominator: 5,
    totalItems: 15,
    itemName: "fatias doces",
    hint: "São 5 bandejas de 3. Selecione 3 bandejas!"
  }
];

export type ShopItem<T extends string> = {
  id: T;
  name: string;
  description: string;
  price: number;
  rarity: ItemRarity;
};

export const RARITY_META: Record<ItemRarity, { label: string }> = {
  comum: { label: "Comum" },
  raro: { label: "Raro" },
  epico: { label: "Épico" },
  lendario: { label: "Lendário" }
};

export const HAT_SHOP: ShopItem<HatId>[] = [
  { id: "chef", name: "Chapéu de Chef", description: "Clássico da pizzaria.", price: 0, rarity: "comum" },
  { id: "none", name: "Sem acessório", description: "Visual natural da fatia.", price: 0, rarity: "comum" },
  { id: "cap", name: "Boné Arcade", description: "Estilo entregador veloz.", price: 35, rarity: "raro" },
  { id: "stars", name: "Óculos Estrela", description: "Brilho de quem acerta de primeira.", price: 60, rarity: "epico" },
  { id: "crown", name: "Coroa de Queijo", description: "Para a realeza das frações!", price: 100, rarity: "lendario" }
];

export const TOPPING_SHOP: ShopItem<ToppingId>[] = [
  { id: "pepperoni", name: "Pepperoni Clássico", description: "Rodelas crocantes tradicionais.", price: 0, rarity: "comum" },
  { id: "mushroom", name: "Cogumelos Mágicos", description: "Sabores da floresta encantada.", price: 40, rarity: "raro" },
  { id: "olive", name: "Azeitonas Verdes", description: "Toque especial da casa.", price: 55, rarity: "epico" },
  { id: "berry", name: "Frutinhas Doces", description: "Pizza sobremesa colorida!", price: 85, rarity: "lendario" }
];

export const TITLE_SHOP: ShopItem<TitleId>[] = [
  { id: "aprendiz", name: "Aprendiz do Forno", description: "Todo grande pizzaiolo começa aqui.", price: 0, rarity: "comum" },
  { id: "velocista", name: "Entregador Relâmpago", description: "Para quem manda bem na velocidade.", price: 25, rarity: "raro" },
  { id: "cortador", name: "Cortador Preciso", description: "Domina metades, terços e oitavos.", price: 50, rarity: "raro" },
  { id: "mestre", name: "Mestre das Frações", description: "Respeitado em toda a pizzaria!", price: 80, rarity: "epico" },
  { id: "lenda", name: "Lenda do Queijo Dourado", description: "Título máximo da Pizzaria FatiaMática.", price: 130, rarity: "lendario" }
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  check: (profile: PlayerProfile, totalCorrect: number) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-slice",
    title: "Primeira Fornada",
    description: "Acerte seu primeiro desafio.",
    check: (_p, totalCorrect) => totalCorrect >= 1
  },
  {
    id: "combo-3",
    title: "Combo Quentinho",
    description: "Consiga 3 acertos seguidos sem errar.",
    check: (p) => p.bestStreak >= 3
  },
  {
    id: "combo-7",
    title: "Mestre Pizzaiolo",
    description: "Alcance uma sequência de 7 acertos!",
    check: (p) => p.bestStreak >= 7
  },
  {
    id: "star-collector",
    title: "Caçador de Estrelas",
    description: "Conquiste pelo menos 6 estrelas no mapa.",
    check: (p) => Object.values(p.worldStars).reduce((a, b) => a + b, 0) >= 6
  },
  {
    id: "fashion-chef",
    title: "Chef Estiloso",
    description: "Desbloqueie um novo item na oficina.",
    check: (p) => p.unlockedHats.length > 2 || p.unlockedToppings.length > 1 || p.unlockedTitles.length > 1
  },
  {
    id: "arcade-hero",
    title: "Raio da Pizzaria",
    description: "Marque 100 pontos no Duelo Relâmpago.",
    check: (p) => p.arcadeHighScore >= 100
  }
];

export type SandboxStripSpec = {
  id: string;
  n: number;
  d: number;
};

export type SandboxMission = {
  id: string;
  title: string;
  goal: string;
  hint: string;
  check: (trayA: SandboxStripSpec[], trayB: SandboxStripSpec[], totalA: { numerator: number; denominator: number }, totalB: { numerator: number; denominator: number }) => boolean;
};

export const SANDBOX_MISSIONS: SandboxMission[] = [
  {
    id: "lab-half-no-half",
    title: "Desafio 1: Metade Disfarçada",
    goal: "Monte exatamente 1/2 na Bandeja A sem usar o bloco de 1/2.",
    hint: "Tente juntar dois blocos de 1/4, ou 1/3 + 1/6!",
    check: (trayA, _trayB, totalA) =>
      trayA.length >= 2 &&
      !trayA.some((s) => s.d === 2) &&
      totalA.numerator * 2 === totalA.denominator
  },
  {
    id: "lab-whole-mix",
    title: "Desafio 2: Pizza Inteira Maluca",
    goal: "Complete 1 pizza inteira (1/1) na Bandeja A usando 3 tamanhos diferentes.",
    hint: "Experimente misturar 1/2 + 1/3 + 1/6!",
    check: (trayA, _trayB, totalA) =>
      new Set(trayA.map((s) => s.d)).size >= 3 &&
      totalA.numerator === totalA.denominator &&
      totalA.numerator > 0
  },
  {
    id: "lab-equal-trays",
    title: "Desafio 3: Balança Perfeita",
    goal: "Deixe a Bandeja A e a Bandeja B iguais (> 0), mas com cortes diferentes.",
    hint: "Coloque 1/2 na Bandeja A e dois de 1/4 na Bandeja B!",
    check: (trayA, trayB, totalA, totalB) => {
      if (trayA.length === 0 || trayB.length === 0) return false;
      if (totalA.numerator * totalB.denominator !== totalB.numerator * totalA.denominator) return false;
      const sigA = trayA.map((s) => s.d).sort().join(",");
      const sigB = trayB.map((s) => s.d).sort().join(",");
      return sigA !== sigB;
    }
  },
  {
    id: "lab-three-quarters",
    title: "Desafio 4: Três Quartos Secretos",
    goal: "Monte 3/4 na Bandeja A usando pelo menos um bloco de 1/8.",
    hint: "Coloque 1/2 e complete com blocos de 1/8 até dar 3/4!",
    check: (trayA, _trayB, totalA) =>
      trayA.some((s) => s.d === 8) && totalA.numerator * 4 === totalA.denominator * 3
  }
];

export const getLevelFromXp = (xp: number): { level: number; currentXp: number; nextLevelXp: number } => {
  const level = Math.floor(xp / 100) + 1;
  const currentXp = xp % 100;
  return { level, currentXp, nextLevelXp: 100 };
};
