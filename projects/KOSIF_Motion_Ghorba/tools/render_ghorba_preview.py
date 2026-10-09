"""KOSIF Ghorba 48s 9:16 Pinterest footage + original MP3 + Arabic motion type.
Re-run with: python tools/render_ghorba_preview.py
Does not touch the original MP3, previous versions, or upload anything.
"""
from __future__ import annotations
from pathlib import Path
import hashlib, json, os, subprocess, time, traceback

PROJECT=Path(__file__).resolve().parents[1]
ORIGINAL=PROJECT.parent/'ghorba_song.mp3'
CLIPS=PROJECT/'pinterest_new'
OUT=PROJECT/'renders'
WORK=OUT/'segments'
STATUS=PROJECT/'progress.json'
LOG=PROJECT/'render.log'
OUTPUT=OUT/'GHORBA_Pinterest_Motion_Preview_48s.mp4'
FRAMES=OUT/'preview_frames'
OUT.mkdir(parents=True,exist_ok=True)
WORK.mkdir(parents=True,exist_ok=True)
FRAMES.mkdir(parents=True,exist_ok=True)
FPS=24
W,H=720,1280
SHOTS=[
 ('plane_window_592082682294635799.mp4',7.2, 'Departure — Sky through plane window'),
 ('airport_pov_228346643601270594.mp4',5.0, 'Airport — Leaving home'),
 ('night_drive_974044225659519047.mp4',8.3,'Distance — Night journey'),
 ('rain_window_47780446041246596.mp4',4.9,'Solitude — Rain on the glass'),
 ('walking_rain_394557617374323837.mp4',7.4,'Loneliness — Walking in rain'),
 ('rain_cinema_1125688869367996082.mp4',6.3,'Memory — Rain and reflections'),
 ('plane_sunrise_983051425071690194.mp4',8.9,'Hope — Sunrise from the plane'),
]
assert abs(sum(d for _,d,_ in SHOTS)-48)<0.001
ART=[
 (0.25,5.7,'الغُرْبَة'),
 (6.1,11.7,'بعيد... وقلبي هناك'),
 (12.5,19.8,'كل طريق بيرجّع ذكرى'),
 (20.8,24.9,'والمطر يحكي اللي جوانا'),
 (25.9,32.4,'وحشة البيت مبتروحش'),
 (33.3,38.7,'وصوت الأحباب لسه معايا'),
 (39.3,44.6,'يمكن الطريق يطول'),
 (44.7,47.8,'بس الرجوع عمره ما يغيب'),
]
def status(percent,stage,state='running',extra=None):
    payload={'percent':int(percent),'stage':stage,'state':state,'output':str(OUTPUT),'updated':time.strftime('%Y-%m-%d %H:%M:%S')}
    if extra: payload.update(extra)
    temp=STATUS.with_suffix('.json.tmp')
    temp.write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf8')
    os.replace(temp, STATUS)
def timestamp(sec):
    cent=int(round(sec*100))
    return f"{cent//360000}:{(cent//6000)%60:02}:{(cent//100)%60:02}.{cent%100:02}"
def write_ass():
    head="""[Script Info]
Title: KOSIF Motion - Ghorba Pinterest Preview 48s
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Glow,Noto Kufi Arabic,57,&H80FFF2DF,&H00FFFFFF,&H8C3E5D8B,&HCC131525,1,0,0,0,100,100,0,0,1,9,2,2,60,60,205,1
Style: Main,Noto Kufi Arabic,57,&H00F8F7F3,&H0000FFFF,&H00101B2E,&H8037415D,1,0,0,0,100,100,0,0,1,3,2,2,60,60,205,1
Style: Title,Noto Kufi Arabic,79,&H00F3EBCF,&H00FFFFFF,&H002E2446,&H80666666,1,0,0,0,100,100,0,0,1,4,3,2,60,60,210,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    rows=[]
    for i,(start,end,text) in enumerate(ART):
        tag=r"{\move(360,1060,360,1020,0,650)\fad(230,400)\fscx94\fscy94\t(0,650,\fscx100\fscy100)}"
        if i==0: tag=r"{\move(360,1030,360,950,0,950)\fad(300,650)\fscx88\fscy88\t(0,950,\fscx107\fscy107)}"
        txt=text.replace(',','،') # text-safe ASS commas in last field okay
        rows.append(f"Dialogue: 0,{timestamp(start)},{timestamp(end)},Glow,,0,0,0,,{tag}{txt}")
        rows.append(f"Dialogue: 1,{timestamp(start)},{timestamp(end)},{'Title' if i==0 else 'Main'},,0,0,0,,{tag}{txt}")
    (OUT/'captions.ass').write_text(head+'\n'.join(rows)+'\n',encoding='utf-8-sig')
def ffprobe(file):
    p=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,width,height,codec_name','-of','json',str(file)],capture_output=True,text=True,timeout=20)
    if p.returncode: raise RuntimeError('ffprobe: '+p.stderr[-500:])
    return json.loads(p.stdout)
def sha256(file):
    h=hashlib.sha256()
    with open(file,'rb') as f:
        for block in iter(lambda:f.read(1024*1024),b''):h.update(block)
    return h.hexdigest()
def run(cmd,base,share,stage):
    start=time.time()
    status(base,stage)
    with LOG.open('a',encoding='utf8') as log:
        log.write('\n=== '+stage+' ===\n'+subprocess.list2cmdline([str(x) for x in cmd])+'\n')
        log.flush()
        p=subprocess.Popen([str(x) for x in cmd],cwd=str(OUT),stdout=subprocess.PIPE,stderr=log,stdin=subprocess.DEVNULL,
                           text=True,encoding='utf8',errors='replace',bufsize=1)
        last=-1
        for line in p.stdout:
            if line.startswith('out_time='):
                t=line.split('=',1)[1].strip()
                try:
                    parts=t.split(':')
                    seconds=float(parts[0])*3600+float(parts[1])*60+float(parts[2])
                    v=base+min(share,share*seconds/(48.0 if share>=20 else current_duration))
                    if int(v)>last:
                        last=int(v);status(v,stage)
                except Exception: pass
        ret=p.wait()
        log.write('EXIT '+str(ret)+' ELAPSED '+str(round(time.time()-start,2))+'s\n')
    if ret:raise RuntimeError(f'FFmpeg step failed: {stage}. Check {LOG}')
    return round(time.time()-start,2)
current_duration=1.0
def main():
    global current_duration
    status(2,'فحص الصوت والفيديوهات وحفظ إعدادات المشروع')
    if not ORIGINAL.is_file(): raise FileNotFoundError(str(ORIGINAL))
    original_data=ffprobe(ORIGINAL)
    if float(original_data['format']['duration']) <48:raise RuntimeError('Original audio is too short')
    source_hash=sha256(ORIGINAL)
    fps_data=[]
    for i,(file,dur,descr) in enumerate(SHOTS):
        src=CLIPS/file
        if not src.is_file():raise FileNotFoundError(str(src))
        info=ffprobe(src)
        total=float(info['format']['duration'])
        if total+0.03<dur:raise RuntimeError(f'Clip {file} has {total}s, needs {dur}s')
        fps_data.append({'clip':file,'source':f'https://www.pinterest.com/pin/{file.rsplit("_",1)[1].split(".")[0]}/',
                         'duration_used':dur,'duration_available':total,'description':descr,'rights':'not verified'})
    status(5,'إنشاء النصوص العربية المتحركة بخط Noto Kufi Arabic')
    write_ass()
    filelist=[]
    enc_time=[]
    for i,(filename,dur,desc) in enumerate(SHOTS):
        src=CLIPS/filename
        seg=WORK/f'ghorba_{i+1:02d}.mp4'
        current_duration=dur
        start=7 + i*8
        stage=f'تجهيز اللقطة {i+1}/7: {desc}'
        vf=(f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=bicubic,'
            f'crop={W}:{H},setsar=1,fps={FPS},'
            f'eq=contrast=1.06:saturation=0.95:brightness=-0.009,'
            f'fade=t=in:st=0:d=0.17,fade=t=out:st={max(0,dur-.17):.3f}:d=0.17,'
            f'format=yuv420p')
        cmd=['ffmpeg','-hide_banner','-y','-loglevel','error','-nostats','-progress','pipe:1',
             '-ss','0','-i',src,'-t',str(dur),'-vf',vf,'-an',
             '-c:v','libx264','-preset','ultrafast','-crf','24','-threads','2',
             '-r',str(FPS),'-pix_fmt','yuv420p','-movflags','+faststart',seg]
        t=run(cmd,start,7,stage)
        enc_time.append(t)
        filelist.append(f"file '{seg.as_posix()}'")
        status(start+7,f'اكتملت اللقطة {i+1}/7')
    (OUT/'concat.txt').write_text('\n'.join(filelist)+'\n',encoding='utf8')
    status(65,'دمج اللقطات + موشن الكتابة العربية + مزامنة الصوت')
    current_duration=48.0
    temp=OUT/'GHORBA_rendering.tmp.mp4'
    cmd=['ffmpeg','-hide_banner','-y','-loglevel','error','-nostats','-progress','pipe:1',
         '-f','concat','-safe','0','-i','concat.txt','-i',ORIGINAL,
         '-filter_complex','[0:v]ass=captions.ass,format=yuv420p[v]',
         '-map','[v]','-map','1:a:0','-t','48.0',
         '-c:v','libx264','-preset','veryfast','-crf','22','-threads','2',
         '-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','44100',
         '-movflags','+faststart','-metadata','title=الغربة | KOSIF Motion preview',
         temp]
    final_elapsed=run(cmd,64,31,'التصدير النهائي للفيديو والكتابة والصوت')
    status(96,'فحص مدة الفيديو وأبعاده والصوت والخطوط')
    data=ffprobe(temp)
    duration=float(data['format']['duration'])
    streams=data['streams']
    video=next((s for s in streams if s['codec_type']=='video'),None)
    audio=next((s for s in streams if s['codec_type']=='audio'),None)
    if not (47.8<=duration<=48.3 and video and audio and video.get('width')==W and video.get('height')==H):
        raise RuntimeError('QA failed '+json.dumps(data,ensure_ascii=False))
    os.replace(temp,OUTPUT)
    for n,at in enumerate([4,16,28,43]):
        image=FRAMES/f'shot_{n+1:02d}_{at}s.jpg'
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(at),
                        '-i',str(OUTPUT),'-frames:v','1',str(image)],stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL,timeout=25)
    report={
      'project':'Ghorba private 48s review preview',
      'output':str(OUTPUT),'render_verified':True,'media':data,'original_audio':str(ORIGINAL),
      'original_audio_sha256':source_hash,'audio_trim':'00:00-00:48','audio_preserved_original_unmodified':True,
      'scenes':fps_data,'captions':'original editorial overlay; NOT transcribed lyrics',
      'caption_file':str(OUT/'captions.ass'),'sources_used':'Pinterest videos, usage rights not verified',
      'render_commands_recorded_in':str(LOG),
      'runtime_seconds':{'segments':enc_time,'final':final_elapsed},
      'qa_frames':[str(x) for x in FRAMES.glob('*.jpg')],
    }
    (OUT/'production_receipt.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf8')
    status(100,'تم إنتاج المعاينة وفحصها — جاري فتح الفيديو الآن','done',
           {'duration':duration,'bytes':OUTPUT.stat().st_size,'receipt':str(OUT/'production_receipt.json')})
    try:
        os.startfile(OUTPUT)
    except Exception as exc:
        status(100,'الفيديو جاهز — افتحه بزر افتح الفيديو في الشريط','done',{'open_error':str(exc)})
    print('COMPLETE '+str(OUTPUT)+' '+str(round(duration,2))+'s',flush=True)
if __name__=='__main__':
    try:
        LOG.write_text('KOSIF Ghorba render started '+time.ctime()+'\n',encoding='utf8')
        main()
    except Exception as e:
        status(0,'خطأ بالتصدير: '+str(e),'failed',{'error':traceback.format_exc()})
        with LOG.open('a',encoding='utf8') as f:f.write('\n'+traceback.format_exc())
        print('RENDER_FAILED '+repr(e),flush=True)
        raise
