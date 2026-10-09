"""KOSIF Live View — a live model of the desktop, the way DevTools gives a live model of a Chrome page.

Instead of taking a screenshot to find out what happened, one background thread subscribes to the operating
system's own accessibility events (SetWinEventHook, out-of-context: no DLL is injected anywhere) and keeps a
ring buffer of them:

  foreground changed · window opened / closed / shown / hidden · dialog / menu opened · keyboard focus moved ·
  a control's name / value / state changed

Every event is tagged with its top-level window, so the tools always know — without looking — whether a window
changed since the last look (`dirty_since`), what a batch of actions caused (`summary`), and can react the moment
something appears (`wait`). Read-only: it observes events, it never sends any.
"""
from __future__ import annotations

import collections
import ctypes
import os
import threading
import time
from ctypes import wintypes

from . import desktop_native as nat

EVENT_NAMES = {
    0x0003: "foreground", 0x0004: "menu_start", 0x0005: "menu_end", 0x0006: "popup_menu_open",
    0x0007: "popup_menu_close", 0x0010: "dialog_open", 0x0011: "dialog_close", 0x0016: "minimized",
    0x0017: "restored",
    0x8000: "created", 0x8001: "destroyed", 0x8002: "shown", 0x8003: "hidden", 0x8004: "reordered",
    0x8005: "focus", 0x8006: "selection", 0x8007: "selection_add", 0x8008: "selection_remove",
    0x8009: "selection_within", 0x800A: "state", 0x800C: "name", 0x800D: "description", 0x800E: "value",
}
# 0x800B (location change) is deliberately NOT hooked: the cursor and caret fire it hundreds of times a second.
RANGES = ((0x0003, 0x0007), (0x0010, 0x0011), (0x0016, 0x0017), (0x8000, 0x800A), (0x800C, 0x800E))
OBJID_WINDOW = 0
NOISE_CLASSES = {"KosifAgentCursor", "tooltips_class32", "Shell_TrayWnd", "TaskListThumbnailWnd",
                 "ForegroundStaging", "MultitaskingViewFrame", "XamlExplorerHostIslandWindow", "IME",
                 "MSCTFIME UI", "OleMainThreadWndClass", "GDI+ Hook Window Class", "CicMarshalWndClass",
                 "Windows.UI.Input.InputSite.WindowClass", "UserAdapterWindowClass", "SysShadow",
                 "PseudoConsoleWindow", "Chrome_SystemMessageWindow", "CLIPBRDWNDCLASS"}
NOISE_TITLES = {"Default IME", "MSCTFIME UI", "OLEChannelWnd", "GDI+ Window", "DDE Server Window",
                # internal helper windows measured flooding the change list while Notepad/Paint/Calculator ran
                "MIT Message Only Window", "LiftedDMITCursorRecalculateWindow", "DeviceMonitorMessageWindow",
                "OleMainThreadWndName", "Shell Handwriting Canvas", "WISPTIS", "XCP", "DesktopWindowXamlSource",
                "Cua.AgentCursorOverlay.default"}


def reportable(info) -> bool:
    """A window worth telling the model about: it has a title and is not a known helper/system window."""
    return bool(info and info[0] and info[0] not in NOISE_TITLES and info[1] not in NOISE_CLASSES)
CONTENT = {"name", "value", "state", "selection", "selection_add", "selection_remove", "selection_within",
           "reordered", "description", "created", "destroyed", "shown", "hidden"}


class _Live:
    def __init__(self):
        self.lock = threading.Condition()
        self.events: collections.deque = collections.deque(maxlen=6000)
        self.seq = 0
        self.dirty: dict[int, int] = {}      # top-level hwnd → seq of its last event
        self.titles: dict[int, tuple] = {}   # top-level hwnd → (title, class, process) last seen
        self.seen_visible: set[int] = set()  # top-level windows that were ever on screen
        self.thread: threading.Thread | None = None
        self.tid = 0
        self.ok = False
        self.error = ""
        self._cb = None

    # ── the hook thread ──────────────────────────────────────────────────
    def start(self) -> bool:
        if not nat.IS_WINDOWS or os.environ.get("KOSIF_LIVE", "1") == "0":
            self.error = "disabled" if nat.IS_WINDOWS else "not Windows"
            return False
        with self.lock:
            if self.thread and self.thread.is_alive():
                return self.ok
            ready = threading.Event()
            self.thread = threading.Thread(target=self._run, args=(ready,), name="kosif-live", daemon=True)
            self.thread.start()
        ready.wait(3)
        return self.ok

    def _run(self, ready: threading.Event):
        user32 = ctypes.WinDLL("user32", use_last_error=True)
        kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
        proto = ctypes.WINFUNCTYPE(None, wintypes.HANDLE, wintypes.DWORD, wintypes.HWND, wintypes.LONG,
                                   wintypes.LONG, wintypes.DWORD, wintypes.DWORD)
        user32.SetWinEventHook.restype = wintypes.HANDLE
        user32.SetWinEventHook.argtypes = (wintypes.DWORD, wintypes.DWORD, wintypes.HMODULE, proto,
                                           wintypes.DWORD, wintypes.DWORD, wintypes.DWORD)
        user32.GetAncestor.argtypes = (wintypes.HWND, wintypes.UINT)
        user32.GetAncestor.restype = wintypes.HWND
        self._cb = proto(self._on_event)
        self.tid = kernel32.GetCurrentThreadId()
        try:  # windows already on screen count as seen, so closing them is still reported
            self.seen_visible |= {int(w["hwnd"]) for w in nat.list_windows(400)}
        except Exception:  # noqa: BLE001
            pass
        hooks = [user32.SetWinEventHook(a, b, None, self._cb, 0, 0, 0x0000 | 0x0002)  # OUTOFCONTEXT|SKIPOWNPROCESS
                 for a, b in RANGES]
        self.ok = all(hooks)
        if not self.ok:
            self.error = f"SetWinEventHook failed (error {ctypes.get_last_error()})"
        self._user32 = user32
        ready.set()
        msg = wintypes.MSG()
        while user32.GetMessageW(ctypes.byref(msg), None, 0, 0) > 0:  # the hook needs a message loop
            user32.TranslateMessage(ctypes.byref(msg))
            user32.DispatchMessageW(ctypes.byref(msg))
        for h in hooks:
            if h:
                user32.UnhookWinEvent(h)

    def _on_event(self, _hook, event, hwnd, id_object, id_child, _thread, _ms):
        try:
            if not hwnd or id_object in (-9, -8):  # OBJID_CURSOR, OBJID_CARET
                return
            name = EVENT_NAMES.get(event)
            if not name:
                return
            root = int(self._user32.GetAncestor(hwnd, 2) or hwnd)  # GA_ROOT
            top = root == int(hwnd) and id_object == OBJID_WINDOW and id_child == 0
            if top and name in ("created", "shown"):
                if name == "created" and not self._user32.IsWindowVisible(hwnd):
                    return  # created hidden (message-only/helper windows never show): wait for its 'shown'
                self.seen_visible.add(root)
            elif top and name in ("destroyed", "hidden"):
                if root not in self.seen_visible:
                    return  # never on screen: nothing the user or the model could have seen went away
                if name == "destroyed":
                    self.seen_visible.discard(root)
            if name in ("created", "destroyed", "shown", "hidden", "reordered") and not top:
                info = None  # child-control churn: counts as a content change of its window only
            else:
                info = self._describe(root) if (top or name in ("foreground", "dialog_open", "focus")) else None
            if info and (info[1] in NOISE_CLASSES or info[0] in NOISE_TITLES):
                return
            known = self.titles.get(root)
            if known and (known[1] in NOISE_CLASSES or known[0] in NOISE_TITLES):
                return
            with self.lock:
                self.seq += 1
                self.dirty[root] = self.seq
                if info and (info[0] or root not in self.titles):  # a dying window reads as '': keep its name
                    self.titles[root] = info
                self.events.append((self.seq, time.time(), name, root, int(hwnd), top, id_object, id_child))
                self.lock.notify_all()
        except Exception:  # noqa: BLE001 - a hook callback must never raise into the OS
            pass

    def _describe(self, root: int):
        try:
            h = wintypes.HWND(root)
            title = nat._text(h)
            cls = nat._class(h)
            prev = self.titles.get(root)
            proc = prev[2] if prev and prev[1] == cls else nat.process_name(nat._pid(h))
            return (title, cls, proc)
        except Exception:  # noqa: BLE001
            return None

    # ── queries ───────────────────────────────────────────────────────────
    def title_now(self, root: int) -> str:
        """The window's CURRENT title (a common dialog is created as 'Open' and renamed 'Save as' a moment
        later), or '' when it is gone."""
        try:
            if nat.IS_WINDOWS and nat.window_alive(root):
                return nat._text(wintypes.HWND(int(root))) or ""
        except Exception:  # noqa: BLE001
            pass
        return ""

    def cursor(self) -> int:
        with self.lock:
            return self.seq

    def dirty_since(self, hwnd: int, seq: int) -> bool:
        with self.lock:
            return self.dirty.get(int(hwnd), 0) > seq

    def raw_since(self, seq: int) -> list[tuple]:
        with self.lock:
            return [e for e in self.events if e[0] > seq]

    def wait(self, pred, timeout: float, *, since: int | None = None):
        """Block until an event e (seq, t, name, root, hwnd, top, idObject, idChild) satisfies pred(e)."""
        deadline = time.time() + timeout
        start = self.cursor() if since is None else since
        with self.lock:
            while True:
                for e in self.events:
                    if e[0] > start and pred(e, self.titles.get(e[3])):
                        return e
                left = deadline - time.time()
                if left <= 0:
                    return None
                self.lock.wait(min(left, 0.25))

    def summary(self, seq: int, *, focus_window: int | None = None, limit: int = 25) -> dict:
        """What happened since `seq`, compressed for a model: windows that opened/closed, foreground and focus
        changes, and how many content changes each window had."""
        evs = self.raw_since(seq)
        with self.lock:
            titles = dict(self.titles)
        out: list[dict] = []
        counts: dict[int, int] = collections.Counter()
        last_fg = None
        fresh: dict[int, str] = {}

        def now_title(root, title):
            if root not in fresh:
                fresh[root] = self.title_now(root) or title
            return fresh[root]
        for s, t, name, root, hwnd, top, _o, _c in evs:
            title, cls, proc = titles.get(root, ("", "", ""))
            if title in NOISE_TITLES or cls in NOISE_CLASSES:
                continue
            if name in ("created", "shown") and top and title:
                out.append({"ev": "window_opened", "title": now_title(root, title)[:90], "process": proc,
                            "hwnd": root})
            elif name in ("destroyed", "hidden") and top and title:  # untitled helpers closing are noise
                out.append({"ev": "window_closed", "title": title[:90], "hwnd": root})
            elif name == "dialog_open":
                out.append({"ev": "dialog_opened", "title": now_title(root, title)[:90], "hwnd": root})
            elif name in ("popup_menu_open", "menu_start"):
                out.append({"ev": "menu_opened", "window": title[:60]})
            elif name == "foreground":
                last_fg = {"ev": "foreground", "title": title[:90], "process": proc, "hwnd": root}
                out.append(last_fg)
            elif name in CONTENT:
                counts[root] += 1
        # collapse duplicates (apps fire shown+created+foreground for one window)
        seen, uniq = set(), []
        for e in out:
            k = (e["ev"], e.get("hwnd"), e.get("title"))
            if k not in seen:
                seen.add(k)
                uniq.append(e)
        changed = []
        for h, n in counts.most_common(15):
            info = titles.get(h) or self._describe(h) or ("", "", "")
            if info[0] and info[0] not in NOISE_TITLES and info[1] not in NOISE_CLASSES:
                changed.append({"window": info[0][:70], "hwnd": h, "changes": n})
        changed = changed[:6]
        res = {"since": seq, "now": self.cursor(), "events": uniq[-limit:], "content_changes": changed}
        if any(e[2] == "focus" for e in evs):
            res["focus"] = nat.uia_focused()
        return res


LIVE = _Live()


def ensure() -> bool:
    return LIVE.ok or LIVE.start()


def status() -> dict:
    return {"running": bool(LIVE.ok and LIVE.thread and LIVE.thread.is_alive()), "events_seen": LIVE.cursor(),
            "error": LIVE.error or None,
            "how": "SetWinEventHook (out-of-context, read-only): foreground, windows, dialogs, menus, focus, "
                   "name/value/state changes"}
