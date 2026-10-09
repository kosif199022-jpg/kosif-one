"""Export the library packages that are NOT in the embedded pack, complete skill folders, from the original library.

usage: python tools/export_atlas_extra.py <out_dir> copyleft|restricted|blocked|executables

copyleft     licenses that allow redistribution under conditions (GPL/AGPL/LGPL/MPL/EPL/CC-BY(-SA)/WTFPL...) and that
             passed inspection: meant for the PUBLIC mirror, each folder carrying its license text.
restricted   no/unidentified license, non-commercial, proprietary, plus copyleft packages whose static inspection verdict
             was DO_NOT_INSTALL: meant for a PRIVATE personal-reference mirror only. Blocked packages are marked.
blocked      permissively licensed packages whose verdict was DO_NOT_INSTALL (left out of the pack and the public
             mirror): PRIVATE mirror, marked as blocked.
executables  the executable/binary files (.exe .dll .so .dylib .bin .jar .node .wasm) of every package in the private
             mirror, written next to their plugin under `_package/<original path>` with a SHA-256 manifest. They are
             copied as bytes and never run.
Files that look like they contain a credential are never written (listed in EXCLUDED-*.md without their content).
"""
from __future__ import annotations

import csv
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE / "mcp-server"))
sys.path.insert(0, str(HERE / "tools"))
from kosif_mcp import atlas  # noqa: E402
from export_atlas_repo import MAX_PATH, SECRET_RX  # noqa: E402

COPYLEFT_RE = re.compile(r"agpl|gpl|lgpl|mpl|epl|cc-by|osl|eupl|artistic|wtfpl", re.I)


def category(license_text: str) -> str:
    if atlas.PERMISSIVE_RE.match(license_text or ""):
        return "permissive"
    return "copyleft" if COPYLEFT_RE.search(license_text or "") else "restricted"


def wanted(mode: str, cat: str, blocked: bool) -> bool:
    if mode == "copyleft":
        return cat == "copyleft" and not blocked
    if mode == "restricted":
        return cat == "restricted" or (cat == "copyleft" and blocked)
    if mode == "blocked":
        return cat == "permissive" and blocked
    return cat == "restricted" or blocked  # executables: everything the private mirror holds


def main(out: Path, mode: str) -> dict:
    con = sqlite3.connect(Path(os.path.expanduser("~/.kosif-omni")) / "atlas.sqlite")
    con.row_factory = sqlite3.Row
    library = atlas.atlas_dir()
    if library is None:
        raise SystemExit("the original library is not configured (kosif_atlas_configure)")
    scan = atlas._code_scanner()
    (out / "skills").mkdir(parents=True, exist_ok=True)
    index, excluded = [], []
    stats = {"plugins": 0, "skills": 0, "files": 0, "excluded_files": 0, "long_paths": 0, "blocked_packages": 0,
             "executables": 0, "executable_bytes": 0}
    executables = []
    for p in con.execute("SELECT * FROM plugins ORDER BY pid").fetchall():
        cat = category(p["license"])
        if cat == "permissive" and mode in ("copyleft", "restricted"):
            continue  # permissive packages are in the embedded pack / public mirror
        if mode == "executables" and not p["has_binaries"]:
            continue
        z = atlas.inner_zip(library, p["archive_path"])
        names = [n for n in z.namelist() if not n.endswith("/")]
        report = atlas._package_report(z, names, bool(p["has_binaries"]), bool(p["has_scripts"]), scan)
        blocked = report["verdict"] == "DO_NOT_INSTALL"
        if not wanted(mode, cat, blocked):
            continue
        skills = con.execute("SELECT * FROM skills WHERE pid = ? ORDER BY sid", (p["pid"],)).fetchall()
        if not skills:
            continue
        pdir_rel = f"skills/x{p['pid']}-{atlas._slug(p['name'])[:40].rstrip('-')}"
        pdir = out / pdir_rel
        if mode == "executables":
            for n in sorted(names):
                if not n.lower().endswith(atlas.BINARY_EXT) or ".." in n.split("/"):
                    continue
                target = pdir / "_package" / n
                if len(str(target)) > MAX_PATH:
                    stats["long_paths"] += 1
                    excluded.append((f"{pdir_rel}/_package/{n}", "path_too_long"))
                    continue
                data = z.read(n)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
                executables.append({"path": f"{pdir_rel}/_package/{n}", "plugin": p["name"], "license": p["license"],
                                    "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                                    "verdict": report["verdict"], "source": p["source_url"]})
                stats["executables"] += 1
                stats["executable_bytes"] += len(data)
            stats["plugins"] += 1
            continue
        pdir.mkdir(parents=True, exist_ok=True)
        lic = next((n for n in names if atlas.LICENSE_RE.match(n)), None)
        if lic:
            (pdir / "LICENSE").write_bytes(z.read(lic))
        warn = ("\n> ⚠️ **BLOCKED by KOSIF static inspection (DO_NOT_INSTALL).** Do not install or run anything from this "
                "package. Kept for reference only.\n" if blocked else "")
        (pdir / "SOURCE.md").write_text(
            f"# {p['name']}\n{warn}\n{(p['description'] or '').strip()}\n\n- License: **{p['license']}**\n"
            f"- Source: {p['source_url']}\n- Commit: `{p['source_commit']}`\n- KOSIF static inspection: **{report['verdict']}** "
            f"(hooks: {len(report['hooks'])}, MCP servers: {len(report['mcp_servers'])}, scripts: {len(report['scripts'])})\n\n"
            "Unofficial copy for reference. All rights remain with the original authors under the license above.\n",
            encoding="utf-8")
        stats["plugins"] += 1
        stats["blocked_packages"] += int(blocked)
        for s in skills:
            sdir_rel = f"{pdir_rel}/x{s['sid']}-{atlas._slug(s['name'])[:40].rstrip('-')}"
            sd, files = s["skill_dir"], []
            for n in sorted(names):
                if not (sd == "" or n.startswith(sd + "/")):
                    continue
                rel = n[len(sd) + 1:] if sd else n
                if ".." in rel.split("/") or rel.lower().endswith(atlas.BINARY_EXT):
                    continue
                target = out / sdir_rel / rel
                if len(str(target)) > MAX_PATH:
                    stats["long_paths"] += 1
                    excluded.append((f"{sdir_rel}/{rel}", "path_too_long"))
                    continue
                data = z.read(n)
                if b"\0" not in data[:8192]:
                    hit = next((nm for nm, rx in SECRET_RX if re.search(rx, data.decode("utf-8", "replace"))), None)
                    if hit:
                        stats["excluded_files"] += 1
                        excluded.append((f"{sdir_rel}/{rel}", hit))
                        continue
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
                files.append(rel)
                stats["files"] += 1
            if files:
                index.append({"id": f"x{s['sid']}", "plugin": p["name"], "skill": s["name"],
                              "description": (s["description"] or "")[:400], "license": p["license"], "license_class": cat,
                              "source": p["source_url"], "path": sdir_rel, "files": files, "verdict": report["verdict"],
                              "blocked": blocked})
                stats["skills"] += 1
    if mode == "executables":
        (out / "EXECUTABLES.json").write_text(json.dumps({"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                                          "count": len(executables), "files": executables},
                                                         ensure_ascii=False, indent=1), encoding="utf-8")
        return {**stats, "mode": mode, "out": str(out)}
    tag = mode
    (out / f"index-{tag}.json").write_text(json.dumps({"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                                        "count": len(index), "skills": index}, ensure_ascii=False),
                                           encoding="utf-8")
    with open(out / f"index-{tag}.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["id", "plugin", "skill", "license", "license_class", "path", "verdict", "blocked", "description"])
        for r in index:
            w.writerow([r["id"], r["plugin"], r["skill"], r["license"], r["license_class"], r["path"], r["verdict"],
                        r["blocked"], r["description"]])
    (out / f"EXCLUDED-{tag}.md").write_text(
        "# Files left out\n\nNot written because they looked like they contained a credential, or the path was too long. "
        "Content not reproduced.\n\n| Path | Reason |\n|---|---|\n" + "\n".join(f"| `{a}` | {b} |" for a, b in excluded) + "\n",
        encoding="utf-8")
    return {**stats, "mode": mode, "out": str(out)}


if __name__ == "__main__":
    print(json.dumps(main(Path(sys.argv[1]).resolve(), sys.argv[2]), ensure_ascii=False))
