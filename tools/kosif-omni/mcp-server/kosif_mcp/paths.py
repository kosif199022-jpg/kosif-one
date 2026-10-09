"""Locations and the filesystem sandbox shared by every tool."""
from __future__ import annotations

import json
import os
from pathlib import Path


class SandboxError(PermissionError):
    pass


def plugin_root() -> Path:
    env = os.environ.get("KOSIF_PLUGIN_ROOT")
    if env:
        return Path(env).resolve()
    here = Path(__file__).resolve()
    for p in here.parents:
        if (p / "skills" / "kosif-omni").is_dir():
            return p
    raise RuntimeError("cannot locate the KOSIF Omni plugin root (skills/kosif-omni); set KOSIF_PLUGIN_ROOT")


def skills_dir() -> Path:
    return plugin_root() / "skills"


def commands_dir() -> Path:
    return plugin_root() / "commands"


def state_dir() -> Path:
    d = Path(os.environ.get("KOSIF_STATE_DIR") or (Path.home() / ".kosif-omni")).expanduser()
    d.mkdir(parents=True, exist_ok=True)
    return d


def _norm(p: Path | str) -> str:
    return os.path.normcase(str(p))


def _inside(child: Path, root: Path) -> bool:
    try:
        return os.path.commonpath([_norm(child), _norm(root)]) == _norm(root)
    except ValueError:  # different drives
        return False


def _config_file() -> Path:
    return state_dir() / "config.json"


def load_config() -> dict:
    try:
        cfg = json.loads(_config_file().read_text(encoding="utf-8"))
        return cfg if isinstance(cfg, dict) else {}
    except (OSError, ValueError):
        return {}


def save_config(**values) -> dict:
    cfg = {**load_config(), **values}
    _config_file().write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding="utf-8")
    return cfg


def corpus_dir() -> Path | None:
    """KOSIF_CORPUS_DIR wins; otherwise the folder saved by kosif_corpus_configure (state dir config.json)."""
    v = os.environ.get("KOSIF_CORPUS_DIR") or load_config().get("corpus_dir")
    if not v:
        return None
    p = Path(v).expanduser()
    return p.resolve() if p.is_dir() else None


_MODE = {"transport": "stdio"}


def set_transport(name: str) -> None:
    _MODE["transport"] = name


def allowed_roots() -> list[Path]:
    """Directories file-taking tools may touch.

    KOSIF_ALLOWED_DIRS (os.pathsep separated) + the corpus dir. stdio additionally allows the
    current working directory unless KOSIF_ALLOW_CWD=0. HTTP never allows the cwd implicitly.
    """
    roots: list[Path] = []
    for part in (os.environ.get("KOSIF_ALLOWED_DIRS") or "").split(os.pathsep):
        part = part.strip()
        if part:
            p = Path(part).expanduser()
            if p.is_dir():
                roots.append(p.resolve())
    c = corpus_dir()
    if c:
        roots.append(c)
    if _MODE["transport"] == "stdio" and os.environ.get("KOSIF_ALLOW_CWD", "1") != "0":
        roots.append(Path.cwd().resolve())
    seen, out = set(), []
    for r in roots:
        k = _norm(r)
        if k not in seen:
            seen.add(k)
            out.append(r)
    return out


def resolve_allowed(path: str, *, must_exist: bool = True, want_dir: bool | None = None) -> Path:
    if not isinstance(path, str) or not path.strip():
        raise SandboxError("path is required")
    roots = allowed_roots()
    if not roots:
        raise SandboxError(
            "no directory is enabled for file tools. Start the server with --workspace DIR "
            "(or set KOSIF_ALLOWED_DIRS) to choose which folders KOSIF may read.")
    p = Path(path).expanduser()
    if not p.is_absolute():
        p = roots[0] / p
    real = p.resolve()
    if not any(_inside(real, r) for r in roots):
        raise SandboxError(f"path is outside the enabled directories: {real}")
    if must_exist and not real.exists():
        raise FileNotFoundError(f"not found: {real}")
    if want_dir is True and real.exists() and not real.is_dir():
        raise SandboxError(f"not a directory: {real}")
    if want_dir is False and real.exists() and real.is_dir():
        raise SandboxError(f"is a directory: {real}")
    return real


def resolve_inside(base: Path, rel: str) -> Path:
    """Resolve `rel` under `base`, refusing traversal and symlink escapes."""
    base = base.resolve()
    p = (base / rel).resolve()
    if not _inside(p, base):
        raise SandboxError("path escapes its base directory")
    return p
