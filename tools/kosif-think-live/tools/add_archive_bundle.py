"""Apply the per-request archive feature to a live bundled worker (e.g. 0.26.1) without touching anything else.

usage: python tools/add_archive_bundle.py <live_bundle.js> <out.js>
The archive functions are copied verbatim from src/worker.js (already tested on 0.25.2).
"""
import re
import sys
from pathlib import Path

here = Path(__file__).resolve().parents[1]
src = (here / "src" / "worker.js").read_text(encoding="utf-8")
start = src.index("// Per-request archive:")
end = src.index("\n}\n", src.index("async function fullProArchiveRoute(")) + 3
block = src[start:end]

live = Path(sys.argv[1]).read_text(encoding="utf-8")
assert "fpArchiveUrl" not in live, "bundle already has the archive feature"

m = re.search(r'function fpArtifactKey\(id\) \{\n  return "fp:artifact:" \+ id;\n\}\n', live)
assert m, "fpArtifactKey anchor not found"
live = live[:m.end()] + block + live[m.end():]

g = live.index("async function fullProExecuteGateway(env, args) {")
anchor = "  const status = await fullProStatus(env, { request_id: id });\n"
s = live.index(anchor, g)
assert s - g < 2500, "status anchor is not inside fullProExecuteGateway"
live = live[:s + len(anchor)] + "  status.archive_url = await fpArchiveUrl(env, id);\n" + live[s + len(anchor):]

r = "    const versionedMcp = url.pathname === VERSIONED_MCP_PATH"
assert live.count(r) == 1, "route anchor not unique"
live = live.replace(r, '    if (url.pathname.startsWith("/requests/")) return fullProArchiveRoute(env, url, req);\n' + r)

Path(sys.argv[2]).write_text(live, encoding="utf-8")
print("archive applied ->", sys.argv[2])
