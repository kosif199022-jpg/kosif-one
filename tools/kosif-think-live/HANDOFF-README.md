# ملف تسليم KOSIF للمبرمج: الإصلاحات والمقترحات (الإصدار v2)

> **ابدأ بقراءة `CHANGES-2026-10-03.md`.** فيه الخط الزمني لكل عمليات النشر وكل تغيير بالتفصيل.
> **الخادم الحي الآن:** 0.26.1 + أرشيف الطلبات، ورقم النسخة على Cloudflare `43570017-e3a6-438f-b0c5-2e6fe1a01a6a`. الكود الحالي في `runtime/current-live-43570017/worker.js`.
> ما يلي هو تقرير v1، ويبقى صالحاً كخلفية. الأقسام التي تذكر 0.25.2 أو `7fb61c47` تاريخية.

**التاريخ:** 2026-10-03
**المُعِدّ:** Claude Code (جلسة مع صاحب الأداة)

> لا يحتوي هذا الملف المضغوط على أي سر: لا مفاتيح API، ولا Tokens، ولا HMAC، ولا بيانات OAuth. الموجود أسماء الـbindings فقط.

---

## 1) الروابط

| العنصر | الرابط / المعرّف |
|---|---|
| الأداة داخل ChatGPT | https://chatgpt.com/plugins/plugins_6ac01ae1132c8191a7187851b124b6d4 |
| Runtime الرئيسي | https://kosif-think-mcp.kosif199022.workers.dev/ |
| Health | https://kosif-think-mcp.kosif199022.workers.dev/health |
| MCP (الإصدار الحالي) | https://kosif-think-mcp.kosif199022.workers.dev/mcp/v0.22.3 |
| مسارات التوافق | `/mcp/v0.18.8`، `/mcp/v0.18.7`، `/mcp/v0.18.6`، والقديم `/mcp/v0.9.3` |
| OAuth metadata | https://kosif-think-mcp.kosif199022.workers.dev/.well-known/oauth-protected-resource |
| Auth0 issuer | https://dev-zn5bwigg38b13ui8.us.auth0.com/ |
| GitHub (مصدر الـruntime، **قديم: 0.18.6**) | https://github.com/kosif199022-jpg/cloude |
| Workers الأساسية | `kosif-think-mcp`، `kosif-full-pro-secure-executor`، `kosif-jev` |
| Queue | `kosif-full-pro-jobs` (id `5f0be1bc7b054ec9b67053b87db18e21`) |
| KV | `FULL_PRO_STATE` (id `73018fa44d384876a74210051a7df291`) |
| Cloudflare account | `9ff3d8494afab356ecbf95a2a231a6b5` |
| مستودعات مرتبطة | `kosif-audit-studio`، `whatsapp-personal-bridge`، `think`، `see` (كلها تحت `kosif199022-jpg`) |
| إضافة Claude/ChatGPT الموحدة | المجلد `kosif-omni/` داخل هذا الملف، والحزم الجاهزة للتثبيت في `kosif-omni-dist/` |

---

## 2) ما تم إصلاحه

### أ) على الخادم الحي (منشور، بموافقة المالك)

**المشكلة:** كل سؤال نصي في Full Pro كان يُرفض عند الاستقرار بالخطأ `C500_FINAL_STABILITY_NOT_PASS`، ولا يعيد أي جواب. حدث ذلك في تجربتين حقيقيتين، كلٌّ منهما 500/500 خبير و7/7 آينشتاين.

**السبب:** الإصدار الحي 0.25.2 فيه مسار نصي كامل:
- `fullProStart` يقبل `executor:"text"`.
- `c500TextFinalize`، ومعه اختبار استقرار نصي وبوابات نصية و`text_result`.

لكن البوابة العامة `kosif_full_pro_execute` كانت ترفض أي `executor` غير `"image"`. فكل سؤال نصي كان يمر بمسار الصورة (SceneSpec + "قابلية الرسم") فيُرفض.

**الإصلاح:** 5 تعديلات في `fullProExecuteGateway` ومخطط الأداة (الملف `patches/01-gateway-text-executor.DEPLOYED.diff`):
- صار المخطط يقبل `executor: ["image","text"]`.
- في الطلب النصي تُضبط `visual` على `false`، كما يفعل `fullProStart`.
- قيمة `executor` تنتقل كما هي إلى `fullProStart` وإلى `next_action`.
- الطلب النصي المكتمل يعيد `text_result` و`final_answer` مع `host_directive:"FULL_PRO_COMPLETE_TEXT_RESULT"`، دون اشتراط صورة.

**التحقق:**
- `test/gateway-text.test.mjs`: نجحت 5 من 5 على النسخة المعدّلة. على النسخة الأصلية فشلت 3 اختبارات النص ونجح اختبارا الصورة.
- بعد النشر: `/health` سليم. الـbindings والسر وإعدادات مستهلك الطابور مطابقة تماماً لما قبل النشر (`settings.json` مقابل `settings.after.json`، و`queue-consumers.json` مقابل `queue-consumers.after.json`).

**الرجوع عن الإصلاح:**
```bash
npx wrangler rollback ccec714b-82d3-42e0-8270-51e2db5ede6f --name kosif-think-mcp
```

**طريقة الاستخدام:** `kosif_full_pro_execute` مع `{"executor":"text", "confirmed_full_pro":true, ...}`.

### ب) في إضافة `kosif-omni` (محلياً، والتفاصيل في `kosif-omni/CHANGELOG.md` تحت Unreleased)

1. **`kosif_delivery_gate` كانت تمنع الإضافة نفسها (BLOCK 0)** بسبب 6 إنذارات كاذبة. صارت تمر (PASS 100) بعد إضافة علامة `kosif-scan: ignore` على أسطر عيّنات الاختبار، ومعها اختباران جديدان.
2. **`kosif_risk_gate` كانت تمرّر الأفعال الخطرة عند الشك:**
   - أي `side_effect` غير معروف (مثل إرسال واتساب) كان يمر بـ PASS بلا موافقة.
   - مخطط MCP لم يكن يعلن الحقول، فكانت القيم المنطقية تصل بلا نوع.
   - الإصلاح: قائمة قيم ثابتة لـ`side_effect`، ورفع الأفعال الصادرة (إرسال/نشر) تلقائياً إلى `external-write`، وتحويل القيم النصية `"true"`/`"false"` إلى قيم منطقية. صار الاختبار الذاتي 19/19.
3. **حارس Full Pro المحلي (`host_entry.py`)** كان يرفض حتى أدوات القراءة. صارت الأدوات التي يعلنها السجل للقراءة فقط تُسمح كـ `EVIDENCE` ولا تُحسب تنفيذاً. أدوات التنفيذ ما زالت ممنوعة.
4. اختبارات الإضافة: 57/57.

---

## 3) نتائج التشخيص (مهمة قبل أي تعديل)

1. **الخادم لا يتوقف.** الطابور يعالج الخبراء الـ500 خلال 6 إلى 9 دقائق، والسلسلة كاملة في نحو 25 إلى 28 دقيقة. إذا قُرئت الحالة بعد ثوانٍ من البدء فستظهر `0/500`، وهذا طبيعي.
2. **رسالة "سجّل الدخول مرة أخرى" ليست انتهاء صلاحية.**
   - الأدوات العامة (`PUBLIC_TOOLS`) تعمل بلا تسجيل دخول أصلاً.
   - الأدوات غير العامة، مثل `kosif_full_pro_status`، تفشل من أول استدعاء.
   - السبب المرجّح: `audienceMatches` تشترط `aud` بلا `/` في آخره، بينما Claude Code يطلب العنوان مع `/`.
   - تنبيه: `kosif_think` أداة عامة، فنجاحها لا يُثبت تسجيل الدخول.
3. **GitHub متأخر 7 إصدارات** (0.18.6 مقابل 0.25.2 الحي)، و`wrangler.think.toml` فيه لا يحتوي Queue ولا KV ولا services. **لا تنشر من GitHub.**
4. **جهة أخرى تنشر على نفس الخادم** (3 عمليات نشر يوم 2026-10-03، غالباً من ChatGPT). قبل أي نشر: نزّل الكود الحي، وتأكد أنه لم يتغير، ثم انشر.
5. **أين يذهب الوقت** في تشغيل مدته 28 دقيقة:

| المرحلة | الوقت تقريباً |
|---|---|
| الخبراء | نحو 6 دقائق |
| **المجموعات الدلالية الـ20 (واحدة في كل خطوة طابور)** | **نحو 10 إلى 13 دقيقة** |
| Jev والمراجعة | نحو 3 دقائق |
| آينشتاين (7 مراحل تسلسلية) | نحو 3 دقائق |
| الاستقرار | نحو 1.5 دقيقة |

---

## 4) المقترحات (مرتبة حسب الأولوية)

| # | المقترح | الحالة | الأثر |
|---|---|---|---|
| P1 | رفع الكود الحي `src/worker.js` و`wrangler.toml` إلى GitHub (`think-mcp/`) فوراً | يدوي | يمنع ضياع الإصلاح إذا نشر أحد من نسخة قديمة |
| P2 | تشغيل المجموعات الـ20 بدفعات من 5 (`patches/02-clusters-parallel.PROPOSED.diff`) | رقعة جاهزة ومختبرة محلياً، **غير منشورة** | توفير نحو 8 إلى 10 دقائق |
| P3 | قبول `aud` مع `/` أو بدونه، وإضافة `offline_access` (`patches/03-auth-audience-slash.PROPOSED.diff`). وفي Auth0: تفعيل Allow Offline Access، وتفويض تطبيقات الطرف الثالث في الـAPI | رقعة جاهزة، **غير منشورة** | يحل حلقة "سجّل الدخول مرة أخرى" |
| P4 | معالجة عدة خبراء في كل دفعة طابور (`max_batch_size` أكبر مع `Promise.all` داخل `fullProQueue`). انتبه أن `return` بعد `c500_fanout` يُسقط بقية الدفعة | تصميم فقط | مرحلة الخبراء من 6 دقائق أو أكثر إلى 1 أو 2 تقريباً |
| P5 | عرض `final_stability_receipts` (`noul_probability` و`choice` والسبب) والمرشح المجمّد في الاستجابة العامة عند `blocked_stability` | تصميم | يجعل الرفض قابلاً للتشخيص |
| P6 | تحسين تنوع الخبراء: `unique_proposal_ratio` كانت 0.29 في سؤال أمريكا، أي أن مقترحات كثيرة متكررة | تصميم | جودة أعلى |
| P7 | إضافة مجال "التاريخ" والمعرفة العامة لمكتبة المجلس (1,040 عضواً) وللموجّه `kosif_route` | إضافة | الأسئلة المعرفية تحصل على خبراء مناسبين |
| P8 | الإضافة تستدعي `python`، وقد لا يوجد على macOS ولينكس إلا `python3` (في `.mcp.json` و`.mcpb`) | يدوي | قابلية التثبيت على أنظمة أخرى |
| P9 | `secure_executor_self_test.py` معطّل (يستورد `test_host_entry` غير الموجود)، و`regression_self_test.py` فيه 5 إخفاقات قديمة (فحوصات v4) | تنظيف | |
| P10 | توثيق في الإضافة: Full Pro يستغرق نحو 25 دقيقة، وتُتابع حالته بنفس `request_id` عبر `kosif_full_pro_execute` | توثيق | يمنع التشخيص الخاطئ "توقف عند 0/500" |

---

## 5) محتويات الملف المضغوط

| المسار | المحتوى |
|---|---|
| `HANDOFF-README.md` | هذا الملف |
| `KOSIF-THINK-fixes-for-programmer.md` | التحليل التقني المفصل (بالإنجليزية) |
| `kosif-think-runtime/live/worker.0.25.2.orig.js` | الكود الحي قبل الإصلاح بالضبط، sha256 `3fb5cbe8c3665bd8f22759ca74abdb0ba21bb5678a584c58df0a5e8c300b6a43` |
| `kosif-think-runtime/src/worker.js` | الكود المنشور الآن (0.25.2 مع إصلاح البوابة) |
| `kosif-think-runtime/proposed/` | نسخ كاملة للمقترحين P2 وP3، غير منشورة |
| `kosif-think-runtime/patches/` | فروقات (diff) الإصلاح المنشور والمقترحات |
| `kosif-think-runtime/test/` | اختبارات البوابة. التشغيل: `npm i && npm test` (لاختبار ملف آخر: `WORKER=../proposed/x.js`) |
| `kosif-think-runtime/wrangler.toml` | إعداد نشر مطابق للحي (bindings + إعدادات مستهلك الطابور). السر `KOSIF_THINK_TOKEN` غير موجود فيه، وCloudflare يحتفظ به |
| `kosif-think-runtime/live/*.json` | إعدادات Cloudflare قبل النشر وبعده (أسماء فقط) |
| `kosif-omni/` | مصدر الإضافة الموحدة (Claude + ChatGPT) مع الإصلاحات |
| `kosif-omni-dist/` | الحزم الجاهزة للتثبيت: Claude Code zip، وChatGPT plugin zip، و`.mcpb`، وCustom GPT |
| `evidence/` | حالات التشغيلات الحقيقية (JSON) وسكربت المتابعة `poll_fullpro.sh` |

**خطوات النشر الآمن:**
1. نزّل الكود الحي، وقارنه بـ `src/worker.js`.
2. شغّل `npm test`.
3. شغّل `npx wrangler deploy --dry-run`، وقارن الـbindings.
4. شغّل `npx wrangler deploy`.
5. تحقق من `/health` وإعدادات مستهلك الطابور.
