import type { ISoundService, SoundEffect } from "@/model/services/iSoundService";

export class MemorySoundService implements ISoundService {
  readonly played: SoundEffect[] = [];

  play(effect: SoundEffect, enabled: boolean): void {
    if (!enabled) return;
    this.played.push(effect);
  }
}
