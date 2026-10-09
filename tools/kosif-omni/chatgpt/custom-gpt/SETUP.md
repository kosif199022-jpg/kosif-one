# Custom GPT setup (generated)

1. Run the server on a machine you control:
   `python mcp-server/run.py --http --token <LONG-RANDOM> --workspace <folder-you-allow> [--corpus <your-text-folder>]`
2. Put it behind HTTPS (tunnel or reverse proxy). Never expose plain HTTP.
3. ChatGPT → Explore GPTs → Create → Configure:
   - Instructions: paste `instructions.md` (3999 / 8000 chars).
   - Knowledge: upload the files in `knowledge/` (12 files, limit is 20).
   - Conversation starters: from `conversation-starters.md`.
   - Actions → Create new action → import `openapi.json` after replacing `servers[0].url` with your HTTPS URL
     (or import from `https://<host>/openapi.json`). Authentication: API Key → Bearer → paste the token.
4. Test: ask "kosif_doctor" and "kosif_route: راجع قيود محاسبية".
5. Optional, zero setup: add the KOSIF Atlas skills Action from `ATLAS-ACTION.md` (https://kosif-atlas-api.kosif199022.workers.dev/openapi.json).
The Actions profile exposes 29 read-only tools (ChatGPT limits Actions size); the MCP endpoint exposes all 65.
