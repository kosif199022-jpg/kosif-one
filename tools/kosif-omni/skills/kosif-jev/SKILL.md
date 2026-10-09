---
name: kosif-jev
description: Use for closed-set judgement with Jev tools. In KOSIF Think Pro 4.5 it also handles the 100×100 expert question queues, per-expert idea tournaments, stability checks and final synthesis arbitration.
---
# KOSIF Jev Arbiter — v4.5

Jev returns structured judgements, not evidence and not authorization.

## Live calls from KOSIF Omni
- `kosif_jev_decide mode=choice|noul|score question=... evidence={...} options=...` calls the live kosif-jev service
  (`https://kosif-jev.kosif199022.workers.dev/api/public-jev`, override with `KOSIF_JEV_URL`, `off` disables it).
  The packet is checked first (authorisation questions blocked, evidence required, secrets redacted). By default it
  asks twice in parallel with the options reversed and reports `stable` plus a mean ranking; each call yields an
  observed receipt (model id, probabilities, latency, packet digest). Identical packets are answered from a local cache.
- `kosif_skill_auto task=...` uses Jev to choose the skill for a task among built-in and Atlas candidates.
- `kosif_jev_status` checks reachability and the model id.
- The edge API `https://kosif-atlas-api.kosif199022.workers.dev` reaches the same service through a Cloudflare
  service binding.

## Modes
- `jev_noul` — precise yes/no probability.
- `jev_choice` — one choice from a closed set; use for idea tournaments.
- `jev_score` — ordered rubric; use for quality/readiness/risk dimensions.

## 100×100 rule
In Pro/Full Pro every available expert supplies 100 question cards. **Each question card requires its own observable Jev call/result.** Do not pretend a single summary call answered 100 questions.

Each expert's 100 ideas are judged through 10 `jev_choice` groups of 10 and two expert-final stability calls. Preserve raw results, model id, probabilities, candidate order and timestamps/receipts when available.

## Stability
Consequential finals must be asked twice with reordered options and semantically equivalent wording. Unstable results trigger reframe/add-evidence/deterministic resolution; do not execute from an unstable Jev final.

## Authority boundary
Jev may rank, choose, score, route and challenge. It never overrides explicit user requirements, deterministic facts, source/evidence gates, safety/authorization, blocking vetoes or postcondition failures.

## Mass-question hygiene
Questions must be meaningfully diverse. At least 10 families per expert. Prefer specific closed questions such as:
- Does candidate X preserve the frozen visual invariant?
- Which of A–J creates the strongest readable action silhouette?
- How production-ready is this lighting plan on a 0–4 rubric?

High confidence does not repair missing evidence. Record uncertainty rather than forcing a decision.
