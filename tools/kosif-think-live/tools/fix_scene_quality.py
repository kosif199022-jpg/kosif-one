"""Scene quality, step 3 (apply AFTER fix_scene_grounding.py).

Problem seen live (2026-10-03, requests duck-vs-dragon-b and duck-dragon-rain-a): the expert-grounded SceneSpec was valid
but vague ("fighting", "dramatic lighting", "medieval or cyberpunk setting"), so final stability returned "review";
then all 7 stability revisions failed silently (rev_count 7, 0 receipts) because the model's patch carried
unknown keys and the revision prompt had no expert content.

Changes:
  1. SceneSpec, repair and stability-revision prompts receive the expert finalists (council top picks first).
  2. Vague core fields (too short, or undecided "X or Y") count as failures -> targeted repair.
  3. Stability revisions run the content-free format fix before validation, and every failed revision is recorded.

usage: python tools/fix_scene_quality.py <in_worker.js> <out_worker.js>
"""
import re
import sys
from pathlib import Path

src, dst = sys.argv[1], sys.argv[2]
t = Path(src).read_text(encoding="utf-8")
assert "fpSceneFormatFix" in t, "apply fix_scene_grounding.py first"
assert "fpSceneOk" not in t, "already applied"


def rep(old, new, count=1):
    global t
    n = t.count(old)
    assert n == count, (old[:90], n)
    t = t.replace(old, new)


HELPERS = '''function fpSceneDiagnose(scene, model, attempt) {'''
HELPERS_NEW = '''var FP_SCENE_CORE_TEXT = ["subject", "action", "environment", "world", "lighting", "composition"];
function fpSceneVagueIssues(scene) {
  const issues = [];
  if (!scene || typeof scene !== "object" || Array.isArray(scene)) return issues;
  for (const k of FP_SCENE_CORE_TEXT) {
    const v = String(typeof scene[k] === "string" ? scene[k] : JSON.stringify(scene[k] ?? "")).trim();
    if (v.length < 40) issues.push("too_vague:" + k);
    else if (/\\beither\\b|(?<!\\b(?:no|not|without|never|nor|avoid)\\b[^.,;]{0,60})\\bor\\b/i.test(v)) issues.push("undecided_alternatives:" + k);
  }
  return issues;
}
function fpSceneOk(scene) {
  return fullProSceneSpecValid(scene) && fpSceneVagueIssues(scene).length === 0;
}
function fpFinalistsBrief(meta, n = 6) {
  const fin = Array.isArray(meta?.c500_finalists) ? meta.c500_finalists : [];
  const top = Array.isArray(meta?.cross_expert_receipt?.output?.top_candidate_ids) ? meta.cross_expert_receipt.output.top_candidate_ids.map(String) : [];
  const ordered = [...fin.filter((f) => top.includes(String(f?.id))), ...fin.filter((f) => !top.includes(String(f?.id)))];
  return JSON.stringify(ordered.slice(0, n).map((f) => ({ id: f?.id, title: f?.title, proposal: String(f?.proposal || "").slice(0, 900), why: String(f?.why || "").slice(0, 300) })));
}
function fpSceneDiagnose(scene, model, attempt) {'''
rep(HELPERS, HELPERS_NEW)

# Diagnose: report vagueness, and validity means "valid and specific".
rep('''  for (const s of fullProSceneSemanticIssues(scene)) failures.push("semantic:" + s);
  return { attempt, model: model || null, valid: fullProSceneSpecValid(scene), failures };''',
    '''  for (const s of fullProSceneSemanticIssues(scene)) failures.push("semantic:" + s);
  for (const s of fpSceneVagueIssues(scene)) failures.push(s);
  return { attempt, model: model || null, valid: fpSceneOk(scene), failures };''')

# SceneSpec creation prompt: add the expert finalists and a specificity rule.
t, n = re.subn(r'("Einstein revision: " \+ JSON\.stringify\(meta\.einstein_stage_receipts\[6\]\.output\), )("Return one JSON object with exactly these keys: ")',
               r'\1"Expert finalists (council picks first). Ground every concrete visual decision in them and choose ONE coherent design, never alternatives joined by \'or\': " + fpFinalistsBrief(meta), \2', t)
assert n == 1, ("scene prompt anchor", n)

# Repair loop (from fix_scene_grounding): finalists in the prompt, and require valid AND specific.
rep('''for (let k = 0; k < 3 && !fullProSceneSpecValid(m.output); k++) {''', '''for (let k = 0; k < 3 && !fpSceneOk(m.output); k++) {''')
rep('''"Einstein revision: " + JSON.stringify(meta.einstein_stage_receipts?.[6]?.output || {}).slice(0, 4e3), "Current: " + JSON.stringify(m.output)]''',
    '''"Einstein revision: " + JSON.stringify(meta.einstein_stage_receipts?.[6]?.output || {}).slice(0, 4e3), "Expert finalists (council picks first): " + fpFinalistsBrief(meta), "Be concrete: subject, action, environment, world, lighting and composition each need at least one full specific sentence; pick one option, never 'X or Y'.", "Current: " + JSON.stringify(m.output)]''')
rep('''    meta.scene_spec_attempts = sceneAttempts;
    if (!fullProSceneSpecValid(m.output)) {''', '''    meta.scene_spec_attempts = sceneAttempts;
    if (!fpSceneOk(m.output)) {''')

# Stability revision: expert content in the prompt, format fix before validation, record failures.
rep('''        "Preserve subject, action, identity, safety constraints and aspect ratio. Keep one single still frame. Do not introduce new entities.",
        "Current frozen SceneSpec: " + JSON.stringify(meta.scene_spec)''',
    '''        "Preserve subject, action, identity, safety constraints and aspect ratio. Keep one single still frame. Do not introduce new entities.",
        "Make vague fields concrete and faithful to the expert finalists below; never offer alternatives with 'or'. Current vagueness: " + JSON.stringify(fpSceneVagueIssues(meta.scene_spec)),
        "Expert finalists (council picks first): " + fpFinalistsBrief(meta),
        "Current frozen SceneSpec: " + JSON.stringify(meta.scene_spec)''')
rep('''      let revised = fullProNormalizeSceneSpec({ ...meta.scene_spec, ...rr.output });
      if (!fullProSceneSpecValid(revised)) {
        const repaired = fullProDeterministicSemanticRepair(revised);
        if (fullProSceneSpecValid(repaired)) revised = repaired;
      }
      if (fullProSceneSpecValid(revised)) {''',
    '''      let revised = fpSceneFormatFix(fullProNormalizeSceneSpec({ ...meta.scene_spec, ...rr.output }));
      if (!fpSceneOk(revised)) {
        const repaired = fullProDeterministicSemanticRepair(revised);
        if (fpSceneOk(repaired)) revised = repaired;
      }
      if (!fpSceneOk(revised)) {
        meta.stability_revision_failures = Array.isArray(meta.stability_revision_failures) ? meta.stability_revision_failures : [];
        meta.stability_revision_failures.push(fpSceneDiagnose(revised, rr.model, "stability_revision_" + (rev + 1)));
      }
      if (fpSceneOk(revised)) {''')

# Archive pipeline.json: expose revision failures too.
t, n = re.subn(r"scene_spec_attempts:\s*meta\.scene_spec_attempts\s*\|\|\s*\[\]",
               "scene_spec_attempts: meta.scene_spec_attempts || [], stability_revision_receipts: meta.stability_revision_receipts || [], stability_revision_failures: meta.stability_revision_failures || []", t)
assert n == 1, ("pipeline anchor", n)

Path(dst).write_text(t, encoding="utf-8")
print("scene quality fix ->", dst)
