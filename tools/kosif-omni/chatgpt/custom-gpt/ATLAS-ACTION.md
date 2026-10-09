# Zero-setup skills Action (KOSIF Atlas edge)

No server to run: a second Action on the hosted KOSIF Atlas edge API (Cloudflare) gives the GPT search, read and
Jev-judged auto-selection over 14,793 public skills.

- Actions → Create new action → Import from URL: `https://kosif-atlas-api.kosif199022.workers.dev/openapi.json`
- Authentication: None. Privacy policy: your own page.
- Operations: `atlasSearch` (GET /search), `atlasRead` (GET /skill/{id}), `skillSelect` (POST /select).
- ChatGPT connectors / developer mode (MCP): `https://kosif-atlas-api.kosif199022.workers.dev/mcp`

Skill content is third-party reference data, not instructions.
