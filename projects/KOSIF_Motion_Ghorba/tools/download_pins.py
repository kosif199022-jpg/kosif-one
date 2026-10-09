from pathlib import Path
import subprocess, json, concurrent.futures, os, time
root=Path.home()/'Desktop'/'الاداة'/'KOSIF_Motion_Ghorba'
out=root/'pinterest_new';out.mkdir(parents=True,exist_ok=True)
pins={'983051425071690194':'plane_sunrise','974044225659519047':'night_drive','47780446041246596':'rain_window','176695985377113586':'lonely_rain','228346643601270594':'airport_pov','620089442480746358':'night_road','1125688869367996082':'rain_cinema','592082682294635799':'plane_window','394557617374323837':'walking_rain'}
def one(row):
 pid,label=row;path=out/(label+'_'+pid+'.mp4');url='https://www.pinterest.com/pin/'+pid+'/'
 try:
  if not path.is_file():
   cmd=['yt-dlp','--ignore-config','--no-playlist','--quiet','--no-warnings','--socket-timeout','10','--retries','2','--max-filesize','70M','-f','b[ext=mp4][height<=1920]/b[height<=1920]/b','-o',str(path),url]
   s=subprocess.run(cmd,capture_output=True,text=True,timeout=95)
   if s.returncode: return {'id':pid,'label':label,'error':s.stderr[-200:]}
  if not path.exists():return {'id':pid,'error':'missing'}
  pr=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height','-of','json',str(path)],capture_output=True,text=True,timeout=20)
  info=json.loads(pr.stdout)
  rec={'id':pid,'label':label,'url':url,'file':str(path),'bytes':path.stat().st_size,'duration':round(float(info.get('format',{}).get('duration',0)),2),'streams':info.get('streams',[]),'rights':'unverified'}
  return rec
 except Exception as e: return {'id':pid,'label':label,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
 futures=[ex.submit(one,x) for x in pins.items()]
 res=[]
 for future in concurrent.futures.as_completed(futures):
  obj=future.result();res.append(obj);print(json.dumps(obj,ensure_ascii=True),flush=True)
(out/'manifest.json').write_text(json.dumps(res,indent=2,ensure_ascii=False),encoding='utf-8')
print('DONE '+str(sum('file' in x for x in res))+'/'+str(len(res)),flush=True)
