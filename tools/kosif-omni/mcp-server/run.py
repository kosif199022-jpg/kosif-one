#!/usr/bin/env python3
"""Launcher: `python run.py` (stdio) or `python run.py --http --workspace DIR`."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kosif_mcp.__main__ import main  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main())
