# Voice Director Provider Contract
Imported from KOSIF Voice Director 0.2.0.

Preserve these modes and behaviors:
- Emotion Text Mode: add performance cues without audio; preserve wording unless rewriting requested.
- Full Episode Completion Mode: continue canon, unresolved threads, character/dialect/tone continuity, complete episode arc, continuity pass.
- Director Script Mode: structured direction when persistence is useful.
- Audio Mode: direct -> cast -> render; return actual result only.
- Stable voices/casting, voice preview, pronunciation memory, selective turn rerender.
- Songs route to song generation rather than TTS.
- Audio backend configuration errors are reported precisely; never request or expose API secrets in ordinary chat.
