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
