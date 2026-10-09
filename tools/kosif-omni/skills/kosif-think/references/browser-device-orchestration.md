# Browser/device orchestration

Browser: `observe -> snapshot -> action graph -> local rank -> Jev if ambiguous -> risk gate -> lease -> act -> settle -> verify -> delta/receipt`.

Desktop: `workflow -> UIA/FlaUI/app/dialog/watch -> Playwright/CDP -> DevTools -> screenstate -> vision/OCR -> AutoHotkey/coordinate fallback`.

Long tasks carry session/plan ID, goal, expected observable completion, action/Jev/recovery/stall budgets, deadline, graph revision, cancellation flag, execution owner/lease and last verified postcondition. Prefer event/delta updates over full snapshots.
