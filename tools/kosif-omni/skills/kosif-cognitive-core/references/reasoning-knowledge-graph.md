# KOSIF Reasoning Knowledge Graph 1.0

This is a machine-operational map, not a book summary. Modules are selectively activated by task features; source text is not copied.

## Routing rule
1. Type the task and identify stakes/uncertainty/reversibility.
2. Activate the smallest module set whose outputs can change the decision.
3. Respect prerequisites and guards in `reasoning-module-graph.json`.
4. If a module requires evidence not present, route through M24 rather than filling the gap by fluency.
5. Consequential paths terminate through M27 and, when uncertainty remains high, M28 before execution.

## Module registry
### M01 — semantic_stabilization
Stabilize material terms before assent.
**Sources:** Aristotle—Organon, Avicenna—al-Shifa Logic, Smart Thinking
**Activate:** definition/classification, ambiguous key term, high-impact claim
**Outputs:** normalized definitions, ambiguities, necessary/sufficient conditions

### M02 — formal_validity_counterexample
Separate valid inference from truth of premises and seek countermodels.
**Sources:** Aristotle—Organon
**Activate:** argument, proof, policy rationale, deductive claim
**Outputs:** validity status, hidden premises, counterexample

### M03 — demonstration_mechanism
Require explanatory middle-term/mechanism for strong explanatory or causal assent.
**Sources:** Aristotle—Organon, Avicenna—al-Shifa Logic
**Activate:** why question, causal claim, scientific explanation
**Outputs:** mechanism graph, missing link, certainty limits

### M04 — bayesian_plausibility
Reason under incomplete information and update plausibility from evidence.
**Sources:** Jaynes—Probability Theory, Deep Learning
**Activate:** uncertainty, forecast, diagnosis, evidence conflict
**Outputs:** relative support, uncertainty drivers, decision thresholds

### M05 — hypothesis_portfolio
Keep multiple genuinely plausible explanations alive until a discriminating observation separates them.
**Sources:** Jaynes—Probability Theory, Judgment in Managerial Decision Making
**Activate:** debugging, diagnosis, causal ambiguity
**Outputs:** live hypotheses, unique predictions, discriminating tests

### M06 — bias_defense
Detect predictable judgment distortions before commitment.
**Sources:** Judgment in Managerial Decision Making
**Activate:** estimate, choice, negotiation, investment, high uncertainty
**Outputs:** bias flags, independent baseline request, reframed alternatives

### M07 — conceptual_synthesis
Interpret the question, build and synthesize concepts before researching blindly.
**Sources:** Smart Thinking
**Activate:** complex open question, research, strategy, design
**Outputs:** concept map, subproblems, relevance criteria

### M08 — lateral_generation
Break fixation and generate structurally different alternatives without inventing facts.
**Sources:** Lateral Thinking Course, Smart Thinking
**Activate:** fixation, creative design, binary framing, stalled plan
**Outputs:** baseline, reversible alternative, non-obvious alternative

### M09 — robust_optimization
Define objective, feasible set and trade-offs; reject infeasible options before ranking.
**Sources:** Convex Optimization
**Activate:** optimization, allocation, planning, ranking
**Outputs:** feasible set, dominated options, trade-off frontier

### M10 — sensitivity_reversal
Find the smallest plausible change that flips the preferred action.
**Sources:** Convex Optimization, Judgment in Managerial Decision Making
**Activate:** decision under uncertain inputs, cost/benefit, ranking
**Outputs:** reversal thresholds, fragility label, low-regret option

### M11 — generalization_validation
Detect overfit to one prompt/example/source and require held-out or edge checks.
**Sources:** Deep Learning
**Activate:** model choice, pattern inference, rule creation, automation
**Outputs:** holdout check, edge cases, overfit risk

### M12 — ensemble_diversity
Treat diversity and independence as conditions for meaningful ensemble/council evidence.
**Sources:** Deep Learning, modern multi-agent research
**Activate:** Council, high common-mode risk
**Outputs:** reasoning families, independence map, synthesis weights

### M13 — abstraction_representation
Choose representations and abstraction boundaries that simplify the real problem.
**Sources:** SICP
**Activate:** software design, data modeling, complex system
**Outputs:** abstraction boundaries, representation choice, invariants

### M14 — state_process_reasoning
Distinguish procedure description from process behavior and make state transitions explicit.
**Sources:** SICP, Designing Bots
**Activate:** workflow, agent loop, browser/computer state, long-running task
**Outputs:** state machine, transition invariants, reconciliation points

### M15 — contracts_assertions_verification
Turn assumptions into contracts/assertions and verify them continuously.
**Sources:** The Pragmatic Programmer, Code Complete
**Activate:** coding, integration, tool contract, data pipeline
**Outputs:** contracts, assertions, failure responses

### M16 — reversibility_tracer_prototype
Use reversible prototypes/tracer paths to reduce uncertainty before full commitment.
**Sources:** The Pragmatic Programmer
**Activate:** new integration, irreversible plan, unknown architecture
**Outputs:** smallest end-to-end test, rollback path, learning target

### M17 — complexity_defensive_construction
Minimize accidental complexity and build defensive checks into construction.
**Sources:** Code Complete, The Pragmatic Programmer
**Activate:** implementation, refactor, production engineering
**Outputs:** complexity hotspots, defensive checks, review/test plan

### M18 — conversation_context_recovery
Maintain intent/context, handle ambiguity, confirm consequential actions and recover from errors.
**Sources:** Designing Bots
**Activate:** conversation flow, multi-turn task, ambiguous intent, tool failure
**Outputs:** intent state, clarification policy, fallback/recovery

### M19 — situational_perspective
Use multiple communication/perspective lenses while avoiding hidden-trait diagnosis.
**Sources:** Cambridge Handbook of Personality Psychology
**Activate:** stakeholder communication, team conflict, user-facing design
**Outputs:** perspective variants, communication adaptation, uncertainty about people

### M20 — stakes_conflict_premortem
Model goals, obstacles, competing motivations, resource loss and second-order consequences.
**Sources:** The Conflict Thesaurus, Judgment in Managerial Decision Making
**Activate:** strategy, adversarial setting, high downside, stakeholder conflict
**Outputs:** conflicts, failure scenarios, stakes escalation, mitigations

### M21 — audit_evidence_materiality
Require sufficient appropriate evidence, materiality/risk response and traceable judgment.
**Sources:** Global Financial and Audit Research Bundle
**Activate:** audit, assurance, financial reporting, compliance
**Outputs:** evidence assessment, risk response, sign-off need

### M22 — accounting_lineage_controls
Separate model proposal from posting and preserve deterministic arithmetic, idempotency and lineage.
**Sources:** AI-Powered Accounting Skill IFRS/ISA Report
**Activate:** journal entry, reconciliation, accounting automation
**Outputs:** draft entry, lineage, exceptions, approval gate

### M23 — ifrs_issue_pipeline
Structure accounting issues as classification→recognition→measurement→presentation→disclosure with current-authority checks.
**Sources:** Dip IFRS Kit 2025, IFRS Arabic 2018 (historical terminology/context only)
**Activate:** IFRS treatment, financial statement issue
**Outputs:** issue tree, calculation vs judgment split, authority freshness requirement

### M24 — active_information_voi
Choose the next question/search/test by decision value rather than information volume.
**Sources:** Jaynes—Probability Theory, Smart Thinking, modern VoI research
**Activate:** missing information, research, diagnosis, clarification
**Outputs:** next best observation, stop/research decision, interruption cost

### M25 — objective_integrity_goodhart
Protect the true goal from proxy gaming, externalities and second-order effects.
**Sources:** Convex Optimization, Conflict Thesaurus, managerial decision science, modern objective-integrity research
**Activate:** metric optimization, KPI, ranking, automation policy
**Outputs:** proxy-divergence scenarios, guardrails, externalities

### M26 — outcome_calibration
Learn calibration from resolved outcomes rather than verbal confidence.
**Sources:** Deep Learning, Jaynes—Probability Theory, modern calibration research
**Activate:** forecast resolved, decision outcome observed
**Outputs:** error class, calibration record, future adjustment signal

### M27 — execution_proof_recovery
Define observable postconditions, idempotency/retry and reconciliation before side effects.
**Sources:** The Pragmatic Programmer, Code Complete, AI-Powered Accounting Skill
**Activate:** consequential tool action, write, deployment, browser/computer mutation
**Outputs:** execution contract, postcondition, receipt/reconciliation/rollback

### M28 — independent_verifier_council
Preserve proposal independence, challenge weakest premises and synthesize by evidence quality rather than votes.
**Sources:** Deep Learning ensemble intuition, audit independence discipline, modern multi-agent research
**Activate:** high impact, persistent competing plans, common-mode risk
**Outputs:** verifier verdict, reasoning-family clusters, closed option set for Jev if needed
