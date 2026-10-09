# 2. Inventory of existing KOSIF capabilities

Found on 2026-10-09 in: the `الاداة` folder (KOSIF Omni plugin and its 49 skills, KOSIF Think, KOSIF Atlas, 100 Super Skills, KOSIF Studio, KOSIF Motion, Higgsfield, WhatsApp bridge, Qawaem filing, research bundle), the SQC app (`s-kosif-dev`, elkosif0-cmd/cloude) and the memory index.

| Family | Capability | Source |
|---|---|---|
| accounting | Invoices, estimates, receipts, credit notes — فواتير وعروض أسعار وإيصالات وإشعارات دائنة | SQC app · Invoice Simple |
| accounting | Automatic double entry and journal — قيد مزدوج تلقائي ودفتر يومية | SQC ledger engine |
| accounting | Trial balance, P&L, balance sheet — ميزان المراجعة وقائمة الدخل والمركز المالي | SQC statements engine |
| accounting | VAT and VAT return — ضريبة القيمة المضافة وإقرارها | SQC VAT policy · kosif-audit-ifrs |
| accounting | ZATCA phase-1 QR — رمز QR للفاتورة الضريبية (هيئة الزكاة، المرحلة الأولى) | SQC enterprise.js |
| accounting | Receivables aging and follow-up — أعمار الديون والمتابعة | SQC reports |
| accounting | Multi-currency with exact decimals — عملات متعددة بكسور صحيحة (2 و3 خانات) | SQC money engine |
| accounting | Expenses, input VAT, supplier bills — المصروفات وضريبة المدخلات وفواتير الموردين | SQC purchases |
| accounting | Recurring invoices — فواتير متكررة | SQC operations |
| accounting | Audited statements for Qawaem filing — قوائم مالية مدققة لمنصة قوائم | qawaem-filing-2025 |
| accounting | Salla store reports and investor deck — تقارير متجر سلة وعرض المستثمرين | aghnam-salla-investor-deck |
| audit | Numbering gaps and duplicates — فحص تسلسل الأرقام والتكرار | SQC audit · kosif_ledger_check |
| audit | Benford first-digit test — اختبار بنفورد | kosif-audit-ifrs |
| audit | Materiality (ISA 320) — الأهمية النسبية (ISA 320) | SQC tb-review engine |
| audit | Monetary-unit sampling — عينة وحدة النقد | SQC audit studio |
| audit | Unbalanced entries, outliers, unusual dates — قيود غير متزنة ومبالغ شاذة وتواريخ غير عادية | SQC audit checks |
| audit | Full audit file and the 47-company research bundle — ملف المراجعة الكامل ونماذج الحزمة العالمية (47 شركة) | SQC tb-review · corpus engines |
| audit | Genius Council and Council-500 — مجلس العباقرة وCouncil-500 | kosif-expert-council · kosif-council-500 |
| data | Excel export and import — تصدير واستيراد Excel | kosif_excel · kosif-sheets |
| data | Formula-safe CSV — CSV آمن من حقن الصيغ | SQC csv safety |
| data | PDF documents — مستندات PDF | SQC output · anthropic pdf skill |
| data | Backup and restore — نسخ احتياطي واستعادة | SQC store |
| data | SQLite and workbook building — قاعدة SQLite وبناء دفاتر من البيانات | kosif_db · kosif_sheet_build |
| data | Search your corpus and books — البحث في نصوصك ومكتبة الكتب | kosif-search-corpus · knowledge atlas |
| ai | Assistant that answers from your data and drafts invoices — مساعد يجيب من بياناتك ويجهز الفواتير | KOSIF Omni · kosif-think |
| ai | Full Pro, Jev and routing — Full Pro ومحرك جيف والتوجيه | kosif-think-pro · kosif-jev · kosif_route |
| ai | Skill Atlas (15,122 skills) and 100 Super Skills — أطلس المهارات (15,122 مهارة) و100 مهارة خارقة | kosif-atlas · 100-superskills |
| ai | Prompt engineering — هندسة البرومبت | kosif-prompt-master |
| ai | Arabic writing and translation — الكتابة العربية والترجمة | kosif-arabic-editor |
| media | Image studio and pixel painter — استوديو الصور والرسم بالبيكسل | kosif-image-studio · KOSIF Studio |
| media | Montage and motion (KOSIF Motion v6) — المونتاج والموشن (KOSIF Motion v6) | kosif-montage-motion · KOSIF Motion Web |
| media | Audio and voice-over — الصوت والتعليق الصوتي | kosif-audio · kosif-voice |
| media | Cinema direction and lighting — الإخراج السينمائي والإضاءة | kosif-cinema-director · kosif-lighting |
| media | Higgsfield brand visuals — صور Higgsfield للهوية | higgsfield |
| ops | Computer control (KOSIF Mouse) — التحكم في الكمبيوتر (KOSIF Mouse) | kosif-mouse · kosif-computer-use |
| ops | Browser automation — المتصفح الآلي | kosif-jev-browser |
| ops | WhatsApp — واتساب | kosif-whatsapp · jev-whatsapp-bridge |
| ops | GitHub and releases — GitHub والنشر | kosif-github · kosif-release-bridge |
| ops | Code review and security — مراجعة الكود والأمن | kosif-code-master · security agents |
| ops | Web design and UI audits — تصميم الويب ومراجعة الواجهات | kosif-web-design · kosif_web_audit |
