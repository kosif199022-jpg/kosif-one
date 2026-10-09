#!/usr/bin/env python3
from expert_jev_mass_deliberation import *

def mk_expert(eid):
    ideas=[]; qs=[]
    for i in range(100):
        ideas.append({"axis":f"axis-{i%10}","title":f"Idea {i}","proposal":f"{eid} proposal {i}","why":"test"})
        qs.append({"family":f"family-{i%10}","mode":"choice","question":f"{eid} question {i}?","state":{"i":i},"criteria":{"A":"yes path","B":"no path"}})
    return {"expert_id":eid,"ideas":ideas,"questions":qs}

def choice(cid, ids):
    probs={x:(0.9 if x==cid else 0.1/(len(ids)-1)) for x in ids}
    return {"structuredContent":{"model":"jev-test","answers":{"decision":{"type":"choice","choice":cid,"confidence":0.9,"probabilities":probs}}}}

def run():
    h={"task":"visual test","constraints":[],"experts":[mk_expert("E1"),mk_expert("E2")]}
    v=validate_harvest(h); assert v['ok'] and v['expert_count']==2
    p=prepare_ideas(h); assert p['ok'] and len(p['packets'])==20
    res={}
    for pkt in p['packets']:
        res[pkt['packet_id']]=choice(pkt['candidate_ids'][0],pkt['candidate_ids'])
    a=advance_ideas({"prepared":p,"results":res}); assert a['ok'] and len(a['packets'])==4
    q=prepare_questions(h); assert q['ok'] and len(q['packets'])==200
    e=h['experts'][0]
    fpkts=[x for x in a['packets'] if x['expert_id']=='E1']
    target=fpkts[0]['candidate_ids'][0]
    finals=[choice(target,x['candidate_ids']) for x in fpkts]
    cycle=verify_expert_cycle({"expert_id":"E1","harvest":e,"group_results":[{}]*10,"final_results":finals,"question_results":[{}]*100})
    assert cycle['ok'] and cycle['quota_complete'] and cycle['jev_question_calls']==100
    r=roster_cmd({"visual":True}); assert r['expert_count']==167 and r['total_ideas_required']==16700 and r['total_questions_required']==16700
    print('PASS: 100x100 quotas, 10x10 idea tournament, 100-question queue and 167-expert visual roster validated.')

if __name__=='__main__': run()
