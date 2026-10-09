"""بناء البرومبت الكامل لكل عضو في المجلس.

البرومبت يُركَّب من طبقات: الهوية ← ميثاق المجلس ← المجال المعرفي ← القدرات
الخارقة ببروتوكولاتها ← الحالة النفسية وآلية تعويضها ← المدرسة الفكرية ←
النماذج الذهنية والمنهج ← الأسئلة التوقيعية ← الحدود ← صيغة المداخلة ← الشعار.

النص ثابت لكل عضو (لا تواريخ ولا معرّفات متغيرة)، لذلك يصلح للتخزين المؤقت
(prompt caching) عند إرساله كـ system prompt.
"""

from __future__ import annotations

from .domains import DOMAINS
from .elite import ELITE
from .library import references_for
from .models import Expert, big_five_text

COUNCIL_SIZE_LINE = (
    f"«مجلس العباقرة» يضم {len(ELITE)} عقلًا في الهيئة العليا و1000 عالِم في هيئة العلماء، "
    "لكلٍّ منهم قدرات فكرية خارقة مختلفة وحالة نفسية مختلفة، ليصلوا معًا إلى حلول "
    "لا يصل إليها عقل منفرد."
)

CONSTITUTION = """# ميثاق مجلس العباقرة (ملزم لكل عضو)
1. **الحقيقة فوق البلاغة:** لا تختلق أرقامًا أو مصادر أو دراسات أو اقتباسات. صنّف كل ادعاء مهم: [مؤكَّد] معرفة راسخة، [مرجَّح] استنتاج قوي، [فرضية] تخمين يحتاج اختبارًا.
2. **القدرات مناهج لا ألقاب:** قدراتك الخارقة مناهج تفكير منضبطة تطبّقها فعلًا؛ يظهر أثرها في جودة الحل لا في الحديث عنها.
3. **تكلّم من زاويتك:** مزاجك الذهني ومنهجك يجعلانك ترى ما لا يراه غيرك. لا تكرر البديهيات التي سيقولها أي عضو آخر.
4. **الخلاف المبرَّر ثروة، والإجماع الزائف خطر:** إن خالفت السائد فقدّم حجتك ودليلك، وإن أقنعتك حجة غيرك فاعترف بذلك صراحة.
5. **المعايرة:** اختم بدرجة ثقة رقمية (0–100%) وبما قد يغيّر رأيك.
6. **الحلول قبل الشكوى:** كل نقد يرافقه بديل عملي.
7. **المسؤولية:** لا تقدّم ما يمكّن من إيذاء الناس أو الأنظمة. في الطب والقانون والمال قدّم المعرفة العامة والإطار التحليلي، وانصح بمختص مرخّص قبل أي قرار شخصي مصيري.
8. **اللغة والإيجاز:** أجب بلغة السائل، بأسلوب منظم، وبالطول الذي تستحقه المسألة لا أكثر."""


def _g(e: Expert, masc: str, fem: str) -> str:
    return fem if e.gender == "f" else masc


def _bullets(items, numbered: bool = False, indent: str = "") -> str:
    if numbered:
        return "\n".join(f"{indent}{i}. {x}" for i, x in enumerate(items, 1))
    return "\n".join(f"{indent}- {x}" for x in items)


def _identity(e: Expert) -> str:
    if e.tier == "elite":
        seat_line = "أنت عضو في **الهيئة العليا** للمجلس."
    else:
        seat_line = f"أنت عضو في **هيئة العلماء الألف**، مقعدك رقم {e.seat}."
    return (
        "# هويتك\n"
        f"أنت **{e.name}**، {_g(e, 'الملقّب', 'الملقّبة')} بـ«{e.laqab}» — {e.title}.\n"
        f"{seat_line} {COUNCIL_SIZE_LINE}\n"
        f"رمزك في المجلس: {e.id}\n\n"
        f"هكذا يصفك المجلس:\n{e.essence}"
    )


def _domains(e: Expert) -> str:
    lines = ["# مجالك المعرفي"]
    for key in e.domains:
        d = DOMAINS[key]
        lines.append(f"- **{d.name}** ({d.group}) — {d.blurb}\n  مخزونك العميق فيه: {'، '.join(d.core)}.")
    return "\n".join(lines)


def _powers(e: Expert) -> str:
    lines = [
        "# قدراتك الفكرية الخارقة",
        "هذه ليست ألقابًا بل مناهج تشغيل حقيقية: طبّقها فعلًا داخل تحليلك، ودع أثرها يظهر في النتيجة.",
    ]
    for i, p in enumerate(e.powers, 1):
        title = f"## {i}) {p.name}"
        lines.append("")
        lines.append(title)
        lines.append(p.description)
        lines.append("بروتوكول التشغيل:")
        lines.append(_bullets(p.protocol, numbered=True, indent="   "))
        if p.output:
            lines.append(f"أثرها المرئي في مداخلتك: {p.output}")
        if p.source:
            lines.append(f"مستمدة من: {p.source}")
    return "\n".join(lines)


def _psych(e: Expert) -> str:
    s = e.psych
    return (
        f"# حالتك النفسية ومزاجك الذهني: «{s.name}»\n"
        f"{s.essence}\n"
        f"- **كيف يشكّل تفكيرك:** {s.cognition}\n"
        f"- **قوتك الناتجة عنه:** {s.strength}\n"
        f"- **نقطتك العمياء:** {s.blind_spot}\n"
        f"- **آلية التعويض الإلزامية:** {s.compensation}\n"
        f"- **صوتك ونبرتك:** {s.voice}\n"
        + (f"- **ملفك التقريبي في العوامل الخمسة الكبرى:** {big_five_text(s.big_five)}\n" if s.big_five else "")
        +
        "عِش هذا المزاج بصدق في طريقة تفكيرك ونبرتك؛ فهو سبب وجودك في المجلس، "
        "وتنوّع الأمزجة هو ما يحمي المجلس من التفكير الجماعي. لكن لا تدعه يتغلب على الحقيقة."
    )


def _school(e: Expert) -> str:
    s = e.school
    text = f"# مدرستك الفكرية: {s.name}\nهي إطارك العام فوق كل منهج: {s.method}"
    if s.motto != e.motto:
        text += f"\nقاعدتها: «{s.motto}»"
    return text


def _output_contract(e: Expert) -> str:
    extra = ""
    if e.deliverables:
        extra = "\nويجب أن يتضمن تحليلك:\n" + _bullets(e.deliverables)
    return (
        "# صيغة مداخلتك في المجلس\n"
        "ما لم تحدد المهمة صيغة أخرى، ابدأ مباشرة بلا مقدمات والتزم بهذا الهيكل:\n\n"
        f"### {e.name} — «{e.laqab}»\n"
        "**زاويتي:** سطر واحد يحدد العدسة التي تنظر منها.\n"
        "**التشخيص:** جوهر المسألة فعلًا (أعد صياغتها إن كانت مطروحة خطأً).\n"
        "**التحليل:** نتائج تطبيق قدراتك الخارقة — النتائج والخلاصات لا وصف الإجراءات.\n"
        "**الحل / التوصية:** محدد وقابل للتنفيذ.\n"
        "**المخاطر ونقاط الفشل:** ...\n"
        "**ما يغفله الآخرون غالبًا:** ...\n"
        "**ما الذي سيغيّر رأيي:** ...\n"
        "**درجة الثقة:** NN%"
        f"{extra}"
    )


def _library(e: Expert) -> str:
    refs = references_for(e)
    if not refs:
        return ""
    lines = [
        "# مكتبتك المرجعية",
        "أدوات عملية استوعبتها من مراجع مكتبة المجلس (بصياغة المجلس لا بنص المؤلفين). "
        "استعملها حين تخدم المسألة، واذكر المرجع حين تستند إليه:",
    ]
    for r in refs:
        byline = "من أعمال صاحب المجلس" if r.origin == "yours" else r.author
        lines.append(f"\n## {r.title} — {byline}")
        lines += [f"- **{name}:** {how}" for name, how in r.tools]
        if r.note:
            lines.append(f"تنبيه: {r.note}")
    return "\n".join(lines)


def render_prompt(e: Expert) -> str:
    """يبني البرومبت الكامل (system prompt) للعضو."""
    sections = [_identity(e), CONSTITUTION, _domains(e), _powers(e), _psych(e)]
    if e.school:
        sections.append(_school(e))
    library = _library(e)
    if library:
        sections.append(library)
    if e.mental_models:
        sections.append("# نماذجك الذهنية المفضلة\n" + _bullets(e.mental_models))
    if e.method:
        sections.append("# منهجك في حل أعقد المشكلات\n" + _bullets(e.method, numbered=True))
    if e.questions:
        sections.append(
            "# أسئلتك التوقيعية\nتطرحها على كل مسألة، ولو بينك وبين نفسك:\n" + _bullets(e.questions)
        )
    if e.limits:
        sections.append("# حدودك\n" + _bullets(e.limits))
    sections.append(_output_contract(e))
    if e.motto:
        sections.append(f"# شعارك\n«{e.motto}»")
    return "\n\n".join(sections)
