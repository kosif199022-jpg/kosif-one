---
name: kosif-whatsapp
description: Guardrailed WhatsApp messaging through the user's own JEV WhatsApp bridge (ChatGPT Action / local server). Manual, confirmed, low-volume sends only — recipients and message shown and explicitly approved before every send; idempotent request ids; no auto-replies, no chat reading, no groups, no bulk marketing. Use for "ارسل رسالة واتساب", bridge setup, status, troubleshooting.
---
# KOSIF WhatsApp (guarded)

This skill drives the bridge in `modules/whatsapp-bridge/` (a small server the user owns). The bridge is deliberately narrow; this skill keeps it that way.

## What it can do
- Check bridge status (`GET /v1/whatsapp/status`).
- Send **one explicitly approved message** to **up to 20 explicitly listed numbers**, spaced by the bridge's delay (`POST /v1/whatsapp/send`, needs a stable `requestId`).
- Help deploy/operate it (`modules/whatsapp-bridge/README.md`, `docs/deployment-checklist.md`).

## What it must not do
No automatic or scheduled replies · no reading, searching or summarising chats or contacts · no group sends · no mass/marketing blasts or scraping numbers · no sending to people who have not agreed to receive the message · no attempts to evade WhatsApp rate limits or bans. Unofficial WhatsApp-Web automation can violate platform terms and get the account restricted; for business-scale messaging use the official WhatsApp Cloud API.

## Send protocol (every time)
1. Collect: exact message text, exact numbers (country-code format), purpose, and that recipients consented.
2. **Show** the user: message · recipients (masked is fine) · count · that it will really be sent.
3. Get an explicit "send" in chat for *this* message. Earlier approval does not carry over.
4. Generate a fresh `requestId` (≥ 8 chars, e.g. `req-<date>-<n>`). **Retry with the same id** after a timeout — the bridge returns the stored result instead of duplicating. A *different* message needs a *new* id (`IDEMPOTENCY_CONFLICT` otherwise).
5. Check status is `ready` first; if `qr_required`/`auth_failure`/`disconnected`, stop and guide the user (QR pairing is theirs to do on the phone).
6. Report per-recipient results from the response. Success = the bridge's per-recipient result, not "the request was accepted".

## Secrets
The bridge token lives in the server `.env` and in the host's secret field for the Action. Never print it, paste it into chat, put it in OpenAPI, or commit it. Rotate it via the README procedure.

## Hosts
- **ChatGPT**: import `modules/whatsapp-bridge/docs/chatgpt-action-openapi.yaml` into a Custom GPT Action after replacing the server URL with your real HTTPS host; keep Bearer auth in the Action secrets; add an instruction to confirm before every send.
- **Claude / others**: call the same HTTPS API only through a tool/connector the user has configured; otherwise provide the `curl` commands from the README and let the user run them.
