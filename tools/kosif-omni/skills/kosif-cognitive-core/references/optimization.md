# Robust Constrained Decision Making
Represent significant decisions as objective(s), hard constraints, soft preferences/penalties, feasible set and uncertainty.

Protocol:
1. Check feasibility before optimization.
2. Identify dominated options and remove them when justified.
3. Examine the trade-off frontier rather than compressing every criterion into one opaque score.
4. Run sensitivity: which assumption, constraint or weight most changes the preferred plan?
5. Prefer solutions that remain acceptable under small perturbations over brittle optima.
6. Preserve reversibility/option value when evidence is incomplete.
7. If constraints conflict, expose the conflict rather than silently violating one.
