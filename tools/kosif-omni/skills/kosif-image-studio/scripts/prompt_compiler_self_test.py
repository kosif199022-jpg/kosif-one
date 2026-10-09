#!/usr/bin/env python3
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import prompt_compiler as pc
scene={"subject":"white armored duck and black dragon","environment":"ruined castle","action":"duck braces as dragon lunges","camera":"low angle 24mm","lighting":"fire key, cool storm rim","color_grade":"teal-orange","materials":"wet feathers, obsidian scales, metal","atmosphere_vfx":"rain, smoke, sparks","composition_story":"extreme scale contrast, duck foreground","negative_constraints":["extra limbs","garbled text"],"aspect_ratio":"16:9"}
a=pc.compile_prompt(scene); b=pc.compile_prompt(dict(reversed(list(scene.items())))); assert a["scene_digest"]==b["scene_digest"]
changed=dict(scene); changed["camera"]="85mm close-up"; assert pc.scene_digest(changed)!=a["scene_digest"]
try: pc.compile_prompt({"subject":"x"}); raise AssertionError("missing fields should fail")
except ValueError: pass
print("PASS: typed SceneSpec compiles deterministically and any material prompt change changes the candidate digest.")
