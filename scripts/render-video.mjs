// Renders the motion-graphics films frame-by-frame and encodes MP4 (H.264 + AAC).
// Usage: node scripts/render-video.mjs [name...] [--preview]   (preview = stills only)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT, serve, openStage, launch } from './lib.mjs';
import { makeMusic } from './music.mjs';

const FPS = 30;
const FILMS = [
  { name: 'film-16x9', w: 1920, h: 1080, timeline: 'full' },
  { name: 'reel-9x16', w: 1080, h: 1920, timeline: 'short' },
  { name: 'feed-1x1', w: 1080, h: 1080, timeline: 'short' },
  { name: 'feed-4x5', w: 1080, h: 1350, timeline: 'short' },
  { name: 'logo-sting-16x9', w: 1920, h: 1080, timeline: 'sting' },
  { name: 'hvac-ad-16x9', w: 1920, h: 1080, timeline: 'hvac', dir: 'hvac-ads' },
  { name: 'hvac-ad-9x16', w: 1080, h: 1920, timeline: 'hvac', dir: 'hvac-ads' },
  { name: 'hvac-ad-1x1', w: 1080, h: 1080, timeline: 'hvac', dir: 'hvac-ads' },
];
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const only = args.filter((a) => !a.startsWith('--'));
const OUT = path.join(ROOT, 'output/video');
fs.mkdirSync(OUT, { recursive: true });

const { srv, base } = await serve();
const browser = await launch();

for (const f of FILMS) {
  if (only.length && !only.some((o) => f.name.includes(o))) continue;
  const page = await openStage(base, browser, { w: f.w, h: f.h });
  const info = await page.evaluate((o) => window.KIT.filmSetup(o), f);
  const frames = Math.round(info.total * FPS);
  console.log(`▶ ${f.name} ${f.w}×${f.h} ${info.total.toFixed(1)}s (${frames} frames)`);

  if (preview) {
    for (const [name, start, dur] of info.scenes) {
      const t = start + dur * .7;
      await page.evaluate((x) => window.KIT.seek(x), t);
      await page.locator('#stage').screenshot({ path: path.join(OUT, `preview-${f.name}-${name}.jpg`), type: 'jpeg', quality: 80 });
    }
    await page.close(); continue;
  }

  const wav = path.join(OUT, `.music-${f.name}.wav`);
  // impact on the logo reveal, and one landing on the outro
  const outro = info.scenes.find((s) => s[0] === 'outro');
  makeMusic(wav, info.total, { hits: [0.55, ...(outro ? [outro[1] + 0.1] : [])] });

  const outDir = f.dir ? path.join(ROOT, 'output', f.dir) : OUT;
  fs.mkdirSync(outDir, { recursive: true });
  const mp4 = path.join(outDir, f.dir ? `sws-${f.name}.mp4` : `sws-scada-${f.name}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', '-shortest', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg ' + c)) : r())));
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate((x) => window.KIT.seek(x), i / FPS);
    const buf = await page.locator('#stage').screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`  ${i}/${frames} ${((Date.now() - t0) / 1000).toFixed(0)}s\r`);
  }
  ff.stdin.end(); await done; fs.unlinkSync(wav);
  console.log(`✓ ${path.relative(ROOT, mp4)} (${((Date.now() - t0) / 1000).toFixed(0)}s render)`);
  await page.close();
}
await browser.close(); srv.close();
