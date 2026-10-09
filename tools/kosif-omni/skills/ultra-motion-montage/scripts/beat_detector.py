"""Beat & Transient Detector for Intelligent Video Montage.
Analyzes audio files to detect BPM, rhythmic beat grids, and transient energy peaks
using standard scipy and numpy. Deterministic, fast, and standalone.
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path
import numpy as np
from scipy.signal import butter, filtfilt, find_peaks

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")


def load_audio_mono(audio_path: str | Path, target_sr: int = 22050) -> tuple[np.ndarray, int]:
    """Extract audio as mono float32 array at target sample rate using ffmpeg."""
    audio_path = Path(audio_path).resolve()
    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Use ffmpeg to convert any audio/video file directly to raw f32le PCM
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-i", str(audio_path),
        "-ac", "1",
        "-ar", str(target_sr),
        "-f", "f32le",
        "-"
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    raw = proc.stdout
    data = np.frombuffer(raw, dtype=np.float32)
    return data, target_sr


def detect_tempo_and_beats(samples: np.ndarray, sr: int, min_bpm: float = 60.0, max_bpm: float = 180.0) -> dict:
    """Detect BPM and return beat timestamps and peak energy moments."""
    if len(samples) < sr:
        return {"bpm": 120.0, "beat_interval": 0.5, "beats": [], "onsets": []}

    # 1. Bandpass filter focusing on bass/kick transients (50 Hz - 250 Hz)
    sos = butter(4, [50, 250], btype="bandpass", fs=sr, output="sos")
    from scipy.signal import sosfilt
    low_filtered = sosfilt(sos, samples)

    # 2. Envelope extraction via rectification & moving average
    hop_length = int(sr / 100)  # 10ms hops = 100 Hz envelope rate
    frame_rate = sr / hop_length
    rectified = np.abs(low_filtered)
    
    # Compute moving RMS energy
    num_frames = len(rectified) // hop_length
    frames = rectified[:num_frames * hop_length].reshape((num_frames, hop_length))
    energy = np.sqrt(np.mean(frames ** 2, axis=1) + 1e-9)

    # 3. First-order difference for onset detection
    diff = np.diff(energy, prepend=energy[0])
    diff = np.maximum(diff, 0)  # half-wave rectification

    # Normalize difference
    if np.max(diff) > 0:
        diff /= np.max(diff)

    # 4. Autocorrelation to estimate BPM
    min_lag = int(frame_rate * 60.0 / max_bpm)
    max_lag = int(frame_rate * 60.0 / min_bpm)
    
    # Take autocorrelation of diff
    auto_corr = np.correlate(diff, diff, mode="full")
    mid = len(auto_corr) // 2
    lags_segment = auto_corr[mid + min_lag : mid + max_lag]
    
    best_lag = min_lag + np.argmax(lags_segment)
    detected_bpm = round((frame_rate * 60.0) / best_lag, 1)
    beat_interval = 60.0 / detected_bpm

    # 5. Peak finding for actual transient onsets
    peak_indices, properties = find_peaks(diff, height=0.15, distance=int(frame_rate * 0.25))
    onset_times = [round(float(idx / frame_rate), 3) for idx in peak_indices]

    # 6. Generate aligned regular beat grid starting from first major onset
    duration = len(samples) / sr
    first_beat = onset_times[0] if onset_times else 0.0
    grid_beats = []
    t = first_beat
    while t < duration:
        grid_beats.append(round(float(t), 3))
        t += beat_interval

    return {
        "bpm": detected_bpm,
        "beat_interval": round(beat_interval, 3),
        "total_duration": round(duration, 2),
        "first_downbeat": first_beat,
        "grid_beats": grid_beats,
        "onsets": onset_times
    }


def analyze_file(audio_path: str | Path) -> dict:
    samples, sr = load_audio_mono(audio_path)
    return detect_tempo_and_beats(samples, sr)


def main():
    parser = argparse.ArgumentParser(description="Analyze audio to detect BPM and beat timestamps.")
    parser.add_argument("audio", help="Path to audio or video file")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    parser.add_argument("--limit", type=int, default=20, help="Max beat timestamps to show")
    args = parser.parse_args()

    try:
        res = analyze_file(args.audio)
        if args.json:
            print(json.dumps(res, indent=2, ensure_ascii=False))
        else:
            print(f"🎵 Duration: {res['total_duration']}s | BPM: {res['bpm']} | Beat Interval: {res['beat_interval']}s")
            print(f"🎯 First Downbeat: {res['first_downbeat']}s")
            print(f"⚡ Detected {len(res['onsets'])} transient onsets and {len(res['grid_beats'])} grid beats.")
            sample_beats = res['grid_beats'][:args.limit]
            print(f"⏱️ Sample beat timestamps: {sample_beats}")
    except Exception as e:
        print(f"Error analyzing audio: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
