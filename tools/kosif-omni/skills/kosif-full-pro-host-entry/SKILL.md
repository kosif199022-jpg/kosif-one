---
name: kosif-full-pro-host-entry
description: Mandatory fail-closed host entry for selected KOSIF Full Pro.
---
# Full Pro Host Entry Guard 5.7

Before any substantive executor, enter KOSIF Full Pro and retain a stable request_id. The host must not substitute native execution while KOSIF owns a running/finalizing request.

## Current runtime contract
- Versions drift: do not trust numbers written here. Check the live backend with `kosif_doctor remote=true`; it reports the server version, whether the configured endpoint is the server's announced primary one, and whether tool calls need a sign-in. (Observed 2026-10-02: kosif-think 0.22.3, primary `/mcp/v0.22.3`; `/mcp/v0.18.8`, `/mcp/v0.18.7`, `v0.18.6`, `v0.18.5`, `v0.9.3` compatibility-only.)
- Discovery (`initialize`, `tools/list`) is public; every tool call needs the host's OAuth sign-in. An HTTP 401 `authentication_required` means "authorize kosif-think in the host", not "the tool is broken".
- Council-500 is mandatory. Completed expert receipts are durable and resumed, not recomputed after late-stage failures.
- Capability Truth separates verified runtime evidence from host-dependent exposure/configuration.
- Host connectivity is tri-state; missing/stale evidence remains `unknown`.
- `source-taint-v1` keeps unverified provenance tainted through clustering, Jev and synthesis.
- Natural-language arithmetic binding supports `=`, `equals`, `is equal to`, and `يساوي` assertions from answer/evidence. Independent canonical arithmetic can quarantine conflicting numeric option votes.
- `execution-binding-v1` is frozen before authorization and binds candidate, contract, ticket, execution and receipt.
- Full Pro images use KOSIF Secure Executor only; `vision_task_aware_v5` activates specialized QA only from positive SceneSpec content or explicit constraints.
- Direct host execution while KOSIF owns the request is a bypass and cannot be reported as Full Pro success.

## Truth boundary
Server capability does not prove the current ChatGPT host exposed the tool. Only current-request observed evidence may be called verified.
