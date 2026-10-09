# Indexed Semantic Action Graph

Each fresh snapshot becomes a compact graph. Candidate fields: stable `action_id`, action type, accessible role/name/text or UIA identity, enabled/checked/selected/visible/focused state, semantic context, target owner, risk/side-effect class, freshness timestamp, graph revision, candidate digest, expected postcondition, deterministic score and ambiguity group.

Edges may encode parent/child context, opens/dialog/navigates relations, precondition dependency, mutually exclusive candidates, recovery/fallback relation and browser-to-Windows handoff. Deterministic local selection is preferred. Jev sees only a closed fresh ambiguous set. Reject stale packets or graph revisions.
