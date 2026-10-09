---
name: kosif-expert-council
description: The Genius Council («مجلس العباقرة») — 40 elite members + 1,000 scholars across 51 domains, each with distinct methods, a psychological state (strength, blind spot, compensation) and a full system prompt; deterministic panel selection, session protocol (independent opinion → red team → verifier → revision → verdict) and the fixed 500-profile Expert Cognitive Overlay for Council-500. Use for expert panels, second opinions, red-teaming, "اجمع مجلس خبراء", multi-perspective decisions.
---
# KOSIF Expert Council

A roster + method library, **not** executed headcount. The host model plays the members; nothing here calls an API.

## Two ways to use it

### A) Convene a council now (any host with the `kosif-omni` MCP server)
1. `kosif_council_panel question="…" n_elite=4 n_scholars=6 [domains=[…]] [seed=…]`
   Returns governing roles (chair, red team, verifier, synthesizer), elite members routed by domain, and scholars chosen for maximum *mental diversity* (different psychological states and primary powers).
2. `kosif_council_protocol` → the Arabic session templates (plan, independent opinion, red team, verify, revision, verdict) and the **council constitution**.
3. For members you will voice in depth: `kosif_council_expert id=E04 with_prompt=true` (or `prompt_ids` on the panel call, max 4 per call) and adopt their system prompt for that member's turn.
4. Run the session: **independent opinions first** (peers hidden) → red team → verifier → revision → verdict. Every opinion ends with a calibrated confidence (0–100%) and what would change it. Claims are tagged [confirmed] / [probable] / [hypothesis]; invented numbers, sources or quotes are forbidden by the constitution.
5. Report honestly: one model voicing N members is **one** independent source. Say what is dissent, what is consensus, and what evidence is missing.

Without the MCP server: run `python scripts/expert_method_overlay.py` for the overlay, or import `expert_council` (`build_council()`, `.select_panel(question)`, `.get(id).prompt`) in a Python sandbox; the library is pure standard library (the optional `engine.py` needs the `anthropic` package and an API key — only for unattended sessions).

### B) Enrich Council-500 expert cards (A1990 overlay)
The live Full Pro contract stays **exactly 500 counted independent experts**. The 1,040-member library only enriches those cards.
- `kosif_council_overlay500` (or `scripts/expert_method_overlay.py`): deterministic 500 profiles = all 40 elite + 460 scholars (9 per domain × 51 domains + 1 extra). Stats: 500 unique source experts, 51 domains, 24 psychological states, 176 distinct power keys (44 shared methods plus elite-specific powers), 10 schools.
- Each card carries its powers (with protocols), psychological blind spot **and mandatory compensation**, mental models, method, signature questions and limits. An answer that ignores its compensation rule is incomplete.
- Methods and personas improve *how* an expert reasons; they create no facts. Claims still need evidence lineage, deterministic checks, falsifiers and independent verification. Never report 1,040 (or 500) executed experts unless that many real cycles ran.

## Library facts (verified by `overlay_self_test.py`)
1,040 members (40 elite + 1,000 scholars) · 51 domains in 19–20 scholars each · 44 cognitive powers · 24 psychological states · 10 schools · zero duplicate profiles or names. Governing roles: chair (E00), red team, verifier, synthesizer.

## Safety
Psychological-state and Big-Five fields are **fictional style controls**, non-diagnostic, and must never be applied to real people. Medical, legal and financial topics: general knowledge and analytic frameworks, plus advice to consult a licensed professional before consequential personal decisions (constitution article 7).
