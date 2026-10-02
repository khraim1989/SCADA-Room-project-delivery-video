# SWS: SCADA Room Case Study (Landing Page)

A static one-page site: `index.html`, `styles.css`, `script.js` and `assets/`. It uses plain HTML, CSS and vanilla JS, with no framework and no build step.

## Preview locally
```bash
cd site
python3 -m http.server 8080   # or: npx serve .
# open http://localhost:8080
```
Open the page through a server rather than as a `file://` URL, so the video and lightbox behave as they will in production.

## Client names: `SHOW_CLIENT_NAMES`
The page names no client or end user. Every place a name could appear is marked with `data-client="…"` in `index.html`. The default text there is *"a major pipeline project in the Eastern Province"*.

Once you have **written publicity approval**:
1. Open `script.js`.
2. Set `const SHOW_CLIENT_NAMES = true;`
3. Fill in the strings in `CLIENT_NAMES`:
   - `'project'` is the hero eyebrow.
   - `'project-lower'` is the overview sentence.
4. Redeploy.

The client names are deliberately **not** stored anywhere in the repo until approval. Don't add client logos without separate brand approval.

Content rules this page follows:
- No prices, SAR figures, margins, PO/contract numbers or payment terms.
- The "8 days 16 hours" claim refers only to the SCADA Room. The two Control Vanes are shown as planned for mid-Oct 2026.
- The only use of "Aramco" is the *Aramco Approved Vendor* credential.

## Edit content
| What | Where |
|---|---|
| Headline, timeline, spec list, credentials | `index.html` |
| Gallery photos and captions | `GALLERY` array in `script.js` (expects `assets/img/<name>-800.jpg` and `-1600.jpg`) |
| Contact email | `CONTACT_EMAIL` in `script.js` and the `mailto:` links in `index.html` |
| Colours, spacing, fonts | CSS variables at the top of `styles.css` |
| Videos | `assets/video/*.mp4`, posters `assets/img/poster-*.jpg` |
| Favicon (placeholder) | `assets/favicon.svg`: replace with the official mark |
| Social preview image | `assets/img/og-image.jpg` (1200×630) |

**Social preview links:** Open Graph needs absolute URLs. After deploying, change `og:image` and `twitter:image` in `index.html` to the full URL, e.g. `https://<your-domain>/assets/img/og-image.jpg`.

## Arabic / RTL
All layout uses logical CSS properties (`margin-inline`, `padding-block`, `inset-inline-start`, …). To make an Arabic version:
1. Copy `index.html` to `ar/index.html`.
2. Set `<html lang="ar" dir="rtl">` and translate the text.
3. Add an Arabic font (e.g. Cairo) to the `--font-head` and `--font-body` stacks.

The grid, timeline, lightbox arrows and keyboard navigation mirror automatically.

## Print / PDF capability sheet
Use the browser's **Print → Save as PDF** (A4). The print stylesheet hides the navigation, gallery, video and form. It lays out the hero, proof points, timeline, specification and credentials as a one-page sheet on white.

## Deploy
**GitHub Pages**
1. Push the repo to GitHub.
2. Go to *Settings → Pages → Build and deployment → Deploy from a branch*.
3. Select your branch and the `/site` folder.
   - If Pages only offers `/ (root)` or `/docs`, either rename `site/` to `docs/`, or publish with a GitHub Action (`actions/upload-pages-artifact` with `path: site`).
4. Your page appears at `https://<user>.github.io/<repo>/`.

**Any static host** (Netlify, Cloudflare Pages, Vercel, S3, cPanel): upload the contents of `site/` as the web root. There's no build command, and the publish directory is `site`.

The videos are about 10–15 MB each and load only when the visitor presses play (`preload="none"`).
