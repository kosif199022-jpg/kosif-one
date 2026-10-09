---
name: kosif-runtime-orchestrator
description: Mandatory state and execution-work authority for KOSIF Think Pro Full Pro. Tracks request-bound expert/Jev work, creates leased jobs, collects actual receipts, resumes safely, and gates executor authorization.
---
# Entry rule (Omni host-adaptive)
This block applies **only when Full Pro is explicitly requested** (Pro / Full Pro / all experts / all capabilities, or a Full Pro command). In Standard mode skip it and follow the rest of this skill normally.

In Full Pro: load `kosif-full-pro-host-entry` and use its durable entry/start commands (`kosif-full-pro-host-entry/scripts/host_entry.py`, or the MCP tool `kosif_full_pro_entry` of the bundled `kosif-omni` server, or the live `kosif_full_pro_*` backend tools when the host exposes them). Never call a host-native substantive executor directly while KOSIF owns the request. If the live KOSIF backend is not exposed in this host, follow `kosif-omni/references/host-adapters.md` (local engine path) and label every receipt `LOCAL_ENGINE`; never report backend-only stages as done. The secure-executor backend component is packaged, not deployed — say so explicitly. Visual candidates must satisfy `kosif-secure-executor/scripts/scene_spec.py` before freezing; older compact SceneSpec examples do not satisfy the strict 5.4 runtime contract.

# KOSIF Full Pro Runtime + Runner — v5.3

Version 5.1 adds the missing **Execution Runner** between the deterministic Runtime Controller and host tools.

## Two-layer architecture
- `full_pro_runtime.py` is the immutable accounting/gating authority. It validates facts; it never invents work.
- `full_pro_runner.py` turns missing work into leased, resumable jobs and accepts only observable host receipts.

This separation is deliberate: generation/Jev tools live in the host, while the controller remains deterministic and replayable.

## Full Pro execution loop
1. Initialize Runtime + Runner with the same fresh `request_id`, executor and visual flag.
2. Call Runner `next` for a bounded job batch.
3. For `expert_harvest`, call an actually exposed model/agent with the named expert role. Require exactly 100 distinct Idea Cards + 100 typed Jev Question Cards and record the actual model receipt.
4. Submit harvest. Local diversity checks reject exact/near padding.
5. Runner then emits exactly 10 idea-group Jev jobs, 2 expert-final stability jobs, and 100 question jobs. **One job = one observable Jev receipt.**
6. Submit each receipt with the active lease. Exact replay is idempotent; conflicting reuse is rejected.
7. When an expert reaches 112 Jev receipts, Runner emits one `expert_cycle` event. Apply it to Runtime, then mark it emitted in Runner.
8. Resume at the first incomplete expert after interruption; never restart completed cycles.
9. After all expert cycles, perform cross-expert / Einstein / final stability / gates / candidate freeze through the Runtime and obtain authorization before executor use.

## CLI
`python full_pro_runner.py init RUNNER.json REQUEST_ID EXECUTOR --visual`

`python full_pro_runner.py next RUNNER.json --limit 8`

`python full_pro_runner.py submit-harvest RUNNER.json < harvest.json`

`python full_pro_runner.py submit-receipt RUNNER.json < receipt_submission.json`

`python full_pro_runner.py emit-cycle RUNNER.json M01`

`python full_pro_runner.py mark-emitted RUNNER.json M01 EVENT_ID`

`python full_pro_runner.py status RUNNER.json`

## Fail-closed invariants
- Missing expert work becomes a queue item, never a fake count.
- A persona definition is not execution.
- A model answer is not a Jev receipt.
- A batch summary does not count as 100 Jev answers.
- 99/100 never rounds up.
- No receipt can cross request ids.
- Leases prevent accidental double-application; exact replay is safe.
- The runner does not claim that it called host tools itself.
- `No Runtime authorization = no substantive executor` remains unchanged.

## Platform boundary
A skill cannot itself invoke 18,000+ host tool calls in the background. The v5.1 Runner makes the work explicit, resumable and mechanically checkable. Fully autonomous unattended execution still requires an external MCP/backend worker with provider/Jev credentials, rate-limit handling and durable queues.

## Live model adapter
KOSIF Think backend v0.8.4 adds a validated `kosif_expert_harvest` path. When the host has not refreshed the new MCP tool yet, the existing `kosif_think` compatibility bridge may be used only with the `KOSIF_FULL_PRO_HARVEST_V1:` marker and only when the returned structured result says `mode=expert_harvest` and carries request-bound shard/model/diversity receipts.


## Secure Executor boundary
After candidate freeze and Runtime authorization, execution must pass through `kosif-secure-executor`. Runtime issues a one-time ticket. Direct host-native executor receipts are rejected and mark the request `BYPASS_DETECTED`. Ticket reuse and re-authorization after an accepted executor receipt are rejected. HMAC-backed hard enforcement is available only when an external executor backend holds `KOSIF_SECURE_EXECUTOR_SECRET`; otherwise the ticket is workflow-binding only.
