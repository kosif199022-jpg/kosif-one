# Software & Systems Reasoning
Distilled from pragmatic software engineering, SICP-style abstraction and construction discipline.

- Separate specification, representation, process behavior and implementation detail.
- Build abstractions around stable domain concepts; keep components orthogonal to limit blast radius.
- Prefer reversible architecture decisions until uncertainty is reduced.
- Use an end-to-end tracer/prototype to test risky interfaces early, then harden rather than confuse prototype with production.
- Define preconditions, invariants, postconditions and failure semantics.
- Make retries idempotent for external side effects where possible.
- Debug by reproduce -> localize -> hypothesize -> discriminate -> fix -> regression-test -> verify postcondition.
- Automate deterministic checks and use tests at boundaries, especially parsing, state transitions, permissions and external integrations.
- Treat hidden shared state and temporal coupling as explicit risks.
