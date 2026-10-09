#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("gate",HERE/"full_pro_execution_gate.py")
gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)

REQ="req-test-460"

def choice_result(choice):
    return {"structuredContent":{"model":"jev-test","answers":{"decision":{"type":"choice","choice":choice,"confidence":0.9,"probabilities":{choice:0.9,"other":0.1}}}}}
def noul_result():
    return {"structuredContent":{"model":"jev-test","answers":{"decision":{"type":"noul","noul":0.8}}}}
def wrap(eid,pid,result,question=False):
    k="question_id" if question else "packet_id"
    return {"observed":True,"request_id":REQ,"expert_id":eid,k:pid,"result":result}

def make_cycle(eid):
    ideas=[{"idea_id":f"{eid}-i{i:03d}","axis":f"a{i%10}","proposal":f"{eid} proposal {i}"} for i in range(100)]
    questions=[{"question_id":f"{eid}-q{i:03d}","family":f"f{i%10}","mode":"noul","question":f"{eid} question {i}"} for i in range(100)]
    groups=[wrap(eid,f"{eid}-g{i}",choice_result(f"{eid}-i{i*10:03d}")) for i in range(10)]
    finals=[wrap(eid,f"{eid}-fa",choice_result(f"{eid}-i000")),wrap(eid,f"{eid}-fb",choice_result(f"{eid}-i000"))]
    qrs=[wrap(eid,q["question_id"],noul_result(),True) for q in questions]
    return {"expert_id":eid,"ideas":ideas,"questions":questions,"idea_group_receipts":groups,"expert_final_receipts":finals,"question_receipts":qrs}

experts=gate.roster(True)
candidate={"prompt":"duck vs dragon","version":"frozen"}
cd=gate.digest_obj(candidate)
bundle={
 "mode":"full","request_id":REQ,"executor":"image_gen","visual":True,
 "candidate":candidate,"candidate_digest":cd,
 "expert_cycles":[make_cycle(e) for e in experts],
 "cross_expert":{"complete":True,"receipts":[{"observed":True,"request_id":REQ,"packet_id":"cross-1","result":choice_result("syn-A")}]},
 "einstein_chief":{"completed":True,"stages":gate.STAGES,"synthesis_candidates":[{"id":"syn-A"},{"id":"syn-B"}]},
 "final_jev_stability":[
   {"observed":True,"request_id":REQ,"packet_id":"syn-final-a","result":choice_result("syn-A")},
   {"observed":True,"request_id":REQ,"packet_id":"syn-final-b","result":choice_result("syn-A")}
 ],
 "frozen_candidate_id":"syn-A",
 "gates":{"deterministic":"pass","risk":"pass","self_critic":"pass","verifier":"pass"},
 "blocking_objections":[]
}
ok=gate.check(bundle)
assert ok["authorization_ready"] is True, ok["issues"]
assert ok["validated_experts"]==167
assert ok["jev_calls_observed"]>=18707
assert ok["execution_lock"]

broken=json.loads(json.dumps(bundle))
broken["expert_cycles"][0]["question_receipts"].pop()
bad=gate.check(broken)
assert bad["authorization_ready"] is False
assert any("question receipts 99/100" in x for x in bad["issues"])

stale=json.loads(json.dumps(bundle))
stale["expert_cycles"][0]["question_receipts"][0]["request_id"]="old-request"
bad2=gate.check(stale)
assert bad2["authorization_ready"] is False
assert any("request_id mismatch" in x for x in bad2["issues"])

print("PASS: v4.6 fail-closed execution gate blocks missing/stale 100x100 evidence and authorizes only fully bound current-request receipts.")
