"""KOSIF Motion progress window, reads real render progress from progress.json."""
from pathlib import Path
import json, tkinter as tk
from tkinter import ttk
import subprocess
from datetime import datetime

ROOT=Path(__file__).resolve().parents[1]
STATUS=ROOT/'progress.json'
HEARTBEAT=ROOT/'progress_window_heartbeat.txt'
def read():
    try: return json.loads(STATUS.read_text(encoding='utf-8'))
    except Exception: return {'percent':0,'stage':'تجهيز المشروع...','state':'waiting'}

app=tk.Tk()
app.title('KOSIF MOTION | الغربة')
app.configure(bg='#10182a')
app.geometry('560x215+760+35')
app.resizable(False,False)
app.attributes('-topmost',True)
try: app.iconbitmap(default='')
except Exception: pass
frame=tk.Frame(app,bg='#10182a',padx=20,pady=13)
frame.pack(fill='both',expand=True)
title=tk.Label(frame,text='KOSIF Motion  •  مشروع الغربة',font=('Segoe UI',15,'bold'),
               bg='#10182a',fg='#f5f7ff',anchor='e')
title.pack(fill='x')
tk.Label(frame,text='مونتاج 9:16  |  الصوت الأصلي  |  لقطات Pinterest  |  نص عربي متحرك',
         font=('Segoe UI',9),bg='#10182a',fg='#8ab7d8',anchor='e').pack(fill='x')
pct=tk.StringVar(value='0%')
tk.Label(frame,textvariable=pct,font=('Segoe UI',20,'bold'),
         bg='#10182a',fg='#8ce9d2',anchor='w').pack(fill='x',pady=(5,0))
style=ttk.Style()
style.theme_use('clam')
style.configure('Kosif.Horizontal.TProgressbar',troughcolor='#273248',
                background='#76e4d6',lightcolor='#76e4d6',darkcolor='#76e4d6',
                bordercolor='#273248',thickness=16)
bar=ttk.Progressbar(frame,orient='horizontal',mode='determinate',
                    maximum=100,style='Kosif.Horizontal.TProgressbar')
bar.pack(fill='x',pady=(0,7))
message=tk.StringVar(value='جاري تجهيز المونتاج...')
tk.Label(frame,textvariable=message,font=('Segoe UI',10),bg='#10182a',
         fg='#eff5ff',anchor='e',justify='right').pack(fill='x')
buttons=tk.Frame(frame,bg='#10182a')
buttons.pack(fill='x',pady=(4,0))
def open_file():
    status=read()
    video=Path(status.get('output',''))
    if video.is_file():
        subprocess.Popen(['explorer.exe',str(video)])
btn=tk.Button(buttons,text='افتح الفيديو',command=open_file,
              bg='#3f5c8a',fg='white',font=('Segoe UI',10),relief='flat')
btn.pack(side='left')
btn.config(state='disabled')
tk.Button(buttons,text='إغلاق الشريط',command=app.destroy,
          bg='#26344c',fg='white',font=('Segoe UI',9),relief='flat').pack(side='right')
last=None
def tick():
    global last
    s=read()
    value=min(100,max(0,int(s.get('percent',0))))
    bar['value']=value
    pct.set(f'{value}%')
    message.set(str(s.get('stage','...')))
    state=s.get('state','waiting')
    if state=='done':
        btn.config(state='normal')
        pct.set('100% ✓')
    elif state=='failed':
        pct.set(str(value)+'% ⚠')
    try: HEARTBEAT.write_text(datetime.now().isoformat()+' '+state+' '+str(value),encoding='utf8')
    except Exception: pass
    app.after(650,tick)
tick()
app.mainloop()
