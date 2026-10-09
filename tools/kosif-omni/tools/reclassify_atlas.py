#!/usr/bin/env python3
"""Reclassify KOSIF Atlas skills from their actual SKILL.md content.

Reads one or more Atlas mirrors without executing any skill code. Produces a
multi-label catalog suitable for search/tournament routing. The old category or
plugin folder name is never trusted as the classification source.
"""
from __future__ import annotations

import argparse, csv, hashlib, json, math, re
from collections import Counter
from pathlib import Path

FM = re.compile(r"\A\ufeff?---\r?\n(.*?)\r?\n---\r?\n?", re.S)

TAXONOMY: dict[str, tuple[str, ...]] = {
    "image_design": ("image generation","image editing","illustration","graphic design","poster","logo","branding","brand identity","photoshop","figma","canva","visual design","photography","lighting","composition","typography","صورة","صور","تصميم","شعار","هوية بصرية","تصوير","اضاءة"),
    "video_motion": ("video editing","video generation","motion graphics","animation","after effects","premiere","runway","storyboard","cinematic","b-roll","فيديو","مونتاج","موشن","تحريك"),
    "audio_voice": ("audio","voiceover","speech to text","text to speech","podcast","music","sound design","transcription","صوت","تعليق صوتي","بودكاست","تفريغ"),
    "programming": ("software engineering","programming","code review","debugging","refactor","python","javascript","typescript","java","golang","rust","api development","unit test","coding","برمجة","كود","تصحيح","اختبار"),
    "web_frontend": ("frontend","front-end","react","next.js","nuxt","vue","svelte","css","html","tailwind","web design","landing page","responsive","واجهة","موقع","صفحة هبوط"),
    "cloud_devops": ("devops","cloudflare","vercel","aws","azure","gcp","docker","kubernetes","terraform","ci/cd","deployment","observability","infrastructure","سحابة","نشر","دوكر"),
    "database_data": ("database","postgres","mysql","sqlite","sql","bigquery","data pipeline","etl","data engineering","analytics","pandas","statistics","قاعدة بيانات","تحليل البيانات","بيانات"),
    "spreadsheets_office": ("excel","spreadsheet","google sheets","workbook","formula","pivot table","power query","word document","microsoft word","office","اكسل","جداول","معادلات","وورد"),
    "pdf_documents": ("pdf","document processing","ocr","document extraction","document conversion","acrobat","scan","مستند","ملف pdf","استخراج مستند"),
    "finance_accounting": ("accounting","finance","bookkeeping","ledger","journal entry","ifrs","audit","tax","vat","payroll","financial statement","reconciliation","محاسبة","مراجعة","ضريبة","رواتب","قوائم مالية"),
    "legal_compliance": ("legal","law","contract","compliance","regulation","privacy policy","gdpr","policy review","قانون","عقد","امتثال","لائحة"),
    "security": ("cybersecurity","security review","vulnerability","penetration testing","threat model","secrets scanning","owasp","incident response","أمن","ثغرة","اختراق"),
    "ai_ml": ("machine learning","artificial intelligence","llm","embedding","rag","prompt engineering","fine-tuning","model evaluation","agents","agentic","ذكاء اصطناعي","نموذج لغوي","برومبت","وكلاء"),
    "research_science": ("research","literature review","scientific paper","academic","citation","evidence synthesis","experiment","study","بحث","دراسة","علمي","مراجع"),
    "writing_content": ("writing","copywriting","article","blog","editorial","proofread","rewrite","story","script writing","content creation","كتابة","مقال","تلخيص","تحرير"),
    "marketing_seo": ("marketing","seo","advertising","campaign","social media","content strategy","keyword research","growth","instagram","tiktok","youtube","تسويق","اعلان","سيو","سوشيال"),
    "sales_ecommerce": ("sales","crm","ecommerce","shopify","store","checkout","customer success","lead generation","مبيعات","متجر","تجارة الكترونية","عملاء"),
    "project_product": ("project management","product management","prd","requirements","roadmap","user story","backlog","planning","stakeholder","مشروع","منتج","متطلبات","خطة"),
    "automation_agents": ("automation","workflow","browser automation","agent","orchestration","mcp","tool calling","computer use","playwright","selenium","اتمتة","سير عمل","وكيل","متصفح"),
    "communication": ("email","gmail","slack","whatsapp","message drafting","meeting notes","customer support","بريد","ايميل","واتساب","رسالة","اجتماع"),
    "hr_career": ("hiring","recruiting","resume","cv","interview","performance review","human resources","توظيف","سيرة ذاتية","مقابلة","موارد بشرية"),
    "education": ("education","teaching","lesson plan","curriculum","quiz","student","tutoring","تعليم","درس","طلاب","اختبار قصير"),
    "health": ("health","medical","clinical","nutrition","fitness","patient","medicine","صحة","طبي","تغذية","دواء"),
    "presentation": ("presentation","slides","powerpoint","pitch deck","keynote","deck","عرض تقديمي","بوربوينت","شرائح"),
    "general_reasoning": ("decision making","brainstorm","reasoning","problem solving","strategy","critical thinking","analysis","planning","قرار","تفكير","عصف ذهني","استراتيجية"),
}

AR_NORM = str.maketrans({"أ":"ا","إ":"ا","آ":"ا","ٱ":"ا","ى":"ي","ة":"ه"})

def norm(s: str) -> str:
    s = s.lower().translate(AR_NORM)
    s = re.sub(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]", "", s)
    return re.sub(r"\s+", " ", s).strip()

NORM_TAX = {d: tuple(norm(p) for p in ps) for d, ps in TAXONOMY.items()}

def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = FM.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        if k.strip() in {"name", "description"}:
            meta[k.strip()] = v.strip().strip("\"'")
    return meta, text[m.end():]

def classify(name: str, description: str, body: str) -> dict:
    content = norm(body[:250_000])
    head = norm(f"{name} {description}")
    scores, evidence = {}, {}
    for domain, phrases in NORM_TAX.items():
        hits, score = [], 0.0
        for p in phrases:
            a, b = head.count(p), content.count(p)
            if a or b:
                score += 4.0 * min(a, 3) + min(b, 8)
                hits.append({"phrase": p, "head": a, "body": b})
        if score:
            scores[domain] = score
            evidence[domain] = sorted(hits, key=lambda x: -(x["head"] * 4 + x["body"]))[:6]
    ranked = sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))
    top = ranked[0][1] if ranked else 0.0
    labels = []
    for domain, score in ranked:
        rel = score / top if top else 0.0
        if score >= 3.0 and (rel >= 0.30 or not labels):
            labels.append({"domain": domain, "score": round(score, 3), "relative": round(rel, 4),
                           "evidence": evidence[domain]})
        if len(labels) >= 6:
            break
    primary = labels[0]["domain"] if labels else "unclassified"
    second = labels[1]["score"] if len(labels) > 1 else 0.0
    confidence = 0.0 if not top else min(0.99, 0.45 + math.log1p(top) / 8 + min(0.20, (top-second)/(top+1)*0.35))
    ambiguous = primary == "unclassified" or top < 5 or (second and second/top > 0.88)
    return {"primary_domain": primary, "domains": labels, "confidence": round(confidence, 4),
            "ambiguous": ambiguous}

def iter_skills(root: Path):
    for f in root.rglob("SKILL.md"):
        if any(part in {".git", "node_modules", "_package"} for part in f.parts):
            continue
        yield f

def source_kind(root: Path) -> str:
    s = str(root).lower()
    if "blocked" in s:
        return "blocked"
    if "private" in s or "restricted" in s:
        return "private_reference"
    return "public"

def scan(roots: list[Path]) -> list[dict]:
    out = []
    for root in roots:
        for f in iter_skills(root):
            raw = f.read_text(encoding="utf-8", errors="replace")
            meta, body = parse_frontmatter(raw)
            name = meta.get("name") or f.parent.name
            description = meta.get("description", "")
            out.append({
                "id": hashlib.sha256(str(f.relative_to(root)).encode()).hexdigest()[:20],
                "root": str(root), "path": str(f.relative_to(root)), "source_kind": source_kind(root),
                "name": name, "description": description[:2000],
                "sha256": hashlib.sha256(raw.encode("utf-8", errors="replace")).hexdigest(),
                "content_chars": len(raw), **classify(name, description, body)
            })
    return out

def write_outputs(rows: list[dict], out: Path):
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"version":"content-taxonomy-v1","skills":rows}, ensure_ascii=False, indent=2), encoding="utf-8")
    csvp = out.with_suffix(".csv")
    with csvp.open("w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["id","source_kind","path","name","primary_domain","domains","confidence","ambiguous","sha256"])
        for r in rows:
            w.writerow([r["id"],r["source_kind"],r["path"],r["name"],r["primary_domain"],
                        ";".join(x["domain"] for x in r["domains"]),r["confidence"],r["ambiguous"],r["sha256"]])
    counts = Counter(r["primary_domain"] for r in rows)
    summary = {"version":"content-taxonomy-v1","total":len(rows),
               "ambiguous":sum(bool(r["ambiguous"]) for r in rows),
               "primary_domain_counts":dict(counts.most_common())}
    out.with_name(out.stem+"-summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
    return {"json":str(out),"csv":str(csvp),"summary":summary}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("roots", nargs="+")
    ap.add_argument("--out", default="atlas-classification.json")
    a = ap.parse_args()
    roots = [Path(x).resolve() for x in a.roots]
    missing = [str(x) for x in roots if not x.exists()]
    if missing:
        raise SystemExit("missing roots: " + ", ".join(missing))
    print(json.dumps(write_outputs(scan(roots), Path(a.out).resolve()), ensure_ascii=False))

if __name__ == "__main__":
    main()
