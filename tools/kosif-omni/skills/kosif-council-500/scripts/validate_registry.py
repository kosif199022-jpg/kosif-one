#!/usr/bin/env python3
import json, pathlib, sys
P = pathlib.Path(__file__).resolve().parents[1] / "references" / "council-500-personas.json"
def main():
    d=json.loads(P.read_text(encoding="utf-8"))
    xs=d["experts"]
    errs=[]
    if d.get("member_count")!=500 or len(xs)!=500: errs.append("COUNT")
    if len({x["expert_id"] for x in xs})!=500: errs.append("DUP_ID")
    if len({x["persona_name"] for x in xs})!=500: errs.append("DUP_PERSONA")
    if any(x.get("independence")!="No peer outputs before freeze." for x in xs): errs.append("INDEPENDENCE")
    if any("original user image/asset reference" not in x.get("visual_input_contract","") for x in xs): errs.append("VISUAL_SOURCE")
    print(json.dumps({"ok":not errs,"member_count":len(xs),"chair":d["chair"],"errors":errs},ensure_ascii=False))
    return 1 if errs else 0
if __name__=="__main__": raise SystemExit(main())
