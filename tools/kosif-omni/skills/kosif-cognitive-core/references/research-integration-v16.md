# Modern Research Integration — 1.6
These notes extend the book-derived mechanisms with recent empirical cautions.

- Multi-agent debate can improve performance, but benefits are stronger when agents/models preserve meaningful diversity; correlated agents are one reasoning family, not independent confirmation.
- Counterfactual reasoning remains difficult for LLMs; causal tasks should explicitly separate association, intervention and counterfactual reasoning and use discriminating tests rather than fluent causal narratives.
- Self-reflection can help in some settings but can also destabilize a correct plan when no new evidence arrives. Unsupported revisions are blocked by the verifier.
- Calibration must be judged against outcomes. Verbal confidence or repeated sampling from one model is not a substitute for empirical reliability.
- Counterfactual/perturbed-task testing is used as a generalization check: robustness to changed framing or conditions is stronger evidence of transferable reasoning than success on one familiar formulation.

These findings are design inputs, not guarantees; keep regression tests empirical and task-specific.
