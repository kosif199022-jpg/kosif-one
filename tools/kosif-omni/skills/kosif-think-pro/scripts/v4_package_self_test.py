#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def run():
    manifest=json.loads((ROOT/'plugin.json').read_text(encoding='utf-8'))
    codex=json.loads((ROOT/'.codex-plugin/plugin.json').read_text(encoding='utf-8'))
    checks={
      'version': manifest.get('version')=='4.5.0' and codex.get('version')=='4.5.0',
      'mass-helper': (ROOT/'skills/kosif-think-pro/scripts/expert_jev_mass_deliberation.py').exists(),
      'mass-test': (ROOT/'skills/kosif-think-pro/scripts/expert_jev_mass_deliberation_self_test.py').exists(),
      'chief': (ROOT/'skills/kosif-einstein-chief-expert/SKILL.md').exists(),
      'visual': (ROOT/'skills/kosif-visual-aesthetics-council/SKILL.md').exists(),
      'full-gate': (ROOT/'skills/kosif-full-pro-all-experts/SKILL.md').exists(),
    }
    failed=[k for k,v in checks.items() if not v]
    print(json.dumps({'ok':not failed,'version':'4.5.0','failed':failed},sort_keys=True))
    return 0 if not failed else 1
if __name__=='__main__': raise SystemExit(run())
