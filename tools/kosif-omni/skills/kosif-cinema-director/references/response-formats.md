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
