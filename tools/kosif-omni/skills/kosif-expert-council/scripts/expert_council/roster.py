"""سجل المجلس الكامل: البحث، والتوجيه المحلي، واختيار اللجان، والتصدير."""

from __future__ import annotations

import json
import random
import re
from collections import Counter
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

from .domains import DOMAINS
from .elite import ELITE, GOVERNING_ROLES, role_member
from .models import Expert
from .scholars import build_scholars

# أعضاء يُستدعون حين لا يدل السؤال على تخصص واضح
_GENERALIST_ELITE = ("E18", "E14", "E15", "E12", "E13")

_TASHKEEL = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")


def normalize(text: str) -> str:
    """توحيد النص العربي للمطابقة: حذف التشكيل والتطويل وتوحيد الألف والياء والتاء المربوطة."""
    text = _TASHKEEL.sub("", text.lower())
    text = re.sub("[إأآٱ]", "ا", text)
    return text.replace("ى", "ي").replace("ة", "ه")


def _hit(keyword: str, text: str) -> bool:
    kw = normalize(keyword)
    if kw.isascii():
        tail = r"\b" if len(kw) <= 3 else ""
        return re.search(rf"\b{re.escape(kw)}{tail}", text) is not None
    return kw in text


@dataclass
class Panel:
    """لجنة مختارة لمسألة بعينها."""

    domains: list[str]
    elite: list[Expert]
    scholars: list[Expert]
    governing: dict[str, Expert] = field(default_factory=dict)

    @property
    def members(self) -> list[Expert]:
        return self.elite + self.scholars


class Council:
    def __init__(self, elite: dict[str, Expert], scholars: list[Expert]):
        self.elite = elite
        self.scholars = scholars
        self.members: dict[str, Expert] = {**elite, **{s.id: s for s in scholars}}
        self._by_domain: dict[str, list[Expert]] = {}
        for s in scholars:
            for d in s.domains:
                self._by_domain.setdefault(d, []).append(s)

    # ── الوصول ──
    def __len__(self) -> int:
        return len(self.members)

    def get(self, member_id: str) -> Expert:
        return self.members[member_id.upper()]

    def governing(self) -> dict[str, Expert]:
        return {role: role_member(role) for role in GOVERNING_ROLES}

    def scholars_in(self, domain_key: str) -> list[Expert]:
        return list(self._by_domain.get(domain_key, []))

    def search(self, text: str, limit: int = 20) -> list[Expert]:
        q = normalize(text)
        hits = [
            m for m in self.members.values()
            if q in normalize(" ".join((m.name, m.laqab, m.title, m.psych.name, *(p.name for p in m.powers))))
        ]
        return hits[:limit]

    # ── التوجيه المحلي (بدون نموذج لغوي) ──
    def route_domains(self, question: str, max_domains: int = 4) -> list[tuple[str, float]]:
        text = normalize(question)
        scores: list[tuple[str, float]] = []
        for key, d in DOMAINS.items():
            score = sum(1.0 + 0.5 * (" " in kw) for kw in d.keywords if _hit(kw, text))
            if score:
                scores.append((key, score))
        scores.sort(key=lambda kv: -kv[1])
        return scores[:max_domains]

    def route_elite(self, question: str, domain_scores: list[tuple[str, float]], n: int) -> list[Expert]:
        text = normalize(question)
        dscore = dict(domain_scores)
        ranked: list[tuple[float, Expert]] = []
        for e in self.elite.values():
            if e.role != "member":
                continue
            # التخصص الأول هو الأثقل وزنًا، ثم يتناقص الوزن: 1، ½، ⅓، ¼
            score = sum(dscore.get(d, 0.0) / (i + 1) for i, d in enumerate(e.domains))
            score += 1.5 * sum(1 for kw in e.keywords if _hit(kw, text))
            if score >= 0.5:
                ranked.append((score, e))
        ranked.sort(key=lambda se: (-se[0], se[1].id))
        chosen = [e for _, e in ranked[:n]]
        for eid in _GENERALIST_ELITE:
            if len(chosen) >= min(n, 2):
                break
            if self.elite[eid] not in chosen:
                chosen.append(self.elite[eid])
        return chosen

    # ── اختيار العلماء بأقصى تنوع ذهني ──
    def pick_scholars(self, domains: list[str], n: int, avoid_psych: set[str] | None = None,
                      seed: int | None = None) -> list[Expert]:
        if not domains or n <= 0:
            return []
        rng = random.Random(seed)
        used_psych = set(avoid_psych or ())
        used_power: set[str] = set()
        chosen: list[Expert] = []
        pools = {d: self.scholars_in(d) for d in domains}
        for i in range(n):
            domain = domains[i % len(domains)]
            pool = [s for s in pools[domain] if s not in chosen] or [
                s for d in domains for s in pools[d] if s not in chosen
            ]
            if not pool:
                break

            def diversity(s: Expert) -> tuple:
                return (
                    (s.psych.key not in used_psych) * 3 + (s.powers[0].key not in used_power) * 2,
                    s.genius_index,
                    rng.random(),
                )

            best = max(pool, key=diversity)
            chosen.append(best)
            used_psych.add(best.psych.key)
            used_power.add(best.powers[0].key)
        return chosen

    def select_panel(self, question: str = "", *, n_elite: int = 4, n_scholars: int = 6,
                     domains: list[str] | None = None, elite_ids: list[str] | None = None,
                     seed: int | None = None) -> Panel:
        """يشكّل لجنة لمسألة: أعضاء من الهيئة العليا + علماء متنوعو الأمزجة."""
        if domains is None:
            domains = [k for k, _ in self.route_domains(question)]
        domain_scores = [(d, 1.0) for d in domains]
        if elite_ids is not None:
            elite = [self.get(i) for i in elite_ids][:n_elite]
        else:
            elite = self.route_elite(question, domain_scores or self.route_domains(question), n_elite)
        if not domains:
            # لا تخصص ظاهر: نأخذ تخصصات أعضاء الهيئة العليا المختارين
            domains = list(dict.fromkeys(d for e in elite for d in e.domains[:1]))
        governing = self.governing()
        avoid = {e.psych.key for e in elite} | {g.psych.key for g in governing.values()}
        scholars = self.pick_scholars(domains, n_scholars, avoid_psych=avoid, seed=seed)
        return Panel(domains=domains, elite=elite, scholars=scholars, governing=governing)

    # ── الإحصاءات والتحقق ──
    def stats(self) -> dict:
        combos = Counter((s.domains[0], s.psych.key, s.powers[0].key) for s in self.scholars)
        names = Counter(m.name.split(" ", 1)[-1] for m in self.members.values())
        return {
            "elite": len(self.elite),
            "scholars": len(self.scholars),
            "total": len(self.members),
            "domains": len(self._by_domain),
            "scholars_per_domain": sorted({len(v) for v in self._by_domain.values()}),
            "psych_states_used": len({m.psych.key for m in self.members.values()}),
            "powers_used": len({p.key for s in self.scholars for p in s.powers}),
            "duplicate_profiles": sum(c - 1 for c in combos.values() if c > 1),
            "duplicate_names": sum(c - 1 for c in names.values() if c > 1),
            "female_members": sum(m.gender == "f" for m in self.members.values()),
        }

    # ── التصدير ──
    def export(self, out_dir: str | Path, with_prompts: bool = False) -> list[Path]:
        out = Path(out_dir)
        out.mkdir(parents=True, exist_ok=True)
        written: list[Path] = []

        roster = {
            "name": "مجلس العباقرة",
            "stats": self.stats(),
            "elite": [e.to_dict(with_prompt=with_prompts) for e in self.elite.values()],
            "scholars": [s.to_dict(with_prompt=with_prompts) for s in self.scholars],
        }
        p = out / "council_roster.json"
        p.write_text(json.dumps(roster, ensure_ascii=False, indent=1), encoding="utf-8")
        written.append(p)

        lines = ["# دليل مجلس العباقرة", "", "## الهيئة العليا", ""]
        for e in self.elite.values():
            lines += [f"### {e.id} · {e.name} — «{e.laqab}»", "", "```", e.description, "```", ""]
        lines += ["## هيئة العلماء الألف", ""]
        for d in DOMAINS.values():
            lines += [f"### {d.name}", ""]
            for s in self.scholars_in(d.key):
                lines.append(
                    f"- **{s.id} · {s.name}** «{s.laqab}» — {s.psych.name} · "
                    f"{s.powers[0].name} + {s.powers[1].name} · {s.school.name} · "
                    f"مؤشر العبقرية {s.genius_index}"
                )
            lines.append("")
        p = out / "council_catalog.md"
        p.write_text("\n".join(lines), encoding="utf-8")
        written.append(p)

        prompts = ["# برومبتات الهيئة العليا", ""]
        for e in self.elite.values():
            prompts += [f"## {e.id} · {e.name}", "", "```text", e.prompt, "```", ""]
        p = out / "elite_prompts.md"
        p.write_text("\n".join(prompts), encoding="utf-8")
        written.append(p)
        return written


@lru_cache(maxsize=4)
def build_council(scholar_count: int = 1000, seed: int = 1000) -> Council:
    """يبني المجلس الكامل (36 + الألف). النتيجة مخزنة لأن البناء حتمي."""
    return Council(ELITE, build_scholars(scholar_count, seed))
