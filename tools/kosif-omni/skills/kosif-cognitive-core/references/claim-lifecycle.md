# Claim Lifecycle
Use for material assertions and decisions.

States:
- `proposed`: candidate claim not yet sourced;
- `sourced`: evidence attached, quality not yet challenged;
- `challenged`: counterexample/falsifier/alternative checked;
- `supported`: current evidence is adequate for the decision context;
- `uncertain`: unresolved material uncertainty remains;
- `decision_relevant`: claim materially affects the chosen action;
- `action_ready`: verifier confirms evidence, authority and postcondition;
- `outcome_observed`: result is externally observed;
- `learned`: calibration/error lesson recorded for this task class.

Forbidden transitions:
- proposed -> action_ready without sourcing/challenge for high-impact work;
- uncertain -> action_ready when uncertainty is material;
- executed -> learned without an observed outcome;
- repeated-agent agreement -> sourced/support upgrade without independent evidence.
