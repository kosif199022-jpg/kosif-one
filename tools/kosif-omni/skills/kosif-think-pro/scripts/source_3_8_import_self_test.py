import json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[3]
apps=json.loads((ROOT/'.app.json').read_text())['apps']
reg=json.loads((ROOT/'skills/kosif-think-pro/references/canonical-source-registry-v10.json').read_text())
errors=[]
if len(apps)!=72: errors.append(f'app_count={len(apps)}')
if len(set(apps))!=len(apps): errors.append('duplicate_app_keys')
if not all(v.get('optional') is True for v in apps.values()): errors.append('non_optional_app')
if reg['canonical_source']['plugin_id']!='plugins_6abd29b907ac8191a457bce773dc7515': errors.append('wrong_canonical_source')
imp=reg.get('imports',[{}])[0]
if imp.get('plugin_id')!='plugins_6abcdcbe06f08191938116ee7dbf94b3': errors.append('legacy_source_not_recorded')
if '72_app_mesh' not in imp.get('imported',[]): errors.append('app_mesh_not_recorded')
cap=(ROOT/'skills/kosif-cognitive-core/references/source-thinkpro-3.8.1-capability-import.md').read_text()
for term in ['Value of Information','Claim lifecycle','Causal ladder','Robustness perturbation','Common-mode','Objective integrity','Durable missions','Verification/debugging']:
    if term.lower() not in cap.lower(): errors.append('missing_capability:'+term)
router=(ROOT/'skills/kosif-source-router/references/imported-provider-contracts-v10.3.md').read_text()
for term in ['Browser / Jev','Computer','Engineering','Release','Voice','WhatsApp','App mesh']:
    if term not in router: errors.append('missing_provider_contract:'+term)
print(json.dumps({'ok':not errors,'app_count':len(apps),'errors':errors},ensure_ascii=False))
sys.exit(1 if errors else 0)
