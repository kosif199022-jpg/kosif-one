# Host adapters — one package, six surfaces

| Surface | How skills load | How tools arrive | Notes |
|---|---|---|---|
| **Claude Code** | native: `skills/*/SKILL.md`, `commands/`, `agents/` from the plugin | MCP server `kosif-omni` from the plugin's `.mcp.json`; tools appear with a host-added prefix (typically `mcp__plugin_kosif-omni_kosif-omni__<tool>`) | Full file access under your project (cwd is allowed). Slash commands: `/kosif-omni:kosif`, `:council`, `:cinema`, `:audit`, `:doctor`… |
| **Claude Desktop** | `.mcpb` extension for the tools; skills via Settings → Capabilities → Skills (zip per skill) or a Project with `claude/project-instructions.md` | MCP tools of the `.mcpb` | Choose the allowed folder + corpus folder in the extension settings. |
| **claude.ai (web)** | upload skill zips; add a Project with instructions | custom connector pointing at the HTTPS MCP endpoint (`/mcp`) if you host it | Skills with scripts run in the code-execution sandbox (no corpus). |
| **ChatGPT plugin / app** (the zip format of your earlier plugins) | `skills/` + `.codex-plugin/plugin.json` | optional `kosif-think` remote MCP via `.app.json`/`mcp.json` | `.app.json` is the 72-app mesh: discovery metadata, **not** proof an app is connected. |
| **ChatGPT Custom GPT** | paste `chatgpt/custom-gpt/instructions.md` (≤ 8,000 chars); upload knowledge files | **Actions**: import `openapi.json` (REST facade of the same tools) with Bearer auth | Needs the HTTPS server running (`python mcp-server/run.py --http …` behind a tunnel/reverse proxy). |
| **ChatGPT developer-mode connector** | — | add the HTTPS `/mcp` URL as an MCP connector | Same server, MCP transport. |
| **Codex** | `.codex-plugin/plugin.json` + `skills/` | `.mcp.json`/stdio | Same as Claude Code. |

## Tool discovery rule
At the start of a task list what is actually callable. The same capability may show up as: native skill, `kosif_*` MCP tool (possibly prefixed), a remote KOSIF backend tool, or only a local script. Prefer in that order, and say which you used.

## Capability tiers (state your tier in the receipt)
- **T0 prompt-only** — playbook text, no tools. Allowed, but label "unverified".
- **T1 local scripts** — `python skills/<skill>/scripts/<script>.py` with JSON on stdin (needs Python 3.9+; numpy/Pillow only for image/audio).
- **T2 MCP tools** — the `kosif-omni` server (stdio or HTTP).
- **T3 live KOSIF backend** — remote `kosif-think` MCP + secure executor. Optional; never assumed.

## When no MCP server is available (e.g. a plain ChatGPT chat with only the plugin zip)
Read the specialist `SKILL.md`, follow it, and run scripts only if the host has a code interpreter. Deterministic checks you can do yourself with Python in the sandbox: arithmetic (Decimal), probability/Bayes, contrast ratios, lighting math, ledger balance. If you cannot run them, say the result is unverified instead of guessing.

## Remote providers named in the original plugins (not shipped here)
KOSIF Think backend (Council-500 harvest, Secure Executor), KOSIF Computer / Remote Desktop, KOSIF Voice Director, KOSIF Engineering Copilot, KOSIF WhatsApp mobile-core, Jev Bridge / Jev Browser providers, TinyFish. Use them only when the host exposes them; their local equivalents here are: `kosif_full_pro_entry` + gates, `kosif_action_gate` / `kosif_ui_ground`, `kosif-voice`, `kosif_gh_preflight` + release-bridge, the guarded WhatsApp bridge, `kosif_jev_packet` (packets only — Jev itself is a host tool).

## Naming
Claude Code adds a prefix to plugin tools (typically `mcp__plugin_<plugin>_<server>__<tool>`); ChatGPT shows the connector's tool names. Refer to tools by their base name (`kosif_route`) and let the host add prefixes.
