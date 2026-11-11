// Procedural, royalty-free corporate music bed → WAV. Deterministic.
import fs from 'node:fs';

export function makeMusic(file, dur, { bpm = 96, hits = [] } = {}) {
  const SR = 44100, N = Math.ceil(dur * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  const beat = 60 / bpm, bar = beat * 4;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // Am – F – C – G  (two bars each)
  const prog = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]];
  const bass = [45, 41, 36, 43];
  let seed = 7; const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; };
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ci = Math.floor(t / (bar * 2)) % 4, ct = t % (bar * 2);
    const env = Math.min(1, ct / 1.2) * Math.min(1, (bar * 2 - ct) / .4 + .35);
    let pad = 0;
    for (const m of prog[ci]) {
      const f = mtof(m);
      for (const [h, a] of [[1, 1], [2, .35], [3, .12]]) {
        pad += a * Math.sin(2 * Math.PI * f * h * t * 1.002) + a * Math.sin(2 * Math.PI * f * h * t * .998);
      }
    }
    pad *= .018 * env * (1 + .15 * Math.sin(2 * Math.PI * .25 * t));
    // bass pulse on 8ths
    const e8 = t % (beat / 2), bf = mtof(bass[ci]);
    const bs = .09 * Math.sin(2 * Math.PI * bf * t) * Math.exp(-e8 * 7) * Math.min(1, t / 3);
    // kick on beats after the intro
    const kb = t % beat, kStart = 4.2;
    const kick = t > kStart ? .32 * Math.sin(2 * Math.PI * (45 * kb + 160 * (1 - Math.exp(-kb * 30)) / 30)) * Math.exp(-kb * 9) : 0;
    // hat on off-beats
    const hb = (t + beat / 2) % beat;
    const hat = t > kStart ? .03 * noise() * Math.exp(-hb * 60) : 0;
    let x = pad + bs + kick;
    // impact hits (cinematic boom + noise swell)
    for (const h of hits) {
      const d = t - h;
      if (d > -1.2 && d < 0) x += .06 * noise() * Math.pow((d + 1.2) / 1.2, 3);
      if (d >= 0 && d < 3) x += .45 * Math.sin(2 * Math.PI * (38 * d + 40 * (1 - Math.exp(-d * 8)) / 8)) * Math.exp(-d * 2.2) + .1 * noise() * Math.exp(-d * 6);
    }
    // master fade
    const m = Math.min(1, t / 1.0) * Math.min(1, (dur - t) / 2.0);
    L[i] = (x + hat * .7) * m; R[i] = (x + hat * 1.3) * m;
  }
  // simple stereo reverb (feedback delays)
  for (const [ch, ds] of [[L, [1557, 1617, 1491]], [R, [1422, 1277, 1356]]]) {
    for (const d of ds) for (let i = d; i < N; i++) ch[i] += ch[i - d] * .28;
  }
  let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = .89 / peak;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32000), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32000), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}
