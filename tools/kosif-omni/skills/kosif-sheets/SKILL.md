---
name: kosif-sheets
description: Use when the user wants an Excel workbook or a database built from data — create a table, sort it, add totals, formats or a chart, make a SQLite database, insert rows, query it or export results to Excel/CSV. Builds the files directly (fast, exact) instead of clicking through Excel. Triggers on /sheets, "اعمل جدول اكسل", "انشئ قاعدة بيانات", "رتب الجدول", "ملف اكسل", "excel table", "spreadsheet", "database".
---
# KOSIF Sheets — Excel and SQLite in one call

Build the file, do not drive the GUI: `kosif_sheet_build` writes a finished .xlsx in one call, and `kosif_db`
manages a SQLite file. Both save to `Documents\KOSIF` (or a folder enabled for KOSIF); `open: true` opens the
result in Excel for the user. When the work belongs INSIDE Excel that is already open ("افتح إكسل واعمل…", a
workbook the user is editing), use `kosif_excel` instead: it drives the running Excel through its own API — new
workbook, write, sort, totals, format, chart, read, save — in one call, with no clicks and no focus change.
Changing data of a workbook KOSIF did not create returns `needs_approval` with a preview first. Never drive
Excel cell by cell with the mouse/keyboard.

## Excel — `kosif_sheet_build`
One sheet object per tab:
```json
{"title": "مبيعات الربع الثالث", "open": true, "sheets": [{
  "name": "المبيعات",
  "headers": ["المنتج", "الكمية", "السعر", "الإجمالي", "التاريخ"],
  "rows": [{"المنتج": "عسل", "الكمية": 12, "السعر": 85.5, "الإجمالي": 1026, "التاريخ": "2026-09-14"}],
  "sort": [{"column": "الإجمالي", "desc": true}],
  "formats": {"السعر": "money", "الإجمالي": "money", "التاريخ": "date"},
  "totals": ["الكمية", "الإجمالي"],
  "chart": {"type": "column", "labels": "المنتج", "values": ["الإجمالي"], "title": "الإجمالي حسب المنتج"}
}]}
```
- Every sheet becomes a real Excel Table (filter buttons, banded rows), header frozen, columns auto-sized.
- `sort`: one or more keys, multi-key in order; empty cells always last.
- `formats`: money, integer, number, percent, date, datetime, text, or any Excel number-format code.
- `totals: true` sums every numeric column; a list sums only those columns (live `=SUM()` formulas).
- Arabic headers switch the sheet to right-to-left automatically (`rtl` overrides).
- Numbers and ISO dates written as text are converted to real numbers/dates; codes with a leading zero
  (phone numbers, IDs) stay text.
- Existing files are never replaced unless `overwrite: true`.

## Database — `kosif_db`
1. `op:"create"`: `table`, `columns {name: integer|real|numeric|text|date|datetime|boolean}`, optional
   `primary_key`, `required`, `unique`, `index`, `replace`.
2. `op:"insert"`: `rows` as objects (matched by column name) or lists (column order). Parameterised.
3. `op:"query"`: ONE `SELECT`/`WITH` statement, `params` for `?` placeholders. The connection is opened
   read-only, so a query can never change data.
4. `op:"describe"`: tables, columns, row counts.
5. `op:"export"`: a SELECT → formatted .xlsx (same `formats`/`totals`/`chart` options) or `.csv`, `open` to view.

Typical flow for "create a database and arrange it": create → insert → export with `ORDER BY` (+ totals/chart).

## Rules
- Compute in the tools (SQL, SUM formulas) — never type totals by hand.
- Ask before overwriting a file the user did not just create.
- Data the user did not give is not invented: leave cells empty and say which ones.
