"""Genius Council tools: 40 elite + 1,000 scholars, deterministic panel selection, session protocol.

The host model plays the roles — no API key is needed. These tools only supply the roster, the
per-expert system prompts and the session templates, so the same council works in Claude and ChatGPT.
"""
from __future__ import annotations

import json
import sys
from functools import lru_cache

from .paths import skills_dir
from .registry import A, B, I, N, O, S, ToolError, obj, tool
from .runner import finish, run_script


@lru_cache(maxsize=1)
def _mod():
    scripts = skills_dir() / "kosif-expert-council" / "scripts"
    if str(scripts) not in sys.path:
        sys.path.insert(0, str(scripts))
    import expert_council as ec  # noqa: WPS433
    import expert_council.engine as eng
    return ec, eng, scripts


def council():
    return _mod()[0].build_council()


def _expert(e, with_prompt=False):
    return e.to_dict(with_prompt=with_prompt)


@tool("kosif_council_panel",
      "Convene the Genius Council for a question: picks governing roles (chair, red team, verifier, synthesizer), "
      "elite members and diverse scholars by domain, with psychological-state/method diversity. Returns the panel "
      "plus the session protocol; you then voice each member independently, then red-team, verify, synthesize.",
      obj({"question": S("The question or decision for the council."),
           "n_elite": I("Elite members (default 4).", minimum=0, maximum=12),
           "n_scholars": I("Scholars (default 6).", minimum=0, maximum=24),
           "domains": A(S(), "Optional domain keys to force (see kosif_council_search)."),
           "seed": I("Seed for reproducible scholar choice."),
           "prompt_ids": A(S(), "Member ids (max 4) whose full system prompt to include, e.g. ['E04'].")},
          ["question"]),
      title="Convene council", gpt=True)
def _panel(a: dict) -> dict:
    ec, eng, _ = _mod()
    c = council()
    q = str(a.get("question", "")).strip()
    if not q:
        raise ToolError("question is required")
    p = c.select_panel(q, n_elite=int(a.get("n_elite", 4)), n_scholars=int(a.get("n_scholars", 6)),
                       domains=a.get("domains") or None, seed=a.get("seed"))
    want = [str(i).upper() for i in (a.get("prompt_ids") or [])][:4]
    members = {}
    for e in p.governing.values():
        members[e.id] = e
    for e in p.elite + p.scholars:
        members[e.id] = e
    out = {
        "question": q,
        "domains": [{"key": d, "name": ec.DOMAINS[d].name} for d in p.domains if d in ec.DOMAINS],
        "governing": {role: _expert(e, e.id in want) for role, e in p.governing.items()},
        "elite": [_expert(e, e.id in want) for e in p.elite],
        "scholars": [_expert(e, e.id in want) for e in p.scholars],
        "how_to_run": ("1) Call kosif_council_protocol for the templates. 2) Write each member's independent opinion "
                       "BEFORE showing peers. 3) Red team attacks. 4) Verifier classifies claims "
                       "[confirmed]/[probable]/[hypothesis]. 5) Members revise. 6) Synthesizer issues the verdict "
                       "with calibrated confidence and what would change it. One model voicing many members is ONE "
                       "independent source — say so; agreement is descriptive, not proof."),
    }
    bad = [i for i in want if i not in members]
    if bad:
        out["warning"] = f"prompt_ids not in this panel: {bad}"
    return out


@tool("kosif_council_expert",
      "Get one council member by id (E01–E40 elite, S0001–S1000 scholars): profile, powers, psychological state "
      "(strength, blind spot, compensation), and optionally the full system prompt to adopt.",
      obj({"id": S("Member id, e.g. E04 or S0825."), "with_prompt": B("Include the full system prompt (default true).")},
          ["id"]), title="Council member", gpt=True)
def _expert_tool(a: dict) -> dict:
    c = council()
    try:
        e = c.get(str(a["id"]))
    except KeyError:
        raise ToolError(f"unknown member id {a.get('id')!r}") from None
    d = _expert(e, bool(a.get("with_prompt", True)))
    d["psych"] = {"strength": e.psych.strength, "blind_spot": e.psych.blind_spot, "compensation": e.psych.compensation}
    d["method"] = list(e.method)
    d["signature_questions"] = list(e.questions)
    d["limits"] = list(e.limits)
    return d


@tool("kosif_council_search",
      "Search the council by name, title, power or psychological state; or route a question to domain keys.",
      obj({"text": S("Name/title/power text to search (Arabic or English)."),
           "route_question": S("Instead: a question to route to domain keys."),
           "limit": I("Max results (default 15).", minimum=1, maximum=60)}), title="Search council")
def _search(a: dict) -> dict:
    c = council()
    ec = _mod()[0]
    lim = int(a.get("limit", 15))
    out: dict = {}
    if a.get("route_question"):
        out["domains"] = [{"key": k, "name": ec.DOMAINS[k].name, "score": s}
                          for k, s in c.route_domains(str(a["route_question"]))]
    if a.get("text"):
        out["members"] = [{"id": e.id, "name": e.name, "laqab": e.laqab, "title": e.title, "tier": e.tier,
                           "domains": list(e.domains)} for e in c.search(str(a["text"]), lim)]
    if not out:
        out["domain_keys"] = {k: d.name for k, d in ec.DOMAINS.items()}
        out["stats"] = c.stats()
    return out


@tool("kosif_council_protocol",
      "The council session templates (plan, independent opinion, red team, verify, revision, verdict) and the "
      "constitution every member obeys. Use with kosif_council_panel to run a full session yourself.",
      obj({}), title="Council protocol")
def _protocol(a: dict) -> dict:
    ec, eng, _ = _mod()
    return {"constitution": ec.CONSTITUTION,
            "templates": {n.replace("_TEMPLATE", "").lower(): getattr(eng, n)
                          for n in dir(eng) if n.endswith("_TEMPLATE")},
            "complexity_labels": getattr(eng, "COMPLEXITY_LABELS", {}),
            "rounds": "independent opinion → red team + verifier → revision (1–2 rounds) → verdict"}


@tool("kosif_council_overlay500",
      "The deterministic 500-profile Expert Cognitive Overlay (40 elite + 460 scholars covering all 51 domains). "
      "Summary by default; page through rows with slot_from/slot_to. It enriches Council-500 cards — it does not "
      "prove 500 experts executed.",
      obj({"slot_from": I("First slot, 1-based (rows mode).", minimum=1, maximum=500),
           "slot_to": I("Last slot (max 25 rows per call).", minimum=1, maximum=500)}), title="Council overlay 500")
def _overlay(a: dict) -> dict:
    scripts = _mod()[2]
    if str(scripts) not in sys.path:
        sys.path.insert(0, str(scripts))
    import expert_method_overlay as ov
    rows = ov.build_overlay()
    out = {"schema": "a1990-expert-cognitive-overlay-v1", "stats": ov.stats(rows)}
    if a.get("slot_from"):
        lo = int(a["slot_from"])
        hi = min(int(a.get("slot_to", lo + 9)), lo + 24, 500)
        out["rows"] = rows[lo - 1:hi]
    return out


@tool("kosif_council100_select",
      "Council-100 persona selector: which of 100 specialist lenses should speak for a task "
      "(standard / pro / full). Deterministic keyword + domain rules, with skeptic and evidence guards.",
      obj({"task": S("The task."), "mode": S("standard, pro or full", enum=["standard", "pro", "full"]),
           "domains": A(S(), "Optional domain hints."), "max": I("Cap on triggered personas.")}, ["task"]),
      title="Council-100 select")
def _c100_select(a: dict) -> dict:
    s = skills_dir() / "kosif-think-pro" / "scripts" / "council_select.py"
    return finish(run_script(s, stdin=a), "council_select")


@tool("kosif_council100_aggregate",
      "Evidence-weighted synthesis of council artifacts (stance, confidence, evidence, objections, severity). "
      "Never vote counting; blocking vetoes need rejection evidence.",
      obj({"artifacts": A(O(), "Member artifacts (id, stance, confidence, evidence, objection, severity, ...)."),
           "sources": O("Optional independence info: {models:[], tools:[]}.")}, ["artifacts"]),
      title="Council-100 aggregate")
def _c100_agg(a: dict) -> dict:
    s = skills_dir() / "kosif-think-pro" / "scripts" / "council_aggregate.py"
    return finish(run_script(s, stdin=a), "council_aggregate")
