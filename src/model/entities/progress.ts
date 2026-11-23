export type HatId = "none" | "chef" | "crown" | "stars" | "cap";
export type ToppingId = "pepperoni" | "mushroom" | "olive" | "berry";
export type TitleId = "aprendiz" | "velocista" | "cortador" | "mestre" | "lenda";
export type ItemRarity = "comum" | "raro" | "epico" | "lendario";
export type VoiceStyle = "fatinha" | "chef" | "turbo" | "narrador";

export type Attempt = {
  questionId: string;
  worldId: string;
  correct: boolean;
  answer: string;
  timestamp: string;
};

export type PlayerProfile = {
  chefName: string;
  xp: number;
  coins: number;
  streak: number;
  bestStreak: number;
  soundEnabled: boolean;
  voiceStyle: VoiceStyle;
  equippedHat: HatId;
  equippedTopping: ToppingId;
  equippedTitle: TitleId;
  unlockedHats: HatId[];
  unlockedToppings: ToppingId[];
  unlockedTitles: TitleId[];
  worldStars: Record<string, number>;
  achievements: string[];
  arcadeHighScore: number;
};

export const DEFAULT_PROFILE: PlayerProfile = {
  chefName: "Chef",
  xp: 0,
  coins: 30,
  streak: 0,
  bestStreak: 0,
  soundEnabled: true,
  voiceStyle: "fatinha",
  equippedHat: "chef",
  equippedTopping: "pepperoni",
  equippedTitle: "aprendiz",
  unlockedHats: ["none", "chef"],
  unlockedToppings: ["pepperoni"],
  unlockedTitles: ["aprendiz"],
  worldStars: {},
  achievements: [],
  arcadeHighScore: 0
};
