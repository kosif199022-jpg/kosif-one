"""KOSIF Omni MCP server — one tool surface for Claude, ChatGPT and any MCP host.

Standard library only. Two transports share one dispatcher:
  * stdio            — Claude Code / Claude Desktop (.mcpb) / Codex / any local MCP client
  * streamable HTTP  — ChatGPT developer-mode connectors, claude.ai custom connectors,
                       and a REST + OpenAPI facade for ChatGPT Custom GPT Actions
"""

__version__ = "11.11.0"
SERVER_NAME = "kosif-omni"
