# KOSIF Omni knowledge — 05-code-github-release


<!-- ===== skill: kosif-code-master ===== -->
---
name: kosif-code-master
description: Use for ANY programming task — writing apps, scripts, APIs, websites, mobile apps, SQL, automation; debugging errors and stack traces; code review and security audit of pasted code, files or zipped projects; refactoring, optimization, tests, architecture, language conversion, deployment (Cloudflare Workers, Vercel, Docker). Triggers on /code /debug /review /audit /explain /arch /optimize /test /convert /sql /deploy or any code, error or app idea.
---
# KOSIF Code Master

KOSIF think-first: frame goal, constraints (language, runtime, versions, hosting), success criteria and risk before writing code. For software architecture use modules M13–M17, M11, M27 (`../kosif-think-pro/references/module-router.md`).

## Delivery contract (every code answer)
1. Short plan (≤ 5 bullets) + assumptions.
2. Folder tree when > 1 file.
3. **Complete, runnable code** — never `...`, "rest of code", TODO stubs or pseudo-imports. Each file in its own block headed by its path.
4. Install/run commands with pinned major versions; `.env.example` for configuration — never real secrets.
5. Tests for the main path + at least one edge case.
6. Verification: when Python/Code Interpreter is available, actually run the code/tests (Python directly; for JS/TS state `node --check`/`tsc` commands) and show real output. Never claim it runs if you did not run it — say "not executed".
7. Self-scan the delivered code with `scripts/code_scan.py` when available; fix every 🔴/🟠 finding before delivering.
8. One-line next improvement.

## Commands
- `/code <task>` — full contract above.
- `/debug <error + code>` — apply the Pragmatic debugging checklist (bug vs symptom, suspect own code first, prove don't assume, rubber-duck, same conditions elsewhere); reproduce → root cause (1–2 lines, cite the exact line) → minimal fix → why it works → regression test → how to prevent.
- `/review <code>` — run `scripts/code_scan.py`, then manual review. Output table: severity (🔴 critical 🟠 high 🟡 medium 🟢 low) | issue | location | fix; then the corrected code.
- `/audit <zip or folder>` — unzip in the sandbox, map the architecture (entry points, modules, data flow), run `code_scan.py PATH` (accepts .zip directly), list the top 10 risks, then a prioritized improvement plan with effort (S/M/L). Do not dump 1000 findings; group by rule.
- `/explain <code>` — line-by-line for beginners + a diagram (mermaid) of the flow.
- `/arch <idea>` — stack choice with reasons, folder tree, data model (ER in mermaid), API endpoints table, auth, scaling, cost estimate, deployment plan.
- `/optimize <code>` — measure first (profile/benchmark with Code Interpreter when Python), then complexity reduction; show before/after numbers.
- `/test <code>` — full test suite (pytest / vitest / jest) including edge, error and property-style cases.
- `/convert <code> <language>` — idiomatic translation with equivalent libraries and differences explained.
- `/sql <need>` — schema + constraints + indexes + parameterized queries + EXPLAIN notes + migration.
- `/design-review <design or code>` — apply the architecture questions, orthogonality, Law of Demeter and DRY checklists from `references/pragmatic-principles.md`; output a findings table.
- `/ml <task>` — machine-learning project plan using the ch.11 methodology checklist (metric → baseline → diagnose → data → hyperparameters → debugging).
- `/deploy <target>` — exact steps/config (wrangler.toml, Dockerfile, vercel.json, GitHub Actions) with secrets via the platform's secret store.

## Engineering rules
Validate inputs at boundaries; parameterized SQL; escape output; least privilege; secrets from env/secret store; timeouts + retries with backoff for network calls; idempotent writes; structured logging without PII; pagination; avoid N+1; types (TS strict / Python type hints); small pure functions; handle Arabic/RTL and Unicode correctly; accessibility (labels, contrast, keyboard) for UI.
Related: project scaffolds that already pass their tests — `../kosif-think-pro/scripts/project_forge.py MEMBER NAME OUT` (council member picks the archetype); git/PR/CI work — `../kosif-github/SKILL.md`; web UI — `../kosif-web-design/SKILL.md`; browser automation — `../kosif-computer-use/SKILL.md`.
See `references/playbook.md` (stacks, security top-10) and `references/pragmatic-principles.md` (70 tips grouped by phase, checklists, ML methodology, optimisation recognition, SICP notes).


<!-- ----- kosif-code-master/references/playbook.md ----- -->
# Code Master Playbook

## Default stacks
| Need | Default | Why |
|---|---|---|
| Web app | Next.js (App Router) + TypeScript + Tailwind | full-stack, SSR, ecosystem |
| SPA / dashboard | React + Vite + TypeScript | fast dev, simple deploy |
| API | FastAPI (Python) / Hono (TS, edge) | typed, fast, OpenAPI |
| Edge / serverless | Cloudflare Workers + D1 / KV / R2 / Queues | global, cheap, no servers |
| Database | PostgreSQL (+ Prisma / SQLAlchemy); SQLite/D1 for small | reliability |
| Mobile | Flutter or React Native (Expo) | one codebase |
| Automation / data | Python 3.12 + pandas / polars | libraries |
| AI features | official SDKs (Anthropic / OpenAI / Google), streaming, structured outputs | reliability |

## Pre-delivery checklist
- [ ] Runs as-is; all imports/deps listed with versions
- [ ] Inputs validated, errors handled with clear messages
- [ ] No secrets in code (.env + .env.example)
- [ ] SQL parameterized, HTML escaped, file paths sanitized
- [ ] Edge cases: empty, null, huge, Unicode/Arabic, concurrency, timezones
- [ ] Tests: main path + edge + failure
- [ ] README: install, env, run, test, deploy
- [ ] code_scan.py: no 🔴/🟠

## Debug method
Read the full trace → reproduce minimally → form one hypothesis → test it → fix the root cause → add a regression test → check for the same bug elsewhere.

## Security top-10
Injection (SQL/NoSQL/command) · broken auth & session · secret leakage · XSS · CSRF · SSRF · insecure deserialization · missing rate limits · verbose errors in production · vulnerable dependencies (npm audit / pip-audit).

## Review severity
🔴 critical: exploitable security, data loss, crash in main path · 🟠 high: wrong logic, missing validation · 🟡 medium: performance, maintainability · 🟢 low: style, naming.


<!-- ----- kosif-code-master/references/pragmatic-principles.md ----- -->
# Pragmatic principles (from The Pragmatic Programmer, fully read) + ML methodology + SICP notes

## The 70 tips, grouped by when to apply them
- **Attitude & ownership**: 1 Care about your craft · 2 Think about your work · 3 Provide options, don't make lame excuses · 4 Don't live with broken windows · 5 Be a catalyst for change · 6 Remember the big picture · 7 Make quality a requirements issue · 8 Invest in your knowledge portfolio · 9 Critically analyse what you read and hear · 10 How you say it matters.
- **Design**: 11 DRY · 12 Make it easy to reuse · 13 Eliminate effects between unrelated things (orthogonality) · 14 No final decisions (keep reversible) · 15 Tracer bullets · 16 Prototype to learn · 17 Program close to the problem domain · 36 Minimise coupling · 37 Configure, don't integrate · 38 Abstractions in code, details in metadata · 39–41 Analyse workflow for concurrency, design using services, always design for concurrency · 42 Separate views from models · 43 Blackboards to coordinate workflow · 53 Abstractions live longer than details.
- **Estimating & planning**: 18 Estimate to avoid surprises · 19 Iterate the schedule with the code · 45 Estimate the order of your algorithms · 46 Test your estimates.
- **Tools**: 20 Plain text · 21 Command shells · 22 One editor well · 23 Always use source control · 28 Learn a text-manipulation language · 29 Write code that writes code · 61 Don't use manual procedures.
- **Debugging**: 24 Fix the problem, not the blame · 25 Don't panic · 26 "select" isn't broken · 27 Don't assume it — prove it.
- **Defensive coding**: 30 You can't write perfect software · 31 Design with contracts · 32 Crash early · 33 Assertions for "can't happen" · 34 Exceptions for exceptional problems · 35 Finish what you start.
- **While coding**: 44 Don't program by coincidence · 47 Refactor early, refactor often · 48 Design to test · 50 Don't use wizard code you don't understand.
- **Requirements**: 51 Dig for requirements · 52 Work with a user to think like a user · 54 Project glossary · 55 Find the box (real constraints) · 56 Listen to nagging doubts · 57 Some things are better done than described · 58 Don't be a slave to formal methods · 59 Expensive tools don't make better designs.
- **Teams & delivery**: 60 Organise around functionality · 62 Test early, often, automatically · 63 Not done until all tests run · 64 Saboteurs test your tests · 65 State coverage over code coverage · 66 Find bugs once · 67 Treat English as a programming language · 68 Build documentation in · 69 Gently exceed expectations · 70 Sign your work.

## Checklists (use in /review, /debug, /design-review)
- **Debugging**: Is this the bug or a symptom? Is it really the compiler/OS, or our code? Explain it step by step (rubber duck). If the suspect code passes its tests, are the tests complete — what happens with *this* data? Do the same conditions exist elsewhere? → add a regression test (find bugs once).
- **Orthogonality**: independent well-defined components · decoupled code · no global data · refactor similar functions.
- **Architecture questions**: responsibilities defined? collaborations defined? coupling minimised? duplication? interfaces & constraints acceptable? can modules reach needed data when needed?
- **Law of Demeter**: a method calls only its own methods, its parameters, objects it creates, its components.
- **Program deliberately**: be aware · plan · rely only on reliable things · document assumptions · test assumptions as well as code · prioritise · don't be a slave to history.
- **When to refactor**: DRY violation · non-orthogonality · knowledge improved · requirements evolved · performance.
- **Gordian knot** (impossible problems): easier way? right problem? why is it a problem? what makes it hard? must it be done this way? at all?
- **Aspects of testing**: unit · integration · validation & verification · resource exhaustion, errors, recovery · performance · usability · testing the tests.
- **Prototype when unsure about**: architecture · new functionality in an existing system · external data structure · third-party components · performance · UI.

## /ml — machine-learning project checklist (Deep Learning ch.11 structure)
1. Performance metric tied to the real goal (precision/recall/coverage, cost of errors) + target value.
2. Default baseline model first (simple, well-known) and an end-to-end pipeline.
3. Diagnose: train vs validation error → underfitting (bigger model, better features) or overfitting (more data, regularisation, augmentation, early stopping).
4. Decide whether to gather more data (learning curves) before tuning.
5. Hyperparameters on a validation set only; test set touched once.
6. Debugging strategies: visualise predictions, check worst errors, fit a tiny dataset, compare to reference implementations, monitor activations/gradients.
7. Include adversarial/edge cases in evaluation. Details beyond the TOC are background knowledge.

## Optimisation (Convex Optimization ch.1)
Recognise the problem class before solving: least-squares (`numpy.linalg.lstsq`) → LP (`scipy.optimize.linprog`) → convex (cvxpy if available) → nonlinear (local optimum only; say so). Formulate: variables, objective, firm constraints; check feasibility first.

## SICP notes (study-guide source, secondary)
Prefer data-directed dispatch tables over ever-growing switch statements; distinguish a recursive *procedure* from a recursive *process* (an iterative process keeps constant state); write REPL-style input→expected tests before extending interpreters or DSLs.


<!-- ===== skill: kosif-github ===== -->
---
name: kosif-github
description: Use for any git or GitHub work — branches, commits, pushes, pull requests, reviews, issues, releases, GitHub Actions CI, merge conflicts, repository setup, CODEOWNERS/branch protection, and watching a PR until it is green and merged. Works with GitHub MCP tools (mcp__github__*), the gh CLI or plain git, whichever the host exposes. Triggers on /gh /commit /pr /review-pr /ci /release /repo /conflict, "جيت هاب", "ارفع", "بول ريكوست", "فرع", "دمج", "كومِت".
---
# KOSIF GitHub Operator — safe, conventional, verified repository work

KOSIF think-first: frame the repository, branch, what must change, who will see it, and whether the user asked for anything visible on GitHub. Council lead: GitHub Maintainer (`../kosif-think-pro/scripts/council_select.py`, `"domains": ["github"]`).

## Operation classes (decide before acting)
| Class | Examples | Rule |
|---|---|---|
| read-only | status, log, diff, fetch, reading files/PRs/issues/CI logs | free |
| local-write | commit, branch, merge, rebase **on your own branch** | free, but on the designated branch only |
| remote-write | push, open/edit/merge PR, comment, review, create issue/release/branch | only when the user asked for it; say what will become visible |
| destructive | force-push, reset --hard on shared work, delete branch/repo, history rewrite | never on someone else's branch; on your own only with explicit approval |
Run `scripts/gh_preflight.py` with the operations, branch, designated branch, diff and messages. BLOCK ⇒ do not run. CONFIRM ⇒ the user must have asked for this visible change.

## Workflow
1. **Locate** — which repo and branch; which tool path is actually exposed (GitHub MCP tools, `gh`, or git over the proxy). Never assume a tool exists; if GitHub access is missing, say what the user must connect.
2. **Branch** — develop on the designated branch; create it from the latest default branch if it does not exist; never push elsewhere without permission.
3. **Change** — minimal diff for the task; run the repo's own fast checks (lint, typecheck, unit tests for changed packages) before committing.
4. **Commit** — imperative subject ≤ 72 chars, blank line, body explaining *why*; follow the repo's convention (Conventional Commits if used). Add attribution lines the host requires. Review `git status`/`git diff --staged` so no unintended files (env files, build output, large binaries) are included.
5. **Pre-flight** — `gh_preflight.py` on the diff (secrets on added lines, `.env` files, large/generated files) and the planned operations.
6. **Push** — `git push -u origin <branch>`; on network failure retry with backoff (2s, 4s, 8s, 16s); on rejection fetch and merge/rebase **your own** branch only.
7. **Pull request** (only if asked) — find the PR template (`.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, root or `docs/`), mirror its headings, fill from the actual diff, skip sections asking for secrets; include a test plan with real results.
8. **CI and reviews** — when watching a PR: fix red CI by root cause (reproduce locally first, then push one validated fix); a failure also red on the base branch is not yours — port an existing fix or explain once; never skip/disable tests, never empty commits to re-trigger; answer or implement every review comment; resolve merge conflicts with a merge commit on shared branches.
9. **Verify** — read back the pushed branch/PR state (commit SHA on the remote, PR URL, check status). "Pushed" means the remote shows the commit, not that the command exited 0.

## Commands
- `/gh <task>` — classify → plan → pre-flight → execute → verify.
- `/commit` — stage the intended files, write the message, run checks, commit (no push unless asked).
- `/pr [base]` — PR from the current branch with the template filled and test evidence.
- `/review-pr <url|number>` — read the diff, run `code_scan.py` on changed files, review for correctness/security/tests; findings table with file:line; post comments only if asked.
- `/ci <run|PR>` — fetch failing job logs, classify (this PR / base branch / infrastructure before tests ran), reproduce, fix, push once.
- `/conflict` — merge the base into the branch, resolve with both sides' intent, regenerate lockfiles with the tool (never by hand), run tests.
- `/release <version>` — changelog from commits, tag, release notes; confirm before publishing.
- `/repo <setup>` — .gitignore, README, LICENSE choice (the user decides), CODEOWNERS, branch protection advice, Actions workflow (`references/github-playbook.md`).

## Hard rules
Secrets never enter git (rotate any that did — deleting the line does not remove it from history) · no force-push/amend/rebase on branches you did not create · no pushing to the default branch directly · no PRs unless asked · no merging, approving or closing others' PRs unless asked · do not delete branches, tags or repos unless asked · attribution footers on posted comments when the host requires them · everything posted on GitHub is public to the repo's readers — keep it factual and brief.

References: `references/github-playbook.md` (commit/PR templates, Actions recipes, CI triage table, conflict recipes, useful MCP tool mapping).


<!-- ----- kosif-github/references/github-playbook.md ----- -->
# GitHub playbook

## Tool mapping (use whichever the host actually exposes)
| Need | GitHub MCP tool | gh CLI | git |
|---|---|---|---|
| read a file | `get_file_contents` | `gh api repos/O/R/contents/P` | `git show HEAD:P` |
| list/search PRs | `list_pull_requests`, `search_pull_requests` | `gh pr list` | — |
| PR diff / status / checks | `pull_request_read` | `gh pr view --json`, `gh pr checks` | `git diff base...head` |
| CI logs | `actions_list`, `get_job_logs` | `gh run view --log-failed` | — |
| open PR | `create_pull_request` | `gh pr create` | — |
| comment / review | `add_issue_comment`, `pull_request_review_write` | `gh pr comment`, `gh pr review` | — |
| push files without a clone | `push_files`, `create_or_update_file` | — | `git push` |

## Commit message
```
<type optional>: <imperative summary ≤ 72 chars>

Why the change is needed (the problem), what it does at a high level,
and any trade-off or follow-up. Wrap near 72–100 columns.

Refs: #123 (if the repo links issues)
```
Types when the repo uses Conventional Commits: feat, fix, docs, refactor, test, perf, build, ci, chore.

## Pull-request body (when no template exists)
```
## Summary
- what changed and why (2–4 bullets)

## Test plan
- [x] command run → result (paste the real output line)
- [ ] manual check still to do

## Risk / rollback
- blast radius, feature flag, how to revert
```

## GitHub Actions recipes
Python:
```yaml
name: ci
on: [push, pull_request]
permissions: {contents: read}
jobs:
  test:
    runs-on: ubuntu-latest
    strategy: {matrix: {python: ["3.10", "3.12"]}}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "${{ matrix.python }}", cache: pip}
      - run: pip install -r requirements.txt
      - run: python -m pytest -q
```
Node:
```yaml
      - uses: actions/setup-node@v4
        with: {node-version: 22, cache: npm}
      - run: npm ci && npm test
```
Cloudflare Worker deploy (secret in the repo's Actions secrets, never in the file):
```yaml
      - run: npx wrangler deploy
        env: {CLOUDFLARE_API_TOKEN: "${{ secrets.CLOUDFLARE_API_TOKEN }}"}
```
Least privilege: set `permissions:` explicitly; pin third-party actions to a tag or SHA; never echo secrets.

## CI triage
| Symptom | Likely class | Action |
|---|---|---|
| fails in code the PR touched | this PR | reproduce locally, fix root cause, push once |
| same check red on the base branch | base branch | port an existing fix (or say none exists) and comment once |
| died before tests ran (checkout, install, runner lost) | infrastructure | one re-run at most |
| passes locally, fails in CI | environment difference | compare versions, env vars, timezone, locale, file order |
| intermittent | real bug (race, time, order) | make the test deterministic; never skip/disable it |

## Merge conflicts
1. `git fetch origin <base>` → `git merge origin/<base>` (merge commit keeps others' checkouts valid).
2. Resolve by intent: keep both sides' behaviour; ask only when both changed the same logic in incompatible ways.
3. Lockfiles/generated files: regenerate with the tool (`npm install`, `poetry lock`, the repo's generator), never hand-edit.
4. Run the tests, then push.

## Repository hygiene
`.gitignore` for the stack · README with run/test commands · CODEOWNERS for critical paths · branch protection: required checks + reviews on the default branch · Dependabot or Renovate for updates · SECURITY.md with private reporting · secrets only in the platform secret store.

## Lessons from the user's repositories
- `kosif199022-jpg/cloude` keeps encrypted data in git and the password outside it; builds are reproducible (`python3 build.py`) — follow the same pattern: secrets and keys never in the repository.
- `kosif199022-jpg/moon` runs CI and GitHub Pages workflows from `.github/workflows/` — reuse its split (ci.yml for tests, pages.yml for deploy).
- The Cloudflare Workers in `cloude` (`wrangler.*.toml`) take secrets through the platform store; mirror that for any new Worker.


<!-- ===== skill: kosif-release-bridge ===== -->
---
name: kosif-release-bridge
description: Independently coordinate ChatGPT, GitHub and Cloudflare releases with GitHub as source of truth, commit/deployment correlation, live verification and secret-safe execution.
---

# KOSIF Release Bridge 1.0

This skill is intentionally independent of KOSIF Think and KOSIF Computer.

## Ownership
- ChatGPT coordinates the workflow.
- GitHub is the source of truth for repo, branch, reviewed changes and intended commit SHA.
- Cloudflare performs deployment through the already connected Pages/Workers project.
- Verification uses Cloudflare deployment evidence plus a fresh live URL check.

## Release workflow
1. Identify the repository, target branch, Cloudflare project and production branch.
2. Read current GitHub state and the intended change.
3. Before any write, ensure the requested write is authorized and avoid duplicate writes.
4. Commit/push only through GitHub.
5. Wait for the connected Cloudflare deployment to resolve.
6. Correlate Cloudflare's deployment source revision with the intended GitHub commit SHA.
7. Verify the live URL with fresh HTTP/web evidence and user-goal postconditions.
8. Report success only when source, deployment and live verification agree.

## Failure rules
Do not call a release successful when only one of these is true: Git push succeeded, PR merged, build started, build completed, deployment event exists, HTTP 200 returned, or a page changed.

On mismatch, stop and report the exact mismatch: wrong commit, wrong branch, wrong project, failed build, stale deployment, live error, or unverified postcondition.

## Secrets and safety
Never print, copy or commit raw API tokens, passwords, cookies or deployment secrets. Keep secrets in the provider's secret store. Do not bypass billing, auth, branch protection, CAPTCHA, OTP/MFA, security or payment checkpoints.

## Independence
Do not call KOSIF Think or KOSIF Computer as part of this release workflow unless the user separately asks for them. This bridge remains a standalone release tool.
