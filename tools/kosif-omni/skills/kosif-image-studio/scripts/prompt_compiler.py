#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re
from typing import Any

REQUIRED=["subject","environment","action","camera","lighting","color_grade","materials","atmosphere_vfx","composition_story","negative_constraints","aspect_ratio"]

def canonical_scene(scene:dict)->dict:
    for k in REQUIRED:
        if k not in scene or scene[k] in (None,"",[]): raise ValueError(f"SceneSpec missing {k}")
    if not re.fullmatch(r"\d+\s*:\s*\d+",str(scene["aspect_ratio"])): raise ValueError("aspect_ratio must be W:H")
    return {k:scene[k] for k in sorted(scene)}

def scene_digest(scene:dict)->str:
    c=canonical_scene(scene)
    return hashlib.sha256(json.dumps(c,ensure_ascii=False,sort_keys=True,separators=(",",":"),default=str).encode()).hexdigest()

def compile_prompt(scene:dict)->dict:
    c=canonical_scene(scene)
    neg=c["negative_constraints"] if isinstance(c["negative_constraints"],list) else [str(c["negative_constraints"])]
    parts=[
        f"Subject: {c['subject']}",f"Environment: {c['environment']}",f"Action: {c['action']}",
        f"Camera: {c['camera']}",f"Lighting: {c['lighting']}",f"Color grade: {c['color_grade']}",
        f"Materials: {c['materials']}",f"Atmosphere/VFX: {c['atmosphere_vfx']}",f"Composition/story: {c['composition_story']}",
        f"Aspect ratio: {c['aspect_ratio']}"
    ]
    return {"prompt":". ".join(str(x).strip().rstrip('.') for x in parts)+".","negative_prompt":neg,"scene_digest":scene_digest(c),"scene_spec":c}
