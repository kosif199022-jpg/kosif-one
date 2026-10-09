# تثبيت KOSIF Omni — Claude و ChatGPT

> **KOSIF Omni** = إضافة واحدة جمعت كل ما في مجلدك: عائلة إضافات KOSIF (Think / Think Pro / A1990 / Do / Cognitive Core / Jev Browser / Release Bridge)، محرك «مجلس العباقرة» (1,040 عضوًا)، جسر واتساب، ومكتبة الـ prompts السينمائية (Dragon / Blue Jewel / Cinema AI / Omni-Sovereign / Black Camel) — مع **خادم MCP** فيه 44 أداة حتمية، وبحث عربي كامل النص في ملفاتك.
>
> كل الملفات الجاهزة للرفع في المجلد: `kosif-omni-dist\`

## 0) ما يحتاجه جهازك
- **Python 3.9+** (عندك 3.13). الأدوات الأساسية بدون مكتبات. لتحليل الصور/الصوت فقط: `pip install numpy pillow` (موجودتان عندك).
- لا شيء آخر. الخادم لا يتصل بالإنترنت ولا يرسل ملفاتك لأي جهة.

## 1) Claude Code (الأقوى — كل شيء يعمل: مهارات + أوامر + وكلاء + خادم MCP)
```text
/plugin marketplace add C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni
/plugin install kosif-omni@kosif
```
تجربة بدون تثبيت دائم: `claude --plugin-dir "C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni"`

بعد التثبيت جرّب: `/kosif-omni:doctor` ثم `/kosif-omni:kosif راجع هذه القيود المحاسبية…`
أوامر أخرى: `/kosif-omni:council` · `:cinema` · `:audit` · `:search-corpus` · `:fullpro`.

**تفعيل البحث في ملفاتك وأدوات الملفات** (يُضبط مرة واحدة كمتغيرات بيئة قبل تشغيل Claude):
```powershell
setx KOSIF_CORPUS_DIR "C:\Users\اغنام الوادي\Desktop\الاداة"
setx KOSIF_ALLOWED_DIRS "C:\Users\اغنام الوادي\Desktop\الاداة"
```
ثم أعد تشغيل Claude. بعدها اطلب: «ابحث في ملفاتي عن "Dragon Anatomy"». في اختباري على مجلدك الحقيقي (110 ملفًا، ≈ 250 MB): الفهرسة الأولى استغرقت بين 18 و52 ثانية (حسب كاش القرص)، حجم الفهرس ≈ 70 MB، ثم كل بحث ≈ 20–35 ms. الملفات المتطابقة (8 ملفات في مجلدك) تُفهرس مرة واحدة وتُذكر كنسخ مطابقة.

## 2) Claude Desktop
**الأدوات (MCP):** افتح `kosif-omni.mcpb` (انقر مرتين أو اسحبه إلى Settings → Extensions)، واختر مجلد الملفات المسموح ومجلد الـ corpus.
**المهارات:** Settings → Capabilities → Skills → ارفع الملفات من `claude-ai-skills\` (ابدأ بـ `kosif-omni.zip` ثم ما تحتاجه).
**بديل للـ MCP:** انسخ `claude\claude_desktop_config.snippet.json` إلى إعدادات Claude Desktop بعد تعديل المسارات.
> ملاحظة أمانة: حزمة `.mcpb` بُنيت وفُحصت محليًا (فك الضغط + تشغيل الخادم + مصافحة MCP + استدعاء أدوات)، لكني لم أستطع تثبيتها داخل تطبيق Claude Desktop نفسه من هنا. إن رفض التطبيق الملف فالبديل المضمون هو `claude_desktop_config.snippet.json`.

## 3) claude.ai (الويب) / Claude Project
1. أنشئ Project والصق `claude-project\project-instructions.md` في التعليمات.
2. ارفع مهارات من `claude-ai-skills\` (على الأقل `kosif-omni.zip`).
3. (اختياري) لو شغّلت الخادم على HTTPS أضِفه كـ custom connector على العنوان `https://<host>/mcp` مع الـ token.

## 4) ChatGPT — طريقتان
### أ) الإضافة (نفس شكل ملفات plugin (N).zip التي رفعتها سابقًا)
ارفع `kosif-omni-chatgpt-plugin.zip` بنفس الطريقة التي رفعت بها `plugin (14..23).zip`. تحتوي: `plugin.json` + `.codex-plugin/plugin.json` + `.app.json` (شبكة الـ 72 تطبيقًا الاختيارية) + `mcp.json` (يربط خلفية `kosif-think` على Cloudflare التي تعمل — اختبرتُها: ترد 405 على GET وهو المتوقع لـ streamable-HTTP) + `skills/`.
اسمها `kosif-omni` فلا تتعارض مع `kosif-think-pro` ولا مع الـ app المربوط في إضافة KOSIF Think v2.2.1 (لم ألمس ذلك الربط).

### ب) GPT مخصص + Actions (يعطيك الأدوات الـ 45 الحتمية داخل ChatGPT)
1. شغّل الخادم على جهازك أو سيرفرك:
   ```powershell
   python "C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni\mcp-server\run.py" --http --token <رمز-عشوائي-طويل> --workspace "C:\Users\اغنام الوادي\Desktop\الاداة" --corpus "C:\Users\اغنام الوادي\Desktop\الاداة"
   ```
   (يربط على `127.0.0.1:8765` فقط. بدون `--token` يولّد رمزًا ويطبعه مرة واحدة.)
2. ضعه خلف **HTTPS** (Cloudflare Tunnel أو reverse proxy). لا تعرض منفذ HTTP مباشرة.
3. ChatGPT → Create a GPT → Configure: الصق `custom-gpt\instructions.md` (≤ 8000 حرف)، ارفع ملفات `custom-gpt\knowledge\`، وفي Actions استورد `custom-gpt\openapi.json` بعد استبدال `servers[0].url` بعنوانك (أو استورده من `https://<host>/openapi.json`)، والمصادقة: **API Key → Bearer** بالرمز.
4. يوجد أيضًا endpoint بروتوكول MCP على `/mcp` لتضيفه كـ connector في وضع المطور.

الـ GPT لا يملك خلفية KOSIF السرية ولا Secure Executor، فهو يعمل بمستوى «Local» ويصرّح بذلك — ولن يدّعي أن 500 خبير نُفّذوا.

## 4.5) مكتبة المهارات على Cloudflare (بدون أي تثبيت)
خدمة مستضافة اسمها `kosif-atlas-api` تبحث في 14,793 مهارة، وتختار المناسبة منها بحكم Jev، ثم تعيد طريقة عملها جاهزة. تفهم العربية، ولا تحتاج تشغيل أي شيء على جهازك:

| أين | ماذا تضيف |
|---|---|
| **ChatGPT — GPT مخصص** | Actions ← Import from URL: `https://kosif-atlas-api.kosif199022.workers.dev/openapi.json`، والمصادقة: None |
| **ChatGPT — Connectors (وضع المطوّر)** | عنوان MCP: `https://kosif-atlas-api.kosif199022.workers.dev/mcp` |
| **claude.ai — Custom connector** | العنوان نفسه: `https://kosif-atlas-api.kosif199022.workers.dev/mcp` |

جرّب: «اختر لي أفضل مهارة لتحويل فواتير PDF إلى إكسل». ستعمل أداة `skill_select` وترجع المهارة مع طريقة استخدامها.

في **Claude Code** لا تحتاج إضافة شيء: الأداة المحلية `kosif_skill_auto` تفعل الشيء نفسه، وتضيف إليه المهارات الـ 46 المدمجة في KOSIF.

## 5) جسر واتساب (اختياري)
`modules\whatsapp-bridge\` كما هو (بدون أي تعديل على سياساته: إرسال يدوي مؤكد فقط). اتبع `README.md` هناك. مهارة `kosif-whatsapp` تفرض بروتوكول التأكيد قبل كل إرسال.

## 6) تحقق من أن كل شيء سليم
```powershell
python "C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni\mcp-server\run.py" --list-tools
python -m unittest discover -s "C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni\mcp-server\tests"
python "C:\Users\اغنام الوادي\Desktop\الاداة\kosif-omni\tools\build.py"   # يعيد بناء kosif-omni-dist\ ويتحقق منه
```

## ماذا غيّرتُ في سلوك الإضافات الأصلية (لتعمل في Claude أيضًا)
- كتلة «Mandatory 5.4 entry override» في 5 مهارات كانت **إلزامية دائمًا** وتفشل بـ `FULL_PRO_BLOCKED_CAPABILITY_GAP` خارج ChatGPT؛ صارت **مشروطة بطلب Full Pro صريح**، ولها مسار «المحرك المحلي» الصادق (`LOCAL_ENGINE`).
- تم توحيد المهارات المكررة في الإضافات العشر (14/17 و15/18 متطابقتان بايت-ببايت) واستُبدلت `cognitive-core` بنسخة 1.8.1 مع الاحتفاظ بملفاتها الفريدة.
- لم أُدخل «Dark Psychology / Mind Reading / Profiling» كقدرة (تحليل أشخاص حقيقيين والتأثير عليهم)؛ بقي علم النفس لغرض الشخصيات الروائية وفهم الجمهور فقط.
