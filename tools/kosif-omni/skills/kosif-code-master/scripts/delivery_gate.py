#!/usr/bin/env python3
"""KOSIF Code Master deterministic pre-delivery gate.

Usage:
  python3 delivery_gate.py PATH [PATH ...] [--project] [--json]

Verdicts:
  PASS   — no blocking static findings and required project hygiene is present.
  REVISE — code is not blocked, but project delivery is missing docs/tests/config hygiene.
  BLOCK  — critical/high scanner findings or incomplete placeholder code exist.

This is a deterministic hygiene gate, not proof that software is correct or secure.
"""
from __future__ import annotations

import json
import os
import re
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))
from code_scan import scan  # noqa: E402

SOURCE_EXTS = {".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".go", ".java", ".kt", ".cs",
               ".rb", ".php", ".rs", ".swift", ".dart", ".vue", ".svelte", ".sql"}
MANIFESTS = {"package.json", "pyproject.toml", "requirements.txt", "poetry.lock", "uv.lock", "go.mod",
             "Cargo.toml", "pom.xml", "build.gradle", "build.gradle.kts", "composer.json", "Gemfile",
             "pubspec.yaml", "Package.swift"}
ENV_RX = re.compile(r"(?:process\.env\.|os\.environ|os\.getenv\(|getenv\(|env\[|import\.meta\.env\.)")


def _names(paths):
    names, texts = [], []
    for raw in paths:
        p = Path(raw)
        if p.is_file() and p.suffix.lower() == ".zip":
            with zipfile.ZipFile(p) as z:
                for info in z.infolist():
                    if info.is_dir():
                        continue
                    name = info.filename.replace("\\", "/")
                    names.append(name)
                    if Path(name).suffix.lower() in SOURCE_EXTS and info.file_size <= 1_500_000:
                        texts.append(z.read(info).decode("utf-8", "replace"))
        elif p.is_dir():
            for root, dirs, files in os.walk(p):
                dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "dist", "build", ".next", "__pycache__", ".venv", "venv"}]
                for f in files:
                    fp = Path(root) / f
                    rel = fp.relative_to(p).as_posix()
                    names.append(rel)
                    if fp.suffix.lower() in SOURCE_EXTS and fp.stat().st_size <= 1_500_000:
                        texts.append(fp.read_text(encoding="utf-8", errors="replace"))
        elif p.is_file():
            names.append(p.name)
            if p.suffix.lower() in SOURCE_EXTS:
                texts.append(p.read_text(encoding="utf-8", errors="replace"))
    return names, texts


def evaluate(paths, project=False):
    static = scan(paths)
    names, texts = _names(paths)
    low_names = [n.lower() for n in names]
    findings = static["findings"]
    blockers = []
    revisions = []

    for f in findings:
        if f["severity"] in {"critical", "high"}:
            blockers.append(f"{f['rule']} at {f['file']}:{f['line']}")
        elif f["rule"] == "placeholder-code":
            blockers.append(f"incomplete placeholder at {f['file']}:{f['line']}")

    checks = {
        "static_scan_ok": not blockers,
        "readme_present": any(Path(n).name.lower().startswith("readme") for n in names),
        "tests_present": any(
            Path(n).name.lower().startswith("test_") or Path(n).name.lower().endswith(("_test.py", ".test.js", ".test.ts", ".test.tsx", ".spec.js", ".spec.ts", ".spec.tsx"))
            or "/tests/" in f"/{n.lower()}/" for n in names
        ),
        "dependency_manifest_present": any(Path(n).name in MANIFESTS for n in names),
        "env_example_present": any(Path(n).name.lower() in {".env.example", ".env.sample", "env.example"} for n in names),
        "env_usage_detected": any(ENV_RX.search(t) for t in texts),
    }

    if project:
        if not checks["readme_present"]:
            revisions.append("README missing")
        if any(Path(n).suffix.lower() in SOURCE_EXTS for n in names) and not checks["tests_present"]:
            revisions.append("tests missing")
        if any(Path(n).suffix.lower() in SOURCE_EXTS for n in names) and not checks["dependency_manifest_present"]:
            revisions.append("dependency manifest missing")
        if checks["env_usage_detected"] and not checks["env_example_present"]:
            revisions.append("environment variables are used but .env.example/.env.sample is missing")

    verdict = "BLOCK" if blockers else "REVISE" if revisions else "PASS"
    score = max(0, 100 - 20 * len(blockers) - 5 * len(revisions))
    return {
        "verdict": verdict,
        "score": score,
        "project_mode": bool(project),
        "checks": checks,
        "blockers": blockers,
        "revisions": revisions,
        "static_scan": {k: static[k] for k in ("ok", "files_scanned", "counts", "score", "scope")},
        "scope": "delivery hygiene gate; not proof of correctness, security, or production readiness",
    }


def main(argv):
    project = "--project" in argv
    as_json = "--json" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if not paths:
        print(__doc__)
        return 2
    out = evaluate(paths, project=project)
    if as_json:
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        print(f"{out['verdict']} · score {out['score']}/100")
        for x in out["blockers"]:
            print(f"BLOCK: {x}")
        for x in out["revisions"]:
            print(f"REVISE: {x}")
    return {"PASS": 0, "REVISE": 1, "BLOCK": 3}[out["verdict"]]


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
