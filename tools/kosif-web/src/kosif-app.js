/* KOSIF app — screens, navigation, editor, documents, exports and the assistant. All arithmetic lives in kosif-core.js. */
(function () {
  'use strict';
  const K = window.KOSIFCore, I = window.KOSIFi18n, D = window.KOSIFData, Store = D.Store, t = I.t;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const clone = (o) => JSON.parse(JSON.stringify(o));

  /* ---------- icons ---------- */
  const P = {
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z', docs: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
    clients: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-3.5-4.8',
    items: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10', expenses: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l13-4v4M17 13.5h2',
    reports: 'M4 20V10M10 20V4M16 20v-7M3 20h18', books: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
    audit: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4', ai: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
    caps: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', design: 'M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0 0 21 9.8C21 6 17 3 12 3zM7.5 12.5h.01M9.5 8h.01M14.5 7.5h.01',
    more: 'M5 12h.01M12 12h.01M19 12h.01', back: 'M15 18l-6-6 6-6', plus: 'M12 5v14M5 12h14', share: 'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13',
    download: 'M12 3v12M7 10l5 5 5-5M5 21h14', edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4', trash: 'M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3', check: 'M5 12l5 5L20 7',
  };
  const icon = (n) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + P[n] + '"/></svg>';

  /* ---------- settings ---------- */
  const DEFAULTS = { lang: 'ar', theme: 'system', currency: 'SAR', taxRate: 15, taxMode: 'exclusive', termsDays: 14, template: 'classic', color: '#1d1814', zatca: true, bilingual: true,
    notes: '', terms: '', payInstr: '', payLink: '', biz: { name: '', email: '', phone: '', address: '', vat: '', cr: '', bank: '', website: '', country: 'SA', logo: '', signature: '' } };
  const cfg = () => { const s = Store.state.settings || {}; return Object.assign({}, DEFAULTS, s, { biz: Object.assign({}, DEFAULTS.biz, s.biz || {}) }); };
  const saveCfg = (patch) => Store.write('settings', Object.assign({}, Store.state.settings || {}, patch));
  const COLORS = ['#1d1814', '#d9530e', '#1f5f8b', '#2c7a4b', '#7a2e5c', '#8a6a1f', '#3b3f8f'];
  function applyLook() {
    const c = cfg(); I.setLang(c.lang);
    const html = document.documentElement; html.lang = c.lang; html.dir = c.lang === 'ar' ? 'rtl' : 'ltr';
    if (c.theme === 'system') html.removeAttribute('data-theme'); else html.setAttribute('data-theme', c.theme);
  }

  /* ---------- helpers ---------- */
  const money = (m, cur) => K.formatMoney(m, cur || cfg().currency, I.lang());
  const fdate = (d) => { if (!d) return '—'; try { return new Intl.DateTimeFormat(I.lang() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d + 'T12:00:00')); } catch { return d; } };
  const typeName = (ty) => t(ty === 'credit' ? 'credit' : ty);
  const stName = (s) => t('st_' + s);
  const docsOf = (type) => Store.state.docs.filter((d) => !type || d.type === type);
  const findDoc = (id) => Store.state.docs.find((d) => d.id === id);
  const img = (id) => (id && Store.state.images[id]) || '';
  function toast(msg) { const el = $('#toast'); el.innerHTML = '<span>' + esc(msg) + '</span>'; clearTimeout(toast.t); toast.t = setTimeout(() => (el.innerHTML = ''), 2600); }
  async function copy(text) { try { await navigator.clipboard.writeText(text); toast(t('copied')); return true; } catch { return false; } }
  const waLink = (text, phone) => 'https://wa.me/' + String(phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text);

  /* ---------- sheet (in-page dialog; the viewer has no alert/confirm) ---------- */
  let sheetClose = null;
  function openSheet(html, onClose) {
    const s = $('#sheet'); s.innerHTML = '<div class="sheet-card" role="dialog" aria-modal="true">' + html + '</div>'; s.hidden = false; sheetClose = onClose || null;
    const f = s.querySelector('input,select,textarea,button'); if (f) f.focus();
  }
  function closeSheet() { const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; if (sheetClose) { const f = sheetClose; sheetClose = null; f(); } }
  function confirmSheet(msg, okLabel) {
    return new Promise((res) => {
      openSheet('<h3 class="h">' + esc(msg) + '</h3><div class="row"><button class="btn danger" data-sheet-ok type="button">' + esc(okLabel || t('confirm')) + '</button><button class="btn" data-sheet-cancel type="button">' + esc(t('cancel')) + '</button></div>', () => res(false));
      $('#sheet [data-sheet-ok]').onclick = () => { sheetClose = null; closeSheet(); res(true); };
      $('#sheet [data-sheet-cancel]').onclick = () => closeSheet();
    });
  }

  /* ---------- files out ---------- */
  let downloads = null;
  async function saveFile(filename, data) {
    try {
      if (downloads) { await downloads.save({ filename, data }); toast(t('download_offered')); return; }
    } catch (e) { if (e && e.code === 'declined') { toast(t('download_declined')); return; } }
    const blob = data instanceof Blob ? data : new Blob([data]); const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  const libs = {};
  function loadLib(name, src, global) {
    if (window[global]) return Promise.resolve(window[global]);
    return libs[name] || (libs[name] = new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = () => ok(window[global]); s.onerror = () => { libs[name] = null; no(new Error('load ' + name)); }; document.head.appendChild(s); }));
  }
  const loadXLSX = () => loadLib('xlsx', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
  const loadPDF = () => loadLib('pdf', 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf');
  async function exportXLSX(filename, sheets) {
    toast(t('preparing')); const X = await loadXLSX(); const wb = X.utils.book_new();
    for (const [name, rows] of sheets) { const ws = X.utils.aoa_to_sheet(rows); if (I.lang() === 'ar') ws['!views'] = [{ RTL: true }]; X.utils.book_append_sheet(wb, ws, name.slice(0, 31)); }
    const out = X.write(wb, { type: 'array', bookType: 'xlsx' });
    await saveFile(filename, new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  }
  async function exportPDF(el, filename) {
    toast(t('preparing')); const h = await loadPDF();
    const blob = await h().set({ margin: 0, image: { type: 'jpeg', quality: 0.96 }, html2canvas: { scale: 2, backgroundColor: '#fffdf9', useCORS: true }, jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy'] } }).from(el).outputPdf('blob');
    await saveFile(filename, blob);
  }

  /* ---------- images in: compressed so each fits one private record ---------- */
  function readImage(file, max) {
    return new Promise((ok, no) => {
      const r = new FileReader(); r.onerror = () => no(r.error);
      r.onload = () => { const im = new Image(); im.onerror = () => no(new Error('image')); im.onload = () => {
        const k = Math.min(1, (max || 1000) / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        let q = 0.82, url = c.toDataURL('image/jpeg', q); while (url.length > 180000 && q > 0.35) { q -= 0.12; url = c.toDataURL('image/jpeg', q); }
        ok(url); }; im.src = r.result; };
      r.readAsDataURL(file);
    });
  }
  function pickFile(accept) { return new Promise((ok) => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => ok(i.files && i.files[0]); i.click(); }); }

  /* ---------- navigation ---------- */
  const NAV = [
    ['home', 'nav_home'], ['docs', 'nav_docs'], ['clients', 'nav_clients'], ['items', 'nav_items'], ['expenses', 'nav_expenses'],
    ['reports', 'nav_reports'], ['books', 'nav_books'], ['audit', 'nav_audit'], ['ai', 'nav_ai'], ['settings', 'nav_settings'], ['caps', 'nav_caps'], ['design', 'nav_design'],
  ];
  const TABS = ['home', 'docs', 'clients', 'reports', 'more'];
  const route = () => { const h = (location.hash || '#home').slice(1).split('.'); return { name: h[0] || 'home', arg: h[1] || '', arg2: h[2] || '' }; };
  const go = (h) => { if (location.hash === '#' + h) render(); else location.hash = h; };
  function chrome(r) {
    const top = NAV.find((n) => n[0] === r.name), group = { home: 'home', docs: 'docs', doc: 'docs', edit: 'docs', new: 'docs', clients: 'clients', client: 'clients', reports: 'reports' }[r.name] || 'more';
    $('#rail-nav').innerHTML = NAV.map(([k, label], i) => (i === 5 ? '<p class="rail-group">' + esc(t('nav_reports')) + '</p>' : i === 9 ? '<p class="rail-group">KOSIF</p>' : '') +
      '<a class="rail-link" href="#' + k + '"' + ((r.name === k || (k === 'docs' && ['doc', 'edit', 'new'].includes(r.name)) || (k === 'clients' && r.name === 'client')) ? ' aria-current="page"' : '') + '>' + icon(k) + '<span>' + esc(t(label)) + '</span></a>').join('');
    $('#rail-foot').textContent = Store.mode === 'cloud' ? t('storage_cloud') : t('storage_local');
    $('#tabbar').innerHTML = TABS.map((k) => k === 'more'
      ? '<button class="tab" type="button" data-act="more"' + (group === 'more' ? ' aria-current="page"' : '') + '>' + icon('more') + '<span>' + esc(t('nav_more')) + '</span></button>'
      : '<a class="tab" href="#' + k + '"' + (group === k ? ' aria-current="page"' : '') + '>' + icon(k) + '<span>' + esc(t('nav_' + k)) + '</span></a>').join('');
    const back = $('#back'); const sub = ['doc', 'edit', 'new', 'client'].includes(r.name);
    back.hidden = !sub; back.innerHTML = icon('back'); back.setAttribute('aria-label', t('back'));
    back.onclick = () => (history.length > 1 ? history.back() : go(r.name === 'client' ? 'clients' : 'docs'));
    $('#top-actions').innerHTML = '';
    if (top) $('#top-title').textContent = t(top[1]);
  }
  const setTitle = (s) => { $('#top-title').textContent = s; };
  const setActions = (html) => { $('#top-actions').innerHTML = html; };

  /* ---------- render ---------- */
  let draft = null, docFilter = { type: 'invoice', status: 'all', q: '' }, reportState = null, chatLog = [];
  function render() {
    applyLook(); const r = route(); chrome(r); const v = $('#view');
    const screens = { home: Home, docs: Docs, doc: DocView, edit: Editor, new: Editor, clients: Clients, client: ClientView, items: Items, expenses: Expenses, reports: Reports, books: Books, audit: Audit, ai: Assistant, settings: Settings, caps: Caps, design: Design };
    try { v.innerHTML = (screens[r.name] || Home)(r); } catch (e) { console.error(e); v.innerHTML = '<p class="empty">' + esc(e.message) + '</p>'; }
    after.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
  }
  const after = [];

  /* ---------- home ---------- */
  function Home() {
    const c = cfg(), d = K.dashboard(Store.state, today(), c.currency), demo = Store.state.docs.some((x) => x.demo);
    const due = Store.state.docs.filter((x) => x.type === 'invoice' && !x.void && K.totals(x).balance > 0 && x.dueDate && K.daysBetween(today(), x.dueDate) <= 3)
      .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)).slice(0, 6);
    const recent = [...Store.state.docs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
    after.push(() => drawChart($('#home-chart'), d.months, c.currency));
    return '<div class="stack">' +
      (demo ? '<div class="banner"><p>' + esc(t('demo_banner')) + '</p><button class="btn sm" data-act="clear-demo" type="button">' + esc(t('start_own')) + '</button></div>' : '') +
      '<div><p class="eyebrow">' + esc(c.biz.name || 'KOSIF') + ' · ' + esc(fdate(today())) + '</p><h2 class="h">' + esc(t('tagline')) + '</h2></div>' +
      '<div class="kpis">' + kpi('kpi_sales', money(d.sales)) + kpi('kpi_collected', money(d.collected)) + kpi('kpi_outstanding', money(d.outstanding)) + kpi('kpi_overdue', money(d.overdue), d.overdue > 0) + kpi('kpi_estimates', String(d.openEstimates)) + '</div>' +
      '<div class="row">' + ['invoice', 'estimate', 'receipt'].map((ty) => '<a class="btn' + (ty === 'invoice' ? ' primary' : '') + '" href="#new.' + ty + '">' + esc(t('new_' + ty)) + '</a>').join('') + '<button class="btn" type="button" data-act="new-expense">' + esc(t('new_expense')) + '</button></div>' +
      '<div class="grid"><section class="card"><h3 class="h">' + esc(t('chart_title')) + '</h3><div class="legend"><span><i style="background:var(--accent)"></i>' + esc(t('sales')) + '</span><span><i style="background:var(--ink-3)"></i>' + esc(t('expenses')) + '</span></div><svg id="home-chart" class="chart" role="img" aria-label="' + esc(t('chart_title')) + '"></svg></section>' +
      '<section class="card"><h3 class="h">' + esc(t('due_soon')) + '</h3>' + (due.length ? '<div class="list">' + due.map((x) => {
        const late = K.daysBetween(x.dueDate, today()), tt = K.totals(x);
        return '<div class="li"><a class="t" href="#doc.' + x.id + '">' + esc(x.number + ' · ' + ((x.client && x.client.name) || '—')) + '</a><span class="s">' + esc(late > 0 ? late + ' ' + t('days_late') : fdate(x.dueDate)) + '</span><span class="a"><b class="money">' + esc(money(tt.balance, tt.currency)) + '</b><button class="btn sm" type="button" data-act="remind" data-id="' + x.id + '">' + esc(t('remind')) + '</button></span></div>';
      }).join('') + '</div>' : '<p class="muted">' + esc(t('nothing_due')) + '</p>') + '</section></div>' +
      '<section><h3 class="h">' + esc(t('documents')) + '</h3>' + docList(recent) + '</section></div>';
  }
  /* KPI figures: the amount large, the currency as a quiet suffix so it never wraps under the number */
  const kpi = (label, value, alert) => {
    const m = /^(.*?[\d.,]+)\s+(\S+)$/.exec(value) || /^(\D)([\d.,]+)$/.exec(value);
    const body = m ? (/^\D$/.test(m[1]) ? '<small class="cur">' + esc(m[1]) + '</small>' + esc(m[2]) : esc(m[1]) + ' <small class="cur">' + esc(m[2]) + '</small>') : esc(value);
    return '<div class="kpi' + (alert ? ' alert' : '') + '"><div class="label">' + esc(t(label)) + '</div><div class="value">' + body + '</div></div>';
  };
  function drawChart(svg, months, cur) {
    if (!svg) return; const W = 600, H = 220, padL = 46, padB = 26, padT = 10, max = Math.max(1, ...months.map((m) => Math.max(m.sales, m.expenses)));
    const nice = niceMax(K.fromMinor(max, cur)), step = (W - padL - 10) / months.length, y = (v) => padT + (H - padB - padT) * (1 - K.fromMinor(v, cur) / nice);
    let s = '';
    for (let i = 0; i <= 4; i++) { const val = (nice * i) / 4, yy = padT + (H - padB - padT) * (1 - i / 4); s += '<line x1="' + padL + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" stroke="var(--rule-soft)" stroke-width="1"/><text x="' + (padL - 6) + '" y="' + (yy + 4) + '" text-anchor="end">' + compact(val) + '</text>'; }
    months.forEach((m, i) => {
      const x = padL + i * step + step * 0.15, bw = step * 0.33;
      s += '<rect x="' + x + '" y="' + y(m.sales) + '" width="' + bw + '" height="' + Math.max(0, H - padB - y(m.sales)) + '" rx="2" fill="var(--accent)"><title>' + m.month + ' ' + esc(money(m.sales, cur)) + '</title></rect>';
      s += '<rect x="' + (x + bw + 2) + '" y="' + y(m.expenses) + '" width="' + bw + '" height="' + Math.max(0, H - padB - y(m.expenses)) + '" rx="2" fill="var(--ink-3)"><title>' + m.month + ' ' + esc(money(m.expenses, cur)) + '</title></rect>';
      if (i % 2 === 0) s += '<text x="' + (x + bw) + '" y="' + (H - 8) + '" text-anchor="middle">' + m.month.slice(2).replace('-', '/') + '</text>';
    });
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.innerHTML = s;
  }
  function niceMax(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
  const compact = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'k' : String(Math.round(v)));

  /* ---------- documents ---------- */
  function docList(list) {
    if (!list.length) return '<p class="empty">' + esc(t('empty_docs')) + '</p>';
    return '<div class="list">' + list.map((x) => {
      const tt = K.totals(x), st = K.status(x, today());
      return '<a class="li" href="#doc.' + x.id + '"><span class="t">' + esc(((x.client && x.client.name) || '—')) + '</span><span class="s">' + esc(x.number + ' · ' + typeName(x.type) + ' · ' + fdate(x.date)) + '</span><span class="a"><b class="money">' + esc(money(tt.total, tt.currency)) + '</b><span class="pill ' + st + '">' + esc(stName(st)) + '</span></span></a>';
    }).join('') + '</div>';
  }
  function Docs() {
    const f = docFilter, q = f.q.trim().toLowerCase(), now = today();
    let list = docsOf(f.type).filter((x) => {
      const st = K.status(x, now);
      if (f.status === 'unpaid' && !['sent', 'partial', 'overdue', 'draft'].includes(st)) return false;
      if (!['all', 'unpaid'].includes(f.status) && st !== f.status) return false;
      return !q || (x.number || '').toLowerCase().includes(q) || ((x.client && x.client.name) || '').toLowerCase().includes(q);
    }).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (a.number < b.number ? 1 : -1)));
    const statuses = f.type === 'estimate' ? ['all', 'sent', 'accepted', 'declined', 'converted'] : f.type === 'invoice' ? ['all', 'unpaid', 'overdue', 'partial', 'paid', 'draft'] : ['all'];
    return '<div class="stack"><div class="seg" role="group">' + ['invoice', 'estimate', 'receipt', 'credit'].map((ty) => '<button type="button" data-act="ftype" data-v="' + ty + '" aria-pressed="' + (f.type === ty) + '">' + esc(t(ty === 'credit' ? 'credits' : ty + 's')) + '</button>').join('') + '</div>' +
      '<div class="row"><input id="doc-q" class="input" type="search" placeholder="' + esc(t('search_docs')) + '" value="' + esc(f.q) + '" style="flex:1 1 220px" aria-label="' + esc(t('search')) + '"></div>' +
      '<div class="chips">' + statuses.map((s) => '<button class="chip" type="button" data-act="fstatus" data-v="' + s + '" aria-pressed="' + (f.status === s) + '">' + esc(s === 'all' ? t('f_all') : s === 'unpaid' ? t('f_unpaid') : stName(s)) + '</button>').join('') + '</div>' +
      docList(list) + '<a class="fab" href="#new.' + f.type + '">' + esc(t('new_' + f.type)) + '</a></div>';
  }

  function newDoc(type) {
    const c = cfg(), d = today();
    return { id: K.uid(), type, number: K.nextNumber(Store.state.docs, type), date: d, dueDate: type === 'receipt' || type === 'credit' ? '' : K.addDays(d, c.termsDays), currency: c.currency, taxMode: type === 'receipt' ? 'inclusive' : c.taxMode, taxRateBp: K.bp(c.taxRate),
      client: null, lines: [{ name: '', qty: 1, price: '', taxable: true }], discount: null, shipping: '', deposit: null, cardFeePct: '', notes: c.notes, terms: c.terms, payInstr: c.payInstr, payLink: c.payLink,
      photos: [], sign: !!c.biz.signature, template: c.template, color: c.color, payments: [], method: 'cash', recurring: null, sent: false };
  }
  function Editor(r) {
    if (!draft || draft.__for !== location.hash) {
      if (r.name === 'new') { draft = newDoc(r.arg || 'invoice'); const cl = r.arg2 && Store.state.clients.find((c) => c.id === r.arg2); if (cl) draft.client = snapClient(cl); }
      else { const x = findDoc(r.arg); if (!x) return '<p class="empty">—</p>'; draft = clone(x); }
      draft.__for = location.hash;
    }
    const x = draft;
    setTitle((r.name === 'new' ? t('new_' + x.type) : t('edit') + ' ' + x.number));
    setActions('<button class="btn primary sm" type="button" data-act="save-doc">' + esc(t('save')) + '</button>');
    after.push(updateTotals);
    const clients = Store.state.clients;
    const sel = (id, opts, val) => '<select class="input" id="' + id + '">' + opts.map(([v, l]) => '<option value="' + esc(v) + '"' + (String(val) === String(v) ? ' selected' : '') + '>' + esc(l) + '</option>').join('') + '</select>';
    return '<form class="stack" id="doc-form" novalidate>' +
      '<section class="card"><div class="form-grid">' +
      field(t('number'), '<input class="input" id="d-number" value="' + esc(x.number) + '" required>') +
      field(t('date'), '<input class="input" type="date" id="d-date" value="' + esc(x.date) + '">') +
      (x.type === 'invoice' || x.type === 'estimate' ? field(t('due_date'), '<input class="input" type="date" id="d-due" value="' + esc(x.dueDate || '') + '">') : '') +
      field(t('currency'), sel('d-currency', Object.keys(K.CURRENCIES).map((k) => [k, k + ' — ' + K.CURRENCIES[k][I.lang()]]), x.currency)) +
      (x.type === 'receipt' ? field(t('method'), sel('d-method', ['cash', 'bank', 'card', 'cheque', 'other'].map((m) => [m, t('m_' + m)]), x.method)) : '') +
      '</div></section>' +
      '<section class="card"><h3 class="h">' + esc(t('bill_to')) + '</h3><div class="row">' +
      '<select class="input" id="d-client" style="flex:1 1 240px"><option value="">' + esc(t('choose_client')) + '</option>' + clients.map((c) => '<option value="' + c.id + '"' + (x.client && x.client.id === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select>' +
      '<button class="btn" type="button" data-act="new-client-inline">' + esc(t('new_client')) + '</button></div>' +
      (x.client ? '<p class="small muted" style="margin-top:8px">' + esc([x.client.email, x.client.phone, x.client.address, x.client.vat].filter(Boolean).join(' · ')) + '</p>' : '') + '</section>' +
      '<section class="card"><h3 class="h">' + esc(t('item')) + '</h3><datalist id="items-dl">' + Store.state.items.map((i) => '<option value="' + esc(i.name) + '">').join('') + '</datalist><div class="lines" id="lines">' + x.lines.map(lineRow).join('') + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="add-line">' + esc(t('add_line')) + '</button></div>' +
      '<div class="totals" id="totals" style="margin-top:16px"></div></section>' +
      '<section class="card"><details class="more"' + (x.discount || x.shipping || x.deposit || x.cardFeePct || x.recurring ? ' open' : '') + '><summary>' + esc(t('discount') + ' · ' + t('vat') + ' · ' + t('shipping') + ' · ' + t('deposit')) + '</summary><div class="form-grid" style="margin-top:12px">' +
      field(t('discount'), '<div class="row"><select class="input" id="d-disc-type" style="width:auto">' + [['pct', t('pct')], ['amount', t('fixed')]].map(([v, l]) => '<option value="' + v + '"' + ((x.discount && x.discount.type) === v ? ' selected' : '') + '>' + esc(l) + '</option>').join('') + '</select><input class="input" id="d-disc" inputmode="decimal" style="flex:1" value="' + esc((x.discount && x.discount.value) || '') + '"></div>') +
      field(t('tax_mode'), sel('d-taxmode', [['exclusive', t('exclusive')], ['inclusive', t('inclusive')]], x.taxMode)) +
      field(t('tax_rate'), '<input class="input" id="d-taxrate" inputmode="decimal" value="' + esc(x.taxRateBp != null ? x.taxRateBp / 100 : cfg().taxRate) + '">') +
      field(t('shipping'), '<input class="input" id="d-ship" inputmode="decimal" value="' + esc(x.shipping || '') + '">') +
      (x.type === 'invoice' ? field(t('deposit') + ' %', '<input class="input" id="d-deposit" inputmode="decimal" value="' + esc((x.deposit && x.deposit.value) || '') + '">') : '') +
      field(t('card_fee'), '<input class="input" id="d-fee" inputmode="decimal" value="' + esc(x.cardFeePct || '') + '">') +
      (x.type === 'invoice' ? field(t('recurring'), sel('d-recur', ['none', 'weekly', 'monthly', 'quarterly', 'yearly'].map((f) => [f, t('freq_' + f)]), (x.recurring && x.recurring.freq) || 'none')) : '') +
      '</div></details></section>' +
      '<section class="card"><div class="form-grid">' + field(t('notes'), '<textarea class="input" id="d-notes">' + esc(x.notes || '') + '</textarea>') + field(t('terms'), '<textarea class="input" id="d-terms">' + esc(x.terms || '') + '</textarea>') +
      field(t('payment_instructions'), '<textarea class="input" id="d-payinstr">' + esc(x.payInstr || '') + '</textarea>') + field(t('payment_link'), '<input class="input" id="d-paylink" type="url" dir="ltr" value="' + esc(x.payLink || '') + '" placeholder="https://">') + '</div></section>' +
      '<section class="card stack"><div><h3 class="h">' + esc(t('photos')) + '</h3><div class="thumbs" id="d-photos">' + (x.photos || []).map((p) => '<figure><img src="' + esc(img(p)) + '" alt=""><button type="button" data-act="rm-photo" data-id="' + p + '" aria-label="' + esc(t('remove')) + '">×</button></figure>').join('') + '</div><button class="btn sm" type="button" data-act="add-photo" style="margin-top:8px">' + esc(t('add_photo')) + '</button></div>' +
      '<label class="check"><input type="checkbox" id="d-sign"' + (x.sign ? ' checked' : '') + (cfg().biz.signature ? '' : ' disabled') + '> ' + esc(t('signature')) + (cfg().biz.signature ? '' : ' — ' + esc(t('nav_settings'))) + '</label>' +
      '<div class="row"><div class="field"><span>' + esc(t('template')) + '</span><div class="seg">' + ['classic', 'modern', 'ledger', 'stamp'].map((tp) => '<button type="button" data-act="tpl" data-v="' + tp + '" aria-pressed="' + (x.template === tp) + '">' + esc(t('tpl_' + tp)) + '</button>').join('') + '</div></div>' +
      '<div class="field"><span>' + esc(t('color')) + '</span><div class="swatches">' + COLORS.map((c) => '<button type="button" class="swatch" data-act="color" data-v="' + c + '" style="background:' + c + '" aria-label="' + c + '" aria-pressed="' + (x.color === c) + '"></button>').join('') + '</div></div></div></section>' +
      '<div class="row"><button class="btn primary" type="button" data-act="save-doc">' + esc(t('save')) + '</button><button class="btn ghost" type="button" data-act="cancel-edit">' + esc(t('cancel')) + '</button></div></form>';
  }
  const field = (label, control) => '<label class="field"><span>' + esc(label) + '</span>' + control + '</label>';
  function lineRow(l, i) {
    return '<div class="line" data-i="' + i + '">' +
      '<label class="field name"><span>' + esc(t('item')) + '</span><input class="input" list="items-dl" data-l="name" value="' + esc(l.name || '') + '"></label>' +
      '<label class="field"><span>' + esc(t('qty')) + '</span><input class="input" inputmode="decimal" data-l="qty" value="' + esc(l.qty) + '"></label>' +
      '<label class="field"><span>' + esc(t('price')) + '</span><input class="input" inputmode="decimal" data-l="price" value="' + esc(l.price) + '"></label>' +
      '<button class="icon-btn" type="button" data-act="rm-line" data-i="' + i + '" aria-label="' + esc(t('remove')) + '">' + icon('trash') + '</button>' +
      '<div class="extra"><input class="input" data-l="desc" placeholder="' + esc(t('description')) + '" value="' + esc(l.desc || '') + '" style="flex:2 1 180px"><input class="input" data-l="unit" placeholder="' + esc(t('unit')) + '" value="' + esc(l.unit || '') + '" style="flex:1 1 80px">' +
      '<input class="input" inputmode="decimal" data-l="discount" placeholder="' + esc(t('line_discount')) + ' %" value="' + esc((l.discount && l.discount.value) || '') + '" style="flex:1 1 90px">' +
      '<label class="check"><input type="checkbox" data-l="taxable"' + (l.taxable !== false ? ' checked' : '') + '> ' + esc(t('taxable')) + '</label><span class="lt" data-lt></span></div></div>';
  }
  function readForm() {
    const x = draft, v = (id) => { const e = $('#' + id); return e ? e.value : undefined; };
    if (!$('#doc-form')) return;
    x.number = v('d-number').trim(); x.date = v('d-date') || today(); if ($('#d-due')) x.dueDate = v('d-due'); x.currency = v('d-currency');
    if ($('#d-method')) x.method = v('d-method');
    const dv = (v('d-disc') || '').trim(); x.discount = dv ? { type: v('d-disc-type'), value: dv } : null;
    x.taxMode = v('d-taxmode'); x.taxRateBp = K.bp(K.fromMinor(K.toMinor(v('d-taxrate'), 'SAR'), 'SAR')); x.shipping = v('d-ship');
    if ($('#d-deposit')) { const dp = (v('d-deposit') || '').trim(); x.deposit = dp ? { type: 'pct', value: dp } : null; }
    x.cardFeePct = v('d-fee');
    if ($('#d-recur')) { const f = v('d-recur'); x.recurring = f === 'none' ? null : { freq: f, next: (x.recurring && x.recurring.freq === f && x.recurring.next) || K.nextOccurrence(x.date, f) }; }
    x.notes = v('d-notes'); x.terms = v('d-terms'); x.payInstr = v('d-payinstr'); x.payLink = v('d-paylink'); x.sign = !!($('#d-sign') && $('#d-sign').checked);
    $$('#lines .line').forEach((row) => {
      const l = x.lines[+row.dataset.i]; if (!l) return; const g = (k) => row.querySelector('[data-l="' + k + '"]');
      l.name = g('name').value; l.qty = g('qty').value; l.price = g('price').value; l.desc = g('desc').value; l.unit = g('unit').value; l.taxable = g('taxable').checked;
      const ld = g('discount').value.trim(); l.discount = ld ? { type: 'pct', value: ld } : null;
    });
  }
  function updateTotals() {
    if (!draft || !$('#totals')) return; readForm(); const tt = K.totals(draft), cur = tt.currency;
    $$('#lines .line').forEach((row, i) => { const el = row.querySelector('[data-lt]'); if (el && tt.lines[i]) el.textContent = money(tt.lines[i].net, cur); });
    const r = (k, v, cls) => '<div class="r' + (cls ? ' ' + cls : '') + '"><span>' + esc(k) + '</span><b class="money">' + esc(money(v, cur)) + '</b></div>';
    $('#totals').innerHTML = r(t('subtotal'), tt.subtotal) + (tt.discount ? r(t('discount'), -tt.discount) : '') +
      tt.taxLines.map((x) => r(t('vat') + ' ' + x.rateBp / 100 + '%' + (draft.taxMode === 'inclusive' ? ' (' + t('inclusive') + ')' : ''), x.tax)).join('') +
      (tt.shipping ? r(t('shipping'), tt.shipping) : '') + (tt.fee ? r(t('card_fee_line'), tt.fee) : '') + r(t('total'), tt.total, 'big') + (tt.deposit ? r(t('deposit'), tt.deposit) : '');
  }
  const snapClient = (c) => ({ id: c.id, name: c.name, email: c.email || '', phone: c.phone || '', address: c.address || '', vat: c.vat || '' });
  async function saveDoc() {
    readForm(); const x = draft;
    const err = !x.number ? t('number') : x.lines.every((l) => !String(l.name).trim()) ? t('item') : '';
    if (err) { toast(t('required') + ': ' + err); return; }
    if (Store.state.docs.some((d) => d.id !== x.id && d.type === x.type && d.number === x.number)) { toast(t('a_dup') + ': ' + x.number); return; }
    x.lines = x.lines.filter((l) => String(l.name).trim()); delete x.__for; const id = x.id; delete x.demo;
    await Store.write('docs', x); draft = null; toast(t('saved')); go('doc.' + id);
  }

  /* ---------- the paper document ---------- */
  function paperHTML(x) {
    const c = cfg(), b = c.biz, tt = K.totals(x), cur = tt.currency, st = K.status(x, today()), both = c.bilingual;
    const L = (k) => (both ? esc(I.both(k)[0]) + ' <span style="opacity:.6">/ ' + esc(I.both(k)[1]) + '</span>' : esc(t(k)));
    const isTax = x.type === 'invoice' && b.vat;
    const title = x.type === 'invoice' ? (isTax ? (x.client && x.client.vat ? 'tax_invoice' : 'simplified_tax_invoice') : 'invoice') : x.type;
    const stamp = st === 'paid' ? stName('paid') : st === 'overdue' ? stName('overdue') : st === 'void' ? stName('void') : '';
    const rows = x.lines.map((l, i) => '<tr><td>' + (i + 1) + '</td><td><b>' + esc(l.name) + '</b>' + (l.desc ? '<div style="color:#6b5f55">' + esc(l.desc) + '</div>' : '') + '</td><td class="n">' + esc(l.qty) + (l.unit ? ' ' + esc(l.unit) : '') + '</td><td class="n">' + esc(money(typeof l.priceMinor === 'number' ? l.priceMinor : K.toMinor(l.price, cur), cur)) + '</td>' +
      '<td class="n">' + (tt.lines[i].rate ? tt.lines[i].rate / 100 + '%' : '—') + '</td><td class="n">' + esc(money(tt.lines[i].net, cur)) + '</td></tr>').join('');
    const tot = (k, v, cls) => '<div' + (cls ? ' class="' + cls + '"' : '') + '><span>' + L(k) + '</span><span>' + esc(money(v, cur)) + '</span></div>';
    return '<div class="paper tpl-' + esc(x.template || 'classic') + '" id="paper" style="--pc:' + esc(x.color || '#1d1814') + '" dir="' + (I.lang() === 'ar' ? 'rtl' : 'ltr') + '">' +
      (stamp ? '<div class="pstamp ' + st + '">' + esc(stamp) + '</div>' : '') +
      '<div class="phead"><div>' + (img(b.logo) ? '<img class="plogo" src="' + esc(img(b.logo)) + '" alt="">' : '') + '<h1>' + L(title) + '</h1><div class="pmeta">' + esc(x.number) + '</div></div>' +
      '<div class="pmeta" style="text-align:end"><b style="color:#1d1814;font-size:14px">' + esc(b.name || 'KOSIF') + '</b><br>' + esc([b.address, b.phone, b.email, b.website].filter(Boolean).join(' · ')) + (b.vat ? '<br>' + L('vat_no') + ': ' + esc(b.vat) : '') + (b.cr ? '<br>' + L('cr_no') + ': ' + esc(b.cr) : '') + '</div></div>' +
      '<div class="pparties"><div><div class="plabel">' + L('bill_to') + '</div><b>' + esc((x.client && x.client.name) || '—') + '</b><div class="pmeta">' + esc([x.client && x.client.address, x.client && x.client.phone, x.client && x.client.email].filter(Boolean).join(' · ')) + (x.client && x.client.vat ? '<br>' + L('vat_no') + ': ' + esc(x.client.vat) : '') + '</div></div>' +
      '<div><div class="plabel">' + L('date') + '</div><b>' + esc(fdate(x.date)) + '</b>' + (x.dueDate ? '<div class="plabel" style="margin-top:8px">' + L('due_date') + '</div><b>' + esc(fdate(x.dueDate)) + '</b>' : '') + (x.fromEstimate ? '<div class="pmeta">' + esc(t('estimate') + ' ' + x.fromEstimate) + '</div>' : '') + '</div></div>' +
      '<table><thead><tr><th>#</th><th>' + L('item') + '</th><th class="n">' + L('qty') + '</th><th class="n">' + L('price') + '</th><th class="n">' + L('vat') + '</th><th class="n">' + L('amount') + '</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="ptotals">' + tot('subtotal', tt.subtotal) + (tt.discount ? tot('discount', -tt.discount) : '') + tt.taxLines.map((tl) => '<div><span>' + L('vat') + ' ' + tl.rateBp / 100 + '%</span><span>' + esc(money(tl.tax, cur)) + '</span></div>').join('') +
      (tt.shipping ? tot('shipping', tt.shipping) : '') + (tt.fee ? tot('card_fee_line', tt.fee) : '') + tot('total', tt.total, 'grand') + (tt.paid ? tot('paid', tt.paid) : '') + (tt.paid && tt.balance ? tot('balance_due', tt.balance) : '') + (tt.deposit && !tt.paid ? tot('deposit', tt.deposit) : '') + '</div>' +
      ((x.photos || []).length ? '<div class="pphotos">' + x.photos.map((p) => '<img src="' + esc(img(p)) + '" alt="">').join('') + '</div>' : '') +
      '<div class="pfoot"><div class="pnote">' + (x.notes ? '<div class="plabel">' + L('notes') + '</div>' + esc(x.notes) : '') + (x.terms ? '<div class="plabel" style="margin-top:10px">' + L('terms') + '</div>' + esc(x.terms) : '') +
      (x.payInstr || b.bank ? '<div class="plabel" style="margin-top:10px">' + L('payment_instructions') + '</div>' + esc([x.payInstr, b.bank].filter(Boolean).join('\n')) : '') + (x.payLink ? '<div style="margin-top:6px;direction:ltr">' + esc(x.payLink) + '</div>' : '') + '</div>' +
      (x.sign && img(b.signature) ? '<div class="psig"><div class="plabel">' + L('signature') + '</div><img src="' + esc(img(b.signature)) + '" alt=""></div>' : '') +
      '<div class="pqr" id="pqr"></div></div><p class="pmeta" style="margin-top:24px;text-align:center">' + esc(t('thanks')) + '</p></div>';
  }
  function qrFor(x) {
    const c = cfg(), b = c.biz, tt = K.totals(x);
    if (c.zatca && b.vat && (x.type === 'invoice' || x.type === 'receipt' || x.type === 'credit') && tt.currency === 'SAR') {
      try { return { text: K.zatcaTLV(b.name || 'KOSIF', b.vat, (x.date || today()) + 'T12:00:00Z', tt.total, tt.tax, 'SAR'), cap: t('qr_caption') }; } catch { return null; }
    }
    if (x.payLink && /^https?:\/\//.test(x.payLink)) return { text: x.payLink, cap: t('payment_link') };
    return null;
  }
  function drawQR(x) {
    const q = qrFor(x), el = $('#pqr'); if (!q || !el || !window.QRCode) return;
    el.innerHTML = ''; new window.QRCode(el, { text: q.text, width: 216, height: 216, correctLevel: window.QRCode.CorrectLevel.M });
    const cap = document.createElement('div'); cap.textContent = q.cap; el.appendChild(cap);
  }

  function DocView(r) {
    const x = findDoc(r.arg); if (!x) return '<p class="empty">—</p>';
    const tt = K.totals(x), st = K.status(x, today()), cur = tt.currency;
    setTitle(typeName(x.type) + ' ' + x.number);
    setActions('<a class="btn sm" href="#edit.' + x.id + '">' + esc(t('edit')) + '</a><button class="btn sm" type="button" data-act="share" data-id="' + x.id + '">' + esc(t('share')) + '</button><button class="btn sm primary" type="button" data-act="pdf" data-id="' + x.id + '">PDF</button>');
    after.push(() => drawQR(x));
    const acts = [];
    if (x.type === 'invoice' && !x.void) { if (!x.sent) acts.push(['mark-sent', 'mark_sent']); if (tt.balance > 0) acts.push(['pay', 'record_payment', 'primary']); acts.push(['credit-note', 'make_credit']); }
    if (x.type === 'estimate' && !x.void) { if (x.estimateStatus !== 'converted') acts.push(['convert', 'convert_invoice', 'primary']); if (!['accepted', 'converted'].includes(x.estimateStatus)) acts.push(['accept', 'accept']); if (!['declined', 'converted'].includes(x.estimateStatus)) acts.push(['decline', 'decline']); }
    acts.push(['dup', 'duplicate']); if (!x.void) acts.push(['void', 'void_doc']); acts.push(['del-doc', 'delete', 'danger']);
    return '<div class="stack"><div class="row spread"><div class="row"><span class="pill ' + st + '">' + esc(stName(st)) + '</span><b class="money" style="font-size:1.25rem">' + esc(money(tt.total, cur)) + '</b>' + (tt.paid ? '<span class="muted small">' + esc(t('balance_due') + ': ' + money(tt.balance, cur)) + '</span>' : '') + '</div></div>' +
      '<div class="row">' + acts.map(([a, l, cls]) => '<button class="btn sm' + (cls ? ' ' + cls : '') + '" type="button" data-act="' + a + '" data-id="' + x.id + '">' + esc(t(l)) + '</button>').join('') + '</div>' +
      ((x.payments || []).length ? '<section class="card flat"><h3 class="h">' + esc(t('payments')) + '</h3><div class="table-wrap"><table class="t"><thead><tr><th>' + esc(t('date')) + '</th><th>' + esc(t('method')) + '</th><th class="n">' + esc(t('amount')) + '</th><th></th></tr></thead><tbody>' +
        x.payments.map((p) => '<tr><td>' + esc(fdate(p.date)) + '</td><td>' + esc(t('m_' + (p.method || 'other'))) + (p.note ? ' · ' + esc(p.note) : '') + '</td><td class="n">' + esc(money(K.toMinor(p.amount, cur), cur)) + '</td><td class="n"><button class="btn sm ghost" type="button" data-act="rm-pay" data-id="' + x.id + '" data-p="' + p.id + '">' + esc(t('remove')) + '</button></td></tr>').join('') + '</tbody></table></div></section>' : '') +
      (x.recurring ? '<p class="small muted">' + esc(t('recurring') + ': ' + t('freq_' + x.recurring.freq) + ' · ' + fdate(x.recurring.next)) + '</p>' : '') +
      '<div class="paper-wrap">' + paperHTML(x) + '</div></div>';
  }
  function shareText(x) {
    const tt = K.totals(x), b = cfg().biz;
    return t('share_text', { type: typeName(x.type), number: x.number, biz: b.name || 'KOSIF', amount: money(tt.total, tt.currency), due: fdate(x.dueDate || x.date) }) + (x.payLink ? '\n' + x.payLink : '');
  }
  function shareSheet(x, text) {
    const phone = x.client && x.client.phone, email = x.client && x.client.email;
    openSheet('<h3 class="h">' + esc(t('share')) + '</h3><textarea class="input" id="share-text" rows="5">' + esc(text) + '</textarea>' +
      '<div class="row" style="margin-top:12px"><button class="btn primary" type="button" id="share-copy">' + esc(t('copy_text')) + '</button>' +
      '<a class="btn" target="_blank" rel="noopener" href="' + esc(waLink(text, phone)) + '">' + esc(t('whatsapp')) + '</a>' +
      '<button class="btn" type="button" id="share-pdf">' + esc(t('download_pdf')) + '</button><button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('close')) + '</button></div>' +
      (email ? '<p class="small muted" style="margin-top:10px">' + esc(t('email')) + ': <span style="user-select:all">' + esc(email) + '</span></p>' : ''));
    $('#share-copy').onclick = async () => { if (!(await copy($('#share-text').value))) { $('#share-text').select(); } };
    $('#share-pdf').onclick = () => { closeSheet(); pdfOf(x); };
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    if (!x.sent && x.type !== 'receipt') { x.sent = true; if (x.type === 'estimate' && !x.estimateStatus) x.estimateStatus = 'sent'; Store.write('docs', x); }
  }
  async function pdfOf(x) {
    let el = $('#paper');
    if (!el) { const host = document.createElement('div'); host.style.cssText = 'position:fixed;inset-inline-start:-10000px;top:0;width:794px'; host.innerHTML = paperHTML(x); document.body.appendChild(host); el = host.firstChild; drawQR(x); await new Promise((r) => setTimeout(r, 60)); try { await exportPDF(el, x.number + '.pdf'); } finally { host.remove(); } return; }
    await exportPDF(el, x.number + '.pdf');
  }
  function paySheet(x) {
    const tt = K.totals(x), cur = tt.currency;
    openSheet('<h3 class="h">' + esc(t('record_payment')) + ' · ' + esc(x.number) + '</h3><form class="stack" id="pay-form"><div class="form-grid">' +
      field(t('amount'), '<input class="input" id="p-amount" inputmode="decimal" value="' + esc(K.fromMinor(tt.balance, cur).toFixed(K.digits(cur))) + '">') + field(t('date'), '<input class="input" type="date" id="p-date" value="' + today() + '">') +
      field(t('method'), '<select class="input" id="p-method">' + ['bank', 'cash', 'card', 'cheque', 'other'].map((m) => '<option value="' + m + '">' + esc(t('m_' + m)) + '</option>').join('') + '</select>') + field(t('notes'), '<input class="input" id="p-note">') +
      '</div><div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button><button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div></form>');
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    $('#pay-form').onsubmit = async (e) => {
      e.preventDefault(); const a = K.toMinor($('#p-amount').value, cur); if (a <= 0) { $('#p-amount').setAttribute('aria-invalid', 'true'); return; }
      x.payments = (x.payments || []).concat({ id: K.uid(), amount: K.fromMinor(a, cur).toFixed(K.digits(cur)), date: $('#p-date').value || today(), method: $('#p-method').value, note: $('#p-note').value });
      x.sent = true; closeSheet(); await Store.write('docs', x); toast(t('saved')); render();
    };
  }

  /* ---------- clients ---------- */
  function Clients() {
    const q = (Clients.q || '').toLowerCase(), list = Store.state.clients.filter((c) => !q || (c.name + ' ' + (c.email || '') + ' ' + (c.phone || '')).toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
    const bal = (c) => Store.state.docs.filter((d) => d.type === 'invoice' && !d.void && d.client && d.client.id === c.id).reduce((s, d) => s + Math.max(0, K.totals(d).balance), 0);
    setActions('<button class="btn sm" type="button" data-act="import-clients">' + esc(t('import')) + '</button>');
    return '<div class="stack"><input class="input" type="search" id="client-q" placeholder="' + esc(t('search')) + '" value="' + esc(Clients.q || '') + '" aria-label="' + esc(t('search')) + '">' +
      (list.length ? '<div class="list">' + list.map((c) => { const b = bal(c); return '<a class="li" href="#client.' + c.id + '"><span class="t">' + esc(c.name) + '</span><span class="s">' + esc([c.phone, c.email].filter(Boolean).join(' · ') || '—') + '</span><span class="a">' + (b ? '<b class="money">' + esc(money(b)) + '</b>' : '<span class="muted small">—</span>') + '</span></a>'; }).join('') + '</div>' : '<p class="empty">' + esc(t('empty_clients')) + '</p>') +
      '<button class="fab" type="button" data-act="edit-client">' + esc(t('new_client')) + '</button></div>';
  }
  function ClientView(r) {
    const c = Store.state.clients.find((x) => x.id === r.arg); if (!c) return '<p class="empty">—</p>';
    setTitle(c.name);
    const docs = Store.state.docs.filter((d) => d.client && d.client.id === c.id), inv = docs.filter((d) => d.type === 'invoice' && !d.void);
    const billed = inv.reduce((s, d) => s + K.totals(d).total, 0), paid = inv.reduce((s, d) => s + K.totals(d).paid, 0);
    setActions('<button class="btn sm" type="button" data-act="edit-client" data-id="' + c.id + '">' + esc(t('edit')) + '</button><a class="btn sm primary" href="#new.invoice.' + c.id + '">' + esc(t('new_invoice')) + '</a>');
    return '<div class="stack"><p class="muted">' + esc([c.email, c.phone, c.address, c.vat ? t('vat_no') + ' ' + c.vat : ''].filter(Boolean).join(' · ')) + '</p>' +
      '<div class="kpis">' + kpi('billed', money(billed)) + kpi('paid', money(paid)) + kpi('balance', money(billed - paid), billed - paid > 0) + '</div>' + docList(docs.sort((a, b) => (a.date < b.date ? 1 : -1))) +
      '<div class="row"><button class="btn danger sm" type="button" data-act="del-client" data-id="' + c.id + '">' + esc(t('delete')) + '</button></div></div>';
  }
  function clientSheet(c, onSaved) {
    const x = c ? clone(c) : { id: K.uid(), name: '', email: '', phone: '', address: '', vat: '', notes: '' };
    openSheet('<h3 class="h">' + esc(c ? t('edit') : t('new_client')) + '</h3><form class="stack" id="client-form"><div class="form-grid">' +
      ['name', 'email', 'phone', 'address', 'vat'].map((k) => field(t(k === 'vat' ? 'vat_no' : k), '<input class="input" id="c-' + k + '" value="' + esc(x[k] || '') + '"' + (k === 'email' || k === 'phone' || k === 'vat' ? ' dir="ltr"' : '') + (k === 'name' ? ' required' : '') + '>')).join('') +
      '</div>' + field(t('notes'), '<textarea class="input" id="c-notes">' + esc(x.notes || '') + '</textarea>') +
      '<div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button><button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div></form>');
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    $('#client-form').onsubmit = async (e) => {
      e.preventDefault(); for (const k of ['name', 'email', 'phone', 'address', 'vat', 'notes']) x[k] = $('#c-' + k).value.trim();
      if (!x.name) { $('#c-name').setAttribute('aria-invalid', 'true'); $('#c-name').focus(); return; }
      delete x.demo; closeSheet(); await Store.write('clients', x); toast(t('saved')); onSaved ? onSaved(x) : render();
    };
  }

  /* ---------- items ---------- */
  function Items() {
    setActions('<button class="btn sm" type="button" data-act="import-items">' + esc(t('import')) + '</button>');
    const list = [...Store.state.items].sort((a, b) => a.name.localeCompare(b.name));
    return '<div class="stack">' + (list.length ? '<div class="list">' + list.map((i) => '<button class="li" type="button" data-act="edit-item" data-id="' + i.id + '"><span class="t">' + esc(i.name) + '</span><span class="s">' + esc([i.unit, i.desc].filter(Boolean).join(' · ') || '—') + '</span><span class="a">' + (img(i.photo) ? '<img class="thumb" src="' + esc(img(i.photo)) + '" alt="">' : '') + '<b class="money">' + esc(money(K.toMinor(i.price, cfg().currency))) + '</b></span></button>').join('') + '</div>' : '<p class="empty">' + esc(t('empty_items')) + '</p>') +
      '<button class="fab" type="button" data-act="edit-item">' + esc(t('new_item')) + '</button></div>';
  }
  function itemSheet(it) {
    const x = it ? clone(it) : { id: K.uid(), name: '', desc: '', unit: '', price: '', taxable: true, photo: '' };
    openSheet('<h3 class="h">' + esc(it ? t('edit') : t('new_item')) + '</h3><form class="stack" id="item-form"><div class="form-grid">' +
      field(t('name'), '<input class="input" id="i-name" required value="' + esc(x.name) + '">') + field(t('price'), '<input class="input" id="i-price" inputmode="decimal" value="' + esc(x.price) + '">') + field(t('unit'), '<input class="input" id="i-unit" value="' + esc(x.unit || '') + '">') + '</div>' +
      field(t('description'), '<textarea class="input" id="i-desc">' + esc(x.desc || '') + '</textarea>') + '<label class="check"><input type="checkbox" id="i-tax"' + (x.taxable !== false ? ' checked' : '') + '> ' + esc(t('taxable')) + '</label>' +
      '<div class="row"><img id="i-photo-prev" class="thumb" style="width:72px;height:72px;border-radius:8px;object-fit:cover' + (img(x.photo) ? '' : ';display:none') + '" src="' + esc(img(x.photo)) + '" alt=""><button class="btn sm" type="button" id="i-photo">' + esc(t('add_photo')) + '</button></div>' +
      '<div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button>' + (it ? '<button class="btn danger" type="button" id="i-del">' + esc(t('delete')) + '</button>' : '') + '<button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div></form>');
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    $('#i-photo').onclick = async () => { const f = await pickFile('image/*'); if (!f) return; const url = await readImage(f, 800); const id = 'im' + K.uid(); await Store.putImage(id, url); x.photo = id; const p = $('#i-photo-prev'); p.src = url; p.style.display = ''; };
    if (it) $('#i-del').onclick = async () => { closeSheet(); if (await confirmSheet(t('confirm_delete'), t('delete'))) { await Store.remove('items', x.id); toast(t('deleted')); render(); } };
    $('#item-form').onsubmit = async (e) => {
      e.preventDefault(); x.name = $('#i-name').value.trim(); if (!x.name) { $('#i-name').setAttribute('aria-invalid', 'true'); return; }
      x.price = $('#i-price').value; x.unit = $('#i-unit').value; x.desc = $('#i-desc').value; x.taxable = $('#i-tax').checked; delete x.demo;
      closeSheet(); await Store.write('items', x); toast(t('saved')); render();
    };
  }

  /* ---------- expenses ---------- */
  const CATS = Object.keys(K.EXPENSE_CATEGORIES);
  function Expenses() {
    const list = [...Store.state.expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
    return '<div class="stack">' + (list.length ? '<div class="list">' + list.map((e) => '<button class="li" type="button" data-act="edit-expense" data-id="' + e.id + '"><span class="t">' + esc(e.vendor || t('c_' + e.category)) + '</span><span class="s">' + esc(t('c_' + e.category) + ' · ' + fdate(e.date) + (e.unpaid ? ' · ' + t('unpaid_bill') : '')) + '</span><span class="a"><b class="money">' + esc(money(K.toMinor(e.amount, e.currency || 'SAR'), e.currency)) + '</b>' + (e.unpaid ? '<span class="pill overdue">' + esc(t('f_unpaid')) + '</span>' : '') + '</span></button>').join('') + '</div>' : '<p class="empty">' + esc(t('empty_expenses')) + '</p>') +
      '<button class="fab" type="button" data-act="new-expense">' + esc(t('new_expense')) + '</button></div>';
  }
  function expenseSheet(ex) {
    const c = cfg(), x = ex ? clone(ex) : { id: K.uid(), date: today(), vendor: '', category: 'other', amount: '', vat: '', method: 'bank', currency: c.currency, unpaid: false, note: '', photo: '' };
    openSheet('<h3 class="h">' + esc(ex ? t('edit') : t('new_expense')) + '</h3><form class="stack" id="exp-form"><div class="form-grid">' +
      field(t('date'), '<input class="input" type="date" id="e-date" value="' + esc(x.date) + '">') + field(t('vendor'), '<input class="input" id="e-vendor" value="' + esc(x.vendor) + '">') +
      field(t('category'), '<select class="input" id="e-cat">' + CATS.map((k) => '<option value="' + k + '"' + (x.category === k ? ' selected' : '') + '>' + esc(t('c_' + k)) + '</option>').join('') + '</select>') +
      field(t('amount') + ' (' + t('total') + ')', '<input class="input" id="e-amount" inputmode="decimal" value="' + esc(x.amount) + '">') +
      field(t('vat_included'), '<div class="row"><input class="input" id="e-vat" inputmode="decimal" style="flex:1" value="' + esc(x.vat) + '"><button class="btn sm" type="button" id="e-vat15">' + c.taxRate + '%</button></div>') +
      field(t('method'), '<select class="input" id="e-method">' + ['bank', 'cash', 'card', 'cheque', 'other'].map((m) => '<option value="' + m + '"' + (x.method === m ? ' selected' : '') + '>' + esc(t('m_' + m)) + '</option>').join('') + '</select>') +
      field(t('currency'), '<select class="input" id="e-cur">' + Object.keys(K.CURRENCIES).map((k) => '<option' + (x.currency === k ? ' selected' : '') + '>' + k + '</option>').join('') + '</select>') + '</div>' +
      '<label class="check"><input type="checkbox" id="e-unpaid"' + (x.unpaid ? ' checked' : '') + '> ' + esc(t('unpaid_bill')) + '</label>' + field(t('notes'), '<input class="input" id="e-note" value="' + esc(x.note || '') + '">') +
      '<div class="row"><img id="e-prev" class="thumb" style="width:72px;height:72px;border-radius:8px;object-fit:cover' + (img(x.photo) ? '' : ';display:none') + '" src="' + esc(img(x.photo)) + '" alt=""><button class="btn sm" type="button" id="e-photo">' + esc(t('receipt_photo')) + '</button></div>' +
      '<div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button>' + (ex ? '<button class="btn danger" type="button" id="e-del">' + esc(t('delete')) + '</button>' : '') + '<button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div></form>');
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    $('#e-vat15').onclick = () => { const cur = $('#e-cur').value, a = K.toMinor($('#e-amount').value, cur), r = K.bp(c.taxRate); $('#e-vat').value = K.fromMinor(K.rdiv(a * r, 10000 + r), cur).toFixed(K.digits(cur)); };
    $('#e-photo').onclick = async () => { const f = await pickFile('image/*'); if (!f) return; const url = await readImage(f, 1200); const id = 'im' + K.uid(); await Store.putImage(id, url); x.photo = id; const p = $('#e-prev'); p.src = url; p.style.display = ''; };
    if (ex) $('#e-del').onclick = async () => { closeSheet(); if (await confirmSheet(t('confirm_delete'), t('delete'))) { await Store.remove('expenses', x.id); toast(t('deleted')); render(); } };
    $('#exp-form').onsubmit = async (e) => {
      e.preventDefault(); Object.assign(x, { date: $('#e-date').value || today(), vendor: $('#e-vendor').value.trim(), category: $('#e-cat').value, amount: $('#e-amount').value, vat: $('#e-vat').value, method: $('#e-method').value, currency: $('#e-cur').value, unpaid: $('#e-unpaid').checked, note: $('#e-note').value });
      if (K.toMinor(x.amount, x.currency) <= 0) { $('#e-amount').setAttribute('aria-invalid', 'true'); return; }
      delete x.demo; closeSheet(); await Store.write('expenses', x); toast(t('saved')); render();
    };
  }

  /* ---------- reports ---------- */
  const REPORTS = ['r_sales_month', 'r_sales_client', 'r_sales_item', 'r_aging', 'r_expenses', 'r_pl', 'r_bs', 'r_tb', 'r_vat', 'r_journal'];
  function reportTable(id) {
    const s = reportState, st = Store.state, cur = s.currency, m = (v) => money(v, cur);
    const docsC = st.docs.filter((d) => (d.currency || 'SAR') === cur);
    const H = (cols) => cols.map((c) => esc(t(c))), A = (v) => K.fromMinor(v, cur);
    if (id === 'r_sales_month' || id === 'r_sales_client' || id === 'r_sales_item') {
      const key = { r_sales_month: 'month', r_sales_client: 'client', r_sales_item: 'item' }[id], rows = K.salesBy(docsC, key, s.from, s.to).sort((a, b) => (key === 'month' ? (a.key < b.key ? -1 : 1) : b.total - a.total));
      const tot = rows.reduce((a, r) => a + r.total, 0);
      return { head: H([key === 'month' ? 'month' : key === 'client' ? 'client' : 'item', key === 'item' ? 'qty' : 'count', 'total'].concat(key === 'item' ? [] : ['paid'])), num: [false, true, true, true],
        rows: rows.map((r) => [r.key, r.count, m(r.total)].concat(key === 'item' ? [] : [m(r.paid)])), foot: [t('total'), '', m(tot)].concat(key === 'item' ? [] : ['']),
        data: [[t(key === 'month' ? 'month' : key), t(key === 'item' ? 'qty' : 'count'), t('total')]].concat(rows.map((r) => [r.key, r.count, A(r.total)])) };
    }
    if (id === 'r_aging') {
      const a = K.receivablesAging(docsC, today()), b = a.buckets, keys = ['current', 'd30', 'd60', 'd90', 'older'];
      return { head: H(['number', 'client', 'due', 'b_d30', 'balance']).map((h, i) => (i === 3 ? esc(t('days_late')) : h)), num: [false, false, false, true, true],
        rows: a.rows.map((r) => [r.number, r.client, fdate(r.due), Math.max(0, r.late), m(r.balance)]), foot: [t('total'), '', '', '', m(keys.reduce((s, k) => s + b[k], 0))],
        pre: '<div class="kpis">' + keys.map((k) => kpi('b_' + k, m(b[k]), k !== 'current' && b[k] > 0)).join('') + '</div>',
        data: [[t('number'), t('client'), t('due'), t('days_late'), t('balance')]].concat(a.rows.map((r) => [r.number, r.client, r.due, r.late, A(r.balance)])) };
    }
    if (id === 'r_expenses') {
      const map = {}; for (const e of st.expenses) if ((e.currency || 'SAR') === cur && (!s.from || e.date >= s.from) && (!s.to || e.date <= s.to)) map[e.category] = (map[e.category] || 0) + K.toMinor(e.amount, cur);
      const rows = Object.entries(map).sort((a, b) => b[1] - a[1]), tot = rows.reduce((a, r) => a + r[1], 0);
      return { head: H(['category', 'total']), num: [false, true], rows: rows.map(([k, v]) => [t('c_' + k), m(v)]), foot: [t('total'), m(tot)], data: [[t('category'), t('total')]].concat(rows.map(([k, v]) => [t('c_' + k), A(v)])) };
    }
    const entries = K.journal(st), tb = K.trialBalance(entries, cur, id === 'r_bs' ? null : s.from, s.to), fs = K.statements(tb);
    const accName = (r) => r.code + ' ' + r[I.lang()];
    if (id === 'r_tb') return { head: H(['account', 'debit', 'credit_col']), num: [false, true, true], rows: tb.rows.map((r) => [accName(r), r.net > 0 ? m(r.net) : '', r.net < 0 ? m(-r.net) : '']),
      foot: [t(tb.balanced ? 'balanced' : 'not_balanced'), m(tb.rows.reduce((a, r) => a + Math.max(0, r.net), 0)), m(tb.rows.reduce((a, r) => a + Math.max(0, -r.net), 0))],
      data: [[t('account'), t('debit'), t('credit_col')]].concat(tb.rows.map((r) => [accName(r), r.net > 0 ? A(r.net) : 0, r.net < 0 ? A(-r.net) : 0])) };
    if (id === 'r_pl') {
      const rev = tb.rows.filter((r) => r.type === 'revenue'), exp = tb.rows.filter((r) => r.type === 'expense');
      const rows = [[t('revenue'), '', '']].concat(rev.map((r) => ['', accName(r), m(-r.net)]), [[t('revenue'), '', m(fs.revenue)], [t('expenses'), '', '']], exp.map((r) => ['', accName(r), m(r.net)]), [[t('expenses'), '', m(fs.expenses)]]);
      return { head: ['', esc(t('account')), esc(t('amount'))], num: [false, false, true], rows, foot: [t('net_profit'), '', m(fs.profit)], data: [[t('account'), t('amount')]].concat(rev.map((r) => [accName(r), A(-r.net)]), exp.map((r) => [accName(r), -A(r.net)]), [[t('net_profit'), A(fs.profit)]]) };
    }
    if (id === 'r_bs') {
      const sec = (type, sign) => tb.rows.filter((r) => r.type === type).map((r) => ['', accName(r), m(sign * r.net)]);
      const rows = [[t('assets'), '', '']].concat(sec('asset', 1), [[t('assets'), '', m(fs.assets)], [t('liabilities'), '', '']], sec('liability', -1), [[t('liabilities'), '', m(fs.liabilities)], [t('equity'), '', '']], sec('equity', -1), [['', t('net_profit'), m(fs.profit)], [t('equity') + ' (' + t('incl_profit') + ')', '', m(fs.equity)]]);
      return { head: ['', esc(t('account')), esc(t('amount'))], num: [false, false, true], rows, foot: [t(fs.check === 0 ? 'balanced' : 'not_balanced'), t('liabilities') + ' + ' + t('equity'), m(fs.liabilities + fs.equity)], data: [[t('account'), t('amount')]].concat(tb.rows.map((r) => [accName(r), A(r.net)])) };
    }
    if (id === 'r_vat') {
      const v = K.vatReturn(st, s.from || '0000-01-01', s.to || '9999-12-31', cur);
      const rows = [['vat_sales', v.salesBase], ['vat_output', v.outputVat], ['vat_zero', v.zeroRated], ['vat_purchases', v.purchasesBase], ['vat_input', v.inputVat]];
      return { head: H(['description', 'amount']), num: [false, true], rows: rows.map(([k, x]) => [t(k), m(x)]), foot: [t('vat_net'), m(v.net)], data: [[t('description'), t('amount')]].concat(rows.map(([k, x]) => [t(k), A(x)]), [[t('vat_net'), A(v.net)]]) };
    }
    if (id === 'r_journal') {
      const E = entries.filter((e) => e.currency === cur && (!s.from || e.date >= s.from) && (!s.to || e.date <= s.to)), rows = [], data = [[t('date'), t('ref'), t('account'), t('debit'), t('credit_col')]];
      const name = (code) => { const a = K.ACCOUNTS.find((x) => x.code === code); return a ? code + ' ' + a[I.lang()] : code; };
      for (const e of E) for (const l of e.lines) { rows.push([fdate(e.date), e.ref, name(l.acc), l.dr ? m(l.dr) : '', l.cr ? m(l.cr) : '']); data.push([e.date, e.ref, name(l.acc), A(l.dr || 0), A(l.cr || 0)]); }
      return { head: H(['date', 'ref', 'account', 'debit', 'credit_col']), num: [false, false, false, true, true], rows, foot: ['', '', t(tb.balanced ? 'balanced' : 'not_balanced'), '', ''], data };
    }
    return { head: [], rows: [], num: [] };
  }
  function Reports() {
    const c = cfg(); if (!reportState) reportState = { id: 'r_sales_month', from: today().slice(0, 4) + '-01-01', to: today(), currency: c.currency };
    const s = reportState, r = reportTable(s.id), curs = [...new Set(Store.state.docs.map((d) => d.currency || 'SAR').concat(c.currency))];
    setActions('<button class="btn sm" type="button" data-act="rep-xlsx">Excel</button><button class="btn sm" type="button" data-act="rep-csv">CSV</button><button class="btn sm primary" type="button" data-act="rep-pdf">PDF</button>');
    return '<div class="stack"><div class="chips">' + REPORTS.map((k) => '<button class="chip" type="button" data-act="rep" data-v="' + k + '" aria-pressed="' + (s.id === k) + '">' + esc(t(k)) + '</button>').join('') + '</div>' +
      '<div class="form-grid">' + field(t('period_from'), '<input class="input" type="date" id="rep-from" value="' + esc(s.from) + '">') + field(t('period_to'), '<input class="input" type="date" id="rep-to" value="' + esc(s.to) + '">') +
      field(t('currency'), '<select class="input" id="rep-cur">' + curs.map((k) => '<option' + (k === s.currency ? ' selected' : '') + '>' + k + '</option>').join('') + '</select>') + '</div>' +
      '<section id="report-out" class="stack"><h2 class="h">' + esc(t(s.id)) + '</h2><p class="muted small">' + esc((cfg().biz.name || 'KOSIF') + ' · ' + (s.id === 'r_bs' ? t('period_to') + ' ' + fdate(s.to) : fdate(s.from) + ' — ' + fdate(s.to)) + ' · ' + s.currency) + '</p>' + (r.pre || '') +
      (r.rows.length ? '<div class="table-wrap"><table class="t"><thead><tr>' + r.head.map((h, i) => '<th' + (r.num[i] ? ' class="n"' : '') + '>' + h + '</th>').join('') + '</tr></thead><tbody>' +
        r.rows.map((row) => '<tr' + (row[0] && !row[1] && !row[2] && row.length === 3 ? ' class="sub"' : '') + '>' + row.map((v, i) => '<td' + (r.num[i] ? ' class="n"' : '') + '>' + esc(v) + '</td>').join('') + '</tr>').join('') + '</tbody>' +
        (r.foot ? '<tfoot><tr>' + r.foot.map((v, i) => '<td' + (r.num[i] ? ' class="n"' : '') + '>' + esc(v) + '</td>').join('') + '</tr></tfoot>' : '') + '</table></div>' : '<p class="empty">—</p>') + '</section></div>';
  }

  /* ---------- books ---------- */
  function Books() {
    const c = cfg(), entries = K.journal(Store.state), tb = K.trialBalance(entries, c.currency), bal = Object.fromEntries(tb.rows.map((r) => [r.code, r.net]));
    setActions('<button class="btn sm primary" type="button" data-act="new-journal">' + esc(t('new_journal')) + '</button>');
    return '<div class="stack"><p class="lead">' + esc(t('books_note')) + '</p><div class="row"><span class="pill ' + (tb.balanced ? 'ok' : 'fail') + '">' + esc(t(tb.balanced ? 'balanced' : 'not_balanced')) + '</span><span class="muted small">' + entries.length + ' ' + esc(t('r_journal')) + '</span></div>' +
      '<h3 class="h">' + esc(t('chart_accounts')) + '</h3><div class="table-wrap"><table class="t"><thead><tr><th>' + esc(t('account')) + '</th><th>' + esc(t('category')) + '</th><th class="n">' + esc(t('balance')) + '</th></tr></thead><tbody>' +
      K.ACCOUNTS.map((a) => '<tr><td>' + esc(a.code + ' ' + a[I.lang()]) + '</td><td class="muted">' + esc(t({ asset: 'assets', liability: 'liabilities', equity: 'equity', revenue: 'revenue', expense: 'expenses' }[a.type])) + '</td><td class="n">' + (bal[a.code] ? esc(money(Math.abs(bal[a.code]))) + ' ' + esc(bal[a.code] > 0 ? t('debit') : t('credit_col')) : '—') + '</td></tr>').join('') + '</tbody></table></div>' +
      '<h3 class="h">' + esc(t('new_journal')) + '</h3>' + (Store.state.journals.length ? '<div class="list">' + Store.state.journals.map((j) => '<div class="li"><span class="t">' + esc((j.ref || 'JV') + ' · ' + (j.memo || '')) + '</span><span class="s">' + esc(fdate(j.date)) + '</span><span class="a"><button class="btn sm ghost" type="button" data-act="del-journal" data-id="' + j.id + '">' + esc(t('delete')) + '</button></span></div>').join('') + '</div>' : '<p class="muted">—</p>') + '</div>';
  }
  function journalSheet() {
    const c = cfg(), opts = K.ACCOUNTS.map((a) => '<option value="' + a.code + '">' + esc(a.code + ' ' + a[I.lang()]) + '</option>').join('');
    const lineRow = () => '<div class="row jl"><select class="input" style="flex:2 1 180px">' + opts + '</select><input class="input" inputmode="decimal" placeholder="' + esc(t('debit')) + '" style="flex:1 1 90px"><input class="input" inputmode="decimal" placeholder="' + esc(t('credit_col')) + '" style="flex:1 1 90px"></div>';
    openSheet('<h3 class="h">' + esc(t('new_journal')) + '</h3><form class="stack" id="jv-form"><div class="form-grid">' + field(t('date'), '<input class="input" type="date" id="jv-date" value="' + today() + '">') + field(t('memo'), '<input class="input" id="jv-memo">') + '</div><div class="stack" id="jv-lines">' + lineRow() + lineRow() + '</div>' +
      '<button class="btn sm" type="button" id="jv-add">' + esc(t('add_line')) + '</button><p class="err" id="jv-err" hidden>' + esc(t('must_balance')) + '</p><div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button><button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div></form>');
    $('#sheet [data-sheet-cancel]').onclick = closeSheet;
    $('#jv-add').onclick = () => $('#jv-lines').insertAdjacentHTML('beforeend', lineRow());
    $('#jv-form').onsubmit = async (e) => {
      e.preventDefault(); const lines = $$('#jv-lines .jl').map((r) => { const [s, d, cr] = r.querySelectorAll('select,input'); return { acc: s.value, dr: d.value || '0', cr: cr.value || '0' }; }).filter((l) => K.toMinor(l.dr, c.currency) || K.toMinor(l.cr, c.currency));
      const dr = lines.reduce((s, l) => s + K.toMinor(l.dr, c.currency), 0), cr = lines.reduce((s, l) => s + K.toMinor(l.cr, c.currency), 0);
      if (!lines.length || dr !== cr) { $('#jv-err').hidden = false; return; }
      const n = Store.state.journals.length + 1; closeSheet();
      await Store.write('journals', { id: K.uid(), date: $('#jv-date').value || today(), ref: 'JV-' + String(n).padStart(4, '0'), memo: $('#jv-memo').value, currency: c.currency, lines }); toast(t('saved')); render();
    };
  }

  /* ---------- audit ---------- */
  let auditState = { bm: 'revenue', size: 10, seed: 7, sample: null };
  function Audit() {
    const c = cfg(), a = K.auditChecks(Store.state, today()), fs = K.statements(K.trialBalance(K.journal(Store.state), c.currency));
    const base = { revenue: fs.revenue, profit: fs.profit, assets: fs.assets, expenses: fs.expenses }[auditState.bm], mat = K.materiality(base, auditState.bm), b = a.benford;
    const maxE = Math.max(1, ...b.rows.map((r) => Math.max(r.observed, r.expected)));
    setActions('<button class="btn sm" type="button" data-act="ai-explain">' + esc(t('ai_explain')) + '</button>');
    return '<div class="stack"><p class="lead">' + esc(t('audit_intro')) + '</p>' +
      (a.findings.length ? '<div class="list">' + a.findings.map((f) => '<div class="li"><span class="t">' + esc(t('a_' + f.code)) + (f.type ? ' · ' + esc(typeName(f.type)) : '') + '</span><span class="s">' + esc(f.items.slice(0, 12).join('، ') + (f.count > 12 ? ' …' : '')) + '</span><span class="a"><span class="pill ' + f.sev + '">' + esc(t('sev_' + f.sev)) + '</span></span></div>').join('') + '</div>' : '<p class="empty">' + esc(t('no_findings')) + '</p>') +
      '<div class="grid"><section class="card"><h3 class="h">' + esc(t('benford')) + '</h3><p class="small ' + (b.conforms === false ? '' : 'muted') + '">n = ' + b.n + ' · χ² = ' + b.chi.toFixed(2) + ' · ' + esc(b.conforms == null ? t('benford_few') : t(b.conforms ? 'conforms' : 'not_conforms')) + '</p>' +
      '<div class="bench">' + b.rows.map((r) => '<div class="row" style="gap:8px;flex-wrap:nowrap"><b style="width:14px">' + r.digit + '</b><div style="flex:1;display:grid;gap:3px"><div class="bar" style="width:' + (r.observed / maxE * 100).toFixed(1) + '%"></div><div class="exp" style="width:' + (r.expected / maxE * 100).toFixed(1) + '%"></div></div><span class="small muted num" style="width:64px;text-align:end">' + r.observed + ' / ' + r.expected.toFixed(1) + '</span></div>').join('') + '</div>' +
      '<div class="legend" style="margin-top:8px"><span><i style="background:var(--accent)"></i>' + esc(t('observed')) + '</span><span><i style="background:var(--ink-3)"></i>' + esc(t('expected')) + '</span></div></section>' +
      '<section class="card"><h3 class="h">' + esc(t('materiality')) + '</h3><div class="seg">' + ['revenue', 'profit', 'assets', 'expenses'].map((k) => '<button type="button" data-act="bm" data-v="' + k + '" aria-pressed="' + (auditState.bm === k) + '">' + esc(t('bm_' + k)) + '</button>').join('') + '</div>' +
      '<div class="totals" style="margin-top:12px;width:100%"><div class="r"><span>' + esc(t('benchmark')) + '</span><b class="money">' + esc(money(base)) + '</b></div><div class="r"><span>' + esc(t('overall')) + ' (' + mat.pctLow + '%)</span><b class="money">' + esc(money(mat.overall)) + '</b></div><div class="r"><span>' + esc(t('performance')) + ' (75%)</span><b class="money">' + esc(money(mat.performance)) + '</b></div><div class="r"><span>' + esc(t('trivial')) + ' (5%)</span><b class="money">' + esc(money(mat.trivial)) + '</b></div></div></section>' +
      '<section class="card"><h3 class="h">' + esc(t('sampling')) + '</h3><div class="form-grid">' + field(t('sample_size'), '<input class="input" id="mus-n" inputmode="numeric" value="' + auditState.size + '">') + field(t('seed'), '<input class="input" id="mus-seed" inputmode="numeric" value="' + auditState.seed + '">') + '</div>' +
      '<button class="btn sm" type="button" data-act="mus" style="margin-top:10px">' + esc(t('draw_sample')) + '</button>' + (auditState.sample ? '<div class="list" style="margin-top:10px">' + auditState.sample.map((s) => '<a class="li" href="#doc.' + s.id + '"><span class="t">' + esc(s.number) + '</span><span class="s">' + esc(s.client) + '</span><span class="a"><b class="money">' + esc(money(s.amount)) + '</b></span></a>').join('') + '</div>' : '') + '</section></div>' +
      '<div id="ai-audit"></div></div>';
  }

  /* ---------- assistant (claude.ai "sample" capability) ---------- */
  let sample = null;
  function aiContext() {
    const c = cfg(), d = K.dashboard(Store.state, today(), c.currency), aging = d.aging.rows.slice(0, 15);
    return JSON.stringify({ today: today(), currency: c.currency, business: c.biz.name, salesYTD: K.fromMinor(d.sales, c.currency), collectedYTD: K.fromMinor(d.collected, c.currency), outstanding: K.fromMinor(d.outstanding, c.currency), overdue: K.fromMinor(d.overdue, c.currency),
      monthly: d.months.map((m) => [m.month, K.fromMinor(m.sales, c.currency), K.fromMinor(m.expenses, c.currency)]), unpaid: aging.map((r) => ({ number: r.number, client: r.client, due: r.due, daysLate: r.late, balance: K.fromMinor(r.balance, r.currency), currency: r.currency })),
      clients: Store.state.clients.map((x) => x.name).slice(0, 60), items: Store.state.items.map((i) => ({ name: i.name, unit: i.unit, price: i.price })).slice(0, 60),
      expensesByCategory: Store.state.expenses.reduce((o, e) => ((o[e.category] = (o[e.category] || 0) + Number(e.amount || 0)), o), {}) });
  }
  function Assistant() {
    return '<div class="stack"><p class="lead">' + esc(t('ai_intro')) + '</p><div class="chat" id="chat">' + chatLog.map((m) => '<div class="msg ' + m.who + '">' + esc(m.text) + '</div>').join('') + '</div>' +
      '<form id="ai-form" class="stack"><textarea class="input" id="ai-q" rows="3" placeholder="' + esc(t('ai_placeholder')) + '"></textarea><div class="row"><button class="btn primary" type="submit">' + esc(t('ai_ask')) + '</button><button class="btn" type="button" data-act="ai-draft">' + esc(t('ai_draft')) + '</button></div>' +
      '<p class="small muted" id="ai-note"' + (sample ? ' hidden' : '') + '>' + esc(t('ai_unavailable')) + '</p></form></div>';
  }
  async function aiAsk(q, target) {
    if (!sample) { toast(t('ai_unavailable')); return; }
    const box = target || $('#chat'); if (!target) chatLog.push({ who: 'user', text: q });
    const out = document.createElement('div'); out.className = 'msg ai'; out.textContent = t('ai_thinking');
    if (box) { if (!target) box.insertAdjacentHTML('beforeend', '<div class="msg user">' + esc(q) + '</div>'); box.appendChild(out); }
    try {
      const prompt = 'You are KOSIF, the assistant inside a small-business invoicing and accounting app. Answer in ' + (I.lang() === 'ar' ? 'Arabic' : 'English') + ', briefly and precisely, using ONLY the JSON data below. Quote amounts with currency. If the data does not answer the question, say what is missing.\n\nDATA:\n' + aiContext() + '\n\nQUESTION:\n' + q;
      const r = await sample(prompt, { modelTier: 'default', onText: ({ text }) => { out.textContent = text; } });
      out.textContent = r.text; if (!target) chatLog.push({ who: 'ai', text: r.text });
    } catch (e) { out.textContent = t('ai_error'); }
  }
  async function aiDraft(q) {
    if (!sample) { toast(t('ai_unavailable')); return; }
    if (!q.trim()) { $('#ai-q').focus(); return; }
    toast(t('ai_thinking'));
    try {
      const prompt = 'Turn this request into an invoice draft. Return JSON only: {"type":"invoice"|"estimate"|"receipt","client":"name","lines":[{"name":"","qty":1,"price":0,"unit":""}],"notes":""}. Match client and item names to these lists when they fit: ' + JSON.stringify({ clients: Store.state.clients.map((c) => c.name), items: Store.state.items.map((i) => ({ name: i.name, price: i.price, unit: i.unit })) }) + '\nRequest: ' + q;
      const j = await sample.json(prompt, { modelTier: 'quick' });
      const d = newDoc(['invoice', 'estimate', 'receipt'].includes(j.type) ? j.type : 'invoice');
      const cl = Store.state.clients.find((c) => c.name === j.client); d.client = cl ? snapClient(cl) : j.client ? { name: String(j.client) } : null;
      d.lines = (Array.isArray(j.lines) ? j.lines : []).slice(0, 50).map((l) => ({ name: String(l.name || ''), qty: Number(l.qty) || 1, price: String(l.price || ''), unit: String(l.unit || ''), taxable: true }));
      if (!d.lines.length) d.lines = [{ name: '', qty: 1, price: '', taxable: true }]; if (j.notes) d.notes = String(j.notes);
      d.__for = '#new.' + d.type; draft = d; go('new.' + d.type);
    } catch (e) { toast(t('ai_error')); }
  }

  /* ---------- settings ---------- */
  function Settings() {
    const c = cfg(), b = c.biz; after.push(bindSignature);
    return '<div class="stack"><form class="card stack" id="biz-form"><h3 class="h">' + esc(t('business')) + '</h3><div class="form-grid">' +
      [['name', 'business_name'], ['email', 'email'], ['phone', 'phone'], ['address', 'address'], ['vat', 'vat_no'], ['cr', 'cr_no'], ['website', 'website']].map(([k, l]) => field(t(l), '<input class="input" id="b-' + k + '" value="' + esc(b[k] || '') + '"' + (['email', 'phone', 'vat', 'cr', 'website'].includes(k) ? ' dir="ltr"' : '') + '>')).join('') +
      field(t('country'), '<select class="input" id="b-country">' + [['SA', 'السعودية / Saudi Arabia'], ['AE', 'الإمارات / UAE'], ['EG', 'مصر / Egypt'], ['KW', 'الكويت / Kuwait'], ['OTHER', '—']].map(([v, l]) => '<option value="' + v + '"' + (b.country === v ? ' selected' : '') + '>' + l + '</option>').join('') + '</select>') + '</div>' +
      '<p class="err" id="b-vat-err" hidden>' + esc(t('invalid_vat')) + '</p>' + field(t('bank'), '<textarea class="input" id="b-bank" dir="ltr">' + esc(b.bank || '') + '</textarea>') +
      '<div class="row"><div class="field"><span>' + esc(t('logo')) + '</span><div class="row"><img id="b-logo-prev" style="max-height:56px;max-width:140px' + (img(b.logo) ? '' : ';display:none') + '" src="' + esc(img(b.logo)) + '" alt=""><button class="btn sm" type="button" data-act="logo">' + esc(t('add_photo')) + '</button></div></div></div>' +
      '<div class="field"><span>' + esc(t('signature')) + '</span><canvas class="sig" id="sig" width="840" height="300" aria-label="' + esc(t('sign_here')) + '"></canvas><div class="row"><button class="btn sm" type="button" data-act="sig-clear">' + esc(t('clear')) + '</button><button class="btn sm" type="button" data-act="sig-save">' + esc(t('save')) + ' ' + esc(t('signature')) + '</button>' + (img(b.signature) ? '<img src="' + esc(img(b.signature)) + '" alt="" style="max-height:40px">' : '') + '</div></div>' +
      '<div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button></div></form>' +
      '<form class="card stack" id="def-form"><h3 class="h">' + esc(t('defaults')) + '</h3><div class="form-grid">' +
      field(t('currency'), '<select class="input" id="s-currency">' + Object.keys(K.CURRENCIES).map((k) => '<option' + (c.currency === k ? ' selected' : '') + '>' + k + '</option>').join('') + '</select>') +
      field(t('default_tax'), '<input class="input" id="s-tax" inputmode="decimal" value="' + esc(c.taxRate) + '">') +
      field(t('tax_mode'), '<select class="input" id="s-taxmode"><option value="exclusive"' + (c.taxMode === 'exclusive' ? ' selected' : '') + '>' + esc(t('exclusive')) + '</option><option value="inclusive"' + (c.taxMode === 'inclusive' ? ' selected' : '') + '>' + esc(t('inclusive')) + '</option></select>') +
      field(t('terms_days'), '<input class="input" id="s-terms-days" inputmode="numeric" value="' + esc(c.termsDays) + '">') +
      field(t('template'), '<select class="input" id="s-template">' + ['classic', 'modern', 'ledger', 'stamp'].map((x) => '<option value="' + x + '"' + (c.template === x ? ' selected' : '') + '>' + esc(t('tpl_' + x)) + '</option>').join('') + '</select>') + '</div>' +
      '<label class="check"><input type="checkbox" id="s-zatca"' + (c.zatca ? ' checked' : '') + '> ' + esc(t('zatca_qr')) + '</label><label class="check"><input type="checkbox" id="s-bilingual"' + (c.bilingual ? ' checked' : '') + '> ' + esc(t('bilingual')) + '</label>' +
      '<div class="form-grid">' + field(t('notes'), '<textarea class="input" id="s-notes">' + esc(c.notes) + '</textarea>') + field(t('terms'), '<textarea class="input" id="s-terms">' + esc(c.terms) + '</textarea>') + field(t('payment_instructions'), '<textarea class="input" id="s-payinstr">' + esc(c.payInstr) + '</textarea>') + field(t('payment_link'), '<input class="input" id="s-paylink" dir="ltr" value="' + esc(c.payLink) + '">') + '</div>' +
      '<div class="row"><button class="btn primary" type="submit">' + esc(t('save')) + '</button></div></form>' +
      '<section class="card stack"><div class="row"><div class="field"><span>' + esc(t('language')) + '</span><div class="seg"><button type="button" data-act="lang" data-v="ar" aria-pressed="' + (c.lang === 'ar') + '">العربية</button><button type="button" data-act="lang" data-v="en" aria-pressed="' + (c.lang === 'en') + '">English</button></div></div>' +
      '<div class="field"><span>' + esc(t('theme')) + '</span><div class="seg">' + ['system', 'light', 'dark'].map((x) => '<button type="button" data-act="theme" data-v="' + x + '" aria-pressed="' + (c.theme === x) + '">' + esc(t('th_' + x)) + '</button>').join('') + '</div></div></div></section>' +
      '<section class="card stack"><h3 class="h">' + esc(t('data')) + '</h3><p class="small">' + esc(Store.mode === 'cloud' ? t('storage_cloud') : t('storage_local')) + '</p><div class="row">' +
      '<button class="btn" type="button" data-act="backup">' + esc(t('download_json')) + '</button><button class="btn" type="button" data-act="restore">' + esc(t('restore')) + '</button><button class="btn" type="button" data-act="export-all">' + esc(t('export_all')) + '</button><button class="btn" type="button" data-act="load-demo">' + esc(t('load_demo')) + '</button><button class="btn danger" type="button" data-act="erase">' + esc(t('erase_all')) + '</button></div></section></div>';
  }
  function bindSignature() {
    const cv = $('#sig'); if (!cv) return; const g = cv.getContext('2d'); g.lineWidth = 4; g.lineCap = 'round'; g.strokeStyle = '#1d1814'; let on = false, last = null;
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    cv.onpointerdown = (e) => { on = true; last = pt(e); cv.setPointerCapture(e.pointerId); cv.dataset.dirty = '1'; };
    cv.onpointermove = (e) => { if (!on) return; const p = pt(e); g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke(); last = p; };
    cv.onpointerup = cv.onpointercancel = () => { on = false; };
  }

  /* ---------- capabilities and design ---------- */
  function liveChecks() {
    const ok = (f) => { try { return !!f(); } catch { return false; } };
    const st = { docs: [{ type: 'invoice', number: 'INV-0001', date: '2026-01-01', currency: 'SAR', lines: [{ name: 'a', qty: 2, price: '100' }], payments: [{ amount: '115', method: 'cash', date: '2026-01-02' }] }], expenses: [{ date: '2026-01-03', category: 'rent', amount: '115', vat: '15', method: 'bank' }] };
    return {
      money: ok(() => K.toMinor('١٬٢٥٠٫٥', 'SAR') === 125050 && K.toMinor('1.005', 'KWD') === 1005),
      totals: ok(() => K.totals({ currency: 'SAR', lines: [{ qty: 1, price: '100' }] }).total === 11500),
      journal: ok(() => K.trialBalance(K.journal(st), 'SAR').balanced),
      statements: ok(() => K.statements(K.trialBalance(K.journal(st), 'SAR')).check === 0),
      vat: ok(() => K.vatReturn(st, '2026-01-01', '2026-12-31', 'SAR').net === 1500),
      zatca: ok(() => K.parseTLV(K.zatcaTLV('اختبار', '310000000000003', '2026-01-01T00:00:00Z', 11500, 1500, 'SAR'))[3].value === '115.00'),
      aging: ok(() => K.receivablesAging(st.docs, '2026-03-01').rows.length === 1),
      recurring: ok(() => K.nextOccurrence('2026-01-15', 'monthly') === '2026-02-15'),
      gaps: ok(() => K.numberingGaps([{ type: 'invoice', number: 'INV-0001' }, { type: 'invoice', number: 'INV-0003' }], 'invoice').gaps[0] === 'INV-0002'),
      benford: ok(() => K.benford([1, 2, 3]).n === 3), materiality: ok(() => K.materiality(10000000, 'revenue').overall === 50000),
      mus: ok(() => K.musSample([{ amount: 5 }, { amount: 10 }], 1, 3).length === 1), audit: ok(() => Array.isArray(K.auditChecks(st, '2026-02-01').findings)),
      csv: ok(() => K.parseCSV(K.toCSV([['=x']]))[0][0] === "'=x"), storage: ok(() => typeof Store.state === 'object'),
      xlsx: !!window.XLSX || 'lazy', pdf: !!window.html2pdf || 'lazy', ai: !!sample, design: ok(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() !== ''),
    };
  }
  function Caps() {
    const checks = liveChecks(), fams = { accounting: 'nav_books', audit: 'nav_audit', data: 'data', ai: 'nav_ai', media: 'photos', ops: 'nav_settings' };
    const passed = Object.values(checks).filter((v) => v === true).length, total = Object.keys(checks).length;
    const statusPill = (s) => '<span class="pill ' + s + '">' + esc(t('cap_' + s)) + '</span>';
    const checkCell = (c) => { if (!c.check) return ''; const v = checks[c.check]; return v === true ? '<span class="pill ok">✓ ' + esc(c.check) + '</span>' : v === 'lazy' ? '<span class="pill sent">' + esc(c.check) + ' · on use</span>' : '<span class="pill fail">✕ ' + esc(c.check) + '</span>'; };
    const counts = D.CAPABILITIES.reduce((o, c) => ((o[c.status] = (o[c.status] || 0) + 1), o), {});
    return '<div class="stack"><p class="lead">' + esc(t('caps_intro')) + '</p><div class="kpis">' + kpi('cap_integrated', String(counts.integrated || 0)) + kpi('cap_bridged', String(counts.bridged || 0)) + kpi('cap_external', String(counts.external || 0)) + kpi('cap_unavailable', String(counts.unavailable || 0)) + '<div class="kpi"><div class="label">' + esc(t('checks_passed')) + '</div><div class="value">' + passed + ' / ' + total + '</div></div></div>' +
      Object.keys(fams).map((f) => '<section><h3 class="h">' + esc(f.toUpperCase()) + '</h3><div class="table-wrap"><table class="t"><thead><tr><th>' + esc(t('name')) + '</th><th>' + esc(t('from')) + '</th><th>' + esc(t('category')) + '</th><th></th></tr></thead><tbody>' +
        D.CAPABILITIES.filter((c) => c.fam === f).map((c) => '<tr><td>' + esc(c[I.lang()]) + (c.note ? '<div class="small muted">' + esc(c.note) + '</div>' : '') + '</td><td class="small muted">' + esc(c.src) + '</td><td>' + statusPill(c.status) + '</td><td>' + checkCell(c) + '</td></tr>').join('') + '</tbody></table></div></section>').join('') +
      '<section><h3 class="h">' + esc(t('ref_features')) + ' — Invoice Simple</h3><div class="table-wrap"><table class="t"><thead><tr><th>Feature</th><th>KOSIF</th><th></th></tr></thead><tbody>' +
      D.REFERENCE_FEATURES.map(([f, w, s]) => '<tr><td>' + esc(f) + '</td><td class="small muted">' + esc(w) + '</td><td>' + statusPill(s) + '</td></tr>').join('') + '</tbody></table></div></section></div>';
  }
  function Design() {
    const tok = ['--paper', '--paper-2', '--card', '--ink', '--ink-2', '--ink-3', '--rule-soft', '--accent', '--accent-soft', '--good', '--warn', '--bad', '--info'];
    return '<div class="stack"><p class="lead">KOSIF · ledger paper: cream stock, charcoal ink rules, one saffron accent, outline pills, Fraunces for display and Readex Pro for Arabic and Latin text.</p>' +
      '<section class="card"><h3 class="h">Color</h3><div class="swatch-row">' + tok.map((v) => '<div class="tok"><i style="background:var(' + v + ')"></i><code class="small">' + v + '</code></div>').join('') + '</div></section>' +
      '<section class="card stack"><h3 class="h">Type</h3><div style="font:600 2.6rem/1.08 var(--f-display)">kosif ledger 1,250.00</div><div style="font:600 1.75rem/1.2 var(--f-display)">فاتورة ضريبية ١٢٥٠</div><div style="font:600 1.125rem var(--f-ui)">Heading · عنوان</div><div>Body text 16/1.55 — نص أساسي لقراءة مريحة.</div><div class="small muted">Caption 13 · تسمية</div><div class="eyebrow">Eyebrow · tracked</div></section>' +
      '<section class="card stack"><h3 class="h">Components</h3><div class="row"><button class="btn primary" type="button">Primary</button><button class="btn" type="button">Secondary</button><button class="btn ghost" type="button">Ghost</button><button class="btn danger" type="button">Danger</button><button class="btn sm" type="button">Small</button></div>' +
      '<div class="row">' + ['paid', 'partial', 'overdue', 'sent', 'draft'].map((s) => '<span class="pill ' + s + '">' + esc(stName(s)) + '</span>').join('') + '</div><div class="seg"><button aria-pressed="true" type="button">One</button><button aria-pressed="false" type="button">Two</button></div>' +
      '<div class="form-grid">' + field('Input', '<input class="input" value="1,250.00">') + field('Select', '<select class="input"><option>SAR</option></select>') + '</div>' + kpi('kpi_sales', money(12500000)) + '</section>' +
      '<section class="card"><h3 class="h">Spacing · radius · elevation</h3><p class="small">4px base: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48. Radius: input 8, card 12, pill 999, sheet 20. Shadows: card 0 2 20 / 6%, button 0 1 2 / 22%.</p></section></div>';
  }

  /* ---------- import ---------- */
  async function importRecords(kind) {
    const f = await pickFile('.csv,.xlsx,.xls,text/csv'); if (!f) return;
    let rows;
    if (/\.xlsx?$/i.test(f.name)) { const X = await loadXLSX(); const wb = X.read(await f.arrayBuffer(), { type: 'array' }); rows = X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false }); }
    else rows = K.parseCSV(await f.text());
    const map = kind === 'clients'
      ? { name: ['name', 'الاسم', 'العميل', 'client'], email: ['email', 'البريد', 'البريد الإلكتروني'], phone: ['phone', 'mobile', 'الجوال', 'الهاتف'], address: ['address', 'العنوان'], vat: ['vat', 'الرقم الضريبي', 'vat number'] }
      : { name: ['name', 'الاسم', 'الصنف', 'item'], price: ['price', 'السعر', 'rate'], unit: ['unit', 'الوحدة'], desc: ['description', 'الوصف'] };
    const recs = K.rowsToRecords(rows, map).filter((r) => r.name);
    for (const r of recs) await Store.write(kind, Object.assign({ id: K.uid() }, kind === 'items' ? { taxable: true } : {}, r));
    toast(t('imported') + ': ' + recs.length); render();
  }

  /* ---------- events ---------- */
  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, id = el.dataset.id, v = el.dataset.v;
    if (a === 'more') { openSheet('<div class="stack">' + NAV.slice(3).map(([k, l]) => '<a class="rail-link" href="#' + k + '" data-close>' + icon(k) + '<span>' + esc(t(l)) + '</span></a>').join('') + '</div>'); $$('#sheet [data-close]').forEach((x) => (x.onclick = () => closeSheet())); return; }
    if (a === 'ftype') { docFilter = { type: v, status: 'all', q: docFilter.q }; render(); return; }
    if (a === 'fstatus') { docFilter.status = v; render(); return; }
    if (a === 'add-line') { readForm(); draft.lines.push({ name: '', qty: 1, price: '', taxable: true }); render(); return; }
    if (a === 'rm-line') { readForm(); draft.lines.splice(+el.dataset.i, 1); if (!draft.lines.length) draft.lines.push({ name: '', qty: 1, price: '', taxable: true }); render(); return; }
    if (a === 'tpl') { readForm(); draft.template = v; render(); return; }
    if (a === 'color') { readForm(); draft.color = v; render(); return; }
    if (a === 'save-doc') { await saveDoc(); return; }
    if (a === 'cancel-edit') { const back = draft && findDoc(draft.id); draft = null; go(back ? 'doc.' + back.id : 'docs'); return; }
    if (a === 'new-client-inline') { readForm(); clientSheet(null, (c) => { draft.client = snapClient(c); render(); }); return; }
    if (a === 'add-photo') { readForm(); const f = await pickFile('image/*'); if (!f) return; const url = await readImage(f, 1200); const pid = 'im' + K.uid(); await Store.putImage(pid, url); draft.photos = (draft.photos || []).concat(pid); render(); return; }
    if (a === 'rm-photo') { readForm(); draft.photos = draft.photos.filter((p) => p !== id); render(); return; }
    const x = id && findDoc(id);
    if (a === 'share' && x) { shareSheet(x, shareText(x)); return; }
    if (a === 'remind' && x) { const tt = K.totals(x); shareSheet(x, t('reminder_text', { client: (x.client && x.client.name) || '', number: x.number, amount: money(tt.balance, tt.currency), due: fdate(x.dueDate) })); return; }
    if (a === 'pdf' && x) { await pdfOf(x); return; }
    if (a === 'pay' && x) { paySheet(x); return; }
    if (a === 'rm-pay' && x) { x.payments = x.payments.filter((p) => p.id !== el.dataset.p); await Store.write('docs', x); render(); return; }
    if (a === 'mark-sent' && x) { x.sent = true; await Store.write('docs', x); render(); return; }
    if (a === 'accept' && x) { x.estimateStatus = 'accepted'; await Store.write('docs', x); render(); return; }
    if (a === 'decline' && x) { x.estimateStatus = 'declined'; await Store.write('docs', x); render(); return; }
    if (a === 'convert' && x) { const inv = K.estimateToInvoice(x, Store.state.docs, today(), cfg().termsDays); inv.id = K.uid(); delete inv.demo; x.estimateStatus = 'converted'; await Store.write('docs', x); await Store.write('docs', inv); toast(t('saved')); go('doc.' + inv.id); return; }
    if (a === 'dup' && x) { const d = clone(x); Object.assign(d, { id: K.uid(), number: K.nextNumber(Store.state.docs, x.type), date: today(), dueDate: x.dueDate ? K.addDays(today(), cfg().termsDays) : '', payments: [], sent: false, void: false }); delete d.demo; delete d.estimateStatus; delete d.fromEstimate; await Store.write('docs', d); go('edit.' + d.id); return; }
    if (a === 'credit-note' && x) { const d = clone(x); Object.assign(d, { id: K.uid(), type: 'credit', number: K.nextNumber(Store.state.docs, 'credit'), date: today(), dueDate: '', payments: [], ofInvoice: x.number, notes: t('invoice') + ' ' + x.number }); delete d.demo; delete d.recurring; await Store.write('docs', d); go('edit.' + d.id); return; }
    if (a === 'void' && x) { if (await confirmSheet(t('void_doc') + ' ' + x.number + '?', t('void_doc'))) { x.void = true; await Store.write('docs', x); render(); } return; }
    if (a === 'del-doc' && x) { if (await confirmSheet(t('confirm_delete'), t('delete'))) { await Store.remove('docs', x.id); toast(t('deleted')); go('docs'); } return; }
    if (a === 'edit-client') { clientSheet(Store.state.clients.find((c) => c.id === id)); return; }
    if (a === 'del-client') { if (await confirmSheet(t('confirm_delete'), t('delete'))) { await Store.remove('clients', id); toast(t('deleted')); go('clients'); } return; }
    if (a === 'edit-item') { itemSheet(Store.state.items.find((i) => i.id === id)); return; }
    if (a === 'new-expense') { expenseSheet(null); return; }
    if (a === 'edit-expense') { expenseSheet(Store.state.expenses.find((x2) => x2.id === id)); return; }
    if (a === 'import-clients') { await importRecords('clients'); return; }
    if (a === 'import-items') { await importRecords('items'); return; }
    if (a === 'rep') { reportState.id = v; render(); return; }
    if (a === 'rep-csv' || a === 'rep-xlsx' || a === 'rep-pdf') {
      const r = reportTable(reportState.id), name = 'KOSIF-' + t(reportState.id).replace(/\s+/g, '-') + '-' + reportState.to;
      if (a === 'rep-csv') await saveFile(name + '.csv', new Blob([K.toCSV(r.data)], { type: 'text/csv' }));
      else if (a === 'rep-xlsx') await exportXLSX(name + '.xlsx', [[t(reportState.id), r.data]]);
      else { const el2 = $('#report-out'); el2.style.background = 'var(--paper)'; el2.style.padding = '24px'; await exportPDF(el2, name + '.pdf'); el2.style.padding = ''; }
      return;
    }
    if (a === 'new-journal') { journalSheet(); return; }
    if (a === 'del-journal') { if (await confirmSheet(t('confirm_delete'), t('delete'))) { await Store.remove('journals', id); render(); } return; }
    if (a === 'bm') { auditState.bm = v; render(); return; }
    if (a === 'mus') {
      auditState.size = Math.max(1, Math.min(200, parseInt($('#mus-n').value, 10) || 10)); auditState.seed = parseInt($('#mus-seed').value, 10) || 1;
      const items = Store.state.docs.filter((d) => d.type === 'invoice' && !d.void && (d.currency || 'SAR') === cfg().currency).map((d) => ({ id: d.id, number: d.number, client: (d.client && d.client.name) || '', amount: K.totals(d).total }));
      auditState.sample = K.musSample(items, auditState.size, auditState.seed); render(); return;
    }
    if (a === 'ai-explain') { const target = $('#ai-audit'); target.className = 'chat'; await aiAsk('Explain these audit findings for the owner and what to do next: ' + JSON.stringify(K.auditChecks(Store.state, today()).findings), target); return; }
    if (a === 'ai-draft') { await aiDraft($('#ai-q').value); return; }
    if (a === 'lang') { await saveCfg({ lang: v }); return; }
    if (a === 'theme') { await saveCfg({ theme: v }); return; }
    if (a === 'logo') { const f = await pickFile('image/*'); if (!f) return; const url = await readImage(f, 600); const lid = 'im' + K.uid(); await Store.putImage(lid, url); const c = cfg(); await saveCfg({ biz: Object.assign({}, c.biz, { logo: lid }) }); toast(t('saved')); return; }
    if (a === 'sig-clear') { const cv = $('#sig'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); delete cv.dataset.dirty; return; }
    if (a === 'sig-save') { const cv = $('#sig'); if (!cv.dataset.dirty) return; const sid = 'im' + K.uid(); await Store.putImage(sid, cv.toDataURL('image/png')); const c = cfg(); await saveCfg({ biz: Object.assign({}, c.biz, { signature: sid }) }); toast(t('saved')); return; }
    if (a === 'backup') { await saveFile('KOSIF-backup-' + today() + '.json', new Blob([JSON.stringify(Object.assign({ kosif: 1, exported: new Date().toISOString() }, Store.state))], { type: 'application/json' })); return; }
    if (a === 'restore') { const f = await pickFile('.json,application/json'); if (!f) return; try { const j = JSON.parse(await f.text()); if (!j || !Array.isArray(j.docs)) throw new Error('format'); await Store.replaceAll(j); toast(t('restored')); } catch { toast('✕ JSON'); } return; }
    if (a === 'export-all') {
      const s = Store.state, cur = cfg().currency;
      await exportXLSX('KOSIF-' + today() + '.xlsx', [
        [t('documents'), [[t('number'), t('category'), t('date'), t('due'), t('client'), t('currency'), t('subtotal'), t('vat'), t('total'), t('paid'), t('balance_due')]].concat(s.docs.map((d) => { const tt = K.totals(d); return [d.number, typeName(d.type), d.date, d.dueDate || '', (d.client && d.client.name) || '', tt.currency, K.fromMinor(tt.subtotal, tt.currency), K.fromMinor(tt.tax, tt.currency), K.fromMinor(tt.total, tt.currency), K.fromMinor(tt.paid, tt.currency), K.fromMinor(tt.balance, tt.currency)]; }))],
        [t('nav_clients'), [[t('name'), t('email'), t('phone'), t('address'), t('vat_no')]].concat(s.clients.map((c) => [c.name, c.email, c.phone, c.address, c.vat]))],
        [t('nav_items'), [[t('name'), t('price'), t('unit'), t('description')]].concat(s.items.map((i) => [i.name, Number(i.price) || 0, i.unit, i.desc || '']))],
        [t('nav_expenses'), [[t('date'), t('vendor'), t('category'), t('amount'), t('vat'), t('currency')]].concat(s.expenses.map((x2) => [x2.date, x2.vendor, t('c_' + x2.category), Number(x2.amount) || 0, Number(x2.vat) || 0, x2.currency || 'SAR']))],
        [t('r_tb'), [[t('account'), t('debit'), t('credit_col')]].concat(K.trialBalance(K.journal(s), cur).rows.map((r) => [r.code + ' ' + r[I.lang()], r.net > 0 ? K.fromMinor(r.net, cur) : 0, r.net < 0 ? K.fromMinor(-r.net, cur) : 0]))],
      ]);
      return;
    }
    if (a === 'load-demo') { await loadDemo(); render(); return; }
    if (a === 'clear-demo') { await clearDemo(); render(); return; }
    if (a === 'erase') {
      openSheet('<h3 class="h">' + esc(t('erase_all')) + '</h3><p>' + esc(t('erase_confirm')) + '</p><input class="input" id="erase-word" dir="ltr" autocomplete="off"><div class="row" style="margin-top:12px"><button class="btn danger" type="button" id="erase-go">' + esc(t('erase_all')) + '</button><button class="btn ghost" type="button" data-sheet-cancel>' + esc(t('cancel')) + '</button></div>');
      $('#sheet [data-sheet-cancel]').onclick = closeSheet;
      $('#erase-go').onclick = async () => { if ($('#erase-word').value.trim().toUpperCase() !== 'KOSIF') { $('#erase-word').setAttribute('aria-invalid', 'true'); return; } closeSheet(); await Store.replaceAll(Object.assign(D.empty(), { settings: { lang: cfg().lang, theme: cfg().theme, demoDone: true } })); toast(t('deleted')); go('home'); };
      return;
    }
  });
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'ai-form') { e.preventDefault(); const q = $('#ai-q').value.trim(); if (q) { $('#ai-q').value = ''; await aiAsk(q); } }
    if (e.target.id === 'biz-form') {
      e.preventDefault(); const c = cfg(), biz = Object.assign({}, c.biz); for (const k of ['name', 'email', 'phone', 'address', 'vat', 'cr', 'website', 'country', 'bank']) biz[k] = $('#b-' + k).value.trim();
      const bad = biz.country === 'SA' && biz.vat && !K.validVatSA(biz.vat); $('#b-vat-err').hidden = !bad; if (bad) { $('#b-vat').setAttribute('aria-invalid', 'true'); return; }
      await saveCfg({ biz }); toast(t('saved'));
    }
    if (e.target.id === 'def-form') {
      e.preventDefault();
      await saveCfg({ currency: $('#s-currency').value, taxRate: Number(String($('#s-tax').value).replace(',', '.')) || 0, taxMode: $('#s-taxmode').value, termsDays: parseInt($('#s-terms-days').value, 10) || 0, template: $('#s-template').value,
        zatca: $('#s-zatca').checked, bilingual: $('#s-bilingual').checked, notes: $('#s-notes').value, terms: $('#s-terms').value, payInstr: $('#s-payinstr').value, payLink: $('#s-paylink').value.trim() });
      toast(t('saved'));
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'doc-q') { docFilter.q = e.target.value; const pos = e.target.selectionStart; render(); const q = $('#doc-q'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } return; }
    if (e.target.id === 'client-q') { Clients.q = e.target.value; const pos = e.target.selectionStart; render(); const q = $('#client-q'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } return; }
    if (e.target.closest && e.target.closest('#doc-form')) updateTotals();
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'd-client') { readForm(); const c = Store.state.clients.find((x) => x.id === el.value); draft.client = c ? snapClient(c) : null; render(); return; }
    if (el.dataset && el.dataset.l === 'name') {
      const it = Store.state.items.find((i) => i.name === el.value); if (!it) return; const row = el.closest('.line');
      row.querySelector('[data-l="price"]').value = it.price; row.querySelector('[data-l="unit"]').value = it.unit || ''; row.querySelector('[data-l="desc"]').value = it.desc || ''; row.querySelector('[data-l="taxable"]').checked = it.taxable !== false;
      updateTotals(); return;
    }
    if (['d-date', 'd-currency', 'd-taxmode'].includes(el.id)) updateTotals();
    if (['rep-from', 'rep-to', 'rep-cur'].includes(el.id)) { reportState.from = $('#rep-from').value; reportState.to = $('#rep-to').value; reportState.currency = $('#rep-cur').value; render(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
  $('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#edit') && !location.hash.startsWith('#new')) draft = null; render(); window.scrollTo(0, 0); });

  /* ---------- data lifecycle ---------- */
  async function loadDemo() {
    const s = D.demoState(today());
    for (const k of D.KINDS) Store.state[k] = Store.state[k].filter((x) => !x.demo).concat(s[k]);
    const c = Store.state.settings || {};
    Store.state.settings = Object.assign({}, c, { demoDone: true, biz: Object.assign({}, DEFAULTS.biz, c.biz || {}, (c.biz && c.biz.name) ? {} : { name: 'مؤسسة KOSIF التجريبية', vat: '399999999900003', phone: '+966 50 000 0000', address: 'الرياض', bank: 'IBAN SA00 0000 0000 0000 0000 0000' }) });
    await Store.replaceAll(Store.state);
  }
  async function clearDemo() {
    const next = clone(Store.state); for (const k of D.KINDS) next[k] = next[k].filter((x) => !x.demo);
    if (next.settings && next.settings.biz && next.settings.biz.name === 'مؤسسة KOSIF التجريبية') next.settings.biz = Object.assign({}, DEFAULTS.biz);
    next.settings = Object.assign({}, next.settings, { demoDone: true }); await Store.replaceAll(next);
  }
  /* recurring invoices that fell due since the last visit are created once, with fresh numbers */
  async function runRecurring() {
    let made = 0; const now = today();
    for (const src of Store.state.docs.filter((d) => d.type === 'invoice' && d.recurring && d.recurring.next && !d.void && !d.demo)) {
      const occ = K.dueOccurrences(src.recurring, now, 12); if (!occ.dates.length) continue;
      for (const date of occ.dates) {
        const d = clone(src); Object.assign(d, { id: K.uid(), number: K.nextNumber(Store.state.docs, 'invoice'), date, dueDate: K.addDays(date, cfg().termsDays), payments: [], sent: false, recurring: null, fromRecurring: src.number });
        await Store.write('docs', d); made++;
      }
      src.recurring = Object.assign({}, src.recurring, { next: occ.next }); await Store.write('docs', src);
    }
    if (made) toast(t('generated_recurring') + ': ' + made);
  }

  async function boot() {
    Store.loadLocal(); applyLook();
    if (!Store.state.settings.demoDone && !D.KINDS.some((k) => Store.state[k].length)) await loadDemo();
    render();
    Store.onChange(() => { if (!draft) render(); else applyLook(); });
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then((d) => { downloads = d; }).catch(() => {});
      window.claude.use('sample').then((s) => { sample = s; if (route().name === 'ai' || route().name === 'caps') render(); }).catch(() => {});
      const connected = await Store.connect();
      if (connected && !Store.state.settings.demoDone && !D.KINDS.some((k) => Store.state[k].length)) await loadDemo();
    }
    await runRecurring();
  }
  window.KOSIFApp = { render, Store, today, liveChecks };
  boot();
})();
