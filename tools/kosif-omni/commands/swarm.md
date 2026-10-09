---
description: KOSIF Swarm — run up to 30 specialist agents in parallel (each may delegate down to Claude Code's 3-layer limit), then integrate and gate the result
argument-hint: <task> [--all | --n=K]
---
Run the KOSIF Swarm on:

$ARGUMENTS

This needs Claude Code (the Agent tool). On a host without it, say so and run the task with the `kosif-omni` skill instead.

1. **Plan (you are level 0).** Split the task into independent workstreams and pick one specialist per workstream from the roster below. Default: only the specialists the task needs. `--all`: all 30, each given the facet of the task that matches its specialty (skip any with no honest facet and say which). `--n=K`: the K best fits.
2. **Launch in one message.** One Agent call per specialist (`subagent_type: "kosif-omni:<name>"`), all in the same message so they run in parallel. Each brief is self-contained: goal, the facet it owns, inputs (paths/URLs), constraints, the files it may write (disjoint across agents), and "you may delegate under the Swarm protocol". Specialists can launch their own helpers; Claude Code stops nesting three layers below this conversation.
3. **Capacity.** At most `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` subagents run at once across all layers (Claude Code default 20). If a launch fails with "Concurrent subagent limit reached", do not retry in a loop — launch the rest as earlier ones finish.
4. **Don't duplicate.** While they run, do not redo their work; you'll be notified as each finishes.
5. **Integrate and gate.** When all have reported: launch `kosif-omni:kosif-integrator` with every report verbatim, then `kosif-omni:kosif-quality-gate` on the integrated deliverable. For high-stakes decisions add `kosif-omni:kosif-red-team`.
6. **Approval.** Ask the user before any item an agent returned under "Needs approval" (deploys, pushes, publishing, messages, payments, deletions).
7. **Report.** The deliverable; a swarm table (agent · facet · helpers launched · outcome · confidence); the gate verdict; open risks. Never report an agent's work you did not receive.

Each specialist has its own persona, mentor lens, mental mood, inner team, tool allowlist and a pack of up to 8 KOSIF Atlas skills (read with `kosif_atlas_read`), so they will disagree. Keep that dissent visible; the integrator weighs it by evidence, not by vote.

**Roster (30)**
- Research & reasoning: `kosif-deep-researcher`, `kosif-fact-checker`, `kosif-strategist`, `kosif-probability-analyst`
- Engineering: `kosif-architect`, `kosif-backend-engineer`, `kosif-frontend-engineer`, `kosif-test-engineer`, `kosif-debugger`, `kosif-security-auditor`, `kosif-code-reviewer`, `kosif-devops-engineer`, `kosif-data-engineer`, `kosif-web-operator`
- Language & creative: `kosif-arabic-editor`, `kosif-storyteller`, `kosif-cinema-director`, `kosif-image-prompt-engineer`, `kosif-video-producer`, `kosif-lighting-designer`, `kosif-audio-engineer`, `kosif-voice-director`, `kosif-visual-critic`
- Business & governance: `kosif-ifrs-auditor`, `kosif-product-manager`, `kosif-ux-accessibility`, `kosif-prompt-engineer`, `kosif-atlas-scout`, `kosif-integrator`, `kosif-quality-gate`

Also available: `kosif-red-team`, `kosif-verifier`, `kosif-council-chair`.
