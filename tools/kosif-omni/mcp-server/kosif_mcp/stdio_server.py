"""MCP over stdio: newline-delimited JSON-RPC on stdin/stdout (logs go to stderr only)."""
from __future__ import annotations

import json
import sys

from . import protocol
from .paths import set_transport


def serve() -> None:
    set_transport("stdio")
    inp = sys.stdin.buffer
    out = sys.stdout.buffer
    protocol.log("stdio ready")
    for raw in inp:
        raw = raw.strip()
        if not raw:
            continue
        try:
            msg = json.loads(raw.decode("utf-8"))
        except ValueError:
            resp = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "parse error"}}
            out.write((json.dumps(resp) + "\n").encode("utf-8"))
            out.flush()
            continue
        batch = msg if isinstance(msg, list) else [msg]
        replies = [r for r in (protocol.handle(m) for m in batch) if r is not None]
        if not replies:
            continue
        payload = replies if isinstance(msg, list) else replies[0]
        out.write((json.dumps(payload, ensure_ascii=False) + "\n").encode("utf-8"))
        out.flush()
