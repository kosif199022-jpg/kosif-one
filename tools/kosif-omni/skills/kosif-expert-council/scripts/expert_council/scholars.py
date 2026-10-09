"""مولّد هيئة العلماء الألف.

كل عالِم تركيبة فريدة من:
  تخصص (51) × قدرة خارقة أولى (44) × قدرة ثانية × حالة نفسية (24) × مدرسة فكرية (10)

قواعد التوزيع:
- 19 أو 20 عالِمًا لكل تخصص (1000 عضو موزعون على 51 تخصصًا).
- داخل التخصص الواحد لا تتكرر الحالة النفسية ولا القدرة الأولى، فكل عالِم
  في التخصص نفسه يفكر بطريقة مختلفة جذريًا عن زملائه.
- القدرة الثانية تختلف دائمًا عن الأولى.
- التوليد حتمي (seed ثابت): المجلس نفسه في كل تشغيل، والأسماء فريدة.
"""

from __future__ import annotations

import random
from dataclasses import replace

from .descriptions import describe
from .domains import DOMAINS, SCHOOLS
from .elite import ELITE
from .models import Expert, combine_traits
from .psych_states import PSYCH_STATES
from .superpowers import SUPERPOWERS

FIRST_NAMES_M = (
    "أحمد", "محمد", "عمر", "علي", "خالد", "يوسف", "إبراهيم", "حسن", "حسين", "طارق",
    "سامي", "فيصل", "ماجد", "نزار", "وليد", "أنس", "بلال", "زياد", "رامي", "كريم",
    "هادي", "جاسم", "منصور", "ناصر", "باسل", "أيمن", "عادل", "معاذ", "مالك", "سلمان",
    "عمّار", "صالح", "مازن", "رائد", "نبيل", "فراس", "غسان", "قاسم", "حمزة", "إياد",
)
FIRST_NAMES_F = (
    "فاطمة", "مريم", "عائشة", "سارة", "نور", "ليلى", "هدى", "سلمى", "رنا", "دانة",
    "لينا", "ريم", "جود", "غادة", "أسماء", "خديجة", "زينب", "هند", "رغد", "لجين",
    "شهد", "نوف", "منيرة", "بشرى", "سمر", "رحاب", "إيمان", "وفاء", "أمل", "حنان",
    "ديما", "يارا", "تالا", "رهف", "بتول", "آمنة", "صفية", "رقية", "جمانة", "سوسن",
)
NISBAS = (
    "الأندلسي", "القرطبي", "البغدادي", "الدمشقي", "الحلبي", "المقدسي", "القاهري", "الإسكندراني",
    "القيرواني", "الفاسي", "المراكشي", "التلمساني", "الشنقيطي", "الصنعاني", "الحضرمي", "العماني",
    "البحريني", "الكويتي", "النجدي", "الحجازي", "المكي", "المدني", "الطائفي", "الأحسائي",
    "البصري", "الكوفي", "الموصلي", "السامرائي", "الطرابلسي", "البيروتي", "النابلسي", "الخليلي",
    "الغزّي", "الحمصي", "اللاذقي", "الأسواني", "الدمياطي", "الوهراني", "البجائي", "النوبي",
)
ACADEMIC_TITLES = ("د.", "د.", "د.", "أ.د.")

# الصيغ المؤنثة لألقاب القدرات
LAQAB_F = {
    "first_principles": "مفكِّكة الذرّات",
    "scenario_simulation": "عرّافة السيناريوهات",
    "hidden_patterns": "قارئة الأنماط",
    "inversion": "قالبة المسائل",
    "systems_thinking": "مهندسة الأنظمة الحية",
    "bayesian_calibration": "ميزان الاحتمالات",
    "analogy_transfer": "جسّارة المعارف",
    "adversary_simulation": "ظل الخصم",
    "second_order": "رائية العواقب",
    "fermi_estimation": "حاسبة المقادير",
    "dialectic_synthesis": "صائغة الأضداد",
    "edge_case_hunting": "صيّادة الاستثناءات",
    "essence_compression": "مقطِّرة الجوهر",
    "constraint_alchemy": "خيميائية القيود",
    "deep_time": "حارسة القرون",
    "incentive_engineering": "مهندسة الدوافع",
    "counterfactual": "راوية ما لم يكن",
    "model_lattice": "حائكة النماذج",
    "abductive_detective": "المحققة الاستدلالية",
    "causal_inference": "فاصلة السبب عن الصدفة",
    "leverage_points": "باحثة الرافعة",
    "perspective_multiplex": "ذات الألف عين",
    "optionality": "صانعة الخيارات",
    "fallacy_radar": "كاشفة الزيف",
    "scale_shifting": "متسلّقة المستويات",
    "reframing": "مُعيدة التأطير",
    "thought_experiments": "صانعة التجارب الذهنية",
    "emergence": "راصدة الانبثاق",
    "decision_architecture": "مهندسة القرار",
    "narrative_cognition": "ناسجة المعنى",
    "lateral_provocation": "صانعة القفزات",
    "concept_definition": "صانعة الحدود",
    "syllogistic_audit": "قاضية القياس",
    "plausible_logic": "مهندسة الاتساق",
    "convexity_vision": "مروّضة القيود",
    "abstraction_layers": "بانية الطبقات",
    "complexity_craft": "الحِرَفية البراغماتية",
    "generalization_guard": "حارسة التعميم",
    "debiasing_protocol": "مطهّرة القرار",
    "evidence_lineage": "متتبّعة الأثر",
    "conflict_engineering": "صانعة العقبات",
    "personality_profiling": "قارئة الطباع",
    "layered_production": "مهندسة الطبقات الإبداعية",
    "conversation_design": "مهندسة الحوار",
}


def _distribute(total: int, buckets: int) -> list[int]:
    base, extra = divmod(total, buckets)
    return [base + (1 if i < extra else 0) for i in range(buckets)]


def _balanced_sample(rng: random.Random, items: list, n: int) -> list:
    """عيّنة بلا تكرار، وإن زاد المطلوب على المتاح تُكرر الدورة بترتيب جديد."""
    out: list = []
    while len(out) < n:
        pool = items[:]
        rng.shuffle(pool)
        out.extend(pool[: n - len(out)])
    return out


def _unique_names(rng: random.Random, count: int) -> list[tuple[str, str]]:
    """أسماء فريدة: (الاسم الكامل، الجنس)، لا تتطابق مع أسماء الهيئة العليا."""
    reserved = {e.name.split(" ", 1)[-1] for e in ELITE.values()}
    combos = [(f, "m") for f in FIRST_NAMES_M] + [(f, "f") for f in FIRST_NAMES_F]
    pairs = [
        (first, gender, nisba) for first, gender in combos for nisba in NISBAS
        if f"{first} {nisba}" not in reserved
    ]
    if count > len(pairs):
        raise ValueError(f"لا تكفي الأسماء لتوليد {count} عضو (الحد {len(pairs)})")
    chosen = rng.sample(pairs, count)
    return [(f"{first} {nisba}", gender) for first, gender, nisba in chosen]


def build_scholars(count: int = 1000, seed: int = 1000) -> list[Expert]:
    rng = random.Random(seed)
    domains = list(DOMAINS.values())
    psychs = list(PSYCH_STATES.values())
    powers = list(SUPERPOWERS.values())
    schools = list(SCHOOLS.values())
    names = _unique_names(rng, count)

    scholars: list[Expert] = []
    seat = 0
    for domain, n in zip(domains, _distribute(count, len(domains))):
        domain_psychs = _balanced_sample(rng, psychs, n)
        domain_primaries = _balanced_sample(rng, powers, n)
        for psych, p1 in zip(domain_psychs, domain_primaries):
            p2 = rng.choice([p for p in powers if p.key != p1.key])
            school = rng.choice(schools)
            focus = rng.choice(domain.core)
            name, gender = names[seat]
            seat += 1

            def g(m: str, f: str) -> str:
                return f if gender == "f" else m

            laqab = LAQAB_F.get(p1.key, p1.laqab) if gender == "f" else p1.laqab
            title_prefix = rng.choice(ACADEMIC_TITLES)
            essence = (
                f"{g('عالِم', 'عالِمة')} في {domain.name}، {g('تخصصه', 'تخصصها')} الدقيق: {focus}. "
                f"{domain.blurb} "
                f"{g('يمتلك', 'تمتلك')} قدرة «{p1.name}» التي {g('منحته', 'منحتها')} لقب «{laqab}»، "
                f"{g('ويعززها', 'وتعززها')} بقدرة «{p2.name}». "
                f"{g('مزاجه', 'مزاجها')} الذهني «{psych.name}» {g('يمنحه', 'يمنحها')}: {psych.strength} "
                f"{g('ينتمي', 'تنتمي')} إلى مدرسة «{school.name}»، {g('وقاعدته', 'وقاعدتها')}: «{school.motto}»"
            )
            jitter = {k: rng.randint(-1, 1) for k in ("depth", "creativity", "rigor", "boldness", "empathy", "speed")}
            expert = Expert(
                id=f"S{seat:04d}",
                name=f"{title_prefix} {name}",
                laqab=laqab,
                title=f"{g('عالِم', 'عالِمة')} {domain.name}",
                tier="scholar",
                role="member",
                domains=(domain.key,),
                psych=psych,
                powers=(p1, p2),
                essence=essence,
                method=(
                    *p1.protocol,
                    *p2.protocol[:2],
                    f"قبل أن تختم، طبّق آلية تعويض مزاجك: {psych.compensation}",
                ),
                questions=(*domain.questions, psych.question),
                deliverables=(p1.output, p2.output),
                limits=(f"اختصاصك {domain.name}؛ إن خرج السؤال عنه فقدّم زاويتك منه فقط وصرّح بحدود اختصاصك.",),
                motto=school.motto,
                school=school,
                seat=seat,
                gender=gender,
                traits=combine_traits(6, p1.traits, p2.traits, psych.traits, jitter=jitter, low=3, high=10),
            )
            scholars.append(replace(expert, description=describe(expert)))
    return scholars
