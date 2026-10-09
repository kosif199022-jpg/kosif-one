#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, sys
ROOT=Path(__file__).resolve().parents[3]
manifest=json.loads((ROOT/"plugin.json").read_text(encoding="utf-8"))
legacy=json.loads((ROOT/".codex-plugin/plugin.json").read_text(encoding="utf-8"))
assert manifest["version"]=="5.3.0" and legacy["version"]=="5.3.0"
combined="\n".join([
 (ROOT/"skills/kosif-think-pro/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-runtime-orchestrator/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-full-pro-execution-engine/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-knowledge-atlas/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-full-pro-execution-gate/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-image-studio/SKILL.md").read_text(encoding="utf-8"),
 (ROOT/"skills/kosif-secure-executor/SKILL.md").read_text(encoding="utf-8")])
for marker in ["Runtime Controller","Execution Engine","100×100","Knowledge Atlas","data only","No PASS = no executor","SceneSpec","host-native","Secure Executor","BYPASS_DETECTED","HMAC"]:
    assert marker in combined, marker
scripts=[
 ROOT/"skills/kosif-full-pro-execution-engine/scripts/chunked_harvest_self_test.py",
 ROOT/"skills/kosif-full-pro-execution-engine/scripts/execution_engine_self_test.py",
 ROOT/"skills/kosif-full-pro-execution-engine/scripts/execution_runtime_bridge_self_test.py",
 ROOT/"skills/kosif-runtime-orchestrator/scripts/runtime_self_test.py",
 ROOT/"skills/kosif-runtime-orchestrator/scripts/secure_executor_runtime_self_test.py",
 ROOT/"skills/kosif-secure-executor/scripts/secure_executor_self_test.py",
 ROOT/"skills/kosif-knowledge-atlas/scripts/knowledge_atlas_self_test.py",
 ROOT/"skills/kosif-einstein-chief-expert/scripts/einstein_runtime_self_test.py",
 ROOT/"skills/kosif-image-studio/scripts/prompt_compiler_self_test.py",
]
for s in scripts:
    cp=subprocess.run([sys.executable,str(s)],text=True,capture_output=True)
    if cp.returncode:
        print(cp.stdout); print(cp.stderr,file=sys.stderr); raise SystemExit(cp.returncode)
    print(cp.stdout.strip())
print("PASS: KOSIF Think Pro 5.3.0 integration contract, Secure Executor boundary, active Execution Engine, and all v5.3 subsystem self-tests passed.")
