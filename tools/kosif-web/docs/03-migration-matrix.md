# 3. Capability-by-capability migration matrix

Every row is also on the in-app **Capabilities** screen, where the `check` column runs live against the page.

| Capability | Source | Status | Live check | Note |
|---|---|---|---|---|
| Invoices, estimates, receipts, credit notes | SQC app · Invoice Simple | Integrated — works in the app, tested | totals |  |
| Automatic double entry and journal | SQC ledger engine | Integrated — works in the app, tested | journal |  |
| Trial balance, P&L, balance sheet | SQC statements engine | Integrated — works in the app, tested | statements |  |
| VAT and VAT return | SQC VAT policy · kosif-audit-ifrs | Integrated — works in the app, tested | vat |  |
| ZATCA phase-1 QR | SQC enterprise.js | Integrated — works in the app, tested | zatca |  |
| Receivables aging and follow-up | SQC reports | Integrated — works in the app, tested | aging |  |
| Multi-currency with exact decimals | SQC money engine | Integrated — works in the app, tested | money |  |
| Expenses, input VAT, supplier bills | SQC purchases | Integrated — works in the app, tested | journal |  |
| Recurring invoices | SQC operations | Integrated — works in the app, tested | recurring |  |
| Audited statements for Qawaem filing | qawaem-filing-2025 | Bridged — through the assistant, export or a link | — | Excel export of TB/P&L/BS feeds the filing runbook |
| Salla store reports and investor deck | aghnam-salla-investor-deck | Stays in KOSIF Omni / desktop | — | needs the Salla connector; stays a Claude task |
| Numbering gaps and duplicates | SQC audit · kosif_ledger_check | Integrated — works in the app, tested | gaps |  |
| Benford first-digit test | kosif-audit-ifrs | Integrated — works in the app, tested | benford |  |
| Materiality (ISA 320) | SQC tb-review engine | Integrated — works in the app, tested | materiality |  |
| Monetary-unit sampling | SQC audit studio | Integrated — works in the app, tested | mus |  |
| Unbalanced entries, outliers, unusual dates | SQC audit checks | Integrated — works in the app, tested | audit |  |
| Full audit file and the 47-company research bundle | SQC tb-review · corpus engines | Stays in KOSIF Omni / desktop | — | lives in s-kosif.pages.dev; too large for this app |
| Genius Council and Council-500 | kosif-expert-council · kosif-council-500 | Stays in KOSIF Omni / desktop | — | runs in KOSIF Omni / KOSIF Think |
| Excel export and import | kosif_excel · kosif-sheets | Integrated — works in the app, tested | xlsx |  |
| Formula-safe CSV | SQC csv safety | Integrated — works in the app, tested | csv |  |
| PDF documents | SQC output · anthropic pdf skill | Integrated — works in the app, tested | pdf |  |
| Backup and restore | SQC store | Integrated — works in the app, tested | storage |  |
| SQLite and workbook building | kosif_db · kosif_sheet_build | Bridged — through the assistant, export or a link | — | Excel export is the hand-off format |
| Search your corpus and books | kosif-search-corpus · knowledge atlas | Stays in KOSIF Omni / desktop | — |  |
| Assistant that answers from your data and drafts invoices | KOSIF Omni · kosif-think | Integrated — works in the app, tested | ai |  |
| Full Pro, Jev and routing | kosif-think-pro · kosif-jev · kosif_route | Stays in KOSIF Omni / desktop | — | runs on the KOSIF Think worker |
| Skill Atlas (15,122 skills) and 100 Super Skills | kosif-atlas · 100-superskills | Stays in KOSIF Omni / desktop | — |  |
| Prompt engineering | kosif-prompt-master | Bridged — through the assistant, export or a link | — | through Ask KOSIF |
| Arabic writing and translation | kosif-arabic-editor | Bridged — through the assistant, export or a link | — | Ask KOSIF writes notes and terms in either language |
| Image studio and pixel painter | kosif-image-studio · KOSIF Studio | Stays in KOSIF Omni / desktop | — | desktop program and GPU work |
| Montage and motion (KOSIF Motion v6) | kosif-montage-motion · KOSIF Motion Web | Stays in KOSIF Omni / desktop | — | needs ffmpeg and a renderer |
| Audio and voice-over | kosif-audio · kosif-voice | Stays in KOSIF Omni / desktop | — |  |
| Cinema direction and lighting | kosif-cinema-director · kosif-lighting | Stays in KOSIF Omni / desktop | — |  |
| Higgsfield brand visuals | higgsfield | Stays in KOSIF Omni / desktop | — | paid account; owner-approved only |
| Computer control (KOSIF Mouse) | kosif-mouse · kosif-computer-use | Not available on web (reason given) | — | a web page cannot control the computer |
| Browser automation | kosif-jev-browser | Stays in KOSIF Omni / desktop | — |  |
| WhatsApp | kosif-whatsapp · jev-whatsapp-bridge | Bridged — through the assistant, export or a link | — | share and reminders open WhatsApp with the message; no reading of chats |
| GitHub and releases | kosif-github · kosif-release-bridge | Stays in KOSIF Omni / desktop | — |  |
| Code review and security | kosif-code-master · security agents | Stays in KOSIF Omni / desktop | — |  |
| Web design and UI audits | kosif-web-design · kosif_web_audit | Integrated — works in the app, tested | design | this app’s design system |

**Totals:** 40 capabilities — 20 integrated, 5 bridged, 14 stay in KOSIF Omni, 1 not available on web.

Nothing was removed from the original tools: capabilities marked "stays in KOSIF Omni" keep working where they are; this web app does not replace them.
