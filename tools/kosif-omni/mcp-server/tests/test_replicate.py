"""KOSIF Replicate — the planning, checking and proof logic (never touches the screen)."""
from __future__ import annotations

import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

SERVER = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SERVER))
os.environ.setdefault("KOSIF_STATE_DIR", tempfile.mkdtemp(prefix="kosif_replicate_test_"))
os.environ["KOSIF_CURSOR"] = "0"
os.environ["KOSIF_LIVE"] = "0"
os.environ["KOSIF_PEN"] = "0"

from kosif_mcp import desktop_native as nat, protocol, replicate as R  # noqa: E402
from kosif_mcp.registry import REGISTRY, ToolError  # noqa: E402

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    Image = None


def _png(pixels, path):
    h, w = len(pixels), len(pixels[0])
    im = Image.new("RGBA", (w, h))
    for y, row in enumerate(pixels):
        for x, p in enumerate(row):
            im.putpixel((x, y), p)
    im.save(path)
    return path


@unittest.skipUnless(Image, "Pillow")
class Planning(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        R_, G_, W_, T_ = (255, 0, 0, 255), (0, 128, 0, 255), (255, 255, 255, 255), (10, 20, 30, 0)
        self.src = _png([[T_, R_, R_, R_],
                         [G_, W_, R_, G_],
                         [W_, (0, 0, 0, 128), G_, G_]], self.dir / "src.png")

    def test_transparent_pixels_become_the_white_canvas(self):
        w, h, rgb, alpha = R.load_target(str(self.src))
        self.assertEqual((w, h), (4, 3))
        self.assertEqual(rgb[0][0], (255, 255, 255))
        self.assertEqual(alpha[0][0], 0)
        self.assertEqual(rgb[2][1], (127, 127, 127))  # 50 % black over white

    def test_plan_skips_white_and_goes_top_down(self):
        _w, _h, rgb, _a = R.load_target(str(self.src))
        groups = R.plan(rgb)
        self.assertEqual(list(groups)[0], "FF0000")          # first colour met from the top
        self.assertEqual(groups["FF0000"], [(1, 0), (2, 0), (3, 0), (2, 1)])
        self.assertNotIn("FFFFFF", groups)                   # the canvas is already white
        repair = R.plan(rgb, todo={(1, 1), (0, 1)})         # a repair pass may need white too
        self.assertEqual(repair, {"008000": [(0, 1)], "FFFFFF": [(1, 1)]})

    def test_runs_are_horizontal_and_split_by_gaps(self):
        self.assertEqual(R.runs([(3, 0), (1, 0), (2, 0), (5, 0), (2, 1)]), [(0, 1, 3), (0, 5, 5), (1, 2, 2)])

    def test_saved_copy_is_compared_pixel_by_pixel(self):
        _w, _h, rgb, _a = R.load_target(str(self.src))
        exact = _png([[(r, g, b, 255) for r, g, b in row] for row in rgb], self.dir / "copy.png")
        c = R.compare_files(str(self.src), str(exact))
        self.assertEqual((c["rgb_percent"], c["max_channel_error"]), (100.0, 0))
        self.assertLess(c["alpha_percent"], 100.0)  # Paint's opaque canvas cannot hold the transparent corner
        off = [[(r, g, b, 255) for r, g, b in row] for row in rgb]
        off[1][3] = (0, 129, 0, 255)  # one channel, one step: still a difference
        c = R.compare_files(str(self.src), str(_png(off, self.dir / "off.png")))
        self.assertEqual((c["rgb_exact"], c["max_channel_error"]), (11, 1))
        small = _png([[(0, 0, 0, 255)]], self.dir / "small.png")
        self.assertFalse(R.compare_files(str(self.src), str(small))["same_size"])

    def test_huge_images_are_refused(self):
        big = self.dir / "big.png"
        Image.new("RGB", (600, 400), "white").save(big)
        with self.assertRaises(ToolError):
            R.load_target(str(big))


class ColourCycle(unittest.TestCase):
    """The colour dialog covers the canvas: nothing may be drawn until Paint shows the exact colour."""

    def paint(self):
        p = R.Paint(1, 2, 2)
        p.geo = {"rect": {"x": 0, "y": 0, "w": 10, "h": 10}, "edit_colors": (5, 5), "hex": (6, 6),
                 "color1": (7, 7), "probe": (8, 8), "canvas": {"x": 100, "y": 100, "w": 8, "h": 8}}
        p.ensure_front = lambda *a, **k: None
        p.front_ok = lambda: True
        # one capture → (dialog open?, swatch), read through the patched screen_px
        p.look = lambda: (R._sat(R.Paint.screen_px(8, 8)) > 90, R.hexof(R.Paint.screen_px(7, 7)))
        return p

    def test_colour_is_confirmed_on_the_swatch_before_returning(self):
        p = self.paint()
        state = {"dialog": False, "swatch": (0, 0, 0)}
        taps, typed = [], []

        def px(x, y):
            return (255, 0, 0) if (x, y) == (8, 8) and state["dialog"] else \
                state["swatch"] if (x, y) == (7, 7) else (240, 240, 240)

        def tap(x, y, **k):
            taps.append((x, y))
            if (x, y) == (5, 5):
                state["dialog"] = True

        def key(k, **kw):
            if k == "enter":
                state["dialog"], state["swatch"] = False, (0x12, 0x34, 0x56)
        with mock.patch.object(R.Paint, "screen_px", staticmethod(px)), \
                mock.patch.object(nat.PEN, "tap", side_effect=tap), \
                mock.patch.object(nat, "hotkey", side_effect=key), \
                mock.patch.object(nat, "type_text", side_effect=typed.append), \
                mock.patch.object(R.time, "sleep"):
            p.set_color("123456")
        self.assertEqual(typed, ["123456"])               # no '#': Paint ignored '#F5040D'
        self.assertEqual(taps, [(5, 5), (6, 6)])          # Edit colors, then the hex field — never the canvas

    def test_a_colour_paint_never_shows_is_an_error_not_a_guess(self):
        p = self.paint()
        with mock.patch.object(R.Paint, "screen_px", staticmethod(lambda x, y: (1, 1, 1))), \
                mock.patch.object(nat.PEN, "tap"), mock.patch.object(nat, "hotkey"), \
                mock.patch.object(nat, "type_text"), mock.patch.object(R.time, "sleep"), \
                mock.patch.object(R.Paint, "_wait", staticmethod(lambda pred, t, step=0.015: pred())):
            with self.assertRaises(ToolError):
                p.set_color("ABCDEF", tries=2)

    def test_lost_typing_is_retried_never_called_unrepresentable(self):
        """Run 6: the hex taps were lost and the swatch never moved; the old rule called 55564C 'unrepresentable'."""
        p = self.paint()
        state = {"dialog": False}

        def tap(x, y, **k):
            if (x, y) == (5, 5):
                state["dialog"] = True

        def key(k, **kw):
            if k == "enter":
                state["dialog"] = False  # OK pressed, colour unchanged: the typing went nowhere
        p.look = lambda: (state["dialog"], "919C5B")
        with mock.patch.object(nat.PEN, "tap", side_effect=tap), mock.patch.object(nat, "hotkey", side_effect=key), \
                mock.patch.object(nat, "type_text"), mock.patch.object(R.time, "sleep"), \
                mock.patch.object(R.Paint, "swatch", lambda self: "919C5B"), \
                mock.patch.object(R.Paint, "_wait", staticmethod(lambda pred, t, step=0.015: pred())):
            with self.assertRaises(ToolError) as cm:
                p.set_color("55564C", tries=3)
        self.assertNotIsInstance(cm.exception, R.Unrepresentable)

    def test_cells_map_to_block_centres(self):
        p = self.paint()
        p.zoom = 4
        self.assertEqual(p.cell(0, 0), (102, 102))
        self.assertEqual(p.cell(3, 2), (114, 110))


class HardColours(unittest.TestCase):
    """Paint's colour dialog turned #F40001 into #F40004 (hue kept below 359°)."""

    def test_prediction_matches_what_paint_did(self):
        self.assertFalse(R.dialog_holds((244, 0, 1)))   # measured: became F40004
        self.assertFalse(R.dialog_holds((245, 0, 3)))
        for ok in [(244, 0, 4), (245, 4, 13), (0, 255, 3), (250, 5, 2), (191, 171, 64), (255, 255, 255), (0, 0, 0)]:
            self.assertTrue(R.dialog_holds(ok), ok)       # measured exact (or grey)

    def test_every_recipe_lands_exactly_on_the_target(self):
        for t in [(244, 0, 1), (245, 0, 3), (252, 186, 187), (10, 20, 30), (255, 0, 1), (1, 2, 3)]:
            options = R.recipes(t)
            self.assertTrue(options, t)
            for d, s in options:
                self.assertTrue(all(0 <= v <= 255 for v in s))
                self.assertEqual(tuple(round(dd + (ss - dd) * R.OVERLAY_OPACITY / 100) for dd, ss in zip(d, s)), t)
        self.assertEqual(R.recipes((244, 0, 1))[0], ((244, 0, 0), (244, 0, 5)))  # the one measured exact
        # Paint's substitute F40004 would need an overlay of B = 4 + 5·(1 − 4) = −11: never offered
        self.assertNotIn((244, 0, 4), [d for d, _ in R.recipes((244, 0, 1), "F40004")])

    def test_consistent_substitution_is_reported_not_retried_forever(self):
        p = ColourCycle.paint(self)
        state = {"dialog": False, "swatch": (1, 2, 3)}

        def px(x, y):
            return (255, 0, 0) if (x, y) == (8, 8) and state["dialog"] else \
                state["swatch"] if (x, y) == (7, 7) else (240, 240, 240)

        def tap(x, y, **k):
            if (x, y) == (5, 5):
                state["dialog"] = True

        def key(k, **kw):
            if k == "enter":
                state["dialog"], state["swatch"] = False, (0xF4, 0, 4)  # what Paint does with F40001
        with mock.patch.object(R.Paint, "screen_px", staticmethod(px)), \
                mock.patch.object(nat.PEN, "tap", side_effect=tap), mock.patch.object(nat, "hotkey", side_effect=key), \
                mock.patch.object(nat, "type_text"), mock.patch.object(R.time, "sleep"), \
                mock.patch.object(R.Paint, "_wait", staticmethod(lambda pred, t, step=0.015: pred())):
            with self.assertRaises(R.Unrepresentable) as cm:
                p.set_color("F40001", tries=4)
        self.assertEqual((cm.exception.want, cm.exception.got), ("F40001", "F40004"))


@unittest.skipUnless(Image, "Pillow")
class FastModeAndProof(unittest.TestCase):
    def test_fewer_colours_keep_white_canvas_and_transparent_pixels_white(self):
        rgb = [[(255, 255, 255), (200, 10, 10), (201, 11, 12)], [(10, 200, 10), (11, 199, 9), (255, 255, 255)]]
        alpha = [[0, 255, 255], [255, 255, 255]]
        q, used = R.quantize(rgb, alpha, 2)
        self.assertEqual(q[0][0], (255, 255, 255))
        self.assertEqual(q[1][2], (255, 255, 255))
        self.assertLessEqual(used, 3)  # 2 colours + the white canvas
        self.assertEqual(q[0][1], q[0][2])  # two near-identical reds became one dialog trip

    def test_delta_e_is_zero_for_equal_and_large_for_opposites(self):
        self.assertEqual(R.delta_e((12, 34, 56), (12, 34, 56)), 0)
        self.assertLess(R.delta_e((244, 0, 1), (244, 0, 4)), 2.3)  # Paint's substitute: below what eyes notice
        self.assertGreater(R.delta_e((255, 255, 255), (0, 0, 0)), 90)

    def test_image_comparison_counts_rgb_and_alpha_separately(self):
        rgb = [[(255, 255, 255), (1, 2, 3)]]
        alpha = [[0, 255]]
        im = Image.new("RGBA", (2, 1))
        im.putpixel((0, 0), (255, 255, 255, 255))  # opaque white where the original is transparent
        im.putpixel((1, 0), (1, 2, 3, 255))
        c = R._compare_image(rgb, alpha, im)
        self.assertEqual((c["rgb_exact"], c["alpha_exact"]), (2, 1))


class Registration(unittest.TestCase):
    def test_tool_is_registered_and_local_only(self):
        t = REGISTRY["kosif_paint_copy"]
        self.assertFalse(t.read_only)
        from kosif_mcp.paths import _MODE
        old = _MODE.get("transport")
        _MODE["transport"] = "http"
        try:
            val, err = protocol.call_tool("kosif_paint_copy", {"image": "x.png", "window": "Paint"})
            self.assertTrue(err)
            self.assertIn("HTTP", str(val))
        finally:
            _MODE["transport"] = old


if __name__ == "__main__":
    unittest.main()
