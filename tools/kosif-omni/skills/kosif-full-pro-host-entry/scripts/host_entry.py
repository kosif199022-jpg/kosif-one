"""Persistent pre-runtime request guard. Host must call this before tool routing.
This is NOT a hook into ChatGPT native tools; unobserved host calls are invisible.
"""
import json,re,sqlite3,uuid,sys,argparse,unicodedata,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
for name in ('kosif-runtime-orchestrator','kosif-full-pro-execution-engine','kosif-secure-executor'):
    sys.path.insert(0,str(ROOT/name/'scripts'))
import full_pro_runtime as rt
import execution_engine as ee
from secure_executor import verify_dispatch
TRIGGERS=('pro mode','full pro mode','full pro','full power','برو مود','الوضع الكامل','استخدم البرو','استخدم كل القدرات','شغل كل الخبراء','activate all experts','maximum capabilities','full capabilities','maximum/full capabilities')
def detect_mode(text,selected=False):
    text=' '.join(unicodedata.normalize('NFKC',text).casefold().split())
    return 'FULL_PRO_REQUIRED' if selected or any(re.search(r'(?<!\w)'+re.escape(t)+r'(?!\w)',text) for t in TRIGGERS) else 'STANDARD'
class EntryGuard:
    def __init__(self,path):
        self.path=str(path)
        with self.db() as db:
            db.execute('CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, policy TEXT NOT NULL, body TEXT NOT NULL)')
    def db(self): return sqlite3.connect(self.path,timeout=30)
    def get(self,rid):
        with self.db() as db: row=db.execute('SELECT body FROM requests WHERE id=?',(rid,)).fetchone()
        if not row: raise ValueError('UNKNOWN_REQUEST: enter before routing')
        return json.loads(row[0])
    def enter(self,text,executor,visual=False,selected=False):
        rid=str(uuid.uuid4()); policy=detect_mode(text,selected)
        state={'request_id':rid,'execution_policy':policy,'subject':text,'executor':executor,'visual':visual,'runtime':None,'engine':None,'audit':[{'event':'REQUEST_REGISTERED'}],'bypass':False}
        with self.db() as db: db.execute('INSERT INTO requests VALUES (?,?,?)',(rid,policy,json.dumps(state)))
        return state
    def _mutate(self,rid,fn):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            row=db.execute('SELECT policy,body FROM requests WHERE id=?',(rid,)).fetchone()
            if not row: raise ValueError('UNKNOWN_REQUEST')
            state=json.loads(row[1]); result=fn(state)
            if state['execution_policy']!=row[0]: raise ValueError('POLICY_FROZEN')
            db.execute('UPDATE requests SET body=? WHERE id=?',(json.dumps(state),rid))
            return result
    def start(self,rid):
        def start(s):
            if s['bypass']: raise ValueError('BYPASS_DETECTED: new request required')
            if s['runtime'] is None:
                s['runtime']=rt.new_state(rid,s['executor'],s['visual'])
                s['engine']=ee.new_state(rid,s['executor'],s['visual'],s['subject'])
                s['runtime']['harvesting_started']=True
                s['audit'].append({'event':'RUNTIME_AND_ENGINE_STARTED'})
            return {'request_id':rid,'runtime':rt.status(s['runtime']),'engine':ee.status(s['engine']),'next':ee.next_actions(s['engine'],1),'image_executor_called':False}
        return self._mutate(rid,start)
    def route(self,rid,proposed_tool,read_only=False):
        s=self.get(rid)
        if s['bypass']: return {'allow':False,'reason':'BYPASS_DETECTED'}
        if s['execution_policy']!='FULL_PRO_REQUIRED': return {'allow':True,'route':proposed_tool}
        if s['runtime'] is None: return {'allow':False,'route':'kosif_full_pro_entry','reason':'NO_RUNTIME'}
        # read_only is set by the MCP layer from the tool registry, never by the caller's claim.
        # Evidence tools may run during harvesting; they never count as execution or completion.
        if read_only: return {'allow':True,'route':proposed_tool,'reason':'READ_ONLY_EVIDENCE','counts_as_execution':False}
        a=s['runtime'].get('authorization') or {}
        if not a.get('authorization_ready') or rt.blockers(s['runtime']): return {'allow':False,'reason':'NO_AUTHORIZATION'}
        if proposed_tool!='kosif_secure_executor': return {'allow':False,'route':'kosif_secure_executor','reason':'DIRECT_EXECUTOR_FORBIDDEN'}
        try:
            t=a.get('secure_executor_ticket') or {}
            verify_dispatch(a,t,secret=os.environ.get("KOSIF_SECURE_EXECUTOR_SECRET"))
            if rt.state_digest(s["runtime"])!=a.get("state_digest") or rt.digest(s["runtime"].get("candidate"))!=a.get("candidate_digest"): raise ValueError("AUTHORIZATION_INVALID")
        except ValueError as e: return {'allow':False,'reason':str(e)}
        return {'allow':True,'route':'kosif_secure_executor'}
    def observe_execution(self,rid,tool,receipt,read_only=False):
        def observe(s):
            if read_only and not s['bypass'] and s['runtime'] is not None:
                s['audit'].append({'event':'EVIDENCE_TOOL_OBSERVED','tool':tool,'receipt_digest':rt.digest(receipt)})
                return {'accepted':True,'phase':'EVIDENCE','counts_as_execution':False,'complete':False}
            if s['execution_policy']=='FULL_PRO_REQUIRED' and (tool!='kosif_secure_executor' or s['runtime'] is None or not (s['runtime'].get('authorization') or {}).get('authorization_ready')):
                s['bypass']=True; s['audit'].append({'event':'BYPASS_DETECTED','tool':tool,'receipt_digest':rt.digest(receipt)})
                if s['runtime']: rt._mark_bypass(s['runtime'],receipt,'host entry guard observed direct execution')
                return {'accepted':False,'phase':'BYPASS_DETECTED','complete':False}
            return {'accepted':False,'reason':'submit receipt through runtime validation; path name is not evidence'}
        return self._mutate(rid,observe)
    def apply(self,rid,event):
        def apply(s):
            if s['bypass'] or not s['runtime']: return {'ok':False,'reason':'entry blocked'}
            try: rt.apply_event(s['runtime'],event)
            except ValueError as e:
                if s['runtime'].get('bypass_detected'): s['bypass']=True
                return {'ok':False,'reason':str(e)}
            return {'ok':True,'runtime':rt.status(s['runtime'])}
        return self._mutate(rid,apply)
    def authorize(self,rid):
        def authorize(s):
            if s['bypass'] or not s['runtime']: return {'ok':False,'authorization_ready':False}
            return rt.authorize(s['runtime'])
        return self._mutate(rid,authorize)
    def ingest(self,rid,receipt):
        def ingest(s):
            if s['bypass'] or not s['engine']: return {'ok':False,'reason':'entry blocked'}
            try: ee.ingest(s['engine'],receipt)
            except ValueError as e: return {'ok':False,'reason':str(e)}
            for event in ee.drain_runtime_events(s['engine']): rt.apply_event(s['runtime'],event)
            return {'ok':True,'runtime':rt.status(s['runtime']),'engine':ee.status(s['engine'])}
        return self._mutate(rid,ingest)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('db');ap.add_argument('command',choices=['enter','start','route','observe','status','ingest','apply','authorize']);ap.add_argument('--request-id');ap.add_argument('--text',default='');ap.add_argument('--executor',default='image');ap.add_argument('--tool',default='image_gen');ap.add_argument('--visual',action='store_true');ap.add_argument('--selected',action='store_true');ap.add_argument('--read-only',action='store_true');a=ap.parse_args();g=EntryGuard(a.db)
    if a.command=='enter': out=g.enter(a.text,a.executor,a.visual,a.selected)
    elif a.command=='start':out=g.start(a.request_id)
    elif a.command=='route':out=g.route(a.request_id,a.tool,a.read_only)
    elif a.command=='observe':out=g.observe_execution(a.request_id,a.tool,json.load(sys.stdin),a.read_only)
    elif a.command=='ingest':out=g.ingest(a.request_id,json.load(sys.stdin))
    elif a.command=='apply':out=g.apply(a.request_id,json.load(sys.stdin))
    elif a.command=='authorize':out=g.authorize(a.request_id)
    else:out=g.get(a.request_id)
    print(json.dumps(out,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
