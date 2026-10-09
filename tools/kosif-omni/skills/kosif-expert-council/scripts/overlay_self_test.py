from expert_method_overlay import build_overlay, stats
rows=build_overlay(); s=stats(rows)
assert s['count']==500
assert s['unique_source_experts']==500
assert s['domains_covered']>=51
assert s['psych_states_covered']>=20
assert s['powers_covered']>=40
assert s['elite_count']==40
for r in rows:
    assert r['psych_blind_spot'] and r['psych_compensation']
    assert len(r['powers'])>=2
print('PASS',s)
