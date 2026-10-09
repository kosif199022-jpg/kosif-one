// Fix 6: criterion-decomposed stability + revisions that cannot silently do nothing.
// Runs the real finalizer on the real duck-vs-dragon request data with a scripted model and a scripted Jev.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SRC = process.env.WORKER || "../src-0.29.3/worker.next6.js";
const worker = (await import(SRC)).default;
const FULL = JSON.parse(readFileSync(new URL("./fixtures/duck-meta.full.json", import.meta.url), "utf8"));
const VALID_SCENE = FULL.scene_spec;
const LATER = ["scene_spec", "candidate_digest", "candidate_frozen", "scene_spec_receipt", "deterministic_validation_receipt", "final_stability_receipts", "final_stable", "gate_receipts", "gates_pass", "host_image_prompt", "host_prompt_creator_receipt", "host_prompt_revision_count", "finalization_phase", "host_prompt_fidelity_history", "host_prompt_fidelity_receipt", "host_prompt_deterministic_fallback_used"];
const CRITERIA = ["intent_fidelity", "expert_grounding", "internal_consistency", "single_frame_renderability", "specificity", "safety_constraints"];
// Same digest the worker freezes: SHA-256 over canonical JSON with sorted keys (secureCanonical/secureSha256Hex).
const canonical = (v) => v === null || typeof v !== "object" ? JSON.stringify(v) : Array.isArray(v) ? "[" + v.map(canonical).join(",") + "]" : "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
const VALID_DIGEST = Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical(VALID_SCENE)))).toString("hex");

function frozenMeta(id, receipts = []) {
  const m = structuredClone(FULL);
  for (const k of LATER) delete m[k];
  Object.assign(m, { request_id: id, status: "finalizing", last_error: null, scene_spec: structuredClone(VALID_SCENE), candidate_digest: VALID_DIGEST, candidate_frozen: true, final_stability_receipts: receipts });
  return m;
}
function reviewReceipts(weak = "specificity") {
  return [1, 2].map((n) => ({ stage: "final_stability_" + n, choice: "review", noul_probability: 0.6, criteria: CRITERIA.map((c) => ({ criterion: c, noul_probability: c === weak ? 0.6 : 0.9, choice: c === weak ? "review" : "pass" })) }));
}
function makeEnv(id, meta, { ai = [{}], jev = {} } = {}) {
  const kv = new Map([["fp:req:" + id, JSON.stringify(meta)]]), prompts = [], jevBodies = [];
  return {
    kv, prompts, jevBodies,
    FULL_PRO_STATE: {
      async get(k, o) { const v = kv.get(k); return v == null ? null : (o?.type === "json" || o === "json") ? JSON.parse(v) : v; },
      async put(k, v) { kv.set(k, String(v)); },
      async delete(k) { kv.delete(k); },
      async list({ prefix = "" } = {}) { return { keys: [...kv.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }; },
    },
    FULL_PRO_QUEUE: { async send() {}, async sendBatch() {} },
    SECURE_EXECUTOR: { async fetch() { return new Response(JSON.stringify({ ok: true, claimed: true, expert_completions: 500, expert_receipts_observed: 500, request: { status: "INITIALIZED" } }), { headers: { "content-type": "application/json" } }); } },
    KOSIF_JEV: { async fetch(req) { const b = await req.json(); jevBodies.push(b); const p = jev[b.state?.criterion] ?? 0.9; return new Response(JSON.stringify({ ok: true, result: { model: "jev-test", answers: { decision: { noul: p } } } }), { headers: { "content-type": "application/json" } }); } },
    AI: { async run(model, opts) { prompts.push(opts.messages[0].content); const next = ai.length > 1 ? ai.shift() : ai[0]; return { response: JSON.stringify(next) }; } },
  };
}
async function advance(env, id) {
  await worker.queue({ messages: [{ body: { kind: "c500_finalizer", request_id: id }, attempts: 1, ack() {}, retry() { throw new Error("retry"); } }] }, env, {});
  return JSON.parse(env.kv.get("fp:req:" + id));
}

test("stability judges six single criteria twice, with the expert finalists as the reference", async () => {
  const env = makeEnv("st-1", frozenMeta("st-1"));
  const m = await advance(env, "st-1");
  assert.equal(env.jevBodies.length, 12);
  assert.deepEqual([...new Set(env.jevBodies.map((b) => b.state.criterion))].sort(), [...CRITERIA].sort());
  for (const b of env.jevBodies) {
    assert.match(b.instructions, /^(Independent second check\. )?Judge ONLY this one criterion: /);
    assert.ok(b.instructions.length <= 1200);
    assert.ok(String(b.state.reference_expert_finalists).includes(String(FULL.c500_finalists[0].id)) || b.state.reference_expert_finalists.length > 2);
    assert.doesNotMatch(b.instructions, /you are|be strict/i);
  }
  assert.equal(m.final_stability_receipts.length, 2);
  assert.ok(m.final_stability_receipts.every((r) => r.choice === "pass" && r.criteria.length === 6 && r.contract_version === "criterion_decomposed_v1"));
});

test("one weak criterion makes the pass 'review', and the next revision is told which criterion failed", async () => {
  const env = makeEnv("st-2", frozenMeta("st-2"), { jev: { specificity: 0.6 }, ai: [{ lighting: VALID_SCENE.lighting + " Thin specular rain streaks catch the warm key." }] });
  let m = await advance(env, "st-2");
  assert.ok(m.final_stability_receipts.every((r) => r.choice === "review"));
  assert.equal(m.final_stability_receipts[0].noul_probability, 0.6);
  m = await advance(env, "st-2");
  assert.match(env.prompts[0], /Failing stability criteria \(fix these specifically\): .*specificity/);
  assert.equal((m.stability_revision_receipts || []).length, 1);
});

for (const [name, patch] of [
  ["an RFC 6902 patch", [{ op: "replace", path: "/lighting", value: VALID_SCENE.lighting + " Puddles mirror the fire." }]],
  ["a nested {patch:{...}} object", { patch: { lighting: VALID_SCENE.lighting + " Puddles mirror the fire." } }],
  ["an {operations:[...]} list", { operations: [{ op: "replace", path: "/lighting", value: VALID_SCENE.lighting + " Puddles mirror the fire." }] }],
]) {
  test(`${name} is unwrapped and applied`, async () => {
    const env = makeEnv("st-3", frozenMeta("st-3", reviewReceipts()), { ai: [patch] });
    const m = await advance(env, "st-3");
    assert.equal((m.stability_revision_receipts || []).length, 1, JSON.stringify(m.stability_revision_failures));
    assert.match(m.scene_spec.lighting, /Puddles mirror the fire\./);
  });
}

test("no-op revisions are recorded, and the second in a row regenerates the scene from the finalists", async () => {
  const regen = structuredClone(VALID_SCENE);
  regen.action = "The soaked duck sidesteps a hissing jet of dragon fire that bursts into white steam in the downpour, wings flared for balance.";
  const env = makeEnv("st-4", frozenMeta("st-4", reviewReceipts()), { ai: [{ summary: "looks fine" }, {}, regen] });
  let m = await advance(env, "st-4");
  assert.equal((m.stability_revision_receipts || []).length, 0);
  assert.deepEqual(m.stability_revision_failures.at(-1).failures, ["no_effective_change"]);
  assert.deepEqual(m.stability_revision_failures.at(-1).patch_keys, ["summary"]);
  assert.equal(m.stability_noop_streak, 1);
  m.final_stability_receipts = reviewReceipts(); env.kv.set("fp:req:st-4", JSON.stringify(m));
  m = await advance(env, "st-4");
  assert.match(env.prompts.at(-1), /Rewrite the complete SceneSpec/);
  assert.equal((m.stability_revision_receipts || []).length, 1, JSON.stringify(m.stability_revision_failures));
  assert.match(m.stability_revision_receipts[0].model, /regenerated/);
  assert.equal(m.scene_spec.action, regen.action);
});
