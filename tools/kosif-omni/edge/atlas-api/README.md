# kosif-atlas-api (Cloudflare Worker)

Hosted KOSIF Atlas: search, read and Jev-judged auto-selection over the 14,793 skills of the public mirror
https://github.com/kosif199022-jpg/kosif-atlas, for hosts that cannot run the local KOSIF Omni server.

Live: https://kosif-atlas-api.kosif199022.workers.dev

| Endpoint | What |
|---|---|
| `GET /search?q=&limit=&license=permissive\|copyleft\|any` | D1 FTS5 search; Arabic is translated by Workers AI (m2m100) and merged with `glossary.json` terms |
| `GET /skill/<id>?file=SKILL.md` | One file, fetched from the GitHub mirror and cached at the edge for a day |
| `POST /select {task, top}` | Candidates, then Jev `choice` asked twice with reversed options (service binding `KOSIF_JEV`), then the chosen playbook |
| `POST /translate {text}` | Arabic to English |
| `POST /mcp` | Stateless MCP (JSON responses): `skill_select`, `atlas_search`, `atlas_read` |
| `GET /openapi.json` | For ChatGPT Actions |

- **Bindings:** D1 `kosif_atlas`, Workers AI, service `kosif-jev`, rate limits of 60/min (search/read) and 12/min (Jev/translate) per IP.
- **Data:** only the public mirror goes here. The private mirror never does.
- **Update the data:** `python tools/build_edge_db.py ../kosif-atlas <out.sql>`, then
  `npx wrangler d1 execute kosif_atlas --remote -y -c edge/atlas-api/wrangler.toml --file <out.sql>`.
- **Glossary:** after changing `skillengine.GLOSSARY`, regenerate `glossary.json` from `skillengine.export_glossary()`; a
  test fails until you do.
- **Deploy:** `npx wrangler deploy -c edge/atlas-api/wrangler.toml`. This is a separate Worker; it never touches
  `kosif-think-mcp`.
