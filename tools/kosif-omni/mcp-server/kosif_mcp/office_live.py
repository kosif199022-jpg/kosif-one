"""KOSIF Excel Live — work inside the Excel the user already has open, through Excel's own API (COM).

No clicks, no keyboard shortcuts, no focus change: the workbook updates in front of the user while they keep
working anywhere else. One call carries a whole list of operations (create, write, sort, totals, format, chart,
read, save), each a single COM round trip of a few milliseconds.

Which Excel: every Excel window (XLMAIN) is reached through its grid (EXCEL7) with AccessibleObjectFromWindow /
OBJID_NATIVEOM — the documented way to get the Application behind a specific window — so several Excel
processes and unsaved workbooks ("المصنف3") all work.

Safety: workbooks created by `new` in this session are KOSIF's own. In any other workbook, operations that would
change existing data (overwriting non-empty cells, clear, sort, delete charts) stop as `needs_approval` with a
preview until the user approves that op id. Saving only goes to Documents\\KOSIF or a folder enabled for KOSIF,
and overwriting a file needs approval too.
"""
from __future__ import annotations

import ctypes
import datetime as dt
import re
import threading
import time
import uuid
from ctypes import wintypes

from .registry import A, I, O, S, ToolError, obj, tool

_OWNED: set[tuple[int, str]] = set()   # (excel pid, workbook name) created by `new` (kept across restarts)
_LOCK = threading.RLock()


def _owned_file():
    from .paths import state_dir  # noqa: PLC0415
    return state_dir() / "excel_owned.json"


def _load_owned() -> None:
    import json  # noqa: PLC0415
    try:
        for pid, name in json.loads(_owned_file().read_text(encoding="utf-8")):
            _OWNED.add((int(pid), str(name)))
    except (OSError, ValueError, TypeError):
        pass


def _save_owned() -> None:
    import json  # noqa: PLC0415
    try:
        _owned_file().write_text(json.dumps(sorted(_OWNED), ensure_ascii=False), encoding="utf-8")
    except OSError:
        pass


_load_owned()
OBJID_NATIVEOM = -16  # 0xFFFFFFF0
CHARTS = {"column": 51, "bar": 57, "line": 4, "pie": 5, "doughnut": -4120, "area": 1, "scatter": -4169,
          "stacked": 52}
RPC_BUSY = (-2147418111, -2147417846)  # RPC_E_CALL_REJECTED, RPC_E_SERVERCALL_RETRYLATER


def _com():
    try:
        import pythoncom  # noqa: PLC0415
        import pywintypes  # noqa: PLC0415
        import win32com.client  # noqa: PLC0415
    except ImportError:
        raise ToolError("Excel live control needs pywin32 (pip install pywin32)") from None
    pythoncom.CoInitialize()
    return pythoncom, pywintypes, win32com.client


def _retry(fn, *a, **kw):
    """Excel refuses COM calls while a cell is being edited or a dialog is open: retry briefly, then explain."""
    _, pywintypes, _ = _com()
    for i in range(25):
        try:
            return fn(*a, **kw)
        except pywintypes.com_error as e:  # noqa: PERF203
            if e.args and e.args[0] in RPC_BUSY and i < 24:
                time.sleep(0.12)
                continue
            if e.args and e.args[0] in RPC_BUSY:
                raise ToolError("Excel is busy — a cell is being edited or a dialog is open in Excel. Press Enter "
                                "or Esc there (or close the dialog) and try again") from None
            detail = (e.args[2][2] if len(e.args) > 2 and e.args[2] and len(e.args[2]) > 2 else None) or str(e)
            raise ToolError(f"Excel refused: {detail}") from None


# ── finding Excel windows → Application / Workbook ───────────────────────────
def _enum_xlmain() -> list[int]:
    user32 = ctypes.windll.user32
    out: list[int] = []
    proto = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)

    def cb(h, _lp):
        buf = ctypes.create_unicode_buffer(32)
        user32.GetClassNameW(h, buf, 32)
        if buf.value == "XLMAIN":
            out.append(int(h))
        return True
    user32.EnumWindows(proto(cb), 0)
    return out


def _grid_of(xlmain: int) -> int | None:
    user32 = ctypes.windll.user32
    user32.FindWindowExW.restype = wintypes.HWND
    user32.FindWindowExW.argtypes = (wintypes.HWND, wintypes.HWND, wintypes.LPCWSTR, wintypes.LPCWSTR)
    desk = user32.FindWindowExW(xlmain, None, "XLDESK", None)
    grid = user32.FindWindowExW(desk, None, "EXCEL7", None) if desk else None
    return int(grid) if grid else None


def _window_object(xlmain: int):
    """Excel's Window object behind one XLMAIN window (AccessibleObjectFromWindow + OBJID_NATIVEOM)."""
    pythoncom, _, client = _com()
    grid = _grid_of(xlmain)
    if not grid:
        return None
    iid = uuid.UUID("{00020400-0000-0000-C000-000000000046}").bytes_le  # IID_IDispatch
    ptr = ctypes.c_void_p()
    hr = ctypes.oledll.oleacc.AccessibleObjectFromWindow(wintypes.HWND(grid), wintypes.DWORD(OBJID_NATIVEOM & 0xFFFFFFFF),
                                                         ctypes.c_char_p(iid), ctypes.byref(ptr))
    if hr != 0 or not ptr.value:
        return None
    try:
        disp = pythoncom.ObjectFromAddress(ptr.value, pythoncom.IID_IDispatch)
    finally:  # ObjectFromAddress took its own reference: release the raw one
        release = ctypes.WINFUNCTYPE(ctypes.c_ulong, ctypes.c_void_p)(
            ctypes.cast(ptr, ctypes.POINTER(ctypes.POINTER(ctypes.c_void_p)))[0][2])
        release(ptr)
    return client.Dispatch(disp)


def _pid_of(hwnd: int) -> int:
    pid = wintypes.DWORD()
    ctypes.windll.user32.GetWindowThreadProcessId(wintypes.HWND(hwnd), ctypes.byref(pid))
    return pid.value


def _apps(*, first: bool = False) -> list[tuple[int, object, int]]:
    """[(pid, Application, xlmain hwnd)] — one per Excel process with a reachable window. Hung windows are
    skipped (asking a hung Excel for its object model would block); first=True stops at the first one, trying
    the Excel window in front first."""
    seen: dict[int, tuple[int, object, int]] = {}
    user32 = ctypes.windll.user32
    fg = int(user32.GetForegroundWindow() or 0)
    wins = _enum_xlmain()
    wins.sort(key=lambda h: h != fg)
    for h in wins:
        pid = _pid_of(h)
        if pid in seen or user32.IsHungAppWindow(wintypes.HWND(h)):
            continue
        try:
            w = _window_object(h)
            if w is not None:
                seen[pid] = (pid, w.Application, h)
                if first:
                    break
        except Exception:  # noqa: BLE001 - a busy/blocked instance is skipped, not fatal
            continue
    if not seen:
        _, _, client = _com()
        try:
            app = client.GetActiveObject("Excel.Application")
            seen[0] = (0, app, 0)
        except Exception:  # noqa: BLE001
            pass
    return list(seen.values())


def _find_book(name: str | None):
    """→ (pid, app, workbook). name = workbook name or part of an Excel window title; default = the workbook of
    the Excel window the user looked at last (foreground Excel first)."""
    apps = _apps()
    if not apps:
        raise ToolError("no running Excel found — open Excel (or use op 'new' after starting it)")
    want = (name or "").strip().lower()
    if want:
        for pid, app, _h in apps:
            for wb in app.Workbooks:
                if want == wb.Name.lower() or want in wb.Name.lower() or want in (wb.FullName or "").lower():
                    return pid, app, wb
        raise ToolError(f"no open workbook matches {name!r}; open ones: {list_books()}")
    fg = int(ctypes.windll.user32.GetForegroundWindow() or 0)
    for pid, app, h in apps:
        if h == fg and app.ActiveWorkbook is not None:
            return pid, app, app.ActiveWorkbook
    for pid, app, _h in apps:
        if app.ActiveWorkbook is not None:
            return pid, app, app.ActiveWorkbook
    raise ToolError("Excel is open but has no workbook — use op 'new'")


def list_books() -> list[dict]:
    out = []
    for pid, app, _h in _apps():
        for wb in app.Workbooks:
            out.append({"workbook": wb.Name, "path": wb.FullName if wb.Path else None, "pid": pid,
                        "sheets": [s.Name for s in wb.Worksheets], "active_sheet": wb.ActiveSheet.Name,
                        "saved": bool(wb.Saved), "kosif_owned": (pid, wb.Name) in _OWNED})
    return out


# ── values ───────────────────────────────────────────────────────────────────
def _plain(v):
    if isinstance(v, (dt.datetime, dt.date)):
        return v.isoformat()
    if isinstance(v, float) and v.is_integer() and abs(v) < 1e15:
        return int(v)
    if hasattr(v, "Format") and hasattr(v, "year"):  # pywintypes datetime
        return str(v)
    return v


def _grid(val) -> list[list]:
    if not isinstance(val, tuple):
        return [[_plain(val)]]
    return [[_plain(c) for c in row] for row in val]


def _col_letter(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def _cell_value(v):
    """Numbers stay numbers ("12" → 12, "3.5" → 3.5); '=…' is a formula; codes like "007" stay text."""
    if v is None or isinstance(v, (bool, int, float)):
        return v
    s = str(v)
    t = s.strip()
    if re.fullmatch(r"-?(0|[1-9]\d{0,14})", t):
        return int(t)
    if re.fullmatch(r"-?(0|[1-9]\d*)\.\d+", t):
        return float(t)
    return s


def _addr(rng) -> str:
    return str(rng.Address).replace("$", "")


def _union(ws, addr: str):
    """'A1:A9,D1:D9' → one Range. Built with Application.Union because a comma inside an address string follows
    the regional list separator (Arabic Windows uses ؛), which made Range('A1:A9,D1:D9') fail."""
    parts = [p.strip() for p in re.split(r"[,;؛]", str(addr)) if p.strip()]
    if not parts:
        raise ToolError(f"empty range {addr!r}")
    rngs = [ws.Range(p) for p in parts]
    return rngs[0] if len(rngs) == 1 else ws.Application.Union(*rngs)


def _block(ws, row: int, col: int, nrows: int, ncols: int):
    """A rows×cols range by address. (Late-bound COM turns Range.Resize/Offset — properties whose arguments are
    all optional — into a property read followed by Item(r, c), i.e. ONE cell; an address is unambiguous.)"""
    return ws.Range(f"{_col_letter(col)}{row}:{_col_letter(col + max(1, ncols) - 1)}{row + max(1, nrows) - 1}")


def window_summary(hwnd: int, *, rows: int = 20) -> dict | None:
    """Cell contents of the sheet shown in one Excel window — for kosif_mouse_observe."""
    with _LOCK:
        _com()
        w = _retry(_window_object, int(hwnd))
        if w is None:
            return None
        ws = w.ActiveSheet
        ur = ws.UsedRange
        nr, nc = ur.Rows.Count, ur.Columns.Count
        top = _block(ws, ur.Row, ur.Column, min(nr, rows), min(nc, 15))
        return {"workbook": w.Parent.Name, "sheet": ws.Name, "selection": _addr(w.Application.Selection)
                if hasattr(w.Application.Selection, "Address") else None,
                "used_range": _addr(ur), "rows": _grid(top.Value), "rows_total": nr,
                "charts": ws.ChartObjects().Count, "rtl": bool(ws.DisplayRightToLeft)}


# ── operations ───────────────────────────────────────────────────────────────
def _nonempty(rng) -> list[str]:
    vals = rng.Formula
    grid = vals if isinstance(vals, tuple) else ((vals,),)
    out = []
    r0, c0 = rng.Row, rng.Column
    for i, row in enumerate(grid):
        for j, v in enumerate(row):
            if v not in (None, ""):
                out.append(f"{_col_letter(c0 + j)}{r0 + i}={str(v)[:30]}")
    return out


class _NeedsApproval(Exception):
    def __init__(self, preview: str):
        super().__init__(preview)
        self.preview = preview


def _guard_change(owned: bool, op_id: str, approved: set, preview: str):
    if not owned and op_id not in approved:
        raise _NeedsApproval(preview)


def _header_col(ws, rng, by) -> int:
    """Column index (absolute) for `by`: a letter ('D'), a 1-based number, or a header text in the first row."""
    if isinstance(by, int):
        return rng.Column + by - 1
    b = str(by).strip()
    if b.isalpha() and len(b) <= 3 and b.isascii():
        return ws.Range(f"{b}1").Column
    heads = rng.Rows(1).Value
    heads = heads[0] if isinstance(heads, tuple) else (heads,)
    for j, h in enumerate(heads):
        if str(h).strip() == b:
            return rng.Column + j
    raise ToolError(f"sort/total column {by!r} is not a letter, number or header of {_addr(rng)}")


def _rgb(hexcol: str) -> int:
    h = str(hexcol).lstrip("#")
    if len(h) != 6:
        raise ToolError(f"colour must be #RRGGBB, got {hexcol!r}")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return r | (g << 8) | (b << 16)  # Excel wants BGR


def run(ops: list[dict], *, workbook: str | None = None, sheet=None, approved=None) -> dict:
    if not isinstance(ops, list) or not ops:
        raise ToolError("ops must be a non-empty list")
    approved_ids = {str(a) for a in (approved or [])}
    t0 = time.perf_counter()
    with _LOCK:
        _com()
        results, status = [], "done"
        ctx = {"pid": None, "app": None, "wb": None, "ws": None}

        def need_book():
            if ctx["wb"] is None:
                pid, app, wb = _retry(_find_book, workbook)
                ctx.update(pid=pid, app=app, wb=wb, ws=None)
            if ctx["ws"] is None:
                ctx["ws"] = (ctx["wb"].Worksheets(sheet) if sheet not in (None, "") else ctx["wb"].ActiveSheet)
            return ctx["wb"], ctx["ws"]

        for i, op in enumerate(ops):
            name = str(op.get("op") or "").lower()
            oid = str(op.get("id") or f"x{i + 1}")
            rec: dict = {"id": oid, "op": name}
            ts = time.perf_counter()
            try:
                if name == "list":
                    rec["workbooks"] = _retry(list_books)
                elif name == "new":
                    apps = _apps(first=True)
                    if not apps:
                        _, _, client = _com()
                        app = client.Dispatch("Excel.Application")
                        app.Visible = True
                        pid = 0
                    else:
                        pid, app, _h = apps[0]
                    wb = _retry(app.Workbooks.Add)
                    _OWNED.add((pid, wb.Name))
                    _save_owned()
                    ctx.update(pid=pid, app=app, wb=wb, ws=wb.ActiveSheet)
                    if op.get("rtl") is not None:
                        ctx["ws"].DisplayRightToLeft = bool(op["rtl"])
                    rec["result"] = f"new workbook {wb.Name!r} (KOSIF-owned)"
                elif name == "use":
                    pid, app, wb = _retry(_find_book, op.get("workbook") or workbook)
                    ctx.update(pid=pid, app=app, wb=wb, ws=None)
                    if op.get("sheet") not in (None, ""):
                        ctx["ws"] = wb.Worksheets(op["sheet"])
                    rec["result"] = f"using {wb.Name!r}"
                elif name == "close":
                    wb, _ = need_book()
                    owned = (ctx["pid"], wb.Name) in _OWNED
                    _guard_change(owned, oid, approved_ids, f"close {wb.Name!r} WITHOUT saving it")
                    nm = wb.Name
                    _retry(wb.Close, False)
                    _OWNED.discard((ctx["pid"], nm))
                    _save_owned()
                    ctx.update(wb=None, ws=None)
                    rec["result"] = f"closed {nm!r} without saving"
                elif name == "add_sheet":
                    wb, _ = need_book()
                    ws = _retry(wb.Worksheets.Add)
                    if op.get("name"):
                        ws.Name = str(op["name"])[:31]
                    ctx["ws"] = ws
                    rec["result"] = f"sheet {ws.Name!r} added"
                else:
                    wb, ws = need_book()
                    owned = (ctx["pid"], wb.Name) in _OWNED
                    rec["workbook"], rec["sheet"] = wb.Name, ws.Name
                    rec["result"] = _op(name, op, oid, ws, wb, owned, approved_ids)
            except _NeedsApproval as na:
                rec.update(stopped="CONFIRM", preview=na.preview)
                results.append(rec)
                status = "needs_approval"
                break
            except ToolError as e:
                rec["error"] = str(e)
                results.append(rec)
                status = "failed"
                break
            except Exception as e:  # noqa: BLE001 - COM errors from Excel
                rec["error"] = f"Excel: {str(e)[:300]}"
                results.append(rec)
                status = "failed"
                break
            rec["ms"] = round((time.perf_counter() - ts) * 1000)
            results.append(rec)
        out = {"status": status, "ops": results, "total_ms": round((time.perf_counter() - t0) * 1000)}
        if ctx["wb"] is not None:
            out["workbook"] = ctx["wb"].Name
        if status == "needs_approval":
            out["next"] = ("this would change data in a workbook KOSIF did not create: show the user the preview; "
                           "only after they agree, resend from this op with its id in `approved`")
        return out


def _op(name: str, op: dict, oid: str, ws, wb, owned: bool, approved: set):
    rng_addr = op.get("range")
    if name == "read":
        rng = ws.Range(rng_addr) if rng_addr else ws.UsedRange
        vals = _grid(rng.Formula if op.get("formulas") else rng.Value)
        limit = int(op.get("max_rows", 200))
        return {"range": _addr(rng), "rows": vals[:limit], "rows_total": len(vals)}
    if name == "write":
        rows = op.get("rows")
        if not isinstance(rows, list) or not rows:
            raise ToolError("write needs rows: [[...], ...]")
        rows = [r if isinstance(r, list) else [r] for r in rows]
        width = max(len(r) for r in rows)
        rows = [[_cell_value(v) for v in r] + [None] * (width - len(r)) for r in rows]
        start = ws.Range(op.get("cell") or "A1")
        target = _block(ws, start.Row, start.Column, len(rows), width)
        busy = _nonempty(target)
        _guard_change(owned or not busy, oid, approved,
                      f"overwrite {len(busy)} non-empty cell(s) in {_addr(target)}: {busy[:8]}")
        _retry(setattr, target, "Formula", tuple(tuple(r) for r in rows))
        return f"wrote {len(rows)}×{width} into {_addr(target)}"
    if name == "clear":
        rng = ws.Range(rng_addr or "A1")
        _guard_change(owned, oid, approved, f"clear {_addr(rng)}: {_nonempty(rng)[:8]}")
        rng.ClearContents()
        return f"cleared {_addr(rng)}"
    if name == "sort":
        rng = ws.Range(rng_addr) if rng_addr else ws.UsedRange
        col = _header_col(ws, rng, op.get("by", 1))
        desc = str(op.get("order", "asc")).lower() in ("desc", "descending", "تنازلي", "z-a")
        header = bool(op.get("header", True))
        _guard_change(owned, oid, approved, f"reorder the rows of {_addr(rng)} by column {_col_letter(col)}")
        key = ws.Cells(rng.Row + (1 if header else 0), col)
        _retry(rng.Sort, Key1=key, Order1=2 if desc else 1, Header=1 if header else 2)
        return f"sorted {_addr(rng)} by {_col_letter(col)} {'descending' if desc else 'ascending'}"
    if name == "total":
        rng = ws.Range(rng_addr) if rng_addr else ws.UsedRange
        last = rng.Row + rng.Rows.Count  # the row right under the table
        first_data = rng.Row + (1 if op.get("header", True) else 0)
        cols = op.get("sum") or op.get("columns")
        if not cols:
            raise ToolError("total needs sum: ['B', 'D'] (letters, numbers or header names)")
        row = ws.Range(ws.Cells(last, rng.Column), ws.Cells(last, rng.Column + rng.Columns.Count - 1))
        busy = _nonempty(row)
        _guard_change(owned or not busy, oid, approved, f"overwrite the row under the table ({_addr(row)}): {busy}")
        label_col = _header_col(ws, rng, op["label_column"]) if op.get("label_column") else rng.Column
        ws.Cells(last, label_col).Value = str(op.get("label", "المجموع"))
        func = str(op.get("function", "SUM")).upper()
        if func not in ("SUM", "AVERAGE", "COUNT", "MAX", "MIN"):
            raise ToolError("function: SUM | AVERAGE | COUNT | MAX | MIN")
        done = []
        for c in cols:
            ci = _header_col(ws, rng, c)
            L = _col_letter(ci)
            ws.Cells(last, ci).Formula = f"={func}({L}{first_data}:{L}{last - 1})"
            done.append(f"{L}{last}")
        if op.get("bold", True):
            row.Font.Bold = True
        return f"{func} row {last}: {', '.join(done)}"
    if name == "format":
        rng = ws.Range(rng_addr) if rng_addr else ws.UsedRange
        did = []
        if op.get("bold") is not None:
            rng.Font.Bold = bool(op["bold"])
            did.append("bold")
        if op.get("fill"):
            rng.Interior.Color = _rgb(op["fill"])
            did.append("fill")
        if op.get("font_color"):
            rng.Font.Color = _rgb(op["font_color"])
            did.append("font colour")
        if op.get("number_format"):
            nf = {"money": "#,##0.00", "integer": "#,##0", "number": "#,##0.00", "percent": "0.0%",
                  "date": "yyyy-mm-dd"}.get(op["number_format"], op["number_format"])
            rng.NumberFormat = nf
            did.append(f"format {nf}")
        if op.get("borders"):
            rng.Borders.LineStyle = 1
            did.append("borders")
        if op.get("align"):
            rng.HorizontalAlignment = {"center": -4108, "right": -4152, "left": -4131}.get(op["align"], -4108)
            did.append("align")
        if op.get("table"):
            if rng.ListObject is None:
                lo = ws.ListObjects.Add(1, rng, None, 1)
                if isinstance(op["table"], str):
                    lo.TableStyle = op["table"]
                did.append("table")
        if op.get("rtl") is not None:
            ws.DisplayRightToLeft = bool(op["rtl"])
            did.append("rtl")
        if op.get("autofit", False):
            rng.EntireColumn.AutoFit()
            did.append("autofit")
        if op.get("freeze_header"):
            ws.Activate()
            wb.Windows(1).FreezePanes = False
            wb.Windows(1).SplitRow, wb.Windows(1).SplitColumn = 1, 0
            wb.Windows(1).FreezePanes = True
            did.append("frozen header")
        return f"{_addr(rng)}: {', '.join(did) or 'nothing to do'}"
    if name == "chart":
        src = op.get("source") or rng_addr
        if not src:
            raise ToolError("chart needs source: 'A1:A9,D1:D9'")
        ctype = CHARTS.get(str(op.get("type", "column")).lower())
        if ctype is None:
            raise ToolError(f"chart type: {sorted(CHARTS)}")
        at = ws.Range(op.get("at") or _chart_anchor(ws))
        w, h = float(op.get("width", 420)), float(op.get("height", 260))
        source = _union(ws, src)  # resolve first: a bad address must not leave an empty chart behind
        try:
            holder = ws.Shapes.AddChart2(-1, ctype, at.Left, at.Top, w, h)
            ch = holder.Chart
        except Exception:  # noqa: BLE001 - Excel 2010 and older
            holder = ws.ChartObjects().Add(at.Left, at.Top, w, h)
            ch = holder.Chart
            ch.ChartType = ctype
        try:
            ch.SetSourceData(source)
        except Exception:
            holder.Delete()
            raise
        if op.get("title"):
            ch.HasTitle = True
            ch.ChartTitle.Text = str(op["title"])
        if op.get("legend") is not None:
            ch.HasLegend = bool(op["legend"])
        return f"{op.get('type', 'column')} chart of {src} at {_addr(at)}"
    if name == "delete_charts":
        n = ws.ChartObjects().Count
        _guard_change(owned, oid, approved, f"delete {n} chart(s) on sheet {ws.Name!r}")
        for k in range(n, 0, -1):
            ws.ChartObjects(k).Delete()
        return f"deleted {n} chart(s)"
    if name == "select":
        ws.Activate()
        ws.Range(rng_addr or "A1").Select()
        return f"selected {rng_addr or 'A1'} (Excel's own selection; the foreground is unchanged)"
    if name == "save":
        from pathlib import Path  # noqa: PLC0415

        from .office import target_path  # noqa: PLC0415
        p = target_path(op.get("path"), wb.Name, ".xlsx")
        if Path(p).exists():
            _guard_change(False, oid, approved, f"overwrite the existing file {p}")
        was_owned = owned
        wb.SaveAs(str(p), 51)  # xlOpenXMLWorkbook
        if was_owned:
            _OWNED.add((_pid_of_app(wb), wb.Name))  # the name changes to the file name
            _save_owned()
        return f"saved {p}"
    raise ToolError(f"unknown op {name!r}: list | new | use | add_sheet | read | write | clear | sort | total | "
                    "format | chart | delete_charts | select | save | close")


def _pid_of_app(wb) -> int:
    for pid, name in list(_OWNED):
        if name == wb.Name:
            return pid
    try:
        return _pid_of(int(wb.Application.Hwnd))
    except Exception:  # noqa: BLE001
        return 0


def _chart_anchor(ws) -> str:
    ur = ws.UsedRange
    return f"{_col_letter(ur.Column + ur.Columns.Count + 1)}{ur.Row}"


@tool("kosif_excel",
      "KOSIF Excel Live — do a whole job inside the Excel the user has OPEN, through Excel's own API: no clicks, "
      "no shortcuts, no focus change (the user sees the sheet update while they keep working). One call = a list "
      "of ops: list | new (KOSIF-owned workbook) | use {workbook, sheet} | add_sheet | read {range?, formulas?} | "
      "write {cell:'A1', rows:[[…],…]} ('=B2*C2' strings are formulas) | sort {range, by: letter|header, order: "
      "asc|desc} | total {range, sum:['B','D'], label} | format {range, bold, fill:'#RRGGBB', number_format, "
      "borders, table, rtl, autofit, freeze_header} | chart {source:'A1:A9,D1:D9', type: column|bar|line|pie, "
      "title, at:'F2'} | delete_charts | select | save {path} | close (without saving). Changing existing data in a workbook KOSIF did not "
      "create returns needs_approval with a preview first.",
      obj({"ops": A(O("One operation: {op: …, id?, …}"), "Ordered operations."),
           "workbook": S("Workbook name or part of its window title (default: the Excel window in front / the "
                         "active workbook)."),
           "sheet": S("Sheet name (default: the active sheet)."),
           "approved": A(S(), "Op ids the user explicitly approved (changes to a workbook KOSIF did not create).")},
          ["ops"]),
      title="Excel live", read_only=False, destructive=True, idempotent=False)
def _t_excel(a: dict) -> dict:
    from .desktop import _local_only  # noqa: PLC0415  (same rule as the mouse: the user's own desktop only)
    _local_only()
    return run(a["ops"], workbook=a.get("workbook"), sheet=a.get("sheet"), approved=a.get("approved"))


__all__ = ["list_books", "run", "window_summary"]
_ = I  # schema helpers imported for symmetry with the other modules
