"""Synthesize the 18 s soundtrack for «مصر 2120» (no samples, no services): soundtrack.wav (48 kHz stereo).

Hijaz on D (D Eb F# G A Bb C) gives the Egyptian colour; a Karplus-Strong pluck stands in for a qanun; a warm pad
carries the chords; risers lead into each cut and an impact lands on it; a pulse builds through Cairo; the finale
resolves on D major with a long tail. Cut times match index.html.
"""
import numpy as np
from scipy.signal import butter, fftconvolve, lfilter, sosfilt
import wave

SR, DUR = 48000, 18.0
N = int(SR * DUR)
CUTS = [2.6, 6.0, 9.5, 13.5, 16.5]
rng = np.random.default_rng(2120)
L = np.zeros(N); R = np.zeros(N)


def hz(note):  # MIDI → Hz
    return 440.0 * 2 ** ((note - 69) / 12)


def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)


def env(n, a, d, s_level, r):  # ADSR in samples
    e = np.full(n, s_level)
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    e[a:a + d] = np.linspace(1, s_level, d, endpoint=False)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def pad(notes, t0, dur, gain=0.11, bright=1800):
    n = int(dur * SR); t = np.arange(n) / SR; sig = np.zeros(n)
    for k, m in enumerate(notes):
        for det in (-0.07, 0.0, 0.08):                           # three detuned saws per note
            f = hz(m) * 2 ** (det / 12)
            ph = rng.random()
            sig += 2 * ((f * t + ph) % 1.0) - 1
    sig /= len(notes) * 3
    sos = butter(2, bright, "low", fs=SR, output="sos"); sig = sosfilt(sos, sig)
    sig *= env(n, 0.6, 0.4, 0.85, 0.9)
    add(sig, t0, -0.25, gain); add(sig[::-1][::-1] * 0.9, t0 + 0.012, 0.3, gain)   # tiny delay = width


def pluck(m, t0, dur=1.2, gain=0.22, pan=0.0):              # Karplus-Strong
    f = hz(m); p = int(SR / f); n = int(dur * SR)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    out *= np.exp(-np.arange(n) / (SR * 0.55))
    add(out, t0, pan, gain)


def kick(t0, gain=0.5):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 42 + 90 * np.exp(-t * 30)
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    add(sig, t0, 0.0, gain)


def noise_sweep(t0, dur, up=True, gain=0.16):
    n = int(dur * SR); x = rng.uniform(-1, 1, n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        p = i / n if up else 1 - i / n
        sos = butter(2, [300 + 7000 * p ** 2, 600 + 9000 * p ** 2], "band", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, x[i:i + blk])
    out *= np.linspace(0, 1, n) ** 2 if up else np.linspace(1, 0, n) ** 2
    add(out, t0, 0.0, gain)


def impact(t0, gain=0.55):
    kick(t0, gain)
    n = int(1.2 * SR); x = rng.uniform(-1, 1, n) * np.exp(-np.arange(n) / (SR * 0.18))
    sos = butter(2, 2500, "low", fs=SR, output="sos"); add(sosfilt(sos, x), t0, 0.0, gain * 0.35)


def shimmer(t0, dur, count, lo=84, hi=100, gain=0.05):
    scale = [2, 3, 6, 7, 9, 10, 0]                            # Hijaz degrees on D (pitch classes)
    for _ in range(count):
        m = 12 * rng.integers(lo // 12, hi // 12 + 1) + scale[rng.integers(0, 7)]
        n = int(0.9 * SR); t = np.arange(n) / SR
        sig = np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 4.5) * (1 - np.exp(-t * 300))
        add(sig, t0 + rng.random() * dur, rng.uniform(-0.8, 0.8), gain)


D2, D3 = 38, 50
HIJAZ = [62, 63, 66, 67, 69, 70, 72, 74]                       # D4 Eb F# G A Bb C D5
# ── score ───────────────────────────────────────────────────────────────────────────────────────────────────
n0 = int(DUR * SR); t = np.arange(n0) / SR                    # drone under everything
drone = np.sin(2 * np.pi * hz(D2) * t) * 0.6 + np.sin(2 * np.pi * hz(D3) * t + .3) * 0.25
drone *= np.minimum(1, t / 1.5) * np.minimum(1, (DUR - t) / 1.2)
add(drone, 0, 0, 0.05)
shimmer(0.0, 2.4, 26, gain=0.08)                              # stars: hook
pad([50, 54, 57, 62], 0.0, 2.9, 0.09, 2600)                    # D
pad([55, 58, 62, 67], 2.6, 3.7, 0.10, 3200)                    # Gm   — Giza
pad([48, 51, 55, 63], 6.0, 3.8, 0.10, 3600)                    # Cm(add Eb) — Nile
pad([50, 54, 57, 63], 9.5, 4.3, 0.11, 4200)                    # D(b9) — Cairo
pad([46, 50, 53, 58], 13.5, 3.3, 0.11, 3800)                   # Bb — Alexandria
pad([50, 54, 57, 62, 66], 16.5, 1.6, 0.13, 3000)               # D major resolve
beat = 60 / 112
motif = [0, 1, 2, 3, 4, 3, 2, 1, 2, 4, 5, 4, 3, 2, 1, 0]
k = 0; tt = 2.6
while tt < 16.3:                                              # qanun arpeggio, denser from Cairo on
    step = beat / 2 if tt < 9.5 else beat / 4
    m = HIJAZ[motif[k % len(motif)]] + (12 if tt > 13.5 and k % 4 == 0 else 0)
    pluck(m, tt, 1.0, 0.30 if tt < 9.5 else 0.24, pan=0.5 * np.sin(k * 0.9))
    tt += step; k += 1
for b in np.arange(9.5, 16.5, beat):                          # pulse through Cairo and Alexandria
    kick(b, 0.17 if b < 13.5 else 0.14)
for c in CUTS:
    noise_sweep(c - 0.7, 0.7, True, 0.2); impact(c, 0.3)
pluck(74, 16.5, 2.0, 0.22, 0.2); pluck(69, 16.62, 2.0, 0.18, -0.2); pluck(66, 16.74, 2.0, 0.16, 0.0)
shimmer(16.5, 1.3, 20, gain=0.085)

# ── reverb, master ─────────────────────────────────────────────────────────────────────────────────────────
ir_n = int(2.4 * SR); decay = np.exp(-np.arange(ir_n) / (SR * 0.55))
irL = rng.normal(0, 1, ir_n) * decay; irR = rng.normal(0, 1, ir_n) * decay
sos = butter(1, 5000, "low", fs=SR, output="sos"); irL = sosfilt(sos, irL); irR = sosfilt(sos, irR)
wetL = fftconvolve(L, irL)[:N]; wetR = fftconvolve(R, irR)[:N]
wetL /= np.max(np.abs(wetL)) + 1e-9; wetR /= np.max(np.abs(wetR)) + 1e-9
mixL = L / (np.max(np.abs(L)) + 1e-9) + 0.28 * wetL; mixR = R / (np.max(np.abs(R)) + 1e-9) + 0.28 * wetR
hp = butter(2, 35, "high", fs=SR, output="sos"); mixL = sosfilt(hp, mixL); mixR = sosfilt(hp, mixR)
shelf = butter(2, 2500, "high", fs=SR, output="sos"); mixL = mixL + 0.9 * sosfilt(shelf, mixL); mixR = mixR + 0.9 * sosfilt(shelf, mixR)   # presence/air for phone speakers
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 0.6); mixL *= fade; mixR *= fade
rms = np.sqrt(np.mean(np.concatenate([mixL, mixR]) ** 2)); target = 10 ** (-15 / 20)   # ≈ -15 dBFS RMS (≈ -14 LUFS)
g = target / rms; mixL *= g; mixR *= g
lim = lambda x: np.tanh(x * 1.1) * 0.89                                                    # soft limiter: peaks stay below -1 dBFS
mixL, mixR = lim(mixL), lim(mixR)
from scipy.signal import resample_poly                       # true-peak guard: 4x oversampled peak <= -1.2 dBTP, and -2.7 dB to -14 LUFS
mixL *= 10 ** (-2.05 / 20); mixR *= 10 ** (-2.05 / 20)
tp = max(np.max(np.abs(resample_poly(mixL, 4, 1))), np.max(np.abs(resample_poly(mixR, 4, 1))))
if tp > 10 ** (-1.2 / 20):
    g = 10 ** (-1.2 / 20) / tp; mixL *= g; mixR *= g
pcm = (np.stack([mixL, mixR], 1) * 32767).astype(np.int16)
with wave.open("soundtrack.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print({"seconds": DUR, "peak_dbfs": round(20 * np.log10(np.max(np.abs(pcm)) / 32767), 2),
       "rms_dbfs": round(20 * np.log10(np.sqrt(np.mean((pcm / 32767.0) ** 2))), 2)})
