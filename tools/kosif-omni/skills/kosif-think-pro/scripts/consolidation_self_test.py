#!/usr/bin/env python3
import json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[3]
reg_path=pathlib.Path(__file__).resolve().parents[1]/'references'/'canonical-source-registry-v10.json'
reg=json.loads(reg_path.read_text())
errors=[]
ids=[]
for key in ('canonical_source','mobile_front_door','canonical_provider'):
    pid=reg[key]['plugin_id']; ids.append(pid)
for item in reg['specialist_providers']:
    ids.append(item['plugin_id'])
legacy=list(reg['merged_legacy_plugins'])
if len(ids)!=len(set(ids)): errors.append('duplicate active plugin ownership id')
if set(ids)&set(legacy): errors.append('active/legacy overlap')
if reg['mobile_front_door'].get('mcp_bundled') is not False: errors.append('mobile front door must be MCP-free')
inv=reg.get('invariants',{})
for k in ('single_canonical_source','single_mobile_front_door','mobile_front_door_must_be_mcp_free','specialist_provider_endpoints_must_not_be_cloned','source_capability_is_not_host_exposure'):
    if inv.get(k) is not True: errors.append(f'invariant false: {k}')
expected_legacy=10
if len(legacy)!=expected_legacy: errors.append(f'legacy count {len(legacy)} != {expected_legacy}')
if errors:
    print('FAIL: '+ '; '.join(errors)); sys.exit(1)
print(json.dumps({
    'ok':True,
    'canonical_source':reg['canonical_source']['plugin_id'],
    'mobile_front_door':reg['mobile_front_door']['plugin_id'],
    'canonical_provider':reg['canonical_provider']['plugin_id'],
    'specialist_providers':len(reg['specialist_providers']),
    'merged_legacy_plugins':len(legacy),
    'active_ids_unique':True,
    'active_legacy_overlap':False,
    'mobile_mcp_free_required':True
},indent=2))
