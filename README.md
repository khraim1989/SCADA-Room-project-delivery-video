# SWS: SCADA Room Delivery Media Kit

**Case-study website:** see [`site/`](site/README.md). **HVAC design package:** see [`hvac/`](hvac/README.md).

Video and photo designs for the **SCADA Room**, a 40 ft high-cube E-House built by **Specialist Welding Solutions Co. for Industrial (SWS)** for a major pipeline project in the Eastern Province. It was delivered 8 days and 16 working hours after GA drawings were issued (dispatched 30 Sep 2026). All media uses the real project photos (`assets/photos/`). They use the official SWS logo and brand colours (SWS blue `#0E4194`, spark orange `#E84E0E`) on a charcoal base.

Everything is generated from **`project.config.json`**. To change it, edit the text or stats and rebuild.

## Deliverables (`output/`)

### Videos (`output/video/`): H.264 MP4 with an original, royalty-free music bed
| File | Size | Length | Use |
|---|---|---|---|
| `sws-scada-film-16x9.mp4` | 1920×1080 | ~59 s | Main project film: LinkedIn, YouTube, website, client presentations |
| `sws-scada-reel-9x16.mp4` | 1080×1920 | ~32 s | Instagram/LinkedIn Reels, Stories, TikTok, WhatsApp Status |
| `sws-scada-feed-1x1.mp4` | 1080×1080 | ~32 s | LinkedIn / Facebook feed |
| `sws-scada-feed-4x5.mp4` | 1080×1350 | ~32 s | Instagram feed |
| `sws-scada-logo-sting-16x9.mp4` | 1920×1080 | 5 s | Logo intro/outro for any other video |

Film storyboard: Logo reveal → Title → 01 Engineering (the real GA drawings draw themselves on screen: sheet 1 isometric, sheet 2 skid) → 02 Fabrication → 03 Fit-Out → 04 Presented → 05 Dispatched (30 Sep) → Key figures → Team thank-you → Brand outro.

### Photo designs (`output/photos/`)
| File | Size | Use |
|---|---|---|
| `post-square-hero` | 1200×1200 | Main announcement post |
| `post-landscape` | 1200×627 | LinkedIn link/feed post |
| `post-portrait-stats` | 1080×1350 | "By the numbers" post |
| `story-delivered` | 1080×1920 | Story / Reel cover |
| `post-thank-you` | 1200×1200 | Team & client appreciation |
| `post-speed-record` | 1080×1080 | 8 days / 16 hours (SCADA Room) |
| `post-spec-sheet` | 1080×1350 | SCADA Room specification |
| `post-engineering` | 1080×1350 | Real GA drawings (isometric + skid elevation) with key dimensions |
| `post-collage` | 1080×1350 | Behind-the-build photo grid |
| `post-arabic` | 1080×1080 | Arabic announcement |
| `linkedin-banner` | 1584×396 | LinkedIn page/profile cover |
| `video-thumbnail` | 1280×720 | YouTube / LinkedIn video cover |
| `poster-a3` (.png + .pdf) | A3 @ 300 dpi | Print: reception, site office, exhibitions |
| `carousel-01…09` + `linkedin-carousel.pdf` | 1080×1350 | LinkedIn document carousel (upload the PDF) |
| `frame-overlay-16x9`, `frame-overlay-4x5`, `watermark-corner` | transparent PNG | Brand frames to put over real photos |

### HVAC capability campaign (`output/hvac-ads/`)
Adverts for SWS's climate-controlled E-House capability, built from the real HVAC photos. Unit brand marks are masked and there are no client names.

| File | Size | Use |
|---|---|---|
| `sws-hvac-ad-16x9.mp4` / `-9x16.mp4` / `-1x1.mp4` | ~23 s | Video ads: LinkedIn, Reels/Stories, feed |
| `sws-hvac-ad-square` | 1080×1080 | Feed ad |
| `sws-hvac-ad-portrait` | 1080×1350 | Inside/outside split ad |
| `sws-hvac-ad-story` | 1080×1920 | Story ad |
| `sws-hvac-ad-landscape` | 1200×628 | LinkedIn/Facebook link ad, Google Display |
| `sws-hvac-ad-drawing` | 1080×1350 | "From the GA drawing" (real drawing + photos) |
| `sws-hvac-ad-arabic` | 1080×1080 | Arabic ad |
| `sws-hvac-banner-300x250` / `728x90` / `160x600` | @2× | Google Display banners |
| `sws-hvac-carousel-01…05` + `sws-hvac-carousel.pdf` | 1080×1350 | LinkedIn document carousel |
| `hvac-ad-copy.md` | — | Ad copy (LinkedIn, Instagram, Arabic, Google Ads headlines and descriptions) and rollout plan |

### Branded site photos (`output/branded/`)
All 29 curated project photos with the SWS logo frame, in 16:9 and 4:5.

`output/captions.md` has ready-to-post copy (LinkedIn company and personal, Instagram, Arabic) and a 2-week posting sequence.

## Engineering drawings (`assets/drawings/`)
GA drawing **SWS-2286 Rev 0**, sheets 1 and 2 of 3, issued 22 Sep 2026. Sheet 3 was not supplied. The PDFs are **redacted**: the client name is replaced with "(withheld)" and the internal CAD file path is removed. They are flattened to images at 300 dpi, so the removed text can't be recovered.

| File | Content |
|---|---|
| `ga-sheet-1-redacted.pdf` / `ga-sheet-1.png` | Isometric view, plan, side elevation (12,192 × 2,894 mm; 1,585 mm skid) |
| `ga-sheet-2-redacted.pdf` / `ga-sheet-2.png` | Skid plan, skid elevation (3 × 3,000 + 2,952 mm bays), section A-A |
| `ga-*-ink.png` / `ga-*-light.png` | Individual views cut from the sheets on transparent backgrounds: `ink` for light designs, `light` for dark designs |

These drawings replace the earlier illustrated blueprint everywhere: the film and short cuts' engineering scene, carousel slide 3, the A3 poster, the new engineering post and the website's "Drawings" section. Keep the unredacted originals off this public repo.

## Photos
Curated from the project Drive folder, resized to 2400 px, metadata stripped, phone watermarks cropped. Each design picks photos by **role** (`project.config.json → photos`, e.g. `hero`, `craneLift`, `welding`). To swap a photo, drop the new file in `assets/photos/`, point the role at it and run `npm run build`. `npm run brand-photos` frames every photo in `assets/photos/`.

## Build
Requires Node 18+, ffmpeg and Playwright (Chromium).
```bash
npm install playwright        # once
npm run photos                # all PNG/PDF designs   (~20 s)
npm run video                 # all MP4s              (~10–15 min)
node scripts/render-video.mjs film-16x9 --preview   # quick stills of each scene
```

## Structure
```
project.config.json   ← all text, stats, contacts
assets/logo/          ← official logo + derived variants (on-light, on-dark white, mark, mono watermark)
assets/photos/        ← drop real project photos here
src/illustrations.js  ← vector scenes: control room, blueprint, frame build, paint bay, delivery truck
src/designs.js        ← photo/post templates
src/film.js           ← motion-graphics timeline (full / short / sting)
scripts/              ← renderers (Playwright → PNG/PDF, frames → ffmpeg → MP4), music synth
```

> **Content rules:** no client or end-user names (only the *Aramco Approved Vendor* credential), no prices or PO numbers. The 8 days / 16 hours claim refers to the SCADA Room only. Contact everywhere is INFO@SWSWELD.COM.
