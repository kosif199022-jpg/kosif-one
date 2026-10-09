"""Build the D1 data file for the KOSIF Atlas edge API from the public mirror folder.

usage: python tools/build_edge_db.py <kosif-atlas mirror dir> <out.sql>

Only the public mirror goes to the edge (permissive + copyleft skills, already secret-scanned); the private
reference mirror never does. Each row keeps the skill's metadata plus the first BODY_CHARS of its SKILL.md body for
full-text search; full files are served from the GitHub mirror at request time.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

BODY_CHARS = 3000
_FM = re.compile(r"\A﻿?---\r?\n.*?\r?\n---\r?\n?", re.S)

SCHEMA = """DROP TABLE IF EXISTS skills_fts;
DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  rowid INTEGER PRIMARY KEY,
  id TEXT UNIQUE NOT NULL,
  skill TEXT NOT NULL,
  plugin TEXT NOT NULL,
  description TEXT,
  license TEXT,
  license_class TEXT,
  source TEXT,
  path TEXT NOT NULL,
  files TEXT,
  verdict TEXT,
  risk_flags TEXT,
  body TEXT
);
CREATE VIRTUAL TABLE skills_fts USING fts5(skill, plugin, description, body, content='skills', content_rowid='rowid',
  tokenize='porter unicode61');
"""


def q(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def body_of(mirror: Path, rel: str) -> str:
    f = mirror / rel / "SKILL.md"
    if not f.is_file():
        return ""
    text = f.read_text(encoding="utf-8", errors="replace")
    return re.sub(r"\s+", " ", _FM.sub("", text, count=1)).strip()[:BODY_CHARS]


def main(mirror: Path, out: Path) -> dict:
    rows = []
    for name, cls in (("index.json", "permissive"), ("index-copyleft.json", "copyleft")):
        p = mirror / name
        if not p.is_file():
            continue
        for s in json.loads(p.read_text(encoding="utf-8"))["skills"]:
            rows.append((str(s["id"]), s["skill"], s["plugin"], s.get("description", ""), s.get("license", ""),
                         s.get("license_class", cls), s.get("source", ""), s["path"],
                         json.dumps(s.get("files", [])[:300], ensure_ascii=False), s.get("verdict", ""),
                         json.dumps(s.get("risk_flags", []), ensure_ascii=False), body_of(mirror, s["path"])))
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(SCHEMA)
        for i, r in enumerate(rows, 1):
            f.write("INSERT INTO skills VALUES (" + ",".join([str(i)] + [q(v) for v in r]) + ");\n")
        f.write("INSERT INTO skills_fts(skills_fts) VALUES('rebuild');\n")
    return {"rows": len(rows), "out": str(out), "bytes": out.stat().st_size}


if __name__ == "__main__":
    print(json.dumps(main(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())))
