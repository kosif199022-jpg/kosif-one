"""Duck vs dragon — hand-built SVG illustration (1600x900, 16:9) from the validated SceneSpec."""
import random, math, sys
from pathlib import Path

random.seed(7)
W, H = 1600, 900
out = []
a = out.append

a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
a('<title>Duck vs dragon</title>')
a('''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#070d18"/><stop offset=".4" stop-color="#16233b"/>
  <stop offset=".68" stop-color="#3b2238"/><stop offset=".86" stop-color="#7c2d12"/><stop offset="1" stop-color="#c2410c"/>
</linearGradient>
<radialGradient id="impactGlow" cx="420" cy="740" r="560" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#fdba74" stop-opacity=".75"/><stop offset=".35" stop-color="#f97316" stop-opacity=".35"/>
  <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
</radialGradient>
<radialGradient id="lavaGlow" cx="800" cy="930" r="700" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="#fb923c" stop-opacity=".7"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/>
</radialGradient>
<linearGradient id="lava" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#fde047"/><stop offset=".4" stop-color="#f97316"/><stop offset="1" stop-color="#991b1b"/>
</linearGradient>
<linearGradient id="dragonSkin" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#22c55e"/><stop offset=".45" stop-color="#15803d"/><stop offset="1" stop-color="#052e16"/>
</linearGradient>
<linearGradient id="dragonHead" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#16a34a"/><stop offset=".6" stop-color="#166534"/><stop offset="1" stop-color="#ea580c"/>
</linearGradient>
<linearGradient id="belly" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#65a30d"/>
</linearGradient>
<linearGradient id="wing" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#14532d"/><stop offset="1" stop-color="#052e16"/>
</linearGradient>
<linearGradient id="duckBody" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef2f7"/><stop offset="1" stop-color="#fdba74"/>
</linearGradient>
<linearGradient id="duckWing" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e2e8f0"/><stop offset="1" stop-color="#fcd34d"/>
</linearGradient>
<linearGradient id="helmet" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fcd34d"/><stop offset=".4" stop-color="#b45309"/><stop offset="1" stop-color="#78350f"/>
</linearGradient>
<linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#78716c"/><stop offset=".25" stop-color="#57534e"/><stop offset="1" stop-color="#1c1917"/>
</linearGradient>
<radialGradient id="eye" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#fef08a"/><stop offset=".6" stop-color="#f59e0b"/><stop offset="1" stop-color="#b45309"/>
</radialGradient>
<radialGradient id="vignette" cx="800" cy="450" r="950" gradientUnits="userSpaceOnUse">
  <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/>
</radialGradient>
<pattern id="scales" width="22" height="16" patternUnits="userSpaceOnUse">
  <path d="M0 16 Q11 2 22 16" fill="none" stroke="#052e16" stroke-width="1.6" opacity=".55"/>
  <path d="M-11 8 Q0 -6 11 8 M11 8 Q22 -6 33 8" fill="none" stroke="#4ade80" stroke-width="1" opacity=".25"/>
</pattern>
<filter id="blur8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>''')

# ---- sky, storm, lightning -------------------------------------------------
a(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
for cx, cy, rx, ry, col in [(200, 60, 320, 90, "#0f1726"), (700, 40, 380, 80, "#111a2c"), (1250, 70, 420, 110, "#0e1524"),
                            (450, 150, 300, 60, "#1b2540"), (950, 160, 340, 70, "#1a2238"), (120, 210, 220, 50, "#202a45"),
                            (780, 230, 260, 45, "#2a2a48"), (300, 290, 260, 40, "#33284a")]:
    a(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{col}" opacity=".95"/>')
    a(f'<ellipse cx="{cx}" cy="{cy + ry * .55}" rx="{rx * .85}" ry="{ry * .35}" fill="#3b4a6b" opacity=".18"/>')
bolt = "330,0 300,70 330,76 275,170 318,176 250,300 340,160 300,154 352,72 322,66 360,0"
a(f'<polygon points="{bolt}" fill="#bae6fd" filter="url(#blur8)" opacity=".9"/>')
a(f'<polygon points="{bolt}" fill="#f0f9ff"/>')
a('<path d="M 300 70 L 250 110 L 230 160" fill="none" stroke="#e0f2fe" stroke-width="2.5" opacity=".8"/>')

# ---- mountains & canyon ----------------------------------------------------
a('<polygon points="0,640 110,520 210,590 330,450 450,575 560,520 690,640 690,780 0,780" fill="#1a1622"/>')
a('<polygon points="560,640 700,560 820,610 960,500 1100,600 1240,480 1380,580 1600,470 1600,780 560,780" fill="#1d1724"/>')
a('<polygon points="0,780 0,600 80,640 160,610 260,680 380,650 470,700 520,780" fill="#120f16"/>')
a(f'<rect width="{W}" height="{H}" fill="url(#lavaGlow)"/>')
a('<path d="M0 860 Q200 835 400 858 T800 852 T1200 860 T1600 850 L1600 900 L0 900 Z" fill="url(#lava)"/>')
a('<path d="M0 860 Q200 835 400 858 T800 852 T1200 860 T1600 850" fill="none" stroke="#fef08a" stroke-width="3" opacity=".8" filter="url(#blur3)"/>')

# ---- dragon wings (behind everything dragon) --------------------------------
a('<path d="M1500 470 L1565 150 L1600 95 L1600 430 Q1555 440 1500 470 Z" fill="url(#wing)"/>')
a('<path d="M1500 470 L1565 150 L1600 95" fill="none" stroke="#0a2e17" stroke-width="12" stroke-linecap="round"/>')
a('<path d="M1360 125 L1140 30 Q1265 135 1235 235 Q1320 245 1330 335 Q1395 395 1440 500 Z" fill="url(#wing)" stroke="#0a2e17" stroke-width="3"/>')
for x2, y2 in [(1140, 30), (1235, 235), (1330, 335)]:
    a(f'<path d="M1360 125 L{x2} {y2}" stroke="#0a2e17" stroke-width="7" stroke-linecap="round"/>')
a('<path d="M1440 500 L1360 125" stroke="#0a2e17" stroke-width="16" stroke-linecap="round"/>')
a('<path d="M1360 125 l-8 -30 l18 22 Z" fill="#1c1917"/>')
for vx, vy in [(1250, 120), (1290, 230), (1370, 330)]:
    a(f'<path d="M1360 125 Q{vx - 20} {vy + 10} {vx} {vy + 60}" fill="none" stroke="#166534" stroke-width="1.5" opacity=".6"/>')

# ---- dragon body, neck, belly, spines --------------------------------------
a('<path d="M1250 250 C1325 280 1385 385 1445 480 C1500 555 1600 560 1600 560 L1600 900 L1330 900 C1330 760 1290 560 1190 410 Z" fill="url(#dragonSkin)"/>')
a('<path d="M1250 250 C1325 280 1385 385 1445 480 C1500 555 1600 560 1600 560 L1600 900 L1330 900 C1330 760 1290 560 1190 410 Z" fill="url(#scales)"/>')
a('<path d="M1190 410 C1290 560 1330 760 1330 900 L1395 900 C1395 760 1350 555 1228 392 Z" fill="url(#belly)"/>')
for i in range(1, 14):
    t = i / 14
    x1 = 1190 + (1330 - 1190) * t + 20 * math.sin(t * 3)
    y1 = 410 + (900 - 410) * t
    a(f'<path d="M{x1:.0f} {y1:.0f} q{32:.0f} {-10:.0f} {62:.0f} {-6:.0f}" fill="none" stroke="#3f6212" stroke-width="2.2" opacity=".75"/>')
for i in range(9):
    t = i / 9
    bx = 1250 + (1445 - 1250) * t + 25 * math.sin(t * math.pi)
    by = 250 + (480 - 250) * t
    a(f'<path d="M{bx - 14:.0f} {by + 4:.0f} L{bx + 22:.0f} {by - 34 + 6 * i % 9:.0f} L{bx + 18:.0f} {by + 14:.0f} Z" fill="#1c1917"/>')
# ---- bridge -----------------------------------------------------------------
a('<path d="M0 760 L520 760 L548 748 L566 772 L590 756 L612 780 L612 805 L0 805 Z" fill="url(#stone)"/>')
a('<path d="M690 784 L712 758 L736 770 L752 752 L1600 752 L1600 800 L690 800 Z" fill="url(#stone)"/>')
a('<path d="M0 760 L520 760 M752 752 L1600 752" stroke="#fb923c" stroke-width="2.5" opacity=".75"/>')
for x0, x1, y0 in [(0, 612, 760), (690, 1600, 752)]:
    for x in range(x0 + 40, x1 - 10, 74):
        a(f'<path d="M{x} {y0 + 2} L{x} {y0 + 42}" stroke="#292524" stroke-width="2" opacity=".7"/>')
    a(f'<path d="M{x0} {y0 + 22} L{x1} {y0 + 22}" stroke="#292524" stroke-width="1.5" opacity=".55"/>')
for px in (60, 380, 900, 1220):
    a(f'<path d="M{px} 805 L{px} 900 L{px + 70} 900 L{px + 70} 805 Z" fill="#292524"/>')
    a(f'<path d="M{px + 70} 805 Q{px + 160} 870 {px + 250} 805" fill="none" stroke="#292524" stroke-width="16"/>')
# broken pillars and fallen column
for px, top, wdt in [(140, 600, 54), (1500, 560, 60)]:
    a(f'<path d="M{px} 760 L{px} {top + 12} L{px + 12} {top} L{px + 24} {top + 18} L{px + 38} {top - 6} L{px + wdt} {top + 20} L{px + wdt} 760 Z" fill="url(#stone)"/>')
    a(f'<path d="M{px + 4} {top + 14} L{px + 4} 758" stroke="#fb923c" stroke-width="2" opacity=".55"/>')
a('<g transform="translate(250 735) rotate(-8)"><rect x="0" y="0" width="150" height="34" rx="6" fill="#57534e"/>'
  '<rect x="0" y="0" width="150" height="8" rx="4" fill="#a8a29e" opacity=".5"/>'
  '<path d="M30 0 v34 M70 0 v34 M110 0 v34" stroke="#292524" stroke-width="2"/></g>')
# front leg + claw gouging the bridge
a('<path d="M1405 585 C1355 625 1315 675 1292 728 L1228 744 L1300 768 C1342 718 1392 688 1455 650 Z" fill="url(#dragonSkin)" stroke="#052e16" stroke-width="3"/>')
a('<path d="M1405 585 C1355 625 1315 675 1292 728 L1228 744 L1300 768 C1342 718 1392 688 1455 650 Z" fill="url(#scales)"/>')
for tx in (1236, 1262, 1290):
    a(f'<path d="M{tx} 748 q-26 4 -32 30 q12 -16 36 -18 Z" fill="#0c0a09" stroke="#57534e" stroke-width="1"/>')

# debris kicked up by the claw
for _ in range(14):
    dx, dy, s = random.uniform(1130, 1330), random.uniform(640, 745), random.uniform(5, 14)
    a(f'<polygon points="{dx:.0f},{dy:.0f} {dx + s:.0f},{dy + s * .3:.0f} {dx + s * .6:.0f},{dy + s:.0f} {dx - s * .3:.0f},{dy + s * .7:.0f}" fill="#57534e" stroke="#fb923c" stroke-width=".8"/>')

# ---- dragon head --------------------------------------------------------------
a('<path d="M1215 235 C1260 165 1330 135 1405 145 C1345 162 1292 200 1248 252 Z" fill="#1c1917" stroke="#57534e" stroke-width="2"/>')
a('<path d="M1178 232 C1198 168 1248 118 1312 98 C1262 134 1226 180 1206 242 Z" fill="#1c1917" stroke="#57534e" stroke-width="2"/>')
a('<path d="M1300 150 l-14 14 l6 8 M1255 140 l-10 16 l8 6" fill="none" stroke="#f97316" stroke-width="1.6" opacity=".9"/>')
a('<path d="M1262 245 C1232 212 1172 212 1120 248 C1080 266 1040 280 1000 296 C984 304 976 318 984 327 L1016 335 L1136 352 C1192 350 1242 330 1268 300 Z" fill="url(#dragonHead)"/>')
a('<path d="M1262 245 C1232 212 1172 212 1120 248 C1080 266 1040 280 1000 296 C984 304 976 318 984 327 L1016 335 L1136 352 C1192 350 1242 330 1268 300 Z" fill="url(#scales)" opacity=".7"/>')
a('<path d="M1016 335 L1136 352 L1140 360 L1030 394 C1008 384 1004 356 1016 335 Z" fill="#450a0a"/>')
a('<path d="M1020 345 L1120 356 L1040 382 Z" fill="#f97316" opacity=".85" filter="url(#blur3)"/>')
a('<path d="M1140 360 L1030 394 C1004 404 990 416 995 430 C1042 434 1102 426 1152 410 C1182 402 1204 395 1204 380 Z" fill="url(#dragonHead)"/>')
for i in range(7):
    x = 1022 + i * 16
    a(f'<path d="M{x} {336 + i * 2.3:.0f} l6 14 l6 -13 Z" fill="#fafaf9"/>')
for i in range(6):
    x = 1036 + i * 17
    a(f'<path d="M{x} {391 - i * 4.5:.0f} l6 -13 l6 12 Z" fill="#fafaf9"/>')
a('<path d="M1088 262 C1110 250 1140 252 1160 262" fill="none" stroke="#052e16" stroke-width="7" stroke-linecap="round"/>')
a('<ellipse cx="1124" cy="276" rx="22" ry="12" fill="#f59e0b" filter="url(#blur8)" opacity=".9"/>')
a('<ellipse cx="1124" cy="276" rx="16" ry="8.5" fill="url(#eye)"/>')
a('<ellipse cx="1124" cy="276" rx="2.6" ry="7.5" fill="#0c0a09"/>')
a('<ellipse cx="1001" cy="307" rx="6" ry="3.5" fill="#052e16"/>')
for i, (sx, sy) in enumerate([(995, 300), (985, 290)]):
    a(f'<path d="M{sx} {sy} c-20 -12 -10 -32 -34 -40 c-18 -6 -14 -26 -36 -34" fill="none" stroke="#9ca3af" stroke-width="{7 - i * 3}" stroke-linecap="round" opacity=".35" filter="url(#blur3)"/>')
for i in range(4):
    a(f'<path d="M{1262 + i * 6} {300 + i * 14} l26 -4 l-20 14 Z" fill="#1c1917"/>')

# ---- fire breath ----------------------------------------------------------------
outer = ("M1008 350 Q900 392 800 432 Q760 424 720 458 Q640 486 600 528 Q560 528 520 566 Q450 586 420 624 "
         "Q360 634 330 662 Q290 702 320 742 Q340 792 400 802 Q450 802 470 772 Q520 742 560 722 Q620 692 650 652 "
         "Q720 622 760 582 Q830 542 870 482 Q940 422 1012 382 Z")
mid = ("M1010 356 Q900 402 800 452 Q720 482 660 532 Q590 572 540 612 Q470 652 420 682 Q350 712 360 752 "
       "Q390 782 440 772 Q510 742 570 702 Q650 652 720 612 Q820 542 900 462 Q960 412 1012 376 Z")
core = ("M1012 362 Q920 412 820 472 Q720 532 640 592 Q560 652 470 702 Q420 732 440 754 Q480 757 540 722 "
        "Q640 662 740 592 Q860 502 1012 372 Z")
a(f'<rect width="{W}" height="{H}" fill="url(#impactGlow)"/>')
a(f'<path d="{outer}" fill="#f97316" filter="url(#blur20)" opacity=".85"/>')
a(f'<path d="{outer}" fill="#dc2626"/>')
a(f'<path d="{mid}" fill="#f97316"/>')
a(f'<path d="{core}" fill="#fde68a"/>')
a(f'<path d="{core}" fill="#fffbeb" filter="url(#blur8)" opacity=".8"/>')
for i in range(12):  # licking flame tongues along the stream
    t = i / 11
    fx, fy = 980 - 600 * t, 380 + 340 * t
    a(f'<path d="M{fx:.0f} {fy:.0f} q{-30 - 20 * t:.0f} {-18 - 10 * (i % 3):.0f} {-50 - 30 * t:.0f} {-8:.0f} q{20:.0f} {14:.0f} {50 + 30 * t:.0f} {20:.0f} Z" fill="#fb923c" opacity=".8"/>')
# splash where fire hits the bridge
for ang in range(-80, 81, 20):
    r = math.radians(ang - 90)
    ex, ey = 360 + 90 * math.cos(r), 755 + 70 * math.sin(r)
    a(f'<path d="M360 760 Q{(360 + ex) / 2 - 10:.0f} {(760 + ey) / 2:.0f} {ex:.0f} {ey:.0f} Q{(360 + ex) / 2 + 12:.0f} {(760 + ey) / 2 + 6:.0f} 372 760 Z" fill="#fdba74" opacity=".85"/>')

# ---- the duck (local coords, facing right) --------------------------------------
duck = []
d = duck.append
d('<path d="M-10 -20 C-30 -80 -80 -120 -132 -128 C-112 -104 -106 -92 -100 -78 C-120 -72 -126 -62 -132 -55 C-100 -44 -70 -30 -40 -4 Z" fill="#dbe2ea" stroke="#94a3b8" stroke-width="1.5"/>')
d('<path d="M-22 30 L-58 58 M-8 34 L-36 70" stroke="#ea580c" stroke-width="7" stroke-linecap="round"/>')
d('<path d="M-58 58 l-26 -4 l8 10 l-10 8 l14 2 l-4 12 Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>')
d('<path d="M-36 70 l-26 0 l10 9 l-8 10 l14 0 l0 12 Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>')
d('<path d="M-60 -6 C-78 -16 -84 -34 -76 -46 C-70 -30 -62 -24 -50 -20 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/>')
d('<ellipse cx="0" cy="0" rx="64" ry="41" fill="url(#duckBody)" stroke="#cbd5e1" stroke-width="1.5"/>')
d('<path d="M-56 18 Q0 52 58 16" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" opacity=".9"/>')
d('<path d="M30 -20 C44 -44 50 -56 55 -72 L92 -56 C82 -40 72 -20 56 -4 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>')
d('<circle cx="74" cy="-62" r="29" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>')
d('<path d="M50 -50 C40 -60 70 -70 60 -40" fill="none"/>')
d('<path d="M96 -68 C118 -73 138 -68 146 -58 C130 -55 112 -55 96 -56 Z" fill="#f59e0b" stroke="#c2410c" stroke-width="1.5"/>')
d('<path d="M96 -56 L140 -56 L132 -34 L96 -48 Z" fill="#7c2d12"/>')
d('<path d="M96 -48 C110 -44 126 -38 136 -30 C120 -33 104 -37 94 -42 Z" fill="#f59e0b" stroke="#c2410c" stroke-width="1.5"/>')
d('<path d="M110 -46 Q118 -44 124 -40" fill="none" stroke="#fb7185" stroke-width="3" stroke-linecap="round"/>')
d('<ellipse cx="84" cy="-66" rx="5.5" ry="4.2" fill="#0f172a"/>')
d('<circle cx="86" cy="-67.5" r="1.5" fill="#ffffff"/>')
d('<path d="M72 -76 L95 -69" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>')
d('<path d="M46 -72 C46 -104 100 -108 104 -72 Z" fill="url(#helmet)" stroke="#78350f" stroke-width="1.5"/>')
d('<path d="M42 -73 L108 -71" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>')
d('<path d="M58 -94 Q72 -102 88 -97" fill="none" stroke="#fde68a" stroke-width="3" stroke-linecap="round" opacity=".9"/>')
d('<path d="M84 -88 q6 4 3 10" fill="none" stroke="#451a03" stroke-width="2.4"/>')
d('<circle cx="75" cy="-103" r="5" fill="#b45309" stroke="#78350f" stroke-width="1"/>')
d('<path d="M44 -44 C14 -60 -28 -50 -70 -76 C-92 -88 -112 -82 -134 -98 L-128 -80 C-102 -64 -82 -70 -60 -58 C-30 -40 0 -36 46 -30 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>')
d('<path d="M-134 -98 l-14 -10 M-131 -88 l-18 -2" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>')
d('<path d="M36 -46 C50 -38 64 -38 80 -48 L84 -36 C68 -26 50 -26 34 -34 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.2"/>')
d('<path d="M8 -16 C-2 -72 -32 -122 -74 -154 C-64 -124 -62 -112 -58 -96 C-78 -102 -88 -98 -98 -94 C-72 -78 -58 -68 -48 -58 C-62 -58 -72 -52 -80 -46 C-46 -30 -20 -10 10 0 Z" fill="url(#duckWing)" stroke="#94a3b8" stroke-width="1.5"/>')
d('<path d="M-6 -30 L-56 -92 M-14 -18 L-70 -70 M-20 -8 L-66 -44" stroke="#cbd5e1" stroke-width="1.6"/>')
d('<path d="M10 0 C-20 -10 -46 -30 -80 -46" fill="none" stroke="#fbbf24" stroke-width="3" opacity=".85"/>')
duck_svg = "".join(duck)
a('<g transform="translate(560 392) rotate(-16) scale(1.3)">')
a(f'<g filter="url(#blur8)" opacity=".55"><ellipse cx="0" cy="8" rx="80" ry="54" fill="#fb923c"/></g>')
a(duck_svg)
a('</g>')
# loose feathers
for fx, fy, rot in [(360, 330, -30), (430, 500, 20), (690, 300, 60), (330, 420, -70), (730, 400, 15), (470, 250, 40)]:
    a(f'<g transform="translate({fx} {fy}) rotate({rot})"><path d="M0 0 C6 -10 22 -12 30 -4 C20 0 8 4 0 0 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>'
      '<path d="M0 0 L28 -4" stroke="#94a3b8" stroke-width=".8"/></g>')

# ---- atmosphere: smoke, embers, vignette ------------------------------------------
for _ in range(9):
    sx, sy = random.uniform(0, W), random.uniform(380, 720)
    a(f'<ellipse cx="{sx:.0f}" cy="{sy:.0f}" rx="{random.uniform(120, 260):.0f}" ry="{random.uniform(18, 40):.0f}" fill="#57534e" opacity=".16" filter="url(#blur20)"/>')
for _ in range(110):
    ex, ey = random.uniform(150, 1250), random.uniform(250, 860)
    r = random.choice([1.2, 1.6, 2.2, 3, 3.8])
    col = random.choice(["#fde047", "#fbbf24", "#fb923c", "#f97316"])
    a(f'<circle cx="{ex:.0f}" cy="{ey:.0f}" r="{r}" fill="{col}" opacity="{random.uniform(.55, 1):.2f}"/>')
a(f'<rect width="{W}" height="{H}" fill="url(#vignette)"/>')
a('</svg>')

Path(sys.argv[1]).write_text("\n".join(out), encoding="utf-8")
print("wrote", sys.argv[1], sum(len(s) for s in out), "chars")
