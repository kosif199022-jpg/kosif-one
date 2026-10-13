"""Stylise the whole reel frame by frame with an AnimeGANv3 ONNX model (TachibanaYoshino/AnimeGANv3_Portrait_Inference).

The upstream onnx_infer.py runs a human-face detector on every frame and pastes stylised faces back. The characters
here are birds, so the detector finds nothing (or a false hit on a close-up). This script skips that step and runs
the same whole-frame path as `onnx_infer.py --background`: identical pre/post-processing, without the detector cost.

  python animegan_video.py SOURCE.mp4 MODEL.onnx -o out/hen_ghibli.mp4
  python animegan_video.py SOURCE.mp4 MODEL.onnx -o out/compare.mp4 --compare      # original | stylised
  python animegan_video.py SOURCE.mp4 MODEL.onnx -o out/hen_hd.mp4 --size 720x1312 --out-size 1080x1920

Models: the Disney/USA portrait models are sold through the author's Patreon. Pass that .onnx here once you have it.
The free ones that work: AnimeGANv3_large_Ghibli_c1_e299.onnx (AnimeGANv3_Portrait_Inference release 1.0),
AnimeGANv3_Hayao_36.onnx / AnimeGANv3_Shinkai_37.onnx (AnimeGANv3 release v1.1.0).
License: AnimeGANv3 models are for non-commercial use unless you get the author's written permission.
"""
import argparse
import json
import os
import subprocess
import sys
import time

import numpy as np
import onnxruntime as ort


def probe(src):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height,r_frame_rate,nb_frames", "-of", "json", src],
                         check=True, capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"], s["r_frame_rate"], int(s.get("nb_frames") or 0)


def to16(v):
    return max(16, int(round(v / 16)) * 16)


def parse_size(text):
    w, h = text.lower().split("x")
    return int(w), int(h)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source")
    ap.add_argument("model")
    ap.add_argument("-o", "--output", required=True)
    ap.add_argument("--size", help="inference size WxH (rounded to multiples of 16). Default: source size")
    ap.add_argument("--out-size", help="final video size WxH. Default: source size")
    ap.add_argument("--compare", action="store_true", help="put the original on the left of the stylised frame")
    ap.add_argument("--crf", type=int, default=16)
    a = ap.parse_args()

    sw, sh, rate, total = probe(a.source)
    iw, ih = parse_size(a.size) if a.size else (sw, sh)
    iw, ih = to16(iw), to16(ih)
    ow, oh = parse_size(a.out_size) if a.out_size else (sw, sh)

    opts = ort.SessionOptions()
    opts.intra_op_num_threads = int(os.environ.get("ORT_THREADS", os.cpu_count() or 4))
    providers = ["CUDAExecutionProvider", "CPUExecutionProvider"] if ort.get_device() == "GPU" else ["CPUExecutionProvider"]
    sess = ort.InferenceSession(a.model, sess_options=opts, providers=providers)
    inp = sess.get_inputs()[0].name

    # Decode straight at the inference size (lanczos), RGB, so frames never touch disk.
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.source, "-vf", f"scale={iw}:{ih}:flags=lanczos",
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    chain = f"[0:v]scale={ow}:{oh}:flags=lanczos,format=yuv420p[s]"
    if a.compare:
        chain = (f"[0:v]scale={ow}:{oh}:flags=lanczos[s0];[1:v]scale={ow}:{oh}:flags=lanczos[o];"
                 f"[o][s0]hstack,format=yuv420p[s]")
    enc_cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{iw}x{ih}", "-r", rate,
               "-i", "-", "-i", a.source, "-filter_complex", chain, "-map", "[s]", "-map", "1:a?",
               "-c:v", "libx264", "-crf", str(a.crf), "-preset", "medium", "-c:a", "aac", "-b:a", "192k",
               "-shortest", a.output]
    enc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE)

    n, t0, frame_bytes = 0, time.time(), iw * ih * 3
    while True:
        buf = dec.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        x = np.frombuffer(buf, np.uint8).reshape(1, ih, iw, 3).astype(np.float32) / 127.5 - 1.0
        y = sess.run(None, {inp: x})[0][0]
        enc.stdin.write(((y + 1.0) * 127.5).clip(0, 255).astype(np.uint8).tobytes())
        n += 1
        if n % 30 == 0:
            fps = n / (time.time() - t0)
            eta = (total - n) / fps if total else 0
            print(f"{n}/{total or '?'} frames  {fps:.2f} fps  eta {eta / 60:.1f} min", flush=True)
    dec.wait()
    enc.stdin.close()
    if enc.wait() != 0:
        sys.exit("ffmpeg encode failed")
    print(f"done: {n} frames in {(time.time() - t0) / 60:.1f} min -> {a.output}")


if __name__ == "__main__":
    main()
