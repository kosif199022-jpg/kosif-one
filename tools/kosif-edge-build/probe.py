import json, time, urllib.request, sys
B = "https://kosif-atlas-api.kosif199022.workers.dev"
H = {"content-type": "application/json", "user-agent": "kosif-omni/probe"}
def req(path, obj=None, t=90):
    r = urllib.request.Request(B + path, data=None if obj is None else json.dumps(obj, ensure_ascii=False).encode("utf-8"), headers=H)
    t0 = time.time()
    try:
        return json.loads(urllib.request.urlopen(r, timeout=t).read()), round((time.time() - t0) * 1000)
    except Exception as e:
        return {"error": str(e), "body": getattr(e, "read", lambda: b"")()[:300].decode("utf-8", "replace")}, round((time.time() - t0) * 1000)
d, ms = req("/health"); print("health", ms, d.get("skills") or d)
d, ms = req("/search?q=pdf+to+excel&limit=3"); print("search", ms, [r["skill"] for r in d.get("results", [])] or d)
d, ms = req("/translate", {"text": "اريد تحويل فواتير PDF الى جدول اكسل"}); print("translate", ms, d)
for task in ["اريد تحويل فواتير PDF الى جدول اكسل", "حلل اداء موقعي وحسن السيو", "write a Terraform module for an AWS S3 bucket with versioning", "اكتب لي تقرير ضريبة القيمة المضافة"]:
    d, ms = req("/select", {"task": task})
    if "selected" not in d: print("select ERR", d); continue
    s = d["selected"]
    print("select", ms, "ms |", task[:40], "→", s and s["skill"], "|", d.get("decided_by"), "|", d["understanding"].get("method"), "| jev", d["jev"].get("stable"), d["jev"].get("model"))
