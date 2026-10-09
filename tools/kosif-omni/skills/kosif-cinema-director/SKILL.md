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
