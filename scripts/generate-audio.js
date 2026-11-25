#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

function writeWav(fileName, samples) {
  const bytesPerSample = BITS_PER_SAMPLE / 8;
  const blockAlign = CHANNELS * bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * bytesPerSample * CHANNELS;
  const chunkSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM
  buffer.writeUInt16LE(1, 20); // Audio format
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  fs.writeFileSync(fileName, buffer);
  console.log(`Gerado: ${fileName} (${samples.length} samples, ${(samples.length/SAMPLE_RATE).toFixed(3)}s)`);
}

function sine(freq, duration, sampleRate = SAMPLE_RATE) {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    samples[i] = Math.sin(2 * Math.PI * freq * i / sampleRate);
  }
  return samples;
}

function triangle(freq, duration, sampleRate = SAMPLE_RATE) {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);
  const period = sampleRate / freq;
  for (let i = 0; i < length; i++) {
    const phase = (i % period) / period;
    samples[i] = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
  }
  return samples;
}

function square(freq, duration, sampleRate = SAMPLE_RATE) {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);
  const period = sampleRate / freq;
  for (let i = 0; i < length; i++) {
    samples[i] = (i % period) < period / 2 ? 1 : -1;
  }
  return samples;
}

function envelope(samples, attack = 0.01, decay = 0.1, sustain = 0.3, release = 0.05) {
  const len = samples.length;
  const attackSamples = Math.floor(attack * SAMPLE_RATE);
  const decaySamples = Math.floor(decay * SAMPLE_RATE);
  const releaseSamples = Math.floor(release * SAMPLE_RATE);
  const sustainSamples = len - attackSamples - decaySamples - releaseSamples;

  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let env = 1;
    if (i < attackSamples) {
      env = i / attackSamples;
    } else if (i < attackSamples + decaySamples) {
      env = 1 - (1 - sustain) * ((i - attackSamples) / decaySamples);
    } else if (i < attackSamples + decaySamples + sustainSamples) {
      env = sustain;
    } else {
      env = sustain * (1 - (i - attackSamples - decaySamples - sustainSamples) / releaseSamples);
    }
    out[i] = samples[i] * env;
  }
  return out;
}

function freqRamp(freqStart, freqEnd, duration, sampleRate = SAMPLE_RATE) {
  const length = Math.floor(duration * sampleRate);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const freq = freqStart * Math.pow(freqEnd / freqStart, t / duration);
    samples[i] = Math.sin(2 * Math.PI * freq * t);
  }
  return samples;
}

function mix(...arrays) {
  const len = Math.max(...arrays.map(a => a.length));
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let sum = 0;
    for (const a of arrays) {
      if (i < a.length) sum += a[i];
    }
    out[i] = sum / Math.max(1, arrays.filter(a => i < a.length).length);
  }
  return out;
}

// Efeitos
const outDir = path.join(__dirname, '..', 'assets', 'audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// pop: quick sine pop 460->660 Hz
writeWav(path.join(outDir, 'pop.wav'), envelope(freqRamp(460, 660, 0.065), 0.005, 0.04, 0, 0.01));

// coin: two triangle tones 987.77 + 1318.51 Hz
const coin1 = envelope(triangle(987.77, 0.07), 0.005, 0.04, 0, 0.01);
const coin2 = envelope(triangle(1318.51, 0.14), 0.005, 0.04, 0, 0.01);
const coinFull = new Float32Array(coin1.length + coin2.length);
coinFull.set(coin1, 0);
coinFull.set(coin2, coin1.length);
writeWav(path.join(outDir, 'coin.wav'), coinFull);

// success: 4 triangle tones ascending
const s1 = envelope(triangle(523.25, 0.09), 0.005, 0.04, 0, 0.01);
const s2 = envelope(triangle(659.25, 0.09), 0.005, 0.04, 0, 0.01);
const s3 = envelope(triangle(783.99, 0.1), 0.005, 0.04, 0, 0.01);
const s4 = envelope(triangle(1046.5, 0.18), 0.005, 0.04, 0, 0.01);
const successFull = new Float32Array(s1.length + s2.length + s3.length + s4.length);
successFull.set(s1, 0);
successFull.set(s2, s1.length);
successFull.set(s3, s1.length + s2.length);
successFull.set(s4, s1.length + s2.length + s3.length);
writeWav(path.join(outDir, 'success.wav'), successFull);

// oops: two descending triangle tones
const o1 = envelope(triangle(340, 0.14), 0.005, 0.05, 0, 0.02);
const o2 = envelope(triangle(230, 0.18), 0.005, 0.05, 0, 0.02);
const oopsFull = new Float32Array(o1.length + o2.length);
oopsFull.set(o1, 0);
oopsFull.set(o2, o1.length);
writeWav(path.join(outDir, 'oops.wav'), oopsFull);

// fanfare: 6 tones
const f1 = envelope(triangle(523.25, 0.09), 0.005, 0.03, 0, 0.01);
const f2 = envelope(triangle(659.25, 0.09), 0.005, 0.03, 0, 0.01);
const f3 = envelope(triangle(783.99, 0.1), 0.005, 0.03, 0, 0.01);
const f4 = envelope(triangle(1046.5, 0.13), 0.005, 0.03, 0, 0.01);
const f5 = envelope(triangle(783.99, 0.09), 0.005, 0.03, 0, 0.01);
const f6 = envelope(triangle(1046.5, 0.26), 0.005, 0.03, 0, 0.01);
const fanfareFull = new Float32Array(f1.length + f2.length + f3.length + f4.length + f5.length + f6.length);
fanfareFull.set(f1, 0);
fanfareFull.set(f2, f1.length);
fanfareFull.set(f3, f1.length + f2.length);
fanfareFull.set(f4, f1.length + f2.length + f3.length);
fanfareFull.set(f5, f1.length + f2.length + f3.length + f4.length);
fanfareFull.set(f6, f1.length + f2.length + f3.length + f4.length + f5.length);
writeWav(path.join(outDir, 'fanfare.wav'), fanfareFull);

console.log('Todos os 5 arquivos WAV gerados em assets/audio/');