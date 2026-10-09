---
name: kosif-full-pro-execution-engine
description: Mandatory active runner for KOSIF Think Pro Full Pro. Converts missing expert/Jev work into a persistent depth-first queue of real host/model/Jev actions, ingests only observable receipts, and emits validated expert_cycle events to the Runtime Controller.
---
# Entry rule (Omni host-adaptive)
This block applies **only when Full Pro is explicitly requested** (Pro / Full Pro / all experts / all capabilities, or a Full Pro command). In Standard mode skip it and follow the rest of this skill normally.

In Full Pro: load `kosif-full-pro-host-entry` and use its durable entry/start commands (`kosif-full-pro-host-entry/scripts/host_entry.py`, or the MCP tool `kosif_full_pro_entry` of the bundled `kosif-omni` server, or the live `kosif_full_pro_*` backend tools when the host exposes them). Never call a host-native substantive executor directly while KOSIF owns the request. If the live KOSIF backend is not exposed in this host, follow `kosif-omni/references/host-adapters.md` (local engine path) and label every receipt `LOCAL_ENGINE`; never report backend-only stages as done. The secure-executor backend component is packaged, not deployed — say so explicitly. Visual candidates must satisfy `kosif-secure-executor/scripts/scene_spec.py` before freezing; older compact SceneSpec examples do not satisfy the strict 5.4 runtime contract.

# KOSIF Full Pro Execution Engine — v5.2.1

Version 5.0 made the Runtime Controller truthful but passive. Version 5.1 added the active runner. Version 5.2 makes expert harvests resilient by splitting each 100+100 harvest into **20 observable host batches**: 10 idea batches of 10 and 10 question batches of 10.

## Mandatory behavior
When Full Pro begins, do not stop after Runtime status says `experts_missing`. Initialize this engine for the same fresh `request_id`, then repeatedly:
1. request `next` actions;
2. actually execute the exposed host/model/Jev tool named by each action;
3. wrap the observable tool output in a receipt bound to `request_id + action_id + expert_id`;
4. `ingest` that receipt;
5. `drain-events` and submit emitted `expert_cycle` events into the Runtime Controller;
6. persist both engine and runtime state after every batch;
7. continue until completion or a real tool/session/budget boundary is hit.

## Depth-first scheduling
The engine finishes the first incomplete expert before moving to the next. This avoids the misleading failure mode where 167 experts are all "started" but `experts_validated=0` for a long time.


## Host adapter policy
- Prefer `host_chat_model` for raw structured harvest batches when the current host model can emit the required JSON artifact directly.
- `kosif_frontier_raw` is allowed only when the frontier call returns the exact requested schema; provider errors such as CLEANAPIS_523 are failures, not progress.
- `external_model` is allowed when it returns an observable model receipt and exact schema.
- `kosif_think_council` is explicitly **forbidden** as a raw harvest source. It is a deliberation/synthesis surface and may summarize or transform the request instead of returning the requested array.
- Every chunk receipt must include a declared `source` and `model`; unknown sources fail closed.

## Host actions
- `expert_idea_batch` — 10 ideas for one assigned semantic axis; 10 batches make the expert's 100 ideas.
- `expert_question_batch` — 10 Jev questions for one assigned family; 10 batches make the expert's 100 questions.
- Legacy `expert_harvest` remains accepted for backward compatibility but is no longer the default emitted action.
- After all 20 batches, the engine performs deterministic normalized-exact + token-Jaccard diversity validation and creates a request/expert-bound diversity receipt.
- `jev_choice` — call Jev Choice once for that packet.
- `jev_noul` — call Jev Noul once for that question.
- `jev_score` — call Jev Score once for that question.

Every question remains one separate observable Jev call. A completed host batch is not an expert cycle; only the fully assembled and validated 100+100 harvest advances to Jev judging. The engine does not weaken the user's literal 100×100 requirement.

## No fabricated progress
A queued action is **not** execution. A generated packet is **not** a Jev result. A tool call is counted only after its actual output is ingested and validates. Exact replay is idempotent; conflicting reuse of an action id is rejected.

## Runtime handoff
Once one expert has 100 ideas, 100 questions, 10 group judgements, two stable finals and 100 question receipts, the engine emits a Runtime-compatible `expert_cycle` event. Submit it to `kosif-runtime-orchestrator`. Only the Runtime Controller can count that expert toward authorization.

## Platform truth
The Python engine cannot invoke ChatGPT host tools by itself. The assistant/host must execute the emitted actions using currently exposed tools. If host-native tool invocation cannot be automated server-side, the engine still fixes orchestration by making the missing work explicit, persistent, resumable and non-fabricable. Hard unattended execution requires an external MCP/backend runner with credentials for the model/Jev providers.

## Commands
- `execution_engine.py init STATE REQUEST_ID EXECUTOR SUBJECT --visual`
- `execution_engine.py next STATE --limit 20`
- `execution_engine.py ingest STATE < receipt.json`
- `execution_engine.py drain-events STATE`
- `execution_engine.py status STATE`
