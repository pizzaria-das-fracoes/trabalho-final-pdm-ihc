export type SoundEffect = "pop" | "coin" | "success" | "oops" | "fanfare";

export interface ISoundService {
  play(effect: SoundEffect, enabled: boolean): void;
}
