---
description: KOSIF Mouse — operate this Windows PC in the background with Claude's own pointer (the user's mouse stays free; gated)
argument-hint: <what to do on the computer, e.g. "افتح الرسام وارسم تفاحة" or "click Save in Notepad">
---
Handle this with the `kosif-mouse` skill:

$ARGUMENTS

Work fast and stay out of the user's way: `kosif_mouse_observe` the window you will work on (`target`, usually `screenshot:false`), then ONE batched `kosif_mouse_act` with `window` set to that window and an `expect` on the step that proves success; read each step's `route` and the `changes` list instead of taking another screenshot (`kosif_mouse_live` tells you what happened). Default `mode:"auto"`: background first, Claude's own pen for taps/drawing, the keyboard focus only briefly when a step needs it. For Excel work inside an open workbook use `kosif_excel`. Use refs (`e3`) or text `target`s; let Jev settle close calls and ask the user when it cannot. Stop and ask before anything the gate marks `needs_approval` (send, delete, install, settings, changing someone else's Excel data), hand passwords/CAPTCHA/2FA/payment/admin windows to the user, and remind them that moving the mouse to the top-left corner or holding Esc stops the run.
