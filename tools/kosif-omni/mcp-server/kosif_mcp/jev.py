"""Live Jev client: real closed-set judgements (choice / noul / score) from the kosif-jev service.

Every packet goes through the kosif-jev skill's own `build` checks first: no authorisation questions, no empty
evidence, closed option sets, secrets and personal data redacted. Consequential calls are asked twice in parallel
(options reordered, or the question re-asked), and only a stable answer is reported as stable. Results are cached
by packet digest so a repeated question costs nothing. Set KOSIF_JEV_URL=off to disable network calls.
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import os
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

from . import __version__
from .paths import skills_dir, state_dir
from .registry import B, O, S, ToolError, obj, tool

DEFAULT_URL = "https://kosif-jev.kosif199022.workers.dev/api/public-jev"
CACHE_TTL = 7 * 24 * 3600
_LOCK = threading.Lock()


def jev_url() -> str | None:
    url = os.environ.get("KOSIF_JEV_URL", DEFAULT_URL).strip()
    return None if url.lower() in ("", "off", "0", "false", "none") else url


@lru_cache(maxsize=1)
def packets():
    """The kosif-jev skill's packet module (build / interpret / stability / redact), loaded once."""
    path = skills_dir() / "kosif-jev" / "scripts" / "jev_packet.py"
    spec = importlib.util.spec_from_file_location("kosif_jev_packet", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _cache_path():
    return state_dir() / "jev_cache.json"


def _cache_get(key: str):
    try:
        with _LOCK:
            data = json.loads(_cache_path().read_text(encoding="utf-8"))
        hit = data.get(key)
        return hit if hit and time.time() - hit.get("at", 0) < CACHE_TTL else None
    except (OSError, ValueError):
        return None


def _cache_put(key: str, value: dict) -> None:
    with _LOCK:
        try:
            data = json.loads(_cache_path().read_text(encoding="utf-8"))
        except (OSError, ValueError):
            data = {}
        now = time.time()
        data = {k: v for k, v in data.items() if now - v.get("at", 0) < CACHE_TTL}
        if len(data) > 2000:  # keep the newest entries only
            data = dict(sorted(data.items(), key=lambda kv: kv[1].get("at", 0))[-1500:])
        data[key] = {**value, "at": now}
        tmp = _cache_path().with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        os.replace(tmp, _cache_path())


def call(packet: dict, *, timeout: float = 25, use_cache: bool = True) -> dict:
    """One observed Jev call. `packet` = {type, state, instructions, criteria | true_criteria/false_criteria}."""
    url = jev_url()
    if not url:
        raise ToolError("Jev is disabled (KOSIF_JEV_URL=off)")
    body = json.dumps(packet, ensure_ascii=False, sort_keys=True)
    key = hashlib.sha256((url + "\n" + body).encode("utf-8")).hexdigest()
    if use_cache and (hit := _cache_get(key)):
        return {**hit["receipt"], "cached": True}
    req = urllib.request.Request(url, data=body.encode("utf-8"), method="POST", headers={
        "content-type": "application/json", "user-agent": f"kosif-omni/{__version__}"})
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read(1_000_000).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        raise ToolError(f"Jev HTTP {e.code}: {e.read(300).decode('utf-8', 'replace')}") from None
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise ToolError(f"Jev unreachable: {e}") from None
    try:
        data = json.loads(raw)
    except ValueError:
        raise ToolError("Jev returned invalid JSON") from None
    if not data.get("ok") or not isinstance(data.get("result"), dict):
        raise ToolError(f"Jev error: {str(data.get('error') or data)[:300]}")
    receipt = {"observed": True, "service": url, "model": data["result"].get("model"),
               "decision": (data["result"].get("answers") or {}).get("decision"),
               "usage": data["result"].get("usage"), "latency_ms": int((time.time() - t0) * 1000),
               "packet_digest": key[:16], "cached": False}
    if use_cache:
        _cache_put(key, {"receipt": receipt})
    return receipt


def _variant(packet: dict) -> dict:
    """The stability re-ask: options in reverse order for choice; the question re-asked independently otherwise."""
    p = json.loads(json.dumps(packet))
    if p["type"] == "choice":
        p["criteria"] = dict(reversed(list(p["criteria"].items())))
    else:
        p["instructions"] = "Judge independently, from the state only. " + p["instructions"]
    return p


def decide(mode: str, question: str, evidence, options=None, *, true_criteria=None, false_criteria=None,
           stability: bool = True, use_cache: bool = True) -> dict:
    jp = packets()
    spec = {"mode": mode, "question": question, "evidence": evidence, "options": options, "allow_none": False}
    if true_criteria:
        spec["true_criteria"] = true_criteria
    if false_criteria:
        spec["false_criteria"] = false_criteria
    built = jp.build(spec)
    if built["verdict"] == "BLOCK":
        return {"verdict": "BLOCK", "issues": built["issues"], "jev_called": False}
    cnt = [0]
    packet = {"type": mode, **jp.redact(built["packet"], cnt)}
    packets_ = [packet, _variant(packet)] if stability else [packet]
    with ThreadPoolExecutor(max_workers=len(packets_)) as ex:
        receipts = list(ex.map(lambda p: call(p, use_cache=use_cache), packets_))
    reads = [jp.interpret({"response": {"model": r["model"], "answers": {"decision": r["decision"]}}}) for r in receipts]
    out = {"verdict": built["verdict"], "issues": built["issues"], "jev_called": True, "mode": mode,
           "decision": reads[0], "receipts": receipts}
    if stability:
        st = jp.stability({"responses": [{"model": r["model"], "answers": {"decision": r["decision"]}} for r in receipts]})
        out["stable"] = st["stable"]
        out["stability_next"] = st["next"]
        if mode == "choice":  # mean probabilities over both orderings: the order-robust ranking
            probs: dict[str, float] = {}
            for r in reads:
                for k, v in r["ranking"]:
                    probs[k] = probs.get(k, 0.0) + v / len(reads)
            out["mean_ranking"] = sorted(((k, round(v, 4)) for k, v in probs.items()), key=lambda kv: -kv[1])
    out["note"] = ("Jev returns a judgement, not evidence and not authorisation. Each receipt is one observed "
                   "kosif-jev call (cached=true means an identical packet was answered earlier).")
    return out


@tool("kosif_jev_decide",
      "Ask the live Jev service for a closed-set judgement and get observed receipts: mode='choice' picks one option "
      "from {label: description}, 'noul' gives a yes/no probability, 'score' places the state on an ordered rubric "
      "(options = levels, lowest first). The packet is checked first (refuses authorisation questions, needs "
      "evidence, redacts secrets). With stability=true (default) it asks twice in parallel (options reordered) and "
      "reports whether the answers agree. Use for routing, ranking and quality gates; never as approval.",
      obj({"mode": S("choice | noul | score", enum=["choice", "noul", "score"]),
           "question": S("The complete closed question, ending with '?'."),
           "evidence": O("Facts Jev should judge (becomes the state)."),
           "options": {"description": "choice: {label: description}; score: ordered list of levels (lowest first)."},
           "true_criteria": S("(noul) what makes the answer yes"), "false_criteria": S("(noul) what makes it no"),
           "stability": B("Ask twice with reordered options and compare (default true)."),
           "use_cache": B("Reuse an identical earlier answer (default true).")},
          ["mode", "question", "evidence"]),
      title="Jev decision (live)", open_world=True)
def _t_decide(a: dict) -> dict:
    return decide(str(a.get("mode")), str(a.get("question", "")), a.get("evidence"), a.get("options"),
                  true_criteria=a.get("true_criteria"), false_criteria=a.get("false_criteria"),
                  stability=bool(a.get("stability", True)), use_cache=bool(a.get("use_cache", True)))


@tool("kosif_jev_status", "Check the live Jev service: endpoint, reachability, model id and latency (one tiny call).",
      obj({}), title="Jev status", open_world=True)
def _t_status(a: dict) -> dict:
    url = jev_url()
    if not url:
        return {"enabled": False, "note": "KOSIF_JEV_URL=off"}
    try:
        r = call({"type": "noul", "state": {"fact": "2 + 2 = 4"}, "instructions": "Is the stated fact correct?"},
                 timeout=15, use_cache=False)
        return {"enabled": True, "reachable": True, "service": url, "model": r["model"], "latency_ms": r["latency_ms"]}
    except ToolError as e:
        return {"enabled": True, "reachable": False, "service": url, "error": str(e)}


__all__ = ["call", "decide", "jev_url", "packets"]
