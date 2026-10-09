// Per-request archive URL tests against the real worker with in-memory bindings.
import { test } from "node:test";
import assert from "node:assert/strict";

const SRC = process.env.WORKER || "../src/worker.js";
const worker = (await import(SRC)).default;
const BASE = "https://kosif-think-mcp.kosif199022.workers.dev";

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
  const res = await worker.fetch(new Request(BASE + "/mcp/v0.22.3", {
    method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "kosif_full_pro_execute", arguments: args } }),
  }), env);
  const r = (await res.json()).result;
  return r?.structuredContent ?? JSON.parse(r?.content?.[0]?.text ?? "null");
}
const get = (env, path, method = "GET") => worker.fetch(new Request(path.startsWith("http") ? path : BASE + path, { method }), env);
const metaKey = (env, id) => [...env.kv.keys()].find(k => k === "fp:req:" + id);

test("every gateway response carries a stable private archive_url", async () => {
  const env = makeEnv();
  const a = await execute(env, { request_id: "arc-1", subject: "من اكتشف أمريكا؟", confirmed_full_pro: true, executor: "text" });
  assert.match(a.archive_url, /^https:\/\/kosif-think-mcp\.kosif199022\.workers\.dev\/requests\/arc-1\/[0-9a-f]{32}\/$/);
  const b = await execute(env, { request_id: "arc-1", subject: "من اكتشف أمريكا؟", confirmed_full_pro: true, executor: "text" });
  assert.equal(b.archive_url, a.archive_url);
  const other = await execute(env, { request_id: "arc-2", subject: "x", confirmed_full_pro: true, executor: "text" });
  assert.notEqual(other.archive_url.split("/").at(-2), a.archive_url.split("/").at(-2));
});

test("archive index and files are served only with the exact key", async () => {
  const env = makeEnv();
  const { archive_url } = await execute(env, { request_id: "arc-3", subject: "بطة تقاتل تنيناً", confirmed_full_pro: true });
  const page = await get(env, archive_url);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type"), /text\/html/);
  assert.equal(page.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.match(await page.text(), /arc-3/);
  for (const f of ["status.json", "request.json", "pipeline.json", "experts.json", "result.md"]) {
    const r = await get(env, archive_url + f);
    assert.equal(r.status, 200, f);
  }
  const wrong = archive_url.replace(/[0-9a-f]{32}/, "0".repeat(32));
  assert.equal((await get(env, wrong)).status, 404);
  assert.equal((await get(env, wrong + "experts.json")).status, 404);
  assert.equal((await get(env, "/requests/arc-3/")).status, 404);
  assert.equal((await get(env, archive_url + "secrets.txt")).status, 404);
  assert.equal((await get(env, archive_url, "POST")).status, 405);
});

test("result.md shows the frozen image prompt or text answer", async () => {
  const env = makeEnv();
  const { archive_url } = await execute(env, { request_id: "arc-4", subject: "بطة تقاتل تنيناً", confirmed_full_pro: true });
  const k = metaKey(env, "arc-4"), meta = JSON.parse(env.kv.get(k));
  meta.host_image_prompt = { render_prompt: "A brave mallard duck duels a crimson dragon", aspect_ratio: "16:9", negative_constraints: ["no text"] };
  env.kv.set(k, JSON.stringify(meta));
  const md = await (await get(env, archive_url + "result.md")).text();
  assert.match(md, /A brave mallard duck duels a crimson dragon/);
  const experts = await (await get(env, archive_url + "experts.json")).json();
  assert.equal(experts.experts.length, 500);
});

test("request.json never exposes the raw source asset", async () => {
  const env = makeEnv();
  const { archive_url } = await execute(env, { request_id: "arc-5", subject: "x", confirmed_full_pro: true, executor: "text" });
  const k = metaKey(env, "arc-5"), meta = JSON.parse(env.kv.get(k));
  meta.source_asset_ref = "data:image/png;base64,AAAA";
  env.kv.set(k, JSON.stringify(meta));
  const body = await (await get(env, archive_url + "request.json")).json();
  assert.equal(body.source_asset_ref, undefined);
});

test("health and MCP routes are unchanged", async () => {
  const env = makeEnv();
  const h = await (await get(env, "/health")).json();
  assert.equal(h.ok, true);
  assert.equal((await get(env, "/nope")).status, 404);
});
