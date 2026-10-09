"""KOSIF Mouse — tests that never move the mouse (gate, grounding, Jev fallback, transport lock, image blocks).

The live end-to-end check (types and clicks in a WinForms test window) runs only with KOSIF_MOUSE_LIVE=1:
    set KOSIF_MOUSE_LIVE=1 && python -m unittest mcp-server/tests/test_desktop.py
"""
from __future__ import annotations

import importlib.util
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

SERVER = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SERVER))
os.environ.setdefault("KOSIF_STATE_DIR", tempfile.mkdtemp(prefix="kosif_mouse_test_"))
os.environ["KOSIF_CURSOR"] = "0"
os.environ["KOSIF_LIVE"] = "0"   # no OS event hook in unit tests
os.environ["KOSIF_PEN"] = "0"    # no synthetic pen device in unit tests

from kosif_mcp import desktop, desktop_native as nat, live, office_live, protocol  # noqa: E402
from kosif_mcp.paths import _MODE  # noqa: E402
from kosif_mcp.registry import REGISTRY, ToolError  # noqa: E402

WIN = sys.platform == "win32"


def fake_snapshot(elements):
    """Install a snapshot without touching the screen."""
    els = {}
    for i, (role, name, extra) in enumerate(elements, 1):
        e = {"ref": f"e{i}", "role": role, "name": name, "value": None, "enabled": True, "password": False,
             "focused": False, "rect": {"x": 100 * i, "y": 100, "w": 80, "h": 30}, **extra}
        els[e["ref"]] = e
    with desktop._STATE_LOCK:
        desktop._STATE["snap"] = {"id": "test", "at": 0, "thread": 0, "window": None,
                                  "area": {"x": 0, "y": 0, "w": 1000, "h": 800}, "elements": els}


class Registration(unittest.TestCase):
    def test_tools_registered_with_honest_annotations(self):
        for name in ("kosif_mouse_status", "kosif_mouse_observe", "kosif_mouse_find", "kosif_mouse_act",
                     "kosif_mouse_do"):
            self.assertIn(name, REGISTRY)
        self.assertTrue(REGISTRY["kosif_mouse_observe"].read_only)
        self.assertFalse(REGISTRY["kosif_mouse_act"].read_only)
        self.assertTrue(REGISTRY["kosif_mouse_act"].destructive)

    def test_router_sends_mouse_requests_to_kosif_mouse(self):
        from kosif_mcp import tools_core
        fams = [f["id"] for f in tools_core.route("تحكم بالماوس واضغط زر حفظ في المفكرة")["families"]]
        self.assertEqual(fams[0], "mouse")

    def test_skill_and_command_exist(self):
        root = SERVER.parent
        self.assertTrue((root / "skills" / "kosif-mouse" / "SKILL.md").is_file())
        self.assertTrue((root / "commands" / "mouse.md").is_file())


class TransportLock(unittest.TestCase):
    def test_http_transport_refuses_screen_and_input(self):
        old = _MODE["transport"]
        _MODE["transport"] = "http"
        try:
            with mock.patch.dict(os.environ, {"KOSIF_MOUSE_HTTP": ""}):
                val, err = protocol.call_tool("kosif_mouse_act", {"actions": [{"do": "wait", "seconds": 0}]})
                self.assertTrue(err)
                self.assertIn("disabled over HTTP", val["error"])
                val, err = protocol.call_tool("kosif_mouse_observe", {})
                self.assertTrue(err)
        finally:
            _MODE["transport"] = old


class ImageBlocks(unittest.TestCase):
    def test_images_become_mcp_image_content(self):
        res = protocol.format_result({"ok": 1, "_images": [{"mime": "image/png", "data": "QUJD"}]}, False)
        self.assertEqual(res["content"][1], {"type": "image", "data": "QUJD", "mimeType": "image/png"})
        self.assertNotIn("_images", res["content"][0]["text"])


@unittest.skipUnless(WIN, "Windows only")
class Keys(unittest.TestCase):
    def test_letters_are_layout_independent(self):
        self.assertEqual(nat._vk("a"), 0x41)
        self.assertEqual(nat._vk("S"), 0x53)
        self.assertEqual(nat._vk("5"), 0x35)
        self.assertEqual(nat._vk("ctrl"), 0x11)
        self.assertEqual(nat._vk("."), 0xBE)
        with self.assertRaises(nat.NativeError):
            nat._vk("nosuchkey")


@unittest.skipUnless(WIN, "Windows only")
class GateAndGrounding(unittest.TestCase):
    def setUp(self):
        fake_snapshot([("edit", "Search box", {}), ("button", "حفظ", {}), ("button", "Send message", {}),
                       ("edit", "Password", {"password": True}), ("button", "Delete account", {})])

    def dry(self, steps, **kw):
        with mock.patch.object(nat, "window_at", return_value=None), \
                mock.patch.object(nat, "uia_focused", return_value=None):
            return desktop.act(steps, dry_run=True, **kw)

    def test_plain_click_runs(self):
        r = self.dry([{"do": "click", "ref": "e2"}])
        self.assertEqual(r["status"], "done")
        self.assertEqual(r["steps"][0]["result"], "dry-run (not executed)")

    def test_send_needs_approval_then_runs_when_approved(self):
        self.assertEqual(self.dry([{"id": "s", "do": "click", "ref": "e3"}])["status"], "needs_approval")
        self.assertEqual(self.dry([{"id": "s", "do": "click", "ref": "e3"}], approved=["s"])["status"], "done")

    def test_delete_needs_approval(self):
        self.assertEqual(self.dry([{"do": "click", "ref": "e5"}])["status"], "needs_approval")

    def test_password_field_is_handed_to_the_user(self):
        r = self.dry([{"do": "type", "ref": "e4", "text": "hunter2"}])
        self.assertEqual(r["status"], "handoff")

    def test_secret_like_text_is_blocked(self):
        r = self.dry([{"do": "type", "ref": "e1", "text": "sk-" + "a" * 30}])
        self.assertEqual(r["status"], "blocked")

    def test_lock_and_secure_attention_keys_are_blocked(self):
        self.assertEqual(self.dry([{"do": "hotkey", "keys": "ctrl+alt+del"}])["status"], "blocked")

    def test_known_app_launch_runs_unknown_needs_approval(self):
        self.assertEqual(self.dry([{"do": "launch", "app": "الرسام"}])["status"], "done")
        self.assertEqual(self.dry([{"do": "launch", "app": r"C:\tools\setup.exe"}])["status"], "needs_approval")

    def test_grounding_arabic_target(self):
        with mock.patch.object(desktop, "observe", lambda **k: None):
            f = desktop.find("اضغط زر حفظ", refresh=False)
        self.assertEqual(f["chosen"]["id"], "e2")
        self.assertEqual(f["decided_by"], "deterministic")

    def test_underspecified_instruction_asks_the_user(self):
        with mock.patch.object(desktop, "observe", lambda **k: None):
            f = desktop.find("click the button", refresh=False)
        self.assertEqual(f["decided_by"], "ask-user")

    def test_ambiguous_tie_goes_to_jev_and_unreachable_jev_asks_the_user(self):
        fake_snapshot([("button", "Save draft", {}), ("button", "Save copy", {})])
        from kosif_mcp import jev
        with mock.patch.object(desktop, "observe", lambda **k: None), \
                mock.patch.object(jev, "decide", side_effect=ToolError("Jev unreachable: test")):
            f = desktop.find("click save", refresh=False)
        if f.get("ambiguous") and not f.get("underspecified"):
            self.assertEqual(f["decided_by"], "ask-user")
            self.assertFalse(f["jev"]["reachable"])

    def test_confident_stable_jev_choice_is_used(self):
        fake_snapshot([("button", "Save draft", {}), ("button", "Save copy", {})])
        g = {"chosen": {"id": "e1"}, "ambiguous": True,
             "jev_packet": {"criteria": {"e1": "button: Save draft", "e2": "button: Save copy"},
                            "state": {"candidates": []}}}
        from kosif_mcp import jev
        fake = {"verdict": "OK", "decision": {"choice": "e2", "confidence": 0.9}, "stable": True,
                "mean_ranking": [("e2", 0.9), ("e1", 0.1)], "receipts": []}
        with mock.patch.object(jev, "decide", return_value=fake):
            out = desktop._jev_choose("save a copy", g, desktop._snap(), True)
        self.assertEqual(out["decided_by"], "jev")
        self.assertEqual(out["chosen"]["id"], "e2")


WIN_NOTEPAD = {"hwnd": 4242, "title": "notes.txt - Notepad", "process": "notepad.exe", "class": "Notepad",
               "rect": {"x": 0, "y": 0, "w": 800, "h": 600}, "minimized": False, "elevated": False, "pid": 7}
WIN_CLAUDE = {**WIN_NOTEPAD, "hwnd": 99, "title": "Claude", "process": "claude.exe", "class": "Chrome_WidgetWin_1"}


def _set_target(win, explicit):
    with desktop._STATE_LOCK:
        desktop._STATE["target"], desktop._STATE["target_explicit"] = win, explicit


@unittest.skipUnless(WIN, "Windows only")
class TargetPinning(unittest.TestCase):
    """The bug behind keystrokes landing in the chat: a stale 'foreground' target (the Claude app) was brought
    back to the front after the user's focus step. Now focus re-pins the target and the host app is guarded."""

    def setUp(self):
        fake_snapshot([("edit", "Search box", {}), ("button", "حفظ", {})])

    def run_dry(self, steps, **kw):
        with mock.patch.object(nat, "window_at", return_value=None), \
                mock.patch.object(nat, "uia_focused", return_value=None), \
                mock.patch.object(nat, "window_alive", return_value=False), \
                mock.patch.object(desktop, "_resolve_window", side_effect=lambda w: WIN_NOTEPAD):
            return desktop.act(steps, dry_run=True, **kw)

    def test_implicit_claude_target_is_never_typed_into(self):
        _set_target(WIN_CLAUDE, False)
        r = self.run_dry([{"do": "type", "ref": "e1", "text": "hello"}])
        self.assertEqual(r["status"], "ask_user")
        self.assertIn("Claude app", r["steps"][0]["reason"])

    def test_focus_step_repins_the_target(self):
        _set_target(WIN_CLAUDE, False)
        r = self.run_dry([{"do": "focus", "window": "Notepad"}, {"do": "click", "ref": "e2"}])
        self.assertEqual(r["status"], "done")
        self.assertEqual(r["target"]["process"], "notepad.exe")

    def test_window_argument_pins_the_target(self):
        _set_target(WIN_CLAUDE, False)
        r = self.run_dry([{"do": "click", "ref": "e2"}], window="Notepad")
        self.assertEqual(r["status"], "done")
        self.assertEqual(r["target"]["hwnd"], WIN_NOTEPAD["hwnd"])

    def test_bad_mode_is_refused(self):
        with self.assertRaises(ToolError):
            desktop.act([{"do": "wait", "seconds": 0}], mode="sideways")

    def test_background_mode_refuses_pointer_only_steps(self):
        ctx = {"tgt": WIN_NOTEPAD, "guard": False}
        with self.assertRaises(desktop._Stop) as cm:
            desktop._deliver({"do": "drag", "to": {"x": 5, "y": 5}}, 1, 1, None, ctx, "background", {})
        self.assertEqual(cm.exception.verdict, "BG")

    def test_modifier_shortcut_cannot_go_background(self):
        ctx = {"tgt": WIN_NOTEPAD}
        with mock.patch.object(nat, "window_alive", return_value=True), \
                mock.patch.object(nat, "thread_focus", return_value=4243), \
                mock.patch.object(nat, "class_name", return_value="Edit"):
            with self.assertRaises(nat.BackgroundUnavailable):
                desktop._bg_perform({"do": "hotkey", "keys": "ctrl+s"}, None, None, None, ctx)


@unittest.skipUnless(WIN, "Windows only")
class BackgroundHelpers(unittest.TestCase):
    def test_lparam_packs_client_coordinates(self):
        self.assertEqual(nat._lparam(5, 7), (7 << 16) | 5)
        self.assertEqual(nat._lparam(-1, 0), 0xFFFF)

    def test_modifier_detection(self):
        self.assertTrue(nat.is_modified("ctrl+s"))
        self.assertTrue(nat.is_modified(["alt", "f4"]))
        self.assertFalse(nat.is_modified("enter"))
        self.assertFalse(nat.is_modified("shift"))  # a lone modifier is a plain key press

    def test_win32_control_kinds(self):
        cases = {"WindowsForms10.EDIT.app.0.152a0af_r8_ad1": "edit", "Edit": "edit", "RichEditD2DPT": "edit",
                 "RICHEDIT50W": "edit", "Button": "button", "WindowsForms10.BUTTON.app.0.1_r8_ad1": "button",
                 "Chrome_RenderWidgetHostHWND": None, "EXCEL7": None}
        for cls, kind in cases.items():
            with mock.patch.object(nat, "class_name", return_value=cls):
                self.assertEqual(nat.win32_kind(1), kind, cls)

    def test_apps_that_drop_posted_input_are_reported(self):
        for cls, ok in (("Chrome_RenderWidgetHostHWND", False), ("MSPaintApp", False), ("Edit", True),
                        ("WindowsForms10.EDIT.app.0.1", True)):
            with mock.patch.object(nat, "class_name", return_value=cls):
                self.assertEqual(nat.post_ok(1), ok, cls)


class Drawing(unittest.TestCase):
    def test_svg_square_closes_back_to_start(self):
        paths = desktop._svg_paths("M0 0 L10 0 L10 10 L0 10 Z")
        self.assertEqual(len(paths), 1)
        self.assertEqual(paths[0][0], paths[0][-1])
        self.assertEqual(len(paths[0]), 5)

    def test_relative_commands_and_curves(self):
        paths = desktop._svg_paths("m10 10 h5 v5 c0 5 -5 5 -5 0 M50 50 q5 -5 10 0 t10 0")
        self.assertEqual(len(paths), 2)
        self.assertAlmostEqual(paths[0][1][0], 15)
        self.assertAlmostEqual(paths[0][-1][0], 10)  # c ended 5 left of (15,15)
        self.assertGreater(len(paths[1]), 10)        # curves are sampled, not drawn as chords

    def test_shapes_and_fit_keep_proportions_inside_the_box(self):
        local = desktop._shape_paths([{"type": "circle", "cx": 0, "cy": 0, "r": 10},
                                      {"type": "line", "x1": -10, "y1": 0, "x2": 10, "y2": 0}])
        box = {"x": 100, "y": 200, "w": 400, "h": 200}
        fitted = desktop._fit(local, box, margin=0.1)
        xs = [p[0] for pl in fitted for p in pl]
        ys = [p[1] for pl in fitted for p in pl]
        self.assertGreaterEqual(min(ys), 200)
        self.assertLessEqual(max(ys), 400)
        self.assertAlmostEqual((max(xs) - min(xs)), (max(ys) - min(ys)), delta=1)  # a circle stays round

    def test_unknown_shape_is_an_error(self):
        with self.assertRaises(ToolError):
            desktop._shape_paths([{"type": "star"}])


class LiveSummary(unittest.TestCase):
    def test_summary_reports_windows_and_drops_system_noise(self):
        lv = live._Live()
        lv.titles = {10: ("حفظ باسم", "#32770", "excel.exe"), 11: ("Default IME", "IME", "x.exe"),
                     12: ("المصنف5 - Excel", "XLMAIN", "EXCEL.EXE")}
        evs = [(1, 0, "shown", 10, 10, True, 0, 0), (2, 0, "dialog_open", 10, 10, True, 0, 0),
               (3, 0, "shown", 11, 11, True, 0, 0), (4, 0, "value", 12, 77, False, -4, 3),
               (5, 0, "value", 12, 78, False, -4, 4), (6, 0, "foreground", 10, 10, True, 0, 0)]
        lv.events.extend(evs)
        lv.seq = 6
        s = lv.summary(0)
        kinds = [(e["ev"], e.get("title")) for e in s["events"]]
        self.assertIn(("window_opened", "حفظ باسم"), kinds)
        self.assertIn(("dialog_opened", "حفظ باسم"), kinds)
        self.assertNotIn(("window_opened", "Default IME"), kinds)
        self.assertEqual(s["content_changes"][0]["changes"], 2)
        self.assertTrue(lv.dirty_since(12, 0) is False)  # dirty map is filled by the hook, not by extend()


class FakeRange:
    def __init__(self, ws, addr):
        self.ws, self.addr = ws, addr
        col = "".join(ch for ch in addr.split(":")[0] if ch.isalpha())
        self.Row = int("".join(ch for ch in addr.split(":")[0] if ch.isdigit()) or 1)
        self.Column = ord(col[0]) - 64
        self.Address = "$" + addr.replace(":", ":$")

    @property
    def Formula(self):  # noqa: N802
        return self.ws.cells.get(self.addr, ((None,),))

    @Formula.setter
    def Formula(self, v):  # noqa: N802
        self.ws.cells[self.addr] = v

    def Sort(self, **kw):  # noqa: N802
        self.ws.sorted = kw


class FakeSheet:
    Name = "ورقة1"

    def __init__(self):
        self.cells, self.sorted = {}, None

    def Range(self, addr):  # noqa: N802
        return FakeRange(self, addr)


class ExcelLiveGate(unittest.TestCase):
    """Changing data in a workbook KOSIF did not create needs the user's approval first."""

    def test_cell_values(self):
        self.assertEqual(office_live._cell_value("12"), 12)
        self.assertEqual(office_live._cell_value("3.5"), 3.5)
        self.assertEqual(office_live._cell_value("007"), "007")
        self.assertEqual(office_live._cell_value("=B2*C2"), "=B2*C2")
        self.assertEqual(office_live._col_letter(28), "AB")

    def test_write_over_existing_cells_needs_approval_unless_owned(self):
        ws = FakeSheet()
        ws.cells["A1:B1"] = (("old", "data"),)
        with self.assertRaises(office_live._NeedsApproval):
            office_live._op("write", {"cell": "A1", "rows": [["x", "y"]]}, "w1", ws, None, False, set())
        office_live._op("write", {"cell": "A1", "rows": [["x", "y"]]}, "w1", ws, None, False, {"w1"})
        self.assertEqual(ws.cells["A1:B1"], (("x", "y"),))
        ws2 = FakeSheet()
        office_live._op("write", {"cell": "A1", "rows": [[1, 2]]}, "w2", ws2, None, False, set())  # empty: fine

    def test_sort_of_someone_elses_workbook_needs_approval(self):
        ws = FakeSheet()
        with self.assertRaises(office_live._NeedsApproval):
            office_live._op("sort", {"range": "A1:D9", "by": "D", "order": "desc"}, "s1", ws, None, False, set())
        self.assertIsNone(ws.sorted)


class NewTools(unittest.TestCase):
    def test_registered_with_honest_annotations(self):
        self.assertTrue(REGISTRY["kosif_mouse_live"].read_only)
        self.assertFalse(REGISTRY["kosif_excel"].read_only)
        self.assertTrue(REGISTRY["kosif_excel"].destructive)
        self.assertIn("pointer", REGISTRY["kosif_mouse_act"].schema["properties"])

    def test_excel_is_refused_over_http(self):
        old = _MODE["transport"]
        _MODE["transport"] = "http"
        try:
            with mock.patch.dict(os.environ, {"KOSIF_MOUSE_HTTP": ""}):
                val, err = protocol.call_tool("kosif_excel", {"ops": [{"op": "list"}]})
            self.assertTrue(err)
        finally:
            _MODE["transport"] = old


class HardRunFixes(unittest.TestCase):
    """Regressions from the 2026-10-06 four-app run (Excel → Calculator → Notepad → Paint)."""

    def test_pen_strokes_are_split_into_short_paced_steps(self):
        pts = nat.Pen.densify([(0.0, 0.0), (100.0, 0.0), (100.0, 40.0)], 5.0)
        steps = [((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5 for a, b in zip(pts, pts[1:])]
        self.assertLessEqual(max(steps), 5.0001)
        self.assertEqual(pts[-1], (100.0, 40.0))
        pen, frames = nat.Pen(), []
        with mock.patch.object(pen, "_frame", side_effect=lambda x, y, f, **k: frames.append((x, y, f))), \
                mock.patch.object(nat.time, "sleep") as slept:
            pen.stroke([(0, 0), (60, 0), (60, 60), (0, 60), (0, 0)], step_delay=0)  # the 'flick' rectangle
        moves = [f for f in frames if f[2] & nat.PF_INCONTACT]
        self.assertGreater(len(moves), 40)                         # 240 px of outline → ≥ 48 frames
        self.assertGreaterEqual(min(c.args[0] for c in slept.call_args_list), 0.002)  # never sent in one burst
        self.assertTrue(frames[-2][2] & nat.PF_UP and frames[-3][2] & nat.PF_INCONTACT)  # rests, then lifts

    def test_a_tap_stays_a_single_frame_tap(self):
        pen, frames = nat.Pen(), []
        with mock.patch.object(pen, "_frame", side_effect=lambda x, y, f, **k: frames.append(f)), \
                mock.patch.object(nat.time, "sleep"):
            pen.tap(10, 10)
        self.assertEqual(sum(1 for f in frames if f & nat.PF_INCONTACT), 1)

    def test_filled_bar_is_one_zigzag_stroke_inside_its_outline(self):
        strokes = desktop._hatch([(0, 0), (30, 0), (30, 60), (0, 60), (0, 0)], 3)
        self.assertEqual(len(strokes), 1)
        xs = [p[0] for p in strokes[0]]
        ys = [p[1] for p in strokes[0]]
        self.assertTrue(min(xs) >= 0 and max(xs) <= 30 and min(ys) > 0 and max(ys) < 60)
        self.assertEqual(len(strokes[0]), 2 * 20)  # 60 px tall / 3 px gap

    def test_closed_outlines_run_on_past_their_start(self):
        rect = desktop._shape_paths([{"type": "rect", "x": 0, "y": 0, "w": 10, "h": 20}])[0]
        self.assertEqual(rect[4], (0.0, 0.0))
        self.assertEqual(rect[-1], (3.0, 0.0))  # back over the first edge: the tapered start gets sealed
        ring = desktop._shape_paths([{"type": "circle", "cx": 0, "cy": 0, "r": 5}])[0]
        self.assertGreater(len(ring), 61)
        self.assertEqual(desktop._shape_paths([{"type": "polyline", "points": [[0, 0], [5, 5]]}])[0][-1], (5.0, 5.0))
        svg = desktop._draw_points({"svg": "M0 0 L10 0 L10 10 Z", "box": {"x": 0, "y": 0, "w": 100, "h": 100}})[0]
        self.assertEqual(len(svg), 5)
        self.assertEqual(len(desktop._hatch(desktop._shape_paths([{"type": "rect", "x": 0, "y": 0, "w": 30, "h": 30}],
                                                                 overlap=False)[0], 2)), 1)

    def test_fill_rows_are_whole_pixels_evenly_spaced(self):
        ys = sorted({p[1] for p in desktop._hatch([(0, 100.5), (30, 100.5), (30, 160.5), (0, 160.5)], 3)[0]})
        self.assertTrue(all(float(y).is_integer() for y in ys))  # x.5 rows were rounded into 4/2/4/2 → stripes
        self.assertEqual({b - a for a, b in zip(ys, ys[1:])}, {3})

    def test_region_of_a_covered_window_is_cut_from_the_window_not_the_screen(self):
        win = {"hwnd": 42, "title": "Untitled - Paint", "process": "mspaint.exe", "minimized": False,
               "elevated": False, "rect": {"x": 100, "y": 100, "w": 200, "h": 100}}
        raw = bytes(range(256)) * (200 * 100 * 4 // 256) + bytes(200 * 100 * 4 % 256)
        with mock.patch.object(desktop, "_resolve_window", return_value=win), \
                mock.patch.object(nat, "virtual_screen", return_value={"x": 0, "y": 0, "w": 1920, "h": 1080}), \
                mock.patch.object(nat, "foreground", return_value={"hwnd": 7}), \
                mock.patch.object(nat, "grab_window", return_value=(200, 100, raw, win["rect"])), \
                mock.patch.object(nat, "grab", side_effect=AssertionError("screen grab of a covered window")), \
                mock.patch.object(nat, "self_elevated", return_value=False):
            o = desktop.observe(target="Paint", region={"x": 150, "y": 120, "w": 500, "h": 40}, screenshot=True,
                                elements=False, annotate=False)
        self.assertEqual(o["capture"], "window")
        self.assertEqual(o["area"], {"x": 150, "y": 120, "w": 150, "h": 40})  # clipped to the window
        self.assertEqual((o["image"]["width"], o["image"]["height"]), (150, 40))

    def test_concave_fill_gets_one_stroke_per_inside_segment(self):
        u_shape = [(0, 0), (10, 0), (10, 20), (20, 20), (20, 0), (30, 0), (30, 30), (0, 30)]
        strokes = desktop._hatch(u_shape, 2)
        self.assertGreater(len(strokes), 10)
        self.assertTrue(all(len(s) == 2 for s in strokes))

    def test_draw_step_with_fill_adds_hatch_after_the_outline(self):
        step = {"do": "draw", "box": {"x": 100, "y": 100, "w": 400, "h": 400}, "viewbox": [0, 0, 100, 100],
                "shapes": [{"type": "rect", "x": 10, "y": 10, "w": 20, "h": 80, "fill": True},
                           {"type": "line", "x1": 0, "y1": 95, "x2": 100, "y2": 95, "fill": True}]}
        paths = desktop._draw_points(step)
        self.assertEqual(len(paths), 3)  # rect outline + line + one zig-zag fill (a line is never filled)
        region = desktop._draw_region(step, None)
        self.assertTrue(region["x"] <= min(p[0] for pl in paths for p in pl))

    @unittest.skipUnless(importlib.util.find_spec("numpy"), "numpy")
    def test_thin_stroke_registers_as_a_change(self):
        w, h = 960, 540
        white = bytearray(b"\xff" * (w * h * 4))
        line = bytearray(white)
        for x in range(100, 860):  # a 2-px red line, like the trend line drawn in Paint
            for y in (300, 301):
                line[(y * w + x) * 4:(y * w + x) * 4 + 3] = b"\x00\x00\xff"
        frac = nat.changed(nat._pool(bytes(white), w, h), nat._pool(bytes(line), w, h))
        self.assertGreaterEqual(frac, 0.004)
        crop = (90, 280, 780, 40)  # the drawing's own box: the stroke is a much larger share of it
        self.assertGreater(nat.changed(nat._pool(bytes(white), w, h, crop=crop),
                                       nat._pool(bytes(line), w, h, crop=crop)), 3 * frac)

    def test_postcondition_hint_dropped_when_a_later_step_verifies(self):
        actions = [{"do": "click"}, {"do": "click"}, {"do": "click", "expect": {"text": "x"}}, {"do": "click"}]
        note = "no postcondition: add `expect`"
        results = [{"i": i, "gate": {"notes": [note, "other"]}} for i in range(4)]
        desktop._quiet_postcondition_notes(results, actions)
        self.assertEqual(results[0]["gate"]["notes"], ["other"])
        self.assertEqual(results[3]["gate"]["notes"], [note, "other"])

    def test_focus_goes_back_after_a_side_effect_activation(self):
        user = {"hwnd": 1, "title": "سند يومية", "process": "RPhenix.exe"}
        paint = {"hwnd": 2, "title": "Untitled - Paint", "process": "mspaint.exe"}
        dialog = {"hwnd": 3, "title": "Save as", "process": "notepad.exe"}
        owners = {3: 2}
        with mock.patch.object(nat, "window_alive", return_value=True), \
                mock.patch.object(nat, "root_owner", side_effect=lambda h: owners.get(h, h)):
            with mock.patch.object(nat, "foreground", return_value=paint), \
                    mock.patch.object(nat, "user_idle_ms", return_value=10 ** 9):
                self.assertTrue(desktop._ours_in_front({"tgt": paint}, user, 2.0))   # a pen tap raised Paint
                self.assertFalse(desktop._ours_in_front({"tgt": paint}, paint, 2.0))  # it was already in front
            with mock.patch.object(nat, "foreground", return_value=paint), \
                    mock.patch.object(nat, "user_idle_ms", return_value=300):
                self.assertFalse(desktop._ours_in_front({"tgt": paint}, user, 2.0))  # the user clicked it
                self.assertTrue(desktop._ours_in_front({"tgt": paint, "took_fg": True}, user, 2.0))
            with mock.patch.object(nat, "foreground", return_value=paint), \
                    mock.patch.object(nat, "user_idle_ms", return_value=10 ** 9):
                self.assertTrue(desktop._ours_in_front({"tgt": dialog}, user, 1.0))  # dialog closed → owner up
            other = {"hwnd": 9, "title": "Chrome", "process": "chrome.exe"}
            with mock.patch.object(nat, "foreground", return_value=other), \
                    mock.patch.object(nat, "user_idle_ms", return_value=10 ** 9):
                self.assertFalse(desktop._ours_in_front({"tgt": paint}, user, 1.0))  # not ours: leave it

    def test_launch_notepad_opens_a_blank_tab_instead_of_the_users_file(self):
        tgt = {"hwnd": 5, "title": "settings.json - Notepad", "process": "Notepad.exe"}
        titles = iter(["settings.json - Notepad", "Untitled - Notepad"])
        pressed = []
        with mock.patch.object(nat, "uia_snapshot",
                               return_value=[{"role": "button", "name": "Add New Tab", "_el": "EL"}]), \
                mock.patch.object(nat, "uia_press", side_effect=lambda el: pressed.append(el) or "invoke"), \
                mock.patch.object(nat, "window_info", side_effect=lambda h: {"title": next(titles)}), \
                mock.patch.object(desktop.time, "sleep"):
            r = desktop._fresh_document("notepad", {"tgt": tgt, "guard": False}, {})
        self.assertEqual(pressed, ["EL"])
        self.assertTrue(r["opened_blank_tab"])
        self.assertIsNone(desktop._fresh_document("notepad", {"tgt": {**tgt, "title": "Untitled - Notepad"}}, {}))
        self.assertIsNone(desktop._fresh_document("mspaint", {"tgt": tgt}, {}))
        self.assertIsNone(desktop._fresh_document("notepad", {"tgt": tgt}, {"new_document": False}))

    def test_grabbing_app_makes_the_next_step_wait_for_an_idle_user(self):
        desktop._FG_GRABBERS.discard("calculatorapp.exe")
        ctx = {"tgt": {"hwnd": 7, "process": "CalculatorApp.exe"}, "guard": True}
        with mock.patch.object(nat.user32, "GetForegroundWindow", side_effect=[1, 7, 1, 1]), \
                mock.patch.object(nat, "window_alive", return_value=True), \
                mock.patch.object(nat, "focus_window", return_value=True) as back, \
                mock.patch.object(nat, "wait_user_idle", return_value=0) as idle, \
                mock.patch.object(desktop.time, "sleep"):
            self.assertEqual(desktop._keep_focus(lambda: "invoke", ctx), ("invoke", True))
            back.assert_called_once_with(1)
            idle.assert_not_called()
            desktop._keep_focus(lambda: "invoke", ctx)
            idle.assert_called_once()
        desktop._FG_GRABBERS.discard("calculatorapp.exe")

    def test_a_timed_out_invoke_stops_instead_of_trying_more_patterns(self):
        """Paint hung for good after Invoke on 'Edit colors' timed out and the old code went on to Toggle,
        Select, Expand and DoDefaultAction on the same button."""
        class COMErr(Exception):
            hresult = -2146233083  # UIA_E_TIMEOUT
        invoke = mock.Mock(**{"Invoke.side_effect": COMErr()})
        others = mock.Mock()
        with mock.patch.object(nat, "_pattern", side_effect=lambda el, pid, iface: invoke if pid == 10000 else others):
            with self.assertRaises(nat.AppBusy):
                nat.uia_press(object())
        others.Toggle.assert_not_called()
        others.Select.assert_not_called()
        others.DoDefaultAction.assert_not_called()

    def test_busy_app_ends_the_batch_as_app_busy_not_an_internal_error(self):
        fake_snapshot([("button", "Edit colors", {})])
        _set_target(WIN_NOTEPAD, True)
        with mock.patch.object(nat, "window_alive", return_value=True), \
                mock.patch.object(nat, "window_info", return_value=WIN_NOTEPAD), \
                mock.patch.object(nat, "foreground", return_value=WIN_NOTEPAD), \
                mock.patch.object(nat, "uia_focused", return_value=None), \
                mock.patch.object(nat, "overlay_start"), mock.patch.object(nat, "overlay_point"), \
                mock.patch.object(desktop, "_deliver", side_effect=nat.AppBusy("no answer")):
            r = desktop.act([{"do": "click", "ref": "e1"}, {"do": "click", "ref": "e1"}])
        self.assertEqual(r["status"], "app_busy")
        self.assertEqual(len(r["steps"]), 1)  # the second click was not sent to a hung app
        self.assertIn("screenshot", r["next"])

    def test_live_summary_uses_current_titles_and_drops_untitled_closes(self):
        lv = live._Live()
        lv.titles = {10: ("Open", "#32770", "notepad.exe"), 13: ("", "", ""),
                     14: ("MIT Message Only Window", "X", "notepad.exe")}
        lv.events.extend([(1, 0, "shown", 10, 10, True, 0, 0), (2, 0, "destroyed", 13, 13, True, 0, 0),
                          (3, 0, "shown", 14, 14, True, 0, 0)])
        lv.seq = 3
        with mock.patch.object(lv, "title_now", side_effect=lambda r: "Save as" if r == 10 else ""):
            s = lv.summary(0)
        self.assertEqual([(e["ev"], e["title"]) for e in s["events"]], [("window_opened", "Save as")])
        self.assertFalse(live.reportable(("MIT Message Only Window", "X", "p")))
        self.assertFalse(live.reportable(("", "#32770", "p")))
        self.assertTrue(live.reportable(("Save as", "#32770", "p")))


@unittest.skipUnless(WIN and os.environ.get("KOSIF_MOUSE_LIVE") == "1", "live desktop test (KOSIF_MOUSE_LIVE=1)")
class Live(unittest.TestCase):
    def test_type_and_click_in_testbed(self):
        import subprocess
        import time
        log = Path(tempfile.mkdtemp()) / "bed.log"
        p = subprocess.Popen(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-STA", "-File",
                              str(SERVER / "tests" / "fixtures" / "mouse_testbed.ps1"), "-Log", str(log),
                              "-Seconds", "40"])
        try:
            for _ in range(150):
                if any("KOSIF Mouse Testbed" in w["title"] for w in nat.list_windows(300)):
                    break
                time.sleep(0.2)
            desktop.observe(target="KOSIF Mouse Testbed", screenshot=False)
            r = desktop.act([{"do": "focus", "window": "KOSIF Mouse Testbed"},
                             {"do": "type", "target": "search box", "text": "مرحبا", "clear": True},
                             {"do": "click", "target": "زر حفظ", "expect": {"text": "saved: مرحبا"}}])
            self.assertEqual(r["status"], "done", r)
            self.assertIn("save|مرحبا", log.read_text(encoding="utf-8-sig"))
        finally:
            p.kill()


if __name__ == "__main__":
    unittest.main()
