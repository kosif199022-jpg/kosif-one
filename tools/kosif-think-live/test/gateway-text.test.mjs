// Gateway regression tests for the text executor patch, run against the real worker with in-memory bindings.
import { test } from "node:test";
import assert from "node:assert/strict";

const SRC = process.env.WORKER || "../src/worker.js";
const worker = (await import(SRC)).default;

function makeEnv() {
  const kv = new Map(), queue = [];
  return {
    kv, queue,
    FULL_PRO_STATE: {
      async get(k, o) { const v = kv.get(k); return v == null ? null : (o?.type === "json" || o === "json") ? JSON.parse(v) : v; },
      async put(k, v) { kv.set(k, String(v)); },
      async delete(k) { kv.delete(k); },
      async list({ prefix = "" } = {}) { return { keys: [...kv.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }; },
    },
    FULL_PRO_QUEUE: { async send(body) { queue.push(body); }, async sendBatch(msgs) { msgs.forEach(m => queue.push(m.body)); } },
    SECURE_EXECUTOR: { async fetch() { return new Response(JSON.stringify({ ok: true, request: { status: "INITIALIZED" }, expert_completions: 0 }), { headers: { "content-type": "application/json" } }); } },
    THINK_RATE_LIMITER: { async limit() { return { success: true }; } },
    THINK_MODEL_LIMITER: { async limit() { return { success: true }; } },
    THINK_FRONTIER_ENABLED: "false",
  };
}

async function execute(env, args) {
  const res = await worker.fetch(new Request("https://kosif-think-mcp.kosif199022.workers.dev/mcp/v0.22.3", {
    method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "cf-connecting-ip": "203.0.113.7" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "kosif_full_pro_execute", arguments: args } }),
  }), env);
  const body = await res.json();
  const r = body.result;
  return { r, data: r?.structuredContent ?? JSON.parse(r?.content?.[0]?.text ?? "null"), body };
}

const SUBJECT = "من اكتشف أمريكا؟";

test("text executor starts a text Full Pro request (was FULL_PRO_GATEWAY_EXECUTOR_UNSUPPORTED)", async () => {
  const env = makeEnv();
  const { r, data } = await execute(env, { request_id: "t-text-1", subject: SUBJECT, confirmed_full_pro: true, executor: "text" });
  assert.notEqual(r.isError, true, JSON.stringify(data));
  assert.equal(data.status, "running");
  assert.equal(data.next_action.executor, "text");
  assert.equal(data.next_action.visual, false);
  const meta = JSON.parse([...env.kv.entries()].find(([k]) => k.includes("t-text-1") && JSON.parse(env.kv.get(k)).subject)[1]);
  assert.equal(meta.executor, "text");
  assert.equal(meta.visual, false);
  assert.ok(env.queue.some(m => m.kind === "c500_fanout" && m.request_id === "t-text-1"));
});

test("text resume with visual:true is normalized, not a conflict", async () => {
  const env = makeEnv();
  await execute(env, { request_id: "t-text-2", subject: SUBJECT, confirmed_full_pro: true, executor: "text" });
  const { r, data } = await execute(env, { request_id: "t-text-2", subject: SUBJECT, confirmed_full_pro: true, executor: "text", visual: true });
  assert.notEqual(r.isError, true, JSON.stringify(data));
});

test("image default is unchanged", async () => {
  const env = makeEnv();
  const { r, data } = await execute(env, { request_id: "t-img-1", subject: "a red fox at dawn", confirmed_full_pro: true });
  assert.notEqual(r.isError, true, JSON.stringify(data));
  assert.equal(data.next_action.executor, "image");
});

test("unknown executor is still refused", async () => {
  const env = makeEnv();
  const { r, body } = await execute(env, { request_id: "t-vid-1", subject: "x", confirmed_full_pro: true, executor: "video" });
  assert.ok(r?.isError === true || body.error, JSON.stringify(body));
});

test("completed text request returns text_result without an image artifact", async () => {
  const env = makeEnv();
  await execute(env, { request_id: "t-text-3", subject: SUBJECT, confirmed_full_pro: true, executor: "text" });
  const key = [...env.kv.keys()].find(k => k.includes("t-text-3") && JSON.parse(env.kv.get(k)).subject);
  const meta = JSON.parse(env.kv.get(key));
  Object.assign(meta, { status: "complete", final_stable: true, gates_pass: true, candidate_frozen: true,
    text_result: { answer: "Indigenous peoples first; Norse c. 1000; Columbus 1492.", evidence: [], uncertainty: [], objections: [], confidence: 0.9 } });
  env.kv.set(key, JSON.stringify(meta));
  const { r, data } = await execute(env, { request_id: "t-text-3", subject: SUBJECT, confirmed_full_pro: true, executor: "text" });
  assert.notEqual(r.isError, true, JSON.stringify(data));
  assert.equal(data.host_directive, "FULL_PRO_COMPLETE_TEXT_RESULT");
  assert.match(data.final_answer, /Columbus 1492/);
  assert.ok(!r.content.some(c => c.type === "image"));
});
