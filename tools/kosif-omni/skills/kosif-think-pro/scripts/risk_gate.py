#!/usr/bin/env python3
"""Unified v4 Tool-Swap / Action / Data risk gate.

Deterministic preflight only. PASS is permission to continue the workflow, not proof
that a downstream action occurred. Human checkpoints and secrets remain blocked.
"""
from __future__ import annotations
import json, re, sys

HUMAN_RE=re.compile(r"\b(captcha|otp|mfa|one[- ]time|password|credential|card number|cvv|payment|billing)\b",re.I)
IRREV_RE=re.compile(r"\b(delete|drop|destroy|erase|factory reset|force[- ]?push|publish permanently|terminate)\b",re.I)
EXTERNAL_RE=re.compile(r"\b(send|post|publish|tweet|upload|share|invite|reply|forward|submit|transfer)\b",re.I)
SIDE_EFFECTS=("none","local-write","external-write","public-write","irreversible","unknown")
HIGH_SIDE={"external-write","public-write","irreversible"}

def _yes(v)->bool:
    """True only for an affirmative flag; hosts may send booleans as strings."""
    return v is True or (isinstance(v,str) and v.strip().lower() in {"true","yes","1"})

def _side(state:dict)->str:
    return str(state.get("side_effect") or "unknown").strip().lower().replace("_","-").replace(" ","-")

def _out(verdict,gate,reasons,checks):
    return {"verdict":verdict,"gate":gate,"reasons":reasons,"checks":checks,
            "rule":"PASS is preflight only; verify executor result and postcondition separately"}

def evaluate(state:dict)->dict:
    gate=str(state.get("gate") or "").strip().lower()
    reasons=[]; checks=[]

    if gate=="tool-swap":
        intended=str(state.get("intended_tool") or "").strip()
        proposed=str(state.get("proposed_tool") or "").strip()
        if not intended or not proposed:
            return _out("BLOCK",gate,["intended_tool and proposed_tool are required"],checks)
        checks.append("tools-named")
        same_tool=intended==proposed
        same_semantics=_yes(state.get("same_semantics"))
        schema=_yes(state.get("fresh_schema_verified"))
        if same_tool:
            if not same_semantics:
                return _out("VERIFY",gate,["same tool selected but semantic contract was not verified"],checks)
            if not schema:
                return _out("VERIFY",gate,["live/fresh schema was not verified"],checks)
            return _out("PASS",gate,[],checks+["same-tool","semantics-verified","schema-verified"])
        if not same_semantics:
            return _out("BLOCK",gate,[f"material tool swap {intended!r} -> {proposed!r} changes semantics"],checks)
        if not schema:
            return _out("VERIFY",gate,["replacement schema/capabilities need fresh verification"],checks)
        if not _yes(state.get("explicit_approval")):
            return _out("VERIFY",gate,["compatible replacement still needs explicit approval for this task"],checks)
        return _out("PASS",gate,[],checks+["replacement-compatible","schema-verified","approved"])

    if gate=="action":
        action=str(state.get("action") or "")
        side=_side(state)
        checks.append("action-classified")
        if HUMAN_RE.search(action):
            return _out("BLOCK",gate,["human-controlled credential/security/payment checkpoint"],checks)
        if side not in SIDE_EFFECTS:
            return _out("VERIFY",gate,[f"unrecognized side_effect {side!r}; use one of {', '.join(SIDE_EFFECTS)}"],checks)
        if side in {"none","local-write"} and EXTERNAL_RE.search(action):
            side="external-write"; checks.append("outbound-verb-escalated")
        if side=="none":
            return _out("PASS",gate,[],checks+["read-only-or-no-side-effect"])
        if side=="unknown":
            return _out("VERIFY",gate,["side-effect state is unknown"],checks)
        irreversible=(side=="irreversible" or bool(IRREV_RE.search(action)))
        if irreversible and not _yes(state.get("explicit_approval")):
            return _out("BLOCK",gate,["irreversible/destructive action lacks explicit approval"],checks)
        if not _yes(state.get("fresh_target_verified")):
            return _out("VERIFY",gate,["target and impact must be freshly verified"],checks)
        if side in HIGH_SIDE and not _yes(state.get("explicit_approval")):
            return _out("VERIFY",gate,["material external/public write needs explicit approval"],checks)
        return _out("PASS",gate,[],checks+["fresh-target","approval-ok" if _yes(state.get("explicit_approval")) else "low-risk-write"])

    if gate=="data":
        cls=str(state.get("data_class") or "unknown").lower()
        dest=str(state.get("destination") or "unknown").lower()
        if not _yes(state.get("minimum_necessary")):
            return _out("BLOCK",gate,["data scope exceeds minimum necessary or was not established"],checks)
        checks.append("minimum-necessary")
        if cls in {"secret","credential","otp","payment-card","private-key"}:
            return _out("BLOCK",gate,[f"{cls} data cannot be passed through this gate"],checks)
        if cls=="unknown":
            return _out("VERIFY",gate,["data classification is unknown"],checks)
        if dest=="unknown":
            return _out("VERIFY",gate,["destination classification is unknown"],checks)
        if cls in {"private","personal","confidential","sensitive"} and dest=="external" and not _yes(state.get("explicit_approval")):
            return _out("VERIFY",gate,["external disclosure of non-public data needs explicit approval"],checks)
        return _out("PASS",gate,[],checks+["classification-known","destination-known"])

    return _out("BLOCK",gate or "<missing>",["unknown or missing gate type"],checks)

def main():
    try: obj=json.load(sys.stdin); out=evaluate(obj)
    except Exception as e:
        print(json.dumps({"verdict":"BLOCK","error":str(e)})); return 2
    print(json.dumps(out,ensure_ascii=False,sort_keys=True))
    return {"PASS":0,"VERIFY":1,"BLOCK":3}[out["verdict"]]

if __name__=="__main__": raise SystemExit(main())
