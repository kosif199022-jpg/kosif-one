"""Verified dispatch and durable, atomic one-use provider boundary.
Deploy only on a trusted backend; callers must not own its DB, secret or callback.
No provider credentials or live endpoint are installed by this package.
"""
import hashlib,hmac,json,time,sqlite3
class SecureExecutorError(ValueError): pass
def digest(obj):
    return hashlib.sha256(json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
BINDING=('request_id','executor','candidate_digest','state_digest','execution_lock','ticket_id','nonce','issued_at','expires_at')
def verify_dispatch(authorization,request,*,secret=None,require_hard_enforcement=False,now=None):
    t=authorization.get('secure_executor_ticket') or {}; now=time.time() if now is None else now
    if authorization.get('authorization_ready') is not True: raise SecureExecutorError('authorization not ready')
    if t.get('consumed'): raise SecureExecutorError('REPLAY_REJECTED')
    if any(k not in t or t[k] in (None,'') for k in BINDING): raise SecureExecutorError('incomplete ticket')
    if not all(type(t[k]) in (int,float) for k in ('issued_at','expires_at')): raise SecureExecutorError('invalid ticket time')
    if not t['issued_at']<=now<t['expires_at'] or not 0<t['expires_at']-t['issued_at']<=300: raise SecureExecutorError('EXPIRED_TICKET or invalid lifetime')
    for k in BINDING:
        if request.get(k)!=t[k]: raise SecureExecutorError(k+' mismatch')
    for k in BINDING[:5]:
        if authorization.get(k)!=t[k]: raise SecureExecutorError('authorization '+k+' mismatch')
    ad=digest({k:t[k] for k in BINDING})
    if ad!=t.get('authorization_digest'): raise SecureExecutorError('authorization digest mismatch')
    mode=t.get('signature_mode')
    if mode=='hmac-sha256':
        if not secret or not hmac.compare_digest(hmac.new(secret.encode(),ad.encode(),hashlib.sha256).hexdigest(),t.get('signature','')): raise SecureExecutorError('signature mismatch')
    elif mode!='workflow-binding' or require_hard_enforcement: raise SecureExecutorError('signed backend ticket required')
    # A signature alone never proves hard enforcement has been deployed.
    return {'ok':True,'hard_enforcement':False,'signature_verified':mode=='hmac-sha256','dispatch':{k:t[k] for k in BINDING}}

class SecureExecutor:
    def __init__(self,db_path,secret,load_current_runtime,providers):
        if not secret or len(secret)<32: raise SecureExecutorError('backend secret must be at least 32 characters')
        self.db_path=db_path; self.secret=secret; self.load_current_runtime=load_current_runtime; self.providers=providers
        with sqlite3.connect(db_path) as db:
            db.execute('CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, nonce TEXT UNIQUE, status TEXT, receipt TEXT)')
    def execute(self,authorization,request,candidate):
        verified=verify_dispatch(authorization,request,secret=self.secret,require_hard_enforcement=True)
        current=self.load_current_runtime(request['request_id'])
        if current.get('bypass_detected') or current.get('authorization_invalid') or current.get('executor_receipt'): raise SecureExecutorError('runtime execution blocked')
        if current.get('authorization')!={k:v for k,v in authorization.items() if k not in ('ok','verdict')}: raise SecureExecutorError('stale or revoked authorization')
        if digest(candidate)!=request['candidate_digest'] or digest(current.get('candidate'))!=request['candidate_digest']: raise SecureExecutorError('candidate_digest mismatch')
        # Server-side recomputation; never trust caller-provided state digest.
        import sys
        from pathlib import Path
        sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'kosif-runtime-orchestrator'/'scripts'))
        import full_pro_runtime as rt
        if rt.blockers(current) or rt.state_digest(current)!=request['state_digest']: raise SecureExecutorError('runtime gates or state digest mismatch')
        provider=self.providers.get(request['executor'])
        if not provider: raise SecureExecutorError('PROVIDER_UNAVAILABLE')
        with sqlite3.connect(self.db_path,timeout=30) as db:
            try: db.execute('INSERT INTO tickets VALUES (?,?,?,NULL)',(request['ticket_id'],request['nonce'],'RESERVED'))
            except sqlite3.IntegrityError: raise SecureExecutorError('REPLAY_REJECTED')
        # Reserve before the side effect. A crash/ambiguous response burns the ticket.
        try:
            result=provider(candidate,idempotency_key=request['ticket_id'])
            if not isinstance(result,dict) or not result.get('provider_receipt_id'): raise SecureExecutorError('missing provider receipt')
            receipt={'observed':True,**{k:request[k] for k in BINDING[:5]},'execution_path':'kosif_secure_executor','secure_executor_verified':True,'secure_ticket_id':request['ticket_id'],'secure_authorization_digest':authorization['secure_executor_ticket']['authorization_digest'],'result_digest':digest(result),'provider_receipt_id':result['provider_receipt_id']}
            receipt['receipt_signature']=hmac.new(self.secret.encode(),digest(receipt).encode(),hashlib.sha256).hexdigest()
            with sqlite3.connect(self.db_path) as db: db.execute('UPDATE tickets SET status=?,receipt=? WHERE id=?',('CONSUMED',json.dumps(receipt),request['ticket_id']))
            return receipt
        except Exception:
            with sqlite3.connect(self.db_path) as db: db.execute('UPDATE tickets SET status=? WHERE id=?',('FAILED_OR_UNKNOWN',request['ticket_id']))
            raise
