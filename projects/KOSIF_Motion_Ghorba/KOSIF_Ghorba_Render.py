# -*- coding: utf-8 -*-
"""KOSIF Motion: on-screen live progress, Pinterest scene montage, original audio and reusable production receipt."""
from __future__ import annotations
import hashlib, json, os, subprocess, sys, threading, time, traceback
from datetime import datetime
from pathlib import Path
import tkinter as tk

ROOT = Path.home() / "Desktop" / "الاداة" / "KOSIF_Motion_Ghorba"
SRC = ROOT / "pinterest_new"
OUT = ROOT / "renders"
OUT.mkdir(parents=True, exist_ok=True)
STATUS = ROOT / "production_status.json"
RENDER = OUT / "segments"
RENDER.mkdir(exist_ok=True)
FPS = 24
W,H = 540,960
TOTAL=48.0
SHOTS = [
 ("plane_window_592082682294635799.mp4",6.8, "الغُربة", "طريق طويل… وحنين أطول"),
 ("airport_pov_228346643601270594.mp4",5.2, "لحظة الوداع", "أصعب الرحلات تبدأ من القلب"),
 ("night_drive_974044225659519047.mp4",7.0, "شوارع بعيدة", "كل مدينة… إلا مدينتي"),
 ("rain_window_47780446041246596.mp4",5.0, "وراء المطر", "في كل قطرة ذكرى"),
 ("walking_rain_394557617374323837.mp4",7.6, "الوحدة", "وسط الزحام… أفتقد الوجوه"),
 ("rain_cinema_1125688869367996082.mp4",6.8, "الأهل", "صوتهم وطن"),
 ("plane_sunrise_983051425071690194.mp4",9.6, "وفي آخر الليل", "الأمل يرجّعنا ولو بالدعاء"),
]
OUTPUT=OUT / "Ghorba_KOSIF_Motion_preview_48s.mp4"
FONT="Dubai"
STARTED=datetime.now().isoformat(timespec="seconds")
def state(percent, stage, detail="", error=None, done=False):
 obj={"project":"الغربة","percent":round(percent,1),"stage":stage,"detail":detail,"updated":datetime.now().isoformat(timespec="seconds"),"done":done,"output":str(OUTPUT) if done else None,"error":error}
 tmp=STATUS.with_suffix(".tmp");tmp.write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding="utf-8");tmp.replace(STATUS)
def ass_time(t):
 h=int(t//3600);m=int((t%3600)//60);s=t%60
 return f"{h}:{m:02d}:{s:05.2f}"
def ass_text(t):
 return t.replace("{","(").replace("}",")").replace("\\","/")
def subtitle(index,duration,hero,sub):
 path=RENDER/f"scene_{index:02}.ass"
 text=f"""[Script Info]
Title: KOSIF Ghorba {index}
ScriptType: v4.00+
WrapStyle: 2
ScaledBorderAndShadow: yes
PlayResX: {W}
PlayResY: {H}
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hero,{FONT},60,&H00E5D4AB,&H00E5D4AB,&H00202024,&H60000000,1,0,0,0,100,100,0,0,1,2.5,1.3,2,34,34,210,1
Style: Detail,{FONT},32,&H00F2F2EF,&H00F2F2EF,&H00202024,&H60000000,0,0,0,0,100,100,0,0,1,1.4,1.0,2,40,40,154,1
Style: Tag,Arial,21,&H00C9C9C9,&H00C9C9C9,&H00202024,&H60000000,0,0,0,0,100,100,0,0,1,1.0,0.0,7,34,34,34,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,{ass_time(duration-0.05)},Hero,,0,0,0,,{{\\an2\\move(270,766,270,740,0,900)\\fad(650,700)}}{ass_text(hero)}
Dialogue: 1,0:00:00.45,{ass_time(duration-0.08)},Detail,,0,0,0,,{{\\an2\\move(270,812,270,793,300,1050)\\fad(650,600)}}{ass_text(sub)}
Dialogue: 2,0:00:00.00,{ass_time(duration-0.05)},Tag,,0,0,0,,{{\\an7\\pos(30,38)\\fad(400,600)}}KOSIF MOTION
"""
 path.write_text(text,encoding="utf-8-sig")
 return path
def run_ffmpeg(cmd, start, end, expected, stage, detail, cwd=RENDER):
 state(start,stage,detail)
 p=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding="utf-8",errors="replace",cwd=cwd,bufsize=1,creationflags=getattr(subprocess,"CREATE_NO_WINDOW",0))
 lines=[]
 for line in p.stdout:
  line=line.strip()
  if len(lines)>=50: lines.pop(0)
  lines.append(line)
  if line.startswith("out_time="):
   s=line.partition("=")[2]
   try:
    times=s.split(":");secs=int(times[0])*3600+int(times[1])*60+float(times[2])
    pct=start+(end-start)*min(1,secs/max(expected,0.1))
    state(pct,stage,detail)
   except (ValueError,IndexError): pass
 rc=p.wait()
 if rc: raise RuntimeError(stage+": "+ "\n".join(lines[-12:]))
 state(end,stage,detail)
def has_tools():
 for name in ("ffmpeg","ffprobe"):
  pr=subprocess.run([name,"-version"],capture_output=True,timeout=15,creationflags=getattr(subprocess,"CREATE_NO_WINDOW",0))
  if pr.returncode: raise RuntimeError(name+" is unavailable")
def verify(path):
 p=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,size:stream=codec_type,codec_name,width,height","-of","json",str(path)],capture_output=True,text=True,timeout=30,creationflags=getattr(subprocess,"CREATE_NO_WINDOW",0))
 if p.returncode: raise RuntimeError("ffprobe failed: "+p.stderr[-500:])
 data=json.loads(p.stdout);duration=float(data["format"]["duration"])
 video=next((s for s in data["streams"] if s.get("codec_type")=="video"),None)
 audio=next((s for s in data["streams"] if s.get("codec_type")=="audio"),None)
 if not(video and audio and abs(duration-TOTAL)<0.55 and video.get("width")==W and video.get("height")==H):raise RuntimeError("QA failed "+str(data))
 return {"duration":duration,"size_bytes":path.stat().st_size,"width":W,"height":H,"video_codec":video["codec_name"],"audio_codec":audio["codec_name"],"sha256":hashlib.sha256(path.read_bytes()).hexdigest()}
def guide(receipt):
 path=ROOT/"KOSIF_MOTION_GUIDE_REUSE_AR.md"
 shots="\n".join(f"{i+1}. {row[0]} — {row[1]:.1f} ث — {row[2]} | {row[3]}" for i,row in enumerate(SHOTS))
 text=f"""# دليل KOSIF Motion لإنتاج المونتاج — مشروع الغربة
تاريخ التشغيل: {STARTED}
## النتيجة المتحققة
الملف: `renders/Ghorba_KOSIF_Motion_preview_48s.mp4`
المدة: {receipt['duration']:.2f} ثانية؛ الأبعاد: {W}×{H}؛ الإطارات: {FPS}/ث.
SHA256: `{receipt['sha256']}`
**هذه معاينة مدتها 48 ثانية من بداية الصوت؛ وليست مونتاجًا كاملًا للأغنية.**
## قاعدة التكرار مع أي فيديو أو صوت
1. استلم ملف الصوت/الفيديو في مجلد مشروع مستقل واحتفظ بنسخة أصلية. افحص النوع والمدة وحقوق استخدام الوسائط بـ FFprobe.
2. حلّل الكلام والإيقاع والطاقة. اكتب النصوص حرفيًا بعد سماع الصوت أو تفريغه ومراجعته. لا تستبدل كلمات الأغنية بنصوص من تأليفك من دون توضيح؛ نص هذه المعاينة *عبارات أصلية عن الغربة* وليس تفريغًا للأغنية.
3. ابحث عن مراجع لقطات مناسبة من Pinterest. سجّل الروابط وأصحاب العمل وشروط الترخيص. تنزيل فيديو متاح علنًا لا يمنح حق إعادة نشره.
4. استعمل `yt-dlp` أو `python scripts/kmotion.py fetch URL --out DIR` من `kosif-montage-motion` للوسائط العامة المسموح بها. يمكن استخدام `KOSIF C Video Fetch` في `tools`؛ لا تتجاوز تسجيل الدخول أو DRM.
5. ضع اللقطات في مجلد `pinterest_new`، وافحص المقاسات والمدة وسلامة الفيديو. استفد من `songreel` للأغاني، و`mimic` لمضاهاة أسلوب مرجعي، و`montage` للقطع على الإيقاع و`timeline` للانتقالات.
6. اختر خطًا عربيًا حقيقيًا متاحًا في النظام مثل Dubai أو NotoKufiArabic؛ احفظ النص في ASS UTF-8 مع حركة ودخول وخروج. لا تضع النص على وجه الشخص أو خارج المنطقة الآمنة.
7. أنشئ مشهدًا لكل مقطع: توحيد نسبة 9:16، معايرة الألوان والتشبع، تحريك العناوين، ثم تصدير H.264 مع معدل إطارات ثابت.
8. ادمج المشاهد بترتيب الفيلم، وضع الصوت الأصلي من المصدر فقط مع التحويل AAC؛ لا تترك صوت مقاطع Pinterest مختلطًا فوقه.
9. أظهر تقدم العمل الحقيقي من مخرجات ffmpeg في واجهة على الشاشة، ثم راجع مدة الناتج والترميز والصوت والأبعاد والفواصل ومستويات الصوت والكتابة العربية.
10. بعد نجاح الفحص، افتح MP4 تلقائيًا على الجهاز، وسجّل قائمة المصادر والتغييرات والأوامر ونتيجة التحقق في ملفي `production_status.json` و`production_receipt.json`.
## تسلسل لقطات هذه المعاينة
{shots}
## الملفات اللازمة لإعادة التنفيذ
- `KOSIF_Ghorba_Render.py`: السكربت المنفذ مع شريط تقدم رسومي، وطريقة توليد عناوين عربية وتصدير المشاهد.
- `ghorba_song.mp3` في مجلد «الأداة» الرئيسي: الصوت الأصلي.
- `pinterest_new/*.mp4` و`pinterest_new/manifest.json`: لقطات Pinterest والروابط.
- `renders/segments/*.ass`: كتابة وحركة كل لقطة ويمكن تعديلها.
- `renders/Ghorba_KOSIF_Motion_preview_48s.mp4`: المعاينة الحقيقية.
## التشغيل
على كمبيوتر Windows مجهز بـ Python وFFmpeg وبنفس بنية المجلد، شغّل:
`python KOSIF_Ghorba_Render.py`
المشروع قابل لإعادة الاستخدام بعد تحديث قائمة `SHOTS`، ومسار `ghorba_song.mp3`، والمدة، والعبارات. لا تعتبر هذه الخطوات ضمانًا لصلاحية كل رابط أو لخلو الفيديو من حقوق الغير.
## نتيجة اختبار جودة الملف
```json
{json.dumps(receipt,ensure_ascii=False,indent=2)}
```
"""
 path.write_text(text,encoding="utf-8")
 return path
def render():
 try:
  state(2,"تجهيز المشروع","فحص المصادر وأدوات الفيديو")
  has_tools()
  for clip,_,_,_ in SHOTS:
   if not (SRC/clip).is_file():raise FileNotFoundError("Missing downloaded clip "+clip)
  song=ROOT.parent/"ghorba_song.mp3"
  if not song.is_file():raise FileNotFoundError("Missing original audio "+str(song))
  sources=[]
  for i,(clip,dur,hero,sub) in enumerate(SHOTS):
   ass=subtitle(i,dur,hero,sub)
   target=RENDER/f"scene_{i:02}.mp4"
   grade="eq=contrast=1.08:saturation=0.86:brightness=-0.023"
   vf=f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=bicubic,crop={W}:{H},fps={FPS},{grade},ass={ass.name},format=yuv420p"
   cmd=["ffmpeg","-hide_banner","-loglevel","error","-nostdin","-y","-stream_loop","-1","-i",str(SRC/clip),"-t",str(dur),"-an","-vf",vf,"-r",str(FPS),"-threads","2","-c:v","libx264","-preset","veryfast","-crf","24","-pix_fmt","yuv420p","-progress","pipe:1",str(target)]
   a=5+i*9.0;b=a+9.0
   run_ffmpeg(cmd,a,b,dur,"مونتاج اللقطات",f"لقطة {i+1} من {len(SHOTS)} — {hero}")
   sources.append({"filename":clip,"seconds":dur,"title":hero})
  concat=RENDER/"concat_list.txt"
  concat.write_text("".join(f"file 'scene_{i:02}.mp4'\n" for i in range(len(SHOTS))),encoding="utf-8")
  visual=RENDER/"visual_only.mp4"
  cmd=["ffmpeg","-hide_banner","-loglevel","error","-nostdin","-y","-f","concat","-safe","0","-i",concat.name,"-c:v","copy","-movflags","+faststart","-progress","pipe:1",str(visual)]
  run_ffmpeg(cmd,68,75,TOTAL,"تجميع المشاهد","تركيب القطعات في تسلسل واحد")
  cmd=["ffmpeg","-hide_banner","-loglevel","error","-nostdin","-y","-i",str(visual),"-i",str(song),"-t",str(TOTAL),"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","aac","-b:a","192k","-af","afade=t=in:st=0:d=0.3,afade=t=out:st=46.7:d=1.3","-movflags","+faststart","-progress","pipe:1",str(OUTPUT)]
  run_ffmpeg(cmd,75,94,TOTAL,"مزامنة الصوت","الحفاظ على صوت الغربة الأصلي وتصدير MP4")
  state(96,"التحقق من الجودة","فحص مدة الفيلم والفيديو والصوت")
  receipt=verify(OUTPUT)
  receipt.update({"project":"الغربة","preview":True,"sources_count":len(SHOTS),"audio_original":song.name,"source_licensing":"Not verified. Private creative preview; check reuse rights before publication.","scenes":sources,"created":datetime.now().isoformat(timespec="seconds"),"opened_on_pc":False})
  guide_path=guide(receipt)
  try:
   os.startfile(str(OUTPUT))
   receipt["opened_on_pc"]=True
  except Exception as exc: receipt["open_error"]=str(exc)
  (ROOT/"production_receipt.json").write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding="utf-8")
  state(100,"تم تصدير الفيديو","تم حفظ المعاينة ودليل إعادة التنفيذ",done=True)
 except Exception as e:
  (ROOT/"production_error.log").write_text(traceback.format_exc(),encoding="utf-8")
  state(0,"تعذر التصدير",str(e)[:280],error=str(e))
class App:
 def __init__(self):
  self.root=tk.Tk()
  w=self.root;w.title("KOSIF Motion — متابعة مونتاج الغربة")
  w.geometry("760x385+280+180");w.configure(bg="#0d1525");w.minsize(620,310)
  try:w.attributes("-topmost",True);w.after(3500,lambda:w.attributes("-topmost",False))
  except Exception:pass
  tk.Label(w,text="KOSIF MOTION",fg="#e0b778",bg="#0d1525",font=("Segoe UI",18,"bold")).pack(pady=(20,4))
  tk.Label(w,text="مونتاج «الغربة» — معاينة سينمائية ٤٨ ثانية",fg="#f3f5f9",bg="#0d1525",font=("Dubai",22,"bold")).pack()
  self.stage=tk.Label(w,text="تجهيز المشروع",fg="#e3e4ec",bg="#0d1525",font=("Dubai",16))
  self.stage.pack(pady=(10,4))
  self.canvas=tk.Canvas(w,width=680,height=24,bg="#283041",highlightthickness=0)
  self.canvas.pack(pady=(10,0),fill="x",padx=42)
  self.rect=self.canvas.create_rectangle(0,0,0,24,fill="#d5aa62",outline="")
  self.percent=tk.Label(w,text="0%",fg="#e0b778",bg="#0d1525",font=("Segoe UI",17,"bold"))
  self.percent.pack(pady=(6,0))
  self.detail=tk.Label(w,text="فحص ملفات الصوت ولقطات Pinterest",fg="#aab3c2",bg="#0d1525",font=("Dubai",13),wraplength=685)
  self.detail.pack(pady=(4,12))
  self.path=tk.Label(w,text="الملفات والمراحل محفوظة داخل مجلد KOSIF_Motion_Ghorba",fg="#8593a9",bg="#0d1525",font=("Segoe UI",10))
  self.path.pack()
  self.last_complete=False
  self.root.after(350,self.tick)
 def tick(self):
  try:
   s=json.loads(STATUS.read_text(encoding="utf-8"))
   pc=max(0,min(100,float(s["percent"])))
   self.percent.config(text=f"{pc:.1f}%")
   self.stage.config(text=s["stage"])
   self.detail.config(text=s.get("detail",""))
   width=max(1,self.canvas.winfo_width())
   self.canvas.coords(self.rect,0,0,width*pc/100,24)
   if s.get("error"):
    self.stage.config(fg="#ff9b96")
   elif s.get("done"):
    self.stage.config(fg="#9addbc")
    self.path.config(text="تم فتح الفيديو في المشغل. الدليل محفوظ باسم KOSIF_MOTION_GUIDE_REUSE_AR.md")
  except Exception:pass
  self.root.after(550,self.tick)
 def run(self):
  threading.Thread(target=render,daemon=True).start()
  self.root.mainloop()
if __name__=="__main__":
 App().run()
