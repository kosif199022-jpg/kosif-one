#!/usr/bin/env python3
"""KOSIF Expert -> Jev Deliberation helper v4.4.

This helper does not call Jev. It prepares closed-set Jev packets from structured
expert Idea Cards, preserves provenance through deduplication, advances tournament
results, and verifies a compact deliberation receipt.

Commands:
  prepare        stdin: task + contributions -> unique pool + round-1 Jev packets
  advance        stdin: prepared + results -> top-k survivors + two axis-final stability packets
  verify-finals  stdin: advanced + results -> stable per-axis winners / instability report
  verify-receipt stdin: receipt -> structural/execution-readiness checks

Expert cards are conclusion artifacts, not hidden chain-of-thought.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from collections import defaultdict

MAX_BATCH = 10
DEFAULT_TOP_K = 3
ALLOWED_STATES = {"contributed", "reviewed-no-change", "unavailable"}


def _norm(s: object) -> str:
    s = re.sub(r"\s+", " ", str(s or "").strip().lower())
    s = re.sub(r"[^\w\s\-:/]+", "", s, flags=re.UNICODE)
    return s


def _short_id(prefix: str, *parts: object) -> str:
    raw = "|".join(str(p or "") for p in parts).encode("utf-8")
    return f"{prefix}-{hashlib.sha256(raw).hexdigest()[:10]}"


def _extract_decision(raw):
    if isinstance(raw, str):
        raw = json.loads(raw)
    if not isinstance(raw, dict):
        raise ValueError("Jev result must be an object or JSON string")
    sc = raw.get("structuredContent")
    if isinstance(sc, dict):
        raw = sc
    ans = raw.get("answers") if isinstance(raw, dict) else None
    dec = (ans or {}).get("decision") if isinstance(ans, dict) else None
    if not dec:
        dec = raw.get("decision") if isinstance(raw, dict) else None
    if not dec and isinstance(raw, dict) and raw.get("type"):
        dec = raw
    if not isinstance(dec, dict):
        raise ValueError("missing Jev decision")
    return raw.get("model"), dec


def _parse_choice(raw):
    model, d = _extract_decision(raw)
    if d.get("type") != "choice":
        raise ValueError(f"expected Jev choice, got {d.get('type')!r}")
    probs = {str(k): float(v) for k, v in (d.get("probabilities") or {}).items()}
    choice = str(d.get("choice")) if d.get("choice") is not None else None
    conf = float(d.get("confidence", probs.get(choice, 0.0) if choice else 0.0) or 0.0)
    return {"model": model, "choice": choice, "confidence": conf, "probabilities": probs}


def _canonical_card(card, expert_id, seq):
    if not isinstance(card, dict):
        raise ValueError(f"{expert_id}: card {seq} must be an object")
    axis = str(card.get("axis") or "general").strip() or "general"
    title = str(card.get("title") or "").strip()
    proposal = str(card.get("proposal") or "").strip()
    if not proposal:
        raise ValueError(f"{expert_id}: card {seq} missing proposal")
    title = title or proposal[:72]
    cid = str(card.get("id") or _short_id("idea", axis, title, proposal))
    return {
        "id": cid,
        "axis": axis,
        "title": title,
        "proposal": proposal,
        "why": str(card.get("why") or "").strip(),
        "jev_question": str(card.get("jev_question") or "").strip(),
        "evidence_refs": list(card.get("evidence_refs") or []),
        "risks": list(card.get("risks") or []),
        "reversible_test": str(card.get("reversible_test") or "").strip(),
        "novelty_tag": str(card.get("novelty_tag") or "").strip(),
        "provenance": [expert_id],
    }


def _dedupe(cards):
    """Conservative duplicate collapse: same normalized axis + proposal.
    We intentionally do not fuzzy-merge contradictory/merely similar ideas.
    """
    merged = {}
    order = []
    for c in cards:
        key = (_norm(c["axis"]), _norm(c["proposal"]))
        if key not in merged:
            merged[key] = dict(c)
            order.append(key)
            continue
        m = merged[key]
        m["provenance"] = sorted(set(m["provenance"] + c["provenance"]))
        m["evidence_refs"] = list(dict.fromkeys(m["evidence_refs"] + c["evidence_refs"]))
        m["risks"] = list(dict.fromkeys(m["risks"] + c["risks"]))
        if not m["why"] and c["why"]:
            m["why"] = c["why"]
        if not m["jev_question"] and c["jev_question"]:
            m["jev_question"] = c["jev_question"]
    return [merged[k] for k in order]


def _make_packet(task, constraints, axis, candidates, batch_id, variant="primary"):
    crit = {}
    for c in candidates:
        desc = c["proposal"]
        if c.get("why"):
            desc += f" | rationale: {c['why']}"
        if c.get("risks"):
            desc += " | risks: " + "; ".join(map(str, c["risks"][:3]))
        crit[c["id"]] = desc
    items = list(crit.items())
    if variant == "reordered":
        items = list(reversed(items))
        crit = dict(items)
        instruction = (
            f"For decision axis '{axis}', select the candidate that most robustly satisfies the frozen user goal "
            "and constraints. Prefer feasible, verifiable and reversible choices; do not treat popularity as evidence."
        )
    else:
        instruction = (
            f"For decision axis '{axis}', choose the candidate that best advances the frozen user goal while "
            "respecting constraints, evidence, feasibility, reversibility and known risks."
        )
    return {
        "batch_id": batch_id,
        "axis": axis,
        "candidate_ids": [k for k, _ in items],
        "tool": "jev_choice",
        "variant": variant,
        "packet": {
            "state": {
                "task": task,
                "constraints": constraints,
                "axis": axis,
                "candidates": crit,
                "rule": "Jev is judging supplied alternatives, not supplying evidence or execution authority.",
            },
            "instructions": instruction,
            "criteria": crit,
        },
    }


def prepare(o):
    task = str(o.get("task") or "").strip()
    if not task:
        raise ValueError("task is required")
    constraints = list(o.get("constraints") or [])
    contributions = o.get("contributions") or []
    if not isinstance(contributions, list) or not contributions:
        raise ValueError("contributions must be a non-empty list")
    all_cards = []
    coverage = {"contributed": 0, "reviewed-no-change": 0, "unavailable": 0}
    experts = []
    issues = []
    for i, c in enumerate(contributions):
        if not isinstance(c, dict):
            issues.append(f"contribution[{i}] is not an object")
            continue
        eid = str(c.get("expert_id") or "").strip()
        if not eid:
            issues.append(f"contribution[{i}] missing expert_id")
            continue
        state = str(c.get("state") or "contributed")
        if state not in ALLOWED_STATES:
            issues.append(f"{eid}: invalid state {state!r}")
            continue
        experts.append(eid)
        coverage[state] += 1
        cards = c.get("cards") or []
        if state == "contributed" and not cards:
            issues.append(f"{eid}: contributed state requires >=1 card")
        if state != "contributed" and cards:
            issues.append(f"{eid}: {state} should not carry idea cards")
        for j, card in enumerate(cards):
            all_cards.append(_canonical_card(card, eid, j))
    if issues:
        return {"ok": False, "stage": "prepare", "issues": issues}
    unique = _dedupe(all_cards)
    by_axis = defaultdict(list)
    for c in unique:
        by_axis[c["axis"]].append(c)
    packets = []
    for axis, items in sorted(by_axis.items()):
        for bi in range(0, len(items), MAX_BATCH):
            batch = items[bi:bi + MAX_BATCH]
            if len(batch) < 2:
                continue
            bid = f"r1:{_short_id('axis', axis)}:{bi // MAX_BATCH + 1}"
            packets.append(_make_packet(task, constraints, axis, batch, bid))
    return {
        "ok": True,
        "stage": "round-1",
        "request_id": o.get("request_id"),
        "task": task,
        "constraints": constraints,
        "expert_count": len(set(experts)),
        "coverage": coverage,
        "raw_idea_count": len(all_cards),
        "unique_idea_count": len(unique),
        "duplicate_count": len(all_cards) - len(unique),
        "axes": sorted(by_axis),
        "ideas": unique,
        "packets": packets,
        "singletons": [items[0]["id"] for items in by_axis.values() if len(items) == 1],
        "note": "Call Jev only for emitted packets. Preserve raw tool receipts for advance().",
    }


def advance(o):
    p = o.get("prepared") or {}
    if not p.get("ok") or p.get("stage") != "round-1":
        raise ValueError("prepared must be successful prepare output")
    results = o.get("results") or {}
    if not isinstance(results, dict):
        raise ValueError("results must map batch_id -> Jev result")
    top_k = max(1, min(int(o.get("top_k", DEFAULT_TOP_K)), 5))
    idea_by_id = {x["id"]: x for x in p.get("ideas") or []}
    survivors = defaultdict(list)
    judgements = []
    missing = []
    for packet in p.get("packets") or []:
        bid = packet["batch_id"]
        raw = results.get(bid)
        if raw is None:
            missing.append(bid)
            continue
        parsed = _parse_choice(raw)
        probs = parsed["probabilities"]
        ranked = sorted(packet["candidate_ids"], key=lambda cid: (-probs.get(cid, 0.0), cid))
        kept = ranked[:min(top_k, len(ranked))]
        for cid in kept:
            if cid in idea_by_id and cid not in survivors[packet["axis"]]:
                survivors[packet["axis"]].append(cid)
        judgements.append({"batch_id": bid, "axis": packet["axis"], **parsed, "kept": kept})
    if missing:
        return {"ok": False, "stage": "advance", "issues": [f"missing Jev result for {x}" for x in missing]}
    for cid in p.get("singletons") or []:
        c = idea_by_id.get(cid)
        if c and cid not in survivors[c["axis"]]:
            survivors[c["axis"]].append(cid)
    final_packets = []
    auto_winners = {}
    for axis, ids in sorted(survivors.items()):
        ids = list(dict.fromkeys(ids))
        candidates = [idea_by_id[i] for i in ids if i in idea_by_id]
        if len(candidates) == 1:
            auto_winners[axis] = candidates[0]["id"]
            continue
        # If >10 survived, keep the highest probability seen across round-1 judgments.
        if len(candidates) > MAX_BATCH:
            best = defaultdict(float)
            for j in judgements:
                if j["axis"] == axis:
                    for cid, prob in j["probabilities"].items():
                        best[cid] = max(best[cid], prob)
            candidates = sorted(candidates, key=lambda c: (-best.get(c["id"], 0.0), c["id"]))[:MAX_BATCH]
        base = f"final:{_short_id('axis', axis)}"
        final_packets.append(_make_packet(p["task"], p.get("constraints") or [], axis, candidates, base + ":a", "primary"))
        final_packets.append(_make_packet(p["task"], p.get("constraints") or [], axis, candidates, base + ":b", "reordered"))
    return {
        "ok": True,
        "stage": "axis-finals",
        "request_id": p.get("request_id"),
        "task": p["task"],
        "constraints": p.get("constraints") or [],
        "raw_idea_count": p.get("raw_idea_count", 0),
        "unique_idea_count": p.get("unique_idea_count", 0),
        "ideas": p.get("ideas") or [],
        "round1_judgements": judgements,
        "survivors": {k: v for k, v in sorted(survivors.items())},
        "auto_winners": auto_winners,
        "packets": final_packets,
        "note": "Call both :a and :b packets for each contested axis; verify-finals requires stable choices.",
    }


def verify_finals(o):
    a = o.get("advanced") or {}
    if not a.get("ok") or a.get("stage") != "axis-finals":
        raise ValueError("advanced must be successful advance output")
    results = o.get("results") or {}
    if not isinstance(results, dict):
        raise ValueError("results must map final batch_id -> Jev result")
    grouped = defaultdict(dict)
    missing = []
    models = set()
    for packet in a.get("packets") or []:
        bid = packet["batch_id"]
        raw = results.get(bid)
        if raw is None:
            missing.append(bid)
            continue
        parsed = _parse_choice(raw)
        if parsed["model"]:
            models.add(parsed["model"])
        suffix = "a" if bid.endswith(":a") else "b"
        grouped[packet["axis"]][suffix] = parsed
    if missing:
        return {"ok": False, "stage": "verify-finals", "issues": [f"missing final Jev result for {x}" for x in missing]}
    winners = dict(a.get("auto_winners") or {})
    stability = {}
    unstable = []
    for axis, pair in sorted(grouped.items()):
        if set(pair) != {"a", "b"}:
            unstable.append(axis)
            stability[axis] = {"stable": False, "reason": "missing paired stability result"}
            continue
        ca, cb = pair["a"]["choice"], pair["b"]["choice"]
        stable = ca == cb and ca is not None
        stability[axis] = {
            "stable": stable,
            "choices": [ca, cb],
            "confidence": [pair["a"]["confidence"], pair["b"]["confidence"]],
        }
        if stable:
            winners[axis] = ca
        else:
            unstable.append(axis)
    by_id = {x["id"]: x for x in a.get("ideas") or []}
    return {
        "ok": not unstable,
        "stage": "stable-axis-winners" if not unstable else "unstable-axis-winners",
        "request_id": a.get("request_id"),
        "winners": {axis: by_id.get(cid, {"id": cid}) for axis, cid in sorted(winners.items())},
        "stability": stability,
        "unstable_axes": unstable,
        "jev_models": sorted(models),
        "next": "Create 2-4 synthesis plans, add challenger/dissent cards if material, then run stable Jev synthesis choice and deterministic/risk gates before execution." if not unstable else "Do not execute from unstable axes; add evidence, split/reframe the axis or use a deterministic rule.",
    }


def verify_receipt(o):
    issues = []
    mode = str(o.get("mode") or "").lower()
    if mode not in {"pro", "full", "full-pro", "full_pro"}:
        issues.append("mode must identify Pro/Full Pro")
    raw = o.get("raw_idea_count")
    unique = o.get("unique_idea_count")
    if not isinstance(raw, int) or raw < 1:
        issues.append("raw_idea_count must be >=1")
    if not isinstance(unique, int) or unique < 1:
        issues.append("unique_idea_count must be >=1")
    if isinstance(raw, int) and isinstance(unique, int) and unique > raw:
        issues.append("unique_idea_count cannot exceed raw_idea_count")
    coverage = o.get("coverage") or {}
    for key, minimum in (("modules", 28), ("profiles", 14), ("council_members", 100), ("council_chambers", 10)):
        if int(coverage.get(key, 0) or 0) < minimum:
            issues.append(f"coverage.{key} must be >= {minimum}")
    axes = o.get("axes") or []
    if not isinstance(axes, list) or not axes:
        issues.append("axes must be a non-empty list")
    jev = o.get("jev") or {}
    available = jev.get("available") is True
    if available and unique and unique >= 2:
        if int(jev.get("calls", 0) or 0) < 1:
            issues.append("Jev available with >=2 ideas but no Jev calls recorded")
        if jev.get("stability_passed") is not True:
            issues.append("Jev final stability check did not pass")
        if not jev.get("models"):
            issues.append("record Jev model provenance")
    if not available and o.get("expert_jev_complete") is True:
        issues.append("cannot claim expert_jev_complete when Jev unavailable")
    blockers = o.get("blocking_objections") or []
    if blockers and o.get("execution_ready") is True:
        issues.append("execution_ready cannot be true with blocking objections")
    if o.get("execution_ready") is True and o.get("deterministic_gates_passed") is not True:
        issues.append("execution_ready requires deterministic_gates_passed=true")
    complete = not issues and available and (unique or 0) >= 1 and (unique < 2 or jev.get("stability_passed") is True)
    return {
        "ok": not issues,
        "expert_jev_complete": complete,
        "execution_ready": bool(o.get("execution_ready")) and not issues,
        "issues": issues,
    }


def main(argv=None):
    argv = argv or sys.argv
    cmd = argv[1] if len(argv) > 1 else ""
    try:
        o = json.load(sys.stdin)
        if cmd == "prepare":
            out = prepare(o)
        elif cmd == "advance":
            out = advance(o)
        elif cmd == "verify-finals":
            out = verify_finals(o)
        elif cmd == "verify-receipt":
            out = verify_receipt(o)
        else:
            raise ValueError("usage: expert_jev_deliberation.py prepare|advance|verify-finals|verify-receipt < json")
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False))
        return 2
    print(json.dumps(out, ensure_ascii=False, indent=1, sort_keys=True))
    return 0 if out.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
