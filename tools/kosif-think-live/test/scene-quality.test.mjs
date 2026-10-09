// Scene quality (fix 3): expert finalists in prompts, vague fields repaired, stability revisions that actually apply.
// Runs the real finalizer on the real duck-vs-dragon request data with a scripted AI model.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SRC = process.env.WORKER || "../src-0.27.1/worker.next2.js";
const worker = (await import(SRC)).default;
const FULL = JSON.parse(readFileSync(new URL("./fixtures/duck-meta.full.json", import.meta.url), "utf8"));
const VALID_SCENE = FULL.scene_spec;
const LATER = ["scene_spec", "candidate_digest", "candidate_frozen", "scene_spec_receipt", "deterministic_validation_receipt", "final_stability_receipts", "final_stable", "gate_receipts", "gates_pass", "host_image_prompt", "host_prompt_creator_receipt", "host_prompt_revision_count", "finalization_phase", "host_prompt_fidelity_history", "host_prompt_fidelity_receipt", "host_prompt_deterministic_fallback_used"];

function baseMeta(id) {
  const m = structuredClone(FULL);
  for (const k of LATER) delete m[k];
  m.request_id = id; m.status = "finalizing"; m.last_error = null;
  return m;
}
function makeEnv(id, meta, scripted) {
  const kv = new Map([["fp:req:" + id, JSON.stringify(meta)]]), prompts = [];
  return {
    kv, prompts,
    FULL_PRO_STATE: {
      async get(k, o) { const v = kv.get(k); return v == null ? null : (o?.type === "json" || o === "json") ? JSON.parse(v) : v; },
      async put(k, v) { kv.set(k, String(v)); },
      async delete(k) { kv.delete(k); },
      async list({ prefix = "" } = {}) { return { keys: [...kv.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }; },
    },
    FULL_PRO_QUEUE: { async send() {}, async sendBatch() {} },
    SECURE_EXECUTOR: { async fetch() { return new Response(JSON.stringify({ ok: true, claimed: true, expert_completions: 500, expert_receipts_observed: 500, request: { status: "INITIALIZED" } }), { headers: { "content-type": "application/json" } }); } },
    AI: { async run(model, opts) { prompts.push(opts.messages[0].content); const next = scripted.length > 1 ? scripted.shift() : scripted[0]; return { response: JSON.stringify(next) }; } },
  };
}
async function advance(env, id) {
  await worker.queue({ messages: [{ body: { kind: "c500_finalizer", request_id: id }, attempts: 1, ack() {}, retry() { throw new Error("retry"); } }] }, env, {});
  return JSON.parse(env.kv.get("fp:req:" + id));
}
const firstFinalist = String(FULL.c500_finalists[0].id);

test("the SceneSpec prompt carries the expert finalists", async () => {
  const env = makeEnv("sq-1", baseMeta("sq-1"), [structuredClone(VALID_SCENE)]);
  await advance(env, "sq-1");
  assert.match(env.prompts[0], /Expert finalists \(council picks first\)/);
  assert.ok(env.prompts[0].includes(firstFinalist), "finalist id missing from scene prompt");
});

test("vague core fields trigger a targeted repair that names them", async () => {
  const vague = structuredClone(VALID_SCENE);
  vague.action = "fighting"; vague.lighting = "dramatic lighting"; vague.environment = "medieval or cyberpunk setting with towering ruins";
  const env = makeEnv("sq-2", baseMeta("sq-2"), [vague, structuredClone(VALID_SCENE)]);
  const m = await advance(env, "sq-2");
  assert.ok(m.scene_spec, JSON.stringify(m.scene_spec_attempts));
  const f = m.scene_spec_attempts[0].failures;
  assert.ok(f.includes("too_vague:action") && f.includes("too_vague:lighting") && f.includes("undecided_alternatives:environment"), JSON.stringify(f));
  assert.match(env.prompts[1], /too_vague:action/);
  assert.equal(m.scene_spec.action, VALID_SCENE.action);
});

test("a stability revision whose patch carries an unknown key is still applied (was silently rejected)", async () => {
  const meta = baseMeta("sq-3");
  meta.scene_spec = structuredClone(VALID_SCENE); meta.candidate_digest = "prior"; meta.candidate_frozen = true;
  meta.final_stability_receipts = [{ stage: "final_stability_1", choice: "review", noul_probability: 0.6 }, { stage: "final_stability_2", choice: "review", noul_probability: 0.62 }];
  const patch = { notes: "model chatter that is not a SceneSpec key", lighting: VALID_SCENE.lighting + " Wet surfaces catch the warm key as thin specular streaks." };
  const env = makeEnv("sq-3", meta, [patch]);
  const m = await advance(env, "sq-3");
  assert.equal(m.stability_revision_count, 1);
  assert.equal((m.stability_revision_receipts || []).length, 1, JSON.stringify(m.stability_revision_failures));
  assert.equal(m.scene_spec.notes, undefined);
  assert.match(m.scene_spec.lighting, /thin specular streaks/);
  assert.deepEqual(m.final_stability_receipts, []);
  assert.match(env.prompts[0], /Expert finalists \(council picks first\)/);
});

test("a stability revision that stays invalid is recorded with its reasons", async () => {
  const meta = baseMeta("sq-4");
  meta.scene_spec = structuredClone(VALID_SCENE); meta.candidate_digest = "prior"; meta.candidate_frozen = true;
  meta.final_stability_receipts = [{ stage: "final_stability_1", choice: "review", noul_probability: 0.6 }, { stage: "final_stability_2", choice: "review", noul_probability: 0.6 }];
  const env = makeEnv("sq-4", meta, [{ action: "fighting" }]);
  const m = await advance(env, "sq-4");
  assert.equal((m.stability_revision_receipts || []).length, 0);
  assert.equal(m.stability_revision_failures.length, 1);
  assert.ok(m.stability_revision_failures[0].failures.includes("too_vague:action"));
});
