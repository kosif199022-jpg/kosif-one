/* KOSIF data — where records live, the example records, and the capability inventory. */
(function (root) {
  'use strict';
  const K = root.KOSIFCore;
  const LS_KEY = 'kosif:v1';
  const KINDS = ['docs', 'clients', 'items', 'expenses', 'journals'];
  const empty = () => ({ settings: {}, docs: [], clients: [], items: [], expenses: [], journals: [], images: {} });

  /* Store: one private document per record under data/users/<id>/ in the artifact db when the viewer is signed in
     to claude.ai; this browser's localStorage otherwise (local runs, signed-out views). The page renders from the
     local copy at once and switches to the account copy when it answers. */
  const Store = {
    mode: 'local', state: empty(), col: null, listeners: [],
    onChange(fn) { this.listeners.push(fn); },
    emit() { for (const fn of this.listeners) try { fn(this.state); } catch (e) { console.error(e); } },
    loadLocal() {
      try { const raw = localStorage.getItem(LS_KEY); if (raw) this.state = Object.assign(empty(), JSON.parse(raw)); } catch { /* storage blocked: stay in memory */ }
      return this.state;
    },
    saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(this.state)); return true; } catch { return false; } },
    async connect() {
      try {
        if (!root.claude || typeof root.claude.use !== 'function') return false;
        const [user, db] = await Promise.all([root.claude.use('user'), root.claude.use('db')]);
        if (!user || !db) return false;
        const id = await user.id(); if (!id) return false;
        const col = db.collection('data/users/' + id);
        const snap = await col.get();
        const next = empty();
        for (const d of snap.docs) {
          const b = d.data(); if (!b) continue;
          if (b.k === 'settings') next.settings = b.v || {};
          else if (b.k === 'img') next.images[d.id.slice(4)] = b.v;
          else if (KINDS.includes(b.k)) next[b.k].push(b.v);
        }
        this.col = col; this.mode = 'cloud';
        const hadLocal = KINDS.some((k) => this.state[k].length);
        if (snap.empty && hadLocal) { await this.pushAll(); } else { this.state = next; this.saveLocal(); }
        this.emit(); return true;
      } catch (e) { console.warn('KOSIF: account storage unavailable', e && e.code); return false; }
    },
    key(kind, id) { return kind + '~' + String(id).replace(/[^A-Za-z0-9_.~:@+-]/g, '_'); },
    async write(kind, rec) {
      if (kind === 'settings') this.state.settings = rec;
      else { const list = this.state[kind], i = list.findIndex((x) => x.id === rec.id); if (i >= 0) list[i] = rec; else list.push(rec); }
      this.saveLocal(); this.emit();
      if (this.col) await this.col.doc(kind === 'settings' ? 'settings~main' : this.key(kind, rec.id)).set({ k: kind, v: rec });
    },
    async remove(kind, id) {
      this.state[kind] = this.state[kind].filter((x) => x.id !== id); this.saveLocal(); this.emit();
      if (this.col) await this.col.doc(this.key(kind, id)).delete();
    },
    async putImage(id, dataUrl) {
      this.state.images[id] = dataUrl; this.saveLocal();
      if (this.col) await this.col.doc('img~' + id).set({ k: 'img', v: dataUrl });
    },
    async dropImage(id) { delete this.state.images[id]; this.saveLocal(); if (this.col) await this.col.doc('img~' + id).delete(); },
    async pushAll() {
      if (!this.col) return;
      await this.col.doc('settings~main').set({ k: 'settings', v: this.state.settings || {} });
      for (const k of KINDS) for (const r of this.state[k]) await this.col.doc(this.key(k, r.id)).set({ k, v: r });
      for (const [id, v] of Object.entries(this.state.images)) await this.col.doc('img~' + id).set({ k: 'img', v });
    },
    async replaceAll(next) {
      const old = this.state; this.state = Object.assign(empty(), next); this.saveLocal(); this.emit();
      if (this.col) {
        for (const k of KINDS) for (const r of old[k]) if (!this.state[k].some((x) => x.id === r.id)) await this.col.doc(this.key(k, r.id)).delete();
        for (const id of Object.keys(old.images || {})) if (!this.state.images[id]) await this.col.doc('img~' + id).delete();
        await this.pushAll();
      }
    },
  };

  /* example records — flagged demo:true so «Start with my data» removes exactly these */
  function demoState(today) {
    const d = (n) => K.addDays(today, n), id = () => 'demo' + K.uid();
    const clients = [
      { id: id(), demo: true, name: 'مطعم النخيل', email: 'orders@nakheel.example', phone: '+966 50 111 2233', address: 'الرياض، حي العليا', vat: '300000000000003' },
      { id: id(), demo: true, name: 'فندق الواحة', email: 'purchasing@oasis.example', phone: '+966 55 444 7788', address: 'جدة، الكورنيش', vat: '310000000000003' },
      { id: id(), demo: true, name: 'Green Valley Catering', email: 'ap@greenvalley.example', phone: '+971 4 555 0101', address: 'Dubai Marina' },
      { id: id(), demo: true, name: 'مؤسسة الضيافة', email: 'info@diyafa.example', phone: '+966 54 222 9090', address: 'الدمام' },
    ];
    const items = [
      { id: id(), demo: true, name: 'ذبيحة نعيمي كاملة', unit: 'ذبيحة', price: '1450', taxable: true },
      { id: id(), demo: true, name: 'كرتون لحم مفروم 10 كجم', unit: 'كرتون', price: '420', taxable: true },
      { id: id(), demo: true, name: 'تقطيع وتغليف', unit: 'خدمة', price: '75', taxable: true },
      { id: id(), demo: true, name: 'توصيل مبرد', unit: 'رحلة', price: '120', taxable: true },
    ];
    const line = (it, qty) => ({ itemId: it.id, name: it.name, unit: it.unit, qty, price: it.price, taxable: true });
    const snap = (c) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, address: c.address, vat: c.vat || '' });
    const docs = [
      { id: id(), demo: true, type: 'invoice', number: 'INV-0001', date: d(-58), dueDate: d(-44), client: snap(clients[0]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[0], 4), line(items[2], 4)], payments: [{ id: K.uid(), date: d(-40), amount: '7015', method: 'bank' }], sent: true, template: 'classic' },
      { id: id(), demo: true, type: 'invoice', number: 'INV-0002', date: d(-40), dueDate: d(-26), client: snap(clients[1]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[1], 12), line(items[3], 2)], payments: [{ id: K.uid(), date: d(-20), amount: '3000', method: 'card' }], sent: true, template: 'modern' },
      { id: id(), demo: true, type: 'invoice', number: 'INV-0003', date: d(-21), dueDate: d(-7), client: snap(clients[3]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[0], 2), line(items[3], 1)], payments: [], sent: true, template: 'stamp' },
      { id: id(), demo: true, type: 'invoice', number: 'INV-0004', date: d(-5), dueDate: d(9), client: snap(clients[0]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[1], 6)], payments: [], sent: false, template: 'ledger', recurring: { freq: 'monthly', next: d(25) } },
      { id: id(), demo: true, type: 'invoice', number: 'INV-0005', date: d(-12), dueDate: d(2), client: snap(clients[2]), currency: 'AED', taxMode: 'exclusive', taxRateBp: 500, lines: [{ name: 'Lamb carcass, whole', unit: 'pc', qty: 6, price: '1400', taxable: true }], payments: [], sent: true, template: 'modern' },
      { id: id(), demo: true, type: 'estimate', number: 'EST-0001', date: d(-3), dueDate: d(27), client: snap(clients[1]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[0], 10), line(items[2], 10), line(items[3], 3)], estimateStatus: 'sent', sent: true, template: 'classic' },
      { id: id(), demo: true, type: 'receipt', number: 'RCT-0001', date: d(-2), client: { name: 'عميل نقدي' }, currency: 'SAR', taxMode: 'inclusive', method: 'cash', lines: [line(items[1], 1)], template: 'classic' },
    ];
    for (let m = 3; m <= 9; m++) docs.push({ id: id(), demo: true, type: 'invoice', number: 'INV-' + String(m + 3).padStart(4, '0'), date: d(-30 * m), dueDate: d(-30 * m + 14), client: snap(clients[m % 4]), currency: 'SAR', taxMode: 'exclusive', lines: [line(items[m % 2], 2 + (m % 4))], payments: [{ id: K.uid(), date: d(-30 * m + 10), amount: 'full', method: 'bank' }], sent: true, template: 'classic' });
    for (const x of docs) for (const p of x.payments || []) if (p.amount === 'full') p.amount = String(K.fromMinor(K.totals(x).total, x.currency));
    const expenses = [
      { id: id(), demo: true, date: d(-30), vendor: 'مزرعة الخير', category: 'cogs', amount: '9200', vat: '1200', method: 'bank', currency: 'SAR' },
      { id: id(), demo: true, date: d(-25), vendor: 'مالك المحل', category: 'rent', amount: '5750', vat: '750', method: 'bank', currency: 'SAR' },
      { id: id(), demo: true, date: d(-10), vendor: 'شركة الكهرباء', category: 'utilities', amount: '920', vat: '120', method: 'card', currency: 'SAR' },
      { id: id(), demo: true, date: d(-4), vendor: 'سناب شات', category: 'marketing', amount: '1150', vat: '150', method: 'card', currency: 'SAR' },
    ];
    const journals = [{ id: id(), demo: true, date: d(-90), ref: 'JV-0001', memo: 'رأس المال الافتتاحي', currency: 'SAR', lines: [{ acc: '1110', dr: '50000', cr: '0' }, { acc: '3100', dr: '0', cr: '50000' }] }];
    return { clients, items, docs, expenses, journals };
  }

  /* Invoice Simple features, verified from its App Store listing (2026-10-09), and where each lives in KOSIF */
  const REFERENCE_FEATURES = [
    ['Invoices', 'docs', 'integrated'], ['Estimates / quotes', 'docs', 'integrated'], ['Receipts', 'docs', 'integrated'], ['Estimate → invoice conversion', 'doc view', 'integrated'],
    ['Professional templates', 'editor › template', 'integrated'], ['PDF invoices and quotes', 'doc view › PDF', 'integrated'], ['Logo and business details', 'settings', 'integrated'], ['Banking details', 'settings', 'integrated'],
    ['Customise every part of the document', 'editor', 'integrated'], ['Business owner signature', 'settings + editor', 'integrated'], ['Client details (import from contacts)', 'clients › import CSV/Excel', 'integrated'],
    ['Items with photos', 'items', 'integrated'], ['Autofill client and item info', 'editor pickers', 'integrated'], ['Customisable tax', 'editor + settings', 'integrated'], ['Discounts', 'editor', 'integrated'],
    ['Card fee added to the invoice', 'editor › card fee', 'integrated'], ['Cheque and cash payments', 'record payment', 'integrated'], ['QR code payments', 'payment link QR on the document', 'integrated'],
    ['Online card payments (Invoice Simple Payments)', 'needs a payment provider backend', 'unavailable'], ['Send by email, text or WhatsApp', 'share sheet (copy, WhatsApp link)', 'integrated'],
    ['Read receipts (opened / paid alerts)', 'needs a server that hosts the invoice link', 'unavailable'], ['Due-date reminders', 'home › needs follow-up', 'integrated'], ['Document history', 'documents list + search', 'integrated'],
    ['Receipt and expense tracking', 'expenses', 'integrated'], ['Bill organiser', 'expenses › unpaid bills', 'integrated'], ['Business reporting', 'reports', 'integrated'],
    ['Deposits', 'editor › deposit', 'integrated'], ['Multi-currency', 'document currency', 'integrated'], ['iPhone/iPad + web', 'responsive web app (installable later as iOS)', 'bridged'],
    ['23 languages', 'Arabic and English', 'bridged'], ['Subscriptions and invoice limits', 'not reproduced: KOSIF has no limits', 'unavailable'],
  ];

  /* Every capability found in the owner's tools (2026-10-09 inventory of الاداة, the KOSIF Omni plugin, the SQC
     app and the memory index), its source, and what this web build does with it. `check` names a live in-page test. */
  const CAPABILITIES = [
    // accounting and finance (SQC app s-kosif, kosif-audit-ifrs, kosif-sheets)
    { fam: 'accounting', ar: 'فواتير وعروض أسعار وإيصالات وإشعارات دائنة', en: 'Invoices, estimates, receipts, credit notes', src: 'SQC app · Invoice Simple', status: 'integrated', check: 'totals' },
    { fam: 'accounting', ar: 'قيد مزدوج تلقائي ودفتر يومية', en: 'Automatic double entry and journal', src: 'SQC ledger engine', status: 'integrated', check: 'journal' },
    { fam: 'accounting', ar: 'ميزان المراجعة وقائمة الدخل والمركز المالي', en: 'Trial balance, P&L, balance sheet', src: 'SQC statements engine', status: 'integrated', check: 'statements' },
    { fam: 'accounting', ar: 'ضريبة القيمة المضافة وإقرارها', en: 'VAT and VAT return', src: 'SQC VAT policy · kosif-audit-ifrs', status: 'integrated', check: 'vat' },
    { fam: 'accounting', ar: 'رمز QR للفاتورة الضريبية (هيئة الزكاة، المرحلة الأولى)', en: 'ZATCA phase-1 QR', src: 'SQC enterprise.js', status: 'integrated', check: 'zatca' },
    { fam: 'accounting', ar: 'أعمار الديون والمتابعة', en: 'Receivables aging and follow-up', src: 'SQC reports', status: 'integrated', check: 'aging' },
    { fam: 'accounting', ar: 'عملات متعددة بكسور صحيحة (2 و3 خانات)', en: 'Multi-currency with exact decimals', src: 'SQC money engine', status: 'integrated', check: 'money' },
    { fam: 'accounting', ar: 'المصروفات وضريبة المدخلات وفواتير الموردين', en: 'Expenses, input VAT, supplier bills', src: 'SQC purchases', status: 'integrated', check: 'journal' },
    { fam: 'accounting', ar: 'فواتير متكررة', en: 'Recurring invoices', src: 'SQC operations', status: 'integrated', check: 'recurring' },
    { fam: 'accounting', ar: 'قوائم مالية مدققة لمنصة قوائم', en: 'Audited statements for Qawaem filing', src: 'qawaem-filing-2025', status: 'bridged', note: 'Excel export of TB/P&L/BS feeds the filing runbook' },
    { fam: 'accounting', ar: 'تقارير متجر سلة وعرض المستثمرين', en: 'Salla store reports and investor deck', src: 'aghnam-salla-investor-deck', status: 'external', note: 'needs the Salla connector; stays a Claude task' },
    // audit (SQC audit studio, kosif-audit-ifrs, kosif_ledger_check)
    { fam: 'audit', ar: 'فحص تسلسل الأرقام والتكرار', en: 'Numbering gaps and duplicates', src: 'SQC audit · kosif_ledger_check', status: 'integrated', check: 'gaps' },
    { fam: 'audit', ar: 'اختبار بنفورد', en: 'Benford first-digit test', src: 'kosif-audit-ifrs', status: 'integrated', check: 'benford' },
    { fam: 'audit', ar: 'الأهمية النسبية (ISA 320)', en: 'Materiality (ISA 320)', src: 'SQC tb-review engine', status: 'integrated', check: 'materiality' },
    { fam: 'audit', ar: 'عينة وحدة النقد', en: 'Monetary-unit sampling', src: 'SQC audit studio', status: 'integrated', check: 'mus' },
    { fam: 'audit', ar: 'قيود غير متزنة ومبالغ شاذة وتواريخ غير عادية', en: 'Unbalanced entries, outliers, unusual dates', src: 'SQC audit checks', status: 'integrated', check: 'audit' },
    { fam: 'audit', ar: 'ملف المراجعة الكامل ونماذج الحزمة العالمية (47 شركة)', en: 'Full audit file and the 47-company research bundle', src: 'SQC tb-review · corpus engines', status: 'external', note: 'lives in s-kosif.pages.dev; too large for this app' },
    { fam: 'audit', ar: 'مجلس العباقرة وCouncil-500', en: 'Genius Council and Council-500', src: 'kosif-expert-council · kosif-council-500', status: 'external', note: 'runs in KOSIF Omni / KOSIF Think' },
    // data and documents
    { fam: 'data', ar: 'تصدير واستيراد Excel', en: 'Excel export and import', src: 'kosif_excel · kosif-sheets', status: 'integrated', check: 'xlsx' },
    { fam: 'data', ar: 'CSV آمن من حقن الصيغ', en: 'Formula-safe CSV', src: 'SQC csv safety', status: 'integrated', check: 'csv' },
    { fam: 'data', ar: 'مستندات PDF', en: 'PDF documents', src: 'SQC output · anthropic pdf skill', status: 'integrated', check: 'pdf' },
    { fam: 'data', ar: 'نسخ احتياطي واستعادة', en: 'Backup and restore', src: 'SQC store', status: 'integrated', check: 'storage' },
    { fam: 'data', ar: 'قاعدة SQLite وبناء دفاتر من البيانات', en: 'SQLite and workbook building', src: 'kosif_db · kosif_sheet_build', status: 'bridged', note: 'Excel export is the hand-off format' },
    { fam: 'data', ar: 'البحث في نصوصك ومكتبة الكتب', en: 'Search your corpus and books', src: 'kosif-search-corpus · knowledge atlas', status: 'external' },
    // AI orchestration
    { fam: 'ai', ar: 'مساعد يجيب من بياناتك ويجهز الفواتير', en: 'Assistant that answers from your data and drafts invoices', src: 'KOSIF Omni · kosif-think', status: 'integrated', check: 'ai' },
    { fam: 'ai', ar: 'Full Pro ومحرك جيف والتوجيه', en: 'Full Pro, Jev and routing', src: 'kosif-think-pro · kosif-jev · kosif_route', status: 'external', note: 'runs on the KOSIF Think worker' },
    { fam: 'ai', ar: 'أطلس المهارات (15,122 مهارة) و100 مهارة خارقة', en: 'Skill Atlas (15,122 skills) and 100 Super Skills', src: 'kosif-atlas · 100-superskills', status: 'external' },
    { fam: 'ai', ar: 'هندسة البرومبت', en: 'Prompt engineering', src: 'kosif-prompt-master', status: 'bridged', note: 'through Ask KOSIF' },
    { fam: 'ai', ar: 'الكتابة العربية والترجمة', en: 'Arabic writing and translation', src: 'kosif-arabic-editor', status: 'bridged', note: 'Ask KOSIF writes notes and terms in either language' },
    // media
    { fam: 'media', ar: 'استوديو الصور والرسم بالبيكسل', en: 'Image studio and pixel painter', src: 'kosif-image-studio · KOSIF Studio', status: 'external', note: 'desktop program and GPU work' },
    { fam: 'media', ar: 'المونتاج والموشن (KOSIF Motion v6)', en: 'Montage and motion (KOSIF Motion v6)', src: 'kosif-montage-motion · KOSIF Motion Web', status: 'external', note: 'needs ffmpeg and a renderer' },
    { fam: 'media', ar: 'الصوت والتعليق الصوتي', en: 'Audio and voice-over', src: 'kosif-audio · kosif-voice', status: 'external' },
    { fam: 'media', ar: 'الإخراج السينمائي والإضاءة', en: 'Cinema direction and lighting', src: 'kosif-cinema-director · kosif-lighting', status: 'external' },
    { fam: 'media', ar: 'صور Higgsfield للهوية', en: 'Higgsfield brand visuals', src: 'higgsfield', status: 'external', note: 'paid account; owner-approved only' },
    // computer and dev
    { fam: 'ops', ar: 'التحكم في الكمبيوتر (KOSIF Mouse)', en: 'Computer control (KOSIF Mouse)', src: 'kosif-mouse · kosif-computer-use', status: 'unavailable', note: 'a web page cannot control the computer' },
    { fam: 'ops', ar: 'المتصفح الآلي', en: 'Browser automation', src: 'kosif-jev-browser', status: 'external' },
    { fam: 'ops', ar: 'واتساب', en: 'WhatsApp', src: 'kosif-whatsapp · jev-whatsapp-bridge', status: 'bridged', note: 'share and reminders open WhatsApp with the message; no reading of chats' },
    { fam: 'ops', ar: 'GitHub والنشر', en: 'GitHub and releases', src: 'kosif-github · kosif-release-bridge', status: 'external' },
    { fam: 'ops', ar: 'مراجعة الكود والأمن', en: 'Code review and security', src: 'kosif-code-master · security agents', status: 'external' },
    { fam: 'ops', ar: 'تصميم الويب ومراجعة الواجهات', en: 'Web design and UI audits', src: 'kosif-web-design · kosif_web_audit', status: 'integrated', check: 'design', note: 'this app’s design system' },
  ];

  root.KOSIFData = { Store, demoState, REFERENCE_FEATURES, CAPABILITIES, LS_KEY, KINDS, empty };
})(typeof self !== 'undefined' ? self : this);
