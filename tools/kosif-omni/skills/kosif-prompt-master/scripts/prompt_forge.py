#!/usr/bin/env python3
"""KOSIF Prompt Forge — one structured spec → correctly formatted prompts for each generator.

stdin JSON (English values; only `text` may be Arabic because it is rendered on the image):
{"mode": "image"|"video",
 "subject": "a Saudi barista in a linen apron", "action": "pouring latte art",
 "environment": "minimal cafe with palm-wood counter", "time": "early morning",
 "shot": "medium close-up", "angle": "eye level", "lens": "85mm f/1.8",
 "lighting": "soft window key from camera left, warm 3800K", "palette": "cream, walnut, sage green",
 "style": "photorealistic editorial", "quality": ["natural skin texture", "sharp focus"],
 "aspect": "4:5", "negative": ["text artifacts", "extra fingers"], "text": "صباح الخير",
 "locks": {"character": "Layla · 28 · warm olive skin ..."},
 "camera_move": "slow push-in", "duration": "6 seconds", "motion": "steam rising", "fps": "24fps",   # video
 "platforms": ["chatgpt", "midjourney", "flux", "sdxl", "ideogram"] }                                 # optional
Platforms: chatgpt (DALL·E / GPT image), midjourney, flux, sdxl, ideogram, sora, veo, runway, kling.
Output: {"prompts": {platform: {...}}, "warnings": [...]} — lint each with kosif-image-studio prompt_lint.py.
"""
import json
import re
import sys

IMAGE = ["chatgpt", "midjourney", "flux", "sdxl", "ideogram"]
VIDEO = ["sora", "veo", "runway", "kling"]
FIELDS = ["subject", "action", "environment", "time", "shot", "angle", "lens", "lighting", "palette", "style"]


def _clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip().rstrip(".")


def _cap(s):
    """Upper-case the first letter only; str.capitalize() would turn 'ARRI Alexa' into 'arri alexa'."""
    return s[:1].upper() + s[1:]


def _words(s):
    return {w for w in re.findall(r"[a-z0-9]+", s.lower()) if len(w) > 2}


def _covered(lock, text):
    """True when the subject already carries >=80% of the lock's words, so repeating it only burns tokens."""
    lw = _words(lock)
    return bool(lw) and len(lw & _words(text)) / len(lw) >= 0.8


def _units(v, unit, word):
    """'24' -> '24 fps', '6' / '6s' -> '6 seconds'; anything already worded is kept."""
    m = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(" + unit + r")?", v, re.I)
    return f"{m.group(1)} {word}" if m else v


def _article(word):
    """'a' / 'an' by the next word's first letter: 'an epic', 'a photorealistic'."""
    return "an" if word[:1].lower() in "aeiou" else "a"


# SDXL is trained on ~1 MP buckets: map the aspect to its native resolution instead of writing it into the prompt.
SDXL_RES = {"1:1": "1024x1024", "16:9": "1344x768", "9:16": "768x1344", "4:5": "896x1152", "5:4": "1152x896",
            "3:2": "1216x832", "2:3": "832x1216", "4:3": "1152x896", "3:4": "896x1152", "21:9": "1536x640", "2.39:1": "1536x640"}


def _core(sp):
    locks = [_clean(v) for v in (sp.get("locks") or {}).values() if v]
    who = ", ".join(x for x in [_clean(sp.get("subject")), _clean(sp.get("action"))] if x)
    where = ", ".join(x for x in [_clean(sp.get("environment")), _clean(sp.get("time"))] if x)
    cam = ", ".join(x for x in [_clean(sp.get("shot")), _clean(sp.get("angle")), _clean(sp.get("lens"))] if x)
    return locks, who, where, cam


VAGUE = re.compile(r"\b(4k|8k|masterpiece|best quality|ultra[- ]?detailed|hyper[- ]?realistic|award[- ]winning|trending on artstation)\b", re.I)
QUALITY_RUBRIC = {"subject_clarity": 20, "camera_and_lens": 20, "lighting_physics": 20,
                  "materials_and_texture": 20, "platform_fit": 20}


def iron_rules(sp):
    """Iron rules distilled from the user's Drive books (Blue Diamond FINAL, PromptCraft Elite v3, Black Camel)."""
    w = []
    blob = " ".join(_clean(sp.get(k)) for k in FIELDS + ["quality"] if k != "quality") + " " + " ".join(sp.get("quality") or [])
    if re.match(r"\s*(a|an)\s+(photo|picture|image)\s+of\b", _clean(sp.get("subject")), re.I):
        w.append("iron rule: do not open with 'a photo of' — start with the subject itself")
    for m in sorted({m.lower() for m in VAGUE.findall(blob)}):
        w.append(f"iron rule: '{m}' is a vague booster — replace it with concrete lens, light and texture terms")
    light = _clean(sp.get("lighting"))
    if light and not re.search(r"\d{4}\s*k\b|key|rim|fill|window|from (camera )?(left|right|above|behind)|golden hour|overcast", light, re.I):
        w.append("iron rule: lighting should state physics — source, direction and colour temperature (e.g. 'window key from left, 4300K')")
    return w


def variations(sp):
    """Three variations per deliverable: Subtle, Dramatic, Technical (PromptCraft Elite v3)."""
    light = _clean(sp.get("lighting")) or "soft natural light"
    return {"subtle": f"same scene, gentler contrast, {light}, muted palette",
            "dramatic": "same scene, low-key chiaroscuro, hard rim light, deeper shadows, tighter framing",
            "technical": f"same scene, {_clean(sp.get('lens')) or '50mm f/2.8'}, exact exposure notes, named materials and textures"}


def forge(sp):
    mode = sp.get("mode", "image")
    if mode not in {"image", "video"}:
        raise ValueError("mode must be image or video")
    if not _clean(sp.get("subject")):
        raise ValueError("subject is required")
    warnings = []
    for k in FIELDS + ["camera_move", "motion"]:
        if re.search(r"[؀-ۿ]", str(sp.get(k, ""))):
            warnings.append(f"field '{k}' is Arabic: write generation fields in English; keep Arabic only in 'text'")
    missing = [k for k in ("lighting", "lens", "style", "aspect") if not sp.get(k)]
    if missing:
        warnings.append(f"missing {missing}: prompts will be weaker")
    platforms = sp.get("platforms") or (VIDEO if mode == "video" else IMAGE)
    unknown = [p for p in platforms if p not in IMAGE + VIDEO]
    if unknown:
        raise ValueError(f"unknown platforms {unknown}")
    locks, who, where, cam = _core(sp)
    light, pal, style = _clean(sp.get("lighting")), _clean(sp.get("palette")), _clean(sp.get("style"))
    quality = ", ".join(_clean(q) for q in sp.get("quality") or [])
    aspect = _clean(sp.get("aspect")) or "1:1"
    neg = [_clean(n) for n in sp.get("negative") or []]
    text = _clean(sp.get("text"))
    if text and re.search(r"[؀-ۿ]", text):
        warnings.append("Arabic on-image text often renders imperfectly: prefer Ideogram or add it as an overlay layer (IBM Plex Sans Arabic / Cairo)")
    lock_line = " ".join(f"[{l}]" for l in locks)
    # Token-budget platforms skip locks the subject already states; ChatGPT keeps the explicit identity line.
    for name, l in (sp.get("locks") or {}).items():
        l = _clean(l)
        if l and _covered(l, who) and l.lower() not in who.lower():
            warnings.append(f"lock '{name}' is paraphrased in the subject: reuse the lock text verbatim for continuity")
    compact_locks = " ".join(f"[{l}]" for l in locks if not _covered(l, who))
    out = {}
    for p in platforms:
        if p == "chatgpt":
            look = style or "photorealistic"
            parts = [f"Create {_article(look)} {look} image in {aspect} aspect ratio."]
            if lock_line:
                parts.append(f"Keep this identity exactly: {lock_line}.")
            parts.append(f"Subject: {who}.")
            if where:
                parts.append(f"Setting: {where}.")
            if cam:
                parts.append(f"Camera: {cam}.")
            if light:
                parts.append(f"Lighting: {light}.")
            if pal:
                parts.append(f"Palette: {pal}.")
            if quality:
                parts.append(f"Quality: {quality}.")
            if text:
                parts.append(f'Render this exact text: "{text}".')
            if neg:
                parts.append(f"Avoid: {', '.join(neg)}.")
            out[p] = {"prompt": " ".join(parts)}
        elif p == "midjourney":
            body = ", ".join(x for x in [compact_locks, who, where, cam, light, pal, style, quality] if x)
            if text:
                body += f', the text "{text}"'
            params = f" --ar {aspect} --style raw --v 7" + (f" --no {', '.join(neg)}" if neg else "")
            out[p] = {"prompt": body + params, "notes": "V7: --oref URL --ow 100 for character/object reference (--cref is V6 only); --sref URL for style; --stylize 50-250; --seed N for series coherence"}
        elif p == "flux":
            body = f"{_cap(style) + ' image' if style else 'An image'} of {who}"
            body += f", {where}" if where else ""
            body += f". Shot as {cam}" if cam else ""
            body += f", lit by {light}" if light else ""
            body += f", palette of {pal}" if pal else ""
            body += f". {_cap(quality)}" if quality else ""
            if compact_locks:
                body = f"{compact_locks} " + body
            if text:
                body += f'. The text "{text}" appears clearly'
            out[p] = {"prompt": body + f". Aspect ratio {aspect}.", "notes": "Flux has no negative prompt: describe the clean result you want instead; guidance 3–4"}
        elif p == "sdxl":
            tags = [f"({who}:1.2)"] + [x for x in [compact_locks, where, cam, light, pal, style, quality] if x]
            negs = list(dict.fromkeys(neg + ["lowres", "jpeg artifacts", "watermark"]))
            res = SDXL_RES.get(aspect, "1024px base")
            out[p] = {"prompt": ", ".join(tags), "negative_prompt": ", ".join(negs), "resolution": res,
                      "notes": f"set the canvas to {res} for {aspect} (SDXL reads aspect from the canvas, not the prompt); CFG 5–7; 30–40 steps"}
        elif p == "ideogram":
            q = f'"{text}" ' if text else ""
            # camera and quality were dropped here before, which cost Ideogram prompts ~26 lint points
            out[p] = {"prompt": f"{q}{style + ' ' if style else ''}design of {who}" + (f", {where}" if where else "") +
                      (f", {cam}" if cam else "") + (f", {light}" if light else "") + (f", palette {pal}" if pal else "") +
                      (f", {quality}" if quality else "") + f", aspect {aspect}",
                      "notes": "put exact on-image text first in quotes; choose Design or Realistic style type"}
        else:  # video
            move, dur, motion, fps = (_clean(sp.get(k)) for k in ("camera_move", "duration", "motion", "fps"))
            if not (move and dur):
                warnings.append(f"{p}: video needs camera_move and duration")
            dur = _units(dur, r"s|sec|secs|seconds?", "seconds") if dur else "5 seconds"
            fps = _units(fps, r"fps", "fps") if fps else "24 fps"
            body = ". ".join(x for x in [
                compact_locks, _cap(who), motion and f"Motion: {motion}", where and f"Setting: {where}",
                cam and f"Camera: {cam}" + (f", {move}" if move else ""), light and f"Lighting: {light}",
                pal and f"Palette: {pal}", style and f"Style: {style}", _cap(quality)] if x)
            body += f". Duration {dur}, {fps}, aspect ratio {aspect}."
            dialogue, audio = _clean(sp.get("dialogue")), _clean(sp.get("audio"))
            if p == "veo" and (dialogue or audio):
                bits = []
                if dialogue:
                    bits.append(f'{_clean(sp.get("speaker")) or "The character"} says: "{dialogue}" (no subtitles)')
                if audio:
                    bits.append(audio)
                body += " Audio: " + ". ".join(bits) + "."
            if p == "runway":
                # Runway Gen-4: one clear sequential description, positive phrasing only, short
                body = re.sub(r"\b(no|without|avoid)\s+[^.,]+[.,]?\s*", "", body)
                if len(body.split()) > 300:
                    warnings.append("runway: prompt is long; keep it under ~300 words / 400 tokens")
            notes = {"sora": "describe one continuous shot; keep physics plausible",
                     "veo": "Veo can add native audio: append 'Audio: …' with ambience and SFX",
                     "runway": "start from an approved keyframe; describe actions in sequence; no negative phrasing (Runway ignores/inverts it)",
                     "kling": "use Start/End frames and the motion brush; keep 5–10 s per shot"}[p]
            if p == "veo":
                notes += "; durations 4/6/8 s; for continuity feed the previous clip's last frame as the next first frame"
            out[p] = {"prompt": body, "negative_prompt": ", ".join(neg) if neg and p == "kling" else None, "notes": notes}
    warnings += iron_rules(sp)
    return {"mode": mode, "prompts": out, "warnings": warnings, "variations": variations(sp),
            "quality_rubric": QUALITY_RUBRIC,
            "next": "lint each prompt: python3 prompt_lint.py (kosif-image-studio) with mode image/video and the contract + locks"}


def main():
    # Windows consoles default to cp1252/cp1256: force UTF-8 so en dashes and Arabic text survive a pipe.
    for stream in (sys.stdin, sys.stdout):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    try:
        res = forge(json.load(sys.stdin))
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"ok": False, "error": str(e)}))
        return 2
    print(json.dumps(res, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
