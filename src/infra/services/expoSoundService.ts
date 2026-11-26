import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import type { ISoundService, SoundEffect } from "@/model/services/iSoundService";

let AudioModule: {
  createAudioPlayer: ((source: unknown, options?: {
    updateInterval?: number;
    keepAudioSessionActive?: boolean;
    preferredForwardBufferDuration?: number;
    allowsExternalPlayback?: boolean;
  }) => {
    play(): void;
    pause(): void;
    replace(source: unknown): void;
    remove(): void;
    set volume(value: number);
    get playing(): boolean;
    get isLoaded(): boolean;
  }) | null;
  setAudioModeAsync: (mode: {
    playsInSilentMode: boolean;
    interruptionMode: "doNotMix" | "doNotMixPersistent" | "duckOthers" | "mixWithOthers";
    interruptionModeAndroid?: "doNotMix" | "doNotMixPersistent" | "duckOthers" | "mixWithOthers";
    allowsRecording?: boolean;
    shouldPlayInBackground?: boolean;
    shouldRouteThroughEarpiece?: boolean;
    shouldRecordInBackground?: boolean;
  }) => Promise<void> | null;
} | null = null;

try {
  const mod = require("expo-audio");
  AudioModule = mod.default ?? mod;
} catch {
  AudioModule = null;
}

type WebAudioContext = {
  state: string;
  currentTime: number;
  destination: AudioNode;
  resume: () => Promise<void>;
  createOscillator: () => OscillatorNode;
  createGain: () => GainNode;
};

const popAsset = require("../../../assets/audio/pop.wav");
const coinAsset = require("../../../assets/audio/coin.wav");
const successAsset = require("../../../assets/audio/success.wav");
const oopsAsset = require("../../../assets/audio/oops.wav");
const fanfareAsset = require("../../../assets/audio/fanfare.wav");

const assetMap: Record<SoundEffect, unknown> = {
  pop: popAsset,
  coin: coinAsset,
  success: successAsset,
  oops: oopsAsset,
  fanfare: fanfareAsset,
};

type NativeAudioPlayer = {
  play(): void;
  pause(): void;
  replace(source: unknown): void;
  remove(): void;
  set volume(value: number);
  get playing(): boolean;
  get isLoaded(): boolean;
} & { seekTo?: (seconds: number) => Promise<void> };

export class ExpoSoundService implements ISoundService {
  private cachedCtx: WebAudioContext | null = null;
  private nativePlayers: Map<SoundEffect, NativeAudioPlayer> = new Map();
  private nativeVolume = 1;
  private audioModeInitialized = false;

  private getAudioContext(): WebAudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      const win = window as unknown as {
        AudioContext?: new () => WebAudioContext;
        webkitAudioContext?: new () => WebAudioContext;
      };
      const Ctor = win.AudioContext ?? win.webkitAudioContext;
      if (!Ctor) return null;
      if (!this.cachedCtx) {
        this.cachedCtx = new Ctor();
      }
      if (this.cachedCtx.state === "suspended") {
        void this.cachedCtx.resume().catch(() => {});
      }
      return this.cachedCtx;
    } catch {
      return null;
    }
  }

  private async initAudioMode(): Promise<void> {
    if (this.audioModeInitialized || !AudioModule?.setAudioModeAsync) return;
    try {
      await AudioModule.setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: "mixWithOthers",
        interruptionModeAndroid: "mixWithOthers",
      });
      this.audioModeInitialized = true;
    } catch (err) {
      // Temporary diagnostic logging: fail-safe keeps gameplay alive
      console.warn("expoSoundService: falha ao setar audio mode", err);
      this.audioModeInitialized = true;
    }
  }

  private getNativePlayer(effect: SoundEffect): NativeAudioPlayer | null {
    if (!AudioModule?.createAudioPlayer) return null;
    let player = this.nativePlayers.get(effect);
    if (!player) {
      const asset = assetMap[effect] as unknown;
      player = AudioModule.createAudioPlayer(asset, {
        updateInterval: 500,
        keepAudioSessionActive: false,
        preferredForwardBufferDuration: 0,
        allowsExternalPlayback: false,
      });
      player.volume = this.nativeVolume;
      this.nativePlayers.set(effect, player);
    }
    return player;
  }

  private async playNativePlayer(effect: SoundEffect): Promise<boolean> {
    const player = this.getNativePlayer(effect);
    if (!player) return false;
    try {
      player.volume = this.nativeVolume;
      await player.seekTo?.(0);
      player.play();
      return true;
    } catch (err) {
      // Temporary diagnostic logging: fail-safe keeps gameplay alive
      console.warn("expoSoundService: falha ao preparar player nativo", effect, err);
      return false;
    }
  }

  private playTone(
    freqStart: number,
    freqEnd: number,
    durationSec: number,
    type: OscillatorType = "sine",
    volume = 0.12,
    delaySec = 0
  ): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state !== "running") {
      void ctx.resume()
        .then(() => {
          if (ctx.state === "running") {
            this.playTone(freqStart, freqEnd, durationSec, type, volume, delaySec);
          }
        })
        .catch(() => {});
      return;
    }
    try {
      const start = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, start);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), start + durationSec);
      }

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + durationSec + 0.02);
    } catch {
      // Graceful no-op when audio synthesis fails
    }
  }

  private safeImpact(style: Haptics.ImpactFeedbackStyle): void {
    try {
      void Haptics.impactAsync(style).catch(() => {});
    } catch {
      // Graceful no-op when native haptics module is unavailable
    }
  }

  private safeNotification(type: Haptics.NotificationFeedbackType): void {
    try {
      void Haptics.notificationAsync(type).catch(() => {});
    } catch {
      // Graceful no-op when native haptics module is unavailable
    }
  }

  play(effect: SoundEffect, enabled: boolean): void {
    if (!enabled) return;

    if (Platform.OS !== "web" && AudioModule?.createAudioPlayer) {
      void this.playNativePlayer(effect);
      return;
    }

    if (effect === "pop") {
      this.safeImpact(Haptics.ImpactFeedbackStyle.Light);
      this.playTone(460, 660, 0.065, "sine", 0.11);
      return;
    }

    if (effect === "coin") {
      this.safeImpact(Haptics.ImpactFeedbackStyle.Medium);
      this.playTone(987.77, 987.77, 0.07, "triangle", 0.12, 0);
      this.playTone(1318.51, 1318.51, 0.14, "triangle", 0.13, 0.065);
      return;
    }

    if (effect === "success") {
      this.safeNotification(Haptics.NotificationFeedbackType.Success);
      this.playTone(523.25, 523.25, 0.09, "triangle", 0.12, 0);
      this.playTone(659.25, 659.25, 0.09, "triangle", 0.12, 0.075);
      this.playTone(783.99, 783.99, 0.1, "triangle", 0.13, 0.15);
      this.playTone(1046.5, 1046.5, 0.18, "sine", 0.14, 0.23);
      return;
    }

    if (effect === "oops") {
      this.safeNotification(Haptics.NotificationFeedbackType.Warning);
      this.playTone(340, 220, 0.14, "triangle", 0.11, 0);
      this.playTone(230, 165, 0.18, "triangle", 0.1, 0.11);
      return;
    }

    this.safeNotification(Haptics.NotificationFeedbackType.Success);
    this.safeImpact(Haptics.ImpactFeedbackStyle.Medium);
    this.playTone(523.25, 523.25, 0.09, "triangle", 0.13, 0);
    this.playTone(659.25, 659.25, 0.09, "triangle", 0.13, 0.09);
    this.playTone(783.99, 783.99, 0.1, "triangle", 0.13, 0.18);
    this.playTone(1046.5, 1046.5, 0.13, "sine", 0.15, 0.27);
    this.playTone(783.99, 783.99, 0.09, "triangle", 0.12, 0.41);
    this.playTone(1046.5, 1046.5, 0.26, "sine", 0.16, 0.5);
  }

  setNativeVolume(volume: number): void {
    this.nativeVolume = Math.max(0, Math.min(1, volume));
    for (const player of this.nativePlayers.values()) {
      try {
        player.volume = this.nativeVolume;
      } catch {}
    }
  }

  dispose(): void {
    for (const player of this.nativePlayers.values()) {
      try {
        player.remove();
      } catch {}
    }
    this.nativePlayers.clear();
  }
}