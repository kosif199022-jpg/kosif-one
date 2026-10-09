---
name: kosif-jev-browser
description: Fast Jev-guided browser planning and host-mediated execution through KOSIF Think and KOSIF Computer.
---

# KOSIF Jev Browser

When this plugin is explicitly selected, treat Jev Browser as a **decision and verification layer**, not as a replacement for the host's browser/control tools.

## Required execution order

1. Inspect the live browser/page state using the fastest available host route.
2. Build a compact Indexed Action Space with stable action IDs and only currently actionable controls.
3. Use deterministic local heuristics for obvious, low-risk actions.
4. Use Jev when there is ambiguity, multiple plausible actions, conflicting evidence, or meaningful side-effect risk.
5. Execute through KOSIF Computer / host browser tools (prefer persistent Playwright/CDP, then Chrome DevTools, then UIA/dialog/screen-state, then vision/coordinates only as fallback).
6. Verify every consequential action from fresh evidence before claiming success.
7. On failure, classify the failure, refresh state, choose a different route, and retry only when doing so will not duplicate a side effect.

## Indexed Action Space

Represent available actions compactly. Each action should include:
- `id`
- `kind` (click, fill, select, submit, navigate, wait, dialog, app)
- visible/accessible label
- selector or host reference when available
- enabled/visible state
- risk class: read / reversible write / irreversible-or-external
- expected postcondition

Prefer choosing an action ID rather than regenerating long DOM descriptions for every step.

## Decision policy

Use local deterministic choice when confidence is high and risk is low. Escalate to Jev if:
- two or more actions are close matches,
- the page state is ambiguous,
- a payment, message, publish, delete, submit, account, token, permission, or other external side effect is involved,
- the result conflicts with expected state,
- a recovery decision has multiple valid branches.

Do not use Jev for every click; that increases latency without improving reliability.

## Verification and recovery

After execution, verify at least one fresh postcondition such as URL, title, DOM text, response status, dialog state, screen delta, network/console evidence, or executor receipt.

If verification fails:
- do not claim success,
- avoid repeating writes blindly,
- refresh the Indexed Action Space,
- prefer a different safe route,
- return the observed blocker if human action is required (CAPTCHA/MFA/consent/payment).

## Security and cost

Never reveal passwords, cookies, tokens, API keys, or secrets. Never bypass CAPTCHA/MFA. Never enable billing or consume paid/limited-credit services without the user's explicit approval. Reuse authenticated browser sessions instead of asking for credentials.

## Host integration

If KOSIF Think is available, use it for task-level routing and risk checks. If KOSIF Computer is available, use it for execution. This plugin itself should not pretend it directly called those tools; describe host-mediated execution accurately.
