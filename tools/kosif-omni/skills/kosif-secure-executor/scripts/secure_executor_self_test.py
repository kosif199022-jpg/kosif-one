#!/usr/bin/env python3
"""Synthetic secure-executor regression entrypoint."""
import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/"tests"))
from test_host_entry import Tests
suite=unittest.TestSuite(Tests(n) for n in ("test_12_executor_mismatch","test_13_candidate_mismatch","test_16_ticket_one_time","test_17_replay_after_restart","test_18_expired","test_27_signed_binding_tamper"))
if not unittest.TextTestRunner(verbosity=2).run(suite).wasSuccessful(): raise SystemExit(1)
