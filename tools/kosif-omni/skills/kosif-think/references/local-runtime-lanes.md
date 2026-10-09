# KOSIF Computer local-runtime lanes

Core: `uia.*`, `workflow.run`, `watch.*`, `app.*`, `dialog.*`, `screenstate.*`, `browser.*`, `devtools.*`.

Files/media/devices: `filesearch.*`, `media.*`, `android.*`, `rclone.*`, `obs.*`.

Network/secrets/automation: `network.*`, `vault.*`, `automation.*`, `eventbus.*`, `api.*`, `memory.*`.

AutoHotkey/FlaUI are deterministic fallbacks. Coordinates are last resort. Always check live status; documented lanes are capability contracts, not proof that a runtime is currently connected.
