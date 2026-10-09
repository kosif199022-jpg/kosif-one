from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,json
root=Path(__file__).resolve().parents[1]
src=root/'pinterest_new'
out=root/'renders'/'source_contact.jpg'
files=sorted(src.glob('*.mp4'))
W,H=240,450
im=Image.new('RGB',(W*7,H*2),(14,18,26));draw=ImageDraw.Draw(im)
for i,file in enumerate(files):
    p=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(file)],capture_output=True,text=True)
    duration=float(p.stdout.strip() or 3)
    for j,at in enumerate([min(1.5,duration*.2),min(duration*.63,duration-0.2)]):
        jpg=root/'renders'/f'src_{i}_{j}.jpg'
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(at),'-i',str(file),'-frames:v','1','-vf','scale=240:420:force_original_aspect_ratio=increase,crop=240:420',str(jpg)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        if jpg.exists():
            x=i*W;y=j*H
            im.paste(Image.open(jpg),(x,y));draw.text((x+5,y+424),file.stem[:27],fill=(220,240,255))
im.save(out,quality=80)
print('SHEET='+str(out))
