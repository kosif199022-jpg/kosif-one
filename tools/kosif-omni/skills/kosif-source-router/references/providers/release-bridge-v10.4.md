# Release Bridge Provider Contract
Imported from `kosif-release-bridge` 1.0.0.

- GitHub is the source of truth for repo, branch, reviewed change and intended commit SHA.
- Cloudflare/Vercel/etc. deployment evidence must correlate to the intended source revision.
- Release success requires source commit -> deployment revision -> fresh live user-goal verification.
- Push, merge, build, deploy event or HTTP 200 alone is insufficient.
- Report exact mismatch: wrong commit/branch/project, failed build, stale deployment, live error or unverified postcondition.
- Never expose deployment secrets or bypass billing/auth/branch protection/security gates.
