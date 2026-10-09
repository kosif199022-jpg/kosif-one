"""KOSIF Mouse — the native Windows layer: input, capture, UI Automation tree and OCR.

Speed first: input goes straight to `SendInput` (no PyAutoGUI pauses, no human-like curves — deliberately not an
anti-detection tool), capture uses `mss` (GDI BitBlt fallback), the UIA tree is read in ONE cached `FindAll` call, and
the OCR engine is loaded once per process. Every optional dependency is imported lazily so the MCP server still
starts on machines without them; `capabilities()` reports what is usable.

Coordinates are physical virtual-screen pixels (the process is made per-monitor DPI aware on first use), so a
point read from a UIA rectangle, an OCR box or a screenshot (after `scale`) clicks the same pixel.
"""
from __future__ import annotations

import ctypes
import io
import os
import struct
import sys
import threading
import time
import zlib
from ctypes import wintypes

IS_WINDOWS = sys.platform == "win32"


class NativeError(RuntimeError):
    """A desktop operation could not be performed (unsupported platform, missing backend, blocked input)."""


class Aborted(NativeError):
    """The user pulled the emergency brake (mouse in the top-left corner, or Esc held)."""


# ── Win32 plumbing ───────────────────────────────────────────────────────────
if IS_WINDOWS:
    user32 = ctypes.WinDLL("user32", use_last_error=True)
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    advapi32 = ctypes.WinDLL("advapi32", use_last_error=True)
    ULONG_PTR = ctypes.c_size_t

    class MOUSEINPUT(ctypes.Structure):
        _fields_ = [("dx", wintypes.LONG), ("dy", wintypes.LONG), ("mouseData", wintypes.DWORD),
                    ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD), ("dwExtraInfo", ULONG_PTR)]

    class KEYBDINPUT(ctypes.Structure):
        _fields_ = [("wVk", wintypes.WORD), ("wScan", wintypes.WORD), ("dwFlags", wintypes.DWORD),
                    ("time", wintypes.DWORD), ("dwExtraInfo", ULONG_PTR)]

    class HARDWAREINPUT(ctypes.Structure):
        _fields_ = [("uMsg", wintypes.DWORD), ("wParamL", wintypes.WORD), ("wParamH", wintypes.WORD)]

    class _INPUTUNION(ctypes.Union):
        _fields_ = [("mi", MOUSEINPUT), ("ki", KEYBDINPUT), ("hi", HARDWAREINPUT)]

    class INPUT(ctypes.Structure):
        _anonymous_ = ("u",)
        _fields_ = [("type", wintypes.DWORD), ("u", _INPUTUNION)]

    user32.SendInput.argtypes = (wintypes.UINT, ctypes.POINTER(INPUT), ctypes.c_int)
    user32.SendInput.restype = wintypes.UINT
    user32.GetForegroundWindow.restype = wintypes.HWND
    user32.WindowFromPoint.argtypes = (wintypes.POINT,)
    user32.WindowFromPoint.restype = wintypes.HWND
    user32.GetAncestor.argtypes = (wintypes.HWND, wintypes.UINT)
    user32.GetAncestor.restype = wintypes.HWND
    user32.GetWindowTextLengthW.argtypes = (wintypes.HWND,)
    user32.GetWindowTextW.argtypes = (wintypes.HWND, wintypes.LPWSTR, ctypes.c_int)
    user32.GetClassNameW.argtypes = (wintypes.HWND, wintypes.LPWSTR, ctypes.c_int)
    user32.GetWindowRect.argtypes = (wintypes.HWND, ctypes.POINTER(wintypes.RECT))
    user32.IsWindowVisible.argtypes = (wintypes.HWND,)
    user32.IsIconic.argtypes = (wintypes.HWND,)
    user32.GetWindowThreadProcessId.argtypes = (wintypes.HWND, ctypes.POINTER(wintypes.DWORD))
    user32.SetForegroundWindow.argtypes = (wintypes.HWND,)
    user32.ShowWindow.argtypes = (wintypes.HWND, ctypes.c_int)
    user32.VkKeyScanW.argtypes = (wintypes.WCHAR,)
    user32.VkKeyScanW.restype = ctypes.c_short
    user32.MapVirtualKeyW.argtypes = (wintypes.UINT, wintypes.UINT)
    user32.GetAsyncKeyState.argtypes = (ctypes.c_int,)
    user32.GetAsyncKeyState.restype = ctypes.c_short
    kernel32.OpenProcess.argtypes = (wintypes.DWORD, wintypes.BOOL, wintypes.DWORD)
    kernel32.OpenProcess.restype = wintypes.HANDLE
    kernel32.CloseHandle.argtypes = (wintypes.HANDLE,)
    kernel32.QueryFullProcessImageNameW.argtypes = (wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR,
                                                    ctypes.POINTER(wintypes.DWORD))
    advapi32.OpenProcessToken.argtypes = (wintypes.HANDLE, wintypes.DWORD, ctypes.POINTER(wintypes.HANDLE))
    advapi32.GetTokenInformation.argtypes = (wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD,
                                             ctypes.POINTER(wintypes.DWORD))
    WNDENUMPROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
    user32.EnumWindows.argtypes = (WNDENUMPROC, wintypes.LPARAM)
    user32.EnumChildWindows.argtypes = (wintypes.HWND, WNDENUMPROC, wintypes.LPARAM)
    _VP = ctypes.c_void_p  # 64-bit GDI handles
    gdi32 = ctypes.WinDLL("gdi32", use_last_error=True)
    user32.GetDC.restype, user32.GetDC.argtypes = _VP, (_VP,)
    user32.ReleaseDC.argtypes = (_VP, _VP)
    gdi32.CreateCompatibleDC.restype, gdi32.CreateCompatibleDC.argtypes = _VP, (_VP,)
    gdi32.CreateCompatibleBitmap.restype = _VP
    gdi32.CreateCompatibleBitmap.argtypes = (_VP, ctypes.c_int, ctypes.c_int)
    gdi32.SelectObject.restype, gdi32.SelectObject.argtypes = _VP, (_VP, _VP)
    gdi32.BitBlt.argtypes = (_VP, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int, _VP, ctypes.c_int,
                             ctypes.c_int, wintypes.DWORD)
    gdi32.GetDIBits.argtypes = (_VP, _VP, wintypes.UINT, wintypes.UINT, _VP, ctypes.c_char_p, wintypes.UINT)
    gdi32.DeleteObject.argtypes = (_VP,)
    gdi32.DeleteDC.argtypes = (_VP,)
    kernel32.GetCurrentProcess.restype = wintypes.HANDLE
    kernel32.GetExitCodeProcess.argtypes = (wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD))
    user32.GetGUIThreadInfo.argtypes = (wintypes.DWORD, ctypes.c_void_p)
    user32.GetWindowThreadProcessId.restype = wintypes.DWORD

INPUT_MOUSE, INPUT_KEYBOARD = 0, 1
MOUSEEVENTF_MOVE, MOUSEEVENTF_ABSOLUTE, MOUSEEVENTF_VIRTUALDESK = 0x0001, 0x8000, 0x4000
MOUSEEVENTF_WHEEL, MOUSEEVENTF_HWHEEL = 0x0800, 0x01000
BUTTONS = {"left": (0x0002, 0x0004), "right": (0x0008, 0x0010), "middle": (0x0020, 0x0040)}
KEYEVENTF_EXTENDEDKEY, KEYEVENTF_KEYUP, KEYEVENTF_UNICODE = 0x0001, 0x0002, 0x0004
SM_XVIRTUALSCREEN, SM_YVIRTUALSCREEN, SM_CXVIRTUALSCREEN, SM_CYVIRTUALSCREEN = 76, 77, 78, 79
VK_ESCAPE = 0x1B

VK = {
    "backspace": 0x08, "tab": 0x09, "enter": 0x0D, "return": 0x0D, "shift": 0x10, "ctrl": 0x11, "control": 0x11,
    "alt": 0x12, "pause": 0x13, "capslock": 0x14, "esc": 0x1B, "escape": 0x1B, "space": 0x20, "pageup": 0x21,
    "pagedown": 0x22, "end": 0x23, "home": 0x24, "left": 0x25, "up": 0x26, "right": 0x27, "down": 0x28,
    "printscreen": 0x2C, "insert": 0x2D, "delete": 0x2E, "del": 0x2E, "win": 0x5B, "lwin": 0x5B, "rwin": 0x5C,
    "apps": 0x5D, "menu": 0x5D, "numlock": 0x90, "scrolllock": 0x91, "lshift": 0xA0, "rshift": 0xA1,
    "lctrl": 0xA2, "rctrl": 0xA3, "lalt": 0xA4, "ralt": 0xA5, "volumemute": 0xAD, "volumedown": 0xAE,
    "volumeup": 0xAF, "medianext": 0xB0, "mediaprev": 0xB1, "mediastop": 0xB2, "playpause": 0xB3,
    **{f"f{i}": 0x6F + i for i in range(1, 25)},
}
OEM_US = {";": 0xBA, "=": 0xBB, ",": 0xBC, "-": 0xBD, ".": 0xBE, "/": 0xBF, "`": 0xC0, "[": 0xDB, "\\": 0xDC,
          "]": 0xDD, "'": 0xDE, "plus": 0xBB, "minus": 0xBD, "comma": 0xBC, "period": 0xBE}
EXTENDED = {0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x2C, 0x2D, 0x2E, 0x5B, 0x5C, 0x5D, 0x90, 0xA3, 0xA5}
ALIASES = {"cmd": "win", "super": "win", "meta": "win", "option": "alt", "pgup": "pageup", "pgdn": "pagedown",
           "ins": "insert", "bksp": "backspace", "ret": "enter"}

_dpi_once = threading.Lock()
_dpi_done = False


def require_windows() -> None:
    if not IS_WINDOWS:
        raise NativeError("KOSIF Mouse drives the Windows desktop; this host is " + sys.platform)


def ensure_dpi_aware() -> str:
    """Per-monitor-v2 DPI awareness so UIA rects, cursor positions and captures share physical pixels."""
    global _dpi_done
    require_windows()
    with _dpi_once:
        if _dpi_done:
            return "ok"
        mode = "unaware"
        try:
            if user32.SetProcessDpiAwarenessContext(ctypes.c_void_p(-4)):
                mode = "per-monitor-v2"
        except (AttributeError, OSError):
            pass
        if mode == "unaware":
            try:
                ctypes.windll.shcore.SetProcessDpiAwareness(2)
                mode = "per-monitor"
            except (AttributeError, OSError):
                try:
                    user32.SetProcessDPIAware()
                    mode = "system"
                except (AttributeError, OSError):
                    pass
        _dpi_done = True
        return mode


def virtual_screen() -> dict:
    ensure_dpi_aware()
    g = user32.GetSystemMetrics
    return {"x": g(SM_XVIRTUALSCREEN), "y": g(SM_YVIRTUALSCREEN), "w": g(SM_CXVIRTUALSCREEN), "h": g(SM_CYVIRTUALSCREEN)}


def monitors() -> list[dict]:
    ensure_dpi_aware()
    out: list[dict] = []
    MONITORENUMPROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HMONITOR, wintypes.HDC,
                                         ctypes.POINTER(wintypes.RECT), wintypes.LPARAM)

    def cb(_h, _dc, r, _lp):
        rc = r.contents
        out.append({"index": len(out) + 1, "x": rc.left, "y": rc.top, "w": rc.right - rc.left, "h": rc.bottom - rc.top})
        return True

    user32.EnumDisplayMonitors(None, None, MONITORENUMPROC(cb), 0)
    return out


def cursor() -> dict:
    ensure_dpi_aware()
    p = wintypes.POINT()
    user32.GetCursorPos(ctypes.byref(p))
    return {"x": p.x, "y": p.y}


# ── emergency brake ─────────────────────────────────────────────────────────
def check_brake() -> None:
    """Abort when the user slams the mouse into the top-left corner of the virtual screen or holds Esc."""
    vs = virtual_screen()
    c = cursor()
    if c["x"] <= vs["x"] + 1 and c["y"] <= vs["y"] + 1:
        raise Aborted("emergency stop: mouse is in the top-left screen corner (move it away to continue)")
    if user32.GetAsyncKeyState(VK_ESCAPE) & 0x8000:
        raise Aborted("emergency stop: Esc is held down")
    stop = os.environ.get("KOSIF_MOUSE_STOP_FILE")
    if stop and os.path.exists(stop):
        raise Aborted(f"emergency stop: stop file present ({stop})")


# ── input ────────────────────────────────────────────────────────────────────
_INJ = {"tick": 0}  # GetTickCount() of our last SendInput, so the user's own input can be told apart from ours


def _send(*inputs) -> None:
    n = len(inputs)
    arr = (INPUT * n)(*inputs)
    sent = user32.SendInput(n, arr, ctypes.sizeof(INPUT))
    _INJ["tick"] = kernel32.GetTickCount()
    if sent != n:
        err = ctypes.get_last_error()
        raise NativeError(f"SendInput delivered {sent}/{n} events (error {err}); the target may be an elevated "
                          "window (UIPI) or the secure desktop (UAC/lock screen) — a human must act there")


def _mouse(flags, dx=0, dy=0, data=0) -> "INPUT":
    return INPUT(type=INPUT_MOUSE, mi=MOUSEINPUT(dx, dy, ctypes.c_ulong(data & 0xFFFFFFFF).value, flags, 0, 0))


def _abs(x: float, y: float) -> tuple[int, int]:
    vs = virtual_screen()
    nx = int(round((x - vs["x"]) * 65535 / max(vs["w"] - 1, 1)))
    ny = int(round((y - vs["y"]) * 65535 / max(vs["h"] - 1, 1)))
    return max(0, min(65535, nx)), max(0, min(65535, ny))


def _inside_screen(x: float, y: float) -> None:
    vs = virtual_screen()
    if not (vs["x"] <= x < vs["x"] + vs["w"] and vs["y"] <= y < vs["y"] + vs["h"]):
        raise NativeError(f"point ({x:.0f},{y:.0f}) is outside the virtual screen {vs}")


def move(x: float, y: float, *, duration: float = 0.0) -> None:
    """Jump (default) or glide linearly to (x, y). A glide exists only for apps that need hover/drag motion."""
    _inside_screen(x, y)
    if duration > 0:
        c = cursor()
        steps = max(2, min(120, int(duration * 120)))
        for i in range(1, steps + 1):
            t = i / steps
            ax, ay = _abs(c["x"] + (x - c["x"]) * t, c["y"] + (y - c["y"]) * t)
            _send(_mouse(MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_VIRTUALDESK, ax, ay))
            time.sleep(duration / steps)
        return
    ax, ay = _abs(x, y)
    _send(_mouse(MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_VIRTUALDESK, ax, ay))


def click(x: float | None = None, y: float | None = None, *, button: str = "left", clicks: int = 1,
          interval: float = 0.0) -> None:
    if button not in BUTTONS:
        raise NativeError(f"unknown mouse button {button!r}")
    if x is not None and y is not None:
        move(x, y)
    down, up = BUTTONS[button]
    for i in range(max(1, int(clicks))):
        _send(_mouse(down), _mouse(up))
        if interval and i + 1 < clicks:
            time.sleep(interval)


def button(action: str, button: str = "left") -> None:
    down, up = BUTTONS[button]
    _send(_mouse(down if action == "down" else up))


def drag(x1: float, y1: float, x2: float, y2: float, *, button: str = "left", duration: float = 0.25) -> None:
    move(x1, y1)
    down, up = BUTTONS[button]
    _send(_mouse(down))
    try:
        time.sleep(0.03)
        move(x2, y2, duration=max(duration, 0.05))
        time.sleep(0.03)
    finally:
        _send(_mouse(up))


def scroll(amount: int, *, horizontal: bool = False, x: float | None = None, y: float | None = None) -> None:
    """amount in notches: positive = up/right, negative = down/left (120 units per notch)."""
    if x is not None and y is not None:
        move(x, y)
    _send(_mouse(MOUSEEVENTF_HWHEEL if horizontal else MOUSEEVENTF_WHEEL, data=int(amount) * 120))


def _key(vk: int, up: bool = False) -> "INPUT":
    scan = user32.MapVirtualKeyW(vk, 0)
    flags = (KEYEVENTF_KEYUP if up else 0) | (KEYEVENTF_EXTENDEDKEY if vk in EXTENDED else 0)
    return INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(vk, scan, flags, 0, 0))


def _vk(name: str) -> int:
    n = name.strip().lower()
    n = ALIASES.get(n, n)
    if n in VK:
        return VK[n]
    if len(n) == 1 and ("a" <= n <= "z" or "0" <= n <= "9"):
        return ord(n.upper())  # layout-independent: ctrl+a works on an Arabic keyboard too
    if n in OEM_US:
        return OEM_US[n]
    if len(name) == 1:
        r = user32.VkKeyScanW(name)
        if r == -1:
            raise NativeError(f"no key for {name!r} on this keyboard layout; use `type` for text")
        return r & 0xFF
    raise NativeError(f"unknown key {name!r}")


def hotkey(combo: str | list[str], *, repeat: int = 1) -> None:
    """'ctrl+shift+s', 'alt+f4', 'enter', ['ctrl','c']. Modifiers are pressed in order and released in reverse."""
    keys = combo if isinstance(combo, list) else [k for k in str(combo).replace(" ", "").split("+") if k] or [" "]
    vks = [_vk(k) for k in keys]
    for _ in range(max(1, int(repeat))):
        _send(*[_key(v) for v in vks], *[_key(v, True) for v in reversed(vks)])


def type_text(text: str, *, interval: float = 0.0) -> None:
    """Unicode typing (Arabic, emoji, any layout) via KEYEVENTF_UNICODE; newlines become Enter, tabs Tab."""
    batch: list = []

    def flush():
        if batch:
            _send(*batch)
            batch.clear()

    for ch in str(text):
        if ch == "\n":
            batch += [_key(0x0D), _key(0x0D, True)]
        elif ch == "\t":
            batch += [_key(0x09), _key(0x09, True)]
        elif ch == "\r":
            continue
        else:
            for unit in struct.unpack(f"<{len(ch.encode('utf-16-le')) // 2}H", ch.encode("utf-16-le")):
                batch += [INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(0, unit, KEYEVENTF_UNICODE, 0, 0)),
                          INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(0, unit, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, 0, 0))]
        if interval:
            flush()
            time.sleep(interval)
        elif len(batch) >= 200:
            flush()
    flush()


# ── windows ──────────────────────────────────────────────────────────────────
def _text(hwnd) -> str:
    n = user32.GetWindowTextLengthW(hwnd)
    buf = ctypes.create_unicode_buffer(n + 1)
    user32.GetWindowTextW(hwnd, buf, n + 1)
    return buf.value


def _class(hwnd) -> str:
    buf = ctypes.create_unicode_buffer(256)
    user32.GetClassNameW(hwnd, buf, 256)
    return buf.value


def _rect(hwnd) -> dict:
    r = wintypes.RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(r))
    return {"x": r.left, "y": r.top, "w": r.right - r.left, "h": r.bottom - r.top}


def _pid(hwnd) -> int:
    pid = wintypes.DWORD()
    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    return pid.value


def process_name(pid: int) -> str:
    h = kernel32.OpenProcess(0x1000, False, pid)  # PROCESS_QUERY_LIMITED_INFORMATION
    if not h:
        return ""
    try:
        buf = ctypes.create_unicode_buffer(520)
        n = wintypes.DWORD(520)
        if kernel32.QueryFullProcessImageNameW(h, 0, buf, ctypes.byref(n)):
            return os.path.basename(buf.value)
        return ""
    finally:
        kernel32.CloseHandle(h)


def _elevated(pid: int | None) -> bool | None:
    """True when that process runs elevated (UIPI will drop our input). None = unknown."""
    h = kernel32.GetCurrentProcess() if pid is None else kernel32.OpenProcess(0x1000, False, pid)
    if not h:
        return None
    tok = wintypes.HANDLE()
    try:
        if not advapi32.OpenProcessToken(h, 0x0008, ctypes.byref(tok)):  # TOKEN_QUERY
            return True if pid is not None else None  # an elevated process refuses a medium-integrity token query
        val, ret = wintypes.DWORD(), wintypes.DWORD()
        ok = advapi32.GetTokenInformation(tok, 20, ctypes.byref(val), 4, ctypes.byref(ret))  # TokenElevation
        kernel32.CloseHandle(tok)
        return bool(val.value) if ok else None
    finally:
        if pid is not None:
            kernel32.CloseHandle(h)


def self_elevated() -> bool | None:
    return _elevated(None) if IS_WINDOWS else None


def window_info(hwnd) -> dict:
    pid = _pid(hwnd)
    return {"hwnd": int(hwnd or 0), "title": _text(hwnd), "class": _class(hwnd), "rect": _rect(hwnd), "pid": pid,
            "process": process_name(pid), "minimized": bool(user32.IsIconic(hwnd)), "elevated": _elevated(pid)}


def foreground() -> dict | None:
    ensure_dpi_aware()
    h = user32.GetForegroundWindow()
    return window_info(h) if h else None


def root_owner(hwnd: int) -> int:
    """The top of a window's owner chain (a Save-as dialog → the Notepad window that owns it)."""
    if not hwnd:
        return 0
    return int(user32.GetAncestor(wintypes.HWND(int(hwnd)), 3) or hwnd)  # GA_ROOTOWNER


def window_at(x: int, y: int) -> dict | None:
    ensure_dpi_aware()
    h = user32.WindowFromPoint(wintypes.POINT(int(x), int(y)))
    if not h:
        return None
    root = user32.GetAncestor(h, 2) or h  # GA_ROOT
    return window_info(root)


def list_windows(limit: int = 60) -> list[dict]:
    ensure_dpi_aware()
    out: list[dict] = []

    def cb(h, _lp):
        if user32.IsWindowVisible(h) and user32.GetWindowTextLengthW(h) > 0:
            r = _rect(h)
            if r["w"] > 40 and r["h"] > 30:
                pid = _pid(h)
                out.append({"hwnd": int(h), "title": _text(h)[:160], "process": process_name(pid),
                            "rect": r, "minimized": bool(user32.IsIconic(h))})
        return len(out) < limit

    user32.EnumWindows(WNDENUMPROC(cb), 0)
    return out


def focus_window(hwnd: int) -> bool:
    """Bring a window to the front with the quietest method that works: plain SetForegroundWindow → a no-op key
    event (VK 0) → attaching to the foreground thread's input → only then an Alt tap (Alt shows Office key tips
    and opens menu bars, so it is the last resort)."""
    ensure_dpi_aware()
    h = wintypes.HWND(hwnd)
    if user32.IsIconic(h):
        user32.ShowWindow(h, 9)  # SW_RESTORE

    def is_front():
        return int(user32.GetForegroundWindow() or 0) == int(hwnd)

    if user32.SetForegroundWindow(h) and is_front():
        return True
    _send(INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(0, 0, 0, 0, 0)),
          INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(0, 0, KEYEVENTF_KEYUP, 0, 0)))
    if user32.SetForegroundWindow(h) and is_front():
        return True
    try:
        user32.AttachThreadInput.argtypes = (wintypes.DWORD, wintypes.DWORD, wintypes.BOOL)
        msg = wintypes.MSG()
        user32.PeekMessageW(ctypes.byref(msg), None, 0, 0, 0)  # this thread needs a message queue to attach
        ftid = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
        me = kernel32.GetCurrentThreadId()
        attached = bool(ftid and ftid != me and user32.AttachThreadInput(me, ftid, True))
        try:
            user32.BringWindowToTop(h)
            user32.SetForegroundWindow(h)
        finally:
            if attached:
                user32.AttachThreadInput(me, ftid, False)
        if is_front():
            return True
    except (AttributeError, OSError):
        pass
    _send(_key(0x12), _key(0x12, True))
    ok = bool(user32.SetForegroundWindow(h))
    time.sleep(0.05)
    return ok and is_front()


# ── background delivery: input to ONE window without focus change; the real cursor never moves ─────────────
# The same layered route Cua Driver documents for Windows: UI Automation patterns first, then window messages
# posted to the control's own HWND. Apps that drop posted input (Chromium/Electron, WinUI/UWP, GTK/Qt/SDL…) are
# reported as `BackgroundUnavailable` so the caller escalates on purpose instead of silently stealing focus.
class BackgroundUnavailable(NativeError):
    """This action cannot reach the target window without the foreground (real keyboard/mouse needed)."""


if IS_WINDOWS:
    class GUITHREADINFO(ctypes.Structure):
        _fields_ = [("cbSize", wintypes.DWORD), ("flags", wintypes.DWORD), ("hwndActive", wintypes.HWND),
                    ("hwndFocus", wintypes.HWND), ("hwndCapture", wintypes.HWND), ("hwndMenuOwner", wintypes.HWND),
                    ("hwndMoveSize", wintypes.HWND), ("hwndCaret", wintypes.HWND), ("rcCaret", wintypes.RECT)]

    class LASTINPUTINFO(ctypes.Structure):
        _fields_ = [("cbSize", wintypes.UINT), ("dwTime", wintypes.DWORD)]

    user32.PostMessageW.argtypes = (wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM)
    user32.PostMessageW.restype = wintypes.BOOL
    user32.SendMessageTimeoutW.argtypes = (wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM,
                                           wintypes.UINT, wintypes.UINT, ctypes.POINTER(ULONG_PTR))
    user32.ScreenToClient.argtypes = (wintypes.HWND, ctypes.POINTER(wintypes.POINT))
    user32.ChildWindowFromPointEx.argtypes = (wintypes.HWND, wintypes.POINT, wintypes.UINT)
    user32.ChildWindowFromPointEx.restype = wintypes.HWND
    user32.GetLastInputInfo.argtypes = (ctypes.POINTER(LASTINPUTINFO),)
    user32.SetCursorPos.argtypes = (ctypes.c_int, ctypes.c_int)
    user32.IsWindow.argtypes = (wintypes.HWND,)
    user32.PrintWindow.argtypes = (wintypes.HWND, _VP, wintypes.UINT)
    user32.PrintWindow.restype = wintypes.BOOL
    kernel32.GetTickCount.restype = wintypes.DWORD

WM_KEYDOWN, WM_KEYUP, WM_CHAR, WM_MOUSEMOVE, WM_MOUSEWHEEL, WM_MOUSEHWHEEL = 0x100, 0x101, 0x102, 0x200, 0x20A, 0x20E
POST_BUTTONS = {"left": (0x201, 0x202, 0x203, 0x01), "right": (0x204, 0x205, 0x206, 0x02),
                "middle": (0x207, 0x208, 0x209, 0x10)}
MODIFIERS = {"ctrl", "control", "alt", "shift", "win", "lwin", "rwin", "cmd", "super", "meta", "option",
             "lctrl", "rctrl", "lalt", "ralt", "lshift", "rshift"}
# window classes known to ignore posted mouse/keyboard messages (they read the real input queue)
POST_DROPS = ("Chrome_RenderWidgetHostHWND", "Chrome_WidgetWin_", "Intermediate D3D Window", "MozillaWindowClass",
              "Windows.UI.Core.CoreWindow", "ApplicationFrameWindow", "Microsoft.UI.Content.", "WinUIDesktopWin32",
              "DesktopWindowXamlSource", "gdkWindow", "Qt5", "Qt6", "SDL_app", "UnityWndClass", "MSPaintApp",
              "NetUIHWND", "DirectUIHWND", "Windows.UI.Input.InputSite")


def class_name(hwnd) -> str:
    return _class(wintypes.HWND(int(hwnd))) if hwnd else ""


def _lparam(x: int, y: int) -> int:
    return ((int(y) & 0xFFFF) << 16) | (int(x) & 0xFFFF)


def _post(hwnd, msg: int, wparam: int = 0, lparam: int = 0) -> None:
    if not user32.PostMessageW(wintypes.HWND(int(hwnd)), msg, wparam, lparam):
        raise BackgroundUnavailable(f"PostMessage to {class_name(hwnd)!r} failed (error {ctypes.get_last_error()}): "
                                    "the window is gone or belongs to an elevated process")


def child_at(root: int, x: int, y: int) -> int:
    """Deepest visible child window of `root` under screen point (x, y) — where a posted click must go."""
    ensure_dpi_aware()
    h = int(root)
    for _ in range(32):
        pt = wintypes.POINT(int(x), int(y))
        user32.ScreenToClient(wintypes.HWND(h), ctypes.byref(pt))
        c = user32.ChildWindowFromPointEx(wintypes.HWND(h), pt, 0x0001 | 0x0004)  # SKIPINVISIBLE | SKIPTRANSPARENT
        if not c or int(c) == h:
            break
        h = int(c)
    return h


def thread_focus(root: int) -> int:
    """The control holding keyboard focus inside `root`'s GUI thread, even while that window is in the background."""
    tid = user32.GetWindowThreadProcessId(wintypes.HWND(int(root)), None)
    info = GUITHREADINFO(cbSize=ctypes.sizeof(GUITHREADINFO))
    if tid and user32.GetGUIThreadInfo(tid, ctypes.byref(info)) and info.hwndFocus:
        return int(info.hwndFocus)
    return int(root)


def post_ok(hwnd: int) -> bool:
    cls = class_name(hwnd)
    return bool(cls) and not any(cls.startswith(p) for p in POST_DROPS)


def _require_post(hwnd: int, what: str) -> str:
    cls = class_name(hwnd)
    if not post_ok(hwnd):
        raise BackgroundUnavailable(f"{what}: window class {cls!r} ignores background (posted) input — it needs the "
                                    "foreground (mode='auto' escalates) or an app API (e.g. kosif_excel)")
    return cls


def post_click(root: int, x: int, y: int, *, button: str = "left", clicks: int = 1) -> str:
    """Click a point of a (possibly covered) window by posting mouse messages to the control under it."""
    if button not in POST_BUTTONS:
        raise NativeError(f"unknown mouse button {button!r}")
    h = child_at(root, x, y)
    cls = _require_post(h, "click")
    pt = wintypes.POINT(int(x), int(y))
    user32.ScreenToClient(wintypes.HWND(h), ctypes.byref(pt))
    lp = _lparam(pt.x, pt.y)
    down, up, dbl, mk = POST_BUTTONS[button]
    _post(h, WM_MOUSEMOVE, 0, lp)
    _post(h, down, mk, lp)
    _post(h, up, 0, lp)
    if int(clicks) >= 2:
        _post(h, dbl, mk, lp)
        _post(h, up, 0, lp)
    return cls


def _key_lparam(vk: int, up: bool) -> int:
    scan = user32.MapVirtualKeyW(vk, 0) & 0xFF
    lp = 1 | (scan << 16) | ((1 << 24) if vk in EXTENDED else 0)
    return lp | (0xC0000000 if up else 0)


def is_modified(combo) -> bool:
    keys = combo if isinstance(combo, list) else str(combo).replace(" ", "").lower().split("+")
    return any(k.strip().lower() in MODIFIERS for k in keys) and len(keys) > 1


def post_key(hwnd: int, combo, *, repeat: int = 1) -> str:
    """Single keys (Enter, Tab, arrows, F-keys, Delete…) to one control. Modifier shortcuts are refused: the app
    reads Ctrl/Alt/Shift from the real keyboard state, so a posted Ctrl+S would arrive as a plain 'S'."""
    if is_modified(combo):
        raise BackgroundUnavailable(f"shortcut {combo!r} needs the real keyboard state (foreground)")
    cls = _require_post(hwnd, "key")
    vk = _vk(combo[0] if isinstance(combo, list) else str(combo).strip() or " ")
    for _ in range(max(1, int(repeat))):
        _post(hwnd, WM_KEYDOWN, vk, _key_lparam(vk, False))  # TranslateMessage in the app makes the WM_CHAR
        _post(hwnd, WM_KEYUP, vk, _key_lparam(vk, True))
    return cls


def post_text(hwnd: int, text: str) -> str:
    """Unicode text (Arabic, emoji) into one control as WM_CHAR; newline → Enter, tab → Tab."""
    cls = _require_post(hwnd, "type")
    for ch in str(text):
        if ch == "\r":
            continue
        if ch in "\n\t":
            post_key(hwnd, "enter" if ch == "\n" else "tab")
            continue
        for unit in struct.unpack(f"<{len(ch.encode('utf-16-le')) // 2}H", ch.encode("utf-16-le")):
            _post(hwnd, WM_CHAR, unit, 1)
    return cls


def post_scroll(root: int, x: int, y: int, amount: int, *, horizontal: bool = False) -> str:
    h = child_at(root, x, y)
    cls = _require_post(h, "scroll")
    delta = (int(amount) * 120) & 0xFFFF
    _post(h, WM_MOUSEHWHEEL if horizontal else WM_MOUSEWHEEL, delta << 16, _lparam(x, y))
    return cls


def win32_kind(hwnd: int | None) -> str | None:
    """'edit' / 'button' for classic Win32 controls (also WinForms' WindowsForms10.EDIT/BUTTON wrappers): these
    take window messages reliably — and Windows' UIA proxies for them call SetFocus/activate, messages do not."""
    if not hwnd:
        return None
    cls = class_name(hwnd).upper()
    if "RICHEDIT" in cls or cls == "EDIT" or ".EDIT." in cls or cls.endswith("EDIT"):
        return "edit"
    if cls == "BUTTON" or ".BUTTON." in cls:
        return "button"
    return None


def _send_timeout(hwnd: int, msg: int, wparam: int = 0, lparam: int = 0, ms: int = 2000) -> int:
    res = ULONG_PTR()
    ok = user32.SendMessageTimeoutW(wintypes.HWND(int(hwnd)), msg, wparam, lparam, 0x0002, ms,  # ABORTIFHUNG
                                    ctypes.byref(res))
    if not ok:
        raise BackgroundUnavailable(f"{class_name(hwnd)!r} did not answer (hung or elevated)")
    return int(res.value)


def set_text(hwnd: int, text: str) -> None:
    """Replace a Win32 edit control's whole text (WM_SETTEXT; the system marshals the string across processes)."""
    buf = ctypes.create_unicode_buffer(str(text).replace("\r\n", "\n").replace("\n", "\r\n"))
    _send_timeout(hwnd, 0x000C, 0, ctypes.cast(buf, ctypes.c_void_p).value)


def caret_to_end(hwnd: int) -> None:
    n = _send_timeout(hwnd, 0x000E)  # WM_GETTEXTLENGTH
    _send_timeout(hwnd, 0x00B1, n, n)  # EM_SETSEL n,n


def button_click(hwnd: int) -> None:
    _post(hwnd, 0x00F5)  # BM_CLICK: the button clicks itself; no activation, no pointer


def window_alive(hwnd: int) -> bool:
    return bool(hwnd) and bool(user32.IsWindow(wintypes.HWND(int(hwnd))))


# ── the user's own activity (so foreground steps never fight the human for the mouse/keyboard) ─────────────
def user_idle_ms() -> int:
    """Milliseconds since the user's last PHYSICAL input. Input we injected ourselves does not count."""
    li = LASTINPUTINFO(cbSize=ctypes.sizeof(LASTINPUTINFO))
    if not user32.GetLastInputInfo(ctypes.byref(li)):
        return 10 ** 9
    now = kernel32.GetTickCount()
    inj = _INJ["tick"]
    if inj and ((li.dwTime - inj) & 0xFFFFFFFF) < 120:  # the newest input is our own SendInput
        return 10 ** 9
    return (now - li.dwTime) & 0xFFFFFFFF


def wait_user_idle(idle_ms: int = 600, timeout: float = 30.0) -> int:
    """Block until the user has not touched mouse/keyboard for `idle_ms`. Returns ms waited; raises UserBusy."""
    t0 = time.time()
    while user_idle_ms() < idle_ms:
        check_brake()
        if time.time() - t0 > timeout:
            raise UserBusy(f"the user kept using the mouse/keyboard for {timeout:.0f} s; paused instead of "
                           "fighting them for the foreground")
        time.sleep(0.05)
    return round((time.time() - t0) * 1000)


class UserBusy(NativeError):
    """The human is actively using the mouse/keyboard; a foreground step waits rather than interrupting."""


def set_cursor(x: int, y: int) -> None:
    user32.SetCursorPos(int(x), int(y))


# ── Claude's OWN pointer: a synthetic pen device (Windows Pointer Injection API, Windows 10 1809+) ─────────
# Windows supports several pointing devices at once (mouse + pen + touch). KOSIF creates its own pen device, so
# taps, drags and drawing happen with a second, independent pointer: the user's mouse is never moved or pressed
# and they can keep using it while Claude draws. Windows shows the pen's own visual feedback; Claude's orange
# cursor follows it. The pen lands on whatever window is visible at that point, so a covered target window is
# brought forward first (after the user is idle) and focus is handed back afterwards.
if IS_WINDOWS:
    class POINTER_INFO(ctypes.Structure):
        _fields_ = [("pointerType", wintypes.DWORD), ("pointerId", ctypes.c_uint32), ("frameId", ctypes.c_uint32),
                    ("pointerFlags", ctypes.c_uint32), ("sourceDevice", wintypes.HANDLE),
                    ("hwndTarget", wintypes.HWND), ("ptPixelLocation", wintypes.POINT),
                    ("ptHimetricLocation", wintypes.POINT), ("ptPixelLocationRaw", wintypes.POINT),
                    ("ptHimetricLocationRaw", wintypes.POINT), ("dwTime", wintypes.DWORD),
                    ("historyCount", ctypes.c_uint32), ("InputData", ctypes.c_int32), ("dwKeyStates", wintypes.DWORD),
                    ("PerformanceCount", ctypes.c_uint64), ("ButtonChangeType", ctypes.c_int)]

    class POINTER_PEN_INFO(ctypes.Structure):
        _fields_ = [("pointerInfo", POINTER_INFO), ("penFlags", ctypes.c_uint32), ("penMask", ctypes.c_uint32),
                    ("pressure", ctypes.c_uint32), ("rotation", ctypes.c_uint32), ("tiltX", ctypes.c_int32),
                    ("tiltY", ctypes.c_int32)]

    class POINTER_TOUCH_INFO(ctypes.Structure):
        _fields_ = [("pointerInfo", POINTER_INFO), ("touchFlags", ctypes.c_uint32), ("touchMask", ctypes.c_uint32),
                    ("rcContact", wintypes.RECT), ("rcContactRaw", wintypes.RECT), ("orientation", ctypes.c_uint32),
                    ("pressure", ctypes.c_uint32)]

    class _PTU(ctypes.Union):
        _fields_ = [("touchInfo", POINTER_TOUCH_INFO), ("penInfo", POINTER_PEN_INFO)]

    class POINTER_TYPE_INFO(ctypes.Structure):
        _anonymous_ = ("u",)
        _fields_ = [("type", wintypes.DWORD), ("u", _PTU)]

PT_PEN = 3
PF_NEW, PF_INRANGE, PF_INCONTACT, PF_FIRSTBUTTON, PF_SECONDBUTTON = 0x1, 0x2, 0x4, 0x10, 0x20
PF_PRIMARY, PF_DOWN, PF_UPDATE, PF_UP = 0x2000, 0x10000, 0x20000, 0x40000
PEN_FLAG_BARREL, PEN_MASK_PRESSURE = 0x1, 0x1


class Pen:
    """KOSIF's own pen pointer. Every call injects real pointer frames for THIS device only."""

    def __init__(self):
        self.dev = None
        self.frame = 0
        self.lock = threading.Lock()
        self.error = ""

    def available(self) -> bool:
        if not IS_WINDOWS or os.environ.get("KOSIF_PEN", "1") == "0":
            return False
        try:
            self._device()
            return True
        except NativeError as e:
            self.error = str(e)
            return False

    def _device(self):
        if self.dev:
            return self.dev
        ensure_dpi_aware()
        try:
            create = user32.CreateSyntheticPointerDevice
        except AttributeError:
            raise NativeError("this Windows has no pointer injection (needs Windows 10 1809 or newer)") from None
        create.restype = ctypes.c_void_p
        create.argtypes = (wintypes.DWORD, wintypes.ULONG, wintypes.DWORD)
        user32.InjectSyntheticPointerInput.argtypes = (ctypes.c_void_p, ctypes.POINTER(POINTER_TYPE_INFO),
                                                       ctypes.c_uint32)
        user32.InjectSyntheticPointerInput.restype = wintypes.BOOL
        dev = create(PT_PEN, 1, 1)  # one contact, POINTER_FEEDBACK_DEFAULT (Windows draws the pen feedback)
        if not dev:
            raise NativeError(f"CreateSyntheticPointerDevice failed (error {ctypes.get_last_error()})")
        self.dev = dev
        return dev

    def _frame(self, x: float, y: float, flags: int, *, pressure: int = 0, barrel: bool = False) -> None:
        dev = self._device()
        _inside_screen(x, y)
        self.frame += 1
        pti = POINTER_TYPE_INFO()
        pti.type = PT_PEN
        info = pti.penInfo.pointerInfo
        info.pointerType = PT_PEN
        info.pointerId = 0
        info.frameId = self.frame
        info.pointerFlags = flags
        info.ptPixelLocation = wintypes.POINT(int(round(x)), int(round(y)))
        pti.penInfo.penMask = PEN_MASK_PRESSURE
        pti.penInfo.pressure = int(pressure)
        pti.penInfo.penFlags = PEN_FLAG_BARREL if barrel else 0
        if not user32.InjectSyntheticPointerInput(dev, ctypes.byref(pti), 1):
            err = ctypes.get_last_error()
            raise NativeError(f"pen input was refused (error {err}): the window under the pen may be elevated "
                              "(UIPI) or the screen is locked")
        _INJ["tick"] = kernel32.GetTickCount()  # our pen counts as input too: never mistake it for the user's

    def hover(self, x, y):
        self._frame(x, y, PF_INRANGE | PF_UPDATE)

    def leave(self, x, y):
        self._frame(x, y, PF_UPDATE)

    @staticmethod
    def densify(pts, max_step: float = 5.0) -> list[tuple[float, float]]:
        """Split long segments so no frame moves more than `max_step` px."""
        import math  # noqa: PLC0415
        out = [pts[0]]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(1, math.ceil(math.hypot(x1 - x0, y1 - y0) / max_step))
            out += [(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n) for k in range(1, n + 1)]
        return out

    def stroke(self, pts, *, pressure: int = 512, barrel: bool = False, step_delay: float = 0.004,
               max_step: float = 5.0, dwell: float = 0.012, min_duration: float = 0.08) -> int:
        """Press at pts[0], move through the rest, lift. Returns frames sent.
        Strokes are paced like a hand: segments are split to ≤ `max_step` px per frame (up to 3× that on long
        strokes, which are never mistaken for a flick), at least 2 ms apart, a stroke lasts ≥ `min_duration`, with
        a short rest after touching down and before lifting. Measured on Windows 11 Paint: a 5-point rectangle
        sent in ~15 ms was read as a pen *flick* gesture — only a dot was drawn (5 of 8 bars of a chart went
        missing); with fixed 5-px steps the filled chart then took 32 s."""
        pts = [(float(p[0]), float(p[1])) for p in pts]
        if not pts:
            return 0
        moving = len(pts) > 1
        if moving and max_step:
            length = sum(((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5 for a, b in zip(pts, pts[1:]))
            pts = self.densify(pts, max(float(max_step), min(3 * float(max_step), length / 150)))
            step_delay = max(float(step_delay or 0), 0.002, min_duration / max(1, len(pts) - 1))
        btn = PF_SECONDBUTTON if barrel else PF_FIRSTBUTTON
        with self.lock:
            x0, y0 = pts[0]
            self.hover(x0, y0)
            self._frame(x0, y0, PF_INRANGE | PF_INCONTACT | btn | PF_DOWN, pressure=pressure, barrel=barrel)
            if moving and dwell:
                time.sleep(dwell)
            for x, y in pts[1:]:
                if step_delay:
                    time.sleep(step_delay)
                self._frame(x, y, PF_INRANGE | PF_INCONTACT | btn | PF_UPDATE, pressure=pressure, barrel=barrel)
            xl, yl = pts[-1]
            if moving and dwell:  # rest before lifting: a lift while still moving reads as a flick
                time.sleep(dwell)
                self._frame(xl, yl, PF_INRANGE | PF_INCONTACT | btn | PF_UPDATE, pressure=pressure, barrel=barrel)
            self._frame(xl, yl, PF_INRANGE | PF_UP, barrel=barrel)
            self.leave(xl, yl)
        return len(pts) + 3

    def tap(self, x, y, *, barrel: bool = False, times: int = 1) -> None:
        for i in range(max(1, int(times))):
            self.stroke([(x, y)], barrel=barrel, step_delay=0)
            if i + 1 < times:
                time.sleep(0.06)

    def drag(self, x1, y1, x2, y2, *, duration: float = 0.25) -> None:
        n = max(4, int(duration / 0.012))
        self.stroke([(x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n) for k in range(n + 1)],
                    step_delay=duration / n)


PEN = Pen()


def visible_at(hwnd: int, x: int, y: int) -> bool:
    """Is `hwnd` (or one of its windows) what is actually on screen at (x, y)? A pen lands on whatever is."""
    w = window_at(x, y)
    if not w:
        return False
    if w["hwnd"] == int(hwnd):
        return True
    return _pid(wintypes.HWND(int(hwnd))) == w["pid"] and not w["title"]  # same app's popup / child surface


# ── capture ──────────────────────────────────────────────────────────────────
_mss_local = threading.local()


def grab(region: dict | None = None):
    """Capture (x, y, w, h) of the virtual screen → (width, height, BGRA bytes)."""
    ensure_dpi_aware()
    vs = virtual_screen()
    r = region or vs
    box = {"left": int(r["x"]), "top": int(r["y"]), "width": int(r["w"]), "height": int(r["h"])}
    if box["width"] <= 0 or box["height"] <= 0:
        raise NativeError(f"empty capture region {r}")
    try:
        import mss  # noqa: PLC0415
        if not hasattr(_mss_local, "sct"):
            _mss_local.sct = mss.mss()
        shot = _mss_local.sct.grab(box)
        return shot.width, shot.height, bytes(shot.bgra)
    except ImportError:
        return _grab_gdi(box)


def _grab_gdi(box: dict):
    w, h = box["width"], box["height"]
    hdc = user32.GetDC(None)
    mdc = gdi32.CreateCompatibleDC(hdc)
    bmp = gdi32.CreateCompatibleBitmap(hdc, w, h)
    gdi32.SelectObject(mdc, bmp)
    gdi32.BitBlt(mdc, 0, 0, w, h, hdc, box["left"], box["top"], 0x00CC0020 | 0x40000000)  # SRCCOPY|CAPTUREBLT
    bmi = struct.pack("<IiiHHIIiiII", 40, w, -h, 1, 32, 0, 0, 0, 0, 0, 0)
    buf = ctypes.create_string_buffer(w * h * 4)
    gdi32.GetDIBits(mdc, bmp, 0, h, buf, bmi, 0)
    gdi32.DeleteObject(bmp)
    gdi32.DeleteDC(mdc)
    user32.ReleaseDC(None, hdc)
    if not any(buf.raw[:4096]) and not any(buf.raw[-4096:]):
        raise NativeError("empty capture: the screen is locked, asleep or on the secure desktop")
    return w, h, buf.raw


def visible_rect(hwnd: int) -> dict:
    """The window's visible bounds (DWM extended frame, i.e. without the invisible resize shadow)."""
    r = wintypes.RECT()
    try:
        if ctypes.windll.dwmapi.DwmGetWindowAttribute(wintypes.HWND(int(hwnd)), 9, ctypes.byref(r),
                                                      ctypes.sizeof(r)) == 0:  # DWMWA_EXTENDED_FRAME_BOUNDS
            return {"x": r.left, "y": r.top, "w": r.right - r.left, "h": r.bottom - r.top}
    except (AttributeError, OSError):
        pass
    return _rect(wintypes.HWND(int(hwnd)))


def grab_window(hwnd: int):
    """Capture ONE window even while other windows cover it (PrintWindow + PW_RENDERFULLCONTENT) — no need to bring
    it to the front. → (width, height, BGRA, rect) or None when the window is minimized or renders black."""
    ensure_dpi_aware()
    h = wintypes.HWND(int(hwnd))
    if not hwnd or user32.IsIconic(h):
        return None
    full = _rect(h)
    vis = visible_rect(hwnd)
    w, hh = full["w"], full["h"]
    if w <= 0 or hh <= 0:
        return None
    sdc = user32.GetDC(None)
    mdc = gdi32.CreateCompatibleDC(sdc)
    bmp = gdi32.CreateCompatibleBitmap(sdc, w, hh)
    old = gdi32.SelectObject(mdc, bmp)
    try:
        if not user32.PrintWindow(h, mdc, 2):  # PW_RENDERFULLCONTENT (DirectComposition / Chromium content too)
            return None
        bmi = struct.pack("<IiiHHIIiiII", 40, w, -hh, 1, 32, 0, 0, 0, 0, 0, 0)
        buf = ctypes.create_string_buffer(w * hh * 4)
        gdi32.GetDIBits(mdc, bmp, 0, hh, buf, bmi, 0)
    finally:
        gdi32.SelectObject(mdc, old)
        gdi32.DeleteObject(bmp)
        gdi32.DeleteDC(mdc)
        user32.ReleaseDC(None, sdc)
    raw = buf.raw
    ox, oy = max(0, vis["x"] - full["x"]), max(0, vis["y"] - full["y"])
    cw, ch = min(vis["w"], w - ox), min(vis["h"], hh - oy)
    if (ox or oy or cw != w or ch != hh) and cw > 0 and ch > 0:
        raw = b"".join(raw[(oy + y) * w * 4 + ox * 4:(oy + y) * w * 4 + (ox + cw) * 4] for y in range(ch))
        w, hh = cw, ch
    # Right-to-left windows (WS_EX_LAYOUTRTL, or Office's RTLREADING main window in an Arabic UI) come back
    # mirrored from PrintWindow — measured on Arabic Excel — so flip them to match what the user sees.
    rtl = bool(user32.GetWindowLongW(h, -20) & (0x00400000 | 0x00002000))
    try:
        import numpy as np  # noqa: PLC0415
        blank = int(np.frombuffer(raw, np.uint8)[::97].max(initial=0)) < 8
        if not blank and rtl:
            raw = np.ascontiguousarray(np.frombuffer(raw, np.uint8).reshape(hh, w, 4)[:, ::-1, :]).tobytes()
    except ImportError:
        blank = not any(raw[::97])
        if not blank and rtl:
            raw = b"".join(b"".join(raw[r * w * 4 + c * 4:r * w * 4 + c * 4 + 4] for c in range(w - 1, -1, -1))
                           for r in range(hh))
    if blank:
        return None  # WinUI/UWP surfaces can come back black: the caller falls back to a screen capture
    return w, hh, raw, {"x": full["x"] + ox, "y": full["y"] + oy, "w": w, "h": hh}


def _pool(raw: bytes, w: int, h: int, size: int = 48, crop: tuple | None = None) -> bytes:
    """Change-detection thumbnail: the image is cut into size×size cells and each cell keeps its darkest AND its
    brightest grey value, so a 2-px pen line or one edited word anywhere inside a cell still changes it. (The old
    point-sampled thumbnail saw a red trend line drawn across Paint as a 0.12 % change → 'unverified'.)
    `crop` = (x, y, w, h) inside the image."""
    try:
        import numpy as np  # noqa: PLC0415
        a = np.frombuffer(raw, np.uint8).reshape(h, w, 4)
        if crop:
            cx, cy, cw, chh = (int(v) for v in crop)
            a = a[max(0, cy):max(0, cy) + max(1, chh), max(0, cx):max(0, cx) + max(1, cw)]
        g = a[:, :, :3].mean(axis=2).astype(np.uint8)
        hh, ww = g.shape
        if not hh or not ww:
            return b""
        ch, cw = max(1, hh // size), max(1, ww // size)
        ny, nx = max(1, hh // ch), max(1, ww // cw)
        b = g[:ny * ch, :nx * cw].reshape(ny, ch, nx, cw)
        return np.concatenate([b.min(axis=(1, 3)).ravel(), b.max(axis=(1, 3)).ravel()]).tobytes()
    except ImportError:
        x0, y0, ww, hh = crop or (0, 0, w, h)
        sx, sy = max(1, ww // size), max(1, hh // size)
        return bytes(raw[y * w * 4 + x * 4 + 1] for y in range(y0, min(h, y0 + hh), sy)
                     for x in range(x0, min(w, x0 + ww), sx))


def window_fingerprint(hwnd: int, *, size: int = 48, region: dict | None = None) -> bytes | None:
    """Thumbnail of ONE window (even when covered). `region` {x,y,w,h} in screen px limits it to that part —
    e.g. where a drawing goes, so a thin stroke is a large share of what is compared."""
    g = grab_window(hwnd)
    if not g:
        return None
    w, h, raw, rect = g
    crop = None
    if region:
        crop = (int(region["x"]) - rect["x"], int(region["y"]) - rect["y"], int(region["w"]), int(region["h"]))
    return _pool(raw, w, h, size, crop)


def to_image(w: int, h: int, bgra: bytes):
    from PIL import Image  # noqa: PLC0415
    return Image.frombuffer("RGBA", (w, h), bgra, "raw", "BGRA", 0, 1).convert("RGB")


def encode(img, *, max_side: int = 1400, fmt: str = "png", quality: int = 70) -> tuple[bytes, float, str]:
    """Downscale (never upscale) and encode. Returns (bytes, scale, mime); screen = image / scale."""
    scale = min(1.0, max_side / max(img.size))
    if scale < 1.0:
        from PIL import Image  # noqa: PLC0415
        img = img.resize((max(1, int(img.size[0] * scale)), max(1, int(img.size[1] * scale))), Image.BILINEAR)
    out = io.BytesIO()
    if fmt == "jpeg":
        img.save(out, "JPEG", quality=quality, optimize=True)
        return out.getvalue(), scale, "image/jpeg"
    img.save(out, "PNG", optimize=False, compress_level=3)
    return out.getvalue(), scale, "image/png"


def png_from_bgra(w: int, h: int, bgra: bytes) -> bytes:
    """Dependency-free PNG (used only when Pillow is missing)."""
    rows = b"".join(b"\x00" + _swap(bgra[y * w * 4:(y + 1) * w * 4]) for y in range(h))

    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(rows, 3)) + chunk(b"IEND", b""))


def _swap(row: bytes) -> bytes:
    a = bytearray(row)
    a[0::4], a[2::4] = row[2::4], row[0::4]
    return bytes(a)


def fingerprint(region: dict | None = None, *, size: int = 48) -> bytes:
    """A tiny grayscale thumbnail used to detect 'did the screen change?' in ~10 ms."""
    w, h, raw = grab(region)
    return _pool(raw, w, h, size)


def changed(a: bytes, b: bytes, *, threshold: float = 0.004) -> float:
    """Fraction of thumbnail pixels that changed noticeably (0..1); compare with `threshold`."""
    if len(a) != len(b) or not a:
        return 1.0
    try:
        import numpy as np  # noqa: PLC0415
        d = np.abs(np.frombuffer(a, np.uint8).astype(np.int16) - np.frombuffer(b, np.uint8).astype(np.int16))
        return float((d > 12).mean())
    except ImportError:
        return sum(1 for x, y in zip(a, b) if abs(x - y) > 12) / len(a)


# ── UI Automation ───────────────────────────────────────────────────────────
_uia_local = threading.local()
CONTROL_TYPES = {
    50000: "button", 50001: "calendar", 50002: "checkbox", 50003: "combobox", 50004: "edit", 50005: "link",
    50006: "image", 50007: "listitem", 50008: "list", 50009: "menu", 50010: "menubar", 50011: "menuitem",
    50012: "progressbar", 50013: "radio", 50014: "scrollbar", 50015: "slider", 50016: "spinner",
    50017: "statusbar", 50018: "tab", 50019: "tabitem", 50020: "text", 50021: "toolbar", 50022: "tooltip",
    50023: "tree", 50024: "treeitem", 50025: "custom", 50026: "group", 50027: "thumb", 50028: "datagrid",
    50029: "dataitem", 50030: "document", 50031: "splitbutton", 50032: "window", 50033: "pane",
    50034: "header", 50035: "headeritem", 50036: "table", 50037: "titlebar", 50038: "separator",
    50039: "semanticzoom", 50040: "appbar",
}
ACTIONABLE = {"button", "checkbox", "combobox", "edit", "link", "listitem", "menuitem", "radio", "slider",
              "spinner", "tabitem", "treeitem", "splitbutton", "dataitem", "headeritem", "document", "hyperlink"}
P = {"name": 30005, "type": 30003, "rect": 30001, "enabled": 30010, "offscreen": 30022, "aid": 30011,
     "password": 30019, "focusable": 30009, "focused": 30008, "value": 30045, "toggle": 30086, "class": 30012,
     "invoke_ok": 30031, "value_ok": 30043, "help": 30013, "hwnd": 30020, "toggle_ok": 30041,
     "select_ok": 30036, "expand_ok": 30028, "scrollitem_ok": 30035, "value_ro": 30046}


def _uia():
    if not hasattr(_uia_local, "auto"):
        try:
            import comtypes  # noqa: PLC0415
            import comtypes.client  # noqa: PLC0415
        except ImportError:
            raise NativeError("UI Automation needs the `comtypes` package (pip install comtypes)") from None
        try:
            comtypes.CoInitialize()
        except OSError:
            pass
        mod = comtypes.client.GetModule("UIAutomationCore.dll")
        auto = comtypes.client.CreateObject("{ff48dba4-60ef-4201-aa87-54103eef594e}", interface=mod.IUIAutomation)
        cache = auto.CreateCacheRequest()
        for pid in P.values():
            try:
                cache.AddProperty(pid)
            except Exception:  # noqa: BLE001 - older UIA without a property
                pass
        cond = auto.CreateAndCondition(auto.CreatePropertyCondition(30017, True),   # IsControlElement
                                       auto.CreatePropertyCondition(P["offscreen"], False))
        _uia_local.auto, _uia_local.mod, _uia_local.cache, _uia_local.cond = auto, mod, cache, cond
    return _uia_local


def _cached(el, pid):
    try:
        return el.GetCachedPropertyValue(pid)
    except Exception:  # noqa: BLE001
        return None


def uia_snapshot(hwnd: int | None = None, *, limit: int = 300, actionable_only: bool = False,
                 clip: dict | None = None, skip_cells: bool = False) -> list[dict]:
    """Every visible control under a window (default: the foreground window) in one cached round trip.
    `skip_cells` leaves out grid cells (DataItem) — a spreadsheet grid is thousands of cross-process elements;
    read cell contents through the app's API instead (kosif_excel)."""
    ensure_dpi_aware()
    u = _uia()
    cond = u.cond
    if skip_cells:
        if not hasattr(u, "cond_nocells"):
            u.cond_nocells = u.auto.CreateAndCondition(
                u.cond, u.auto.CreateNotCondition(u.auto.CreatePropertyCondition(P["type"], 50029)))
        cond = u.cond_nocells
    try:
        root = u.auto.ElementFromHandle(wintypes.HWND(hwnd or user32.GetForegroundWindow()))
        arr = root.FindAllBuildCache(4, cond, u.cache)  # TreeScope_Descendants
    except Exception as e:  # noqa: BLE001 - a COMError must never escape as an 'internal error'
        if _hresult(e) in BUSY_HRESULTS:
            raise AppBusy("the window did not answer UI Automation in time (busy, or a modal dialog is open) — "
                          "use a screenshot / OCR look instead of the element tree") from None
        raise NativeError(f"UI Automation could not read this window: {e}") from None
    out: list[dict] = []
    vs = clip or virtual_screen()
    for i in range(arr.Length):
        el = arr.GetElement(i)
        role = CONTROL_TYPES.get(_cached(el, P["type"]) or 0, "control")
        name = (_cached(el, P["name"]) or "").strip()
        r = _cached(el, P["rect"])
        if not r or len(r) < 4:
            continue
        x, y, w, h = (int(v) for v in r[:4])
        if w < 3 or h < 3 or x + w <= vs["x"] or y + h <= vs["y"] or x >= vs["x"] + vs["w"] or y >= vs["y"] + vs["h"]:
            continue
        value = _cached(el, P["value"])
        value = value.strip()[:200] if isinstance(value, str) else None
        if actionable_only and role not in ACTIONABLE:
            continue
        if not name and not value and role in {"pane", "group", "custom", "text", "image", "separator"}:
            continue
        out.append({"role": role, "name": name[:200], "value": value,
                    "aid": (_cached(el, P["aid"]) or "")[:80] or None,
                    "rect": {"x": x, "y": y, "w": w, "h": h},
                    "enabled": bool(_cached(el, P["enabled"])),
                    "password": bool(_cached(el, P["password"])),
                    "focused": bool(_cached(el, P["focused"])),
                    "invokable": bool(_cached(el, P["invoke_ok"])),
                    "patterns": [k for k, pid in (("invoke", "invoke_ok"), ("toggle", "toggle_ok"),
                                                  ("select", "select_ok"), ("expand", "expand_ok"),
                                                  ("value", "value_ok")) if _cached(el, P[pid])],
                    "native_hwnd": int(_cached(el, P["hwnd"]) or 0) or None,
                    "_el": el})
        if len(out) >= limit:
            break
    return out


def uia_focused() -> dict | None:
    try:
        u = _uia()
        el = u.auto.GetFocusedElement()
        r = el.CurrentBoundingRectangle
        return {"role": CONTROL_TYPES.get(el.CurrentControlType, "control"), "name": (el.CurrentName or "")[:200],
                "password": bool(el.CurrentIsPassword),
                "rect": {"x": r.left, "y": r.top, "w": r.right - r.left, "h": r.bottom - r.top}}
    except Exception:  # noqa: BLE001
        return None


def _pattern(el, pid: int, iface: str):
    u = _uia()
    try:
        pat = el.GetCurrentPattern(pid)
        return pat.QueryInterface(getattr(u.mod, iface)) if pat else None
    except Exception:  # noqa: BLE001
        return None


# HRESULTs meaning "the app did not answer in time": the action may well have happened (a button that opens a
# MODAL dialog blocks its own Invoke) — so never try a second pattern on the same control after one of these.
BUSY_HRESULTS = {-2146233083, -2147417846, -2147418111, -2147023174}  # UIA timeout, RPC_E_SERVERCALL_RETRYLATER,
#                                                                      RPC_E_CALL_REJECTED, RPC_S_CALL_FAILED


class AppBusy(NativeError):
    """The target app stopped answering UI Automation (often: a modal dialog it just opened)."""


def _hresult(exc) -> int | None:
    h = getattr(exc, "hresult", None)
    if h is None and getattr(exc, "args", None) and isinstance(exc.args[0], int):
        h = exc.args[0]
    return h


def uia_press(el) -> str | None:
    """Activate a control WITHOUT pointer or focus: Invoke → Toggle → SelectionItem → ExpandCollapse.
    Works on covered or background windows. Returns the pattern used, or None.
    Measured on Windows 11 Paint: Invoke on 'Edit colors' (opens a modal colour dialog) timed out; the old code
    then went on to Toggle/Select/Expand/DoDefaultAction on the same button and Paint hung for good. A timeout
    now stops here and raises AppBusy — the click most likely happened."""
    for pid, iface, call, name in ((10000, "IUIAutomationInvokePattern", "Invoke", "invoke"),
                                   (10015, "IUIAutomationTogglePattern", "Toggle", "toggle"),
                                   (10010, "IUIAutomationSelectionItemPattern", "Select", "select")):
        pat = _pattern(el, pid, iface)
        if pat is not None:
            try:
                getattr(pat, call)()
                return name
            except Exception as e:  # noqa: BLE001
                if _hresult(e) in BUSY_HRESULTS:
                    raise AppBusy(f"the app did not answer UI Automation {call}() in time — it is probably showing "
                                  "a modal dialog that this click opened; look with a screenshot (no element "
                                  "tree) before the next step") from None
                continue
    pat = _pattern(el, 10005, "IUIAutomationExpandCollapsePattern")
    if pat is not None:
        try:
            if pat.CurrentExpandCollapseState == 1:  # expanded
                pat.Collapse()
                return "collapse"
            pat.Expand()
            return "expand"
        except Exception:  # noqa: BLE001
            pass
    pat = _pattern(el, 10018, "IUIAutomationLegacyIAccessiblePattern")  # MSAA default action (older controls)
    if pat is not None:
        try:
            if (pat.CurrentDefaultAction or "").strip():
                pat.DoDefaultAction()
                return "default-action"
        except Exception:  # noqa: BLE001
            pass
    return None


def uia_invoke(el) -> bool:
    return uia_press(el) is not None


def uia_get_value(el) -> str | None:
    pat = _pattern(el, 10002, "IUIAutomationValuePattern")
    try:
        return pat.CurrentValue if pat is not None else None
    except Exception:  # noqa: BLE001
        return None


def uia_set_value(el, text: str) -> bool:
    pat = _pattern(el, 10002, "IUIAutomationValuePattern")
    if pat is None:
        return False
    try:
        if pat.CurrentIsReadOnly:
            return False
        pat.SetValue(text)
        return True
    except Exception:  # noqa: BLE001
        return False


def uia_range(el) -> dict | None:
    """A slider's RangeValue: {value, min, max, small_change} or None."""
    pat = _pattern(el, 10003, "IUIAutomationRangeValuePattern")
    if pat is None:
        return None
    try:
        return {"value": float(pat.CurrentValue), "min": float(pat.CurrentMinimum),
                "max": float(pat.CurrentMaximum), "small_change": float(pat.CurrentSmallChange)}
    except Exception:  # noqa: BLE001
        return None


def uia_set_range(el, value: float) -> bool:
    """Set a slider exactly (RangeValue.SetValue) — no dragging, no pointer."""
    pat = _pattern(el, 10003, "IUIAutomationRangeValuePattern")
    if pat is None:
        return False
    try:
        if pat.CurrentIsReadOnly:
            return False
        pat.SetValue(float(value))
        return True
    except Exception as e:  # noqa: BLE001
        if _hresult(e) in BUSY_HRESULTS:
            raise AppBusy("the app did not answer the slider change in time") from None
        return False


def uia_scroll_into_view(el) -> bool:
    pat = _pattern(el, 10017, "IUIAutomationScrollItemPattern")
    try:
        if pat is not None:
            pat.ScrollIntoView()
            return True
    except Exception:  # noqa: BLE001
        pass
    return False


# ── OCR ──────────────────────────────────────────────────────────────────────
_ocr_lock = threading.Lock()
_ocr_engines: dict = {}


def ocr(img, *, lang: str = "en") -> list[dict]:
    """Text boxes from a PIL image with RapidOCR (ONNX, CPU). Boxes are in image pixels."""
    with _ocr_lock:
        eng = _ocr_engines.get(lang)
        if eng is None:
            try:
                from rapidocr import RapidOCR  # noqa: PLC0415
            except ImportError:
                raise NativeError("OCR needs the `rapidocr` package (pip install rapidocr onnxruntime)") from None
            params = {"Global.use_cls": False, "Global.log_level": "error"}
            if lang == "ar":
                from rapidocr import LangRec  # noqa: PLC0415
                params["Rec.lang_type"] = LangRec.ARABIC
            try:
                eng = RapidOCR(params=params)
            except Exception:  # noqa: BLE001 - older rapidocr without these keys
                eng = RapidOCR()
            _ocr_engines[lang] = eng
    import numpy as np  # noqa: PLC0415
    res = eng(np.asarray(img))
    boxes = getattr(res, "boxes", None)
    txts = getattr(res, "txts", None)
    scores = getattr(res, "scores", None)
    out = []
    if boxes is None or txts is None:
        return out
    for b, t, s in zip(boxes, txts, scores):
        xs = [p[0] for p in b]
        ys = [p[1] for p in b]
        out.append({"text": str(t), "score": round(float(s), 3),
                    "rect": {"x": int(min(xs)), "y": int(min(ys)), "w": int(max(xs) - min(xs)), "h": int(max(ys) - min(ys))}})
    return out


# ── annotation (set-of-marks) ───────────────────────────────────────────────
PALETTE = [(230, 57, 70), (29, 120, 196), (46, 160, 67), (217, 119, 6), (124, 58, 237), (14, 165, 165)]


def annotate(img, marks: list[dict], *, origin: dict) -> object:
    """Draw numbered boxes (`ref` labels) onto a copy of the screenshot. Marks use screen coordinates."""
    from PIL import ImageDraw  # noqa: PLC0415
    im = img.copy()
    d = ImageDraw.Draw(im)
    for i, m in enumerate(marks):
        r = m["rect"]
        x, y = r["x"] - origin["x"], r["y"] - origin["y"]
        col = PALETTE[i % len(PALETTE)]
        d.rectangle([x, y, x + r["w"], y + r["h"]], outline=col, width=2)
        label = m["ref"]
        tw = 7 * len(label) + 6
        ly = y - 14 if y >= 14 else y
        d.rectangle([x, ly, x + tw, ly + 14], fill=col)
        d.text((x + 3, ly + 1), label, fill=(255, 255, 255))
    return im


def capabilities() -> dict:
    import importlib.util  # noqa: PLC0415  (find_spec: no heavy imports just to report availability)
    caps = {"platform": sys.platform, "windows": IS_WINDOWS}
    for mod in ("mss", "PIL", "comtypes", "rapidocr", "numpy", "win32com"):
        caps[mod] = importlib.util.find_spec(mod) is not None
    caps["delivery"] = {"background": "UI Automation patterns → PostMessage to the control (no focus change, real "
                                      "cursor untouched); window capture via PrintWindow",
                        "foreground": "SendInput after the user is idle; the user's cursor is put back",
                        "app_api": "Excel through COM (kosif_excel)" if caps["win32com"] else "needs pywin32"}
    if IS_WINDOWS:
        caps["dpi"] = ensure_dpi_aware()
        caps["screen"] = virtual_screen()
        caps["monitors"] = monitors()
        caps["self_elevated"] = self_elevated()
    return caps


# ── windows & programs (visible: whatever the agent works on comes to the front where the user sees it) ──
if IS_WINDOWS:
    user32.ShowWindow.argtypes = (wintypes.HWND, ctypes.c_int)


def show_window(hwnd: int, how: str = "restore") -> None:
    """restore | minimize | maximize a top-level window (normal, visible behaviour)."""
    cmd = {"restore": 9, "show": 9, "minimize": 6, "maximize": 3}.get(how, 9)
    user32.ShowWindow(wintypes.HWND(hwnd), cmd)


def launch(target: str, args: str | None = None, *, wait: float = 15.0, match: str | None = None,
           activate: bool = True) -> dict:
    """Start a program, document or URL and wait for its window. activate=False asks Windows to show it without
    taking the foreground (SW_SHOWNOACTIVATE) — most apps honour it; some still raise themselves."""
    ensure_dpi_aware()
    before = {w["hwnd"] for w in list_windows(400)}
    r = ctypes.windll.shell32.ShellExecuteW(None, "open", target, args, None, 1 if activate else 4)
    if r <= 32:
        raise NativeError(f"could not start {target!r} (ShellExecute error {r})")
    key = (match or os.path.splitext(os.path.basename(target))[0]).lower()
    t0, found = time.time(), None
    while time.time() - t0 < wait and not found:
        time.sleep(0.15)
        fresh = [w for w in list_windows(400) if w["hwnd"] not in before]
        found = next((w for w in fresh if key in (w["process"] + " " + w["title"]).lower()), None)
        if not found and fresh and time.time() - t0 > 3:
            found = fresh[0]
    return {"started": target, "window": found}


# ── the agent cursor overlay (separate process; see cursor_overlay.py) ─────
_OV = {"sock": None, "port": None}


def _pid_alive(pid: int) -> bool:
    h = kernel32.OpenProcess(0x1000, False, pid)
    if not h:
        return False
    try:
        code = wintypes.DWORD()
        kernel32.GetExitCodeProcess(h, ctypes.byref(code))
        return code.value == 259  # STILL_ACTIVE
    finally:
        kernel32.CloseHandle(h)


def overlay_port() -> int | None:
    """Port of a RUNNING cursor overlay (state file '<port>\\n<pid>'), else None."""
    try:
        from .paths import state_dir  # noqa: PLC0415
        f = state_dir() / "cursor_overlay.port"
        if not f.exists():
            return None
        parts = f.read_text(encoding="utf-8").split()
        port, pid = int(parts[0]), int(parts[1]) if len(parts) > 1 else 0
        return port if (not pid or _pid_alive(pid)) else None
    except (OSError, ValueError, ImportError, IndexError):
        return None


def overlay_start() -> bool:
    """Start the Claude cursor overlay process if it is not running (no console window)."""
    if not IS_WINDOWS or os.environ.get("KOSIF_CURSOR", "1") == "0":
        return False
    if overlay_port():
        return True
    import subprocess  # noqa: PLC0415
    pkg_parent = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exe = sys.executable
    pyw = os.path.join(os.path.dirname(exe), "pythonw.exe")
    subprocess.Popen([pyw if os.path.exists(pyw) else exe, "-m", "kosif_mcp.cursor_overlay"], cwd=pkg_parent,
                     creationflags=0x08000000 | 0x00000008, close_fds=True,  # CREATE_NO_WINDOW | DETACHED_PROCESS
                     stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(40):
        time.sleep(0.1)
        if overlay_port():
            _OV["sock"] = None
            return True
    return False


def overlay_send(msg: dict) -> bool:
    """Fire-and-forget UDP to the cursor overlay (never blocks input; silently skipped when it is off)."""
    import json as _json  # noqa: PLC0415
    import socket  # noqa: PLC0415
    port = overlay_port()
    if not port:
        return False
    try:
        if _OV["sock"] is None:
            _OV["sock"] = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        _OV["sock"].sendto(_json.dumps(msg, ensure_ascii=False).encode("utf-8"), ("127.0.0.1", port))
        return True
    except OSError:
        return False


class overlay_aside:
    """Let the agent's OWN screenshot see what is under the Claude cursor: hide it for the capture, show it after.
    (The cursor stays visible to the user and to any screen recording the rest of the time.)"""

    def __enter__(self):
        self.on = overlay_send({"cmd": "hide"})
        if self.on:
            time.sleep(0.045)
        return self

    def __exit__(self, *exc):
        if self.on:
            overlay_send({"cmd": "show"})
        return False


def overlay_point(x: float, y: float, label: str = "", *, cmd: str = "move", dur: float = 0.12) -> None:
    overlay_send({"cmd": cmd, "x": x, "y": y, "label": label, "dur": dur})