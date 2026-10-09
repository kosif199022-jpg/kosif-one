# Domain Gates

## Accounting / audit / compliance
Require framework/edition/effective date when material, evidence lineage, deterministic checks separated from judgement, materiality/risk, exception handling and human/professional sign-off where required. A model output without linked evidence stays draft.

## Engineering / code / deploy
Require reproducible failure or explicit target state, minimal change, tests/regression check, dependency/rollback awareness and fresh deployed-state verification. Build/HTTP 200 alone is not user-goal success.

## Browser / computer
Observe current state before action, prefer high-level APIs/structured selectors, define exact postcondition, and reconcile unknown side-effect state before retry.
