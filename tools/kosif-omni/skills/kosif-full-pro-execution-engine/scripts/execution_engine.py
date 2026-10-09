#!/usr/bin/env python3
"""KOSIF Think Pro 5.2 host-mediated Full Pro Execution Engine.

This runner fixes the v5.0 gap where the Runtime Controller could validate
receipts but nothing drove the missing expert/Jev work. The engine owns a
persistent depth-first queue and emits explicit host actions. It never marks a
host/model/Jev action complete without ingesting an observed receipt.

The host is responsible for actually calling its exposed model/Jev tools, then
feeding the observed outputs back here. This keeps platform/tool truth separate
from orchestration state.
"""
from __future__ import annotations

import argparse, hashlib, json, os, random, re, sys
from pathlib import Path
from typing import Any

VERSION = "5.2.1"
IDEAS_PER_EXPERT = 100
QUESTIONS_PER_EXPERT = 100
MIN_AXES = 10
MIN_FAMILIES = 10
HARVEST_BATCHES = 10
ITEMS_PER_BATCH = 10
IDEA_AXIS_HINTS=[
    "subject-identity","scale-and-proportion","action-and-contact","world-and-location","camera-and-framing",
    "lighting","color-and-grade","physics-and-motion","story-and-emotion","failure-prevention",
]
RAW_HARVEST_SOURCES={"host_chat_model","kosif_frontier_raw","external_model","test_model"}

QUESTION_FAMILY_HINTS=[
    "identity-invariants","scale-constraints","action-readability","environment-logic","camera-consistency",
    "lighting-consistency","color-separation","physical-plausibility","story-focus","artifact-prevention",
]
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

class EngineError(ValueError):
    pass


def digest(obj: Any) -> str:
    raw=json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(",",":"),default=str).encode()
    return hashlib.sha256(raw).hexdigest()


def norm(v: Any) -> str:
    s=re.sub(r"\s+"," ",str(v or "").strip().lower())
    return re.sub(r"[^\w\s\-:/]+","",s,flags=re.UNICODE)


def roster(visual: bool) -> list[str]:
    out=MODULES+PROFILES+COUNCIL+SPECIALISTS
    if visual:
        out+=AESTHETICS
    return out+CHIEF


def _expert_state(eid:str)->dict:
    return {
        "expert_id":eid,
        "harvest":None,
        "idea_batches":{},
        "question_batches":{},
        "group_receipts":{},
        "final_receipts":{},
        "question_receipts":{},
        "complete":False,
        "runtime_event":None,
        "errors":[],
    }


def new_state(request_id:str, executor:str, visual:bool, subject:str, knowledge_snapshot_digest:str|None=None)->dict:
    if not request_id or not executor or not subject:
        raise EngineError("request_id, executor and subject are required")
    rs=roster(visual)
    return {
        "version":VERSION,
        "request_id":request_id,
        "executor":executor,
        "visual":visual,
        "subject":subject,
        "knowledge_snapshot_digest":knowledge_snapshot_digest,
        "schedule":"depth-first",
        "roster":rs,
        "experts":{e:_expert_state(e) for e in rs},
        "action_receipts":{},
        "action_digests":{},
        "emitted_runtime_events":{},
        "metrics":{"host_calls_observed":0,"jev_calls_observed":0,"harvest_calls_observed":0,"retries":0,"failures":0},
    }


def _validate_binding(state:dict, receipt:dict, action_id:str):
    if receipt.get("observed") is not True:
        raise EngineError("receipt observed must be true")
    if str(receipt.get("request_id") or "")!=state["request_id"]:
        raise EngineError("stale or mismatched request_id")
    if str(receipt.get("action_id") or "")!=action_id:
        raise EngineError("action_id mismatch")


def _record_action(state:dict, action_id:str, receipt:dict)->bool:
    rd=digest(receipt)
    old=state["action_digests"].get(action_id)
    if old:
        if old!=rd:
            raise EngineError("action_id replayed with different receipt")
        return False
    state["action_digests"][action_id]=rd
    state["action_receipts"][action_id]=receipt
    state["metrics"]["host_calls_observed"]+=1
    return True



def _token_set(value:Any)->set[str]:
    return {t for t in norm(value).split() if t}


def _max_pair_similarity(values:list[str])->float:
    toks=[_token_set(v) for v in values]
    best=0.0
    for i in range(len(toks)):
        for j in range(i+1,len(toks)):
            u=toks[i] | toks[j]
            sim=(len(toks[i] & toks[j]) / len(u)) if u else 1.0
            if sim>best: best=sim
    return round(best,6)


def _validate_batch_common(state:dict,eid:str,r:dict,action_id:str)->tuple[str,str]:
    _validate_binding(state,r,action_id)
    if str(r.get("expert_id") or "")!=eid:
        raise EngineError("expert_id mismatch")
    source=str(r.get("source") or "").strip()
    if source not in RAW_HARVEST_SOURCES:
        raise EngineError("harvest batch source invalid or disallowed for raw generation")
    model=str(r.get("model") or "").strip()
    if not model:
        raise EngineError("harvest batch receipt missing model")
    return model,source


def _validate_idea_batch(state:dict,eid:str,batch:int,r:dict)->dict:
    action_id=f"ideas:{eid}:{batch:02d}"
    model,source=_validate_batch_common(state,eid,r,action_id)
    items=r.get("ideas") or []
    if len(items)!=ITEMS_PER_BATCH:
        raise EngineError(f"{eid}: idea batch {batch} has {len(items)}/{ITEMS_PER_BATCH}")
    start=(batch-1)*ITEMS_PER_BATCH
    expected={f"{eid}-i{i:03d}" for i in range(start,start+ITEMS_PER_BATCH)}
    got=set()
    for i,x in enumerate(items):
        if not isinstance(x,dict): raise EngineError(f"{eid}: malformed idea batch item {i}")
        iid=str(x.get("idea_id") or ""); proposal=str(x.get("proposal") or ""); axis=str(x.get("axis") or "")
        if not iid or not proposal or not axis: raise EngineError(f"{eid}: malformed idea batch item {i}")
        got.add(iid)
    if got!=expected:
        raise EngineError(f"{eid}: idea batch {batch} ids do not match expected range")
    status=str(r.get("evidence_status") or "not_required")
    if status not in {"used","not_required","unavailable"}: raise EngineError(f"{eid}: invalid evidence_status")
    refs=list(r.get("evidence_refs") or [])
    if status=="used" and not refs: raise EngineError(f"{eid}: evidence refs missing")
    field="proposal" if "ideas" in r else "question"
    category="idea_batches" if field=="proposal" else "question_batches"
    texts=[norm(x[field]) for x in items]
    for previous in state["experts"][eid][category].values(): texts.extend(norm(x[field]) for x in previous["items"])
    if len(set(texts))!=len(texts) or _max_pair_similarity(texts)>0.92: raise EngineError("duplicate or paraphrased content across batches")
    return {"model":model,"source":source,"items":items,"evidence_status":status,"evidence_refs":refs,"batch_digest":digest(r)}


def _validate_question_batch(state:dict,eid:str,batch:int,r:dict)->dict:
    action_id=f"questions:{eid}:{batch:02d}"
    model,source=_validate_batch_common(state,eid,r,action_id)
    items=r.get("questions") or []
    if len(items)!=ITEMS_PER_BATCH:
        raise EngineError(f"{eid}: question batch {batch} has {len(items)}/{ITEMS_PER_BATCH}")
    start=(batch-1)*ITEMS_PER_BATCH
    expected={f"{eid}-q{i:03d}" for i in range(start,start+ITEMS_PER_BATCH)}
    got=set()
    for i,q in enumerate(items):
        if not isinstance(q,dict): raise EngineError(f"{eid}: malformed question batch item {i}")
        qid=str(q.get("question_id") or ""); txt=str(q.get("question") or ""); family=str(q.get("family") or ""); mode=str(q.get("mode") or "").lower()
        if not qid or not txt or not family or mode not in {"choice","noul","score"}: raise EngineError(f"{eid}: malformed question batch item {i}")
        got.add(qid)
    if got!=expected:
        raise EngineError(f"{eid}: question batch {batch} ids do not match expected range")
    status=str(r.get("evidence_status") or "not_required")
    if status not in {"used","not_required","unavailable"}: raise EngineError(f"{eid}: invalid evidence_status")
    refs=list(r.get("evidence_refs") or [])
    if status=="used" and not refs: raise EngineError(f"{eid}: evidence refs missing")
    field="proposal" if "ideas" in r else "question"
    category="idea_batches" if field=="proposal" else "question_batches"
    texts=[norm(x[field]) for x in items]
    for previous in state["experts"][eid][category].values(): texts.extend(norm(x[field]) for x in previous["items"])
    if len(set(texts))!=len(texts) or _max_pair_similarity(texts)>0.92: raise EngineError("duplicate or paraphrased content across batches")
    return {"model":model,"source":source,"items":items,"evidence_status":status,"evidence_refs":refs,"batch_digest":digest(r)}


def _maybe_finalize_chunked_harvest(state:dict,eid:str):
    es=state["experts"][eid]
    if es.get("harvest") or len(es.get("idea_batches",{}))!=HARVEST_BATCHES or len(es.get("question_batches",{}))!=HARVEST_BATCHES:
        return
    ideas=[]; questions=[]; models=set(); sources=set(); refs=[]; statuses=[]
    for i in range(1,HARVEST_BATCHES+1):
        b=es["idea_batches"][str(i)]; ideas.extend(b["items"]); models.add(b["model"]); sources.add(b.get("source")); refs.extend(b["evidence_refs"]); statuses.append(b["evidence_status"])
    for i in range(1,HARVEST_BATCHES+1):
        b=es["question_batches"][str(i)]; questions.extend(b["items"]); models.add(b["model"]); sources.add(b.get("source")); refs.extend(b["evidence_refs"]); statuses.append(b["evidence_status"])
    idea_ids=[str(x["idea_id"]) for x in ideas]; idea_text=[norm(x["proposal"]) for x in ideas]; axes={norm(x["axis"]) for x in ideas}
    qids=[str(x["question_id"]) for x in questions]; qtext=[norm(x["question"]) for x in questions]; fam={norm(x["family"]) for x in questions}
    if len(set(idea_ids))!=100 or len(set(idea_text))!=100: raise EngineError(f"{eid}: duplicate ideas across harvest batches")
    if len(set(qids))!=100 or len(set(qtext))!=100: raise EngineError(f"{eid}: duplicate questions across harvest batches")
    if len({x for x in axes if x})<MIN_AXES: raise EngineError(f"{eid}: fewer than {MIN_AXES} idea axes")
    if len({x for x in fam if x})<MIN_FAMILIES: raise EngineError(f"{eid}: fewer than {MIN_FAMILIES} question families")
    max_i=_max_pair_similarity([x["proposal"] for x in ideas]); max_q=_max_pair_similarity([x["question"] for x in questions])
    if max_i>0.92 or max_q>0.92: raise EngineError(f"{eid}: near-duplicate threshold exceeded across harvest batches")
    evidence_status="used" if "used" in statuses else ("unavailable" if "unavailable" in statuses else "not_required")
    unique_refs=[]
    for ref in refs:
        if ref not in unique_refs: unique_refs.append(ref)
    if evidence_status=="used" and not unique_refs: raise EngineError(f"{eid}: evidence refs missing")
    div={
        "observed":True,"request_id":state["request_id"],"expert_id":eid,
        "model":"local-diversity-validator-v1","method":"normalized-exact+token-jaccard",
        "distinct_ideas":100,"distinct_questions":100,
        "max_idea_similarity":max_i,"max_question_similarity":max_q,
    }
    core={
        "models":sorted(models),"sources":sorted(x for x in sources if x),"ideas":ideas,"questions":questions,"diversity_receipt":div,
        "evidence_status":evidence_status,"evidence_refs":unique_refs,
        "knowledge_snapshot_digest":state.get("knowledge_snapshot_digest"),
        "batch_digests":[es["idea_batches"][str(i)]["batch_digest"] for i in range(1,11)] + [es["question_batches"][str(i)]["batch_digest"] for i in range(1,11)],
    }
    es["harvest"]={**core,"model":"chunked-host-aggregate","harvest_digest":digest(core)}


def _validate_harvest(state:dict,eid:str,r:dict)->dict:
    _validate_binding(state,r,f"harvest:{eid}")
    if r.get("source") not in RAW_HARVEST_SOURCES: raise EngineError("raw harvest source disallowed")
    if str(r.get("expert_id") or "")!=eid:
        raise EngineError("expert_id mismatch")
    model=str(r.get("model") or "").strip()
    if not model:
        raise EngineError("harvest receipt missing model")
    ideas=r.get("ideas") or []
    questions=r.get("questions") or []
    if len(ideas)!=100:
        raise EngineError(f"{eid}: ideas {len(ideas)}/100")
    if len(questions)!=100:
        raise EngineError(f"{eid}: questions {len(questions)}/100")
    idea_ids=[]; idea_text=[]; axes=set()
    for i,x in enumerate(ideas):
        if not isinstance(x,dict): raise EngineError(f"{eid}: malformed idea {i}")
        iid=str(x.get("idea_id") or ""); proposal=str(x.get("proposal") or ""); axis=str(x.get("axis") or "")
        if not iid or not proposal or not axis: raise EngineError(f"{eid}: malformed idea {i}")
        idea_ids.append(iid); idea_text.append(norm(proposal)); axes.add(norm(axis))
    if len(set(idea_ids))!=100 or len(set(idea_text))!=100:
        raise EngineError(f"{eid}: duplicate ideas")
    if len({x for x in axes if x})<10:
        raise EngineError(f"{eid}: fewer than 10 idea axes")
    qids=[]; qtext=[]; fam=set()
    for i,q in enumerate(questions):
        if not isinstance(q,dict): raise EngineError(f"{eid}: malformed question {i}")
        qid=str(q.get("question_id") or ""); txt=str(q.get("question") or ""); family=str(q.get("family") or ""); mode=str(q.get("mode") or "").lower()
        if not qid or not txt or not family or mode not in {"choice","noul","score"}:
            raise EngineError(f"{eid}: malformed question {i}")
        qids.append(qid); qtext.append(norm(txt)); fam.add(norm(family))
    if len(set(qids))!=100 or len(set(qtext))!=100:
        raise EngineError(f"{eid}: duplicate questions")
    if len({x for x in fam if x})<10:
        raise EngineError(f"{eid}: fewer than 10 question families")
    div=dict(r.get("diversity_receipt") or {})
    if div.get("observed") is not True or not div.get("model") or not div.get("method"):
        raise EngineError(f"{eid}: diversity receipt invalid")
    if div.get("request_id") not in (None,"",state["request_id"]):
        raise EngineError(f"{eid}: diversity request_id mismatch")
    if div.get("expert_id") not in (None,"",eid):
        raise EngineError(f"{eid}: diversity expert_id mismatch")
    if int(div.get("distinct_ideas",0))!=100 or int(div.get("distinct_questions",0))!=100:
        raise EngineError(f"{eid}: semantic diversity not 100/100")
    if float(div.get("max_idea_similarity",1.0))>0.92 or float(div.get("max_question_similarity",1.0))>0.92:
        raise EngineError(f"{eid}: near-duplicate threshold exceeded")
    # Normalize the binding for the Runtime Controller. The outer harvest
    # receipt is already request/expert-bound; missing nested bindings are
    # filled, conflicting ones were rejected above.
    div["request_id"]=state["request_id"]
    div["expert_id"]=eid
    evidence_status=str(r.get("evidence_status") or "not_required")
    if evidence_status not in {"used","not_required","unavailable"}:
        raise EngineError(f"{eid}: invalid evidence_status")
    refs=list(r.get("evidence_refs") or [])
    if evidence_status=="used" and not refs:
        raise EngineError(f"{eid}: evidence refs missing")
    if state.get("knowledge_snapshot_digest"):
        if str(r.get("knowledge_snapshot_digest") or "")!=state["knowledge_snapshot_digest"]:
            raise EngineError(f"{eid}: knowledge snapshot mismatch")
    return {
        "model":model,"ideas":ideas,"questions":questions,"diversity_receipt":div,
        "evidence_status":evidence_status,"evidence_refs":refs,
        "knowledge_snapshot_digest":r.get("knowledge_snapshot_digest"),
        "harvest_digest":digest(r),
    }


def _extract_decision(result:dict)->tuple[str,dict]:
    if not isinstance(result,dict): raise EngineError("tool result must be object")
    sc=result.get("structuredContent") or result.get("structured_content") or {}
    model=sc.get("model") or result.get("model")
    if not model: raise EngineError("Jev receipt missing model")
    answers=sc.get("answers") or {}
    decision=answers.get("decision") or sc.get("decision") or result.get("decision")
    if not isinstance(decision,dict): raise EngineError("Jev receipt missing structured decision")
    dtype=str(decision.get("type") or "").lower()
    if dtype not in {"choice","noul","score"}: raise EngineError("invalid Jev decision type")
    return str(model),decision


def _expected_action(state:dict,action_id:str)->dict:
    parts=action_id.split(":")
    if len(parts)<2: raise EngineError("invalid action_id")
    kind,eid=parts[0],parts[1]
    if eid not in state["experts"]: raise EngineError("unknown expert")
    es=state["experts"][eid]
    if kind=="harvest":
        return {"kind":"expert_harvest","expert_id":eid}
    if kind=="ideas":
        if len(parts)!=3: raise EngineError("invalid idea batch action")
        batch=int(parts[2])
        if batch<1 or batch>HARVEST_BATCHES: raise EngineError("idea batch out of range")
        return {"kind":"expert_idea_batch","expert_id":eid,"batch":batch}
    if kind=="questions":
        if len(parts)!=3: raise EngineError("invalid question batch action")
        batch=int(parts[2])
        if batch<1 or batch>HARVEST_BATCHES: raise EngineError("question batch out of range")
        return {"kind":"expert_question_batch","expert_id":eid,"batch":batch}
    if not es["harvest"]:
        raise EngineError("judge action before harvest")
    if kind=="group":
        idx=int(parts[2]); ideas=es["harvest"]["ideas"][(idx-1)*10:idx*10]
        return {"kind":"jev_choice","expert_id":eid,"group":idx,"decision_type":"choice","options":ideas}
    if kind=="final":
        return {"kind":"jev_choice","expert_id":eid,"final":parts[2],"decision_type":"choice"}
    if kind=="question":
        qid=":".join(parts[2:])
        q=next((q for q in es["harvest"]["questions"] if str(q["question_id"])==qid),None)
        if not q: raise EngineError("unknown question id")
        return {"kind":f"jev_{q['mode']}","expert_id":eid,"question":q,"decision_type":q["mode"]}
    raise EngineError("unsupported action kind")


def _blind_options(items:list[dict],request_id:str,action_id:str,id_key:str)->dict:
    ordered=list(items)
    seed=int(hashlib.sha256(f"{request_id}|{action_id}".encode()).hexdigest()[:16],16)
    random.Random(seed).shuffle(ordered)
    return {f"O{i+1:02d}":{"candidate_id":str(x[id_key]),"content":x} for i,x in enumerate(ordered)}


def _winner_from_receipt(receipt:dict)->str:
    _,d=_extract_decision(receipt.get("result") or {})
    if str(d.get("type"))!="choice" or not d.get("choice"):
        raise EngineError("choice receipt missing choice")
    return str(d["choice"])


def _winner_candidate_id(state:dict,eid:str,action_id:str,receipt:dict)->str:
    es=state["experts"][eid]
    choice=_winner_from_receipt(receipt)
    if action_id.startswith("group:"):
        idx=int(action_id.split(":")[2])
        opts=_blind_options(es["harvest"]["ideas"][(idx-1)*10:idx*10],state["request_id"],action_id,"idea_id")
    else:
        winners=[]
        for i in range(1,11):
            gr=es["group_receipts"].get(str(i))
            if not gr: raise EngineError("final before all group winners")
            cid=gr["winner_candidate_id"]
            idea=next(x for x in es["harvest"]["ideas"] if str(x["idea_id"])==cid)
            winners.append(idea)
        ordered=winners if action_id.endswith(":A") else list(reversed(winners))
        opts=_blind_options(ordered,state["request_id"],action_id,"idea_id")
    if choice not in opts:
        # Accept direct candidate id too, but never an unknown choice.
        ids={v["candidate_id"] for v in opts.values()}
        if choice in ids: return choice
        raise EngineError("Jev choice not in closed option set")
    return str(opts[choice]["candidate_id"])


def _maybe_complete_expert(state:dict,eid:str):
    es=state["experts"][eid]
    if es["complete"] or not es["harvest"]: return
    if len(es["group_receipts"])!=10 or len(es["question_receipts"])!=100 or len(es["final_receipts"])!=2:
        return
    a=es["final_receipts"].get("A",{}).get("winner_candidate_id")
    b=es["final_receipts"].get("B",{}).get("winner_candidate_id")
    if not a or a!=b:
        raise EngineError(f"{eid}: unstable expert final")
    h=es["harvest"]
    payload={
        "expert_id":eid,
        "ideas":h["ideas"],
        "questions":h["questions"],
        "idea_group_receipts":[es["group_receipts"][str(i)]["runtime_receipt"] for i in range(1,11)],
        "expert_final_receipts":[es["final_receipts"][x]["runtime_receipt"] for x in ("A","B")],
        "question_receipts":[es["question_receipts"][str(q["question_id"])]["runtime_receipt"] for q in h["questions"]],
        "diversity_receipt":h["diversity_receipt"],
        "evidence_status":h["evidence_status"],
        "evidence_refs":h["evidence_refs"],
    }
    if h.get("knowledge_snapshot_digest"):
        payload["knowledge_snapshot_digest"]=h["knowledge_snapshot_digest"]
    event={
        "event_id":f"expert-cycle:{eid}:{digest(payload)[:16]}",
        "request_id":state["request_id"],
        "type":"expert_cycle",
        "payload":payload,
    }
    es["runtime_event"]=event
    es["complete"]=True


def ingest(state:dict, receipt:dict)->dict:
    action_id=str(receipt.get("action_id") or "")
    if not action_id: raise EngineError("action_id required")
    _validate_binding(state,receipt,action_id)
    expected=_expected_action(state,action_id)
    if receipt.get("expert_id") != expected["expert_id"]: raise EngineError("expert_id mismatch")
    if receipt.get("error") or receipt.get("isError") or receipt.get("success") is False:
        state["metrics"]["failures"]+=1
        state.setdefault("failure_log",[]).append({"action_id":action_id,"error":str(receipt.get("error") or "provider failed")})
        raise EngineError("provider failure")
    is_new=_record_action(state,action_id,receipt)
    if not is_new:
        return {"ok":True,"idempotent_replay":True,"state":state}
    eid=expected["expert_id"]; es=state["experts"][eid]
    try:
        rollback_batch=None
        if expected["kind"]=="expert_harvest":
            if es["harvest"]: raise EngineError("harvest already accepted")
            es["harvest"]=_validate_harvest(state,eid,receipt)
            state["metrics"]["harvest_calls_observed"]+=1
        elif expected["kind"]=="expert_idea_batch":
            key=str(expected["batch"])
            if key in es["idea_batches"]: raise EngineError("idea batch already accepted")
            es["idea_batches"][key]=_validate_idea_batch(state,eid,expected["batch"],receipt)
            rollback_batch=("idea_batches",key)
            state["metrics"]["harvest_calls_observed"]+=1
            _maybe_finalize_chunked_harvest(state,eid)
        elif expected["kind"]=="expert_question_batch":
            key=str(expected["batch"])
            if key in es["question_batches"]: raise EngineError("question batch already accepted")
            es["question_batches"][key]=_validate_question_batch(state,eid,expected["batch"],receipt)
            rollback_batch=("question_batches",key)
            state["metrics"]["harvest_calls_observed"]+=1
            _maybe_finalize_chunked_harvest(state,eid)
        else:
            model,decision=_extract_decision(receipt.get("result") or {})
            dtype=expected["decision_type"]
            if str(decision.get("type") or "").lower()!=dtype:
                raise EngineError("decision type mismatch")
            # Runtime packet ids must use the original question id for question
            # coverage; orchestration action ids remain separately traceable.
            packet_id=action_id
            if action_id.startswith("question:"):
                packet_id=":".join(action_id.split(":")[2:])
            runtime_receipt={
                "observed":True,"request_id":state["request_id"],"expert_id":eid,
                "packet_id":packet_id,"action_id":action_id,"result":receipt["result"],
            }
            state["metrics"]["jev_calls_observed"]+=1
            if action_id.startswith("group:"):
                idx=action_id.split(":")[2]
                winner=_winner_candidate_id(state,eid,action_id,receipt)
                runtime_receipt["resolved_choice"]=winner
                es["group_receipts"][idx]={"model":model,"winner_candidate_id":winner,"runtime_receipt":runtime_receipt}
            elif action_id.startswith("final:"):
                key=action_id.split(":")[2]
                winner=_winner_candidate_id(state,eid,action_id,receipt)
                runtime_receipt["resolved_choice"]=winner
                es["final_receipts"][key]={"model":model,"winner_candidate_id":winner,"runtime_receipt":runtime_receipt}
            elif action_id.startswith("question:"):
                qid=packet_id
                es["question_receipts"][qid]={"model":model,"runtime_receipt":runtime_receipt}
            _maybe_complete_expert(state,eid)
    except Exception:
        state["metrics"]["failures"]+=1
        # Roll back accepted action bookkeeping and tentative batch storage so
        # the exact same action id can be retried safely after malformed output.
        if 'rollback_batch' in locals() and rollback_batch:
            es[rollback_batch[0]].pop(rollback_batch[1],None)
            es["harvest"]=None
            state["metrics"]["harvest_calls_observed"]=max(0,state["metrics"]["harvest_calls_observed"]-1)
        state["action_digests"].pop(action_id,None); state["action_receipts"].pop(action_id,None)
        state["metrics"]["host_calls_observed"]-=1
        raise
    return {"ok":True,"idempotent_replay":False,"state":state}


def _final_actions(state:dict,eid:str)->list[dict]:
    es=state["experts"][eid]
    if len(es["group_receipts"])!=10: return []
    winners=[]
    for i in range(1,11):
        cid=es["group_receipts"][str(i)]["winner_candidate_id"]
        winners.append(next(x for x in es["harvest"]["ideas"] if str(x["idea_id"])==cid))
    actions=[]
    for key,ordered in (("A",winners),("B",list(reversed(winners)))):
        aid=f"final:{eid}:{key}"
        if aid in state["action_digests"]: continue
        opts=_blind_options(ordered,state["request_id"],aid,"idea_id")
        actions.append({
            "action_id":aid,"request_id":state["request_id"],"kind":"jev_choice","expert_id":eid,
            "instructions":"Choose the strongest expert finalist. Judge quality, feasibility, evidence coverage, novelty, internal consistency and uncertainty.",
            "criteria":{k:v["content"]["proposal"] for k,v in opts.items()},
            "closed_options":opts,
        })
    return actions


def actions_for_expert(state:dict,eid:str)->list[dict]:
    es=state["experts"][eid]
    if es["complete"]: return []
    if not es["harvest"]:
        actions=[]
        for i in range(1,HARVEST_BATCHES+1):
            aid=f"ideas:{eid}:{i:02d}"
            if aid in state["action_digests"] or str(i) in es["idea_batches"]: continue
            start=(i-1)*ITEMS_PER_BATCH
            actions.append({
                "action_id":aid,"request_id":state["request_id"],"kind":"expert_idea_batch","expert_id":eid,
                "batch_index":i,"subject":state["subject"],"visual":state["visual"],"axis_hint":IDEA_AXIS_HINTS[i-1],
                "knowledge_snapshot_digest":state.get("knowledge_snapshot_digest"),
                "adapter_policy":{"preferred":["host_chat_model","kosif_frontier_raw","external_model"],"forbidden":["kosif_think_council"],"receipt_source_required":True},
                "requirements":{"count":10,"expected_ids":[f"{eid}-i{x:03d}" for x in range(start,start+10)],"json_only":True},
            })
        for i in range(1,HARVEST_BATCHES+1):
            aid=f"questions:{eid}:{i:02d}"
            if aid in state["action_digests"] or str(i) in es["question_batches"]: continue
            start=(i-1)*ITEMS_PER_BATCH
            actions.append({
                "action_id":aid,"request_id":state["request_id"],"kind":"expert_question_batch","expert_id":eid,
                "batch_index":i,"subject":state["subject"],"visual":state["visual"],"family_hint":QUESTION_FAMILY_HINTS[i-1],
                "knowledge_snapshot_digest":state.get("knowledge_snapshot_digest"),
                "adapter_policy":{"preferred":["host_chat_model","kosif_frontier_raw","external_model"],"forbidden":["kosif_think_council"],"receipt_source_required":True},
                "requirements":{"count":10,"expected_ids":[f"{eid}-q{x:03d}" for x in range(start,start+10)],"allowed_modes":["noul","choice","score"],"json_only":True},
            })
        return actions
    actions=[]
    # Groups are ready immediately after harvest.
    for i in range(1,11):
        aid=f"group:{eid}:{i}"
        if aid in state["action_digests"]: continue
        ideas=es["harvest"]["ideas"][(i-1)*10:i*10]
        opts=_blind_options(ideas,state["request_id"],aid,"idea_id")
        actions.append({
            "action_id":aid,"request_id":state["request_id"],"kind":"jev_choice","expert_id":eid,
            "instructions":"Choose the strongest idea in this blinded closed set.",
            "criteria":{k:v["content"]["proposal"] for k,v in opts.items()},"closed_options":opts,
        })
    # Questions are also ready immediately; each remains a separate Jev call.
    for q in es["harvest"]["questions"]:
        qid=str(q["question_id"]); aid=f"question:{eid}:{qid}"
        if aid in state["action_digests"]: continue
        mode=str(q["mode"])
        a={
            "action_id":aid,"request_id":state["request_id"],"kind":f"jev_{mode}","expert_id":eid,
            "instructions":q["question"],"family":q.get("family"),"evidence_refs":q.get("evidence_refs") or [],
        }
        if mode=="choice": a["criteria"]=q.get("criteria") or {"A":"yes/stronger","B":"no/weaker"}
        elif mode=="score": a["criteria"]=q.get("criteria") or ["0-poor","1-weak","2-adequate","3-strong","4-excellent"]
        else:
            a["true_criteria"]=q.get("true_criteria") or "The proposition is sufficiently supported."
            a["false_criteria"]=q.get("false_criteria") or "The proposition is not sufficiently supported."
        actions.append(a)
    actions.extend(_final_actions(state,eid))
    return actions


def next_actions(state:dict,limit:int=20)->list[dict]:
    if limit<1: return []
    # Depth-first: finish the first incomplete expert so progress becomes observable quickly.
    for eid in state["roster"]:
        if not state["experts"][eid]["complete"]:
            return actions_for_expert(state,eid)[:limit]
    return []


def drain_runtime_events(state:dict)->list[dict]:
    out=[]
    for eid in state["roster"]:
        ev=state["experts"][eid].get("runtime_event")
        if not ev: continue
        ed=digest(ev)
        if state["emitted_runtime_events"].get(eid)==ed: continue
        out.append(ev); state["emitted_runtime_events"][eid]=ed
    return out


def status(state:dict)->dict:
    harvested=sum(1 for e in state["experts"].values() if e["harvest"])
    complete=sum(1 for e in state["experts"].values() if e["complete"])
    current=next((e for e in state["roster"] if not state["experts"][e]["complete"]),None)
    ideas_harvested=0; questions_harvested=0
    for e in state["experts"].values():
        if e.get("idea_batches"):
            ideas_harvested+=sum(len(b.get("items") or []) for b in e["idea_batches"].values())
        elif e.get("harvest"):
            ideas_harvested+=len(e["harvest"].get("ideas") or [])
        if e.get("question_batches"):
            questions_harvested+=sum(len(b.get("items") or []) for b in e["question_batches"].values())
        elif e.get("harvest"):
            questions_harvested+=len(e["harvest"].get("questions") or [])
    return {
        "version":state["version"],"request_id":state["request_id"],"visual":state["visual"],"executor":state["executor"],
        "experts_required":len(state["roster"]),"experts_harvested":harvested,"experts_complete":complete,"current_expert":current,
        "ideas_harvested":ideas_harvested,"questions_harvested":questions_harvested,
        "jev_calls_observed":state["metrics"]["jev_calls_observed"],
        "minimum_jev_calls_required":len(state["roster"])*112,
        "host_calls_observed":state["metrics"]["host_calls_observed"],
        "harvest_calls_observed":state["metrics"]["harvest_calls_observed"],
        "minimum_harvest_calls_required":len(state["roster"])*20,
        "pending_now":len(next_actions(state,200)),
        "runtime_events_ready":sum(1 for e in state["experts"].values() if e.get("runtime_event")),
        "complete":complete==len(state["roster"]),
    }


def load(path:Path)->dict: return json.loads(path.read_text(encoding="utf-8"))
def save(path:Path,state:dict):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+".tmp")
    tmp.write_text(json.dumps(state,ensure_ascii=False,indent=2,sort_keys=True),encoding="utf-8")
    os.replace(tmp,path)


def main(argv=None):
    ap=argparse.ArgumentParser(); sp=ap.add_subparsers(dest="cmd",required=True)
    p=sp.add_parser("init"); p.add_argument("state"); p.add_argument("request_id"); p.add_argument("executor"); p.add_argument("subject"); p.add_argument("--visual",action="store_true"); p.add_argument("--knowledge-snapshot")
    p=sp.add_parser("next"); p.add_argument("state"); p.add_argument("--limit",type=int,default=20)
    p=sp.add_parser("ingest"); p.add_argument("state")
    p=sp.add_parser("status"); p.add_argument("state")
    p=sp.add_parser("drain-events"); p.add_argument("state")
    ns=ap.parse_args(argv); path=Path(ns.state)
    try:
        if ns.cmd=="init":
            if path.exists(): raise EngineError("state file already exists")
            s=new_state(ns.request_id,ns.executor,ns.visual,ns.subject,ns.knowledge_snapshot); save(path,s); out={"ok":True,"status":status(s)}
        elif ns.cmd=="next":
            s=load(path); out={"ok":True,"actions":next_actions(s,ns.limit),"status":status(s)}
        elif ns.cmd=="ingest":
            s=load(path); receipt=json.load(sys.stdin); r=ingest(s,receipt); save(path,s); out={"ok":True,"idempotent_replay":r["idempotent_replay"],"status":status(s)}
        elif ns.cmd=="drain-events":
            s=load(path); ev=drain_runtime_events(s); save(path,s); out={"ok":True,"events":ev,"status":status(s)}
        else:
            out={"ok":True,"status":status(load(path))}
    except Exception as e:
        out={"ok":False,"error":str(e)}
    print(json.dumps(out,ensure_ascii=False,indent=2,sort_keys=True))
    return 0 if out.get("ok") else 1

if __name__=="__main__": raise SystemExit(main())
