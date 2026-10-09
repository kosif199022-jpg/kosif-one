# 6. KOSIF — final report (2026-10-09)

**Live app:** https://claude.ai/artifact/MN6p4QfsTc9uq2Mc1MVxFs (private to the owner until shared)
**Source:** `الاداة/kosif-web` (src, tests, tools, docs)

## What was delivered
| # | Deliverable | Where |
|---|---|---|
| 1 | Reference-app feature inventory (31 features) | `docs/01-reference-feature-inventory.md` · in-app Capabilities screen |
| 2 | KOSIF capability inventory (40 capabilities) | `docs/02-kosif-capability-inventory.md` |
| 3 | Migration matrix with live checks | `docs/03-migration-matrix.md` · in-app Capabilities screen |
| 4 | Design system and typography | `docs/04-design-system.md` · in-app Design system screen |
| 5 | Screens and architecture (14 screens) | `docs/05-architecture.md` |
| 6 | Working code | `src/` (≈190 KB, no framework) |
| 7 | Automated tests | `tests/core.test.mjs` (15) · `tests/e2e.mjs` (47) |
| 8 | This report | `docs/06-final-report.md` |

## Evidence
- `node --test tests/core.test.mjs`: **15 passed, 0 failed.**
  - Expected values are hand-computed: VAT exclusive and inclusive, mixed rates, discounts, card fee, deposit, 3-decimal rounding, statuses, numbering, estimate conversion, recurring dates, the ZATCA TLV round-trip with Arabic, balanced books, P&L tie-out, the VAT return, aging, the audit procedures, and CSV injection safety.
- `node tests/e2e.mjs` in Microsoft Edge against the built page: **47 passed, 0 failed** (`artifacts/e2e-results.json`).
  - Creates an invoice and checks the total of 287.50 against hand arithmetic, then records payment until paid (with the paid stamp), and checks the ZATCA QR is drawn.
  - Converts an estimate to an invoice.
  - Balanced books; trial balance and balance sheet balance; six reports render.
  - Real file downloads: CSV with BOM and Arabic headers, Excel `.xlsx`, PDF (starts with `%PDF-`, over 20 KB).
  - Audit page with Benford test and sample; every in-page capability check passes.
  - English/LTR switch, dark theme, data survives a reload, no page errors.
  - No sideways scroll on all 14 screens at 390 px.
- Screenshots: `artifacts/home-phone.png`, `artifacts/invoice-desktop.png`; sample PDF `artifacts/invoice.pdf`.

## Not implemented or not verified
- **iOS app.** The owner chose a web app first, because this PC has no Xcode. Nothing was compiled for iOS. The core is plain JavaScript, ready for a WKWebView shell or a Swift port.
- **Online card payments, read receipts (opened/paid alerts), 23 languages.** The first two need a server and a payment provider; KOSIF has Arabic and English. A payment link (with QR) on the document stands in for paying online.
- **Inside claude.ai, not yet exercised by me:**
  - The private account storage (`db`) and the file-save prompts (`downloads`) were not exercised after publishing, because each person's records are private to them and the owner's id is not visible to me. Locally the app uses browser storage, which the e2e test covers.
  - The assistant (`sample`) only runs inside claude.ai, so it was not tested locally; the page hides it gracefully elsewhere.
- **Capabilities that stay where they are:** 14 capabilities stay in KOSIF Omni, KOSIF Think or the desktop programs: video, images, voice, Council, Atlas, browser automation, GitHub, and the full SQC audit file. One, computer control, cannot run from a web page. None of them were changed or removed.
- **Style source:** the style link the owner gave is the "Superr" notebook style, not Wise. Its principles were followed: cream canvas, ink borders, outline pills, one accent.

## How to run and test locally
```
node tools/build.mjs
python -m http.server 8780 --directory dist      # open http://127.0.0.1:8780/local.html
node --test tests/core.test.mjs
node tests/e2e.mjs http://127.0.0.1:8780/local.html   # needs the playwright package
```
