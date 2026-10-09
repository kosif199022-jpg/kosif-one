# Jev Browser Provider Contract
Imported from `kosif-jev-browser` 1.0.0.

- Inspect fresh browser/page state first.
- Build a compact Indexed Action Space with stable IDs, actionable state, risk class and expected postcondition.
- Use deterministic choice for obvious low-risk actions; escalate to Jev only for ambiguity, conflict or meaningful side-effect risk.
- Execute through KOSIF Computer/host browser routes; prefer persistent Playwright/CDP, then DevTools/UIA/dialog/screen-state, then vision/coordinates last.
- Verify consequential actions from fresh URL/title/DOM/dialog/network/screen/receipt evidence.
- On failure, refresh the action space and avoid blind duplicate writes.
- CAPTCHA/MFA/consent/payment remain human checkpoints.
