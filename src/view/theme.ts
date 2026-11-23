import type { GameWorld } from "@/model/entities/game";
import type { ItemRarity, ToppingId } from "@/model/entities/progress";

// Paleta primitiva interna — NÃO exportar
const palette = {
  cream50: "#FFFDF8",
  cream100: "#FFF9F0",
  cream200: "#FFF8EE",
  cream300: "#F8F1E7",
  warm50: "#FFF5E8",
  warm75: "#FFF7ED",
  warm100: "#FBEAD2",
  warm200: "#F5E1C8",
  warm300: "#EAD0B0",
  warm400: "#E4CBB0",
  warm450: "#E5D1BA",
  warm500: "#E7DACB",
  warm550: "#D6C4B0",
  warm600: "#D6C2AA",
  warm650: "#D4BFA8",
  warm700: "#E7D5C0",
  brown400: "#A6866D",
  brown450: "#98806C",
  brown600: "#6A4F3E",
  brown800: "#432E24",
  brown900: "#2C1D16",
  brown925: "#261911",
  brown950: "#1B110C",
  orange100: "#FFEDD5",
  orange300: "#FDBA74",
  orange500: "#EA580C",
  orange600: "#E04F16",
  orange700: "#C4400E",
  orange800: "#A63308",
  orange900: "#9A3412",
  orange950: "#7C2D12",
  green50: "#F0FDF4",
  green100: "#DCFCE7",
  green300: "#86EFAC",
  green400: "#4ADE80",
  green500: "#22C55E",
  green600: "#16A34A",
  green700: "#15803D",
  green900: "#14532D",
  amber100: "#FEF3C7",
  amber200: "#FDE68A",
  amber250: "#FEF08A",
  amber300: "#FCD34D",
  amber350: "#FDE047",
  amber400: "#FBBF24",
  amber420: "#FACC15",
  amber450: "#F5B041",
  amber500: "#F59E0B",
  amber550: "#E59838",
  amber600: "#D97706",
  amber700: "#C87414",
  amber900: "#78350F",
  indigo50: "#EEF2FF",
  indigo100: "#E0E7FF",
  indigo200: "#C7D2FE",
  indigo300: "#A5B4FC",
  indigo600: "#4F46E5",
  indigo800: "#3730A3",
  indigo900: "#312E81",
  red50: "#FEF2F2",
  red100: "#FEE2E2",
  red300: "#FCA5A5",
  red500: "#EF4444",
  red600: "#DC2626",
  red700: "#B91C1C",
  red800: "#991B1B",
  pink200: "#FBCFE8",
  pink400: "#F472B6",
  emerald400: "#34D399",
  white: "#FFFFFF",
  transparent: "transparent",
  scrimLight: "rgba(0,0,0,0.28)",
  scrimInk: "rgba(38,25,17,0.3)"
} as const;

export const theme = {
  color: {
    canvas: palette.warm100,
    surface: palette.cream50,
    surfaceLow: palette.warm50,
    surfaceMid: palette.warm200,
    surfaceHigh: palette.warm300,
    onSurface: palette.brown925,
    onSurfaceMuted: palette.brown600,
    outline: palette.brown400,
    outlineVariant: palette.warm400,

    hudBg: palette.brown900,
    hudBorder: palette.brown950,
    hudButton: palette.brown800,
    hudText: palette.cream200,
    hudMuted: palette.warm700,
    hudGold: palette.amber400,
    hudInactive: palette.warm650,

    action: palette.orange600,
    actionPressed: palette.orange700,
    actionEdge: palette.orange800,
    actionBorderSoft: palette.orange300,
    onAction: palette.white,

    success: palette.green600,
    successEdge: palette.green700,
    successSoft: palette.green100,
    successSoftTint: palette.green50,
    successBorderSoft: palette.green300,
    successInk: palette.green900,
    onSuccess: palette.white,

    gold: palette.amber500,
    goldEdge: palette.amber600,
    goldSoft: palette.amber100,
    goldBorderSoft: palette.amber300,
    goldInk: palette.amber900,

    magic: palette.indigo600,
    magicEdge: palette.indigo800,
    magicSoft: palette.indigo100,
    magicSurfaceTint: palette.indigo50,
    magicBorderTint: palette.indigo200,
    magicBorderSoft: palette.indigo300,
    magicInk: palette.indigo900,
    onMagic: palette.white,

    error: palette.red600,
    errorEdge: palette.red800,
    errorSoft: palette.red100,
    errorSoftTint: palette.red50,
    errorBorderSoft: palette.red300,
    onError: palette.white,

    accentSoft: palette.orange100,
    accentWarmBg: palette.warm75,
    onAccentSoft: palette.orange900,
    accentDeepEdge: palette.orange950,

    disabledBg: palette.warm450,
    disabledLabel: palette.brown450,
    roadNeutral: palette.warm550,
    white: palette.white,
    transparent: palette.transparent,
    segmentedBorder: palette.scrimLight,
    rulerMidline: palette.scrimInk
  },
  font: {
    display: "Fredoka_700Bold",
    displaySemi: "Fredoka_600SemiBold",
    body: "Nunito_400Regular",
    bodyBold: "Nunito_700Bold",
    bodyExtraBold: "Nunito_800ExtraBold"
  },
  space: {
    none: 0,
    hair: 1,
    xxs: 2,
    tiny: 3,
    xs: 4,
    xsPlus: 5,
    sm: 6,
    smPlus: 7,
    md: 8,
    mdPlus: 9,
    base: 10,
    basePlus: 11,
    lg: 12,
    lgPlus: 14,
    xl: 16,
    xlPlus: 18,
    xxl: 20,
    xxxl: 24,
    xxxxl: 32
  },
  shape: { sm: 8, md: 14, lg: 20, xl: 24, full: 9999 },
  touchTarget: 48,
  pizza: {
    size: 176
  }
} as const;

export const accentColors: Record<
  GameWorld["accent"],
  { border: string; bg: string; edge: string; text: string }
> = {
  action: {
    border: palette.orange300,
    bg: palette.orange600,
    edge: palette.orange800,
    text: palette.white
  },
  success: {
    border: palette.green300,
    bg: palette.green600,
    edge: palette.green700,
    text: palette.white
  },
  magic: {
    border: palette.indigo300,
    bg: palette.indigo600,
    edge: palette.indigo800,
    text: palette.white
  },
  gold: {
    border: palette.amber300,
    bg: palette.amber500,
    edge: palette.amber600,
    text: palette.brown925
  }
};

export const rarityColors: Record<ItemRarity, { border: string; ink: string }> = {
  comum: { border: palette.green300, ink: palette.green900 },
  raro: { border: palette.indigo300, ink: palette.indigo900 },
  epico: { border: palette.orange300, ink: palette.orange900 },
  lendario: { border: palette.amber500, ink: palette.amber900 }
};

export const sandboxBlockPalette: Array<{
  d: number;
  bg: string;
  edge: string;
  text: string;
  label: string;
}> = [
  { d: 2, bg: palette.orange600, edge: palette.orange800, text: palette.white, label: "1/2" },
  { d: 3, bg: palette.green600, edge: palette.green700, text: palette.white, label: "1/3" },
  { d: 4, bg: palette.indigo600, edge: palette.indigo800, text: palette.white, label: "1/4" },
  { d: 6, bg: palette.amber500, edge: palette.amber600, text: palette.brown925, label: "1/6" },
  { d: 8, bg: palette.red600, edge: palette.red800, text: palette.white, label: "1/8" },
  { d: 10, bg: palette.orange900, edge: palette.orange950, text: palette.white, label: "1/10" }
];

export const pizzaToppingColors: Record<ToppingId, { cheese: string; sauce: string }> = {
  pepperoni: { cheese: palette.amber350, sauce: palette.orange500 },
  mushroom: { cheese: palette.amber250, sauce: palette.amber600 },
  olive: { cheese: palette.amber350, sauce: palette.green600 },
  berry: { cheese: palette.pink200, sauce: palette.indigo600 }
};

export const pizzaSvgColors = {
  trayShadow: palette.warm600,
  crustOuter: palette.amber550,
  crustInner: palette.amber450,
  crustSpeck: palette.amber700,
  dough: palette.cream100,
  strokeInk: palette.brown925,
  oliveInk: palette.green900,
  berryPink: palette.pink400,
  berryGold: palette.amber420,
  berryMint: palette.emerald400,
  pepperoniRed: palette.red700,
  pepperoniHighlight: palette.red300,
  mushroomStem: palette.warm75,
  mushroomCap: palette.amber100,
  mushroomHerb: palette.green400,
  basilFill: palette.green500
} as const;

export const avatarSvgColors = {
  sliceCheese: palette.amber200,
  pepperoni: palette.orange600,
  crust: palette.amber600,
  eyeWhite: palette.white,
  mouthExcited: palette.red600,
  chefHatBrim: palette.cream300,
  crownGold: palette.amber500,
  capPrimary: palette.indigo600,
  capBrim: palette.indigo800,
  ink: palette.brown925
} as const;

export const heartSvgColors = {
  filled: palette.red500,
  empty: palette.warm500,
  shine: palette.red300,
  stroke: palette.brown925
} as const;
