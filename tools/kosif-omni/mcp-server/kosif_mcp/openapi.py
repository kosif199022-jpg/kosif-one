"""OpenAPI 3.1 for ChatGPT Custom GPT Actions, generated from the same tool registry."""
from __future__ import annotations

import copy

from . import __version__
from . import protocol  # noqa: F401  (ensures every tool is registered)
from .registry import REGISTRY


def _clean(schema: dict) -> dict:
    s = copy.deepcopy(schema)
    s.setdefault("type", "object")
    s.setdefault("properties", {})
    return s


def build(server_url: str = "https://YOUR-HTTPS-HOST", profile: str = "chatgpt") -> dict:
    tools = [t for t in REGISTRY.values() if profile == "full" or t.gpt]
    paths = {}
    for t in tools:
        desc = t.description if len(t.description) <= 300 else t.description[:297] + "..."
        paths[f"/v1/tools/{t.name}"] = {
            "post": {
                "operationId": t.name,
                "summary": (t.title or t.name)[:100],
                "description": desc,
                "x-openai-isConsequential": bool(not t.read_only),
                "requestBody": {"required": True, "content": {"application/json": {"schema": _clean(t.schema)}}},
                "responses": {
                    "200": {"description": "Tool result",
                            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ToolResult"}}}},
                    "401": {"description": "Missing or wrong token"},
                },
            }
        }
    return {
        "openapi": "3.1.0",
        "info": {"title": "KOSIF Omni", "version": __version__,
                 "description": "KOSIF Omni tools for ChatGPT Actions. Each operation is one deterministic tool."},
        "servers": [{"url": server_url}],
        "paths": paths,
        "components": {
            "securitySchemes": {"bearerAuth": {"type": "http", "scheme": "bearer"}},
            "schemas": {"ToolResult": {"type": "object", "properties": {
                "ok": {"type": "boolean"}, "result": {"description": "Tool output (object or text)"},
                "error": {"type": "string"}, "truncated": {"type": "boolean"}}}},
        },
        "security": [{"bearerAuth": []}],
    }
