# 5. KOSIF architecture and screens

## Shape
A dependency-free web app (vanilla JavaScript, no build step beyond copying files) published as a claude.ai artifact and runnable from any static server.

| File | Job |
|---|---|
| `src/kosif-core.js` | Every number: money in integer minor units (2- and 3-decimal currencies), document totals (exclusive and inclusive VAT, line and document discounts, shipping, card fee, deposits), status, numbering, estimate conversion, recurring schedule, ZATCA phase-1 TLV QR, double-entry journal, trial balance, P&L, balance sheet, VAT return, aging, sales reports, Benford, numbering gaps, materiality, monetary-unit sampling, formula-safe CSV. No DOM; tested in Node. |
| `src/kosif-i18n.js` | Every visible string in Arabic and English. |
| `src/kosif-data.js` | Storage, example records, the reference-feature list and the capability inventory. |
| `src/kosif-app.js` | Screens, navigation, the editor, the paper document, exports, the assistant, the live capability checks. |
| `src/kosif.css` | The design system. |
| `src/index.html` | The page shell. |

## Storage
- Inside claude.ai the app uses the artifact `db` capability. Each record is one private document under `data/users/<viewer id>/`, which no other viewer can read, the artifact owner included.
- Elsewhere (a local server, a signed-out view) it uses this browser's storage.
- The page renders at once from the local copy and switches to the account copy when it answers. If the account copy is empty and this device has records, they are copied up once.
- Images (logo, signature, item and document photos, receipts) are compressed so each fits one record.
- Backup and restore use a JSON file.

## Platform capabilities used (all granted by the viewer)
| Capability | Use |
|---|---|
| `db` + `user` | Private per-person records. |
| `downloads` | PDF, Excel, CSV and JSON files (the viewer confirms each save). |
| `sample` | "Ask KOSIF": answers from a compact summary of the user's data, and drafts invoices from plain language into the editor for review. Nothing is saved without the user pressing Save. |

Libraries load on demand from cdnjs: qrcodejs 1.0.0, SheetJS 0.18.5 (Excel in and out), html2pdf.js 0.10.1 (PDF with correct Arabic shaping, rendered by the browser).

## Screens
1. **Home:** KPIs, the 12-month sales and expenses chart, documents needing follow-up with reminders, quick actions, recent documents, the example-data banner.
2. **Documents:** invoices, estimates, receipts and credit notes; status filters; search.
3. **Document:** the paper preview with the ZATCA or payment-link QR and a status stamp. Actions: edit, share (copy, WhatsApp), PDF, record payment, mark sent, convert, accept or decline, duplicate, credit note, void, delete. Payment history.
4. **Editor:** number, dates, currency, client (or a new one inline), lines with autofill from items, line discounts, the taxable flag, document discount, tax mode and rate, shipping, deposit, card fee, recurring schedule, notes, terms, payment instructions and link, photos, signature, template and color. Live totals.
5. **Clients:** list, balances, import from Excel or CSV, client file with all documents.
6. **Items:** catalog with photos, import.
7. **Expenses:** categories, input VAT (one tap at the default rate), unpaid supplier bills, receipt photos.
8. **Reports:** sales by month, client and item; aging; expenses; P&L; balance sheet; trial balance; VAT return; journal. Each exports to Excel, CSV and PDF.
9. **Books:** chart of accounts with balances, manual journal entries (must balance).
10. **Audit:** findings (duplicates, gaps, unbalanced entries, missing clients, large round amounts, Friday dates, future dates, outliers), Benford test, materiality (ISA 320 ranges), monetary-unit sample, AI explanation.
11. **Ask KOSIF:** chat and invoice drafting.
12. **Settings:** business, logo, drawn signature, VAT number validation, defaults, ZATCA QR, bilingual invoice, language, theme, backup, restore, export everything, example data, erase (typed confirmation).
13. **Capabilities:** the inventory and migration matrix, with live checks.
14. **Design system:** tokens, type, components.

## Why a web app first
The owner chose this on 2026-10-09: the build machine is Windows without Xcode. The same core (`kosif-core.js`) is plain JavaScript, so an iOS shell (WKWebView or a SwiftUI port of the core) can reuse it and its tests later.
