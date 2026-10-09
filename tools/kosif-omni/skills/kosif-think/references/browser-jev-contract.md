# BrowserJev host-routing contract

1. Observe before browser/device writes.
2. Build a fresh indexed semantic action graph.
3. Use deterministic local ranking for unambiguous actions.
4. Jev receives one-time closed candidate packets and chooses observed IDs only.
5. Revalidate graph revision/digest, target freshness, risk, lease and ownership before writes.
6. High-risk actions need separate user approval; Jev never grants it.
7. KOSIF Computer remains the local executor.
8. After execution, settle and verify using fresh observable predicates.
9. Prefer deltas/events to repeated full snapshots.
10. Repeated no-change triggers bounded recovery, not blind repetition.
11. Bound duration/actions/Jev/recoveries/stalls.
12. Prefer effect signatures/idempotency for consequential writes.
13. CAPTCHA/MFA/password/security/payment are human checkpoints.
14. FINISH/transport success/page movement/model confidence are not completion.
15. Emit replayable trace/receipt data.
