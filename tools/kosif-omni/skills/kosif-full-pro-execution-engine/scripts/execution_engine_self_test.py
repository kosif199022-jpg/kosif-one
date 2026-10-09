#!/usr/bin/env python3
import copy, json, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import execution_engine as ee

REQ="req-v51-engine-test"

def harvest(eid):
    ideas=[{"idea_id":f"{eid}-i{i:03d}","axis":f"axis-{i%10}","proposal":f"{eid} proposal {i}"} for i in range(100)]
    questions=[{"question_id":f"{eid}-q{i:03d}","family":f"family-{i%10}","mode":"noul","question":f"{eid} question {i}"} for i in range(100)]
    return {
        "observed":True,"request_id":REQ,"action_id":f"harvest:{eid}","expert_id":eid,"model":"gpt-live-test","source":"host_chat_model",
        "ideas":ideas,"questions":questions,
        "diversity_receipt":{"observed":True,"model":"diversity-test","method":"embedding+lexical","distinct_ideas":100,"distinct_questions":100,"max_idea_similarity":0.80,"max_question_similarity":0.80},
        "evidence_status":"not_required","evidence_refs":[]
    }

def jev_result(dtype,choice=None):
    d={"type":dtype}
    if dtype=="choice":
        d.update({"choice":choice,"confidence":0.9,"probabilities":{choice:0.9}})
    elif dtype=="noul": d["noul"]=0.8
    else: d.update({"score":3,"confidence":0.8})
    return {"structuredContent":{"model":"jev-live-test","answers":{"decision":d}}}

def receipt(action, result):
    return {"observed":True,"request_id":REQ,"action_id":action["action_id"],"expert_id":action["expert_id"],"result":result}

s=ee.new_state(REQ,"image_gen",True,"duck fights dragon")
assert len(s["roster"])==167
assert ee.status(s)["experts_complete"]==0
n=ee.next_actions(s,50)
assert len(n)==20
assert sum(a["kind"]=="expert_idea_batch" for a in n)==10
assert sum(a["kind"]=="expert_question_batch" for a in n)==10
assert all(a["expert_id"]=="M01" for a in n)

# 99/100 harvest fails and can be retried with same action id.
bad=harvest("M01"); bad["ideas"].pop()
try: ee.ingest(s,bad); raise AssertionError("99/100 harvest must fail")
except ee.EngineError as e: assert "99/100" in str(e)
assert ee.status(s)["host_calls_observed"]==0

good=harvest("M01")
r=ee.ingest(s,good); assert not r["idempotent_replay"]
r2=ee.ingest(s,copy.deepcopy(good)); assert r2["idempotent_replay"]
st=ee.status(s); assert st["experts_harvested"]==1 and st["ideas_harvested"]==100

# After harvest: 10 group + 100 question actions; finals appear after all group winners.
actions=ee.next_actions(s,200)
assert sum(a["kind"]=="jev_choice" and a["action_id"].startswith("group:") for a in actions)==10
assert sum(a["action_id"].startswith("question:") for a in actions)==100
assert not any(a["action_id"].startswith("final:") for a in actions)

# Fake Jev result without model is rejected.
qa=next(a for a in actions if a["action_id"].startswith("question:"))
try: ee.ingest(s,receipt(qa,{"structuredContent":{"answers":{"decision":{"type":"noul","noul":0.5}}}})); raise AssertionError("missing model must fail")
except ee.EngineError as e: assert "model" in str(e)

# Complete 10 group calls with a valid closed-set alias.
for i in range(1,11):
    a=next(x for x in ee.next_actions(s,200) if x["action_id"]==f"group:M01:{i}")
    alias=sorted(a["criteria"])[0]
    ee.ingest(s,receipt(a,jev_result("choice",alias)))

# Finals now exist. Pick the same direct candidate id in both passes.
finals=ee.next_actions(s,200)
fa=next(a for a in finals if a["action_id"]=="final:M01:A")
fb=next(a for a in finals if a["action_id"]=="final:M01:B")
# Find an intersection candidate and use direct id, allowed by the engine.
idsA={v["candidate_id"] for v in fa["closed_options"].values()}; idsB={v["candidate_id"] for v in fb["closed_options"].values()}
win=sorted(idsA & idsB)[0]
ee.ingest(s,receipt(fa,jev_result("choice",win)))
ee.ingest(s,receipt(fb,jev_result("choice",win)))

# Complete 100 question receipts, each its own observed call.
for a in list(ee.next_actions(s,300)):
    if a["action_id"].startswith("question:"):
        ee.ingest(s,receipt(a,jev_result(a["kind"].replace("jev_",""))))

st=ee.status(s)
assert st["experts_complete"]==1, st
assert st["jev_calls_observed"]==112, st
assert st["current_expert"]=="M02"
assert st["runtime_events_ready"]==1

ev=ee.drain_runtime_events(s)
assert len(ev)==1 and ev[0]["type"]=="expert_cycle" and ev[0]["payload"]["expert_id"]=="M01"
assert len(ev[0]["payload"]["question_receipts"])==100
assert len(ee.drain_runtime_events(s))==0

# Stale request rejected.
stale=harvest("M02"); stale["request_id"]="old"
try: ee.ingest(s,stale); raise AssertionError("stale request must fail")
except ee.EngineError as e: assert "request_id" in str(e)

assert all(r["packet_id"].startswith("M01-q") for r in ev[0]["payload"]["question_receipts"])
assert ev[0]["payload"]["diversity_receipt"]["request_id"]==REQ
assert ev[0]["payload"]["diversity_receipt"]["expert_id"]=="M01"
print("PASS: v5.2 engine emits Runtime-compatible question ids, resolved choices and bound diversity receipts after 112 observed Jev calls.")
