# Modes

## Standard (default)
Route to the narrowest skill/tool, answer, verify consequential effects. No expert fan-out, no receipts ceremony. Use `kosif-think` for planning when the task has several steps, risks or tool choices.

## Council
Trigger: competing hypotheses, architecture/strategy decisions, high stakes, or the user asks for experts/red team.
1. `kosif_council_panel question=…` → governing roles + elite + diverse scholars (psychological-state and method diversity).
2. `kosif_council_protocol` → session templates + constitution.
3. Write each member's **independent** opinion before showing peers (same input to all; three distinct proposals each is the Council-500 contract, a smaller panel is fine for Council mode).
4. Red team attacks → verifier classifies claims [confirmed]/[probable]/[hypothesis] → members revise → synthesizer's verdict with calibrated confidence and "what would change my mind".
5. Optionally `kosif_council100_select` / `kosif_council100_aggregate` for evidence-weighted synthesis (never vote counting) and `kosif_decision_sensitivity` for option ranking.
Report honestly: one model voicing the panel = one independent source.

## Deep
Single-thread, slower, evidence-first: `kosif-cognitive-core` module graph (select the smallest connected subgraph of M01–M28 that can change the decision), active information (what single fact would change the action?), falsifiers, robustness/reversal thresholds. Use when the cost of error is high but experts add little.

## Full Pro (explicit only)
Triggers: "Pro", "Full Pro", "all experts", "all capabilities", "برو مود", "الوضع الكامل", "كل الخبراء", "كل القدرات". Freeze `FULL_PRO_REQUIRED` before choosing tools.

**Path A — live KOSIF backend exposed** (`kosif_full_pro_*` / `kosif_think` tools from the remote MCP): use it first; follow `kosif-think-pro`, `kosif-runtime-orchestrator`, `kosif-secure-executor`. Only COMPLETE plus current executor, execution-contract and artifact-QA receipts is success.

**Path B — local engine (Claude, or ChatGPT without the backend)**:
1. `kosif_full_pro_entry command=enter selected=true text=<request>` → `request_id`; then `start`.
2. Run the real work with tools above (council panel, deterministic gates, domain tools).
3. Before any consequential action: `kosif_risk_gate`, `kosif_full_pro_entry command=route tool=<proposed tool>`.
4. Label every receipt **`LOCAL_ENGINE`**. The local engine is bookkeeping and gates; it does **not** execute 155–500 expert cycles or 100×100 Jev calls by itself and there is no deployed secure-executor backend — state both facts plainly.
5. Report exact partial progress if budget/host limits stop the run. Never simulate completion, never fabricate receipts or counts.

If a required stage cannot run in this host, return `FULL_PRO_BLOCKED_CAPABILITY_GAP` naming the stage — do not silently fall back to a normal tool and call it Full Pro. A host-native executor call while KOSIF owns the request is a **bypass**; record it and do not claim Full Pro success.

## Council-500 numbers (what is a fact, what is a library)
- The roster library has **1,040** members (40 elite + 1,000 scholars; 51 domains, 24 psychological states, 44 methods, 10 schools). `kosif_council_overlay500` builds a fixed 500-profile overlay (40 + 460, all 51 domains).
- "500 experts" counts **executed independent expert cycles** only. An overlay or roster is not executed headcount.
