"""Deterministic KOSIF helpers exposed as tools. Each one wraps a bundled, dependency-light script.

Most scripts read one JSON object on stdin and print one JSON object; their exit codes are verdict
signals (0 PASS, 1 REVISE/CONFIRM, 3 BLOCK, 4 HANDOFF) and are surfaced as `exit_code`.
"""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

from .paths import resolve_allowed, skills_dir, state_dir
from .registry import REGISTRY, A, B, I, N, O, S, ToolError, obj, tool
from .runner import finish, run_script


def _script(skill: str, name: str) -> Path:
    return skills_dir() / skill / "scripts" / name


def _stdin_tool(name, description, schema, skill, script, *, argv=None, title="", gpt=False, read_only=True,
                timeout=60, pre=None):
    def handler(a: dict):
        payload = pre(a) if pre else a
        return finish(run_script(_script(skill, script), argv, stdin=payload, timeout=timeout), script)
    tool(name, description, schema, title=title, gpt=gpt, read_only=read_only)(handler)


# ── reasoning & verification ────────────────────────────────────────────────
_stdin_tool(
    "kosif_decision_sensitivity",
    "Rank options with feasibility first: firm constraints, dominance, weighted score, and the smallest change "
    "that would flip the winner (sensitivity / reversal).",
    obj({"criteria": O("{name:{direction:'min'|'max', weight:number}}"),
         "constraints": O("{name:{min?:number,max?:number}} firm requirements"),
         "options": A(O(), "[{id, scores:{criterion:value}}]")}, ["criteria", "options"], extra=True),
    "kosif-think-pro", "decision_sensitivity.py", title="Decision sensitivity", gpt=True)

_stdin_tool(
    "kosif_probability_check",
    "Check probability coherence (complements, conjunction ≤ marginals, inclusion–exclusion) and Bayes "
    "arithmetic with explicit prior, sensitivity and false-positive rate.",
    obj({"events": O("{'A':'0.3','B':'0.6','A&B':'0.4','not A':'0.7','A|B':'0.5'} decimal strings"),
         "bayes": A(O(), "[{name,prior,sensitivity,false_positive_rate,stated_posterior}]")}, extra=True),
    "kosif-think-pro", "probability_coherence.py", title="Probability / Bayes check", gpt=True)

_stdin_tool(
    "kosif_calibration_check",
    "Lint certainty words against the evidence ladder: claims with observation/measurement/quote/inference/"
    "assumption evidence; flags overconfident wording and single-source support.",
    obj({"claims": A(O(), "[{text, evidence:[{type, source}]}]")}, ["claims"]),
    "kosif-think-pro", "calibration_check.py", title="Calibration lint")

_stdin_tool(
    "kosif_evidence_check",
    "Typed consistency gate over submitted evidence (arithmetic expressions, sums, ...). Checks internal "
    "consistency only — it never proves the evidence true.",
    obj({"evidence": A(O(), "[{id, source, type:'arithmetic'|'sum'|..., expression|parts, claimed|total}]"),
         "tolerance": S("Absolute tolerance, default 0.000001")}, ["evidence"], extra=True),
    "kosif-think-pro", "evidence_consistency_check.py", title="Evidence consistency")

_stdin_tool(
    "kosif_ideate",
    "Genuine random stimuli for lateral idea generation (random-word / association / contrast prompts). "
    "Reproducible with a seed — use because LLMs are poor random generators.",
    obj({"problem": S("The problem to attack."), "concepts": A(S(), "Key concepts to perturb."),
         "n": I("Stimuli to produce.", minimum=1, maximum=30), "seed": I("Seed for reproducibility.")},
        ["problem"]),
    "kosif-think-pro", "ideate.py", title="Lateral ideation", gpt=True)

_stdin_tool(
    "kosif_risk_gate",
    "Unified preflight risk gate. gate='tool-swap' (intended_tool, proposed_tool, same_semantics, "
    "fresh_schema_verified, explicit_approval), 'action' (action, side_effect, fresh_target_verified, "
    "explicit_approval) or 'data' (data_class, destination, minimum_necessary, explicit_approval). Sending, posting "
    "or publishing counts as external-write. PASS is permission to continue, not proof the action happened.",
    obj({"gate": S("tool-swap | action | data", enum=["tool-swap", "action", "data"]),
         "action": S("(action) what will be done, in plain words"),
         "side_effect": S("(action) none | local-write | external-write | public-write | irreversible | unknown",
                          enum=["none", "local-write", "external-write", "public-write", "irreversible", "unknown"]),
         "fresh_target_verified": B("(action) target and impact verified just now"),
         "explicit_approval": B("the user explicitly approved this exact action/swap/disclosure"),
         "intended_tool": S("(tool-swap)"), "proposed_tool": S("(tool-swap)"),
         "same_semantics": B("(tool-swap)"), "fresh_schema_verified": B("(tool-swap)"),
         "data_class": S("(data) public | internal | private | personal | confidential | sensitive | secret | credential | otp | payment-card | private-key"),
         "destination": S("(data) internal | external"),
         "minimum_necessary": B("(data) only the minimum data is passed")}, ["gate"], extra=True),
    "kosif-think-pro", "risk_gate.py", title="Risk gate", gpt=True)

_stdin_tool(
    "kosif_receipt_verify",
    "Validate a Pro/Full Pro receipt's structure and completion-readiness. Structural validity is not truth: "
    "completion needs executor and artifact-QA receipts.",
    obj({}, extra=True), "kosif-think-pro", "pro_receipt_verify.py", title="Receipt verifier")


def _jev_pre(a):
    return {k: v for k, v in a.items() if k != "op"}


@tool("kosif_jev_packet",
      "Build / interpret / stability-check Jev closed-set decision packets (noul yes-no, choice among options, "
      "score on a rubric). Blocks asking Jev to authorise risky actions; redacts secrets. Does not call Jev itself.",
      obj({"op": S("build | interpret | stability", enum=["build", "interpret", "stability"]),
           "mode": S("(build) noul | choice | score"), "question": S("(build) closed question"),
           "evidence": O("(build) evidence object"), "options": O("(build) {label: description}"),
           "response": O("(interpret) raw Jev tool result"),
           "responses": A(O(), "(stability) several raw results")}, ["op"], extra=True),
      title="Jev packet")
def _jev(a: dict):
    op = a.get("op")
    if op not in ("build", "interpret", "stability"):
        raise ToolError("op must be build, interpret or stability")
    return finish(run_script(_script("kosif-jev", "jev_packet.py"), [op], stdin=_jev_pre(a)), "jev_packet")


# ── audit / finance ─────────────────────────────────────────────────────────
_stdin_tool(
    "kosif_ledger_check",
    "Deterministic accounting controls (IFRS/ISA-aligned): integer minor units, debits = credits, valid accounts, "
    "open period, tax = base × rate under declared rounding, duplicate event keys, invoice↔bank matching. "
    "A bank movement is not revenue merely because it hit the bank.",
    obj({"currency_minor_units": I("Decimals of the currency (2 for SAR)."), "vat_rate": S("e.g. '0.15'"),
         "rounding": S("half_up | half_even | down | up"), "chart": A(S(), "Valid account codes."),
         "revenue_accounts": A(S()), "bank_accounts": A(S()), "period": O("{start,end,status:'open'|'closed'}"),
         "entries": A(O(), "Journal entries with lines[{account,debit|credit}] and optional tax."),
         "invoices": A(O()), "bank": A(O())}, ["entries"], extra=True),
    "kosif-audit-ifrs", "ledger_check.py", title="Ledger check", gpt=True)

# ── design / prompts / story / light ────────────────────────────────────────
_stdin_tool(
    "kosif_design_tokens",
    "Accessible light + dark design tokens (WCAG AA verified) and a ready CSS block from one brand colour.",
    obj({"brand": S("Hex colour, e.g. #8a5a2b"), "name": S("Token prefix"), "base_font": I("px, default 16"),
         "ratio": N("Type scale ratio, default 1.25"), "radius": I("px"), "font": S("CSS font stack")}, ["brand"]),
    "kosif-web-design", "design_tokens.py", title="Design tokens", gpt=True)

_stdin_tool(
    "kosif_prompt_forge",
    "One structured spec → correctly formatted image/video prompts for ChatGPT image, Midjourney, Flux, SDXL, "
    "Ideogram, Sora, Veo, Runway, Kling (English values; only `text` may be Arabic). Then lint with "
    "kosif_image_prompt_lint.",
    obj({"mode": S("image | video", enum=["image", "video"]), "subject": S(), "action": S(), "environment": S(),
         "time": S(), "shot": S(), "angle": S(), "lens": S("e.g. 85mm f/1.8"), "lighting": S(), "palette": S(),
         "style": S(), "quality": A(S()), "aspect": S("e.g. 16:9"), "negative": A(S()),
         "text": S("Text rendered on the image (may be Arabic)."), "locks": O("{character, style,...} verbatim locks"),
         "camera_move": S("video"), "duration": S("video"), "motion": S("video"), "fps": S("video"),
         "platforms": A(S(), "Subset of platforms to render.")}, ["mode", "subject"], extra=True),
    "kosif-prompt-master", "prompt_forge.py", title="Prompt forge", gpt=True)

_stdin_tool(
    "kosif_image_prompt_lint",
    "Lint an image/video prompt against the KOSIF formula (subject, action, environment, camera, lens, lighting, "
    "grade, style, quality, aspect) plus Execution-Contract required/forbidden terms and verbatim locks. "
    "Verdict PASS / REVISE / BLOCK.",
    obj({"prompt": S("The prompt."), "mode": S("image | video", enum=["image", "video"]),
         "contract": O("{required:[...], forbidden:[...]}"), "locks": O("{character:'...', style:'...'}")},
        ["prompt"]),
    "kosif-image-studio", "prompt_lint.py", title="Image prompt lint", gpt=True)

_stdin_tool(
    "kosif_llm_prompt_lint",
    "Lint an LLM prompt (system/task/agent/tool): structure, hazards (vague quantifiers, contradictions, "
    "undelimited untrusted input, secrets, hidden-reasoning requests). Verdict PASS / REVISE / BLOCK.",
    obj({"prompt": S(), "kind": S("system | task | agent | tool", enum=["system", "task", "agent", "tool"]),
         "contract": O("{required:[], forbidden:[]}"), "untrusted_inputs": B()}, ["prompt"]),
    "kosif-prompt-master", "llm_prompt_lint.py", title="LLM prompt lint", gpt=True)

_stdin_tool(
    "kosif_story_lint",
    "GMC+S conflict-engine checker for scripts, reels and ads: goal, motivation, conflict, stakes per beat, "
    "protagonist agency, escalation, action/introspection balance, climax resolution.",
    obj({"central_conflict": S(), "protagonist": S(), "beats": A(O(), "[{id,goal,motivation,conflict,stakes,...}]"),
         "climax": O("{outer, inner}")}, ["beats"], extra=True),
    "kosif-video", "story_lint.py", title="Story lint", gpt=True)


def _light_pre(a):
    return a["ops"] if isinstance(a.get("ops"), list) else {k: v for k, v in a.items() if k != "ops"}


_stdin_tool(
    "kosif_light_calc",
    "Photographic/cinema light math: inverse-square, EV, equivalent exposure, lighting ratio↔stops, mired shift + "
    "gel, guide number, softness, shutter angle, background falloff. One op or a list via `ops`.",
    obj({"op": S("inverse_square | ev | equivalent | ratio | ratio_to_stops | mired | guide_number | softness | "
                 "shutter_angle | falloff"),
         "ops": A(O(), "List of op objects (instead of op)."),
         "d1": N(), "d2": N(), "aperture": N(), "shutter": S("e.g. '1/125'"), "iso": N(), "new_aperture": N(),
         "new_iso": N(), "key_stops_over_fill": N(), "ratio": N(), "from_k": N(), "to_k": N(), "gn": N(),
         "distance_m": N(), "source_size_m": N(), "fps": N(), "angle": N(), "subject_m": N(), "background_m": N()},
        extra=True),
    "kosif-lighting", "light_calc.py", title="Light calculator", gpt=True, pre=_light_pre)

# ── computer / browser / github gates ───────────────────────────────────────
_stdin_tool(
    "kosif_action_gate",
    "Risk gate for a planned GUI/browser/desktop action sequence. Per step: risk, checkpoints, postcondition "
    "needed. Verdict RUN · CONFIRM (ask the user) · HANDOFF (human must do it) · BLOCK.",
    obj({"goal": S(), "steps": A(O(), "[{id, action, target|url, text?, expect}]"),
         "page": O("Current observation (untrusted)."), "approved": A(S(), "Step ids the user approved."),
         "allowed_domains": A(S()), "history": A(O())}, ["steps"], extra=True),
    "kosif-computer-use", "action_gate.py", title="Action gate", gpt=True)

_stdin_tool(
    "kosif_ui_ground",
    "Ground a natural-language instruction (Arabic/English) to exactly one observed UI element; emits a Jev "
    "choice packet when the top candidates are too close.",
    obj({"instruction": S(), "elements": A(O(), "[{id, role, tag, text, name, aria_label, rect, ...}]"),
         "history": A(S(), "Recently acted element ids (anti-loop).")}, ["instruction", "elements"]),
    "kosif-computer-use", "ui_ground.py", title="UI grounding")

_stdin_tool(
    "kosif_gh_preflight",
    "Pre-flight gate for git/GitHub operations: classifies read-only / local-write / remote-write / destructive, "
    "scans added diff lines for secrets, checks branch rules, commit message and PR template. "
    "PASS · CONFIRM · BLOCK.",
    obj({"operations": A(S(), "Commands or API operations."), "branch": S(), "designated_branch": S(),
         "default_branch": S(), "approved": B(), "own_branch": B(), "diff": S(), "files": A(O()),
         "commit_message": S(), "pr_title": S(), "pr_body": S(), "pr_template": S()}, extra=True),
    "kosif-github", "gh_preflight.py", title="GitHub preflight", gpt=True)


@tool("kosif_visual_contract",
      "Visual execution contract: build (freeze + compile prompt), verify (against structured observed evidence), "
      "repair (one targeted correction packet), jev (bounded re-analysis packet). Does not inspect pixels.",
      obj({"command": S("build | verify | repair | jev", enum=["build", "verify", "repair", "jev"]),
           "payload": O("The JSON the chosen command expects.")}, ["command", "payload"]),
      title="Visual contract")
def _visual_contract(a: dict):
    cmd = a.get("command")
    if cmd not in ("build", "verify", "repair", "jev"):
        raise ToolError("command must be build, verify, repair or jev")
    return finish(run_script(_script("kosif-image-studio", "visual_contract.py"), [cmd], stdin=a.get("payload") or {}),
                  "visual_contract")


@tool("kosif_scene_spec_check",
      "Validate a strict SceneSpec (subjects, identity, anatomy, action, physics, world, camera, lens, lighting "
      "key/fill/rim, grade, materials, weather, VFX, composition, negatives, aspect ratio).",
      obj({"scene": O("The SceneSpec object.")}, ["scene"]), title="SceneSpec check")
def _scene(a: dict):
    p = _script("kosif-secure-executor", "scene_spec.py")
    spec = importlib.util.spec_from_file_location("kosif_scene_spec", p)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    try:
        mod.validate_scene(a.get("scene"))
    except ValueError as e:
        return {"valid": False, "error": str(e), "required_fields": mod.FIELDS}
    return {"valid": True}


@tool("kosif_kcl_probe",
      "KCL deterministic probes (council-grade checks: arithmetic, units, dates, schema, ...). Call with no name "
      "to list probes; with a name and kwargs to run one.",
      obj({"name": S("Probe name (omit to list)."), "kwargs": O("Probe inputs.")}), title="KCL probes")
def _kcl(a: dict):
    s = _script("kosif-think-pro", "kcl_probes.py")
    if not a.get("name"):
        return finish(run_script(s), "kcl_probes")
    if not re.fullmatch(r"[A-Za-z0-9_][A-Za-z0-9_.-]{0,63}", str(a["name"])):
        raise ToolError("invalid probe name")
    return finish(run_script(s, [str(a["name"])], stdin=a.get("kwargs") or {}), "kcl_probes")


# ── file-based tools (sandboxed to enabled folders) ─────────────────────────
@tool("kosif_code_scan",
      "Fast static scan of code (file, folder or .zip): leaked secrets, dangerous calls, injection patterns, weak "
      "crypto, disabled TLS, placeholder/incomplete code, Python syntax errors. Heuristic — findings need review; "
      "no findings is not proof of security.",
      obj({"paths": A(S(), "Files/folders/zips inside an enabled folder.")}, ["paths"]),
      title="Code scan", gpt=True)
def _code_scan(a: dict):
    paths = [str(resolve_allowed(p)) for p in (a.get("paths") or [])]
    if not paths:
        raise ToolError("paths is required")
    return finish(run_script(_script("kosif-code-master", "code_scan.py"), [*paths, "--json"], timeout=120), "code_scan")


@tool("kosif_delivery_gate",
      "Deterministic pre-delivery gate for code: PASS / REVISE / BLOCK from scan findings and (with project=true) "
      "README, tests, env example and config hygiene.",
      obj({"paths": A(S(), "Files/folders/zips inside an enabled folder."), "project": B("Check project hygiene.")},
          ["paths"]), title="Delivery gate")
def _delivery(a: dict):
    paths = [str(resolve_allowed(p)) for p in (a.get("paths") or [])]
    if not paths:
        raise ToolError("paths is required")
    argv = [*paths, "--json"] + (["--project"] if a.get("project") else [])
    return finish(run_script(_script("kosif-code-master", "delivery_gate.py"), argv, timeout=120), "delivery_gate")


@tool("kosif_web_audit",
      "Static audit of an HTML page or site folder (or inline html/css): document, accessibility incl. WCAG "
      "contrast, responsive, performance, design-token use, security. PASS / REVISE / BLOCK.",
      obj({"path": S("HTML file or site folder inside an enabled folder."),
           "html": S("Inline HTML instead of a path."), "css": S("Inline CSS (with html).")}),
      title="Web audit", gpt=True)
def _web_audit(a: dict):
    s = _script("kosif-web-design", "web_audit.py")
    if a.get("html"):
        return finish(run_script(s, ["-"], stdin={"html": a["html"], "css": a.get("css", "")}), "web_audit")
    return finish(run_script(s, [str(resolve_allowed(str(a.get("path", ""))))], timeout=120), "web_audit")


@tool("kosif_image_analyze",
      "Measured image analysis (Pillow + numpy): size, EXIF, luminance, contrast, colour temperature/palette, "
      "sharpness, light-direction heuristics. Optionally compare with a second image. Numbers are measured; "
      "labels are heuristics.",
      obj({"path": S("Image inside an enabled folder."), "compare_with": S("Second image to compare."),
           "summary": B("Short Arabic summary + JSON.")}, ["path"]),
      title="Image analysis")
def _image(a: dict):
    s = _script("kosif-vision", "image_analyze.py")
    p = str(resolve_allowed(str(a["path"])))
    if a.get("compare_with"):
        return finish(run_script(s, [p, str(resolve_allowed(str(a["compare_with"]))), "--compare"]), "image_analyze")
    return finish(run_script(s, [p] + (["--summary"] if a.get("summary") else [])), "image_analyze")


@tool("kosif_audio_analyze",
      "Measured audio analysis (numpy): duration, peak/true-peak, RMS, BS.1770 loudness, clipping, silence, "
      "stereo correlation, spectral balance, tempo estimate; against a delivery target.",
      obj({"path": S("Audio file inside an enabled folder (WAV native; others need ffmpeg/soundfile)."),
           "target": S("streaming | podcast | broadcast | club", enum=["streaming", "podcast", "broadcast", "club"]),
           "summary": B("Short summary + JSON.")}, ["path"]),
      title="Audio analysis")
def _audio(a: dict):
    argv = [str(resolve_allowed(str(a["path"])))]
    if a.get("target"):
        argv += ["--target", str(a["target"])]
    if a.get("summary"):
        argv.append("--summary")
    return finish(run_script(_script("kosif-audio", "audio_analyze.py"), argv, timeout=180), "audio_analyze")


@tool("kosif_project_forge",
      "Scaffold a complete, runnable, tested starter project led by a council member (library, CLI, JSON service, "
      "pipeline, agent loop, static site, Cloudflare Worker) with CI, ADRs, SECURITY.md and a milestone roadmap. "
      "Writes files under `out` (must be inside an enabled folder). Without args lists archetypes.",
      obj({"member": S("Council member id/slug, e.g. security-red-teamer"), "name": S("Project name"),
           "out": S("Output directory inside an enabled folder."), "goal": S("One-line product goal"),
           "archetype": S("python-lib | python-cli | python-service | data-pipeline | agent | static-web | cf-worker")}),
      title="Project forge", read_only=False, idempotent=False)
def _forge(a: dict):
    s = _script("kosif-think-pro", "project_forge.py")
    if not a.get("member"):
        return finish(run_script(s, ["--list"]), "project_forge")
    out = resolve_allowed(str(a.get("out", "")), must_exist=False)
    payload = {k: v for k, v in a.items() if v}
    payload["out"] = str(out)
    return finish(run_script(s, stdin=payload, timeout=180), "project_forge")


@tool("kosif_full_pro_entry",
      "Durable Full Pro request guard (local engine). Commands: enter (register request, freeze policy), start, "
      "status, route (is this tool allowed now?), authorize, ingest/apply/observe (receipts/events as `payload`). "
      "This is bookkeeping that prevents false completion; it does not itself run experts or execute actions.",
      obj({"command": S("enter | start | route | observe | status | ingest | apply | authorize",
                        enum=["enter", "start", "route", "observe", "status", "ingest", "apply", "authorize"]),
           "request_id": S("Required except for enter."), "text": S("(enter) the user request text"),
           "executor": S("(enter) executor kind, default image"), "tool": S("(route/observe) proposed tool"),
           "visual": B("(enter) visual task"), "selected": B("(enter) Full Pro explicitly selected"),
           "payload": O("(ingest/apply/observe) receipt or event JSON")}, ["command"]),
      title="Full Pro entry guard", read_only=False, idempotent=False)
def _full_pro(a: dict):
    cmd = a.get("command")
    argv = [str(state_dir() / "full_pro_entry.sqlite"), str(cmd)]
    if cmd != "enter":
        if not a.get("request_id"):
            raise ToolError("request_id is required")
        if not re.fullmatch(r"[A-Za-z0-9_-]{8,64}", str(a["request_id"])):
            raise ToolError("invalid request_id")
        argv += ["--request-id", str(a["request_id"])]
    if cmd == "enter":
        text = str(a.get("text", ""))
        if len(text) > 8000:
            raise ToolError("text is limited to 8000 characters")
        argv += ["--text", text, "--executor", str(a.get("executor", "image"))[:40]]
        if a.get("visual"):
            argv.append("--visual")
        if a.get("selected"):
            argv.append("--selected")
    if a.get("tool"):
        argv += ["--tool", str(a["tool"])[:200]]
        # Only this server's registry may vouch that a tool is read-only evidence.
        t = REGISTRY.get(str(a["tool"]))
        if cmd in ("route", "observe") and t is not None and t.read_only:
            argv.append("--read-only")
    stdin = a.get("payload") if cmd in ("ingest", "apply", "observe") else None
    r = run_script(_script("kosif-full-pro-host-entry", "host_entry.py"), argv, stdin=stdin if stdin is not None else b"")
    if r["exit_code"] != 0:
        raise ToolError(f"full_pro_entry failed: {r['stderr'][-600:] or r['result']}")
    return {"result": r["result"], "labels": "LOCAL_ENGINE",
            "warning": "Local bookkeeping only. Completion still needs real executor + artifact-QA receipts."}
