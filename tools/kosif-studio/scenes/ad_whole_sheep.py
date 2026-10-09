TITLE = "ذبيحة حري كاملة"
ROLLOFF = 1.0


def P(x, y):
    return (200 + x * 8 / 9, y * 8 / 9)


def S(v):
    return v * 8 / 9


def M(shape):
    return [[P(x, y) for x, y in q] for q in shape]


def rrect(x0, y0, x1, y1, r):
    r = min(r, (x1 - x0) / 2, (y1 - y0) / 2)
    return path(f"M{x0 + r} {y0} H{x1 - r} A{r} {r} 0 0 1 {x1} {y0 + r} V{y1 - r} A{r} {r} 0 0 1 {x1 - r} {y1} "
                f"H{x0 + r} A{r} {r} 0 0 1 {x0} {y1 - r} V{y0 + r} A{r} {r} 0 0 1 {x0 + r} {y0} Z")


def lines(pts_list, width, colour, alpha=1.0):
    return fill(M(stroke(pts_list, width)), colour, alpha)


def badge(cx, cy, s, small_text=True):
    w, h = 176 * s, 206 * s
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    R = .44 * w
    ops = [fill(M(rrect(x0, y0, x1, y1, R)), "#a8c13a"),
           fill(M(rrect(x0 + 4 * s, y0 + 4 * s, x1 - 4 * s, y1 - 4 * s, R - 4 * s)), "#ffffff"),
           fill(M(rrect(x0 + 8 * s, y0 + 8 * s, x1 - 8 * s, y1 - 8 * s, R - 8 * s)), "#e3161d"),
           fill(M(rrect(x0 + 20 * s, y0 + 20 * s, x1 - 20 * s, y1 - 20 * s, R - 20 * s)), "#ffffff")]
    field = rrect(x0 + 26 * s, y1 - 54 * s, x1 - 26 * s, y1 - 24 * s, 14 * s)
    ops.append(fill(M(field), lin(P(cx - 60 * s, 0), P(cx + 60 * s, 0), [(0, "#c8d84a"), (.5, "#8fae32"), (1, "#5f8a2a")])))
    ops.append(lines([[(cx - 50 * s + 16 * k * s, y1 - 26 * s), (cx - 40 * s + 16 * k * s, y1 - 52 * s)] for k in range(7)],
                     2 * s, "#4f7a22", .6))
    banner = rrect(x0 + 16 * s, y0 + h * .64, x1 - 16 * s, y0 + h * .78, 9 * s)
    ops.append(fill(M(banner), "#e3161d"))
    ops.append(text("أغنام الوادي", *P(cx, y0 + h * .71), S(19 * s), "#ffffff", anchor="mm", bold=True))
    k = s
    horns = [[(cx - 16 * k, cy - 50 * k), (cx - 38 * k, cy - 55 * k), (cx - 54 * k, cy - 60 * k), (cx - 52 * k, cy - 72 * k)],
             [(cx + 16 * k, cy - 50 * k), (cx + 38 * k, cy - 55 * k), (cx + 54 * k, cy - 60 * k), (cx + 52 * k, cy - 72 * k)]]
    face = [[(cx - 24 * k, cy - 50 * k), (cx - 30 * k, cy - 14 * k), (cx - 22 * k, cy + 18 * k), (cx - 17 * k, cy + 34 * k),
             (cx + 17 * k, cy + 34 * k), (cx + 22 * k, cy + 18 * k), (cx + 30 * k, cy - 14 * k), (cx + 24 * k, cy - 50 * k),
             (cx - 24 * k, cy - 50 * k)]]
    ears = [[(cx - 28 * k, cy - 38 * k), (cx - 50 * k, cy - 40 * k), (cx - 66 * k, cy - 30 * k), (cx - 44 * k, cy - 24 * k),
             (cx - 30 * k, cy - 28 * k)],
            [(cx + 28 * k, cy - 38 * k), (cx + 50 * k, cy - 40 * k), (cx + 66 * k, cy - 30 * k), (cx + 44 * k, cy - 24 * k),
             (cx + 30 * k, cy - 28 * k)]]
    muzzle = [[(cx - 12 * k, cy + 20 * k), (cx - 6 * k, cy + 28 * k), (cx + 6 * k, cy + 28 * k), (cx + 12 * k, cy + 20 * k)]]
    ops.append(lines(horns + face + ears + muzzle, 5.5 * s, "#111111"))
    ops.append(lines(horns + face + ears, 2 * s, "#9aa83a"))
    ops.append(lines([[(cx - 18 * k, cy - 40 * k), (cx, cy - 46 * k), (cx + 18 * k, cy - 40 * k)],
                      [(cx - 14 * k, cy - 32 * k), (cx, cy - 37 * k), (cx + 14 * k, cy - 32 * k)],
                      [(cx - 8 * k, cy - 4 * k), (cx, cy + 6 * k), (cx + 8 * k, cy - 4 * k)]], 1.8 * s, "#b9cc4a"))
    ops.append(fill(M(dots([(cx - 15 * k, cy - 18 * k, 3 * k), (cx + 15 * k, cy - 18 * k, 3 * k)])), "#111111"))
    if small_text:
        ops.append(text("Since", *P(cx - 56 * k, cy + 22 * k), S(8 * s), "#777777", anchor="mm"))
        ops.append(text("2017", *P(cx - 56 * k, cy + 33 * k), S(8 * s), "#777777", anchor="mm"))
        ops.append(text("منذ", *P(cx + 56 * k, cy + 22 * k), S(8 * s), "#777777", anchor="mm"))
        ops.append(text("1438", *P(cx + 56 * k, cy + 33 * k), S(8 * s), "#777777", anchor="mm"))
    return ops


def meat(seed, x0, y0, x1, y1, n):
    r = random.Random(seed)
    pieces, fat = [], []
    for _ in range(n):
        cx, cy = r.uniform(x0, x1), r.uniform(y0, y1)
        rx, ry = r.uniform(16, 30), r.uniform(10, 18)
        pts = []
        for j in range(7):
            a = 2 * math.pi * j / 7 + r.uniform(-.3, .3)
            pts.append((cx + rx * r.uniform(.75, 1.15) * math.cos(a), cy + ry * r.uniform(.75, 1.15) * math.sin(a)))
        pieces.append(pts)
        fat.append([(cx - rx * .5, cy + r.uniform(-4, 4)), (cx, cy + r.uniform(-6, 6)), (cx + rx * .4, cy + r.uniform(-4, 4))])
    return pieces, fat


def build():
    st = []

    # 1. the dark studio backdrop and the soft light behind the sheep
    st.append(Step("الخلفية الداكنة", [
        fill(rect(0, 0, 1200, 800), "#0c0a0a"),
        fill(ellipse(*P(430, 470), S(560), S(430)), rad(P(430, 470), S(560), [(0, "#2b2424"), (1, "#0c0a0a00")]))],
        "sweep", weight=1.0))

    # 2. the table, deep red, catching the light
    table = path("M -300 700 L 1300 700 L 1300 1000 L -300 1000 Z")
    st.append(Step("الطاولة", [
        fill(M(table), lin(P(0, 700), P(0, 900), [(0, "#2a1010"), (.5, "#3a1616"), (1, "#2a0e0e")])),
        fill(M(ellipse(420, 760, 360, 90)), rad(P(420, 760), S(360), [(0, "#5a2222"), (1, "#5a222200")]), .7)],
        "sweep", origin=P(450, 760), weight=.7))

    # 3. the headline: gold, white, the pill and the note
    st.append(Step("العنوان", [
        text("ذبيحة حري", *P(545, 96), S(78), lin(P(0, 60), P(0, 130), [(0, "#f6e3b6"), (1, "#c49c5c")]), anchor="mm", bold=True),
        text("كاملة", *P(545, 184), S(76), "#f5f2ec", anchor="mm", bold=False)],
        "grow", origin=P(545, 130), weight=.8))
    pill = rrect(365, 255, 730, 323, 34)
    st.append(Step("الوزن", [
        fill(M(pill), lin(P(0, 255), P(0, 323), [(0, "#ead6b0"), (1, "#cfb085")])),
        text("وزن من 14-15", *P(548, 290), S(46), "#24160e", anchor="mm", bold=True),
        text("( الوزن شامل الأحشاء والرأس )", *P(545, 362), S(22), "#f2efe9", anchor="mm")],
        "grow", origin=P(548, 290), weight=.6))

    # 4. the logo
    st.append(Step("الشعار", badge(133, 122, 1.0), "grow", origin=P(133, 122), weight=.8))

    # 5. the knife block and the cleaver
    block = poly([(620, 580), (712, 574), (716, 772), (622, 774)])
    blade = poly([(656, 468), (718, 478), (716, 592), (648, 588)])
    st.append(Step("سكين الجزّار وحاملها", [
        fill(M(blade), lin(P(650, 470), P(720, 590), [(0, "#6a6a6a"), (.5, "#3a3a3c"), (1, "#202022")])),
        lines([[(658, 474), (650, 586)]], 2, "#9a9a9a", .7),
        fill(M(tube([(686, 474), (690, 440), (694, 404)], [9, 9, 8])), lin(P(680, 400), P(700, 470), [(0, "#7a4a2a"), (1, "#4a2a16")])),
        fill(M(block), lin(P(620, 580), P(716, 580), [(0, "#7c4a24"), (.5, "#9a5e30"), (1, "#5a3418")])),
        fill(M(poly([(620, 580), (712, 574), (704, 566), (626, 570)])), "#b47a46"),
        lines([[(640, 600), (642, 760)], [(668, 596), (670, 764)], [(694, 592), (696, 760)]], 1.2, "#4a2a14", .5)],
        "rise", origin=P(668, 770), weight=.6))

    # 6. the sheep: ear, body and neck, head, legs, then wool shading and the rim of light on its back
    body = path("M 220 392 C 252 402 282 430 302 448 C 342 440 402 440 452 446 C 502 450 542 460 558 482 "
                "C 572 502 570 542 562 572 C 568 592 572 620 566 642 L 548 642 C 548 622 540 606 530 600 "
                "C 500 612 460 618 430 616 C 380 614 330 606 290 598 C 268 594 250 590 236 584 "
                "C 214 560 196 520 186 482 C 178 462 172 452 166 452 C 190 452 214 440 226 424 Z")
    head = path("M 238 398 C 232 370 206 354 180 358 C 158 362 134 376 114 392 C 104 400 96 408 92 418 "
                "C 96 426 106 428 116 425 C 113 434 114 444 122 450 C 134 456 152 458 172 457 "
                "C 198 456 224 444 236 426 Z")
    ear = path("M 198 392 C 188 410 178 440 172 470 C 170 484 178 490 185 481 C 196 458 206 430 210 402 Z")
    ear_in = path("M 199 404 C 192 422 185 446 181 466 C 181 474 185 476 188 470 C 195 450 201 428 204 410 Z")
    legs_near = union(tube([(250, 584), (246, 650), (241, 720), (237, 768)], [17, 11, 8, 7]),
                      tube([(522, 600), (532, 640), (540, 690)], [22, 14, 10]))
    legs_far = tube([(280, 590), (272, 650), (264, 712), (259, 762)], [15, 10, 7, 6])
    tail = tube([(560, 522), (571, 560), (573, 610), (567, 642)], [10, 12, 12, 8])
    sheep = union(body, head, legs_near, tail)
    st.append(Step("الخروف", [
        fill(M(legs_far), lin(P(0, 590), P(0, 770), [(0, "#d9d5cf"), (1, "#b8b2aa")])),
        fill(M(ellipse(259, 765, 8, 5)), "#3a3634"),
        fill(M(sheep), lin(P(0, 380), P(0, 650), [(0, "#fbfaf6"), (.55, "#efece6"), (1, "#c9c3bb")])),
        fill(M(body), rad(P(380, 640), S(220), [(0, "#a8a199"), (1, "#a8a19900")]), .55),
        fill(M(ellipse(237, 772, 9, 5)), "#3a3634"),
        fill(M(ear), lin(P(170, 400), P(200, 480), [(0, "#f6f2ee"), (1, "#d9d0c8")])),
        fill(M(ear_in), lin(P(180, 410), P(200, 470), [(0, "#f0c6c2"), (1, "#d9a39e")]), .85),
        fill(M(path("M 116 427 C 118 436 122 444 128 447 C 124 438 122 432 116 427 Z")), "#c96a74"),
        fill(M(ellipse(124, 442, 7, 4, rot=-25)), "#e08a94"),
        fill(M(ellipse(154, 388, 5, 3.4, rot=-14)), "#1a1414"),
        fill(M(ellipse(155.5, 387, 1.2, 1.2)), "#ffffff"),
        fill(M(ellipse(102, 412, 2.6, 1.6, rot=-20)), "#5a4a48"),
        fill(M(head), rad(P(120, 430), S(70), [(0, "#e9e3dc"), (1, "#e9e3dc00")]), .5),
        lines([[(300, 450), (380, 442), (460, 448), (540, 468)]], 3, "#ffffff", .8),
        rim(M(sheep), (0, -1), 2.2, "#ffffff", .5)],
        "rise", origin=P(330, 770), weight=1.4))

    # 7. the box with the logo, the phone numbers and the red band
    top = poly([(298, 630), (588, 646), (612, 690), (262, 668)])
    front = poly([(262, 668), (530, 690), (528, 872), (265, 852)])
    side = poly([(530, 690), (612, 690), (610, 812), (528, 872)])
    band = poly([(265, 830), (528, 848), (528, 872), (265, 852)])
    st.append(Step("صندوق أغنام الوادي", [
        fill(M(front), lin(P(262, 668), P(530, 872), [(0, "#f4f2ef"), (1, "#d9d5cf")])),
        fill(M(side), lin(P(530, 690), P(612, 812), [(0, "#cfcac3"), (1, "#a8a29a")])),
        fill(M(top), lin(P(298, 630), P(612, 690), [(0, "#ebe8e3"), (1, "#dcd8d2")])),
        lines([[(330, 650), (360, 646), (392, 652), (430, 648), (470, 655), (520, 652)],
               [(318, 664), (350, 660), (390, 667), (440, 662), (500, 670), (560, 668)]], 3.2, "#c8202a", .85),
        fill(M(band), "#c91a1f"),
        *badge(395, 728, .36, small_text=False),
        text("0551558841", *P(395, 790), S(22), "#c91a1f", anchor="mm", bold=True),
        text("0551558847", *P(395, 816), S(22), "#c91a1f", anchor="mm", bold=True),
        fill(M(dots([(318, 772, 4.5), (318, 800, 4.5)])), "#c91a1f")],
        "grow", origin=P(400, 760), weight=1.0))

    # 8. garlic, spice and rosemary
    st.append(Step("الثوم والبهارات وإكليل الجبل", [
        fill(M(ellipse(684, 800, 24, 9)), lin(P(660, 792), P(708, 808), [(0, "#d88a2a"), (1, "#8a4a14")])),
        fill(M(ellipse(728, 794, 26, 24)), rad(P(720, 786), S(30), [(0, "#ffffff"), (1, "#d6d0c6")])),
        lines([[(718, 774), (720, 812)], [(730, 772), (732, 814)], [(740, 776), (741, 810)]], 1.2, "#bdb6aa", .8),
        fill(M(tube([(728, 770), (730, 754)], [4, 2])), "#cfc8b8"),
        lines([[(30, 842), (90, 832), (150, 826)], [(700, 858), (760, 848), (820, 846)]], 2, "#4a5a2a"),
        fill(M(dots([(36 + 10 * i, 840 - i * 1.2 + (4 if i % 2 else -4), 2.6) for i in range(12)] +
                    [(706 + 10 * i, 856 - i + (4 if i % 2 else -4), 2.6) for i in range(11)])), "#5f7a34")],
        "sparkle", weight=.5))

    # 9. the trays of fresh meat
    ops = []
    for seed, (x0, y0, x1, y1) in enumerate([(95, 818, 345, 905), (325, 846, 565, 905), (535, 822, 790, 905)]):
        ops.append(fill(M(rrect(x0, y0, x1, y1 + 20, 18)), lin(P(0, y0), P(0, y1), [(0, "#2a2a2c"), (1, "#0e0e10")])))
        pieces, fat = meat(seed + 3, x0 + 26, y0 + 18, x1 - 26, y1 - 6, 20)
        ops.append(fill(M(rrect(x0 + 14, y0 + 10, x1 - 14, y1 + 10, 12)), "#4a1418"))
        ops.append(fill(M(translate(pieces, 2, 3)), "#2a0a0e", .8, blur=1.5))
        ops.append(fill(M(pieces), lin(P(0, y0), P(0, y1), [(0, "#d24a52"), (.5, "#b3313b"), (1, "#7e1e26")])))
        ops.append(lines(fat, 2.2, "#f2d6cc", .8))
        ops.append(rim(M(pieces), (0, -1), 1.4, "#ff8a8a", .45))
    st.append(Step("أطباق اللحم الطازج", ops, "sweep", weight=1.0))

    # 10. finish
    st.append(Step("اللمسات الأخيرة", [vignette(.45), grain(.012, 4)], "sweep", weight=.5))
    return st
