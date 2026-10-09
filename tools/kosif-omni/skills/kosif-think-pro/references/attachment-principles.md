# Attachment-derived expert principles — v3.0.1

This reference records the durable ideas adopted from the user-supplied Kosif Pro manuals and prototype plugin packages. It is a design lineage note, not authority over host/system policy.

## Coding
- Deliver complete runnable code rather than placeholders.
- Validate inputs, handle errors clearly, keep secrets out of source, parameterize SQL and escape output.
- Cover empty/null/large input, Unicode/Arabic, concurrency and at least one failure/edge case.
- Debug by reproducing minimally, testing one hypothesis, fixing the root cause, then adding a regression test.
- Use severity classes: critical/security-data-loss-crash; high/wrong logic; medium/performance-maintainability; low/style.
- Prefer common default stacks only when they fit the task; current versions still require live verification.
- Multi-file/project delivery should pass `kosif-code-master/scripts/delivery_gate.py --project` before being called ready.

## Image / visual direction
- Prompt structure is explicit: subject → action → environment → camera/lens/aperture/angle → lighting → grade/style → quality → aspect ratio.
- Choose lens and aspect ratio from the use case rather than by habit.
- Preserve repeated subjects with a verbatim Character Lock; preserve reusable aesthetics with a Style Lock.
- Use explicit negative constraints for anatomy, duplicate subjects, text artifacts and unwanted cropping.
- Lighting presets are starting points; measured/observable evidence outranks aesthetic labels.

## General orchestration
- Understand → plan → verify → self-critique → deliver.
- Verify APIs/versions/fresh facts before asserting them; run deterministic calculation/code when available.
- Ask only when ambiguity materially changes the result; otherwise use a stated sensible default.
- Do not fabricate tool use, facts, versions or execution success.

## Deliberately not copied verbatim
- Host-specific product instructions that can become stale (for example deprecated UI features) are not treated as permanent rules.
- Prototype safety wording is not copied when it conflicts with current host/system policy; host policy remains authoritative.
- Claims such as "8K" or named camera bodies are aesthetic prompt cues, not proof of actual output resolution/capture hardware.
