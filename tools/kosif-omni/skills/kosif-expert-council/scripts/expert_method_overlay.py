from __future__ import annotations
import json, os, sys
from collections import Counter, defaultdict

HERE=os.path.dirname(__file__)
sys.path.insert(0,HERE)
import expert_council as ec

TARGET=500

def build_overlay():
    council=ec.build_council()
    elite=list(council.elite.values()) if isinstance(council.elite,dict) else list(council.elite)
    scholars=list(council.scholars)
    by_domain=defaultdict(list)
    for e in scholars:
        domain=e.domains[0] if e.domains else 'unknown'
        by_domain[domain].append(e)
    for v in by_domain.values():
        v.sort(key=lambda e:e.id)
    domains=sorted(by_domain)
    chosen=list(elite)
    for d in domains:
        chosen.extend(by_domain[d][:9])
    # 40 + 51*9 = 499. Add a deterministic tenth scholar from the first domain.
    if len(chosen)<TARGET:
        for d in domains:
            for e in by_domain[d][9:]:
                if e.id not in {x.id for x in chosen}:
                    chosen.append(e)
                    break
            if len(chosen)>=TARGET:
                break
    if len(chosen)!=TARGET:
        raise RuntimeError(f'expected {TARGET}, got {len(chosen)}')
    if len({e.id for e in chosen})!=TARGET:
        raise RuntimeError('duplicate expert ids in overlay')
    rows=[]
    for slot,e in enumerate(chosen,1):
        rows.append({
            'slot':f'C{slot:03d}',
            'source_expert_id':e.id,
            'name':e.name,
            'tier':e.tier,
            'role':e.role,
            'domains':list(e.domains),
            'school':getattr(e.school,'key',None) if e.school else None,
            'psych_state':e.psych.key,
            'psych_strength':e.psych.strength,
            'psych_blind_spot':e.psych.blind_spot,
            'psych_compensation':e.psych.compensation,
            'powers':[p.key for p in e.powers],
            'power_protocols':{p.key:list(p.protocol) for p in e.powers},
            'mental_models':list(e.mental_models),
            'method':list(e.method),
            'questions':list(e.questions),
            'limits':list(e.limits),
        })
    return rows

def stats(rows):
    return {
        'count':len(rows),
        'unique_source_experts':len({r['source_expert_id'] for r in rows}),
        'domains_covered':len({d for r in rows for d in r['domains']}),
        'psych_states_covered':len({r['psych_state'] for r in rows}),
        'powers_covered':len({p for r in rows for p in r['powers']}),
        'schools_covered':len({r['school'] for r in rows if r['school']}),
        'elite_count':sum(r['tier']=='elite' for r in rows),
    }

if __name__=='__main__':
    rows=build_overlay()
    payload={'schema':'a1990-expert-cognitive-overlay-v1','stats':stats(rows),'experts':rows}
    print(json.dumps(payload,ensure_ascii=False,indent=2))
