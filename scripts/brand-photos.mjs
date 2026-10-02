// Brands real site photos: drop JPG/PNG files into assets/photos, run `npm run brand-photos`.
// Output: output/branded/<name>-16x9.jpg (1920×1080) and <name>-4x5.jpg (1080×1350) with SWS logo frame.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, listPhotos } from './lib.mjs';

const OUT = path.join(ROOT, 'output/branded');
const frames = { '16x9': [1920, 1080], '4x5': [1080, 1350] };
const photos = listPhotos();
if (!photos.length) { console.log('No photos in assets/photos — add site photos and run again.'); process.exit(0); }
for (const k of Object.keys(frames)) {
  const ov = path.join(ROOT, `output/photos/sws-scada-frame-overlay-${k}.png`);
  if (!fs.existsSync(ov)) { console.error(`Missing ${ov} — run \`npm run photos\` first.`); process.exit(1); }
}
fs.mkdirSync(OUT, { recursive: true });
for (const p of photos) {
  const name = path.basename(p).replace(/\.[^.]+$/, '');
  for (const [k, [w, h]] of Object.entries(frames)) {
    const out = path.join(OUT, `${name}-${k}.jpg`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(ROOT, p), '-i', path.join(ROOT, `output/photos/sws-scada-frame-overlay-${k}.png`),
      '-filter_complex', `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},eq=contrast=1.06:saturation=1.08[b];[b][1:v]overlay=0:0`,
      '-q:v', '2', out]);
    console.log('✓', path.relative(ROOT, out));
  }
}
