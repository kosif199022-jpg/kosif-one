# Deployment checklist

## قبل التثبيت

- [ ] امتلاك نطاق يمكنه تقديم HTTPS حقيقي.
- [ ] اختيار reverse proxy أو tunnel معتمد؛ لا نشر منفذ Node مباشرة.
- [ ] فتح SSH وHTTPS فقط في firewall، وإغلاق 8787 خارجياً.
- [ ] اختيار رقم WhatsApp مملوك للحساب وأرقام اختبار وافقت على الاستقبال.

## تثبيت الخدمة

- [ ] إنشاء المستخدم `jevbridge` ومجلدات `/opt/jev-whatsapp-bridge` و`/var/lib/jev-whatsapp` و`/var/log/jev-whatsapp` بملكية المستخدم.
- [ ] نسخ الملفات المراجعة إلى `/opt/jev-whatsapp-bridge` والتحقق من الملكية.
- [ ] تشغيل `npm ci --omit=dev` كمستخدم `jevbridge`.
- [ ] التحقق من Chromium؛ تثبيته ومكتبات النظام المطلوبة عند ظهور خطأ تشغيل فقط.
- [ ] إنشاء `.env` بصلاحية `0640`، وتوليد `BRIDGE_API_TOKEN` عشوائياً، وعدم حفظه في OpenAPI أو Git.
- [ ] ضبط `SESSION_DIR` و`REQUEST_STORE_PATH` لمسارات دائمة يملكها `jevbridge`.

## التشغيل الأول

- [ ] تشغيل `pm2 start ecosystem.config.cjs` كمستخدم `jevbridge`.
- [ ] متابعة `pm2 logs jev-whatsapp-bridge` ومسح QR من الهاتف.
- [ ] التأكد من ظهور `ready` ومن أن مجلد الجلسة غير مقروء عالمياً.
- [ ] تنفيذ `GET /healthz` محلياً.
- [ ] تنفيذ `GET /v1/whatsapp/status` بالرمز وإخفاء الرمز من نتيجة الفحص.
- [ ] تنفيذ رسالة واحدة فقط إلى رقم وافق على الاختبار.
- [ ] إعادة نفس الطلب والتأكد من عدم وصول رسالة مكررة.

## HTTPS وChatGPT

- [ ] ربط النطاق بالخدمة عبر HTTPS.
- [ ] اختبار `https://<actual-host>/healthz` من جهاز مصرح له.
- [ ] تحديث `servers[0].url` في `docs/chatgpt-action-openapi.yaml` إلى عنوان HTTPS الفعلي.
- [ ] استيراد OpenAPI في ChatGPT Action.
- [ ] وضع Bearer token داخل إعداد الأسرار الخاص بالـAction فقط.
- [ ] تعريف تعليمات Action: اعرض المستلمين والرسالة واطلب تأكيداً صريحاً قبل الإرسال.
- [ ] اختبار status ثم إرسال واحد يدوي مؤكد.

## بعد التشغيل

- [ ] تشغيل `pm2 save` ثم إعداد أمر `pm2 startup` للمستخدم `jevbridge`.
- [ ] مراجعة السجلات للتأكد من عدم وجود الرسالة أو الرمز أو QR.
- [ ] تدوير الرمز عند الحاجة عبر `.env` ثم `pm2 restart --update-env`.
- [ ] عدم حذف `SESSION_DIR` إلا مع قرار واضح بإعادة الإقران.
