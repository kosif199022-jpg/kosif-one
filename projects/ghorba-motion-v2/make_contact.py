from pathlib import Path
import subprocess, tempfile, json
from PIL import Image,ImageDraw,ImageFont
root=Path.home()/'Desktop'/'الاداة'
src=root/'img9502'/'media'
files=[p for p in src.rglob('*.mp4') if not p.name.endswith('.edit.mp4')]
files=files[:32]
out=root/'ghorba-motion-v2';out.mkdir(exist_ok=True)
W,H=192,342
canvas=Image.new('RGB',(W*8,H*4),'#11121b')
draw=ImageDraw.Draw(canvas)
for i,p in enumerate(files):
    target=out/f'frame_{i:02}.jpg'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','2','-i',str(p),'-frames:v','1','-vf','scale=192:310:force_original_aspect_ratio=increase,crop=192:310',str(target)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=25)
    if not target.exists(): continue
    im=Image.open(target);x=(i%8)*W;y=(i//8)*H
    canvas.paste(im,(x,y));draw.text((x+6,y+316),f'{i:02} {p.stem[:10]}',fill='white')
canvas.save(out/'video_contact.jpg',quality=82)
with open(out/'clip_manifest.json','w',encoding='utf-8') as f:json.dump([str(x) for x in files],f,ensure_ascii=False,indent=2)
print('CONTACT='+str(out/'video_contact.jpg'))
print('CLIPS='+str(len(files)))
