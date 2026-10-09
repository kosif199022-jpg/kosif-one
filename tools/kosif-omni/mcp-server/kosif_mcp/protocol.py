"""JSON-RPC 2.0 / MCP dispatcher shared by the stdio and HTTP transports."""
from __future__ import annotations

import json
import sys
import traceback
from typing import Any

from . import SERVER_NAME, __version__
from . import atlas, corpus, desktop, jev, office, office_live, replicate, skillengine, tools_core, tools_council, tools_scripts  # noqa: F401  (registers tools)
from .paths import SandboxError, resolve_inside
from .registry import REGISTRY, ToolError, get_tool
from .skillindex import commands, skills

SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"]
MAX_TEXT = 180_000

INSTRUCTIONS = (
    "KOSIF Omni: deterministic reasoning gates, a 1,040-member Genius Council, audit/IFRS, code & web audits, "
    "image/video prompt engineering, cinema/lighting math, audio/image measurement, gated browser/computer/GitHub "
    "preflights and a local full-text corpus. Start with kosif_route (or kosif_capabilities), then "
    "kosif_skill_read for the playbook. Tool success is not task success: verify postconditions; never invent "
    "receipts; human checkpoints (payments, CAPTCHA, MFA, passwords) stay human.")


def log(*a) -> None:
    print("[kosif-omni]", *a, file=sys.stderr, flush=True)


def _err(code: int, message: str, data: Any = None) -> dict:
    e = {"code": code, "message": message}
    if data is not None:
        e["data"] = data
    return e


# ── minimal JSON-Schema validation (top-level properties) ────────────────────
_TYPES = {"string": str, "boolean": bool, "array": list, "object": dict}


def validate(schema: dict, args: dict) -> None:
    if not isinstance(args, dict):
        raise ToolError("arguments must be an object")
    for r in schema.get("required", []):
        if r not in args or args[r] in (None, ""):
            raise ToolError(f"missing required argument: {r}")
    props = schema.get("properties", {})
    for k, v in args.items():
        spec = props.get(k)
        if spec is None:
            if schema.get("additionalProperties") is False:
                raise ToolError(f"unknown argument: {k}")
            continue
        t = spec.get("type")
        if v is None:
            continue
        if t == "integer":
            if isinstance(v, bool) or not isinstance(v, int):
                if isinstance(v, float) and v.is_integer():
                    args[k] = v = int(v)
                else:
                    raise ToolError(f"{k} must be an integer")
        elif t == "number":
            if isinstance(v, bool) or not isinstance(v, (int, float)):
                raise ToolError(f"{k} must be a number")
        elif t in _TYPES and not isinstance(v, _TYPES[t]):
            raise ToolError(f"{k} must be of type {t}")
        if "enum" in spec and v not in spec["enum"]:
            raise ToolError(f"{k} must be one of {spec['enum']}")
        if t in ("integer", "number"):
            if "minimum" in spec and v < spec["minimum"]:
                raise ToolError(f"{k} must be >= {spec['minimum']}")
            if "maximum" in spec and v > spec["maximum"]:
                raise ToolError(f"{k} must be <= {spec['maximum']}")


def call_tool(name: str, args: dict) -> tuple[Any, bool]:
    """Returns (value, is_error)."""
    try:
        t = get_tool(name)
        validate(t.schema, args)
        return t.handler(args), False
    except (ToolError, SandboxError, FileNotFoundError, NotADirectoryError) as e:
        return {"error": str(e)}, True
    except Exception as e:  # pragma: no cover - defensive
        log("tool crashed:", name, "".join(traceback.format_exception_only(type(e), e)).strip())
        return {"error": f"internal error in {name}: {type(e).__name__}: {e}"}, True


def format_result(value: Any, is_error: bool) -> dict:
    images = value.pop("_images", None) if isinstance(value, dict) else None  # screenshots → MCP image blocks
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, indent=2, default=str)
    truncated = len(text) > MAX_TEXT
    if truncated:
        text = text[:MAX_TEXT] + f"\n…[truncated {len(text) - MAX_TEXT} chars]"
    res: dict = {"content": [{"type": "text", "text": text}], "isError": is_error}
    for im in images or []:
        res["content"].append({"type": "image", "data": im["data"], "mimeType": im["mime"]})
    if isinstance(value, dict) and not truncated:
        res["structuredContent"] = value
    return res


def tool_descriptor(t) -> dict:
    return {"name": t.name, "title": t.title or t.name, "description": t.description,
            "inputSchema": t.schema, "annotations": t.annotations()}


# ── resources / prompts ──────────────────────────────────────────────────────
def _resources_list() -> list[dict]:
    return [{"uri": f"kosif://skills/{n}", "name": n, "title": n, "mimeType": "text/markdown",
             "description": v["description"][:300]} for n, v in skills().items()]


def _resource_read(uri: str) -> dict:
    if not uri.startswith("kosif://skills/"):
        raise ToolError("unknown resource uri")
    rest = uri[len("kosif://skills/"):]
    name, _, path = rest.partition("/")
    sk = skills()
    if name not in sk:
        raise ToolError(f"unknown skill {name}")
    f = resolve_inside(sk[name]["dir"], path or "SKILL.md")
    if not f.is_file():
        raise ToolError("no such file")
    mime = "text/markdown" if f.suffix == ".md" else ("application/json" if f.suffix == ".json" else "text/plain")
    return {"contents": [{"uri": uri, "mimeType": mime, "text": f.read_text(encoding="utf-8", errors="replace")[:400_000]}]}


def _prompts_list() -> list[dict]:
    return [{"name": n, "description": c["description"],
             "arguments": [{"name": "arguments", "description": c["argument_hint"] or "free text", "required": False}]}
            for n, c in commands().items()]


def _prompt_get(name: str, args: dict) -> dict:
    cm = commands()
    if name not in cm:
        raise ToolError(f"unknown prompt {name}")
    text = cm[name]["body"].replace("$ARGUMENTS", str((args or {}).get("arguments", ""))).strip()
    return {"description": cm[name]["description"],
            "messages": [{"role": "user", "content": {"type": "text", "text": text}}]}


# ── dispatcher ───────────────────────────────────────────────────────────────
def handle(msg: dict) -> dict | None:
    """Handle one JSON-RPC message. Returns a response dict, or None for notifications/responses."""
    if not isinstance(msg, dict) or msg.get("jsonrpc") != "2.0":
        return {"jsonrpc": "2.0", "id": None, "error": _err(-32600, "invalid request")}
    method, mid = msg.get("method"), msg.get("id")
    if method is None:  # a response to something we never sent
        return None
    is_note = "id" not in msg
    params = msg.get("params") or {}

    def ok(result):
        return None if is_note else {"jsonrpc": "2.0", "id": mid, "result": result}

    def fail(code, message, data=None):
        return None if is_note else {"jsonrpc": "2.0", "id": mid, "error": _err(code, message, data)}

    try:
        if method == "initialize":
            want = params.get("protocolVersion")
            ver = want if want in SUPPORTED_VERSIONS else SUPPORTED_VERSIONS[0]
            return ok({"protocolVersion": ver,
                       "capabilities": {"tools": {"listChanged": False},
                                        "resources": {"listChanged": False, "subscribe": False},
                                        "prompts": {"listChanged": False}, "logging": {}},
                       "serverInfo": {"name": SERVER_NAME, "title": "KOSIF Omni", "version": __version__},
                       "instructions": INSTRUCTIONS})
        if method.startswith("notifications/"):
            return None
        if method == "ping":
            return ok({})
        if method == "logging/setLevel":
            return ok({})
        if method == "tools/list":
            return ok({"tools": [tool_descriptor(t) for t in REGISTRY.values()]})
        if method == "tools/call":
            name = params.get("name")
            if name not in REGISTRY:
                return fail(-32602, f"unknown tool: {name}")
            val, is_err = call_tool(name, dict(params.get("arguments") or {}))
            return ok(format_result(val, is_err))
        if method == "resources/list":
            return ok({"resources": _resources_list()})
        if method == "resources/templates/list":
            return ok({"resourceTemplates": [{"uriTemplate": "kosif://skills/{name}/{path}", "name": "skill-file",
                                              "description": "Any text file inside a bundled skill",
                                              "mimeType": "text/markdown"}]})
        if method == "resources/read":
            return ok(_resource_read(str(params.get("uri", ""))))
        if method == "prompts/list":
            return ok({"prompts": _prompts_list()})
        if method == "prompts/get":
            return ok(_prompt_get(str(params.get("name", "")), params.get("arguments") or {}))
        return fail(-32601, f"method not found: {method}")
    except (ToolError, SandboxError) as e:
        return fail(-32602, str(e))
    except Exception as e:  # pragma: no cover
        log("dispatcher error:", repr(e))
        return fail(-32603, "internal error")
