"""محرك جلسات مجلس العباقرة عبر Claude API.

مراحل الجلسة:
  1. التشكيل: رئيس المجلس يصنّف المسألة ويفككها ويختار التخصصات والأعضاء.
  2. الرأي المستقل: كل عضو في اللجنة يفكر وحده بالتوازي.
  3. الجدل (عدد جولات قابل للضبط): الفريق الأحمر يهاجم، والمدققة تفحص،
     ثم يراجع كل عضو موقفه في ضوء آراء زملائه والنقد.
  4. الحكم: المُركِّبة تنسج حكم المجلس النهائي.
"""

from __future__ import annotations

import asyncio
import json
import re
import time
from dataclasses import asdict, dataclass, field
from typing import Callable

try:
    import anthropic
except ImportError:  # يسمح باستيراد المحرك واختباره بعميل بديل دون تثبيت الحزمة
    anthropic = None

from .domains import DOMAINS
from .models import Expert
from .roster import Council, build_council

DEFAULT_MODEL = "claude-opus-5-5"
FALLBACK_BETA = "server-side-fallback-2026-07-01"
EFFORTS = ("low", "medium", "high", "xhigh", "max")

if anthropic is not None:
    _RECOVERABLE: tuple[type[BaseException], ...] = (anthropic.APIStatusError, anthropic.APIConnectionError)
else:
    _RECOVERABLE = ()

COMPLEXITY_LABELS = {
    "simple": "بسيطة — لها حل معروف",
    "complicated": "معقدة — تحتاج تحليل خبراء",
    "complex": "مركّبة تكيفية — تحتاج تجارب آمنة الفشل",
    "chaotic": "فوضوية — أزمة تحتاج فعلًا فوريًا",
}

_ARABIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")
_CONFIDENCE_RE = re.compile(
    r"(?:درجة\s*الثقة|ثقة\s*المجلس|الثقة|confidence)\W{0,6}(\d{1,3})\s*[%٪]", re.IGNORECASE
)


def extract_confidence(text: str) -> int | None:
    matches = _CONFIDENCE_RE.findall(text.translate(_ARABIC_DIGITS))
    if not matches:
        return None
    value = int(matches[-1])
    return value if 0 <= value <= 100 else None


# ═══════════════════ قوالب المهام ═══════════════════

PLAN_TEMPLATE = """# مهمة تشكيل اللجنة
السؤال المطروح على المجلس:
<question>
{question}
</question>

تخصصات هيئة العلماء المتاحة (المفتاح: الاسم):
{domains}

أعضاء الهيئة العليا المتاحون (الرمز: الاسم — الصفة):
{elite}

المطلوب:
1. صنّف طبيعة المسألة: simple (لها حل معروف) أو complicated (تحتاج خبراء) أو complex (مركّبة تكيفية تحتاج تجارب) أو chaotic (أزمة تحتاج فعلًا فوريًا).
2. صغ السؤال الجوهري الحقيقي في جملة واحدة بلغة السائل.
3. فككه إلى 3–6 أسئلة فرعية متنافية وشاملة.
4. اختر من 2 إلى {max_domains} تخصصات من هيئة العلماء، الأكثر صلة وتنوعًا.
5. اختر من 2 إلى {n_elite} أعضاء من الهيئة العليا الأقدر على المسألة (الرئيس والفريق الأحمر والمدققة والمُركِّبة حاضرون دائمًا فلا تخترهم).
6. حدد المنظور الذي يجب ألا يغيب عن المجلس."""

BRIEF_TEMPLATE = """السؤال المطروح على المجلس:
<question>
{question}
</question>

تحليل رئيس المجلس:
- طبيعة المسألة: {complexity}
- السؤال الجوهري: {core}
- الأسئلة الفرعية:
{subs}
- المنظور الذي يجب ألا يغيب: {missing}"""

OPINION_TEMPLATE = """# الجولة الأولى: الرأي المستقل
{brief}

قدّم مداخلتك المستقلة من زاويتك الفريدة: طبّق قدراتك الخارقة ومنهجك، وعِش مزاجك الذهني، والتزم بصيغة مداخلتك وبميثاق المجلس.
أنت لا تعرف بعد آراء زملائك؛ فكّر باستقلال تام، وركّز على ما يمكن أن تضيفه أنت تحديدًا."""

RED_TEAM_TEMPLATE = """# مهمة الفريق الأحمر — الجولة {round}
{brief}

مداخلات أعضاء اللجنة:
{digest}

اختبر هذه الآراء بالنار. اكتب بهذا الهيكل:
### الإجماع الضمني الذي يجب اختباره
### الاعتراضات القاتلة (مرتبة حسب الخطورة)
لكل اعتراض: الرأي المستهدف وصاحبه، ولماذا قد يسقط، وشرط النجاة.
### تشريح ما قبل الوفاة للحل الأكثر تأييدًا
### ما صمد أمام النقد ولماذا
**درجة الثقة:** NN%"""

VERIFY_TEMPLATE = """# مهمة التدقيق — الجولة {round}
{brief}

مداخلات أعضاء اللجنة:
{digest}

دقّق هذه المداخلات بهذا الهيكل:
### الادعاءات الحاملة وتصنيفها
[مؤكَّد] / [مرجَّح] / [فرضية] / [مشبوه: يحتاج تحققًا]
### التناقضات بين الأعضاء
ونوع كل خلاف: وقائع أم قيم أم تقدير.
### المعايرة
لكل عضو: ثقته المعلنة، والثقة المعايرة، والسبب.
### المعلومة الناقصة الأهم
التي لو عرفناها لتغيّر الحكم."""

REVISION_TEMPLATE = """# الجولة {round}: المراجعة بعد الجدل
{brief}

مداخلتك السابقة:
<my_previous_opinion>
{own}
</my_previous_opinion>

مداخلات زملائك (مختصرة):
{others}

نقد الفريق الأحمر:
<red_team>
{critique}
</red_team>

تقرير التدقيق:
<verification>
{verification}
</verification>

راجع موقفك بصدق فكري: إن أقنعتك حجة فاعترف وعدّل، وإن بقيت على رأيك فرُدّ على أقوى اعتراض موجّه إليك تحديدًا. لا تكرر مداخلتك السابقة؛ قدّم نسختها المحسّنة.
ابدأ بسطر: **موقفي بعد الجدل:** ثابت / معدَّل / متغيّر جذريًا — مع السبب في جملة، ثم التزم بصيغة مداخلتك."""

VERDICT_TEMPLATE = """# مهمة صياغة حكم المجلس
{brief}

المداخلات النهائية لأعضاء اللجنة:
{digest}

آخر نقد للفريق الأحمر:
<red_team>
{critique}
</red_team>

آخر تقرير تدقيق:
<verification>
{verification}
</verification>

اكتب حكم المجلس النهائي موجّهًا إلى السائل مباشرة وبلغته، بهذا الهيكل:
# حكم مجلس العباقرة
## الخلاصة في سطرين
## الحل المفصل
## نقاط الإجماع
## الخلافات وآراء الأقلية
مع أسماء أصحابها، ومتى يكونون على حق.
## المخاطر والتحوطات
## خطة العمل
خطوات مرتبة زمنيًا.
## ثقة المجلس: NN% — ولماذا
## ما الذي سيغيّر هذا الحكم

إذا كانت المسألة إنتاجًا إبداعيًا (صورة، أو فيديو، أو قصة، أو صوت، أو محتوى للمنصات)، فأضف في النهاية:
## حزمة الإنتاج
برومبتات جاهزة بالإنجليزية لكل أداة مذكورة في كتل كود، مع البرومبت السلبي والإعدادات حيث تدعمها الأداة، وثلاث تنويعات (دقيقة، وجريئة، وتقنية)، وتقييم بالميزان الخماسي: الدقة، والصحة التقنية، والأصالة، والأثر العاطفي، والجاهزية للإنتاج.

احكم بقوة الحجة لا بعدد المؤيدين، ولا تذكر تفاصيل إدارية عن الجلسة."""


# ═══════════════════ نتائج الجلسة ═══════════════════

@dataclass
class Contribution:
    stage: str  # plan | opinion | red_team | verification | revision | verdict
    round: int
    member_id: str
    member: str
    text: str
    confidence: int | None = None
    stop_reason: str | None = None
    model: str | None = None
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    error: str | None = None

    @property
    def ok(self) -> bool:
        return not self.error and self.stop_reason != "refusal" and bool(self.text)

    @property
    def note(self) -> str:
        if self.error:
            return f"[تعذّرت المداخلة: {self.error}]"
        if self.stop_reason == "refusal":
            return "[امتنع النموذج عن هذه المداخلة]"
        if self.stop_reason == "max_tokens":
            return "[اقتُطعت المداخلة لبلوغ الحد الأقصى للطول]"
        return ""


@dataclass
class Plan:
    complexity: str
    core_question: str
    subquestions: list[str]
    domains: list[str]
    elite: list[str]
    missing_perspective: str
    source: str  # "llm" | "local"


@dataclass
class Session:
    question: str
    plan: Plan | None = None
    panel_ids: list[str] = field(default_factory=list)
    contributions: list[Contribution] = field(default_factory=list)
    verdict: str = ""
    started_at: float = field(default_factory=time.time)
    finished_at: float | None = None

    def usage(self) -> dict:
        return {
            "calls": len(self.contributions),
            "input_tokens": sum(c.input_tokens for c in self.contributions),
            "output_tokens": sum(c.output_tokens for c in self.contributions),
            "cache_read_tokens": sum(c.cache_read_tokens for c in self.contributions),
            "failed_calls": sum(not c.ok for c in self.contributions),
        }

    def to_json(self) -> str:
        return json.dumps(asdict(self), ensure_ascii=False, indent=1)

    def to_markdown(self, council: Council | None = None) -> str:
        council = council or build_council()
        lines = ["# جلسة مجلس العباقرة", "", f"**السؤال:** {self.question}", ""]
        verdict = next((c for c in self.contributions if c.stage == "verdict"), None)
        lines += [self.verdict or (verdict.note if verdict else "")]
        if self.plan:
            p = self.plan
            lines += ["", "---", "", f"## تشكيل اللجنة ({'رئيس المجلس' if p.source == 'llm' else 'توجيه محلي'})", ""]
            lines.append(f"- **طبيعة المسألة:** {COMPLEXITY_LABELS.get(p.complexity, p.complexity)}")
            lines.append(f"- **السؤال الجوهري:** {p.core_question}")
            if p.subquestions:
                lines.append("- **الأسئلة الفرعية:**")
                lines += [f"  {i}. {s}" for i, s in enumerate(p.subquestions, 1)]
            lines.append(f"- **التخصصات:** {'، '.join(DOMAINS[d].name for d in p.domains if d in DOMAINS)}")
            if p.missing_perspective:
                lines.append(f"- **المنظور الذي يجب ألا يغيب:** {p.missing_perspective}")
        if self.panel_ids:
            lines += ["", "### أعضاء اللجنة", ""]
            for mid in self.panel_ids:
                m = council.get(mid)
                lines.append(f"- {m.id} · {m.display_name} — {m.title} · المزاج: {m.psych.name}")
        stage_titles = {
            "opinion": "الآراء المستقلة",
            "red_team": "الفريق الأحمر",
            "verification": "التدقيق",
            "revision": "المراجعة بعد الجدل",
        }
        lines += ["", "---", "", "## محضر الجلسة"]
        last_header = None
        for c in self.contributions:
            if c.stage in ("plan", "verdict"):
                continue
            header = f"### الجولة {c.round} — {stage_titles.get(c.stage, c.stage)}"
            if header != last_header:
                lines += ["", header]
                last_header = header
            conf = f" · الثقة {c.confidence}%" if c.confidence is not None else ""
            lines += ["", f"#### {c.member}{conf}", "", c.text or "", c.note]
        u = self.usage()
        lines += [
            "", "---", "",
            f"_الاستدعاءات: {u['calls']} · رموز الإدخال: {u['input_tokens']:,} · رموز الإخراج: {u['output_tokens']:,}"
            f" · من التخزين المؤقت: {u['cache_read_tokens']:,} · مداخلات متعذرة: {u['failed_calls']}_",
        ]
        return "\n".join(x for x in lines if x is not None)


# ═══════════════════ المحرك ═══════════════════

class CouncilEngine:
    """يدير جلسة كاملة لمجلس العباقرة.

    model:          نموذج الأدوار الحاكمة (التشكيل، الفريق الأحمر، التدقيق، الحكم).
    member_model:   نموذج أعضاء اللجنة (افتراضيًا نفس model).
    effort:         عمق تفكير الأدوار الحاكمة؛ member_effort لأعضاء اللجنة.
    use_fallbacks:  إعادة تشغيل الطلب المرفوض على نموذج بديل من جهة الخادم
                    (متاح على Claude API مباشرة؛ أوقفه على Bedrock/Vertex/Foundry).
    """

    def __init__(self, council: Council | None = None, client=None, *,
                 model: str = DEFAULT_MODEL, member_model: str | None = None,
                 effort: str = "high", member_effort: str | None = None, plan_effort: str = "medium",
                 max_concurrency: int = 6, use_fallbacks: bool = True, digest_chars: int = 2500,
                 member_max_tokens: int = 32000, verdict_max_tokens: int = 64000,
                 on_event: Callable[[str, str], None] | None = None):
        self.council = council or build_council()
        if client is None:
            if anthropic is None:
                raise RuntimeError("حزمة anthropic غير مثبتة: pip install anthropic")
            client = anthropic.AsyncAnthropic()
        self.client = client
        self.model = model
        self.member_model = member_model or model
        self.effort = effort
        self.member_effort = member_effort or effort
        self.plan_effort = plan_effort
        self.max_concurrency = max_concurrency
        self.use_fallbacks = use_fallbacks
        self.digest_chars = digest_chars
        self.member_max_tokens = member_max_tokens
        self.verdict_max_tokens = verdict_max_tokens
        self.on_event = on_event
        self._sem: asyncio.Semaphore | None = None

    def _emit(self, stage: str, message: str) -> None:
        if self.on_event:
            self.on_event(stage, message)

    async def _ask(self, expert: Expert, user_text: str, *, stage: str, round_no: int,
                   model: str | None = None, effort: str | None = None,
                   max_tokens: int | None = None, output_format: dict | None = None) -> Contribution:
        output_config: dict = {"effort": effort or self.member_effort}
        if output_format:
            output_config["format"] = output_format
        params = dict(
            model=model or self.member_model,
            max_tokens=max_tokens or self.member_max_tokens,
            # برومبت العضو ثابت تمامًا، فيُخزَّن مؤقتًا ويُعاد استخدامه في جولات المراجعة
            system=[{"type": "text", "text": expert.prompt, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": user_text}],
            thinking={"type": "adaptive"},
            output_config=output_config,
        )
        base = dict(stage=stage, round=round_no, member_id=expert.id, member=expert.display_name)
        if self._sem is None:
            self._sem = asyncio.Semaphore(self.max_concurrency)
        async with self._sem:
            try:
                if self.use_fallbacks:
                    ctx = self.client.beta.messages.stream(**params, betas=[FALLBACK_BETA], fallbacks="default")
                else:
                    ctx = self.client.messages.stream(**params)
                async with ctx as stream:
                    msg = await stream.get_final_message()
            except _RECOVERABLE as exc:
                return Contribution(**base, text="", error=f"{type(exc).__name__}: {exc}")

        text = "".join(b.text for b in msg.content if b.type == "text").strip()
        if msg.stop_reason == "refusal":
            text = ""  # المداخلة المرفوضة أثناء البث تُهمل
        usage = msg.usage
        return Contribution(
            **base, text=text, confidence=extract_confidence(text), stop_reason=msg.stop_reason,
            model=getattr(msg, "model", None),
            input_tokens=getattr(usage, "input_tokens", 0) or 0,
            output_tokens=getattr(usage, "output_tokens", 0) or 0,
            cache_read_tokens=getattr(usage, "cache_read_input_tokens", 0) or 0,
        )

    # ── التشكيل ──
    def local_plan(self, question: str, n_elite: int, max_domains: int = 4) -> Plan:
        panel = self.council.select_panel(question, n_elite=n_elite, n_scholars=0)
        domains = panel.domains[:max_domains]
        return Plan(
            complexity="complicated", core_question=question, subquestions=[],
            domains=domains, elite=[e.id for e in panel.elite],
            missing_perspective="", source="local",
        )

    async def plan(self, question: str, n_elite: int, max_domains: int = 4) -> tuple[Plan, Contribution]:
        chair = self.council.governing()["chair"]
        members = [e for e in self.council.elite.values() if e.role == "member"]
        schema = {
            "type": "object",
            "properties": {
                "complexity": {"type": "string", "enum": list(COMPLEXITY_LABELS)},
                "core_question": {"type": "string"},
                "subquestions": {"type": "array", "items": {"type": "string"}},
                "domains": {"type": "array", "items": {"type": "string", "enum": list(DOMAINS)}},
                "elite": {"type": "array", "items": {"type": "string", "enum": [e.id for e in members]}},
                "missing_perspective": {"type": "string"},
            },
            "required": ["complexity", "core_question", "subquestions", "domains", "elite", "missing_perspective"],
            "additionalProperties": False,
        }
        user = PLAN_TEMPLATE.format(
            question=question,
            domains="\n".join(f"- {k}: {d.name}" for k, d in DOMAINS.items()),
            elite="\n".join(f"- {e.id}: {e.name} — {e.title}" for e in members),
            max_domains=max_domains, n_elite=n_elite,
        )
        c = await self._ask(chair, user, stage="plan", round_no=0, model=self.model,
                            effort=self.plan_effort, max_tokens=16000,
                            output_format={"type": "json_schema", "schema": schema})
        data = None
        if c.ok and c.stop_reason == "end_turn":
            try:
                data = json.loads(c.text)
            except json.JSONDecodeError:
                data = None
        if not data or not data.get("domains"):
            return self.local_plan(question, n_elite, max_domains), c
        return Plan(
            complexity=data["complexity"],
            core_question=data["core_question"],
            subquestions=list(data["subquestions"])[:6],
            domains=list(dict.fromkeys(data["domains"]))[:max_domains],
            elite=list(dict.fromkeys(data["elite"]))[:n_elite],
            missing_perspective=data["missing_perspective"],
            source="llm",
        ), c

    # ── أدوات النصوص ──
    @staticmethod
    def _brief(question: str, plan: Plan) -> str:
        subs = "\n".join(f"  {i}. {s}" for i, s in enumerate(plan.subquestions, 1)) or "  (لم تُحدد)"
        return BRIEF_TEMPLATE.format(
            question=question,
            complexity=COMPLEXITY_LABELS.get(plan.complexity, plan.complexity),
            core=plan.core_question, subs=subs,
            missing=plan.missing_perspective or "(لم يُحدد)",
        )

    def _digest(self, members: list[Expert], current: dict[str, Contribution],
                limit: int | None = None, exclude: str | None = None) -> str:
        blocks = []
        for m in members:
            c = current.get(m.id)
            if m.id == exclude or c is None or not c.ok:
                continue
            text = c.text
            if limit and len(text) > limit:
                text = text[:limit].rstrip() + " …[مختصر]"
            conf = f"{c.confidence}%" if c.confidence is not None else "غير معلنة"
            blocks.append(
                f'<opinion member="{m.display_name}" title="{m.title}" mood="{m.psych.name}" confidence="{conf}">\n'
                f"{text}\n</opinion>"
            )
        return "\n\n".join(blocks) or "(لا توجد مداخلات)"

    # ── الجلسة الكاملة ──
    async def convene(self, question: str, *, n_elite: int = 4, n_scholars: int = 6,
                      debate_rounds: int = 1, routing: str = "llm", seed: int | None = None) -> Session:
        session = Session(question=question)
        gov = self.council.governing()

        self._emit("plan", "رئيس المجلس يحلل المسألة ويشكّل اللجنة...")
        if routing == "llm":
            plan, plan_call = await self.plan(question, n_elite)
            session.contributions.append(plan_call)
        else:
            plan = self.local_plan(question, n_elite)
        session.plan = plan

        panel = self.council.select_panel(
            question, n_elite=n_elite, n_scholars=n_scholars,
            domains=plan.domains or None, elite_ids=plan.elite or None, seed=seed,
        )
        members = panel.members
        session.panel_ids = [m.id for m in members]
        self._emit("panel", "اللجنة: " + "، ".join(m.display_name for m in members))

        brief = self._brief(question, plan)
        self._emit("opinion", f"الجولة 1: {len(members)} عضوًا يفكرون باستقلال...")
        opinions = await asyncio.gather(*(
            self._ask(m, OPINION_TEMPLATE.format(brief=brief), stage="opinion", round_no=1)
            for m in members
        ))
        session.contributions += opinions
        current = {c.member_id: c for c in opinions}

        critique_text = verification_text = "(لم تُعقد جولة جدل)"
        for r in range(1, debate_rounds + 1):
            digest = self._digest(members, current)
            self._emit("debate", f"جولة الجدل {r}: الفريق الأحمر والمدققة يفحصان الآراء...")
            critique, verification = await asyncio.gather(
                self._ask(gov["red_team"], RED_TEAM_TEMPLATE.format(round=r, brief=brief, digest=digest),
                          stage="red_team", round_no=r, model=self.model, effort=self.effort),
                self._ask(gov["verifier"], VERIFY_TEMPLATE.format(round=r, brief=brief, digest=digest),
                          stage="verification", round_no=r, model=self.model, effort=self.effort),
            )
            session.contributions += [critique, verification]
            critique_text = critique.text or critique.note
            verification_text = verification.text or verification.note

            self._emit("revision", f"جولة الجدل {r}: الأعضاء يراجعون مواقفهم...")
            revisions = await asyncio.gather(*(
                self._ask(m, REVISION_TEMPLATE.format(
                    round=r + 1, brief=brief,
                    own=current[m.id].text or "(تعذّرت مداخلتك السابقة؛ قدّم رأيك الآن)",
                    others=self._digest(members, current, limit=self.digest_chars, exclude=m.id),
                    critique=critique_text, verification=verification_text,
                ), stage="revision", round_no=r + 1)
                for m in members
            ))
            session.contributions += revisions
            for c in revisions:
                if c.ok:  # إن تعذرت المراجعة يبقى الرأي السابق
                    current[c.member_id] = c

        self._emit("verdict", "المُركِّبة تنسج حكم المجلس...")
        verdict = await self._ask(
            gov["synthesizer"],
            VERDICT_TEMPLATE.format(brief=brief, digest=self._digest(members, current),
                                    critique=critique_text, verification=verification_text),
            stage="verdict", round_no=debate_rounds + 2, model=self.model,
            effort=self.effort, max_tokens=self.verdict_max_tokens,
        )
        session.contributions.append(verdict)
        session.verdict = verdict.text
        session.finished_at = time.time()
        self._emit("done", "اكتملت الجلسة.")
        return session

    async def ask_member(self, member_id: str, question: str, *, effort: str | None = None) -> Contribution:
        """استشارة عضو واحد مباشرة (دون جلسة كاملة)."""
        expert = self.council.get(member_id)
        return await self._ask(expert, question, stage="opinion", round_no=1,
                               model=self.member_model, effort=effort)
