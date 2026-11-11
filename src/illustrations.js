// Vector illustrations for the SCADA Room media kit.
// Every function returns an SVG string and is deterministic in (t, p) so the
// video renderer can seek to any frame. t = seconds (ambient motion), p = 0..1 progress.

const C = {
  ink: '#0F1113', char: '#1B1F23', char2: '#262B31', steel: '#3A424B', steel2: '#4A535D',
  mute: '#8A939C', text: '#F4F1EA',
  // SWS brand: spark orange (accent) + corporate blue
  gold: '#E84E0E', goldHi: '#FF8A4C', goldLo: '#A8360A', blue: '#0E4194', blueHi: '#4C8DF0',
  ok: '#4FD1A1', warn: '#F0A23B', alarm: '#E5534B', proc: '#4C8DF0',
};

// Logo paths (relative to src/stage.html); overridden by the stage loader.
export const LOGO = { light: '../assets/logo/sws-logo.png', mark: '../assets/logo/sws-mark.png' };

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const seg = (p, a, b) => clamp((p - a) / (b - a));
// deterministic pseudo-random
const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

const defs = (id) => `
  <linearGradient id="${id}gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.goldHi}"/><stop offset=".55" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldLo}"/></linearGradient>
  <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16191D"/><stop offset="1" stop-color="#0B0D0F"/></linearGradient>
  <radialGradient id="${id}glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.goldHi}" stop-opacity=".55"/><stop offset="1" stop-color="${C.goldHi}" stop-opacity="0"/></radialGradient>
  <filter id="${id}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="${id}soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>`;

// ---------- HMI screen contents (drawn inside a w×h box at 0,0) ----------
function trend(w, h, t, seed, color) {
  let d = '';
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    const k = i + t * 6 + seed * 50;
    const y = h * (.55 + .18 * Math.sin(k * .21 + seed) + .1 * Math.sin(k * .53) + .05 * (rnd(Math.floor(k)) - .5));
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${Math.max(1.2, h / 70)}" stroke-linejoin="round"/>`;
}

function grid(w, h, step, color = '#ffffff', op = .05) {
  let s = '';
  for (let x = step; x < w; x += step) s += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  for (let y = step; y < h; y += step) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  return `<g stroke="${color}" stroke-opacity="${op}" stroke-width="1">${s}</g>`;
}

function hmiPID(w, h, t) {
  // process mimic: tanks, pipes, pumps, valves with flow dashes
  const flow = -(t * 40) % 24;
  const v = (i) => (Math.floor(t / 2.5 + i) % 5 === 0 ? C.warn : C.ok);
  const sx = w / 320, sy = h / 165;
  return `<g transform="scale(${sx} ${sy})">
    <rect width="320" height="165" fill="#0E1418"/>
    ${grid(320, 165, 20, C.proc, .06)}
    <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.mute}">GOSP-01 · PROCESS OVERVIEW</text>
    <g stroke="${C.proc}" stroke-width="3" fill="none">
      <path d="M30 120 H120 V60 H200 V120 H290"/>
    </g>
    <g stroke="${C.goldHi}" stroke-width="3" fill="none" stroke-dasharray="6 18" stroke-dashoffset="${flow}">
      <path d="M30 120 H120 V60 H200 V120 H290"/>
    </g>
    <rect x="20" y="70" width="34" height="62" rx="6" fill="#18232A" stroke="${C.proc}" stroke-width="2"/>
    <rect x="22" y="${132 - 50 - 6 * Math.sin(t)}" width="30" height="${48 + 6 * Math.sin(t)}" fill="${C.proc}" opacity=".35"/>
    <rect x="266" y="78" width="40" height="54" rx="6" fill="#18232A" stroke="${C.proc}" stroke-width="2"/>
    <circle cx="160" cy="60" r="13" fill="#18232A" stroke="${C.ok}" stroke-width="2.5"/>
    <path d="M152 60 L168 60 M160 52 L168 60 L160 68" stroke="${C.ok}" stroke-width="2" fill="none" transform="rotate(${(t * 120) % 360} 160 60)"/>
    <path d="M114 112 l12 8 l-12 8 z M126 112 l-12 8 l12 8z" fill="${v(1)}" transform="translate(-6 -20) "/>
    <path d="M232 112 l12 8 l-12 8 z M244 112 l-12 8 l12 8z" fill="${v(3)}"/>
    <g font-family="JetBrains Mono, monospace" font-size="9" fill="${C.text}">
      <text x="62" y="98">FT-101 ${(842 + 12 * Math.sin(t * .9)).toFixed(1)} m³/h</text>
      <text x="176" y="44">P-201 RUN</text>
      <text x="212" y="148">PT-301 ${(18.4 + .4 * Math.sin(t * 1.3)).toFixed(2)} bar</text>
    </g>
  </g>`;
}

function hmiTrends(w, h, t) {
  const sx = w / 320, sy = h / 165;
  return `<g transform="scale(${sx} ${sy})">
    <rect width="320" height="165" fill="#0E1418"/>
    ${grid(320, 165, 20, '#fff', .05)}
    <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.mute}">TRENDS · LAST 60 MIN</text>
    <g transform="translate(0 10)">${trend(320, 150, t, 1, C.goldHi)}${trend(320, 150, t, 2.4, C.proc)}${trend(320, 150, t, 4.1, C.ok)}</g>
  </g>`;
}

function hmiAlarms(w, h, t) {
  const sx = w / 320, sy = h / 165;
  const rows = ['LIC-204 LEVEL HI', 'TT-118 TEMP NORMAL', 'PV-402 POSITION OK', 'UPS-A ON LINE', 'HVAC-2 RUNNING', 'FG-07 HEALTHY', 'COMMS LINK OK'];
  const off = Math.floor(t * .8);
  let r = '';
  for (let i = 0; i < 7; i++) {
    const txt = rows[(i + off) % rows.length];
    const col = txt.includes('HI') ? C.warn : C.ok;
    r += `<rect x="8" y="${24 + i * 19}" width="304" height="16" fill="#ffffff" opacity="${i % 2 ? .03 : .06}"/>
      <circle cx="18" cy="${32 + i * 19}" r="4" fill="${col}"/>
      <text x="30" y="${36 + i * 19}" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.text}">${String(10 + ((i + off) * 7) % 50).padStart(2, '0')}:${String((i * 13 + off * 11) % 60).padStart(2, '0')}  ${txt}</text>`;
  }
  return `<g transform="scale(${sx} ${sy})"><rect width="320" height="165" fill="#0E1418"/>
    <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.mute}">EVENTS &amp; ALARMS</text>${r}</g>`;
}

function hmiMap(w, h, t) {
  const sx = w / 320, sy = h / 165;
  const nodes = [[40, 120], [90, 70], [150, 100], [200, 50], [250, 90], [290, 40], [120, 140], [230, 140]];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [4, 7], [1, 3]];
  let s = links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${C.proc}" stroke-opacity=".6" stroke-width="1.5"/>`).join('');
  nodes.forEach(([x, y], i) => {
    const pulse = (t * 1.2 + i * .37) % 1;
    s += `<circle cx="${x}" cy="${y}" r="${4 + pulse * 10}" fill="none" stroke="${C.goldHi}" stroke-opacity="${(1 - pulse) * .7}"/>
      <circle cx="${x}" cy="${y}" r="4" fill="${C.goldHi}"/>`;
  });
  return `<g transform="scale(${sx} ${sy})"><rect width="320" height="165" fill="#0E1418"/>${grid(320, 165, 16, C.proc, .05)}
    <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.mute}">FIELD NETWORK · RTU STATUS</text>${s}</g>`;
}

function hmiKPI(w, h, t) {
  const sx = w / 320, sy = h / 165;
  const g = (cx, val, lbl) => {
    const a = -210 + 240 * val;
    const r = 34, rad = (d) => (d * Math.PI) / 180;
    const x2 = cx + r * Math.cos(rad(a)), y2 = 95 + r * Math.sin(rad(a));
    return `<path d="M${cx + r * Math.cos(rad(-210))} ${95 + r * Math.sin(rad(-210))} A${r} ${r} 0 1 1 ${cx + r * Math.cos(rad(30))} ${95 + r * Math.sin(rad(30))}" fill="none" stroke="#2A343B" stroke-width="7"/>
      <path d="M${cx + r * Math.cos(rad(-210))} ${95 + r * Math.sin(rad(-210))} A${r} ${r} 0 ${val > .75 ? 1 : 0} 1 ${x2} ${y2}" fill="none" stroke="${C.goldHi}" stroke-width="7"/>
      <text x="${cx}" y="100" text-anchor="middle" font-family="Montserrat" font-weight="700" font-size="15" fill="${C.text}">${Math.round(val * 100)}%</text>
      <text x="${cx}" y="146" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="${C.mute}">${lbl}</text>`;
  };
  return `<g transform="scale(${sx} ${sy})"><rect width="320" height="165" fill="#0E1418"/>
    <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.mute}">SYSTEM HEALTH</text>
    ${g(60, .92 + .03 * Math.sin(t), 'AVAILABILITY')}${g(160, .78 + .05 * Math.sin(t * .7 + 1), 'THROUGHPUT')}${g(260, .99, 'COMMS')}</g>`;
}

const SCREENS = [hmiPID, hmiTrends, hmiMap, hmiAlarms, hmiKPI, hmiTrends];

// ---------- 1. SCADA control room interior ----------
export function controlRoom({ t = 0, id = 'cr' } = {}) {
  const W = 1600, H = 900;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs(id)}
    <linearGradient id="${id}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1E22"/><stop offset="1" stop-color="#0A0B0D"/></linearGradient>
    <linearGradient id="${id}desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A424B"/><stop offset="1" stop-color="#1B1F23"/></linearGradient>
    <radialGradient id="${id}wallglow" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="${C.proc}" stop-opacity=".22"/><stop offset="1" stop-color="${C.proc}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${id}bg)"/>`;
  // back wall panels
  for (let i = 0; i < 16; i++) s += `<rect x="${i * 100}" y="60" width="98" height="520" fill="#181B1F" opacity="${.6 + .4 * (i % 2)}"/>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${id}wallglow)"/>`;
  // ceiling + light strips + cable tray
  s += `<polygon points="0,0 1600,0 1600,60 0,60" fill="#0E1012"/>`;
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 300;
    s += `<rect x="${x}" y="22" width="180" height="6" rx="3" fill="${C.goldHi}" opacity=".9"/><ellipse cx="${x + 90}" cy="40" rx="160" ry="30" fill="url(#${id}glow)" opacity=".5"/>`;
  }
  s += `<rect x="0" y="62" width="${W}" height="10" fill="${C.steel}"/>`;
  for (let x = 0; x < W; x += 40) s += `<rect x="${x}" y="62" width="3" height="10" fill="${C.steel2}"/>`;
  // video wall frame
  const VX = 290, VY = 110, SW = 320, SH = 165, G = 14;
  s += `<rect x="${VX - 18}" y="${VY - 18}" width="${3 * SW + 2 * G + 36}" height="${2 * SH + G + 36}" rx="6" fill="#090A0B" stroke="${C.steel}" stroke-width="2"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const i = r * 3 + c, x = VX + c * (SW + G), y = VY + r * (SH + G);
    s += `<g transform="translate(${x} ${y})">${SCREENS[i](SW, SH, t + i * .7)}<rect width="${SW}" height="${SH}" fill="none" stroke="#000" stroke-width="2"/></g>`;
  }
  // big status banner under wall
  s += `<rect x="${VX - 18}" y="${VY + 2 * SH + G + 26}" width="${3 * SW + 2 * G + 36}" height="34" fill="#0B0D0F" stroke="${C.goldLo}" stroke-width="1.5"/>
    <text x="${W / 2}" y="${VY + 2 * SH + G + 49}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="15" letter-spacing="4" fill="${C.goldHi}">SCADA CONTROL ROOM · ALL SYSTEMS NORMAL</text>`;
  // server racks left + right (perspective)
  const rack = (x, flip) => {
    let r = '';
    const pts = flip ? `${x},150 ${x + 150},90 ${x + 150},640 ${x},700` : `${x},90 ${x + 150},150 ${x + 150},700 ${x},640`;
    r += `<polygon points="${pts}" fill="#15181B" stroke="${C.steel}" stroke-width="2"/>`;
    for (let k = 0; k < 18; k++) {
      const f = k / 18;
      const yA = flip ? 160 + f * 520 : 100 + f * 520, yB = flip ? 100 + f * 520 : 160 + f * 520;
      r += `<line x1="${x + 10}" y1="${yA + 10}" x2="${x + 140}" y2="${yB + 10}" stroke="#262B31" stroke-width="16"/>`;
      for (let l = 0; l < 3; l++) {
        const on = rnd(k * 9 + l + Math.floor(t * (2 + l)) * 31 + (flip ? 500 : 0)) > .45;
        const lx = x + 22 + l * 12, ly = yA + 10 + (yB - yA) * ((lx - x) / 150);
        r += `<circle cx="${lx}" cy="${ly}" r="2.6" fill="${on ? (l === 2 ? C.goldHi : C.ok) : '#2E353B'}"/>`;
      }
    }
    return r;
  };
  s += rack(20, false) + rack(1430, true);
  // floor
  s += `<polygon points="0,640 1600,640 1600,900 0,900" fill="url(#${id}floor)"/>`;
  for (let i = -10; i <= 26; i++) s += `<line x1="${800 + (i - 8) * 30}" y1="640" x2="${800 + (i - 8) * 260}" y2="900" stroke="#fff" stroke-opacity=".035"/>`;
  for (let j = 0; j < 7; j++) { const y = 640 + Math.pow(j / 7, 1.6) * 260; s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#fff" stroke-opacity=".035"/>`; }
  // reflection of wall on floor
  s += `<rect x="${VX}" y="660" width="${3 * SW + 2 * G}" height="70" fill="${C.proc}" opacity=".05" filter="url(#${id}blur)"/>`;
  // operator console (curved)
  s += `<path d="M260 700 Q800 610 1340 700 L1380 760 Q800 668 220 760 Z" fill="url(#${id}desk)" stroke="${C.goldLo}" stroke-width="2"/>
        <path d="M220 760 Q800 668 1380 760 L1380 800 Q800 712 220 800 Z" fill="#121417"/>
        <path d="M262 702 Q800 612 1338 702" fill="none" stroke="${C.goldHi}" stroke-width="2.5" opacity=".8"/>`;
  // desk monitors
  const mons = [[360, 640], [500, 618], [640, 604], [800, 600], [960, 604], [1100, 618], [1240, 640]];
  mons.forEach(([x, y], i) => {
    const fn = SCREENS[(i + 2) % SCREENS.length];
    s += `<g transform="translate(${x - 58} ${y - 74})"><rect x="-4" y="-4" width="124" height="72" rx="3" fill="#08090A"/>${fn(116, 64, t + i)}</g>
      <rect x="${x - 4}" y="${y - 6}" width="8" height="16" fill="${C.steel}"/>`;
  });
  // chairs silhouettes
  [[520, 820], [800, 800], [1080, 820]].forEach(([x, y]) => {
    s += `<g fill="#0A0B0C" stroke="${C.steel}" stroke-width="1.5"><rect x="${x - 55}" y="${y - 70}" width="110" height="80" rx="22"/><rect x="${x - 70}" y="${y + 2}" width="140" height="22" rx="10"/></g>`;
  });
  // vignette
  s += `<radialGradient id="${id}vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${id}vig)"/>`;
  return s + '</svg>';
}

// ---------- 2. Prefabricated SCADA room shelter (side elevation) ----------
function shelter(x, y, w, h, id, paint = 1) {
  // paint: 0 = bare primer grey, 1 = finished
  const body = paint >= 1 ? '#E8E3D6' : '#9AA0A6';
  let s = `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${w}" height="${h}" fill="${body}"/>`;
  if (paint < 1) s += `<rect x="0" y="0" width="${w * paint}" height="${h}" fill="#E8E3D6"/>
      <rect x="${w * paint - 6}" y="-14" width="12" height="${h + 28}" fill="url(#${id}gold)" opacity=".9"/>`;
  for (let i = 1; i < 14; i++) s += `<line x1="${(w / 14) * i}" y1="0" x2="${(w / 14) * i}" y2="${h}" stroke="#000" stroke-opacity=".08" stroke-width="2"/>`;
  s += `<rect x="-6" y="-14" width="${w + 12}" height="16" fill="${C.char2}"/>
    <rect x="-6" y="${h - 2}" width="${w + 12}" height="18" fill="${C.char2}"/>
    <rect x="${w * .08}" y="${h * .22}" width="${w * .1}" height="${h * .78 - 2}" fill="#C9C3B4" stroke="#7E7A70" stroke-width="2"/>
    <circle cx="${w * .165}" cy="${h * .62}" r="4" fill="${C.char}"/>
    <rect x="${w * .74}" y="${h * .18}" width="${w * .18}" height="${h * .42}" fill="#CFCABC" stroke="#7E7A70" stroke-width="2"/>`;
  for (let i = 0; i < 8; i++) s += `<line x1="${w * .75}" y1="${h * (.22 + i * .045)}" x2="${w * .91}" y2="${h * (.22 + i * .045)}" stroke="#7E7A70" stroke-width="2"/>`;
  s += `<rect x="0" y="${h * .9}" width="${w}" height="${h * .035}" fill="url(#${id}gold)"/>
    <image href="${LOGO.light}" x="${w * .24}" y="${h * .16}" width="${w * .44}" height="${h * .66}" preserveAspectRatio="xMidYMid meet"/>
    </g>`;
  return s;
}

function wheel(cx, cy, r, ang) {
  return `<g transform="translate(${cx} ${cy}) rotate(${ang})"><circle r="${r}" fill="#111"/><circle r="${r * .55}" fill="${C.steel2}"/>
    ${[0, 60, 120].map((a) => `<rect x="${-r * .5}" y="-2" width="${r}" height="4" fill="${C.char}" transform="rotate(${a})"/>`).join('')}<circle r="${r * .14}" fill="${C.gold}"/></g>`;
}

export function deliveryTruck({ t = 0, p = .5, id = 'tr' } = {}) {
  const W = 1600, H = 900;
  const x = -1300 + p * 2500; // truck travels left → right
  const wheelA = (x * 1.6) % 360;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs(id)}
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1C1F"/><stop offset=".6" stop-color="#3A2F22"/><stop offset="1" stop-color="#6B4E28"/></linearGradient>
    <linearGradient id="${id}sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4428"/><stop offset="1" stop-color="#2A2018"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id}sky)"/>
    <circle cx="1220" cy="430" r="120" fill="${C.goldHi}" opacity=".9"/><circle cx="1220" cy="430" r="260" fill="url(#${id}glow)"/>`;
  // dunes parallax
  const dune = (yb, amp, col, sp, o) => {
    let d = `M0 ${H}`;
    for (let i = 0; i <= 32; i++) { const xx = i * 50; d += ` L${xx} ${yb - amp * (.5 + .5 * Math.sin(xx * .006 + o - p * sp))}`; }
    return `<path d="${d} L${W} ${H} Z" fill="${col}"/>`;
  };
  s += dune(560, 70, '#4A3923', 2, 0) + dune(620, 50, '#3A2C1C', 4, 2);
  // pylons / plant silhouette far
  for (let i = 0; i < 6; i++) { const px = ((i * 320 - p * 400) % 1900 + 1900) % 1900 - 150; s += `<g fill="#2A2119"><rect x="${px}" y="470" width="8" height="120"/><rect x="${px - 30}" y="480" width="68" height="5"/><rect x="${px - 20}" y="500" width="48" height="4"/></g>`; }
  s += `<rect x="0" y="650" width="${W}" height="${H - 650}" fill="url(#${id}sand)"/>
    <rect x="0" y="690" width="${W}" height="110" fill="#1E2023"/>
    <rect x="0" y="690" width="${W}" height="4" fill="#3A3F45"/>`;
  for (let i = 0; i < 12; i++) { const lx = ((i * 180 - p * 2400) % 2160 + 2160) % 2160 - 180; s += `<rect x="${lx}" y="743" width="90" height="6" fill="${C.goldHi}" opacity=".7"/>`; }
  // truck group
  s += `<g transform="translate(${x} 0)">
    <ellipse cx="560" cy="792" rx="660" ry="14" fill="#000" opacity=".45"/>
    <rect x="0" y="700" width="980" height="26" fill="${C.char}"/>
    <rect x="0" y="726" width="980" height="10" fill="${C.goldLo}"/>
    ${shelter(40, 470, 900, 230, id)}
    <rect x="70" y="440" width="140" height="30" fill="#C8C2B3" stroke="#7E7A70" stroke-width="2"/>
    ${[90, 170, 250].map((wx) => wheel(wx, 760, 30, wheelA)).join('')}
    ${[760, 840, 920].map((wx) => wheel(wx, 760, 30, wheelA)).join('')}
    <!-- tractor -->
    <rect x="990" y="706" width="80" height="20" fill="${C.char}"/>
    <path d="M1040 560 H1180 Q1210 560 1222 590 L1250 660 V740 H1040 Z" fill="#E9E5DA" stroke="${C.steel}" stroke-width="2"/>
    <path d="M1150 578 H1180 Q1200 580 1208 600 L1228 650 H1150 Z" fill="#1E2A31"/>
    <rect x="1040" y="690" width="210" height="14" fill="url(#${id}gold)"/>
    <rect x="1060" y="520" width="12" height="60" fill="${C.steel}"/>
    <rect x="1240" y="700" width="20" height="30" fill="${C.goldHi}"/>
    ${[1090, 1200].map((wx) => wheel(wx, 760, 32, wheelA)).join('')}
    </g>`;
  // speed lines
  for (let i = 0; i < 10; i++) { const ly = 520 + rnd(i) * 220, lx = ((rnd(i + 9) * 1600 - t * 900) % 1700 + 1700) % 1700 - 100; s += `<rect x="${lx}" y="${ly}" width="${80 + rnd(i + 3) * 120}" height="2" fill="#fff" opacity=".12"/>`; }
  s += `<rect width="${W}" height="${H}" fill="#000" opacity=".08"/>`;
  return s + '</svg>';
}

// ---------- 3. Structural steel frame being fabricated ----------
export function frameBuild({ t = 0, p = 1, id = 'fb' } = {}) {
  const W = 1600, H = 900;
  // isometric projection
  const iso = (X, Y, Z) => [780 + (X - Y) * 0.866 * 52, 400 + (X + Y) * 0.5 * 52 - Z * 52];
  const L = 9, D = 4, Hh = 4;
  const members = [];
  // columns
  for (let x = 0; x <= L; x += 3) for (const y of [0, D]) members.push([[x, y, 0], [x, y, Hh], 'col']);
  // bottom beams
  for (const y of [0, D]) members.push([[0, y, 0], [L, y, 0], 'beam']);
  for (let x = 0; x <= L; x += 3) members.push([[x, 0, 0], [x, D, 0], 'beam']);
  // floor joists
  for (let x = 1; x < L; x += 1) if (x % 3) members.push([[x, 0, 0], [x, D, 0], 'joist']);
  // roof beams
  for (const y of [0, D]) members.push([[0, y, Hh], [L, y, Hh], 'beam']);
  for (let x = 0; x <= L; x += 3) members.push([[x, 0, Hh], [x, D, Hh], 'beam']);
  // bracing
  members.push([[0, 0, 0], [3, 0, Hh], 'brace'], [[9, 0, 0], [6, 0, Hh], 'brace'], [[0, 0, 0], [0, D, Hh], 'brace'], [[9, 0, Hh], [9, D, 0], 'brace']);
  // roof purlins
  for (let y = 1; y < D; y++) members.push([[0, y, Hh], [L, y, Hh], 'joist']);

  const n = members.length;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs(id)}
    <radialGradient id="${id}spot" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#2A2F35"/><stop offset="1" stop-color="#0B0D0F"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id}spot)"/>`;
  // shop floor grid (iso)
  for (let i = -2; i <= 14; i++) { const a = iso(i, -3, 0), b = iso(i, 8, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-opacity=".04"/>`; }
  for (let j = -3; j <= 8; j++) { const a = iso(-2, j, 0), b = iso(14, j, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-opacity=".04"/>`; }
  // overhead crane rail suggestion
  s += `<rect x="0" y="90" width="${W}" height="14" fill="${C.steel}"/><rect x="${300 + 600 * ease(p)}" y="104" width="120" height="40" fill="${C.goldLo}"/><line x1="${360 + 600 * ease(p)}" y1="144" x2="${360 + 600 * ease(p)}" y2="260" stroke="${C.mute}" stroke-width="2"/>`;
  // draw members progressively; sort by depth for nicer layering
  const order = members.map((m, i) => ({ m, i })).sort((a, b) => (a.m[0][0] + a.m[0][1]) - (b.m[0][0] + b.m[0][1]));
  let spark = null;
  order.forEach(({ m }, k) => {
    const start = (k / n) * .85, dur = .15;
    const q = seg(p, start, start + dur);
    if (q <= 0) return;
    const A = iso(...m[0]), B = iso(...m[1]);
    const ex = A[0] + (B[0] - A[0]) * q, ey = A[1] + (B[1] - A[1]) * q;
    const wdt = m[2] === 'col' ? 10 : m[2] === 'beam' ? 9 : m[2] === 'brace' ? 4 : 5;
    const col = m[2] === 'brace' ? C.gold : m[2] === 'joist' ? '#6E7781' : '#8D96A0';
    s += `<line x1="${A[0]}" y1="${A[1]}" x2="${ex}" y2="${ey}" stroke="#000" stroke-opacity=".35" stroke-width="${wdt + 4}" stroke-linecap="round"/>
      <line x1="${A[0]}" y1="${A[1]}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="${wdt}" stroke-linecap="round"/>
      <line x1="${A[0]}" y1="${A[1] - wdt * .3}" x2="${ex}" y2="${ey - wdt * .3}" stroke="#fff" stroke-opacity=".18" stroke-width="${wdt * .25}"/>`;
    if (q > 0 && q < 1) spark = [ex, ey];
    if (q >= 1) s += `<circle cx="${B[0]}" cy="${B[1]}" r="${wdt * .55}" fill="${C.goldHi}" opacity=".55"/>`;
  });
  if (!spark && p >= 1) spark = null;
  if (spark) {
    const [sx, sy] = spark;
    s += `<circle cx="${sx}" cy="${sy}" r="70" fill="url(#${id}glow)"/><circle cx="${sx}" cy="${sy}" r="9" fill="#fff"/>`;
    for (let i = 0; i < 26; i++) {
      const life = (t * 3 + rnd(i)) % 1, ang = rnd(i + 40) * Math.PI * 2, sp = 40 + rnd(i + 80) * 140;
      const px = sx + Math.cos(ang) * sp * life, py = sy + Math.sin(ang) * sp * life + 160 * life * life;
      s += `<line x1="${px}" y1="${py}" x2="${px - Math.cos(ang) * 10}" y2="${py - Math.sin(ang) * 10}" stroke="${C.goldHi}" stroke-width="2.4" opacity="${1 - life}"/>`;
    }
  }
  s += `<radialGradient id="${id}vig" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${id}vig)"/>`;
  return s + '</svg>';
}

// ---------- 4. Engineering blueprint (shop drawing draws itself) ----------
export function blueprint({ t = 0, p = 1, id = 'bp' } = {}) {
  const W = 1600, H = 900;
  const dash = (len, q) => `stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - clamp(q))}"`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs(id)}</defs>
    <rect width="${W}" height="${H}" fill="#101418"/>${grid(W, H, 40, C.gold, .06)}${grid(W, H, 200, C.gold, .08)}`;
  const st = `fill="none" stroke="${C.goldHi}" stroke-width="2.5"`;
  // plan view of the room
  s += `<g transform="translate(260 200)">
    <rect x="0" y="0" width="760" height="380" ${st} ${dash(2280, seg(p, 0, .35))}/>
    <rect x="12" y="12" width="736" height="356" fill="none" stroke="${C.gold}" stroke-width="1" ${dash(2184, seg(p, .1, .4))}/>
    <path d="M60 0 v-30 M300 0 v-30 M60 -20 H300" fill="none" stroke="${C.mute}" stroke-width="1.5" ${dash(320, seg(p, .35, .5))}/>
    <path d="M0 -60 H760 M0 -70 v20 M760 -70 v20" fill="none" stroke="${C.mute}" stroke-width="1.5" ${dash(820, seg(p, .35, .55))}/>
    <text x="380" y="-72" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="${C.goldHi}" opacity="${seg(p, .45, .55)}">12 192</text>
    <path d="M-60 0 V380 M-70 0 h20 M-70 380 h20" fill="none" stroke="${C.mute}" stroke-width="1.5" ${dash(420, seg(p, .4, .6))}/>
    <text x="-80" y="195" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="${C.goldHi}" transform="rotate(-90 -80 195)" opacity="${seg(p, .5, .6)}">3 000</text>
    <path d="M140 300 Q380 220 620 300" fill="none" stroke="${C.goldHi}" stroke-width="2" ${dash(520, seg(p, .45, .65))}/>
    <path d="M150 330 Q380 250 610 330" fill="none" stroke="${C.goldHi}" stroke-width="2" ${dash(500, seg(p, .5, .7))}/>
    <rect x="200" y="20" width="360" height="40" fill="none" stroke="${C.proc}" stroke-width="2" ${dash(800, seg(p, .55, .7))}/>
    <text x="380" y="46" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="${C.proc}" opacity="${seg(p, .65, .75)}">CONTROL PANELS</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 0}" y="${80 + i * 70}" width="50" height="60" fill="none" stroke="${C.gold}" stroke-width="1.5" ${dash(220, seg(p, .55 + i * .04, .7 + i * .04))}/>`).join('')}
    ${[0, 1, 2, 3].map((i) => `<rect x="690" y="${80 + i * 70}" width="50" height="60" fill="none" stroke="${C.gold}" stroke-width="1.5" ${dash(220, seg(p, .6 + i * .04, .75 + i * .04))}/>`).join('')}
    <path d="M760 160 h-6 a70 70 0 0 1 -70 -70" fill="none" stroke="${C.mute}" stroke-width="1.5" ${dash(140, seg(p, .7, .8))}/>
    <text x="380" y="420" text-anchor="middle" font-family="JetBrains Mono" font-size="14" letter-spacing="3" fill="${C.mute}" opacity="${seg(p, .7, .85)}">PLAN VIEW — SCADA CONTROL SHELTER · 12.2 × 3.0 M</text>
  </g>`;
  // title block
  s += `<g transform="translate(1100 560)" opacity="${seg(p, .6, .9)}">
    <rect width="380" height="200" fill="#0B0E11" stroke="${C.gold}" stroke-width="2"/>
    <line x1="0" y1="50" x2="380" y2="50" stroke="${C.gold}"/><line x1="0" y1="100" x2="380" y2="100" stroke="${C.gold}"/><line x1="190" y1="100" x2="190" y2="200" stroke="${C.gold}"/><line x1="0" y1="150" x2="380" y2="150" stroke="${C.gold}"/>
    <image href="${LOGO.mark.replace('sws-mark','sws-mark-white')}" x="14" y="8" width="90" height="34" preserveAspectRatio="xMinYMid meet"/><text x="112" y="32" font-family="Montserrat" font-weight="800" font-size="16" fill="${C.goldHi}" letter-spacing="2">SHOP DRAWING</text>
    <text x="16" y="82" font-family="JetBrains Mono" font-size="14" fill="${C.text}">SCADA CONTROL SHELTER — GA</text>
    <text x="16" y="131" font-family="JetBrains Mono" font-size="12" fill="${C.mute}">DWG SWS-SCS-001</text>
    <text x="206" y="131" font-family="JetBrains Mono" font-size="12" fill="${C.mute}">REV  C  · IFC</text>
    <text x="16" y="181" font-family="JetBrains Mono" font-size="12" fill="${C.mute}">CHK  QA/QC</text>
    <text x="206" y="181" font-family="JetBrains Mono" font-size="12" fill="${C.ok}">APPROVED</text>
  </g>`;
  // scanning line
  const sx = 200 + ((t * 260) % 1300);
  s += `<rect x="${sx}" y="0" width="2" height="${H}" fill="${C.goldHi}" opacity=".18"/><rect x="${sx - 60}" y="0" width="60" height="${H}" fill="${C.goldHi}" opacity=".03"/>`;
  return s + '</svg>';
}

// ---------- 5. Shelter in paint bay (coating & fit-out) ----------
export function coatingBay({ t = 0, p = 1, id = 'cb' } = {}) {
  const W = 1600, H = 900;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs(id)}
    <linearGradient id="${id}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22272C"/><stop offset="1" stop-color="#121417"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id}wall)"/>`;
  for (let i = 0; i < 9; i++) s += `<rect x="${i * 190 + 20}" y="40" width="150" height="10" rx="5" fill="${C.goldHi}" opacity=".7"/><ellipse cx="${i * 190 + 95}" cy="60" rx="140" ry="40" fill="url(#${id}glow)" opacity=".35"/>`;
  s += `<rect x="0" y="690" width="${W}" height="${H - 690}" fill="#0D0F11"/>`;
  for (let i = 0; i < 20; i++) s += `<rect x="${i * 85}" y="690" width="40" height="${H - 690}" fill="${C.gold}" opacity=".035" transform="skewX(-20)"/>`;
  s += `<rect x="260" y="660" width="1080" height="30" fill="${C.steel}"/>` + shelter(300, 380, 1000, 280, id, ease(p));
  // spray mist at paint front
  if (p < 1) {
    const fx = 300 + 1000 * ease(p);
    for (let i = 0; i < 40; i++) {
      const life = (t * 2 + rnd(i)) % 1;
      s += `<circle cx="${fx + 10 + life * 120 * rnd(i + 5)}" cy="${400 + rnd(i + 7) * 240 + (life - .5) * 30}" r="${2 + life * 8}" fill="#F4F1EA" opacity="${(1 - life) * .35}"/>`;
    }
  }
  // gauge tag: DFT reading
  s += `<g transform="translate(1180 200)" opacity="${seg(p, .3, .5)}"><rect width="300" height="110" rx="6" fill="#0B0D0F" stroke="${C.gold}" stroke-width="2"/>
    <text x="20" y="34" font-family="JetBrains Mono" font-size="15" fill="${C.mute}">DFT CHECK · µm</text>
    <text x="20" y="84" font-family="Montserrat" font-weight="800" font-size="40" fill="${C.goldHi}">${Math.round(80 + 240 * ease(seg(p, .3, 1)))}</text>
    <text x="170" y="84" font-family="JetBrains Mono" font-size="15" fill="${seg(p, .95, 1) > 0 ? C.ok : C.mute}">${p > .95 ? 'PASS ✓' : 'MEASURING'}</text></g>`;
  return s + '</svg>';
}

export const palette = C;
export const util = { clamp, ease, seg, rnd };
