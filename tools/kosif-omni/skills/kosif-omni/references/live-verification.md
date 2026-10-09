# Live verification
## Response contract
Record requested agent, actual artifact source/model, fallback reason, receipt time, duration, completeness and verifier verdict. Missing answer items => revise; incorrect material values or fabricated facts => reject. A high self-reported confidence cannot reverse this gate.

## Numeric verifier
Use Python integers/Decimal or a supported calculator for exact arithmetic. For Bayes, retain prior, sensitivity and false-positive rate separately; compute numerator and denominator deterministically. For monetary entries use Decimal with explicit rounding, currency, tax and period. Never rely on a model vote to validate a number.

## Provider and Council gate
The status endpoint reports configured aliases, not verified upstream model identity. A successful broker call can contain a failed or substituted provider. Preserve degraded=true and failures. Report actual usable coverage, not all requested agents.
Validate unique supported agent IDs. Compare actual (source,model) groups; shared fallback models do not establish independent verification. Require every material answer item before synthesis. Treat abstention separately. Agreement is descriptive, not truth.
After timeout of a side effect, reconcile with the original idempotency key and executor state before retry. A correlation digest is not a signed receipt.

## Capability gate
Discover only current live tools. Use owner APIs for Drive/files, host execution for other tools, optional authorized computer tools for actual device actions. Never invent kosif_route, kosif_auto, kosif_mobile_think or self-test tools merely because status advertises them.
For verification report tested-pass, tested-fail, partial, unavailable, or not-tested. A source update is saved only after publishing and reading back the affected files; host adoption requires a new live behavioral check.

## Benchmark discipline
Keep known-answer and unseen tests separate. Preserve prompts and raw receipts. Track exactness, source support, completeness, false success, fallback rate and latency separately. Do not collapse these into a misleading overall IQ or all-capabilities success claim.

