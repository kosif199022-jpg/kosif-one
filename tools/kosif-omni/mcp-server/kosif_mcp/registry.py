"""Tool registry: one declaration feeds MCP, REST and OpenAPI."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable


class ToolError(Exception):
    """Raised by handlers for expected, user-facing failures (becomes isError=true)."""


@dataclass
class Tool:
    name: str
    description: str
    schema: dict
    handler: Callable[[dict], Any]
    title: str = ""
    read_only: bool = True
    destructive: bool = False
    idempotent: bool = True
    open_world: bool = False
    gpt: bool = False  # part of the ChatGPT-Actions profile (Actions cap the operation count)

    def annotations(self) -> dict:
        return {
            "title": self.title or self.name,
            "readOnlyHint": self.read_only,
            "destructiveHint": self.destructive,
            "idempotentHint": self.idempotent,
            "openWorldHint": self.open_world,
        }


REGISTRY: dict[str, Tool] = {}


def tool(name: str, description: str, schema: dict | None = None, *, title: str = "",
         read_only: bool = True, destructive: bool = False, idempotent: bool = True,
         open_world: bool = False, gpt: bool = False):
    def deco(fn: Callable[[dict], Any]):
        if name in REGISTRY:
            raise RuntimeError(f"duplicate tool {name}")
        REGISTRY[name] = Tool(name, description, schema or obj({}), fn, title, read_only,
                              destructive, idempotent, open_world, gpt)
        return fn
    return deco


# ── JSON-Schema helpers ──────────────────────────────────────────────────────
def obj(props: dict, required: list[str] | None = None, extra: bool = False) -> dict:
    s: dict = {"type": "object", "properties": props, "additionalProperties": extra}
    if required:
        s["required"] = required
    return s


def S(desc: str = "", **kw) -> dict:
    return {"type": "string", "description": desc, **kw}


def N(desc: str = "", **kw) -> dict:
    return {"type": "number", "description": desc, **kw}


def I(desc: str = "", **kw) -> dict:
    return {"type": "integer", "description": desc, **kw}


def B(desc: str = "", **kw) -> dict:
    return {"type": "boolean", "description": desc, **kw}


def A(items: dict | None = None, desc: str = "", **kw) -> dict:
    return {"type": "array", "items": items or {}, "description": desc, **kw}


def O(desc: str = "", **kw) -> dict:
    return {"type": "object", "description": desc, "additionalProperties": True, **kw}


def get_tool(name: str) -> Tool:
    try:
        return REGISTRY[name]
    except KeyError:
        raise ToolError(f"unknown tool: {name}") from None
