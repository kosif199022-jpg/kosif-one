import subprocess, concurrent.futures, json, sys
ids=['983051425071690194','312366924175787517','974044225659519047','47780446041246596','176695985377113586','253538654019175024','974044225659558829','228346643601270594','620089442480746358','739786676305545478','956663145816715443','613193305543122862','1125688869367996082','394557617374323837']
def probe(pid):
 url=f'https://www.pinterest.com/pin/{pid}/'
 try:
  r=subprocess.run(['yt-dlp','--ignore-config','--no-playlist','--skip-download','--socket-timeout','6','--retries','1','--print','%(duration)s|%(width)s|%(height)s|%(ext)s',url],capture_output=True,text=True,timeout=24)
  return dict(id=pid,success=r.returncode==0,probe=r.stdout.strip()[:120],error=r.stderr.strip().splitlines()[-1][-140:] if r.stderr.strip() else '')
 except Exception as e: return dict(id=pid,success=False,error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for result in ex.map(probe,ids): print(json.dumps(result,ensure_ascii=True),flush=True)
