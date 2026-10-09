# KOSIF Omni knowledge — 08-cinema-video-lighting


<!-- ===== skill: kosif-cinema-director ===== -->
---
name: kosif-cinema-director
description: Cinematic direction and prompt engineering for images, video and ads — 7-layer prompt anatomy (Dragon), 360° character/location reference sheets, frame-stitching continuity, lighting/camera/lens/style catalogs, per-platform prompts (Veo, Runway, Midjourney, Kling, Sora, Flux, NanoBanana) and Arabic/English scene packages. Use for "اكتب برومبت سينمائي", storyboards, shot lists, character sheets, ad spots, world building, and for mining the user's own Dragon / Blue Jewel / Cinema AI sources.
---
# KOSIF Cinema Director

Distilled from the user's own system prompts (Blue Dragon V20, Blue Jewel V7, Cinema AI Director, Black Camel, Omni-Sovereign). It turns one idea into a production-grade package and keeps it consistent across shots.

## Workflow
1. **Frame the brief** — goal, platform(s), duration/aspect, language of the final prompts (English prompts; Arabic only for text rendered on screen and for explanations), constraints, forbidden elements. Ask at most one question if a blocker is missing; otherwise choose sensible defaults and state them.
2. **Lock identity first** — for any recurring character/location create a *Reference Sheet* (`references/continuity-protocols.md`): code `CHR-001` / `LOC-001`, 360° views, expression set, wardrobe fabrics. Reuse the lock text **verbatim** in every later prompt.
3. **Build the 7 layers** for each shot (`references/seven-layer-anatomy.md`): Location · Subject · Wardrobe · Lighting · Camera · Atmosphere · Technical. A prompt missing a layer is incomplete.
4. **Pick from the catalogs** (`references/visual-catalog.md`) — style, lighting setup (with Kelvin and ratio), camera body, lens, angle, motion. Prefer specific physical descriptors over adjectives such as "beautiful" or "masterpiece".
5. **Render per platform** — use the `kosif_prompt_forge` tool (mode image|video) for correctly formatted prompts, then `kosif_image_prompt_lint` on each. Platform notes live in `kosif-prompt-master`; syntax that changes between versions must be verified live (see `kosif-image-studio`).
6. **Do the math, don't guess** — exposure/EV, lighting ratio ↔ stops, colour-temperature gels, shutter angle, falloff: `kosif_light_calc` (skill `kosif-lighting`).
7. **Stress-test the story** — for scripts, reels and ads run `kosif_story_lint` (GMC+S: goal, motivation, conflict, stakes per beat; protagonist agency; escalation).
8. **Continuity pass** — frame stitching for long video (`references/continuity-protocols.md`), then a final consistency checklist (same lock text, same lighting direction, same wardrobe, same time of day).
9. **Deliver** the package (below) and offer the next 2–3 steps.

## Deliverable package
```
Title · Logline · Platform plan
Reference sheets (CHR-/LOC- codes, lock text)
Shot list: # · shot size · angle · lens · motion · duration · purpose
Per-shot prompt(s): positive · negative · params · audio direction
Lighting plan (setup, key/fill ratio, Kelvin) · Colour grade
Continuity checklist · Risks / safety notes · Next steps
```
When the user is working inside their AI Studio app that expects the mandatory JSON envelope, use `references/response-formats.md`; otherwise answer in readable markdown.

## Using the user's own sources
The originals are large (Dragon V20, Blue Jewel V7, Cinema AI OMEGA, Gemini system dumps). If the `kosif-omni` MCP server has a corpus configured, search them instead of guessing:
`kosif_corpus_search query="..."` → `kosif_corpus_read file offset`. Cite the file name for anything you take from them. `references/source-index.md` says which file holds what.

## Truth and safety rules
- Books named in the sources (Gurney, Kelby, Midjourney/Veo guides…) are *inspirations the user supplied*; paraphrase principles, never reproduce book text, and never claim you consulted a book you cannot see.
- Image/video models differ and change: say "verify current syntax" for flags such as `--v`, `--sref`, `--cref`/`--oref`; do not present a version-specific flag as permanent.
- Real people: do not generate prompts that depict a real, identifiable private person or imitate a real person's likeness or voice deceptively. Fictional characters and consenting, user-supplied references only.
- Visual claims about a *generated* image need evidence (look at the pixels / `kosif_image_analyze`); a prompt is not proof of the output.


<!-- ----- kosif-cinema-director/references/continuity-protocols.md ----- -->
# Continuity protocols

## 360° Reference Sheet (anti-drift)
Create once, reuse verbatim.

**Character — `CHR-001`**
- Name · age range · build · skin/hair/eye colour · distinguishing marks (be concrete, no vague adjectives)
- Views: front · ¾ left · profile · back · full-body contrapposto pose
- Expressions: neutral · joy · anger · fear · determination
- Wardrobe: items with fabric, colour, wear; accessories
- **Lock text** (one paragraph, copy-pasted into every prompt)

**Location — `LOC-001`**
- Place, era, scale, layout (left/right/centre landmarks), HDRI-style 360° description, key props, time-of-day variants
- **Lock text**

Why: image/video models re-invent details each call; a verbatim lock plus a reference image is the strongest consistency lever. Reference images, when the platform supports them, beat words — say which platform feature to use and verify it live.

## Frame stitching for long video
1. Split the scene into short chunks (the user's protocol uses ~5-second chunks; use the platform's real maximum and say so).
2. For each chunk define: start state, action, end state, camera move.
3. Chunk *n+1* starts from the **last frame** of chunk *n* (use it as the image/first-frame input when the platform allows).
4. Repeat the character/location locks and the lighting direction in every chunk.
5. Cut on motion or on a hard visual match; avoid stitching mid-gesture.
6. Audio direction is written per chunk and re-checked at the join.
7. After generation, compare first/last frames of adjacent chunks (`kosif_image_analyze compare_with`) — brightness, colour temperature and framing should not jump.

## Continuity checklist
Same lock text · same light direction and Kelvin · same wardrobe state (dirt, tears persist) · same time of day · same props in the same hand · screen direction preserved (180° rule) · same aspect and frame rate.

## 9-step visible reasoning (optional output style)
Understand → intent → retrieve sources (corpus search) → analyse conflicts → synthesise → generate → verify → attach sources → final polish. Show it only when the user asks for transparent reasoning; keep private deliberation private and surface conclusions, assumptions and sources.


<!-- ----- kosif-cinema-director/references/creative-worlds.md ----- -->
# Creative worlds: creature systems (Pokémon-style) and game-design lens

From the user's Pokémon-AI / Omni-Sovereign sources. Use for original creature design, card/battle systems and world bibles. Create **original** creatures; do not copy trademarked characters.

## Type system (19 slots in the source)
Normal · Fire · Water · Grass · Electric · Ice · Fighting · Poison · Ground · Flying · Psychic · Bug · Rock · Ghost · Dragon · Dark · Steel · Fairy · ??? (unknown).

## Rarity table (spawn weights from the source)
Common 60% · Uncommon 25% · Rare 10% · Epic 4% · Legendary 0.9% · Mythical 0.1%.

## Biomes
Forest · Cave · Ocean · Mountain · Urban · Desert · Tundra · Wetland.

## Creature card template
Name · type(s) · rarity · biome · silhouette & 3 distinguishing features · palette · behaviour · signature move (+ visual effect) · evolution line (with trigger) · weakness/resistance · lore hook · **7-layer image prompt** + 360° sheet code (`CHR-xxx`).

## Battle & progression lens (from the strategy-guide sources)
Turn-based loop · stat model (HP/ATK/DEF/SPD/special) · type chart (state it explicitly, verify it is closed and has no accidental infinite loops) · evolution/fusion rules ("DNA fusion lab": define inheritance of types and stats deterministically) · arena rules · reward curve. Use `kosif_decision_sensitivity` to compare balance options and `kosif_probability_check` for drop-rate arithmetic.

## World bible skeleton
Premise · geography (map zones) · factions · tech/magic rules and limits · economy · conflicts (GMC+S) · tone/palette · 5 iconic locations (`LOC-xxx`) · 5 iconic characters (`CHR-xxx`).


<!-- ----- kosif-cinema-director/references/hubs-and-agents.md ----- -->
# Hubs and agents → how they map in KOSIF Omni

The user's AI Studio systems describe 20+ "hubs" and 12 "agents". In Omni they are **lenses**, not separate programs: load the matching skill/tool and speak from that angle.

| Hub / agent (source name) | Role | Omni equivalent |
|---|---|---|
| AutoDirector | full config from a raw idea; scene extraction; frame stitching | this skill + `kosif_prompt_forge` |
| CharacterForge | 360° sheets, anatomy, wardrobe | `references/continuity-protocols.md` |
| WorldBuilder | HDRI environments, weather, physics | this skill (Location layer) |
| MotionVFX | camera choreography, tracking, transitions | `visual-catalog.md` motion list |
| CommercialFactory / ViralImpact | 30-second ads, hooks, marketing | this skill + `kosif_story_lint`; hook testing via `kosif_decision_sensitivity` |
| NanoBananaStudio / ImageStudio | sketch→render, 8K stills | `kosif-image-studio`, `kosif-prompt-master` |
| VideoStudio | image/text → video prompts | `kosif_prompt_forge mode=video` |
| NovelLab / StoryAnalyst / Story-writer agent | book→film, 3-act structure | `kosif-video`, `kosif_story_lint` |
| CastingAgency / FashionDesigner | casting by description, costume | this skill (fictional characters only) |
| MusicStudio / Voice agent | music, SFX, narration, sync | `kosif-voice`, `kosif-audio` |
| PokemonLab / GameDesigner | creature systems, battle design | `creative-worlds.md` |
| EinsteinLab / AbyssalReasoning | deep reasoning | `kosif-expert-council`, `kosif-cognitive-core` |
| VisualForensic | analyse an image/video's light, lens, grade | `kosif-vision` + `kosif_image_analyze` |
| KnowledgeInjection / Knowledge-Merger agent | import, dedupe, search | `kosif_corpus_*` tools |
| CodeMaster / Code-Builder agent | apps, TypeScript, Vue/React | `kosif-code-master`, `kosif_code_scan` |
| AccountingHub | accounting & reporting | `kosif-audit-ifrs`, `kosif_ledger_check` |
| QA agent | review outputs, detect conflicts | `kosif_llm_prompt_lint`, `kosif_image_prompt_lint`, council red-team |
| PsychologyHub | character psychology for fiction; audience understanding | `kosif-expert-council` (members with psychology domains). Persuasion/"profiling" of real individuals is out of scope. |

The "GodHub with 136 tools" in the Dragon app is an app UI concept; Omni's equivalent is `kosif_capabilities` + `kosif_route`.


<!-- ----- kosif-cinema-director/references/response-formats.md ----- -->
# Response formats

## Plain (default for chat)
Readable markdown with the deliverable package from `SKILL.md`. Arabic explanations, English prompts.

## AI-Studio envelope (only when the user's app parses JSON)
The Omni-Sovereign / Dragon apps require this JSON. Use it **only** when the user says the output feeds that app.
```json
{
  "title": "العنوان بالعربية",
  "analysis": "short, user-visible reasoning summary",
  "confidence": 90,
  "sources": ["file names actually consulted"],
  "json": {
    "tool_output": "...",
    "prompts": ["prompt 1", "prompt 2"],
    "imageSpecs": {"resolution": "8K", "style": "Cinematic"}
  },
  "nextSteps": ["step 1", "step 2"],
  "qualityScore": {"detail": 8, "consistency": 8, "cinematic": 8, "lighting": 8, "colorTheory": 8},
  "colorAnalysis": {"kelvin": 5600, "mood": "Warm golden"}
}
```
Rules: `sources` lists only files you really searched/read (corpus hits); `confidence` and `qualityScore` are your honest estimates, not 10/10 by default; output valid JSON only (no prose around it) in that mode.

## Platform prompt object (Dragon V20 shape)
```json
{"platform": "Veo 3.1", "prompt": "...", "negativePrompt": "...", "params": {"aspect": "16:9"}, "audioDirection": "..."}
```


<!-- ----- kosif-cinema-director/references/seven-layer-anatomy.md ----- -->
# The 7-layer prompt anatomy ("Dragon Anatomy")

Every generation prompt carries seven layers. Write each as a concrete, physical description.

| # | Layer | Must say | Typical specifics |
|---|-------|----------|-------------------|
| 1 | **Location** | indoor/outdoor, place, time of day, weather | HDRI-style environment, era, geography, depth layers (foreground / mid / background) |
| 2 | **Subject** | who/what, pose, expression, action | exact physical description, contrapposto/weight shift, emotion in the eyes, hands doing something specific |
| 3 | **Wardrobe** | garments, materials, condition | fabric (velvet, linen, leather, oak), colour, wear/dirt, accessories, fit to character |
| 4 | **Lighting** | key / fill / rim, direction, quality, Kelvin | e.g. "soft window key from camera left, warm 3800K, fill −2 stops, cool rim from behind" |
| 5 | **Camera** | body, lens, aperture, angle, shot size, motion | "ARRI Alexa Mini LF, 50mm f/1.4, eye level, medium close-up, slow push-in" |
| 6 | **Atmosphere** | air, particles, mood | haze, dust motes, rain, snow, volumetric rays, humidity, colour mood |
| 7 | **Technical** | resolution, frame rate, aspect, parameters | 8K / 24 fps / 16:9; platform parameters (`--ar`, style/stylize flags — verify per version) |

## Golden formula (single line)
`[STYLE], [COMPOSITION RULE], [CAMERA + LENS + f-stop], [LIGHTING + Kelvin + direction], [SUBJECT with texture/detail], [WARDROBE with fabric], [ENVIRONMENT with layers], [ATMOSPHERE with physics], mood: [EMOTION] --ar X:Y`

## Composition rules to choose from
Rule of thirds · golden ratio / spiral · centred symmetry (Wes-Anderson style) · leading lines · negative space · frame-within-frame · low-angle hero / high-angle vulnerability · depth stacking.

## Negative-prompt baseline
`blurry, deformed hands, extra fingers, watermark, text overlay, low quality, bad anatomy, floating objects, duplicate limbs, disfigured, cropped, jpeg artifacts` — add scene-specific negatives (anachronisms, wrong gear, wrong culture details).

## Weak vs strong words
Weak: "4k", "HQ", "best quality", "masterpiece", "beautiful" (add little). Strong: physical cues — *volumetric, subsurface scattering, chiaroscuro, Rembrandt triangle, anamorphic flare, film grain, atmospheric perspective, tungsten 3200K, f/1.4 shallow depth of field*. The user's Black Camel scorer rewards the strong list and penalises the weak list — a useful heuristic, not a measure of image quality.

## Self-check before delivering
- All 7 layers present? · Lock text verbatim? · One light direction? · Time of day consistent with Kelvin? · Wardrobe matches era/culture? · Aspect ratio matches platform? · Negatives present? · No contradictory instructions?


<!-- ----- kosif-cinema-director/references/source-index.md ----- -->
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


<!-- ----- kosif-cinema-director/references/visual-catalog.md ----- -->
# Visual catalog (styles · lighting · cameras · lenses · angles · motion)

## Styles → descriptor strings
| Style | Descriptor |
|---|---|
| Cinematic Masterpiece | cinematic photography, ARRI ALEXA 65, anamorphic lens flare, film grain, ACES colour science, 16-bit RAW |
| Photorealistic | photorealistic, ultra-detailed, RAW photo, sharp focus, subsurface scattering, medium-format Hasselblad quality |
| Anime | Studio-Ghibli-like watercolour, hand-painted backgrounds, cel-shaded, whimsical atmosphere |
| 3D Render | Pixar-style 3D animation, subsurface scattering, ambient occlusion, global illumination |
| Dark Fantasy | gothic architecture, volumetric fog, dramatic chiaroscuro, ethereal glow |
| Product Commercial | hyper-real 3D commercial product shot, studio lighting, premium feel |
| Cyberpunk Neon | neon-drenched streets, holographic ads, rain reflections, teal and magenta |
| Film Noir | high-contrast B&W, Venetian-blind shadows, smoke, 1940s |
| Vintage Film | Kodak-Portra-400-style film, soft grain, warm tones, light leak |
| Watercolour | wet-on-wet technique, bleeding edges, paper texture |
| Surrealism | impossible physics, melting objects, dreamlike |
| Documentary | raw, photojournalistic, available light |
| Baroque Oil | Rembrandt-style chiaroscuro, visible brushstrokes, impasto |
| Gothic Horror | candlelight, long shadows, stone architecture, perpetual fog |
| Wes Anderson | perfect symmetry, pastel palette, centred composition |
| Solarpunk | living architecture, bioluminescent plants, sustainable tech |
| Claymation | stop-motion, visible fingerprints, handmade texture |
| Comic Book | bold outlines, halftone dots, dynamic angles |
| Vaporwave / Synthwave | pink-purple-cyan, glitch art, 80s nostalgia |
| Ukiyo-e | woodblock print, flat colour planes, flowing lines |
Also from the Omni master: Anime, Steampunk, Pixel Art, Low/High-poly 3D, Minimalist, Abstract, Pop Art, Fantasy, Sci-Fi, Romantic, Experimental.

## Lighting setups (with numbers)
| Setup | Recipe |
|---|---|
| Rembrandt | key ~45°, triangle of light on the shadow cheek, ~3:1 ratio, warm ~3200K |
| Butterfly / Paramount | key above the lens axis, symmetrical nose shadow, clamshell fill |
| Split | key at 90°, half face lit, maximum drama |
| Chiaroscuro | one hard source, no fill, deep shadows (Caravaggio) |
| Three-point | key + fill + rim/back; set ratio with `kosif_light_calc ratio` |
| High-key / Low-key | bright even, minimal shadow / dramatic single-source noir |
| Golden hour | sun ~15° above horizon, 3200–3500K, rim from behind |
| Blue hour | ~20 min after sunset, 7500–9000K sky, warm practicals |
| Volumetric / god rays | shafts through fog, dust or windows |
| Neon practical | cyan + magenta on wet surfaces |
| Candle / fire | 1800–2200K, flicker, intimate shadows |
| Moonlight | cool silver ~4100–6500K, soft through cloud |
| Silhouette / backlit | rim only, strong shape |
| Joel-Grimes-style edgy | two large softboxes behind + beauty dish above camera |
Colour-temperature shifts and gel choice: `kosif_light_calc op=mired`. Background falloff: `op=falloff`.

## Camera bodies
ARRI Alexa 65 / Alexa Mini LF (natural skin, wide DR) · RED V-Raptor 8K / Komodo 6K (global shutter, resolution) · Sony Venice 2 (dual-base ISO, highlight roll-off) · IMAX 70mm (huge gate) · Hasselblad X2D (medium-format detail) · Blackmagic URSA 12K · DJI Ronin 4D (stabilised, LiDAR focus) · iPhone Pro / Pixel Pro (computational, documentary feel) · GoPro/FPV (action) · VHS camcorder (lo-fi).

## Lenses
14mm ultra-wide · 24mm f/1.4 · 35mm f/1.4 · 50mm f/1.2 · 85mm portrait f/1.4 · 100mm macro · 135mm f/2 · 200mm f/2.8 · anamorphic 40mm (oval bokeh, horizontal flare). Wider = more environment & distortion; longer = compression & isolation.

## Shot sizes
ECU · CU · MCU · MS · full · wide · extreme wide · POV · over-the-shoulder · two-shot · insert.

## Angles
Eye level · low (hero) · high (vulnerability) · drone top-down · Dutch · worm's-eye · bird's-eye · POV first person.

## Camera motion
Static · pan · tilt · dolly in/out · truck · pedestal · zoom · orbit · handheld · Steadicam · natural-language motion (for video models describe the move in plain prose, e.g. "slow push-in as steam rises").

## Platforms in the user's apps
Veo 3.1 · Runway Gen-4.5 · Midjourney V7 · Kling 2.0 · Sora · Flux Pro · Grok · NanoBanana · ChatGPT image · SDXL · Ideogram. `kosif_prompt_forge` covers: chatgpt, midjourney, flux, sdxl, ideogram (image) and sora, veo, runway, kling (video).


<!-- ===== skill: kosif-video ===== -->
---
name: kosif-video
description: Use for video creation and cinematography — AI video prompts (Sora, Veo, Runway, Kling, Luma, Pika, Seedance, Hailuo), shot lists, storyboards, reels/shorts/ads scripts, camera movement, continuity between shots, editing plans, subtitles and timing. Triggers on /video /shots /storyboard /reel /ad, "فيديو", "ريلز", "إعلان", "مشهد", "لقطة".
---
# KOSIF Video Director

## Pipeline
0. **Story first** (for narrative work): pick the central conflict, build GMC+S beats and run `scripts/story_lint.py`; rules in `references/story-conflict.md`.
1. **Frame**: platform (Reels/TikTok 9:16, YouTube 16:9, cinema 2.39:1), total duration, goal (sell, tell, teach), audience, hook in the first 1–2 s, call to action.
2. **Locks**: Character Lock(s) + Style Lock + Location Lock (from kosif-image-studio) — reused verbatim in every shot prompt for continuity.
3. **Beat sheet**: hook → setup → escalation → payoff → CTA with timecodes.
4. **Shot list table**: # · time (start–end) · shot type · lens · camera move · action · lighting (kosif-lighting preset) · audio/VO/SFX (kosif-audio) · on-screen text · transition.
5. **Per-shot prompts** (English): `[Locks] + [action over time] + [camera move + speed] + [lens] + [lighting] + [environment motion: wind, rain, crowd] + [duration 5–10 s] + [fps / slow motion] + [style/grade] + [aspect ratio]`. Lint each with `../kosif-image-studio/scripts/prompt_lint.py` using `"mode": "video"`.
6. **Keyframe first**: generate/approve a still per shot (image-to-video) for identity consistency when the platform supports it.
7. **Edit plan**: order, cut points on beats (use BPM from kosif-audio: beat = 60/BPM s), music, VO, SFX, subtitles (max 42 chars/line, 1–2 lines, 1–7 s each), color grade, export (H.264/H.265, 1080×1920 or 3840×2160, 24/30 fps, −14 LUFS).
8. **QA/postcondition**: identity drift, hands/faces, physics, text errors, continuity (wardrobe, props, light direction) → regenerate only failed shots.

## Camera movement vocabulary
static/locked-off · slow push-in (tension) · pull-out (reveal) · dolly/tracking (follow) · orbit/arc (hero) · crane up/down (scale) · handheld (urgency) · whip pan (energy) · rack focus (attention shift) · dolly-zoom (vertigo) · drone flyover (establish) · POV · snorricam.

## Commands
`/story <idea>` conflict-driven beat sheet (GMC+S, four levels, agency) + lint · `/video <idea>` full package · `/shots <script>` shot list only · `/storyboard <idea>` shot list + keyframe prompts · `/reel <product>` 15–30 s vertical ad with hook variants ×3 · `/ad <brand>` 30 s spot with VO script.

## Related
Per-platform video prompt syntax (Sora, Veo, Runway, Kling): `../kosif-prompt-master/scripts/prompt_forge.py` with `"mode": "video"`.

## Safety
No deepfakes of real people, no deceptive political/news footage, respect music and brand rights.


<!-- ----- kosif-video/references/story-conflict.md ----- -->
# Story conflict engine (from The Conflict Thesaurus vol. 2, fully read — rewritten as rules)

## GMC+S for every beat
Goal (what they want now) · Motivation (why it matters to them) · Conflict (what blocks them) · Stakes (what they lose if they fail — make it personal). Lint with `scripts/story_lint.py`.

## Central conflict — pick exactly one
character vs character · vs society · vs nature · vs technology · vs supernatural · vs self.

## Four levels
central (whole story) → story/macro (looming problem the hero can't solve yet) → scene/micro (immediate obstacle) → inner (belief, fear, wound). Subplots must feed the central conflict.

## Escalation levers
uncertain outcome (easy wins that aren't real wins) · withhold what the character needs · personal stakes · no-win choice · keep the character moving (no safe haven) · shake up the team · tighten the clock.

## Agency
Every conflict must end in a *choice* by the protagonist that changes what happens next. If the story would end the same without them, rewrite.

## Pitfalls
low/no stakes · contrived conflict that doesn't fit the thread · too much conflict (episodic, exhausting) · navel-gazing (keep ≈80% action / 20% reflection; give reflective moments a physical task) · resolving relationship conflict too fast.

## Conflict categories for generation (vol. 2 + vol. 1 index)
Loss of control · Power struggles · Losing an advantage · Ego-related conflicts · Dangers and threats · Miscellaneous challenges · (vol. 1:) Relationship friction · Failures and mistakes · and others.
For a chosen conflict, generate in this anatomy: concrete examples → minor complications → potentially disastrous results → resulting emotions → internal struggles → negative traits that make it worse → which basic need it threatens (physiological, safety, belonging, esteem, self-actualisation) → positive outcomes (growth).

## Short-form (reels/ads, 15–60 s)
Hook = conflict in the first 2 s → one escalation → choice → payoff/CTA. The product/brand should be the tool of the character's choice, not a deus ex machina.

## Seven basic plots (Christopher Booker, as summarised in the *Outcomes* coursebook reading "Heard it all before")
Overcoming the Monster · Rags to Riches · The Quest · Voyage and Return · Comedy · Tragedy · Rebirth. Stories that fit them satisfy a need for moral order; breaking them should be a deliberate choice.
**Overcoming the Monster stages** (mark beats with `"stage"` for story_lint): threat and call → preparation / weapon or fatal flaw → initial success → first confrontation and frustration → nightmare stage → escape, victory, reward.

## Case study: *Harry Potter and the Cursed Child* (supplied Arabic translation, 4 acts / 74 scenes)
Central conflict: character vs self (Albus's need to prove himself and the father–son rift), wrapped in character vs character (a hidden antagonist). Agency: the boys choose to steal and use the Time-Turner; every intervention creates a worse world (escalating stakes), the friendship is the inner arc, the climax resolves the outer threat only after father and son reconcile. Useful pattern for reels/series: *a well-meant fix makes things worse* → escalation without contrivance.


<!-- ===== skill: kosif-lighting ===== -->
---
name: kosif-lighting
description: Use for any lighting question or task — photo, film, video, product, portrait, interior or 3D lighting; diagnosing bad light in an image; relighting; lighting plans and diagrams; gear, gels, exposure and camera settings; lighting words for image/video prompts. Triggers on /light /relight /lightplan /exposure /gel, "إضاءة", "ظل", "الضوء", "lighting".
---
# KOSIF Lighting Director

## Physics & numbers (compute, do not guess)
Use `scripts/light_calc.py` (JSON on stdin) whenever numbers matter:
`inverse_square` (distance → stops) · `ev` (aperture/shutter/ISO → EV100 + typical scene) · `equivalent` (reciprocal exposure) · `ratio` / `ratio_to_stops` (lighting ratio) · `mired` (Kelvin shift → CTO/CTB gel) · `guide_number` (flash f-number) · `softness` (source size/distance → apparent angle) · `shutter_angle` (fps + angle → shutter) · `falloff` (background darkening).

Core rules: bigger/closer source ⇒ softer shadows; doubling distance ⇒ −2 stops; ratios 2:1 commercial · 3:1 natural portrait · 4–8:1 dramatic · 8:1+ noir. Color temperature: candle 1900K · tungsten 3200K · golden hour ~3500K · daylight 5600K · overcast 6500K · shade 7500K+. Direction: front (flat) · 45° loop/Rembrandt · 90° split · back/rim (separation) · top butterfly · under (horror). Modifiers: softbox, octa, stripbox, umbrella (shoot-through/reflective), beauty dish, fresnel, grid, snoot, barn doors, flags, diffusion (1/4–full), bounce (white/silver/gold), negative fill.

## /lightplan <scene>
Deliver:
1. Mood & story goal (one line).
2. Top-view diagram (ASCII): camera at bottom, subject center, each light with angle and distance.
3. Table per light: role (key/fill/rim/hair/background/practical) · fixture · modifier · power/stops · height · angle · distance · color temp/gel.
4. Ratios & exposure: computed with light_calc (show the numbers).
5. Camera: ISO, shutter (or shutter angle), aperture, white balance.
6. Budget version: window + lamp + white foam board + phone light.
7. Common mistakes for this setup.
8. English prompt fragment reproducing the look (for kosif-image-studio / kosif-video).

## /light (uploaded image)
Run `../kosif-vision/scripts/image_analyze.py IMAGE --summary` when available, then: what the light is (direction, hardness, ratio, temperature), what's wrong (with the measured evidence), exact fix on set and in post (curves, dodge/burn, WB shift, relight mask).

## /relight <image> <mood>
Describe the target setup (preset + numbers), then edit/regenerate keeping subject identity, pose and composition frozen in an Execution Contract; verify the postcondition (identity unchanged, new light direction visible).

## /exposure and /gel
Quick answers via light_calc: equivalent exposures, ND needed, gel to match sources (e.g. tungsten lamp in daylight room ⇒ Full CTB on lamp or Full CTO on window).

## Presets
See `references/lighting-presets.md` (18 presets with diagrams, ratios, and prompt fragments).


<!-- ----- kosif-lighting/references/lighting-presets.md ----- -->
# Lighting Presets

| Preset | Key position | Modifier | Ratio | Temp | Mood | Prompt fragment |
|---|---|---|---|---|---|---|
| Rembrandt | 45° side, 30–45° high | softbox/octa | 4:1 | 5600K | classic, dramatic | Rembrandt lighting, triangle of light on the shadow cheek |
| Loop | 30° side, slightly high | softbox | 3:1 | 5600K | natural, flattering | loop lighting, soft small nose shadow |
| Butterfly / Paramount | front, high above camera | beauty dish | 2:1 | 5600K | glamour | butterfly lighting, shadow under the nose, beauty dish |
| Clamshell | key above + reflector below | beauty dish + silver bounce | 1.5:1 | 5600K | beauty, even | clamshell beauty lighting, luminous skin |
| Split | 90° side | hard or grid | 8:1+ | 5600K | mystery, duality | split lighting, half the face in shadow |
| Broad | lights the side facing camera | softbox | 3:1 | 5600K | widens face | broad lighting |
| Short | lights the side away from camera | softbox | 4:1 | 5600K | slims face, moody | short lighting |
| High-key | large soft front + lit white background | 2 bg lights +1.5 stops | 1.5:1 | 5600K | clean, commercial | high-key white seamless, minimal shadows |
| Low-key | single gridded key, negative fill | grid/snoot | 8:1+ | 3200–5600K | noir, luxury | low-key lighting, deep black background, gridded key |
| Cinematic teal-orange | warm key 3200K, cool ambient 6500K | fresnel + diffusion | 4:1 | mixed | blockbuster | warm tungsten key against cool teal ambience |
| Neon noir | magenta + cyan practicals, wet ground | tubes | high | mixed | cyberpunk | magenta and cyan neon, wet reflective street, haze |
| Golden-hour backlight | sun behind subject 10–20° high | reflector fill | 3:1 | 3500K | romance, warmth | golden hour backlight, glowing rim, lens flare |
| Blue hour | sky ambient + warm practicals | — | 2:1 | 9000K sky / 2700K lamps | calm, urban | blue hour, warm windows against deep blue sky |
| Moonlight | high cool hard source | fresnel + CTB | 6:1 | 7000K | night, eerie | cold moonlight from above, silver edges |
| Candle / firelight | low warm flickering source | practical | 6:1 | 1900K | intimate, ancient | flickering candlelight, warm falloff into darkness |
| Volumetric god rays | hard source through haze/window | haze | — | 5600K | spiritual, epic | volumetric light shafts through dust and haze |
| Product rim + gradient | 2 strip boxes behind at 45° + gradient bg | stripboxes | — | 5600K | premium | dual strip rim lights defining edges, gradient backdrop |
| Window light | large window 90° side | sheer curtain | 3:1 | 5600–6500K | natural, soft | soft window light from the side, gentle falloff |

## Diagram convention
```
        [BG]
   [Rim]      [Rim]
        (S)
  [Key]     [Fill]
        [CAM]
```
Place lights by clock position around the subject (12 = behind, 6 = camera).
