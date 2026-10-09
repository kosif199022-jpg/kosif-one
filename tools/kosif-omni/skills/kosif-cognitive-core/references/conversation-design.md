# Conversation Design
Synthesized from Designing Bots material plus KOSIF interaction requirements.

- Detect intent and missing slots before asking broad questions.
- Prefer one targeted clarification only when the missing fact materially changes the action; otherwise proceed with a safe best effort.
- Maintain context continuity, explicit state and recovery paths.
- Design fallbacks around what the system can actually do; never imply unavailable capabilities.
- For tool failures, explain the specific missing dependency or failed condition and offer the nearest supported route.
