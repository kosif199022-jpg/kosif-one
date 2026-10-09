---
name: kosif-voice
description: Voice direction for narration, TTS and songs — Egyptian/Gulf/Levantine/Maghrebi colloquial scripts, pronunciation memory, number/currency reading rules, performance tags, casting notes, pacing and delivery specs for TTS models. Use for "حوّل لصوت", تعليق صوتي, YouTuber voice, dubbing scripts, lyrics/song briefs; measure finished audio with kosif_audio_analyze.
---
# KOSIF Voice Director

Text-first direction that works in any host. Rendering audio needs a TTS/music provider the host exposes — if none is exposed, deliver the **director script** and say that nothing was rendered.

## Workflow
1. **Brief** — purpose (YouTube intro, ad, audiobook, IVR, song), dialect (المصرية · الفصحى · السعودية · الشامية · المغربية · الخليجية), persona, length, platform loudness target.
2. **Script pass** — rewrite for the *ear*: short sentences, natural fillers used sparingly, breath points, no formal MSA unless asked. Keep brand names and technical terms in a pronunciation list.
3. **Pronunciation memory** — keep a table `written → spoken (phonetic Arabic or Latin)` and reuse it across the project; add every term the voice mispronounces. Phonetic spelling is the fix when a model garbles slang (e.g. write "أوي" as it sounds).
4. **Direction layer** — per block: emotion, energy 1–5, pace, pauses, emphasis words, effects tags. Keep tags in the syntax the target model documents; if unknown, use plain-language direction ("warm, slightly amused, quick pace") instead of invented tags.
5. **Render (only if a provider is exposed)** — preview a short sample first; do not spend paid credits without explicit approval; verify the returned job/file state.
6. **Measure** — `kosif_audio_analyze path target=podcast|streaming|broadcast|club` for loudness (BS.1770 approximation), true-peak, clipping, silence, stereo balance; report numbers, not impressions.

## Egyptian YouTuber persona (from the user's `صوت.txt`)
- Warm, energetic, talks directly to "the fam"; never robotic or formal.
- Fillers (use occasionally): «يا جماعة» · «بصوا بقى» · «تمام؟» · «زي ما انتم شايفين».
- Pronounce ج as hard **g** (Game); pronounce ق as a glottal stop (ʔ).
- Numbers the Egyptian way: 11 حداشر · 12 اتناشر · 15 خمستاشر · 100 مية · 1000 ألف; currency «جنيه» spoken *geneh*.
- Pacing: natural conversational speed with breaths between sentences; do not rush.
- Model settings the user used: audio output enabled, temperature ≈ 0.85, top-p ≈ 0.95 (these were for one Gemini TTS setup — re-check for any other model).

## Other dialect notes
Do not mix dialects inside one block. For Gulf/Saudi write the dialect spelling the reader would say aloud; for Levantine keep the ق sound per sub-dialect and state the choice; for Maghrebi prefer Latin phonetic hints for words with French/Berber loans.

## Song briefs
Genre/maqam or mode · tempo (BPM) · structure (intro/verse/chorus/bridge) · rhyme scheme (قافية) · hook line · instrumentation · vocal character · reference feel (describe, don't name living artists to imitate). Lyrics must be original. `kosif_kcl_probe name=beat bpm=…` gives beat/bar/8-bar durations for cutting to music.

## Rules
- No cloning or imitating a real, identifiable person's voice, and no deceptive impersonation. Persona voices are fictional archetypes.
- Disclose synthetic voice where the platform or law requires it.
- Never claim audio was rendered, uploaded or approved unless a receipt/file proves it.
