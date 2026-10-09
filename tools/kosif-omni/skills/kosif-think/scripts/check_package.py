from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[3]
required=["plugin.json",".app.json",".codex-plugin/plugin.json",".mcp.json","mcp.json","skills/kosif-think/SKILL.md"]
missing=[x for x in required if not (root/x).exists()]
try: p=json.loads((root/"plugin.json").read_text(encoding="utf-8"))
except Exception as e: print(json.dumps({"ok":False,"error":str(e)}));sys.exit(1)
ok=not missing and p.get("name")=="dev-6ab99d2211808191b751af49dc5f7cf9"
print(json.dumps({"ok":ok,"version":p.get("version"),"missing":missing}))
sys.exit(0 if ok else 1)
