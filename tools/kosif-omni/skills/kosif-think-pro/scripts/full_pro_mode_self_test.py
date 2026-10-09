from pathlib import Path
import json, importlib.util

ROOT=Path(__file__).resolve().parents[3]
manifest=json.loads((ROOT/"plugin.json").read_text(encoding="utf-8"))
legacy=json.loads((ROOT/".codex-plugin/plugin.json").read_text(encoding="utf-8"))
full=(ROOT/"skills/kosif-full-pro-all-experts/SKILL.md").read_text(encoding="utf-8")
lock=(ROOT/"skills/kosif-full-pro-execution-gate/SKILL.md").read_text(encoding="utf-8")
image=(ROOT/"skills/kosif-image-studio/SKILL.md").read_text(encoding="utf-8")
combined="\n".join([json.dumps(manifest,ensure_ascii=False),json.dumps(legacy,ensure_ascii=False),full,lock,image])
for marker in ["100×100","Full Pro Execution Lock","No PASS = no executor","full_pro_execution_gate.py check","image_gen","authorization_ready=true","request_id"]:
    assert marker in combined, marker
assert manifest["version"]=="4.6.0" and legacy["version"]=="4.6.0"
print("PASS: v4.6 Full Pro fail-closed execution-lock contract is present in manifest, all-expert gate and image executor skill.")
