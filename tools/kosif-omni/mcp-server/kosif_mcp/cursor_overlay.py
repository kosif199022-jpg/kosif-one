"""KOSIF agent cursor — Claude's own pointer on the screen, separate from the user's mouse.

A tiny always-on-top window that is layered (per-pixel alpha), click-through (WS_EX_TRANSPARENT), never takes
focus (WS_EX_NOACTIVATE) and stays off the taskbar/Alt-Tab (WS_EX_TOOLWINDOW). It is deliberately VISIBLE to
the user and to screen recordings: it exists so a person can always see where the agent is working. Only the
agent's own screenshots ask it to step aside for a moment ({"cmd":"hide"} … {"cmd":"show"}) so it never covers
a control the model is trying to read.

It only *shows* where the agent is working: real input goes through desktop_native (UIA / pen / SendInput).
Driven by fire-and-forget UDP JSON on 127.0.0.1 (port written to <state>/cursor_overlay.port):
  {"cmd":"move","x":..,"y":..,"label":"…","dur":0.18}   glide there (ease-out)
  {"cmd":"click","x":..,"y":..}  {"cmd":"pen","x":..,"y":..,"down":true}  {"cmd":"label","text":"…"}
  {"cmd":"show"} {"cmd":"hide"} {"cmd":"raise"} {"cmd":"quit"}
Exits by itself after 30 idle minutes.  Run:  python -m kosif_mcp.cursor_overlay  [--demo]
"""
from __future__ import annotations

import ctypes
import json
import math
import os
import queue
import socket
import sys
import threading
import time
from ctypes import wintypes

ORANGE = (217, 119, 87)        # Claude orange #D97757
ORANGE_DARK = (179, 84, 58)
INK = (31, 30, 29)
CREAM = (250, 249, 245)
W, H = 400, 110                # overlay canvas; the pointer tip sits at (TIP, TIP)
TIP = 8
IDLE_EXIT = 30 * 60

user32 = ctypes.WinDLL("user32", use_last_error=True)
gdi32 = ctypes.WinDLL("gdi32", use_last_error=True)
kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
WNDPROC = ctypes.WINFUNCTYPE(ctypes.c_ssize_t, wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM)
user32.DefWindowProcW.argtypes = (wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM)
user32.DefWindowProcW.restype = ctypes.c_ssize_t
user32.SetWindowPos.argtypes = (wintypes.HWND, wintypes.HWND, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int,
                                ctypes.c_uint)
VP = ctypes.c_void_p  # 64-bit handles must never pass through ctypes' default 32-bit int
user32.GetDC.restype, user32.GetDC.argtypes = VP, (VP,)
user32.ReleaseDC.argtypes = (VP, VP)
user32.UpdateLayeredWindow.argtypes = (VP, VP, VP, VP, VP, VP, wintypes.DWORD, VP, wintypes.DWORD)
user32.CreateWindowExW.restype = VP
user32.CreateWindowExW.argtypes = (wintypes.DWORD, wintypes.LPCWSTR, wintypes.LPCWSTR, wintypes.DWORD, ctypes.c_int,
                                   ctypes.c_int, ctypes.c_int, ctypes.c_int, VP, VP, VP, VP)
user32.ShowWindow.argtypes = (VP, ctypes.c_int)
gdi32.CreateCompatibleDC.restype, gdi32.CreateCompatibleDC.argtypes = VP, (VP,)
gdi32.CreateDIBSection.restype = VP
gdi32.CreateDIBSection.argtypes = (VP, VP, wintypes.UINT, ctypes.POINTER(VP), VP, wintypes.DWORD)
gdi32.SelectObject.restype, gdi32.SelectObject.argtypes = VP, (VP, VP)
gdi32.DeleteObject.argtypes = (VP,)
gdi32.DeleteDC.argtypes = (VP,)
kernel32.GetModuleHandleW.restype = VP


class WNDCLASSW(ctypes.Structure):
    _fields_ = [("style", wintypes.UINT), ("lpfnWndProc", WNDPROC), ("cbClsExtra", ctypes.c_int),
                ("cbWndExtra", ctypes.c_int), ("hInstance", wintypes.HINSTANCE), ("hIcon", wintypes.HICON),
                ("hCursor", wintypes.HANDLE), ("hbrBackground", wintypes.HBRUSH), ("lpszMenuName", wintypes.LPCWSTR),
                ("lpszClassName", wintypes.LPCWSTR)]


class BLENDFUNCTION(ctypes.Structure):
    _fields_ = [("BlendOp", ctypes.c_ubyte), ("BlendFlags", ctypes.c_ubyte), ("SourceConstantAlpha", ctypes.c_ubyte),
                ("AlphaFormat", ctypes.c_ubyte)]


class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [("biSize", wintypes.DWORD), ("biWidth", wintypes.LONG), ("biHeight", wintypes.LONG),
                ("biPlanes", wintypes.WORD), ("biBitCount", wintypes.WORD), ("biCompression", wintypes.DWORD),
                ("biSizeImage", wintypes.DWORD), ("biXPelsPerMeter", wintypes.LONG), ("biYPelsPerMeter", wintypes.LONG),
                ("biClrUsed", wintypes.DWORD), ("biClrImportant", wintypes.DWORD)]


def _font(size: int, bold: bool = False):
    from PIL import ImageFont  # noqa: PLC0415
    for name in (("segoeuib.ttf" if bold else "segoeui.ttf"), "tahoma.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", name), size)
        except OSError:
            continue
    return ImageFont.load_default()


def _shape(text: str) -> str:
    """Arabic needs joining + right-to-left ordering (Pillow without libraqm does neither)."""
    if not any("\u0600" <= c <= "\u06ff" for c in text):
        return text
    try:
        import arabic_reshaper  # noqa: PLC0415
        from bidi.algorithm import get_display  # noqa: PLC0415
        return get_display(arabic_reshaper.reshape(text), base_dir="R")
    except ImportError:
        return text


def _spark(d, cx: float, cy: float, r: float, color, rays: int = 10) -> None:
    """Claude's spark: a ring of tapered, slightly uneven rays around a small core."""
    for i in range(rays):
        a = i * 2 * math.pi / rays + 0.15
        ln = r * (1.0 if i % 2 == 0 else 0.78)
        w = r * 0.22
        tip = (cx + math.cos(a) * ln, cy + math.sin(a) * ln)
        left = (cx + math.cos(a + math.pi / 2) * w * 0.5, cy + math.sin(a + math.pi / 2) * w * 0.5)
        right = (cx + math.cos(a - math.pi / 2) * w * 0.5, cy + math.sin(a - math.pi / 2) * w * 0.5)
        d.polygon([left, tip, right], fill=color)
    d.ellipse([cx - r * 0.28, cy - r * 0.28, cx + r * 0.28, cy + r * 0.28], fill=color)


def render(label: str = "", *, state: str = "idle", ripple: float = 0.0, alpha: float = 1.0):
    """RGBA image of the cursor (4x supersampled, then downscaled for smooth edges)."""
    from PIL import Image, ImageDraw  # noqa: PLC0415
    S = 4
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    t = TIP * S
    if ripple > 0:  # click ring
        rr = (10 + 26 * ripple) * S
        a = int(220 * (1 - ripple))
        d.ellipse([t - rr, t - rr, t + rr, t + rr], outline=ORANGE + (a,), width=3 * S)
    # pointer arrow: cream outline, orange body (darker while "pressed")
    arrow = [(0, 0), (0, 21), (5.2, 16.2), (8.6, 24.2), (12.2, 22.6), (8.8, 14.8), (15.6, 14.8)]
    k = 1.38 * S
    d.polygon([(t + x * k, t + y * k) for x, y in arrow], fill=CREAM + (255,))
    d.polygon([(t + (x * 0.8 + 1.1) * k, t + (y * 0.8 + 2.4) * k) for x, y in arrow],
              fill=(ORANGE_DARK if state == "down" else ORANGE) + (255,))
    _spark(d, t + 31 * S, t + 31 * S, 9.5 * S, ORANGE + (255,))  # Claude spark badge
    if state == "pen":
        d.ellipse([t - 3.5 * S, t - 3.5 * S, t + 3.5 * S, t + 3.5 * S], fill=INK + (255,))
    if label:
        fb, f = _font(13 * S, bold=True), _font(13 * S)
        text = _shape(label[:48])
        x0, y0 = t + 44 * S, t + 20 * S
        bc = d.textbbox((0, 0), "Claude", font=fb)
        bt = d.textbbox((0, 0), text, font=f)
        cw, tw = bc[2] - bc[0], bt[2] - bt[0]
        top = min(bc[1], bt[1])
        th = max(bc[3], bt[3]) - top
        tw = min(tw, (W - 70) * S - cw)
        d.rounded_rectangle([x0, y0, x0 + cw + tw + 30 * S, y0 + th + 14 * S], radius=10 * S, fill=INK + (235,))
        d.text((x0 + 10 * S, y0 + 7 * S - top), "Claude", font=fb, fill=ORANGE + (255,))
        d.text((x0 + 20 * S + cw, y0 + 7 * S - top), text, font=f, fill=CREAM + (255,))
    im = im.resize((W, H), Image.LANCZOS)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im.putalpha(a)
    return im


class Overlay:
    def __init__(self):
        try:
            user32.SetProcessDpiAwarenessContext(ctypes.c_void_p(-4))
        except (AttributeError, OSError):
            pass
        self.q: queue.Queue = queue.Queue()
        self.pos = [200.0, 200.0]
        self.target = None  # (x0, y0, x1, y1, t0, dur)
        self.label = ""
        self.state = "idle"
        self.ripple_t0 = 0.0
        self.visible = True
        self.last_cmd = time.time()
        self._frame_key = None
        self._wndproc = WNDPROC(lambda h, m, w, l: user32.DefWindowProcW(h, m, w, l))
        hinst = kernel32.GetModuleHandleW(None)
        wc = WNDCLASSW(lpfnWndProc=self._wndproc, hInstance=hinst, lpszClassName="KosifAgentCursor")
        user32.RegisterClassW(ctypes.byref(wc))
        ex = 0x00080000 | 0x00000020 | 0x00000008 | 0x00000080 | 0x08000000  # LAYERED|TRANSPARENT|TOPMOST|TOOLWINDOW|NOACTIVATE
        self.hwnd = user32.CreateWindowExW(ex, "KosifAgentCursor", "KOSIF Agent Cursor", 0x80000000,  # WS_POPUP
                                           0, 0, W, H, None, None, hinst, None)
        self._paint(force=True)
        user32.ShowWindow(self.hwnd, 4)  # SW_SHOWNOACTIVATE

    # ── drawing ──
    def _paint(self, force: bool = False):
        now = time.time()
        rip = (now - self.ripple_t0) / 0.35 if self.ripple_t0 else 1.0
        rip = rip if 0 <= rip < 1 else 0.0
        idle = now - self.last_cmd
        alpha = 1.0 if idle < 6 else max(0.45, 1.0 - (idle - 6) / 4)
        key = (self.label, self.state, round(rip, 2), round(alpha, 2))
        if key == self._frame_key and not force:
            return
        self._frame_key = key
        img = render(self.label, state=self.state, ripple=rip, alpha=alpha)
        self._update_layered(img)

    def _update_layered(self, img):
        import numpy as np  # noqa: PLC0415
        a = np.asarray(img, dtype=np.uint16)
        alpha = a[..., 3:4]
        prem = (a[..., :3] * alpha // 255).astype(np.uint8)
        bgra = np.concatenate([prem[..., ::-1], alpha.astype(np.uint8)], axis=2).tobytes()
        hdc_screen = user32.GetDC(None)
        hdc = gdi32.CreateCompatibleDC(hdc_screen)
        bmi = BITMAPINFOHEADER(biSize=ctypes.sizeof(BITMAPINFOHEADER), biWidth=W, biHeight=-H, biPlanes=1,
                               biBitCount=32, biCompression=0)
        bits = ctypes.c_void_p()
        hbmp = gdi32.CreateDIBSection(hdc, ctypes.cast(ctypes.byref(bmi), VP), 0, ctypes.byref(bits), None, 0)
        ctypes.memmove(bits, bgra, len(bgra))
        old = gdi32.SelectObject(hdc, hbmp)
        size = wintypes.SIZE(W, H)
        src = wintypes.POINT(0, 0)
        dst = wintypes.POINT(int(self.pos[0]) - TIP, int(self.pos[1]) - TIP)
        blend = BLENDFUNCTION(0, 0, 255, 1)  # AC_SRC_OVER, AC_SRC_ALPHA
        ref = lambda o: ctypes.cast(ctypes.byref(o), VP)  # noqa: E731
        user32.UpdateLayeredWindow(self.hwnd, hdc_screen, ref(dst), ref(size), hdc, ref(src), 0, ref(blend), 2)
        gdi32.SelectObject(hdc, old)
        gdi32.DeleteObject(hbmp)
        gdi32.DeleteDC(hdc)
        user32.ReleaseDC(None, hdc_screen)

    def _place(self):
        user32.SetWindowPos(self.hwnd, wintypes.HWND(-1), int(self.pos[0]) - TIP, int(self.pos[1]) - TIP, 0, 0,
                            0x1 | 0x10)  # NOSIZE | NOACTIVATE

    # ── commands ──
    def handle(self, m: dict):
        cmd = m.get("cmd")
        self.last_cmd = time.time()
        if "label" in m and m["label"] is not None:
            self.label = str(m["label"])[:60]
        if cmd in ("move", "click", "pen", "down", "up") and "x" in m and "y" in m:
            dur = float(m.get("dur", 0.16 if cmd == "move" else 0.1))
            if dur <= 0:
                self.pos = [float(m["x"]), float(m["y"])]
                self.target = None
                self._place()
            else:
                self.target = (self.pos[0], self.pos[1], float(m["x"]), float(m["y"]), time.time(), dur)
        if cmd == "click":
            self.ripple_t0 = time.time() + float(m.get("dur", 0.1))
            self.state = "idle"
        elif cmd == "pen":
            self.state = "pen" if m.get("down", True) else "idle"
        elif cmd in ("down", "up"):
            self.state = "down" if cmd == "down" else "idle"
        elif cmd == "label":
            self.label = str(m.get("text", ""))[:60]
        elif cmd == "hide":
            self.visible = False
            user32.ShowWindow(self.hwnd, 0)
        elif cmd == "show":
            self.visible = True
            user32.ShowWindow(self.hwnd, 4)
        elif cmd == "raise":
            self._place()
        elif cmd == "quit":
            raise SystemExit(0)
        if cmd in ("move", "click", "pen", "down", "up", "label") and not self.visible:
            self.visible = True
            user32.ShowWindow(self.hwnd, 4)

    def tick(self):
        if self.target:
            x0, y0, x1, y1, t0, dur = self.target
            k = min(1.0, (time.time() - t0) / dur)
            e = 1 - (1 - k) ** 3  # ease-out cubic
            self.pos = [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e]
            self._place()
            if k >= 1.0:
                self.target = None
        self._paint()

    def run(self):
        msg = wintypes.MSG()
        while True:
            while user32.PeekMessageW(ctypes.byref(msg), None, 0, 0, 1):  # PM_REMOVE
                user32.TranslateMessage(ctypes.byref(msg))
                user32.DispatchMessageW(ctypes.byref(msg))
            try:
                while True:
                    self.handle(self.q.get_nowait())
            except queue.Empty:
                pass
            self.tick()
            if time.time() - self.last_cmd > IDLE_EXIT:
                return
            time.sleep(1 / 90 if self.target or self.ripple_t0 > time.time() - 0.4 else 1 / 30)


def _listen(ov: Overlay, sock: socket.socket):
    while True:
        try:
            data, _ = sock.recvfrom(8192)
            ov.q.put(json.loads(data.decode("utf-8")))
        except (OSError, ValueError):
            continue


def _state_file():
    from .paths import state_dir  # noqa: PLC0415
    return state_dir() / "cursor_overlay.port"


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(("127.0.0.1", int(os.environ.get("KOSIF_CURSOR_PORT") or 0)))
    port = sock.getsockname()[1]
    sf = _state_file()
    sf.write_text(f"{port}\n{os.getpid()}\n", encoding="utf-8")
    ov = Overlay()
    threading.Thread(target=_listen, args=(ov, sock), daemon=True).start()
    if "--demo" in argv:
        def demo():
            for i, (x, y, lab) in enumerate([(400, 300, "يفتح الرسام"), (900, 500, "يرسم"), (1200, 350, "clicking Save")]):
                ov.q.put({"cmd": "move", "x": x, "y": y, "label": lab, "dur": 0.4})
                time.sleep(0.9)
                ov.q.put({"cmd": "click", "x": x, "y": y})
                time.sleep(0.6)
            ov.q.put({"cmd": "quit"})
        threading.Thread(target=demo, daemon=True).start()
    try:
        ov.run()
    except SystemExit:
        pass
    finally:
        try:
            if sf.read_text(encoding="utf-8").split()[0] == str(port):
                sf.unlink()
        except OSError:
            pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
