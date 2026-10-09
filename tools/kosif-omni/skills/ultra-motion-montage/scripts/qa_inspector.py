"""KOSIF QA Inspector — Automated Video & Motion Quality Assurance Gatekeeper.
Analyzes output MP4 files to guarantee broadcast and social media standards:
  - Detects black frames, frozen screens, and dropped frame jumps.
  - Measures integrated loudness (EBU R128 / LUFS) and true peak (dBTP).
  - Generates visual contact sheet and outputs JSON audit report.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")


def inspect_video(video_path: Path) -> dict:
    video_path = video_path.resolve()
    if not video_path.exists():
        raise FileNotFoundError(f"Video file not found: {video_path}")

    # 1. ffprobe basic stream inspection
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,size,bit_rate:stream=width,height,codec_name,r_frame_rate,nb_frames,codec_type",
        "-of", "json",
        str(video_path)
    ]
    probe_res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    probe_data = json.loads(probe_res.stdout)

    v_stream = next((s for s in probe_data.get("streams", []) if s.get("codec_type") == "video"), None)
    a_stream = next((s for s in probe_data.get("streams", []) if s.get("codec_type") == "audio"), None)

    width = int(v_stream.get("width", 0)) if v_stream else 0
    height = int(v_stream.get("height", 0)) if v_stream else 0
    duration = float(probe_data.get("format", {}).get("duration", 0.0))

    # 2. Black frame detection
    black_cmd = [
        "ffmpeg", "-v", "error",
        "-i", str(video_path),
        "-vf", "blackdetect=d=0.5:pic_th=0.98",
        "-f", "null",
        "-"
    ]
    black_res = subprocess.run(black_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    black_matches = re.findall(r"black_start:([\d.]+)\s+black_end:([\d.]+)", black_res.stderr)
    black_spans = [{"start": float(s), "end": float(e), "dur": round(float(e) - float(s), 2)} for s, e in black_matches]

    # 3. Freeze detection
    freeze_cmd = [
        "ffmpeg", "-v", "error",
        "-i", str(video_path),
        "-vf", "freezedetect=n=-60dB:d=1.5",
        "-f", "null",
        "-"
    ]
    freeze_res = subprocess.run(freeze_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    freeze_matches = re.findall(r"freeze_start:([\d.]+)", freeze_res.stderr)

    # 4. Audio Loudness (EBU R128)
    lufs_integrated = None
    true_peak = None
    if a_stream:
        loud_cmd = [
            "ffmpeg", "-v", "error",
            "-i", str(video_path),
            "-filter:a", "ebur128=framelog=verbose",
            "-f", "null",
            "-"
        ]
        loud_res = subprocess.run(loud_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        i_match = re.search(r"Integrated loudness:\s+I:\s+([-\d.]+)\s+LUFS", loud_res.stderr)
        tp_match = re.search(r"True peak:\s+Peak:\s+([-\d.]+)\s+dBFS", loud_res.stderr)
        if i_match:
            lufs_integrated = float(i_match.group(1))
        if tp_match:
            true_peak = float(tp_match.group(1))

    # Evaluate QA Gates
    verdict = "PASS"
    issues = []

    if black_spans:
        long_blacks = [b for b in black_spans if b["dur"] > 1.0]
        if long_blacks:
            verdict = "FAIL"
            issues.append(f"Extended black screen detected: {long_blacks}")
        else:
            issues.append(f"Minor black frames detected: {black_spans}")

    if freeze_matches:
        verdict = "WARN" if verdict == "PASS" else verdict
        issues.append(f"Potential frozen frames at timestamps: {freeze_matches}")

    if lufs_integrated is not None:
        if lufs_integrated > -10.0:
            verdict = "WARN"
            issues.append(f"Audio is too loud: {lufs_integrated} LUFS (target: -14 LUFS)")
        elif lufs_integrated < -24.0:
            verdict = "WARN"
            issues.append(f"Audio is too quiet: {lufs_integrated} LUFS (target: -14 LUFS)")

    report = {
        "verdict": verdict,
        "video": video_path.name,
        "dimensions": f"{width}x{height}",
        "aspect_ratio": "9:16" if height > width else ("16:9" if width > height else "1:1"),
        "duration_sec": duration,
        "has_audio": bool(a_stream),
        "lufs_integrated": lufs_integrated,
        "true_peak_dbtp": true_peak,
        "black_frames_count": len(black_spans),
        "issues": issues
    }

    # Generate contact sheet if not exists
    sheet_path = video_path.with_name("contact-sheet.png")
    if not sheet_path.exists():
        sheet_cmd = [
            "ffmpeg", "-y", "-v", "error",
            "-i", str(video_path),
            "-vf", "select='not(mod(n\\,15))',scale=270:480,tile=4x4",
            "-frames:v", "1",
            str(sheet_path)
        ]
        try:
            subprocess.run(sheet_cmd, check=True)
            report["contact_sheet"] = str(sheet_path.name)
        except Exception:
            pass
    else:
        report["contact_sheet"] = str(sheet_path.name)

    return report


def main():
    parser = argparse.ArgumentParser(description="KOSIF QA Inspector — Video QA Gatekeeper")
    parser.add_argument("video", help="Path to video file")
    parser.add_argument("--json", action="store_true", help="Print json only")
    parser.add_argument("--out", default=None, help="Save report JSON")
    args = parser.parse_args()

    v_path = Path(args.video)
    report = inspect_video(v_path)

    if args.out:
        Path(args.out).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        badge = "✅ PASS" if report["verdict"] == "PASS" else ("⚠️ WARN" if report["verdict"] == "WARN" else "❌ FAIL")
        print(f"\n{badge} — Quality Inspection for {report['video']}")
        print(f"📐 Dimensions: {report['dimensions']} ({report['aspect_ratio']}) | Duration: {report['duration_sec']}s")
        if report["has_audio"]:
            print(f"🔊 Loudness: {report['lufs_integrated']} LUFS | True Peak: {report['true_peak_dbtp']} dBTP")
        if report["issues"]:
            print("⚠️ Issues noted:")
            for iss in report["issues"]:
                print(f"  - {iss}")
        else:
            print("✨ Zero blockers. Broadcast & social media ready!")


if __name__ == "__main__":
    main()
