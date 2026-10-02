// Motion-graphics film engine. Deterministic: seek(t) fully redraws the frame at time t.
import { controlRoom, deliveryTruck, frameBuild, blueprint, coatingBay, util } from './illustrations.js';
const { clamp, ease, seg, rnd } = util;
const outE = (x) => 1 - Math.pow(1 - clamp(x), 3);

let S = null; // { stage, ctx, W, H, u, fmt, scenes, total }

// Reveal: slide-up + fade, starting at t0 (scene-local seconds)
const rv = (lt, t0, d = .7, dy = 3) => { const k = outE((lt - t0) / d); return `opacity:${k};transform:translateY(${(1 - k) * dy * S.u}px)`; };
const px = (n) => `${(n * S.u).toFixed(1)}px`;

function artBox(svg, lt, zoom = [1, 1.08], dur = 6) {
  const k = ease(clamp(lt / dur));
  const z = zoom[0] + (zoom[1] - zoom[0]) * k;
  const geo = { land: 'left:0;top:0;width:100%;height:100%', sq: 'left:-30%;width:160%;top:4%;height:90%', port: 'left:-55%;width:210%;top:16%;height:66%' }[S.fmt];
  const fade = S.fmt === 'land' ? '' : `<div class="layer" style="${geo};background:linear-gradient(180deg,#111315 0%,rgba(17,19,21,0) 18%,rgba(17,19,21,0) 70%,#111315 100%)"></div>`;
  return `<div class="layer" style="background:#111315"></div><div class="layer bg" style="${geo};transform:scale(${z});transform-origin:50% 50%">${svg}</div>${fade}`;
}

const photo = (role) => (S.ctx.cfg.photos && S.ctx.cfg.photos[role] ? '../' + S.ctx.cfg.photos[role] : null);

// Ken Burns slideshow of photo roles across a scene; each shot cross-dissolves into the next.
function slideshow(lt, d, shots, svgFallback) {
  const avail = shots.filter((sh) => photo(sh[0]));
  if (!avail.length) return artBox(svgFallback, lt, [1, 1.08], d);
  const per = d / avail.length;
  let html = '<div class="layer" style="background:#0B0C0E"></div>';
  avail.forEach(([role, pos = '50% 50%', dir = 1], i) => {
    const st = i * per, k = lt - st;
    if (k < -.5 || k > per + .6) return;
    const op = i === 0 ? 1 : clamp((k + .5) / .5);
    const q = clamp((k + .5) / (per + 1));
    const z = 1.06 + .1 * (dir > 0 ? q : 1 - q);
    const tx = (dir > 0 ? -1 : 1) * 1.5 * (q - .5);
    html += `<div class="layer bg" style="opacity:${op.toFixed(3)}"><img src="${photo(role)}" style="object-position:${pos};transform:scale(${z.toFixed(4)}) translateX(${tx.toFixed(3)}%)"></div>`;
  });
  return html;
}

// Lower-third phase label
function label(lt, num, title, detail) {
  const land = S.fmt === 'land';
  const pos = land ? `left:${px(7)};bottom:${px(9)}` : S.fmt === 'sq' ? `left:${px(7)};bottom:${px(9)}` : `left:${px(7)};right:${px(7)};bottom:${px(16)}`;
  const shade = land ? `<div class="layer" style="background:linear-gradient(90deg,rgba(10,11,13,.88) 0%,rgba(10,11,13,.45) 40%,rgba(10,11,13,0) 65%)"></div>`
    : `<div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,0) 55%,rgba(10,11,13,.92) 82%)"></div>`;
  const big = S.fmt === 'port' ? 12 : 10;
  return `${shade}<div style="position:absolute;${pos}">
    <div class="mono" style="${rv(lt, .3)};font-size:${px(big * .8)};color:var(--orange);line-height:1">${num}</div>
    <div class="disp" style="${rv(lt, .45)};font-size:${px(big)};margin-top:${px(1)}">${title}</div>
    <div style="${rv(lt, .6)};height:${px(.8)};width:${px(14 * outE((lt - .6) / .8))};background:var(--orange);margin:${px(2)} 0"></div>
    <div style="${rv(lt, .75)};font-family:Montserrat;font-weight:600;font-size:${px(3.2)};letter-spacing:.06em;color:var(--text)">${detail}</div></div>`;
}

function bug(lt) { // persistent logo bug
  const c = S.ctx.cfg.company;
  return `<img class="logo" src="../${c.logos.onDark}" style="position:absolute;right:${px(4)};top:${px(3.6)};height:${px(S.fmt === 'land' ? 9 : 8)};opacity:${.92 * clamp(lt / .6)}">`;
}

// ---------------- scenes ----------------
const SC = {
  intro(lt, d) {
    const c = S.ctx.cfg.company;
    let rays = '';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * 360 + rnd(i) * 10, len = 30 + rnd(i + 7) * 40;
      const k = outE((lt - .1 - rnd(i + 3) * .3) / .9);
      rays += `<div style="position:absolute;left:50%;top:44%;width:${px(len * k)};height:${px(.5)};background:linear-gradient(90deg,rgba(255,138,76,0),#FF8A4C);transform-origin:0 50%;transform:rotate(${a}deg) translateX(${px(6 + 30 * k)});opacity:${(1 - clamp((lt - 1.2) / 1.2)) * .9}"></div>`;
    }
    const k = outE((lt - .5) / 1.1);
    const lw = S.fmt === 'land' ? 62 : 80;
    return `<div class="layer" style="background:radial-gradient(circle at 50% 44%,#1F2A3A 0%,#0B0C0E 65%)"></div>${rays}
      <div style="position:absolute;left:50%;top:44%;width:${px(30)};height:${px(30)};margin:${px(-15)} 0 0 ${px(-15)};border-radius:50%;background:radial-gradient(circle,rgba(255,138,76,.55),rgba(255,138,76,0) 70%);opacity:${clamp(1 - lt / 1.6)};transform:scale(${1 + lt * 2})"></div>
      <div style="position:absolute;left:0;right:0;top:44%;transform:translateY(-55%) scale(${.86 + .14 * k});opacity:${k};display:flex;justify-content:center">
        <img class="logo" src="../${c.logos.onDark}" style="width:${px(lw)}"></div>
      <div style="position:absolute;left:0;right:0;top:${S.fmt === 'land' ? '76%' : '70%'};text-align:center;${rv(lt, 1.6)}">
        <div style="font-family:Montserrat;font-weight:700;font-size:${px(3.4)};letter-spacing:.32em;text-transform:uppercase;color:var(--text)">${c.tagline}</div>
        <div style="margin:${px(2)} auto 0;height:${px(.5)};width:${px(24 * outE((lt - 1.9) / .8))};background:var(--orange)"></div></div>`;
  },

  title(lt, d) {
    const p = S.ctx.cfg.project, land = S.fmt === 'land';
    const pos = land ? `left:${px(7)};bottom:${px(10)}` : `left:${px(7)};right:${px(7)};bottom:${px(S.fmt === 'port' ? 18 : 10)}`;
    return `${slideshow(lt, d, [['loadoutNight2', '45% 40%', -1]], controlRoom({ t: 2 + lt, id: 'ti' }))}
      <div class="layer" style="background:linear-gradient(${land ? '90deg' : '180deg'},rgba(10,11,13,${land ? .95 : 0}) 0%,rgba(10,11,13,${land ? .75 : .1}) ${land ? 40 : 45}%,rgba(10,11,13,${land ? 0 : .95}) ${land ? 70 : 85}%)"></div>
      <div style="position:absolute;${pos}">
        <div class="badge" style="${rv(lt, .2)};font-size:${px(2.4)}">✓ ${p.kicker}</div>
        <div class="disp" style="${rv(lt, .4)};font-size:${px(land ? 11.5 : 11)};margin-top:${px(3)}">${p.titleLines[0]}<br><span class="accent">${p.titleLines[1]}</span></div>
        <div class="kicker" style="${rv(lt, .8)};font-size:${px(2.5)};margin-top:${px(3)};letter-spacing:.2em">${p.clientLine}</div></div>${bug(lt)}`;
  },

  engineering(lt, d) {
    const ph = S.ctx.cfg.project.phases[0];
    return artBox(blueprint({ t: lt, p: ease(clamp(lt / (d * .8))), id: 'en' }), lt, [1.0, 1.1], d) + label(lt, '01', ph.label, ph.detail) + bug(1);
  },
  fabrication(lt, d) {
    const ph = S.ctx.cfg.project.phases[1];
    return slideshow(lt, d, [['welding', '55% 40%', 1], ['skidFrame', '50% 50%', -1], ['boltedConnection', '50% 45%', 1], ['basePlate', '45% 50%', -1]], frameBuild({ t: lt, p: clamp(lt / (d * .85)), id: 'fa' })) + label(lt, '02', ph.label, ph.detail) + bug(1);
  },
  fitout(lt, d) {
    const ph = S.ctx.cfg.project.phases[2];
    return slideshow(lt, d, [['dbPanel', '40% 40%', 1], ['interior', '50% 50%', -1], ['fireExit', '50% 40%', 1], ['hvac', '50% 50%', -1]], coatingBay({ t: lt, p: .6, id: 'co' })) + label(lt, '03', ph.label, ph.detail) + bug(1);
  },
  inspection(lt, d) {
    const ph = S.ctx.cfg.project.phases[3];
    return slideshow(lt, d, [['inspection', '60% 40%', 1], ['fatTeam', '50% 40%', -1]], frameBuild({ t: lt, p: 1, id: 'in' })) + label(lt, '04', ph.label, ph.detail) + bug(1);
  },
  loadout(lt, d) {
    const ph = S.ctx.cfg.project.phases[4];
    return slideshow(lt, d, [['craneLiftWide', '50% 35%', 1], ['craneLift', '50% 30%', -1], ['loadoutNight', '62% 40%', 1]], deliveryTruck({ t: lt, p: .12 + .62 * clamp(lt / d), id: 'de' })) + label(lt, '05', ph.label, ph.detail) + bug(1);
  },
  team(lt, d) {
    const land = S.fmt === 'land';
    return slideshow(lt, d, [['teamLift', '50% 55%', 1]], frameBuild({ t: lt, p: 1, id: 'tm' }))
      + `<div class="layer" style="background:linear-gradient(180deg,rgba(10,11,13,0) 50%,rgba(10,11,13,.9) 85%)"></div>
      <div style="position:absolute;left:${px(7)};right:${px(7)};bottom:${px(land ? 9 : 16)}">
        <div class="kicker" style="${rv(lt, .3)};font-size:${px(2.8)}">Thank you</div>
        <div class="disp" style="${rv(lt, .45)};font-size:${px(land ? 8 : 8.5)};margin-top:${px(1.4)}">To our team<br>&amp; our client</div></div>` + bug(1);
  },

  stats(lt, d) {
    const st = S.ctx.cfg.project.stats, land = S.fmt === 'land';
    const cols = land ? 4 : 2;
    const num = (v, k) => {
      const m = String(v).match(/^([^\d]*)([\d,\.]+)(.*)$/);
      if (!m) return v;
      const n = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length;
      const cur = n * outE(k);
      return m[1] + cur.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3];
    };
    const cells = st.map((s, i) => `<div class="stat" style="${rv(lt, .3 + i * .18)};padding-left:${px(2.4)}">
      <div class="v" style="font-size:${px(land ? 9 : 9.5)};white-space:nowrap">${num(s.value, (lt - .4 - i * .18) / 1.6)}</div>
      <div class="l" style="font-size:${px(land ? 2.2 : 2.6)};margin-top:${px(1)}">${s.label}</div></div>`).join('');
    return `${slideshow(lt, d, [['threeQuarter', '55% 50%', 1]], controlRoom({ t: 12 + lt, id: 'st' }))}<div class="layer" style="background:rgba(10,11,13,.86)"></div>
      <div style="position:absolute;left:${px(7)};right:${px(7)};top:50%;transform:translateY(-50%)">
        <div class="kicker" style="${rv(lt, .1)};font-size:${px(2.8)}">The result</div>
        <div class="disp" style="${rv(lt, .2)};font-size:${px(land ? 6.4 : 5.6)};margin:${px(1.6)} 0 ${px(6)}">Engineering to dispatch. Fully in-house.</div>
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${px(4)}">${cells}</div></div>${bug(1)}`;
  },

  outro(lt, d) {
    const c = S.ctx.cfg.company, land = S.fmt === 'land';
    const squat = !land && S.H / S.W < 1.5; // 1:1 and 4:5 cuts need a smaller logo
    return `<div class="layer" style="background:var(--paper)"></div>
      <div class="layer" style="top:auto;height:${px(1.2)};background:linear-gradient(90deg,var(--blue) 0%,var(--blue) 70%,var(--orange) 70%)"></div>
      <div style="position:absolute;left:0;right:0;top:${land ? '36%' : squat ? '34%' : '38%'};transform:translateY(-50%);display:flex;justify-content:center;${rv(lt, .1, .9, 2)}">
        <img class="logo" src="../${c.logos.onLight}" style="width:${px(land ? 58 : squat ? 52 : 78)}"></div>
      <div style="position:absolute;left:${px(6)};right:${px(6)};top:${land ? '66%' : '64%'};text-align:center;color:var(--char)">
        <div style="${rv(lt, .6)};font-family:Montserrat;font-weight:800;font-size:${px(3.6)};letter-spacing:.24em;text-transform:uppercase;color:var(--blue)">${c.tagline}</div>
        <div style="${rv(lt, .9)};font-family:Montserrat;font-weight:600;font-size:${px(2.7)};letter-spacing:.06em;margin-top:${px(3)};color:#3A424B">${c.email}</div>
        <div style="${rv(lt, 1.15)};font-family:Montserrat;font-weight:700;font-size:${px(2.2)};letter-spacing:.16em;text-transform:uppercase;margin-top:${px(2.2)};color:var(--orange)">${c.credential} &nbsp;·&nbsp; ${c.cr}</div></div>`;
  },
};

// Timelines (seconds). Scenes overlap by XF for cross-dissolves.
const XF = .6;
const TIMELINES = {
  full: [['intro', 4.5], ['title', 6], ['engineering', 5.5], ['fabrication', 8], ['fitout', 8], ['inspection', 5.5], ['loadout', 9], ['stats', 6.5], ['team', 5], ['outro', 6]],
  short: [['intro', 3.2], ['title', 4.2], ['fabrication', 4.6], ['fitout', 4.2], ['loadout', 5.6], ['stats', 4.6], ['team', 3.4], ['outro', 4.4]],
  sting: [['intro', 5]],
};

export const film = {
  setup(stage, ctx, { w, h, timeline = 'full' }) {
    const fmt = w > h * 1.2 ? 'land' : h > w * 1.2 ? 'port' : 'sq';
    let t = 0;
    const scenes = TIMELINES[timeline].map(([name, d], i) => { const s = { name, start: t, dur: d }; t += d - XF; return s; });
    const total = t + XF;
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    S = { stage, ctx, W: w, H: h, u: Math.min(w, h) / 100, fmt, scenes, total };
    return { total, scenes: scenes.map((s) => [s.name, +s.start.toFixed(2), s.dur]) };
  },
  seek(t) {
    let html = '';
    S.scenes.forEach((s, i) => {
      const lt = t - s.start;
      if (lt < 0 || lt > s.dur) return;
      const fadeIn = i === 0 ? clamp(lt / .5) : clamp(lt / XF);
      html += `<div class="layer" style="opacity:${fadeIn.toFixed(3)}">${SC[s.name](lt, s.dur)}</div>`;
    });
    // global progress bar + fade to black at the end
    html += `<div style="position:absolute;left:0;bottom:0;height:${px(.45)};width:${(t / S.total) * 100}%;background:var(--orange);opacity:.85"></div>`;
    const endFade = clamp((t - (S.total - .5)) / .5);
    if (endFade > 0) html += `<div class="layer" style="background:#000;opacity:${endFade}"></div>`;
    S.stage.innerHTML = html;
  },
};
