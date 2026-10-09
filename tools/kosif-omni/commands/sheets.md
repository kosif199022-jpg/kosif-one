---
description: KOSIF Sheets — build an Excel workbook or a SQLite database from your data in one call
argument-hint: <the table/database you want, e.g. "جدول مبيعات مرتب حسب الإجمالي مع مجموع ورسم">
---
Handle this with the `kosif-sheets` skill:

$ARGUMENTS

Use `kosif_sheet_build` for workbooks (Excel Table, sorting, formats, totals with live SUM formulas, chart, right-to-left for Arabic) and `kosif_db` for databases (create → insert → query/export). Compute with the tools, never by hand; do not invent missing data; set `open: true` when the user wants to see the result in Excel; ask before overwriting an existing file.
