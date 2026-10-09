"""Meta tools: capability map, deterministic router, skill reader, environment doctor."""
from __future__ import annotations

import importlib.util
import json
import os
import platform
import re
import sqlite3
import sys
import urllib.error
import urllib.request
from urllib.parse import urlsplit

from . import __version__
from .paths import (allowed_roots, corpus_dir, plugin_root, resolve_inside, skills_dir, state_dir)
from .registry import REGISTRY, A, B, I, O, S, ToolError, obj, tool
from .skillindex import skills

# ── capability families (the single source of truth for routing) ─────────────
FAMILIES: list[dict] = [
    {"id": "reasoning", "title": "Reasoning, decisions, calibration",
     "skills": ["kosif-think", "kosif-cognitive-core", "kosif-think-pro"],
     "tools": ["kosif_decision_sensitivity", "kosif_probability_check", "kosif_calibration_check",
               "kosif_evidence_check", "kosif_ideate"],
     "kw": ["decide", "decision", "compare options", "trade-off", "tradeoff", "probability", "bayes", "forecast",
            "hypothesis", "root cause", "why", "analyze", "analysis", "plan", "strategy", "pros and cons",
            "قرار", "قارن", "مفاضلة", "احتمال", "تحليل", "استراتيجية", "خطة", "سبب", "فكر", "افكار", "أفكار"]},
    {"id": "council", "title": "Genius Council & expert deliberation",
     "skills": ["kosif-expert-council", "kosif-council-500", "kosif-einstein-chief-expert",
                "kosif-expert-jev-deliberation", "kosif-visual-aesthetics-council", "kosif-full-pro-all-experts"],
     "tools": ["kosif_council_panel", "kosif_council_expert", "kosif_council_search", "kosif_council_protocol",
               "kosif_council_overlay500", "kosif_council100_select", "kosif_council100_aggregate"],
     "kw": ["council", "experts", "expert panel", "red team", "panel of", "second opinion", "einstein", "genius",
            "مجلس", "خبراء", "خبير", "عباقرة", "لجنة", "اينشتاين", "أينشتاين", "راي اخر", "رأي آخر"]},
    {"id": "jev", "title": "Jev closed-set arbitration",
     "skills": ["kosif-jev"], "tools": ["kosif_jev_decide", "kosif_jev_packet", "kosif_jev_status"],
     "kw": ["jev", "closed set", "choose between", "pick one of", "tournament", "اختر من", "جيف"]},
    {"id": "audit", "title": "Audit, accounting, IFRS",
     "skills": ["kosif-audit-ifrs", "atlas-hledger-hledger"], "tools": ["kosif_ledger_check"],
     "kw": ["audit", "ifrs", "ledger", "journal entry", "vat", "invoice", "accounting", "reconcile", "isa",
            "hledger", "plain text accounting", "double-entry",
            "تدقيق", "مراجعة حسابات", "محاسبة", "قيود", "قيد", "ضريبة", "فاتورة", "فواتير", "دفتر", "ميزانية", "تسوية بنكية"]},
    {"id": "code", "title": "Code, projects, delivery gates",
     "skills": ["kosif-code-master", "kosif-github", "atlas-security-scanning-stride-analysis-patterns"],
     "tools": ["kosif_code_scan", "kosif_delivery_gate", "kosif_project_forge", "kosif_kcl_probe"],
     "kw": ["threat model", "stride", "نمذجة التهديد", "code", "bug", "refactor", "script", "python", "typescript", "javascript", "api", "scaffold", "unit test",
            "security scan", "برمجة", "كود", "اكواد", "أكواد", "سكربت", "خطأ برمجي", "مشروع", "تطبيق", "اختبارات"]},
    {"id": "web", "title": "Web design & audits",
     "skills": ["kosif-web-design", "atlas-accessibility-compliance-wcag-audit-patterns"],
     "tools": ["kosif_design_tokens", "kosif_web_audit"],
     "kw": ["wcag", "a11y", "إتاحة", "سهولة الوصول", "website", "web page", "landing page", "css", "html", "ui", "ux", "design system", "accessibility",
            "dark mode", "responsive", "موقع", "صفحة", "تصميم موقع", "واجهة", "واجهات", "الوان", "ألوان"]},
    {"id": "visual", "title": "Image & prompt engineering, vision",
     "skills": ["kosif-image-studio", "kosif-prompt-master", "kosif-vision", "kosif-visual-aesthetics-council"],
     "tools": ["kosif_prompt_forge", "kosif_image_prompt_lint", "kosif_llm_prompt_lint", "kosif_image_analyze",
               "kosif_visual_contract", "kosif_scene_spec_check"],
     "kw": ["prompt", "midjourney", "image", "photo", "picture", "render", "flux", "sdxl", "dall", "poster", "logo",
            "صورة", "صور", "برومبت", "بروميت", "تصميم", "بوستر", "شعار", "رسم"]},
    {"id": "cinema", "title": "Cinema director, video, story, characters",
     "skills": ["kosif-cinema-director", "kosif-video", "kosif-lighting"],
     "tools": ["kosif_story_lint", "kosif_light_calc", "kosif_prompt_forge", "kosif_corpus_search"],
     "kw": ["video", "film", "cinema", "scene", "shot", "storyboard", "screenplay", "script writing", "character sheet",
            "lighting", "camera", "lens", "veo", "sora", "runway", "kling", "ad spot", "commercial",
            "animation", "animated", "motion graphics", "explainer",
            "انميشن", "انيميشن", "رسوم متحركة", "موشن جرافيك", "فيديو تعليمي", "فيديو توضيحي",
            "فيديو", "فيلم", "سينما", "سينمائي", "مشهد", "لقطة", "سيناريو", "قصة", "شخصية", "اضاءة", "إضاءة", "كاميرا", "عدسة", "اعلان", "إعلان", "مخرج"]},
    {"id": "audio", "title": "Audio analysis, voice direction",
     "skills": ["kosif-audio", "kosif-voice"], "tools": ["kosif_audio_analyze"],
     "kw": ["audio", "voice", "tts", "podcast", "mix", "master", "loudness", "lufs", "song", "lyrics", "narration",
            "صوت", "صوتيات", "تعليق صوتي", "اغنية", "أغنية", "موسيقى", "مكساج", "ماستر", "بودكاست"]},
    {"id": "sheets", "title": "KOSIF Sheets — Excel workbooks and SQLite databases (files, or live in open Excel)",
     "skills": ["kosif-sheets"], "tools": ["kosif_sheet_build", "kosif_db", "kosif_excel"],
     "kw": ["excel", "xlsx", "spreadsheet", "workbook", "sqlite", "database table", "create a table", "pivot",
            "اكسل", "إكسل", "الاكسل", "ملف اكسل", "جدول بيانات", "قاعدة بيانات", "قاعده بيانات", "انشاء جدول",
            "إنشاء جدول", "رتب الجدول", "ترتيب الجدول", "شيت"]},
    {"id": "mouse", "title": "KOSIF Mouse — background-first desktop control with Claude's own pointer "
                             "(Live View, Jev-grounded, gated)",
     "skills": ["kosif-mouse", "kosif-computer-use"],
     "tools": ["kosif_mouse_status", "kosif_mouse_observe", "kosif_mouse_find", "kosif_mouse_act", "kosif_mouse_do",
               "kosif_mouse_live", "kosif_excel", "kosif_paint_copy"],
     "kw": ["mouse", "cursor", "desktop app", "control my computer", "control the computer", "click on screen",
            "double click", "right click", "drag", "hotkey", "keyboard shortcut", "windows app", "notepad",
            "in the background", "without taking focus", "paint", "draw", "الرسام", "ارسم", "في الخلفية",
            "ماوس", "الماوس", "فأرة", "الفارة", "مؤشر", "تحكم بالكمبيوتر", "تحكم في الكمبيوتر", "تحكم بالحاسوب",
            "سطح المكتب", "انقر", "نقرة", "اسحب", "اختصار لوحة المفاتيح", "برنامج على الكمبيوتر",
            "redraw image in paint", "copy image in paint", "pixel perfect", "اعادة رسم", "إعادة رسم",
            "ارسم الصورة", "مطابقة", "مطابقه", "بكسل"]},
    {"id": "browser", "title": "Browser & computer control (gated)",
     "skills": ["kosif-jev-browser", "kosif-computer-use"], "tools": ["kosif_action_gate", "kosif_ui_ground"],
     "kw": ["browser", "click", "navigate", "fill form", "scrape", "playwright", "automate", "desktop", "screen",
            "متصفح", "اضغط", "افتح الموقع", "املأ", "اتمتة", "أتمتة", "سطح المكتب"]},
    {"id": "release", "title": "GitHub / Cloudflare release & verification",
     "skills": ["kosif-github", "kosif-release-bridge"], "tools": ["kosif_gh_preflight"],
     "kw": ["github", "pull request", "pr ", "commit", "push", "deploy", "cloudflare", "release", "branch", "merge",
            "نشر", "ارفع على", "رفع الكود", "فرع", "دمج"]},
    {"id": "knowledge", "title": "Your own corpus & source quality",
     "skills": ["kosif-knowledge-atlas", "kosif-source-router", "kosif-omni"],
     "tools": ["kosif_corpus_status", "kosif_corpus_configure", "kosif_corpus_index", "kosif_corpus_search",
               "kosif_corpus_read", "kosif_corpus_files"],
     "kw": ["search my files", "knowledge base", "corpus", "my notes", "find in my", "source", "citation", "rag",
            "ابحث في ملفاتي", "ملفاتي", "المعرفة", "مصادر", "قاعدة معرفة", "ابحث في الاكواد", "ابحث في الأكواد"]},
    {"id": "evals", "title": "LLM evaluation, judges and prompt engineering",
     "skills": ["atlas-llm-evaluation-engineering-build-llm-judge", "atlas-llm-evaluation-engineering-design-eval-suite",
                "atlas-ai-tooling-prompt-engineering", "kosif-prompt-master"],
     "tools": ["kosif_llm_prompt_lint", "kosif_calibration_check"],
     "kw": ["llm judge", "llm-as-judge", "eval suite", "evaluate the model", "evaluation", "rubric", "grader",
            "benchmark", "prompt engineering", "system prompt", "تقييم النموذج", "تقييم الذكاء", "معايير التقييم",
            "حكم آلي", "هندسة البرومبت"]},
    {"id": "research", "title": "Fact-checking, citations and source verification",
     "skills": ["atlas-discipline-do-your-research-deep", "atlas-mas-ai-workflows-ai-citation-verification",
                "kosif-source-router"],
     "tools": ["kosif_evidence_check", "kosif_corpus_search"],
     "kw": ["fact check", "fact-check", "verify claim", "verify the claims", "citation", "citations", "primary source",
            "تحقق من صحة", "تحقق من المعلومة", "مصادر", "توثيق", "استشهاد", "هل هذا صحيح"]},
    {"id": "product", "title": "Product requirements and planning",
     "skills": ["atlas-pm-execution-create-prd", "atlas-requirements-elicitation-requirements-elicitation"],
     "tools": [],
     "kw": ["prd", "product requirements", "requirements", "user story", "user stories", "feature spec", "roadmap",
            "متطلبات", "وثيقة متطلبات", "قصة مستخدم", "قصص المستخدم", "مواصفات المنتج", "خارطة طريق"]},
    {"id": "atlas", "title": "Third-party skill library on demand (Atlas)",
     "skills": ["kosif-atlas"],
     "tools": ["kosif_skill_auto", "kosif_atlas_search", "kosif_atlas_read", "kosif_atlas_inspect", "kosif_atlas_status"],
     "kw": ["plugin library", "skill library", "third-party skill", "find a skill", "find a plugin", "atlas",
            "best skill", "which skill", "pick a skill",
            "مكتبة الاضافات", "مكتبة المهارات", "مهارة جاهزة", "ابحث عن مهارة", "ابحث عن اضافة", "الاطلس",
            "افضل مهارة", "اي مهارة", "اختر مهارة", "المهارة المناسبة"]},
    {"id": "messaging", "title": "WhatsApp (manual, confirmed sends only)",
     "skills": ["kosif-whatsapp"], "tools": [],
     "kw": ["whatsapp", "send message", "واتساب", "واتس", "ارسل رسالة", "أرسل رسالة"]},
    {"id": "full_pro", "title": "Full Pro runtime, receipts, secure execution",
     "skills": ["kosif-think-pro", "kosif-full-pro-host-entry", "kosif-full-pro-execution-engine",
                "kosif-full-pro-execution-gate", "kosif-runtime-orchestrator", "kosif-secure-executor",
                "kosif-mobile-full-pro-bridge", "kosif-source-router"],
     "tools": ["kosif_full_pro_entry", "kosif_risk_gate", "kosif_receipt_verify"],
     "kw": ["full pro", "pro mode", "all experts", "all capabilities", "receipt", "secure executor",
            "برو مود", "الوضع الكامل", "كل الخبراء", "كل القدرات", "استخدم البرو"]},
]

FULL_PRO_TRIGGERS = ("pro mode", "full pro", "full power", "برو مود", "الوضع الكامل", "استخدم البرو",
                     "استخدم كل القدرات", "شغل كل الخبراء", "all experts", "activate all experts",
                     "maximum capabilities", "full capabilities", "all capabilities")
COUNCIL_TRIGGERS = ("council", "مجلس", "خبراء", "عباقرة", "red team", "panel of experts")

MODULE_RULES: list[tuple[str, list[str], str]] = [
    (r"defin|classif|argument|تعريف|تصنيف|حجة", ["M01", "M02"], "definition / classification / argument"),
    (r"\bwhy\b|cause|causal|counterfactual|لماذا|سبب", ["M01", "M03", "M04", "M05", "M24"], "causal / counterfactual"),
    (r"debug|diagnos|root cause|crash|error|عطل|تشخيص|خطأ", ["M05", "M24", "M04", "M27"], "diagnosis / debugging"),
    (r"forecast|predict|probab|تنبؤ|توقع|احتمال", ["M04", "M24", "M26"], "forecast / uncertainty"),
    (r"strateg|creative|brainstorm|idea|innovat|استراتيج|ابداع|إبداع|فكرة|افكار", ["M07", "M08", "M09", "M10", "M20", "M25"], "strategy / creative design"),
    (r"optimi[sz]|kpi|rank|score|مؤشر|تحسين|ترتيب", ["M09", "M10", "M25"], "optimization / KPI / ranking"),
    (r"compare|versus|\bvs\b|choose|which to pick|decision|trade-?off|قارن|مفاضل|اختر|قرار", ["M09", "M10", "M06", "M25"], "decision between options"),
    (r"architect|agent|pipeline|refactor|design system|معمار|وكيل", ["M13", "M14", "M15", "M16", "M17", "M11", "M27"], "software / agent architecture"),
    (r"audit|ledger|ifrs|accounting|tax|vat|تدقيق|محاسب|قيود|ضريب", ["M21", "M22", "M23", "M27"], "audit / accounting / IFRS"),
    (r"disagree|conflict|high[- ]stakes|risk|خلاف|مخاطر|حساس", ["M12", "M28"], "high-impact disagreement / common-mode risk"),
]

_TASHKEEL = re.compile("[ؐ-ًؚ-ٰٟۖ-ۭـ]")


def _norm(text: str) -> str:
    t = _TASHKEEL.sub("", text.lower())
    t = re.sub("[إأآٱ]", "ا", t)
    return t.replace("ى", "ي").replace("ة", "ه")


def _hit(kw: str, text: str) -> bool:
    k = _norm(kw)
    if k.isascii() and (len(k) <= 3 or k.endswith(" ")):
        return re.search(r"(?<![a-z0-9])" + re.escape(k.strip()) + r"(?![a-z0-9])", text) is not None
    if k.isascii():  # English keywords match at a word start ("voice" must not fire inside "invoices")
        return re.search(r"(?<![a-z0-9])" + re.escape(k), text) is not None
    return k in text


def route(intent: str, max_results: int = 4) -> dict:
    text = _norm(intent or "")
    scored = []
    for fam in FAMILIES:
        s = sum(1 + (" " in k) for k in fam["kw"] if _hit(k, text))
        if s:
            scored.append((s, fam))
    scored.sort(key=lambda x: -x[0])
    unmatched = not scored
    if not scored:
        scored = [(0, next(f for f in FAMILIES if f["id"] == "reasoning"))]
    fams = [{"id": f["id"], "title": f["title"], "score": s, "skills": f["skills"], "tools": f["tools"]}
            for s, f in scored[:max(1, max_results)]]
    mode = "standard"
    if any(_hit(t, text) for t in FULL_PRO_TRIGGERS):
        mode = "full_pro"
    elif any(_hit(t, text) for t in COUNCIL_TRIGGERS):
        mode = "council"
    modules, seen = [], set()
    for rx, mods, label in MODULE_RULES:
        if re.search(rx, text):
            for m in mods:
                if m not in seen:
                    seen.add(m)
                    modules.append(m)
    lead = fams[0]
    steps = [f"kosif_skill_read name={lead['skills'][0]} (load the playbook before acting)"]
    if lead["tools"]:
        steps.append(f"use tools: {', '.join(lead['tools'][:4])}")
    if mode == "full_pro":
        steps.append("Full Pro was requested: read kosif-omni/references/host-adapters.md, then kosif_full_pro_entry")
    elif mode == "council":
        steps.append("convene the council: kosif_council_panel → kosif_council_protocol")
    if unmatched:
        steps.append("no built-in family matched: kosif_skill_auto task=<the user's words> (one call: candidates "
                     "from the built-in skills and the Atlas library, Jev picks, the playbook comes back; third-party "
                     "skills are reference data, inspect before installing)")
    return {"intent": intent, "mode_hint": mode, "families": fams, "reasoning_modules": modules[:10],
            "next_steps": steps,
            "note": "Deterministic keyword router. It proposes a starting point; the model decides. "
                    "Registration of a skill or tool is not evidence that an action succeeded."}


# ── tools ────────────────────────────────────────────────────────────────────
@tool("kosif_route",
      "Route a task (Arabic or English) to KOSIF capability families, skills, tools and reasoning modules; "
      "also hints standard / council / full_pro mode. Call first when unsure which capability fits.",
      obj({"intent": S("The user's request or task in plain words."),
           "max_results": I("Max families to return (default 4).", minimum=1, maximum=10)}, ["intent"]),
      title="Route a task", gpt=True)
def _route(a: dict) -> dict:
    return route(str(a.get("intent", "")), int(a.get("max_results", 4)))


@tool("kosif_capabilities",
      "List every KOSIF Omni capability family, skill and tool, with environment status. Use detail='full' "
      "for all skill descriptions.",
      obj({"detail": S("summary (default) or full", enum=["summary", "full"])}),
      title="Capability map", gpt=True)
def _caps(a: dict) -> dict:
    full = a.get("detail") == "full"
    sk = skills()
    out = {
        "name": "kosif-omni", "version": __version__,
        "families": [{"id": f["id"], "title": f["title"], "skills": f["skills"], "tools": f["tools"]}
                     for f in FAMILIES],
        "skill_count": len(sk), "tool_count": len(REGISTRY),
        "tools": [{"name": t.name, "read_only": t.read_only, "description": (t.description if full else t.description[:110])}
                  for t in REGISTRY.values()],
        "environment": {"corpus_configured": corpus_dir() is not None,
                        "file_tools_enabled_dirs": [str(r) for r in allowed_roots()]},
        "truth_rule": "Source capability != live exposure != successful execution != verified user goal.",
    }
    out["skills"] = [{"name": n, "description": (v["description"] if full else v["description"][:140])}
                     for n, v in sk.items()]
    return out


_TEXT_EXT = {".md", ".txt", ".json", ".py", ".yaml", ".yml", ".csv", ".toml"}


@tool("kosif_skill_read",
      "Read a bundled KOSIF skill playbook (SKILL.md) or one of its reference/script files. Use this in hosts "
      "without native skill support (ChatGPT connectors) to load the instructions for a capability on demand.",
      obj({"name": S("Skill folder name, e.g. kosif-audit-ifrs"),
           "path": S("File inside the skill (default SKILL.md). A directory path lists its files."),
           "offset": I("Character offset for long files.", minimum=0),
           "limit": I("Max characters (default 60000).", minimum=1000, maximum=200000)}, ["name"]),
      title="Read a skill", gpt=True)
def _skill_read(a: dict) -> dict:
    name = str(a.get("name", ""))
    sk = skills()
    if name not in sk:
        raise ToolError(f"unknown skill '{name}'. Known: {', '.join(sk)}")
    base = sk[name]["dir"]
    rel = str(a.get("path") or "SKILL.md")
    target = resolve_inside(base, rel)
    if target.is_dir():
        files = sorted(str(p.relative_to(base)).replace("\\", "/") for p in target.rglob("*")
                       if p.is_file() and "__pycache__" not in p.parts)
        return {"name": name, "path": rel, "files": files[:400], "truncated": len(files) > 400}
    if not target.is_file():
        raise ToolError(f"no such file in skill: {rel}")
    if target.suffix.lower() not in _TEXT_EXT:
        raise ToolError(f"unsupported file type: {target.suffix}")
    text = target.read_text(encoding="utf-8", errors="replace")
    off, lim = int(a.get("offset", 0)), int(a.get("limit", 60000))
    chunk = text[off:off + lim]
    res = {"name": name, "path": rel, "content": chunk, "offset": off, "total_chars": len(text),
           "truncated": off + lim < len(text)}
    if rel in ("SKILL.md", "") and not off:
        res["files"] = sorted(str(p.relative_to(base)).replace("\\", "/") for p in base.rglob("*")
                              if p.is_file() and p.name != "SKILL.md" and "__pycache__" not in p.parts)[:80]
    return res


def _has(mod: str) -> bool:
    try:
        return importlib.util.find_spec(mod) is not None
    except Exception:
        return False


def remote_url() -> str | None:
    """The optional kosif-think backend URL: KOSIF_THINK_URL, else the plugin's .mcp.json entry."""
    if os.environ.get("KOSIF_THINK_URL"):
        return os.environ["KOSIF_THINK_URL"]
    try:
        cfg = json.loads((plugin_root() / ".mcp.json").read_text(encoding="utf-8"))
        return cfg["mcpServers"]["kosif-think"]["url"]
    except (OSError, ValueError, KeyError, TypeError):
        return None


def _rpc_post(url: str, payload: dict, timeout: float = 12) -> tuple[int, dict | None]:
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), method="POST", headers={
        "content-type": "application/json", "accept": "application/json, text/event-stream",
        "user-agent": f"kosif-omni-doctor/{__version__}"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            code, body = r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        code, body = e.code, e.read().decode("utf-8", "replace")
    if body.lstrip().startswith(("event:", "data:")):  # streamable-HTTP may answer as SSE
        body = "\n".join(l[5:] for l in body.splitlines() if l.startswith("data:"))
    try:
        return code, json.loads(body)
    except ValueError:
        return code, None


def probe_remote(url: str) -> list[dict]:
    """Three small requests that separate reachability, endpoint freshness and model-tool authorization.
    This process never holds the host's OAuth token, so 'auth required' means a sign-in is needed in the host."""
    out = []

    def add(name, ok, detail, fix=""):
        out.append({"check": name, "ok": bool(ok), "detail": detail, **({"fix": fix} if fix and not ok else {})})

    try:
        code, init = _rpc_post(url, {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
            "protocolVersion": "2025-03-26", "capabilities": {},
            "clientInfo": {"name": "kosif-omni-doctor", "version": __version__}}})
    except (urllib.error.URLError, OSError) as e:
        add("remote backend reachable", False, f"{url}: {e}", "check the network or KOSIF_THINK_URL")
        return out
    res = (init or {}).get("result") or {}
    add("remote backend reachable", code == 200 and bool(res),
        f"HTTP {code}, {res.get('serverInfo', {}).get('name', '?')} {res.get('serverInfo', {}).get('version', '?')}")
    if not res:
        return out
    m = re.search(r"primary versioned MCP endpoint (/mcp/v[\d.]+)", res.get("instructions", ""))
    configured = urlsplit(url).path
    if m:
        add("remote endpoint is the primary one", configured == m.group(1),
            f"configured {configured}, server primary {m.group(1)}",
            f"set the kosif-think url in .mcp.json to {urlsplit(url)._replace(path=m.group(1), query='').geturl()}")
    _, tl = _rpc_post(url, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
    tools = ((tl or {}).get("result") or {}).get("tools") or []
    add("remote tools listed", bool(tools), f"{len(tools)} tools")
    code, call = _rpc_post(url, {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {
        "name": "kosif_full_pro_status", "arguments": {"request_id": "kosif-doctor-probe"}}})
    err = (((call or {}).get("result") or {}).get("structuredContent") or {}).get("error")
    needs_auth = code == 401 or err == "authentication_required"
    add("remote model tools callable without sign-in", not needs_auth,
        "HTTP 401 authentication_required: model tools need an OAuth sign-in" if needs_auth else f"HTTP {code}",
        "authorize the kosif-think server in the host (Claude Code: /mcp → kosif-think → Authenticate; "
        "ChatGPT: reconnect the app). Discovery stays public; only tool calls need the token.")
    return out


@tool("kosif_doctor",
      "Self-check the KOSIF Omni server: Python, optional libraries (numpy/Pillow for image & audio), skills "
      "bundle, council engine, SQLite FTS5 (corpus search), enabled folders and state directory. With "
      "remote=true it also probes the optional kosif-think backend (reachability, stale endpoint, sign-in).",
      obj({"remote": B("Also probe the optional remote kosif-think backend (3 small network requests).")}),
      title="Environment self-check", open_world=True, gpt=True)
def _doctor(a: dict) -> dict:
    checks = []

    def add(name, ok, detail=""):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})

    add("python", sys.version_info >= (3, 9), sys.version.split()[0])
    add("plugin_root", plugin_root().is_dir(), str(plugin_root()))
    add("skills_bundle", len(skills()) >= 30, f"{len(skills())} skills")
    add("numpy (image/audio tools)", _has("numpy"), "" if _has("numpy") else "pip install numpy pillow  # optional")
    add("Pillow (image tool)", _has("PIL"), "")
    try:
        c = sqlite3.connect(":memory:")
        c.execute("create virtual table t using fts5(a)")
        add("sqlite FTS5 (corpus search)", True, sqlite3.sqlite_version)
    except Exception as e:  # pragma: no cover
        add("sqlite FTS5 (corpus search)", False, str(e))
    try:
        from .tools_council import council
        st = council().stats()
        add("council engine", st["total"] == 1040, f"{st['elite']} elite + {st['scholars']} scholars")
    except Exception as e:
        add("council engine", False, repr(e))
    try:
        sd = state_dir()
        t = sd / ".w"
        t.write_text("x")
        t.unlink()
        add("state dir writable", True, str(sd))
    except Exception as e:
        add("state dir writable", False, repr(e))
    add("corpus configured", corpus_dir() is not None, str(corpus_dir() or "set KOSIF_CORPUS_DIR to enable"))
    add("file tools enabled folders", bool(allowed_roots()), "; ".join(map(str, allowed_roots())) or "none (use --workspace)")
    add("platform", True, platform.platform())
    required = ("python", "plugin_root", "skills_bundle", "council engine", "state dir writable")
    out = {"ok": all(c["ok"] for c in checks if c["check"] in required), "version": __version__, "checks": checks}
    if a.get("remote"):
        url = remote_url()
        # The remote backend is optional: its result is reported separately and never flips the local "ok".
        out["remote"] = probe_remote(url) if url else [{"check": "remote backend configured", "ok": False,
                                                         "detail": "no kosif-think url in .mcp.json or KOSIF_THINK_URL"}]
        out["remote_ok"] = all(c["ok"] for c in out["remote"])
    fixes = [c["fix"] for c in out.get("remote", []) if c.get("fix")]
    if not corpus_dir():
        fixes.append("corpus search: kosif_corpus_configure path=<folder with your text files> (or KOSIF_CORPUS_DIR)")
    if fixes:
        out["fixes"] = fixes
    return out
