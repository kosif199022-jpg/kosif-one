# Host-tool routing

Build live inventory from the current host, normalize aliases, apply auth/cost/human-checkpoint filters, score by target ownership and capability fit, and choose the minimum relevant set. For writes use one owning writer when possible and verify postconditions. Two repeated route failures should trigger a circuit breaker and at most one bounded fallback. Local browser/device execution routes through KOSIF Computer; BrowserJev/Jev decide only among bounded observed candidates.
