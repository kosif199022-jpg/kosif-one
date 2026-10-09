"""مجلس العباقرة: 36 عقلًا في الهيئة العليا + 1000 عالِم، لكلٍّ منهم قدرات فكرية
خارقة مختلفة وحالة نفسية مختلفة وبرومبت كامل خاص به.

الاستخدام السريع:
    from expert_council import build_council
    council = build_council()
    expert = council.get("E04")
    print(expert.description)   # الوصف التفصيلي
    print(expert.prompt)        # البرومبت الكامل (system prompt)

تشغيل جلسة كاملة عبر Claude:
    from expert_council.engine import CouncilEngine
"""

from .domains import DOMAINS, SCHOOLS
from .elite import ELITE
from .models import Domain, Expert, Power, PsychState, School
from .prompts import CONSTITUTION, render_prompt
from .psych_states import PSYCH_STATES
from .roster import Council, Panel, build_council
from .superpowers import SUPERPOWERS

__all__ = [
    "CONSTITUTION", "DOMAINS", "ELITE", "PSYCH_STATES", "SCHOOLS", "SUPERPOWERS",
    "Council", "Domain", "Expert", "Panel", "Power", "PsychState", "School",
    "build_council", "render_prompt",
]
