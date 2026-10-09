#!/usr/bin/env python3
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import full_pro_runtime as rt

REQ='req-secure-runtime-test'

def ready_state():
    s=rt.new_state(REQ,'image_gen',True)
    # Unit-test authorization mechanics without replaying the entire 167-expert suite.
    s['expert_cycles']={eid:{'cycle_digest':f'd-{i}'} for i,eid in enumerate(s['expected_experts'])}
    s['cross_expert']={'digest':'cross'}
    s['einstein']={'digest':'ein','stage_count':7}
    s['final_stability']={'digest':'final','winner':'syn-A'}
    s['gates']={'digest':'gates'}
    s['candidate_id']='syn-A'
    s['candidate']={'scene':'duck fights dragon'}
    s['candidate_digest']=rt.digest(s['candidate'])
    return s

s=ready_state()
a=rt.authorize(s)
assert a['authorization_ready'] is True
assert a['secure_executor_required'] is True
assert a['secure_executor_ticket']['ticket_id']
assert a['secure_executor_ticket']['consumed'] is False

# Direct host-native receipt must be rejected and poison the request as a bypass.
direct={
 'event_id':'evt-direct','request_id':REQ,'type':'executor_receipt','payload':{
   'observed':True,'request_id':REQ,'executor':'image_gen','candidate_digest':s['candidate_digest'],
   'execution_lock':a['execution_lock'],'result_digest':'a'*64,
   'execution_path':'host_native_direct'
 }}
try:
    rt.apply_event(s,direct)
    raise AssertionError('direct host-native execution must be rejected')
except rt.RuntimeValidationError as e:
    assert 'secure executor' in str(e).lower() or 'bypass' in str(e).lower()
assert s['bypass_detected'] is True
assert 'executor_bypass_detected' in rt.blockers(s)

# A bypassed request cannot be re-authorized/completed.
a2=rt.authorize(s)
assert a2['authorization_ready'] is False
assert any('bypass' in x for x in a2['issues'])

# Fresh request: secure executor receipt succeeds exactly once.
s=ready_state(); a=rt.authorize(s); t=a['secure_executor_ticket']
secure={
 'event_id':'evt-secure','request_id':REQ,'type':'executor_receipt','payload':{
   'observed':True,'request_id':REQ,'executor':'image_gen','candidate_digest':s['candidate_digest'],
   'execution_lock':a['execution_lock'],'result_digest':'b'*64,
   'execution_path':'kosif_secure_executor','secure_ticket_id':t['ticket_id'],
   'secure_authorization_digest':t['authorization_digest'],'secure_executor_verified':True
 }}
rt.apply_event(s,secure)
assert s['executor_receipt']['execution_path']=='kosif_secure_executor'
assert s['secure_executor_ticket']['consumed'] is True

# Re-authorization after an accepted execution must be blocked.
after_exec=rt.authorize(s)
assert after_exec['authorization_ready'] is False
assert any('executor_already_recorded' in x for x in after_exec['issues'])

# Reuse of the one-time ticket under a different event is rejected.
secure2={**secure,'event_id':'evt-secure-replay'}
try:
    rt.apply_event(s,secure2)
    raise AssertionError('one-time secure ticket reuse must fail')
except rt.RuntimeValidationError as e:
    assert 'consumed' in str(e).lower() or 'already' in str(e).lower()

print('PASS: runtime rejects host-native bypass, poisons bypassed requests, and accepts one-time secure executor receipts only.')
