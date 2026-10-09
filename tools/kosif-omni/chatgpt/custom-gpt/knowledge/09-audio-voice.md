# KOSIF Omni knowledge — 09-audio-voice


<!-- ===== skill: kosif-audio ===== -->
---
name: kosif-audio
description: Use for any audio task — analyzing an uploaded audio file (loudness, peaks, BPM, clipping, spectrum), mixing/mastering advice, songs and lyrics (Suno/Udio), Arabic maqam and rhythm, voice-over scripts and TTS direction, podcast production, sound effects and sound design for video. Triggers on /audio /master /mix /song /voice /sfx /podcast, "صوت", "أغنية", "موسيقى", "تعليق صوتي", "ماسترينغ".
---
# KOSIF Audio Lab

## /audio <file> — measured analysis
Run `scripts/audio_analyze.py FILE --summary [--target streaming|podcast|broadcast|club] [--plot out.png]` (numpy; WAV natively, MP3/M4A via soundfile or ffmpeg if installed — otherwise ask for WAV).
It measures: duration, sample rate, bit depth, channels · sample peak and 4× oversampled true peak · RMS, crest factor · integrated loudness (BS.1770-4 K-weighting + gating) · gain to target · DC offset · clipped samples · silence segments · stereo correlation and L/R balance · spectral centroid and band shares (sub/bass/low-mid/mid/presence/air) · tempo estimate (onset autocorrelation, with confidence).
Report: numbers table → problems (with the measured evidence) → exact fix chain → export settings. Show the plot when produced.
The meter follows BS.1770 closely but is not certified; tempo is an estimate — say so.

## Loudness targets
Spotify/YouTube/Apple ≈ −14 LUFS, TP ≤ −1 dBTP · Podcast −16 LUFS (mono −19) · Broadcast EBU R128 −23 LUFS, TP −1 · Club/DJ −9 to −6 LUFS, TP −0.3.

## /master and /mix — processing chain
1. Clean: high-pass 20–30 Hz (80–100 Hz for voice), remove DC, de-click/de-noise.
2. EQ: cut mud 200–400 Hz, boxiness 400–800 Hz, harshness 2.5–5 kHz; add air shelf 10–12 kHz gently.
3. Dynamics: compressor (voice 3:1, attack 10 ms, release 80 ms, 3–6 dB GR; mix bus 2:1, 1–2 dB GR); de-esser 5–8 kHz.
4. Space: short room/plate reverb, pre-delay 20–40 ms; delay synced to BPM (ms = 60000 / BPM).
5. Master: glue compression → EQ → limiter ceiling = target TP → loudness to target (use gain_to_target_db).
6. Export: WAV 24-bit/48 kHz master; MP3 320 kbps or AAC 256 kbps for delivery.

## /song <idea> — Suno/Udio-ready package
- Title · **Style prompt** (English ≤ 200 chars: genre, sub-genre, mood, BPM, key, instruments, vocal type/gender, production era) · **Exclude styles**.
- Lyrics with tags `[Intro] [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Bridge] [Final Chorus] [Outro]`; syllable-balanced lines; a hook repeated 2–4×; rhyme scheme stated.
- Arabic: dialect (Khaleeji, Egyptian, Levantine, Iraqi, Sudanese, Maghrebi, Fusha), maqam and rhythm from `references/arabic-music.md`; add tashkeel on words likely to be mispronounced; avoid rare words the model may garble.
- Alternative version (different genre) + a 15-second hook for reels.

## /voice <text> — voice-over direction
Voice profile (gender, age range, tone, accent/dialect, pace in WPM: ads 150–170, narration 130–150, meditation 100–120) · script marked with `[pause 0.5s]`, *emphasis*, (emotion) per line · TTS settings (stability/similarity/style/speed) · recording: cardioid mic 10–15 cm, pop filter, treated corner, peaks around −12 dBFS, 48 kHz/24-bit.

## /sfx <scene> — sound design sheet
Table: timecode · layer (ambience/foley/hard FX/music/UI) · description · level (dBFS) · pan · prompt for AI SFX tools (ElevenLabs SFX, Stable Audio).

## /podcast — episode production plan: structure, intro/outro music cues, levels, noise floor target (< −60 dBFS), chapter markers, show notes.

## Limits
ChatGPT cannot play or synthesize audio natively unless an audio tool is exposed; when it is not, deliver scripts/prompts/settings and say generation must happen in Suno/TTS tools. Never claim to have listened beyond the measured numbers.


<!-- ----- kosif-audio/references/arabic-music.md ----- -->
# Arabic Music Reference

## Maqamat (mood → maqam)
| Maqam | Character | Common use | Suno hint |
|---|---|---|---|
| Rast | noble, balanced, proud | national songs, anthems | "Arabic maqam Rast, oud, qanun" |
| Bayati | warm, earthy, heartfelt | folk, Khaleeji, love songs | "maqam Bayati, emotional oud" |
| Hijaz | longing, mystical, dramatic | religious, desert themes, cinematic | "Hijaz scale, mystical, ney flute" |
| Saba | sorrow, grief | laments, sad ballads | "maqam Saba, melancholic strings" |
| Nahawand | romantic, like minor | pop ballads, film | "Nahawand, romantic Arabic pop" |
| Kurd | tender, modern | contemporary pop | "Kurd scale, modern Arabic pop" |
| Ajam | bright, joyful, like major | weddings, children, celebration | "Ajam, festive, bright brass" |
| Sikah | spiritual, delicate | Quranic-style recitation melody, Sufi | "Sikah, spiritual, soft percussion" |

## Rhythms (iqa'at)
| Rhythm | Meter | Feel | Use |
|---|---|---|---|
| Maqsum | 4/4 (D T - T D - T -) | classic Egyptian pop | pop, dance |
| Baladi | 4/4 (D D - T D - T -) | earthy, heavy | shaabi, folk |
| Saidi | 4/4 (D T - D D - T -) | Upper-Egypt, stick dance | energetic folk |
| Malfuf | 2/4 | fast, driving | intros, transitions |
| Khaleeji | 2/4 shuffle with claps | Gulf swing | Khaleeji songs |
| Ayoub | 2/4 | trance, zar | Sufi, hypnotic |
| Samai Thaqil | 10/8 | classical, stately | muwashshahat |
| Wahda | 4/4 slow | tarab, ballads | slow tarab |
| Chobi / Dabke | 4/4 | line dance | Levantine weddings |

## Instruments
oud, qanun, ney, violin section, darbuka/tabla, riq, daf, bendir, mizmar, rababa, buzuq, kawala, Khaleeji hand-claps (tasfiq), synth pads for modern pop.

## Pronunciation tips for AI singing
Add tashkeel to ambiguous words, split long compounds, repeat the hook exactly, avoid mixing dialects in one song, write numbers as words.


<!-- ===== skill: kosif-voice ===== -->
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
