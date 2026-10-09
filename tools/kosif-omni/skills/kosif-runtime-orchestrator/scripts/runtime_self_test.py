#!/usr/bin/env python3
import copy, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import full_pro_runtime as rt

REQ="req-v5-selftest"

def choice_result(choice):
    return {"structuredContent":{"model":"jev-test","answers":{"decision":{"type":"choice","choice":choice,"confidence":0.9,"probabilities":{choice:0.9,"other":0.1}}}}}

def noul_result():
    return {"structuredContent":{"model":"jev-test","answers":{"decision":{"type":"noul","noul":0.8}}}}

def wrap(eid,pid,result):
    return {"observed":True,"request_id":REQ,"expert_id":eid,"packet_id":pid,"result":result}

def cycle(eid, knowledge=None):
    ideas=[{"idea_id":f"{eid}-i{i:03d}","axis":f"axis-{i%10}","proposal":f"{eid} unique proposal {i}"} for i in range(100)]
    questions=[{"question_id":f"{eid}-q{i:03d}","family":f"family-{i%10}","mode":"noul","question":f"{eid} unique question {i}"} for i in range(100)]
    groups=[wrap(eid,f"{eid}-g{i}",choice_result(f"{eid}-i{i*10:03d}")) for i in range(10)]
    finals=[wrap(eid,f"{eid}-fa",choice_result(f"{eid}-i000")),wrap(eid,f"{eid}-fb",choice_result(f"{eid}-i000"))]
    qrs=[wrap(eid,q["question_id"],noul_result()) for q in questions]
    p={
      "expert_id":eid,"ideas":ideas,"questions":questions,"idea_group_receipts":groups,"expert_final_receipts":finals,"question_receipts":qrs,
      "diversity_receipt":{"observed":True,"request_id":REQ,"expert_id":eid,"model":"diversity-test","method":"embedding+lexical","distinct_ideas":100,"distinct_questions":100,"max_idea_similarity":0.80,"max_question_similarity":0.80},
      "evidence_status":"used" if knowledge else "not_required","evidence_refs":["drive://source/chunk"] if knowledge else []
    }
    if knowledge: p["knowledge_snapshot_digest"]=knowledge
    return p

def event(i,t,p): return {"event_id":f"evt-{i}","request_id":REQ,"type":t,"payload":p}

# adversarial cycle checks
s=rt.new_state(REQ,"image_gen",True)
bad=cycle(s["expected_experts"][0]); bad["question_receipts"].pop()
try: rt.apply_event(s,event("bad99","expert_cycle",bad)); raise AssertionError("99/100 should block")
except rt.RuntimeValidationError as e: assert "99/100" in str(e)

bad2=cycle(s["expected_experts"][0]); bad2["question_receipts"][0]["request_id"]="stale"
try: rt.apply_event(s,event("badstale","expert_cycle",bad2)); raise AssertionError("stale should block")
except ValueError as e: assert "request_id mismatch" in str(e)

bad3=cycle(s["expected_experts"][0]); bad3["ideas"][1]["proposal"]=bad3["ideas"][0]["proposal"]
try: rt.apply_event(s,event("baddup","expert_cycle",bad3)); raise AssertionError("duplicate should block")
except rt.RuntimeValidationError as e: assert "duplicate" in str(e)

bad4=cycle(s["expected_experts"][0]); bad4["question_receipts"][0]["result"]={"structuredContent":{"answers":{"decision":{"type":"noul","noul":0.8}}}}
try: rt.apply_event(s,event("badfake","expert_cycle",bad4)); raise AssertionError("missing model should block")
except ValueError as e: assert "model" in str(e)

# complete full 167-expert state in memory
KNOW="a"*64
s=rt.new_state(REQ,"image_gen",True,KNOW)
idx=0
for eid in s["expected_experts"]:
    idx+=1; rt.apply_event(s,event(idx,"expert_cycle",cycle(eid,KNOW)))
assert len(s["expert_cycles"])==167
# idempotent exact replay does not double count
first=event(1,"expert_cycle",cycle(s["expected_experts"][0],KNOW))
r=rt.apply_event(s,first); assert r["idempotent_replay"] is True and len(s["expert_cycles"])==167

cross={"complete":True,"receipts":[{"observed":True,"request_id":REQ,"packet_id":"cross-1","result":choice_result("syn-A")}]}
rt.apply_event(s,event("cross","cross_expert",cross))
stages=[]
for st in rt.EINSTEIN_STAGES:
    out={"ok":True}
    if st=="observation": out={"observations":[],"inferences":[],"uncertainties":[],"evidence_refs":[]}
    elif st=="first_principles": out={"essence":"x","governing_tension":"y","invariants":["a"],"incidental":[]}
    elif st=="gedanken": out={"experiments":[{"premise":"what if"}]}
    elif st=="observer_relativity": out={"frames":[{"observer":"camera"}],"invariants_across_frames":["a"]}
    elif st=="unification": out={"candidates":[{"id":"syn-A"},{"id":"syn-B"}]}
    elif st=="simplicity_critic": out={"verdict":"accept","scores":{"fidelity":9}}
    elif st=="revision": out={"final_candidate_id":"syn-A","candidate_digest":"placeholder"}
    stages.append({"observed":True,"request_id":REQ,"stage":st,"model":"einstein-test","output":out})
ein={"completed":True,"stages":rt.EINSTEIN_STAGES,"stage_receipts":stages,"synthesis_candidates":[{"id":"syn-A"},{"id":"syn-B"}]}
rt.apply_event(s,event("ein","einstein",ein))
final={"receipts":[{"observed":True,"request_id":REQ,"packet_id":"f1","result":choice_result("syn-A")},{"observed":True,"request_id":REQ,"packet_id":"f2","result":choice_result("syn-A")} ]}
rt.apply_event(s,event("final","final_stability",final))
rt.apply_event(s,event("gates","gates",{"gates":{"deterministic":"pass","risk":"pass","self_critic":"pass","verifier":"pass"},"blocking_objections":[]}))
sys.path.insert(0,str(HERE.parents[1]/"kosif-secure-executor"/"scripts"))
from scene_spec import FIELDS
cand={k:"test "+k for k in FIELDS}
cand.update(subjects=["duck","dragon"],negative_constraints=["no text"],lighting={"key":"fire","fill":"sky","rim":"moon"},aspect_ratio="16:9")
rt.apply_event(s,event("freeze","freeze_candidate",{"candidate_id":"syn-A","candidate":cand,"candidate_digest":rt.digest(cand)}))
a=rt.authorize(s); assert a["authorization_ready"] is True and a["execution_lock"]
assert rt.status(s)["experts_validated"]==167
assert rt.status(s)["jev_calls_observed"]==167*112+3

# bypass and lock mismatch fail
s2=rt.new_state("other","image_gen",False)
try:
    rt.apply_event(s2,{"event_id":"x","request_id":"other","type":"executor_receipt","payload":{"observed":True}}); raise AssertionError("bypass should fail")
except rt.RuntimeValidationError as e: assert "before authorization" in str(e)

bad_exec={"observed":True,"request_id":REQ,"executor":"image_gen","candidate_digest":s["candidate_digest"],"execution_path":"kosif_secure_executor","execution_lock":"wrong","result_digest":"r"*64}
try: rt.apply_event(s,event("execbad","executor_receipt",bad_exec)); raise AssertionError("wrong lock should fail")
except rt.RuntimeValidationError as e: assert "execution_lock mismatch" in str(e)

good_exec={"observed":True,"request_id":REQ,"executor":"image_gen","candidate_digest":s["candidate_digest"],"execution_lock":a["execution_lock"],"result_digest":"b"*64,"execution_path":"kosif_secure_executor","secure_ticket_id":a["secure_executor_ticket"]["ticket_id"],"secure_authorization_digest":a["secure_executor_ticket"]["authorization_digest"],"secure_executor_verified":True,"secure_signature":a["secure_executor_ticket"]["signature"]}
rt.apply_event(s,event("exec","executor_receipt",good_exec))
rt.apply_event(s,event("qa","artifact_qa",{"pass":True,"request_id":REQ,"checks":["pixels","contract"]}))
st=rt.status(s); assert st["complete"] is True and st["phase"]=="COMPLETE"
print("PASS: v5.3 runtime blocks 99/100, stale/fake/duplicate evidence and host-native bypass; validates 167 experts and completes only after secure executor+QA receipts.")
