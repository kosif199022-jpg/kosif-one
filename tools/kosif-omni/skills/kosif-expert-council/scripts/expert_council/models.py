"""نماذج البيانات الأساسية لمجلس العباقرة.

كل عضو في المجلس (من الهيئة العليا أو من هيئة العلماء الألف) هو كائن ``Expert``
يُبنى من مكوّنات قابلة لإعادة التركيب: قدرات خارقة ``Power``، وحالة نفسية
``PsychState``، وتخصص معرفي ``Domain``، ومدرسة فكرية ``School``.
"""

from __future__ import annotations

from dataclasses import dataclass, field

# مؤشرات القدرة الست التي تُقاس بها عقول المجلس (من 1 إلى 10)
TRAIT_NAMES: dict[str, str] = {
    "depth": "العمق",
    "creativity": "الإبداع",
    "rigor": "الصرامة",
    "boldness": "الجرأة",
    "empathy": "التعاطف",
    "speed": "السرعة",
}

Traits = tuple[tuple[str, int], ...]

# العوامل الخمسة الكبرى للشخصية (دليل كامبريدج لعلم نفس الشخصية) بترتيب OCEAN
BIG_FIVE_NAMES = ("الانفتاح", "الضمير الحي", "الانبساط", "المقبولية", "العصابية")
_BIG_FIVE_LEVELS = {2: "مرتفع جدًا", 1: "مرتفع", 0: "متوسط", -1: "منخفض", -2: "منخفض جدًا"}


def B5(o: int, c: int, e: int, a: int, n: int) -> tuple[int, ...]:
    """ملف تقريبي في العوامل الخمسة: من -2 (منخفض جدًا) إلى 2 (مرتفع جدًا)."""
    values = (o, c, e, a, n)
    if any(v not in _BIG_FIVE_LEVELS for v in values):
        raise ValueError(values)
    return values


def big_five_text(profile: tuple[int, ...]) -> str:
    return " · ".join(f"{name}: {_BIG_FIVE_LEVELS[v]}" for name, v in zip(BIG_FIVE_NAMES, profile))


def T(**mods: int) -> Traits:
    """يحوّل معدِّلات المؤشرات إلى صيغة ثابتة قابلة للتجزئة."""
    unknown = set(mods) - set(TRAIT_NAMES)
    if unknown:
        raise ValueError(f"مؤشرات غير معروفة: {unknown}")
    return tuple(sorted(mods.items()))


@dataclass(frozen=True)
class Power:
    """قدرة فكرية خارقة: منهج تفكير منضبط له بروتوكول تشغيل ومخرَج مميز."""

    key: str
    name: str
    description: str
    protocol: tuple[str, ...]
    laqab: str = ""
    output: str = ""
    traits: Traits = ()
    source: str = ""  # المرجع الذي استُمدت منه القدرة (إن وُجد)


@dataclass(frozen=True)
class PsychState:
    """حالة نفسية / مزاج ذهني يلوّن طريقة التفكير بقوة ونقطة عمياء وآلية تعويض."""

    key: str
    name: str
    essence: str
    cognition: str
    strength: str
    blind_spot: str
    compensation: str
    voice: str
    question: str
    traits: Traits = ()
    big_five: tuple[int, ...] = ()


@dataclass(frozen=True)
class Domain:
    """تخصص معرفي في هيئة العلماء."""

    key: str
    name: str
    group: str
    blurb: str
    core: tuple[str, ...]
    questions: tuple[str, ...]
    keywords: tuple[str, ...]


@dataclass(frozen=True)
class School:
    """مدرسة فكرية تحدد المنهج العام للعالِم."""

    key: str
    name: str
    method: str
    motto: str


@dataclass(frozen=True)
class Expert:
    """عضو في مجلس العباقرة."""

    id: str
    name: str
    laqab: str
    title: str
    tier: str  # "elite" | "scholar"
    role: str  # "chair" | "red_team" | "verifier" | "synthesizer" | "member"
    domains: tuple[str, ...]
    psych: PsychState
    powers: tuple[Power, ...]
    essence: str
    mental_models: tuple[str, ...] = ()
    method: tuple[str, ...] = ()
    questions: tuple[str, ...] = ()
    deliverables: tuple[str, ...] = ()
    limits: tuple[str, ...] = ()
    motto: str = ""
    keywords: tuple[str, ...] = ()
    school: School | None = None
    seat: int = 0
    gender: str = "m"
    traits: Traits = field(default=())
    description: str = ""

    @property
    def trait_map(self) -> dict[str, int]:
        return dict(self.traits)

    @property
    def genius_index(self) -> int:
        """مؤشر العبقرية المركّب (من 100)."""
        values = list(self.trait_map.values()) or [0]
        return round(sum(values) / (len(values) * 10) * 100)

    @property
    def display_name(self) -> str:
        return f"{self.name} «{self.laqab}»"

    @property
    def references(self) -> list:
        """مراجع مكتبة المجلس التي يتقنها العضو."""
        from .library import references_for

        return references_for(self)

    @property
    def prompt(self) -> str:
        """البرومبت الكامل للعضو (يُبنى عند الطلب)."""
        from .prompts import render_prompt

        return render_prompt(self)

    def to_dict(self, with_prompt: bool = False) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "laqab": self.laqab,
            "title": self.title,
            "tier": self.tier,
            "role": self.role,
            "seat": self.seat,
            "domains": list(self.domains),
            "psych_state": {"key": self.psych.key, "name": self.psych.name},
            "powers": [{"name": p.name, "laqab": p.laqab} for p in self.powers],
            "school": self.school.name if self.school else None,
            "references": [r.title for r in self.references],
            "traits": {TRAIT_NAMES[k]: v for k, v in self.traits},
            "genius_index": self.genius_index,
            "motto": self.motto,
            "description": self.description,
        }
        if with_prompt:
            data["prompt"] = self.prompt
        return data


def clip(value: int, low: int = 1, high: int = 10) -> int:
    return max(low, min(high, value))


def combine_traits(base: int, *mod_sets: Traits, jitter: dict[str, int] | None = None,
                   low: int = 1, high: int = 10) -> Traits:
    """يجمع المؤشر الأساسي مع معدِّلات القدرات والحالة النفسية."""
    totals = {k: base for k in TRAIT_NAMES}
    for mods in mod_sets:
        for k, v in mods:
            totals[k] += v
    for k, v in (jitter or {}).items():
        totals[k] += v
    return tuple((k, clip(v, low, high)) for k, v in totals.items())
