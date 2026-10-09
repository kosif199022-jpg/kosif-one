"""Run a bundled helper script as a subprocess (no shell, scrubbed environment, bounded)."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from .paths import state_dir
from .registry import ToolError

_SAFE_ENV = {
    "PATH", "SYSTEMROOT", "SYSTEMDRIVE", "WINDIR", "TEMP", "TMP", "TMPDIR", "HOME", "USERPROFILE",
    "APPDATA", "LOCALAPPDATA", "PATHEXT", "COMSPEC", "LANG", "OS", "PROCESSOR_ARCHITECTURE",
    "NUMBER_OF_PROCESSORS",
}
MAX_OUT = 1_500_000


def _env() -> dict:
    env = {k: v for k, v in os.environ.items() if k.upper() in _SAFE_ENV or k.upper().startswith("LC_")}
    env.update(PYTHONUTF8="1", PYTHONIOENCODING="utf-8", PYTHONDONTWRITEBYTECODE="1",
               KOSIF_STATE_DIR=str(state_dir()))
    return env


def run_script(script: Path, argv: list[str] | None = None, stdin=None, *, timeout: float = 60,
               cwd: Path | None = None) -> dict:
    """Return {"exit_code", "result", "stderr"}; `result` is parsed JSON when stdout is JSON."""
    if not script.is_file():
        raise ToolError(f"bundled script missing: {script.name}")
    if stdin is not None and not isinstance(stdin, (bytes, bytearray)):
        stdin = (stdin if isinstance(stdin, str) else json.dumps(stdin, ensure_ascii=False)).encode("utf-8")
    try:
        p = subprocess.run([sys.executable, "-X", "utf8", str(script), *(argv or [])], input=stdin,
                           capture_output=True, timeout=timeout, cwd=str(cwd or script.parent),
                           env=_env(), shell=False)
    except subprocess.TimeoutExpired:
        raise ToolError(f"{script.name} timed out after {timeout:.0f}s") from None
    out = p.stdout[:MAX_OUT].decode("utf-8", "replace")
    err = p.stderr[:6000].decode("utf-8", "replace").strip()
    try:
        parsed = json.loads(out) if out.strip() else None
    except ValueError:
        parsed = None
    return {"exit_code": p.returncode, "result": parsed if parsed is not None else out, "stderr": err}


# Gate scripts use exit codes as verdict signals: 0 PASS · 1 REVISE/CONFIRM · 3 BLOCK · 4 HANDOFF · 2 invalid input.
GATE_OK = {0, 1, 3, 4}


def finish(run: dict, name: str) -> dict:
    rc = run["exit_code"]
    if rc in GATE_OK:
        out = {"exit_code": rc, "result": run["result"]}
        if run["stderr"]:
            out["stderr"] = run["stderr"]
        return out
    detail = run["result"]
    if isinstance(detail, dict):
        detail = detail.get("error") or detail
    raise ToolError(f"{name} failed (exit {rc}): {detail if isinstance(detail, str) else json.dumps(detail, ensure_ascii=False)[:1500]}"
                    + (f" | {run['stderr'][:800]}" if run["stderr"] else ""))
