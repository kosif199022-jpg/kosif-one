---
name: kosif-image-studio
description: Use for image creation/editing/prompt work. In Full Pro, build a typed SceneSpec, compile/freeze its digest, obtain Runtime Controller authorization, then render and record executor/QA receipts.
---
# Entry rule (Omni host-adaptive)
This block applies **only when Full Pro is explicitly requested** (Pro / Full Pro / all experts / all capabilities, or a Full Pro command). In Standard mode skip it and follow the rest of this skill normally.

In Full Pro: load `kosif-full-pro-host-entry` and use its durable entry/start commands (`kosif-full-pro-host-entry/scripts/host_entry.py`, or the MCP tool `kosif_full_pro_entry` of the bundled `kosif-omni` server, or the live `kosif_full_pro_*` backend tools when the host exposes them). Never call a host-native substantive executor directly while KOSIF owns the request. If the live KOSIF backend is not exposed in this host, follow `kosif-omni/references/host-adapters.md` (local engine path) and label every receipt `LOCAL_ENGINE`; never report backend-only stages as done. The secure-executor backend component is packaged, not deployed — say so explicitly. Visual candidates must satisfy `kosif-secure-executor/scripts/scene_spec.py` before freezing; older compact SceneSpec examples do not satisfy the strict 5.4 runtime contract.

# KOSIF Image Studio — v5.3

## Standard mode
Frame the visual goal, create a renderable prompt, generate with an available image executor, then inspect the result.

## Full Pro mode
1. Initialize Full Pro Runtime and Knowledge Atlas when relevant.
2. Complete the exhaustive expert/Jev cycles including the Visual Aesthetics Council.
3. Run Einstein seven-stage synthesis and final Jev stability.
4. Build a typed `SceneSpec` covering: subject/character, world/environment, action physics, camera/lens, lighting, color grade, materials, atmosphere/VFX, composition/story, negative constraints and aspect ratio.
5. Validate and deterministically compile the SceneSpec with `scripts/prompt_compiler.py`.
6. Freeze the canonical SceneSpec digest as the candidate digest.
7. Runtime `authorize` must return `authorization_ready=true` plus a one-time `secure_executor_ticket` for the same request/executor/candidate.
8. Validate that ticket through `kosif-secure-executor`. Full Pro image execution must be recorded with `execution_path=kosif_secure_executor`.
9. A direct `image_gen`/host-native receipt is classified as bypass and can never complete Full Pro for that request.
10. After the secure executor result, inspect returned pixels and record artifact QA. A repair iteration is a new frozen candidate and needs a fresh request-bound authorization cycle.

### Anti-drift invariant
The exact canonical SceneSpec digest authorized by the runtime must match the candidate sent to execution. Editing the prompt after authorization invalidates the lock.

### Platform boundary
The skill package cannot technically intercept a host-native image tool. Therefore direct host-native generation is explicitly non-Full-Pro and poisons the current Full Pro request. Hard prevention requires an external HMAC-backed Secure Executor/backend that owns the image-provider credential.
