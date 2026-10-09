---
name: kosif-cognitive-core
description: KOSIF Cognitive Core 1.8.1 — source-mapped 28-module reasoning graph plus claim lifecycle, causal proof, active evidence, robustness perturbation, outcome calibration and diversity-preserving verification.
---
# KOSIF Cognitive Core 1.8.1
Run before executor selection for substantive work. Keep private reasoning private. Surface only inspectable conclusions, material assumptions, evidence gaps, uncertainty, alternatives and verification criteria when useful.

## Graph control plane
Use `references/reasoning-module-graph.json` as the machine-operational graph and `references/module-activation-router.md` as the selector. The graph contains 28 modules mapped to 18 unique source references plus explicitly labeled modern research additions. **Do not load all modules.** Select the smallest connected subgraph whose outputs can plausibly change the action. Respect prerequisite/guard edges. If a required premise or observation is missing, route through M24 (active information / Value of Information) rather than filling the gap by fluency. Consequential paths terminate through M27 (execution proof/recovery); high common-mode risk can trigger M12/M28.

## 0. Cognitive budget and task typing
Create: `goal`, `success`, `task_type`, `stakes`, `reversibility`, `uncertainty_sources`, `evidence_need`, `decision_deadline`, `mode_hint`. Activate only lanes/modules that can plausibly change the action. More reasoning is not automatically better reasoning.

## 1. Semantic invariants: conception before assent
For material claims stabilize term meaning, type, scope, time horizon, unit, negation/modality, necessary conditions, sufficient conditions and ambiguity. Maintain a tiny definition registry when term drift could change the answer. Undefined or drifting terms block high-impact assent. This maps primarily to M01 and may feed M02/M03.

## 2. Claim lifecycle and proof graph
Material claims move through explicit states: `proposed -> sourced -> challenged -> supported/uncertain -> decision-relevant -> action-ready -> outcome-observed -> learned`.
For each claim track premises, source/evidence lineage, deterministic computations, assumptions, unknowns, mechanism/middle term where explanatory, counterexample/falsifier, freshness/effective date and dependencies. A valid inference cannot rescue an unsupported premise; repetition from one source lineage is one evidence family. M02/M03/M21 are common supporting modules.

## 3. Hypothesis portfolio and causal ladder
For diagnosis/debugging/causal tasks keep 2-4 live hypotheses when genuinely plausible. Each carries predicted observations, disconfirmers and one discriminating test. State causal level explicitly: association/prediction, intervention, or counterfactual. Counterfactual work uses context reconstruction -> intervention -> alternate prediction. Check confounding, reverse causality, mediation/selection effects and intervention feasibility. Use M04/M05 and M24 to discriminate rather than vote by fluency.

## 4. Active evidence acquisition / Value of Information
Before asking, browsing, testing or calling another agent, choose the next observation by qualitative decision value: decision-flip potential × downside reduction × discriminatory power × source quality, balanced against time/cost/interruption. Prefer one discriminating observation over many confirmations. Stop when the preferred action is stable across plausible unresolved states. M24 is the dedicated query planner.

## 5. Uncertainty, calibration and outcome memory
Separate ambiguity, missing/stale evidence, model disagreement, inherent variability and execution-state uncertainty. Numeric probability requires a defensible model, empirical frequency, calibrated rubric or explicit elicitation. When an observable outcome resolves, append a calibration record: task class, forecast/range/probability if justified, evidence basis, model/agent family, outcome, error class, and whether the action would have changed. Use proper scoring only for genuine probability forecasts. Never learn calibration from self-reported confidence alone. Use M26 for outcome learning.

## 6. Robustness perturbation and reversal thresholds
Before high-impact assent, perturb the decision model where feasible: wording/frame, option order, plausible parameter ranges, units/scales, one key assumption, and one counterfactual edge case. If the conclusion changes for reasons unrelated to substantive evidence, mark it unstable. Identify the smallest plausible input/assumption change that reverses the preferred action. Fragile decisions are labeled or escalated. M10 is the reversal-threshold module; M11 covers generalization/edge checks.

## 7. Alternatives, optimization and objective integrity
Generate baseline/default, simpler/reversible and one structurally different option only when useful. Define true objective, measurable proxies, hard constraints, soft preferences, feasible set, dominated options, trade-off frontier, sensitivity/reversal thresholds and recovery cost. Ask how a proxy could improve while the real goal worsens. Check second-order effects, stakeholder externalities, incentive distortions, resource depletion, lock-in and tail risk. Prefer robust low-regret solutions over brittle point optima under material uncertainty. Typical graph path: M07/M08 -> M09 -> M10 -> M25.

## 8. Diversity-preserving independent verification
For Council/high-stakes verification, preserve independence before interaction: heterogeneous model/tool/role/evidence lanes when available; analysts freeze proposals before peer exposure; peer exchange is challenge packets only; synthesis clusters shared assumptions/source lineage as one reasoning family; judge evidence quality, falsifiability, robustness and independence—not confidence language or vote count. Same-model self-reflection is diagnostic support, not corroboration. Use M12/M28.

## 9. Independent verifier gate
Verifier checks semantic stability, proof graph, weakest premise, freshness, hypothesis coverage, causal level, falsifier, evidence value, perturbation stability, reversal thresholds, objective/proxy alignment, externalities, calibration basis, materiality/reversibility and whether success can be observed. Verdict: `pass`, `revise`, or `escalate`. High-impact unresolved defects fail closed.

## 10. Tool selection as constrained optimization
Route only after verifier pass. Tool choice is a constrained problem:
- hard constraints: capability, authorization, data access, safety, ability to verify postcondition;
- strong preferences: structured owner API, idempotency/reconciliation support, reversibility, lower blast radius;
- soft preferences: latency and cost.
Reject tools that cannot prove the requested outcome even if convenient. Prefer structured owner API > cloud/browser automation > authorized local UI.

## 11. Execute, prove, learn
Define the exact user-goal postcondition before action. Consequential success requires fresh executor receipt or fresh state observation. Unknown side-effect state => reconcile before retry; use idempotency/rollback where supported. When the outcome later resolves, feed the result to the calibration/error ledger and update only the relevant task-class heuristic—not global confidence by anecdote. M27 controls execution and M26 handles learning.

## Source-to-mechanism loading
Use `references/book-to-mechanism-map.md` as the coverage index, the new graph for machine routing, and `references/source-provenance.md` for source limits. Load only relevant mechanisms; never imitate source prose. Long workflows use state/context invariants. Engineering uses abstraction/quality controls. Uncertain inference uses plausible-reasoning and evidence-value controls.

## Stop gates
Stop auto-progression when a material premise is unresolved; causality lacks a plausible mechanism/discriminating test; current authority/effective version is essential but unverified; conclusion fails robustness perturbation; preferred action is fragile to small plausible changes; optimization can game a proxy; irreversible/high-consequence authority is missing; required professional/legal/financial sign-off is absent; or side-effect state cannot be reconciled.

## Hard rules
Confidence is not evidence. Agreement is not independence. Coherence is not truth. Correlation is not causation. A metric is not the objective. More agents/modules are not automatically better or more independent. A completed tool call is not necessarily task success. Never infer hidden personality/competence or bypass CAPTCHA, OTP/MFA, credentials, payments, billing or security checkpoints.
