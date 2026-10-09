"""Local full-text search over your own text corpus (the folder of prompts, books, code dumps).

SQLite FTS5, contentless index (original text is re-read from disk on demand), Arabic-aware
normalisation, exact-duplicate files indexed once, resumable under a time budget. Nothing leaves
your machine; the corpus directory is set with KOSIF_CORPUS_DIR.
"""
from __future__ import annotations

import fnmatch
import hashlib
import os
import re
import sqlite3
import threading
import time
from pathlib import Path

from .paths import SandboxError, corpus_dir, resolve_allowed, resolve_inside, save_config, state_dir
from .registry import B, I, S, ToolError, A, obj, tool

TEXT_EXT = {".txt", ".md", ".json", ".csv", ".tsx", ".ts", ".js", ".jsx", ".py", ".html", ".css", ".yaml",
            ".yml", ".xml", ".srt", ".vtt", ".log", ".rst", ".toml"}
DEFAULT_EXCLUDE = ("all_text_content*", "ALL_TEXT_FILES_MERGED*", "*.sqlite", "package-lock.json",
                   "ai_studio_sources_manifest.json", "ai_studio_source_profiles.md", "FILE_SIZES*")
SKIP_DIRS = {"node_modules", ".git", "__pycache__", ".venv", "venv", "dist", "build"}
CHUNK_TARGET = 1800
MAX_FILE = 400 * 1024 * 1024
_LOCK = threading.Lock()

_TASHKEEL = re.compile("[ؐ-ًؚ-ٰٟۖ-ۭـ]")
_ALEF = re.compile("[إأآٱ]")
_TOKEN = re.compile(r"[\w؀-ۿ]+", re.U)


def norm(text: str) -> str:
    t = _TASHKEEL.sub("", text.lower())
    t = _ALEF.sub("ا", t)
    return t.replace("ى", "ي").replace("ة", "ه")


def _norm_map(text: str):
    """Normalised text plus a map from normalised index → original index (for snippets)."""
    out, idx = [], []
    for i, ch in enumerate(text):
        if _TASHKEEL.match(ch):
            continue
        c = ch.lower()
        c = "ا" if c in "إأآٱ" else ("ي" if c == "ى" else ("ه" if c == "ة" else c))
        out.append(c)
        idx.append(i)
    return "".join(out), idx


def _root() -> Path:
    c = corpus_dir()
    if not c:
        raise ToolError("corpus not configured. " + _HINT)
    return c


def _db_path(root: Path) -> Path:
    h = hashlib.sha1(str(root).encode("utf-8", "replace")).hexdigest()[:10]
    return state_dir() / f"corpus-{h}.sqlite"


def _connect(root: Path) -> sqlite3.Connection:
    db = sqlite3.connect(_db_path(root), timeout=30)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA synchronous=NORMAL")
    db.executescript("""
        CREATE TABLE IF NOT EXISTS files(id INTEGER PRIMARY KEY, rel TEXT UNIQUE, size INTEGER, mtime REAL,
            sha1 TEXT, dup_of INTEGER, status TEXT, next_off INTEGER DEFAULT 0, chunks INTEGER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS chunks(id INTEGER PRIMARY KEY, file_id INTEGER, off INTEGER, len INTEGER);
        CREATE INDEX IF NOT EXISTS chunks_file ON chunks(file_id);
        CREATE VIRTUAL TABLE IF NOT EXISTS fts USING fts5(norm, tokenize='unicode61 remove_diacritics 2', content='');
    """)
    return db


def _excluded(name: str, extra: list[str]) -> bool:
    return any(fnmatch.fnmatch(name, pat) for pat in (*DEFAULT_EXCLUDE, *extra))


def _scan(root: Path, extra_exclude: list[str]):
    for dp, dns, fns in os.walk(root):
        # skip tooling dirs and any nested plugin root (e.g. this plugin living inside the corpus folder)
        dns[:] = sorted(d for d in dns if d not in SKIP_DIRS and not d.startswith(".")
                        and not fnmatch.fnmatch(d.lower(), "kosif-omni*")
                        and not (Path(dp) / d / ".claude-plugin").exists()
                        and not (Path(dp) / d / ".codex-plugin").exists())
        for fn in sorted(fns):
            p = Path(dp) / fn
            if p.is_symlink():  # never index (or later read) something a link points to outside the folder
                continue
            if p.suffix.lower() in TEXT_EXT and not _excluded(fn, extra_exclude):
                yield p


def _sha1(p: Path) -> str:
    h = hashlib.sha1()
    with open(p, "rb") as f:
        for blk in iter(lambda: f.read(4 << 20), b""):
            h.update(blk)
    return h.hexdigest()


def _utf8_boundary(buf: bytes, pos: int) -> int:
    while pos > 0 and (buf[pos] & 0xC0) == 0x80:
        pos -= 1
    return pos


def _chunks(path: Path, start: int, deadline: float, state: dict):
    """Yield (offset, length, raw_bytes) chunks of ~CHUNK_TARGET bytes split at newlines (or UTF-8 boundaries).

    state["end"] is the resume offset after every piece; state["timeout"] is set when the deadline stops us.
    """
    state["end"], state["timeout"] = start, False
    with open(path, "rb") as f:
        f.seek(start)
        off = start
        buf, pos, eof = b"", 0, False
        while True:
            while len(buf) - pos < 2 * CHUNK_TARGET and not eof:
                blk = f.read(65536)
                if blk:
                    buf, pos = buf[pos:] + blk, 0
                else:
                    eof = True
            avail = len(buf) - pos
            if avail == 0:
                return
            if eof and avail <= CHUNK_TARGET:
                cut = avail
            else:
                nl = buf.find(b"\n", pos + CHUNK_TARGET, pos + 2 * CHUNK_TARGET)
                if nl >= 0:
                    cut = nl + 1 - pos
                else:
                    cut = _utf8_boundary(buf, pos + CHUNK_TARGET) - pos
                    if cut <= 0:
                        cut = CHUNK_TARGET
            piece = buf[pos:pos + cut]
            pos += cut
            if piece.strip():
                yield off, cut, piece
            off += cut
            state["end"] = off
            if time.monotonic() > deadline:
                state["timeout"] = True
                return


def index(time_budget_s: float = 90.0, rebuild: bool = False, exclude: list[str] | None = None) -> dict:
    root = _root()
    if not _LOCK.acquire(blocking=False):
        raise ToolError("an index run is already in progress")
    db = None
    try:
        if rebuild:
            for suf in ("", "-wal", "-shm"):
                try:
                    Path(str(_db_path(root)) + suf).unlink()
                except FileNotFoundError:
                    pass
        db = _connect(root)
        deadline = time.monotonic() + max(5.0, float(time_budget_s))
        extra = list(exclude or [])
        known = {r[0]: r for r in db.execute("SELECT rel,id,size,mtime,status,next_off,sha1 FROM files")}
        changed = []
        new_files = 0
        for p in _scan(root, extra):
            rel = str(p.relative_to(root)).replace("\\", "/")
            st = p.stat()
            if st.st_size == 0 or st.st_size > MAX_FILE:
                continue
            row = known.get(rel)
            if row is None:
                db.execute("INSERT INTO files(rel,size,mtime,status) VALUES (?,?,?, 'pending')", (rel, st.st_size, st.st_mtime))
                new_files += 1
            elif (row[2] != st.st_size or abs(row[3] - st.st_mtime) > 1) and row[4] not in ("pending",):
                changed.append(rel)
        db.commit()
        if changed:
            return {"done": False, "needs_rebuild": True, "changed_files": changed[:20],
                    "message": "Some indexed files changed on disk. Re-run with rebuild=true to refresh the index."}
        pending = db.execute("SELECT id, rel, size, next_off, status, sha1 FROM files WHERE status IN ('pending','partial') ORDER BY size, length(rel), rel").fetchall()
        for fid, rel, size, next_off, fstatus, sha in pending:
            try:
                if time.monotonic() > deadline:
                    break
                path = root / rel
                if fstatus == "pending":
                    with open(path, "rb") as fh:
                        head = fh.read(4096)
                    if b"\x00" in head:
                        db.execute("UPDATE files SET status='binary' WHERE id=?", (fid,))
                        db.commit()
                        continue
                    sha = _sha1(path)
                    dup = db.execute("SELECT id FROM files WHERE sha1=? AND status IN ('indexed','partial') AND id<>?", (sha, fid)).fetchone()
                    if dup:
                        db.execute("UPDATE files SET sha1=?, dup_of=?, status='dup' WHERE id=?", (sha, dup[0], fid))
                        db.commit()
                        continue
                    db.execute("UPDATE files SET sha1=?, status='partial', next_off=0 WHERE id=?", (sha, fid))
                    next_off = 0
                n = 0
                state: dict = {}
                for off, ln, raw in _chunks(path, next_off, deadline, state):
                    text = norm(raw.decode("utf-8", "replace"))
                    cur = db.execute("INSERT INTO chunks(file_id,off,len) VALUES (?,?,?)", (fid, off, ln))
                    db.execute("INSERT INTO fts(rowid, norm) VALUES (?,?)", (cur.lastrowid, text))
                    n += 1
                    if n % 400 == 0:
                        db.execute("UPDATE files SET next_off=?, chunks=chunks+? WHERE id=?", (off + ln, n, fid))
                        db.commit()
                        n = 0
                done_file = not state.get("timeout", False)
                db.execute("UPDATE files SET status=?, next_off=?, chunks=chunks+? WHERE id=?",
                           ("indexed" if done_file else "partial", state.get("end", next_off), n, fid))
                db.commit()
            except OSError:  # file vanished / locked / unreadable: record it and keep going
                db.execute("UPDATE files SET status='unreadable' WHERE id=?", (fid,))
                db.commit()

        db.close()
        db = None
        out = status()
        out["new_files_registered"] = new_files
        return out
    finally:
        if db is not None:
            db.close()
        _LOCK.release()


def status() -> dict:
    root = _root()
    db = _connect(root)
    try:
        by = dict(db.execute("SELECT status, COUNT(*) FROM files GROUP BY status").fetchall())
        chunks = db.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    finally:
        db.close()
    size = _db_path(root).stat().st_size if _db_path(root).exists() else 0
    pend = by.get("pending", 0) + by.get("partial", 0)
    return {"corpus_dir": str(root), "index_db": str(_db_path(root)), "index_mb": round(size / 1e6, 1),
            "files": by, "chunks": chunks, "done": pend == 0 and sum(by.values()) > 0,
            "hint": "call kosif_corpus_index again until done=true" if pend else "ready for kosif_corpus_search"}


def _fts_query(q: str) -> list[str]:
    q = q.strip()
    phrase = re.findall(r'"([^"]+)"', q)
    toks = [t for t in _TOKEN.findall(norm(re.sub(r'"[^"]+"', " ", q))) if len(t) > 1 or t.isdigit()]
    out_and = [f'"{" ".join(_TOKEN.findall(norm(p)))}"' for p in phrase] + [f'"{t}"' for t in toks]
    if not out_and:
        raise ToolError("empty query")
    qs = [" AND ".join(out_and)]
    if len(out_and) > 1:
        qs.append(" OR ".join(out_and))
    return qs


def search(query: str, limit: int = 8, per_file: int = 3, file_like: str | None = None, width: int = 500) -> dict:
    root = _root()
    if not _db_path(root).exists():
        raise ToolError("corpus not indexed yet. Call kosif_corpus_index first.")
    db = _connect(root)
    try:
        return _search(db, root, query, limit, per_file, file_like, width)
    finally:
        db.close()


def _search(db, root, query, limit, per_file, file_like, width) -> dict:
    hits, seen_chunks = [], set()
    count: dict[str, int] = {}
    want = [t for t in _TOKEN.findall(norm(query)) if len(t) > 1]
    for qs in _fts_query(query):
        rows = db.execute(
            "SELECT fts.rowid, bm25(fts) AS r FROM fts WHERE fts MATCH ? ORDER BY r LIMIT ?",
            (qs, max(60, limit * 12))).fetchall()
        for rid, score in rows:
            if rid in seen_chunks:
                continue
            c = db.execute("SELECT chunks.off, chunks.len, files.rel, files.id FROM chunks JOIN files ON files.id=chunks.file_id WHERE chunks.id=?", (rid,)).fetchone()
            if not c:
                continue
            off, ln, rel, fid = c
            if file_like and not fnmatch.fnmatch(rel.lower(), file_like.lower()):
                continue
            if count.get(rel, 0) >= per_file:
                continue
            seen_chunks.add(rid)
            count[rel] = count.get(rel, 0) + 1
            try:
                with open(root / rel, "rb") as f:
                    f.seek(off)
                    text = f.read(ln).decode("utf-8", "replace")
            except OSError:
                text = ""
            nt, idx = _norm_map(text)
            pos = min((nt.find(t) for t in want if nt.find(t) >= 0), default=0)
            o = idx[pos] if idx and pos < len(idx) else 0
            a, b = max(0, o - width // 3), min(len(text), o + width)
            hits.append({"file": rel, "offset": off, "score": round(-score, 3), "snippet": text[a:b].strip()})
            if len(hits) >= limit:
                break
        if len(hits) >= limit:
            break
    dups = {}
    for h in hits:
        r = db.execute("SELECT id FROM files WHERE rel=?", (h["file"],)).fetchone()
        if r:
            d = [x[0] for x in db.execute("SELECT rel FROM files WHERE dup_of=?", (r[0],))]
            if d:
                dups[h["file"]] = d[:5]
    out = {"query": query, "count": len(hits), "results": hits}
    if dups:
        out["identical_copies"] = dups
    return out


def read(rel: str, offset: int = 0, length: int = 6000) -> dict:
    root = _root()
    p = resolve_inside(root, rel)
    if not p.is_file():
        raise ToolError(f"not a file in the corpus: {rel}")
    length = max(200, min(int(length), 30000))
    with open(p, "rb") as f:
        f.seek(max(0, int(offset)))
        raw = f.read(length)
        nxt = f.tell()
        more = bool(f.read(1))
    cut = len(raw)
    if more and cut > 4:  # don't end mid-character
        while cut > 0 and (raw[cut - 1] & 0xC0) == 0x80:
            cut -= 1
        if cut and raw[cut - 1] >= 0xC0:
            cut -= 1
        nxt -= len(raw) - cut
    return {"file": rel, "offset": offset, "next_offset": nxt if more else None,
            "text": raw[:cut].decode("utf-8", "replace")}


def files(limit: int = 200, status_filter: str | None = None) -> dict:
    root = _root()
    db = _connect(root)
    try:
        return _files(db, limit, status_filter)
    finally:
        db.close()


def _files(db, limit, status_filter) -> dict:
    q = "SELECT f.rel, f.size, f.status, f.chunks, d.rel FROM files f LEFT JOIN files d ON d.id=f.dup_of"
    args: list = []
    if status_filter:
        q += " WHERE f.status=?"
        args.append(status_filter)
    q += " ORDER BY f.size DESC LIMIT ?"
    args.append(max(1, min(int(limit), 1000)))
    return {"files": [{"file": r[0], "mb": round(r[1] / 1e6, 2), "status": r[2], "chunks": r[3],
                       **({"duplicate_of": r[4]} if r[4] else {})} for r in db.execute(q, args)]}


# ── tools ────────────────────────────────────────────────────────────────────
_HINT = "Call kosif_corpus_configure path=<folder with your text files> (or set KOSIF_CORPUS_DIR and restart)."


@tool("kosif_corpus_status", "State of your local corpus index (folder, files by status, chunks, size).",
      obj({}), title="Corpus status", gpt=True)
def _t_status(a):
    if corpus_dir() is None:
        return {"configured": False, "hint": _HINT}
    return {"configured": True, **status()}


@tool("kosif_corpus_configure",
      "Choose the corpus folder (saved in the KOSIF state dir, survives restarts). The folder must already be "
      "inside a directory enabled for file tools, so this never widens the sandbox. KOSIF_CORPUS_DIR overrides it.",
      obj({"path": S("Folder holding your text files (absolute, or relative to the first enabled folder).")},
          ["path"]),
      title="Configure corpus", read_only=False)
def _t_configure(a):
    if os.environ.get("KOSIF_CORPUS_DIR"):
        raise ToolError(f"KOSIF_CORPUS_DIR is set ({os.environ['KOSIF_CORPUS_DIR']}) and takes precedence; "
                        "change or unset it instead.")
    try:
        real = resolve_allowed(str(a.get("path", "")), want_dir=True)
    except (SandboxError, FileNotFoundError) as e:
        raise ToolError(str(e)) from None
    save_config(corpus_dir=str(real))
    return {"configured": True, "corpus_dir": str(real), **status(),
            "next": "kosif_corpus_index (repeat until done=true), then kosif_corpus_search"}


@tool("kosif_corpus_index",
      "Build or resume the local full-text index of your corpus folder (runs within a time budget; call again "
      "until done=true). Exact duplicate files are indexed once. Use rebuild=true if files changed.",
      obj({"time_budget_s": {"type": "number", "description": "Seconds to work this call (default 90, max 600).",
                             "minimum": 5, "maximum": 600},
           "rebuild": B("Drop and rebuild the index."), "exclude": A(S(), "Extra filename globs to skip.")}),
      title="Index corpus", read_only=False)
def _t_index(a):
    return index(min(600.0, float(a.get("time_budget_s", 90))), bool(a.get("rebuild")), a.get("exclude"))


@tool("kosif_corpus_search",
      "Search your own files (prompts, books, code dumps) — Arabic-aware BM25 full-text. Quote phrases with "
      "\"...\". Returns file, offset and a snippet; use kosif_corpus_read for more context.",
      obj({"query": S("Words or a \"quoted phrase\" (Arabic or English)."),
           "limit": I("Max results (default 8).", minimum=1, maximum=30),
           "per_file": I("Max hits per file (default 3).", minimum=1, maximum=10),
           "file_like": S("Filename glob filter, e.g. *Dragon*")}, ["query"]),
      title="Search corpus", gpt=True)
def _t_search(a):
    return search(str(a.get("query", "")), int(a.get("limit", 8)), int(a.get("per_file", 3)), a.get("file_like"))


@tool("kosif_corpus_read", "Read a slice of a corpus file by relative path and byte offset (from search results).",
      obj({"file": S("Relative path inside the corpus folder."), "offset": I("Byte offset.", minimum=0),
           "length": I("Bytes to read (200–30000).", minimum=200, maximum=30000)}, ["file"]),
      title="Read corpus file", gpt=True)
def _t_read(a):
    return read(str(a["file"]), int(a.get("offset", 0)), int(a.get("length", 6000)))


@tool("kosif_corpus_files", "List corpus files with size, index status and duplicate relations.",
      obj({"limit": I("Max rows (default 200)."), "status": S("indexed | dup | binary | pending | partial")}),
      title="List corpus files")
def _t_files(a):
    return files(int(a.get("limit", 200)), a.get("status"))
