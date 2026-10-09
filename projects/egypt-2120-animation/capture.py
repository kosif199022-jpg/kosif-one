"""Render index.html frame by frame (deterministic render(t)) at 1080x1920 and save PNG frames.

usage: python capture.py [--fps 30] [--only 0.5,3.5,...]   (--only renders just those times, for QA stills)
"""
import argparse
import json
import shutil
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--dur", type=float, default=18.0)
ap.add_argument("--only", default="")
ap.add_argument("--out", default="frames")
a = ap.parse_args()

out = HERE / a.out
if not a.only:
    shutil.rmtree(out, ignore_errors=True)
out.mkdir(exist_ok=True)
times = [float(x) for x in a.only.split(",")] if a.only else [i / a.fps for i in range(int(round(a.dur * a.fps)))]

errors = []
t0 = time.time()
with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True, args=["--ignore-gpu-blocklist", "--use-angle=d3d11"])
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.goto((HERE / "index.html").as_uri() + "?capture=1")
    page.wait_for_function("window.__ready === true", timeout=120000)
    for i, t in enumerate(times):
        page.evaluate(f"window.render({t})")
        name = f"t_{t:06.2f}.png" if a.only else f"f_{i:04d}.png"
        page.screenshot(path=str(out / name), clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
    browser.close()
print(json.dumps({"frames": len(times), "seconds": round(time.time() - t0, 1), "errors": errors[:10]}, ensure_ascii=False))
