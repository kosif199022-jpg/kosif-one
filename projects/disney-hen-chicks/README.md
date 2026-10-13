# الدجاجة والكتاكيت: تحويل الأسلوب بـ AnimeGANv3

تحويل ريل الدجاجة والكتاكيت (IMG_9667.MP4، ‏464×848، ‏60 ثانية) لأسلوب أفلام الأنيميشن المرسومة باستخدام
[AnimeGANv3_Portrait_Inference](https://github.com/TachibanaYoshino/AnimeGANv3_Portrait_Inference).

## ليه سكريبت خاص بدل `onnx_infer.py`؟

`onnx_infer.py` في المستودع الأصلي بيشغّل كاشف وجوه **بشرية** (RetinaFace) على كل فريم، ويحوّل الوجوه لوحدها
ويلصقها على الصورة. الشخصيات هنا طيور، فالكاشف ما بيلاقيش وجوه (أو بيلقط غلط في لقطة قريبة).
`animegan_video.py` بيشغّل نفس مسار `--background` (تحويل الفريم كله) بنفس المعالجة القبلية والبعدية بالظبط،
من غير الكاشف، ومن غير ما الفريمات تنكتب على الديسك. الصوت الأصلي بيرجع زي ما هو.

## التشغيل

```bash
pip install -r requirements.txt          # + ffmpeg
mkdir -p models
curl -L -o models/Ghibli_c1.onnx \
  https://github.com/TachibanaYoshino/AnimeGANv3_Portrait_Inference/releases/download/1.0/AnimeGANv3_large_Ghibli_c1_e299.onnx

python animegan_video.py IMG_9667.MP4 models/Ghibli_c1.onnx -o out/hen_ghibli.mp4 --out-size 1080x1976
python animegan_video.py IMG_9667.MP4 models/Ghibli_c1.onnx -o out/compare.mp4 --compare   # الأصلي | المحوَّل
```

السرعة على CPU بأربع أنوية: حوالي 1.7 فريم/ثانية عند 464×848 (الفيديو كله حوالي 18 دقيقة). على GPU أسرع بكتير
(`pip install onnxruntime-gpu`).

## الموديلات

| الموديل | المصدر | النتيجة على الريل |
|---|---|---|
| `AnimeGANv3_large_Ghibli_c1_e299.onnx` | release `1.0` في AnimeGANv3_Portrait_Inference (مجاني) | **الأقرب**: ألوان مسطحة وناعمة، شكل رسم يدوي |
| `AnimeGANv3_Hayao_36.onnx` / `AnimeGANv3_Shinkai_37.onnx` | release `v1.1.0` في AnimeGANv3 (مجاني) | تغيير خفيف، بيفضل شكل 3D |
| `AnimeGANv3_JP_face.onnx` | Hugging Face `vumichien/AnimeGANv3_JP_face` | بيبهّت الألوان، مش مناسب |
| **Disney / USA** (v2.0) | **مدفوع** على Patreon صاحب المستودع | مش متاح للتحميل العام. لو اشتريته: مرّر ملف الـ onnx لنفس السكريبت |

## الترخيص

موديلات AnimeGANv3 للاستخدام **غير التجاري** فقط. لأي استخدام تجاري (قناة عليها إعلانات مثلاً) لازم تراسل صاحب
المستودع وتاخد إذن مكتوب.
