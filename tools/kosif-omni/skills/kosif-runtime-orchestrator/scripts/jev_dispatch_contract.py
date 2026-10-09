#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, random, re
from typing import Any

DECISION_TYPES={"choice","noul","score"}

def _norm(s: Any)->str:
    return re.sub(r"[^\w\s\-:/]+","",re.sub(r"\s+"," ",str(s or "").strip().lower()),flags=re.UNICODE)

def digest(obj: Any)->str:
    raw=json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(",",":"),default=str).encode()
    return hashlib.sha256(raw).hexdigest()

def _rng_seed(*parts:str)->int:
    return int(hashlib.sha256("|".join(parts).encode()).hexdigest()[:16],16)

def blind_aliases(items:list[dict], request_id:str, packet_id:str, id_key:str)->list[dict]:
    if not items:
        return []
    ordered=list(items)
    random.Random(_rng_seed(request_id,packet_id)).shuffle(ordered)
    out=[]
    for i,item in enumerate(ordered):
        alias=f"O{i+1:02d}"
        out.append({"alias":alias,"candidate_id":str(item[id_key]),"content":item})
    return out

def prepare_idea_packets(request_id:str, expert_id:str, ideas:list[dict], batch_size:int=10)->list[dict]:
    if len(ideas)!=100:
        raise ValueError("ideas must contain exactly 100 items")
    packets=[]
    for i in range(0,100,batch_size):
        pid=f"{expert_id}-idea-group-{i//batch_size+1:02d}"
        opts=blind_aliases(ideas[i:i+batch_size],request_id,pid,"idea_id")
        packets.append({
            "request_id":request_id,"expert_id":expert_id,"packet_id":pid,
            "decision_type":"choice","blind":True,"options":opts,
            "rubric":["quality","evidence_coverage","feasibility","novelty","internal_consistency","uncertainty"],
        })
    return packets

def prepare_question_packets(request_id:str, expert_id:str, questions:list[dict])->list[dict]:
    if len(questions)!=100:
        raise ValueError("questions must contain exactly 100 items")
    out=[]
    for q in questions:
        mode=str(q.get("mode") or "").lower()
        if mode not in DECISION_TYPES:
            raise ValueError(f"invalid question mode {mode}")
        out.append({
            "request_id":request_id,"expert_id":expert_id,
            "packet_id":str(q["question_id"]),"decision_type":mode,
            "family":q.get("family"),"instructions":q.get("question"),
            "evidence_refs":list(q.get("evidence_refs") or []),
        })
    return out

def extract_decision(result:dict)->tuple[str,dict]:
    if not isinstance(result,dict):
        raise ValueError("result must be object")
    sc=result.get("structuredContent") or result.get("structured_content") or {}
    model=sc.get("model") or result.get("model")
    if not model:
        raise ValueError("Jev receipt missing actual model id")
    answers=sc.get("answers") or {}
    decision=answers.get("decision") or sc.get("decision") or result.get("decision")
    if not isinstance(decision,dict):
        raise ValueError("Jev receipt missing structured decision")
    dtype=str(decision.get("type") or "").lower()
    if dtype not in DECISION_TYPES:
        raise ValueError("Jev decision missing/invalid type")
    return str(model),decision

def validate_receipt(receipt:dict, *, request_id:str, expert_id:str|None=None, packet_id:str|None=None, decision_type:str|None=None)->dict:
    if receipt.get("observed") is not True:
        raise ValueError("receipt observed must be true")
    if str(receipt.get("request_id") or "")!=request_id:
        raise ValueError("request_id mismatch")
    if expert_id is not None and str(receipt.get("expert_id") or "")!=expert_id:
        raise ValueError("expert_id mismatch")
    rid=str(receipt.get("packet_id") or receipt.get("question_id") or "")
    if packet_id is not None and rid!=packet_id:
        raise ValueError("packet/question id mismatch")
    model,decision=extract_decision(receipt.get("result") or {})
    if decision_type and str(decision.get("type") or "").lower()!=decision_type:
        raise ValueError("decision type mismatch")
    return {"model":model,"decision":decision,"receipt_digest":digest(receipt)}

def stable_choice_pair(receipts:list[dict], *, request_id:str, expert_id:str|None=None)->str:
    if len(receipts)!=2:
        raise ValueError("stability pair requires exactly 2 receipts")
    choices=[]
    for r in receipts:
        v=validate_receipt(r,request_id=request_id,expert_id=expert_id,decision_type="choice")
        # Host runners may blind/reorder aliases differently across the paired
        # stability calls. They may therefore attach a verified resolved_choice
        # that maps the raw closed-set alias back to the stable candidate id.
        # The raw Jev result is still validated above and remains in the receipt.
        choice=r.get("resolved_choice") or v["decision"].get("choice")
        if not choice:
            raise ValueError("choice decision missing choice")
        choices.append(str(choice))
    if choices[0]!=choices[1]:
        raise ValueError("unstable choice pair")
    return choices[0]
