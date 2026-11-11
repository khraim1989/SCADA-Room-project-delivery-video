# SWS: SCADA Room Project (Complete Project Record)

> Upload this file to a Claude chat to continue the work. It records everything produced in this project: facts, content rules, decisions, every deliverable, the website, the drawings, the HVAC work, all post and ad copy, and the open items.
> Last updated: 11 Nov 2026 · Repository: `khraim1989/SCADA-Room-project-delivery-video`, branch `ccr-50639e43-20gvei`

---

## 1. Summary
For the **SCADA Room** that SWS delivered, this project produced:
- a full **marketing media kit**: videos, social posts, poster, carousel and branded photos
- a **case-study website**, live on GitHub Pages
- the **redacted GA drawings**
- an **HVAC engineering check**
- a separate **HVAC capability ad campaign**

Everything uses the real project photos, the official SWS logo and consistent content rules.

---

## 2. Company
| Item | Value |
|---|---|
| Name | Specialist Welding Solutions Co. for Industrial (SWS) |
| Arabic | شركة حلول اللحام المختص للصناعة |
| Location | Dammam 2nd Industrial City, KSA |
| Credential | Aramco Approved Vendor, Code **10118949** |
| Commercial Registration | **CR 2050082045** |
| Contact (the only contact used anywhere) | **INFO@SWSWELD.COM** |
| Tagline | Engineered. Fabricated. Delivered. |
| Brand colours (logo) | SWS blue `#0E4194`, spark orange `#E84E0E`, on charcoal |
| Website palette ("Engineered Premium") | charcoal `#2B2B2B`, gold `#B08D57`, off-white `#F4F2EE`, grey `#6B6B6B` |
| Logo files | `assets/logo/`: original; on-light; white version for dark backgrounds; welder-mark only; white watermark |

---

## 3. Project Facts (only these are used)
- **Package:** three 40 ft high-cube E-House shelters (2 Control Vanes + 1 SCADA Room) for *a major pipeline project in the Eastern Province*.
- **SCADA Room:** delivered **8 days and 16 working hours** after GA drawings were issued. It was presented, crane-lifted, loaded and dispatched on **30 Sep 2026**.
- **Control Vanes:** to follow, **planned mid-Oct 2026**. The 8 d / 16 h claim never applies to them.
- **Fully in-house:** engineering and GA drawings (issued **22 Sep 2026**), fabrication, coating, electrical and power-distribution fit-out.
- **SCADA Room scope:**
  - HEB 240 skid with HEB 180 supports
  - lifting trunnions, platforms and stairs
  - insulated sandwich wall panels and checker-plate floor
  - primer and coating system
  - power distribution and cable trays
  - 3 split A/C units
  - fire and gas
- **Dimensions** (GA drawing): 12,192 mm overall · 2,894 mm shelter height · 1,585 mm skid height · skid bays 3 × 3,000 + 2,952 mm.
- **Stats used in the designs:** 8 Days (SCADA Room) · 16 Hours (SCADA Room) · 3 E-Houses in package · 100% in-house.
- **Quote:** "Engineering to dispatch, fully in-house: the SCADA Room left our yard 8 days and 16 hours after GA drawings were issued." Mohammad Khraim, Acting General Manager.

---

## 4. Content Rules (apply to everything)
1. **No client or end-user names**, and no client logos. Use *"a major pipeline project in the Eastern Province"*.
   - "Aramco" appears only in the *Aramco Approved Vendor 10118949* credential.
   - The website has a flag, `SHOW_CLIENT_NAMES = false` in `site/script.js`, to switch names on after **written approval**.
2. **No prices**, SAR figures, margins, PO or contract numbers, or payment terms.
3. **8 days / 16 hours = SCADA Room only.**
4. **Contact = INFO@SWSWELD.COM only.** The personal email, mobile and website were removed from every file. They were also removed from the git history, which was rewritten at your request.
5. **No ISO or "0 LTI" claims.** The website shows only an "ISO-ready: details on request" placeholder.
6. **No equipment brand marks.** The A/C maker's logo is masked in the photos.

---

## 5. Redactions Done
| What | Where | How |
|---|---|---|
| Client nameplate on the shelter | photos `loadout-night`, `loadout-night-2`, `crane-lift`, `team-lift`, `team-four` | Greyscale, pixelated and blurred patch |
| Client name on the GA title block | both drawing sheets | Replaced with "(withheld)", flattened at 300 dpi so the text can't be recovered |
| Internal CAD file path | both drawing sheets | Removed |
| Data-plate photo (shows the PO number) | n/a | Never used |
| Phone watermarks ("Galaxy S24 Ultra") | night photos | Cropped |
| A/C maker logo | `hvac-indoor-unit`, `hvac-indoor-unit-2` | Blurred |
| Personal contacts | all files and git history | Removed; branch squashed and force-pushed |

Unredacted originals are **not** in the repo. Keep them in the internal drawing register.

---

## 6. Source Material
- **Google Drive folder** `1o9ab9Wldt998X6tpvtYKqegWuzKEXcEZ`: 64 photos and 7 phone videos.
  - The videos (11–422 MB) and the 6–9 MB phone photos could **not** be fetched. The container blocks `drive.google.com`, and the connector limit is 10 MB.
  - To use them: allow `drive.google.com` and `drive.usercontent.google.com` in the environment's network settings, or upload clips under 10 MB.
- **Curated photos** (`assets/photos/`, 29): resized to 2400 px, metadata stripped. Each design picks photos by role, through `project.config.json → photos`.
  - Yard and night: `hero-yard`, `yard-side`, `side`, `three-quarter`, `front-open`, `loadout-night`, `loadout-night-2`
  - Crane lift: `crane-lift`, `crane-lift-wide`
  - Fabrication: `welding`, `skid-frame`, `bolted-connection` (lifting trunnion), `base-plate`, `cable-tray`
  - Fit-out and safety: `db-panel`, `interior`, `interior-work`, `fire-exit`, `fire-callpoint`
  - HVAC: `hvac` (caged outdoor units), `hvac-indoor-unit`, `hvac-indoor-unit-2`, `hvac-ceiling`
  - Inspection and team: `inspection`, `interior-inspection`, `fat-team`, `team-lift`, `team-four`, `team-night`
- **GA drawings** (uploaded): **SWS-2286 Rev 0**, sheets 1 and 2 of 3, issued 22 Sep 2026. **Sheet 3 was not supplied.**

---

## 7. Deliverables
### 7.1 Videos (`output/video/`): original royalty-free music
| File | Format | Length | Use |
|---|---|---|---|
| `sws-scada-film-16x9.mp4` | 1920×1080 | ~59 s | Main project film |
| `sws-scada-reel-9x16.mp4` | 1080×1920 | ~32 s | Reels, Stories, TikTok, WhatsApp Status |
| `sws-scada-feed-1x1.mp4` | 1080×1080 | ~32 s | LinkedIn and Facebook feed |
| `sws-scada-feed-4x5.mp4` | 1080×1350 | ~32 s | Instagram feed |
| `sws-scada-logo-sting-16x9.mp4` | 1920×1080 | 5 s | Logo intro/outro |

**Film storyboard:**
1. Logo reveal
2. Title over the night load-out
3. 01 Engineering: the real GA drawings draw themselves on screen
4. 02 Fabrication
5. 03 Fit-Out
6. 04 Presented
7. 05 Dispatched (30 Sep)
8. Key figures
9. Team thank-you
10. Brand outro with INFO@SWSWELD.COM

### 7.2 Photo designs (`output/photos/`)
| File | Size | Use |
|---|---|---|
| `post-square-hero` | 1200×1200 | Main announcement |
| `post-landscape` | 1200×627 | LinkedIn feed |
| `post-portrait-stats` | 1080×1350 | By the numbers |
| `story-delivered` | 1080×1920 | Story / Reel cover |
| `post-thank-you` | 1200×1200 | Team and client |
| `post-speed-record` | 1080×1080 | 8 days / 16 hours |
| `post-spec-sheet` | 1080×1350 | SCADA Room specification |
| `post-engineering` | 1080×1350 | Real GA drawings + dimensions |
| `post-collage` | 1080×1350 | Behind the build |
| `post-arabic` | 1080×1080 | Arabic announcement |
| `linkedin-banner` | 1584×396 | Page/profile cover |
| `video-thumbnail` | 1280×720 | Video cover |
| `poster-a3` (.png + .pdf) | A3 @ 300 dpi | Print |
| `carousel-01…09` + `linkedin-carousel.pdf` | 1080×1350 | LinkedIn document carousel |
| `frame-overlay-16x9/4x5`, `watermark-corner` | transparent PNG | Brand frames for photos |

### 7.3 Branded photos (`output/branded/`)
All 29 photos with the SWS frame, in 16:9 and 4:5 (58 files).

### 7.4 HVAC capability campaign (`output/hvac-ads/`)
Headline: **"Built for the Gulf heat."** · Arabic: **مصممة لحرارة الخليج**

| File | Format | Use |
|---|---|---|
| `sws-hvac-ad-16x9.mp4` / `-9x16.mp4` / `-1x1.mp4` | ~23 s | Video ads |
| `sws-hvac-ad-square` | 1080×1080 | Feed ad |
| `sws-hvac-ad-portrait` | 1080×1350 | Inside / outside split |
| `sws-hvac-ad-story` | 1080×1920 | Story ad |
| `sws-hvac-ad-landscape` | 1200×628 | Link ad / display |
| `sws-hvac-ad-drawing` | 1080×1350 | "From the GA drawing" |
| `sws-hvac-ad-arabic` | 1080×1080 | Arabic ad |
| `sws-hvac-banner-300x250 / 728x90 / 160x600` | @2× | Google Display |
| `sws-hvac-carousel-01…05` + `sws-hvac-carousel.pdf` | 1080×1350 | LinkedIn carousel |
| `hvac-ad-copy.md` | text | Ad copy (Appendix B) |

**Selling points** (claims limited to what the project shows):
1. Split A/C, fitted in our yard: 3 units on our latest 40 ft SCADA Room
2. Guarded outdoor units: skid-mounted brackets with protective mesh
3. Insulated envelope: sandwich wall panels
4. Power and services: A/C circuits, conduit and cable trays in one fit-out

**Video ad sequence:**
1. Logo
2. Headline over the outdoor units
3. 01 Inside
4. 02 Outside
5. 03 Designed in (the GA drawing)
6. 04 Envelope and services
7. CTA: "Climate control, built in."

### 7.5 Post copy
- `output/captions.md`: SCADA Room posts (Appendix A).
- `output/hvac-ads/hvac-ad-copy.md`: HVAC ads (Appendix B).

---

## 8. Engineering Drawings (`assets/drawings/`)
| File | Content |
|---|---|
| `ga-sheet-1-redacted.pdf` / `.png` | Isometric, plan, side elevation (12,192 × 2,894 mm; 1,585 mm skid) |
| `ga-sheet-2-redacted.pdf` / `.png` | Skid plan, skid elevation (3 × 3,000 + 2,952 mm bays), section A-A |
| `ga-iso`, `ga-plan-elevation`, `ga-skid-plan`, `ga-skid-elevation`, `ga-section-aa` (`-ink` / `-light` .png) | Individual views on transparent backgrounds. `ink` (dark lines) is for light designs, `light` (light lines) for dark designs. |

**Where they're used:**
- the engineering scene of the film and all three short cuts
- carousel slide 3
- the A3 poster
- `post-engineering`
- the HVAC "From the GA drawing" ad
- the website's Drawings section

---

## 9. HVAC Engineering Package (`hvac/`), FOR REVIEW
I produced this after misreading an earlier request. It's kept for reference and can be deleted.
- **Workbook:** `SWS-SCADA-Room-HVAC-Heat-Load-and-Selection.xlsx`. Live formulas, zero errors. Sheets: Design Basis, Heat Load, Unit Selection, Equipment Schedule, Notes.
- **Drawing:** `SWS-SCADA-Room-HVAC-Layout-A3.pdf` (also .png and .svg), drawing **SWS-2286-HVAC-01 Rev A**: plan, elevation, section A-A, schedule, notes.
- **Result:** design load **12.15 kW (3.45 TR)**, including a 10% margin. Selection **3 × 2.5 TR T3 split units, N+1**. With one unit on standby, the other two give 14.1 kW at 50 °C ambient.
- **To confirm before any procurement:**
  - **Equipment heat, 6.0 kW:** a placeholder, and 54% of the load.
  - **Outdoor design condition, 50 °C:** chosen to be conservative.
  - **Panel U-value, 0.45 W/m²K:** assumes 50 mm PU panels.
  - **Unit derating at design ambient, 80%:** confirm with the manufacturer's data.

---

## 10. Website (`site/`)
- **Live:** https://khraim1989.github.io/SCADA-Room-project-delivery-video/, published from the `gh-pages` branch.
- **Stack:** plain HTML, CSS and vanilla JS, no build step. Mobile-first, WCAG AA, lazy-loaded images, respects reduced-motion settings, layout ready for Arabic (RTL).
- **Sections:**
  1. Hero: "8 Days. 16 Hours. One SCADA Room Delivered." with a "Request a Capability Briefing" email link
  2. Proof points (4 counters)
  3. Package overview
  4. Timeline
  5. **GA Drawings** (both sheets + redacted PDFs)
  6. Scope and specification
  7. Gallery with lightbox (15 photos)
  8. Video (film + 9:16 cut)
  9. Credentials
  10. Contact form (opens an email)
- **Extras:** Open Graph and Twitter preview tags, favicon placeholder, print stylesheet that gives a one-page A4 capability sheet.
- **Client names:** `SHOW_CLIENT_NAMES = false` in `site/script.js`. The names are not stored anywhere until approval.
- **Updating the live site after edits:** see `site/README.md` (git subtree split → push to `gh-pages`).
- **Custom domain: pending.** Plan: `case-study.swsweld.com`, a CNAME record pointing to `khraim1989.github.io`.
  - swsweld.com's DNS is hosted on `ns1/ns2.sitesaudia.net`, managed by Media Trends. The CNAME wasn't there when last checked.
  - The main site at `20.193.144.58` should stay untouched.
  - Once the record resolves: add the domain on GitHub, update the page links, then tick **Enforce HTTPS** in the repository's Settings → Pages.

---

## 11. Rebuilding (`README.md`)
- **Requires:** Node 18+, ffmpeg, Playwright (Chromium).
- **All text, stats, photo roles and HVAC ad text** live in `project.config.json`.
- **Commands:**
  - `npm run photos`: all designs (PNG/PDF)
  - `npm run video`: all MP4s, including the HVAC ads
  - `npm run brand-photos`: frames every photo in `assets/photos/`
- **Code:**
  - `src/designs.js`: post templates
  - `src/film.js`: video timelines (`full`, `short`, `sting`, `hvac`)
  - `src/illustrations.js`: vector scenes (fallback only)
  - `scripts/`: renderers and the music generator

---

## 12. Open Items
1. **GA sheet 3 of 3:** send it and it gets redacted and added.
2. **Raw phone videos:** need Drive network access or clips under 10 MB.
3. **Custom domain:** Media Trends must add the `case-study` CNAME on sitesaudia.net. Then connect it on GitHub and enforce HTTPS.
4. **Client names:** keep hidden until written approval; then flip `SHOW_CLIENT_NAMES`.
5. **ISO credential:** replace the "ISO-ready" placeholder with certificate details if available.
6. **Favicon:** replace the placeholder monogram with the official mark.
7. **HVAC engineering package:** confirm the assumptions, or delete `hvac/` if not needed.

---

## 13. Zips Sent (30 MB per-file upload limit)
**Full project**, 8 parts (225 files at the time):
1. Main Film 16:9
2. Reel 9:16 and Square 1:1
3. Feed 4:5 and Logo Sting
4. (4a) Photo Designs: Posts
5. (4b) Photo Designs: Carousel and Poster
6. Branded Site Photos
7. Website
8. Source, Logos, Photos and Drawings

**HVAC design package:** 1 zip (part 8).

**HVAC ad campaign:** 3 zips:
1. (1a) Video 16:9
2. (1b) Videos 9:16 and 1:1
3. (2) Designs, Banners and Copy

---

## Appendix A: SCADA Room Post Copy (`output/captions.md`)

### Post Copy: SCADA Room Delivery

> Rules applied: no client or end-user names, no prices or PO numbers. "8 days 16 hours" refers to the **SCADA Room only**. The Control Vanes are always "to follow". Contact: INFO@SWSWELD.COM.

### 1. LinkedIn: Company Page
**Use with:** `sws-scada-film-16x9.mp4` (cover `video-thumbnail.png`) or `post-square-hero.png`

8 days. 16 hours. One SCADA Room delivered.

On 30 September our Dammam team presented, crane-lifted, loaded and dispatched a 40 ft high-cube SCADA Room E-House for a major pipeline project in the Eastern Province. That was 8 days and 16 working hours after GA drawings were issued.

Everything was done in-house:
▪ Engineering & GA drawings
▪ HEB 240 skid with HEB 180 supports, lifting trunnions, platforms & stairs
▪ Insulated sandwich wall panels, checker-plate floor
▪ Primer & coating system
▪ Power distribution, cable trays, 3 split A/C units, fire & gas

It's the first of three E-Houses in the package. Two Control Vanes follow, planned for mid-October.

Engineered. Fabricated. Delivered.
📩 INFO@SWSWELD.COM

#SCADA #EHouse #ProjectDelivery #SteelFabrication #OilAndGas #SaudiArabia #Vision2030 #SWS

---

### 2. LinkedIn: Personal (Mohammad Khraim)
**Use with:** `sws-scada-linkedin-carousel.pdf` (upload as a Document)

GA drawings issued on 22 September. SCADA Room dispatched on 30 September.

8 days and 16 working hours, with engineering, fabrication, coating and electrical fit-out all under one roof in Dammam.

What made it possible:
1. One team owning every discipline, so there were no hand-offs between subcontractors.
2. Drawings, MTO and lifting plan locked before the first cut.
3. Fabrication, coating and fit-out sequenced to run in parallel wherever the steel allowed.

Two Control Vanes are next. Proud of this team. Swipe through the build ↓

#ProjectManagement #Operations #OilAndGas #SaudiArabia

---

### 3. Instagram / Facebook
**Use with:** `sws-scada-reel-9x16.mp4` (Reel) + `post-collage.png`

Drawings → steel → dispatch in 8 days, 16 hours ⚡
40 ft SCADA Room E-House, built 100% in-house in Dammam.

#SWS #SCADA #EHouse #Fabrication #Welding #Dammam #SaudiArabia #OilAndGas

---

### 4. Arabic (LinkedIn / X / Instagram)
**Use with:** `post-arabic.png`

غرفة SCADA — تسليم خلال 8 أيام و16 ساعة ✅

صدرت المخططات العامة في 22 سبتمبر، وفي 30 سبتمبر تم عرض الغرفة ورفعها بالرافعة وتحميلها وإرسالها لمشروع خطوط أنابيب كبير في المنطقة الشرقية.
كل الأعمال تمت داخل مصنعنا في الدمام:
▪ الهندسة والمخططات العامة
▪ قاعدة فولاذية HEB 240 مع دعامات HEB 180، نقاط رفع، منصات وسلالم
▪ ألواح جدران معزولة وأرضية من الصاج المضلع
▪ نظام دهان أساس وطلاء صناعي
▪ توزيع الطاقة، مجاري الكابلات، 3 وحدات تكييف سبليت، إنذار الحريق والغاز

الغرفة هي الأولى من ثلاث وحدات E-House، وتتبعها غرفتا تحكم (Control Vanes) منتصف أكتوبر.

📩 INFO@SWSWELD.COM
#السعودية #رؤية_2030 #الدمام #تصنيع #لحام #SCADA

---

### 5. Suggested Posting Sequence (2 weeks)
| Day | Post | Asset |
|---|---|---|
| 1 | Delivery announcement (company page) | `film-16x9.mp4` |
| 1 | Personal post | `linkedin-carousel.pdf` |
| 3 | Reel / Story | `reel-9x16.mp4`, `story-delivered.png` |
| 5 | Speed record | `post-speed-record.png` |
| 7 | Arabic announcement | `post-arabic.png` |
| 9 | Spec sheet / GA drawings | `post-spec-sheet.png`, `post-engineering.png` |
| 11 | Behind the build | `post-collage.png` |
| 14 | Team thank-you | `post-thank-you.png` |

---

## Appendix B: HVAC Ad Copy (`output/hvac-ads/hvac-ad-copy.md`)

### HVAC Capability Campaign: Ad Copy

> Claims are limited to what the SCADA Room project shows: split A/C fitted in our yard, guarded outdoor units, insulated sandwich panels, and power and services in one fit-out. No client names, no unit brands. Contact: INFO@SWSWELD.COM.

### 1. LinkedIn: Sponsored / Company Post
**Creative:** `sws-hvac-ad-16x9.mp4`, or `sws-hvac-ad-square.png` / `sws-hvac-carousel.pdf` (upload as a Document)

Built for the Gulf heat.

An E-House is only as reliable as the room temperature inside it. On our latest 40 ft SCADA Room, climate control was built in from the GA drawing, not added on site:

▪ 3 split A/C units, fitted in our yard
▪ Outdoor units on skid-mounted brackets with protective mesh guards
▪ Insulated sandwich wall panels
▪ A/C power, conduit and cable trays in the same fit-out

Steel, panels, electrical and HVAC: one team in Dammam, one handover.

Planning a climate-controlled E-House or shelter?
📩 INFO@SWSWELD.COM

#HVAC #EHouse #ClimateControl #SteelFabrication #OilAndGas #Dammam #SaudiArabia #SWS

---

### 2. Instagram / Facebook
**Creative:** `sws-hvac-ad-9x16.mp4` (Reel / Story) + `sws-hvac-ad-portrait.png` (feed)

Built for the Gulf heat ❄️🔥
Split A/C fitted in our yard, guarded outdoor units, insulated panels. Climate-controlled E-Houses from Dammam.
📩 INFO@SWSWELD.COM

#HVAC #EHouse #Dammam #SaudiArabia #Fabrication #OilAndGas #SWS

---

### 3. Arabic (LinkedIn / X / Instagram)
**Creative:** `sws-hvac-ad-arabic.png`

مصممة لحرارة الخليج ❄️

غرف كهربائية وملاجئ مكيفة، تصنيع وعزل وتجهيز بالكامل داخل مصنعنا في الدمام:
▪ تكييف سبليت مركّب في المصنع (3 وحدات في غرفة SCADA الأخيرة)
▪ وحدات خارجية على حوامل مثبتة بالقاعدة ومحمية بشبك
▪ ألواح جدران معزولة
▪ تمديدات كهرباء التكييف ومجاري الكابلات ضمن نفس التجهيز

تخطط لغرفة كهربائية مكيفة؟ 📩 INFO@SWSWELD.COM

#تكييف #السعودية #الدمام #تصنيع #رؤية_2030

---

### 4. Google Ads: Responsive Search / Display
**Display creatives:** `sws-hvac-banner-300x250.png`, `sws-hvac-banner-728x90.png`, `sws-hvac-banner-160x600.png` (2× resolution), `sws-hvac-ad-landscape.png` (1200×628)

**Headlines** (≤ 30 characters)
| # | Headline | Chars |
|---|---|---|
| 1 | Built for the Gulf Heat | 23 |
| 2 | Climate-Controlled E-Houses | 27 |
| 3 | HVAC Fitted In Our Yard | 23 |
| 4 | E-House Fabrication, Dammam | 27 |
| 5 | Aramco Approved Vendor | 22 |
| 6 | Steel, Panels, HVAC, Power | 26 |
| 7 | 40 ft SCADA Room Delivered | 26 |

**Descriptions** (≤ 90 characters)
| # | Description | Chars |
|---|---|---|
| 1 | Split A/C, guarded outdoor units and insulated panels, all built in-house in Dammam. | 84 |
| 2 | One team for steel, fit-out and climate control. Email INFO@SWSWELD.COM. | 72 |

Final URL: https://khraim1989.github.io/SCADA-Room-project-delivery-video/ (or `case-study.swsweld.com` once the DNS is live).

---

### 5. Suggested Rollout (1 week)
| Day | Channel | Asset |
|---|---|---|
| 1 | LinkedIn company page | `sws-hvac-ad-16x9.mp4` + copy §1 |
| 2 | Instagram / Facebook Reel | `sws-hvac-ad-9x16.mp4` + copy §2 |
| 3 | LinkedIn document post | `sws-hvac-carousel.pdf` |
| 4 | Arabic post | `sws-hvac-ad-arabic.png` + copy §3 |
| 5 | Feed post | `sws-hvac-ad-drawing.png` ("From the GA drawing") |
| Ongoing | Google Display / Search | banners + §4 |
