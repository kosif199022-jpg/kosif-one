---
name: kosif-secure-executor
description: Mandatory execution boundary for KOSIF Think Pro Full Pro. Validates one-time request-bound execution tickets, distinguishes workflow-only binding from HMAC-backed hard enforcement, and rejects direct host-native executor receipts as bypasses.
---
# Entry rule (Omni host-adaptive)
This block applies **only when Full Pro is explicitly requested** (Pro / Full Pro / all experts / all capabilities, or a Full Pro command). In Standard mode skip it and follow the rest of this skill normally.

In Full Pro: load `kosif-full-pro-host-entry` and use its durable entry/start commands (`kosif-full-pro-host-entry/scripts/host_entry.py`, or the MCP tool `kosif_full_pro_entry` of the bundled `kosif-omni` server, or the live `kosif_full_pro_*` backend tools when the host exposes them). Never call a host-native substantive executor directly while KOSIF owns the request. If the live KOSIF backend is not exposed in this host, follow `kosif-omni/references/host-adapters.md` (local engine path) and label every receipt `LOCAL_ENGINE`; never report backend-only stages as done. The secure-executor backend component is packaged, not deployed — say so explicitly. Visual candidates must satisfy `kosif-secure-executor/scripts/scene_spec.py` before freezing; older compact SceneSpec examples do not satisfy the strict 5.4 runtime contract.

# KOSIF Secure Executor — v5.3

Full Pro execution is valid only through this boundary.

## Contract
1. Runtime authorization must already be `authorization_ready=true`.
2. The authorization contains a one-time `secure_executor_ticket` bound to:
   - `request_id`
   - `executor`
   - `candidate_digest`
   - `state_digest`
   - `execution_lock`
3. The dispatch request must match all bindings exactly.
4. The accepted executor receipt must report `execution_path=kosif_secure_executor`, the matching ticket id and authorization digest, and `secure_executor_verified=true`.
5. The ticket is consumed after one accepted executor receipt. Reuse is rejected.
6. A direct host-native executor receipt is a bypass. The Runtime marks the request `BYPASS_DETECTED`; that request can never reach `FULL_PRO_COMPLETE` and must be restarted with a fresh request id.

## Hard-enforcement modes
- `workflow-binding`: default when no backend secret is configured. This prevents false completion inside KOSIF but is **not cryptographic enforcement of the host**.
- `hmac-sha256`: enabled when an external executor backend holds `KOSIF_SECURE_EXECUTOR_SECRET`. The backend verifies the HMAC before using provider credentials. This is the path for real credential-level enforcement.

Use `scripts/secure_executor.py` to validate dispatch envelopes. Never describe workflow-binding mode as cryptographic or host-level blocking.

## Platform boundary
A packaged ChatGPT skill cannot intercept or disable a host-native tool such as `image_gen`. Therefore, any direct host-native call during Full Pro is classified as non-Full-Pro/bypass. True hard prevention requires an external MCP/backend executor that owns the generation/send/deploy credential and refuses requests without a valid HMAC-backed secure ticket.
