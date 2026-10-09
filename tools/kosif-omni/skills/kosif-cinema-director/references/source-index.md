# Source index — what is in the user's folder

Search them with `kosif_corpus_search` (set `KOSIF_CORPUS_DIR` to the folder). Exact duplicate files are indexed once and reported as `identical_copies`. Sizes are from the user's own 2026-04-26 report. Contents below are only what has been verified; anything else: search, don't assume.

## Prompt / system-instruction families
| Family | Files (examples) | What it is |
|---|---|---|
| Blue Dragon V20 | `DRAGON-V20-SUPREME-FINAL.txt`, `DRAGON-V20-ULTIMATE-FINAL.txt`, `blue-dragon-v20-aistudio-prompt.txt`, `DRAGON-V20-AISTUDIO-FINAL.txt`, `Build_Instructions_التنين_الأزرق_V20.txt`, `التنين*.txt`, `كود التنين الازرق.txt` | build prompt for a React+TypeScript Arabic RTL cinematic studio: 136 tools, 7 agents, platform prompts (Veo, Runway, Midjourney, Kling, Sora, Flux, Grok, NanoBanana), typed schemas |
| Blue Jewel | `الماسة*.txt`, `الجوهرة الذهبية.txt`, `التنين والجوهرة جديد.txt` | jewel-line system instructions and app code |
| Cinema AI / Director | `CINEMA_AI_OMEGA_PLUS_V8_ALL…txt` (≈18 MB), `AI_STUDIO_COMPLETE_PACKAGE.txt`, `المخرج الجديد.txt` | cinema director system and React director app |
| Omni-Sovereign | `OMNI_SOVEREIGN_MASTER_V1/V2_FINAL.txt`, `OMNI_AGENT_V26_SYSTEM.txt` | merged "collective" system prompt: 7-brain matrix, 7-layer anatomy, hubs, agents, protocols, catalogs |
| Black Camel | `BLACK_CAMEL_SYSTEM_INSTRUCTION.txt`, `BLACK_CAMEL_CONSTANTS.ts`, `BLACK_CAMEL_APP.tsx` | unified system + style/camera/lighting databases + golden-formula assembler + prompt scorer |
| Red / Black Rose | `الوردة الحمراء.txt`, `الوردة_الحمراء_System_Instruction.txt`, `الوردة_الحمراء_Knowledge.txt` (≈82 MB), `الوردة السوداء.txt` | the "Red Rose" super-agent and its knowledge dump |
| Shining Star, Pokémon, Dai, Einstein, Council | `النجم الساطع*.txt`, `بوكيمون*.txt`, `البوكيمون.txt`, `داي*.txt`, `اينشتاين.txt`, `مجلس*.txt`, `الملهم.txt`, `ملهم الافكار.txt`, `مؤلف القصص.txt` | themed apps/agents (creature lab, council app, ideation, story author) |
| Voice | `صوت.txt` (= `Text Document جديد (4).txt`), `الصوتيات.txt` | Egyptian "YouTuber" TTS persona; MasryTube Studio X app (voices, SFX tags, singing studio) |
| Core code dumps | `7الكود.txt`, `الكود*.txt`, `كود*.txt`, `الاساس.txt`, `الاصدار الاخير.txt`, `كود المجمع.txt`, `system_instruction.txt`, `GEMINI_COMPLETE_SYSTEM_V7.txt`, `SYSTEM_INSTRUCTION_COMPLETE.txt` | app builds (e.g. DIRECTOR_PRO_SOVEREIGN 7.0.0) and full system instructions |
| AI-Studio packaging | `AI_STUDIO_*`, `AISTUDIO_APP_PROMPT.txt`, `build_ai_studio_prompt.py`, `ai_studio_sources_manifest.json`, `ai_studio_source_profiles.md` | scripts and manifests that previously packaged all sources for Google AI Studio (85 files, ≈239 M characters) |
| PDFs | `OMEGA_SUPREME_Blueprint (2).pdf`, `Pokemon_AI_Blueprint.pdf`, `shining-star-spec (1).pdf` | blueprints/specs (read with the pdf skill) |

## Known duplicates (identical SHA-256, from the user's manifest)
`DRAGON-V20-SUPREME-FINAL` ×2 · `DRAGON-V20-ULTIMATE-FINAL` ×2 · `blue-dragon-v20-aistudio-prompt` ×2 · `GEMINI_COMPLETE_SYSTEM_V7` ×2 · `Text Document جديد (4)` = `صوت` · `التنين والجوهرة جديد` ×2 · `الكود 2026-03-19 جديد` ×2 · `الكود` ×2 · five empty files.

## Practical tips
- Query in the language of the source (Arabic or English); quote exact phrases.
- Large dumps contain JSON-escaped text; read around a hit with `kosif_corpus_read file offset length`.
- When two sources disagree, report both with file names — do not silently pick one.
