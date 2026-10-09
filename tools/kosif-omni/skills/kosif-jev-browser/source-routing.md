---
name: jev-browser-source-routing
description: BrowserJev decision routing for KOSIF Think using indexed semantic action graphs, deterministic local ranking, bounded Jev escalation, verifier-driven completion and KOSIF Computer execution.
---

# BrowserJev source routing

BrowserJev is a reasoning/control protocol, not a second browser engine.

Architecture:
`user -> KOSIF Think -> BrowserJev planner -> semantic snapshot -> indexed action graph -> local deterministic decision -> optional Jev closed-packet choice -> risk gate -> KOSIF Computer/host executor -> settle -> verifier -> delta -> recovery/receipt`.

Rules: observe before writes; use stable action IDs; deterministic local actions should not wait on Jev; Jev may choose only fresh observed IDs; risk/permission/cost gates remain separate; executor revalidates freshness before writes; browser-to-Windows handoff keeps the same plan/trace ID; use bounded recovery; human checkpoints remain human-controlled; completion requires a fresh postcondition; record replayable traces.
