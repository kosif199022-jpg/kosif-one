"""python -m kosif_mcp  — see --help."""
from __future__ import annotations

import argparse
import json
import os
import sys


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="kosif-omni", description="KOSIF Omni MCP server (stdio or HTTP)")
    ap.add_argument("--http", action="store_true", help="serve streamable HTTP + REST instead of stdio")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--token", default=os.environ.get("KOSIF_MCP_TOKEN"), help="bearer token (or KOSIF_MCP_TOKEN)")
    ap.add_argument("--no-auth", action="store_true", help="disable auth (loopback only)")
    ap.add_argument("--public-url", help="public HTTPS URL used in /openapi.json and the host allowlist")
    ap.add_argument("--allow-host", action="append", default=[], help="extra Host header value to accept")
    ap.add_argument("--workspace", action="append", default=[], help="folder file-tools may read (repeatable)")
    ap.add_argument("--corpus", help="folder of your text files for kosif_corpus_* (KOSIF_CORPUS_DIR)")
    ap.add_argument("--console", action="store_true", help="serve HTTP and open the interactive console in the browser")
    ap.add_argument("--list-tools", action="store_true")
    ap.add_argument("--print-openapi", action="store_true")
    ap.add_argument("--profile", default="chatgpt", choices=["chatgpt", "full"])
    ap.add_argument("--server-url", default="https://YOUR-HTTPS-HOST")
    ap.add_argument("--version", action="store_true")
    a = ap.parse_args(argv)

    if a.workspace:
        existing = [p for p in (os.environ.get("KOSIF_ALLOWED_DIRS") or "").split(os.pathsep) if p]
        os.environ["KOSIF_ALLOWED_DIRS"] = os.pathsep.join(existing + [os.path.abspath(w) for w in a.workspace])
    if a.corpus:
        os.environ["KOSIF_CORPUS_DIR"] = os.path.abspath(a.corpus)

    if a.version:
        from . import __version__
        print(__version__)
        return 0
    if a.list_tools:
        sys.stdout.reconfigure(encoding="utf-8")
        from .registry import REGISTRY
        from . import protocol  # noqa: F401
        for t in REGISTRY.values():
            print(f"{t.name:32} {'RO' if t.read_only else 'RW'} {'gpt' if t.gpt else '   '}  {t.description[:90]}")
        print(f"\n{len(REGISTRY)} tools", file=sys.stderr)
        return 0
    if a.print_openapi:
        from . import openapi
        sys.stdout.reconfigure(encoding="utf-8")
        print(json.dumps(openapi.build(a.server_url, a.profile), ensure_ascii=False, indent=2))
        return 0
    if a.http or a.console:
        from . import protocol  # noqa: F401
        from . import http_server
        http_server.serve(a.host, a.port, token=a.token, no_auth=a.no_auth, public_url=a.public_url,
                          extra_hosts=a.allow_host, open_browser=a.console)
        return 0
    from . import stdio_server
    stdio_server.serve()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
