"""Make the image SceneSpec come from the experts, never from a hard-coded template.

Before: the model SceneSpec got one blind repair; if still invalid, c500DeterministicSceneSpec() (a pre-written scene,
with a dedicated duck-vs-dragon branch) was frozen silently and reported as success.
After:
  1. content-free format fixes (drop unknown keys, 16:9, lens/aperture pulled from the model's own text,
     generic negatives padded to 8, irrelevant element fields marked "not applicable", render_prompt rebuilt
     from the scene's own fields when too short);
  2. up to 3 targeted repairs that state the exact validation failures and re-supply the council synthesis
     and the Einstein revision;
  3. if still invalid -> fail closed (blocked_scene_spec / C500_SCENESPEC_NOT_EXPERT_GROUNDED), no template;
  4. every attempt is recorded (meta.scene_spec_attempts) and the gateway reports `provenance`.

usage: python tools/fix_scene_grounding.py <in_worker.js> <out_worker.js>
"""
import sys
from pathlib import Path

src, dst = sys.argv[1], sys.argv[2]
t = Path(src).read_text(encoding="utf-8")


def rep(old, new):
    global t
    n = t.count(old)
    assert n == 1, (old[:80], n)
    t = t.replace(old, new)


OLD_BLOCK = '''    let m = await fullProSceneModelJson(env, prompt);
    m = { ...m, output: fullProNormalizeSceneSpec(m.output) };
    if (!fullProSceneSpecValid(m.output)) {
      const repair = ["Repair this SceneSpec without changing user intent. Return a complete valid object using the same required keys. Irrelevant legacy fields must say 'not applicable', not introduce new scene content.", "Task: " + meta.subject, "Current: " + JSON.stringify(m.output)].join("\\n");
      const r = await fullProSceneModelJson(env, repair);
      m = { ...r, output: fullProNormalizeSceneSpec(r.output) };
    }
    if (!fullProSceneSpecValid(m.output)) {
      const fallback = fullProNormalizeSceneSpec(c500DeterministicSceneSpec(meta));
      if (!fullProSceneSpecValid(fallback)) throw new Error("C500_SCENESPEC_INVALID");
      m = { model: "deterministic-scene-fallback", output: fallback };
    }
'''
NEW_BLOCK = '''    let m = await fullProSceneModelJson(env, prompt);
    m = { ...m, output: fpSceneFormatFix(fullProNormalizeSceneSpec(m.output)) };
    const sceneAttempts = [fpSceneDiagnose(m.output, m.model, "initial")];
    for (let k = 0; k < 3 && !fullProSceneSpecValid(m.output); k++) {
      const repair = ["Repair this SceneSpec without changing user intent. Return a complete valid object using exactly these keys and no others: " + JSON.stringify(FP_SCENE_KEYS) + ". Irrelevant legacy fields must say 'not applicable', not introduce new scene content.", "Fix exactly these validation failures: " + JSON.stringify(sceneAttempts[sceneAttempts.length - 1].failures), "Rules: aspect_ratio must be 16:9; focal_length like '35mm'; aperture like 'f/2.8'; one single camera setup (no multiple shots); at least 8 negative_constraints; render_prompt is one paragraph of at least 450 characters stating 'single still frame'. Keep every creative decision grounded in the council synthesis and Einstein revision below.", "Task: " + meta.subject, "Council synthesis: " + JSON.stringify(meta.cross_expert_receipt?.output || {}).slice(0, 6e3), "Einstein revision: " + JSON.stringify(meta.einstein_stage_receipts?.[6]?.output || {}).slice(0, 4e3), "Current: " + JSON.stringify(m.output)].join("\\n");
      const r = await fullProSceneModelJson(env, repair);
      m = { ...r, output: fpSceneFormatFix(fullProNormalizeSceneSpec(r.output)) };
      sceneAttempts.push(fpSceneDiagnose(m.output, m.model, "repair_" + (k + 1)));
    }
    meta.scene_spec_attempts = sceneAttempts;
    if (!fullProSceneSpecValid(m.output)) {
      meta.status = "blocked_scene_spec";
      meta.last_error = "C500_SCENESPEC_NOT_EXPERT_GROUNDED";
      meta.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      await fpPut(env, fpReqKey(requestId), meta);
      return { reenqueue: false, status: meta.status, stage: "c500_scene_spec_blocked", attempts: sceneAttempts.length };
    }
'''
rep(OLD_BLOCK, NEW_BLOCK)

HELPERS = '''function fullProSceneSpecValid(scene) {'''
HELPERS_NEW = '''// Content-free SceneSpec format repair: never adds scene ideas, only fixes format from the model's own text.
var FP_SCENE_KEYS = ["subject", "identity", "anatomy", "wardrobe", "props", "world", "environment", "action", "contact_physics", "camera", "lens", "focal_length", "aperture", "camera_height", "angle", "dof", "composition", "lighting", "key", "fill", "rim", "kelvin", "fire_interaction", "materials", "feathers", "dragon_scales", "weather", "rain", "mist", "smoke", "embers", "vfx", "color_grade", "story", "negative_constraints", "aspect_ratio", "render_prompt"];
var FP_SCENE_OPTIONAL_ELEMENTS = ["fire_interaction", "feathers", "dragon_scales", "weather", "rain", "mist", "smoke", "embers", "vfx"];
var FP_GENERIC_NEGATIVES = ["no unrequested text", "no unrequested logo", "no watermark", "no extra limbs", "no malformed anatomy", "no impossible contact physics", "no contradictory lighting", "no unintended duplicate subjects"];
function fpSceneFilled(v) {
  return v !== void 0 && v !== null && String(typeof v === "string" ? v : JSON.stringify(v)).trim().length > 0;
}
function fpSceneFormatFix(scene) {
  if (!scene || typeof scene !== "object" || Array.isArray(scene)) return scene;
  const out = {};
  for (const k of FP_SCENE_KEYS) if (scene[k] !== void 0) out[k] = scene[k];
  out.aspect_ratio = "16:9";
  const camText = JSON.stringify({ lens: scene.lens, camera: scene.camera, dof: scene.dof, focal_length: scene.focal_length, aperture: scene.aperture });
  if (!/\\b\\d{2,3}\\s*mm\\b/i.test(String(out.focal_length || ""))) {
    const f = camText.match(/\\b(\\d{2,3})\\s*mm\\b/i);
    if (f) out.focal_length = f[1] + "mm";
  }
  if (!/f\\s*\\/?\\s*\\d+(?:\\.\\d+)?/i.test(String(out.aperture || ""))) {
    const a = camText.match(/\\bf\\s*\\/\\s*(\\d+(?:\\.\\d+)?)/i);
    if (a) out.aperture = "f/" + a[1];
  }
  let neg = out.negative_constraints;
  if (typeof neg === "string") neg = neg.split(/[;\\n]+/).map((x) => x.trim()).filter(Boolean);
  neg = Array.isArray(neg) ? neg.map((x) => String(x)).filter((x) => x.trim()) : [];
  for (const n of FP_GENERIC_NEGATIVES) if (neg.length < 8 && !neg.includes(n)) neg.push(n);
  out.negative_constraints = neg;
  for (const k of FP_SCENE_OPTIONAL_ELEMENTS) if (!fpSceneFilled(out[k])) out[k] = "not applicable unless explicitly requested";
  const core = FP_SCENE_KEYS.filter((k) => k !== "render_prompt" && !FP_SCENE_OPTIONAL_ELEMENTS.includes(k));
  if (String(out.render_prompt || "").trim().length < 450 && core.every((k) => fpSceneFilled(out[k]))) {
    try {
      out.render_prompt = fullProBuildCompactRenderPrompt(out);
    } catch (_) {
    }
  }
  return out;
}
function fpSceneDiagnose(scene, model, attempt) {
  const failures = [];
  if (!scene || typeof scene !== "object" || Array.isArray(scene)) return { attempt, model: model || null, valid: false, failures: ["not_an_object"] };
  const extra = fullProSceneSpecExtraKeys(scene), missing = fullProSceneSpecMissing(scene);
  if (extra.length) failures.push("extra_keys:" + extra.join(","));
  if (missing.length) failures.push("missing_or_empty:" + missing.join(","));
  if (String(scene.aspect_ratio || "").replace(/\\s+/g, "") !== "16:9") failures.push("aspect_ratio_not_16:9");
  if (!Array.isArray(scene.negative_constraints) || scene.negative_constraints.length < 8) failures.push("negative_constraints_fewer_than_8");
  if (!/\\b\\d{2,3}\\s*mm\\b/i.test(String(scene.focal_length || scene.camera?.focal_length || ""))) failures.push("focal_length_not_like_35mm");
  if (!/f\\s*\\/?\\s*\\d+(?:\\.\\d+)?/i.test(String(scene.aperture || scene.camera?.aperture || ""))) failures.push("aperture_not_like_f/2.8");
  const camText = JSON.stringify({ camera: scene.camera, lens: scene.lens, focal_length: scene.focal_length, camera_height: scene.camera_height, angle: scene.angle, dof: scene.dof }).toLowerCase();
  if (/mix of|multiple shots|different angles|dynamic focal|dynamic camera|sweeping and intimate/i.test(camText)) failures.push("camera_must_be_one_single_setup");
  if (String(scene.render_prompt || "").trim().length < 450) failures.push("render_prompt_shorter_than_450_chars");
  for (const s of fullProSceneSemanticIssues(scene)) failures.push("semantic:" + s);
  return { attempt, model: model || null, valid: fullProSceneSpecValid(scene), failures };
}
function fullProSceneSpecValid(scene) {'''
rep(HELPERS, HELPERS_NEW)

# Gateway: report where the frozen scene and the prompt came from.
rep('''  status.archive_url = await fpArchiveUrl(env, id);
''', '''  status.archive_url = await fpArchiveUrl(env, id);
  try {
    const pm = await fpGet(env, fpReqKey(id)) || {};
    const sceneModel = pm.scene_spec_receipt?.model || null;
    status.provenance = {
      scene_spec_model: sceneModel,
      scene_spec_attempts: Array.isArray(pm.scene_spec_attempts) ? pm.scene_spec_attempts.length : null,
      scene_from_template: sceneModel ? /deterministic/i.test(sceneModel) : null,
      prompt_creator: pm.host_image_prompt?.creator || null,
      prompt_serialized_from_scene: pm.host_prompt_deterministic_fallback_used === true,
      expert_grounded: sceneModel ? !/deterministic/i.test(sceneModel) : pm.executor === "text" ? !!pm.text_result : null
    };
  } catch (_) {
  }
''')

# Archive pipeline.json: include the scene attempts and receipt (matches minified or esbuild-formatted code).
import re
t, n = re.subn(r"host_image_prompt:\s*meta\.host_image_prompt\s*\|\|\s*null(\s*)\}(\s*),(\s*)200(\s*),(\s*)hdr\)",
               lambda m: "host_image_prompt: meta.host_image_prompt || null, scene_spec_receipt: meta.scene_spec_receipt || null, scene_spec_attempts: meta.scene_spec_attempts || []" + m.group(1) + "}" + m.group(2) + "," + m.group(3) + "200" + m.group(4) + "," + m.group(5) + "hdr)", t)
assert n == 1, ("pipeline.json anchor", n)

assert "c500DeterministicSceneSpec(meta)" not in t.split("function c500DeterministicSceneSpec")[0] + t.split("function c500DeterministicSceneSpec")[1].split("\n}\n", 1)[1], "template still referenced"
Path(dst).write_text(t, encoding="utf-8")
print("scene grounding fix ->", dst)
