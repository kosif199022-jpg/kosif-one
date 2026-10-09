"""KOSIF Ultra Animator — Master CLI for High-Graphic Procedural Animation & AI Video Synthesis.
Commands:
  1. new: Scaffolds a 2D or 3D high-end animation project with deterministic render(t).
  2. capture: Headless Edge Direct3D 11 GPU capture of frames via Playwright.
  3. encode: FFmpeg H.264 high-quality encoding + contact sheet generation.
  4. ai_prompts: Generates 7-layer cinematic diffusion prompts for Veo, Sora, Kling, Runway.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SKILL_ROOT = HERE.parent
TEMPLATES_DIR = SKILL_ROOT / "templates"
PROJECTS_DIR = HERE / "projects"


def scaffold_project(name: str, anim_type: str = "3d", ratio: str = "9:16", seconds: float = 10.0, fps: int = 30, title: str = "") -> Path:
    """Create a new animation project with templates and deterministic clock."""
    proj_dir = PROJECTS_DIR / name
    if proj_dir.exists():
        print(f"⚠️ Project {name} already exists at {proj_dir}")
        return proj_dir

    proj_dir.mkdir(parents=True, exist_ok=True)
    frames_dir = proj_dir / "frames"
    frames_dir.mkdir(exist_ok=True)
    assets_dir = proj_dir / "assets"
    assets_dir.mkdir(exist_ok=True)

    # Copy local assets if available
    skill_assets = SKILL_ROOT / "assets"
    if skill_assets.exists():
        for f in skill_assets.glob("*.*"):
            shutil.copy(f, assets_dir / f.name)

    # Calculate width & height
    if ratio == "9:16":
        w, h = 1080, 1920
    elif ratio == "16:9":
        w, h = 1920, 1080
    elif ratio == "1:1":
        w, h = 1080, 1080
    else:
        parts = ratio.split("x")
        w, h = int(parts[0]), int(parts[1])

    display_title = title or name

    # Load template
    template_file = TEMPLATES_DIR / ("cinematic_3d.html" if anim_type == "3d" else "kinetic_2d.html")
    if template_file.exists():
        html_content = template_file.read_text(encoding="utf-8")
    else:
        # Fallback minimal template
        html_content = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body { margin:0; overflow:hidden; background:#0a0e17; color:#fff; font-family:sans-serif; }
#stage { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; }
</style></head>
<body><div id="stage"><h1 id="title">{{TITLE}}</h1></div>
<script>
window.__ready = true;
window.render = function(t) {
    const el = document.getElementById('title');
    el.style.transform = `scale(${1 + Math.sin(t * 2) * 0.1}) rotate(${Math.sin(t) * 5}deg)`;
};
</script></body></html>"""

    html_content = html_content.replace("{{TITLE}}", display_title)
    html_content = html_content.replace("{{WIDTH}}", str(w))
    html_content = html_content.replace("{{HEIGHT}}", str(h))
    html_content = html_content.replace("{{DURATION}}", str(seconds))
    html_content = html_content.replace("{{FPS}}", str(fps))

    (proj_dir / "index.html").write_text(html_content, encoding="utf-8")

    # Generate project manifest
    manifest = {
        "name": name,
        "title": display_title,
        "type": anim_type,
        "ratio": ratio,
        "width": w,
        "height": h,
        "duration": seconds,
        "fps": fps,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    (proj_dir / "project.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    # Generate Storyboard template
    storyboard = f"""# Storyboard & Shot List: {display_title}

- **Aspect Ratio:** {ratio} ({w}x{h})
- **Total Duration:** {seconds}s @ {fps} FPS
- **Visual Style:** Ultra-High Graphic {anim_type.upper()} Cinema

## Shots Breakdown
| # | Time | Shot Type | Camera Action | Visual Elements & Atmosphere |
|---|---|---|---|---|
| 1 | 0.0 - {round(seconds * 0.3, 1)}s | Wide Establishing | Slow Dolly-In | Hook, Title reveal, ambient particle glow |
| 2 | {round(seconds * 0.3, 1)} - {round(seconds * 0.7, 1)}s | Medium Hero | Orbit 45° | Core subject details, dynamic lighting shift |
| 3 | {round(seconds * 0.7, 1)} - {seconds}s | Close-up Payoff | Crane Up / Push | Climax, Call-to-action, glowing particle burst |
"""
    (proj_dir / "STORYBOARD.md").write_text(storyboard, encoding="utf-8")

    # Generate initial AI diffusion video prompts
    ai_prompts = {
        "title": display_title,
        "style_lock": f"Cinematic {anim_type} masterwork, volumetric raytracing, 8k resolution, octane render, 35mm anamorphic lens, high visual fidelity",
        "shots": [
            {
                "shot": 1,
                "time": f"0.0 - {round(seconds * 0.3, 1)}s",
                "veo2_prompt": f"Establishing cinematic shot of {display_title}, camera slow push-in, volumetric light rays, atmospheric haze, photorealistic, 4k 24fps",
                "sora_prompt": f"Hyper-detailed cinematic wide view of {display_title}, fluid camera tracking forward, golden hour lighting, cinematic depth of field",
                "kling_prompt": f"{display_title}, cinematic atmosphere, studio lighting, smooth camera movement forward, high texture detail, 1080p",
                "runway_gen3_prompt": f"Slow cinematic dolly-in shot of {display_title}, volumetric fog, highly detailed environment, dramatic lighting"
            }
        ]
    }
    (proj_dir / "ai_prompts.json").write_text(json.dumps(ai_prompts, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"✨ Project '{name}' created at {proj_dir}")
    print(f"📄 Files: index.html, project.json, STORYBOARD.md, ai_prompts.json")
    return proj_dir


def capture_frames(project_name: str, fps: int | None = None, out_dir: str = "frames", limit_frames: int | None = None) -> Path:
    """Capture frames deterministically using Playwright Edge D3D11 hardware acceleration."""
    from playwright.sync_api import sync_playwright

    proj_dir = PROJECTS_DIR / project_name if not Path(project_name).is_dir() else Path(project_name)
    index_html = proj_dir / "index.html"
    if not index_html.exists():
        raise FileNotFoundError(f"index.html not found in {proj_dir}")

    manifest_file = proj_dir / "project.json"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else {}

    target_fps = fps or manifest.get("fps", 30)
    duration = float(manifest.get("duration", 10.0))
    w = int(manifest.get("width", 1080))
    h = int(manifest.get("height", 1920))

    frames_path = proj_dir / out_dir
    frames_path.mkdir(parents=True, exist_ok=True)

    total_frames = int(round(duration * target_fps))
    if limit_frames:
        total_frames = min(total_frames, limit_frames)

    times = [i / target_fps for i in range(total_frames)]

    print(f"📸 Capturing {total_frames} frames ({w}x{h} @ {target_fps}fps) with Edge Direct3D 11...")
    t0 = time.time()
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="msedge",
            headless=True,
            args=["--ignore-gpu-blocklist", "--use-angle=d3d11", "--enable-zero-copy"]
        )
        page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: m.type == "error" and errors.append(m.text))

        page.goto(index_html.as_uri(), wait_until="domcontentloaded")
        page.wait_for_function("window.__ready === true", timeout=60000)

        for i, t in enumerate(times):
            page.evaluate(f"window.render({t})")
            frame_file = frames_path / f"f_{i:04d}.png"
            page.screenshot(path=str(frame_file), clip={"x": 0, "y": 0, "width": w, "height": h})
            if (i + 1) % 30 == 0 or (i + 1) == total_frames:
                print(f"  Captured frame {i+1}/{total_frames} ({round(t, 2)}s)")

        browser.close()

    elapsed = round(time.time() - t0, 2)
    print(f"✅ Rendered {total_frames} frames in {elapsed}s ({round(total_frames / elapsed, 1)} fps capture rate)")
    if errors:
        print(f"⚠️ Page errors recorded: {errors[:3]}")
    return frames_path


def encode_mp4(project_name: str, fps: int | None = None, audio_file: str | None = None, crf: int = 17, out_file: str | None = None) -> Path:
    """Encode captured PNG frames into a high-fidelity MP4 using FFmpeg."""
    proj_dir = PROJECTS_DIR / project_name if not Path(project_name).is_dir() else Path(project_name)
    manifest_file = proj_dir / "project.json"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else {}
    target_fps = fps or manifest.get("fps", 30)

    frames_dir = proj_dir / "frames"
    if not list(frames_dir.glob("f_*.png")):
        raise FileNotFoundError(f"No frames found in {frames_dir}. Run 'capture' first!")

    out_mp4 = Path(out_file) if out_file else (proj_dir / f"{proj_dir.name}.mp4")

    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-framerate", str(target_fps),
        "-i", str(frames_dir / "f_%04d.png")
    ]

    # Add audio if present
    audio_path = Path(audio_file) if audio_file else (proj_dir / "assets" / "soundtrack.wav")
    if audio_path.exists():
        cmd.extend(["-i", str(audio_path), "-c:a", "aac", "-b:a", "256k", "-shortest"])
    else:
        cmd.extend(["-an"])

    cmd.extend([
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", str(crf),
        "-pix_fmt", "yuv420p",
        str(out_mp4)
    ])

    print(f"🎞️ Encoding MP4 to {out_mp4.name} (CRF {crf})...")
    subprocess.run(cmd, check=True)

    # Generate contact sheet
    sheet_png = proj_dir / "contact-sheet.png"
    sheet_cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-i", str(out_mp4),
        "-vf", "select='not(mod(n\\,15))',scale=270:480,tile=4x4",
        "-frames:v", "1",
        str(sheet_png)
    ]
    try:
        subprocess.run(sheet_cmd, check=True)
        print(f"🖼️ Contact sheet generated: {sheet_png}")
    except Exception:
        pass

    print(f"🎉 Final video created: {out_mp4} ({round(out_mp4.stat().st_size / (1024*1024), 2)} MB)")
    return out_mp4


def main():
    parser = argparse.ArgumentParser(description="KOSIF Ultra Animator — High-Graphic Animation Engine")
    subparsers = parser.add_subparsers(dest="command")

    # new project
    p_new = subparsers.add_parser("new", help="Create a new animation project")
    p_new.add_argument("name", help="Project name")
    p_new.add_argument("--type", choices=["2d", "3d"], default="3d", help="Animation type")
    p_new.add_argument("--ratio", default="9:16", help="Aspect ratio: 9:16, 16:9, or 1:1")
    p_new.add_argument("--seconds", type=float, default=10.0, help="Duration in seconds")
    p_new.add_argument("--fps", type=int, default=30, help="Frame rate")
    p_new.add_argument("--title", default="", help="Arabic or English title")

    # capture command
    p_cap = subparsers.add_parser("capture", help="Capture frames with Playwright Edge D3D11")
    p_cap.add_argument("name", help="Project name or directory")
    p_cap.add_argument("--fps", type=int, default=None)
    p_cap.add_argument("--limit", type=int, default=None, help="Limit frames to test")

    # encode command
    p_enc = subparsers.add_parser("encode", help="Encode frames to MP4 with FFmpeg")
    p_enc.add_argument("name", help="Project name or directory")
    p_enc.add_argument("--fps", type=int, default=None)
    p_enc.add_argument("--audio", default=None)
    p_enc.add_argument("--crf", type=int, default=17)
    p_enc.add_argument("--out", default=None)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    if args.command == "new":
        scaffold_project(args.name, anim_type=args.type, ratio=args.ratio, seconds=args.seconds, fps=args.fps, title=args.title)
    elif args.command == "capture":
        capture_frames(args.name, fps=args.fps, limit_frames=args.limit)
    elif args.command == "encode":
        encode_mp4(args.name, fps=args.fps, audio_file=args.audio, crf=args.crf, out_file=args.out)


if __name__ == "__main__":
    main()
