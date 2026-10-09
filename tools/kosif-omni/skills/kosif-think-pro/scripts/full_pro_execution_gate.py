#!/usr/bin/env python3
"""KOSIF Think Pro 4.6 fail-closed execution gate.

Input to `check` is a current-request receipt bundle. This validator does not call
Jev or an executor. It checks that the required observable receipts are present
and request-bound before a Pro/Full Pro executor may be invoked.

The emitted execution_lock is a deterministic workflow binding, not a security token.
"""
from __future__ import annotations
import hashlib, json, sys, re
from collections import Counter

IDEAS=100
QUESTIONS=100
MODULES=[f"M{i:02d}" for i in range(1,29)]
PROFILES=[
 "Skeptic","Strict Verifier","Decisive Operator","Ambitious Optimizer","Creative Explorer",
 "Conservative Risk Guardian","Analytical Decomposer","Adversarial Critic",
 "Naive-Reasoning Simulator","Integrator","Bias Hunter","Constraint Optimizer",
 "Conflict Scout","Evidence Accountant"
]
COUNCIL=[f"C{c:02d}-P{p:02d}" for c in range(1,11) for p in range(1,11)]
SPECIALISTS=[
 "kosif-vision","kosif-image-studio","kosif-lighting","kosif-audio","kosif-code-master",
 "kosif-video","kosif-audit-ifrs","kosif-prompt-master","kosif-web-design","kosif-github",
 "kosif-computer-use","kosif-jev"
]
AESTHETICS=[
 "VA01-Spatial-Worldbuilder","VA02-Character-Designer","VA03-Action-Choreographer",
 "VA04-Cinematographer","VA05-Lighting-Artist","VA06-Colorist","VA07-VFX-Designer",
 "VA08-Atmosphere-Weather","VA09-Materials-Texture","VA10-Production-Designer",
 "VA11-Composition-Director","VA12-Beauty-Critic"
]
CHIEF=["Einstein-Chief-Expert"]
STAGES=["observation","first-principles","gedankenexperimente","observer-relativity","unification","simplicity-critic","revision"]
MODES={"noul","choice","score"}

def norm(x):
    s=re.sub(r"\s+"," ",str(x or "").strip().lower())
    return re.sub(r"[^\w\s\-:/]+","",s,flags=re.UNICODE)

def roster(visual):
    return MODULES+PROFILES+COUNCIL+SPECIALISTS+(AESTHETICS if visual else [])+CHIEF

def digest_obj(x):
    raw=json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def unwrap_result(receipt, *, request_id, expert_id=None, expected_id=None, expected_type=None, label="receipt"):
    issues=[]
    if not isinstance(receipt,dict):
        return None,[f"{label}: must be object"]
    if receipt.get("observed") is not True:
        issues.append(f"{label}: observed must be true")
    if str(receipt.get("request_id") or "") != request_id:
        issues.append(f"{label}: request_id mismatch")
    if expert_id is not None and str(receipt.get("expert_id") or "") != expert_id:
        issues.append(f"{label}: expert_id mismatch")
    if expected_id is not None and str(receipt.get("packet_id") or receipt.get("question_id") or "") != expected_id:
        issues.append(f"{label}: packet/question id mismatch")
    raw=receipt.get("result")
    if not isinstance(raw,dict):
        issues.append(f"{label}: missing raw Jev result")
        return None,issues
    if isinstance(raw.get("structuredContent"),dict):
        raw=raw["structuredContent"]
    model=raw.get("model")
    dec=((raw.get("answers") or {}).get("decision") if isinstance(raw.get("answers"),dict) else None) or raw.get("decision")
    if not model:
        issues.append(f"{label}: missing Jev model")
    if not isinstance(dec,dict):
        issues.append(f"{label}: missing structured Jev decision")
        return None,issues
    typ=dec.get("type")
    if typ not in MODES:
        issues.append(f"{label}: invalid Jev decision type {typ!r}")
    if expected_type and typ != expected_type:
        issues.append(f"{label}: expected {expected_type}, got {typ}")
    return {"model":model,"decision":dec},issues

def validate_cycle(cycle, request_id):
    issues=[]
    eid=str(cycle.get("expert_id") or "")
    ideas=cycle.get("ideas") or []
    qs=cycle.get("questions") or []
    if len(ideas)!=IDEAS: issues.append(f"{eid}: ideas {len(ideas)}/100")
    if len(qs)!=QUESTIONS: issues.append(f"{eid}: questions {len(qs)}/100")
    if len({norm(x.get("proposal")) for x in ideas if isinstance(x,dict)})!=IDEAS:
        issues.append(f"{eid}: ideas are not 100 normalized-distinct")
    if len({norm(x.get("axis")) for x in ideas if isinstance(x,dict) and norm(x.get("axis"))})<10:
        issues.append(f"{eid}: fewer than 10 idea axes")
    if len({norm(x.get("question")) for x in qs if isinstance(x,dict)})!=QUESTIONS:
        issues.append(f"{eid}: questions are not 100 normalized-distinct")
    if len({norm(x.get("family")) for x in qs if isinstance(x,dict) and norm(x.get("family"))})<10:
        issues.append(f"{eid}: fewer than 10 question families")

    idea_ids=[str(x.get("idea_id") or x.get("id") or "") for x in ideas if isinstance(x,dict)]
    if len(idea_ids)!=100 or len(set(idea_ids))!=100 or "" in idea_ids:
        issues.append(f"{eid}: idea ids must be 100 unique non-empty ids")
    qmap={str(x.get("question_id") or x.get("id") or ""):x for x in qs if isinstance(x,dict)}
    if len(qmap)!=100 or "" in qmap:
        issues.append(f"{eid}: question ids must be 100 unique non-empty ids")

    groups=cycle.get("idea_group_receipts") or []
    if len(groups)!=10: issues.append(f"{eid}: idea group receipts {len(groups)}/10")
    seen_group_packets=[]
    for i,r in enumerate(groups):
        pid=str(r.get("packet_id") or "") if isinstance(r,dict) else ""
        _,errs=unwrap_result(r,request_id=request_id,expert_id=eid,expected_id=pid,expected_type="choice",label=f"{eid}:group[{i}]")
        issues.extend(errs); seen_group_packets.append(pid)
    if len(set(seen_group_packets))!=len(seen_group_packets) or "" in seen_group_packets:
        issues.append(f"{eid}: duplicate/empty idea group packet ids")

    finals=cycle.get("expert_final_receipts") or []
    if len(finals)!=2: issues.append(f"{eid}: expert final receipts {len(finals)}/2")
    final_choices=[]
    final_ids=[]
    for i,r in enumerate(finals):
        pid=str(r.get("packet_id") or "") if isinstance(r,dict) else ""
        parsed,errs=unwrap_result(r,request_id=request_id,expert_id=eid,expected_id=pid,expected_type="choice",label=f"{eid}:final[{i}]")
        issues.extend(errs); final_ids.append(pid)
        if parsed: final_choices.append(str(parsed["decision"].get("choice") or ""))
    if len(set(final_ids))!=len(final_ids) or "" in final_ids:
        issues.append(f"{eid}: final packet ids must be two unique non-empty ids")
    if len(final_choices)==2 and (not final_choices[0] or final_choices[0]!=final_choices[1]):
        issues.append(f"{eid}: expert final stability failed")

    qreceipts=cycle.get("question_receipts") or []
    if len(qreceipts)!=100: issues.append(f"{eid}: question receipts {len(qreceipts)}/100")
    seen_q=[]
    for i,r in enumerate(qreceipts):
        qid=str(r.get("question_id") or r.get("packet_id") or "") if isinstance(r,dict) else ""
        expected=qmap.get(qid)
        etype=str(expected.get("mode") or "") if isinstance(expected,dict) else None
        if expected is None:
            issues.append(f"{eid}:question[{i}]: unknown question id {qid!r}")
        _,errs=unwrap_result(r,request_id=request_id,expert_id=eid,expected_id=qid,expected_type=etype,label=f"{eid}:question[{i}]")
        issues.extend(errs); seen_q.append(qid)
    if len(set(seen_q))!=len(seen_q) or "" in seen_q:
        issues.append(f"{eid}: duplicate/empty question receipt ids")
    if set(seen_q)!=set(qmap):
        issues.append(f"{eid}: question receipt ids do not exactly match harvest")

    return {"expert_id":eid,"ok":not issues,"issues":issues,
            "jev_calls_observed":len(groups)+len(finals)+len(qreceipts)}

def validate_pair(pair, request_id, label):
    issues=[]
    if not isinstance(pair,list) or len(pair)!=2:
        return None,[f"{label}: needs exactly two stability receipts"]
    choices=[]; ids=[]
    for i,r in enumerate(pair):
        pid=str(r.get("packet_id") or "") if isinstance(r,dict) else ""
        parsed,errs=unwrap_result(r,request_id=request_id,expected_id=pid,expected_type="choice",label=f"{label}[{i}]")
        issues.extend(errs); ids.append(pid)
        if parsed: choices.append(str(parsed["decision"].get("choice") or ""))
    if len(set(ids))!=2 or "" in ids:
        issues.append(f"{label}: packet ids must be unique/non-empty")
    if len(choices)==2 and (not choices[0] or choices[0]!=choices[1]):
        issues.append(f"{label}: stability failed")
    return (choices[0] if len(choices)==2 and choices[0]==choices[1] else None),issues

def check(o):
    issues=[]
    mode=str(o.get("mode") or "").lower()
    if mode not in {"pro","full","full-pro","full_pro"}:
        issues.append("mode must be Pro/Full Pro")
    request_id=str(o.get("request_id") or "")
    executor=str(o.get("executor") or "")
    candidate=o.get("candidate")
    if not request_id: issues.append("request_id is required")
    if not executor: issues.append("executor is required")
    if candidate is None: issues.append("frozen candidate is required")
    candidate_digest=digest_obj(candidate) if candidate is not None else None
    supplied_digest=str(o.get("candidate_digest") or "")
    if candidate_digest and supplied_digest != candidate_digest:
        issues.append("candidate_digest mismatch")

    visual=bool(o.get("visual"))
    expected=roster(visual)
    cycles=o.get("expert_cycles") or []
    by={}
    for c in cycles:
        if not isinstance(c,dict): issues.append("expert cycle entry must be object"); continue
        eid=str(c.get("expert_id") or "")
        if not eid: issues.append("expert cycle missing expert_id"); continue
        if eid in by: issues.append(f"duplicate expert cycle {eid}")
        by[eid]=c
    missing=[e for e in expected if e not in by]
    extras=[e for e in by if e not in set(expected)]
    if missing: issues.append("missing experts: "+",".join(missing))
    if extras: issues.append("unexpected experts: "+",".join(extras))

    cycle_results=[]; jev_calls=0
    for eid in expected:
        if eid not in by: continue
        res=validate_cycle(by[eid],request_id)
        cycle_results.append(res); jev_calls += res["jev_calls_observed"]
        issues.extend(res["issues"])

    cross=o.get("cross_expert") or {}
    if cross.get("complete") is not True:
        issues.append("cross_expert.complete must be true")
    cross_receipts=cross.get("receipts") or []
    if not cross_receipts:
        issues.append("cross_expert.receipts must be non-empty")
    for i,r in enumerate(cross_receipts):
        pid=str(r.get("packet_id") or "") if isinstance(r,dict) else ""
        _,errs=unwrap_result(r,request_id=request_id,expected_id=pid,label=f"cross_expert[{i}]")
        issues.extend(errs)
    jev_calls += len(cross_receipts)

    chief=o.get("einstein_chief") or {}
    if chief.get("completed") is not True:
        issues.append("einstein_chief.completed must be true")
    stages=chief.get("stages") or []
    missing_stages=[s for s in STAGES if s not in stages]
    if missing_stages: issues.append("Einstein stages missing: "+",".join(missing_stages))
    synth=chief.get("synthesis_candidates") or []
    if not isinstance(synth,list) or not 2<=len(synth)<=4:
        issues.append("Einstein synthesis_candidates must contain 2..4 candidates")

    winner,errs=validate_pair(o.get("final_jev_stability") or [],request_id,"final_jev_stability")
    issues.extend(errs); jev_calls += len(o.get("final_jev_stability") or [])
    frozen_id=str(o.get("frozen_candidate_id") or "")
    if winner and frozen_id and winner!=frozen_id:
        issues.append("frozen_candidate_id does not match stable final Jev winner")
    if not frozen_id:
        issues.append("frozen_candidate_id is required")

    gates=o.get("gates") or {}
    for g in ("deterministic","risk","self_critic","verifier"):
        if gates.get(g)!="pass": issues.append(f"gate {g} must be pass")
    if o.get("blocking_objections"):
        issues.append("blocking objections remain")

    receipt_digest=digest_obj({
        "request_id":request_id,"executor":executor,"visual":visual,
        "expert_cycle_digests":[digest_obj(by[e]) for e in expected if e in by],
        "cross_expert":cross,"einstein_chief":chief,
        "final_jev_stability":o.get("final_jev_stability"),
        "gates":gates,"candidate_digest":candidate_digest,"frozen_candidate_id":frozen_id
    })
    authorization_ready=not issues
    lock=None
    if authorization_ready:
        lock=hashlib.sha256(f"{request_id}|{executor}|{candidate_digest}|{receipt_digest}".encode()).hexdigest()
    return {
        "ok":authorization_ready,
        "verdict":"PASS" if authorization_ready else "BLOCK",
        "authorization_ready":authorization_ready,
        "request_id":request_id,
        "executor":executor,
        "candidate_digest":candidate_digest,
        "execution_lock":lock,
        "expected_experts":len(expected),
        "validated_experts":sum(1 for r in cycle_results if r["ok"]),
        "jev_calls_observed":jev_calls,
        "minimum_per_expert_jev_calls":112,
        "issues":issues,
        "note":"execution_lock is deterministic workflow binding, not a cryptographic credential."
    }

def main(argv=None):
    argv=argv or sys.argv
    cmd=argv[1] if len(argv)>1 else ""
    try:
        o=json.load(sys.stdin)
        if cmd!="check": raise ValueError("usage: full_pro_execution_gate.py check < receipt.json")
        out=check(o)
    except Exception as e:
        out={"ok":False,"verdict":"BLOCK","authorization_ready":False,"issues":[str(e)]}
    print(json.dumps(out,ensure_ascii=False,indent=1,sort_keys=True))
    return 0 if out.get("authorization_ready") else 1

if __name__=="__main__":
    raise SystemExit(main())
