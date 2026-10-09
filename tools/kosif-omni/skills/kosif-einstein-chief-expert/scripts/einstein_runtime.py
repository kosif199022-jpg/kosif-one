#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json
from typing import Any

STAGES=["observation","first_principles","gedanken","observer_relativity","unification","simplicity_critic","revision"]

def digest(obj:Any)->str:
    return hashlib.sha256(json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(",",":"),default=str).encode()).hexdigest()

def validate_stage(stage:str, receipt:dict, request_id:str)->dict:
    if stage not in STAGES: raise ValueError("unknown Einstein stage")
    if receipt.get("observed") is not True: raise ValueError(f"{stage}: observed must be true")
    if str(receipt.get("request_id") or "")!=request_id: raise ValueError(f"{stage}: request mismatch")
    if receipt.get("stage")!=stage: raise ValueError(f"{stage}: stage mismatch")
    if not receipt.get("model"): raise ValueError(f"{stage}: model required")
    out=receipt.get("output")
    if not isinstance(out,dict): raise ValueError(f"{stage}: structured output required")
    if stage=="observation":
        for k in ["observations","inferences","uncertainties","evidence_refs"]:
            if k not in out or not isinstance(out[k],list): raise ValueError(f"observation: {k} list required")
    elif stage=="first_principles":
        for k in ["essence","governing_tension","invariants","incidental"]:
            if k not in out: raise ValueError(f"first_principles: {k} required")
    elif stage=="gedanken":
        if not isinstance(out.get("experiments"),list) or not out["experiments"]: raise ValueError("gedanken experiments required")
    elif stage=="observer_relativity":
        if not isinstance(out.get("frames"),list) or not isinstance(out.get("invariants_across_frames"),list): raise ValueError("observer frames/invariants required")
    elif stage=="unification":
        c=out.get("candidates") or []
        if not 2<=len(c)<=4: raise ValueError("unification must yield 2..4 candidates")
    elif stage=="simplicity_critic":
        if out.get("verdict") not in {"accept","revise"}: raise ValueError("critic verdict invalid")
        if not isinstance(out.get("scores"),dict): raise ValueError("critic scores required")
    elif stage=="revision":
        if not out.get("final_candidate_id") or not out.get("candidate_digest"): raise ValueError("revision final candidate id/digest required")
    return {"stage":stage,"model":receipt["model"],"digest":digest(receipt)}

def validate_bundle(bundle:dict)->dict:
    req=str(bundle.get("request_id") or "")
    receipts=bundle.get("stage_receipts") or []
    if len(receipts)!=7: raise ValueError("exactly 7 Einstein receipts required")
    vals=[validate_stage(stage,r,req) for stage,r in zip(STAGES,receipts)]
    if [r.get("stage") for r in receipts]!=STAGES: raise ValueError("Einstein stages out of order")
    final=receipts[-1]["output"]
    return {"ok":True,"request_id":req,"stage_count":7,"final_candidate_id":final["final_candidate_id"],"candidate_digest":final["candidate_digest"],"synthesis_digest":digest(vals)}
