#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re
from typing import Any

INJECTION_PATTERNS=[
    r"ignore\s+(all\s+)?previous", r"system\s+prompt", r"developer\s+message",
    r"assistant\s+must", r"you\s+must\s+obey", r"reveal\s+.*prompt", r"do\s+not\s+follow\s+the\s+user"
]

def digest(obj:Any)->str:
    return hashlib.sha256(json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(",",":"),default=str).encode()).hexdigest()

def taint_scan(text:str)->dict:
    hits=[p for p in INJECTION_PATTERNS if re.search(p,text or "",re.I)]
    return {"instruction_taint":bool(hits),"patterns":hits,"policy":"data_only"}

def new_registry()->dict:
    return {"version":"5.0.0","sources":{},"hash_index":{},"chunks":{},"aliases":{},"events":[]}

def register_source(reg:dict,src:dict)->dict:
    required=["source_id","drive_file_id","title","mime_type","content_sha256","permission_scope","domain_tags"]
    for k in required:
        if k not in src or src[k] in (None,"",[]): raise ValueError(f"missing source field {k}")
    sid=str(src["source_id"]); sha=str(src["content_sha256"]).lower()
    if not re.fullmatch(r"[0-9a-f]{64}",sha): raise ValueError("content_sha256 must be 64 hex chars")
    if sid in reg["sources"]: raise ValueError("source_id already exists")
    alias_of=reg["hash_index"].get(sha)
    record={
        "source_id":sid,"drive_file_id":str(src["drive_file_id"]),"title":str(src["title"]),"mime_type":str(src["mime_type"]),
        "content_sha256":sha,"revision_id":src.get("revision_id"),"modified_time":src.get("modified_time"),
        "permission_scope":str(src["permission_scope"]),"retrieval_allowed":bool(src.get("retrieval_allowed",True)),
        "domain_tags":sorted({str(x).strip().lower() for x in src["domain_tags"] if str(x).strip()}),
        "parser_version":src.get("parser_version"),"index_version":src.get("index_version"),"status":"active","alias_of":alias_of,
        "semantic_fingerprint":src.get("semantic_fingerprint")
    }
    reg["sources"][sid]=record
    if alias_of: reg["aliases"][sid]=alias_of
    else: reg["hash_index"][sha]=sid
    reg["events"].append({"type":"source_registered","source_id":sid,"digest":digest(record)})
    return record

def revoke_source(reg:dict,sid:str,reason:str)->None:
    s=reg["sources"].get(sid)
    if not s: raise ValueError("unknown source")
    s["status"]="tombstoned"; s["retrieval_allowed"]=False; s["revocation_reason"]=reason
    reg["events"].append({"type":"source_revoked","source_id":sid,"reason":reason})

def register_chunk(reg:dict,chunk:dict)->dict:
    for k in ["chunk_id","source_id","text_hash"]:
        if not chunk.get(k): raise ValueError(f"missing chunk field {k}")
    cid=str(chunk["chunk_id"]); sid=str(chunk["source_id"])
    if cid in reg["chunks"]: raise ValueError("chunk_id already exists")
    src=reg["sources"].get(sid)
    if not src: raise ValueError("unknown source")
    if src["status"]!="active": raise ValueError("cannot add chunk to inactive source")
    scan=taint_scan(str(chunk.get("sample_text") or ""))
    rec={
        "chunk_id":cid,"source_id":sid,"page":chunk.get("page"),"section":chunk.get("section"),"heading_path":chunk.get("heading_path") or [],
        "text_hash":str(chunk["text_hash"]),"instruction_taint":scan["instruction_taint"],"taint_patterns":scan["patterns"],
        "embedding_version":chunk.get("embedding_version"),"lexical_index_version":chunk.get("lexical_index_version")
    }
    reg["chunks"][cid]=rec; reg["events"].append({"type":"chunk_registered","chunk_id":cid,"digest":digest(rec)})
    return rec

def verify_evidence_pack(reg:dict,pack:dict)->dict:
    refs=pack.get("evidence_refs") or []
    if not refs: raise ValueError("evidence pack must contain refs")
    verified=[]; tainted=0
    for ref in refs:
        sid=str(ref.get("source_id") or ""); cid=str(ref.get("chunk_id") or "")
        src=reg["sources"].get(sid); ch=reg["chunks"].get(cid)
        if not src or not ch or ch["source_id"]!=sid: raise ValueError("invalid source/chunk reference")
        if src["status"]!="active" or src["retrieval_allowed"] is not True: raise ValueError(f"source {sid} is not authorized for retrieval")
        if ref.get("content_sha256") and ref["content_sha256"]!=src["content_sha256"]: raise ValueError("source hash mismatch")
        if ref.get("revision_id") is not None and ref.get("revision_id")!=src.get("revision_id"): raise ValueError("source revision mismatch")
        if ref.get("text_hash") and ref["text_hash"]!=ch["text_hash"]: raise ValueError("chunk hash mismatch")
        if ch["instruction_taint"]: tainted+=1
        verified.append({"source_id":sid,"chunk_id":cid,"page":ch.get("page"),"section":ch.get("section"),"instruction_taint":ch["instruction_taint"]})
    return {"ok":True,"verified_refs":verified,"tainted_chunks":tainted,"policy":"all source text remains data_only","pack_digest":digest(pack)}

def source_snapshot_digest(reg:dict)->str:
    active={sid:{k:v for k,v in s.items() if k not in {"title"}} for sid,s in sorted(reg["sources"].items()) if s["status"]=="active" and s["retrieval_allowed"]}
    chunks={cid:c for cid,c in sorted(reg["chunks"].items()) if c["source_id"] in active}
    return digest({"sources":active,"chunks":chunks})
