"""Strict visual candidate contract; no coercion or non-finite JSON."""
import json, re
FIELDS=('subjects character_identity anatomy action contact_physics world location architecture camera lens camera_angle depth_of_field lighting color_temperature color_grade materials weather atmosphere VFX composition story_focus negative_constraints aspect_ratio').split()
def validate_scene(scene):
    if not isinstance(scene,dict): raise ValueError('SceneSpec must be an object')
    for key in FIELDS:
        if key not in scene or scene[key] in (None,'',[],{}): raise ValueError('SceneSpec missing '+key)
    for key in ('subjects','negative_constraints'):
        if not isinstance(scene[key],list) or not all(isinstance(v,str) and v.strip() for v in scene[key]): raise ValueError('SceneSpec list required '+key)
    for key in set(FIELDS)-{'subjects','negative_constraints','lighting'}:
        if not isinstance(scene[key],str) or not scene[key].strip(): raise ValueError('SceneSpec string required '+key)
    light=scene['lighting']
    if not isinstance(light,dict) or not all(isinstance(light.get(k),str) and light[k].strip() for k in ('key','fill','rim')): raise ValueError('lighting key/fill/rim required')
    if not re.fullmatch(r'[1-9]\d*:[1-9]\d*',scene['aspect_ratio']): raise ValueError('invalid aspect ratio')
    json.dumps(scene,allow_nan=False)
    return scene
