"""KOSIF Sheets — Excel workbooks and SQLite databases (files only, written to a temp folder)."""
from __future__ import annotations

import os
import sys
import tempfile
import unittest
from pathlib import Path

SERVER = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SERVER))
_TMP = Path(tempfile.mkdtemp(prefix="kosif_office_test_"))
os.environ["KOSIF_OFFICE_DIR"] = str(_TMP / "out")
os.environ.setdefault("KOSIF_STATE_DIR", str(_TMP / "state"))

from kosif_mcp import protocol  # noqa: E402

ROWS = [{"المنتج": "عسل", "الكمية": 12, "السعر": 85.5, "التاريخ": "2026-09-14", "الكود": "007"},
        {"المنتج": "تمر", "الكمية": 40, "السعر": 22, "التاريخ": "2026-09-02", "الكود": "010"},
        {"المنتج": "زيت", "الكمية": None, "السعر": 60, "التاريخ": "2026-09-20", "الكود": "003"},
        {"المنتج": "جبن", "الكمية": "25", "السعر": "41.25", "التاريخ": "2026-09-09", "الكود": "001"}]
HEAD = ["المنتج", "الكمية", "السعر", "التاريخ", "الكود"]


def call(_tool, /, **args):
    val, err = protocol.call_tool(_tool, args)
    if err:
        raise AssertionError(val)
    return val


class Workbook(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.res = call("kosif_sheet_build", title="مبيعات", sheets=[{
            "name": "المبيعات", "headers": HEAD, "rows": ROWS, "sort": [{"column": "الكمية", "desc": True}],
            "formats": {"السعر": "money"}, "totals": ["الكمية"],
            "chart": {"type": "column", "labels": "المنتج", "values": ["السعر"]}}])
        from openpyxl import load_workbook
        cls.wb = load_workbook(cls.res["file"])
        cls.ws = cls.wb["المبيعات"]

    def test_file_lands_in_the_kosif_folder(self):
        self.assertTrue(self.res["file"].startswith(str((_TMP / "out").resolve())))
        self.assertTrue(self.res["file"].endswith("مبيعات.xlsx"))

    def test_sorted_desc_with_empty_last_and_numbers_coerced(self):
        col = [self.ws.cell(row=r, column=2).value for r in range(2, 6)]
        self.assertEqual(col, [40, 25, 12, None])

    def test_codes_with_leading_zero_stay_text_and_dates_become_dates(self):
        import datetime as dt
        self.assertEqual(self.ws.cell(row=2, column=5).value, "010")
        self.assertIsInstance(self.ws.cell(row=2, column=4).value, dt.datetime)

    def test_table_totals_format_rtl_freeze_chart(self):
        self.assertEqual(len(self.ws.tables), 1)
        self.assertEqual(self.ws.cell(row=6, column=2).value, "=SUM(B2:B5)")
        self.assertEqual(self.ws.cell(row=6, column=1).value, "الإجمالي")
        self.assertEqual(self.ws.cell(row=2, column=3).number_format, "#,##0.00")
        self.assertTrue(self.ws.sheet_view.rightToLeft)
        self.assertEqual(self.ws.freeze_panes, "A2")
        self.assertEqual(len(self.ws._charts), 1)

    def test_no_silent_overwrite(self):
        val, err = protocol.call_tool("kosif_sheet_build", {"title": "مبيعات", "sheets": [{"headers": ["a"], "rows": []}]})
        self.assertTrue(err)
        self.assertIn("already exists", val["error"])

    def test_paths_outside_the_allowed_folders_are_refused(self):
        val, err = protocol.call_tool("kosif_sheet_build", {"path": r"C:\Windows\x.xlsx",
                                                            "sheets": [{"headers": ["a"], "rows": [[1]]}]})
        self.assertTrue(err)

    def test_bad_sort_column_is_explained(self):
        val, err = protocol.call_tool("kosif_sheet_build", {"title": "x", "sheets": [
            {"headers": ["a"], "rows": [[1]], "sort": "nope"}]})
        self.assertTrue(err)
        self.assertIn("not a header", val["error"])


class Database(unittest.TestCase):
    def test_create_insert_query_describe_export(self):
        call("kosif_db", op="create", db="shop", table="sales",
             columns={"id": "integer", "product": "text", "qty": "integer", "price": "real"},
             primary_key="id", index=["product"], replace=True)
        r = call("kosif_db", op="insert", db="shop", table="sales",
                 rows=[{"id": 1, "product": "عسل", "qty": 12, "price": 85.5},
                       {"id": 2, "product": "تمر", "qty": 40, "price": 22}, [3, "زيت", 7, 60]])
        self.assertEqual(r["rows_now"], 3)
        q = call("kosif_db", op="query", db="shop", sql="SELECT product, qty*price AS total FROM sales ORDER BY total DESC")
        self.assertEqual(q["rows"][0], ["عسل", 1026.0])
        d = call("kosif_db", op="describe", db="shop")
        self.assertEqual(d["tables"]["sales"]["rows"], 3)
        x = call("kosif_db", op="export", db="shop", name="shop-export", totals=True,
                 sql="SELECT product, qty, price FROM sales ORDER BY qty")
        self.assertTrue(Path(x["file"]).is_file())
        c = call("kosif_db", op="export", db="shop", format="csv", name="shop-export",
                 sql="SELECT * FROM sales")
        self.assertEqual(c["rows"], 3)

    def test_queries_are_read_only(self):
        call("kosif_db", op="create", db="ro", table="t", columns={"a": "integer"}, replace=True)
        for sql in ("DELETE FROM t", "SELECT 1; DROP TABLE t", "UPDATE t SET a=1"):
            val, err = protocol.call_tool("kosif_db", {"op": "query", "db": "ro", "sql": sql})
            self.assertTrue(err, sql)
        # even a SELECT that tries to write through a function is stopped by the read-only connection
        val, err = protocol.call_tool("kosif_db", {"op": "query", "db": "ro",
                                                   "sql": "WITH x AS (SELECT 1) SELECT * FROM x"})
        self.assertFalse(err)

    def test_identifiers_and_types_are_validated(self):
        val, err = protocol.call_tool("kosif_db", {"op": "create", "db": "v", "table": 'x"; DROP TABLE y; --',
                                                   "columns": {"a": "integer"}})
        self.assertTrue(err)
        val, err = protocol.call_tool("kosif_db", {"op": "create", "db": "v", "table": "ok",
                                                   "columns": {"a": "blob_of_doom"}})
        self.assertTrue(err)


class Routing(unittest.TestCase):
    def test_excel_requests_route_to_sheets(self):
        from kosif_mcp import tools_core
        self.assertEqual(tools_core.route("اعمل لي ملف اكسل فيه جدول مبيعات مرتب")["families"][0]["id"], "sheets")
        self.assertEqual(tools_core.route("انشئ قاعدة بيانات للعملاء")["families"][0]["id"], "sheets")


if __name__ == "__main__":
    unittest.main()
