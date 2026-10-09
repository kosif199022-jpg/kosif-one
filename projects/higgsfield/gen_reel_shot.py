"""Generates one 9:16 Seedance 2.5 shot for the October reel and downloads it next to the composition."""
import os
import sys
import urllib.request

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local"))
import higgsfield_client  # noqa: E402
from higgsfield_client.exceptions import HiggsfieldClientError  # noqa: E402
from main import video_url  # noqa: E402

OUT = os.path.expanduser(r"~\.claude\skills\kosif-montage-motion\scripts\projects\october_reel\assets\hf_flag.mp4")
ARGS = {
    "prompt": ("Close-up of the flag of Egypt (red, white and black horizontal stripes with a golden eagle in the white band) "
               "waving slowly in a strong wind on a tall flagpole, against a warm golden sunset sky over the desert "
               "and the blue water of the Suez Canal, low angle, cinematic slow motion, 35mm film grain, warm amber grade, "
               "dust glowing in the backlight, no text, no people"),
    "duration": 6,
    "resolution": "1080p",
    "aspect_ratio": "9:16",
    "generate_audio": False,
}

last = {}
try:
    result = higgsfield_client.subscribe(
        "bytedance/seedance-2.5/text-to-video", arguments=ARGS,
        on_enqueue=lambda rid: print("queued", rid, flush=True),
        on_queue_update=lambda s: last.__setitem__("name", type(s).__name__.lower()),
    )
except HiggsfieldClientError as e:
    sys.exit(f"request failed: {e}")
status = {"cancelled": "canceled"}.get(last.get("name"), last.get("name")) or result.get("status")
if status != "completed":
    sys.exit(f"no video: status {status}")
url = video_url(result)
if not url:
    sys.exit("completed without a video url")
urllib.request.urlretrieve(url, OUT)
print("saved", OUT, os.path.getsize(OUT))
