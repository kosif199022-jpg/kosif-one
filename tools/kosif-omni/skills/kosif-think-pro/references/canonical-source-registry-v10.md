# ThinkPro 10 Canonical Source Registry

## Canonical source
`plugins_6abd29b907ac8191a457bce773dc7515` — Source ThinkPro 10. Owns Cognitive Core, source router, Full Pro Runtime/Execution Engine, Einstein, Knowledge Atlas, SceneSpec/visual orchestration, Secure Executor policy and canonical capability inventory.

## Canonical mobile front door
`plugins_6abcd190218c81918401242b2d7c1835` — ThinkPro 10. Skills + registered apps only; no bundled MCP. Owns mobile selection/routing/verification UX, not backend runtime implementation.

## Canonical provider
`plugins_6ab98e1d109c81918980af27bcd07477` — KOSIF Think. Owns the live KOSIF Think MCP/app bridge. Source ThinkPro 10 routes to it when actually exposed.

## Specialist providers retained
- Computer: plugins_6ab9449964888191a0598be34e814b7f and plugins_6abcd25560988191821a22b759ceb6af
- Jev Browser: plugins_6abccdab5fb081919a04f17cb2fdf08e
- Release: plugins_6abba48f4ea88191a7c108b72762f23b
- Voice: plugins_6ab805f8e0d881918f7784e4dc097f68
- WhatsApp: plugins_6ab69b5d66f08191a725772155145810
These remain external providers; their routing contracts are merged, not their external endpoints.

## Merged legacy sources/routers
The strongest policies from old Source KOSIF Think Pro, Cognitive Core, Cortex, Think More, Think Mobile Native, Think Mobile, KOSIF All and Think Direct are consolidated here. Legacy packages remain only for rollback until explicitly removed.
