#!/usr/bin/env python3
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
SKILLS=HERE.parents[1]
sys.path.insert(0,str(HERE))
sys.path.insert(0,str(SKILLS/'kosif-runtime-orchestrator'/'scripts'))
import execution_engine as ee
import full_pro_runtime as rt

REQ='req-v511-bridge'

def harvest(eid):
    return {
      'observed':True,'request_id':REQ,'action_id':f'harvest:{eid}','expert_id':eid,'model':'host-agent-test','source':'host_chat_model',
      'ideas':[{'idea_id':f'{eid}-i{i:03d}','axis':f'axis-{i%10}','proposal':f'{eid} proposal {i}'} for i in range(100)],
      'questions':[{'question_id':f'{eid}-q{i:03d}','family':f'family-{i%10}','mode':'noul','question':f'{eid} question {i}'} for i in range(100)],
      'diversity_receipt':{'observed':True,'model':'diversity-test','method':'embedding+lexical','distinct_ideas':100,'distinct_questions':100,'max_idea_similarity':0.80,'max_question_similarity':0.80},
      'evidence_status':'not_required','evidence_refs':[]
    }

def result(dtype,choice=None):
    d={'type':dtype}
    if dtype=='choice': d.update({'choice':choice,'confidence':.9,'probabilities':{choice:.9}})
    elif dtype=='noul': d['noul']=.8
    else: d.update({'score':3,'confidence':.8})
    return {'structuredContent':{'model':'jev-bridge-test','answers':{'decision':d}}}

def receipt(a,res):
    return {'observed':True,'request_id':REQ,'action_id':a['action_id'],'expert_id':a['expert_id'],'result':res}

eng=ee.new_state(REQ,'image_gen',True,'duck fights dragon')
eid='M01'
ee.ingest(eng,harvest(eid))
for i in range(1,11):
    a=next(x for x in ee.next_actions(eng,300) if x['action_id']==f'group:{eid}:{i}')
    ee.ingest(eng,receipt(a,result('choice',sorted(a['criteria'])[0])))
fa=next(x for x in ee.next_actions(eng,300) if x['action_id']==f'final:{eid}:A')
fb=next(x for x in ee.next_actions(eng,300) if x['action_id']==f'final:{eid}:B')
ids={v['candidate_id'] for v in fa['closed_options'].values()} & {v['candidate_id'] for v in fb['closed_options'].values()}
win=sorted(ids)[0]
ee.ingest(eng,receipt(fa,result('choice',win)))
ee.ingest(eng,receipt(fb,result('choice',win)))
for a in list(ee.next_actions(eng,400)):
    if a['action_id'].startswith('question:'):
        ee.ingest(eng,receipt(a,result(a['kind'].replace('jev_',''))))
assert ee.status(eng)['experts_complete']==1

events=ee.drain_runtime_events(eng)
assert len(events)==1
runtime=rt.new_state(REQ,'image_gen',True)
out=rt.apply_event(runtime,events[0])
st=rt.status(runtime)
assert out['ok'] is True
assert st['experts_validated']==1, st
assert st['ideas_validated']==100 and st['questions_validated']==100
assert st['jev_calls_observed']==112
assert st['blockers'][0]=='experts_missing=166'
print('PASS: v5.2 Engine→Runtime bridge accepts one real-shaped 100×100 expert cycle; progress becomes 1/167 with 112 Jev receipts.')
