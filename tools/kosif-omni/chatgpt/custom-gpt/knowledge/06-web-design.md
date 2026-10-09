# KOSIF Omni knowledge — 06-web-design


<!-- ===== skill: kosif-web-design ===== -->
---
name: kosif-web-design
description: Use for designing or building websites, landing pages, web apps, dashboards, UI components, design systems and themes — layout, typography (Arabic + Latin, RTL), colour tokens, dark mode, accessibility (WCAG), responsive/mobile-first, SEO, performance, conversion, and auditing an existing page or site. Triggers on /site /landing /ui /dashboard /tokens /webaudit /redesign /component, "صمم موقع", "صفحة هبوط", "واجهة", "لوحة تحكم", "تصميم ويب".
---
# KOSIF Web Design Studio — measured, accessible, mobile-first

KOSIF think-first: frame the page's single job, audience, device mix, language/direction, brand, content that exists (no invented numbers), and how success is measured. Select the council's design chamber with `../kosif-think-pro/scripts/council_select.py` (`"domains": ["web"]`) — it always brings the Accessibility Advocate.

## Pipeline
1. **Brief** — primary action, audience, languages (Arabic ⇒ `dir="rtl"`), brand colour(s), must-have sections, constraints (hosting, framework, single-file?), success metric.
2. **Information architecture** — sections in order of the user's questions; one H1; navigation ≤ 7 items; primary CTA above the fold and repeated at the end.
3. **Tokens first** — run `scripts/design_tokens.py` with the brand colour: light + dark themes, status colours, spacing, radius, type scale, motion. Every colour in CSS comes from a token; no one-off hex values.
4. **Layout** — mobile-first at 360px, then 768 / 1024 / 1280; CSS grid/flex; `max-width` on content (≈ 68ch for text); touch targets ≥ 44px; safe areas on phones.
5. **Components** — every interactive component has default, hover, focus-visible, active, disabled, loading, empty and error states. Semantic HTML first; ARIA only when HTML cannot express it.
6. **Build** — complete files (no `...`). Single-file pages inline CSS/JS; multi-page projects use the forge (`../kosif-think-pro/scripts/project_forge.py … static-web` or `cf-worker`) for a tested scaffold.
7. **Audit** — `scripts/web_audit.py PAGE_OR_DIR` (static: document, a11y, contrast in both themes, responsive, performance, design-token use, security). Fix every BLOCK and high item.
8. **Render check** — when a browser is available (Playwright/Chromium in the sandbox, or the host's browser tools), open the page at 360×800 and 1280×800 in light and dark, screenshot, check for horizontal scroll, overlapping text and focus visibility, and tab through the page. Report what was actually rendered; if no browser ran, say `not rendered`.
9. **Deliver** — files + audit score + screenshots (if taken) + next improvements. Publishing (artifact, Pages, Workers) only when asked; deployment needs the user's account.

## Commands
- `/site <brief>` — full pipeline, multi-section site.
- `/landing <product>` — conversion landing page: hero (value proposition + primary CTA), social proof, benefits, how it works, pricing/offer, FAQ, final CTA; A/B headline variants ×3.
- `/ui <screen>` — one screen/component with all states.
- `/dashboard <data>` — data-dense layout: KPI tiles, charts with legends + table fallback, filters; numbers with tabular figures; never invented data (empty states instead).
- `/tokens <brand hex>` — run `design_tokens.py`, show the contrast report and the CSS.
- `/webaudit <file|url|folder>` — `web_audit.py` + (if a browser is available) rendered checks; findings table: severity | issue | where | fix.
- `/redesign <page>` — audit → prioritised fixes → rebuilt page → before/after audit scores.
- `/component <name>` — accessible component (HTML/CSS/JS or React) with keyboard support and tests.

## Non-negotiables
WCAG 2.2 AA: text contrast ≥ 4.5:1 (3:1 for large text and UI parts) in **both** themes · visible `:focus-visible` · labels for every control · alt text · no zoom blocking · `prefers-reduced-motion` honoured · one H1 · landmarks · keyboard operable · RTL mirrors layout (use logical properties: `margin-inline-start`, `inset-inline-end`) · Arabic typography: IBM Plex Sans Arabic / Noto Kufi / Tajawal / Cairo with a matching Latin face, line-height ≥ 1.6 · numbers in tables with `font-variant-numeric: tabular-nums` · no secrets in front-end code · no fake statistics or testimonials.

References: `references/web-playbook.md` (layout recipes, section patterns, Arabic/RTL rules, performance budget, dashboard rules, KOSIF design-system lessons from the user's repositories).


<!-- ----- kosif-web-design/references/web-playbook.md ----- -->
# Web playbook

## Lessons carried over from the user's repositories
From `kosif199022-jpg/cloude` (SQC / KOSIF Luxe design system):
- **One token file is the only place colours, spacing, type and motion are defined** (`ui/ds/tokens.css`); legacy names are aliases of the tokens so every screen follows one system.
- **Three modes**: light (default), dark, auto (follows the device), set through `html[data-theme]`; several complete "looks" (`html[data-look]`) re-define the same tokens.
- **Categorical chart palette validated for colour-blind separation** (worst adjacent ΔE ≈ 9 light / 8.4 dark); slots below 3:1 on white ship with legends, tooltips and a table view.
- **Typeface chosen by Jev**: `jev_choice` picked IBM Plex Sans Arabic (p≈0.99) for clearer digits in dense tables with a matching Latin face — decisions like this are recorded with their probability.
- **Tabular Latin numerals** (`tnum`) in tables; time runs left→right in charts even in RTL layouts.
- **No invented numbers**: every figure comes from records; an empty source shows an empty state.
- **Automatic accessibility pass** (`ui/core/a11y.js`): unnamed inputs get names from column headers/row labels, images without alt get `alt=""`, icon buttons get names — a safety net, not a substitute for correct markup.
- `prefers-reduced-motion` sets the motion token to 0ms.

## Section patterns (landing page)
| Section | Must contain | Common mistake |
|---|---|---|
| Hero | outcome-focused headline (≤ 10 words), one-sentence sub-headline, one primary CTA, visual of the product in use | three CTAs of equal weight |
| Social proof | real logos/testimonials/numbers with sources | invented reviews |
| Benefits | 3–6 benefits phrased as user outcomes | feature lists |
| How it works | 3 numbered steps | walls of text |
| Offer / pricing | clear plan names, what is included, risk reversal | hidden fees |
| FAQ | top objections answered | marketing fluff |
| Final CTA | repeat primary action | new, different action |

## Layout recipes
- Page container: `max-width: 72rem; margin-inline: auto; padding-inline: 16px` (24px ≥ 768px).
- Auto-fit cards: `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))`.
- Holy-grail app shell: header / (nav | main) / footer with grid areas; nav collapses to a bottom bar ≤ 900px.
- Fluid type: `font-size: clamp(28px, 5vw, 44px)` for H1.
- Media: `img{max-width:100%;height:auto}` plus width/height attributes to reserve space.

## Arabic and RTL
- `<html lang="ar" dir="rtl">`; use logical CSS properties; mirror directional icons (arrows) but not logos, media controls or charts' time axes.
- Mixed text: wrap Latin/numbers in `<bdi>` or `unicode-bidi: isolate` when order breaks.
- Line height 1.6–1.8; avoid letter-spacing on Arabic; avoid all-caps logic (Arabic has no case).
- Dates: offer Hijri + Gregorian where the audience expects it.

## Performance budget (mobile, 4G)
LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms · JS ≤ 170 KB gz on first load · images in AVIF/WebP with `srcset` · fonts subset + `font-display: swap` + preload for the primary face · `defer` scripts · no render-blocking third parties.

## Dashboards
- Start with the question each chart answers; one chart type per question.
- KPI tile = value + unit + delta vs comparison + period + source.
- Every chart: title, axis labels, legend (or direct labels), tooltip, accessible table fallback.
- Colour: categorical palette in fixed order (identity, never rank); sequential for magnitude; diverging only around a meaningful midpoint.

## SEO basics
Unique `<title>` (10–65 chars) · meta description (50–160) · one H1 · descriptive link text · `alt` text · canonical URL · Open Graph tags · sitemap.xml · structured data where relevant · fast mobile page.

## Security for front-end
No API keys in client code (use a Worker/server proxy with the secret in the platform store) · CSP without `unsafe-inline` when possible (so no inline handlers) · `rel="noopener"` on new-tab links · HTTPS for all resources · escape user content before inserting into the DOM (`textContent`, not `innerHTML`).
