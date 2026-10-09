/* KOSIF Omni console — vanilla JS, no dependencies, no inline code (strict CSP).
   Talks to the same server: JSON-RPC on ../mcp (tools/list, tools/call, prompts/*), ../healthz, ./catalog.json.
   Tool output is untrusted text: it is only ever inserted with textContent / DOM nodes, never as HTML. */
'use strict';
(() => {
  // ── tiny DOM helpers ──────────────────────────────────────────────────────
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'value') el.value = v;
      else if (k === 'href') el.setAttribute('href', safeHref(v));
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'style') continue;                  // CSP: no style attributes; use el.style.*
      else el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  function safeHref(u) {
    const s = String(u || '');
    if (s.startsWith('#')) return s;
    return /^https?:\/\//i.test(s) ? s : '#';
  }
  const clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kosif.' + k); return v == null ? d : v; } catch { return d; } },
    set(k, v) { try { v == null ? localStorage.removeItem('kosif.' + k) : localStorage.setItem('kosif.' + k, v); } catch { /* storage blocked */ } },
    sget(k, d) { try { const v = sessionStorage.getItem('kosif.' + k); return v == null ? d : v; } catch { return d; } },
    sset(k, v) { try { v == null ? sessionStorage.removeItem('kosif.' + k) : sessionStorage.setItem('kosif.' + k, v); } catch { /* storage blocked */ } },
  };

  // ── i18n ──────────────────────────────────────────────────────────────────
  const I18N = {
    ar: {
      subtitle: 'الشاشة التفاعلية', skip: 'تخطَّ إلى المحتوى', menu: 'القائمة', tools_nav: 'الأدوات', close: 'إغلاق',
      connect: 'الاتصال', connected: 'متصل', offline: 'الخادم غير متاح', auth_needed: 'يلزم رمز وصول', connecting: 'جارٍ الاتصال…',
      nav_home: 'الرئيسية', nav_flows: 'سير العمل', nav_skills: 'المهارات', nav_atlas: 'Atlas', nav_commands: 'الأوامر', nav_history: 'السجل',
      search_label: 'ابحث في الأدوات', search_ph: 'ابحث في {n} أداة…  ( / )', tools_shown: '{n} من {t} أداة', no_match: 'لا توجد أداة مطابقة',
      ro: 'قراءة فقط', rw: 'يكتب', net: 'شبكة', example: 'مثال جاهز', clear: 'مسح', json_mode: 'وضع JSON', form_mode: 'وضع النموذج',
      curl: 'نسخ أمر curl', run: 'تشغيل', running: 'جارٍ التشغيل…', cancel: 'إلغاء', cancelled: 'أُلغي الطلب',
      required: 'مطلوب', bool_default: '— افتراضي —', yes: 'نعم (true)', no: 'لا (false)', enum_default: '— افتراضي —',
      lines_hint: 'عنصر في كل سطر', json_hint: 'JSON', extra_args: 'وسائط إضافية (JSON)', extra_help: 'هذه الأداة تقبل حقولًا إضافية؛ اكتب كائن JSON يُدمج مع النموذج.',
      err_required: 'هذا الحقل مطلوب', err_number: 'أدخل رقمًا', err_int: 'أدخل عددًا صحيحًا', err_json: 'JSON غير صالح: {m}', err_obj: 'يجب أن يكون كائن JSON', err_arr: 'يجب أن يكون مصفوفة JSON',
      result: 'النتيجة', ok: 'نجح', error: 'خطأ', copy: 'نسخ', copied: 'تم النسخ', download: 'تنزيل JSON', raw: 'JSON خام', full_data: 'البيانات الكاملة',
      show_more: 'عرض المزيد ({n})', exit: 'رمز الخروج', ms: 'م.ث', no_result: 'شغّل الأداة لترى النتيجة هنا.',
      confirm_title: 'تأكيد أداة تكتب', confirm_run: 'تنفيذ',
      conn_title: 'الاتصال بالخادم', conn_btn: 'اتصال', disconnect: 'قطع الاتصال',
      home_title: 'لوحة القدرات', home_lead: 'كل أدوات KOSIF Omni في شاشة واحدة: اختر أداة من القائمة، أو اكتب مهمتك ودع KOSIF يقترح الأداة والمهارة، أو شغّل سير عمل جاهزًا.',
      ask_title: 'اسأل KOSIF: ما الأداة المناسبة؟', ask_ph: 'اكتب مهمتك بالعربية أو الإنجليزية…', ask_btn: 'اقترح', ask_jev: 'دع Jev يختار المهارة (شبكة)',
      kpi_tools: 'أداة', kpi_skills: 'مهارة مدمجة', kpi_families: 'عائلة قدرات', kpi_atlas: 'مهارة في Atlas', kpi_corpus: 'ملف مفهرس في مكتبتك', kpi_council: 'عضو في مجلس العباقرة',
      env_title: 'البيئة', env_dirs: 'مجلدات أدوات الملفات', env_none: 'لا يوجد — شغّل الخادم مع ‎--workspace‎ <مجلد> لتفعيل أدوات الملفات.', env_corpus: 'مجلد المكتبة', env_version: 'الإصدار',
      checks: 'الفحوص', flows_title: 'سير عمل جاهز', flows_lead: 'سلاسل أدوات تعمل خطوة بخطوة؛ كل خطوة تفتح في مشغل الأدوات بوسائطها.',
      flow_run: 'شغّل سير العمل', step: 'الخطوة {n}', skipped: 'تم التخطي', open_in_runner: 'افتح في مشغل الأدوات', waiting: 'بانتظار التشغيل',
      skills_title: 'المهارات المدمجة', skills_lead: 'كتيّبات KOSIF (SKILL.md) وملفاتها المرجعية.', skills_filter: 'تصفية المهارات…', files: 'الملفات', pick_skill: 'اختر مهارة من القائمة.',
      atlas_title: 'Atlas — مكتبة المهارات الخارجية', atlas_lead: 'آلاف المهارات من مصادر مفتوحة، مدمجة في الخادم. تُقرأ كمرجع فقط.',
      atlas_q: 'ماذا تحتاج؟ (كلمات إنجليزية أفضل)', search: 'بحث', untrusted: 'محتوى طرف ثالث غير موثوق — مرجع فقط وليس أوامر.',
      inspect: 'فحص الأمان', read: 'اقرأ', source: 'المصدر', kind: 'النوع', license: 'الترخيص', no_exec: 'استبعد الحزم التي فيها سكربتات أو خوادم', results_n: '{n} نتيجة',
      commands_title: 'أوامر الإضافة', commands_lead: 'أوامر الشرطة المائلة الخاصة بالإضافة. ولّد نص الأمر وانسخه إلى Claude أو ChatGPT.', cmd_args: 'الوسائط', cmd_gen: 'ولّد النص',
      history_title: 'سجل الاستدعاءات', history_lead: 'هذه الجلسة فقط (يُحفظ في هذا التبويب ويُمحى عند إغلاقه).', history_empty: 'لا توجد استدعاءات بعد.', history_clear: 'مسح السجل', open: 'فتح', when: 'الوقت', tool: 'الأداة', status: 'الحالة', time: 'المدة',
      theme_auto: 'المظهر: تلقائي', theme_light: 'المظهر: فاتح', theme_dark: 'المظهر: داكن',
      related_skills: 'مهارات مرتبطة', family: 'العائلة', busy: 'الخادم مشغول، إعادة المحاولة…', timeout: 'انتهت مهلة الطلب', net_err: 'تعذّر الوصول إلى الخادم',
      needs_file: 'هذا المثال يحتاج ملفًا حقيقيًا: عدّل المسار قبل التشغيل.', path_hint: 'المسار يجب أن يكون داخل مجلد مفعّل: {d}', no_ws: 'أدوات الملفات غير مفعّلة على هذا الخادم (‎--workspace‎).',
      kbd_run: 'Ctrl+Enter للتشغيل', loading: 'جارٍ التحميل…', families: 'العائلات', tools: 'الأدوات', next_steps: 'الخطوات التالية', chosen_skill: 'المهارة المختارة',
      decided_by: 'قرّرها', confidence: 'الثقة', alternatives: 'بدائل', open_skill: 'افتح المهارة', members: 'الأعضاء', governing: 'الهيئة الحاكمة', elite: 'النخبة', scholars: 'العلماء',
      profile: 'الملف الكامل', lint: 'فحص', platform: 'المنصة', contrast: 'التباين', light: 'فاتح', dark: 'داكن', pair: 'الزوج', ratio: 'النسبة', pass: 'ناجح',
      issues: 'الملاحظات', findings: 'النتائج', severity: 'الخطورة', rule: 'القاعدة', where: 'الموضع', message: 'الوصف', read_more: 'اقرأ المزيد', score: 'الدرجة',
      inputs: 'المدخلات', copy_text: 'انسخ النص', auth_hint: 'أدخل رمز الوصول من زر «الاتصال».', retry: 'إعادة المحاولة', untitled: 'بدون عنوان',
    },
    en: {
      subtitle: 'Interactive console', skip: 'Skip to content', menu: 'Menu', tools_nav: 'Tools', close: 'Close',
      connect: 'Connect', connected: 'Connected', offline: 'Server unreachable', auth_needed: 'Access token required', connecting: 'Connecting…',
      nav_home: 'Home', nav_flows: 'Workflows', nav_skills: 'Skills', nav_atlas: 'Atlas', nav_commands: 'Commands', nav_history: 'History',
      search_label: 'Search tools', search_ph: 'Search {n} tools…  ( / )', tools_shown: '{n} of {t} tools', no_match: 'No matching tool',
      ro: 'read-only', rw: 'writes', net: 'network', example: 'Load example', clear: 'Clear', json_mode: 'JSON mode', form_mode: 'Form mode',
      curl: 'Copy curl', run: 'Run', running: 'Running…', cancel: 'Cancel', cancelled: 'Request cancelled',
      required: 'required', bool_default: '— default —', yes: 'yes (true)', no: 'no (false)', enum_default: '— default —',
      lines_hint: 'one item per line', json_hint: 'JSON', extra_args: 'Extra arguments (JSON)', extra_help: 'This tool accepts extra fields; a JSON object merged with the form.',
      err_required: 'This field is required', err_number: 'Enter a number', err_int: 'Enter a whole number', err_json: 'Invalid JSON: {m}', err_obj: 'Must be a JSON object', err_arr: 'Must be a JSON array',
      result: 'Result', ok: 'OK', error: 'Error', copy: 'Copy', copied: 'Copied', download: 'Download JSON', raw: 'Raw JSON', full_data: 'Full data',
      show_more: 'Show more ({n})', exit: 'exit code', ms: 'ms', no_result: 'Run the tool to see its result here.',
      confirm_title: 'Confirm a writing tool', confirm_run: 'Run it',
      conn_title: 'Connect to the server', conn_btn: 'Connect', disconnect: 'Disconnect',
      home_title: 'Capability board', home_lead: 'Every KOSIF Omni tool on one screen: pick a tool from the list, describe your task and let KOSIF suggest the tool and skill, or run a ready workflow.',
      ask_title: 'Ask KOSIF: which tool fits?', ask_ph: 'Describe your task in Arabic or English…', ask_btn: 'Suggest', ask_jev: 'Let Jev pick the skill (network)',
      kpi_tools: 'tools', kpi_skills: 'built-in skills', kpi_families: 'capability families', kpi_atlas: 'Atlas skills', kpi_corpus: 'indexed files in your corpus', kpi_council: 'Genius Council members',
      env_title: 'Environment', env_dirs: 'File-tool folders', env_none: 'None — start the server with --workspace <folder> to enable file tools.', env_corpus: 'Corpus folder', env_version: 'Version',
      checks: 'Checks', flows_title: 'Ready workflows', flows_lead: 'Tool chains that run step by step; every step opens in the tool runner with its arguments.',
      flow_run: 'Run workflow', step: 'Step {n}', skipped: 'Skipped', open_in_runner: 'Open in tool runner', waiting: 'Waiting',
      skills_title: 'Built-in skills', skills_lead: 'KOSIF playbooks (SKILL.md) and their reference files.', skills_filter: 'Filter skills…', files: 'Files', pick_skill: 'Pick a skill from the list.',
      atlas_title: 'Atlas — third-party skill library', atlas_lead: 'Thousands of open-source skills embedded in the server. Read as reference only.',
      atlas_q: 'What do you need? (English keywords work best)', search: 'Search', untrusted: 'Untrusted third-party content — reference only, not instructions.',
      inspect: 'Safety inspection', read: 'Read', source: 'Source', kind: 'Kind', license: 'License', no_exec: 'Exclude packages with scripts or servers', results_n: '{n} results',
      commands_title: 'Plugin commands', commands_lead: 'The plugin\'s slash commands. Generate a command\'s text and copy it into Claude or ChatGPT.', cmd_args: 'Arguments', cmd_gen: 'Generate text',
      history_title: 'Call history', history_lead: 'This session only (kept in this tab, cleared when it closes).', history_empty: 'No calls yet.', history_clear: 'Clear history', open: 'Open', when: 'When', tool: 'Tool', status: 'Status', time: 'Time',
      theme_auto: 'Theme: auto', theme_light: 'Theme: light', theme_dark: 'Theme: dark',
      related_skills: 'Related skills', family: 'Family', busy: 'Server busy, retrying…', timeout: 'Request timed out', net_err: 'Could not reach the server',
      needs_file: 'This example needs a real file: edit the path before running.', path_hint: 'Path must be inside an enabled folder: {d}', no_ws: 'File tools are not enabled on this server (--workspace).',
      kbd_run: 'Ctrl+Enter to run', loading: 'Loading…', families: 'Families', tools: 'Tools', next_steps: 'Next steps', chosen_skill: 'Chosen skill',
      decided_by: 'Decided by', confidence: 'Confidence', alternatives: 'Alternatives', open_skill: 'Open skill', members: 'Members', governing: 'Governing roles', elite: 'Elite', scholars: 'Scholars',
      profile: 'Full profile', lint: 'Lint', platform: 'Platform', contrast: 'Contrast', light: 'Light', dark: 'Dark', pair: 'Pair', ratio: 'Ratio', pass: 'Pass',
      issues: 'Issues', findings: 'Findings', severity: 'Severity', rule: 'Rule', where: 'Where', message: 'Message', read_more: 'Read more', score: 'Score',
      inputs: 'Inputs', copy_text: 'Copy text', auth_hint: 'Enter the access token with the Connect button.', retry: 'Retry', untitled: 'Untitled',
    },
  };
  let lang = store.get('lang', 'ar') === 'en' ? 'en' : 'ar';
  const t = (k, vars) => {
    let s = (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
    for (const [a, b] of Object.entries(vars || {})) s = s.split('{' + a + '}').join(String(b));
    return s;
  };

  // ── state ─────────────────────────────────────────────────────────────────
  const S = {
    token: store.sget('token') || store.get('token') || '',
    connected: false, tools: [], byName: {}, families: [], primary: {}, catalog: { tools: {}, families: {} },
    caps: null, health: null, workspace: '', dirs: [], skills: null, prompts: null,
    history: [], pending: null, view: 'home', current: null, forms: {}, results: {}, homeStats: null,
  };
  try { S.history = JSON.parse(store.sget('history', '[]')) || []; } catch { S.history = []; }

  // ── network ───────────────────────────────────────────────────────────────
  class RpcError extends Error { constructor(kind, msg) { super(msg || kind); this.kind = kind; } }
  let rpcSeq = 0;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function rpc(method, params, opts = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort('timeout'), opts.timeout || 300000);
    if (opts.signal) opts.signal.addEventListener('abort', () => ctrl.abort('cancel'), { once: true });
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (S.token) headers.Authorization = 'Bearer ' + S.token;
    const body = JSON.stringify({ jsonrpc: '2.0', id: ++rpcSeq, method, params: params || {} });
    try {
      for (let attempt = 0; ; attempt++) {
        let res;
        try {
          res = await fetch('../mcp', { method: 'POST', headers, body, signal: ctrl.signal, credentials: 'omit', cache: 'no-store' });
        } catch (e) {
          if (ctrl.signal.aborted) throw new RpcError(ctrl.signal.reason === 'cancel' ? 'cancel' : 'timeout', t(ctrl.signal.reason === 'cancel' ? 'cancelled' : 'timeout'));
          throw new RpcError('network', t('net_err'));
        }
        if (res.status === 401) throw new RpcError('auth', t('auth_needed'));
        if (res.status === 503 && attempt < 3) {
          toast(t('busy'));
          await sleep(1000 * (parseInt(res.headers.get('Retry-After') || '2', 10) || 2));
          continue;
        }
        let data = null;
        try { data = await res.json(); } catch { /* empty body */ }
        if (!res.ok) throw new RpcError('http', (data && data.error) || ('HTTP ' + res.status));
        if (!data) throw new RpcError('http', 'empty response');
        if (data.error) throw new RpcError('rpc', data.error.message || 'error');
        return data.result;
      }
    } finally { clearTimeout(timer); }
  }

  async function callTool(name, args, opts = {}) {
    const t0 = performance.now();
    const r = await rpc('tools/call', { name, arguments: args || {} }, { ...opts, timeout: opts.timeout || timeoutFor(name) });
    const ms = Math.round(performance.now() - t0);
    let value = r.structuredContent;
    const text = (r.content || []).map(c => c.text || '').join('\n');
    if (value === undefined) { try { value = JSON.parse(text); } catch { value = text; } }
    const out = { value, isError: !!r.isError, ms, bytes: text.length };
    if (!opts.quiet) addHistory(name, args, out);
    return out;
  }
  const timeoutFor = n => (/_index$/.test(n) ? 660000 : 300000);

  // ── utilities ─────────────────────────────────────────────────────────────
  let toastTimer = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); toast(t('copied')); }
    catch {
      const ta = h('textarea', { class: 'sr-only' }); ta.value = s; document.body.append(ta); ta.select();
      try { document.execCommand('copy'); toast(t('copied')); } catch { /* ignore */ } ta.remove();
    }
  }
  function download(name, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', {}); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  const fmt = n => new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(n);
  const humanize = n => n.replace(/^kosif_/, '').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
  function toolLabel(name) {
    const c = S.catalog.tools[name];
    if (lang === 'ar' && c && c.ar) return c.ar;
    const tl = S.byName[name];
    const title = tl && tl.annotations && tl.annotations.title;
    return title && title !== name ? title : humanize(name);
  }
  const famTitle = f => (lang === 'ar' && S.catalog.families[f.id]) || f.title;
  function subst(v) {
    if (typeof v === 'string') return v.split('{{workspace}}').join(S.workspace || '.');
    if (Array.isArray(v)) return v.map(subst);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, subst(x)]));
    return v;
  }
  function verdictOf(v) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    const r = v.result && typeof v.result === 'object' && !Array.isArray(v.result) ? v.result : v;
    for (const k of ['verdict', 'decision']) if (typeof r[k] === 'string') return r[k];
    if (typeof r.valid === 'boolean') return r.valid ? 'VALID' : 'INVALID';
    if (typeof r.ok === 'boolean') return r.ok ? 'OK' : 'NOT OK';
    return null;
  }
  function verdictClass(s) {
    const u = String(s).toUpperCase();
    if (/^(PASS|OK|VALID|ALLOW|READ_ONLY_OK|PROCEED|COMPLETE)/.test(u)) return 'ok';
    if (/(BLOCK|DENY|INVALID|FAIL|REJECT|NOT OK|BYPASS)/.test(u)) return 'bad';
    return 'warn';
  }
  const badge = (text, cls) => h('span', { class: 'badge ' + (cls || 'mute') }, text);

  // ── status, theme, language ───────────────────────────────────────────────
  function setStatus(kind, text) {
    const el = $('#status');
    el.className = 'status ' + kind;
    clear(el).append(h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', { class: 'txt' }, text));
    el.title = text;
  }
  const THEMES = ['auto', 'light', 'dark'];
  function applyTheme() {
    const th = store.get('theme', 'auto');
    if (th === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', th);
    const tb = clear($('#themeBtn'));
    tb.append(h('span', { 'aria-hidden': 'true' }, th === 'dark' ? '🌙' : th === 'light' ? '☀️' : '🌓'), h('span', { class: 'lbl' }, t('theme_' + th)));
    tb.setAttribute('aria-label', t('theme_' + th));
  }
  function applyLang() {
    const root = document.documentElement;
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nLabel)); });
    const lb = $('#langBtn');
    lb.textContent = lang === 'ar' ? 'English' : 'العربية';
    lb.lang = lang === 'ar' ? 'en' : 'ar';
    document.title = 'KOSIF Omni — ' + t('subtitle');
    $('#toolSearch').placeholder = t('search_ph', { n: S.tools.length || 55 });
    applyTheme();
  }

  // ── boot & connection ─────────────────────────────────────────────────────
  async function boot() {
    applyLang();
    bindStatic();
    setStatus('warn', t('connecting'));
    try { S.catalog = await (await fetch('catalog.json', { cache: 'no-store' })).json(); } catch { /* optional */ }
    S.catalog.tools = S.catalog.tools || {}; S.catalog.families = S.catalog.families || {};
    try { S.health = await (await fetch('../healthz', { cache: 'no-store' })).json(); } catch { S.health = null; }
    if (!S.health) { setStatus('bad', t('offline')); renderOffline(); return; }
    await connect();
  }

  async function connect() {
    setStatus('warn', t('connecting'));
    try {
      await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'kosif-console', version: S.health.version } });
      const [tl, caps] = await Promise.all([rpc('tools/list'), callTool('kosif_capabilities', {}, { quiet: true })]);
      S.tools = tl.tools || [];
      S.byName = Object.fromEntries(S.tools.map(x => [x.name, x]));
      S.caps = caps.value;
      buildFamilies();
      const env = (S.caps && S.caps.environment) || {};
      S.dirs = env.file_tools_enabled_dirs || [];
      S.workspace = S.dirs[0] || '';
      S.connected = true;
      setStatus('ok', `${t('connected')} · v${S.health.version} · ${fmt(S.tools.length)} ${t('kpi_tools')}`);
      applyLang();
      renderTree();
      route();
    } catch (e) {
      S.connected = false;
      if (e.kind === 'auth') { setStatus('warn', t('auth_needed')); renderAuthNeeded(); openConn(); }
      else { setStatus('bad', e.message); renderOffline(e.message); }
    }
  }

  function buildFamilies() {
    const fams = ((S.caps && S.caps.families) || []).map(f => ({ id: f.id, title: f.title, skills: f.skills || [], tools: (f.tools || []).filter(n => S.byName[n]) }));
    S.primary = {};
    for (const f of fams) for (const n of f.tools) if (!S.primary[n]) S.primary[n] = f.id;
    const core = S.tools.map(x => x.name).filter(n => !S.primary[n]);
    core.forEach(n => { S.primary[n] = 'core'; });
    S.families = [{ id: 'core', title: 'Core: routing, checks and gates', skills: ['kosif-omni'], tools: core }, ...fams];
  }

  function openConn() {
    const d = $('#connDlg');
    $('#tokenInput').value = S.token;
    $('#rememberToken').checked = !!store.get('token');
    if (!d.open) d.showModal();
    setTimeout(() => $('#tokenInput').focus(), 30);
  }

  // ── sidebar tree ──────────────────────────────────────────────────────────
  function renderTree() {
    const q = $('#toolSearch').value.trim().toLowerCase();
    const tree = clear($('#toolTree'));
    let shown = 0;
    for (const f of S.families) {
      const names = f.tools.filter(n => S.primary[n] === f.id).filter(n => {
        if (!q) return true;
        const tl = S.byName[n];
        return [n, toolLabel(n), tl.description, famTitle(f), f.title, (S.catalog.tools[n] || {}).ar || ''].join(' ').toLowerCase().includes(q);
      });
      if (!names.length) continue;
      shown += names.length;
      const det = h('details', { open: q || f.tools.includes(S.current) || f.id === 'core' ? true : null },
        h('summary', {}, h('span', { class: 'fam' }, famTitle(f)), h('span', { class: 'count' }, fmt(names.length))),
        h('ul', {}, names.map(n => {
          const tl = S.byName[n], an = tl.annotations || {};
          return h('li', {}, h('a', { href: '#/tool/' + n, title: n, 'aria-current': S.view === 'tool' && S.current === n ? 'page' : null },
            h('span', { class: 'dotb' + (!an.readOnlyHint ? ' rw' : an.openWorldHint ? ' net' : ''), 'aria-hidden': 'true' }),
            h('span', { class: 'nm' }, toolLabel(n)),
            !an.readOnlyHint ? h('span', { class: 'sr-only' }, ' (' + t('rw') + ')') : null));
        })));
      tree.append(det);
    }
    if (!shown) tree.append(h('p', { class: 'muted small' }, t('no_match')));
    $('#toolCount').textContent = S.tools.length ? t('tools_shown', { n: fmt(shown), t: fmt(S.tools.length) }) : '';
  }

  // ── router ────────────────────────────────────────────────────────────────
  function route() {
    const parts = (location.hash || '#/home').replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    let view = parts[0] || 'home';
    if (!['home', 'tool', 'flows', 'flow', 'skills', 'atlas', 'commands', 'history'].includes(view)) view = 'home';
    if (!S.connected && view !== 'home') view = 'home';
    S.view = view === 'flow' ? 'flows' : view;
    $$('.view').forEach(sec => { sec.hidden = sec.dataset.view !== S.view; });
    $$('.views a').forEach(a => a.setAttribute('aria-current', a.dataset.view === S.view ? 'page' : 'false'));
    closeNav();
    if (!S.connected) return;
    if (view === 'home') renderHome();
    else if (view === 'tool') { S.current = parts[1] && S.byName[parts[1]] ? parts[1] : null; S.current ? renderTool(S.current) : (location.hash = '#/home'); }
    else if (view === 'flows') renderFlows();
    else if (view === 'flow') renderFlow(parts[1]);
    else if (view === 'skills') renderSkills(parts[1], parts.slice(2).join('/'));
    else if (view === 'atlas') renderAtlas();
    else if (view === 'commands') renderCommands();
    else if (view === 'history') renderHistory();
    renderTree();
  }
  function closeNav() { $('#side').classList.remove('open'); $('#navToggle').setAttribute('aria-expanded', 'false'); }
  function focusMain(el) { const hd = el && $('h2', el); if (hd) { hd.tabIndex = -1; hd.focus({ preventScroll: false }); } }

  // ── offline / auth views ──────────────────────────────────────────────────
  function renderOffline(msg) {
    const v = clear($('#view-home'));
    v.append(h('div', { class: 'card' }, h('h2', {}, t('offline')), h('p', { class: 'muted' }, msg || ''),
      h('pre', { class: 'code', dir: 'ltr' }, 'python -m kosif_mcp --http --no-auth --workspace <folder>'),
      h('button', { class: 'btn primary', type: 'button', onclick: () => boot() }, t('retry'))));
  }
  function renderAuthNeeded() {
    const v = clear($('#view-home'));
    v.append(h('div', { class: 'card' }, h('h2', {}, t('auth_needed')), h('p', {}, t('auth_hint')),
      h('button', { class: 'btn primary', type: 'button', onclick: openConn }, '🔑 ' + t('connect'))));
  }

  // ── home ──────────────────────────────────────────────────────────────────
  function renderHome() {
    const v = clear($('#view-home'));
    const caps = S.caps || {};
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('home_title')), h('p', { class: 'muted' }, t('home_lead')))));
    const kp = h('div', { class: 'kpis' },
      kpi(fmt(caps.tool_count || S.tools.length), t('kpi_tools')),
      kpi(fmt(caps.skill_count || 0), t('kpi_skills')),
      kpi(fmt(S.families.length - 1), t('kpi_families')));
    const extra = h('div', { class: 'kpis', 'aria-live': 'polite' });
    v.append(kp, extra);
    loadHomeStats(extra);

    // ask box
    const ta = h('textarea', { id: 'askText', rows: 3, placeholder: t('ask_ph') });
    ta.value = store.sget('ask', '');
    const jevBox = h('input', { type: 'checkbox', id: 'askJev' }); jevBox.checked = store.get('askJev', '1') === '1';
    const out = h('div', { id: 'askOut', 'aria-live': 'polite' });
    const go = h('button', { class: 'btn primary', type: 'submit' }, t('ask_btn'));
    const form = h('form', { class: 'card', onsubmit: async ev => {
      ev.preventDefault();
      const task = ta.value.trim(); if (!task) { ta.focus(); return; }
      store.sset('ask', task); store.set('askJev', jevBox.checked ? '1' : '0');
      go.disabled = true; clear(out).append(h('div', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('running')));
      try {
        const [rt, sa] = await Promise.all([
          callTool('kosif_route', { intent: task, max_results: 4 }),
          callTool('kosif_skill_auto', { task, jev: jevBox.checked, read: false }).catch(e => ({ isError: true, value: { error: e.message } })),
        ]);
        clear(out);
        out.append(renderInsight('kosif_route', rt.value) || h('span'));
        if (!sa.isError) out.append(renderInsight('kosif_skill_auto', sa.value) || h('span'));
        else out.append(h('p', { class: 'note warn' }, String(sa.value.error || '')));
      } catch (e) { clear(out).append(errorNote(e)); }
      finally { go.disabled = false; }
    } },
      h('h3', {}, t('ask_title')),
      h('label', { for: 'askText', class: 'sr-only' }, t('ask_title')), ta,
      h('div', { class: 'runbar' }, go, h('label', { class: 'check' }, jevBox, ' ', t('ask_jev'))), out);
    v.append(form);

    // workflows
    v.append(h('h3', {}, t('flows_title')), flowTiles());

    // environment
    const env = caps.environment || {};
    v.append(h('div', { class: 'card' }, h('h3', {}, t('env_title')),
      h('p', {}, h('b', {}, t('env_version') + ': '), (S.health && S.health.version) || ''),
      h('p', {}, h('b', {}, t('env_dirs') + ': ')),
      S.dirs.length ? h('ul', {}, S.dirs.map(d => h('li', { dir: 'ltr' }, h('code', {}, d)))) : h('p', { class: 'note warn' }, t('env_none')),
      env.corpus_configured != null ? h('p', {}, h('b', {}, t('env_corpus') + ': '), env.corpus_configured ? '✓' : '—') : null,
      h('div', { id: 'doctorOut' })));
    focusMain(v);
  }
  const kpi = (num, label) => h('div', { class: 'kpi' }, h('b', {}, num), h('span', {}, label));
  async function loadHomeStats(box) {
    if (!S.homeStats) {
      const q = n => callTool(n, {}, { quiet: true }).then(r => r.value).catch(() => null);
      const [doc, atl, cor] = await Promise.all([q('kosif_doctor'), q('kosif_atlas_status'), q('kosif_corpus_status')]);
      S.homeStats = { doc, atl, cor };
    }
    const { doc, atl, cor } = S.homeStats;
    clear(box);
    const council = doc && (doc.checks || []).find(c => /council/.test(c.check));
    const m = council && /(\d+)\D+(\d+)/.exec(council.detail || '');
    if (m) box.append(kpi(fmt(+m[1] + +m[2]), t('kpi_council')));
    const as = atl && atl.pack && +atl.pack.skills;
    if (as) box.append(kpi(fmt(as), t('kpi_atlas')));
    const cf = cor && cor.files && cor.files.indexed;
    if (cf) box.append(kpi(fmt(cf), t('kpi_corpus')));
    const d = $('#doctorOut');
    if (d && doc && doc.checks) {
      clear(d).append(h('h4', {}, t('checks')), h('ul', { class: 'small' }, doc.checks.map(c =>
        h('li', {}, h('span', { 'aria-hidden': 'true' }, c.ok ? '✅ ' : '⚠️ '), h('b', {}, c.check), c.detail ? ' — ' : '', h('span', { dir: 'auto' }, c.detail || '')))));
    }
  }

  // ── tool runner ───────────────────────────────────────────────────────────
  function renderTool(name) {
    const tl = S.byName[name], an = tl.annotations || {}, cat = S.catalog.tools[name] || {};
    const v = clear($('#view-tool'));
    const famId = S.primary[name];
    const fam = S.families.find(f => f.id === famId);
    const inFams = S.families.filter(f => f.tools.includes(name));
    const skills = [...new Set(inFams.flatMap(f => f.skills))];
    v.append(h('div', { class: 'head' },
      h('div', { class: 'grow' },
        h('h2', {}, toolLabel(name)),
        h('p', { class: 'row' }, h('code', { dir: 'ltr' }, name),
          an.readOnlyHint ? badge(t('ro'), 'ok') : badge(t('rw'), 'warn'),
          an.openWorldHint ? badge(t('net'), 'info') : null,
          fam ? badge(famTitle(fam), 'mute') : null),
        h('p', { class: 'muted', dir: 'auto', lang: 'en' }, tl.description),
        skills.length ? h('div', { class: 'chips' }, h('span', { class: 'small muted' }, t('related_skills') + ':'),
          skills.map(s => h('a', { class: 'chip', href: '#/skills/' + encodeURIComponent(s) }, s))) : null)));

    const formCard = h('div', { class: 'card' });
    const resultCard = h('div', { class: 'card', id: 'resultCard' }, h('h3', {}, t('result')), h('p', { class: 'muted' }, t('no_result')));
    v.append(formCard, resultCard);

    const form = buildForm(tl);
    S.forms[name] = form;
    let jsonMode = false;
    const jsonArea = h('textarea', { class: 'code', rows: 14, id: 'jsonArgs', 'aria-label': t('json_mode'), hidden: true, spellcheck: 'false' });
    const jsonErr = h('p', { class: 'jerr', role: 'alert' });
    const modeBtn = h('button', { class: 'btn sm', type: 'button', 'aria-pressed': 'false' }, '{ } ' + t('json_mode'));
    modeBtn.addEventListener('click', () => {
      jsonErr.textContent = '';
      if (!jsonMode) {
        jsonArea.value = JSON.stringify(form.collect(false).args, null, 2);
      } else {
        try { form.set(JSON.parse(jsonArea.value || '{}')); } catch (e) { jsonErr.textContent = t('err_json', { m: e.message }); return; }
      }
      jsonMode = !jsonMode;
      form.el.hidden = jsonMode; jsonArea.hidden = !jsonMode;
      modeBtn.setAttribute('aria-pressed', String(jsonMode));
      modeBtn.textContent = jsonMode ? '☰ ' + t('form_mode') : '{ } ' + t('json_mode');
      (jsonMode ? jsonArea : form.el.querySelector('input,select,textarea'))?.focus();
    });
    const getArgs = () => {
      if (!jsonMode) return form.collect(true);
      try {
        const a = JSON.parse(jsonArea.value || '{}');
        if (!a || typeof a !== 'object' || Array.isArray(a)) throw new Error(t('err_obj'));
        jsonErr.textContent = ''; return { args: a, errors: 0 };
      } catch (e) { jsonErr.textContent = t('err_json', { m: e.message }); jsonArea.focus(); return { args: null, errors: 1 }; }
    };
    const loadExample = () => {
      const ex = subst(cat.example || {});
      form.set(ex); jsonArea.value = JSON.stringify(ex, null, 2);
      if (cat.needs === 'file') toast(t('needs_file'));
    };
    const toolbar = h('div', { class: 'toolbar' },
      cat.example ? h('button', { class: 'btn sm', type: 'button', onclick: loadExample }, '✨ ' + t('example')) : null,
      h('button', { class: 'btn sm', type: 'button', onclick: () => { form.set({}); jsonArea.value = '{}'; } }, t('clear')),
      modeBtn,
      h('button', { class: 'btn sm', type: 'button', onclick: () => { const g = getArgs(); if (g.args) copyText(curlFor(name, g.args)); } }, '⧉ ' + t('curl')));
    const runBtn = h('button', { class: 'btn primary', type: 'submit' }, '▶ ' + t('run'));
    const formEl = h('form', { novalidate: true, onsubmit: ev => { ev.preventDefault(); run(); } },
      toolbar, form.el, jsonArea, jsonErr,
      cat.needs === 'file' ? h('p', { class: 'note warn small' }, t('needs_file')) : null,
      form.hasPath && !S.dirs.length ? h('p', { class: 'note bad small' }, t('no_ws')) : null,
      h('div', { class: 'runbar' }, runBtn, h('span', { class: 'muted small' }, t('kbd_run'))));
    formCard.append(formEl);
    formEl.addEventListener('keydown', ev => { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); run(); } });

    if (S.pending && S.pending.tool === name) { form.set(S.pending.args); S.pending = null; }
    else if (cat.example && !cat.needs) loadExample();

    async function run() {
      const { args, errors } = getArgs();
      if (errors || !args) return;
      if (!an.readOnlyHint && !(await confirmWrite(name, args))) return;
      const ctrl = new AbortController();
      runBtn.disabled = true;
      clear(resultCard).append(h('h3', {}, t('result')),
        h('div', { class: 'row', role: 'status' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('running'),
          h('button', { class: 'btn sm ghost', type: 'button', onclick: () => ctrl.abort() }, t('cancel'))));
      try {
        const res = await callTool(name, args, { signal: ctrl.signal });
        clear(resultCard).append(h('h3', {}, t('result')), resultView(name, args, res));
      } catch (e) {
        clear(resultCard).append(h('h3', {}, t('result')), errorNote(e));
      } finally { runBtn.disabled = false; }
    }
    focusMain(v);
  }

  function curlFor(name, args) {
    const base = location.origin;
    const body = JSON.stringify(args).replace(/'/g, "'\\''");
    return `curl -s -X POST ${base}/v1/tools/${name} -H "Authorization: Bearer $KOSIF_MCP_TOKEN" -H "Content-Type: application/json" -d '${body}'`;
  }

  // Resolved from the buttons/Esc directly: the dialog 'close' event is not reliable in every host (e.g. a hidden pane).
  function confirmWrite(name, args) {
    return new Promise(resolve => {
      const d = $('#confirmDlg'), yes = $('#confirmYes'), no = $('#confirmNo');
      $('#confirmTool').textContent = name;
      $('#confirmArgs').textContent = JSON.stringify(args, null, 2);
      const done = ok => {
        yes.removeEventListener('click', onYes); no.removeEventListener('click', onNo);
        d.removeEventListener('cancel', onEsc); d.removeEventListener('close', onNo);
        if (d.open) d.close();
        resolve(ok);
      };
      const onYes = () => done(true), onNo = () => done(false);
      const onEsc = ev => { ev.preventDefault(); done(false); };
      yes.addEventListener('click', onYes); no.addEventListener('click', onNo);
      d.addEventListener('cancel', onEsc); d.addEventListener('close', onNo);
      if (!d.open) d.showModal();
      no.focus();
    });
  }

  function errorNote(e) {
    const p = h('div', { class: 'note bad' }, h('b', {}, t('error') + ': '), String(e.message || e));
    if (e.kind === 'auth') p.append(' ', h('button', { class: 'btn sm', type: 'button', onclick: openConn }, '🔑 ' + t('connect')));
    return p;
  }

  // ── schema → form ─────────────────────────────────────────────────────────
  const LONG = new Set(['prompt', 'text', 'html', 'css', 'diff', 'pr_body', 'pr_template', 'question', 'problem', 'task', 'intent', 'subject',
    'central_conflict', 'instruction', 'goal', 'action', 'commit_message', 'route_question']);
  const PATHS = new Set(['path', 'out', 'target', 'compare_with']);
  function kindOf(name, spec) {
    const ty = spec.type;
    if (spec.enum) return 'enum';
    if (ty === 'boolean') return 'bool';
    if (ty === 'integer' || ty === 'number') return 'num';
    if (ty === 'array') return spec.items && spec.items.type === 'string' ? 'lines' : 'json';
    if (ty === 'object' || !ty) return 'json';
    if (name === 'brand') return 'color';
    if (LONG.has(name)) return 'long';
    return 'text';
  }
  function buildForm(tool) {
    const schema = tool.inputSchema || {};
    const props = schema.properties || {};
    const req = new Set(schema.required || []);
    const names = Object.keys(props).sort((a, b) => (req.has(b) - req.has(a)));
    const fields = [];
    const wrap = h('div', { class: 'fields' });
    let hasPath = false;
    for (const name of names) {
      const spec = props[name] || {};
      const kind = kindOf(name, spec);
      const id = `f-${tool.name}-${name}`;
      const helpId = id + '-h', errId = id + '-e';
      let input, colorPick = null;
      const common = { id, name, 'aria-describedby': helpId + ' ' + errId, 'aria-required': req.has(name) ? 'true' : null };
      if (kind === 'enum') {
        input = h('select', common, h('option', { value: '' }, req.has(name) ? '—' : t('enum_default')), spec.enum.map(o => h('option', { value: String(o) }, String(o))));
      } else if (kind === 'bool') {
        input = h('select', common, h('option', { value: '' }, t('bool_default')), h('option', { value: 'true' }, t('yes')), h('option', { value: 'false' }, t('no')));
      } else if (kind === 'num') {
        input = h('input', { ...common, type: 'number', inputmode: spec.type === 'integer' ? 'numeric' : 'decimal', step: spec.type === 'integer' ? '1' : 'any', min: spec.minimum, max: spec.maximum, dir: 'ltr' });
      } else if (kind === 'lines' || kind === 'json' || kind === 'long') {
        input = h('textarea', { ...common, rows: kind === 'long' ? 3 : 4, class: kind === 'json' ? 'code' : null, dir: kind === 'long' ? 'auto' : (kind === 'json' ? 'ltr' : 'auto'), spellcheck: kind === 'long' ? null : 'false' });
      } else if (kind === 'color') {
        input = h('input', { ...common, type: 'text', class: 'code', dir: 'ltr', placeholder: '#0f766e' });
        colorPick = h('input', { type: 'color', 'aria-label': name, value: '#0f766e' });
        colorPick.addEventListener('input', () => { input.value = colorPick.value; });
        input.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(input.value)) colorPick.value = input.value; });
      } else {
        input = h('input', { ...common, type: 'text', dir: 'auto' });
      }
      const isPath = PATHS.has(name) || name === 'paths';
      if (isPath) { hasPath = true; input.setAttribute('dir', 'ltr'); if (S.dirs.length && input.tagName === 'INPUT') { input.setAttribute('list', 'dl-dirs'); ensureDirList(); } }
      const kindLabel = kind === 'lines' ? t('lines_hint') : kind === 'json' ? t('json_hint') + (spec.type ? ' · ' + spec.type : '') : (spec.type || '');
      const helpTxt = [spec.description || '', isPath && S.dirs.length ? t('path_hint', { d: S.dirs[0] }) : ''].filter(Boolean).join(' — ');
      const err = h('p', { class: 'err', id: errId, role: 'alert' });
      const wide = kind === 'json' || kind === 'long' || kind === 'lines';
      fields.push({ name, kind, spec, input, err, colorPick });
      wrap.append(h('div', { class: 'field' + (wide ? ' wide' : '') },
        h('label', { for: id }, name, req.has(name) ? h('span', { class: 'req', 'aria-hidden': 'true' }, ' *') : null,
          req.has(name) ? h('span', { class: 'sr-only' }, ' (' + t('required') + ')') : null, h('span', { class: 'kind' }, kindLabel)),
        colorPick ? h('div', { class: 'colorrow' }, colorPick, input) : input,
        h('p', { class: 'help', id: helpId, dir: 'auto', lang: 'en' }, helpTxt), err));
    }
    let extra = null;
    if (schema.additionalProperties === true) {
      const id = `f-${tool.name}-__extra`;
      extra = { input: h('textarea', { id, class: 'code', rows: 3, dir: 'ltr', spellcheck: 'false', placeholder: '{ }', 'aria-describedby': id + '-h' }), err: h('p', { class: 'err', role: 'alert' }) };
      wrap.append(h('div', { class: 'field wide' }, h('label', { for: id }, t('extra_args')), extra.input, h('p', { class: 'help', id: id + '-h' }, t('extra_help')), extra.err));
    }
    if (!names.length && !extra) wrap.append(h('p', { class: 'muted' }, '—'));

    function collect(strict) {
      const args = {}; let errors = 0; let first = null;
      const fail = (f, msg) => { errors++; f.err.textContent = msg; f.input.setAttribute('aria-invalid', 'true'); first = first || f.input; };
      for (const f of fields) {
        f.err.textContent = ''; f.input.removeAttribute('aria-invalid');
        const raw = f.input.value;
        if (raw === '' || raw == null) { if (strict && req.has(f.name)) fail(f, t('err_required')); continue; }
        try {
          if (f.kind === 'bool') args[f.name] = raw === 'true';
          else if (f.kind === 'num') {
            const n = Number(raw);
            if (!Number.isFinite(n)) { fail(f, t('err_number')); continue; }
            if (f.spec.type === 'integer' && !Number.isInteger(n)) { fail(f, t('err_int')); continue; }
            args[f.name] = n;
          } else if (f.kind === 'lines') {
            const arr = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            if (arr.length) args[f.name] = arr;
          } else if (f.kind === 'json') {
            const val = JSON.parse(raw);
            if (f.spec.type === 'object' && (typeof val !== 'object' || val === null || Array.isArray(val))) { fail(f, t('err_obj')); continue; }
            if (f.spec.type === 'array' && !Array.isArray(val)) { fail(f, t('err_arr')); continue; }
            args[f.name] = val;
          } else if (f.kind === 'enum') {
            const opt = f.spec.enum.find(o => String(o) === raw);
            args[f.name] = opt === undefined ? raw : opt;
          } else args[f.name] = raw;
        } catch (e) { fail(f, t('err_json', { m: e.message })); }
      }
      if (extra) {
        extra.err.textContent = ''; extra.input.removeAttribute('aria-invalid');
        const raw = extra.input.value.trim();
        if (raw) {
          try {
            const o = JSON.parse(raw);
            if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(t('err_obj'));
            Object.assign(args, o);
          } catch (e) { errors++; extra.err.textContent = t('err_json', { m: e.message }); extra.input.setAttribute('aria-invalid', 'true'); first = first || extra.input; }
        }
      }
      if (strict && first) first.focus();
      return { args, errors: strict ? errors : 0 };
    }
    function set(args) {
      const rest = { ...(args || {}) };
      for (const f of fields) {
        f.err.textContent = ''; f.input.removeAttribute('aria-invalid');
        const v = rest[f.name]; delete rest[f.name];
        if (v === undefined || v === null) { f.input.value = ''; continue; }
        if (f.kind === 'bool') f.input.value = v ? 'true' : 'false';
        else if (f.kind === 'lines') f.input.value = Array.isArray(v) ? v.join('\n') : String(v);
        else if (f.kind === 'json') f.input.value = JSON.stringify(v, null, 2);
        else f.input.value = String(v);
        if (f.colorPick && /^#[0-9a-f]{6}$/i.test(f.input.value)) f.colorPick.value = f.input.value;
      }
      if (extra) extra.input.value = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
    }
    return { el: wrap, collect, set, hasPath };
  }
  function ensureDirList() {
    if ($('#dl-dirs')) return;
    document.body.append(h('datalist', { id: 'dl-dirs' }, S.dirs.map(d => h('option', { value: d }))));
  }

  // ── results ───────────────────────────────────────────────────────────────
  function resultView(name, args, res) {
    const box = h('div', {});
    const v = res.value;
    const verdict = !res.isError ? verdictOf(v) : null;
    const exit = v && typeof v === 'object' && 'exit_code' in v ? v.exit_code : null;
    let rawMode = false;
    const body = h('div', {});
    const draw = () => {
      clear(body);
      if (rawMode) { body.append(h('pre', { class: 'code', dir: 'ltr' }, typeof v === 'string' ? v : JSON.stringify(v, null, 2))); return; }
      if (res.isError) { body.append(h('div', { class: 'note bad', dir: 'auto' }, String((v && v.error) || v))); return; }
      const ins = renderInsight(name, v, args);
      if (ins) body.append(ins);
      const det = h('details', { open: ins ? null : true }, h('summary', {}, t('full_data')), h('div', { class: 'jt' }, jsonTree(v, null, 0)));
      body.append(det);
    };
    const rawBtn = h('button', { class: 'btn sm', type: 'button', 'aria-pressed': 'false', onclick: () => { rawMode = !rawMode; rawBtn.setAttribute('aria-pressed', String(rawMode)); draw(); } }, t('raw'));
    box.append(h('div', { class: 'result-head' },
      res.isError ? badge('✕ ' + t('error'), 'bad') : badge('✓ ' + t('ok'), 'ok'),
      verdict ? badge(String(verdict), verdictClass(verdict)) : null,
      exit != null ? h('span', { class: 'meta' }, `${t('exit')} ${exit}`) : null,
      h('span', { class: 'meta' }, `${fmt(res.ms)} ${t('ms')} · ${fmt(Math.ceil((res.bytes || 0) / 1024))} KB`),
      h('span', { class: 'grow' }),
      h('button', { class: 'btn sm', type: 'button', onclick: () => copyText(typeof v === 'string' ? v : JSON.stringify(v, null, 2)) }, '⧉ ' + t('copy')),
      h('button', { class: 'btn sm', type: 'button', onclick: () => download(`${name}-${Date.now()}.json`, { tool: name, arguments: args, result: v, isError: res.isError }) }, '⤓ ' + t('download')),
      rawBtn), body);
    draw();
    return box;
  }

  function jsonTree(v, key, depth) {
    const label = key == null ? null : h('span', { class: 'k' }, String(key) + ': ');
    if (v === null || typeof v !== 'object') {
      if (typeof v === 'string' && (v.length > 140 || v.includes('\n'))) {
        return h('div', { class: 'leaf' }, label, h('pre', { class: 'jt-str', dir: 'auto' }, v));
      }
      const cls = typeof v === 'string' ? 's' : typeof v === 'number' ? 'n' : typeof v === 'boolean' ? 'b' : 'z';
      return h('div', { class: 'leaf' }, label, h('span', { class: cls, dir: typeof v === 'string' ? 'auto' : 'ltr' }, typeof v === 'string' ? `"${v}"` : String(v)));
    }
    const isArr = Array.isArray(v);
    const entries = isArr ? v.map((x, i) => [i, x]) : Object.entries(v);
    const det = h('details', { open: depth < 2 ? true : null },
      h('summary', {}, label, h('span', {}, isArr ? `[${entries.length}]` : `{${entries.length}}`)));
    let rendered = 0;
    const PAGE = 200;
    const more = () => {
      const chunk = entries.slice(rendered, rendered + PAGE);
      const btn = det.querySelector(':scope > .more');
      if (btn) btn.remove();
      chunk.forEach(([k, x]) => det.append(jsonTree(x, k, depth + 1)));
      rendered += chunk.length;
      if (rendered < entries.length) det.append(h('button', { class: 'btn sm more', type: 'button', onclick: more }, t('show_more', { n: fmt(entries.length - rendered) })));
    };
    if (depth < 2) more();
    else det.addEventListener('toggle', () => { if (det.open && !rendered) more(); });
    return det;
  }

  // safe markdown → DOM (headings start at h3; links only http/https; no raw HTML)
  function md(text) {
    const frag = document.createDocumentFragment();
    let src = String(text || '').replace(/\r\n/g, '\n');
    if (src.startsWith('---\n')) {
      const end = src.indexOf('\n---', 4);
      if (end > 0) {
        frag.append(h('details', {}, h('summary', { class: 'muted small' }, 'metadata'), h('pre', { class: 'code', dir: 'ltr' }, src.slice(4, end))));
        src = src.slice(end + 4).replace(/^\n/, '');
      }
    }
    const lines = src.split('\n');
    let i = 0, para = [];
    const flush = () => { if (para.length) { frag.append(h('p', { dir: 'auto' }, inline(para.join(' ')))); para = []; } };
    while (i < lines.length) {
      const ln = lines[i];
      const fence = /^\s*(```|~~~)/.exec(ln);
      if (fence) {
        flush(); const code = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith(fence[1])) code.push(lines[i++]);
        i++; frag.append(h('pre', {}, h('code', {}, code.join('\n')))); continue;
      }
      const hd = /^(#{1,6})\s+(.*)$/.exec(ln);
      if (hd) { flush(); frag.append(h('h' + Math.min(6, hd[1].length + 2), { dir: 'auto' }, inline(hd[2]))); i++; continue; }
      if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(ln)) { flush(); frag.append(h('hr')); i++; continue; }
      if (/^\s*\|.*\|\s*$/.test(ln) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        flush();
        const cells = s => s.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const head = cells(ln); i += 2; const rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
        frag.append(h('div', { class: 'tablewrap' }, h('table', {}, h('thead', {}, h('tr', {}, head.map(c => h('th', { dir: 'auto' }, inline(c))))),
          h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => h('td', { dir: 'auto' }, inline(c))))))))); continue;
      }
      if (/^\s*>/.test(ln)) {
        flush(); const q = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ''));
        frag.append(h('blockquote', { dir: 'auto' }, inline(q.join(' ')))); continue;
      }
      const li = /^\s*([-*+]|\d+[.)])\s+(.*)$/.exec(ln);
      if (li) {
        flush(); const ordered = /\d/.test(li[1]); const items = [];
        while (i < lines.length) {
          const m = /^\s*([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
          if (m) { items.push(m[2]); i++; }
          else if (/^\s{2,}\S/.test(lines[i]) && items.length) { items[items.length - 1] += ' ' + lines[i].trim(); i++; }
          else break;
        }
        frag.append(h(ordered ? 'ol' : 'ul', {}, items.map(x => h('li', { dir: 'auto' }, inline(x))))); continue;
      }
      if (!ln.trim()) { flush(); i++; continue; }
      para.push(ln.trim()); i++;
    }
    flush();
    return frag;
  }
  function inline(s) {
    const out = [];
    const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
    let last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push(s.slice(last, m.index));
      const tok = m[0];
      if (m[1]) out.push(h('code', {}, tok.slice(1, -1)));
      else if (m[2]) out.push(h('strong', {}, tok.slice(2, -2)));
      else {
        const mm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
        out.push(/^https?:\/\//i.test(mm[2]) ? h('a', { href: mm[2], target: '_blank', rel: 'noopener noreferrer' }, mm[1]) : mm[1]);
      }
      last = re.lastIndex;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }

  // per-tool "insight" renderers on top of the generic tree
  function renderInsight(name, v, args) {
    if (!v || typeof v !== 'object') return null;
    const r = v.result && typeof v.result === 'object' && !Array.isArray(v.result) ? v.result : v;
    const fn = INSIGHTS[name];
    let node = null;
    try { node = fn ? fn(v, r, args) : null; } catch { node = null; }
    if (node) return node;
    return genericIssues(r);
  }
  function genericIssues(r) {
    const parts = [];
    if (Array.isArray(r.findings) && r.findings.length && typeof r.findings[0] === 'object') {
      parts.push(h('h4', {}, `${t('findings')} (${fmt(r.findings.length)})`), h('div', { class: 'tablewrap' }, h('table', {},
        h('thead', {}, h('tr', {}, [t('severity'), t('rule'), t('where'), t('message')].map(x => h('th', {}, x)))),
        h('tbody', {}, r.findings.slice(0, 200).map(f => h('tr', {},
          h('td', {}, badge(String(f.severity || f.level || ''), verdictClass(/crit|high|block/i.test(f.severity || f.level || '') ? 'BLOCK' : /med|warn/i.test(f.severity || f.level || '') ? 'REVISE' : 'OK'))),
          h('td', { dir: 'ltr' }, String(f.rule || f.id || '')),
          h('td', { dir: 'ltr' }, String(f.file || f.path || f.where || '') + (f.line ? ':' + f.line : '')),
          h('td', { dir: 'auto' }, String(f.message || f.detail || f.reason || ''))))))));
    }
    if (Array.isArray(r.issues) && r.issues.length) {
      parts.push(h('h4', {}, `${t('issues')} (${fmt(r.issues.length)})`), h('ul', {}, r.issues.slice(0, 100).map(x =>
        typeof x === 'object' && x ? h('li', { dir: 'auto' }, x.severity ? badge(String(x.severity), verdictClass(/high|block|crit/i.test(x.severity) ? 'BLOCK' : 'REVISE')) : null, ' ', String(x.message || x.issue || JSON.stringify(x)))
          : h('li', { dir: 'auto' }, String(x)))));
    }
    if (typeof r.score === 'number') parts.unshift(h('p', {}, h('b', {}, t('score') + ': '), fmt(r.score)));
    return parts.length ? h('div', {}, parts) : null;
  }
  const familyChips = fams => h('div', {}, (fams || []).map(f => h('div', { class: 'card' },
    h('h4', {}, (lang === 'ar' && S.catalog.families[f.id]) || f.title),
    h('div', { class: 'chips' }, (f.tools || []).filter(n => S.byName[n]).map(n => h('a', { class: 'chip', href: '#/tool/' + n }, '🛠 ' + toolLabel(n))),
      (f.skills || []).map(s => h('a', { class: 'chip', href: '#/skills/' + encodeURIComponent(s) }, '📘 ' + s))))));
  function memberCard(m, role) {
    return h('button', { class: 'member', type: 'button', onclick: () => showMember(m.id) },
      h('strong', {}, m.name || m.id), m.laqab ? h('small', {}, '«' + m.laqab + '»') : null,
      h('small', {}, [role, m.title].filter(Boolean).join(' · ')),
      m.psych_state ? h('small', {}, '🧠 ' + (m.psych_state.name || m.psych_state.key || '')) : null,
      h('small', { dir: 'ltr' }, m.id));
  }
  async function showMember(id) {
    infoOpen(id, h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('loading')));
    try {
      const r = await callTool('kosif_council_expert', { id, with_prompt: false });
      const m = r.value || {};
      infoOpen(`${m.name || id} — ${m.title || ''}`, h('div', {},
        h('p', { class: 'chips' }, (m.domains || []).map(d => h('span', { class: 'chip' }, d))),
        (m.powers || []).length ? h('ul', {}, m.powers.map(p => h('li', {}, p.name))) : null,
        m.description ? h('pre', { class: 'code', dir: 'auto' }, m.description) : h('div', { class: 'jt' }, jsonTree(m, null, 0))));
    } catch (e) { infoOpen(id, errorNote(e)); }
  }
  function infoOpen(title, body) {
    $('#infoTitle').textContent = title;
    clear($('#infoBody')).append(body);
    const d = $('#infoDlg'); if (!d.open) d.showModal();
  }
  const INSIGHTS = {
    kosif_route(v) {
      return h('div', {}, h('p', {}, badge('mode: ' + (v.mode_hint || '?'), 'info')),
        h('h4', {}, t('families')), familyChips(v.families),
        (v.next_steps || []).length ? h('div', {}, h('h4', {}, t('next_steps')), h('ul', { class: 'small' }, v.next_steps.map(s => h('li', { dir: 'auto' }, s)))) : null);
    },
    kosif_skill_auto(v) {
      const s = v.selected; if (!s) return null;
      const isAtlas = s.source === 'atlas';
      const sid = isAtlas ? parseInt(String(s.id).split(':')[1], 10) : null;
      const jv = v.jev || {};
      return h('div', { class: 'card' }, h('h4', {}, t('chosen_skill')),
        h('p', { class: 'row' }, h('strong', {}, s.name), badge(s.source, isAtlas ? 'warn' : 'ok'), v.decided_by ? badge(t('decided_by') + ': ' + v.decided_by, 'info') : null,
          jv.confidence != null ? badge(t('confidence') + ' ' + Math.round(jv.confidence * 100) + '%', 'mute') : null),
        h('p', { class: 'muted small', dir: 'auto' }, s.description || ''),
        h('div', { class: 'chips' },
          isAtlas ? h('button', { class: 'chip', type: 'button', onclick: () => atlasRead(sid) }, '📖 ' + t('read'))
            : h('a', { class: 'chip', href: '#/skills/' + encodeURIComponent(s.name) }, '📘 ' + t('open_skill'))),
        (v.also_consider || []).length ? h('p', { class: 'small' }, h('b', {}, t('alternatives') + ': '), v.also_consider.map(a => a.name).join('، ')) : null,
        s.content ? h('details', {}, h('summary', {}, 'SKILL.md'), h('div', { class: 'md' }, md(s.content))) : null);
    },
    kosif_skill_read(v) {
      return h('div', {}, (v.files || []).length ? h('div', { class: 'chips' }, h('span', { class: 'small muted' }, t('files') + ':'), v.files.map(f => h('a', { class: 'chip', href: `#/skills/${encodeURIComponent(v.name)}/${f}` }, f))) : null,
        v.content ? h('div', { class: 'md' }, md(v.content)) : null);
    },
    kosif_atlas_read(v) {
      return h('div', { class: 'untrusted' }, h('p', { class: 'note warn' }, '⚠️ ' + t('untrusted')),
        h('p', { class: 'row small' }, h('strong', {}, v.skill || ''), badge(v.license || '?', v.permissive ? 'ok' : 'warn'),
          v.online_url ? h('a', { href: v.online_url, target: '_blank', rel: 'noopener noreferrer' }, t('source') + ' ↗') : null),
        (v.injection_flags || []).length ? h('p', { class: 'note bad small' }, 'injection flags: ' + v.injection_flags.join(', ')) : null,
        v.content ? h('div', { class: 'md' }, md(v.content)) : null);
    },
    kosif_atlas_search(v) {
      return h('div', {}, h('p', { class: 'muted small' }, t('results_n', { n: fmt(v.count || 0) })), (v.results || []).map(atlasCard));
    },
    kosif_council_panel(v) {
      const g = v.governing || {};
      return h('div', {}, h('h4', {}, t('governing')), h('div', { class: 'grid' }, Object.entries(g).map(([role, m]) => memberCard(m, role))),
        (v.elite || []).length ? [h('h4', {}, t('elite')), h('div', { class: 'grid' }, v.elite.map(m => memberCard(m)))] : null,
        (v.scholars || []).length ? [h('h4', {}, t('scholars')), h('div', { class: 'grid' }, v.scholars.map(m => memberCard(m)))] : null,
        v.how_to_run ? h('p', { class: 'note small', dir: 'auto' }, v.how_to_run) : null);
    },
    kosif_council_expert(v) {
      return h('div', {}, h('div', { class: 'grid' }, memberCard(v)), v.description ? h('pre', { class: 'code', dir: 'auto' }, v.description) : null);
    },
    kosif_council100_select(v, r) {
      return (r.personas || []).length ? h('div', {}, h('p', {}, badge('mode: ' + r.mode, 'info'), ' ', badge(fmt(r.count) + ' personas', 'mute')),
        h('div', { class: 'grid' }, r.personas.map(p => h('div', { class: 'member' }, h('strong', {}, lang === 'ar' && p.name_ar ? p.name_ar : p.name),
          h('small', {}, p.chamber + (p.veto ? ' · veto: ' + p.veto : '')), h('small', { dir: 'auto', lang: 'en' }, p.question || ''))))) : null;
    },
    kosif_design_tokens(v, r) {
      const tk = r.tokens; if (!tk) return null;
      const swatch = (name, color) => {
        const i = h('i'); if (/^#[0-9a-f]{3,8}$/i.test(color)) i.style.background = color;
        return h('div', { class: 'sw' }, i, h('span', {}, name), h('span', {}, color));
      };
      return h('div', {},
        h('h4', {}, t('light')), h('div', { class: 'swatches' }, Object.entries(tk.light || {}).map(([k, c]) => swatch(k, c))),
        h('h4', {}, t('dark')), h('div', { class: 'swatches' }, Object.entries(tk.dark || {}).map(([k, c]) => swatch(k, c))),
        (r.contrast || []).length ? [h('h4', {}, t('contrast')), h('div', { class: 'tablewrap' }, h('table', {},
          h('thead', {}, h('tr', {}, ['', t('pair'), t('ratio'), t('pass')].map(x => h('th', {}, x)))),
          h('tbody', {}, r.contrast.map(c => h('tr', {}, h('td', {}, c.theme), h('td', {}, c.pair), h('td', { class: 'num' }, `${c.ratio} / ${c.needed}`),
            h('td', {}, badge(c.pass ? '✓' : '✕', c.pass ? 'ok' : 'bad')))))))] : null,
        r.css ? h('details', {}, h('summary', {}, 'CSS'), h('pre', { class: 'code', dir: 'ltr' }, r.css), h('button', { class: 'btn sm', type: 'button', onclick: () => copyText(r.css) }, '⧉ ' + t('copy'))) : null);
    },
    kosif_prompt_forge(v, r) {
      const ps = r.prompts; if (!ps) return null;
      return h('div', {}, (r.warnings || []).length ? h('ul', { class: 'note warn small' }, r.warnings.map(w => h('li', {}, w))) : null,
        Object.entries(ps).map(([plat, p]) => {
          const text = typeof p === 'string' ? p : p.prompt || JSON.stringify(p);
          const out = h('div', {});
          return h('div', { class: 'prompt-box' },
            h('div', { class: 'row between' }, h('strong', {}, plat),
              h('span', { class: 'row' },
                h('button', { class: 'btn sm', type: 'button', onclick: () => copyText(text) }, '⧉ ' + t('copy')),
                h('button', { class: 'btn sm', type: 'button', onclick: async () => {
                  clear(out).append(h('span', { class: 'spinner', 'aria-hidden': 'true' }));
                  try { const lr = await callTool('kosif_image_prompt_lint', { prompt: text, mode: (r.mode || 'image') === 'video' ? 'video' : 'image' }); clear(out).append(resultView('kosif_image_prompt_lint', {}, lr)); }
                  catch (e) { clear(out).append(errorNote(e)); }
                } }, '🔍 ' + t('lint')))),
            h('pre', { class: 'code', dir: 'ltr' }, text),
            p && p.negative_prompt ? h('p', { class: 'small', dir: 'ltr' }, 'negative: ' + p.negative_prompt) : null, out);
        }));
    },
    kosif_corpus_search(v) {
      return h('div', {}, (v.results || []).map(x => h('div', { class: 'card' },
        h('p', { class: 'row small' }, h('strong', { dir: 'auto' }, x.file), badge(t('score') + ' ' + x.score, 'mute'), h('code', {}, '@' + x.offset)),
        h('pre', { class: 'code', dir: 'auto' }, x.snippet || ''),
        h('button', { class: 'btn sm', type: 'button', onclick: async () => {
          try { const rr = await callTool('kosif_corpus_read', { file: x.file, offset: Math.max(0, (x.offset || 0) - 2000), length: 6000 }); infoOpen(x.file, h('pre', { class: 'code', dir: 'auto' }, (rr.value && (rr.value.text || rr.value.content)) || JSON.stringify(rr.value, null, 2))); }
          catch (e) { infoOpen(x.file, errorNote(e)); }
        } }, t('read_more')))));
    },
    kosif_doctor(v) {
      return (v.checks || []).length ? h('ul', {}, v.checks.map(c => h('li', {}, c.ok ? '✅ ' : '⚠️ ', h('b', {}, c.check), c.detail ? ' — ' : '', h('span', { dir: 'auto' }, c.detail || '')))) : null;
    },
    kosif_jev_decide(v, r, args) {
      const d = v.decision; if (!d || !d.choice) return null;
      const opts = args && args.options && typeof args.options === 'object' && !Array.isArray(args.options) ? args.options : {};
      return h('div', {},
        h('p', { class: 'row' }, badge('→ ' + d.choice + (opts[d.choice] ? ' — ' + opts[d.choice] : ''), 'ok'),
          d.confidence != null ? badge(t('confidence') + ' ' + Math.round(d.confidence * 100) + '%', 'mute') : null,
          v.stable != null ? badge(v.stable ? 'stable ×2' : 'unstable', v.stable ? 'ok' : 'warn') : null,
          d.model ? h('span', { class: 'small muted', dir: 'ltr' }, d.model) : null),
        (d.ranking || []).length ? h('div', { class: 'tablewrap' }, h('table', {}, h('tbody', {}, d.ranking.map(([k, pr]) =>
          h('tr', {}, h('td', { dir: 'ltr' }, String(k)), h('td', { dir: 'auto' }, String(opts[k] || '')), h('td', { class: 'num' }, Math.round(pr * 100) + '%')))))) : null,
        (v.issues || []).length ? h('ul', { class: 'note warn small' }, v.issues.map(x => h('li', { dir: 'auto' }, String(x)))) : null);
    },
  };
  function atlasCard(x) {
    const out = h('div', {});
    return h('div', { class: 'card' },
      h('p', { class: 'row' }, h('strong', {}, x.skill || x.plugin), badge(x.license || '?', x.permissive ? 'ok' : 'warn'), h('span', { class: 'small muted' }, x.plugin),
        (x.risk_flags || []).map(f => badge(f, 'warn'))),
      h('p', { class: 'small', dir: 'auto', lang: 'en' }, x.description || ''),
      h('div', { class: 'row' },
        x.skill_id ? h('button', { class: 'btn sm', type: 'button', onclick: () => atlasRead(x.skill_id) }, '📖 ' + t('read')) : null,
        h('button', { class: 'btn sm', type: 'button', onclick: async () => {
          clear(out).append(h('span', { class: 'spinner', 'aria-hidden': 'true' }));
          try { const r = await callTool('kosif_atlas_inspect', x.skill_id ? { skill_id: x.skill_id } : { plugin_id: x.plugin_id }); clear(out).append(resultView('kosif_atlas_inspect', {}, r)); }
          catch (e) { clear(out).append(errorNote(e)); }
        } }, '🛡 ' + t('inspect')),
        x.online_url ? h('a', { class: 'btn sm ghost', href: x.online_url, target: '_blank', rel: 'noopener noreferrer' }, t('source') + ' ↗') : null),
      out);
  }
  async function atlasRead(id) {
    infoOpen('Atlas #' + id, h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('loading')));
    try {
      const r = await callTool('kosif_atlas_read', { skill_id: id, limit: 30000 });
      infoOpen((r.value && r.value.skill) || ('Atlas #' + id), r.isError ? errorNote(new Error(r.value.error)) : INSIGHTS.kosif_atlas_read(r.value));
    } catch (e) { infoOpen('Atlas #' + id, errorNote(e)); }
  }

  // ── workflows ─────────────────────────────────────────────────────────────
  const val = (res, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), res && res.value);
  const FLOWS = [
    { id: 'task', ic: '🧭', ar: ['من المهمة إلى المهارة', 'وجّه مهمتك ثم دع Jev يختار المهارة ويعيد كتيّبها.'], en: ['Task → skill', 'Route your task, then let Jev pick the skill and return its playbook.'],
      inputs: [{ k: 'task', kind: 'long', ar: 'مهمتك', en: 'Your task', def: 'صمم صفحة هبوط عربية لمتجر قهوة' }],
      steps: [{ tool: 'kosif_route', args: i => ({ intent: i.task }) }, { tool: 'kosif_skill_auto', args: i => ({ task: i.task, read: true }) }] },
    { id: 'council', ic: '🏛', ar: ['جلسة مجلس العباقرة', 'شكّل المجلس، واختر عدسات Council-100، واحصل على بروتوكول الجلسة.'], en: ['Genius Council session', 'Convene the council, pick Council-100 lenses and get the session protocol.'],
      inputs: [{ k: 'question', kind: 'long', ar: 'السؤال أو القرار', en: 'Question or decision', def: 'هل نطلق المنتج هذا الشهر أم ننتظر اختبارًا أوسع؟' }],
      steps: [{ tool: 'kosif_council_panel', args: i => ({ question: i.question, n_elite: 4, n_scholars: 6 }) },
        { tool: 'kosif_council100_select', args: i => ({ task: i.question, mode: 'pro' }) }, { tool: 'kosif_council_protocol', args: () => ({}) }] },
    { id: 'decide', ic: '⚖️', ar: ['قرار بتحكيم Jev', 'اكتب الخيارات سطرًا سطرًا والأدلة، ويختار Jev مرتين بترتيبين مختلفين.'], en: ['Decide with Jev', 'Write options line by line plus evidence; Jev chooses twice in two orders.'],
      inputs: [{ k: 'question', kind: 'text', ar: 'السؤال المغلق', en: 'Closed question', def: 'Which hosting fits a small Arabic web console best?' },
        { k: 'options', kind: 'lines', ar: 'الخيارات (سطر لكل خيار)', en: 'Options (one per line)', def: 'Local loopback server only\nCloudflare Tunnel with a bearer token\nPublic VPS with TLS reverse proxy' },
        { k: 'evidence', kind: 'long', ar: 'الأدلة والقيود', en: 'Evidence and constraints', def: 'single user; Windows 11; files stay on the PC; needs phone access sometimes' }],
      steps: [{ tool: 'kosif_jev_decide', args: i => {
        const opts = {}; String(i.options).split(/\n/).map(s => s.trim()).filter(Boolean).forEach((o, n) => { opts[String.fromCharCode(65 + n)] = o; });
        const q = /\?\s*$/.test(i.question) ? i.question : i.question + '?';
        return { mode: 'choice', question: q, evidence: { notes: i.evidence }, options: opts };
      } }] },
    { id: 'design', ic: '🎨', ar: ['هوية تصميم ثم تدقيق', 'ولّد رموز ألوان فاتحة وداكنة بتباين مضمون، ثم دقّق صفحة تجريبية بها.'], en: ['Design tokens → audit', 'Generate light/dark tokens with verified contrast, then audit a sample page using them.'],
      inputs: [{ k: 'brand', kind: 'color', ar: 'لون العلامة', en: 'Brand colour', def: '#8a5a2b' }],
      steps: [{ tool: 'kosif_design_tokens', args: i => ({ brand: i.brand, name: 'k' }) },
        { tool: 'kosif_web_audit', args: (i, rs) => ({ css: val(rs[0], 'result.css') || '',
          html: '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>معاينة رموز التصميم الجديدة</title></head><body><header><nav><a href="#main">تخطَّ إلى المحتوى</a></nav></header><main id="main"><h1>معاينة الهوية</h1><p>نص تجريبي لقياس التباين.</p><button type="button">زر أساسي</button></main></body></html>' }) }] },
    { id: 'prompt', ic: '🎬', ar: ['برومبت صورة لكل المنصات', 'صياغة واحدة إلى Midjourney وFlux وSDXL وChatGPT وغيرها، ثم فحص الجودة.'], en: ['One prompt, every platform', 'One spec to Midjourney, Flux, SDXL, ChatGPT and more, then a quality lint.'],
      inputs: [{ k: 'subject', kind: 'text', ar: 'الموضوع (بالإنجليزية)', en: 'Subject (English)', def: 'a white duck wearing a copper pot helmet' },
        { k: 'environment', kind: 'text', ar: 'المكان', en: 'Environment', def: 'volcanic cliff at sunset' },
        { k: 'style', kind: 'text', ar: 'الأسلوب', en: 'Style', def: 'epic fantasy illustration' },
        { k: 'aspect', kind: 'text', ar: 'الأبعاد', en: 'Aspect', def: '16:9' }],
      steps: [{ tool: 'kosif_prompt_forge', args: i => ({ mode: 'image', subject: i.subject, environment: i.environment, style: i.style, aspect: i.aspect, lens: '35mm', lighting: 'warm rim light from the right' }) },
        { tool: 'kosif_image_prompt_lint', args: (i, rs) => { const ps = val(rs[0], 'result.prompts') || {}; const first = ps.midjourney || Object.values(ps)[0]; return { mode: 'image', prompt: (first && (first.prompt || first)) || i.subject }; } }] },
    { id: 'code', ic: '🧪', ar: ['فحص كود قبل التسليم', 'فحص ثابت للأسرار والاستدعاءات الخطرة ثم بوابة التسليم بحكم نهائي.'], en: ['Code check before delivery', 'Static scan for secrets and dangerous calls, then the delivery gate verdict.'],
      inputs: [{ k: 'path', kind: 'path', ar: 'مجلد أو ملف', en: 'Folder or file', def: '{{workspace}}' }],
      steps: [{ tool: 'kosif_code_scan', args: i => ({ paths: [i.path] }) }, { tool: 'kosif_delivery_gate', args: i => ({ paths: [i.path], project: true }) }] },
    { id: 'search', ic: '🔎', ar: ['ابحث في مكتبتك وفي Atlas', 'بحث نصي عربي في ملفاتك، وبحث في آلاف المهارات الخارجية.'], en: ['Search your corpus and Atlas', 'Arabic-aware full-text search of your files plus thousands of external skills.'],
      inputs: [{ k: 'query', kind: 'text', ar: 'كلمات البحث', en: 'Search words', def: 'cinematic lighting' }],
      steps: [{ tool: 'kosif_corpus_search', args: i => ({ query: i.query, limit: 6 }) }, { tool: 'kosif_atlas_search', args: i => ({ query: i.query, limit: 6 }) }] },
    { id: 'safe', ic: '🛡', ar: ['بوابة إجراء آمن', 'قبل أي فعل له أثر: بوابة المخاطر، وفحص Git إذا كان أمر git.'], en: ['Safe-action gate', 'Before any action with side effects: the risk gate, plus a git preflight for git commands.'],
      inputs: [{ k: 'action', kind: 'text', ar: 'الإجراء', en: 'Action', def: 'git push --force origin main' },
        { k: 'side_effect', kind: 'enum', options: ['none', 'local-write', 'external-write', 'public-write', 'irreversible', 'unknown'], ar: 'نوع الأثر', en: 'Side effect', def: 'irreversible' }],
      steps: [{ tool: 'kosif_risk_gate', args: i => ({ gate: 'action', action: i.action, side_effect: i.side_effect, fresh_target_verified: false, explicit_approval: false }) },
        { tool: 'kosif_gh_preflight', when: i => /^\s*git\s/.test(i.action), args: i => ({ operations: [i.action] }) }] },
    { id: 'health', ic: '🩺', ar: ['فحص الجاهزية', 'الخادم وخدمة Jev الحية وAtlas والمكتبة في خطوة واحدة.'], en: ['Readiness check', 'Server, the live Jev service, Atlas and the corpus in one run.'],
      inputs: [], steps: [{ tool: 'kosif_doctor', args: () => ({}) }, { tool: 'kosif_jev_status', args: () => ({}) }, { tool: 'kosif_atlas_status', args: () => ({}) }, { tool: 'kosif_corpus_status', args: () => ({}) }] },
  ];
  const flowText = f => (lang === 'ar' ? f.ar : f.en);
  function flowTiles() {
    return h('div', { class: 'grid' }, FLOWS.map(f => h('a', { class: 'tile', href: '#/flow/' + f.id },
      h('span', { class: 'ic', 'aria-hidden': 'true' }, f.ic), h('strong', {}, flowText(f)[0]), h('span', { class: 'd' }, flowText(f)[1]),
      h('span', { class: 'small muted', dir: 'ltr' }, f.steps.map(s => s.tool.replace(/^kosif_/, '')).join(' → ')))));
  }
  function renderFlows() {
    const v = clear($('#view-flows'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('flows_title')), h('p', { class: 'muted' }, t('flows_lead')))), flowTiles());
    focusMain(v);
  }
  function renderFlow(id) {
    const f = FLOWS.find(x => x.id === id);
    const v = clear($('#view-flows'));
    if (!f) { renderFlows(); return; }
    const inputs = {};
    const fieldsEl = h('div', { class: 'fields' }, f.inputs.map(inp => {
      const fid = 'flow-' + f.id + '-' + inp.k;
      let el;
      const def = subst(inp.def || '');
      if (inp.kind === 'long' || inp.kind === 'lines') { el = h('textarea', { id: fid, rows: 3, dir: 'auto' }); el.value = def; }
      else if (inp.kind === 'enum') { el = h('select', { id: fid }, inp.options.map(o => h('option', { value: o }, o))); el.value = def; }
      else if (inp.kind === 'color') { el = h('input', { id: fid, type: 'color' }); el.value = def; }
      else { el = h('input', { id: fid, type: 'text', dir: inp.kind === 'path' ? 'ltr' : 'auto', list: inp.kind === 'path' && S.dirs.length ? 'dl-dirs' : null }); el.value = def; if (inp.kind === 'path') ensureDirList(); }
      inputs[inp.k] = el;
      return h('div', { class: 'field' + (inp.kind === 'long' || inp.kind === 'lines' ? ' wide' : '') }, h('label', { for: fid }, lang === 'ar' ? inp.ar : inp.en), el);
    }));
    const stepsEl = h('ol', { class: 'steps' }, f.steps.map((s, n) => h('li', { id: `st-${n}` },
      h('div', { class: 'row' }, h('strong', {}, t('step', { n: fmt(n + 1) }) + ' · '), h('a', { href: '#/tool/' + s.tool }, toolLabel(s.tool)), h('code', { dir: 'ltr', class: 'small' }, s.tool)),
      h('div', { class: 'body muted small' }, t('waiting')))));
    const runBtn = h('button', { class: 'btn primary', type: 'submit' }, '▶ ' + t('flow_run'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, f.ic + ' ' + flowText(f)[0]), h('p', { class: 'muted' }, flowText(f)[1])),
      h('a', { class: 'btn ghost', href: '#/flows' }, '← ' + t('flows_title'))),
    h('form', { class: 'card', novalidate: true, onsubmit: async ev => {
      ev.preventDefault(); runBtn.disabled = true;
      const iv = Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.value]));
      const results = [];
      for (let n = 0; n < f.steps.length; n++) {
        const s = f.steps[n]; const li = $(`#st-${n}`, stepsEl); const body = $('.body', li);
        body.className = 'body';
        if (s.when && !s.when(iv, results)) { clear(body).append(badge(t('skipped'), 'mute')); results.push(null); continue; }
        let args;
        try { args = s.args(iv, results); } catch (e) { clear(body).append(errorNote(e)); results.push(null); continue; }
        if (!(S.byName[s.tool].annotations || {}).readOnlyHint && !(await confirmWrite(s.tool, args))) { clear(body).append(badge(t('cancelled'), 'mute')); results.push(null); continue; }
        clear(body).append(h('div', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('running')));
        try {
          const res = await callTool(s.tool, args);
          results.push(res);
          clear(body).append(resultView(s.tool, args, res),
            h('button', { class: 'btn sm ghost', type: 'button', onclick: () => { S.pending = { tool: s.tool, args }; location.hash = '#/tool/' + s.tool; } }, '↗ ' + t('open_in_runner')));
        } catch (e) { results.push(null); clear(body).append(errorNote(e)); }
      }
      runBtn.disabled = false;
    } }, f.inputs.length ? h('h3', {}, t('inputs')) : null, fieldsEl, h('div', { class: 'runbar' }, runBtn)), stepsEl);
    focusMain(v);
  }

  // ── skills ────────────────────────────────────────────────────────────────
  async function renderSkills(name, path) {
    const v = clear($('#view-skills'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('skills_title')), h('p', { class: 'muted' }, t('skills_lead')))));
    const listBox = h('div', { class: 'card' });
    const doc = h('div', { class: 'card', 'aria-live': 'polite' }, h('p', { class: 'muted' }, t('pick_skill')));
    v.append(h('div', { class: 'two' }, listBox, doc));
    if (!S.skills) {
      listBox.append(h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('loading')));
      try { S.skills = (await rpc('resources/list')).resources || []; } catch (e) { clear(listBox).append(errorNote(e)); return; }
    }
    const filter = h('input', { type: 'search', placeholder: t('skills_filter'), 'aria-label': t('skills_filter') });
    const ul = h('ul', { class: 'list' });
    const draw = () => {
      const q = filter.value.trim().toLowerCase();
      clear(ul).append(S.skills.filter(s => !q || (s.name + ' ' + s.description).toLowerCase().includes(q)).map(s =>
        h('li', {}, h('button', { type: 'button', 'aria-current': s.name === name ? 'true' : 'false', onclick: () => { location.hash = '#/skills/' + encodeURIComponent(s.name); } },
          s.name, h('small', { dir: 'auto', lang: 'en' }, s.description)))));
    };
    filter.addEventListener('input', draw);
    clear(listBox).append(filter, ul); draw();
    if (!name) { focusMain(v); return; }
    clear(doc).append(h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('loading')));
    try {
      const r = await callTool('kosif_skill_read', path ? { name, path } : { name }, { quiet: true });
      if (r.isError) { clear(doc).append(errorNote(new Error(r.value.error))); return; }
      const fams = S.families.filter(f => f.skills.includes(name));
      clear(doc).append(h('h3', {}, name + (path ? ' / ' + path : '')),
        fams.length ? h('div', { class: 'chips' }, fams.flatMap(f => f.tools.map(n => h('a', { class: 'chip', href: '#/tool/' + n }, '🛠 ' + toolLabel(n))))) : null,
        path ? h('p', {}, h('a', { href: '#/skills/' + encodeURIComponent(name) }, '← SKILL.md')) : null,
        INSIGHTS.kosif_skill_read(r.value));
    } catch (e) { clear(doc).append(errorNote(e)); }
    focusMain(v);
  }

  // ── atlas ─────────────────────────────────────────────────────────────────
  function renderAtlas() {
    const v = clear($('#view-atlas'));
    const q = h('input', { id: 'atlasQ', type: 'search', dir: 'auto' }); q.value = store.sget('atlasQ', 'accessibility audit');
    const kind = h('select', { id: 'atlasKind' }, h('option', { value: 'skill' }, 'skill'), h('option', { value: 'plugin' }, 'plugin'));
    const lic = h('select', { id: 'atlasLic' }, h('option', { value: 'permissive' }, 'permissive'), h('option', { value: 'any' }, 'any'));
    const noex = h('input', { type: 'checkbox', id: 'atlasNoex' });
    const out = h('div', { 'aria-live': 'polite' });
    const btn = h('button', { class: 'btn primary', type: 'submit' }, '🔎 ' + t('search'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('atlas_title')), h('p', { class: 'muted' }, t('atlas_lead')))),
      h('form', { class: 'card', onsubmit: async ev => {
        ev.preventDefault(); if (!q.value.trim()) { q.focus(); return; }
        store.sset('atlasQ', q.value); btn.disabled = true;
        clear(out).append(h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('running')));
        try {
          const r = await callTool('kosif_atlas_search', { query: q.value.trim(), kind: kind.value, license: lic.value, no_executables: noex.checked, limit: 20 });
          clear(out).append(r.isError ? errorNote(new Error(r.value.error)) : INSIGHTS.kosif_atlas_search(r.value));
        } catch (e) { clear(out).append(errorNote(e)); }
        finally { btn.disabled = false; }
      } },
      h('div', { class: 'fields' },
        h('div', { class: 'field wide' }, h('label', { for: 'atlasQ' }, t('atlas_q')), q),
        h('div', { class: 'field' }, h('label', { for: 'atlasKind' }, t('kind')), kind),
        h('div', { class: 'field' }, h('label', { for: 'atlasLic' }, t('license')), lic)),
      h('label', { class: 'check' }, noex, ' ', t('no_exec')), h('div', { class: 'runbar' }, btn)), out);
    focusMain(v);
  }

  // ── commands (MCP prompts) ────────────────────────────────────────────────
  async function renderCommands() {
    const v = clear($('#view-commands'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('commands_title')), h('p', { class: 'muted' }, t('commands_lead')))));
    const box = h('div', { class: 'grid' });
    v.append(box);
    if (!S.prompts) {
      box.append(h('p', { class: 'row' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), t('loading')));
      try { S.prompts = (await rpc('prompts/list')).prompts || []; } catch (e) { clear(box).append(errorNote(e)); return; }
    }
    clear(box).append(S.prompts.map(p => {
      const id = 'cmd-' + p.name;
      const arg = h('input', { id, type: 'text', dir: 'auto', placeholder: ((p.arguments || [])[0] || {}).description || '' });
      const out = h('div', {});
      return h('form', { class: 'card', onsubmit: async ev => {
        ev.preventDefault();
        try {
          const r = await rpc('prompts/get', { name: p.name, arguments: { arguments: arg.value } });
          const text = ((r.messages || [])[0] || {}).content?.text || '';
          clear(out).append(h('pre', { class: 'code', dir: 'auto' }, text), h('button', { class: 'btn sm', type: 'button', onclick: () => copyText(text) }, '⧉ ' + t('copy_text')));
        } catch (e) { clear(out).append(errorNote(e)); }
      } }, h('h3', { dir: 'ltr' }, '/' + p.name), h('p', { class: 'small muted', dir: 'auto', lang: 'en' }, p.description || ''),
      h('label', { for: id }, t('cmd_args')), arg, h('div', { class: 'runbar' }, h('button', { class: 'btn sm primary', type: 'submit' }, t('cmd_gen'))), out);
    }));
    focusMain(v);
  }

  // ── history ───────────────────────────────────────────────────────────────
  function addHistory(tool, args, res) {
    S.history.unshift({ tool, args, ok: !res.isError, verdict: res.isError ? null : verdictOf(res.value), ms: res.ms, at: Date.now() });
    S.history = S.history.slice(0, 50);
    let blob = JSON.stringify(S.history);
    while (blob.length > 400000 && S.history.length > 1) { S.history.pop(); blob = JSON.stringify(S.history); }
    store.sset('history', blob);
  }
  function renderHistory() {
    const v = clear($('#view-history'));
    v.append(h('div', { class: 'head' }, h('div', {}, h('h2', {}, t('history_title')), h('p', { class: 'muted' }, t('history_lead'))),
      S.history.length ? h('button', { class: 'btn ghost', type: 'button', onclick: () => { S.history = []; store.sset('history', null); renderHistory(); } }, t('history_clear')) : null));
    if (!S.history.length) { v.append(h('p', { class: 'card muted' }, t('history_empty'))); focusMain(v); return; }
    const time = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    v.append(h('div', { class: 'card tablewrap' }, h('table', {},
      h('thead', {}, h('tr', {}, [t('when'), t('tool'), t('status'), t('time'), ''].map(x => h('th', {}, x)))),
      h('tbody', {}, S.history.map(e => h('tr', {},
        h('td', { class: 'num' }, time.format(e.at)),
        h('td', {}, toolLabel(e.tool), h('br'), h('code', { class: 'small', dir: 'ltr' }, e.tool)),
        h('td', {}, badge(e.ok ? t('ok') : t('error'), e.ok ? 'ok' : 'bad'), ' ', e.verdict ? badge(String(e.verdict), verdictClass(e.verdict)) : null),
        h('td', { class: 'num' }, fmt(e.ms) + ' ' + t('ms')),
        h('td', {}, S.byName[e.tool] ? h('button', { class: 'btn sm', type: 'button', onclick: () => { S.pending = { tool: e.tool, args: e.args }; location.hash = '#/tool/' + e.tool; } }, t('open')) : null)))))));
    focusMain(v);
  }

  // ── static bindings ───────────────────────────────────────────────────────
  function bindStatic() {
    window.addEventListener('hashchange', route);
    $('#toolSearch').addEventListener('input', renderTree);
    $('#toolSearch').addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { const a = $('#toolTree a'); if (a) { ev.preventDefault(); location.hash = a.getAttribute('href'); } }
    });
    $('#langBtn').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; store.set('lang', lang); applyLang(); if (S.connected) { setStatus('ok', `${t('connected')} · v${S.health.version} · ${fmt(S.tools.length)} ${t('kpi_tools')}`); route(); } });
    $('#themeBtn').addEventListener('click', () => { const cur = store.get('theme', 'auto'); store.set('theme', THEMES[(THEMES.indexOf(cur) + 1) % 3]); applyTheme(); });
    $('#connBtn').addEventListener('click', openConn);
    $('#connCancel').addEventListener('click', () => $('#connDlg').close());
    $('#disconnectBtn').addEventListener('click', () => {
      S.token = ''; store.sset('token', null); store.set('token', null); $('#tokenInput').value = ''; $('#connDlg').close(); connect();
    });
    $('#connForm').addEventListener('submit', ev => {
      ev.preventDefault();
      S.token = $('#tokenInput').value.trim();
      store.sset('token', S.token || null);
      store.set('token', $('#rememberToken').checked && S.token ? S.token : null);
      $('#connDlg').close(); S.homeStats = null; connect();
    });
    $('#infoClose').addEventListener('click', () => $('#infoDlg').close());
    $('#navToggle').addEventListener('click', () => {
      const side = $('#side'); const open = !side.classList.contains('open');
      side.classList.toggle('open', open); $('#navToggle').setAttribute('aria-expanded', String(open));
      if (open) $('#toolSearch').focus();
    });
    document.addEventListener('keydown', ev => {
      const tag = (ev.target && ev.target.tagName) || '';
      if (ev.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag) && !ev.ctrlKey && !ev.metaKey) {
        ev.preventDefault();
        if (window.matchMedia('(max-width:900px)').matches) { $('#side').classList.add('open'); $('#navToggle').setAttribute('aria-expanded', 'true'); }
        $('#toolSearch').focus();
      }
      if (ev.key === 'Escape' && $('#side').classList.contains('open')) closeNav();
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
