"""Generate the shot plates with Higgsfield Marketing Studio Image (direct mode, 9:16).

Credentials: HF_KEY from ../higgsfield/.env.local (never printed).
"""
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from dotenv import load_dotenv

HERE = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(HERE, "..", "higgsfield", ".env.local"))

import higgsfield_client  # noqa: E402
from higgsfield_client.exceptions import HiggsfieldClientError  # noqa: E402

MODEL = "marketing-studio/image"
STYLE = ("cinematic editorial photograph, vertical composition, shallow depth of field, anamorphic lens, "
         "film grain, rich negative space in the upper and lower thirds for typography, no text, no letters, "
         "no logos, no watermark")
SHOTS = {
    "s1_question": "a single man in a dark suit standing alone on a huge dark stage, one hard spotlight from above, "
                   "dust in the light beam, deep black background, mysterious and contemplative mood, teal shadows",
    "s2_hall": "a vast modern conference auditorium in North America seen from behind the speaker, about a thousand "
               "people in the audience, warm stage lights, big blue LED wall glow, atmospheric haze",
    "s3_money": "a tense businessman in a cold glass skyscraper office at night, city lights below, stacks of "
                "financial reports and glowing stock charts reflected in the glass, cold steel-blue light, "
                "lonely and pressured, his face worried",
    "s4_joy": "a joyful man laughing with his whole body, jumping in the air outdoors in golden hour light, "
              "arms wide, warm sun flare, motion, pure happiness, open sky",
    "s5_moment": "silhouette of a person standing on a hilltop at sunset with arms open, golden sky, warm orange "
                 "and pink clouds, peaceful, living the moment, vast landscape",
    "s6_paths": "aerial view of many winding roads branching in every direction through a glowing landscape at "
                "dusk, hundreds of lit paths like a network, blue and gold palette, sense of infinite possibilities",
}


def one(name: str, prompt: str):
    out = os.path.join(HERE, "assets", name + ".png")
    if os.path.exists(out):
        return name, "exists", out
    last = {}
    try:
        result = higgsfield_client.subscribe(
            MODEL,
            arguments={"prompt": f"{prompt}. {STYLE}", "aspect_ratio": "9:16", "resolution": "2k"},
            on_queue_update=lambda s: last.__setitem__("s", type(s).__name__.lower()),
        )
    except HiggsfieldClientError as e:
        return name, f"error: {e}", None
    if last.get("s") != "completed":
        return name, f"status {last.get('s')}", None
    images = result.get("images") or []
    url = images[0].get("url") if images and isinstance(images[0], dict) else None
    if not url:
        return name, f"no url (keys {sorted(result)})", None
    urllib.request.urlretrieve(url, out)
    return name, url, out


def main() -> int:
    if not os.getenv("HF_KEY"):
        print("HF_KEY is not set", file=sys.stderr)
        return 2
    os.makedirs(os.path.join(HERE, "assets"), exist_ok=True)
    only = sys.argv[1:] or list(SHOTS)
    with ThreadPoolExecutor(6) as ex:
        res = list(ex.map(lambda k: one(k, SHOTS[k]), only))
    ok = True
    for name, info, path in res:
        print(f"{name}: {info}")
        ok &= path is not None
    json.dump({n: i for n, i, _ in res}, open(os.path.join(HERE, "assets", "sources.json"), "w"), indent=1)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
