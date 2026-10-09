# KOSIF Omni knowledge — 11-whatsapp


<!-- ===== skill: kosif-whatsapp ===== -->
---
name: kosif-whatsapp
description: Guardrailed WhatsApp messaging through the user's own JEV WhatsApp bridge (ChatGPT Action / local server). Manual, confirmed, low-volume sends only — recipients and message shown and explicitly approved before every send; idempotent request ids; no auto-replies, no chat reading, no groups, no bulk marketing. Use for "ارسل رسالة واتساب", bridge setup, status, troubleshooting.
---
# KOSIF WhatsApp (guarded)

This skill drives the bridge in `modules/whatsapp-bridge/` (a small server the user owns). The bridge is deliberately narrow; this skill keeps it that way.

## What it can do
- Check bridge status (`GET /v1/whatsapp/status`).
- Send **one explicitly approved message** to **up to 20 explicitly listed numbers**, spaced by the bridge's delay (`POST /v1/whatsapp/send`, needs a stable `requestId`).
- Help deploy/operate it (`modules/whatsapp-bridge/README.md`, `docs/deployment-checklist.md`).

## What it must not do
No automatic or scheduled replies · no reading, searching or summarising chats or contacts · no group sends · no mass/marketing blasts or scraping numbers · no sending to people who have not agreed to receive the message · no attempts to evade WhatsApp rate limits or bans. Unofficial WhatsApp-Web automation can violate platform terms and get the account restricted; for business-scale messaging use the official WhatsApp Cloud API.

## Send protocol (every time)
1. Collect: exact message text, exact numbers (country-code format), purpose, and that recipients consented.
2. **Show** the user: message · recipients (masked is fine) · count · that it will really be sent.
3. Get an explicit "send" in chat for *this* message. Earlier approval does not carry over.
4. Generate a fresh `requestId` (≥ 8 chars, e.g. `req-<date>-<n>`). **Retry with the same id** after a timeout — the bridge returns the stored result instead of duplicating. A *different* message needs a *new* id (`IDEMPOTENCY_CONFLICT` otherwise).
5. Check status is `ready` first; if `qr_required`/`auth_failure`/`disconnected`, stop and guide the user (QR pairing is theirs to do on the phone).
6. Report per-recipient results from the response. Success = the bridge's per-recipient result, not "the request was accepted".

## Secrets
The bridge token lives in the server `.env` and in the host's secret field for the Action. Never print it, paste it into chat, put it in OpenAPI, or commit it. Rotate it via the README procedure.

## Hosts
- **ChatGPT**: import `modules/whatsapp-bridge/docs/chatgpt-action-openapi.yaml` into a Custom GPT Action after replacing the server URL with your real HTTPS host; keep Bearer auth in the Action secrets; add an instruction to confirm before every send.
- **Claude / others**: call the same HTTPS API only through a tool/connector the user has configured; otherwise provide the `curl` commands from the README and let the user run them.


<!-- ===== bridge README ===== -->
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
