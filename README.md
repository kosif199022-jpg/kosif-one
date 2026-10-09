# KOSIF One (خصيف وان)

المستودع المرجعي الواحد لكل أدوات الأنيميشن والمونتاج والكلام من مجلد `الاداة`، مع المشاريع المرجعية الخمسة المرتبطة بها.
الغرض: تشتغل منه من مكان واحد، وأي طلب يتنفذ من الكود اللي هنا.

## الهيكل

| المسار | المحتوى |
|---|---|
| `tools/kosif-omni` | المكتبة الموحّدة: المهارات، الـ MCP server، المجلس، الـ corpus. |
| `tools/kosif-one` | الواجهة الموحّدة (KOSIF One): تخطيط الطلب وتوجيهه للمهارة المناسبة. |
| `tools/kosif-montage-motion` | مونتاج وموشن جرافيك (كوسيف مونتاج وموشن): صوت، ترجمة، تلوين، ريلز. |
| `tools/kosif-mimic` | المحاكاة: إعادة بناء فيديو مرجعي بلقطات جديدة. |
| `tools/kosif-social` | محتوى السوشيال: منشورات، كاروسيل، تقويم، أوقات النشر. |
| `tools/kosif-studio` | استوديو الرسم بالبكسل + KOSIF Motion. |
| `tools/kosif-web` | واجهة الويب. |
| `tools/kosif-think-live` | طبقة التفكير المباشر (Full Pro). |
| `tools/kosif-edge-build` | بناء الـ edge. ملفات SQL الضخمة (الأطلس) مستبعدة. |
| `projects/*` | مشاريع الأنيميشن (سكريبتات ومصادر فقط): محاكاة جمعة، تراتيل الغربة، واتساب موشن، مصر 2120، دعاء الخميس، دورة الماء، ... |
| `vendor/brag` | `/brag` لإنتاج فيديو إطلاق من موقع. المصدر: latent-spaces/brag |
| `vendor/scroll-world` | مهارة عالم السكرول. المصدر: oso95/scroll-world |
| `vendor/ai-design-skills` | مجموعة مهارات تصميم. المصدر: elayadesign/ai-design-skills |
| `vendor/mcp-higgsfield-landing` | مثال MCP لصفحة هبسفيلد. المصدر: midudev/mcp-higgsfield-landing |
| `vendor/hyperframes` | إطار HyperFrames لبناء فيديو من HTML. المصدر: heygen-com/hyperframes |

تفاصيل المصدر ورقم الـ commit لكل مشروع موجودة في [VENDOR.md](VENDOR.md).

## ما لم يُرفع (عن قصد)

- ملفات الميديا (mp4 / mp3 / wav / mov / gif) والصور الناتجة: حجمها يتعدى حدود GitHub وهي مخرجات، مش أدوات.
- الأرشيفات (zip / rar / 7z) ونسخ الأكواد النصية الضخمة (`الكل.txt`، `كود ...txt`، إلخ).
- ملفات الأطلس الضخمة `*.kpack` وملفات `atlas.sql`: موجودة في المستودع العام `kosif-atlas`. `kosif-omni` يحتاجها للعمل offline، فلو عايز تشغّله محلياً حمّلها من هناك.
- `node_modules`، `dist`، `.wrangler`، `__pycache__`، `outputs`، `out`.
- ملفات `.env` والمفاتيح. ما فيش أسرار في المستودع.
- مجلدات الإعداد `.claude` و `.agent` و `.agents`: مش جزء من الأدوات.

## الاستخدام

1. افتح المستودع وحدد الأداة من الجدول فوق.
2. كل أداة ليها `SKILL.md` أو `README.md` داخلها يقولك طريقة التشغيل.
3. الأدوات الخارجية (`vendor/`) محفوظة كمرجع بالشكل الأصلي مع ترخيصها، وممكن تتحدّث منها بنفس الـ commit المسجّل في `VENDOR.md`.

## تراخيص

- `vendor/brag`، `vendor/scroll-world`، `vendor/ai-design-skills`، `vendor/hyperframes`: كل واحد فيه ملف LICENSE الأصلي.
- `vendor/mcp-higgsfield-landing`: **لا يوجد ملف ترخيص في المصدر**. المستودع خاص، والنسخة هنا للاستخدام المرجعي فقط. ما تعيدش نشرها خارج المستودع الخاص من غير إذن صاحبها.
- باقي المجلدات (`tools/*`، `projects/*`) من إنتاج صاحب المستودع.
