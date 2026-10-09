# Decision State Machine
Maintain a compact state object for long or consequential work:
- `task_id`, `goal`, `success_postcondition`;
- `claims[]` with lifecycle state and evidence lineage;
- `hypotheses[]` with predictions/disconfirmers;
- `unknowns[]` ranked by decision value;
- `options[]` with feasibility, objective score, reversal threshold and recovery path;
- `selected_route` with executor, authorization, idempotency and verification method;
- `execution_state`: not_started / attempted_unknown / confirmed_success / confirmed_failure / rolled_back;
- `outcome_learning`: pending / observed / calibrated.

Transitions must be monotonic unless new evidence explicitly reopens a claim. Do not erase rejected hypotheses or failed executions; retain them as negative evidence and recovery context.
