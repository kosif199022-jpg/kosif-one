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
