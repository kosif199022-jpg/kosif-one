# 4. KOSIF design system — "ledger paper"

Built from the principles of the reference style the owner linked (refero style cfd0fec1…): a cream canvas, thin dark ink borders instead of fills, whisper-light shadows, outline pill buttons and one chromatic accent. The page the owner linked is the "Superr" notebook style, not Wise's own site, so its principles were followed and applied to KOSIF's own subject: invoices, stamps and ledger paper.

## Identity
- **Name:** KOSIF, everywhere: page title, wordmark, seal, settings, documents, file names (`KOSIF-…`), capability screen.
- **Seal:** a round ledger stamp with a "K" stroke and a saffron dot (`src/index.html`). The same stamp language marks paid, overdue and void on the paper invoice.
- **Accent:** saffron `#d9530e` (light) / `#f2732d` (dark). It is the only chromatic accent; green, amber, red and blue are reserved for status.

## Color tokens (light → dark)
| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | #fbf8f3 | #161310 | page ground |
| `--paper-2` | #f3ece2 | #1f1b17 | secondary surface, rail |
| `--card` | #fffdf9 | #1c1814 | cards, inputs |
| `--ink` | #1d1814 | #f5ede3 | text and structural rules |
| `--ink-2` / `--ink-3` | #4b4139 / #7b6f64 | #d4c6b6 / #a1937f | secondary text, captions |
| `--rule-soft` | #e0d5c8 | #39312a | hairlines |
| `--accent` | #d9530e | #f2732d | the one accent |
| `--good` `--warn` `--bad` `--info` | #2c7a4b #a76a10 #b3261e #2f5f8f | #6fcf97 #f0b85a #ff8a80 #8fbfee | paid / partial / overdue / sent |

The paper invoice always stays light: it is what the client receives and prints.

## Typography
- **Display:** Fraunces 500/600 (Latin, lowercase titles in English), falling back to Readex Pro for Arabic.
- **Text and UI:** Readex Pro 300–700, which carries Arabic and Latin in one family, so mixed Arabic and English lines share one rhythm.
- **Scale:** 13 caption · 14 small · 16 body · 18 heading · 22 page title · 28 hero · 26 KPI figures; tabular numerals wherever digits line up.
- **Numbers:** Latin digits in both languages (Saudi business practice); Arabic-Indic digits typed by the user are accepted (`toMinor`).

## Space, shape, elevation
4px base: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48. Radius: input 8, card 12, sheet 20, pill 999. Card shadow `0 2px 20px / 6%`, button shadow `0 1px 2px / 22%`. Borders 1.5px ink for objects, 1px soft for hairlines.

## Components
Outline pill buttons (primary = heavier border + saffron dot), segmented controls, filter chips, KPI tiles, list rows with status pills, data tables with sticky totals, bottom sheet dialogs (the viewer has no browser dialogs), toast, signature pad, photo thumbnails, the paper document in four templates (classic, modern, ledger, stamp) with seven ink colors.

## Layout and direction
Phone: sticky header, bottom tab bar (Home, Documents, Clients, Reports, More), floating "new" pill. 960px and wider: side rail with every section. Arabic is the default and right-to-left; English switches the whole page to left-to-right. Light, dark and system themes. Respects reduced motion. No screen scrolls sideways at 390px (checked by the e2e test on all 14 screens).
