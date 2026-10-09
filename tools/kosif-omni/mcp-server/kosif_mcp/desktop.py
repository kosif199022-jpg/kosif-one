"""KOSIF Mouse — fast, gated control of the Windows desktop by mouse and keyboard, with Jev judgement.

The loop every tool follows (from the kosif-computer-use playbook):
  observe → ground → gate → act once → settle → verify → next

* observe  `kosif_mouse_observe`  UIA controls of a window (one cached round trip) with short refs e1…eN, OCR text
           boxes t1…tN when UIA is blind (Chromium/Electron canvases, games), and a screenshot with the refs drawn
           on it (set-of-marks) so a vision model can point by ref instead of guessing pixels.
* ground   `kosif_mouse_find`     Arabic/English instruction → one ref (kosif-computer-use/ui_ground.py); when the
           top candidates are close, the live Jev service chooses over the closed candidate set (asked twice with
           the options reordered; used only when stable and confident). Jev never approves anything.
* gate     every mutating step goes through kosif-computer-use/action_gate.py in-process: RUN acts, CONFIRM needs
           the step listed in `approved` (the user asked for exactly this), HANDOFF/BLOCK stop. Password fields,
           elevated windows (UIPI) and the secure desktop are always handed to the human.
* act      `kosif_mouse_act` runs a whole batch in one call via SendInput (no artificial pauses) — the speed win.
* verify   per-step `expect` (text visible / window title / screen changed / Jev yes-no on fresh evidence).
* `kosif_mouse_do` chains all of it for one instruction: "اضغط زر حفظ", "type 'hello' in the search box".

Emergency brake: slam the mouse into the top-left corner of the screen, or hold Esc — the batch stops before the
next action. Nothing here hides automation (no human-like curves, no fingerprint tricks) and nothing bypasses
CAPTCHA, MFA, UAC or logins.
"""
from __future__ import annotations

import argparse
import base64
import importlib.util
import json
import os
import sys
import threading
import time
from functools import lru_cache

from . import desktop_native as nat
from . import live
from .paths import skills_dir
from .registry import A, B, I, N, O, S, ToolError, obj, tool

_STATE_LOCK = threading.RLock()
_STATE: dict = {"snap": None, "history": [], "seq": 0, "target": None, "target_explicit": False}
MAX_HISTORY = 40


# ── bundled playbook scripts, loaded in-process (no subprocess = no 100 ms tax per step) ──
@lru_cache(maxsize=None)
def _script(name: str):
    path = skills_dir() / "kosif-computer-use" / "scripts" / name
    spec = importlib.util.spec_from_file_location("kosif_cu_" + name.replace(".py", ""), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _gate(steps: list[dict], *, approved: list[str], page: dict | None = None, history=None) -> dict:
    return _script("action_gate.py").run({"steps": steps, "approved": approved, "page": page or {},
                                          "history": history or []})


def _ground(instruction: str, elements: list[dict], history: list[str]) -> dict:
    return _script("ui_ground.py").ground({"instruction": instruction, "elements": elements, "history": history})


def _local_only() -> None:
    """The desktop is the user's own machine: over the HTTP transport (which may be tunnelled to the internet for
    ChatGPT) screen capture and input stay off unless the owner sets KOSIF_MOUSE_HTTP=1 on a loopback bind."""
    from .paths import _MODE  # noqa: PLC0415
    if _MODE.get("transport") == "http" and os.environ.get("KOSIF_MOUSE_HTTP") != "1":
        raise ToolError("KOSIF Mouse is disabled over HTTP (remote screen/input access). It works over stdio "
                        "(Claude Code / Claude Desktop). The owner can opt in with KOSIF_MOUSE_HTTP=1 on a "
                        "loopback-only console.")


def _guard(fn, *a, **kw):
    if fn is not status:
        _local_only()
    try:
        return fn(*a, **kw)
    except nat.Aborted as e:
        raise ToolError(str(e)) from None
    except nat.NativeError as e:
        raise ToolError(str(e)) from None


# ── observation ──────────────────────────────────────────────────────────────
def _resolve_window(target) -> dict | None:
    if target in (None, "", "foreground", "active"):
        return nat.foreground()
    if target == "screen":
        return None
    if isinstance(target, int) or (isinstance(target, str) and target.isdigit()):
        return nat.window_info(int(target))
    t = str(target).lower()
    for w in nat.list_windows(200):
        if t in w["title"].lower() or t == w["process"].lower():
            return nat.window_info(w["hwnd"])
    raise ToolError(f"no visible window matches {target!r}; call kosif_mouse_observe with windows=true")


def _clip(rect: dict, vs: dict) -> dict:
    x1, y1 = max(rect["x"], vs["x"]), max(rect["y"], vs["y"])
    x2 = min(rect["x"] + rect["w"], vs["x"] + vs["w"])
    y2 = min(rect["y"] + rect["h"], vs["y"] + vs["h"])
    return {"x": x1, "y": y1, "w": max(0, x2 - x1), "h": max(0, y2 - y1)}


def _line(e: dict) -> str:
    r = e["rect"]
    flags = "".join([" [disabled]" if not e.get("enabled", True) else "", " [password]" if e.get("password") else "",
                     " [focused]" if e.get("focused") else ""])
    val = f" = {e['value'][:40]!r}" if e.get("value") and e["value"] != e.get("name") else ""
    return f"{e['ref']} {e['role']} {e.get('name', '')[:70]!r}{val} @({r['x'] + r['w'] // 2},{r['y'] + r['h'] // 2}){flags}"


def _thumb(w: int, h: int, raw: bytes, size: int = 48) -> bytes:
    sx, sy = max(1, w // size), max(1, h // size)
    try:
        import numpy as np  # noqa: PLC0415
        return np.frombuffer(raw, np.uint8).reshape(h, w, 4)[::sy, ::sx, 1].tobytes()
    except ImportError:
        return bytes(raw[y * w * 4 + x * 4 + 1] for y in range(0, h, sy) for x in range(0, w, sx))


def _is_excel(win: dict | None) -> bool:
    return bool(win) and (win.get("process") or "").lower() == "excel.exe"


def observe(*, target=None, elements: bool = True, ocr="auto", ocr_lang: str = "en", screenshot: bool = True,
            annotate: bool = True, max_side: int = 1280, fmt: str = "jpeg", region: dict | None = None,
            windows: bool = False, limit: int = 250, actionable_only: bool = False, capture: str = "auto",
            reuse: bool = True, cells=None) -> dict:
    """capture: auto (the window itself via PrintWindow when something covers it, else the screen) | window |
    screen. reuse: when Live View saw no event for this window and its pixels did not change, the previous
    element tree is reused (≈0 ms instead of a full UI Automation walk)."""
    t0 = time.perf_counter()
    nat.ensure_dpi_aware()
    live.ensure()
    vs = nat.virtual_screen()
    # a region WITH a window target zooms into that window's own pixels; a bare region is a piece of the screen
    win = _resolve_window(target) if (not region or target not in (None, "", "screen")) else None
    area = _clip(region or (win["rect"] if win and not win["minimized"] else vs), vs)
    if region and win:
        area = _clip(area, win["rect"])
    if area["w"] <= 0 or area["h"] <= 0:
        raise ToolError(f"nothing visible to observe in {region or (win or {}).get('rect')}")
    timings: dict = {}
    els: list[dict] = []
    notes: list[str] = []
    fg = (nat.foreground() or {}).get("hwnd")
    covered = bool(win and fg != win["hwnd"])
    skip_cells = (not cells) if cells is not None else _is_excel(win)
    params = (limit, bool(actionable_only), skip_cells)
    live_seq = live.LIVE.cursor()
    # 1) pixels first (cheap): the window itself when it is covered, so nothing has to come to the front
    img, fp, cap = None, None, None
    want_pixels = screenshot or ocr is True or (ocr == "auto" and elements) or (reuse and elements and win)
    if want_pixels and win and not win["minimized"] and \
            (capture == "window" or (capture == "auto" and (covered or region))):
        t = time.perf_counter()
        g = nat.grab_window(win["hwnd"])
        if g:
            w, h, raw, rect = g
            if region:  # measured: a screen grab here showed the user's bank page that covered Paint
                cut = _clip(area, rect)
                ox, oy = cut["x"] - rect["x"], cut["y"] - rect["y"]
                raw = b"".join(raw[(oy + r) * w * 4 + ox * 4:(oy + r) * w * 4 + (ox + cut["w"]) * 4]
                               for r in range(cut["h"]))
                w, h, rect = cut["w"], cut["h"], cut
            if w > 0 and h > 0:
                area, cap = rect, "window"
                img_raw = (w, h, raw)
        timings["capture_ms"] = round((time.perf_counter() - t) * 1000)
    if region and win and cap is None and covered:
        raise ToolError(f"{win.get('title')!r} is covered and could not be captured on its own, so this region "
                        "would show the window in front of it instead; observe without `region`")
    if want_pixels and cap is None and area["w"] > 0 and area["h"] > 0:
        t = time.perf_counter()
        with nat.overlay_aside():
            img_raw = nat.grab(area)
        cap = "screen"
        timings["capture_ms"] = round((time.perf_counter() - t) * 1000)
        if covered:
            notes.append("this window is covered and could not be captured on its own: the screenshot shows what "
                         "covers it (background actions still reach the window itself)")
    if cap:
        fp = _thumb(*img_raw)
    # 2) the element tree — reused when Live View and the pixels both say nothing changed
    prev = _snap(False)
    reused = False
    if elements and win and not region:
        if reuse and prev and prev.get("window") and prev["window"]["hwnd"] == win["hwnd"] \
                and prev["window"]["rect"] == win["rect"] and prev.get("params") == params \
                and prev.get("thread") == threading.get_ident() and time.time() - prev["at"] < 30 \
                and live.LIVE.ok and not live.LIVE.dirty_since(win["hwnd"], prev.get("live_seq", -1)) \
                and fp is not None and prev.get("fp") is not None and nat.changed(prev["fp"], fp) < 0.002:
            els = [e for e in prev["elements"].values() if e["ref"].startswith("e")]
            reused = True
            timings["uia_ms"] = 0
            notes.append("unchanged since the last look (Live View: no events; pixels identical): same refs")
        else:
            t = time.perf_counter()
            try:
                els = nat.uia_snapshot(win["hwnd"], limit=limit, actionable_only=actionable_only,
                                       clip=_clip(win["rect"], vs), skip_cells=skip_cells)
            except nat.NativeError as e:
                notes.append(f"UIA unavailable: {e}")
            timings["uia_ms"] = round((time.perf_counter() - t) * 1000)
    if win and win.get("elevated") and not nat.self_elevated():
        notes.append("this window runs elevated (admin): Windows UIPI drops our input there — hand it to the user")
    if win and win["minimized"]:
        notes.append("this window is minimized: no pixels and few controls; restore it (do:'focus' with "
                     "mode:'foreground') or use an app API")
    img = nat.to_image(*img_raw) if cap else None
    excel = None
    if _is_excel(win) and not region:
        t = time.perf_counter()
        try:
            from . import office_live  # noqa: PLC0415
            excel = office_live.window_summary(win["hwnd"])
            if skip_cells:
                notes.append("Excel: grid cells are read through Excel itself (exact values, see `excel`), not "
                             "as UI elements; change them with kosif_excel (background, no clicks)")
        except Exception as e:  # noqa: BLE001 - Excel busy/blocked: the UIA view still works
            notes.append(f"Excel API unavailable: {str(e)[:120]}")
        timings["excel_ms"] = round((time.perf_counter() - t) * 1000)
    actionable = sum(1 for e in els if e["role"] in nat.ACTIONABLE)
    want_ocr = ocr is True or (ocr == "auto" and elements and actionable < 4)
    texts: list[dict] = []
    if want_ocr and img is not None:
        t = time.perf_counter()
        try:
            for b in nat.ocr(img, lang=ocr_lang):
                r = b["rect"]
                texts.append({"role": "text", "name": b["text"], "score": b["score"], "enabled": True,
                              "rect": {"x": r["x"] + area["x"], "y": r["y"] + area["y"], "w": r["w"], "h": r["h"]}})
            if ocr == "auto":
                notes.append("few UI Automation controls here (Chromium/Electron/canvas?) — OCR text boxes added")
        except nat.NativeError as e:
            notes.append(f"OCR unavailable: {e}")
        timings["ocr_ms"] = round((time.perf_counter() - t) * 1000)
    for i, e in enumerate(els, 1):
        e["ref"] = f"e{i}"
    for i, e in enumerate(texts, 1):
        e["ref"] = f"t{i}"
    allel = els + texts
    with _STATE_LOCK:
        _STATE["seq"] += 1
        snap_id = f"s{_STATE['seq']}"
        _STATE["snap"] = {"id": snap_id, "at": time.time(), "thread": threading.get_ident(), "window": win,
                          "area": area, "elements": {e["ref"]: e for e in allel}, "fp": fp, "params": params,
                          "live_seq": live_seq, "skip_cells": skip_cells}
        if win:
            _STATE["target"] = win  # what the next act works on, unless it names another window
            _STATE["target_explicit"] = target not in (None, "", "foreground", "active")
    out = {"snapshot_id": snap_id, "window": _pub_window(win), "area": area, "cursor": nat.cursor(),
           "screen": vs, "counts": {"controls": len(els), "actionable": actionable, "ocr_text": len(texts)},
           "elements": [_line(e) for e in allel], "notes": notes, "covered": covered, "capture": cap,
           "reused": reused, "live_seq": live_seq,
           "how_to_act": "kosif_mouse_act with {do:'click', ref:'e3'} (refs are valid until the next observe); "
                         "screenshot pixel → screen: x = area.x + px/scale, y = area.y + py/scale"}
    if excel:
        out["excel"] = excel
    if windows:
        out["windows"] = [{"hwnd": w["hwnd"], "title": w["title"], "process": w["process"], "minimized": w["minimized"]}
                          for w in nat.list_windows()]
    if screenshot and img is not None:
        t = time.perf_counter()
        shown = nat.annotate(img, [e for e in allel if e["role"] in nat.ACTIONABLE or e["ref"].startswith("t")][:150],
                             origin=area) if annotate and allel else img
        data, scale, mime = nat.encode(shown, max_side=max_side, fmt=fmt)
        out["image"] = {"mime": mime, "bytes": len(data), "scale": round(scale, 4),
                        "width": shown.size[0], "height": shown.size[1], "annotated": bool(annotate and allel)}
        out["_images"] = [{"mime": mime, "data": base64.b64encode(data).decode("ascii")}]
        timings["encode_ms"] = round((time.perf_counter() - t) * 1000)
    timings["total_ms"] = round((time.perf_counter() - t0) * 1000)
    out["timings"] = timings
    return out


def _pub_window(w):
    if not w:
        return None
    return {k: w[k] for k in ("hwnd", "title", "process", "rect", "minimized", "elevated")}


def _snap(required: bool = True) -> dict | None:
    with _STATE_LOCK:
        s = _STATE["snap"]
    if required and not s:
        raise ToolError("no snapshot yet: call kosif_mouse_observe first (refs come from it)")
    return s


def _el(ref: str) -> dict:
    s = _snap()
    e = s["elements"].get(ref)
    if not e:
        raise ToolError(f"unknown ref {ref!r} in snapshot {s['id']}; observe again — refs change with the screen")
    return e


def _centre(e: dict) -> tuple[int, int]:
    r = e["rect"]
    return r["x"] + r["w"] // 2, r["y"] + r["h"] // 2


# ── grounding (+ Jev) ────────────────────────────────────────────────────────
def _ground_elements(snap: dict) -> list[dict]:
    out = []
    for ref, e in snap["elements"].items():
        out.append({"id": ref, "role": e["role"], "text": e.get("name") or "", "name": e.get("value") or "",
                    "rect": e["rect"], "in_viewport": True, "disabled": not e.get("enabled", True)})
    return out


def find(instruction: str, *, use_jev: bool = True, refresh: bool = True, target=None) -> dict:
    t0 = time.perf_counter()
    if refresh or not _snap(False):
        observe(target=target, screenshot=False)
    snap = _snap()
    if not snap["elements"]:
        raise ToolError("the observed window exposes no controls or text; try kosif_mouse_observe with ocr=true")
    with _STATE_LOCK:
        hist = [h.get("ref") for h in _STATE["history"][-6:] if h.get("ref")]
    g = _ground(instruction, _ground_elements(snap), hist)
    out = {"snapshot_id": snap["id"], "instruction": instruction, "action": g.get("action"),
           "chosen": g.get("chosen"), "score": g.get("score"), "ambiguous": g.get("ambiguous", False),
           "underspecified": g.get("underspecified", False), "candidates": g.get("candidates", []),
           "text": g.get("text"), "decided_by": "deterministic"}
    if g.get("chosen") is None:
        out["decided_by"] = "none"
        out["next"] = g.get("reason") or "no match: scroll, observe with ocr=true, or rephrase"
    elif g.get("underspecified"):
        out["decided_by"] = "ask-user"
        out["next"] = g.get("next")
    elif g.get("ambiguous") and g.get("jev_packet"):
        out.update(_jev_choose(instruction, g, snap, use_jev))
    out["ms"] = round((time.perf_counter() - t0) * 1000)
    return out


def _jev_choose(instruction: str, g: dict, snap: dict, use_jev: bool) -> dict:
    pk = g["jev_packet"]
    options = dict(pk["criteria"])
    options["none"] = "none of these elements matches the instruction"
    if not use_jev:
        return {"decided_by": "ask-user", "next": "ambiguous and Jev disabled: ask the user which candidate"}
    from . import jev  # noqa: PLC0415  (lazy: the network client is optional)
    win = snap.get("window") or {}
    evidence = {"instruction": instruction, "window": {"title": win.get("title"), "process": win.get("process")},
                "candidates": pk["state"]["candidates"]}
    try:
        res = jev.decide("choice", f"Which on-screen element should be used to carry out this instruction: "
                                   f"{instruction}?", evidence, options)
    except ToolError as e:
        return {"decided_by": "ask-user", "jev": {"reachable": False, "error": str(e)[:200]},
                "next": "candidates are too close and Jev is unreachable: ask the user (do not guess)"}
    if res.get("verdict") == "BLOCK":
        return {"decided_by": "ask-user", "jev": {"blocked": res.get("issues")},
                "next": "Jev refused the packet (it never judges authorisations): ask the user"}
    d = res.get("decision") or {}
    ranking = res.get("mean_ranking") or d.get("ranking") or []
    pick, conf = (ranking[0] if ranking else (d.get("choice"), d.get("confidence", 0)))
    jev_info = {"choice": pick, "confidence": conf, "stable": res.get("stable"),
                "receipts": [{k: r.get(k) for k in ("model", "latency_ms", "cached", "packet_digest")}
                             for r in res.get("receipts", [])]}
    if pick and pick != "none" and res.get("stable", True) and float(conf or 0) >= 0.7 and pick in snap["elements"]:
        e = snap["elements"][pick]
        cx, cy = _centre(e)
        return {"decided_by": "jev", "jev": jev_info,
                "chosen": {"id": pick, "label": e.get("name"), "role": e["role"], "centre": {"x": cx, "y": cy}}}
    return {"decided_by": "ask-user", "jev": jev_info,
            "next": "Jev was not confident/stable (needs ≥ 0.7 and agreement): ask the user which candidate"}


def _jev_verify(claim: str, evidence: dict) -> dict:
    from . import jev  # noqa: PLC0415
    try:
        res = jev.decide("noul", f"Does the fresh screen evidence show that this is now true: {claim}?", evidence,
                         true_criteria=f"the evidence directly shows: {claim}",
                         false_criteria="the evidence does not show it, contradicts it, or is unrelated")
    except ToolError as e:
        return {"ok": None, "error": str(e)[:200]}
    if res.get("verdict") == "BLOCK":
        return {"ok": None, "error": "; ".join(res.get("issues") or [])}
    d = res.get("decision") or {}
    p = d.get("p_yes")
    return {"ok": bool(p is not None and p >= 0.65 and res.get("stable", True)), "p_yes": p,
            "stable": res.get("stable"), "class": d.get("class")}


# ── acting ───────────────────────────────────────────────────────────────────
MUTATING = {"click", "double_click", "right_click", "middle_click", "move", "drag", "scroll", "type", "key", "hotkey",
            "focus", "set_value", "invoke", "mouse_down", "mouse_up", "launch", "draw"}
READ_ONLY = {"wait", "wait_for", "observe"}
GATE_ACTION = {"click": "click", "double_click": "double_click", "right_click": "click", "middle_click": "click",
               "move": "scroll", "drag": "drag", "scroll": "scroll", "type": "type", "key": "key", "hotkey": "key",
               "focus": "click", "set_value": "type", "invoke": "click", "mouse_down": "click", "mouse_up": "click",
               "launch": "launch", "draw": "drag",
               "wait": "wait", "wait_for": "wait", "observe": "observe"}


def _resolve_point(step: dict, *, use_jev: bool, tgt: dict | None = None) -> tuple[int | None, int | None, dict | None, dict]:
    """→ (x, y, element, info). Accepts ref | x,y | target (an instruction grounded on a fresh snapshot of the
    window being worked on — never on whatever happens to be in front)."""
    info: dict = {}
    if step["do"] in ("launch", "focus", "wait"):
        return None, None, None, info
    if step["do"] == "draw" and not (step.get("ref") or step.get("target")):
        return None, None, None, info
    if step.get("ref"):
        e = _el(step["ref"])
        x, y = _centre(e)
        return x, y, e, info
    if step.get("x") is not None and step.get("y") is not None:
        x, y = int(step["x"]), int(step["y"])
        if step.get("space") == "image":  # pixel in the last screenshot → screen
            s = _snap()
            sc = float(step.get("scale") or 1.0)
            x, y = s["area"]["x"] + round(x / sc), s["area"]["y"] + round(y / sc)
        return x, y, None, info
    if step.get("target"):
        f = find(str(step["target"]), use_jev=use_jev, target=(tgt or {}).get("hwnd"))
        info["grounding"] = {k: f.get(k) for k in ("chosen", "decided_by", "ambiguous", "candidates", "jev", "next")}
        if f.get("decided_by") in ("none", "ask-user") or not f.get("chosen"):
            raise _Stop("ASK", f"could not ground {step['target']!r}: {f.get('next')}", info)
        ref = f["chosen"]["id"]
        step["ref"] = ref
        e = _el(ref)
        x, y = _centre(e)
        return x, y, e, info
    return None, None, None, info


class _Stop(Exception):
    def __init__(self, verdict: str, reason: str, info: dict | None = None):
        super().__init__(reason)
        self.verdict, self.reason, self.info = verdict, reason, info or {}


def _gate_step(i: int, step: dict, e: dict | None, approved: set[str], win: dict | None = None) -> dict:
    do = step["do"]
    sid = str(step.get("id") or f"a{i + 1}")
    if do in READ_ONLY:
        return {"verdict": "RUN", "id": sid}
    label = " ".join(x for x in [(e or {}).get("name"), (e or {}).get("value"), step.get("target"),
                                 step.get("describe")] if x)
    gstep = {"id": sid, "action": GATE_ACTION[do], "target": label or f"({do} at a point)",
             "text": step.get("text") or "", "expect": step.get("expect") or step.get("describe") or "",
             "user_provided_for_this_login": bool(step.get("user_provided_for_this_login"))}
    if do in ("key", "hotkey"):
        gstep["text"] = str(step.get("keys") or "")
    if win is None:
        win = (_snap(False) or {}).get("window") or {}
    g = _gate([gstep], approved=sorted(approved), page={"title": (win or {}).get("title", ""), "url": ""})
    res = g["steps"][0]
    verdict, notes = res["verdict"], list(res["notes"])
    # desktop-specific hard rules on top of the generic gate
    if do in ("type", "set_value") and e and e.get("password") and not step.get("user_provided_for_this_login"):
        verdict, notes = "HANDOFF", notes + ["password field: only the user types passwords"]
    focused = nat.uia_focused() if do == "type" and not e else None
    if focused and focused.get("password") and not step.get("user_provided_for_this_login"):
        verdict, notes = "HANDOFF", notes + ["keyboard focus is a password field: hand over to the user"]
    combo = str(step.get("keys") or "").lower().replace(" ", "")
    if combo in {"ctrl+alt+del", "ctrl+alt+delete", "win+l"}:
        verdict, notes = "BLOCK", notes + ["secure-attention / lock sequences are not automated"]
    if do == "launch" and verdict == "CONFIRM" and \
            str(step.get("app") or step.get("target") or "").strip().lower() in KNOWN_APPS:
        verdict, notes = "RUN", notes + ["well-known program the user named"]
    if verdict == "CONFIRM" and sid in approved:
        verdict = "RUN"
    return {"verdict": verdict, "id": sid, "risk": res["risk"], "notes": notes}


VERBS = {"click": "يضغط", "double_click": "نقرة مزدوجة", "right_click": "زر أيمن", "middle_click": "زر أوسط",
         "type": "يكتب", "drag": "يسحب", "scroll": "يمرر", "draw": "يرسم", "key": "مفتاح", "hotkey": "اختصار",
         "move": "يتحرك", "set_value": "يكتب", "invoke": "يضغط", "focus": "يعمل على", "launch": "يفتح"}
HOST_PROCESSES = {"claude.exe"}  # the app this agent itself runs in: never typed into unless named explicitly
MODES = ("auto", "background", "foreground")


def _label(step: dict, e: dict | None, ctx: dict | None = None) -> str:
    name = (e or {}).get("name") or step.get("app") or step.get("keys") or ""
    lab = f"{VERBS.get(step['do'], step['do'])} «{str(name)[:28]}»" if name else VERBS.get(step["do"], step["do"])
    t = (ctx or {}).get("tgt")
    if t and (nat.foreground() or {}).get("hwnd") != t["hwnd"]:
        lab = f"{(t.get('title') or '')[:20]} · {lab}"  # acting on a window behind the user's
    return lab


def _host_guard(step: dict, ctx: dict, x, y, e, smode: str) -> None:
    """Never type into the Claude app itself by accident (that is how a stale 'foreground' target once sent
    keystrokes into the chat). Acting there needs the window named explicitly."""
    if step["do"] in ("wait", "launch", "focus", "observe", "wait_for") or ctx.get("explicit"):
        return
    w = ctx.get("tgt")
    if x is not None and e is None and step.get("space") != "image" and smode == "foreground":
        w = nat.window_at(x, y) or w
    if w and (w.get("process") or "").lower() in HOST_PROCESSES:
        raise _Stop("ASK", f"the target is {w.get('title')!r}, the Claude app this agent runs in, picked only "
                           "because it was in front. Name the window to work on (window=… on the call, or a "
                           "focus step) — nothing was typed or clicked")


def _live_el(e: dict | None, tgt: dict | None):
    """The UI Automation element for `e`, usable on this thread (re-found by role+name+position if needed)."""
    if not e or e.get("_el") is None:
        return None
    s = _snap(False) or {}
    if s.get("thread") == threading.get_ident():
        return e["_el"]
    if not tgt:
        return None
    cx, cy = _centre(e)
    same = [f for f in nat.uia_snapshot(tgt["hwnd"], limit=800, skip_cells=bool(s.get("skip_cells")))
            if f["role"] == e["role"] and f["name"] == e.get("name")]
    best = min(same, key=lambda f: abs(_centre(f)[0] - cx) + abs(_centre(f)[1] - cy), default=None)
    return best["_el"] if best else None


# processes seen grabbing the foreground when a UI Automation pattern was used on them (e.g. Calculator, Notepad's
# Save-as dialog). Their next background step first waits until the user is idle: a grab while the user types
# would send a few of their keystrokes to the wrong window before focus is handed back.
_FG_GRABBERS: set[str] = set()


def _keep_focus(fn, ctx: dict | None = None):
    """Run a UI Automation call; if the app grabbed the foreground from the user's window, hand it straight back.
    → (result, stolen)."""
    proc = str(((ctx or {}).get("tgt") or {}).get("process") or "").lower()
    if proc and proc in _FG_GRABBERS and (ctx or {}).get("guard", True):
        waited = nat.wait_user_idle(int(ctx.get("idle_ms", 600)), float(ctx.get("idle_timeout", 30)))
        if waited > 40:
            ctx["waited_for_user_ms"] = ctx.get("waited_for_user_ms", 0) + waited
    before = int(nat.user32.GetForegroundWindow() or 0)
    res = fn()
    time.sleep(0.04)
    after = int(nat.user32.GetForegroundWindow() or 0)
    if before and after != before and nat.window_alive(before):
        nat.focus_window(before)
        if proc:
            _FG_GRABBERS.add(proc)
        return res, True
    return res, False


def _bg_perform(step: dict, x, y, e: dict | None, ctx: dict) -> str:
    """Deliver one step to the target window WITHOUT the foreground: UI Automation pattern → posted messages.
    The real cursor does not move and the user keeps typing wherever they are."""
    do = step["do"]
    tgt = ctx.get("tgt")
    hwnd = (tgt or {}).get("hwnd")
    if not hwnd or not nat.window_alive(hwnd):
        raise nat.BackgroundUnavailable("no target window for background delivery: name one (window=… or a "
                                        "focus step) or observe it first")
    btn = step.get("button", "left")
    if do in ("click", "invoke") and btn == "left" and int(step.get("clicks", 1)) == 1 and e is not None:
        nh = e.get("native_hwnd")
        if nat.win32_kind(nh) == "button":
            nat.button_click(nh)  # measured: Windows' UIA proxy for Win32 buttons activates the window, BM_CLICK not
            return "BM_CLICK posted to the button (no pointer, no focus change)"
        el = _live_el(e, tgt) if not nat.win32_kind(nh) else None
        if el is not None:
            how, stolen = _keep_focus(lambda: nat.uia_press(el), ctx)
            if how:
                return f"UI Automation {how}" + (" (the app grabbed the foreground; it was handed straight back)"
                                                 if stolen else " (no pointer, no focus change)")
        if do == "invoke":
            raise nat.BackgroundUnavailable("this control exposes no UI Automation action pattern")
    if do in ("click", "double_click", "right_click", "middle_click"):
        if x is None:
            raise ToolError(f"{do} needs ref, x/y or target")
        n = {"double_click": 2}.get(do, int(step.get("clicks", 1)))
        b = {"right_click": "right", "middle_click": "middle"}.get(do, btn)
        cls = nat.post_click(hwnd, x, y, button=b, clicks=n)
        return f"posted {b} ×{n} to {cls} at ({x},{y})"
    if do == "type":
        text = str(step.get("text", ""))
        nh = (e.get("native_hwnd") or (nat.child_at(hwnd, *_centre(e)) if x is not None else None)) if e \
            else nat.thread_focus(hwnd)
        if nat.win32_kind(nh) == "edit":  # classic edit box: messages only (UIA's proxy would activate the window)
            if step.get("clear"):
                nat.set_text(nh, text)
                how = "WM_SETTEXT"
            else:
                nat.caret_to_end(nh)
                nat.post_text(nh, text)
                how = "WM_CHAR at the end of the text"
            if step.get("enter"):
                nat.post_key(nh, "enter")
            return f"typed {len(text)} chars into {nat.class_name(nh)} via {how} (no focus change)"
        el = _live_el(e, tgt)
        if el is not None and "value" in (e.get("patterns") or []) and "\n" not in text and "\t" not in text \
                and (step.get("clear") or not e.get("value")):
            ok, _stolen = _keep_focus(lambda: nat.uia_set_value(el, text), ctx)
            if ok:
                if step.get("enter"):
                    nat.post_key(e.get("native_hwnd") or nat.child_at(hwnd, *_centre(e)), "enter")
                return f"value set through UI Automation ({len(text)} chars)"
        if step.get("clear"):
            if el is not None and "value" in (e.get("patterns") or []) and \
                    _keep_focus(lambda: nat.uia_set_value(el, ""), ctx)[0]:
                pass
            else:
                raise nat.BackgroundUnavailable("clearing this field needs Ctrl+A (foreground)")
        if e is not None:
            h = e.get("native_hwnd") or nat.child_at(hwnd, *_centre(e))
            if x is not None and not e.get("native_hwnd"):
                nat.post_click(hwnd, x, y)  # put the caret there, inside the background window only
        else:
            h = nat.thread_focus(hwnd)
        cls = nat.post_text(h, text)
        if step.get("enter"):
            nat.post_key(h, "enter")
        return f"typed {len(text)} chars into {cls} (posted, no focus change)"
    if do in ("key", "hotkey"):
        combo = step.get("keys") or step.get("text") or ""
        cls = nat.post_key(nat.thread_focus(hwnd), combo, repeat=int(step.get("repeat", 1)))
        return f"posted {combo} to {cls}"
    if do == "scroll":
        r = tgt["rect"]
        px, py = (x, y) if x is not None else (r["x"] + r["w"] // 2, r["y"] + r["h"] // 2)
        amt = int(step.get("amount", -5))
        cls = nat.post_scroll(hwnd, px, py, amt, horizontal=bool(step.get("horizontal")))
        return f"posted scroll {amt} to {cls}"
    if do == "set_value":
        el = _live_el(e, tgt)
        text = str(step.get("text", ""))
        ok, stolen = _keep_focus(lambda: el is not None and nat.uia_set_value(el, text), ctx)
        if not ok:
            raise ToolError("this control has no writable UIA Value pattern; use do='type'")
        return "value set through UI Automation" + (" (the app grabbed the foreground; it was handed straight back)"
                                                    if stolen else "")
    raise nat.BackgroundUnavailable(f"{do} needs real pointer movement (foreground)")


def _fg_prepare(step: dict, e: dict | None, x, ctx: dict, rec: dict) -> None:
    """Foreground steps: wait until the user is idle, bring the TARGET window (never a stale one) to the front,
    and refuse to send anything if another window holds the foreground."""
    if ctx.get("guard", True):
        waited = nat.wait_user_idle(int(ctx.get("idle_ms", 600)), float(ctx.get("idle_timeout", 30)))
        if waited > 40:
            rec["waited_for_user_ms"] = waited
    if step["do"] in ("launch", "focus", "wait"):
        return
    w = ctx.get("tgt")
    if not w or (x is not None and e is None and step.get("space") != "image"):
        return  # raw screen coordinates act on whatever the user currently sees there
    for _ in range(3):
        if (nat.foreground() or {}).get("hwnd") == w["hwnd"]:
            return
        if not nat.window_alive(w["hwnd"]):
            raise ToolError(f"the window {w.get('title')!r} is gone")
        ok = nat.focus_window(w["hwnd"])
        ctx["took_fg"] = True
        rec["brought_to_front"] = w.get("title") if ok else f"could not bring {w.get('title')!r} forward"
        time.sleep(0.08)
        if not ok and ctx.get("guard", True):
            nat.wait_user_idle(int(ctx.get("idle_ms", 600)), float(ctx.get("idle_timeout", 30)))
    if (nat.foreground() or {}).get("hwnd") != w["hwnd"]:
        raise _Stop("ASK", f"could not get {w.get('title')!r} in front — another window keeps the foreground. "
                           "Nothing was typed or clicked. Retry, or use mode:'background'")


PEN_STEPS = {"click", "double_click", "right_click", "drag", "draw", "move"}


def _pen_prepare(points: list, ctx: dict, rec: dict) -> None:
    """The pen lands on whatever is on screen at a point. If the target window is covered there, wait until the
    user is idle (a focus change would redirect their typing), bring it forward, and check again."""
    tgt = ctx.get("tgt")
    if not tgt or not points:
        return
    if all(nat.visible_at(tgt["hwnd"], px, py) for px, py in points):
        return
    if ctx.get("guard", True):
        waited = nat.wait_user_idle(int(ctx.get("idle_ms", 600)), float(ctx.get("idle_timeout", 30)))
        if waited > 40:
            rec["waited_for_user_ms"] = waited
    for _ in range(3):
        if (nat.foreground() or {}).get("hwnd") != tgt["hwnd"]:
            ok = nat.focus_window(tgt["hwnd"])
            ctx["took_fg"] = True
            rec["brought_to_front"] = tgt.get("title") if ok else f"could not bring {tgt.get('title')!r} forward"
            time.sleep(0.12)
        if all(nat.visible_at(tgt["hwnd"], px, py) for px, py in points):
            return
    raise _Stop("ASK", f"{tgt.get('title')!r} is still covered where the pen has to land (an always-on-top "
                       "window?). Nothing was clicked or drawn")


def _pen_perform(step: dict, x, y, e: dict | None, ctx: dict, rec: dict) -> str:
    """Claude's own pointer (synthetic pen): the user's mouse is not moved or pressed."""
    do = step["do"]
    if do == "draw":
        pts_all = _draw_points(step, e)
        starts = [p[0] for p in pts_all if p] + [p[-1] for p in pts_all if p]
        _pen_prepare(starts[:40], ctx, rec)
        return _draw(step, e, ctx, pen=True, pts_all=pts_all)
    if x is None:
        raise ToolError(f"{do} needs ref, x/y or target")
    if do == "drag":
        to = step.get("to") or {}
        tx, ty = _centre(_el(step["to_ref"])) if step.get("to_ref") else (int(to["x"]), int(to["y"]))
        _pen_prepare([(x, y), (tx, ty)], ctx, rec)
        nat.overlay_point(tx, ty, _label(step, e, ctx), dur=float(step.get("duration", 0.25)))
        nat.PEN.drag(x, y, tx, ty, duration=float(step.get("duration", 0.25)))
        return f"pen dragged ({x},{y}) → ({tx},{ty})"
    _pen_prepare([(x, y)], ctx, rec)
    if do == "move":
        nat.PEN.hover(x, y)
        return f"pen hovering at ({x},{y})"
    n = 2 if do == "double_click" else int(step.get("clicks", 1))
    nat.PEN.tap(x, y, barrel=do == "right_click", times=n)
    return f"pen {'right-' if do == 'right_click' else ''}tap ×{n} at ({x},{y})"


def _deliver(step: dict, x, y, e: dict | None, ctx: dict, smode: str, rec: dict) -> tuple[str, str]:
    if step["do"] == "wait":
        return _perform(step, x, y, e, ctx), "none"
    if smode in ("auto", "background") and step["do"] not in ("draw", "drag", "move", "mouse_down", "mouse_up"):
        try:
            return _bg_perform(step, x, y, e, ctx), "background"
        except nat.BackgroundUnavailable as b:
            if smode == "background":
                raise _Stop("BG", str(b)) from None
            rec["escalated"] = str(b)[:220]
    elif smode == "background":
        raise _Stop("BG", f"{step['do']} needs real pointer movement (foreground)")
    if step["do"] in PEN_STEPS and ctx.get("pointer", "pen") == "pen" and step.get("button", "left") == "left" \
            and nat.PEN.available():
        return _pen_perform(step, x, y, e, ctx, rec), "pen"
    _fg_prepare(step, e, x, ctx, rec)
    pos = nat.cursor()
    res = _perform(step, x, y, e, ctx)
    if ctx.get("restore_cursor", True) and x is not None and \
            step["do"] in ("click", "double_click", "right_click", "middle_click", "type", "scroll"):
        nat.set_cursor(pos["x"], pos["y"])  # the user's pointer goes back where they left it
    return res, "foreground"


def _fp_now(ctx: dict | None, area: dict | None, region: dict | None = None):
    """Before-picture for `expect: {changed: true}`: the target window (even when covered), or only `region` of it
    (a drawing's bounding box)."""
    t = (ctx or {}).get("tgt")
    if t:
        fp = nat.window_fingerprint(t["hwnd"], region=region)
        if fp is not None:
            return ("w", fp, region)
    return ("s", nat.fingerprint(region or area), region)


def _draw_region(step: dict, e: dict | None) -> dict | None:
    """Screen box around everything a draw step will touch (+ the pen width), or None."""
    try:
        pts = [p for pl in _draw_points(step, e) for p in pl]
    except (ToolError, KeyError, TypeError, ValueError):
        return None
    if not pts:
        return None
    pad = 6
    x0, y0 = min(p[0] for p in pts) - pad, min(p[1] for p in pts) - pad
    return {"x": int(x0), "y": int(y0), "w": int(max(p[0] for p in pts) + pad - x0) + 1,
            "h": int(max(p[1] for p in pts) + pad - y0) + 1}


def _titles(ctx: dict | None) -> list[str]:
    out = [(nat.foreground() or {}).get("title", "")]
    t = (ctx or {}).get("tgt")
    if t and nat.window_alive(t["hwnd"]):
        info = nat.window_info(t["hwnd"])
        out.append(info["title"])
        proc = (info.get("process") or "").lower()
        out += [w["title"] for w in nat.list_windows(200) if proc and w["process"].lower() == proc]
    return out


def _expect_ok(exp, before, area: dict | None, *, timeout: float, ctx: dict | None = None) -> dict:
    """Poll until the postcondition holds or `timeout` passes. Checks the window being worked on (even when it
    is behind other windows), not whatever happens to be in front."""
    if not exp:
        return {"ok": True, "checked": "none"}
    if isinstance(exp, str):
        exp = {"text": exp}
    deadline = time.time() + timeout
    last: dict = {}
    t = (ctx or {}).get("tgt")
    hwnd = t["hwnd"] if t and nat.window_alive(t["hwnd"]) else None
    while True:
        res = {}
        if exp.get("changed") and before is not None:
            kind, fp0, reg = (tuple(before) + (None,))[:3]
            now = nat.window_fingerprint(hwnd, region=reg) if kind == "w" and hwnd else nat.fingerprint(reg or area)
            frac = 1.0 if now is None else nat.changed(fp0, now)
            res["changed"] = frac >= float(exp.get("threshold", 0.004))
            res["changed_fraction"] = round(frac, 4)
        if exp.get("window_title"):
            res["window_title"] = any(str(exp["window_title"]).lower() in x.lower() for x in _titles(ctx))
        if exp.get("text") or exp.get("gone"):
            blob = "\n".join(_visible_names(exp.get("ocr", False), hwnd)).lower()
            if exp.get("text"):
                res["text"] = str(exp["text"]).lower() in blob
            if exp.get("gone"):
                res["gone"] = str(exp["gone"]).lower() not in blob
        checks = {k: v for k, v in res.items() if isinstance(v, bool)}
        last = res
        if checks and all(checks.values()):
            break
        if time.time() >= deadline:
            break
        time.sleep(0.08)
    checks = {k: v for k, v in last.items() if isinstance(v, bool)}
    ok: bool | None = all(checks.values()) if checks else True
    out = {**last}
    if exp.get("jev"):
        win = nat.window_info(hwnd) if hwnd else nat.foreground()
        ev = {"window": _pub_window(win), "visible_text": _visible_names(exp.get("ocr", False), hwnd)[:120],
              "focused": nat.uia_focused(), "deterministic_checks": last}
        jv = _jev_verify(str(exp["jev"]), ev)
        out["jev"] = jv
        if jv.get("ok") is None:  # Jev unreachable/refused: the claim stays unverified, never assumed true
            ok = None if ok else False
        else:
            ok = ok and jv["ok"]
    out["ok"] = ok
    return out


def _visible_names(with_ocr: bool, hwnd: int | None = None) -> list[str]:
    win = nat.window_info(hwnd) if hwnd else nat.foreground()
    names: list[str] = []
    if win:
        names.append(win.get("title", ""))
        try:
            names += [(e.get("name") or "") + " " + (e.get("value") or "")
                      for e in nat.uia_snapshot(win["hwnd"], limit=400)]
        except nat.NativeError:
            pass
        if with_ocr:
            g = nat.grab_window(win["hwnd"])
            if g:
                names += [b["text"] for b in nat.ocr(nat.to_image(*g[:3]))]
            else:
                w, h, raw = nat.grab(_clip(win["rect"], nat.virtual_screen()))
                names += [b["text"] for b in nat.ocr(nat.to_image(w, h, raw))]
    return [n.strip() for n in names if n and n.strip()]


def _perform(step: dict, x, y, e, ctx: dict | None = None) -> str:
    """Foreground delivery with the real mouse/keyboard (SendInput)."""
    do = step["do"]
    btn = step.get("button", "left")
    if do in ("click", "double_click", "right_click", "middle_click"):
        if x is None:
            raise ToolError(f"{do} needs ref, x/y or target")
        n = {"double_click": 2}.get(do, int(step.get("clicks", 1)))
        b = {"right_click": "right", "middle_click": "middle"}.get(do, btn)
        nat.click(x, y, button=b, clicks=n, interval=float(step.get("interval", 0.0)))
        return f"{b} ×{n} at ({x},{y})"
    if do == "move":
        nat.move(x, y, duration=float(step.get("duration", 0)))
        return f"moved to ({x},{y})"
    if do in ("mouse_down", "mouse_up"):
        if x is not None:
            nat.move(x, y)
        nat.button("down" if do == "mouse_down" else "up", btn)
        return f"{btn} {do.split('_')[1]}"
    if do == "drag":
        to = step.get("to") or {}
        if step.get("to_ref"):
            tx, ty = _centre(_el(step["to_ref"]))
        elif "x" in to and "y" in to:
            tx, ty = int(to["x"]), int(to["y"])
        else:
            raise ToolError("drag needs `to` {x,y} or `to_ref`")
        if x is None:
            c = nat.cursor()
            x, y = c["x"], c["y"]
        nat.drag(x, y, tx, ty, button=btn, duration=float(step.get("duration", 0.25)))
        return f"dragged ({x},{y}) → ({tx},{ty})"
    if do == "scroll":
        amt = int(step.get("amount", -5))
        nat.scroll(amt, horizontal=bool(step.get("horizontal")), x=x, y=y)
        return f"scrolled {amt} notches"
    if do == "type":
        if x is not None:
            nat.click(x, y)
            time.sleep(0.04)
        if step.get("clear"):
            nat.hotkey("ctrl+a")
        nat.type_text(str(step.get("text", "")), interval=float(step.get("interval", 0.0)))
        if step.get("enter"):
            nat.hotkey("enter")
        return f"typed {len(str(step.get('text', '')))} chars"
    if do in ("key", "hotkey"):
        nat.hotkey(step.get("keys") or step.get("text") or "", repeat=int(step.get("repeat", 1)))
        return f"pressed {step.get('keys')}"
    if do == "set_value":
        el = _live_el(e, (ctx or {}).get("tgt"))
        if el is None or not nat.uia_set_value(el, str(step.get("text", ""))):
            raise ToolError("this control has no writable UIA Value pattern; use do='type'")
        return "value set through UI Automation"
    if do == "invoke":
        el = _live_el(e, (ctx or {}).get("tgt"))
        if el is None or not nat.uia_invoke(el):
            raise ToolError("this control has no UIA Invoke pattern; use do='click'")
        return "invoked through UI Automation"
    if do == "wait":
        time.sleep(min(float(step.get("seconds", 0.5)), 30))
        return f"waited {step.get('seconds', 0.5)} s"
    if do == "draw":
        return _draw(step, e, ctx)
    raise ToolError(f"unknown action {do!r}")


# programs the user can name in plain words; anything else goes through the gate as an unknown launch
KNOWN_APPS = {"paint": "mspaint", "mspaint": "mspaint", "الرسام": "mspaint", "notepad": "notepad",
              "المفكرة": "notepad", "calc": "calc", "calculator": "calc", "الحاسبة": "calc", "excel": "excel",
              "اكسل": "excel", "إكسل": "excel", "word": "winword", "وورد": "winword", "chrome": "chrome",
              "كروم": "chrome", "edge": "msedge", "explorer": "explorer", "مستكشف الملفات": "explorer"}


# ── drawing: the whole picture is planned locally, then drawn in one go (no screenshot between strokes) ──
def _svg_paths(d: str, *, per_curve: int = 16) -> list[list[tuple[float, float]]]:
    """SVG path data (M L H V C S Q T Z, absolute or relative; A is drawn as a straight segment) → polylines."""
    import re  # noqa: PLC0415
    toks = re.findall(r"[MmLlHhVvCcSsQqTtZzAa]|-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?", d or "")
    paths: list[list[tuple[float, float]]] = []
    cur: list[tuple[float, float]] = []
    x = y = sx = sy = 0.0
    last_c = last_q = None
    cmd = None
    i = 0

    def nums(k):
        nonlocal i
        vals = [float(t) for t in toks[i:i + k]]
        if len(vals) < k:
            raise ToolError(f"svg path: command {cmd!r} needs {k} numbers")
        i += k
        return vals

    def bez(p0, p1, p2, p3):
        return [((1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t * t * p2[0] + t ** 3 * p3[0],
                 (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t * t * p2[1] + t ** 3 * p3[1])
                for t in (j / per_curve for j in range(1, per_curve + 1))]

    while i < len(toks):
        if re.fullmatch(r"[A-Za-z]", toks[i]):
            cmd = toks[i]
            i += 1
        elif cmd is None:
            raise ToolError("svg path must start with M")
        rel = cmd.islower()
        c = cmd.upper()
        ox, oy = (x, y) if rel else (0.0, 0.0)
        if c == "M":
            nx, ny = nums(2)
            x, y = ox + nx, oy + ny
            if len(cur) > 1:
                paths.append(cur)
            cur = [(x, y)]
            sx, sy = x, y
            cmd = "l" if rel else "L"  # extra pairs after M are line-tos
            last_c = last_q = None
            continue
        if c == "Z":
            if cur:
                cur.append((sx, sy))
                paths.append(cur)
            cur = []
            x, y = sx, sy
            last_c = last_q = None
            continue
        if not cur:
            cur = [(x, y)]
        if c == "L":
            nx, ny = nums(2)
            x, y = ox + nx, oy + ny
            cur.append((x, y))
            last_c = last_q = None
        elif c == "H":
            (nx,) = nums(1)
            x = ox + nx
            cur.append((x, y))
        elif c == "V":
            (ny,) = nums(1)
            y = oy + ny
            cur.append((x, y))
        elif c in "CS":
            if c == "C":
                x1, y1, x2, y2, nx, ny = nums(6)
                p1 = (ox + x1, oy + y1)
            else:
                x2, y2, nx, ny = nums(4)
                p1 = (2 * x - last_c[0], 2 * y - last_c[1]) if last_c else (x, y)
            p2, p3 = (ox + x2, oy + y2), (ox + nx, oy + ny)
            cur += bez((x, y), p1, p2, p3)
            last_c, last_q = p2, None
            x, y = p3
        elif c in "QT":
            if c == "Q":
                qx, qy, nx, ny = nums(4)
                q = (ox + qx, oy + qy)
            else:
                nx, ny = nums(2)
                q = (2 * x - last_q[0], 2 * y - last_q[1]) if last_q else (x, y)
            p3 = (ox + nx, oy + ny)
            p1 = (x + 2 / 3 * (q[0] - x), y + 2 / 3 * (q[1] - y))
            p2 = (p3[0] + 2 / 3 * (q[0] - p3[0]), p3[1] + 2 / 3 * (q[1] - p3[1]))
            cur += bez((x, y), p1, p2, p3)
            last_q, last_c = q, None
            x, y = p3
        elif c == "A":
            *_, nx, ny = nums(7)
            x, y = ox + nx, oy + ny
            cur.append((x, y))
    if len(cur) > 1:
        paths.append(cur)
    return paths


def _overlap(closed: list[tuple[float, float]], frac: float = 0.3) -> list[tuple[float, float]]:
    """A closed outline drawn by pen runs on past its start along the first edge: ink tapers where a stroke
    begins, and a bucket fill leaked through that 1–2 px gap and flooded the whole Paint canvas (measured)."""
    if len(closed) < 3:
        return closed
    (x0, y0), (x1, y1) = closed[0], closed[1]
    return closed + [(x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac)]


def _shape_paths(shapes: list[dict], *, overlap: bool = True) -> list[list[tuple[float, float]]]:
    import math  # noqa: PLC0415
    out = []
    run_on = _overlap if overlap else (lambda ring: ring)
    for s in shapes or []:
        t = str(s.get("type", "")).lower()
        if t in ("circle", "ellipse", "arc"):
            cx, cy = float(s["cx"]), float(s["cy"])
            rx = float(s.get("rx", s.get("r", 10)))
            ry = float(s.get("ry", s.get("r", rx)))
            a0, a1 = (float(s.get("start", 0)), float(s.get("end", 360))) if t == "arc" else (0.0, 360.0)
            n = max(12, int(abs(a1 - a0) / 6))
            ring = [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * k / n)),
                     cy + ry * math.sin(math.radians(a0 + (a1 - a0) * k / n))) for k in range(n + 1)]
            out.append(ring if t == "arc" or not overlap else ring + ring[1:3])  # a full ring runs on past its start
        elif t == "rect":
            x, y, w, h = (float(s[k]) for k in ("x", "y", "w", "h"))
            out.append(run_on([(x, y), (x + w, y), (x + w, y + h), (x, y + h), (x, y)]))
        elif t == "line":
            out.append([(float(s["x1"]), float(s["y1"])), (float(s["x2"]), float(s["y2"]))])
        elif t in ("polyline", "polygon"):
            pts = [(float(p[0]), float(p[1])) for p in s["points"]]
            out.append(run_on(pts + [pts[0]]) if t == "polygon" and pts else pts)
        elif t == "path":
            out += _svg_paths(str(s.get("d", "")))
        else:
            raise ToolError(f"unknown shape type {t!r}: circle | ellipse | arc | rect | line | polyline | polygon | path")
    return out


def _fit_tf(paths, box: dict, *, margin: float = 0.08, viewbox: list | None = None):
    """The drawing → screen transform used by `_fit` (scale + centre, proportions kept)."""
    if viewbox:
        x0, y0, w0, h0 = (float(v) for v in viewbox)
    else:
        xs = [p[0] for pl in paths for p in pl]
        ys = [p[1] for pl in paths for p in pl]
        x0, y0, w0, h0 = min(xs), min(ys), max(max(xs) - min(xs), 1e-6), max(max(ys) - min(ys), 1e-6)
    bw, bh = box["w"] * (1 - 2 * margin), box["h"] * (1 - 2 * margin)
    k = min(bw / w0, bh / h0)
    ox = box["x"] + (box["w"] - w0 * k) / 2
    oy = box["y"] + (box["h"] - h0 * k) / 2
    return lambda px, py: (ox + (px - x0) * k, oy + (py - y0) * k)


def _fit(paths, box: dict, *, margin: float = 0.08, viewbox: list | None = None):
    """Scale + centre drawing coordinates into a screen box, keeping proportions."""
    tf = _fit_tf(paths, box, margin=margin, viewbox=viewbox)
    return [[tf(px, py) for px, py in pl] for pl in paths]


class _FillStroke(list):
    """A stroke that fills an area: drawn at full pen pressure (measured in Paint: at the default half pressure
    the 3-px brush draws ~2 px lines and a 3-px hatch leaves visible stripes)."""


def _hatch(poly: list[tuple[float, float]], gap: float = 3.0) -> list[list[tuple[float, float]]]:
    """Fill a closed outline (screen px) with horizontal pen lines `gap` px apart. A convex shape (bar, circle)
    becomes ONE zig-zag stroke; other shapes get one stroke per inside segment."""
    if len(poly) < 3:
        return []
    import math  # noqa: PLC0415
    pts = list(poly) + ([poly[0]] if poly[0] != poly[-1] else [])
    ys = [p[1] for p in pts]
    # whole-pixel rows exactly `gap` apart: fractional rows (x.5) were rounded half-to-even by the pen into
    # alternating 4/2-px spacing — a 1-px stripe every other row with a 3-px brush (measured in Paint)
    gap = max(1, int(round(float(gap))))
    rows, y = [], math.floor(min(ys)) + max(1, gap // 2)
    while y < max(ys):
        xs = sorted(x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                    for (x1, y1), (x2, y2) in zip(pts, pts[1:]) if (y1 <= y < y2) or (y2 <= y < y1))
        rows.append([(xs[i], xs[i + 1], y) for i in range(0, len(xs) - 1, 2) if xs[i + 1] - xs[i] >= 1])
        y += gap
    rows = [r for r in rows if r]
    if rows and all(len(r) == 1 for r in rows):
        zig = _FillStroke()
        for i, ((a, b, yy),) in enumerate(rows):
            zig += [(a, yy), (b, yy)] if i % 2 == 0 else [(b, yy), (a, yy)]
        return [zig]
    return [_FillStroke([(a, yy), (b, yy)]) for r in rows for a, b, yy in r]


def _draw_points(step: dict, e: dict | None = None) -> list[list[tuple[float, float]]]:
    """`paths` [[[x,y],…],…] (screen px, or relative to `origin`), or `svg` path data / `shapes` fitted into `box`
    {x,y,w,h} or the referenced control (e.g. Paint's canvas) → screen polylines. A shape with `fill: true` is
    also filled with pen lines `fill_gap` px apart (default 2: Paint's 3-px brush draws ~2 px when moving fast)."""
    if step.get("svg") or step.get("shapes"):
        local = [_overlap(pl) if len(pl) > 3 and pl[0] == pl[-1] else pl  # closed (Z) sub-paths run on too
                 for pl in (_svg_paths(str(step["svg"])) if step.get("svg") else [])]
        local += _shape_paths(step.get("shapes") or [])
        box = step.get("box") or (e or {}).get("rect")
        if not box:
            raise ToolError("svg/shapes need `box` {x,y,w,h} or a ref/target of the canvas to draw into")
        tf = _fit_tf(local, box, margin=float(step.get("margin", 0.08)), viewbox=step.get("viewbox"))
        out = [[tf(px, py) for px, py in pl] for pl in local]
        for s in step.get("shapes") or []:
            if s.get("fill") and str(s.get("type", "")).lower() != "line":
                gap = float(s.get("fill_gap", step.get("fill_gap", 2)))
                for pl in _shape_paths([s], overlap=False):
                    out += _hatch([tf(px, py) for px, py in pl], gap)
        return out
    paths = step.get("paths") or ([step["path"]] if step.get("path") else [])
    if not paths:
        raise ToolError("draw needs `paths`, `svg` or `shapes`")
    ox, oy = (step.get("origin") or {}).get("x", 0), (step.get("origin") or {}).get("y", 0)
    return [[(ox + float(p[0]), oy + float(p[1])) for p in path] for path in paths]


def _draw(step: dict, e: dict | None = None, ctx: dict | None = None, *, pen: bool = False,
          pts_all: list | None = None) -> str:
    """Draw the whole picture in one go (planned locally — no screenshot between strokes). With the pen (default
    when available) the user's mouse stays free the whole time; with the mouse it waits for the user between
    strokes."""
    if pts_all is None:
        pts_all = _draw_points(step, e)
    speed = float(step.get("step_delay", 0.003))
    tgt = (ctx or {}).get("tgt")
    if pen:
        n_pts = 0
        for pts in pts_all:
            nat.check_brake()
            if len(pts) < 1:
                continue
            if tgt and not nat.visible_at(tgt["hwnd"], *pts[0]):
                raise _Stop("ASK", f"{tgt.get('title')!r} got covered while drawing — stopped between strokes")
            nat.overlay_point(*pts[0], step.get("label") or "يرسم", dur=0)
            press = int(step.get("fill_pressure", 1024)) if isinstance(pts, _FillStroke) else \
                int(step.get("pressure", 512))
            nat.PEN.stroke(pts, pressure=press, step_delay=speed)
            nat.overlay_point(*pts[-1], dur=0)
            n_pts += len(pts)
        return f"pen drew {len(pts_all)} strokes ({n_pts} points) — the user's mouse was not used"
    n_pts = 0
    for pts in pts_all:
        nat.check_brake()
        if not pts:
            continue
        if (ctx or {}).get("guard", True):
            nat.wait_user_idle(300, float((ctx or {}).get("idle_timeout", 30)))
        if tgt and (nat.foreground() or {}).get("hwnd") != tgt["hwnd"]:
            raise _Stop("ASK", f"{tgt.get('title')!r} lost the foreground while drawing — stopped between strokes")
        nat.move(*pts[0])
        nat.overlay_point(*pts[0], step.get("label") or "يرسم", dur=0)
        nat.button("down")
        try:
            for x, y in pts[1:]:
                nat.move(x, y)
                n_pts += 1
                if speed:
                    time.sleep(speed)
            nat.overlay_point(*pts[-1], dur=0)
        finally:
            nat.button("up")
    return f"drew {len(pts_all)} strokes ({n_pts} points)"


NOTEPAD_NEW_TAB = ("add new tab", "علامة تبويب جديدة", "new tab")
UNTITLED = ("untitled", "بلا عنوان", "بدون عنوان")


def _fresh_document(exe: str, ctx: dict, step: dict) -> dict | None:
    """Windows 11 Notepad reopens the user's previous tabs, and the active one can be THEIR file (measured: it
    opened on settings.json). Typing after `launch notepad` must not land in it, so a blank tab is opened first
    (UI Automation, in the background). `new_document: false` keeps whatever Notepad showed."""
    tgt = ctx.get("tgt") or {}
    if os.path.basename(str(exe)).lower().removesuffix(".exe") != "notepad" or step.get("new_document") is False:
        return None
    title = str(tgt.get("title") or "").lower()
    if not title or title.lstrip("*").startswith(UNTITLED):
        return None
    for _ in range(10):  # the tab strip appears a moment after the window
        btn = next((f for f in nat.uia_snapshot(tgt["hwnd"], limit=200)
                    if f["role"] == "button" and any(k in (f.get("name") or "").lower() for k in NOTEPAD_NEW_TAB)),
                   None)
        if btn is not None:
            break
        time.sleep(0.2)
    else:
        return {"warning": f"Notepad opened on an existing document {tgt.get('title')!r} and no 'new tab' button "
                           "was found — open a blank document before typing"}
    _keep_focus(lambda: nat.uia_press(btn["_el"]), ctx)
    for _ in range(15):
        now = nat.window_info(tgt["hwnd"])["title"]
        if now.lower().lstrip("*").startswith(UNTITLED):
            return {"opened_blank_tab": True, "was_showing": tgt.get("title")}
        time.sleep(0.1)
    return {"warning": f"asked Notepad for a new tab but it still shows {now!r} — check before typing"}


def _quiet_postcondition_notes(results: list[dict], actions: list[dict]) -> None:
    """The gate's 'no postcondition' hint is noise on every step of a batch whose later step carries `expect`."""
    for rec in results:
        notes = (rec.get("gate") or {}).get("notes")
        if notes and any(isinstance(a, dict) and a.get("expect") for a in actions[rec["i"] + 1:]):
            rec["gate"]["notes"] = [n for n in notes if not n.startswith("no postcondition")]


def _ours_in_front(ctx: dict, fg0: dict | None, elapsed: float) -> bool:
    """Should auto mode hand the foreground back to the user's window `fg0`? Yes when this batch put a window of
    the job in front — explicitly (a foreground step), or as a side effect: a pen tap activates what it touches, a
    launched app raises itself, a dialog that closes activates its owner. Not when the user themselves moved on
    during the batch (their own input since it started) unless we took the foreground explicitly."""
    tgt = ctx.get("tgt") or {}
    if not fg0 or not nat.window_alive(fg0["hwnd"]) or fg0["hwnd"] == tgt.get("hwnd"):
        return False
    now = nat.foreground() or {}
    if not now or now.get("hwnd") == fg0["hwnd"]:
        return False
    if ctx.get("took_fg"):
        return True
    if nat.user_idle_ms() < elapsed * 1000:
        return False  # the human used mouse/keyboard meanwhile: the window in front may be their choice
    job = {tgt.get("hwnd"), nat.root_owner(tgt.get("hwnd") or 0)} - {None, 0}
    return now["hwnd"] in job or nat.root_owner(now["hwnd"]) in job or bool(
        ctx.get("launched") and (now.get("process") or "").lower() == (tgt.get("process") or "").lower())


def act(actions: list[dict], *, approved=None, dry_run: bool = False, use_jev: bool = True,
        screenshot_after: bool = False, settle: float = 0.03, stop_on_fail: bool = True, mode: str = "auto",
        window=None, return_focus=None, guard: bool = True, idle_ms: int = 600, idle_timeout: float = 30.0,
        pointer: str = "pen") -> dict:
    """pointer: pen (default — Claude's own synthetic pen device for clicks/drags/drawing the background route
    cannot do; the user's mouse is never moved) | mouse (the real cursor, after the user is idle).
    mode: auto (default — background first, the foreground only for steps that need it, after the user is idle,
    then focus goes back) | background (never take the foreground; such steps stop as background_unavailable) |
    foreground (the old visible behaviour: the window comes to the front)."""
    if not isinstance(actions, list) or not actions:
        raise ToolError("actions must be a non-empty list")
    if len(actions) > 200:
        raise ToolError("at most 200 actions per call")
    mode = str(mode or "auto").lower()
    if mode not in MODES:
        raise ToolError(f"mode must be one of {MODES}")
    approved_ids = {str(a) for a in (approved or [])}
    t0 = time.perf_counter()
    live.ensure()
    seq0 = live.LIVE.cursor()
    fg0 = nat.foreground()
    if not dry_run:
        with _STATE_LOCK:  # kosif_mouse_live's `wait` starts here by default, so a dialog this batch opened counts
            _STATE["act_seq0"], _STATE["act_at"] = seq0, time.time()
    with _STATE_LOCK:
        ctx = {"tgt": _STATE.get("target"), "explicit": bool(_STATE.get("target_explicit")), "took_fg": False,
               "guard": bool(guard), "idle_ms": int(idle_ms), "idle_timeout": float(idle_timeout),
               "restore_cursor": True, "pointer": "mouse" if str(pointer).lower() == "mouse" else "pen"}
    if window not in (None, ""):
        ctx["tgt"], ctx["explicit"] = _resolve_window(window), True
    if ctx["tgt"] and ctx["tgt"].get("hwnd") and nat.window_alive(ctx["tgt"]["hwnd"]):
        ctx["tgt"] = nat.window_info(ctx["tgt"]["hwnd"])  # fresh title/rect
    if not dry_run:
        nat.overlay_start()  # Claude's visible cursor (KOSIF_CURSOR=0 turns it off)
    results, status = [], "done"
    for i, raw in enumerate(actions):
        step = dict(raw)
        step["do"] = str(step.get("do") or step.get("action") or "").lower().replace("-", "_")
        smode = str(step.get("mode") or mode).lower()
        rec: dict = {"i": i, "id": step.get("id") or f"a{i + 1}", "do": step["do"]}
        ts = time.perf_counter()
        try:
            if step["do"] not in MUTATING | READ_ONLY:
                raise ToolError(f"unknown action {step['do']!r}; one of {sorted(MUTATING | READ_ONLY)}")
            if smode not in MODES:
                raise ToolError(f"step mode must be one of {MODES}")
            nat.check_brake()
            if step["do"] == "observe":
                tg = step.get("target") or (ctx["tgt"] or {}).get("hwnd")
                o = observe(**{k: step[k] for k in ("ocr", "region") if k in step}, target=tg, screenshot=False)
                rec.update(result=f"snapshot {o['snapshot_id']}: {o['counts']}", elements=o["elements"][:80])
                results.append(rec)
                continue
            if step["do"] == "wait_for":
                exp = step.get("expect") or {"text": step.get("text")}
                v = _expect_ok(exp, None, None, timeout=float(step.get("timeout", 5)), ctx=ctx)
                rec.update(result="condition met" if v["ok"] else "timed out", verify=v)
                results.append(rec)
                if not v["ok"] and stop_on_fail:
                    status = "failed"
                    break
                continue
            if step["do"] == "focus":
                w = _resolve_window(step.get("window") or step.get("target"))
                if not w:
                    raise ToolError("focus needs `window` (title text, process name or hwnd)")
                g = _gate_step(i, {**step, "describe": w.get("title")}, None, approved_ids, w)
                rec["gate"] = g
                if g["verdict"] != "RUN":
                    raise _Stop(g["verdict"], "; ".join(g.get("notes") or []) or g["verdict"])
                ctx["tgt"], ctx["explicit"] = w, True
                with _STATE_LOCK:
                    _STATE["target"], _STATE["target_explicit"] = w, True
                if dry_run:
                    rec["result"] = "dry-run (not executed)"
                elif smode == "foreground":
                    _fg_prepare(step, None, None, ctx, rec)
                    ok = nat.focus_window(w["hwnd"])
                    ctx["took_fg"] = True
                    rec["result"] = f"focused {w['title']!r}" + ("" if ok else " (Windows refused the foreground)")
                else:
                    rec["result"] = f"working on {w['title']!r} in the background (it was not brought to the front)"
                results.append(rec)
                continue
            if step["do"] == "launch":
                app = str(step.get("app") or step.get("target") or "").strip()
                g = _gate_step(i, step, None, approved_ids)
                rec["gate"] = g
                if g["verdict"] != "RUN":
                    raise _Stop(g["verdict"], "; ".join(g.get("notes") or []) or g["verdict"])
                if dry_run:
                    rec["result"] = "dry-run (not executed)"
                    results.append(rec)
                    continue
                res = nat.launch(KNOWN_APPS.get(app.lower(), app), step.get("args"), match=step.get("match"),
                                 activate=smode == "foreground")
                w = res.get("window")
                if w:
                    ctx["tgt"], ctx["explicit"] = nat.window_info(w["hwnd"]), True
                    ctx["launched"] = True  # it may have raised itself: auto mode hands the foreground back
                    with _STATE_LOCK:
                        _STATE["target"], _STATE["target_explicit"] = ctx["tgt"], True
                    fresh = _fresh_document(KNOWN_APPS.get(app.lower(), app), ctx, step)
                    if fresh:
                        rec["document"] = fresh
                        ctx["tgt"] = nat.window_info(w["hwnd"])
                        w = ctx["tgt"]
                rec["result"] = f"started {app!r}" + (f" → window {w['title']!r}" if w else " (no new window seen yet)")
                if step.get("expect") and w:
                    v = _expect_ok(step["expect"], None, None, timeout=float(step.get("timeout", 5)), ctx=ctx)
                    rec["verify"] = v
                    if v.get("ok") is False:
                        status = "unverified"
                        if stop_on_fail:
                            results.append(rec)
                            break
                results.append(rec)
                continue
            x, y, e, info = _resolve_point(step, use_jev=use_jev, tgt=ctx["tgt"])
            rec.update(info)
            if e:
                rec["element"] = {"ref": step.get("ref"), "role": e["role"], "name": e.get("name")}
            if x is not None:
                rec["point"] = {"x": x, "y": y}
            on = nat.window_at(x, y) if (x is not None and smode == "foreground") else ctx["tgt"]
            if on and on.get("elevated") and not nat.self_elevated():
                raise _Stop("HANDOFF", f"{on.get('title')!r} runs elevated (admin): UIPI blocks synthesized "
                                       "input — the user must act there", {})
            _host_guard(step, ctx, x, y, e, smode)
            g = _gate_step(i, step, e, approved_ids, ctx["tgt"])
            rec["gate"] = g
            if g["verdict"] != "RUN":
                raise _Stop(g["verdict"], "; ".join(g.get("notes") or []) or g["verdict"])
            if dry_run:
                rec["result"] = "dry-run (not executed)"
                results.append(rec)
                continue
            exp = step.get("expect")
            area = (_snap(False) or {}).get("area")
            before = None
            if exp and isinstance(exp, dict) and exp.get("changed"):
                before = _fp_now(ctx, area, _draw_region(step, e) if step["do"] == "draw" else None)
            if x is not None:
                nat.overlay_point(x, y, _label(step, e, ctx))
            rec["result"], rec["route"] = _deliver(step, x, y, e, ctx, smode, rec)
            if x is not None and step["do"] in ("click", "double_click", "right_click", "middle_click", "invoke"):
                nat.overlay_point(x, y, cmd="click", dur=0)
            if settle:
                time.sleep(settle)
            if exp:
                v = _expect_ok(exp, before, area, timeout=float(step.get("timeout", 3)), ctx=ctx)
                rec["verify"] = v
                if v.get("ok") is False:
                    status = "unverified"
                    if stop_on_fail:
                        results.append(rec)
                        rec["ms"] = round((time.perf_counter() - ts) * 1000)
                        break
            with _STATE_LOCK:
                _STATE["history"] = (_STATE["history"] + [{"do": step["do"], "ref": step.get("ref"),
                                                            "point": rec.get("point"), "at": time.time()}])[-MAX_HISTORY:]
        except _Stop as s:
            rec.update(stopped=s.verdict, reason=s.reason, **s.info)
            results.append(rec)
            status = {"CONFIRM": "needs_approval", "HANDOFF": "handoff", "BLOCK": "blocked", "ASK": "ask_user",
                      "BG": "background_unavailable"}[s.verdict]
            break
        except nat.UserBusy as ub:
            rec.update(stopped="USER_BUSY", reason=str(ub))
            results.append(rec)
            status = "paused_user_busy"
            break
        except (nat.Aborted,) as ab:
            rec.update(stopped="ABORTED", reason=str(ab))
            results.append(rec)
            status = "aborted"
            break
        except nat.AppBusy as busy:  # never keep hammering an app that stopped answering (it hung Paint once)
            rec.update(stopped="APP_BUSY", reason=str(busy))
            results.append(rec)
            status = "app_busy"
            break
        except (ToolError, nat.NativeError) as err:
            rec.update(error=str(err))
            results.append(rec)
            status = "failed"
            if stop_on_fail:
                break
            continue
        except Exception as err:  # noqa: BLE001 - e.g. a raw COMError: report the step, never crash the batch
            rec.update(error=f"{type(err).__name__}: {str(err)[:300]}")
            results.append(rec)
            status = "failed"
            break
        rec["ms"] = round((time.perf_counter() - ts) * 1000)
        results.append(rec)
    out = {"status": status, "mode": mode,
           "target": _pub_window(ctx["tgt"]) if ctx["tgt"] else None,
           "executed": sum(1 for r in results if "result" in r and "dry-run" not in str(r["result"])),
           "of": len(actions), "steps": results}
    _quiet_postcondition_notes(results, actions)
    give_back = return_focus if return_focus is not None else mode == "auto"
    if give_back and not dry_run and _ours_in_front(ctx, fg0, time.perf_counter() - t0):
        try:
            nat.wait_user_idle(400, 5)
            if nat.focus_window(fg0["hwnd"]):
                out["focus_returned_to"] = fg0.get("title")
        except nat.NativeError:
            pass  # the user is already working somewhere: leave the foreground to them
    if status == "needs_approval":
        out["next"] = ("ask the user to approve exactly this step (show what it will do), then call again with its "
                       "id in `approved` — starting from that step")
    elif status == "handoff":
        out["next"] = "stop: tell the user exactly what to do by hand, then observe again"
    elif status == "background_unavailable":
        out["next"] = ("this step needs the foreground: resend from it with mode:'auto' (waits until the user is "
                       "idle, then gives focus back) or use an app API such as kosif_excel")
    elif status == "paused_user_busy":
        out["next"] = "the user is using the mouse/keyboard; resend from this step later or use mode:'background'"
    elif status == "app_busy":
        out["next"] = ("the app stopped answering UI Automation (a modal dialog?). Look with kosif_mouse_observe "
                       "elements:false (screenshot only), then continue with pen taps / keys (mode:'foreground') — "
                       "no element-tree calls until it answers again")
    if live.LIVE.ok and not dry_run:
        time.sleep(0.05)  # let the last events arrive
        out["changes"] = live.LIVE.summary(seq0)
    out.update(total_ms=round((time.perf_counter() - t0) * 1000), cursor=nat.cursor(),
               foreground=_pub_window(nat.foreground()))
    if screenshot_after:
        o = observe(target=(ctx["tgt"] or {}).get("hwnd"), screenshot=True, annotate=True, elements=True)
        out["after"] = {k: o[k] for k in ("snapshot_id", "elements", "counts", "image", "capture")}
        out["_images"] = o.get("_images")
    return out


def do(instruction: str, *, approved: bool = False, use_jev: bool = True, expect=None, dry_run: bool = False,
       target=None, screenshot_after: bool = False, mode: str = "auto") -> dict:
    """One natural-language step: ground → gate → act → verify (screen changed by default)."""
    t0 = time.perf_counter()
    f = find(instruction, use_jev=use_jev, target=target)
    if f.get("decided_by") in ("none", "ask-user") or not f.get("chosen"):
        return {"status": "ask_user", "find": f, "next": f.get("next")}
    ref = f["chosen"]["id"]
    step = {"id": "do1", "do": "type" if f["action"] == "type" else "click", "ref": ref, "describe": instruction,
            "expect": expect or {"changed": True}, "timeout": 2.5}
    if f["action"] == "type":
        if not f.get("text"):
            return {"status": "ask_user", "find": f, "next": "which text should be typed? put it in quotes"}
        step["text"] = f["text"]
    res = act([step], approved=["do1"] if approved else [], dry_run=dry_run, use_jev=use_jev,
              screenshot_after=screenshot_after, mode=mode, window=target)
    res["find"] = {k: f.get(k) for k in ("chosen", "decided_by", "ambiguous", "candidates", "jev", "ms")}
    res["total_ms"] = round((time.perf_counter() - t0) * 1000)
    return res


def live_view(*, since: int | None = None, wait: dict | None = None, timeout: float = 10.0) -> dict:
    """What changed on the desktop since `since` (a cursor from a previous result), without a screenshot.
    `wait` blocks until a matching event arrives: {event: window_opened|dialog_opened|foreground|focus|change,
    title: 'part of a title', window: 'title or hwnd'}."""
    if not live.ensure():
        raise ToolError(f"Live View is not running: {live.LIVE.error or 'unavailable'}")
    with _STATE_LOCK:
        act_seq0, act_at = _STATE.get("act_seq0"), _STATE.get("act_at", 0)
    if since is not None:
        start = since
    elif wait:
        # waiting right after a batch: start where that batch started, so a dialog it opened a moment before this
        # call is found instead of waited for in vain (measured: Save-as opened during the Ctrl+S batch)
        start = act_seq0 if act_seq0 is not None and time.time() - act_at < 60 else live.LIVE.cursor()
    else:
        start = max(0, live.LIVE.cursor() - 300)
    out: dict = {"live": live.status()}
    if wait:
        want = str(wait.get("event") or "change").lower()
        title = str(wait.get("title") or "").lower()
        win = wait.get("window")
        root = None
        if win not in (None, ""):
            root = _resolve_window(win)["hwnd"]
        names = {"window_opened": ("created", "shown"), "dialog_opened": ("dialog_open", "created", "shown"),
                 "foreground": ("foreground",), "focus": ("focus",), "change": tuple(live.CONTENT),
                 "window_closed": ("destroyed", "hidden")}.get(want)
        if names is None:
            raise ToolError("wait.event: window_opened | dialog_opened | window_closed | foreground | focus | change")

        def pred(ev, info):
            _s, _t, name, r, _h, top, _o, _c = ev
            if name not in names or (root and r != root):
                return False
            if want in ("window_opened", "dialog_opened", "window_closed") and name != "dialog_open" and not top:
                return False
            if want in ("window_opened", "dialog_opened") and not live.reportable(info):
                return False  # message-only / internal helper windows never satisfy a wait
            if want == "dialog_opened" and name != "dialog_open" and (info or ("", ""))[1] != "#32770":
                return False  # an ordinary window appearing is not a dialog
            now_title = live.LIVE.title_now(r) or (info or ("",))[0] or ""
            return not title or title in now_title.lower()
        t = time.perf_counter()
        hit = live.LIVE.wait(pred, min(float(timeout), 60), since=start)
        out["waited_ms"] = round((time.perf_counter() - t) * 1000)
        out["matched"] = bool(hit)
    out["changes"] = live.LIVE.summary(start)
    out["foreground"] = _pub_window(nat.foreground())
    out["cursor"] = live.LIVE.cursor()
    return out


def status(check_jev: bool = False) -> dict:
    caps = nat.capabilities()
    from . import live as _live  # noqa: PLC0415
    _live.ensure()
    out = {"engine": "KOSIF Mouse 2 (background-first: UI Automation + PostMessage; SendInput only when needed, after the user is idle; PrintWindow capture; Live View events; Excel API)",
           "live_view": _live.status(), "capabilities": caps,
           "foreground": _pub_window(nat.foreground()) if nat.IS_WINDOWS else None,
           "cursor": nat.cursor() if nat.IS_WINDOWS else None,
           "emergency_stop": "move the mouse into the top-left corner of the screen, or hold Esc",
           "never": ["CAPTCHA/MFA/UAC/login bypass", "typing passwords the user did not give for this login",
                     "elevated windows (UIPI) — handed to the user", "anti-detection / human-like mouse curves"]}
    if check_jev:
        from . import jev  # noqa: PLC0415
        try:
            r = jev.call({"type": "noul", "state": {"fact": "2 + 2 = 4"}, "instructions": "Is the stated fact correct?"},
                         timeout=10, use_cache=False)
            out["jev"] = {"reachable": True, "model": r.get("model"), "latency_ms": r.get("latency_ms")}
        except ToolError as e:
            out["jev"] = {"reachable": False, "error": str(e)[:200],
                          "effect": "ambiguous targets are returned to you/the user instead of being guessed"}
    return out


# ── MCP tools ────────────────────────────────────────────────────────────────
_STEP = O("One action. do: click | double_click | right_click | middle_click | move | drag | scroll | type | key | "
          "hotkey | set_value | invoke | focus (= work on this window; brought to the front only in foreground "
          "mode) | launch (app: 'paint'|'notepad'|'excel'|'chrome'|… or a path; Notepad gets a blank tab unless "
          "new_document:false) | draw (paths: [[[x,y],…],…] "
          "screen px + optional origin, OR svg: 'M… C… Z' path data / shapes: [{type: circle|ellipse|arc|rect|"
          "line|polyline|polygon|path,…, fill: true (+ fill_gap px)}] fitted into box {x,y,w,h} + viewbox "
          "[x,y,w,h] or the ref/target canvas) | mouse_down | "
          "mouse_up | wait | wait_for | observe. Target with ref ('e3' from observe), x/y (screen px; "
          "space='image' + scale for screenshot px) or target (an Arabic/English description, grounded with Jev "
          "on the window being worked on). Extras: text, keys ('ctrl+s'), amount (scroll notches, + up), "
          "to {x,y} | to_ref (drag), clear/enter (type), window (focus), seconds (wait), mode (per-step override), "
          "expect {text|gone|window_title|changed:true|jev:'claim'} + timeout, id, user_provided_for_this_login.")


@tool("kosif_mouse_status",
      "KOSIF Mouse: which desktop-control backends work here (background UI Automation/PostMessage delivery, "
      "SendInput, window capture, OCR, Excel API, Live View event stream), screen and monitors, DPI mode, the "
      "foreground window, cursor, the emergency stop, and optionally Jev reachability.",
      obj({"jev": B("Also ping the live Jev service (default false).")}), title="Mouse status")
def _t_status(a: dict) -> dict:
    return _guard(status, bool(a.get("jev")))


@tool("kosif_mouse_observe",
      "KOSIF Mouse — look at one window fast: its UI Automation controls as short refs (e1…), OCR text boxes "
      "(t1…) when UIA is blind, and a screenshot with the refs drawn on it. The window is captured on its own even "
      "when other windows cover it (nothing is brought to the front). If Live View saw no event for that window "
      "and its pixels are identical, the previous tree is reused instantly (same refs). Excel windows also return "
      "the sheet's real cell values. Read-only.",
      obj({"target": S("'foreground' (default) | 'screen' | window title text | process name | hwnd"),
           "elements": B("Read UI Automation controls (default true)."),
           "ocr": {"description": "true | false | 'auto' (default: only when UIA finds < 4 controls)"},
           "ocr_lang": S("en (default) | ar (Arabic model; downloaded by RapidOCR on first use)", enum=["en", "ar"]),
           "screenshot": B("Return an image (default true; pass false when the refs are enough — faster)."),
           "annotate": B("Draw refs on it (default true)."),
           "max_side": I("Longest image side in px (default 1280).", minimum=320, maximum=3840),
           "format": S("jpeg (default, small) | png", enum=["jpeg", "png"]),
           "region": O("{x,y,w,h} screen pixels to capture at full resolution (zoom)."),
           "windows": B("Also list visible top-level windows."),
           "limit": I("Max controls (default 250).", minimum=10, maximum=1500),
           "actionable_only": B("Only buttons/links/fields/items."),
           "capture": S("auto (default: the window itself when covered) | window | screen",
                        enum=["auto", "window", "screen"]),
           "reuse": B("Reuse the last tree when nothing changed (default true)."),
           "cells": B("Include grid cells as elements (default: off for Excel, on elsewhere).")}),
      title="Mouse observe")
def _t_observe(a: dict) -> dict:
    return _guard(observe, target=a.get("target"), elements=a.get("elements", True), ocr=a.get("ocr", "auto"),
                  ocr_lang=a.get("ocr_lang", "en"), screenshot=a.get("screenshot", True),
                  annotate=a.get("annotate", True), max_side=int(a.get("max_side", 1280)),
                  fmt=a.get("format", "jpeg"), region=a.get("region"), windows=bool(a.get("windows")),
                  limit=int(a.get("limit", 250)), actionable_only=bool(a.get("actionable_only")),
                  capture=a.get("capture", "auto"), reuse=a.get("reuse", True), cells=a.get("cells"))


@tool("kosif_mouse_find",
      "KOSIF Mouse — ground an Arabic/English instruction ('زر الحفظ', 'the search box') to exactly one control "
      "of a window on a fresh snapshot. Close calls go to the live Jev service (closed candidate set, asked twice); "
      "unclear or unstable answers come back as 'ask the user', never as a guess. Read-only.",
      obj({"instruction": S("What to find, in the user's words."), "target": S("Window (default foreground)."),
           "jev": B("Let Jev break ties (default true)."), "refresh": B("Observe first (default true).")},
          ["instruction"]), title="Mouse find")
def _t_find(a: dict) -> dict:
    return _guard(find, str(a["instruction"]), use_jev=a.get("jev", True), refresh=a.get("refresh", True),
                  target=a.get("target"))


@tool("kosif_mouse_act",
      "KOSIF Mouse — run a batch of steps in ONE call on one window. mode 'auto' (default): every step that can is "
      "delivered in the BACKGROUND (UI Automation patterns, then messages posted to the control) — no focus "
      "change, the user's real mouse never moves, they keep working; steps that need real input (drag, draw, "
      "Ctrl/Alt shortcuts, apps that ignore posted input such as Chrome/WinUI) wait until the user is idle, use "
      "the foreground, put the user's cursor back and return focus. 'background' never takes the foreground "
      "(such steps stop as background_unavailable); 'foreground' is the old visible mode. The result lists what "
      "changed (Live View: windows/dialogs opened, focus, content changes) so no screenshot is needed to know. "
      "Every step is gated: CONFIRM steps run only when their id is in `approved`; passwords, elevated windows, "
      "CAPTCHA/MFA/payment go to the user. Emergency stop: mouse to the top-left corner or hold Esc.",
      obj({"actions": A(_STEP, "Ordered steps."),
           "window": S("The window to work on (title text, process name or hwnd). Default: the last observed "
                       "window. Required to act on the Claude app itself."),
           "mode": S("auto (default) | background | foreground", enum=list(MODES)),
           "approved": A(S(), "Step ids the user explicitly approved (send/delete/install/settings...)."),
           "dry_run": B("Resolve + gate only; do not move or type."),
           "jev": B("Allow Jev for target grounding / jev expectations (default true)."),
           "screenshot_after": B("Observe the window after the batch and return the annotated screenshot."),
           "settle": N("Seconds to pause after each action (default 0.03).", minimum=0, maximum=5),
           "stop_on_fail": B("Stop at the first failed/unverified step (default true)."),
           "return_focus": B("After foreground steps give focus back to the window the user had (default: true "
                             "in auto mode)."),
           "guard": B("Wait for the user to be idle before foreground steps (default true)."),
           "idle_ms": I("How long the user must be idle first (default 600 ms).", minimum=100, maximum=10000),
           "pointer": S("pen (default: Claude's own synthetic pen pointer for taps/drags/drawing — the user's "
                        "mouse is never moved) | mouse (the real cursor, after the user is idle)",
                        enum=["pen", "mouse"])},
          ["actions"]),
      title="Mouse act", read_only=False, destructive=True, idempotent=False)
def _t_act(a: dict) -> dict:
    return _guard(act, a["actions"], approved=a.get("approved"), dry_run=bool(a.get("dry_run")),
                  use_jev=a.get("jev", True), screenshot_after=bool(a.get("screenshot_after")),
                  settle=float(a.get("settle", 0.03)), stop_on_fail=a.get("stop_on_fail", True),
                  mode=a.get("mode", "auto"), window=a.get("window"), return_focus=a.get("return_focus"),
                  guard=a.get("guard", True), idle_ms=int(a.get("idle_ms", 600)),
                  pointer=a.get("pointer", "pen"))


@tool("kosif_mouse_do",
      "KOSIF Mouse — one instruction end to end, Arabic or English ('اضغط زر حفظ', 'type \"hello\" in the search "
      "box'): fresh snapshot of the window → ground (Jev on ties) → gate → click/type (background first) → verify. "
      "Returns 'ask_user' instead of guessing, 'needs_approval' for send/delete/install-type effects (call again "
      "with approved=true only after the user agreed).",
      obj({"instruction": S("The step, in the user's words."),
           "approved": B("The user explicitly approved this exact effect."),
           "expect": O("Postcondition {text|gone|window_title|changed|jev}; default {changed:true}."),
           "target": S("Window (default foreground)."), "jev": B("Use Jev (default true)."),
           "mode": S("auto (default) | background | foreground", enum=list(MODES)),
           "dry_run": B("Ground and gate only."), "screenshot_after": B("Return an annotated screenshot after.")},
          ["instruction"]), title="Mouse do", read_only=False, destructive=True, idempotent=False)
def _t_do(a: dict) -> dict:
    return _guard(do, str(a["instruction"]), approved=bool(a.get("approved")), use_jev=a.get("jev", True),
                  expect=a.get("expect"), dry_run=bool(a.get("dry_run")), target=a.get("target"),
                  screenshot_after=bool(a.get("screenshot_after")), mode=a.get("mode", "auto"))


@tool("kosif_mouse_live",
      "KOSIF Live View — what is happening on the desktop right now, without a screenshot: the OS accessibility "
      "event stream (windows/dialogs/menus opened or closed, foreground and keyboard-focus changes, which windows' "
      "content changed) since a cursor, plus the current foreground and focused control. `wait` blocks until "
      "e.g. a dialog titled 'حفظ' opens, and returns the moment it does. Read-only.",
      obj({"since": I("Cursor from a previous result (`cursor`/`live_seq`/`changes.now`); default: recent events.",
                      minimum=0),
           "wait": O("{event: window_opened|dialog_opened|window_closed|foreground|focus|change, title: 'part of a "
                     "title', window: 'title or hwnd'} — block until it happens."),
           "timeout": N("Seconds to wait (default 10, max 60).", minimum=0, maximum=60)}),
      title="Mouse live view")
def _t_live(a: dict) -> dict:
    return _guard(live_view, since=a.get("since"), wait=a.get("wait"), timeout=float(a.get("timeout", 10)))


# ── CLI: python -m kosif_mcp.desktop … ─────────────────────────────────────
def _cli(argv=None) -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(prog="kosif-mouse", description="KOSIF Mouse — fast gated desktop control")
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("status"); s.add_argument("--jev", action="store_true")
    s = sub.add_parser("observe"); s.add_argument("--target"); s.add_argument("--ocr", action="store_true")
    s.add_argument("--save", help="write the annotated screenshot to this file")
    s = sub.add_parser("find"); s.add_argument("instruction"); s.add_argument("--no-jev", action="store_true")
    s = sub.add_parser("do"); s.add_argument("instruction"); s.add_argument("--approved", action="store_true")
    s.add_argument("--dry-run", action="store_true"); s.add_argument("--no-jev", action="store_true")
    s = sub.add_parser("act"); s.add_argument("json", help="JSON list of actions, or @file.json")
    s.add_argument("--approved", nargs="*", default=[]); s.add_argument("--dry-run", action="store_true")
    a = p.parse_args(argv)
    try:
        if a.cmd == "status":
            res = status(a.jev)
        elif a.cmd == "observe":
            res = observe(target=a.target, ocr=True if a.ocr else "auto", screenshot=bool(a.save))
            if a.save:
                with open(a.save, "wb") as fh:
                    fh.write(base64.b64decode(res["_images"][0]["data"]))
        elif a.cmd == "find":
            res = find(a.instruction, use_jev=not a.no_jev)
        elif a.cmd == "do":
            res = do(a.instruction, approved=a.approved, dry_run=a.dry_run, use_jev=not a.no_jev)
        else:
            src = a.json[1:] if a.json.startswith("@") else None
            acts = json.loads(open(src, encoding="utf-8").read() if src else a.json)
            res = act(acts, approved=a.approved, dry_run=a.dry_run)
    except (ToolError, nat.NativeError) as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False))
        return 1
    res.pop("_images", None)
    print(json.dumps(res, ensure_ascii=False, indent=1, default=str))
    return 0


__all__ = ["act", "do", "find", "live_view", "observe", "status"]

if __name__ == "__main__":
    raise SystemExit(_cli())
