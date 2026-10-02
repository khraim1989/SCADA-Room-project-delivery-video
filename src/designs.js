// Static designs (PNG/PDF). Each entry: { w, h, scale?, transparent?, pdf?, carousel?, render(ctx) → html }.
// Photos are referenced by role (project.config.json → photos). Missing roles fall back to vector illustrations.
import { controlRoom, deliveryTruck, frameBuild, blueprint, coatingBay } from './illustrations.js';

const art = {
  room: () => controlRoom({ t: 3.2, id: 'r' }),
  truck: () => deliveryTruck({ t: 1, p: .59, id: 't' }),
  frame: () => frameBuild({ t: 1.3, p: .9, id: 'f' }),
  print: () => blueprint({ t: 1.6, p: 1, id: 'b' }),
  coat: () => coatingBay({ t: 1, p: .62, id: 'c' }),
};
const FALLBACK = { hero: 'truck', loadoutNight: 'truck', loadoutNight2: 'truck', craneLift: 'truck', teamLift: 'frame', welding: 'frame', dbPanel: 'room', threeQuarter: 'truck', yardSide: 'truck' };

const src = (ctx, role) => (ctx.cfg.photos && ctx.cfg.photos[role] ? '../' + ctx.cfg.photos[role] : null);
function media(ctx, role, pos = '50% 50%') {
  const s = src(ctx, role);
  return s ? `<img src="${s}" style="object-position:${pos}">` : art[FALLBACK[role] || 'room']();
}
const bg = (ctx, role, pos, extra = '') => `<div class="layer bg" style="${extra}">${media(ctx, role, pos)}</div>`;

const logo = (ctx, h, dark = true, style = '') =>
  `<img class="logo" src="../${dark ? ctx.cfg.company.logos.onDark : ctx.cfg.company.logos.onLight}" style="height:${h}px;${style}">`;

function footer(ctx, u, h = 7) {
  const c = ctx.cfg.company;
  return `<div class="footer" style="height:${h * u}px;padding:0 ${4 * u}px;font-size:${1.9 * u}px">
    <span><b>${c.credential}</b></span><span>${c.email}</span></div>`;
}

function stats(ctx, u, cols, size = 1) {
  return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${2.6 * u}px">${ctx.cfg.project.stats.map((s) => `
    <div class="stat" style="padding:${.6 * u}px 0 ${.6 * u}px ${2.2 * u}px">
      <div class="v" style="font-size:${8 * u * size}px">${s.value}</div>
      <div class="l" style="font-size:${1.9 * u * size}px;margin-top:${1 * u}px">${s.label}</div></div>`).join('')}</div>`;
}

const chips = (ctx, u, n = 6, fs = 1.9) =>
  `<div style="display:flex;flex-wrap:wrap;gap:${1.1 * u}px">${ctx.cfg.project.scope.slice(0, n).map((s) => `<span class="chip" style="font-size:${fs * u}px">${s}</span>`).join('')}</div>`;

const title2 = (ctx) => { const [a, b] = ctx.cfg.project.titleLines; return `${a}<br><span class="accent">${b}</span>`; };

// ------------------------------------------------------------------
export const designs = {
  // 1. LinkedIn / Instagram square hero
  'post-square-hero': { w: 1200, h: 1200, render(ctx) {
    const u = 12, p = ctx.cfg.project;
    return `${bg(ctx, 'loadoutNight', '60% 40%')}<div class="layer shade-t"></div><div class="layer shade-b"></div>
      <div style="position:absolute;left:${5 * u}px;top:${4.5 * u}px">${logo(ctx, 13 * u)}</div>
      <div class="badge" style="position:absolute;right:${5 * u}px;top:${6 * u}px;font-size:${1.8 * u}px">✓ ${p.kicker}</div>
      <div style="position:absolute;left:${5 * u}px;right:${5 * u}px;bottom:${12 * u}px">
        <div class="kicker" style="font-size:${2 * u}px">${p.clientLine}</div>
        <div class="disp" style="font-size:${9 * u}px;margin:${1.6 * u}px 0 ${2.2 * u}px">${title2(ctx)}</div>
        <div class="rule" style="font-size:${2.4 * u}px;margin-bottom:${2.6 * u}px"></div>
        ${chips(ctx, u, 6, 1.7)}
      </div>${footer(ctx, u)}`;
  } },

  // 2. LinkedIn landscape (feed 1.91:1)
  'post-landscape': { w: 1200, h: 627, render(ctx) {
    const u = 6.27, p = ctx.cfg.project;
    return `${bg(ctx, 'hero', '60% 60%')}<div class="layer shade-l"></div>
      <div style="position:absolute;left:${6 * u}px;top:${6 * u}px;width:${60 * u}px">
        ${logo(ctx, 17 * u)}
        <div class="kicker" style="font-size:${3 * u}px;margin-top:${6 * u}px">${p.kicker}</div>
        <div class="disp" style="font-size:${10 * u}px;margin:${2 * u}px 0">${title2(ctx)}</div>
        <div style="font-size:${3.2 * u}px;color:var(--text);line-height:1.4;font-weight:500">${p.clientLine}</div>
      </div>${footer(ctx, u, 9)}`;
  } },

  // 3. Instagram portrait — key figures
  'post-portrait-stats': { w: 1080, h: 1350, render(ctx) {
    const u = 10.8, p = ctx.cfg.project;
    return `${bg(ctx, 'craneLift', '50% 30%')}<div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,.75) 0%,rgba(10,11,13,.3) 18%,rgba(10,11,13,.9) 44%,rgba(10,11,13,.97) 100%)"></div>
      <div style="position:absolute;left:${6 * u}px;top:${5 * u}px">${logo(ctx, 14 * u)}</div>
      <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;top:${44 * u}px">
        <div class="kicker" style="font-size:${2.4 * u}px">By the numbers</div>
        <div class="disp" style="font-size:${7 * u}px;margin:${1.4 * u}px 0 ${3.6 * u}px">${p.title}</div>
        ${stats(ctx, u, 2, .95)}
      </div>
      <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;bottom:${11 * u}px;font-size:${2.4 * u}px;line-height:1.45;color:var(--text);font-style:italic;border-left:4px solid var(--blue-hi);padding-left:${2.4 * u}px">“${p.quote}”<div style="font-style:normal;color:var(--mute);font-size:${1.9 * u}px;margin-top:${1 * u}px;font-family:Montserrat;font-weight:600;letter-spacing:.1em;text-transform:uppercase">${p.quoteBy}</div></div>
      ${footer(ctx, u, 7)}`;
  } },

  // 4. Story / Reel cover 9:16
  'story-delivered': { w: 1080, h: 1920, render(ctx) {
    const u = 10.8, p = ctx.cfg.project, c = ctx.cfg.company;
    return `${bg(ctx, 'craneLift', '50% 50%')}
      <div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,.9) 0%,rgba(10,11,13,0) 22%,rgba(10,11,13,0) 52%,rgba(10,11,13,.92) 74%,#0B0C0E 100%)"></div>
      <div style="position:absolute;left:0;right:0;top:${7 * u}px;display:flex;justify-content:center">${logo(ctx, 20 * u)}</div>
      <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;top:${128 * u}px;text-align:center">
        <div class="kicker" style="font-size:${2.6 * u}px">${p.title}</div>
        <div class="disp" style="font-size:${14 * u}px;color:var(--orange);margin-top:${2 * u}px">Delivered</div>
        <div style="font-family:Montserrat;font-weight:600;font-size:${2.7 * u}px;letter-spacing:.08em;color:var(--text);margin-top:${2.4 * u}px">${p.clientLine}</div>
        <div class="ar" style="font-size:${4.2 * u}px;font-weight:800;margin-top:${3 * u}px">${p.headlineAr}</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:${5 * u}px;text-align:center;font-family:Montserrat;font-weight:600;font-size:${2.2 * u}px;letter-spacing:.14em;color:var(--mute);">${c.email}</div>`;
  } },

  // 5. LinkedIn banner
  'linkedin-banner': { w: 1584, h: 396, render(ctx) {
    const u = 3.96, c = ctx.cfg.company, p = ctx.cfg.project;
    return `${bg(ctx, 'yardSide', '40% 62%')}<div class="layer" style="background:linear-gradient(90deg,rgba(10,11,13,0) 0%,rgba(10,11,13,.7) 50%,rgba(10,11,13,.95) 100%)"></div>
      <div style="position:absolute;right:${8 * u}px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right">
        <div class="kicker" style="font-size:${4.2 * u}px">Latest delivery · 8 days, 16 hours</div>
        <div class="disp" style="font-size:${14 * u}px;margin:${2 * u}px 0">SCADA <span class="accent">Room Delivered</span></div>
        <div style="font-family:Montserrat;font-weight:600;font-size:${4 * u}px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)">${c.tagline}</div>
      </div>`;
  } },

  // 6. Team & client thank-you
  'post-thank-you': { w: 1200, h: 1200, render(ctx) {
    const u = 12, p = ctx.cfg.project, c = ctx.cfg.company;
    return `<div class="layer" style="background:var(--paper)"></div>
      <div class="layer bg" style="left:50%">${media(ctx, 'teamLift', '50% 60%')}</div>
      <div class="layer" style="left:50%;background:linear-gradient(180deg,rgba(14,65,148,0) 55%,rgba(14,65,148,.9) 100%)"></div>
      <div style="position:absolute;left:${6 * u}px;top:${6 * u}px">${logo(ctx, 12 * u, false)}</div>
      <div style="position:absolute;left:${6 * u}px;top:${30 * u}px;width:${38 * u}px;color:var(--char)">
        <div class="kicker" style="font-size:${2 * u}px;color:var(--orange)">Thank you</div>
        <div class="disp" style="font-size:${7 * u}px;margin:${2 * u}px 0 ${3 * u}px;color:var(--blue)">To our team<br>&amp; our client</div>
        <div style="font-size:${2.3 * u}px;line-height:1.55;color:#3A424B">Every weld, every connection and every inspection on the ${p.title} was delivered by people who take quality and safety personally.</div>
        <div class="rule" style="font-size:${2.4 * u}px;margin-top:${4 * u}px"></div>
      </div>
      <div style="position:absolute;left:53%;right:${3 * u}px;bottom:${4 * u}px;color:#fff;font-family:Montserrat;font-weight:800;font-size:${2.2 * u}px;letter-spacing:.14em;text-transform:uppercase">Load-out night · ${p.location.split(',')[0]}</div>
      <div style="position:absolute;left:${6 * u}px;bottom:${5 * u}px;font-family:Montserrat;font-weight:700;font-size:${1.6 * u}px;letter-spacing:.14em;text-transform:uppercase;color:#6B737C">${c.credential}</div>`;
  } },

  // 7. Speed record — SCADA Room only
  'post-speed-record': { w: 1080, h: 1080, render(ctx) {
    const u = 10.8, p = ctx.cfg.project, c = ctx.cfg.company;
    return `${bg(ctx, 'welding', '50% 40%')}<div class="layer" style="background:radial-gradient(circle at 50% 50%,rgba(14,40,90,.82) 0%,rgba(10,11,13,.94) 70%)"></div>
      <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
      <div style="position:absolute;left:0;right:0;top:${8 * u}px;display:flex;justify-content:center">${logo(ctx, 13 * u)}</div>
      <div style="position:absolute;left:0;right:0;top:${29 * u}px;text-align:center">
        <div class="kicker" style="font-size:${2.3 * u}px">SCADA Room · Engineering to dispatch</div>
        <div style="display:flex;justify-content:center;gap:${6 * u}px;margin-top:${2.4 * u}px">
          <div><div class="disp" style="font-size:${22 * u}px;line-height:.9;color:var(--orange)">8</div><div class="disp" style="font-size:${4.4 * u}px">Days</div></div>
          <div><div class="disp" style="font-size:${22 * u}px;line-height:.9;color:var(--orange)">16</div><div class="disp" style="font-size:${4.4 * u}px">Hours</div></div></div>
        <div style="font-family:Montserrat;font-weight:700;font-size:${2.4 * u}px;letter-spacing:.12em;text-transform:uppercase;color:var(--blue-hi);margin-top:${3 * u}px">GA drawings 22 Sep → Dispatched 30 Sep 2026</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:${8 * u}px;text-align:center;font-family:Montserrat;font-weight:600;font-size:${2 * u}px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)">${c.credential}</div>`;
  } },

  // 8. Arabic announcement
  'post-arabic': { w: 1080, h: 1080, render(ctx) {
    const u = 10.8, p = ctx.cfg.project, c = ctx.cfg.company;
    return `${bg(ctx, 'loadoutNight2', '50% 40%')}<div class="layer shade-b"></div><div class="layer shade-t"></div>
      <div style="position:absolute;right:${6 * u}px;top:${5 * u}px">${logo(ctx, 13 * u)}</div>
      <div class="ar" style="position:absolute;left:${6 * u}px;right:${6 * u}px;bottom:${12 * u}px;text-align:right">
        <div style="display:inline-block;background:var(--orange);color:#fff;font-weight:800;font-size:${2.8 * u}px;padding:${.4 * u}px ${2 * u}px">تم التسليم بنجاح ✓</div>
        <div style="font-weight:800;font-size:${7 * u}px;line-height:1.25;margin:${2.2 * u}px 0">${p.headlineAr}</div>
        <div style="font-weight:700;font-size:${2.9 * u}px;color:var(--orange-hi)">${p.subAr}</div>
        <div style="font-weight:400;font-size:${2.3 * u}px;color:var(--mute);margin-top:${1.4 * u}px">${c.nameAr} — الدمام، المملكة العربية السعودية</div>
      </div>${footer(ctx, u)}`;
  } },

  // 9. Spec sheet — data-plate facts (no PO numbers)
  'post-spec-sheet': { w: 1080, h: 1350, render(ctx) {
    const u = 10.8, p = ctx.cfg.project;
    const rows = p.specs.map(([k, v]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:${1.05 * u}px 0;border-bottom:1px solid rgba(255,255,255,.12)">
      <span class="mono" style="font-size:${2.1 * u}px;color:var(--mute);text-transform:uppercase;letter-spacing:.08em">${k}</span>
      <span style="font-family:Montserrat;font-weight:800;font-size:${2.6 * u}px">${v}</span></div>`).join('');
    return `<div class="layer" style="background:#0F1113"></div>
      <div class="layer bg" style="height:${46 * u}px;bottom:auto">${media(ctx, 'threeQuarter', '55% 55%')}</div>
      <div class="layer" style="top:${24 * u}px;height:${22.5 * u}px;bottom:auto;background:linear-gradient(180deg,rgba(15,17,19,0),#0F1113)"></div>
      <div style="position:absolute;left:${6 * u}px;top:${5 * u}px">${logo(ctx, 12 * u)}</div>
      <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;top:${36 * u}px">
        <div class="kicker" style="font-size:${2.2 * u}px">Spec sheet</div>
        <div class="disp" style="font-size:${7 * u}px;margin:${1.4 * u}px 0 ${1 * u}px">${p.title}</div>
        <div style="font-family:Montserrat;font-weight:600;font-size:${2.3 * u}px;color:var(--blue-hi);letter-spacing:.06em;margin-bottom:${2.4 * u}px">${p.subtitle}</div>
        ${rows}
      </div>${footer(ctx, u, 7)}`;
  } },

  // 10. Behind-the-build collage
  'post-collage': { w: 1080, h: 1350, render(ctx) {
    const u = 10.8, p = ctx.cfg.project, g = 1 * u;
    const cell = (role, pos, label, style) => `<div style="position:absolute;${style};overflow:hidden" class="bg">${media(ctx, role, pos)}
      <div style="position:absolute;left:0;bottom:0;background:rgba(10,11,13,.82);padding:${.6 * u}px ${1.4 * u}px;font-family:Montserrat;font-weight:700;font-size:${1.6 * u}px;letter-spacing:.14em;text-transform:uppercase;border-left:4px solid var(--orange)">${label}</div></div>`;
    const top = 20 * u, H = 125 * u - top, W = 100 * u - 2 * 5 * u;
    return `<div class="layer" style="background:#0F1113"></div>
      <div style="position:absolute;left:${5 * u}px;top:${5 * u}px">${logo(ctx, 10 * u)}</div>
      <div style="position:absolute;right:${5 * u}px;top:${6 * u}px;text-align:right"><div class="kicker" style="font-size:${1.8 * u}px">Behind the build</div>
        <div class="disp" style="font-size:${4.2 * u}px;margin-top:${.6 * u}px">${p.title}</div></div>
      ${cell('welding', '55% 40%', 'Fabrication', `left:${5 * u}px;top:${top}px;width:${W * .58}px;height:${H * .42}px`)}
      ${cell('dbPanel', '40% 40%', 'Electrical', `left:${5 * u + W * .58 + g}px;top:${top}px;width:${W * .42 - g}px;height:${H * .42}px`)}
      ${cell('craneLift', '50% 35%', 'Crane lift', `left:${5 * u}px;top:${top + H * .42 + g}px;width:${W * .42 - g}px;height:${H * .58 - g}px`)}
      ${cell('interior', '50% 50%', 'Fit-out', `left:${5 * u + W * .42}px;top:${top + H * .42 + g}px;width:${W * .58}px;height:${H * .29 - g}px`)}
      ${cell('loadoutNight', '60% 40%', 'Load-out', `left:${5 * u + W * .42}px;top:${top + H * .71 + g}px;width:${W * .58}px;height:${H * .29 - g}px`)}
      ${footer(ctx, u, 7)}`;
  } },

  // 11. Video thumbnail
  'video-thumbnail': { w: 1280, h: 720, render(ctx) {
    const u = 7.2, p = ctx.cfg.project;
    return `${bg(ctx, 'loadoutNight', '70% 40%')}<div class="layer shade-l"></div>
      <div style="position:absolute;left:${7 * u}px;top:${7 * u}px">${logo(ctx, 17 * u)}</div>
      <div style="position:absolute;left:${7 * u}px;bottom:${9 * u}px;width:${100 * u}px">
        <div class="badge" style="font-size:${3 * u}px">▶ Project Film</div>
        <div class="disp" style="font-size:${14 * u}px;margin-top:${3 * u}px">From Steel<br>to <span class="accent">SCADA</span></div>
        <div style="font-family:Montserrat;font-weight:700;font-size:${3.4 * u}px;letter-spacing:.12em;text-transform:uppercase;color:var(--text);margin-top:${2 * u}px">${p.title} · 8 days · 16 hours</div>
      </div>`;
  } },

  // 12. A3 poster (printed at 300 dpi via scale 2)
  'poster-a3': { w: 1240, h: 1754, scale: 2, pdf: true, render(ctx) {
    const u = 12.4, p = ctx.cfg.project, c = ctx.cfg.company;
    const phase = (ph, i) => `<div style="border-top:3px solid ${i % 2 ? 'var(--blue-hi)' : 'var(--orange)'};padding-top:${1.2 * u}px">
      <div class="mono" style="font-size:${1.5 * u}px;color:var(--mute)">0${i + 1}</div>
      <div style="font-family:Montserrat;font-weight:800;font-size:${2 * u}px;text-transform:uppercase;margin:${.5 * u}px 0">${ph.label}</div>
      <div style="font-size:${1.4 * u}px;color:var(--mute);line-height:1.4">${ph.detail}</div></div>`;
    const tile = (role, pos) => `<div style="position:relative;overflow:hidden" class="bg">${media(ctx, role, pos)}</div>`;
    return `<div class="layer" style="background:#0F1113"></div>
      <div class="layer bg" style="height:${68 * u}px;bottom:auto">${media(ctx, 'loadoutNight', '60% 40%')}</div>
      <div class="layer" style="top:${38 * u}px;height:${31 * u}px;bottom:auto;background:linear-gradient(180deg,rgba(15,17,19,0),#0F1113)"></div>
      <div class="layer" style="height:${22 * u}px;bottom:auto;background:linear-gradient(180deg,rgba(15,17,19,.85),rgba(15,17,19,0))"></div>
      <div style="position:absolute;left:${6 * u}px;top:${5 * u}px">${logo(ctx, 13 * u)}</div>
      <div class="badge" style="position:absolute;right:${6 * u}px;top:${7 * u}px;font-size:${1.6 * u}px">✓ ${p.kicker} · ${p.year}</div>
      <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;top:${54 * u}px">
        <div class="kicker" style="font-size:${1.9 * u}px">${p.clientLine}</div>
        <div class="disp" style="font-size:${9.4 * u}px;margin:${1.4 * u}px 0 ${1.4 * u}px">SCADA <span class="accent">Room Delivered</span></div>
        <div style="font-family:Montserrat;font-weight:600;font-size:${2.2 * u}px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)">${p.subtitle} · ${c.tagline}</div>
        <div style="margin-top:${4.5 * u}px">${stats(ctx, u, 4, .78)}</div>
        <div style="margin-top:${4.5 * u}px;display:grid;grid-template-columns:repeat(5,1fr);gap:${2.4 * u}px">${p.phases.map(phase).join('')}</div>
        <div style="margin-top:${4 * u}px;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:${1.2 * u}px;height:${24 * u}px">
          ${tile('welding', '55% 40%')}${tile('dbPanel', '40% 40%')}${tile('craneLift', '50% 35%')}</div>
      </div>
      <div class="footer" style="height:${6 * u}px;padding:0 ${6 * u}px;font-size:${1.4 * u}px"><span><b>${c.name}</b> · ${c.location}</span><span>${c.credential} · ${c.cr} · ${c.email}</span></div>`;
  } },

  // 13. Transparent photo frames — overlay on site photos (scripts/brand-photos.mjs)
  'frame-overlay-16x9': { w: 1920, h: 1080, transparent: true, render(ctx) {
    const u = 10.8, p = ctx.cfg.project;
    return `<div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,.55) 0%,rgba(10,11,13,0) 22%,rgba(10,11,13,0) 70%,rgba(10,11,13,.85) 100%)"></div>
      <div style="position:absolute;left:${5 * u}px;top:${4 * u}px">${logo(ctx, 11 * u)}</div>
      <div style="position:absolute;left:${5 * u}px;bottom:${5 * u}px;display:flex;align-items:center;gap:${2 * u}px">
        <div style="width:${.6 * u}px;height:${7 * u}px;background:var(--orange)"></div>
        <div><div class="disp" style="font-size:${4.4 * u}px">${p.title}</div>
        <div class="kicker" style="font-size:${1.7 * u}px;margin-top:${.8 * u}px">${p.kicker} · ${p.clientLine}</div></div></div>`;
  } },
  'frame-overlay-4x5': { w: 1080, h: 1350, transparent: true, render(ctx) {
    const u = 10.8, p = ctx.cfg.project;
    return `<div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,.6) 0%,rgba(10,11,13,0) 20%,rgba(10,11,13,0) 66%,rgba(10,11,13,.9) 100%)"></div>
      <div style="position:absolute;left:${5 * u}px;top:${4 * u}px">${logo(ctx, 12 * u)}</div>
      <div style="position:absolute;left:${5 * u}px;right:${5 * u}px;bottom:${6 * u}px">
        <div class="kicker" style="font-size:${2 * u}px">${p.kicker}</div>
        <div class="disp" style="font-size:${6.4 * u}px;margin-top:${1 * u}px">${p.title}</div>
        <div class="rule" style="font-size:${2 * u}px;margin-top:${2 * u}px"></div></div>`;
  } },
  'watermark-corner': { w: 1920, h: 1080, transparent: true, render(ctx) {
    return `<img class="logo" src="../${ctx.cfg.company.logos.watermark}" style="position:absolute;right:48px;bottom:40px;height:110px;opacity:.85">`;
  } },
};

// ---------- LinkedIn document carousel (also exported as one PDF) ----------
function slideBase(ctx, i, n, inner, role, pos) {
  const u = 10.8;
  let visual;
  if (role === 'blueprint') {
    visual = `<div class="layer" style="background:#111315"></div><div class="layer bg" style="top:${16 * u}px;height:${56.25 * u}px;bottom:auto">${art.print()}</div>
      <div class="layer" style="background:linear-gradient(180deg,#111315 ${16 * u}px,rgba(17,19,21,0) ${26 * u}px,rgba(17,19,21,0) ${52 * u}px,#111315 ${72 * u}px)"></div>`;
  } else if (role) {
    visual = `${bg(ctx, role, pos)}<div class="layer" style="background:linear-gradient(180deg,rgba(15,17,19,.88) 0%,rgba(15,17,19,.15) 20%,rgba(15,17,19,.15) 42%,rgba(15,17,19,.94) 66%,#0F1113 100%)"></div>`;
  } else visual = `<div class="layer" style="background:#111315"></div>`;
  return `${visual}
    <div style="position:absolute;left:${6 * u}px;top:${5 * u}px">${logo(ctx, 10 * u)}</div>
    <div class="mono" style="position:absolute;right:${6 * u}px;top:${6.5 * u}px;font-size:${2.2 * u}px;color:var(--text)">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</div>
    <div style="position:absolute;left:0;bottom:0;height:${.8 * u}px;width:${((i + 1) / n) * 100}%;background:var(--orange)"></div>
    <div style="position:absolute;left:${6 * u}px;right:${6 * u}px;bottom:${9 * u}px">${inner}</div>`;
}

function phaseSlide(ctx, u, k, n) {
  const ph = ctx.cfg.project.phases[k];
  return `<div class="mono" style="font-size:${12 * u}px;color:var(--orange);line-height:1">0${n}</div>
    <div class="disp" style="font-size:${8.4 * u}px;margin:${1 * u}px 0 ${2 * u}px">${ph.label}</div>
    <div class="rule" style="font-size:${2.4 * u}px;margin-bottom:${2.4 * u}px"></div>
    <div style="font-size:${3.2 * u}px;color:var(--text);line-height:1.4">${ph.detail}</div>`;
}

const carouselSlides = [
  (ctx, u) => ['loadoutNight', '62% 40%', `<div class="badge" style="font-size:${2 * u}px">✓ ${ctx.cfg.project.kicker}</div>
    <div class="disp" style="font-size:${9.6 * u}px;margin:${3 * u}px 0">${title2(ctx)}</div>
    <div style="font-size:${2.9 * u}px;color:var(--text);line-height:1.4">${ctx.cfg.project.clientLine}. Engineering to dispatch in 8 days, 16 hours →</div>`],
  (ctx, u) => [null, 0, `<div class="kicker" style="font-size:${2.2 * u}px">The scope</div>
    <div class="disp" style="font-size:${6.4 * u}px;margin:${2 * u}px 0 ${4 * u}px">One package.<br>One accountable partner.</div>
    <div style="display:grid;gap:${1.6 * u}px">${ctx.cfg.project.scope.map((s, i) => `<div style="display:flex;align-items:center;gap:${2 * u}px;font-family:Montserrat;font-weight:700;font-size:${2.9 * u}px;text-transform:uppercase"><span class="mono" style="color:var(--orange);font-size:${2.4 * u}px">0${i + 1}</span>${s}</div>`).join('')}</div>`],
  (ctx, u) => ['blueprint', 0, phaseSlide(ctx, u, 0, 1)],
  (ctx, u) => ['welding', '55% 35%', phaseSlide(ctx, u, 1, 2)],
  (ctx, u) => ['dbPanel', '40% 35%', phaseSlide(ctx, u, 2, 3)],
  (ctx, u) => ['inspection', '60% 35%', phaseSlide(ctx, u, 3, 4)],
  (ctx, u) => ['craneLift', '50% 30%', phaseSlide(ctx, u, 4, 5)],
  (ctx, u) => ['threeQuarter', '55% 45%', `<div class="kicker" style="font-size:${2.2 * u}px">The result</div>
    <div class="disp" style="font-size:${6.6 * u}px;margin:${2 * u}px 0 ${4 * u}px">Fully in-house.<br>Dispatched 30 Sep.</div>${stats(ctx, u, 2, .95)}`],
  (ctx, u) => ['teamLift', '50% 55%', `<div class="kicker" style="font-size:${2.2 * u}px">Your next project</div>
    <div class="disp" style="font-size:${7.4 * u}px;margin:${2 * u}px 0 ${3 * u}px">Let’s build it<br><span class="accent">together.</span></div>
    <div style="font-family:Montserrat;font-weight:600;font-size:${2.7 * u}px;line-height:1.7">${ctx.cfg.company.email}</div>
    <div style="font-family:Montserrat;font-weight:600;font-size:${1.9 * u}px;letter-spacing:.14em;color:var(--mute);margin-top:${2.4 * u}px;text-transform:uppercase">${ctx.cfg.company.credential}</div>`],
];

carouselSlides.forEach((fn, i) => {
  designs[`carousel-${String(i + 1).padStart(2, '0')}`] = {
    w: 1080, h: 1350, carousel: true,
    render(ctx) { const [role, pos, inner] = fn(ctx, 10.8); return slideBase(ctx, i, carouselSlides.length, inner, role, pos); },
  };
});
