# kosif think 20 s Mobile Capability Map — 10.2

## Mobile front door invariant
- No bundled MCP server.
- No `mcp.json`, `.mcp.json`, or `mcpServers` in this front-door package.
- The optional 72-app mesh is discovery/routing metadata only; an app is usable only when the current ChatGPT surface actually exposes/connects it.

## Canonical source
- Source kosif think 20 s owns Cognitive Core, Source Router, Full Pro Runtime/Execution Engine, Einstein, Knowledge Atlas, SceneSpec/visual orchestration, Secure Executor policy and canonical inventory.
- kosif think 20 s mobile owns selection/routing UX, not backend implementation.

## Canonical provider
- KOSIF Think owns the live backend bridge.
- KOSIF Think 0.9.5+ exposes `mobileFullProBridge` through the already-visible `kosif_think` tool for mobile surfaces whose tool catalog does not expose the dedicated Full Pro tools.
- The bridge uses a per-request capability token whose hash is stored in durable KV. A bad token must fail closed.

## Specialist providers
- Jev Bridge / Jev Browser: closed-set arbitration and browser ambiguity handling.
- KOSIF WhatsApp: messaging/files/jobs.
- KOSIF Voice Director: voice/TTS/music workflows.
- KOSIF Computer / Remote Desktop: authorized local-device work.
- Release/GitHub/Cloudflare: source-to-deployment workflows.
- TinyFish/browser/web: browser/cloud navigation when appropriate.
- Files/Drive/Knowledge Atlas: evidence retrieval and provenance.

## Truth rule
Source capability != live tool exposure. Live tool exposure != successful execution. Successful execution != user-goal completion without postcondition verification.
