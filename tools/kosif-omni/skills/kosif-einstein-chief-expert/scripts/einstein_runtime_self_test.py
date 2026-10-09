#!/usr/bin/env python3
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import einstein_runtime as er
req="e-1"; rs=[]
for st in er.STAGES:
    out={}
    if st=="observation": out={"observations":["duck"],"inferences":[],"uncertainties":[],"evidence_refs":["drive://x"]}
    elif st=="first_principles": out={"essence":"duel","governing_tension":"small vs huge","invariants":["scale"],"incidental":[]}
    elif st=="gedanken": out={"experiments":[{"premise":"observer is ant-sized"}]}
    elif st=="observer_relativity": out={"frames":[{"observer":"cinematographer"}],"invariants_across_frames":["scale"]}
    elif st=="unification": out={"candidates":[{"id":"A"},{"id":"B"}]}
    elif st=="simplicity_critic": out={"verdict":"accept","scores":{"fidelity":9,"economy":9}}
    elif st=="revision": out={"final_candidate_id":"A","candidate_digest":"d"*64}
    rs.append({"observed":True,"request_id":req,"stage":st,"model":"m","output":out})
v=er.validate_bundle({"request_id":req,"stage_receipts":rs}); assert v["stage_count"]==7 and v["final_candidate_id"]=="A"
bad=list(rs); bad[0]=dict(bad[0]); bad[0]["request_id"]="old"
try: er.validate_bundle({"request_id":req,"stage_receipts":bad}); raise AssertionError("stale should fail")
except ValueError as e: assert "request mismatch" in str(e)
print("PASS: Einstein runtime requires ordered source-aware structured receipts across all seven stages.")
