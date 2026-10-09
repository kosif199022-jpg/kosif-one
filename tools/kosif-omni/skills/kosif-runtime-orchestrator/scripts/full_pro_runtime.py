#!/usr/bin/env python3
"""KOSIF Think Pro 5 Full Pro Runtime Controller.

Deterministic, request-bound state authority. It validates receipts/events but
never fabricates expert work or calls Jev/executors itself.
"""
from __future__ import annotations
import argparse, hashlib, hmac, json, os, re, sys, time, secrets
from pathlib import Path
from typing import Any

from jev_dispatch_contract import digest, validate_receipt, stable_choice_pair

IDEAS_PER_EXPERT=100
QUESTIONS_PER_EXPERT=100
MIN_AXES=10
MIN_FAMILIES=10
MODULES=[f"M{i:02d}" for i in range(1,29)]
PROFILES=[
    "Skeptic","Strict Verifier","Decisive Operator","Ambitious Optimizer",
    "Creative Explorer","Conservative Risk Guardian","Analytical Decomposer",
    "Adversarial Critic","Naive-Reasoning Simulator","Integrator","Bias Hunter",
    "Constraint Optimizer","Conflict Scout","Evidence Accountant",
]
COUNCIL=[f"C{c:02d}-P{p:02d}" for c in range(1,11) for p in range(1,11)]
SPECIALISTS=[
    "kosif-vision","kosif-image-studio","kosif-lighting","kosif-audio",
    "kosif-code-master","kosif-video","kosif-audit-ifrs","kosif-prompt-master",
    "kosif-web-design","kosif-github","kosif-computer-use","kosif-jev",
]
AESTHETICS=[
    "VA01-Spatial-Worldbuilder","VA02-Character-Designer","VA03-Action-Choreographer",
    "VA04-Cinematographer","VA05-Lighting-Artist","VA06-Colorist","VA07-VFX-Designer",
    "VA08-Atmosphere-Weather","VA09-Materials-Texture","VA10-Production-Designer",
    "VA11-Composition-Director","VA12-Beauty-Critic",
]
CHIEF=["Einstein-Chief-Expert"]
EINSTEIN_STAGES=["observation","first_principles","gedanken","observer_relativity","unification","simplicity_critic","revision"]
GATE_NAMES=["deterministic","risk","self_critic","verifier"]

class RuntimeValidationError(ValueError): pass

def norm(v:Any)->str:
    s=re.sub(r"\s+"," ",str(v or "").strip().lower())
    return re.sub(r"[^\w\s\-:/]+","",s,flags=re.UNICODE)

def expected_roster(visual:bool)->list[str]:
    r=MODULES+PROFILES+COUNCIL+SPECIALISTS
    if visual: r+=AESTHETICS
    return r+CHIEF

def canonical_event_digest(event:dict)->str:
    e={k:v for k,v in event.items() if k!="received_at"}
    return digest(e)

def new_state(request_id:str, executor:str, visual:bool, knowledge_snapshot_digest:str|None=None)->dict:
    if not request_id or not executor: raise RuntimeValidationError("request_id and executor required")
    roster=expected_roster(visual)
    return {
        "version":"5.4.0","request_id":request_id,"executor":executor,"visual":visual,
        "knowledge_snapshot_digest":knowledge_snapshot_digest or None,
        "expected_experts":roster,"expert_cycles":{},"cross_expert":None,"einstein":None,
        "final_stability":None,"gates":None,"candidate":None,"candidate_digest":None,
        "authorization":None,"executor_receipt":None,"artifact_qa":None,
        "secure_executor_required":True,"secure_executor_ticket":None,"bypass_detected":False,"bypass_events":[],
        "event_ids":{},"event_log":[],"metrics":{"jev_calls":0,"retries":0,"failures":0,"latency_ms":0,"cost_units":0.0}
    }

def _event_guard(state:dict,event:dict)->tuple[bool,str]:
    if str(event.get("request_id") or "")!=state["request_id"]:
        raise RuntimeValidationError("stale or mismatched request_id")
    eid=str(event.get("event_id") or "")
    if not eid: raise RuntimeValidationError("event_id required")
    ed=canonical_event_digest(event)
    old=state["event_ids"].get(eid)
    if old:
        if old!=ed: raise RuntimeValidationError("event_id reused with different content")
        return True,ed
    return False,ed

def _commit_event(state,event,ed):
    eid=str(event["event_id"])
    state["event_ids"][eid]=ed
    state["event_log"].append({"seq":len(state["event_log"])+1,"event_id":eid,"type":event.get("type"),"digest":ed})

def _validate_diversity(r:dict, request_id:str, expert_id:str):
    if not isinstance(r,dict) or r.get("observed") is not True: raise RuntimeValidationError("diversity receipt missing/observed false")
    if str(r.get("request_id") or "")!=request_id or str(r.get("expert_id") or "")!=expert_id:
        raise RuntimeValidationError("diversity receipt binding mismatch")
    if not r.get("model") or not r.get("method"): raise RuntimeValidationError("diversity receipt missing model/method")
    if int(r.get("distinct_ideas",0))!=100 or int(r.get("distinct_questions",0))!=100:
        raise RuntimeValidationError("semantic diversity did not verify 100/100")
    if float(r.get("max_idea_similarity",1.0))>0.92 or float(r.get("max_question_similarity",1.0))>0.92:
        raise RuntimeValidationError("semantic near-duplicate threshold exceeded")

def _validate_expert_cycle(state:dict,p:dict)->dict:
    eid=str(p.get("expert_id") or "")
    if eid not in set(state["expected_experts"]): raise RuntimeValidationError(f"unexpected expert {eid}")
    if eid in state["expert_cycles"]: raise RuntimeValidationError(f"expert {eid} already validated")
    ideas=p.get("ideas") or []; questions=p.get("questions") or []
    if len(ideas)!=100: raise RuntimeValidationError(f"{eid}: ideas {len(ideas)}/100")
    if len(questions)!=100: raise RuntimeValidationError(f"{eid}: questions {len(questions)}/100")
    idea_ids=[]; idea_text=[]; axes=set()
    for i,x in enumerate(ideas):
        iid=str(x.get("idea_id") or ""); proposal=str(x.get("proposal") or ""); axis=str(x.get("axis") or "")
        if not iid or not proposal or not axis: raise RuntimeValidationError(f"{eid}: malformed idea {i}")
        idea_ids.append(iid); idea_text.append(norm(proposal)); axes.add(norm(axis))
    if len(set(idea_ids))!=100 or len(set(idea_text))!=100: raise RuntimeValidationError(f"{eid}: duplicate idea ids/content")
    if len({a for a in axes if a})<MIN_AXES: raise RuntimeValidationError(f"{eid}: fewer than {MIN_AXES} idea axes")
    qids=[]; qtext=[]; fam=set(); q_modes={}
    for i,q in enumerate(questions):
        qid=str(q.get("question_id") or ""); text=str(q.get("question") or ""); family=str(q.get("family") or ""); mode=str(q.get("mode") or "").lower()
        if not qid or not text or not family or mode not in {"choice","score","noul"}: raise RuntimeValidationError(f"{eid}: malformed question {i}")
        qids.append(qid); qtext.append(norm(text)); fam.add(norm(family)); q_modes[qid]=mode
    if len(set(qids))!=100 or len(set(qtext))!=100: raise RuntimeValidationError(f"{eid}: duplicate question ids/content")
    if len({f for f in fam if f})<MIN_FAMILIES: raise RuntimeValidationError(f"{eid}: fewer than {MIN_FAMILIES} question families")
    _validate_diversity(p.get("diversity_receipt") or {},state["request_id"],eid)
    evidence_status=str(p.get("evidence_status") or "")
    if evidence_status not in {"used","not_required","unavailable"}: raise RuntimeValidationError(f"{eid}: evidence_status required")
    evidence_refs=list(p.get("evidence_refs") or [])
    if evidence_status=="used" and not evidence_refs: raise RuntimeValidationError(f"{eid}: evidence used but no refs")
    if state.get("knowledge_snapshot_digest") and not p.get("knowledge_snapshot_digest"):
        raise RuntimeValidationError(f"{eid}: knowledge snapshot binding required")
    if state.get("knowledge_snapshot_digest") and p.get("knowledge_snapshot_digest")!=state.get("knowledge_snapshot_digest"):
        raise RuntimeValidationError(f"{eid}: knowledge snapshot mismatch")

    groups=p.get("idea_group_receipts") or []
    if len(groups)!=10: raise RuntimeValidationError(f"{eid}: idea group receipts {len(groups)}/10")
    for i,r in enumerate(groups):
        validate_receipt(r,request_id=state["request_id"],expert_id=eid,decision_type="choice")
    finals=p.get("expert_final_receipts") or []
    winner=stable_choice_pair(finals,request_id=state["request_id"],expert_id=eid)
    qrs=p.get("question_receipts") or []
    if len(qrs)!=100: raise RuntimeValidationError(f"{eid}: question receipts {len(qrs)}/100")
    seen=set()
    models=set()
    for r in qrs:
        rid=str(r.get("packet_id") or r.get("question_id") or "")
        if rid in seen: raise RuntimeValidationError(f"{eid}: duplicate question receipt {rid}")
        if rid not in q_modes: raise RuntimeValidationError(f"{eid}: unknown question receipt {rid}")
        seen.add(rid)
        v=validate_receipt(r,request_id=state["request_id"],expert_id=eid,packet_id=rid,decision_type=q_modes[rid])
        models.add(v["model"])
    if seen!=set(qids): raise RuntimeValidationError(f"{eid}: question receipt coverage mismatch")
    receipts_count=10+2+100
    return {
        "expert_id":eid,"valid":True,"idea_count":100,"question_count":100,"jev_receipts":receipts_count,
        "winner":winner,"models":sorted(models),"evidence_status":evidence_status,
        "evidence_refs_count":len(evidence_refs),"cycle_digest":digest(p)
    }

def _validate_cross(state,p):
    rs=p.get("receipts") or []
    if p.get("complete") is not True or not rs: raise RuntimeValidationError("cross_expert incomplete")
    for r in rs: validate_receipt(r,request_id=state["request_id"],decision_type="choice")
    return {"complete":True,"receipt_count":len(rs),"digest":digest(p)}

def _validate_einstein(state,p):
    if p.get("completed") is not True: raise RuntimeValidationError("Einstein not complete")
    stages=p.get("stages") or []
    if stages!=EINSTEIN_STAGES: raise RuntimeValidationError("Einstein stages must be exact ordered 7-stage pipeline")
    receipts=p.get("stage_receipts") or []
    if len(receipts)!=7: raise RuntimeValidationError("Einstein requires 7 stage receipts")
    for stage,r in zip(EINSTEIN_STAGES,receipts):
        if r.get("stage")!=stage: raise RuntimeValidationError(f"Einstein stage receipt mismatch: {stage}")
        if r.get("observed") is not True or str(r.get("request_id") or "")!=state["request_id"] or not r.get("model") or not isinstance(r.get("output"),dict):
            raise RuntimeValidationError(f"Einstein stage receipt invalid: {stage}")
    cands=p.get("synthesis_candidates") or []
    if not 2<=len(cands)<=4: raise RuntimeValidationError("Einstein synthesis must contain 2..4 candidates")
    ids=[str(c.get("id") or "") for c in cands]
    if not all(ids) or len(set(ids))!=len(ids): raise RuntimeValidationError("Einstein candidate ids invalid")
    return {"completed":True,"stage_count":7,"candidate_ids":ids,"digest":digest(p)}

def _validate_final(state,p):
    rs=p.get("receipts") or []
    winner=stable_choice_pair(rs,request_id=state["request_id"])
    return {"stable":True,"winner":winner,"receipt_count":2,"digest":digest(p)}

def _validate_gates(p):
    gates=p.get("gates") or {}
    for g in GATE_NAMES:
        if gates.get(g)!="pass": raise RuntimeValidationError(f"gate {g} must pass")
    if p.get("blocking_objections"): raise RuntimeValidationError("blocking objections remain")
    return {"gates":{g:"pass" for g in GATE_NAMES},"blocking_objections":[],"digest":digest(p)}

def _secure_ticket(state, state_digest_value, execution_lock):
    ticket = {
        "request_id":state["request_id"], "executor":state["executor"],
        "candidate_digest":state["candidate_digest"], "state_digest":state_digest_value,
        "execution_lock":execution_lock, "ticket_id":"sec-"+secrets.token_hex(16),
        "nonce":secrets.token_hex(32), "issued_at":int(time.time()),
        "expires_at":int(time.time())+300,
    }
    ad=digest(ticket)
    secret=os.environ.get("KOSIF_SECURE_EXECUTOR_SECRET")
    ticket.update(authorization_digest=ad, consumed=False,
        signature_mode="hmac-sha256" if secret else "workflow-binding",
        signature=hmac.new(secret.encode(),ad.encode(),hashlib.sha256).hexdigest() if secret else "",
        hard_enforcement=False)
    return ticket


def _mark_bypass(state:dict, payload:dict, reason:str)->None:
    state["bypass_detected"]=True
    state["authorization"]=None
    state["secure_executor_ticket"]=None
    state["artifact_qa"]=None
    state.setdefault("bypass_events",[]).append({
        "reason":reason,"executor":payload.get("executor"),
        "candidate_digest":payload.get("candidate_digest"),
        "execution_path":payload.get("execution_path"),
        "result_digest":payload.get("result_digest"),
    })

def apply_event(state:dict,event:dict)->dict:
    replay,ed=_event_guard(state,event)
    if replay: return {"ok":True,"idempotent_replay":True,"state":state}
    typ=str(event.get("type") or ""); p=event.get("payload") or {}
    if typ == "executor_receipt" and p.get("execution_path") != "kosif_secure_executor":
        _mark_bypass(state,p,"direct executor receipt; bypass before authorization")
        _commit_event(state,event,ed)
        raise RuntimeValidationError("BYPASS_DETECTED: direct executor receipt before authorization check")
    if state.get("bypass_detected") and typ != "executor_bypass":
        raise RuntimeValidationError("BYPASS_DETECTED: new request required")
    if state.get("authorization") and typ not in {"executor_receipt","artifact_qa","executor_bypass"}:
        state["authorization"]=None
        state["secure_executor_ticket"]=None
        state["authorization_invalid"]=True
        raise RuntimeValidationError("AUTHORIZATION_INVALID: state drift; new request required")
    prerequisites={"cross_expert":len(state["expert_cycles"])==len(state["expected_experts"]),
        "einstein":bool(state.get("cross_expert")),"final_stability":bool(state.get("einstein")),
        "gates":bool(state.get("final_stability")),"freeze_candidate":bool(state.get("gates"))}
    if typ in prerequisites and not prerequisites[typ]:
        raise RuntimeValidationError("stage prerequisite missing: "+typ)
    if typ in {"FAILED","PAUSED","BUDGET_EXHAUSTED","PROVIDER_UNAVAILABLE"}:
        state["stop_reason"]=typ
    elif typ=="expert_cycle":
        summary=_validate_expert_cycle(state,p); state["expert_cycles"][summary["expert_id"]]=summary; state["metrics"]["jev_calls"]+=summary["jev_receipts"]
    elif typ=="cross_expert":
        if state["cross_expert"]: raise RuntimeValidationError("cross_expert already set")
        state["cross_expert"]=_validate_cross(state,p); state["metrics"]["jev_calls"]+=state["cross_expert"]["receipt_count"]
    elif typ=="einstein":
        if state["einstein"]: raise RuntimeValidationError("Einstein already set")
        state["einstein"]=_validate_einstein(state,p)
    elif typ=="final_stability":
        if state["final_stability"]: raise RuntimeValidationError("final_stability already set")
        state["final_stability"]=_validate_final(state,p); state["metrics"]["jev_calls"]+=2
    elif typ=="gates":
        state["gates"]=_validate_gates(p)
    elif typ=="freeze_candidate":
        if not isinstance(p.get("candidate"),dict): raise RuntimeValidationError("candidate object required")
        if state.get("visual"):
            sys.path.insert(0,str(Path(__file__).resolve().parents[2]/"kosif-secure-executor"/"scripts"))
            from scene_spec import validate_scene
            validate_scene(p["candidate"])
        cd=digest(p["candidate"])
        if p.get("candidate_digest") and p.get("candidate_digest")!=cd: raise RuntimeValidationError("candidate_digest mismatch")
        if state.get("final_stability") and str(p.get("candidate_id") or "")!=state["final_stability"]["winner"]:
            raise RuntimeValidationError("candidate id does not match stable final winner")
        state["candidate"]=p["candidate"]; state["candidate_digest"]=cd; state["candidate_id"]=str(p.get("candidate_id") or "")
    elif typ=="executor_bypass":
        _mark_bypass(state,p,"explicit executor bypass event")
    elif typ=="executor_receipt":
        auth=state.get("authorization") or {}
        if auth and (auth.get("state_digest") != state_digest(state) or digest(state.get("candidate")) != state.get("candidate_digest")):
            state["authorization"]=None; state["secure_executor_ticket"]=None; state["authorization_invalid"]=True
            raise RuntimeValidationError("AUTHORIZATION_INVALID: state or candidate drift")
        if auth.get("authorization_ready") is not True: raise RuntimeValidationError("executor receipt before authorization")
        for key,expected in (("request_id",state["request_id"]),("executor",state["executor"]),("candidate_digest",state["candidate_digest"]),("execution_lock",auth.get("execution_lock"))):
            if str(p.get(key) or "")!=str(expected or ""): raise RuntimeValidationError(f"executor receipt {key} mismatch")
        if p.get("observed") is not True or not p.get("result_digest"): raise RuntimeValidationError("executor receipt missing observed/result_digest")
        if state.get("secure_executor_required",True):
            if p.get("execution_path")!="kosif_secure_executor" or p.get("secure_executor_verified") is not True:
                _mark_bypass(state,p,"executor bypass: Full Pro requires kosif_secure_executor")
                raise RuntimeValidationError("executor bypass detected: Full Pro requires secure executor")
            ticket=state.get("secure_executor_ticket") or auth.get("secure_executor_ticket") or {}
            if time.time() >= ticket.get("expires_at",0):
                raise RuntimeValidationError("EXPIRED_TICKET")
            if ticket.get("consumed") is True:
                raise RuntimeValidationError("secure executor ticket already consumed")
            if str(p.get("secure_ticket_id") or "")!=str(ticket.get("ticket_id") or ""):
                raise RuntimeValidationError("secure executor ticket mismatch")
            if str(p.get("secure_authorization_digest") or "")!=str(ticket.get("authorization_digest") or ""):
                raise RuntimeValidationError("secure executor authorization digest mismatch")
            if p.get("secure_signature") and str(p.get("secure_signature"))!=str(ticket.get("signature")):
                raise RuntimeValidationError("secure executor signature mismatch")
            if ticket.get("signature_mode")=="hmac-sha256":
                secret=os.environ.get("KOSIF_SECURE_EXECUTOR_SECRET")
                signed={k:v for k,v in p.items() if k!="receipt_signature"}
                expected=hmac.new((secret or "").encode(),digest(signed).encode(),hashlib.sha256).hexdigest()
                if not secret or not hmac.compare_digest(expected,str(p.get("receipt_signature") or "")):
                    raise RuntimeValidationError("executor receipt signature invalid")
            ticket["consumed"]=True
            state["secure_executor_ticket"]=ticket
        state["executor_receipt"]={
            "observed":True,"result_digest":p["result_digest"],"execution_path":p.get("execution_path"),
            "secure_ticket_id":p.get("secure_ticket_id"),"digest":digest(p)
        }
    elif typ=="artifact_qa":
        if state.get("bypass_detected"): raise RuntimeValidationError("artifact QA blocked after executor bypass")
        if not state.get("executor_receipt"): raise RuntimeValidationError("artifact QA before executor receipt")
        if p.get("pass") is not True: raise RuntimeValidationError("artifact QA did not pass")
        if str(p.get("request_id") or "")!=state["request_id"]: raise RuntimeValidationError("artifact QA request mismatch")
        state["artifact_qa"]={"pass":True,"checks":p.get("checks") or [],"digest":digest(p)}
    else:
        raise RuntimeValidationError(f"unsupported event type {typ}")
    _commit_event(state,event,ed)
    return {"ok":True,"idempotent_replay":False,"state":state}

def blockers(state:dict)->list[str]:
    out=[]
    if state.get("stop_reason"): out.append(state["stop_reason"])
    if state.get("authorization_invalid"): out.append("authorization_invalid_new_request_required")
    if state.get("bypass_detected"): out.append("executor_bypass_detected")
    if state.get("executor_receipt"): out.append("executor_already_recorded")
    missing=[e for e in state["expected_experts"] if e not in state["expert_cycles"]]
    if missing: out.append(f"experts_missing={len(missing)}")
    if not state.get("cross_expert"): out.append("cross_expert_missing")
    if not state.get("einstein"): out.append("einstein_missing")
    if not state.get("final_stability"): out.append("final_stability_missing")
    if not state.get("gates"): out.append("gates_missing")
    if not state.get("candidate_digest"): out.append("candidate_not_frozen")
    return out

def state_digest(state:dict)->str:
    core={
        "version":state["version"],"request_id":state["request_id"],"executor":state["executor"],"visual":state["visual"],
        "knowledge_snapshot_digest":state.get("knowledge_snapshot_digest"),
        "expert_cycles":{k:v["cycle_digest"] for k,v in sorted(state["expert_cycles"].items())},
        "cross_expert":(state.get("cross_expert") or {}).get("digest"),"einstein":(state.get("einstein") or {}).get("digest"),
        "final_stability":(state.get("final_stability") or {}).get("digest"),"gates":(state.get("gates") or {}).get("digest"),
        "candidate_digest":state.get("candidate_digest"),
        "secure_executor_required":state.get("secure_executor_required",True),
        "bypass_detected":state.get("bypass_detected",False)
    }
    return digest(core)

def authorize(state:dict)->dict:
    b=blockers(state)
    if b:
        return {"ok":False,"verdict":"BLOCK","authorization_ready":False,"issues":b,"status":status(state)}
    if state.get("authorization"):
        return {"ok":True,"verdict":"PASS",**state["authorization"]}
    sd=state_digest(state)
    lock=hashlib.sha256(f"{state['request_id']}|{state['executor']}|{state['candidate_digest']}|{sd}".encode()).hexdigest()
    ticket=_secure_ticket(state,sd,lock)
    auth={
        "authorization_ready":True,"request_id":state["request_id"],"executor":state["executor"],
        "candidate_digest":state["candidate_digest"],"state_digest":sd,"execution_lock":lock,
        "secure_executor_required":True,"secure_executor_ticket":ticket,
    }
    state["secure_executor_ticket"]=ticket
    state["authorization"]=auth
    return {"ok":True,"verdict":"PASS",**auth}

def phase(state:dict)->str:
    n=len(state["expert_cycles"]); total=len(state["expected_experts"])
    if state.get("bypass_detected"): return "BYPASS_DETECTED"
    if state.get("stop_reason"): return state["stop_reason"]
    if state.get("artifact_qa") and state.get("executor_receipt") and (state.get("secure_executor_ticket") or {}).get("consumed"): return "COMPLETE"
    if state.get("executor_receipt"): return "EXECUTED"
    if state.get("authorization"): return "AUTHORIZED"
    if state.get("candidate_digest"): return "CANDIDATE_FROZEN"
    if state.get("gates"): return "GATES_PASS"
    if state.get("final_stability"): return "FINAL_STABLE"
    if state.get("einstein"): return "EINSTEIN_COMPLETE"
    if state.get("cross_expert"): return "CROSS_COMPLETE"
    if n==total: return "EXPERTS_COMPLETE"
    if n or state.get("harvesting_started"): return "HARVESTING"
    return "INITIALIZED"

def status(state:dict)->dict:
    total=len(state["expected_experts"]); valid=len(state["expert_cycles"])
    return {
        "version":state["version"],"request_id":state["request_id"],"phase":phase(state),"visual":state["visual"],"executor":state["executor"],
        "experts_validated":valid,"experts_required":total,
        "ideas_validated":valid*100,"ideas_required":total*100,
        "questions_validated":valid*100,"questions_required":total*100,
        "jev_calls_observed":state["metrics"]["jev_calls"],"minimum_expert_jev_calls":total*112,
        "einstein_stages":0 if not state.get("einstein") else state["einstein"]["stage_count"],
        "authorization_ready":bool((state.get("authorization") or {}).get("authorization_ready")),
        "executor_receipt":bool(state.get("executor_receipt")),"artifact_qa_pass":bool(state.get("artifact_qa")),
        "secure_executor_required":state.get("secure_executor_required",True),
        "secure_ticket_issued":bool(state.get("secure_executor_ticket")),
        "secure_ticket_consumed":bool((state.get("secure_executor_ticket") or {}).get("consumed")),
        "secure_hard_enforcement":bool((state.get("secure_executor_ticket") or {}).get("hard_enforcement")),
        "bypass_detected":bool(state.get("bypass_detected")),
        "complete":phase(state)=="COMPLETE","blockers":blockers(state),"event_count":len(state["event_log"])
    }

def load(path:Path)->dict: return json.loads(path.read_text(encoding="utf-8"))
def save(path:Path,state:dict):
    tmp=path.with_suffix(path.suffix+".tmp"); tmp.write_text(json.dumps(state,ensure_ascii=False,indent=2,sort_keys=True),encoding="utf-8"); os.replace(tmp,path)

def main(argv=None):
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    p=sub.add_parser("init"); p.add_argument("state"); p.add_argument("request_id"); p.add_argument("executor"); p.add_argument("--visual",action="store_true"); p.add_argument("--knowledge-snapshot")
    p=sub.add_parser("apply"); p.add_argument("state")
    p=sub.add_parser("status"); p.add_argument("state")
    p=sub.add_parser("authorize"); p.add_argument("state")
    ns=ap.parse_args(argv)
    path=Path(ns.state)
    try:
        if ns.cmd=="init":
            if path.exists(): raise RuntimeValidationError("state file already exists")
            s=new_state(ns.request_id,ns.executor,ns.visual,ns.knowledge_snapshot); save(path,s); out={"ok":True,"status":status(s)}
        elif ns.cmd=="apply":
            s=load(path); event=json.load(sys.stdin)
            try:
                out=apply_event(s,event)
            except Exception:
                if s.get("bypass_detected") or s.get("authorization_invalid"):
                    save(path,s)
                raise
            save(path,s); out={"ok":True,"idempotent_replay":out["idempotent_replay"],"status":status(s)}
        elif ns.cmd=="status": out={"ok":True,"status":status(load(path))}
        else:
            s=load(path); out=authorize(s); save(path,s)
    except Exception as e:
        out={"ok":False,"error":str(e)}
    print(json.dumps(out,ensure_ascii=False,indent=2,sort_keys=True))
    return 0 if out.get("ok") else 1

if __name__=="__main__": raise SystemExit(main())
