#!/usr/bin/env python3
"""KOSIF C VideoFetch: unattended, bounded download of public HTTPS video links.

Uses the user's Cinema C V32 methods: yt-dlp -> one deterministic output ->
FFmpeg iPhone-safe MP4 -> verify -> issue integrity receipt.

Intended for an unprivileged ephemeral runner. Never requests login/cookies, launches
untrusted command text, or downloads encrypted/protected streaming material.
"""
from __future__ import annotations

import argparse
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
from urllib.parse import urlsplit

MAX_BYTES = 150 * 1024 * 1024
MAX_SECONDS = 15 * 60
MAX_HEIGHT = 720
EXEMPT_HOSTS = set()  # Never exempt internal names from the public-IP check.


def validate_url(raw: str) -> str:
    if not isinstance(raw, str) or not (12 <= len(raw) <= 2048):
        raise ValueError("URL missing or too long")
    if any(ord(c) < 33 for c in raw):
        raise ValueError("Whitespace/control character in URL")
    u = urlsplit(raw)
    if u.scheme != "https" or not u.hostname or u.username or u.password:
        raise ValueError("Only public unauthenticated HTTPS URLs are allowed")
    if u.port not in (None, 443) or '\\' in raw:
        raise ValueError("Non-standard port or malformed URL")
    host = u.hostname.rstrip('.').lower()
    if host == 'localhost' or host.endswith(('.local', '.internal', '.localhost')):
        raise ValueError("Private domain blocked")
    try:
        addresses = {record[4][0] for record in socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)}
    except OSError as e:
        raise ValueError(f"Hostname resolution failed: {type(e).__name__}") from e
    if not addresses or not all(ipaddress.ip_address(a).is_global for a in addresses):
        raise ValueError("Private, reserved or mixed network addresses blocked")
    return raw


def run_command(cmd: list[str], timeout: int = 300) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def choose_source(workdir: Path) -> Path:
    # Isolated work dir, never trust a filename/path supplied by the link.
    okay = [p for p in workdir.iterdir() if p.is_file() and
            p.suffix.lower() in {'.mp4', '.mkv', '.webm', '.mov', '.m4v'}]
    if len(okay) != 1:
        raise RuntimeError(f"Expected exactly one media file, found {len(okay)}")
    p = okay[0]
    if p.stat().st_size <= 0 or p.stat().st_size > MAX_BYTES:
        raise RuntimeError("Source media size outside configured budget")
    return p


def inspect(path: Path) -> dict:
    p = run_command(['ffprobe', '-v', 'error', '-show_entries',
                     'format=duration,size:stream=codec_type,codec_name,width,height',
                     '-of', 'json', str(path)], timeout=30)
    if p.returncode:
        raise RuntimeError(f"Invalid media: {p.stderr[-400:]}")
    info = json.loads(p.stdout)
    duration = float(info['format'].get('duration') or 0)
    if not (0 < duration <= MAX_SECONDS + 1):
        raise RuntimeError("Unsupported/too long video duration")
    if not any(s.get('codec_type') == 'video' for s in info.get('streams', [])):
        raise RuntimeError("Downloaded media has no video stream")
    return info


def download(url: str, workdir: Path) -> Path:
    formats = [
        'bv*[height<=720]+ba/b[height<=720]/best[height<=720]',
        'b[height<=720]/best',
    ]
    errors = []
    for i, fmt in enumerate(formats):
        # Reset only this job's folder. Never remove any external path.
        for p in workdir.iterdir():
            if p.is_file():
                p.unlink()
        cmd = [
            'yt-dlp', '--ignore-config', '--no-playlist', '--no-progress',
            '--socket-timeout', '20', '--retries', '2', '--fragment-retries', '2',
            '--extractor-retries', '1', '--max-filesize', '150M',
            '--merge-output-format', 'mp4', '--format', fmt,
            '--output', str(workdir / 'source.%(ext)s'),
            '--', url,
        ]
        try:
            p = run_command(cmd, timeout=270)
        except subprocess.TimeoutExpired:
            errors.append(f'attempt_{i+1}: timeout')
            continue
        if p.returncode == 0:
            try:
                return choose_source(workdir)
            except RuntimeError as e:
                errors.append(f'attempt_{i+1}: {str(e)[:140]}')
        else:
            errors.append(f'attempt_{i+1}: downloader error {p.returncode}')
    raise RuntimeError('yt-dlp could not retrieve this public URL: ' + '; '.join(errors))


def normalize_to_iphone(source: Path, target: Path) -> dict:
    info = inspect(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    proc = run_command([
        'ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(source), '-map', '0:v:0', '-map', '0:a:0?',
        '-vf', "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '24',
        '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(target)
    ], timeout=450)
    if proc.returncode:
        raise RuntimeError('FFmpeg normalization failed: ' + proc.stderr[-500:])
    result = inspect(target)
    if target.stat().st_size > MAX_BYTES:
        target.unlink(missing_ok=True)
        raise RuntimeError('Output exceeds maximum file size')
    return result


def main() -> None:
    a = argparse.ArgumentParser(description='Fetch one public video as iPhone-safe MP4')
    source = a.add_mutually_exclusive_group(required=True)
    source.add_argument('--url')
    source.add_argument('--job')
    a.add_argument('--outdir', default='output')
    v = a.parse_args()
    if v.job:
        job = json.loads(Path(v.job).read_text(encoding='utf-8'))
        if not isinstance(job, dict) or set(job) != {'url'}:
            raise ValueError('Job must contain exactly one url field')
        url = validate_url(job['url'])
    else:
        url = validate_url(v.url)
    outdir = Path(v.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='kosif-fetch-') as td:
        src = download(url, Path(td))
        info = normalize_to_iphone(src, outdir / 'KOSIF-C-Video.mp4')
    target = outdir / 'KOSIF-C-Video.mp4'
    proof = {
        'status': 'verified', 'output': target.name,
        'source_domain': urlsplit(url).hostname,
        'duration': float(info['format']['duration']),
        'bytes': target.stat().st_size,
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'video_codec': next((s['codec_name'] for s in info['streams'] if s['codec_type']=='video'), None),
        'audio_codec': next((s['codec_name'] for s in info['streams'] if s['codec_type']=='audio'), None),
        'iPhone_compatible': True,
        'note': 'Only publicly downloadable material. No cookies, logins or DRM bypass.'
    }
    (outdir / 'KOSIF-C-Video-receipt.json').write_text(json.dumps(proof, indent=2), encoding='utf-8')
    print(json.dumps(proof, ensure_ascii=False))

if __name__ == '__main__':
    main()
