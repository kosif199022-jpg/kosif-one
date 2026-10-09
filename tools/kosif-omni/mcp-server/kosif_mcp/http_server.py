"""Streamable-HTTP MCP endpoint (/mcp), a REST + OpenAPI facade (/v1/tools/*) for ChatGPT Actions, and the KOSIF
console (/): an interactive Arabic web screen over every tool, served from kosif_mcp/console/index.html.

Security posture
  * a bearer token is mandatory unless --no-auth, and --no-auth is only allowed on a loopback bind;
  * token comparison is constant-time; the token is never logged;
  * request bodies are capped (1 MB) and concurrent requests are bounded;
  * file tools only see folders enabled with --workspace / KOSIF_ALLOWED_DIRS (the cwd is NOT implicit);
  * TLS is not terminated here — put it behind a reverse proxy / tunnel that provides HTTPS;
  * the console is a fixed allowlist of static files (no path from the URL ever reaches the filesystem),
    served with a strict CSP (no inline script, same-origin connect only, no framing); it holds no secret,
    and every tool call it makes still needs the bearer token, which stays in the browser.
"""
from __future__ import annotations

import hmac
import json
import os
import secrets
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from . import SERVER_NAME, __version__, openapi, protocol
from .paths import set_transport
from .registry import REGISTRY

CONSOLE = Path(__file__).resolve().parent / "console" / "index.html"
CONSOLE_CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
               "font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; "
               "frame-ancestors 'none'")


def catalog() -> dict:
    """Everything the console needs to build its screens: tools with schemas, capability families, skills."""
    from .skillindex import skills
    from .tools_core import FAMILIES
    return {"name": SERVER_NAME, "version": __version__,
            "tools": [{"name": t.name, "title": t.title, "description": t.description, "read_only": t.read_only,
                       "open_world": t.open_world, "schema": t.schema} for t in REGISTRY.values()],
            "families": [{"id": f["id"], "title": f["title"], "skills": f["skills"], "tools": f["tools"]} for f in FAMILIES],
            "skills": [{"name": n, "description": v["description"][:400]} for n, v in skills().items()]}

MAX_BODY = 1_000_000
REST_OUT_CAP = 90_000
LOOPBACK = {"127.0.0.1", "localhost", "::1"}

UI_DIR = Path(__file__).resolve().parent / "ui"
UI_FILES = {  # URL path -> (file, content type). Nothing outside this map is ever served.
    "/ui/": ("index.html", "text/html; charset=utf-8"),
    "/ui/index.html": ("index.html", "text/html; charset=utf-8"),
    "/ui/app.js": ("app.js", "text/javascript; charset=utf-8"),
    "/ui/app.css": ("app.css", "text/css; charset=utf-8"),
    "/ui/catalog.json": ("catalog.json", "application/json"),
}
UI_HEADERS = {
    "Content-Security-Policy": ("default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
                                "connect-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; "
                                "form-action 'none'; frame-ancestors 'none'"),
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
}


class Config:
    token: str | None = None
    no_auth: bool = False
    public_url: str | None = None
    allowed_hosts: set[str] = set(LOOPBACK)
    ui: bool = True
    gate = threading.BoundedSemaphore(8)


def _authorized(h: BaseHTTPRequestHandler) -> bool:
    if Config.no_auth:
        return True
    given = None
    a = h.headers.get("Authorization", "")
    if a.lower().startswith("bearer "):
        given = a[7:].strip()
    elif h.headers.get("X-API-Key"):
        given = h.headers["X-API-Key"].strip()
    return bool(given and Config.token and hmac.compare_digest(given.encode(), Config.token.encode()))


class Handler(BaseHTTPRequestHandler):
    server_version = "KosifOmni/" + __version__
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):  # never log headers/bodies
        sys.stderr.write("[kosif-omni] %s %s\n" % (self.command, urlparse(self.path).path))

    # -- helpers
    def _send(self, code: int, body: bytes | dict | None = None, ctype="application/json", extra=None):
        data = b"" if body is None else (body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode("utf-8"))
        self.send_response(code)
        self.send_header("Content-Type", ctype + ("; charset=utf-8" if ctype.startswith("application/json") else ""))
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if data and self.command != "HEAD":
            self.wfile.write(data)

    def _host_ok(self) -> bool:
        if not Config.no_auth:
            return True
        host = (self.headers.get("Host") or "").rsplit(":", 1)[0].strip("[]").lower()
        origin = self.headers.get("Origin")
        if host not in Config.allowed_hosts:
            return False
        if origin:
            oh = (urlparse(origin).hostname or "").lower()
            return oh in Config.allowed_hosts
        return True

    def _body(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            n = -1
        if n < 0 or n > MAX_BODY:
            left = n if 0 < n <= 8 * MAX_BODY else 0   # drain a bounded amount so the client can read the 413
            while left > 0:
                chunk = self.rfile.read(min(65536, left))
                if not chunk:
                    break
                left -= len(chunk)
            self.close_connection = True
            self._send(413, {"error": "body too large"}, extra={"Connection": "close"})
            return None
        raw = self.rfile.read(n) if n else b""
        try:
            return json.loads(raw.decode("utf-8")) if raw else {}
        except ValueError:
            self._send(400, {"error": "invalid JSON"})
            return None

    def _ui(self, path: str):
        if not Config.ui:
            return self._send(404, {"error": "console disabled (--no-ui)"})
        if not self._host_ok():
            return self._send(403, {"error": "forbidden host"})
        if path == "/ui":
            return self._send(302, None, extra={"Location": "/ui/", **UI_HEADERS})
        name, ctype = UI_FILES[path]
        try:
            data = (UI_DIR / name).read_bytes()
        except OSError:
            return self._send(404, {"error": "console files missing"})
        return self._send(200, data, ctype=ctype, extra=UI_HEADERS)

    # -- routes
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in UI_FILES or path == "/ui":
            return self._ui(path)
        if path == "/healthz":
            return self._send(200, {"ok": True, "name": SERVER_NAME, "version": __version__, "tools": len(REGISTRY)})
        if path in ("/", "/console", "/index.html"):
            if not CONSOLE.is_file():
                return self._send(404, {"error": "console not bundled"})
            return self._send(200, CONSOLE.read_bytes(), ctype="text/html; charset=utf-8",
                              extra={"Content-Security-Policy": CONSOLE_CSP, "Referrer-Policy": "no-referrer",
                                     "X-Frame-Options": "DENY"})
        if path == "/openapi.json":
            prof = "full" if "profile=full" in (urlparse(self.path).query or "") else "chatgpt"
            host = Config.public_url or f"http://{self.headers.get('Host', 'localhost')}"
            return self._send(200, openapi.build(host, prof))
        if not self._host_ok():
            return self._send(403, {"error": "forbidden host"})
        if path == "/v1/tools":
            if not _authorized(self):
                return self._send(401, {"error": "unauthorized"}, extra={"WWW-Authenticate": "Bearer"})
            return self._send(200, {"tools": [{"name": t.name, "description": t.description} for t in REGISTRY.values()]})
        if path == "/v1/catalog":
            if not _authorized(self):
                return self._send(401, {"error": "unauthorized"}, extra={"WWW-Authenticate": "Bearer"})
            return self._send(200, catalog())
        if path == "/mcp":
            return self._send(405, {"error": "this server answers POST (JSON) on /mcp"}, extra={"Allow": "POST"})
        self._send(404, {"error": "not found"})

    def do_DELETE(self):
        self._send(405, {"error": "sessions are stateless"}, extra={"Allow": "POST"})

    def do_POST(self):
        path = urlparse(self.path).path
        if not self._host_ok():
            return self._send(403, {"error": "forbidden host"})
        if not _authorized(self):
            return self._send(401, {"error": "unauthorized"}, extra={"WWW-Authenticate": "Bearer"})
        if not Config.gate.acquire(blocking=False):
            return self._send(503, {"error": "busy"}, extra={"Retry-After": "2"})
        try:
            msg = self._body()
            if msg is None:
                return
            if path == "/mcp":
                batch = msg if isinstance(msg, list) else [msg]
                replies = [r for r in (protocol.handle(m) for m in batch) if r is not None]
                if not replies:
                    return self._send(202)
                return self._send(200, replies if isinstance(msg, list) else replies[0])
            if path.startswith("/v1/tools/"):
                name = path[len("/v1/tools/"):]
                if name not in REGISTRY:
                    return self._send(404, {"ok": False, "error": f"unknown tool {name}"})
                val, is_err = protocol.call_tool(name, msg if isinstance(msg, dict) else {})
                text = json.dumps(val, ensure_ascii=False, default=str)
                if len(text) > REST_OUT_CAP:
                    return self._send(200, {"ok": not is_err, "truncated": True,
                                            "result": text[:REST_OUT_CAP] + "…"})
                if is_err:
                    return self._send(200, {"ok": False, "error": val.get("error") if isinstance(val, dict) else str(val)})
                return self._send(200, {"ok": True, "result": val})
            self._send(404, {"error": "not found"})
        finally:
            Config.gate.release()


def serve(host: str, port: int, *, token: str | None, no_auth: bool, public_url: str | None,
          extra_hosts: list[str], open_browser: bool = False, ui: bool = True) -> None:
    set_transport("http")
    loop = host in LOOPBACK
    if no_auth and not loop:
        raise SystemExit("--no-auth is only allowed on a loopback bind (127.0.0.1).")
    if not no_auth and not token:
        token = secrets.token_urlsafe(32)
        print(f"[kosif-omni] generated access token (shown once): {token}", file=sys.stderr, flush=True)
    Config.token, Config.no_auth, Config.public_url, Config.ui = token, no_auth, public_url, ui
    if os.environ.get("KOSIF_MOUSE_HTTP") == "1" and (not loop or public_url):
        os.environ.pop("KOSIF_MOUSE_HTTP")  # desktop control never rides a non-loopback or public bind
        print("[kosif-omni] KOSIF_MOUSE_HTTP ignored: only allowed on a loopback bind without --public-url",
              file=sys.stderr, flush=True)
    if public_url:
        Config.allowed_hosts.add((urlparse(public_url).hostname or "").lower())
    Config.allowed_hosts.update(h.lower() for h in extra_hosts)
    srv = ThreadingHTTPServer((host, port), Handler)
    srv.daemon_threads = True
    base = f"http://{'127.0.0.1' if host in ('0.0.0.0', '::') else host}:{srv.server_address[1]}"
    print(f"[kosif-omni] {base}  MCP: /mcp  REST: /v1/tools/<name>  OpenAPI: /openapi.json  "
          f"auth={'off' if no_auth else 'bearer'}", file=sys.stderr, flush=True)
    # the token rides in the URL fragment, which browsers never send to the server or put in Referer headers
    console_url = base + "/" + ("" if no_auth else f"#token={token}")
    print(f"[kosif-omni] console: {base}/" + ("" if no_auth else "#token=<the token above>"), file=sys.stderr, flush=True)
    Config.console_url = console_url
    if open_browser:
        import webbrowser
        threading.Timer(.6, lambda: webbrowser.open(console_url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()
