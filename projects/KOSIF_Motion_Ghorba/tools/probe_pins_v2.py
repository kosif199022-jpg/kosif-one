from concurrent.futures import ThreadPoolExecutor
import subprocess,json
ids=['59039445106607841','733594226788852897','991777149174525702','1028931846090881597','940407965914061130','379709812345392353','720998221629665062','69102175528019793','69102175528058302','670543832046383087','432134526762171319','956663145816848811','854980310485674186','800444533803832627','350084571021055465','259871840992846730','707839266449059758','797770521519001026','215328425927248984','991777149174525702']
def one(id):
 try:
  s=subprocess.run(['yt-dlp','--ignore-config','--no-playlist','--skip-download','--socket-timeout','6','--retries','1','--print','%(duration)s|%(width)s|%(height)s|%(ext)s|%(title).45s','https://www.pinterest.com/pin/'+id+'/'],capture_output=True,text=True,timeout=18)
  return {'id':id,'good':s.returncode==0,'fmt':s.stdout.strip()[:120]}
 except Exception as e:return {'id':id,'good':False,'error':str(e)}
with ThreadPoolExecutor(max_workers=7) as pool:
 for x in pool.map(one,ids):print(json.dumps(x),flush=True)
