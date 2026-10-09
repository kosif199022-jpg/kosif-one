#!/usr/bin/env python3
"""Council-100 generator/router for KOSIF Think Pro 4.5."""
from __future__ import annotations
CHAMBERS=("evidence","strategy","risk","creativity","human","engineering","design","media","finance-audit","automation-agents")
PROBES={
 "evidence":["overclaim","fallacies","seal"],"strategy":["scenario","weighted_rank"],"risk":["secrets","pii","checkpoint"],
 "creativity":["prompt_parts","readability"],"human":["readability","touch_target"],"engineering":["complexity","retry_safe","git_class"],
 "design":["contrast","type_scale","touch_target"],"media":["ev100","beat","lufs_target"],"finance-audit":["vat","npv","benford"],
 "automation-agents":["budget","loop_detect","checkpoint"]}

def build_council():
    members=[]; caps=[]
    for ci,ch in enumerate(CHAMBERS,1):
        for i in range(1,11):
            pid=f"C{ci:02d}-P{i:02d}"; pcaps=[f"{ch}:capability:{i:02d}:{j:02d}" for j in range(1,21)]
            caps.extend(pcaps); members.append({"id":pid,"chamber":ch,"specialty":f"{ch} specialist {i}","capabilities":pcaps,"probes":PROBES[ch][:(i%3)+1],"ideas_required":100,"jev_questions_required":100})
    return {"version":"4.5.0","members":members,"chambers":list(CHAMBERS),"capabilities_total":len(caps),"capabilities_unique":len(set(caps)),"independence_rule":"100 personas sharing one underlying model are not 100 independent evidence sources."}

def select_members(task:str,mode:str='standard'):
    c=build_council()
    if mode in {'pro','full'}:
        chosen=c['members']; chambers=list(CHAMBERS); exhaustive=True
    else:
        chosen=[c['members'][0]]; chambers=['evidence']; exhaustive=False
    return {"mode":mode,"exhaustive":exhaustive,"members":[m['id'] for m in chosen],"member_count":len(chosen),"chambers":chambers,
            "idea_harvest":{"enabled":mode in {'pro','full'},"ideas_per_member":100 if mode in {'pro','full'} else 0,"jev_questions_per_member":100 if mode in {'pro','full'} else 0,"judge":"Jev 10x10 per-member tournament + 100 typed Jev answers"},
            "independence_note":"Council personas sharing one model/source count as one provenance source for evidence independence."}
