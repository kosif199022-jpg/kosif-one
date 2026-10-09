# Changelog

## 11.11.0 — 2026-10-06 · KOSIF Replicate: redraw an image in Paint by hand, pixel-exact, with proof
### Added
- **`kosif_paint_copy`** (`kosif_mcp/replicate.py`, also `python -m kosif_mcp.replicate`): draws an image in
  Windows Paint with Paint's own tools only (Pencil 1 px, Edit colors, Opacity, Eraser) and Claude's pen. Each
  colour is set through the colour dialog and confirmed on the Colour 1 swatch before any pixel is drawn. Every
  pixel is one pen tap. The canvas is checked pixel by pixel and repair passes run
  until nothing differs. `--erase-transparent` turns the original's transparent pixels into real transparency
  with the 1-px Eraser. `--save new.png` saves from Paint (Ctrl+S → Save as) and compares the file with the
  original, RGB and alpha. Resumable: progress is read back from the canvas.
- Colours Paint's dialog cannot hold: it keeps hue below 359°, so #F40001 becomes #F40004 (measured). These are
  predicted and drawn in two coats: a base D at 100 %, then S = D + 5·(T − D) at 20 % opacity, which lands
  exactly on T (measured exact for F40001 and F50003).
- `nat.uia_range` / `uia_set_range`: exact slider values (Paint's Size, Opacity, Zoom) without dragging.
### Fixed
- **A UI Automation Invoke that times out no longer hammers the app.** Invoke on Paint's "Edit colors" (it opens
  a modal dialog) timed out. The old code then tried Toggle, Select, Expand and DoDefaultAction on the same
  button, and Paint hung for good. Now a busy HRESULT raises `AppBusy`, and the batch ends as `app_busy` with
  "look by screenshot, then use pen/keys". Element-tree reads of a busy window raise `AppBusy` instead of
  leaking a raw COMError as an "internal error". Any other unexpected exception is reported as a failed step.
- **Colours typed into a dialog that was not ready yet.** The dialog is drawn inside Paint's own window, not as
  a separate window, and it fades in and out. A single probe pixel read as "closed" mid-fade, so runs stopped
  with "Paint did not take colour …". `look()` now takes the strongest saturation along a row of the colour
  spectrum, which survives the fade (10/10 colours exact in a row afterwards).
- **Strokes were slower than taps.** A paced pen stroke costs 4.9 ms per step, because it is slowed so Windows
  doesn't read it as a flick. A tap costs 0.97 ms. Pixels are now drawn as taps: 1,030 px/s.
### Measured
- A logo of 85×98 px with 2,650 distinct colours was redrawn by hand in Paint to a **100 % match** (8,330/8,330
  pixels). The final resumed run set 563 colours in 437.8 s (0.68 s per colour).
- A colour change costs about 0.60 s. Paint's own fade in and out of the dialog takes about 0.42 s of that and
  cannot be shortened. So 2,650 colours take about 27 minutes, while the pixels themselves take 8 seconds. Fewer
  colours (`colors: 64`) bring that down to about 47 s.

## 11.10.1 — 2026-10-06 · KOSIF Mouse: fixes from a four-app stress run
Test job: an Excel workbook (sort, total, chart, save) → Calculator cross-check → an Arabic report in Notepad
saved through Save-as → a bar chart drawn by pen in Paint, all while the user kept working in other apps.
### Fixed
- **Pen strokes became dots.** Windows read fast, straight strokes as *flick* gestures: 5 of 8 bars of a chart
  came out as a single dot. Strokes are now split into ≤5 px frames (up to 15 px on long strokes), last at least
  80 ms, and rest for a moment after touching down and before lifting. The chart now draws complete. Pen input
  is also counted as Claude's own input, so it is never mistaken for the user's activity.
- **Focus was not returned** after side-effect activations: a pen tap raising Paint, a UIA `set_value` raising
  the Save-as dialog, or a dialog closing and activating its owner. Auto mode now hands the foreground back
  whenever a window of the job (or a dialog it owns) ends up in front. It leaves the foreground alone when the
  user switched windows during the batch.
- **`expect: {changed: true}` missed thin strokes** (0.12 % for a full red trend line). The change thumbnail
  keeps each cell's darkest and brightest value instead of one sampled pixel, and draw steps are compared only
  inside the drawing's own box.
- **`observe` with `region` showed the screen**, i.e. whatever window covered the target (a user's browser
  page). With a `target`, the region is now cut from that window's own capture. If that capture is impossible,
  observe refuses instead of showing the covering window.
- `kosif_mouse_live` `wait` could match an invisible helper window, and missed a dialog that opened during
  the previous batch. It now starts from that batch, ignores helper windows, and `dialog_opened` needs a real
  dialog. The change list drops message-only/hidden windows (MIT Message Only Window, WISPTIS, XCP…) and shows
  current titles: a common dialog is created as "Open" and renamed "Save as" a moment later.
- Launch steps honour `expect`. The "add expect" hint is no longer repeated on every step of a batch that
  is verified by a later step.
### Added
- `launch notepad` opens a blank tab: Windows 11 Notepad had reopened on the user's own `settings.json`
  (`new_document:false` keeps the old behaviour).
- `draw` shapes take `fill: true` (+ `fill_gap`): whole-pixel hatch rows at full pen pressure, one zigzag stroke
  per convex shape. Closed outlines run on past their start, so a bucket fill no longer leaks through the
  tapered start of the stroke (it had flooded the whole canvas).
- Apps seen grabbing the foreground on a UI Automation action (Calculator, dialogs) make their next background
  step wait for an idle user, so the user's keystrokes are not redirected.
- 14 regression tests (156 server tests).
### Measured
- Chart job end to end: 49 s and a broken chart → 11 s and a complete one (outlines + bucket). Excel job:
  2.7 s. Calculator: 11 background clicks in 1.6 s.
- Known limit: very small filled dots sometimes stay hollow (1 of 8).

## 11.10.0 — 2026-10-06 · KOSIF Mouse 2: background-first, Claude's own pointer, Live View, Excel live
### Fixed
- **Keystrokes could land in the Claude app.** A `focus` step did not change the window the batch worked on, so
  the next step brought the stale "foreground" window (the Claude app) back to the front and typed there. Now
  `focus`/`launch`/`window=` pin the target, grounding (`target`) runs on that window, a foreground step refuses
  to send anything unless the target really is in front, and the Claude app itself is never acted on unless it
  is named explicitly.
- Bringing a window forward no longer starts with an Alt tap (it showed Excel key tips and opened menu bars):
  plain `SetForegroundWindow` → a no-op key event → thread-input attach → Alt only as the last resort.
### Added
- **Background delivery (default `mode:"auto"`)** — `desktop_native.py`: input reaches ONE window without
  focus change and without moving the real cursor. Win32 controls get window messages (WM_SETTEXT, WM_CHAR at the
  end of the text, BM_CLICK, posted clicks/keys/wheel); modern controls get UI Automation patterns (+ MSAA
  default action), and if an app grabs the foreground anyway it is handed straight back. Measured on a WinForms
  window: Windows' UIA proxies for classic edit boxes and buttons activate the window; messages do not.
  Apps that drop posted input (Chromium, WinUI, Paint, GTK/Qt/SDL…) are reported as `background_unavailable`
  instead of being silently driven in the foreground. `mode: background | foreground` per call or per step.
- **Claude's own pointer** — a synthetic pen device (Windows Pointer Injection, Win10 1809+) for taps, drags and
  drawing: a second pointer, separate from the user's mouse. Verified: an apple drawn in Paint (4 strokes,
  ~1 s) with the user's cursor unchanged, focus handed back afterwards. `pointer: pen | mouse`.
- **User-activity guard** — steps that need the foreground wait until the user has been idle (injected input
  is told apart from theirs), restore their cursor after real-mouse clicks, and give focus back at the end.
- **Live View** (`live.py`, `kosif_mouse_live`) — an out-of-context WinEvent hook (read-only) keeps a live model:
  windows/dialogs/menus opened or closed, foreground and focus changes, per-window content changes. `act`
  returns `changes`, `wait` reacts the moment a dialog opens, and `observe` reuses the previous element tree
  when Live View saw no event and the window's pixels are identical (≈0.3 s instead of 1.5–8 s on Excel).
- **Window capture** — `observe` captures the target window itself (PrintWindow + PW_RENDERFULLCONTENT) even
  when other windows cover it; right-to-left windows (Arabic Office) are un-mirrored.
- **Drawing planned locally** — `draw` takes SVG path data (`svg`, M/L/H/V/C/S/Q/T/Z) or `shapes` fitted into a
  canvas ref or `box`, and draws everything in one go — no screenshot between strokes.
- **`kosif_excel`** (`office_live.py`) — whole jobs inside the Excel the user has open, through Excel's own API:
  list / new / use / add_sheet / read / write / clear / sort / total / format / chart / delete_charts / select /
  save / close. Reaches every Excel window (AccessibleObjectFromWindow + OBJID_NATIVEOM, hung windows skipped).
  Changing data of a workbook KOSIF did not create returns `needs_approval` with a preview. Late-bound COM pitfalls
  handled: Resize/Offset are built as addresses, union ranges via Application.Union (the Arabic list separator
  broke `Range("A1:A9,D1:D9")`), a failed chart source deletes the empty chart.
- Excel windows in `kosif_mouse_observe` return the sheet's real cell values and skip the grid's thousands of
  UI elements.
- Tests: 15 new (target pinning / host guard, routes, Win32 kinds, SVG/shape fitting, Live View summary, Excel
  approval gate, registration, HTTP lock) — 142 OK; live test bed passes in the background.

## 11.9.0 — 2026-10-06 · KOSIF Sheets: Excel workbooks and SQLite databases as files
### Added
- **`kosif_sheet_build`** (`mcp-server/kosif_mcp/office.py`) builds a finished .xlsx in one call. Each sheet gets:
  - a real Excel Table with filters and banded rows (Arabic sheet names become Table1, Table2…);
  - multi-key sorting, with empty cells always last;
  - number formats: money, integer, percent, date, or any Excel code;
  - auto column widths and a frozen header;
  - an optional totals row with live `=SUM()` formulas;
  - right-to-left layout when the headers are Arabic;
  - an optional bar, column, line or pie chart.
  Numbers and ISO dates sent as text become real numbers and dates; codes with a leading zero stay text.
  Existing files are never replaced without `overwrite`.
- **`kosif_db`** works on a SQLite file with these operations:
  - `create`: typed columns, primary key, required, unique and indexes;
  - `insert`: parameterised; rows can be objects, lists, or both;
  - `query`: one SELECT or WITH statement, over a connection opened read-only;
  - `describe`;
  - `export`: a query to a formatted .xlsx or a UTF-8 .csv.
- Files go to `Documents\KOSIF`, or to a folder enabled for KOSIF; other paths are refused. `open: true` opens the
  result in Excel.
- Skill `kosif-sheets`, command `/sheets`, router family `sheets`.
- Tests: `tests/test_office.py` (11). Also checked by opening a demo workbook in Excel itself: no repair prompt,
  tables, charts, right-to-left layout and live totals all correct.

## 11.8.0 — 2026-10-06 · KOSIF Mouse: fast desktop control by mouse and keyboard
### Added
- **KOSIF Mouse** (`mcp-server/kosif_mcp/desktop.py`, `desktop_native.py`): five tools that operate the Windows
  desktop directly.
  - `kosif_mouse_status` reports the backends, screen, DPI, foreground window and (optionally) Jev reachability.
  - `kosif_mouse_observe` reads the UI Automation controls of a window in one cached call as short refs (`e1…`),
    adds OCR text refs (`t1…`) when UIA is blind, and returns a screenshot with the refs drawn on it.
  - `kosif_mouse_find` grounds an Arabic/English description to one ref; close calls go to Jev (closed
    candidate set, asked twice); unclear or unstable answers come back as "ask the user".
  - `kosif_mouse_act` runs a whole batch of steps in one call through `SendInput`: click, double/right click,
    move, drag, scroll, Unicode typing (Arabic), hotkeys (layout-independent), UIA invoke/set_value, focus,
    `launch` (well-known programs by name), `draw` (polylines), waits and per-step `expect` checks
    (text, title, screen changed, or a Jev yes/no).
  - `kosif_mouse_do` runs one instruction end to end ("اضغط زر حفظ").
- **Gate on every step**, using the existing `action_gate.py` in-process:
  - send, delete, install and settings steps need the user's approval (`approved`);
  - password fields, CAPTCHA/2FA/payment and elevated windows are handed to the user;
  - secret-like text and Ctrl+Alt+Del / Win+L are blocked.
- **Claude's own cursor** (`cursor_overlay.py`): an orange pointer with a spark and an action label, separate from
  the user's mouse. It is click-through and never takes focus, and it stays visible to the user and to screen
  recordings. It steps aside only for the agent's own screenshots.
- **Visible mode.** The window being worked on is brought to the front before acting.
- **Emergency stop.** Moving the mouse to the top-left corner or holding Esc stops a batch before its next step.
- **Transport lock.** Screen capture and input are refused over the HTTP transport unless the owner sets
  `KOSIF_MOUSE_HTTP=1` on a loopback-only bind.
- MCP results can now carry image blocks (screenshots).
- Skill `kosif-mouse`, command `/mouse`, router family `mouse`, and test bed `tests/fixtures/mouse_testbed.ps1`.
- Tests: `tests/test_desktop.py`, 17 offline tests plus one live test enabled with `KOSIF_MOUSE_LIVE=1`.

## 11.7.0 — 2026-10-04 · Atlas skill packs for the 30 Swarm specialists
### Added
- **A skill pack for every specialist.** Each one gets up to 8 skills from the public library
  github.com/kosif199022-jpg/kosif-atlas (`skills/`), 232 skills in total.
  - The agent file lists them with id, licence, description and the GitHub folder.
  - The agent reads a skill in full with `kosif_atlas_read` and applies its method as reference data.
- **Atlas tools for every agent.** `kosif_atlas_read`, `kosif_atlas_search` and `kosif_skill_auto` are now in every
  agent's tool allowlist, so any specialist can also find skills that are not in its pack.
- **`tools/gen_swarm_skillpacks.py`** builds the packs into `tools/swarm_skillpacks.json` (deterministic).
  - Several concept searches per specialist, merged by reciprocal-rank fusion.
  - A skill is kept only if:
    - its licence is permissive;
    - the package ships no binaries;
    - its SKILL.md is readable, has 800+ characters and no prompt-injection flags;
    - it mentions one of the specialist's keywords;
    - it is described in Latin or Arabic script;
    - it is not a single vendor's integration (`-pack` kits other than ElevenLabs, `charly-*` service layers,
      PostHog, Zoom…).
  - At most two specialists share a skill.
  - 42 off-topic picks were removed after a manual review (`BAN`).
  - Packs are left short rather than padded: the library has no usable lighting skills, so the lighting
    designer keeps the built-in `kosif-lighting` playbook.
- Test: every pack skill is readable, permissive, free of injection flags and points to its real GitHub folder
  (93 tests). Six sample links checked live against the public repo: HTTP 200.

## 11.6.0 — 2026-10-04 · Swarm personas: a personality, a way of thinking and its own tools for each agent
Built from the user's Drive folder «كتب هامة» (`مجلس.txt`: SCIENTISTS_COUNCIL and EXPERT_COUNCIL) and the Genius
Council's existing 24 mental moods. Defined in `tools/swarm_personas.py`, rendered by `tools/gen_swarm_agents.py`.
### Added
Each of the 30 specialists now has:
- **A persona** (Arabic name and laqab). 15 of them are the same people as the Genius Council elite, e.g. the
  security auditor is E09 «حارس البوابات» and the IFRS auditor is E36 «ميزان الدفاتر».
- **A mentor lens**: the method of one scientist, used as a way of thinking, never role-played or quoted.
  - 24 of the 30 come from the file; Watson was left out.
  - Six Arab scholars fill the rest: Ibn Khaldun (fact checking), al-Khwarizmi (backend), Ibn Sina (debugging),
    al-Jazari (DevOps), al-Biruni (data) and Ibn al-Haytham (UX).
- **A mental mood** from the council's PSYCH_STATES, with its strength, blind spot, mandatory compensation, voice
  and signature question. All 24 moods are used.
- **An inner team**: the roles its helpers take when it delegates.
  - Creative agents get the file's EXPERT_COUNCIL sectors (prompt engineering, characters, environments, image
    quality, video, post-production, audio, story, cinematic scenes, AI tools).
  - Engineering and business agents get teams defined in the persona file.
- **Its own tools.** A real `tools` allowlist made of base tools, the agent's groups (web, shell, edit, LSP,
  browser) and its exact KOSIF MCP tools. All 30 sets differ, and read-only agents have no editing tools.
### Tests
1 new swarm test (92 total), covering:
- each agent has a unique mentor;
- all 24 moods are used;
- every allowlisted KOSIF tool exists;
- all 30 tool sets differ;
- read-only agents cannot edit.
### Notes
Left out from the source file, as before: the "Dark Triad" / dark-psychology material.

## 11.5.0 — 2026-10-04 · KOSIF Swarm: 30 parallel specialist agents
### Added
- **30 specialist sub-agents** in `agents/`, generated from one roster by `tools/gen_swarm_agents.py`:
  - research & reasoning: deep researcher, fact checker, strategist, probability analyst;
  - engineering: architect, backend, frontend, test, debugger, security auditor, code reviewer, DevOps, data, web operator;
  - language & creative: Arabic editor, storyteller, cinema director, image prompt engineer, video producer,
    lighting designer, audio engineer, voice director, visual critic;
  - business & governance: IFRS auditor, product manager, UX & accessibility, prompt engineer, Atlas scout,
    integrator, quality gate.
  Each one loads its KOSIF playbooks and MCP tools, runs at effort `high`, and shares one Swarm protocol.
  Reviewers (fact checker, security auditor, code reviewer, visual critic, quality gate) cannot edit files.
- **Nested delegation.** Every specialist may launch its own helpers in parallel, down to Claude Code's limit of
  three layers below the main conversation (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`, default 3). Helpers get
  self-contained briefs and own disjoint files. Specialists never re-delegate their own brief and never take
  outward actions (deploy, push, publish, send, pay, delete); they return them under "Needs approval".
- **`/kosif-omni:swarm <task> [--all | --n=K]`** launches the chosen specialists in one message, then runs the
  integrator and the quality gate.
- Test: the agent files must match the roster, and every playbook and MCP tool they name must exist (91 tests).
### Notes
- Claude Code runs at most `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` subagents at once across all layers (default
  20). Running all 30 at once needs a higher value in `settings.json` → `env`.
- Sub-agents are a Claude Code feature. On ChatGPT and claude.ai, the `swarm` prompt falls back to the
  `kosif-omni` skill.

## 11.4.1 — 2026-10-03 · skill selection fixes found by a live test
A live test with "انشاء انميشن تعليمي مدته 10 ثواني" picked `slidev` (a slide-deck tool, Jev confidence 0.69):
- **"انميشن" was unknown.** Neither the glossary nor the router recognised it, so the built-in `kosif-video` never
  became a candidate.
- **The query was searched as one block.** The whole English query was searched together, so "learning" pulled in
  machine-learning results and the animation skills (`hyperframes`, `remotion-*`, `gsap`) were crowded out.
### Fixed
- Glossary: animation, motion graphics, explainer/educational video, infographic (214 terms). The router's cinema
  family now matches the same words in Arabic and English.
- Per-concept candidate search, locally (`atlas_candidates(facets=...)`) and on the edge (`/select`, worker 1.2.0).
  Every glossary concept gets its own search, merged round-robin with the full query.
- Result after the fix:
  - locally, `kosif-video` (built-in, Jev stable) with `hyperframes` as the alternate;
  - on the edge, `hyperframes`;
  - the other reference tasks still pick the same skills.
- Tests: 2 new (88 total).
### Demo
`Desktop/الاداة/water-cycle-animation/`: a 10 s educational animation (water cycle, Arabic, 1920×1080, 30 fps).
- **Planning:** built with the `kosif-video` pipeline (frame, beat sheet, shot list, VO script) and the
  `hyperframes` method (visual identity first, hero-frame layout, one deterministic timeline), used as reference
  only.
- **Rendering:** frames captured with Playwright/Edge and encoded with ffmpeg.
- **QA:** caught a duplicate SVG id that hid the sea; fixed before delivery.

## 11.4.0 — 2026-10-03 · Jev-driven skill engine + Cloudflare edge
### Added
- **`kosif_skill_auto`** (`mcp-server/kosif_mcp/skillengine.py`) picks the best skill for a task in one call
  (route → search → judge → read). Arabic or English.
  - Understanding: Arabic is translated by the KOSIF edge (Workers AI) and merged with a 200-term domain glossary,
    which also works alone offline.
  - Candidates: the 46 built-in skills (router families + description overlap) and the Atlas.
  - Judgement: the live Jev service chooses, with a `none` option, asked twice in parallel with the options
    reversed. If Jev is unstable it uses the mean ranking; if unreachable, the deterministic ranking.
  - Output: the chosen playbook with alternates, receipts and per-step timings. `decided_by` says which path ran.
  - Measured on real tasks (Arabic and English): 0.6–2.7 s per call, every pick stable.
- **Live Jev** (`mcp-server/kosif_mcp/jev.py`). `kosif_jev_decide` makes real `choice` / `noul` / `score` calls to
  kosif-jev.
  - Checks: packets go through the kosif-jev skill's own checks first (authorisation questions blocked, evidence
    required, secrets and personal data redacted).
  - Calls: stability re-ask in parallel; one observed receipt per call (model id, probabilities, latency, packet
    digest).
  - Cache: a 7-day local cache, so an identical question costs nothing.
  - Configuration: `kosif_jev_status` checks the service. `KOSIF_JEV_URL` overrides the endpoint, and `off`
    disables it.
- **Cloudflare edge API `kosif-atlas-api`** (`edge/atlas-api/`, live at
  https://kosif-atlas-api.kosif199022.workers.dev) for hosts without the local server.
  - Data: D1 (FTS5) holds all 14,793 public-mirror skills (80 MB).
  - Bindings: Workers AI translation plus glossary, Jev through a service binding, GitHub mirror files cached at
    the edge, and per-IP rate limits.
  - Endpoints: `/search`, `/skill/<id>`, `/select`, `/translate`, a stateless MCP endpoint `/mcp` (claude.ai custom
    connector / ChatGPT developer mode) and `/openapi.json` (Custom GPT Action, no auth).
  - Separate from `kosif-think-mcp`.
- `tools/build_edge_db.py` builds the D1 data from the public mirror. The private mirror never goes to the edge.
- Custom GPT pack: `ATLAS-ACTION.md` (zero-setup skills Action), and the instructions point to `kosif_skill_auto`.
- Tests: `tests/test_skillengine.py` (18). It covers the Jev client (blocking, redaction, reordered stability
  re-ask, cache, disabled service), selection (Jev wins, `none`, unstable fallback, offline fallback, `jev=false`),
  the glossary, translation merging, and that the edge glossary stays in sync.
### Changed
- Router: unmatched tasks now point to `kosif_skill_auto`. The atlas and jev families list the new tools.
### Fixed
- Router: English keywords now match only at a word start. "voice" fired the audio family inside "invoices".

## 11.3.1 — 2026-10-03 · online mirror of the Atlas
### Added
- **Public mirror** https://github.com/kosif199022-jpg/kosif-atlas holds every embedded skill as a complete folder
  (SKILL.md, references, scripts, templates, assets), each plugin with its `SOURCE.md` and `LICENSE`, and
  `index.json` / `index.csv` at the root.
  - Size: 14,708 skills and 67,023 files.
  - Copyleft: 85 skills from 56 copyleft plugins (GPL/AGPL/MPL/CC-BY-SA..., under `skills/x<pid>-...`), with their
    licenses. Not embedded in the plugin.
  - Withheld: files that look like they carry a credential, and over-long paths, are listed in `EXCLUDED*.md` and not
    published.
- `kosif_atlas_search` results carry `online_url`, and `kosif_atlas_read` returns `online_url` and `online_folder`.
  These links appear only for the embedded pack, whose ids match the mirror's folders, and can be overridden or
  disabled with `KOSIF_ATLAS_ONLINE_REPO`.
- `tools/export_atlas_repo.py` builds the mirror from the pack plus the original library.
- `tools/export_atlas_extra.py` exports the packages left out of the pack: `copyleft` for the public mirror, and
  `restricted` for a private personal-reference mirror.
- Test: `test_online_links_point_at_the_mirror`.
### Fixed
- The integrity test's secret pattern no longer flags `sk-` inside words, such as `homebrew-cask-...` in
  ATLAS_NOTICES.md.

## 11.3.0 — 2026-10-03 · the Atlas is built in (no library folder needed)
### Added
- **Embedded Atlas pack.** The Atlas pack ships with the plugin in `mcp-server/kosif_mcp/data/` as two files:
  `atlas_pack.kpack` (43 MB: index, metadata, licenses, inspection reports) and `atlas_pack.blocks.kpack` (66 MB:
  LZMA-compressed content blocks). Each stays under GitHub's 100 MB file limit.
  - **Contents:** 3,635 plugins and 14,708 skills (40,213 unique `.md`/`.txt` files), licensed MIT (3,280), Apache-2.0
    (337), BSD-3-Clause (10), and a few mixed permissive licenses.
  - **Not embedded:** 1,540 packages whose licenses do not permit redistribution, and 48 packages with a DO_NOT_INSTALL
    static verdict.
  - **Default source:** the pack. `kosif_atlas_search`, `kosif_atlas_read`, `kosif_atlas_inspect` (precomputed reports)
    and `kosif_atlas_vendor` all work offline.
  - **External library:** optional, through `KOSIF_ATLAS_SOURCE=external` + `kosif_atlas_configure` + `kosif_atlas_index`,
    for reading the non-redistributable skills.
- `python -m kosif_mcp.atlas pack <library> <out.kpack>` builds and splits a pack; `split <pack>` splits an existing one.
- ATLAS_NOTICES.md lists every embedded plugin with its license, source and commit; license texts are stored in the
  pack and written next to vendored skills.
- Tests: `TestAtlasPack` builds a split pack from the synthetic library, deletes the library folder, then checks search,
  read, inspect and vendor offline. It also covers the license exclusion, the exclusion of an MIT package with a
  curl-to-bash hook, and that a skill with non-embedded files is never vendored half-copied.
### Changed
- The pack uses the `.kpack` extension, so packaging (which skips `.sqlite` state files) keeps it.
- One shared read-only SQLite connection per source instead of one per call.

## 11.2.0 — 2026-10-03 · KOSIF Atlas: the whole plugin library on demand
### Added
- **KOSIF Atlas** (`mcp-server/kosif_mcp/atlas.py`, 7 tools; skill `kosif-atlas`): indexes a split third-party plugin library
  (the Claude_ChatGPT_Plugins collection: 5,223 packages, 21,172 SKILL.md files) into SQLite FTS5 without extracting or
  bundling it. The split parts are read in place.
  - `kosif_atlas_configure` / `kosif_atlas_index` / `kosif_atlas_status`.
  - `kosif_atlas_search` defaults to permissive licenses, collapses duplicate skills to the copy with the fewest risk flags,
    and attaches license, source and risk flags to every hit.
  - `kosif_atlas_read` returns a skill on demand as UNTRUSTED reference data, with prompt-injection flags.
  - `kosif_atlas_inspect` is a static check (MCP servers, hook commands, scripts, binaries, code scan) with the verdicts
    READ_ONLY_OK / REVIEW_BEFORE_INSTALL / DO_NOT_INSTALL. It executes nothing.
  - `kosif_atlas_vendor` copies one permissive skill into a skills folder, with LICENSE and ATTRIBUTION.md. It requires
    confirm=true and refuses copyleft or unknown licenses, DO_NOT_INSTALL packages and binaries.
- The router's new `atlas` family, and an Atlas hint whenever no built-in family matches.
- 10 curated third-party skills (all MIT, all READ_ONLY_OK, reviewed), with three new router families
  (`evals`, `research`, `product`) and additions to `code`, `web` and `audit`:
  - LLM judges and eval suites
  - prompt engineering
  - deep claim verification and citation checking
  - STRIDE threat modelling
  - PRDs and requirements elicitation
  - WCAG audits
  - hledger
  See THIRD_PARTY_NOTICES.md.
- `tests/test_atlas.py` runs on a synthetic split library that includes a malicious package (a curl-to-shell hook, an MCP
  server, and an injected "paste your API key" instruction). That package is flagged, defaults to excluded, and is never
  vendorable.

### Fixed
- Local Full Pro guard (`kosif_full_pro_entry`) refused every tool with `NO_AUTHORIZATION` until 17,360 Jev calls were done, and `observe` flagged read-only evidence tools as BYPASS, contradicting `modes.md` (run the council and gates, route only consequential actions). The MCP layer now passes `--read-only` when the registry marks the proposed tool read-only; such tools are allowed and recorded as `EVIDENCE` with `counts_as_execution:false`. Executors and the 4 writing tools stay blocked; a direct executor is still a bypass.
- `kosif_risk_gate` action gate failed open: any `side_effect` outside its vocabulary (e.g. `external_message`, `send`) with a verified target returned PASS "low-risk-write" without approval, and an outbound action labelled `none` passed as read-only. Unrecognized side effects now return VERIFY with the allowed list; `external_write` style spellings are normalized; send/post/publish/upload/share/reply/forward/submit/transfer actions labelled `none` or `local-write` are escalated to `external-write`.
- `kosif_risk_gate` MCP schema declared only `gate`, so hosts sent the flags untyped and PASS was unreachable over MCP. All gate fields are now declared (`side_effect` as an enum, flags as booleans); the script also accepts `"true"`/`"false"` strings from direct callers. +7 self-test checks, +1 MCP test.
- `kosif_delivery_gate` returned BLOCK (score 0) on the plugin itself: all 6 blockers were reviewed false positives (deliberate scanner fixtures in `regression_self_test.py` / `test_server.py`, and the scanner's own docstring and rule patterns). Those lines now carry the existing `kosif-scan: ignore` marker, which is documented in `code_scan.py`; the gate now gives PASS. New tests: the marker is line-scoped, and the package must pass its own delivery gate.

## 11.1.1 — 2026-10-02 · remote endpoint follow-up
### Fixed
- `kosif-think` remote endpoint moved from `/mcp/v0.18.8` to `/mcp/v0.22.3`, which the live server now announces as its primary endpoint (`v0.18.8` became compatibility-only). Found by `kosif_doctor remote=true` (`.mcp.json`, `mcp.json`, Full Pro host-entry notes).
- `tools/build.py` crashed with `UnicodeEncodeError` after a successful smoke test when stdout was a non-UTF-8 Windows console (cp1256); it now writes UTF-8.

## 11.1.0 — 2026-10-02 · capability-truth fixes
### Fixed
- `kosif-think` remote endpoint moved from the compatibility-only `/mcp/v0.18.6?rev=…` to the server's announced primary `/mcp/v0.18.8` (`.mcp.json`, `mcp.json`).
- `kosif_prompt_forge`: `str.capitalize()` lowercased Flux style/quality text ("ARRI Alexa" → "arri alexa", "VFX" → "vfx"); locks already stated in the subject were repeated on token-budget platforms; video prompts printed `24` instead of `24 fps` and glued motion on with "while".
- `kosif_image_prompt_lint`: concrete quality cues (film grain, subsurface scattering, iridescence, translucency…) now count; the hint no longer recommends the vague boosters the forge flags.
- `kosif-full-pro-host-entry`: removed hardcoded stale runtime/endpoint versions; points to the live check instead.
### Added
- `kosif_doctor remote=true`: probes the optional backend and separates reachability, stale endpoint and missing OAuth sign-in (HTTP 401), each with a concrete fix. Offline by default; never flips the local `ok`.
- `kosif_corpus_configure`: persists the corpus folder in the state dir (no env var or restart needed); refuses folders outside the enabled sandbox.

## 11.0.0 — 2026-10-02 · KOSIF Omni (first unified release)
### Added
- Unified plugin merging Source kosif Do 10.9.1, kosif A1990 1.3.0, kosif Do Mobile 21.0.1, KOSIF Think 2.2.1, Jev Browser 1.0, Release Bridge 1.0, Cognitive Core 1.8.1 and the JEV WhatsApp bridge.
- `kosif-omni` front door skill with Standard / Council / Deep / Full Pro modes, host adapters and honest local-engine receipts.
- MCP server (stdio + HTTP, standard library only) with 44 tools, resources, prompts, REST + OpenAPI facade, path sandbox, bearer auth.
- Genius Council tools over the 1,040-member library (panel, expert, protocol, 500-profile overlay).
- Arabic-aware local full-text corpus search (SQLite FTS5, exact-duplicate detection, resumable indexing).
- New skills: `kosif-cinema-director` (from Dragon / Blue Jewel / Cinema AI / Omni-Sovereign / Black Camel sources), `kosif-voice`, `kosif-whatsapp`, `kosif-jev-browser`, `kosif-expert-council`.
- Claude Code commands and sub-agents; `.mcpb` extension; per-skill zips; ChatGPT plugin zip; Custom GPT pack; Claude Project instructions.
### Changed
- The five "Mandatory 5.4 entry override" blocks now apply only when Full Pro is explicitly requested, and name the local-engine path instead of failing closed outside ChatGPT.
### Not included on purpose
- "Dark Psychology / Mind Reading / Profiling" capabilities from the source prompts.
- The remote KOSIF Think backend itself, Secure Executor backend, Computer/Voice Director providers (referenced, optional, never assumed).
