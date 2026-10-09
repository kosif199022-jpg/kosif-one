#!/usr/bin/env python3
"""Pick a skill pack from the KOSIF Atlas for each of the 30 Swarm specialists → tools/swarm_skillpacks.json.

The Atlas is the embedded index of the public mirror github.com/kosif199022-jpg/kosif-atlas (skills/). For each
specialist, several concept searches run and their rankings merge by reciprocal-rank fusion. A skill is kept only if:
  * its licence is permissive;
  * the package ships no binaries;
  * its SKILL.md is readable in the pack, has substance (>= 800 chars) and has no prompt-injection flags.
A skill must also mention one of its specialist's keywords (MUST) and be described in Latin or Arabic script;
BAN holds ids removed after a manual review. At most two specialists share a skill; a pack is left short rather than padded with weak matches. Deterministic: same pack in, same JSON out.

    python tools/gen_swarm_skillpacks.py          # then: python tools/gen_swarm_agents.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tools" / "swarm_skillpacks.json"
sys.path.insert(0, str(ROOT / "mcp-server"))
from kosif_mcp import atlas  # noqa: E402

PACK_SIZE = 8
MAX_SHARE = 2

FACETS: dict[str, tuple[str, ...]] = {
    "kosif-deep-researcher": ("deep research", "literature review", "web research sources", "research report citations",
                              "competitive research"),
    "kosif-fact-checker": ("fact checking", "citation verification", "claim verification", "source credibility",
                           "verify claims evidence", "grounding hallucination check"),
    "kosif-strategist": ("business strategy", "decision making framework", "scenario planning", "competitive analysis",
                         "strategic planning"),
    "kosif-probability-analyst": ("forecasting", "bayesian statistics", "statistical analysis", "ab testing experiment",
                                  "probability estimation"),
    "kosif-architect": ("software architecture", "system design", "architecture decision record", "api design",
                        "domain driven design"),
    "kosif-backend-engineer": ("backend api development", "database schema design", "postgresql", "cloudflare workers",
                               "python fastapi"),
    "kosif-frontend-engineer": ("react components", "frontend design", "tailwind css", "responsive web design",
                                "rtl right to left"),
    "kosif-test-engineer": ("unit testing", "test driven development", "playwright end to end testing",
                            "property based testing", "flaky tests"),
    "kosif-debugger": ("systematic debugging", "root cause analysis", "git bisect", "stack trace error analysis",
                       "debugging strategies"),
    "kosif-security-auditor": ("security audit", "threat modeling", "secret scanning", "owasp vulnerabilities",
                               "dependency vulnerability scanning"),
    "kosif-code-reviewer": ("code review", "pull request review", "refactoring", "code quality"),
    "kosif-devops-engineer": ("github actions", "ci cd pipeline", "docker containers", "deployment rollback",
                              "infrastructure as code"),
    "kosif-data-engineer": ("data analysis pandas", "sql queries", "data cleaning", "excel spreadsheet",
                            "data visualization charts"),
    "kosif-web-operator": ("browser automation", "playwright", "web scraping", "browser testing"),
    "kosif-arabic-editor": ("arabic", "translation", "localization i18n", "proofreading", "copy editing"),
    "kosif-storyteller": ("storytelling", "screenwriting", "copywriting", "narrative structure", "worldbuilding"),
    "kosif-cinema-director": ("cinematography", "film storyboard", "shot list camera angles", "screenplay scene",
                              "cinematic video prompt", "character reference sheet"),
    "kosif-image-prompt-engineer": ("image generation prompt", "midjourney prompt", "stable diffusion prompt",
                                    "text to image", "negative prompt", "ai image prompts", "prompt image flux",
                                    "visual consistency seed"),
    "kosif-video-producer": ("video generation", "ffmpeg video editing", "remotion", "motion graphics animation",
                             "subtitles captions"),
    "kosif-lighting-designer": ("lighting design", "studio lighting photography", "cinematic lighting", "color grading",
                                "camera exposure settings", "3d rendering lighting"),
    "kosif-audio-engineer": ("audio mixing mastering", "music generation", "sound design", "podcast production",
                             "audio analysis"),
    "kosif-voice-director": ("text to speech", "voice over", "elevenlabs", "dubbing", "speech pronunciation"),
    "kosif-visual-critic": ("image quality assessment", "design critique", "visual review", "ui screenshot review"),
    "kosif-ifrs-auditor": ("accounting", "ifrs", "bookkeeping", "financial statements", "audit", "vat tax"),
    "kosif-product-manager": ("product requirements document", "user stories", "roadmap prioritization",
                              "product discovery", "go to market"),
    "kosif-ux-accessibility": ("accessibility wcag", "usability testing", "ux research", "screen reader"),
    "kosif-prompt-engineer": ("prompt engineering", "llm evaluation", "system prompt", "agent instructions", "llm judge"),
    "kosif-atlas-scout": ("skill creator", "writing agent skills", "plugin development", "skill evaluation",
                          "agent skills best practices"),
    "kosif-integrator": ("synthesis report", "summarize multiple sources", "multi agent orchestration",
                         "consolidate findings"),
    "kosif-quality-gate": ("quality assurance", "verification before completion", "release checklist",
                           "definition of done"),
}

# A skill must mention at least one of its specialist's keywords in its name or description.
MUST: dict[str, tuple[str, ...]] = {
    "kosif-deep-researcher": ("research", "literature", "citation", "source", "investigat"),
    "kosif-fact-checker": ("fact", "claim", "citation", "verif", "ground", "credib"),
    "kosif-strategist": ("strateg", "swot", "pestle", "decision", "scenario", "competit", "business plan"),
    "kosif-probability-analyst": ("statist", "forecast", "probabil", "bayes", "a/b", "experiment", "hypothes"),
    "kosif-architect": ("architect", "design pattern", "domain", "api design", "adr", "system design", "boundar"),
    "kosif-backend-engineer": ("backend", "api", "database", "schema", "sql", "postgres", "fastapi", "worker", "server"),
    "kosif-frontend-engineer": ("frontend", "react", "component", "css", "tailwind", "layout", "responsive"),
    "kosif-test-engineer": ("test",),
    "kosif-debugger": ("debug", "root cause", "bisect", "bug", "error"),
    "kosif-security-auditor": ("secur", "vulnerab", "threat", "owasp", "secret", "xss", "injection"),
    "kosif-code-reviewer": ("review", "refactor", "quality", "maintainab"),
    "kosif-devops-engineer": ("ci/cd", "cicd", "pipeline", "deploy", "docker", "terraform", "infrastructure",
                              "github actions", "rollback", "kubernetes", "helm"),
    "kosif-data-engineer": ("data", "sql", "csv", "excel", "spreadsheet", "pandas", "chart", "visualiz"),
    "kosif-web-operator": ("browser", "playwright", "scrap", "crawl", "selenium"),
    "kosif-arabic-editor": ("arabic", "translat", "proofread", "copy edit", "copy-edit", "grammar", "locali", "rtl"),
    "kosif-storyteller": ("story", "narrative", "plot", "screenwrit", "script", "copywrit", "worldbuild"),
    "kosif-cinema-director": ("film", "cinemat", "storyboard", "shot list", "scene", "camera", "screenplay"),
    "kosif-image-prompt-engineer": ("image gen", "image prompt", "midjourney", "diffusion", "flux", "illustrat",
                                    "text to image", "visual consisten", "art bible", "imagem", "image edit"),
    "kosif-video-producer": ("video", "ffmpeg", "remotion", "animation", "motion", "caption", "subtitle"),
    "kosif-lighting-designer": ("lighting", "photograph", "color grad", "colour grad", "cinematograph", "luminance"),
    "kosif-audio-engineer": ("audio", "sound", "music", "mix", "master", "podcast", "dsp"),
    "kosif-voice-director": ("voice", "speech", "tts", "dubbing", "narrat", "pronunc"),
    "kosif-visual-critic": ("visual", "design critique", "screenshot", "image quality", "heuristic", "aesthetic"),
    "kosif-ifrs-auditor": ("account", "ifrs", "gaap", "bookkeep", "ledger", "financial statement", "audit", "tax",
                           "vat", "reconcil"),
    "kosif-product-manager": ("product", "prd", "requirement", "user stor", "roadmap", "priorit", "go-to-market"),
    "kosif-ux-accessibility": ("accessib", "wcag", "a11y", "usabil", "ux", "heuristic", "screen reader"),
    "kosif-prompt-engineer": ("prompt", "eval", "llm", "judge", "system prompt"),
    "kosif-atlas-scout": ("skill", "plugin"),
    "kosif-integrator": ("synthes", "summar", "consolidat", "orchestrat", "multi-source", "multiple source"),
    "kosif-quality-gate": ("verif", "quality", "qa", "definition of done", "checklist", "acceptance"),
}
# Product integrations (one vendor's API or one machine's service layer) are not methods a specialist can reuse.
VENDOR_PREFIXES = ("charly-",)
VENDOR_PLUGINS = frozenset({
    "posthog", "zoom", "zoom-plugin", "nuxt-i18n", "scandit-sdk", "servicegraph", "stripe-skills", "mixpanel-headless",
    "apollo-skills", "obsidian-development", "build-ios-apps", "self-storage-operations", "chronograph-lp",
    "residential-real-estate-brokerage", "tax-preparation-practice", "insurance-life-health-benefits",
    "legends-seo-dungeon", "sagemaker-ai", "togetherai-skills", "honeycomb", "databases-on-aws",
    "android-mic-capture-tears-down-a2dp", "adobe-for-creativity", "notion", "azure",
})
KEEP_PACKS = frozenset({"elevenlabs-pack"})  # "-pack" plugins are vendor kits; ElevenLabs is the TTS a voice director uses
# Reviewed by hand after a run: on-topic by keyword but wrong for the specialist.
BAN: frozenset[int] = frozenset({
    8027, 1266, 9098, 14152, 408, 7532, 9526, 1262, 793, 8905, 4766, 13942, 1189, 1186,
    5466, 9692, 10617, 12412, 10072, 8125, 3943, 4048, 204, 3896, 3946, 12936, 8942, 12505, 2217, 12624, 4312,
    14401, 8092, 14145, 3733, 14308, 1925, 3937, 10525, 11453, 8053, 13782,
})


def _vendor(plugin: str) -> bool:
    p = (plugin or "").lower()
    return (p in VENDOR_PLUGINS or p.startswith(VENDOR_PREFIXES)
            or (p.endswith("-pack") and p not in KEEP_PACKS))


def _latin_or_arabic(text: str) -> bool:
    """Descriptions in other scripts (e.g. Korean, Chinese) are hard for an Arabic/English user to vet."""
    letters = [c for c in text if c.isalpha()]
    ok = sum(1 for c in letters if c.isascii() or "؀" <= c <= "ۿ")
    return not letters or ok / len(letters) >= 0.9


def _relevant(agent: str, item: dict) -> bool:
    text = f"{item['skill']} {item['description']}".lower().replace("-", " ").replace("_", " ")
    return (item["skill_id"] not in BAN and not _vendor(item["plugin"]) and _latin_or_arabic(text)
            and any(k.replace("-", " ") in text for k in MUST[agent]))


def _ok(item: dict, cache: dict) -> bool:
    """Permissive, no binaries, readable SKILL.md with substance and no injection flags."""
    if not item["permissive"] or "binaries" in item["risk_flags"] or not (item["description"] or "").strip():
        return False
    sid = item["skill_id"]
    if sid not in cache:
        try:
            r = atlas.read_skill(sid, limit=1)
            cache[sid] = r["total_chars"] >= 800 and not r["injection_flags"] and bool(r.get("online_folder"))
            if cache[sid]:
                cache[(sid, "folder")] = r["online_folder"]
        except Exception:  # noqa: BLE001 — unreadable in the pack: skip it
            cache[sid] = False
    return cache[sid]


def build() -> dict:
    cache: dict = {}
    used: dict[int, int] = {}
    packs: dict[str, list[dict]] = {}
    for agent, facets in FACETS.items():
        score: dict[int, float] = {}
        items: dict[int, dict] = {}
        names: set[str] = set()
        for q in facets:
            for rank, it in enumerate(atlas.search(q, license="permissive", limit=25)["results"]):
                score[it["skill_id"]] = score.get(it["skill_id"], 0.0) + 1.0 / (60 + rank)
                items.setdefault(it["skill_id"], it)
        pack = []
        for sid in sorted(score, key=lambda s: (-score[s], s)):
            it = items[sid]
            key = it["skill"].lower()
            if key in names or used.get(sid, 0) >= MAX_SHARE or not _relevant(agent, it) or not _ok(it, cache):
                continue
            names.add(key)
            used[sid] = used.get(sid, 0) + 1
            pack.append({"skill_id": sid, "skill": it["skill"], "plugin": it["plugin"], "license": it["license"],
                         "description": " ".join(it["description"].split())[:180],
                         "online_folder": cache[(sid, "folder")]})
            if len(pack) == PACK_SIZE:
                break
        packs[agent] = pack
    return packs


def main() -> int:
    packs = build()
    short = {a: len(p) for a, p in packs.items() if len(p) < PACK_SIZE}
    OUT.write_text(json.dumps(packs, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"wrote {sum(map(len, packs.values()))} skills for {len(packs)} specialists to {OUT}"
          + (f"; short packs: {short}" if short else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
