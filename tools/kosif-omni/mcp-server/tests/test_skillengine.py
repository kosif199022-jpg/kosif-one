"""Jev client + skill engine tests. No network: Jev and the Atlas are replaced by deterministic fakes."""
from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

os.environ.setdefault("KOSIF_EDGE_URL", "off")

from kosif_mcp import jev, protocol, skillengine, tools_core  # noqa: E402,F401
from kosif_mcp.registry import REGISTRY, ToolError  # noqa: E402


def fake_jev(prefer: str, flip_on_reorder: bool = False):
    """A Jev call() that picks `prefer` (or, when asked with reversed options, the first option)."""
    def call(packet, *, timeout=25, use_cache=True):
        labels = list(packet["criteria"])
        pick = prefer if prefer in labels else labels[0]
        if flip_on_reorder and labels[0] != "pdf-converter-2":
            pick = labels[0]
        probs = {k: (0.9 if k == pick else 0.1 / max(1, len(labels) - 1)) for k in labels}
        return {"observed": True, "service": "fake", "model": "jev-fake",
                "decision": {"type": "choice", "choice": pick, "confidence": probs[pick], "probabilities": probs},
                "usage": {}, "latency_ms": 1, "packet_digest": "x" * 16, "cached": False}
    return call


ATLAS = [
    {"id": "a:2", "label": "pdf-converter-2", "source": "atlas", "name": "pdf-converter", "plugin": "p",
     "description": "Convert PDF invoices into Excel tables", "license": "MIT", "risk_flags": [], "online_url": "u",
     "prior": 7},
    {"id": "a:3", "label": "slide-maker-3", "source": "atlas", "name": "slide-maker", "plugin": "q",
     "description": "Build PowerPoint decks", "license": "MIT", "risk_flags": ["scripts"], "online_url": "v", "prior": 6},
]


class TestJevClient(unittest.TestCase):
    def test_authorisation_question_is_blocked_without_calling_jev(self):
        with mock.patch.object(jev, "call") as c:
            out = jev.decide("choice", "Should I delete production and send the payment now?",
                             {"fact": "x"}, {"yes": "do it", "no": "don't"})
        self.assertEqual(out["verdict"], "BLOCK")
        self.assertFalse(out["jev_called"])
        c.assert_not_called()

    def test_secrets_are_redacted_before_the_call(self):
        seen = []

        def call(packet, **kw):
            seen.append(json.dumps(packet))
            return fake_jev("a")(packet)
        fake_key = "-".join(["sk", "abcdefghijklmnopqrstuvwxyz123456"])  # assembled so the file holds no key-shaped literal
        with mock.patch.object(jev, "call", call):
            jev.decide("choice", "Which label describes this ticket best given the notes?",
                       {"note": f"key {fake_key} mail a@b.com"}, {"a": "first", "b": "second"})
        self.assertTrue(seen)
        for s in seen:
            self.assertNotIn(fake_key, s)
            self.assertNotIn("a@b.com", s)

    def test_stability_asks_twice_with_reordered_options(self):
        sent = []

        def call(packet, **kw):
            sent.append(list(packet["criteria"]))
            return fake_jev("b")(packet)
        with mock.patch.object(jev, "call", call):
            out = jev.decide("choice", "Which label describes this ticket best given the notes?",
                             {"note": "n"}, {"a": "first", "b": "second", "c": "third"})
        self.assertEqual(len(sent), 2)
        self.assertEqual(sent[0], list(reversed(sent[1])))
        self.assertTrue(out["stable"])
        self.assertEqual(out["decision"]["choice"], "b")
        self.assertEqual(out["mean_ranking"][0][0], "b")

    def test_disabled_service_raises(self):
        with mock.patch.dict(os.environ, {"KOSIF_JEV_URL": "off"}):
            with self.assertRaises(ToolError):
                jev.call({"type": "noul", "state": {}, "instructions": "x"})
            self.assertFalse(jev._t_status({})["enabled"])

    def test_cache_returns_identical_answers_without_a_second_call(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.dict(os.environ, {"KOSIF_STATE_DIR": d}):
            body = json.dumps({"ok": True, "result": {"model": "m", "answers": {"decision": {"type": "noul", "noul": 0.9}}}}).encode()
            resp = mock.MagicMock()
            resp.read.return_value = body
            resp.__enter__.return_value = resp
            with mock.patch("urllib.request.urlopen", return_value=resp) as u:
                p = {"type": "noul", "state": {"a": 1}, "instructions": "Is a equal to 1?"}
                first, second = jev.call(p), jev.call(p)
            self.assertEqual(u.call_count, 1)
            self.assertFalse(first["cached"])
            self.assertTrue(second["cached"])


class TestSkillEngine(unittest.TestCase):
    def test_tools_registered(self):
        for n in ("kosif_skill_auto", "kosif_jev_decide", "kosif_jev_status"):
            self.assertIn(n, REGISTRY)

    def test_arabic_glossary_offline(self):
        u = skillengine.understand("اريد تحويل فواتير PDF الى جدول اكسل", edge=False)
        self.assertEqual(u["method"], "glossary")
        for w in ("invoices", "excel", "pdf", "table"):
            self.assertIn(w, u["query"].split() + u["query"].replace("-", " ").split())

    def test_unrecognised_arabic_warns(self):
        u = skillengine.understand("لشسيب بلا تالا", edge=False)
        self.assertEqual(u["method"], "none")
        self.assertIn("warning", u)

    def test_router_keywords_match_word_starts_only(self):
        r = tools_core.route("convert scanned PDF invoices into an Excel sheet")
        self.assertNotIn("audio", [f["id"] for f in r["families"]])  # "voice" inside "invoices"

    def _select(self, jev_call, task="convert PDF invoices to Excel", **kw):
        with mock.patch.object(skillengine, "atlas_candidates", return_value=[dict(c) for c in ATLAS]), \
             mock.patch.object(skillengine, "builtin_candidates", return_value=[]), \
             mock.patch.object(skillengine, "_read_selected", return_value={"content": "PLAYBOOK"}), \
             mock.patch.object(jev, "call", jev_call), \
             mock.patch.object(jev, "jev_url", return_value="http://fake"):
            return skillengine.select(task, edge=False, **kw)

    def test_jev_choice_wins_over_the_deterministic_order(self):
        out = self._select(fake_jev("slide-maker-3"))
        self.assertEqual(out["selected"]["name"], "slide-maker")
        self.assertEqual(out["decided_by"], "jev (stable)")
        self.assertEqual(out["selected"]["content"], "PLAYBOOK")
        self.assertTrue(out["jev"]["called"])
        self.assertEqual(out["also_consider"][0]["name"], "pdf-converter")

    def test_none_answer_selects_nothing(self):
        out = self._select(fake_jev("none"))
        self.assertIsNone(out["selected"])
        self.assertIn("no candidate fits", out["next"])

    def test_unstable_jev_falls_back_to_mean_ranking_and_says_so(self):
        out = self._select(fake_jev("pdf-converter-2", flip_on_reorder=True))
        self.assertEqual(out["decided_by"], "jev (unstable: mean ranking)")
        self.assertFalse(out["jev"]["stable"])

    def test_jev_unreachable_falls_back_to_deterministic_ranking(self):
        def down(packet, **kw):
            raise ToolError("Jev unreachable: offline")
        out = self._select(down)
        self.assertEqual(out["decided_by"], "deterministic ranking")
        self.assertEqual(out["selected"]["name"], "pdf-converter")
        self.assertIn("fallback", out["jev"])

    def test_jev_false_skips_the_service(self):
        with mock.patch.object(jev, "call") as c:
            out = self._select(c, use_jev=False)
        c.assert_not_called()
        self.assertEqual(out["decided_by"], "deterministic ranking")

    def test_edge_glossary_matches_the_engine(self):
        shipped = json.loads((HERE.parent.parent / "edge" / "atlas-api" / "glossary.json").read_text(encoding="utf-8"))
        self.assertEqual(shipped, skillengine.export_glossary(),
                         "regenerate edge/atlas-api/glossary.json from skillengine.export_glossary()")

    def test_edge_translation_is_merged_with_glossary_terms(self):
        with mock.patch.object(skillengine, "_translate_edge", return_value="I designed a drop-down page"):
            u = skillengine.understand("صمم لي صفحة هبوط", edge=True)
        self.assertEqual(u["method"], "edge-translate+glossary")
        self.assertIn("landing", u["query"])
        self.assertIn("drop-down", u["query"])

    def test_animation_request_reaches_the_video_family(self):
        fams = [f["id"] for f in tools_core.route("انشاء انميشن تعليمي مدته 10 ثواني")["families"]]
        self.assertIn("cinema", fams)
        self.assertIn("animation", skillengine.understand("انشاء انميشن تعليمي", edge=False)["query"])

    def test_facets_get_their_own_share_of_candidates(self):
        def search(q, license="permissive", limit=8):
            pool = {"animation video": ["hyperframes", "remotion"], "educational": ["teaching-block", "lms"]}.get(
                q, ["deep-learning-book", "ml-notes", "teaching-block"])
            return {"results": [{"skill_id": hash(n) % 10**6, "skill": n, "plugin": "p", "description": "",
                                 "license": "MIT", "risk_flags": []} for n in pool]}
        with mock.patch.object(skillengine.atlas, "search", search):
            got = [c["name"] for c in skillengine.atlas_candidates(
                "create a learning animation", limit=4, facets=["animation video", "educational"])]
        self.assertEqual(got[:2], ["hyperframes", "teaching-block"])  # one per concept before any generic hit
        self.assertIn("deep-learning-book", got)

    def test_empty_task_is_an_error(self):
        with self.assertRaises(ToolError):
            skillengine.select("   ")

    def test_builtin_skill_is_found_for_its_own_domain(self):
        out = skillengine.select("قيد محاسبي لفاتورة مشتريات مع ضريبة القيمة المضافة", use_jev=False, read=False, edge=False)
        names = [c["name"] for c in out["candidates"] if c["source"] == "builtin"]
        self.assertIn("kosif-audit-ifrs", names)


if __name__ == "__main__":
    unittest.main()
