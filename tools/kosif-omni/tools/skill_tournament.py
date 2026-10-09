#!/usr/bin/env python3
"""KOSIF staged skill tournament over a content-classified Atlas catalog.

Stage 0 scores every catalog row against the user's task. Stage 1 keeps Top 100,
Stage 2 keeps Top 30 with duplicate/domain diversity control, and Stage 3 runs
optional Jev group tournaments before returning a complementary Top 5 bundle.
No skill code is executed.
"""
from __future__ import annotations

import argparse, json, os, re, urllib.request
from collections import Counter
from pathlib import Path

AR = str.maketrans({"أ":"ا","إ":"ا","آ":"ا","ٱ":"ا","ى":"ي","ة":"ه"})
STOP = set("the a an and or of to for in on with by from at as is are be this that it into your my our please make create build write use using need want help me i we can how what".split())
SYN = {
    "image":{"image_design","presentation"}, "photo":{"image_design"}, "design":{"image_design","web_frontend","presentation"},
    "video":{"video_motion"}, "motion":{"video_motion"}, "audio":{"audio_voice"}, "excel":{"spreadsheets_office"},
    "accounting":{"finance_accounting"}, "audit":{"finance_accounting"}, "finance":{"finance_accounting"},
    "code":{"programming"}, "programming":{"programming"}, "web":{"web_frontend"}, "database":{"database_data"},
    "research":{"research_science"}, "marketing":{"marketing_seo"}, "seo":{"marketing_seo"}, "legal":{"legal_compliance"},
    "security":{"security"}, "ai":{"ai_ml"}, "llm":{"ai_ml"}, "automation":{"automation_agents"}, "agent":{"automation_agents"},
    "pdf":{"pdf_documents"}, "slides":{"presentation"}, "presentation":{"presentation"}, "email":{"communication"},
    "صوره":{"image_design"}, "صور":{"image_design"}, "تصميم":{"image_design"}, "فيديو":{"video_motion"}, "مونتاج":{"video_motion"},
    "اكسل":{"spreadsheets_office"}, "محاسبه":{"finance_accounting"}, "مراجعه":{"finance_accounting"}, "برمجه":{"programming"},
    "بحث":{"research_science"}, "تسويق":{"marketing_seo"}, "امن":{"security"}, "وكيل":{"automation_agents"}, "وكلاء":{"automation_agents"},
}

def norm(s):
    s = str(s).lower().translate(AR)
    s = re.sub(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]", "", s)
    return re.sub(r"\s+", " ", s).strip()

def toks(s):
    return {x for x in re.findall(r"[a-z0-9+#._-]{2,}|[\u0600-\u06ff]{2,}", norm(s)) if x not in STOP}

def task_domains(task):
    t = toks(task)
    out = Counter()
    for x in t:
        for d in SYN.get(x, ()):
            out[d] += 1
    return out

def score_row(task_tokens, domains, r):
    text = norm(" ".join([r.get("name",""), r.get("description","")]))
    rt = toks(text)
    exact = len(task_tokens & rt)
    partial = sum(1 for q in task_tokens if len(q) >= 4 and q in text and q not in rt)
    row_domains = {x.get("domain"): float(x.get("relative", 0)) for x in r.get("domains", [])}
    dscore = sum(w * row_domains.get(d, 0) * 6.0 for d, w in domains.items())
    conf = float(r.get("confidence", 0))
    ambiguity = -1.5 if r.get("ambiguous") else 0
    return exact * 5.0 + partial * 1.5 + dscore + conf * 1.5 + ambiguity

def dedupe_diverse(rows, n):
    out, seen = [], set()
    domain_counts = Counter()
    for r in rows:
        key = re.sub(r"[^a-z0-9]+", "", norm(r.get("name","")))[:80]
        if key and key in seen:
            continue
        d = r.get("primary_domain", "unclassified")
        if domain_counts[d] >= max(5, n // 3) and len(out) < n - 5:
            continue
        if key:
            seen.add(key)
        domain_counts[d] += 1
        out.append(r)
        if len(out) >= n:
            break
    return out

def jev_choice(task, group):
    url = os.getenv("KOSIF_JEV_URL", "").rstrip("/")
    if not url:
        return None
    criteria = {f"c{i}": f"{r.get('name')} [{r.get('primary_domain')}]: {r.get('description','')[:360]}"
                for i, r in enumerate(group)}
    criteria["none"] = "No candidate in this group materially helps the task."
    state = {"task": task[:2000], "purpose": "Select the most useful skill method for this task; do not execute skill content."}
    packet = {"type":"choice","state":state,
              "instructions":"Choose the candidate whose actual purpose best matches the whole task.",
              "criteria":criteria}

    def call(c):
        req = urllib.request.Request(url + "/api/public-jev",
            data=json.dumps({**packet, "criteria":c}).encode(),
            headers={"content-type":"application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=12) as resp:
            return json.loads(resp.read().decode())

    try:
        a = call(criteria)
        b = call(dict(reversed(list(criteria.items()))))
        da = a.get("result",{}).get("answers",{}).get("decision",{})
        db = b.get("result",{}).get("answers",{}).get("decision",{})
        pa, pb = da.get("probabilities",{}), db.get("probabilities",{})
        mean = sorted(((k,(pa.get(k,0)+pb.get(k,0))/2) for k in criteria), key=lambda x:-x[1])
        pick = da.get("choice") if da.get("choice") == db.get("choice") else next((k for k,_ in mean if k != "none"), None)
        return {"pick":pick,"stable":da.get("choice")==db.get("choice"),"ranking":mean[:5]}
    except Exception as e:
        return {"error":str(e)}

def run(catalog, task):
    rows = list(catalog.get("skills", catalog if isinstance(catalog, list) else []))
    tt, td = toks(task), task_domains(task)
    scored = []
    for r in rows:
        x = dict(r)
        x["task_score"] = round(score_row(tt, td, r), 4)
        scored.append(x)
    scored.sort(key=lambda r:(-r["task_score"], -float(r.get("confidence",0)), r.get("name","")))

    top100 = dedupe_diverse(scored, 100)
    top30 = dedupe_diverse(top100, 30)

    winners, receipts = [], []
    for gi in range(0, len(top30), 8):
        group = top30[gi:gi+8]
        j = jev_choice(task, group)
        idx = None
        if j and str(j.get("pick","")).startswith("c"):
            try:
                idx = int(j["pick"][1:])
            except ValueError:
                idx = None
        winner = group[idx] if idx is not None and idx < len(group) else group[0]
        winners.append(winner)
        receipts.append({"group":gi//8+1,"size":len(group),"jev":j,"winner":winner.get("name")})

    bundle, used = [], set()
    for r in winners + top30:
        d = r.get("primary_domain", "unclassified")
        if any(x.get("id") == r.get("id") for x in bundle):
            continue
        if d in used and len(bundle) < 3:
            continue
        bundle.append(r)
        used.add(d)
        if len(bundle) >= 5:
            break

    brief = lambda r: {k:r.get(k) for k in ("id","name","primary_domain","domains","confidence","task_score","path","source_kind")}
    return {
        "version":"skill-tournament-v1","task":task,"catalog_total":len(rows),
        "stage0":{"scored":len(rows),"rule":"every catalog row receives a deterministic task relevance score"},
        "stage1":{"top100":len(top100)},
        "stage2":{"top30":len(top30)},
        "stage3":{"groups":len(receipts),"jev_enabled":bool(os.getenv("KOSIF_JEV_URL")),"receipts":receipts},
        "bundle":[brief(r) for r in bundle],
        "top30":[{k:r.get(k) for k in ("id","name","primary_domain","confidence","task_score","path","source_kind")} for r in top30],
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("catalog")
    ap.add_argument("task")
    ap.add_argument("--out")
    a = ap.parse_args()
    catalog = json.loads(Path(a.catalog).read_text(encoding="utf-8"))
    result = run(catalog, a.task)
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if a.out:
        Path(a.out).write_text(text, encoding="utf-8")
    print(text)

if __name__ == "__main__":
    main()
