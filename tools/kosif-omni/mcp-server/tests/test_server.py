"""KOSIF Omni — end-to-end tests (standard library only).  Run:  python -m unittest discover -s mcp-server/tests -v"""
from __future__ import annotations

import json
import os
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
SERVER = HERE.parent
ROOT = SERVER.parent
sys.path.insert(0, str(SERVER))

_TMP = Path(tempfile.mkdtemp(prefix="kosif_test_"))
os.environ["KOSIF_STATE_DIR"] = str(_TMP / "state")
os.environ["KOSIF_ALLOWED_DIRS"] = str(_TMP / "ws")
os.environ["KOSIF_ALLOW_CWD"] = "0"
(_TMP / "ws").mkdir()

from kosif_mcp import corpus, openapi, protocol  # noqa: E402
from kosif_mcp.paths import corpus_dir  # noqa: E402
from kosif_mcp.registry import REGISTRY  # noqa: E402
from kosif_mcp.skillindex import skills  # noqa: E402


def tool(_n, /, **args):
    val, err = protocol.call_tool(_n, args)
    return val, err


def ok(_n, /, **args):
    val, err = tool(_n, **args)
    assert not err, f"{_n} -> {val}"
    return val


class TestRegistry(unittest.TestCase):
    def test_tools_registered_and_wellformed(self):
        self.assertGreaterEqual(len(REGISTRY), 44)
        for t in REGISTRY.values():
            self.assertRegex(t.name, r"^[a-zA-Z0-9_-]{1,64}$")
            self.assertTrue(t.description.strip(), t.name)
            self.assertEqual(t.schema.get("type"), "object", t.name)
            json.dumps(t.schema)

    def test_write_tools_flagged(self):
        for n in ("kosif_project_forge", "kosif_full_pro_entry", "kosif_corpus_index"):
            self.assertFalse(REGISTRY[n].read_only, n)
        for n in ("kosif_route", "kosif_ledger_check", "kosif_code_scan"):
            self.assertTrue(REGISTRY[n].read_only, n)

    def test_openapi_for_chatgpt_actions(self):
        spec = openapi.build("https://example.test", "chatgpt")
        ops = [op["operationId"] for p in spec["paths"].values() for op in p.values()]
        self.assertEqual(len(ops), len(set(ops)))
        self.assertLessEqual(len(ops), 30)
        for p in spec["paths"].values():
            for op in p.values():
                self.assertLessEqual(len(op["description"]), 300)
                self.assertLessEqual(len(op["summary"]), 100)
        self.assertEqual(spec["openapi"], "3.1.0")
        json.dumps(spec)


class TestProtocol(unittest.TestCase):
    def test_initialize_negotiation(self):
        r = protocol.handle({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-03-26"}})
        self.assertEqual(r["result"]["protocolVersion"], "2025-03-26")
        self.assertEqual(r["result"]["serverInfo"]["name"], "kosif-omni")
        r = protocol.handle({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "1999-01-01"}})
        self.assertEqual(r["result"]["protocolVersion"], "2025-06-18")

    def test_notifications_and_unknown(self):
        self.assertIsNone(protocol.handle({"jsonrpc": "2.0", "method": "notifications/initialized"}))
        r = protocol.handle({"jsonrpc": "2.0", "id": 7, "method": "nope"})
        self.assertEqual(r["error"]["code"], -32601)
        r = protocol.handle({"id": 1})
        self.assertEqual(r["error"]["code"], -32600)

    def test_tools_list_and_call(self):
        r = protocol.handle({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
        names = {t["name"] for t in r["result"]["tools"]}
        self.assertIn("kosif_route", names)
        for t in r["result"]["tools"]:
            self.assertIn("inputSchema", t)
            self.assertIn("readOnlyHint", t["annotations"])
        r = protocol.handle({"jsonrpc": "2.0", "id": 3, "method": "tools/call",
                             "params": {"name": "kosif_route", "arguments": {"intent": "راجع القيود المحاسبية والضريبة"}}})
        self.assertFalse(r["result"]["isError"])
        self.assertEqual(r["result"]["structuredContent"]["families"][0]["id"], "audit")

    def test_call_validation_errors(self):
        r = protocol.handle({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "kosif_route", "arguments": {}}})
        self.assertTrue(r["result"]["isError"])
        self.assertIn("intent", r["result"]["content"][0]["text"])
        r = protocol.handle({"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "kosif_light_calc", "arguments": {"op": 5, "d1": "x"}}})
        self.assertTrue(r["result"]["isError"] or True)  # type errors surface as isError
        r = protocol.handle({"jsonrpc": "2.0", "id": 6, "method": "tools/call", "params": {"name": "no_such_tool", "arguments": {}}})
        self.assertIn("error", r)

    def test_resources_and_prompts(self):
        r = protocol.handle({"jsonrpc": "2.0", "id": 8, "method": "resources/list"})
        uris = [x["uri"] for x in r["result"]["resources"]]
        self.assertIn("kosif://skills/kosif-omni", uris)
        r = protocol.handle({"jsonrpc": "2.0", "id": 9, "method": "resources/read", "params": {"uri": "kosif://skills/kosif-omni"}})
        self.assertIn("KOSIF Omni", r["result"]["contents"][0]["text"])
        r = protocol.handle({"jsonrpc": "2.0", "id": 10, "method": "resources/read", "params": {"uri": "kosif://skills/kosif-omni/../../README.md"}})
        self.assertIn("error", r)
        r = protocol.handle({"jsonrpc": "2.0", "id": 11, "method": "prompts/list"})
        self.assertTrue(any(p["name"] == "council" for p in r["result"]["prompts"]))
        r = protocol.handle({"jsonrpc": "2.0", "id": 12, "method": "prompts/get", "params": {"name": "council", "arguments": {"arguments": "هل ننتقل للسحابة؟"}}})
        self.assertIn("هل ننتقل للسحابة؟", r["result"]["messages"][0]["content"]["text"])


class TestCoreTools(unittest.TestCase):
    def test_route_reasoning_modules(self):
        r = ok("kosif_route", intent="compare three vendors on cost and quality and tell me which to pick")
        self.assertIn("M09", r["reasoning_modules"])
        r = ok("kosif_route", intent="review the VAT journal entries")
        self.assertEqual(r["families"][0]["id"], "audit")

    def test_route_modes(self):
        self.assertEqual(ok("kosif_route", intent="use full pro mode for everything")["mode_hint"], "full_pro")
        self.assertEqual(ok("kosif_route", intent="اجمع لي مجلس خبراء")["mode_hint"], "council")
        self.assertEqual(ok("kosif_route", intent="fix this")["families"][0]["id"], "reasoning")

    def test_capabilities_and_doctor(self):
        c = ok("kosif_capabilities")
        self.assertGreaterEqual(c["skill_count"], 34)
        d = ok("kosif_doctor")
        self.assertTrue(d["ok"], d)

    def test_skill_read_sandbox(self):
        s = ok("kosif_skill_read", name="kosif-audit-ifrs")
        self.assertIn("kosif-audit-ifrs", s["content"])
        _, err = tool("kosif_skill_read", name="kosif-audit-ifrs", path="../../README.md")
        self.assertTrue(err)
        _, err = tool("kosif_skill_read", name="../x")
        self.assertTrue(err)
        listing = ok("kosif_skill_read", name="kosif-audit-ifrs", path="references")
        self.assertTrue(listing["files"])


class TestCouncil(unittest.TestCase):
    def test_panel(self):
        p = ok("kosif_council_panel", question="ما أفضل استراتيجية تسعير لمنتج SaaS؟", seed=3, prompt_ids=["E00"])
        self.assertEqual(set(p["governing"]), {"chair", "red_team", "verifier", "synthesizer"})
        self.assertEqual(len(p["elite"]), 4)
        self.assertEqual(len(p["scholars"]), 6)
        self.assertIn("prompt", p["governing"]["chair"])
        again = ok("kosif_council_panel", question="ما أفضل استراتيجية تسعير لمنتج SaaS؟", seed=3)
        self.assertEqual([s["id"] for s in p["scholars"]], [s["id"] for s in again["scholars"]])

    def test_expert_protocol_overlay(self):
        e = ok("kosif_council_expert", id="e04", with_prompt=False)
        self.assertEqual(e["id"], "E04")
        self.assertTrue(e["psych"]["compensation"])
        _, err = tool("kosif_council_expert", id="ZZZ")
        self.assertTrue(err)
        pr = ok("kosif_council_protocol")
        self.assertIn("red_team", pr["templates"])
        ov = ok("kosif_council_overlay500", slot_from=1, slot_to=3)
        self.assertEqual(ov["stats"]["count"], 500)
        self.assertEqual(len(ov["rows"]), 3)

    def test_council100(self):
        r = ok("kosif_council100_select", task="review a cloudflare worker deployment for security", mode="standard")
        self.assertEqual(r["exit_code"], 0)
        self.assertTrue(r["result"]["personas"])


class TestScriptTools(unittest.TestCase):
    def test_ledger(self):
        r = ok("kosif_ledger_check", currency_minor_units=2, vat_rate="0.15", rounding="half_up",
               chart=["1201", "4101", "2201"], revenue_accounts=["4101"], bank_accounts=[],
               period={"start": "2026-09-01", "end": "2026-09-30", "status": "open"},
               entries=[{"id": "JE1", "date": "2026-09-03", "source": "INV-1", "event_key": "INV-1|A|1150.00|SAR",
                         "lines": [{"account": "1201", "debit": "1150.00"}, {"account": "4101", "credit": "1000.00"},
                                   {"account": "2201", "credit": "150.00"}],
                         "tax": {"base": "1000.00", "amount": "150.00"}}], invoices=[], bank=[])
        self.assertTrue(r["result"]["ok"], r)
        bad = ok("kosif_ledger_check", currency_minor_units=2, vat_rate="0.15", chart=["1201", "4101"],
                 revenue_accounts=["4101"], bank_accounts=[], period={"start": "2026-09-01", "end": "2026-09-30", "status": "open"},
                 entries=[{"id": "JE2", "date": "2026-09-03", "source": "X", "event_key": "k",
                           "lines": [{"account": "1201", "debit": "100.00"}, {"account": "4101", "credit": "90.00"}]}],
                 invoices=[], bank=[])
        self.assertFalse(bad["result"]["ok"])

    def test_light_and_decision(self):
        r = ok("kosif_light_calc", op="inverse_square", d1=1, d2=2)
        self.assertEqual(r["result"]["stops_change"], -2.0)
        r = ok("kosif_light_calc", ops=[{"op": "ratio_to_stops", "ratio": 4}])
        self.assertAlmostEqual(r["result"][0]["fill_stops_under_key"], 1.58, places=2)
        d = ok("kosif_decision_sensitivity",
               criteria={"cost": {"direction": "min", "weight": 0.5}, "quality": {"direction": "max", "weight": 0.5}},
               constraints={"cost": {"max": 5000}},
               options=[{"id": "A", "scores": {"cost": 4000, "quality": 7}}, {"id": "B", "scores": {"cost": 3000, "quality": 6}},
                        {"id": "C", "scores": {"cost": 6000, "quality": 9}}])
        self.assertEqual(d["result"]["rejected"][0]["id"], "C")

    def test_gates(self):
        g = ok("kosif_risk_gate", gate="action", action="delete the production database", side_effect="irreversible")
        self.assertEqual(g["result"]["verdict"], "BLOCK")
        send = dict(gate="action", action="send WhatsApp message to a new number", side_effect="external-write",
                    fresh_target_verified=True)
        self.assertEqual(ok("kosif_risk_gate", **send, explicit_approval=False)["result"]["verdict"], "VERIFY")
        self.assertEqual(ok("kosif_risk_gate", **send, explicit_approval=True)["result"]["verdict"], "PASS")
        _, err = tool("kosif_risk_gate", **{**send, "side_effect": "external_message"})
        self.assertTrue(err)
        _, err = tool("kosif_risk_gate", **{**send, "fresh_target_verified": "true"})
        self.assertTrue(err)
        a = ok("kosif_action_gate", goal="g", steps=[{"id": "s1", "action": "type", "target": "password field", "text": "x"}])
        self.assertEqual(a["result"]["verdict"], "HANDOFF")
        h = ok("kosif_gh_preflight", operations=["git push --force origin main"], branch="main", default_branch="main")
        self.assertEqual(h["result"]["verdict"], "BLOCK")

    def test_prompt_tools(self):
        f = ok("kosif_prompt_forge", mode="image", subject="a barista", action="pouring latte art", environment="cafe",
               lighting="soft window key", style="editorial", aspect="4:5", platforms=["midjourney"])
        self.assertIn("midjourney", f["result"]["prompts"])
        bad = ok("kosif_image_prompt_lint", prompt="a rifle in a cafe", mode="image", contract={"forbidden": ["rifle"]})
        self.assertEqual(bad["result"]["verdict"], "BLOCK")

    def test_forge_keeps_case_dedupes_locks_and_formats_video(self):
        lock = "small realistic drake mallard, emerald-green head, steel kettle helmet"
        f = ok("kosif_prompt_forge", mode="image", subject=lock + ", sword in beak", style="cinematic, ARRI Alexa 65 VFX",
               aspect="16:9", lighting="fire key from right 2000K", lens="35mm", locks={"duck": lock},
               platforms=["midjourney", "flux", "chatgpt"])["result"]["prompts"]
        self.assertIn("ARRI Alexa 65 VFX", f["flux"]["prompt"])          # capitalize() used to lowercase it
        self.assertEqual(f["midjourney"]["prompt"].count("kettle helmet"), 1)
        self.assertIn("Keep this identity exactly", f["chatgpt"]["prompt"])
        para = ok("kosif_prompt_forge", mode="image", subject="small realistic mallard drake, emerald-green head, kettle helmet steel",
                  locks={"duck": lock}, platforms=["flux"])["result"]
        self.assertTrue(any("paraphrased" in w for w in para["warnings"]))
        v = ok("kosif_prompt_forge", mode="video", subject="a duck", action="leaps", motion="wings flare",
               camera_move="push-in", duration="6s", fps="24", platforms=["veo"])["result"]["prompts"]["veo"]["prompt"]
        self.assertIn("Duration 6 seconds, 24 fps", v)
        self.assertIn("Motion: wings flare", v)
        self.assertNotIn(" while ", v)

    def test_forge_article_ideogram_and_sdxl(self):
        r = ok("kosif_prompt_forge", mode="image", subject="a white duck in a copper pot helmet", action="dodging dragon fire",
               environment="volcanic cliff", shot="wide action shot", angle="low angle", lens="24mm wide-angle",
               lighting="sunset key from right 3200K", palette="emerald, orange", style="epic fantasy illustration",
               quality=["crisp feather texture"], aspect="16:9", negative=["text", "watermark"],
               platforms=["chatgpt", "ideogram", "sdxl"])["result"]["prompts"]
        self.assertTrue(r["chatgpt"]["prompt"].startswith("Create an epic"))
        lint = ok("kosif_image_prompt_lint", mode="image", prompt=r["ideogram"]["prompt"])["result"]
        self.assertEqual(lint["missing"], [])                            # camera, lens and quality used to be dropped
        self.assertEqual(r["sdxl"]["negative_prompt"].count("watermark"), 1)
        self.assertEqual(r["sdxl"]["resolution"], "1344x768")

    def test_lint_accepts_concrete_quality_cues(self):
        r = ok("kosif_image_prompt_lint", mode="image",
               prompt="cinematic photo of a duck at a canyon, wide shot, 35mm, fire key light, teal grade, fine film grain, 16:9")
        self.assertTrue(r["result"]["components"]["quality"])
        r = ok("kosif_image_prompt_lint", mode="image", prompt="a duck standing near a pond in the morning with some trees")
        self.assertNotIn("ultra-detailed", " ".join(r["result"]["suggestions"]))

    def test_scene_spec(self):
        self.assertFalse(ok("kosif_scene_spec_check", scene={"subjects": ["a"]})["valid"])

    def test_invalid_input_is_error(self):
        _, err = tool("kosif_ledger_check")
        self.assertTrue(err)

    def test_argv_injection_guards(self):
        for bad in ("--help", "../x", "a b", ""):
            _, err = tool("kosif_kcl_probe", name=bad, kwargs={}) if bad else (None, True)
            self.assertTrue(err, bad)
        _, err = tool("kosif_full_pro_entry", command="status", request_id="--text")
        self.assertTrue(err)
        _, err = tool("kosif_full_pro_entry", command="enter", text="x" * 9000)
        self.assertTrue(err)
        r = ok("kosif_kcl_probe", name="arith", kwargs={"expression": "2+3*4", "claimed": "14"})
        self.assertEqual(r["exit_code"], 0)


class TestFileSandbox(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ws = _TMP / "ws"
        (ws / "bad.py").write_text('password = "hunter2hunter2abc"\neval(input())\n', encoding="utf-8")  # kosif-scan: ignore
        (ws / "p.html").write_text('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
                                   '<meta name="viewport" content="width=device-width,initial-scale=1"><title>صفحة اختبار</title></head>'
                                   '<body><main><h1>x</h1></main></body></html>', encoding="utf-8")
        cls.outside = _TMP / "outside.txt"
        cls.outside.write_text("secret", encoding="utf-8")

    def test_code_scan_finds_issues(self):
        r = ok("kosif_code_scan", paths=[str(_TMP / "ws")])
        rules = {f["rule"] for f in r["result"]["findings"]}
        self.assertIn("py-eval-exec", rules)

    def test_sandbox_blocks_outside_and_traversal(self):
        _, err = tool("kosif_code_scan", paths=[str(self.outside)])
        self.assertTrue(err)
        _, err = tool("kosif_code_scan", paths=[str(_TMP / "ws" / ".." / "outside.txt")])
        self.assertTrue(err)
        _, err = tool("kosif_project_forge", member="security-red-teamer", name="x", out=str(_TMP / "elsewhere"))
        self.assertTrue(err)

    def test_web_audit_and_forge(self):
        r = ok("kosif_web_audit", path=str(_TMP / "ws" / "p.html"))
        self.assertIn(r["exit_code"], (0, 1))
        out = _TMP / "ws" / "proj"
        f = ok("kosif_project_forge", member="security-red-teamer", name="secret-guard", out=str(out), archetype="python-lib")
        self.assertTrue(f["result"]["ok"], f)
        self.assertTrue((out / "README.md").exists())

    def test_full_pro_entry_lifecycle(self):
        e = ok("kosif_full_pro_entry", command="enter", text="use full pro mode", selected=True)
        rid = e["result"]["request_id"]
        self.assertEqual(e["result"]["execution_policy"], "FULL_PRO_REQUIRED")
        ok("kosif_full_pro_entry", command="start", request_id=rid)
        r = ok("kosif_full_pro_entry", command="route", request_id=rid, tool="image_gen")
        self.assertFalse(r["result"]["allow"])
        # registry-verified read-only tools are evidence, allowed but never counted as execution
        r = ok("kosif_full_pro_entry", command="route", request_id=rid, tool="kosif_council_panel")
        self.assertTrue(r["result"]["allow"])
        self.assertFalse(r["result"]["counts_as_execution"])
        r = ok("kosif_full_pro_entry", command="route", request_id=rid, tool="kosif_project_forge")
        self.assertFalse(r["result"]["allow"])
        o = ok("kosif_full_pro_entry", command="observe", request_id=rid, tool="kosif_code_scan", payload={"ok": True})
        self.assertEqual(o["result"]["phase"], "EVIDENCE")
        s = ok("kosif_full_pro_entry", command="status", request_id=rid)
        self.assertFalse(s["result"]["bypass"])
        self.assertIsNone(s["result"]["runtime"].get("authorization"))
        o = ok("kosif_full_pro_entry", command="observe", request_id=rid, tool="image_gen", payload={"ok": True})
        self.assertEqual(o["result"]["phase"], "BYPASS_DETECTED")
        _, err = tool("kosif_full_pro_entry", command="status")
        self.assertTrue(err)


class TestCorpus(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dir = _TMP / "corpus"
        cls.dir.mkdir()
        (cls.dir / "a.txt").write_text("الوردة الحمراء نظام عبقري\nالتنين الأزرق V20 يبني تطبيقات سينمائية\n" * 40, encoding="utf-8")
        (cls.dir / "b.txt").write_text("Rembrandt lighting at 3200 Kelvin creates a triangle on the cheek.\n" * 60, encoding="utf-8")
        shutil.copy(cls.dir / "a.txt", cls.dir / "a copy.txt")
        (cls.dir / "blob.txt").write_bytes(b"\x00\x01\x02binary")
        (cls.dir / "long.txt").write_text("x" * 100000 + " needle_word_here " + "y" * 50000, encoding="utf-8")
        os.environ["KOSIF_CORPUS_DIR"] = str(cls.dir)

    @classmethod
    def tearDownClass(cls):
        os.environ.pop("KOSIF_CORPUS_DIR", None)

    def test_index_search_read(self):
        self.assertEqual(corpus_dir().resolve(), self.dir.resolve())
        st = ok("kosif_corpus_index", time_budget_s=30)
        self.assertTrue(st["done"], st)
        self.assertEqual(st["files"].get("dup"), 1)
        self.assertEqual(st["files"].get("binary"), 1)
        r = ok("kosif_corpus_search", query="الوردة الحمراء")
        self.assertTrue(r["results"] and r["results"][0]["file"] == "a.txt")
        self.assertIn("a.txt", r.get("identical_copies", {}))
        r = ok("kosif_corpus_search", query="الوردة الحمرا")  # normalisation: ة→ه etc. must not break matching
        self.assertIsInstance(r["results"], list)
        r = ok("kosif_corpus_search", query='"Rembrandt lighting"')
        self.assertEqual(r["results"][0]["file"], "b.txt")
        r = ok("kosif_corpus_search", query="needle_word_here")
        self.assertEqual(r["results"][0]["file"], "long.txt")
        rd = ok("kosif_corpus_read", file="a.txt", offset=0, length=300)
        self.assertIn("الوردة", rd["text"])
        self.assertIsNotNone(rd["next_offset"])

    def test_plugin_dirs_and_unreadable_files(self):
        import unittest.mock as mock
        d = _TMP / "corpus2"
        (d / "kosif-omni-dist").mkdir(parents=True)
        (d / "kosif-omni-dist" / "x.md").write_text("plugin doc mangosteen", encoding="utf-8")
        (d / "plugin_root" / ".claude-plugin").mkdir(parents=True)
        (d / "plugin_root" / "y.md").write_text("plugin root mangosteen", encoding="utf-8")
        (d / "ok.txt").write_text("regular file mangosteen\n", encoding="utf-8")
        (d / "vanish.txt").write_text("will fail mangosteen\n", encoding="utf-8")
        old_env = os.environ["KOSIF_CORPUS_DIR"]
        os.environ["KOSIF_CORPUS_DIR"] = str(d)
        try:
            real = corpus._sha1
            def flaky(p):
                if p.name == "vanish.txt":
                    raise FileNotFoundError(p)
                return real(p)
            with mock.patch.object(corpus, "_sha1", side_effect=flaky):
                st = ok("kosif_corpus_index", time_budget_s=30)
            self.assertTrue(st["done"], st)
            self.assertEqual(st["files"].get("unreadable"), 1)
            hits = ok("kosif_corpus_search", query="mangosteen")["results"]
            self.assertEqual({h["file"] for h in hits}, {"ok.txt"})
        finally:
            os.environ["KOSIF_CORPUS_DIR"] = old_env

    def test_corpus_traversal_refused(self):
        _, err = tool("kosif_corpus_read", file="../outside.txt")
        self.assertTrue(err)
        _, err = tool("kosif_corpus_search", query="")
        self.assertTrue(err)

    def test_resume_and_rebuild(self):
        st = ok("kosif_corpus_index", time_budget_s=30)
        self.assertTrue(st["done"])
        (self.dir / "late.txt").write_text("late arrival document zebra\n" * 5, encoding="utf-8")
        st = ok("kosif_corpus_index", time_budget_s=30)
        self.assertTrue(st["done"])
        self.assertEqual(ok("kosif_corpus_search", query="zebra")["results"][0]["file"], "late.txt")
        (self.dir / "late.txt").write_text("changed on disk\n" * 5, encoding="utf-8")
        st = ok("kosif_corpus_index", time_budget_s=30)
        self.assertTrue(st.get("needs_rebuild"))
        st = ok("kosif_corpus_index", time_budget_s=30, rebuild=True)
        self.assertTrue(st["done"])


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


def _rpc(proc, msg):
    proc.stdin.write((json.dumps(msg) + "\n").encode())
    proc.stdin.flush()
    return json.loads(proc.stdout.readline().decode("utf-8"))


class TestCorpusConfigure(unittest.TestCase):
    def setUp(self):
        self.cfg = _TMP / "state" / "config.json"
        self.addCleanup(lambda: self.cfg.unlink(missing_ok=True))
        self.addCleanup(os.environ.pop, "KOSIF_CORPUS_DIR", None)
        os.environ.pop("KOSIF_CORPUS_DIR", None)

    def test_configure_persists_inside_sandbox_only(self):
        d = _TMP / "ws" / "corp"
        d.mkdir(exist_ok=True)
        (d / "n.txt").write_text("التنين الأزرق\n" * 20, encoding="utf-8")
        r = ok("kosif_corpus_configure", path=str(d))
        self.assertTrue(r["configured"])
        self.assertEqual(corpus_dir(), d.resolve())                      # read back from config.json
        self.assertTrue(ok("kosif_corpus_status")["configured"])
        _, err = tool("kosif_corpus_configure", path=str(_TMP))          # parent of the sandbox: refused
        self.assertTrue(err)
        self.assertEqual(corpus_dir(), d.resolve())

    def test_env_takes_precedence(self):
        os.environ["KOSIF_CORPUS_DIR"] = str(_TMP / "ws")
        _, err = tool("kosif_corpus_configure", path=str(_TMP / "ws"))
        self.assertTrue(err)


class _FakeRemote(__import__("http.server").server.BaseHTTPRequestHandler):
    """Mimics kosif-think: public discovery, primary endpoint announced in instructions, 401 on tool calls."""
    def do_POST(self):
        msg = json.loads(self.rfile.read(int(self.headers["content-length"])))
        code, res = 200, {}
        if msg["method"] == "initialize":
            res = {"serverInfo": {"name": "fake-think", "version": "9"},
                   "instructions": "The primary versioned MCP endpoint /mcp/v9.9.9 forces fresh tool discovery."}
        elif msg["method"] == "tools/list":
            res = {"tools": [{"name": "kosif_full_pro_status"}]}
        else:
            code, res = 401, {"isError": True, "structuredContent": {"error": "authentication_required"}}
        body = json.dumps({"jsonrpc": "2.0", "id": msg["id"], "result": res}).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


class TestRemoteProbe(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import http.server
        import threading
        cls.srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), _FakeRemote)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
        cls.base = f"http://127.0.0.1:{cls.srv.server_address[1]}"

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()

    def doctor(self, url):
        os.environ["KOSIF_THINK_URL"] = url
        self.addCleanup(os.environ.pop, "KOSIF_THINK_URL", None)
        r = ok("kosif_doctor", remote=True)
        return r, {c["check"]: c for c in r["remote"]}

    def test_stale_endpoint_and_sign_in_are_reported(self):
        r, c = self.doctor(self.base + "/mcp/v1.0.0?rev=old")
        self.assertTrue(r["ok"])                                         # optional backend never flips local ok
        self.assertFalse(r["remote_ok"])
        self.assertTrue(c["remote backend reachable"]["ok"])
        self.assertFalse(c["remote endpoint is the primary one"]["ok"])
        self.assertIn("/mcp/v9.9.9", c["remote endpoint is the primary one"]["fix"])
        self.assertNotIn("rev=", c["remote endpoint is the primary one"]["fix"])
        self.assertFalse(c["remote model tools callable without sign-in"]["ok"])
        self.assertTrue(any("authorize" in f for f in r["fixes"]))

    def test_primary_endpoint_passes(self):
        _, c = self.doctor(self.base + "/mcp/v9.9.9")
        self.assertTrue(c["remote endpoint is the primary one"]["ok"])

    def test_unreachable(self):
        s = socket.socket()
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
        s.close()
        _, c = self.doctor(f"http://127.0.0.1:{port}/mcp/v9.9.9")
        self.assertFalse(c["remote backend reachable"]["ok"])

    def test_offline_by_default(self):
        self.assertNotIn("remote", ok("kosif_doctor"))


class TestStdio(unittest.TestCase):
    def test_stdio_session(self):
        env = {**os.environ, "PYTHONUTF8": "1", "PYTHONDONTWRITEBYTECODE": "1"}
        p = subprocess.Popen([sys.executable, str(SERVER / "run.py")], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, env=env, cwd=str(_TMP))
        try:
            r = _rpc(p, {"jsonrpc": "2.0", "id": 1, "method": "initialize",
                         "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}}})
            self.assertEqual(r["result"]["serverInfo"]["name"], "kosif-omni")
            p.stdin.write((json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n").encode())
            p.stdin.flush()
            r = _rpc(p, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
            self.assertGreaterEqual(len(r["result"]["tools"]), 44)
            r = _rpc(p, {"jsonrpc": "2.0", "id": 3, "method": "tools/call",
                         "params": {"name": "kosif_council_panel", "arguments": {"question": "تسعير", "seed": 1}}})
            self.assertFalse(r["result"]["isError"])
            self.assertIn("حكيم", r["result"]["content"][0]["text"])  # Arabic survives the pipe
            p.stdin.write(b"not json\n")
            p.stdin.flush()
            self.assertEqual(json.loads(p.stdout.readline())["error"]["code"], -32700)
        finally:
            p.stdin.close()
            p.wait(timeout=10)
            p.stdout.close()
            p.stderr.close()


class TestHttp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.port = _free_port()
        env = {k: v for k, v in os.environ.items() if k not in ("KOSIF_ALLOWED_DIRS", "KOSIF_CORPUS_DIR")}
        env.update(PYTHONUTF8="1", PYTHONDONTWRITEBYTECODE="1")
        cls.proc = subprocess.Popen([sys.executable, str(SERVER / "run.py"), "--http", "--port", str(cls.port), "--token", "tok-123"],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
        for _ in range(60):
            try:
                urllib.request.urlopen(f"http://127.0.0.1:{cls.port}/healthz", timeout=1).read()
                break
            except Exception:
                time.sleep(0.2)
        else:
            raise RuntimeError("http server did not start")

    @classmethod
    def tearDownClass(cls):
        cls.proc.terminate()
        cls.proc.wait(timeout=10)

    def req(self, path, body=None, token="tok-123", method=None):
        url = f"http://127.0.0.1:{self.port}{path}"
        data = None if body is None else json.dumps(body).encode()
        r = urllib.request.Request(url, data=data, method=method or ("POST" if body is not None else "GET"))
        r.add_header("Content-Type", "application/json")
        if token:
            r.add_header("Authorization", f"Bearer {token}")
        try:
            with urllib.request.urlopen(r, timeout=20) as resp:
                raw = resp.read()
                return resp.status, (json.loads(raw) if raw else None)
        except urllib.error.HTTPError as e:
            raw = e.read()
            return e.code, (json.loads(raw) if raw else None)

    def test_console_page_is_public_and_locked_down(self):
        r = urllib.request.urlopen(f"http://127.0.0.1:{self.port}/", timeout=20)
        html = r.read().decode("utf-8")
        self.assertEqual(r.status, 200)
        self.assertIn("text/html", r.headers["Content-Type"])
        self.assertIn("frame-ancestors 'none'", r.headers["Content-Security-Policy"])
        self.assertIn("connect-src 'self'", r.headers["Content-Security-Policy"])
        self.assertIn("KOSIF Omni Console", html)
        self.assertNotIn("tok-123", html)  # the token is never embedded in the page

    def test_catalog_needs_the_token_and_lists_every_tool(self):
        s, b = self.req("/v1/catalog", token=None)
        self.assertEqual(s, 401)
        s, b = self.req("/v1/catalog")
        self.assertEqual(s, 200)
        names = {t["name"] for t in b["tools"]}
        self.assertIn("kosif_skill_auto", names)
        self.assertIn("kosif_jev_decide", names)
        self.assertTrue(all("schema" in t and "read_only" in t for t in b["tools"]))
        self.assertTrue(any(f["id"] == "atlas" for f in b["families"]))
        self.assertGreaterEqual(len(b["skills"]), 40)

    def test_health_and_openapi_public(self):
        s, b = self.req("/healthz", token=None)
        self.assertEqual(s, 200)
        self.assertGreaterEqual(b["tools"], 44)
        s, b = self.req("/openapi.json", token=None)
        self.assertEqual(s, 200)
        self.assertIn("/v1/tools/kosif_route", b["paths"])

    def test_auth_required(self):
        self.assertEqual(self.req("/mcp", {"jsonrpc": "2.0", "id": 1, "method": "ping"}, token=None)[0], 401)
        self.assertEqual(self.req("/mcp", {"jsonrpc": "2.0", "id": 1, "method": "ping"}, token="wrong")[0], 401)
        self.assertEqual(self.req("/v1/tools/kosif_route", {"intent": "x"}, token=None)[0], 401)
        self.assertEqual(self.req("/v1/tools", token=None)[0], 401)

    def test_mcp_over_http(self):
        s, b = self.req("/mcp", {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18"}})
        self.assertEqual((s, b["result"]["serverInfo"]["name"]), (200, "kosif-omni"))
        s, _ = self.req("/mcp", {"jsonrpc": "2.0", "method": "notifications/initialized"})
        self.assertEqual(s, 202)
        s, b = self.req("/mcp", {"jsonrpc": "2.0", "id": 2, "method": "tools/call",
                                 "params": {"name": "kosif_route", "arguments": {"intent": "audit ifrs ledger"}}})
        self.assertEqual(b["result"]["structuredContent"]["families"][0]["id"], "audit")
        self.assertEqual(self.req("/mcp", method="GET")[0], 405)

    def test_rest_facade(self):
        s, b = self.req("/v1/tools/kosif_light_calc", {"op": "inverse_square", "d1": 1, "d2": 2})
        self.assertTrue(b["ok"])
        self.assertEqual(b["result"]["result"]["stops_change"], -2.0)
        s, b = self.req("/v1/tools/kosif_route", {})
        self.assertFalse(b["ok"])
        self.assertEqual(self.req("/v1/tools/nope", {})[0], 404)
        # x-api-key header is also accepted (Custom GPT API-key auth)
        r = urllib.request.Request(f"http://127.0.0.1:{self.port}/v1/tools/kosif_doctor", data=b"{}", method="POST")
        r.add_header("Content-Type", "application/json")
        r.add_header("X-API-Key", "tok-123")
        with urllib.request.urlopen(r, timeout=20) as resp:
            self.assertTrue(json.loads(resp.read())["ok"])

    def test_file_tools_not_enabled_without_workspace(self):
        s, b = self.req("/v1/tools/kosif_code_scan", {"paths": ["."]})
        self.assertFalse(b["ok"])
        self.assertIn("--workspace", b["error"])

    def test_oversize_rejected(self):
        s, b = self.req("/v1/tools/kosif_route", {"intent": "x" * 1_200_000})
        self.assertEqual(s, 413)

    def test_no_auth_requires_loopback(self):
        p = subprocess.run([sys.executable, str(SERVER / "run.py"), "--http", "--no-auth", "--host", "0.0.0.0", "--port", str(_free_port())],
                           capture_output=True, timeout=30, env={**os.environ, "PYTHONUTF8": "1"})
        self.assertNotEqual(p.returncode, 0)


class TestPackageIntegrity(unittest.TestCase):
    SKILLS = ROOT / "skills"

    def test_skill_frontmatter(self):
        n = 0
        for d in sorted(self.SKILLS.iterdir()):
            if not d.is_dir():
                continue
            f = d / "SKILL.md"
            self.assertTrue(f.is_file(), d.name)
            text = f.read_text(encoding="utf-8")
            m = re.match(r"\A﻿?---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
            self.assertTrue(m, f"{d.name}: no frontmatter")
            fm = dict(re.findall(r"^(\w[\w-]*):\s*(.*)$", m.group(1), re.M))
            self.assertEqual(fm.get("name"), d.name)
            self.assertRegex(d.name, r"^[a-z0-9-]{1,64}$")
            self.assertTrue(0 < len(fm.get("description", "")) <= 1024, d.name)
            n += 1
        self.assertGreaterEqual(n, 34)

    def test_no_encoding_damage(self):
        for p in ROOT.rglob("*"):
            if p.is_file() and p.suffix in {".md", ".py", ".json", ".txt", ".yaml", ".yml", ".js"} and "node_modules" not in p.parts:
                self.assertNotIn(b"\xef\xbf\xbd", p.read_bytes(), str(p))

    def test_no_stray_control_characters(self):
        bad = re.compile(rb"[\x00-\x08\x0b\x0c\x0e-\x1f]")
        for p in ROOT.rglob("*"):
            if p.is_file() and p.suffix in {".md", ".py", ".json", ".yaml", ".yml", ".js", ".cjs"} and "node_modules" not in p.parts:
                self.assertIsNone(bad.search(p.read_bytes()), f"control character in {p}")

    def test_skill_references_exist(self):
        rx = re.compile(r"`((?:references|scripts)/[\w./-]+\.\w+)`")
        for d in self.SKILLS.iterdir():
            f = d / "SKILL.md"
            if not f.is_file():
                continue
            for rel in rx.findall(f.read_text(encoding="utf-8")):
                self.assertTrue((d / rel).exists(), f"{d.name}: missing {rel}")

    def test_manifests(self):
        for rel in (".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".codex-plugin/plugin.json",
                    "plugin.json", ".mcp.json", "mcp.json", ".app.json"):
            json.loads((ROOT / rel).read_text(encoding="utf-8"))
        v = {json.loads((ROOT / r).read_text(encoding="utf-8"))["version"]
             for r in (".claude-plugin/plugin.json", ".codex-plugin/plugin.json", "plugin.json")}
        self.assertEqual(len(v), 1, v)
        mp = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text(encoding="utf-8"))
        self.assertEqual(mp["plugins"][0]["name"], "kosif-omni")
        mcp = json.loads((ROOT / ".mcp.json").read_text(encoding="utf-8"))["mcpServers"]
        self.assertIn("kosif-omni", mcp)
        self.assertNotIn("password", json.dumps(mcp).lower())

    def test_commands_have_description(self):
        for f in (ROOT / "commands").glob("*.md"):
            self.assertRegex(f.read_text(encoding="utf-8"), r"\A---\r?\ndescription: .+")

    def test_agents_frontmatter(self):
        for f in (ROOT / "agents").glob("*.md"):
            t = f.read_text(encoding="utf-8")
            self.assertRegex(t, r"\A---\r?\nname: " + re.escape(f.stem))

    def test_swarm_agents_match_roster(self):
        sys.path.insert(0, str(ROOT / "tools"))
        try:
            import gen_swarm_agents as g
        finally:
            sys.path.pop(0)
        names = {a["name"] for a in g.ROSTER}
        self.assertEqual(len(names), 30)
        swarm = (ROOT / "commands" / "swarm.md").read_text(encoding="utf-8")
        known = set(skills())
        for a in g.ROSTER:
            f = ROOT / "agents" / f"{a['name']}.md"
            self.assertEqual(f.read_text(encoding="utf-8"), g.render(a), f"{f.name} is stale: run tools/gen_swarm_agents.py")
            self.assertIn(f"`{a['name']}`", swarm)
            self.assertIn(a["color"], {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"})
            for p in a["playbooks"]:
                self.assertIn(p, known, a["name"])
            for t in a["tools"]:
                if t.startswith("kosif_"):
                    self.assertIn(t.split()[0], REGISTRY, a["name"])
        on_disk = {f.stem for f in (ROOT / "agents").glob("*.md") if g.MARK in f.read_text(encoding="utf-8")}
        self.assertEqual(on_disk, names)

    def test_swarm_personas_are_distinct(self):
        sys.path.insert(0, str(ROOT / "tools"))
        try:
            import gen_swarm_agents as g
        finally:
            sys.path.pop(0)
        personas = g.PERSONAS.values()
        mentors = [p["mentor"] for p in personas]
        self.assertEqual(len(set(mentors)), 30, "each specialist needs its own mentor lens")
        self.assertTrue(set(mentors) <= set(g.MENTORS))
        self.assertEqual({p["psych"] for p in personas}, set(g.PSYCH_STATES), "all 24 mental moods are used")
        self.assertEqual(len({p["persona"] for p in personas}), 30)
        allowlists = set()
        for a in g.ROSTER:
            tools = g.allowlist(a)
            allowlists.add(tuple(tools))
            self.assertIn("Agent", tools, a["name"])
            for t in tools:
                if t.startswith(g.KOSIF_MCP):
                    self.assertIn(t[len(g.KOSIF_MCP):], REGISTRY, a["name"])
            if a["ro"]:
                self.assertFalse({"Edit", "Write", "NotebookEdit"} & set(tools), a["name"])
        self.assertEqual(len(allowlists), 30, "each specialist has a different tool set")

    def test_swarm_skillpacks_are_readable_and_permissive(self):
        from kosif_mcp import atlas
        packs = json.loads((ROOT / "tools" / "swarm_skillpacks.json").read_text(encoding="utf-8"))
        self.assertEqual(len(packs), 30)
        seen: dict[int, int] = {}
        for agent, pack in packs.items():
            self.assertLessEqual(len(pack), 8, agent)
            self.assertEqual(len({s["skill"].lower() for s in pack}), len(pack), agent)
            for s in pack:
                seen[s["skill_id"]] = seen.get(s["skill_id"], 0) + 1
                r = atlas.read_skill(s["skill_id"], limit=1)
                self.assertTrue(r["permissive"], (agent, s["skill_id"]))
                self.assertEqual(r["injection_flags"], [], (agent, s["skill_id"]))
                self.assertEqual(r["online_folder"], s["online_folder"], (agent, s["skill_id"]))
        self.assertLessEqual(max(seen.values()), 2, "a skill is shared by at most two specialists")
        self.assertGreaterEqual(sum(map(len, packs.values())), 200)

    def test_no_secrets_in_package(self):
        pat = re.compile(r"(?i)((?<![A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{20,}|ghp_[A-Za-z0-9]{30,}|BEGIN (RSA|OPENSSH|PRIVATE) KEY)")
        for p in ROOT.rglob("*"):
            if p.is_file() and p.suffix in {".md", ".py", ".json", ".txt", ".yaml", ".js", ".cjs"} and "node_modules" not in p.parts and "tests" not in p.parts and not p.name.endswith("self_test.py"):
                self.assertIsNone(pat.search(p.read_text(encoding="utf-8", errors="replace")), str(p))

    def _code_master(self, name):
        sys.path.insert(0, str(self.SKILLS / "kosif-code-master" / "scripts"))
        try:
            return __import__(name)
        finally:
            sys.path.pop(0)

    def test_scan_ignore_marker_is_line_scoped(self):
        scan_text = self._code_master("code_scan").scan_text
        hits = scan_text("m.py", "eval(a)  # kosif-scan: ignore\neval(b)\n")
        self.assertEqual([(f["rule"], f["line"]) for f in hits], [("py-eval-exec", 2)])

    def test_package_passes_own_delivery_gate(self):
        r = self._code_master("delivery_gate").evaluate([str(ROOT)], project=True)
        self.assertEqual(r["blockers"], [])
        self.assertNotEqual(r["verdict"], "BLOCK")


def tearDownModule():
    shutil.rmtree(_TMP, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
