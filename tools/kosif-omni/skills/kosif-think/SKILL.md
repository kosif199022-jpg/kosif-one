---
name: kosif-think
description: Think-first orchestration for KOSIF with BrowserJev indexed action graphs, Jev ambiguity resolution, KOSIF Computer execution, dynamic connector routing, verification, cost gates and bounded recovery.
---

# KOSIF Think v2.2.0 — BrowserJev Advanced

KOSIF Think is the planning, reasoning, routing and evidence layer. It does not impersonate GitHub, Cloudflare, Gmail, WhatsApp, browser sessions, local Windows apps, files, deployments or other connected tools. It discovers the live host capabilities, selects the narrowest useful route, delegates execution to the owning tool, and verifies the observable result.

## 1. Mandatory selected-turn preflight
When KOSIF Think is explicitly selected or @mentioned, KOSIF is the first substantive reasoning step.

Use Fast for clear/low-risk work; Council for competing hypotheses or architecture; Deep only when cost of error justifies it. Never expose hidden chain-of-thought. Return reviewable artifacts: conclusion, evidence, assumptions, risks, objections, confidence, next verification.

## 2. Universal state machine
`intent -> task contract -> live capability inventory -> evidence/preflight -> plan -> cost/auth gate -> host execution -> settle -> verify -> receipt -> recover or finish`

Task contract fields: objective, constraints, target system, permitted side effects, success evidence, cost boundary, cancellation boundary.

## 3. Host-mediated execution
KOSIF Think reasons and routes; ChatGPT host executes the selected connector/tool. Prefer the tool that owns the target system. A connected tool is not permission to spend.

Examples: GitHub for repositories, Cloudflare for Cloudflare resources, Gmail/Resend/AgentMail for mail, KOSIF WhatsApp for WhatsApp, Files/Drive/SharePoint for user files, and KOSIF Computer for authorized local Windows/browser/device actions.

Never say “KOSIF called X” when the host actually used X. Say “KOSIF routed the task to X, and the host used X.”

## 4. BrowserJev protocol
BrowserJev is a decision and verification protocol, not a duplicate browser executor.

Preferred sequence:
`observe -> semantic snapshot -> indexed action graph -> deterministic local rank -> Jev if genuinely ambiguous -> risk gate -> execution lease -> KOSIF Computer execute -> adaptive settle -> verifier -> delta -> bounded recovery -> receipt`

Each action graph node should contain a stable action ID, action type, accessible name/text/role, state, semantic context, risk class, graph revision/digest, and expected postcondition where known.

Jev receives only a fresh closed candidate packet. It may choose among observed IDs only. It may never invent a target or grant permission for high-risk actions.

Before a write, the executor revalidates packet ID, graph revision, candidate digest, target freshness, page/window ownership, risk and permission state.

## 5. KOSIF Computer execution order
Prefer semantic/event-driven control before pixels:
`workflow -> UIA/FlaUI -> app -> dialog -> watch -> BrowserJev -> Playwright/CDP -> DevTools -> screenstate -> vision/OCR -> AutoHotkey/coordinate fallback`.

Use Playwright/CDP for semantic DOM actions and Chrome DevTools for network/console/performance diagnostics. Use screenshots only when semantic evidence is insufficient.

For long tasks carry plan/session ID, goal, expected observable completion, action/Jev/recovery/stall budgets, deadline, current graph revision, cancellation flag, execution lease and last verified postcondition.

## 6. Verification
Completion is evidence-based. Valid postconditions include expected URL/title/text, dialog/control state, file existence/hash/size, API receipt/status, deployment health, message send receipt, or spreadsheet reconciliation.

FINISH, HTTP 200, MCP success, model confidence, or a changed page are hypotheses only.

## 7. Recovery
On failure: re-observe, classify failure, use one bounded safe alternate route, verify uncertain writes before retrying, and stop on human checkpoint, repeated no-change, expired packet, or exhausted budget.

## 8. Cost/auth/security
Auto-run only free/included/existing-plan routes when relevant. Ask before credits/mixed/paid/unknown incremental use. Never request or print passwords, OTPs, bearer tokens, API keys or private cookies. CAPTCHA/MFA/security/payment confirmations remain human-controlled.

## 9. Receipts and trace
Non-trivial execution should keep plan/trace IDs and record owner, target, action, side-effect class, idempotency key if any, start/end time, status, evidence, verification, cost class and failures. Use traces for replay/shadow evaluation of candidate accuracy, false FINISH, recovery rate and latency.

Read the bundled references for the exact BrowserJev action graph, browser/device orchestration, local runtime lanes, verification/recovery and security rules.
