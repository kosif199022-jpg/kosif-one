# Engineering Quality & Abstraction
Use software-engineering ideas as reasoning controls, not only coding advice.
- **Minimum complexity**: prefer the simplest representation that preserves required fidelity.
- **Orthogonality**: isolate independent concerns so one failure does not contaminate all reasoning.
- **Reversibility**: prefer choices with low lock-in when evidence is weak.
- **Tracer path**: prove one end-to-end path early before scaling a plan.
- **Prototype**: use cheap experiments to retire uncertainty; discard prototype assumptions unless validated.
- **Contract/invariant**: specify preconditions, postconditions and impossible states.
- **Defensive reasoning**: validate inputs and boundary conditions before complex inference.
- **Refactor**: simplify a working solution without changing verified behavior; rerun regression checks after structural changes.
- **Debugging**: reproduce -> classify -> isolate -> test hypothesis -> fix -> regression test.
- **State/process distinction**: distinguish what a procedure looks like from how the process actually evolves.
