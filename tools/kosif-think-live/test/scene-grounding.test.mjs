// Runs the real c500 finalizer at the SceneSpec stage on the real duck-vs-dragon request data
// (test/fixtures/duck-meta.full.json, exported from its archive), with a scripted AI model.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SRC = process.env.WORKER || "../src-0.26.1/worker.next.js";
const worker = (await import(SRC)).default;
const FULL = JSON.parse(readFileSync(new URL("./fixtures/duck-meta.full.json", import.meta.url), "utf8"));
const VALID_SCENE = FULL.scene_spec;
const LATER = ["scene_spec", "candidate_digest", "candidate_frozen", "scene_spec_receipt", "deterministic_validation_receipt", "final_stability_receipts", "final_stable", "gate_receipts", "gates_pass", "host_image_prompt", "host_prompt_creator_receipt", "host_prompt_revision_count", "finalization_phase", "host_prompt_fidelity_history", "host_prompt_fidelity_receipt", "host_prompt_deterministic_fallback_used"];

function preSceneMeta(id) {
  const m = structuredClone(FULL);
  for (const k of LATER) delete m[k];
  m.request_id = id; m.status = "finalizing"; m.last_error = null;
  return m;
}

function makeEnv(id, scripted) {
  const kv = new Map([["fp:req:" + id, JSON.stringify(preSceneMeta(id))]]), queue = [], prompts = [];
  return {
    kv, queue, prompts,
    FULL_PRO_STATE: {
      async get(k, o) { const v = kv.get(k); return v == null ? null : (o?.type === "json" || o === "json") ? JSON.parse(v) : v; },
      async put(k, v) { kv.set(k, String(v)); },
      async delete(k) { kv.delete(k); },
      async list({ prefix = "" } = {}) { return { keys: [...kv.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }; },
    },
    FULL_PRO_QUEUE: { async send(body) { queue.push(body); }, async sendBatch(msgs) { msgs.forEach(m => queue.push(m.body)); } },
    SECURE_EXECUTOR: { async fetch() { return new Response(JSON.stringify({ ok: true, claimed: true, expert_completions: 500, expert_receipts_observed: 500, request: { status: "INITIALIZED" } }), { headers: { "content-type": "application/json" } }); } },
    AI: { async run(model, opts) { prompts.push(opts.messages[0].content); const next = scripted.length > 1 ? scripted.shift() : scripted[0]; return { response: JSON.stringify(next) }; } },
    THINK_RATE_LIMITER: { async limit() { return { success: true }; } },
    THINK_MODEL_LIMITER: { async limit() { return { success: true }; } },
  };
}

async function advance(env, id) {
  const msg = { body: { kind: "c500_finalizer", request_id: id }, attempts: 1, ack() {}, retry() { throw new Error("retry requested"); } };
  await worker.queue({ messages: [msg] }, env, {});
  return JSON.parse(env.kv.get("fp:req:" + id));
}

test("format-only defects are fixed without inventing content and without a template", async () => {
  const s = structuredClone(VALID_SCENE);
  delete s.focal_length; delete s.aperture; s.aspect_ratio = "16 / 9"; s.notes = "extra key from the model";
  s.negative_constraints = s.negative_constraints.slice(0, 3);
  const env = makeEnv("sg-1", [s]);
  const m = await advance(env, "sg-1");
  assert.ok(m.scene_spec, JSON.stringify(m.scene_spec_attempts));
  assert.doesNotMatch(m.scene_spec_receipt.model, /deterministic/);
  assert.equal(m.scene_spec_attempts.length, 1);
  assert.equal(m.scene_spec.focal_length, "28mm");
  assert.equal(m.scene_spec.aperture, "f/4");
  assert.equal(m.scene_spec.notes, undefined);
  assert.equal(m.scene_spec.action, VALID_SCENE.action);
  assert.equal(env.prompts.length, 1);
});

test("a missing content field triggers a targeted repair that names the failure", async () => {
  const bad = structuredClone(VALID_SCENE); delete bad.action;
  const env = makeEnv("sg-2", [bad, structuredClone(VALID_SCENE)]);
  const m = await advance(env, "sg-2");
  assert.ok(m.scene_spec);
  assert.equal(m.scene_spec_attempts.length, 2);
  assert.equal(m.scene_spec_attempts[0].valid, false);
  assert.ok(m.scene_spec_attempts[0].failures.some(f => f.includes("action")), JSON.stringify(m.scene_spec_attempts[0]));
  assert.match(env.prompts[1], /Fix exactly these validation failures: .*action/);
  assert.match(env.prompts[1], /Council synthesis: /);
  assert.doesNotMatch(m.scene_spec_receipt.model, /deterministic/);
});

test("if the model never produces a valid scene, the request fails closed with no template", async () => {
  const bad = structuredClone(VALID_SCENE); delete bad.action; delete bad.composition;
  const env = makeEnv("sg-3", [bad]);
  const m = await advance(env, "sg-3");
  assert.equal(m.status, "blocked_scene_spec");
  assert.equal(m.last_error, "C500_SCENESPEC_NOT_EXPERT_GROUNDED");
  assert.equal(m.scene_spec, undefined);
  assert.equal(m.scene_spec_receipt, undefined);
  assert.equal(m.scene_spec_attempts.length, 4);
  assert.equal(env.prompts.length, 4);
});

test("the gateway reports provenance (expert-grounded scene, not a template)", async () => {
  const env = makeEnv("sg-4", [structuredClone(VALID_SCENE)]);
  await advance(env, "sg-4");
  const res = await worker.fetch(new Request("https://kosif-think-mcp.kosif199022.workers.dev/mcp/v0.22.3", {
    method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "cf-connecting-ip": "203.0.113.11" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "kosif_full_pro_execute", arguments: { request_id: "sg-4", subject: FULL.subject, confirmed_full_pro: true, visual: true } } }),
  }), env);
  const r = (await res.json()).result, d = r.structuredContent ?? JSON.parse(r.content[0].text);
  assert.equal(d.provenance.scene_from_template, false, JSON.stringify(d.provenance));
  assert.equal(d.provenance.expert_grounded, true);
  assert.equal(d.provenance.scene_spec_attempts, 1);
});
