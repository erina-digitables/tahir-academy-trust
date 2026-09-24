# Context Handoff Document — Tahir Academy Trust Website

Generated: 2026-08-10. Paste this whole document into a new session to resume with full context. All facts below were verified against the actual repo state at generation time, not recalled from memory.

---

## 1. Project Overview & Core Objectives

**What this is:** A static marketing/informational website for **Tahir Academy Trust**, a real UK-registered Islamic educational charity (Charity No. **1198539**) based in Enfield, serving the Enfield/Cheshunt area. The site covers their weekend Islamic education courses, prayer services, a recruitment call, a fundraising campaign, and contact.

**How the project started:** Imported via the **Stitch MCP server** (Google's design-to-code tool) from a Stitch project called "Tahir Academy Digital Portal." The raw import — a single-file HTML/Tailwind-CDN landing page, a WebGL shader screen, scraped copy from the trust's real live site (`tahiracademytrust.org`), and 19 image assets — is preserved untouched in `/imported` as a frozen source-of-truth/audit baseline. **Nothing in `/imported` has been edited across the entire project; verified 0 diffs against the baseline commit at every stage.**

**Real-world content source:** `imported/screens/fd375abed7634117b57e65481a1a2dc3__extracted-text/code.md` and a live `WebFetch` of `https://www.tahiracademytrust.org/` are the ground truth for all business facts (courses, times, venues, charity number, contact details). The Stitch-generated import had **fabricated a wrong charity number (1234567)** and dropped real contact info — this was caught in the initial audit and corrected. Current charity number (1198539) is verified consistent across all 5 occurrences in `index.html`.

**Design evolution (three distinct pivots, in order):**
1. **"Liquid Editorial"** — the Stitch import's original warm ivory/gold editorial-glassmorphism system (Playfair Display + Plus Jakarta Sans).
2. **"Liquid Glass" dark** — user supplied a detailed recreation prompt (React/Vite/Framer Motion reference site with a black ground, Instrument Serif italic display type, and a specific `.liquid-glass` CSS recipe). Instructed to take the **UI/UX and typography only**, not the content, and to **stay on the existing static HTML/Tailwind/vanilla-JS stack** rather than migrating to React.
3. **"Liquid Glass" light (current)** — user asked for a light theme + real Islamic media (Qur'an footage) instead of the generic template videos. This is the **current, live design direction.**

**Explicit standing instructions from the user (still in force):**
- Static HTML + Tailwind + vanilla JS only — **no React/Vite/Framer Motion**, despite the recreation-prompt reference using that stack.
- "Build on top of the import, never rewrite from scratch" — large deletions (>20 lines of original imported code) must be flagged and explained before doing them.
- Diff against `/imported` at every step; commit discretely per step.
- Full WCAG AA contrast compliance is a running requirement, verified numerically (not eyeballed) at every change.

---

## 2. Tech Stack & Environment Settings

**Stack:** Static HTML5 + Tailwind CSS 3 (CLI-compiled, NOT the CDN runtime compiler) + vanilla JavaScript (ES5-style, no build step, no framework, no bundler for JS). No backend, no database, no server-side code — file-based static site.

**Repo root:** `C:\Users\user\Documents\tahiracademy` (Windows). Git repo, branch `master`, **no remote configured** (never pushed anywhere — purely local).

**Key dependencies** (`package.json` devDependencies, all installed in `node_modules/`):
```json
"@tailwindcss/container-queries": "^0.1.1",
"@tailwindcss/forms": "^0.5.9",
"ffmpeg-static": "^5.3.0",
"sharp": "^0.33.5",
"tailwindcss": "^3.4.17"
```

**npm scripts:**
```json
"css":        "tailwindcss -i ./src/input.css -o ./assets/css/site.css"
"build:css":  "npm run css -- --minify"
"watch:css":  "npm run css -- --watch"
"images":     "node scripts/optimise-images.js"
"build":      "npm run images && npm run build:css"
"serve":      "node scripts/serve.js"
"dev":        "node scripts/dev.js"
```
No `optimise-video.js` npm script exists yet — it's run manually (`node scripts/optimise-video.js`).

**Dev server:** `scripts/serve.js` — custom Node static file server (no Express), tries ports 3000 → 3001 → 3002 in order and reports which it bound. **Currently verified listening on port 3000** (PID 14228 at last check). Serves only `index.html`, `assets/`, `favicon.ico/svg`, `site.webmanifest`, `robots.txt`; explicitly 403s any path containing `/_originals` (blocks the full-resolution source media from ever being served) and any path outside the allowlist. `Cache-Control: no-store` on `.html/.css/.js` (so edits are always reflected), `public, max-age=3600` on other static assets.

`scripts/dev.js` runs `tailwindcss --watch` and `serve.js` concurrently with prefixed console output.

⚠️ **5 `node.exe` processes were found running** at last check, but only one (PID 14228) is actually bound to port 3000. The others are likely stray/orphaned from prior session restarts. **A new session should verify server state (`netstat`/`Get-NetTCPConnection` on port 3000) before assuming it's live, and may want to clean up stray node processes.**

**Build toolchain notes:**
- Tailwind config is **token-driven only** — `tailwind.config.js` maps every utility (`colors`, `fontSize`, `spacing`, `borderRadius`, `boxShadow`, `zIndex`, `transitionDuration/TimingFunction`) onto CSS custom properties defined in `src/styles/tokens.css`. **No raw hex/px values live in `tailwind.config.js` itself.**
- Colors are stored as space-separated RGB channel triplets (e.g. `--color-ink: 30 27 22`) specifically so Tailwind's `rgb(var(--x) / <alpha-value>)` pattern composes correctly with opacity modifiers (`text-strong`, `/60` etc.) — a deliberate fix for a bug in the original Stitch import where alpha was baked into the color itself.
- `ffmpeg-static` + `sharp` power `scripts/optimise-images.js` (responsive WebP+JPEG derivatives at multiple widths, written to `assets/img/`) and `scripts/optimise-video.js` (H.264 web-weight video re-encodes + real poster-frame extraction, written to `assets/video/`). **Full-resolution masters live in `assets/img/_originals/` and `assets/video/_originals/`, both gitignored and both blocked from being served** — only the optimized derivatives ship.

**Environment / secrets:**
- `.env.example` documents `STITCH_API_KEY` (for `stitch-proxy.js`, only needed if re-importing from Stitch MCP) and optional `STITCH_MCP_URL`.
- `stitch-proxy.js` **fails closed** if `STITCH_API_KEY` is unset (exits 1 with an explanatory message) — this was a fix; the key used to be hardcoded as a fallback literal in source. **That old key is still readable in the git history (baseline commit) and should be treated as compromised / rotated in the Stitch console if this repo or its history is ever shared.**
- `.gitattributes` sets `* -text` globally — line endings are never normalized, specifically so `/imported` stays byte-identical to what the Stitch API returned.

**Fonts:** Google Fonts, loaded via `<link>` with `preconnect` to both `fonts.googleapis.com` and `fonts.gstatic.com`. Current pair: **Instrument Serif** (ital@0;1 — italic used for the "em-soft" emphasis style) for all display/heading type, **Plus Jakarta Sans** (400/500/600/700) for body/UI text.

---

## 3. Completed Features & Active "Schema"

There is no database. The closest equivalent is the **content data model in `assets/js/site.js`**, which drives templated rendering of repeated sections:

```js
var COURSES = [ { title, chips: [duration, who, days], body, image, alt, width, height }, ... ]  // 3 entries
var SERVICES = [ { title, when, body }, ... ]  // 3 entries
```
`courseCard(course)` and `serviceRow(service)` template these into `#courses-grid` and `#services-list` at runtime (all copy is HTML-escaped via a local `esc()` helper). **Adding a 4th course or service is a one-line data-array edit, not a markup clone** — this was a deliberate refactor from the original Stitch import's copy-pasted card markup.

### Page structure (`index.html`), section by section, current order:
1. **Announcement bar** — open house time/location banner, fixed content, links to `#enrol`.
2. **Hero** (`min-h-[92vh]`) — Qur'an video background (`#hero-video` + `#hero-fallback` poster), nav, headline "A Place to Learn" (word-by-word animated), email-less CTA buttons to `#enrol`/`#courses`, trust strip (charity number / ages / times / area).
3. `#about` — compact single-band two-column section (deliberately shrunk from an earlier full-height version per user feedback).
4. `#courses` — 3 rendered course cards with chips, image, CTA.
5. `#enrol` — "How to enrol" 3-step process + a lightweight one-field email-capture form (`#enquiry-form`).
6. Featured media band — mosque dome interior video (not more Qur'an footage, deliberately varied).
7. Philosophy section — Qur'an ceiling still image (`islamic-ceiling`) + Plato quote + mission copy.
8. `#services` — prayer services list (Eid, Jumuah, Taraweeh) + "at a glance" animated stat counters (2yr/6yr/11+/3).
9. `#hiring` — recruitment copy + **AI-generated hiring poster** (see below) as a real `<img>`, not just decorative.
10. `#campaign` — LaunchGood masjid campaign, dark green band (`.on-dark`), gold CTA button.
11. `#location` — **NEW THIS SESSION: full Contact Us form** (see §4) + quick call/email buttons + address/venue/email detail list.
12. Footer — dark green band, nav links, charity number, dynamic copyright year.
13. Mobile-only sticky bottom CTA bar (Call / Enrol) — reveals once hero has scrolled past, hides again over `#enrol`.
14. Mobile nav drawer (slide-in panel, focus-trapped, closes on Escape/backdrop/link-click).

### Design token system (`src/styles/tokens.css`)
Single source of truth for every color/type/space/radius/shadow/z-index/motion value — **no raw values are permitted outside this file** (this rule has been enforced and re-enforced after catching violations twice — see §4 bug history).

Current **light theme, gold + green accent system**:
| Token | Value | Role |
|---|---|---|
| `--color-background` | `#FCFAF5` ivory | Page ground |
| `--color-ink` | `#1e1b16` | Text base |
| `--color-green` | `#0f4436` | **Structural/directive** — primary buttons, eyebrows, stats, active states |
| `--color-green-deep` | `#0a2f25` | Solid button fills, dark bands (13.1:1 on ivory) |
| `--color-accent` (gold) | `#775a19` | **Decorative/honorific only** — dividers, labels, campaign, never sole action signal |
| `--color-accent-soft` | `#c5a059` | Ornament only — 2.36:1 contrast, explicitly NOT usable as text color |
| `--color-error` | `#ba1a1a` | Form validation errors |

Text-role opacities: `--text-strong` (1.0), `--text-body` (0.75), `--text-muted` (0.65), `--text-faint` (0.45, display-only, never body text) — all **recomputed per-theme** (not mechanically inverted between dark/light passes — this was called out explicitly as a correctness requirement).

`.liquid-glass` component (in `src/styles/components.css`) — the signature glassmorphic surface, retuned per-theme (fill/blur/edge-gradient/shadow all differ between the dark and light passes; the *technique*, a masked 1.4px gradient ring via `mask-composite: exclude`, is unchanged).

### Media inventory (all self-hosted, no third-party hotlinking)
- **Hero video:** `assets/video/quran-open.mp4` (+ poster) — Pexels-sourced Qur'an-on-stand footage, compressed via ffmpeg (H.264, faststart, audio stripped, 9.13MB→1.99MB), with a **measured** (not guessed) two-layer legibility system — see §4.
- **Featured band video:** `assets/video/mosque-dome.mp4` (+ poster) — deliberately different subject from the hero, per explicit user feedback about repetitive Qur'an footage.
- **Course card images:** `course-sanatayn`, `course-aalimiyyah`, `course-hifz` — replaced from low-res Wix originals with Pexels photography (students studying, manuscript calligraphy, Qur'an+beads).
- **Philosophy section still:** `islamic-ceiling` (Pexels mosque ceiling).
- **Hiring poster:** `assets/img/hiring-poster-*.{jpg,webp}` — **AI-generated via the Krea MCP connector** (`bfl/flux-1-dev` model; Ideogram 3 and Seedream 4 were plan-gated and unavailable on the connected Krea account). Prompt specified deep green background, gold Islamic geometric ornament, "WE ARE HIRING" / "TAHIR ACADEMY TRUST" text — generated correctly on the **first attempt**. This poster's palette is what the gold+green accent system was sampled from.
- **Real trust photography preserved as-is:** logo, campaign masjid image, Jumuah service photo — all pulled from the live Wix site, not replaced.
- Credits recorded in `assets/PEXELS-CREDITS.md` and `assets/video/CREDITS.md` (Pexels license permits free commercial use, no attribution legally required, but recorded anyway).
- `assets/img/_originals/` (15MB) and `assets/video/_originals/` (31MB) hold full-resolution masters — gitignored, never served, only referenced by the `optimise-*.js` scripts.

### Motion system (`assets/js/motion.js` + `src/styles/motion.css`)
Hand-built vanilla-JS equivalent of Framer Motion's `useInView`/stagger/counters, gated behind `document.documentElement.setAttribute('data-motion-ready')` so a JS failure degrades to a fully visible static page rather than a blank one. Includes: IntersectionObserver-driven fade/slide/media entrances with per-element `unobserve` cleanup, word-by-word headline splitting (DOM-node-aware, preserves `<em>` emphasis), staggered group reveals, `requestAnimationFrame`-driven number counters (0→target, easeOut, **with a `setTimeout` guard that force-settles the end value** if rAF is suspended — see bug history), and a full `prefers-reduced-motion` contract (removes transforms/blur, keeps durations, snaps counters instantly, live-listens for the OS setting changing mid-session).

### Orphaned/dead code
`assets/js/shader.js` (WebGL ambient canvas shader, ~5.8KB) — **built during the dark "Liquid Glass" phase, is NOT referenced anywhere in current `index.html`** (verified via grep). It's dead code left over from before the hero switched to real video. Harmless but should either be deleted or explicitly documented as retained-for-reference in the next cleanup pass.

---

## 4. Current Work-in-Progress & Known Bugs

### Just completed this session (latest commit `4f4187e`)
**Added a full Contact Us form** to the `#location` section (name/email/phone/reason-dropdown/message), sitting alongside the pre-existing quick call/email buttons and address/venue detail list. Full client-side validation (required fields, email format via native `checkValidity()` + non-empty check, per-field `aria-invalid` + visible error text, focus jumps to first invalid field on failed submit, errors clear progressively as each field becomes valid rather than waiting for next submit). Includes a **honeypot anti-spam field** (visually hidden via clip-rect technique, `tabindex="-1"`, `aria-hidden`) that silently fakes success and resets the form if a bot fills it, rather than exposing the rejection.

**A real bug was found and fixed while verifying this:** `src/styles/base.css` had a leftover rule from the original hero pill-style email field:
```css
input[type='email'], input[type='text'] { border: none; }
```
This attribute selector has CSS specificity `(0,1,1)`, which **beat** the new `.form-control` class's `(0,1,0)` — silently stripping the border off the new Contact form's Name and Email inputs (they rendered borderless/flat, not the intended `1px solid` stacked-field look). **Fixed by scoping the old rule to `.field-input`** (the class the original pill input already carries), which fixes the collision without affecting the hero enquiry field's intentional borderless look. Verified via direct `getComputedStyle` inspection in-browser — confirmed `border-top-width` was literally `0px`/`style: none` before the fix, `1px solid rgba(30,27,22,0.16)` after.

### ⚠️ Contact form has NO backend — mailto fallback only (needs a decision)
Both the hero's lightweight `#enquiry-form` and the new full `#contact-form` submit by constructing a `mailto:info@tahiracademytrust.org` URL (pre-filled subject + body with all field values) and setting `window.location.href` to it — this opens the **visitor's own** email client rather than silently POSTing anywhere, because **there is no backend and never has been.** This was flagged to the user twice already (end of two prior turns) and not yet answered. The code in `assets/js/site.js` (`initContactForm()`) is explicitly commented as a placeholder: *"If a real submission endpoint (Formspree, Netlify Forms, a small serverless function, etc.) is added later, only this handler's submit branch needs to change — the markup, validation and honeypot stay as-is."* **This is a real conversion-rate risk for a charity site** — mailto links have significant drop-off vs. an inline "thanks, we got it" experience. **Needs the user's decision on a form backend before this is production-ready.**

### Full bug history this session (all fixed, listed for context on what NOT to reintroduce)
1. **Hero video race condition:** `preload="auto"` + a `defer`red script meant `canplay` could fire *before* the JS listener attached, permanently leaving the hero video at `opacity: 0`. Fixed by checking `video.readyState >= 3` before attaching the listener.
2. **rAF/IntersectionObserver suspended in hidden tabs:** this dev/testing browser pane runs pages in a **hidden** state (confirmed via `document.hidden === true`), which suspends `requestAnimationFrame` and can affect `IntersectionObserver` timing. This is an **environment limitation of the testing pane, not a site bug** — but it did expose a real robustness gap: the video crossfade and counter animations had no fallback if rAF never fires. Fixed by adding `setTimeout`-based "guards" that force-settle the final state (opacity=1, counter=target) regardless of whether rAF ever runs. **This means visual/motion verification in this environment is inherently limited** — hero video playback, counter animation, and scroll-triggered entrances have been verified *correct by code path and by direct frame-seeking*, but **never visually watched running**. A new session (or the user, in a real browser) should eyeball these.
3. **Dead poster fallback:** `poster="..."` on a `<video>` cannot cover a *refused* autoplay, because the `<video>` element itself is the thing held at `opacity:0` — the attribute is irrelevant if the element is invisible. Fixed by adding a **separate real `<img id="hero-fallback">`** behind the video, revealed on autoplay-rejection/error/stall/timeout, using a frame extracted from the actual footage (not a generic placeholder) so the swap is visually seamless.
4. **Horizontal slide-entrance overflow at 375px:** `slide-left`/`slide-right` motion variants used a 40px `translateX`, which is meaningless (and overflow-causing) on a single-column mobile layout where there's no "side" to slide from. Fixed by gating the horizontal slide to `min-width: 768px` only; mobile falls back to a vertical blur-slide.
5. **Sub-44px tap targets** (multiple instances across the session): nav links, footer links, the enquiry field input, contact rows. Systematically fixed with `min-height: 44px` / `min-width: 44px` on all interactive elements — **this is now a standing constraint verified at every change**, not a one-off fix.
6. **`.footer-link` lost its base style rule** in an earlier rewrite (only a dark-theme color override survived), silently shrinking footer links to 21px tall. Restored the full 44px-floor rule.
7. **Hero over-washing legibility layer (user-reported this session, prior turn):** a single flat ivory veil at 55–72% opacity was burying the Qur'an video to keep hero text readable. **Fixed by splitting into two layers** — a very weak (6–14%) full-frame vertical veil that only exists to blend the hero into the page at the bottom, plus a separate elliptical "focus pool" (62% core / 34% edge) sitting *only* behind the copy block. **The focus-pool opacity value (0.62) was derived by actually seeking 12 frames across the full 25.8s video clip in-browser, compositing the real gradient math, and measuring worst-case contrast per frame** — not guessed. Result: worst frame across the whole clip = **4.84:1** (need ≥4.5:1 AA), with the true darkest frame at t=6.44s. **Important caveat left for future work:** testing only the poster frame gave a false-passing 5.86:1 — if the hero video is ever swapped, this measurement process must be redone against the new clip, not assumed to carry over.
8. **Inline styles crept into `index.html`** during the gold/green re-theme (campaign section, footer) — violated the project's own "no raw values outside tokens.css" rule. Replaced with proper `.on-dark`/`.em-soft-light` utility classes.
9. **PowerShell text-corruption incident:** a `Get-Content`/regex-replace pass on `index.html` (to swap inline styles for classes) silently mangled every em-dash/smart-quote by reading the UTF-8 file as ANSI codepage. Caught by explicit mojibake pattern-matching in a verification pass; fixed by rewriting the file directly via the Write tool instead of shell text manipulation. **Lesson: avoid PowerShell `Get-Content`/`-replace` for editing UTF-8 files with non-ASCII characters (em-dashes, curly quotes) in this environment — rewrite via the file-editing tool directly instead.**
10. **Image plan silently produced zero output** for `campaign-masjid` (portrait 1130×1600 original) because the resize plan specified upscale-only target widths (1280/1920) and the resize step correctly refuses to upscale — but failed *silently*, producing nothing. Fixed the width plan; **worth remembering as a pattern**: `scripts/optimise-images.js`'s width lists must never exceed a source image's native width or the derivative is silently skipped.

### Known-safe verification method used throughout (for continuity)
Because this environment's browser pane cannot reliably screenshot (`computer{action:"screenshot"}` times out — "pane not displayed, not compositing frames") and runs pages hidden (blocking real autoplay/rAF), **all verification in this project has been done via `mcp__Claude_Browser__javascript_tool` executing `getComputedStyle`/`getBoundingClientRect`/canvas-pixel-sampling assertions directly against the live DOM**, not via visual screenshot review. Standard checks run after every change: `0` overflowing elements at 375/768/1280px, `0` dead `href="#..."` anchors, `0` broken images (`naturalWidth===0`), `0` console errors, and a custom in-browser WCAG contrast calculator (composites actual background color up the DOM tree, converts to relative luminance, checks against 4.5:1 body / 3:1 large-text AA thresholds). **This pattern should be continued in the next session** rather than assuming screenshots will work.

---

## 5. Immediate Next Steps

**Priority order, as things currently stand:**

1. **Decide on a contact-form backend.** The mailto-only submission (both `#enquiry-form` and the new `#contact-form`) is functional but suboptimal for conversion. Needs the user to pick one: Formspree, Netlify Forms, a small serverless function, or explicitly confirm mailto is acceptable long-term. Only `initContactForm()`'s submit branch in `assets/js/site.js` needs to change — markup/validation/honeypot are already backend-agnostic.

2. **Rotate the Stitch API key.** It was hardcoded in `stitch-proxy.js` in an early commit and is still present in git history even though current `HEAD` reads it from `.env` only. Treat as compromised.

3. **Watch the hero video and motion actually run in a real browser.** Everything has been verified by code-path/frame-sampling but never visually observed playing — the user or a fresh session should open `http://localhost:3000` in an actual browser tab and confirm the crossfade loop, word-by-word headline, counters, and scroll entrances all feel right in motion, not just pass contrast math.

4. **Clean up orphaned processes and dead code:**
   - Verify/restart the dev server (`npm run serve` or `node scripts/serve.js`) — confirm which port it lands on.
   - Consider killing stray `node.exe` processes not bound to a port.
   - Decide whether to delete `assets/js/shader.js` (dead, unreferenced) or keep it as reference.

5. **No remote repository exists yet.** If the user wants this backed up / deployed, it needs a `git remote add` + push, and a hosting decision (Netlify/Vercel/GitHub Pages would all work trivially for a static site with this build step — `npm run build` produces everything needed to serve from `/` with no server-side runtime).

6. **Re-run the full original audit checklist** (fonts/headings/colors/animations/interactive-states/spacing/z-index/responsive/component-structure/state/performance/accessibility/dead-code/environment/console) one more time end-to-end now that the gold+green re-theme, media replacement, and contact form have all landed — the last *formal* full pass was before the light-theme pivot. Steps 7 (responsive), 8 (accessibility) and 10 (final console audit) from the original fix plan were noted as "substantially covered" by ad-hoc verification but never given a dedicated, itemized final pass.

7. **Image quality pass (flagged, not yet actioned):** the user was told several of the trust's *own* original photos (pulled from their live Wix site) are low-resolution — e.g. the original `course-sanatayn` source was only 560×315 — and offered a swap to matching stock if any looked weak next to the newer Pexels footage. No decision made yet.

---

## Quick-reference file map
```
tahiracademy/
├── index.html                    ← main page, ~31.9KB, all sections
├── assets/
│   ├── css/site.css               ← compiled Tailwind output (generated, not hand-edited)
│   ├── js/
│   │   ├── site.js                ← content data, hero video, nav, forms, mobile CTA
│   │   ├── motion.js               ← IntersectionObserver-based entrance/stagger/counter engine
│   │   └── shader.js               ← DEAD CODE, not referenced, leftover from dark-theme phase
│   ├── img/                        ← optimized derivatives (webp+jpg, multiple widths) + manifest.json
│   │   └── _originals/             ← gitignored, full-res masters, never served
│   ├── video/                      ← quran-open.mp4, mosque-dome.mp4 + poster jpgs, CREDITS.md
│   │   └── _originals/             ← gitignored, full-res masters, never served
│   └── PEXELS-CREDITS.md
├── src/
│   ├── input.css                   ← Tailwind entry point
│   └── styles/
│       ├── tokens.css               ← SINGLE SOURCE OF TRUTH for all design values
│       ├── base.css                 ← element resets, contains the border-scoping fix (§4)
│       ├── components.css           ← .liquid-glass, .btn, .card, .form-control, etc.
│       └── motion.css               ← entrance-state CSS, prefers-reduced-motion overrides
├── scripts/
│   ├── serve.js                     ← static file server, 3000→3001→3002 fallback
│   ├── dev.js                       ← serve.js + tailwind --watch concurrently
│   ├── optimise-images.js           ← sharp-based responsive image pipeline
│   └── optimise-video.js            ← ffmpeg-based video compression + poster extraction
├── imported/                        ← FROZEN Stitch MCP baseline, never edit, 0 diffs verified
├── tailwind.config.js                ← token-mapping only, no raw values
├── package.json
├── .env.example                      ← STITCH_API_KEY placeholder
├── .gitattributes                    ← `* -text`, preserves /imported byte-for-byte
└── stitch-proxy.js                   ← stdio↔HTTP shim for Stitch MCP, fails closed without key
```

**Git log (oldest → newest):**
```
435738f Baseline: raw Stitch MCP import, untouched
d9b29d0 Step 1: token system
0bb1c25 Steps 2-5: typography, colour, spacing and component cleanup
96bd72b Re-theme to Liquid Glass, and step 6 motion system
1e66e12 Step 9: move the Stitch API key out of source
e1b0730 Light theme, and replace template footage with Qur'an media
2a5c3fc Gold and green accent system, conversion structure, and new media
3bc14d3 Let the hero footage through, with measured legibility protection
4f4187e Add a Contact Us form to the location section   ← HEAD, current
```
