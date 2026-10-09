# Robustness Perturbation Suite
Use selectively for material decisions.

Perturb one dimension at a time:
1. **Frame invariance** — equivalent positive/negative wording should not flip a conclusion without reason.
2. **Order invariance** — reorder options/evidence; detect position anchoring.
3. **Unit/scale invariance** — convert units or rescale equivalent quantities; arithmetic conclusion should remain equivalent.
4. **Assumption sensitivity** — vary the most decision-relevant uncertain input over a plausible interval.
5. **Source removal** — remove the strongest source; identify whether the conclusion still has independent support.
6. **Counterfactual edge case** — construct a nearby case where the leading mechanism predicts a different outcome.
7. **Unknown-state test** — replace one assumed fact with unknown; check whether the system improperly preserves certainty.

Record `stable`, `fragile`, or `invalidated`, plus the reversal threshold if identifiable.
