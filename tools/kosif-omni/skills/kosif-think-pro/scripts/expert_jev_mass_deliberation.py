#!/usr/bin/env python3
"""KOSIF Think Pro 4.5 — exhaustive 100×100 Expert→Jev helper.

This helper prepares/validates structured artifacts. It never fabricates or calls Jev.
Host Jev calls must be made separately and their raw receipts supplied back here.

Commands:
  roster
  validate-harvest
  prepare-ideas
  advance-ideas
  prepare-questions
  verify-expert-cycle
  verify-full
"""
from __future__ import annotations

import hashlib, json, re, sys
from collections import defaultdict

IDEAS_PER_EXPERT = 100
QUESTIONS_PER_EXPERT = 100
IDEA_BATCH_SIZE = 10
MIN_AXES = 10
MIN_FAMILIES = 10

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
QUESTION_MODES={"noul","choice","score"}


def _norm(v):
    s=re.sub(r"\s+"," ",str(v or "").strip().lower())
    return re.sub(r"[^\w\s\-:/]+","",s,flags=re.UNICODE)


def _sid(prefix,*parts):
    raw="|".join(map(str,parts)).encode()
    return f"{prefix}-{hashlib.sha256(raw).hexdigest()[:12]}"


def expert_roster(visual=True):
    base=MODULES+PROFILES+COUNCIL+SPECIALISTS
    if visual:
        base += AESTHETICS
    return base+CHIEF


def roster_cmd(o):
    visual=bool(o.get("visual",True))
    ids=expert_roster(visual)
    return {
        "ok":True,"version":"4.5.0","visual":visual,"expert_count":len(ids),"experts":ids,
        "ideas_per_expert":IDEAS_PER_EXPERT,"questions_per_expert":QUESTIONS_PER_EXPERT,
        "total_ideas_required":len(ids)*IDEAS_PER_EXPERT,
        "total_questions_required":len(ids)*QUESTIONS_PER_EXPERT,
        "minimum_jev_calls_per_expert":12+QUESTIONS_PER_EXPERT,
        "minimum_jev_calls_total":len(ids)*(12+QUESTIONS_PER_EXPERT),
        "note":"Minimum includes 10 idea-group choices + 2 final stability choices + 100 question calls; cross-expert tournaments add more.",
    }


def _validate_idea(expert_id, item, idx):
    if not isinstance(item,dict): return None,f"{expert_id}: idea[{idx}] must be object"
    proposal=str(item.get("proposal") or "").strip()
    axis=str(item.get("axis") or "").strip()
    if not proposal: return None,f"{expert_id}: idea[{idx}] missing proposal"
    if not axis: return None,f"{expert_id}: idea[{idx}] missing axis"
    return {
        "idea_id":str(item.get("idea_id") or item.get("id") or _sid("idea",expert_id,idx,axis,proposal)),
        "expert_id":expert_id,"axis":axis,"title":str(item.get("title") or proposal[:80]),
        "proposal":proposal,"why":str(item.get("why") or ""),
        "evidence_refs":list(item.get("evidence_refs") or []),"risks":list(item.get("risks") or []),
        "reversible_test":str(item.get("reversible_test") or ""),"novelty_tag":str(item.get("novelty_tag") or ""),
    },None


def _validate_question(expert_id,item,idx):
    if not isinstance(item,dict): return None,f"{expert_id}: question[{idx}] must be object"
    q=str(item.get("question") or item.get("instructions") or "").strip()
    family=str(item.get("family") or "").strip()
    mode=str(item.get("mode") or "").strip().lower()
    if not q: return None,f"{expert_id}: question[{idx}] missing question"
    if not family: return None,f"{expert_id}: question[{idx}] missing family"
    if mode not in QUESTION_MODES: return None,f"{expert_id}: question[{idx}] invalid mode {mode!r}"
    criteria=item.get("criteria")
    if mode=="choice" and (not isinstance(criteria,dict) or len(criteria)<2):
        return None,f"{expert_id}: question[{idx}] choice needs >=2 criteria"
    if mode=="score" and (not isinstance(criteria,list) or not 2<=len(criteria)<=10):
        return None,f"{expert_id}: question[{idx}] score needs 2..10 ordered criteria"
    out={
        "question_id":str(item.get("question_id") or item.get("id") or _sid("q",expert_id,idx,family,q)),
        "expert_id":expert_id,"family":family,"mode":mode,"question":q,
        "state":item.get("state") if item.get("state") is not None else {},
        "criteria":criteria,"purpose":str(item.get("purpose") or ""),
    }
    if mode=="noul":
        out["true_criteria"]=item.get("true_criteria")
        out["false_criteria"]=item.get("false_criteria")
    return out,None


def validate_harvest(o):
    experts=o.get("experts") or []
    if not isinstance(experts,list) or not experts:
        return {"ok":False,"issues":["experts must be non-empty list"]}
    issues=[]; normalized=[]
    seen_ids=set()
    for e in experts:
        if not isinstance(e,dict): issues.append("expert entry must be object"); continue
        eid=str(e.get("expert_id") or "").strip()
        if not eid: issues.append("expert missing expert_id"); continue
        if eid in seen_ids: issues.append(f"duplicate expert_id {eid}"); continue
        seen_ids.add(eid)
        ideas_raw=e.get("ideas") or []; qs_raw=e.get("questions") or []
        ideas=[]; qs=[]
        if len(ideas_raw)!=IDEAS_PER_EXPERT: issues.append(f"{eid}: ideas must be exactly 100, got {len(ideas_raw)}")
        if len(qs_raw)!=QUESTIONS_PER_EXPERT: issues.append(f"{eid}: questions must be exactly 100, got {len(qs_raw)}")
        for i,x in enumerate(ideas_raw):
            y,err=_validate_idea(eid,x,i)
            if err: issues.append(err)
            elif y: ideas.append(y)
        for i,x in enumerate(qs_raw):
            y,err=_validate_question(eid,x,i)
            if err: issues.append(err)
            elif y: qs.append(y)
        if len({_norm(x['proposal']) for x in ideas}) != len(ideas): issues.append(f"{eid}: ideas contain duplicate/normalized-duplicate proposals")
        if len({_norm(x['question']) for x in qs}) != len(qs): issues.append(f"{eid}: questions contain duplicate/normalized-duplicate wording")
        axes={_norm(x['axis']) for x in ideas if _norm(x['axis'])}
        fams={_norm(x['family']) for x in qs if _norm(x['family'])}
        if ideas and len(axes)<MIN_AXES: issues.append(f"{eid}: needs >=10 idea axes, got {len(axes)}")
        if qs and len(fams)<MIN_FAMILIES: issues.append(f"{eid}: needs >=10 question families, got {len(fams)}")
        normalized.append({"expert_id":eid,"ideas":ideas,"questions":qs,"idea_axes":sorted(axes),"question_families":sorted(fams)})
    return {"ok":not issues,"issues":issues,"experts":normalized,"expert_count":len(normalized)}


def _idea_packet(task,constraints,eid,batch,kind,variant="primary"):
    crit={x['idea_id']: x['proposal'] + (f" | why: {x['why']}" if x.get('why') else "") for x in batch}
    if variant=="reordered": crit=dict(reversed(list(crit.items())))
    return {
        "packet_id":_sid("jev",eid,kind,variant,*crit.keys()),"expert_id":eid,"kind":kind,"variant":variant,
        "candidate_ids":list(crit),"tool":"jev_choice",
        "packet":{"state":{"task":task,"constraints":constraints,"expert_id":eid,"candidates":crit},
                  "instructions":f"Choose the strongest {eid} idea for {kind}. Respect the frozen goal, feasibility, evidence, reversibility, beauty/quality where relevant, and risks. Jev is judgement, not evidence.",
                  "criteria":crit}
    }


def prepare_ideas(o):
    v=validate_harvest(o)
    if not v['ok']: return {"ok":False,"stage":"prepare-ideas","issues":v['issues']}
    task=str(o.get('task') or '').strip(); constraints=list(o.get('constraints') or [])
    if not task: return {"ok":False,"stage":"prepare-ideas","issues":["task is required"]}
    packets=[]
    for e in v['experts']:
        ideas=e['ideas']
        for i in range(0,IDEAS_PER_EXPERT,IDEA_BATCH_SIZE):
            batch=ideas[i:i+IDEA_BATCH_SIZE]
            packets.append(_idea_packet(task,constraints,e['expert_id'],batch,f"group-{i//10+1:02d}"))
    return {"ok":True,"stage":"idea-groups","task":task,"constraints":constraints,"experts":v['experts'],"packets":packets,"expected_group_calls":len(v['experts'])*10}


def _extract_choice(raw):
    if isinstance(raw,str): raw=json.loads(raw)
    if not isinstance(raw,dict): raise ValueError("Jev result must be object")
    sc=raw.get('structuredContent')
    if isinstance(sc,dict): raw=sc
    dec=((raw.get('answers') or {}).get('decision') if isinstance(raw.get('answers'),dict) else None) or raw.get('decision')
    if not isinstance(dec,dict) or dec.get('type')!='choice': raise ValueError("expected Jev choice result")
    return {"model":raw.get('model'),"choice":str(dec.get('choice')),"confidence":float(dec.get('confidence',0) or 0),"probabilities":{str(k):float(v) for k,v in (dec.get('probabilities') or {}).items()}}


def advance_ideas(o):
    p=o.get('prepared') or {}; results=o.get('results') or {}
    if not p.get('ok') or p.get('stage')!='idea-groups': raise ValueError('prepared must be prepare-ideas output')
    by_expert=defaultdict(list); judgements=[]; missing=[]
    for pkt in p.get('packets') or []:
        raw=results.get(pkt['packet_id'])
        if raw is None: missing.append(pkt['packet_id']); continue
        j=_extract_choice(raw); ids=pkt['candidate_ids']; choice=j['choice']
        if choice not in ids: raise ValueError(f"{pkt['packet_id']}: choice not in candidates")
        ranked=sorted(ids,key=lambda x:(-j['probabilities'].get(x,0),x))
        by_expert[pkt['expert_id']].append(choice)
        judgements.append({"packet_id":pkt['packet_id'],"expert_id":pkt['expert_id'],**j,"runner_up":ranked[1] if len(ranked)>1 else None})
    if missing: return {"ok":False,"stage":"advance-ideas","issues":[f"missing Jev result {x}" for x in missing]}
    ideas={x['idea_id']:x for e in p['experts'] for x in e['ideas']}
    finals=[]
    for eid,winners in sorted(by_expert.items()):
        if len(winners)!=10: raise ValueError(f"{eid}: expected 10 group winners, got {len(winners)}")
        batch=[ideas[i] for i in winners]
        finals.append(_idea_packet(p['task'],p.get('constraints') or [],eid,batch,'expert-final','primary'))
        finals.append(_idea_packet(p['task'],p.get('constraints') or [],eid,batch,'expert-final','reordered'))
    return {"ok":True,"stage":"expert-finals","task":p['task'],"constraints":p.get('constraints') or [],"experts":p['experts'],"group_judgements":judgements,"packets":finals,"expected_final_calls":len(by_expert)*2}


def prepare_questions(o):
    v=validate_harvest(o)
    if not v['ok']: return {"ok":False,"stage":"prepare-questions","issues":v['issues']}
    task=str(o.get('task') or '').strip(); constraints=list(o.get('constraints') or [])
    packets=[]
    for e in v['experts']:
        for q in e['questions']:
            state={"task":task,"constraints":constraints,"expert_id":e['expert_id'],"question_family":q['family'],"evidence":q.get('state')}
            packet={"state":state,"instructions":q['question']}
            if q['mode']=='choice': packet['criteria']=q['criteria']
            elif q['mode']=='score': packet['criteria']=q['criteria']
            else:
                if q.get('true_criteria') is not None: packet['true_criteria']=q['true_criteria']
                if q.get('false_criteria') is not None: packet['false_criteria']=q['false_criteria']
            packets.append({"packet_id":q['question_id'],"expert_id":e['expert_id'],"family":q['family'],"tool":"jev_"+q["mode"],"packet":packet})
    return {"ok":True,"stage":"question-queue","packets":packets,"expected_question_calls":len(v['experts'])*100}


def verify_expert_cycle(o):
    eid=str(o.get('expert_id') or '')
    harvest=o.get('harvest') or {}
    ideas=harvest.get('ideas') or []; qs=harvest.get('questions') or []
    issues=[]
    if len(ideas)!=100: issues.append(f"ideas {len(ideas)}/100")
    if len(qs)!=100: issues.append(f"questions {len(qs)}/100")
    group=o.get('group_results') or []
    finals=o.get('final_results') or []
    qresults=o.get('question_results') or []
    if len(group)!=10: issues.append(f"idea group Jev results {len(group)}/10")
    if len(finals)!=2: issues.append(f"expert-final Jev results {len(finals)}/2")
    stable=False; champion=None
    if len(finals)==2:
        try:
            a,b=map(_extract_choice,finals)
            stable=a['choice']==b['choice'] and bool(a['choice'])
            champion=a['choice'] if stable else None
            if not stable: issues.append("expert-final Jev stability failed")
        except Exception as e: issues.append(f"bad final Jev result: {e}")
    if len(qresults)!=100: issues.append(f"Jev question answers {len(qresults)}/100")
    return {"ok":not issues,"expert_id":eid,"quota_complete":not issues,"ideas_complete":len(ideas)==100,"questions_complete":len(qs)==100,"jev_idea_calls":len(group)+len(finals),"jev_question_calls":len(qresults),"stable":stable,"champion":champion,"issues":issues}


def verify_full(o):
    visual=bool(o.get('visual',True)); expected=expert_roster(visual)
    cycles=o.get('cycles') or []
    by={str(x.get('expert_id')):x for x in cycles if isinstance(x,dict) and x.get('expert_id')}
    missing=[e for e in expected if e not in by]
    incomplete=[]; total_calls=0
    for eid in expected:
        c=by.get(eid)
        if not c: continue
        total_calls += int(c.get('jev_idea_calls',0) or 0)+int(c.get('jev_question_calls',0) or 0)
        if c.get('quota_complete') is not True: incomplete.append(eid)
    blockers=list(o.get('blocking_objections') or [])
    stable=o.get('final_synthesis_stable') is True
    gates=o.get('deterministic_gates_passed') is True
    complete=not missing and not incomplete and not blockers and stable and gates
    return {"ok":complete,"full_pro_100x100_complete":complete,"expert_count_required":len(expected),"missing_experts":missing,"incomplete_experts":incomplete,"jev_calls_observed":total_calls,"blocking_objections":blockers,"final_synthesis_stable":stable,"deterministic_gates_passed":gates,"minimum_expert_cycle_calls_required":len(expected)*112,"note":"Cross-expert and final synthesis Jev calls are additional and should be recorded in the main Full Pro Receipt."}


def main(argv=None):
    argv=argv or sys.argv; cmd=argv[1] if len(argv)>1 else ''
    try:
        raw=sys.stdin.read().strip(); o=json.loads(raw) if raw else {}
        fn={
            'roster':roster_cmd,'validate-harvest':validate_harvest,'prepare-ideas':prepare_ideas,
            'advance-ideas':advance_ideas,'prepare-questions':prepare_questions,
            'verify-expert-cycle':verify_expert_cycle,'verify-full':verify_full,
        }.get(cmd)
        if not fn: raise ValueError('unknown command')
        out=fn(o)
    except Exception as e:
        out={"ok":False,"error":str(e)}
    print(json.dumps(out,ensure_ascii=False,indent=1,sort_keys=True))
    return 0 if out.get('ok') else 1

if __name__=='__main__': raise SystemExit(main())
