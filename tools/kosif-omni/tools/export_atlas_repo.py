"""Export the embedded KOSIF Atlas pack as a browsable repository (one folder per skill) for online reference.

usage: python tools/export_atlas_repo.py <out_dir>

Layout (paths match kosif_mcp.atlas.online_skill_dir, so KOSIF can link every result to it):
  skills/<pid>-<plugin>/SOURCE.md, LICENSE      source, commit, license text, inspection verdict
  skills/<pid>-<plugin>/<sid>-<skill>/...       the skill's embedded .md/.txt files, unmodified
  index.json, index.csv                          one row per skill (id, plugin, skill, description, license, path, flags)
  NOTICES.md, EXCLUDED.md, README.md
Files that look like they contain a credential are left out (listed in EXCLUDED.md without their content).
"""
from __future__ import annotations

import csv
import json
import re
import sqlite3
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE / "mcp-server"))
from kosif_mcp import atlas  # noqa: E402

SECRET_RX = [
    ("openai_key", r"\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{32,}"),
    ("anthropic_key", r"\bsk-ant-[A-Za-z0-9_-]{20,}"),
    ("aws_access_key", r"\bAKIA[0-9A-Z]{16}\b"),
    ("github_token", r"\bgh[pousr]_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}"),
    ("google_api_key", r"\bAIza[0-9A-Za-z_-]{35}\b"),
    ("slack_token", r"\bxox[baprs]-[A-Za-z0-9-]{20,}"),
    ("stripe_live_key", r"\b(sk|rk)_live_[A-Za-z0-9]{20,}"),
    ("private_key", r"-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
    ("jwt", r"\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}"),
]
MAX_PATH = 230  # stay well under Windows' 260-character limit for the deepest file


def main(out: Path) -> dict:
    pack = atlas.pack_path()
    con = sqlite3.connect(pack.resolve().as_uri() + "?mode=ro&immutable=1", uri=True)
    con.row_factory = sqlite3.Row
    meta = dict(con.execute("SELECT key, value FROM meta").fetchall())
    out.mkdir(parents=True, exist_ok=True)
    (out / "skills").mkdir(exist_ok=True)
    index, excluded, notices = [], [], []
    library = atlas.atlas_dir()  # the original split library, when attached, gives the complete skill folders
    stats = {"plugins": 0, "skills": 0, "files": 0, "excluded_files": 0, "long_paths": 0}
    for p in con.execute("SELECT * FROM plugins ORDER BY pid"):
        pdir = out / atlas.online_plugin_dir(p["pid"], p["name"])
        pdir.mkdir(parents=True, exist_ok=True)
        report = json.loads(p["report"] or "{}")
        lic_row = con.execute("SELECT text FROM licenses WHERE hash = ?", (p["license_hash"],)).fetchone() if p["license_hash"] else None
        if lic_row:
            (pdir / "LICENSE").write_bytes(lic_row["text"])
        (pdir / "SOURCE.md").write_text(
            f"# {p['name']}\n\n{(p['description'] or '').strip()}\n\n"
            f"- License: **{p['license']}**{'' if lic_row else ' (no license file shipped; see the source repository)'}\n"
            f"- Source: {p['source_url']}\n- Commit: `{p['source_commit']}`\n"
            f"- KOSIF static inspection: **{report.get('verdict', 'n/a')}** "
            f"(hooks: {len(report.get('hooks') or [])}, MCP servers: {len(report.get('mcp_servers') or {})}, "
            f"scripts: {len(report.get('scripts') or [])}). Read the scripts before running anything.\n\n"
            "Unofficial mirror of the skill text for reference. All rights remain with the original authors under the "
            "license above.\n", encoding="utf-8")
        notices.append(f"| {p['name'].replace('|', '/')} | {p['license']} | {p['source_url']} | `{(p['source_commit'] or '')[:12]}` |")
        stats["plugins"] += 1
        z = atlas.inner_zip(library, p["archive_path"]) if library else None
        for s in con.execute("SELECT * FROM skills WHERE pid = ? ORDER BY sid", (p["pid"],)).fetchall():
            sdir_rel = atlas.online_skill_dir(p["pid"], p["name"], s["sid"], s["name"])
            sdir = out / sdir_rel
            files = []
            if z is not None:  # full skill folder from the original library: every file, scripts and assets included
                sd = s["skill_dir"]
                source = [(n[len(sd) + 1:] if sd else n, (lambda n=n: z.read(n)))
                          for n in sorted(z.namelist()) if not n.endswith("/") and (sd == "" or n.startswith(sd + "/"))]
            else:  # fallback: the .md/.txt files embedded in the pack
                source = [(d["relpath"], (lambda h=d["hash"]: atlas._pack_blob(con, h)))
                          for d in con.execute("SELECT relpath, hash FROM docs WHERE sid = ? ORDER BY relpath", (s["sid"],))]
            for rel, load in source:
                rel = rel.replace("\\", "/")
                if ".." in rel.split("/") or rel.startswith("/") or rel.lower().endswith(atlas.BINARY_EXT):
                    continue
                target = sdir / rel
                if len(str(target)) > MAX_PATH:
                    stats["long_paths"] += 1
                    excluded.append((f"{sdir_rel}/{rel}", "path_too_long"))
                    continue
                data = load()
                if b"\0" not in data[:8192]:  # text-like: scan for credentials before publishing
                    hit = next((name for name, rx in SECRET_RX if re.search(rx, data.decode("utf-8", "replace"))), None)
                    if hit:
                        stats["excluded_files"] += 1
                        excluded.append((f"{sdir_rel}/{rel}", hit))
                        continue
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
                files.append(rel)
                stats["files"] += 1
            if not files:
                continue
            flags = [f for f, on in (("hooks", p["has_hooks"]), ("mcp_server", p["has_mcp"]), ("scripts", p["has_scripts"])) if on]
            index.append({"id": s["sid"], "plugin": p["name"], "skill": s["name"], "description": (s["description"] or "")[:400],
                          "license": p["license"], "source": p["source_url"], "path": sdir_rel, "files": files,
                          "complete": bool(s["complete"]), "risk_flags": flags, "verdict": report.get("verdict")})
            stats["skills"] += 1
    (out / "index.json").write_text(json.dumps({"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                                 "pack_built_at": meta.get("built_at"), "count": len(index),
                                                 "skills": index}, ensure_ascii=False), encoding="utf-8")
    with open(out / "index.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["id", "plugin", "skill", "license", "path", "verdict", "risk_flags", "description"])
        for r in index:
            w.writerow([r["id"], r["plugin"], r["skill"], r["license"], r["path"], r["verdict"], " ".join(r["risk_flags"]),
                        r["description"]])
    (out / "NOTICES.md").write_text("# Notices\n\nEvery skill in this mirror comes from a third-party plugin under a license "
                                    "that permits redistribution. Each plugin folder carries its LICENSE (when the plugin "
                                    "shipped one) and SOURCE.md.\n\n| Plugin | License | Source | Commit |\n|---|---|---|---|\n"
                                    + "\n".join(notices) + "\n", encoding="utf-8")
    (out / "EXCLUDED.md").write_text("# Files left out of the mirror\n\nThese files were not published because they looked like "
                                     "they contained a credential, or their path was too long for Windows. Their content is "
                                     "not reproduced here.\n\n| Path | Reason |\n|---|---|\n"
                                     + "\n".join(f"| `{a}` | {b} |" for a, b in excluded) + "\n", encoding="utf-8")
    return {**stats, "out": str(out)}


if __name__ == "__main__":
    print(json.dumps(main(Path(sys.argv[1]).resolve()), ensure_ascii=False))
