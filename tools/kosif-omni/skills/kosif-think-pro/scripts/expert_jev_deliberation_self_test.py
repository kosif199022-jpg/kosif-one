#!/usr/bin/env python3
from expert_jev_deliberation import prepare, advance, verify_finals, verify_receipt


def choice(choice, probs):
    return {"structuredContent": {"model": "jev-test", "answers": {"decision": {"type": "choice", "choice": choice, "confidence": max(probs.values()), "probabilities": probs}}}}


def run():
    contributions=[]
    # 14 ideas on one axis forces batching; duplicate one to test provenance merge.
    for i in range(14):
        proposal=f"camera plan {i}"
        contributions.append({"expert_id":f"E{i:02d}","state":"contributed","cards":[{"axis":"camera","title":f"P{i}","proposal":proposal,"why":"test"}]})
    contributions.append({"expert_id":"E14","state":"contributed","cards":[{"axis":"camera","title":"dup","proposal":"camera plan 0","why":"same idea"}]})
    contributions.append({"expert_id":"E15","state":"contributed","cards":[{"axis":"lighting","title":"L","proposal":"fire key plus cool storm rim"}]})
    p=prepare({"request_id":"r1","task":"draw a duck fighting a dragon","constraints":["cinematic"],"contributions":contributions})
    assert p["ok"] and p["raw_idea_count"]==16 and p["unique_idea_count"]==15 and p["duplicate_count"]==1
    assert max(len(x["candidate_ids"]) for x in p["packets"])<=10
    idea0=next(x for x in p["ideas"] if x["proposal"]=="camera plan 0")
    assert set(idea0["provenance"])=={"E00","E14"}

    results={}
    for packet in p["packets"]:
        ids=packet["candidate_ids"]
        probs={cid:(len(ids)-j)/sum(range(1,len(ids)+1)) for j,cid in enumerate(ids)}
        # normalize exactly
        s=sum(probs.values()); probs={k:v/s for k,v in probs.items()}
        results[packet["batch_id"]]=choice(ids[0],probs)
    a=advance({"prepared":p,"results":results,"top_k":3})
    assert a["ok"] and len(a["packets"])==2  # camera final a/b; lighting singleton auto-winner
    fresults={}
    for packet in a["packets"]:
        target=packet["candidate_ids"][0] if packet["variant"]=="primary" else packet["candidate_ids"][-1]
        # choose same semantic candidate for stability: primary first == reordered last
        probs={cid:(0.9 if cid==target else 0.1/(len(packet["candidate_ids"])-1)) for cid in packet["candidate_ids"]}
        fresults[packet["batch_id"]]=choice(target,probs)
    v=verify_finals({"advanced":a,"results":fresults})
    assert v["ok"] and not v["unstable_axes"] and set(v["winners"])=={"camera","lighting"}

    receipt={
        "mode":"full",
        "raw_idea_count":160,
        "unique_idea_count":72,
        "axes":["camera","lighting"],
        "coverage":{"modules":28,"profiles":14,"council_members":100,"council_chambers":10},
        "jev":{"available":True,"calls":12,"stability_passed":True,"models":["jev-1.13.0"]},
        "blocking_objections":[],
        "deterministic_gates_passed":True,
        "execution_ready":True,
    }
    rv=verify_receipt(receipt)
    assert rv["ok"] and rv["expert_jev_complete"] and rv["execution_ready"]
    print("PASS: Expert->Jev pool, dedup, tournament, stability and receipt gates work.")


if __name__=="__main__":
    run()
