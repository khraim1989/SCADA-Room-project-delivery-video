// Renders every static design to output/photos (PNG) + PDFs (poster, carousel).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, serve, openStage, launch } from './lib.mjs';

const only = process.argv.slice(2);
const OUT = path.join(ROOT, 'output/photos');
fs.mkdirSync(OUT, { recursive: true });
const { srv, base } = await serve();
const browser = await launch();
let page = await openStage(base, browser);
const list = await page.evaluate(() => window.KIT.list());
const carousel = [];

for (const d of list) {
  if (only.length && !only.some((o) => d.id.includes(o))) continue;
  if (d.scale !== 1) { await page.close(); page = await openStage(base, browser, { w: d.w, h: d.h, scale: d.scale }); }
  else await page.setViewportSize({ width: d.w, height: d.h });
  await page.evaluate((id) => window.KIT.design(id), d.id);
  const file = path.join(OUT, `sws-scada-${d.id}.png`);
  await page.locator('#stage').screenshot({ path: file, omitBackground: d.transparent });
  console.log('✓', path.relative(ROOT, file), `${d.w * d.scale}×${d.h * d.scale}`);
  if (d.pdf) {
    await page.emulateMedia({ media: 'screen' });
    await page.addStyleTag({ content: `@page{size:${d.w}px ${d.h}px;margin:0} body{background:#0F1113}` });
    const pdf = path.join(OUT, `sws-scada-${d.id}.pdf`);
    await page.pdf({ path: pdf, width: `${d.w}px`, height: `${d.h}px`, printBackground: true, pageRanges: '1' });
    console.log('✓', path.relative(ROOT, pdf));
  }
  if (d.carousel) carousel.push(file);
  if (d.scale !== 1) { await page.close(); page = await openStage(base, browser); }
}

// Carousel → single PDF (LinkedIn "document" post), built from the rendered PNGs.
if (carousel.length) {
  const imgs = carousel.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}">`).join('');
  const p = await browser.newPage();
  await p.setContent(`<style>@page{size:1080px 1350px;margin:0}body{margin:0}img{display:block;width:1080px;height:1350px;page-break-after:always}</style>${imgs}`);
  const pdf = path.join(OUT, 'sws-scada-linkedin-carousel.pdf');
  await p.pdf({ path: pdf, width: '1080px', height: '1350px', printBackground: true });
  console.log('✓', path.relative(ROOT, pdf), `${carousel.length} pages`);
}
await browser.close(); srv.close();
