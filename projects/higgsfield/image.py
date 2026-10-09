"""One image through the official Higgsfield Python SDK (cheap credentials check).

Credentials: HF_KEY="key-id:key-secret" in .env.local next to this file (never committed, never printed).
"""
import os
import sys

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local"))

import higgsfield_client  # noqa: E402
from higgsfield_client.exceptions import CredentialsMissedError, HiggsfieldClientError  # noqa: E402

MODEL = "higgsfield-ai/soul/v2/standard"
ARGS = {"prompt": "A cinematic scene at sunset"}


def main() -> int:
    if not os.getenv("HF_KEY"):
        print("HF_KEY is not set: add it to higgsfield/.env.local as key-id:key-secret.", file=sys.stderr)
        return 2
    last = {}

    def on_update(s):
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

    status = {"cancelled": "canceled"}.get(last.get("name"), last.get("name")) or result.get("status")
    if status != "completed":
        print(f"No image: status {status!r}.", file=sys.stderr)
        return 1
    images = result.get("images") or []
    url = images[0].get("url") if images and isinstance(images[0], dict) else None
    if not url:
        print(f"Completed but no image URL in the response (keys: {sorted(result)}).", file=sys.stderr)
        return 1
    print(url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
