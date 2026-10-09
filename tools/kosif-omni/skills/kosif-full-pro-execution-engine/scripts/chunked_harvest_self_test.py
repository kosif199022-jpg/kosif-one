#!/usr/bin/env python3
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import execution_engine as ee
REQ='req-chunked-harvest'

def idea_receipt(a):
    b=a['batch_index']; start=(b-1)*10
    return {
      'observed':True,'request_id':REQ,'action_id':a['action_id'],'expert_id':'M01','source':'host_chat_model','model':'host-batch-test',
      'ideas':[{'idea_id':f'M01-i{i:03d}','axis':a['axis_hint'],'proposal':f'{a["axis_hint"]} distinct proposal {i} with semantic detail {b}-{i}'} for i in range(start,start+10)],
      'evidence_status':'not_required','evidence_refs':[]
    }

def question_receipt(a):
    b=a['batch_index']; start=(b-1)*10
    return {
      'observed':True,'request_id':REQ,'action_id':a['action_id'],'expert_id':'M01','source':'host_chat_model','model':'host-batch-test',
      'questions':[{'question_id':f'M01-q{i:03d}','family':a['family_hint'],'mode':'noul','question':f'Does {a["family_hint"]} condition {i} remain satisfied in the scene?'} for i in range(start,start+10)],
      'evidence_status':'not_required','evidence_refs':[]
    }

s=ee.new_state(REQ,'image_gen',True,'duck fights dragon')
actions=ee.next_actions(s,50)
bad=idea_receipt(next(a for a in actions if a['kind']=='expert_idea_batch'))
bad['source']='kosif_think_council'
try:
    ee.ingest(s,bad); raise AssertionError('council source must be rejected for raw harvest')
except ee.EngineError as e:
    assert 'source' in str(e)
assert len(actions)==20, len(actions)
assert sum(a['kind']=='expert_idea_batch' for a in actions)==10
assert sum(a['kind']=='expert_question_batch' for a in actions)==10
for a in actions[:-1]:
    ee.ingest(s, idea_receipt(a) if a['kind']=='expert_idea_batch' else question_receipt(a))
assert s['experts']['M01']['harvest'] is None
st=ee.status(s)
assert st['ideas_harvested'] in (90,100) and st['questions_harvested'] in (90,100), st
last=actions[-1]
ee.ingest(s, idea_receipt(last) if last['kind']=='expert_idea_batch' else question_receipt(last))
h=s['experts']['M01']['harvest']
assert h is not None
assert len(h['ideas'])==100 and len(h['questions'])==100
assert h['diversity_receipt']['observed'] is True
assert h['diversity_receipt']['request_id']==REQ and h['diversity_receipt']['expert_id']=='M01'
assert h['diversity_receipt']['model'].startswith('local-diversity')
st=ee.status(s)
assert st['experts_harvested']==1 and st['ideas_harvested']==100 and st['questions_harvested']==100
post=ee.next_actions(s,300)
assert sum(x['action_id'].startswith('group:M01:') for x in post)==10
assert sum(x['action_id'].startswith('question:M01:') for x in post)==100
print('PASS: chunked 10x10 idea + 10x10 question harvest builds one validated 100x100 expert harvest before Jev judging.')
