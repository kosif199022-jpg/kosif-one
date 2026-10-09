# JEV WhatsApp Bridge

جسر صغير للإرسال اليدوي من ChatGPT إلى WhatsApp Web عبر خادم يملكه المستخدم.

## حدود الإصدار الأول

- الإرسال يبدأ بطلب صريح يحدد الرسالة والأرقام.
- لا توجد ردود تلقائية، ولا قراءة محادثات، ولا بحث في جهات الاتصال، ولا إرسال للمجموعات.
- الحد الأقصى 20 رقماً في الطلب، مع فاصل زمني بين الرسائل.
- جلسة WhatsApp تُقرن مرة عبر QR وتُحفظ في `SESSION_DIR`.
- كل طلب يحتاج `requestId` ثابتاً حتى لا تؤدي إعادة المحاولة إلى رسالة مكررة.

أتمتة WhatsApp Web غير رسمية قد تخالف شروط المنصة أو تعرض الحساب للتقييد. استخدم الحساب المملوك لك، والأرقام التي وافقت على استقبال الرسائل، وحجماً منخفضاً. للاستخدام التجاري واسع النطاق استخدم WhatsApp Cloud API الرسمي.

## التشغيل المحلي والاختبارات

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
npm test
npm run check
```

تعطيل تنزيل Chromium مناسب للاختبارات المحلية فقط؛ تشغيل WhatsApp الحقيقي يحتاج متصفح Chromium صالحاً على الخادم.

## إعداد الخادم

```bash
cp .env.example .env
openssl rand -hex 32
chmod 640 .env
npm ci --omit=dev
```

ضع ناتج `openssl rand -hex 32` في `BRIDGE_API_TOKEN` داخل `.env`. لا ترسل الرمز في المحادثة ولا تضعه داخل ملف OpenAPI أو Git.

القيم المهمة:

- `SESSION_DIR`: مكان جلسة WhatsApp الدائمة.
- `REQUEST_STORE_PATH`: سجل idempotency؛ لا يحتوي نص الرسالة.
- `MAX_RECIPIENTS_PER_REQUEST`: افتراضياً 20.
- `SEND_DELAY_MS`: افتراضياً 2500 مللي ثانية.

إذا ظهر خطأ Chromium عند التشغيل، ثبّت متصفحاً متوافقاً بحساب الخدمة فقط، مثلاً `npx puppeteer browsers install chrome` بعد التحقق من مسار Puppeteer المثبت، ثم عالج مكتبات النظام التي يذكرها الخطأ. لا تشغّل الخدمة كـ root.

## الإقران عبر QR وPM2

```bash
pm2 start ecosystem.config.cjs
pm2 logs jev-whatsapp-bridge
pm2 status
pm2 save
```

سيظهر QR في سجل الطرفية أول مرة. افتح WhatsApp في الهاتف: **الأجهزة المرتبطة → ربط جهاز** ثم امسح QR. انتظر الحالة `ready`.

## فحص الحالة والإرسال

نفّذ من جهاز مصرح له وبعد وضع الرمز في متغير محلي، ولا تضع الرمز في سجل الأوامر إن كان ذلك غير مناسب:

```bash
export BRIDGE_API_TOKEN='ضع الرمز محلياً هنا فقط'
curl -fsS http://127.0.0.1:8787/healthz
curl -fsS -H "Authorization: Bearer $BRIDGE_API_TOKEN" \
  http://127.0.0.1:8787/v1/whatsapp/status
```

اختبار الإرسال يجب أن يكون إلى رقم حقيقي وافق على الاستقبال، مع استبدال الرقم والرسالة:

```bash
curl -fsS -X POST http://127.0.0.1:8787/v1/whatsapp/send \
  -H "Authorization: Bearer $BRIDGE_API_TOKEN" \
  -H 'Content-Type: application/json' \
  --data '{"recipients":["0551234567"],"message":"رسالة اختبار بعد الموافقة","requestId":"req-test-1234"}'
```

الاستجابة تحتوي نتيجة كل مستلم، والرقم يكون مخفياً عدا آخر أربعة أرقام. إعادة الطلب نفسه بنفس `requestId` تعيد النتيجة المحفوظة ولا ترسل مرة ثانية.

## HTTPS وربط ChatGPT

اربط الخدمة خلف نطاق HTTPS عبر reverse proxy أو tunnel معتمد. لا تعرض منفذ Node مباشرة للإنترنت. استخدم ملف `docs/chatgpt-action-openapi.yaml`، واستبدل عنوان الخادم الخيالي بعنوان HTTPS الفعلي قبل استيراده في Action.

في إعداد Action:

1. استورد OpenAPI.
2. اختر Bearer authentication وأدخل الرمز من `.env` في خانة الأسرار الخاصة بـAction.
3. اجعل التعليمات تطلب الأرقام والرسالة وتعرضها للمستخدم وتطلب تأكيداً صريحاً قبل `sendWhatsAppMessage`.

لا تضع الرمز في رسالة عادية أو في تعليمات عامة قابلة للعرض.

## تدوير الرمز والإيقاف

```bash
openssl rand -hex 32
chmod 640 .env
pm2 restart jev-whatsapp-bridge --update-env
```

للإيقاف الآمن استخدم `pm2 stop jev-whatsapp-bridge`. لا تحذف `SESSION_DIR` إلا إذا أردت إلغاء جلسة WhatsApp وإعادة QR من البداية.

## استكشاف الأخطاء

- `qr_required`: امسح QR من الهاتف، ولا تنسخ محتوى QR إلى السجلات أو المحادثة.
- `auth_failure`: ألغِ جلسة الجهاز المرتبط من الهاتف، أوقف الخدمة، ثم شغّلها واقرن QR جديداً.
- `disconnected`: تحقق من الهاتف والاتصال ثم راقب `pm2 logs`.
- `WHATSAPP_NOT_READY`: لا ترسل حتى يعيد status الحالة `ready`.
- فشل Chromium: شغّل الخدمة كمستخدم `jevbridge` وثبت المتصفح ومكتباته لذلك المستخدم.
- `IDEMPOTENCY_CONFLICT`: لا تعِد استخدام `requestId` لرسالة مختلفة؛ أنشئ `requestId` جديداً.
- `401 UNAUTHORIZED`: تحقق من أن Bearer token في Action يطابق `.env`، ثم أعد تشغيل PM2 بعد التغيير.
