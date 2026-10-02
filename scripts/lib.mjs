// Shared helpers: static server + browser launcher.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

export function listPhotos() {
  const dir = path.join(ROOT, 'assets/photos');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort().map((f) => `assets/photos/${f}`);
}

export function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (u === '/__photos') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(listPhotos())); }
      const f = path.join(ROOT, path.normalize(u).replace(/^([/\\])+/, ''));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve({ srv, base: `http://127.0.0.1:${srv.address().port}` }));
  });
}

export async function openStage(base, browser, opts = {}) {
  const page = await browser.newPage({ viewport: { width: opts.w || 1920, height: opts.h || 1080 }, deviceScaleFactor: opts.scale || 1 });
  page.on('pageerror', (e) => console.error('[page]', e.message));
  await page.goto(`${base}/src/stage.html`);
  await page.waitForFunction(() => window.KIT_READY === true);
  return page;
}

export const launch = () => chromium.launch();
