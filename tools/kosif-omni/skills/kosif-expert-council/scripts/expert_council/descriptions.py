"""الوصف التفصيلي المقروء لكل عضو (للعرض في واجهة التطبيق)."""

from __future__ import annotations

from .domains import DOMAINS
from .models import TRAIT_NAMES, Expert, big_five_text


def _g(e: Expert, masc: str, fem: str) -> str:
    return fem if e.gender == "f" else masc


def describe(e: Expert) -> str:
    his = _g(e, "ه", "ها")
    if e.tier == "elite":
        tier = "عضو الهيئة العليا"
    else:
        tier = f"{_g(e, 'عضو', 'عضوة')} هيئة العلماء الألف — المقعد {e.seat}"

    parts = [
        f"{e.name} — «{e.laqab}»",
        f"{e.title} · {tier} · الرمز {e.id}",
        "",
        e.essence,
        "",
        f"المجالات: {' · '.join(DOMAINS[k].name for k in e.domains)}",
        "",
        f"قدرات{his} الفكرية الخارقة:",
    ]
    for p in e.powers:
        source = f" (مستمدة من: {p.source})" if p.source else ""
        parts.append(f"• {p.name}: {p.description}{source}")

    s = e.psych
    parts += [
        "",
        f"حالت{his} النفسية: «{s.name}» — {s.essence}",
        f"• القوة: {s.strength}",
        f"• النقطة العمياء: {s.blind_spot}",
        f"• آلية التعويض: {s.compensation}",
        f"• الأسلوب: {s.voice}",
    ]
    if s.big_five:
        parts.append(f"• العوامل الخمسة الكبرى (تقريبي): {big_five_text(s.big_five)}")

    if e.school:
        parts += ["", f"المدرسة الفكرية: {e.school.name} — {e.school.method}"]

    if e.mental_models:
        parts += ["", "النماذج الذهنية: " + "، ".join(e.mental_models)]

    from .library import references_for

    refs = references_for(e)
    if refs:
        parts += ["", "المكتبة المرجعية: " + "، ".join(r.title for r in refs)]

    traits = " · ".join(f"{TRAIT_NAMES[k]} {v}/10" for k, v in e.traits)
    parts += ["", f"مؤشرات القدرة: {traits}", f"مؤشر العبقرية: {e.genius_index}/100"]

    if e.motto:
        parts += [f"الشعار: «{e.motto}»"]
    return "\n".join(parts)
