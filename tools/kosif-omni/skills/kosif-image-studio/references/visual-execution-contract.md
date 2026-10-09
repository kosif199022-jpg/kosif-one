# Visual Execution Reliability Contract — v1.0

KOSIF Think Pro 3.3 adds a deterministic bridge between reasoning and image execution. It is additive and does not replace the general Execution Contract.

## Visual locks
Freeze only what matters to the user's intent: `subject`, `action`, `composition`, `camera`, `lighting`, `weather`, `environment`, `style`. Also record `required`, `forbidden`, `attention_budget` (max 3), `physics_checks`, `allowed_flexibility`, and `success_criteria`.

`visual_contract.py build` creates a stable `contract_id` and deterministic compiled prompt. Do not silently mutate the contract after generation starts. A materially different brief is a new decision and requires a new contract/preflight.

## Observation and drift
`visual_contract.py verify` accepts only structured evidence explicitly marked observed and bound to the same `request_id`. The helper itself does not inspect pixels. Use host vision, the KOSIF Vision tool/helper, or a human review to populate required/forbidden observations and optional 0..1 scores for anatomy, composition, lighting, physics, and attention preservation.

Decisions:
- `pass`: all checked requirements pass;
- `repair`: drift is observed and the single repair budget remains;
- `block`: mismatched request/evidence, hard block, or repair budget exhausted.

## One-repair rule
KOSIF 3.3 permits at most one automatic correction candidate. A repair packet:
- keeps the same `request_id` and `contract_id`;
- changes only failed dimensions;
- is not execution authorization;
- requires fresh preflight before another generator call;
- must be re-verified afterwards.

No repeated regenerate-until-good loop is allowed.

## Jev below-threshold handling
`visual_contract.py jev` converts a below-threshold probability into one targeted re-analysis round. After that one round, run Jev once more. If it remains below threshold, stop/escalate rather than looping.

## Attention budget
The first three attention items are the elements most important to preserve. Background detail or visual spectacle must not displace them.

## Physics checks
Physics checks are explicit expected interactions (examples: rain streak direction, splash response, smoke/fire interaction, reflection consistency, gravity/contact). They are verified from observed evidence, not guessed by the helper.

## Receipt quality
When a Pro artifact requires visual quality verification, the receipt may carry a `quality` object under `artifact_delivery`. This remains non-cryptographic evidence and cannot upgrade an unsigned runtime receipt into a signature.
