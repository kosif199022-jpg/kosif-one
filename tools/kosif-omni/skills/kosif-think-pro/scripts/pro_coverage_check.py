#!/usr/bin/env python3
"""Validate KOSIF Think Pro 4.3 mandatory all-expert coverage.
Reads one JSON object from stdin. Exit 0 = structurally complete.
This validates accounting/coverage, not truth or external tool execution.
"""
import json, sys

MODULES=[f"M{i:02d}" for i in range(1,29)]
PROFILES=[
    "Skeptic","Strict Verifier","Decisive Operator","Ambitious Optimizer",
    "Creative Explorer","Conservative Risk Guardian","Analytical Decomposer",
    "Adversarial Critic","Naive-Reasoning Simulator","Integrator","Bias Hunter",
    "Constraint Optimizer","Conflict Scout","Evidence Accountant"
]
INTERNAL_STATES={"contributed","reviewed-no-change","unavailable"}

def main():
    try:
        obj=json.load(sys.stdin)
    except Exception as e:
        print(json.dumps({"ok":False,"error":"invalid-json","detail":str(e)}))
        return 2
    modules=obj.get("modules") or {}
    profiles=obj.get("profiles") or {}
    council=obj.get("council") or {}
    specialists=obj.get("specialists") or {}

    missing_m=[m for m in MODULES if m not in modules]
    invalid_m={m:modules.get(m) for m in MODULES if m in modules and modules.get(m) not in INTERNAL_STATES}
    missing_p=[p for p in PROFILES if p not in profiles]
    invalid_p={p:profiles.get(p) for p in PROFILES if p in profiles and profiles.get(p) not in INTERNAL_STATES}

    member_states=council.get("members") or {}
    missing_c=[f"C{ci:02d}-P{i:02d}" for ci in range(1,11) for i in range(1,11)
               if f"C{ci:02d}-P{i:02d}" not in member_states]
    invalid_c={k:v for k,v in member_states.items() if v not in INTERNAL_STATES}
    chambers=set(council.get("chambers") or [])
    expected_chambers={"evidence","strategy","risk","creativity","human","engineering","design","media","finance-audit","automation-agents"}
    missing_chambers=sorted(expected_chambers-chambers)

    invalid_s={k:v for k,v in specialists.items() if v not in INTERNAL_STATES}
    ok=not (missing_m or invalid_m or missing_p or invalid_p or missing_c or invalid_c or missing_chambers or invalid_s)
    out={
        "ok":ok,
        "missing_modules":missing_m,"invalid_modules":invalid_m,
        "missing_profiles":missing_p,"invalid_profiles":invalid_p,
        "missing_council_members":missing_c,"invalid_council_members":invalid_c,
        "missing_chambers":missing_chambers,"invalid_specialists":invalid_s,
        "accounted":{"modules":28-len(missing_m),"profiles":14-len(missing_p),"council_members":100-len(missing_c),"chambers":10-len(missing_chambers)}
    }
    print(json.dumps(out,ensure_ascii=False,sort_keys=True))
    return 0 if ok else 1

if __name__=="__main__":
    raise SystemExit(main())
