"""Render index.html frame by frame (deterministic render(t)) and encode water-cycle-10s.mp4.

usage: python capture.py            # 1920x1080, 30 fps, 10 s = 300 frames
"""
import shutil
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
FPS, DUR, W, H = 30, 10, 1920, 1080
frames = HERE / "frames"
shutil.rmtree(frames, ignore_errors=True)
frames.mkdir()

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    page.goto((HERE / "index.html").as_uri() + "?capture=1")
    page.wait_for_function("window.__ready === true", timeout=30000)
    fonts = page.evaluate("document.fonts.check('700 54px Cairo')")
    svg = page.locator("#stage")
    for i in range(FPS * DUR):
        page.evaluate(f"window.render({i / FPS})")
        svg.screenshot(path=str(frames / f"f_{i:04d}.png"))
    browser.close()

out = HERE / "water-cycle-10s.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(frames / "f_%04d.png"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart",
                str(out)], check=True)
print({"frames": FPS * DUR, "cairo_font_loaded": fonts, "out": str(out), "bytes": out.stat().st_size})
sys.exit(0)
