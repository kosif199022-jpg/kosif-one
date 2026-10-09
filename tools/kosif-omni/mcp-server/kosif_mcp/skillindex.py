"""Read the bundled skills (SKILL.md frontmatter) and slash-command prompts."""
from __future__ import annotations

import re
from functools import lru_cache

from .paths import commands_dir, skills_dir

_FM = re.compile(r"\A﻿?---\r?\n(.*?)\r?\n---\r?\n?", re.S)


def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = _FM.match(text)
    if not m:
        return {}, text
    meta: dict = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.startswith((" ", "\t", "-")):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip("\"'")
    return meta, text[m.end():]


@lru_cache(maxsize=1)
def skills() -> dict[str, dict]:
    out: dict[str, dict] = {}
    base = skills_dir()
    if not base.is_dir():
        return out
    for d in sorted(p for p in base.iterdir() if p.is_dir()):
        f = d / "SKILL.md"
        if not f.is_file():
            continue
        meta, body = parse_frontmatter(f.read_text(encoding="utf-8", errors="replace"))
        out[d.name] = {"name": meta.get("name", d.name), "description": meta.get("description", ""),
                       "path": f, "dir": d, "bytes": f.stat().st_size}
    return out


@lru_cache(maxsize=1)
def commands() -> dict[str, dict]:
    out: dict[str, dict] = {}
    base = commands_dir()
    if not base.is_dir():
        return out
    for f in sorted(base.glob("*.md")):
        meta, body = parse_frontmatter(f.read_text(encoding="utf-8", errors="replace"))
        out[f.stem] = {"description": meta.get("description", f.stem),
                       "argument_hint": meta.get("argument-hint", ""), "body": body.strip()}
    return out
