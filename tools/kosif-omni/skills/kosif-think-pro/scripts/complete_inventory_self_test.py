import json
from pathlib import Path

root = Path(__file__).resolve().parents[3]
reg = json.loads((root / "skills/kosif-think-pro/references/complete-inventory-v10.4.json").read_text())
errors = []
plugins = reg.get("personal_plugins", [])
if len(plugins) != 19:
    errors.append(f"expected 19 personal plugins, got {len(plugins)}")
ids = [p["id"] for p in plugins]
if len(ids) != len(set(ids)):
    errors.append("duplicate plugin ids")
roles = {p["role"] for p in plugins}
if "CANONICAL_SOURCE" not in roles or "CANONICAL_MOBILE_FRONT_DOOR" not in roles:
    errors.append("canonical roles missing")
mesh = reg.get("app_mesh", {})
if mesh.get("registered_count") != 72:
    errors.append("app mesh count != 72")
if mesh.get("live_exposed_snapshot_count") != 71:
    errors.append("live exposure snapshot count != 71")
if mesh.get("registered_not_exposed_snapshot") != ["slack"]:
    errors.append("unexpected registered-not-exposed snapshot")
inv = reg.get("invariants", {})
for k in ["single_canonical_source","mobile_front_door_mcp_free","registered_app_manifest_required","specialist_provider_endpoints_not_cloned","provider_capability_contracts_imported"]:
    if inv.get(k) is not True:
        errors.append(f"invariant failed: {k}")
print(json.dumps({"ok": not errors, "plugin_count": len(plugins), "app_count": mesh.get("registered_count"), "live_exposed_snapshot": mesh.get("live_exposed_snapshot_count"), "errors": errors}, indent=2))
raise SystemExit(1 if errors else 0)
