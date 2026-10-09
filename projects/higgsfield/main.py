"""Seedance 2.5 text-to-video through the official Higgsfield Python SDK.

Credentials: HF_KEY="key-id:key-secret" in .env.local next to this file (never committed, never printed).
"""
import os
import sys

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local"))

import higgsfield_client  # noqa: E402  (reads HF_KEY at call time)
from higgsfield_client.exceptions import CredentialsMissedError, HiggsfieldClientError  # noqa: E402

MODEL = "bytedance/seedance-2.5/text-to-video"
ARGS = {
    "prompt": "A cinematic scene at sunset",
    "duration": 5,
    "resolution": "720p",
    "aspect_ratio": "16:9",
}


def video_url(result):
    video = result.get("video")
    if isinstance(video, dict):
        return video.get("url")
    if isinstance(video, list) and video and isinstance(video[0], dict):
        return video[0].get("url")
    if isinstance(video, str):
        return video
    return None


def main() -> int:
    if not os.getenv("HF_KEY"):
        print("HF_KEY is not set: add it to higgsfield/.env.local as key-id:key-secret.", file=sys.stderr)
        return 2
    last = {}

    def on_update(s):
        # The SDK yields Status objects (Queued, InProgress, Completed, Failed, NSFW, Cancelled).
        name = type(s).__name__.lower()
        if last.get("name") != name:
            print(f"status: {name}", flush=True)
        last["name"] = name

    try:
        result = higgsfield_client.subscribe(
            MODEL,
            arguments=ARGS,
            on_enqueue=lambda rid: print(f"queued: request {rid}", flush=True),
            on_queue_update=on_update,
        )
    except CredentialsMissedError:
        print("Higgsfield credentials are missing.", file=sys.stderr)
        return 2
    except HiggsfieldClientError as e:
        print(f"Higgsfield request failed: {e}", file=sys.stderr)
        return 1

    # subscribe() returns the response JSON; the terminal status comes from polling.
    status = {"cancelled": "canceled"}.get(last.get("name"), last.get("name")) or result.get("status")
    if status != "completed":
        reason = {"failed": "the generation failed", "nsfw": "the request was moderated (nsfw)",
                  "canceled": "the request was canceled"}.get(status, f"unexpected status {status!r}")
        print(f"No video: {reason}.", file=sys.stderr)
        return 1

    url = video_url(result)
    if not url:
        print(f"Completed but no video URL in the response (keys: {sorted(result)}).", file=sys.stderr)
        return 1
    print(url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
