"""KOSIF Replicate — redraw an image in Windows Paint BY HAND, pixel for pixel, and prove the copy is exact.

Nothing is pasted or imported: every pixel is drawn with Paint's own tools, driven by Claude's pen pointer:

  1. a canvas of the image's exact size (Image properties), zoomed so one image pixel is a block of screen pixels,
  2. the Pencil at 1 px (aliased: it writes exactly Colour 1 into exactly one pixel),
  3. for every colour of the image: Edit colors → hex field → the colour's 6 hex digits → Enter, then a tap per
     pixel (a stroke for a horizontal run),
  4. a check of every pixel against the original (window capture, one sample per pixel) and repair passes until
     nothing differs, and finally the file Paint saves is compared with the original — that is the proof.

Measured facts this module is built on (Windows 11 Paint, 2026-10-06):
  * UI Automation Invoke on 'Edit colors' (it opens a MODAL dialog) timed out and Paint hung for good — so the
    dialog is opened, filled and closed with the pen and the keyboard only, never through UI Automation.
  * Typing '#F5040D' left the colour unchanged; the field accepts the digits WITHOUT '#', and Enter commits + OK.
  * Focus is NOT in the hex field when the dialog opens: it has to be tapped first.
  * The Colour 1 swatch shows the exact colour, so each colour is confirmed before a single pixel is drawn with it
    (a wrong colour would silently paint hundreds of wrong pixels).
  * The dialog covers the canvas: no tap goes out until the dialog is seen closed.

Progress is recomputed from the canvas every time, so a run can stop (user busy, emergency stop, time budget)
and simply be started again — it continues with whatever still differs.
"""
from __future__ import annotations

import json
import os
import time
from pathlib import Path

from . import desktop_native as nat
from . import live
from .registry import ToolError, B, I, N, S, obj, tool

STATE = Path(os.environ.get("KOSIF_STATE_DIR") or Path.home() / ".kosif-omni") / "paint_copy.json"


# ── the target ───────────────────────────────────────────────────────────────
def load_target(path: str, background=(255, 255, 255)):
    """→ (W, H, pixels[y][x] = (r,g,b), alpha[y][x]). Transparent pixels are the canvas colour (white)."""
    from PIL import Image  # noqa: PLC0415
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    if w * h > 200_000:
        raise ToolError(f"{w}×{h} is too large to copy pixel by pixel in Paint (limit 200,000 pixels)")
    px = im.load()
    rgb, alpha = [], []
    for y in range(h):
        row, arow = [], []
        for x in range(w):
            r, g, b, a = px[x, y]
            k = a / 255.0
            row.append(tuple(int(round(c * k + bg * (1 - k))) for c, bg in zip((r, g, b), background)))
            arow.append(a)
        rgb.append(row)
        alpha.append(arow)
    return w, h, rgb, alpha


def quantize(rgb, alpha, k: int):
    """Fewer colours = fewer trips to Paint's colour dialog (the cost: ~0.6 s each; taps are milliseconds).
    Median cut over the visible pixels only; white stays white (it is the canvas). → (rgb', palette size)."""
    from PIL import Image  # noqa: PLC0415
    H, W = len(rgb), len(rgb[0])
    im = Image.new("RGB", (W, H))
    im.putdata([tuple(c) for row in rgb for c in row])
    q = im.quantize(int(k), method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB").load()
    out = [[(255, 255, 255) if tuple(rgb[y][x]) == (255, 255, 255) or alpha[y][x] == 0 else tuple(q[x, y])
            for x in range(W)] for y in range(H)]
    return out, len({c for row in out for c in row})


def delta_e(a, b) -> float:
    """CIE76 colour difference of two sRGB colours (≈2.3 = just noticeable)."""
    def lab(c):
        v = [x / 255 for x in c]
        v = [((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in v]
        X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.9505
        Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
        Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.089
        f = [t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116 for t in (X, Y, Z)]
        return 116 * f[1] - 16, 500 * (f[0] - f[1]), 200 * (f[1] - f[2])
    la, lb = lab(a), lab(b)
    return sum((p - q) ** 2 for p, q in zip(la, lb)) ** 0.5


def hexof(c) -> str:
    return "%02X%02X%02X" % tuple(c)


def plan(rgb, todo: set | None = None, skip=(255, 255, 255)):
    """Group the pixels still to draw by colour → {hex: [(x, y), …]}, colours ordered top-down (the picture
    appears from the top, like a printer)."""
    groups: dict[str, list] = {}
    first: dict[str, tuple] = {}
    for y, row in enumerate(rgb):
        for x, c in enumerate(row):
            if (todo is not None and (x, y) not in todo) or (todo is None and tuple(c) == tuple(skip)):
                continue
            k = hexof(c)
            groups.setdefault(k, []).append((x, y))
            first.setdefault(k, (y, x))
    return dict(sorted(groups.items(), key=lambda kv: first[kv[0]]))


def runs(cells: list[tuple[int, int]]) -> list[tuple[int, int, int]]:
    """Horizontal runs (y, x0, x1) of the given cells."""
    out = []
    for x, y in sorted(cells, key=lambda c: (c[1], c[0])):
        if out and out[-1][0] == y and out[-1][2] == x - 1:
            out[-1] = (y, out[-1][1], x)
        else:
            out.append((y, x, x))
    return out


# ── colours Paint's dialog cannot hold ───────────────────────────────────────────
class Unrepresentable(ToolError):
    """Paint's Edit colors turns this colour into another one (measured: #F40001 → #F40004 — the dialog keeps
    hue below 359°, so reds with a tiny blue excess cannot be typed in)."""

    def __init__(self, want: str, got: str):
        super().__init__(f"Paint's colour dialog turns #{want} into #{got}")
        self.want, self.got = want, got


OVERLAY_OPACITY = 20  # %: one coat of S at 20 % over D gives D + (S − D)/5 — exact when S − D = 5·(T − D)


def dialog_holds(c) -> bool:
    """Prediction: does Paint's colour dialog keep this colour unchanged? Model measured on #F40001 → #F40004:
    the hue is kept below 359°. Only a hint — set_color still confirms every colour on the swatch."""
    r, g, b = (int(v) for v in c)
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn:
        return True
    d = mx - mn
    if mx == r:
        h = (60.0 * (g - b) / d) % 360
    elif mx == g:
        h = 60.0 * (b - r) / d + 120
    else:
        h = 60.0 * (r - g) / d + 240
    if h <= 359:
        return True
    h = 359.0  # what the dialog does
    x = mn + d * (1 - abs((h / 60) % 2 - 1))
    back = (mx, mn, x)  # 300° < h < 360°: R is max, G is min, B = x
    return tuple(int(round(v)) for v in back) == (r, g, b)


def recipes(target, got=None) -> list[tuple[tuple, tuple]]:
    """Ways to reach a colour T the dialog cannot hold, with Paint's own tools: pencil a base colour D at 100 %,
    then S = D + 5·(T − D) over it at 20 % opacity → D + (S − D)·0.2 = T exactly (measured exact in Paint for
    F40001 and F50003). Bases are T with one channel copied from another (hue becomes a multiple of 60°, which
    the dialog holds) or the colour Paint substituted; the closest base first."""
    t = tuple(int(v) for v in target)
    cands = {tuple(t[j] if k == i else t[k] for k in range(3)) for i in range(3) for j in range(3) if i != j}
    if got:
        cands.add(tuple(int(got[k:k + 2], 16) for k in (0, 2, 4)) if isinstance(got, str) else tuple(got))
    out = []
    for d in sorted(cands - {t}, key=lambda d: (max(abs(a - b) for a, b in zip(d, t)), d)):
        s = tuple(dd + 5 * (tt - dd) for dd, tt in zip(d, t))
        if all(0 <= v <= 255 for v in s):
            out.append((d, s))
    return out


# ── Paint, through the pen and the keyboard only ───────────────────────────────
def _sat(c) -> int:
    return max(c) - min(c)


class Paint:
    """One Paint window prepared for copying. Geometry is measured, never assumed."""

    def __init__(self, hwnd: int, w: int, h: int, *, zoom: int = 4, log=None):
        nat.ensure_dpi_aware()  # measured: at 125 % scaling an unaware read gave 1229×691 instead of 1536×864
        self.hwnd, self.w, self.h, self.zoom = int(hwnd), w, h, zoom
        self.log = log or (lambda *a, **k: None)
        self.yield_ms = 2000      # the user must be idle this long before Paint is taken back
        self.yielded_s = 0.0
        self.current = None       # the colour this job last put into Colour 1
        self.geo: dict = {}

    # pixels -------------------------------------------------------------------------------
    @staticmethod
    def screen_px(x: int, y: int):
        _w, _h, raw = nat.grab({"x": int(x), "y": int(y), "w": 1, "h": 1})
        return raw[2], raw[1], raw[0]

    def capture(self):
        g = nat.grab_window(self.hwnd)
        if not g:
            raise ToolError("Paint is minimized or cannot be captured")
        w, h, raw, rect = g
        return w, h, raw, rect

    # geometry -----------------------------------------------------------------------------
    def window_rect(self) -> dict:
        return nat._rect(self.hwnd)  # 0.001 ms; window_info (process name, elevation) took 0.11 ms per call

    def dialog_in_capture(self) -> bool:
        """Is the colour dialog open? Read from Paint's own window capture (no UI Automation — that is what hung
        Paint while a dialog was open): its colour spectrum is a long run of strongly saturated pixels."""
        import numpy as np  # noqa: PLC0415
        w, h, raw, _rect = self.capture()
        a = np.frombuffer(raw, np.uint8).reshape(h, w, 4)[: h // 2, :, :3].astype(np.int16)
        sat = (a.max(axis=2) - a.min(axis=2)) > 150
        for row in sat[60::6]:
            run = best = 0
            for v in row:
                run = run + 1 if v else 0
                best = max(best, run)
            if best > 200:
                return True
        return False

    def restore_if_minimized(self) -> bool:
        """A minimized Paint has no pixels to draw on or check: show it again WITHOUT activating it
        (SW_SHOWNOACTIVATE), once the user has been idle — the polite rule of ensure_front."""
        h = nat.wintypes.HWND(self.hwnd)
        if not nat.user32.IsIconic(h):
            return False
        nat.wait_user_idle(self.yield_ms, 24 * 3600)
        nat.user32.ShowWindow(h, 4)  # SW_SHOWNOACTIVATE
        self._wait(lambda: not nat.user32.IsIconic(h), 3, 0.05)
        time.sleep(0.4)  # let it paint before the first capture
        self.log("restored_from_minimized")
        return True

    def close_leftover_dialog(self) -> bool:
        """A run stopped mid-colour can leave Edit colors open; close it (Esc) before anything else."""
        if not self.dialog_in_capture():
            return False
        self.geo.setdefault("rect", self.window_rect())
        self.ensure_front()
        nat.hotkey("escape")
        self._wait(lambda: not self.dialog_in_capture(), 3, 0.05)
        self.log("closed_leftover_dialog")
        return True

    def calibrate(self) -> dict:
        """Find the toolbar controls (UI Automation is safe while no dialog is open) and the canvas (capture)."""
        self.restore_if_minimized()
        self.close_leftover_dialog()
        els = nat.uia_snapshot(self.hwnd, limit=300)

        def centre(pred):
            e = next((e for e in els if pred(e)), None)
            if not e:
                return None
            r = e["rect"]
            return (r["x"] + r["w"] // 2, r["y"] + r["h"] // 2)
        geo = {"rect": self.window_rect(),
               "edit_colors": centre(lambda e: e["role"] == "button" and (e.get("name") or "") == "Edit colors"),
               "pencil": centre(lambda e: e["role"] == "button" and (e.get("name") or "") == "Pencil"),
               "color1": centre(lambda e: (e.get("name") or "").startswith("Color 1")),
               "zoom": centre(lambda e: e["role"] == "combobox" and (e.get("name") or "") == "Zoom")}
        missing = [k for k, v in geo.items() if v is None]
        if missing:
            raise ToolError(f"could not find {missing} in Paint (English UI expected)")
        key = f"{self.hwnd}:{self.w}x{self.h}@{self.zoom}"
        try:
            saved = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
        except (OSError, ValueError):
            saved = {}
        try:
            geo["canvas"] = self.find_canvas()
        except ToolError:
            # a half-drawn canvas is no longer one white block: reuse the measurement of this very window, as
            # long as the window has not moved or been resized since
            mem = saved.get(key) or {}
            if mem.get("rect") != geo["rect"] or not mem.get("canvas"):
                raise
            geo["canvas"] = mem["canvas"]
            geo["canvas_from_state"] = True
            self.log("canvas_from_state", canvas=geo["canvas"])
        saved[key] = {"rect": geo["rect"], "canvas": geo["canvas"]}
        try:
            STATE.parent.mkdir(parents=True, exist_ok=True)
            STATE.write_text(json.dumps(saved), encoding="utf-8")
        except OSError:
            pass
        self.geo.update(geo)
        return geo

    def find_canvas(self) -> dict:
        """The canvas is the block of exactly (W·zoom)×(H·zoom) screen pixels whose border is the workspace
        colour. Found on a capture of the window (works while the canvas is blank or partly drawn)."""
        import numpy as np  # noqa: PLC0415
        w, h, raw, rect = self.capture()
        a = np.frombuffer(raw, np.uint8).reshape(h, w, 4)[:, :, :3].astype(np.int16)
        cw, ch = self.w * self.zoom, self.h * self.zoom
        white = (a == 255).all(axis=2)
        cols = np.where(white[:, :].sum(axis=0) >= ch * 0.5)[0]
        rows = np.where(white[:, :].sum(axis=1) >= cw * 0.5)[0]
        if not len(cols) or not len(rows):
            raise ToolError("canvas not found: start from a blank canvas")
        # the longest consecutive run of qualifying columns/rows is the canvas
        def longest(idx):
            best, cur = (idx[0], idx[0]), (idx[0], idx[0])
            for v in idx[1:]:
                cur = (cur[0], v) if v == cur[1] + 1 else (v, v)
                if cur[1] - cur[0] > best[1] - best[0]:
                    best = cur
            return best
        x0, x1 = longest(cols)
        y0, y1 = longest(rows)
        if abs((x1 - x0 + 1) - cw) > 2 or abs((y1 - y0 + 1) - ch) > 2:
            raise ToolError(f"canvas is {x1 - x0 + 1}×{y1 - y0 + 1} px on screen, expected {cw}×{ch} "
                            f"({self.w}×{self.h} at {self.zoom * 100}%)")
        return {"x": rect["x"] + int(x0), "y": rect["y"] + int(y0), "w": cw, "h": ch}

    def cell(self, x: int, y: int) -> tuple[int, int]:
        c = self.geo["canvas"]
        return c["x"] + x * self.zoom + self.zoom // 2, c["y"] + y * self.zoom + self.zoom // 2

    # safety -------------------------------------------------------------------------------
    def front_ok(self) -> bool:
        fg = int(nat.user32.GetForegroundWindow() or 0)
        return fg == self.hwnd or nat.root_owner(fg) == self.hwnd

    def ensure_front(self, idle_ms: int | None = None) -> None:
        """Keys and taps must reach Paint only. Paint already in front and the user idle → go on at once.
        Otherwise the job YIELDS: it waits until the user has left mouse and keyboard alone for `yield_ms`
        (default 2 s) before taking Paint back — it never snatches the focus back while they are working."""
        nat.check_brake()
        if self.window_rect() != self.geo["rect"]:
            raise ToolError("the Paint window moved or was resized — run again to re-measure")
        if self.front_ok() and nat.user_idle_ms() >= 250:
            return
        need = int(idle_ms or self.yield_ms)
        t0 = time.perf_counter()
        for _ in range(400):
            nat.wait_user_idle(need, 24 * 3600)
            if self.front_ok():
                break
            nat.focus_window(self.hwnd)
            time.sleep(0.15)
            if self.front_ok():
                break
        else:
            raise ToolError("Paint could not be brought to the front")
        waited = time.perf_counter() - t0
        if waited > 0.5:
            self.yielded_s += waited
            self.log("yielded_to_user", seconds=round(waited, 1))

    # colour ---------------------------------------------------------------------------------
    def look(self) -> tuple[bool, str]:
        """(colour dialog open?, Colour 1 swatch) from ONE screen capture. The dialog is drawn INSIDE Paint's
        window (no separate HWND) and FADES in and out, so a single pixel reads as 'closed' mid-fade — measured,
        and it is what made runs 6 and 9 type colours into a dialog that was not ready. So: the strongest
        saturation along a row of the colour spectrum, which survives the fade."""
        (px, py), (sx, sy) = self.geo["probe"], self.geo["color1"]
        x0, y0 = min(px, sx), min(py, sy)
        w, h, raw = nat.grab({"x": x0, "y": y0, "w": abs(px - sx) + 1, "h": abs(py - sy) + 1})

        def at(x, y):
            i = ((y - y0) * w + (x - x0)) * 4
            return raw[i + 2], raw[i + 1], raw[i]
        span = max(1, (sx - px) // 2) if sx > px else 200
        best = max(_sat(at(min(px + k * (span // 12), x0 + w - 1), py)) for k in range(13))
        return best > 60, hexof(at(sx, sy))

    def dialog_open(self) -> bool:
        p = self.geo.get("probe")
        return bool(p) and _sat(self.screen_px(*p)) > 90

    def swatch(self) -> str:
        return hexof(self.screen_px(*self.geo["color1"]))

    def learn_dialog(self) -> None:
        """Open Edit colors once, find its colour spectrum on a capture and from it the hex field."""
        import numpy as np  # noqa: PLC0415
        self.ensure_front()
        nat.PEN.tap(*self.geo["edit_colors"])
        time.sleep(1.2)
        r = self.geo["rect"]
        w, h, raw = nat.grab(r)
        a = np.frombuffer(raw, np.uint8).reshape(h, w, 4)[:, :, :3].astype(np.int16)
        sat = a.max(axis=2) - a.min(axis=2)
        best = None
        for yy in range(60, h // 2, 4):
            row = sat[yy] > 150
            x, n = 0, len(row)
            while x < n:
                if row[x]:
                    x2 = x
                    while x2 + 1 < n and row[x2 + 1]:
                        x2 += 1
                    if x2 - x > 200 and (best is None or yy < best[0]):
                        best = (yy, x, x2)
                    x = x2 + 1
                else:
                    x += 1
            if best:
                break
        if not best:
            nat.hotkey("escape")
            raise ToolError("the Edit colors dialog did not appear (or looks different)")
        yy, sx0, sx1 = best
        # spectrum top-left corner: walk up while still saturated
        top = yy
        while top > 0 and sat[top - 1, sx0 + 10] > 150:
            top -= 1
        self.geo["probe"] = (r["x"] + sx0 + 12, r["y"] + top + 6)
        # measured layout: hex field centre = spectrum right edge + 214 px, spectrum top + 20 px
        self.geo["hex"] = (r["x"] + sx1 + 214, r["y"] + top + 20)
        self.log("dialog", probe=self.geo["probe"], hex=self.geo["hex"])
        nat.hotkey("escape")
        self._wait(lambda: not self.dialog_open(), 3)

    @staticmethod
    def _wait(pred, timeout: float, step: float = 0.015) -> bool:
        end = time.time() + timeout
        while time.time() < end:
            if pred():
                return True
            time.sleep(step)
        return pred()

    def set_color(self, hx: str, tries: int = 4) -> float:
        """Make Colour 1 exactly `hx` (RRGGBB). Returns seconds taken. Raises Unrepresentable when Paint keeps
        substituting another colour (its dialog cannot hold that one), ToolError when it never reacts.
        One screen capture per check (dialog state + swatch together); no fixed sleeps on the first try —
        Paint handles the pen and key events in the order they were sent."""
        t0 = time.perf_counter()
        is_open, before = self.look()
        if before == hx and not is_open:
            self.current = hx
            return 0.0
        for attempt in range(tries):
            self.ensure_front()
            if is_open:  # a leftover dialog from a failed try
                nat.hotkey("escape")
                self._wait(lambda: not self.look()[0], 2, 0)
                is_open, before = self.look()
            nat.PEN.tap(*self.geo["edit_colors"])
            if not self._wait(lambda: self.look()[0], 3, 0):
                is_open = False
                continue
            # measured: a tap during the dialog's fade-in is lost — 50 ms after it shows is enough (1,150 colours,
            # no retry); a tooltip 'PopupHost' window, not the dialog, is what Windows announces at that moment
            time.sleep(0.05 + 0.1 * attempt)
            nat.PEN.tap(*self.geo["hex"])
            time.sleep(0.02 + 0.05 * attempt)
            if not self.front_ok():
                self.ensure_front()
            nat.hotkey("ctrl+a")
            nat.type_text(hx)
            time.sleep(0.02 + 0.05 * attempt)
            nat.hotkey("enter")
            state = {}

            def closed_with_colour():
                state["open"], state["sw"] = self.look()
                return not state["open"] and state["sw"] == hx
            if self._wait(closed_with_colour, 3, 0):
                self.current = hx
                return time.perf_counter() - t0
            is_open, got = state.get("open", False), state.get("sw", "")
            self.log("color_retry", hex=hx, attempt=attempt + 1, swatch=got, dialog=is_open)
            # Paint took the value but turned it into a NEAR colour (#F40001 → #F40004). A swatch that did not move
            # means the typing was lost — retry, never call that 'unrepresentable'.
            if not is_open and got != hx and got != before and                     max(abs(int(got[i:i + 2], 16) - int(hx[i:i + 2], 16)) for i in (0, 2, 4)) <= 12:
                raise Unrepresentable(hx, got)
            before = got
        raise ToolError(f"Paint did not take colour #{hx} after {tries} tries (swatch shows #{self.swatch()})")

    def slider(self, name: str, value: float | None = None) -> float:
        """Read (and set) one of Paint's side sliders exactly through UI Automation — only while no dialog is
        open (UI Automation during the modal colour dialog hung Paint)."""
        if self.dialog_open():
            nat.hotkey("escape")
            self._wait(lambda: not self.dialog_open(), 2)
        el = next((e for e in nat.uia_snapshot(self.hwnd, limit=300)
                   if e["role"] == "slider" and e.get("name") == name), None)
        if el is None:
            raise ToolError(f"Paint's {name!r} slider was not found")
        if value is not None:
            nat.uia_set_range(el["_el"], value)
            self._wait(lambda: abs(nat.uia_range(el["_el"])["value"] - value) < 0.01, 2)
        v = nat.uia_range(el["_el"])["value"]
        if value is not None and abs(v - value) >= 0.01:
            raise ToolError(f"Paint's {name} slider stays at {v}, not {value}")
        return v

    # drawing --------------------------------------------------------------------------------
    def draw(self, cells: list[tuple[int, int]], *, taps_only: bool = False) -> int:
        """One pen tap per pixel. Measured on this machine: a tap costs 0.97 ms (1,030 px/s) while a pen stroke
        costs 4.9 ms per step — strokes are paced to keep Windows from reading them as flick gestures, so for
        pixel work taps are 5x faster. `taps_only` is kept for see-through colour, where a stroke could lay two
        coats on one pixel."""
        _ = taps_only
        for x, y in cells:
            nat.check_brake()
            nat.PEN.tap(*self.cell(x, y))
        return len(cells)

    # checking ------------------------------------------------------------------------------
    def read_canvas(self):
        """→ canvas[y][x] (r,g,b), one sample at the centre of each pixel block, from a window capture."""
        w, h, raw, rect = self.capture()
        c = self.geo["canvas"]
        out = []
        for y in range(self.h):
            row = []
            for x in range(self.w):
                sx, sy = self.cell(x, y)
                i = ((sy - rect["y"]) * w + (sx - rect["x"])) * 4
                row.append((raw[i + 2], raw[i + 1], raw[i]))
            out.append(row)
        _ = c
        return out

    def diff(self, rgb, alpha=None) -> set:
        """Pixels that differ from the target. A pixel transparent in the original may show white (opaque
        canvas) or Paint's light-grey transparency checkerboard after the Eraser — both count as right here;
        the saved file decides its alpha."""
        cur = self.read_canvas()

        def ok(x, y):
            c = cur[y][x]
            if c == tuple(rgb[y][x]):
                return True
            return bool(alpha) and alpha[y][x] == 0 and c[0] == c[1] == c[2] and c[0] >= 190
        return {(x, y) for y in range(self.h) for x in range(self.w) if not ok(x, y)}

    def erase(self, cells: list[tuple[int, int]]) -> dict:
        """Make pixels truly transparent with Paint's Eraser at its smallest size (Windows 11 Paint erases to
        transparency since 11.2308), one tap per pixel, then go back to the Pencil."""
        els = nat.uia_snapshot(self.hwnd, limit=300)
        er = next((e for e in els if e["role"] == "button" and e.get("name") == "Eraser"), None)
        if er is None:
            raise ToolError("Paint's Eraser was not found")
        self.ensure_front()
        r = er["rect"]
        nat.PEN.tap(r["x"] + r["w"] // 2, r["y"] + r["h"] // 2)
        time.sleep(0.3)
        el = next((e for e in nat.uia_snapshot(self.hwnd, limit=300)
                   if e["role"] == "slider" and e.get("name") == "Size"), None)
        rng = nat.uia_range(el["_el"]) if el else None
        if not rng:
            raise ToolError("the eraser size slider was not found")
        self.slider("Size", rng["min"])
        label = next((e.get("value") for e in nat.uia_snapshot(self.hwnd, limit=300)
                      if e["role"] == "slider" and e.get("name") == "Size"), "")
        if not str(label).startswith("1 "):
            raise ToolError(f"the eraser cannot go down to 1 pixel (smallest: {label!r}) — it would erase "
                            "neighbouring pixels")
        self.ensure_front()
        for x, y in cells:
            nat.check_brake()
            nat.PEN.tap(*self.cell(x, y))
        time.sleep(0.2)
        nat.PEN.tap(*self.geo["pencil"])
        time.sleep(0.2)
        return {"erased": len(cells), "eraser_size": label}

    # the proof -----------------------------------------------------------------------------
    def save_as(self, path: str, timeout: float = 25.0) -> str:
        """Ctrl+S → the Save as dialog (focus starts in 'File name') → full path → Enter; waits for the file.
        Refuses to overwrite: the copy always goes to a new file."""
        path = str(Path(path).resolve())
        if os.path.exists(path):
            raise ToolError(f"{path} exists already — choose a new file name (nothing is overwritten)")
        self.ensure_front()
        nat.hotkey("ctrl+s")
        dlg = None
        end = time.time() + 10
        while time.time() < end and dlg is None:
            for w in nat.list_windows(300):
                if w["hwnd"] != self.hwnd and nat.root_owner(w["hwnd"]) == self.hwnd and \
                        nat.window_info(w["hwnd"])["class"] == "#32770":
                    dlg = w
                    break
            time.sleep(0.1)
        if dlg is None:
            raise ToolError("the Save as dialog did not open")
        time.sleep(0.4)
        for _ in range(50):
            if (nat.foreground() or {}).get("hwnd") == dlg["hwnd"]:
                break
            nat.wait_user_idle(500, 3600)
            nat.focus_window(dlg["hwnd"])
            time.sleep(0.1)
        nat.hotkey("ctrl+a")
        nat.type_text(path)
        time.sleep(0.15)
        nat.hotkey("enter")
        end = time.time() + timeout
        while time.time() < end:
            if os.path.exists(path) and os.path.getsize(path) > 0 and \
                    Path(path).stem.lower() in nat.window_info(self.hwnd)["title"].lower():
                time.sleep(0.3)
                return path
            time.sleep(0.2)
        raise ToolError(f"Paint did not save {path} (a prompt may be waiting in the Save dialog)")


# ── the job ──────────────────────────────────────────────────────────────────
def copy_image(image: str, window, *, zoom: int = 4, budget_s: float = 3600.0, log_path: str | None = None,
               max_colors: int | None = None, check_every: int = 12, colors: int | None = None) -> dict:
    t0 = time.perf_counter()
    W, H, rgb, alpha = load_target(image)
    original = rgb
    if colors:  # fast pixel mode: Python picks `colors` colours, Paint draws every pixel with them
        rgb, used = quantize(rgb, alpha, colors)
    logf = open(log_path, "a", encoding="utf-8") if log_path else None

    def log(ev, **kw):
        if logf:
            logf.write(json.dumps({"t": round(time.perf_counter() - t0, 2), "ev": ev, **kw}, ensure_ascii=False)
                       + "\n")
            logf.flush()
    hwnd = int(window) if str(window).isdigit() else None
    if hwnd is None:
        w = next((w for w in nat.list_windows(300) if str(window).lower() in w["title"].lower()), None)
        if not w:
            raise ToolError(f"no window matching {window!r}")
        hwnd = w["hwnd"]
    p = Paint(hwnd, W, H, zoom=zoom, log=log)
    p.calibrate()
    log("calibrated", geo=p.geo)
    p.ensure_front()
    nat.PEN.tap(*p.geo["pencil"])
    time.sleep(0.2)
    log("tools", size=p.slider("Size", 0), opacity=p.slider("Opacity", 100))  # pencil 1 px, fully opaque
    if "probe" not in p.geo:
        p.learn_dialog()
    todo = p.diff(rgb, alpha)
    log("start", differ=len(todo), of=W * H)
    inked = sum(1 for row in rgb for c in row if tuple(c) != (255, 255, 255))
    if p.geo.get("canvas_from_state") and len(todo) >= 0.95 * inked:  # a half-drawn canvas at the right place
        #                                                                   differs in far fewer pixels
        raise ToolError(f"the remembered canvas position does not fit ({len(todo)} of {W * H} pixels differ) — "
                        "the view may have scrolled; nothing was drawn")
    colours_done = pixels_done = 0
    cycle_s: list[float] = []
    since_check: list = []
    status = "done"
    passes = 0
    hard: dict[str, str] = {}            # colours the dialog cannot hold → what Paint turned them into
    bad_recipe: dict[str, set] = {}      # recipes that failed for a colour (a base or overlay it cannot hold)

    def out_of_budget() -> bool:
        return time.perf_counter() - t0 > budget_s or bool(max_colors and colours_done >= max_colors)
    while todo and passes < 8:
        passes += 1
        groups = plan(rgb, todo)
        log("pass", n=passes, colours=len(groups), pixels=len(todo))
        later: dict[str, list] = {}
        for k, (hx, cells) in enumerate(groups.items()):
            if out_of_budget():
                status = "budget"
                break
            if hx not in hard and not dialog_holds(bytes.fromhex(hx)):
                hard[hx] = ""  # predicted: straight to the two-coat recipe, no wasted dialog round trips
            if hx in hard:
                later[hx] = cells
                continue
            try:
                dt = p.set_color(hx)
            except Unrepresentable as u:
                hard[hx] = u.got
                later[hx] = cells
                log("unrepresentable", hex=hx, paint_gives=u.got)
                continue
            cycle_s.append(dt)
            pixels_done += p.draw(cells)
            colours_done += 1
            since_check += cells
            if colours_done % 25 == 0:
                nat.overlay_point(*p.cell(*cells[0]), f"يرسم · لون {colours_done}", dur=0)
                log("progress", colours=colours_done, pixels=pixels_done, last=hx,
                    avg_cycle=round(sum(cycle_s[-25:]) / max(1, len(cycle_s[-25:])), 3))
            if k % check_every == check_every - 1:
                time.sleep(0.05)
                bad = {c for c in since_check if c in p.diff(rgb, alpha)}
                if bad:
                    log("bad_cells", n=len(bad), sample=sorted(bad)[:5])
                since_check = []
        if status == "budget":
            break
        if later:  # two coats: every base at 100 %, then every overlay at 20 % (the opacity changes twice)
            chosen = {}
            for hx, cells in later.items():
                options = [r for r in recipes(bytes.fromhex(hx), hard.get(hx)) if r not in bad_recipe.get(hx, set())]
                for d, s in options:
                    try:
                        p.set_color(hexof(d))
                    except Unrepresentable:
                        bad_recipe.setdefault(hx, set()).add((d, s))
                        continue
                    pixels_done += p.draw(cells)
                    chosen[hx] = (d, s, cells)
                    break
                else:
                    log("no_recipe", hex=hx)
            log("coat", base=len(chosen), opacity=p.slider("Opacity", OVERLAY_OPACITY))
            for hx, (d, s, cells) in chosen.items():
                try:
                    p.set_color(hexof(s))
                except Unrepresentable:
                    bad_recipe.setdefault(hx, set()).add((d, s))
                    log("overlay_unrepresentable", hex=hx, overlay=hexof(s))
                    continue
                pixels_done += p.draw(cells, taps_only=True)
                colours_done += 1
            log("coat_done", opacity=p.slider("Opacity", 100))
        time.sleep(0.3)
        todo = p.diff(rgb, alpha)
        log("pass_end", n=passes, differ=len(todo))
    time.sleep(0.4)  # measured: a read right after the last tap can miss it (Paint had not rendered it yet)
    remaining = p.diff(rgb, alpha)
    exact = W * H - len(remaining)
    res = {"status": "done" if not remaining else status if status != "done" else "incomplete",
           "image": {"w": W, "h": H, "pixels": W * H,
                     "colours": len({hexof(c) for row in rgb for c in row}),
                     "transparent": sum(1 for row in alpha for a in row if a == 0)},
           "match": {"exact_pixels": exact, "percent": round(100.0 * exact / (W * H), 3),
                     "differ": len(remaining), "sample": sorted(remaining)[:10]},
           "work": {"colours_set": colours_done, "pixels_drawn": pixels_done, "passes": passes,
                    "avg_colour_cycle_s": round(sum(cycle_s) / max(1, len(cycle_s)), 3)},
           "seconds": round(time.perf_counter() - t0, 1)}
    if colors:
        des = [delta_e(original[y][x], rgb[y][x]) for y in range(H) for x in range(W)]
        res["fast_mode"] = {"colours_used": used, "of_original": len({tuple(c) for row in original for c in row}),
                            "exact_vs_original_percent": round(100.0 * sum(d == 0 for d in des) / len(des), 2),
                            "mean_delta_e": round(sum(des) / len(des), 2), "max_delta_e": round(max(des), 1),
                            "note": "match.percent is against the reduced-colour picture Python planned"}
    log("end", **res)
    if logf:
        logf.close()
    return res


# ── fast mode: Paint's own Paste + Crop, driven by Python through UI Automation (seconds, in the background) ──
class _Clipboard:
    """Save the user's clipboard, use it, put it back. Formats Windows cannot hand out (delayed rendering, private
    handles) are skipped and reported."""

    def __enter__(self):
        import win32clipboard as wc  # noqa: PLC0415
        self.wc, self.saved, self.lost = wc, [], []
        self._open()
        try:
            fmt = wc.EnumClipboardFormats(0)
            while fmt:
                try:
                    self.saved.append((fmt, wc.GetClipboardData(fmt)))
                except Exception:  # noqa: BLE001
                    self.lost.append(fmt)
                fmt = wc.EnumClipboardFormats(fmt)
        finally:
            wc.CloseClipboard()
        return self

    def _open(self):
        for _ in range(40):
            try:
                self.wc.OpenClipboard()
                return
            except Exception:  # noqa: BLE001 - another app holds it for a moment
                time.sleep(0.05)
        raise ToolError("the clipboard is busy (another program holds it)")

    def put_image(self, path: str) -> None:
        """PNG (keeps transparency) + CF_DIB (the picture over white) for apps that only read bitmaps."""
        import io as _io  # noqa: PLC0415
        from PIL import Image  # noqa: PLC0415
        im = Image.open(path).convert("RGBA")
        png = _io.BytesIO()
        im.save(png, "PNG")
        flat = Image.new("RGB", im.size, (255, 255, 255))
        flat.paste(im, mask=im.split()[3])
        bmp = _io.BytesIO()
        flat.save(bmp, "BMP")
        self._open()
        try:
            self.wc.EmptyClipboard()
            self.wc.SetClipboardData(self.wc.RegisterClipboardFormat("PNG"), png.getvalue())
            self.wc.SetClipboardData(8, bmp.getvalue()[14:])  # CF_DIB = the BMP without its file header
        finally:
            self.wc.CloseClipboard()

    def __exit__(self, *exc):
        self._open()
        try:
            self.wc.EmptyClipboard()
            for fmt, data in self.saved:
                try:
                    self.wc.SetClipboardData(fmt, data)
                except Exception:  # noqa: BLE001
                    self.lost.append(fmt)
        finally:
            self.wc.CloseClipboard()
        return False


def _menu_command(hwnd: int, menu: str, item: str, timeout: float = 4.0) -> None:
    """Open a Paint menu (File/Edit/View) and invoke one of its items — UI Automation only: no pointer, no keys.
    The menu flyout is a separate popup window of Paint's process; the foreground is handed back if Paint takes
    it. Measured: Edit opens in ~0.5 s and lists Cut, Copy, Paste, Copy visible layers."""
    import ctypes  # noqa: PLC0415
    from ctypes import wintypes  # noqa: PLC0415
    fg0 = int(nat.user32.GetForegroundWindow() or 0)
    top = next((e for e in nat.uia_snapshot(hwnd, limit=200) if e["role"] == "menuitem" and e.get("name") == menu),
               None)
    if top is None:
        raise ToolError(f"Paint's {menu!r} menu was not found (English UI expected)")
    pat = nat._pattern(top["_el"], 10005, "IUIAutomationExpandCollapsePattern")
    if pat is None:
        raise ToolError(f"Paint's {menu!r} menu cannot be opened through UI Automation")
    pat.Expand()
    pid = nat._pid(wintypes.HWND(hwnd))
    target = None
    end = time.time() + timeout
    proto = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
    while target is None and time.time() < end:
        pops: list[int] = []
        nat.user32.EnumWindows(proto(lambda h, _: (pops.append(int(h)) if nat._pid(h) == pid and int(h) != hwnd
                                                   and nat.user32.IsWindowVisible(h) else None) or True), 0)
        for h in pops:
            try:
                target = next((e for e in nat.uia_snapshot(h, limit=80)
                               if e["role"] == "menuitem" and e.get("name") == item), None)
            except nat.NativeError:
                target = None
            if target is not None:
                break
        if target is None:
            time.sleep(0.05)
    try:
        if target is None:
            raise ToolError(f"{item!r} did not appear in Paint's {menu} menu")
        if not nat.uia_press(target["_el"]):
            raise ToolError(f"{item!r} could not be invoked")
    finally:
        fg = int(nat.user32.GetForegroundWindow() or 0)
        if fg0 and fg != fg0 and nat.window_alive(fg0):
            nat.focus_window(fg0)  # Paint took the foreground while its menu opened: give it straight back


def _invoke_button(hwnd: int, name: str, timeout: float = 4.0) -> None:
    """Invoke a Paint toolbar button by name once it is enabled (e.g. Crop, enabled once a selection exists)."""
    end = time.time() + timeout
    while time.time() < end:
        b = next((e for e in nat.uia_snapshot(hwnd, limit=300) if e["role"] == "button" and e.get("name") == name),
                 None)
        if b is not None and b.get("enabled", True):
            fg0 = int(nat.user32.GetForegroundWindow() or 0)
            try:
                if not nat.uia_press(b["_el"]):
                    raise ToolError(f"Paint's {name!r} could not be invoked")
            finally:
                fg = int(nat.user32.GetForegroundWindow() or 0)
                if fg0 and fg != fg0 and nat.window_alive(fg0):
                    nat.focus_window(fg0)
            return
        time.sleep(0.05)
    raise ToolError(f"Paint's {name!r} button did not become available")


def paste_copy(image: str, window=None, *, new_window: bool = True, verify: bool = True) -> dict:
    """The image onto Paint's canvas in seconds, in the background: Python puts it on the clipboard (yours is
    saved and restored), then Paint's own Edit ▸ Paste and Image ▸ Crop (exact size) run through UI Automation —
    no pointer, no keystrokes, the foreground handed straight back. Verification reads Paint's real canvas back
    with Edit ▸ Copy visible layers and compares every pixel (RGB over white, and alpha).
    NOTE: this is Paint's Paste command, not pixel-by-pixel drawing — for that use copy_image (≈0.6 s/colour)."""
    t0 = time.perf_counter()
    W, H, rgb, alpha = load_target(image)
    timings: dict = {}
    if new_window or window is None:
        r = nat.launch("mspaint", activate=False)
        if not r.get("window"):
            raise ToolError("Paint did not open")
        hwnd = r["window"]["hwnd"]
        end = time.time() + 15
        while time.time() < end:  # the menus exist a moment after the window
            if any(e["role"] == "menuitem" and e.get("name") == "Edit" for e in nat.uia_snapshot(hwnd, limit=200)):
                break
            time.sleep(0.1)
    else:
        hwnd = int(window) if str(window).isdigit() else next(
            w["hwnd"] for w in nat.list_windows(300) if str(window).lower() in w["title"].lower())
    timings["window_s"] = round(time.perf_counter() - t0, 2)
    user_win = int(nat.user32.GetForegroundWindow() or 0)
    with _Clipboard() as cb:
        cb.put_image(image)
        # measured: with Paint in the background its Paste item stays DISABLED — Windows lets a packaged app read
        # the clipboard only while it is the active window. So Paint gets the focus ONCE, for about a second,
        # after the user has been idle for a moment, and the user's window gets it straight back.
        nat.wait_user_idle(400, 600)
        t = time.perf_counter()
        nat.focus_window(hwnd)
        try:
            _menu_command(hwnd, "Edit", "Paste")
            _invoke_button(hwnd, "Crop")  # canvas = the pasted picture, exactly W×H
        finally:
            if user_win and user_win != hwnd and nat.window_alive(user_win):
                nat.focus_window(user_win)
        timings["paint_had_focus_s"] = round(time.perf_counter() - t, 2)
        lost = list(cb.lost)
    check = None
    if verify:
        t = time.perf_counter()
        time.sleep(0.3)
        check = verify_on_screen(hwnd, rgb, alpha)
        timings["verify_s"] = round(time.perf_counter() - t, 2)
    return {"mode": "paste (Paint's Edit ▸ Paste + Image ▸ Crop through UI Automation)", "window": hwnd,
            "image": {"w": W, "h": H}, "match": check, "seconds": round(time.perf_counter() - t0, 2),
            "timings": timings, "clipboard_restored": not lost, "clipboard_formats_not_restored": lost,
            "focus_back_to_user": int(nat.user32.GetForegroundWindow() or 0) == user_win,
            "foreground_now": (nat.foreground() or {}).get("title")}


def verify_on_screen(hwnd: int, rgb, alpha) -> dict:
    """Find the picture in Paint's own window capture (works while Paint is behind other windows — no focus) and
    compare every pixel. Pixels transparent in the original may show white or Paint's checkerboard."""
    import numpy as np  # noqa: PLC0415
    g = nat.grab_window(hwnd)
    if not g:
        return {"error": "Paint is minimized — no pixels to check"}
    w, h, raw, _rect = g
    a = np.frombuffer(raw, np.uint8).reshape(h, w, 4)[:, :, 2::-1].astype(np.int16)  # → RGB
    t = np.array(rgb, np.int16)
    al = np.array(alpha)
    H, W = t.shape[:2]
    opaque = al > 0
    # anchor on the rarest opaque colour of the picture: few places in the window can have it
    cols, counts = np.unique(t[opaque].reshape(-1, 3), axis=0, return_counts=True)
    anchor = cols[counts.argmin()]
    ty, tx = [int(v[0]) for v in np.where((t == anchor).all(axis=2) & opaque)]
    best = None
    for sy, sx in zip(*np.where((a == anchor).all(axis=2))):
        oy, ox = int(sy) - ty, int(sx) - tx
        if oy < 0 or ox < 0 or oy + H > h or ox + W > w:
            continue
        patch = a[oy:oy + H, ox:ox + W]
        same = (patch == t).all(axis=2)
        clear_ok = (~opaque) & (patch.min(axis=2) >= 190) & (patch.max(axis=2) - patch.min(axis=2) <= 3)
        ok = same | clear_ok
        n = int(ok.sum())
        if best is None or n > best[0]:
            best = (n, ox, oy, int((same & opaque).sum()), int(clear_ok.sum()))
        if n == W * H:
            break
    if best is None:
        return {"found": False, "pixels": W * H}
    n, ox, oy, op_ok, clear = best
    return {"found": True, "pixels": W * H, "exact": n, "percent": round(100.0 * n / (W * H), 3),
            "opaque_exact": op_ok, "opaque_total": int(opaque.sum()), "transparent_shown_clear": clear,
            "at_in_window": [ox, oy]}


def _compare_image(rgb, alpha, im) -> dict:
    """Every pixel of a PIL image against the target (RGB over white + alpha)."""
    W, H = len(rgb[0]), len(rgb)
    im = im.convert("RGBA")
    if im.size != (W, H):
        return {"same_size": False, "expected": [W, H], "got": list(im.size)}
    px = im.load()
    rgb_ok = alpha_ok = worst = 0
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            k = a / 255.0
            seen = tuple(int(round(c * k + 255 * (1 - k))) for c in (r, g, b))
            rgb_ok += seen == tuple(rgb[y][x])
            alpha_ok += a == alpha[y][x]
            worst = max(worst, max(abs(s - t) for s, t in zip(seen, rgb[y][x])))
    n = W * H
    return {"same_size": True, "pixels": n, "rgb_exact": rgb_ok, "rgb_percent": round(100.0 * rgb_ok / n, 3),
            "alpha_exact": alpha_ok, "alpha_percent": round(100.0 * alpha_ok / n, 3), "max_channel_error": worst}


def compare_files(original: str, copy: str) -> dict:
    """Pixel-by-pixel comparison of the original with the file Paint saved (RGB over white, plus alpha)."""
    from PIL import Image  # noqa: PLC0415
    W, H, rgb, alpha = load_target(original)
    im = Image.open(copy).convert("RGBA")
    if im.size != (W, H):
        return {"same_size": False, "original": [W, H], "copy": list(im.size)}
    px = im.load()
    rgb_ok = alpha_ok = 0
    worst = 0
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            k = a / 255.0
            seen = tuple(int(round(c * k + 255 * (1 - k))) for c in (r, g, b))
            rgb_ok += seen == tuple(rgb[y][x])
            alpha_ok += a == alpha[y][x]
            worst = max(worst, max(abs(s - t) for s, t in zip(seen, rgb[y][x])))
    n = W * H
    return {"same_size": True, "pixels": n, "rgb_exact": rgb_ok, "rgb_percent": round(100.0 * rgb_ok / n, 3),
            "alpha_exact": alpha_ok, "alpha_percent": round(100.0 * alpha_ok / n, 3), "max_channel_error": worst}


@tool("kosif_paint_copy",
      "KOSIF Replicate — redraw an image in Windows Paint BY HAND with Paint's own tools (Pencil 1 px + Edit "
      "colors), pixel for pixel, with Claude's pen pointer, then check every pixel against the original and "
      "repair until nothing differs. Needs a Paint window with a blank canvas of the image's exact size at the "
      "given zoom and the English UI. Resumable: progress is read back from the canvas, so calling again "
      "continues. Paint is in front while it works; the user can stop it with the mouse in the top-left corner "
      "or by holding Esc. Cost: ~0.6 s per colour through Paint's colour dialog (taps are milliseconds) — an "
      "85×98 logo with 2,650 colours takes ~25 min exact; `colors: 64` draws every pixel with 64 Python-chosen "
      "colours in ~1.3 min (mean ΔE ≈ 2.4, not pixel-exact). Drawing needs Paint in front (Windows: the pen draws "
      "on what is visible); it waits for the user to be idle 2 s before taking Paint back.",
      obj({"image": S("Path of the original image (PNG/JPG…)."),
           "window": S("Paint window title or hwnd."),
           "zoom": I("Paint zoom as a factor (4 = 400 %, default).", minimum=2, maximum=8),
           "budget_s": N("Stop after this many seconds (default 3600; call again to continue)."),
           "max_colors": I("Stop after this many colours (for a quick trial).", minimum=1),
           "colors": I("Fast pixel mode: draw with this many colours (median cut) instead of every exact colour.",
                       minimum=2, maximum=4096),
           "log": S("Optional JSONL progress log path.")}, ["image", "window"]),
      title="Paint copy", read_only=False, destructive=False, idempotent=False)
def _t_paint_copy(a: dict) -> dict:
    from .desktop import _local_only  # noqa: PLC0415
    _local_only()
    try:
        return copy_image(a["image"], a["window"], zoom=int(a.get("zoom", 4)),
                          budget_s=float(a.get("budget_s", 3600)), log_path=a.get("log"),
                          max_colors=a.get("max_colors"), colors=a.get("colors"))
    except (nat.NativeError, nat.Aborted) as e:
        raise ToolError(str(e)) from None


def _cli(argv=None) -> int:
    import argparse  # noqa: PLC0415
    ap = argparse.ArgumentParser(description="Redraw an image in Paint pixel by pixel")
    ap.add_argument("image")
    ap.add_argument("--window", help="Paint window (required for drawing; paste mode opens its own by default)")
    ap.add_argument("--mode", choices=["draw", "paste"], default="draw",
                    help="draw = pixel by pixel with the pen (exact, ~0.6 s/colour); paste = Paint's Paste + Crop "
                         "through UI Automation (seconds, background)")
    ap.add_argument("--zoom", type=int, default=4)
    ap.add_argument("--budget", type=float, default=3600)
    ap.add_argument("--max-colors", type=int)
    ap.add_argument("--colors", type=int, help="fast pixel mode: draw with this many colours (Python k-means)")
    ap.add_argument("--log")
    ap.add_argument("--compare", help="compare the original with this saved copy instead of drawing")
    ap.add_argument("--save", help="save Paint's canvas to this NEW .png (Ctrl+S) and compare it with the original")
    ap.add_argument("--erase-transparent", action="store_true",
                    help="erase (to true transparency) the pixels that are transparent in the original")
    a = ap.parse_args(argv)
    if a.mode == "paste":
        print(json.dumps(paste_copy(a.image, a.window, new_window=not a.window), ensure_ascii=False))
        return 0
    if not a.window:
        ap.error("--window is required for draw mode")
    if a.compare:
        print(json.dumps(compare_files(a.image, a.compare), ensure_ascii=False))
        return 0
    if a.save or a.erase_transparent:
        W, H, _rgb, alpha = load_target(a.image)
        p = Paint(int(a.window), W, H, zoom=a.zoom)
        p.calibrate()
        if a.erase_transparent:
            clear = [(x, y) for y in range(H) for x in range(W) if alpha[y][x] == 0]
            print(json.dumps(p.erase(clear), ensure_ascii=False))
            if not a.save:
                return 0
        saved = p.save_as(a.save)
        print(json.dumps({"saved": saved, "compare": compare_files(a.image, saved)}, ensure_ascii=False))
        return 0
    print(json.dumps(copy_image(a.image, a.window, zoom=a.zoom, budget_s=a.budget, log_path=a.log,
                                max_colors=a.max_colors, colors=a.colors), ensure_ascii=False))
    return 0


__all__ = ["copy_image", "compare_files", "load_target", "plan", "runs", "Paint", "B"]

if __name__ == "__main__":
    raise SystemExit(_cli())
