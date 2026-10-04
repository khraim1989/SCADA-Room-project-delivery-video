"""Generates the A3 HVAC layout drawing (SVG → PDF/PNG). Values are read from the recalculated workbook."""
import base64, asyncio, pathlib, datetime
from openpyxl import load_workbook

ROOT = pathlib.Path(__file__).resolve().parent.parent
XLSX = ROOT / 'hvac/SWS-SCADA-Room-HVAC-Heat-Load-and-Selection.xlsx'
wb = load_workbook(XLSX, data_only=True)
db = {wb['Design Basis'].cell(r, 1).value: wb['Design Basis'].cell(r, 3).value for r in range(6, 60) if wb['Design Basis'].cell(r, 1).value}
hl, us = wb['Heat Load'], wb['Unit Selection']
LOAD_KW, LOAD_TR = hl['C24'].value, hl['C25'].value
SENS, LAT = hl['E22'].value, hl['F22'].value
SIZE_TR, SIZE_KW, CAP_N = us['C15'].value, us['C16'].value, us['C18'].value
assert None not in (LOAD_KW, SIZE_TR, CAP_N), 'Run recalc.py on the workbook first'
POS = [wb['Equipment Schedule'].cell(r, 3).value for r in (4, 6, 8)]  # AC-01..03 positions (m)

logo = base64.b64encode((ROOT / 'assets/logo/sws-logo.png').read_bytes()).decode()
L, W, H, SKID = 12192, 2438, 2894, 1585
INK, RED, BLUE, ORG, GRY = '#1d1d1d', '#c0392b', '#1f5fbf', '#e84e0e', '#8a8a8a'
s = []  # svg parts
def add(x): s.append(x)
def T(x, y, t, size=2.2, anchor='start', w='400', fill=INK, rot=None, ital=False):
    tr = f' transform="rotate({rot} {x} {y})"' if rot else ''
    st = ' font-style="italic"' if ital else ''
    add(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" text-anchor="{anchor}" font-weight="{w}" fill="{fill}"{tr}{st}>{t}</text>')
def R(x, y, w, h, sw=.25, fill='none', stroke=INK, dash=None, rx=0):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')
def Ln(x1, y1, x2, y2, sw=.25, stroke=INK, dash=None, marker=''):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    m = f' marker-end="url(#{marker})"' if marker else ''
    add(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" stroke-width="{sw}"{d}{m}/>')
def dim_h(x1, x2, y, label, off=0):
    Ln(x1, y, x2, y, .18, marker=''); Ln(x1, y - 1.5, x1, y + 1.5, .18); Ln(x2, y - 1.5, x2, y + 1.5, .18)
    add(f'<path d="M{x1+1.6:.2f} {y-.6:.2f} L{x1:.2f} {y:.2f} L{x1+1.6:.2f} {y+.6:.2f}M{x2-1.6:.2f} {y-.6:.2f} L{x2:.2f} {y:.2f} L{x2-1.6:.2f} {y+.6:.2f}" fill="none" stroke="{INK}" stroke-width=".18"/>')
    T((x1 + x2) / 2, y - 1, label, 2, 'middle')
def dim_v(x, y1, y2, label):
    Ln(x, y1, x, y2, .18); Ln(x - 1.5, y1, x + 1.5, y1, .18); Ln(x - 1.5, y2, x + 1.5, y2, .18)
    T(x - 1, (y1 + y2) / 2, label, 2, 'middle', rot=-90)
def mesh(x, y, w, h, stroke=INK):
    R(x, y, w, h, .3, stroke=stroke)
    i = 0.0
    while i < w + h:
        x1, y1 = x + max(0, i - h), y + min(h, i); x2, y2 = x + min(w, i), y + max(0, i - w)
        Ln(x1, y1, x2, y2, .1, stroke=GRY); i += 1.4
def tag(x, y, t, color=BLUE):
    add(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="2.6" fill="#fff" stroke="{color}" stroke-width=".3"/>'); T(x, y + .7, t, 1.7, 'middle', '700', color)

# ---------- frame ----------
add(f'<rect x="0" y="0" width="420" height="297" fill="#fff"/>')
R(8, 8, 404, 281, .6)
for i, c in enumerate('ABCD'):
    T(4.5, 281 - i * 70 - 30, c, 3, 'middle'); T(415.5, 281 - i * 70 - 30, c, 3, 'middle')
for i in range(6):
    T(408 - i * 67 - 33, 6, str(i + 1), 3, 'middle'); T(408 - i * 67 - 33, 294.5, str(i + 1), 3, 'middle')
add(f'<text x="210" y="20" font-size="3" text-anchor="middle" fill="{RED}" font-weight="700" letter-spacing=".4">FOR REVIEW — NOT FOR CONSTRUCTION · DESIGN BASIS ASSUMPTIONS TO BE CONFIRMED</text>')

# ---------- PLAN 1:50 ----------
sc = 1 / 50; px, py = 22, 52
Lp, Wp, t = L * sc, W * sc, 50 * sc * 2
T(px, py - 25, 'PLAN — SCADA ROOM HVAC LAYOUT', 3.2, w='700'); T(px, py - 21.2, 'SCALE 1:50', 2.2, fill=GRY)
R(px, py, Lp, Wp, .5); R(px + t, py + t, Lp - 2 * t, Wp - 2 * t, .25)
# end doors (per GA, both ends)
for xd in (px, px + Lp):
    R(xd - .6, py + Wp * .2, 1.2, Wp * .6, .25, fill='#fff')
T(px - 2, py + Wp / 2, 'ACCESS (PER GA)', 1.6, 'middle', rot=-90, fill=GRY); T(px + Lp + 3.2, py + Wp / 2, 'ACCESS (PER GA)', 1.6, 'middle', rot=-90, fill=GRY)
# equipment zone (by others) along south wall
R(px + 18, py + Wp - t - 12, Lp - 36, 11, .25, fill='#f4f4f4', stroke=GRY, dash='1.2 .8')
T(px + Lp / 2, py + Wp - t - 5.4, f'SCADA / RTU PANELS, UPS &amp; DBs (BY OTHERS) — HEAT DISSIPATION {db["DB-15"]:.1f} kW (ASSUMED)', 1.9, 'middle', '700', GRY)
# AC units along north wall
for i, x_m in enumerate(POS):
    cx = px + x_m * 1000 * sc
    R(cx - 10, py + t, 20, 5, .35, fill='#e8f0fb', stroke=BLUE)                       # IDU 1000x250
    T(cx, py + t + 3.4, 'IDU', 1.6, 'middle', '700', BLUE)
    mesh(cx - 9, py - 7.5, 18, 7, BLUE)                                                   # ODU 900x350 + mesh guard
    Ln(cx - 2, py - .5, cx - 2, py + t, .35, BLUE); Ln(cx + 2, py - .5, cx + 2, py + t, .35, BLUE)  # refrigerant via sleeve
    Ln(cx + 6, py + t + 5, cx + 6, py - 9.5, .3, ORG, '1 .6')                            # condensate out
    for k in (-1, 0, 1):                                                                  # air throw
        Ln(cx + k * 6, py + t + 6, cx + k * 9, py + t + 22, .25, BLUE, '.8 .8', 'arr')
    tag(cx - 15, py - 4, f'0{i+1}')
    T(cx, py - 9.5, f'AC-0{i+1}', 2, 'middle', '700', BLUE)
# controller
R(px + Lp - t - 9, py + t + 6, 3.2, 3.2, .3, fill='#fff', stroke=ORG); T(px + Lp - t - 7.4, py + t + 8.3, 'C', 1.8, 'middle', '700', ORG)
T(px + Lp - t - 11, py + t + 8.3, 'CTRL-01', 1.7, 'end', '700', ORG)
Ln(px + Lp - t - 9, py + t + 7.6, px + POS[2] * 1000 * sc + 10, py + t + 2.5, .2, ORG, '.6 .6')
# dimensions
dim_h(px, px + Lp, py + Wp + 8, f'{L:,}')
prev = px
for i, x_m in enumerate(POS):
    cx = px + x_m * 1000 * sc
    dim_h(prev, cx, py - 14, f'{round((x_m - (POS[i-1] if i else 0)) * 1000):,}'); prev = cx
dim_v(px - 6, py, py + Wp, f'{W:,}')
T(px + POS[2] * 1000 * sc + 2, py - 16, 'C/L OF UNITS', 1.6, fill=GRY)
# section cut marks
cut = px + (POS[1] + .55) * 1000 / 50   # section through AC-02 indoor unit
Ln(cut, py - 18, cut, py + Wp + 14, .25, INK, '3 1 .6 1')
T(cut + 1, py - 18.5, 'A', 2.6, w='700'); T(cut + 1, py + Wp + 16, 'A', 2.6, w='700')

# ---------- ELEVATION 1:50 ----------
ex, ey = 22, 212; sc = 1 / 50
Le, He, Se = L * sc, H * sc, SKID * sc
T(ex, ey - Se - He - 9, 'FRONT ELEVATION (A/C WALL) — PER GA SHEET 1', 3.2, w='700'); T(ex, ey - Se - He - 5.2, 'SCALE 1:50', 2.2, fill=GRY)
yb = ey  # ground line
Ln(ex - 6, yb, ex + Le + 6, yb, .5)
top = yb - Se - He
R(ex, yb - Se - He, Le, He, .45)
for k in range(1, 24): Ln(ex + k * Le / 24, top + .8, ex + k * Le / 24, yb - Se - .8, .1, GRY)
# skid
R(ex, yb - Se, Le, 4.8, .4, fill='#efefef')
for k in range(5):
    lx = ex + k * (Le - 2) / 4
    R(lx, yb - Se + 4.8, 2, Se - 4.8, .3, fill='#efefef')
for k in range(4):
    x1 = ex + 2 + k * (Le - 2) / 4; x2 = ex + (k + 1) * (Le - 2) / 4
    Ln(x1, yb - 2, (x1 + x2) / 2, yb - Se + 4.8, .2); Ln((x1 + x2) / 2, yb - Se + 4.8, x2, yb - 2, .2)
for i, x_m in enumerate(POS):
    cx = ex + x_m * 1000 * sc
    mesh(cx - 9, yb - Se - 14 - 14, 18, 14, BLUE)                       # ODU 900 x 700 at 700 sill
    R(cx - 10, top + 6, 20, 6, .3, stroke=BLUE, dash='1 .6')           # IDU hidden (inside)
    Ln(cx + 6, top + 12, cx + 6, yb - Se - 1, .3, ORG, '1 .6')
    T(cx, yb - Se - 31, f'AC-0{i+1} ODU', 1.8, 'middle', '700', BLUE)
T(ex + Le - 1, top - 1.5, 'IDU (HIDDEN, +2.2 m)', 1.7, 'end', fill=BLUE)
T(ex + Le + 2, yb - Se - 16, 'ODU + MESH', 1.7, fill=BLUE)
T(ex + Le + 2, yb - Se - 6, 'CONDENSATE', 1.7, fill=ORG)
dim_h(ex, ex + Le, yb + 6, f'{L:,}')
dim_v(ex - 6, top, yb - Se, f'{H:,}'); dim_v(ex - 11, yb - Se, yb, f'{SKID:,}')

# ---------- SECTION A-A 1:40 ----------
sx, sy = 300, 134; sc = 1 / 50
Ws, Hs, Ss = W * sc, H * sc, SKID * sc
T(sx - 26, 27, 'SECTION A-A', 3.2, w='700'); T(sx - 26, 30.8, 'SCALE 1:50', 2.2, fill=GRY)
yb = sy; top = yb - Ss - Hs
Ln(sx - 18, yb, sx + Ws + 8, yb, .5)
R(sx, top, Ws, Hs, .5); R(sx + 1.25, top + 1.25, Ws - 2.5, Hs - 2.5, .25)
R(sx - 3, yb - Ss, Ws + 6, 4, .4, fill='#efefef')
for lx in (sx - 3, sx + Ws + 1): R(lx, yb - Ss + 4, 2, Ss - 4, .3, fill='#efefef')
# IDU at +2.2m on left (A/C) wall
iy = yb - Ss - 2200 * sc
R(sx + 1, iy - 6, 5.2, 6, .35, fill='#e8f0fb', stroke=BLUE); T(sx + 7, iy - 2.5, 'IDU', 1.7, w='700', fill=BLUE)
for k in range(3): Ln(sx + 6.4, iy - 1.5 + k, sx + 18 + k * 3, iy + 6 + k * 6, .25, BLUE, '.8 .8', 'arr')
# ODU outside on bracket at 700 sill
oy = yb - Ss - 700 * sc
mesh(sx - 10, oy - 14, 9, 14, BLUE); Ln(sx - 10, oy, sx, oy + 2.5, .35)
T(sx - 1, oy - 16, 'ODU', 1.6, 'end', w='700', fill=BLUE)
Ln(sx - 1.5, iy - 4, sx - 1.5, oy - 10, .35, BLUE); Ln(sx - .6, iy - 4, sx - .6, oy - 10, .35, BLUE)
T(sx - 12, top + 2, 'REFRIGERANT VIA SLEEVE', 1.5, 'end', fill=BLUE)
Ln(sx + 1, iy - .5, sx - 12, iy + 1.5, .3, ORG, '1 .6'); Ln(sx - 12, iy + 1.5, sx - 12, yb - Ss - 1, .3, ORG, '1 .6')
T(sx - 13, yb - Ss - 3, 'DRAIN 1:100', 1.5, 'end', fill=ORG)
T(sx + Ws / 2, top + Hs - 3, 'CHECKER PLATE', 1.5, 'middle', fill=GRY)
T(sx + Ws / 2, top + 4.2, 'SANDWICH PANELS', 1.5, 'middle', fill=GRY)
dim_v(sx + Ws + 6, top, yb - Ss, f'{H:,}'); dim_v(sx + Ws + 11, yb - Ss, iy, '2,200')
dim_h(sx, sx + Ws, yb + 5, f'{W:,}')

# ---------- LEGEND ----------
lx, ly = 364, 27
T(lx, ly, 'LEGEND', 2.6, w='700')
items = [('idu', 'Split A/C indoor unit (IDU)'), ('odu', 'Outdoor unit with mesh guard (ODU)'), ('ref', 'Refrigerant pair via sealed sleeve'),
         ('cond', 'Condensate drain (gravity)'), ('air', 'Supply air throw'), ('ctrl', 'Lead/lag controller CTRL-01'), ('eq', 'Equipment zone (by others)')]
for k, (kind, label) in enumerate(items):
    yy = ly + 5 + k * 5.2
    if kind == 'idu': R(lx, yy - 2.5, 7, 3, .3, fill='#e8f0fb', stroke=BLUE)
    if kind == 'odu': mesh(lx, yy - 3, 7, 3.5, BLUE)
    if kind == 'ref': Ln(lx, yy - 1.5, lx + 7, yy - 1.5, .35, BLUE); Ln(lx, yy - .5, lx + 7, yy - .5, .35, BLUE)
    if kind == 'cond': Ln(lx, yy - 1, lx + 7, yy - 1, .35, ORG, '1 .6')
    if kind == 'air': Ln(lx, yy - 1, lx + 7, yy - 1, .3, BLUE, '.8 .8', 'arr')
    if kind == 'ctrl': R(lx + 2, yy - 2.6, 3, 3, .3, stroke=ORG)
    if kind == 'eq': R(lx, yy - 2.6, 7, 3, .25, fill='#f4f4f4', stroke=GRY, dash='1 .6')
    T(lx + 9, yy, label, 1.9)

# ---------- TABLES ----------
def table(x, y, title, cols, rows, widths, fs=1.85, rh=4.4):
    T(x, y, title, 2.6, w='700'); y += 2
    tw = sum(widths)
    R(x, y, tw, rh, .25, fill='#2b2b2b', stroke='#2b2b2b')
    cx = x
    for c, w in zip(cols, widths): T(cx + 1, y + rh - 1.3, c, fs, w='700', fill='#fff'); cx += w
    for i, row in enumerate(rows):
        yy = y + rh * (i + 1)
        R(x, yy, tw, rh, .15, fill='#f6f4ef' if i % 2 else '#fff', stroke='#cfcfcf')
        cx = x
        for v, w in zip(row, widths): T(cx + 1, yy + rh - 1.3, v, fs); cx += w
    return y + rh * (len(rows) + 1)
sched = [[f'AC-0{i+1}', f'{p:.2f} m', f'{SIZE_TR:.1f} TR / {SIZE_KW:.1f} kW', 'T3 split, wall IDU', 'Lead / lag'] for i, p in enumerate(POS)]
sched.append(['CTRL-01', 'Entrance', '—', 'Duty-standby ctrl', '24 h rotation'])
y2 = table(282, 150, 'EQUIPMENT SCHEDULE', ['TAG', 'FROM LEFT END', 'NOMINAL', 'TYPE', 'MODE'], sched, [17, 22, 30, 30, 26])
basis = [
    ['Outdoor design', f'{db["DB-01"]:.0f} °C DB · {db["DB-02"]:.0f} g/kg'], ['Indoor design', f'{db["DB-03"]:.0f} °C · ≈50 % RH'],
    ['Envelope U-value', f'{db["DB-10"]:.2f} W/m²K walls & roof'], ['Equipment heat (assumed)', f'{db["DB-15"]:.1f} kW'],
    ['Design cooling load', f'{LOAD_KW:.2f} kW ({LOAD_TR:.2f} TR) incl. {db["DB-22"]*100:.0f} % margin'],
    ['Sensible / latent', f'{SENS/1000:.2f} kW / {LAT/1000:.2f} kW'],
    ['Selection (N+1)', f'3 × {SIZE_TR:.1f} TR · 2 running = {CAP_N:.1f} kW at design ambient'],
]
table(282, y2 + 7, 'DESIGN BASIS & LOAD SUMMARY', ['ITEM', 'VALUE'], basis, [40, 85])

# ---------- NOTES ----------
notes = [
    '1. All dimensions in mm unless noted. Shelter geometry and A/C positions from GA drawing SWS-2286 Rev 0, sheets 1–2.',
    '2. Load calculation: SWS-SCADA-Room-HVAC-Heat-Load-and-Selection.xlsx (simplified CLTD, ASHRAE). Assumptions to be confirmed.',
    '3. Units: T3 tropical-rated split A/C, coastal-protected condenser coil, auto-restart, low/high-ambient protection.',
    '4. Redundancy N+1: any two units hold 24 °C at design ambient. Controller rotates duty every 24 h, starts standby at 28 °C or on fault.',
    '5. Fire & gas: all A/C units tripped by F&G panel on confirmed fire; common alarm and high-temperature alarm to SCADA.',
    '6. Condensate: gravity drain, min 1:100 fall, discharged outside clear of skid, cable trays and access platforms.',
    '7. Wall penetrations: sealed sleeves, fire-rated where required; ODU guards galvanised mesh per GA.',
]
T(22, 229, 'GENERAL NOTES', 2.6, w='700')
for i, n in enumerate(notes): T(22, 234 + i * 3.6, n, 1.85)

# ---------- TITLE BLOCK ----------
bx, by, bw, bh = 252, 251, 160, 38
R(bx, by, bw, bh, .45)
add(f'<image href="data:image/png;base64,{logo}" x="{bx+2}" y="{by+2}" width="40" height="20" preserveAspectRatio="xMidYMid meet"/>')
T(bx + 2, by + 25, 'Specialist Welding Solutions Co. for Industrial', 1.7, w='700')
T(bx + 2, by + 28.3, 'Dammam 2nd Industrial City, KSA', 1.6)
T(bx + 2, by + 31.6, 'INFO@SWSWELD.COM', 1.6)
T(bx + 2, by + 34.9, 'Aramco Approved Vendor 10118949 · CR 2050082045', 1.6)
Ln(bx + 46, by, bx + 46, by + bh, .3)
rows = [('TITLE', '40FT E-HOUSE — SCADA ROOM — HVAC LAYOUT'), ('CLIENT', '(withheld)'), ('DWG NO', 'SWS-2286-HVAC-01'),
        ('REV', 'A — FOR REVIEW'), ('DATE', datetime.date.today().strftime('%d/%m/%Y')), ('SCALE', 'AS SHOWN (A3)'), ('SHEET', '1 OF 1')]
for i, (k, v) in enumerate(rows):
    yy = by + i * (bh / len(rows))
    if i: Ln(bx + 46, yy, bx + bw, yy, .2)
    T(bx + 48, yy + 4, k, 1.7, fill=GRY); T(bx + 64, yy + 4, v, 2.1, w='700' if i == 0 else '400')
Ln(bx + 62, by, bx + 62, by + bh, .2)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" width="420mm" height="297mm" font-family="Liberation Sans, Arial, sans-serif">
<defs><marker id="arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="{BLUE}"/></marker></defs>
{''.join(s)}</svg>'''
(ROOT / 'hvac/SWS-SCADA-Room-HVAC-Layout-A3.svg').write_text(svg, encoding='utf-8')

async def render():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium'); pg = await b.new_page(viewport={'width': 1587, 'height': 1123}, device_scale_factor=2.5)
        await pg.set_content(f'<html><head><style>@page{{size:420mm 297mm;margin:0}}html,body{{margin:0}}</style></head><body>{svg}</body></html>')
        await pg.pdf(path=str(ROOT / 'hvac/SWS-SCADA-Room-HVAC-Layout-A3.pdf'), width='420mm', height='297mm', print_background=True)
        px_svg = svg.replace('width="420mm" height="297mm"', 'width="1587" height="1123"')
        await pg.set_content('<html><body style="margin:0">' + px_svg + '</body></html>')
        await pg.screenshot(path=str(ROOT / 'hvac/SWS-SCADA-Room-HVAC-Layout-A3.png'), full_page=True)
        await b.close()
asyncio.run(render())
print('ok', round(LOAD_KW, 2), SIZE_TR, round(CAP_N, 2), POS)
