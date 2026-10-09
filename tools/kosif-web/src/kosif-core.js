/* KOSIF core — every number the app shows is computed here, in integer minor units, with no DOM.
   Loaded as a browser script (window.KOSIFCore) and as a CommonJS module by the tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KOSIFCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- currencies and money ---------- */
  const CURRENCIES = {
    SAR: { d: 2, ar: 'ريال سعودي', en: 'Saudi riyal', sym: 'ر.س' },
    AED: { d: 2, ar: 'درهم إماراتي', en: 'UAE dirham', sym: 'د.إ' },
    EGP: { d: 2, ar: 'جنيه مصري', en: 'Egyptian pound', sym: 'ج.م' },
    KWD: { d: 3, ar: 'دينار كويتي', en: 'Kuwaiti dinar', sym: 'د.ك' },
    BHD: { d: 3, ar: 'دينار بحريني', en: 'Bahraini dinar', sym: 'د.ب' },
    OMR: { d: 3, ar: 'ريال عماني', en: 'Omani rial', sym: 'ر.ع' },
    QAR: { d: 2, ar: 'ريال قطري', en: 'Qatari riyal', sym: 'ر.ق' },
    JOD: { d: 3, ar: 'دينار أردني', en: 'Jordanian dinar', sym: 'د.أ' },
    USD: { d: 2, ar: 'دولار أمريكي', en: 'US dollar', sym: '$' },
    EUR: { d: 2, ar: 'يورو', en: 'Euro', sym: '€' },
    GBP: { d: 2, ar: 'جنيه إسترليني', en: 'Pound sterling', sym: '£' },
  };
  const digits = (cur) => (CURRENCIES[cur] || CURRENCIES.SAR).d;
  const scale = (cur) => Math.pow(10, digits(cur));
  /* parse a typed amount ("1,250.5", "١٢٥٠٫٥", 1250.5) into minor units; NaN-safe */
  function toMinor(v, cur) {
    if (typeof v === 'number') return Number.isFinite(v) ? Math.round(v * scale(cur)) : 0;
    let s = String(v == null ? '' : v).trim();
    s = s.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x6f0));
    s = s.replace(/٫/g, '.').replace(/[٬,\s]/g, '');
    const n = Number(s);
    return Number.isFinite(n) ? Math.round(n * scale(cur)) : 0;
  }
  const fromMinor = (m, cur) => m / scale(cur);
  function formatMoney(m, cur, lang) {
    const d = digits(cur), loc = lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US';
    const s = new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).format(fromMinor(m, cur));
    const c = CURRENCIES[cur] || { sym: cur };
    return lang === 'ar' ? s + ' ' + c.sym : (c.sym.length === 1 ? c.sym + s : s + ' ' + cur);
  }
  /* round half away from zero of a rational, in minor units */
  const rdiv = (num, den) => (num >= 0 ? Math.floor((num * 2 + den) / (den * 2)) : -Math.floor((-num * 2 + den) / (den * 2)));

  /* ---------- documents ---------- */
  const DOC_TYPES = ['invoice', 'estimate', 'receipt', 'credit'];
  const PREFIX = { invoice: 'INV', estimate: 'EST', receipt: 'RCT', credit: 'CRN' };
  function formatNumber(type, n, prefix) { return (prefix || PREFIX[type] || 'DOC') + '-' + String(n).padStart(4, '0'); }
  /* next number = one past the highest number used for this type and prefix */
  function nextNumber(docs, type, prefix) {
    const p = (prefix || PREFIX[type]) + '-';
    let max = 0;
    for (const d of docs) if (d.type === type && typeof d.number === 'string' && d.number.startsWith(p)) {
      const n = parseInt(d.number.slice(p.length), 10); if (n > max) max = n;
    }
    return formatNumber(type, max + 1, prefix);
  }

  /* rates are basis points (15% = 1500) so they stay integers */
  const bp = (pct) => Math.round(Number(pct || 0) * 100);
  function lineAmounts(line, cur, taxMode, defaultRateBp) {
    const qtyMilli = Math.round(Number(line.qty || 0) * 1000);
    const price = typeof line.priceMinor === 'number' ? line.priceMinor : toMinor(line.price, cur);
    const gross = rdiv(qtyMilli * price, 1000);
    let disc = 0;
    if (line.discount && line.discount.value) {
      disc = line.discount.type === 'pct' ? rdiv(gross * bp(line.discount.value), 10000) : toMinor(line.discount.value, cur);
      disc = Math.min(Math.max(disc, 0), Math.abs(gross)) * Math.sign(gross || 1);
    }
    const net = gross - disc;
    const rate = line.taxable === false ? 0 : (line.taxRateBp != null ? line.taxRateBp : defaultRateBp);
    return { gross, disc, net, rate };
  }
  /* totals of a document. taxMode 'exclusive' adds tax on top; 'inclusive' extracts it from prices.
     A document discount is spread over the lines in proportion, so tax stays correct per rate. */
  function totals(doc, opts) {
    const cur = doc.currency || 'SAR', mode = doc.taxMode || 'exclusive';
    const defRate = doc.taxRateBp != null ? doc.taxRateBp : bp(opts && opts.taxRate != null ? opts.taxRate : 15);
    const lines = (doc.lines || []).map((l) => lineAmounts(l, cur, mode, defRate));
    const subtotal = lines.reduce((s, l) => s + l.net, 0), lineDisc = lines.reduce((s, l) => s + l.disc, 0);
    let docDisc = 0;
    if (doc.discount && doc.discount.value) {
      docDisc = doc.discount.type === 'pct' ? rdiv(subtotal * bp(doc.discount.value), 10000) : toMinor(doc.discount.value, cur);
      docDisc = Math.min(Math.max(docDisc, 0), Math.max(subtotal, 0));
    }
    const byRate = {}; let left = docDisc;
    lines.forEach((l, i) => {
      const share = i === lines.length - 1 ? left : (subtotal ? rdiv(docDisc * l.net, subtotal) : 0);
      left -= share; const base = l.net - share;
      byRate[l.rate] = (byRate[l.rate] || 0) + base;
    });
    let tax = 0, taxable = 0; const taxLines = [];
    for (const r of Object.keys(byRate).map(Number).sort((a, b) => a - b)) {
      const base = byRate[r]; let t, b;
      if (mode === 'inclusive') { t = rdiv(base * r, 10000 + r); b = base - t; } else { t = rdiv(base * r, 10000); b = base; }
      tax += t; taxable += b; if (r) taxLines.push({ rateBp: r, base: b, tax: t });
    }
    const shipping = toMinor(doc.shipping || 0, cur);
    const beforeFee = (mode === 'inclusive' ? subtotal - docDisc : subtotal - docDisc + tax) + shipping;
    const fee = doc.cardFeePct ? rdiv(beforeFee * bp(doc.cardFeePct), 10000) : 0;
    const total = beforeFee + fee;
    const paid = (doc.payments || []).reduce((s, p) => s + (typeof p.amountMinor === 'number' ? p.amountMinor : toMinor(p.amount, cur)), 0);
    const deposit = doc.deposit && doc.deposit.value ? (doc.deposit.type === 'pct' ? rdiv(total * bp(doc.deposit.value), 10000) : toMinor(doc.deposit.value, cur)) : 0;
    return { currency: cur, lines, subtotal, lineDiscount: lineDisc, discount: docDisc, taxable, tax, taxLines, shipping, fee, total, paid, balance: total - paid, deposit: Math.min(deposit, total) };
  }

  const DAY = 86400000;
  const iso = (d) => new Date(d).toISOString().slice(0, 10);
  const addDays = (date, n) => iso(new Date(date + 'T00:00:00Z').getTime() + n * DAY);
  const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / DAY);
  /* status follows the money and the dates, never a stored label (except draft/void/estimate decisions) */
  function status(doc, today) {
    if (doc.void) return 'void';
    if (doc.type === 'estimate') return doc.estimateStatus || (doc.sent ? 'sent' : 'draft');
    if (doc.type === 'receipt') return 'paid';
    if (doc.type === 'credit') return 'issued';
    const t = totals(doc);
    if (t.total > 0 && t.paid >= t.total) return 'paid';
    if (doc.dueDate && today && doc.dueDate < today && t.balance > 0) return 'overdue';
    if (t.paid > 0) return 'partial';
    return doc.sent ? 'sent' : 'draft';
  }
  /* an accepted estimate becomes an invoice: same client, lines, notes; new number; link both ways */
  function estimateToInvoice(est, docs, today, termsDays, prefix) {
    const inv = JSON.parse(JSON.stringify(est));
    inv.id = undefined; inv.type = 'invoice'; inv.number = nextNumber(docs, 'invoice', prefix); inv.date = today;
    inv.dueDate = addDays(today, termsDays == null ? 14 : termsDays); inv.payments = []; inv.sent = false;
    delete inv.estimateStatus; inv.fromEstimate = est.number;
    return inv;
  }

  /* recurring invoices: every occurrence date from `from` up to `today`, inclusive */
  function nextOccurrence(date, freq) {
    const d = new Date(date + 'T00:00:00Z');
    if (freq === 'weekly') d.setUTCDate(d.getUTCDate() + 7);
    else if (freq === 'monthly') d.setUTCMonth(d.getUTCMonth() + 1);
    else if (freq === 'quarterly') d.setUTCMonth(d.getUTCMonth() + 3);
    else if (freq === 'yearly') d.setUTCFullYear(d.getUTCFullYear() + 1);
    else return null;
    return iso(d);
  }
  function dueOccurrences(rec, today, max) {
    const out = []; let d = rec.next;
    while (d && d <= today && out.length < (max || 24)) { out.push(d); d = nextOccurrence(d, rec.freq); }
    return { dates: out, next: d };
  }

  /* ---------- ZATCA e-invoice QR (simplified tax invoice, phase 1 TLV) ---------- */
  function utf8(s) { return Array.from(unescape(encodeURIComponent(String(s)))).map((c) => c.charCodeAt(0)); }
  function zatcaTLV(seller, vatNo, timestampISO, totalMinor, vatMinor, cur) {
    const fields = [seller, vatNo, timestampISO, fromMinor(totalMinor, cur).toFixed(digits(cur)), fromMinor(vatMinor, cur).toFixed(digits(cur))];
    const bytes = [];
    fields.forEach((f, i) => { const b = utf8(f); if (b.length > 255) throw new Error('TLV field too long'); bytes.push(i + 1, b.length, ...b); });
    let bin = ''; bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  }
  function parseTLV(b64) {
    const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    const out = []; let i = 0;
    while (i < bin.length) { const tag = bin.charCodeAt(i), len = bin.charCodeAt(i + 1); out.push({ tag, value: decodeURIComponent(escape(bin.slice(i + 2, i + 2 + len))) }); i += 2 + len; }
    return out;
  }
  /* Saudi VAT number: 15 digits, starts and ends with 3 */
  const validVatSA = (v) => /^3\d{13}3$/.test(String(v || ''));

  /* ---------- double-entry accounting ---------- */
  const ACCOUNTS = [
    { code: '1100', ar: 'النقدية', en: 'Cash', type: 'asset' },
    { code: '1110', ar: 'البنك', en: 'Bank', type: 'asset' },
    { code: '1200', ar: 'العملاء (ذمم مدينة)', en: 'Accounts receivable', type: 'asset' },
    { code: '1300', ar: 'ضريبة القيمة المضافة — مدخلات', en: 'VAT input', type: 'asset' },
    { code: '2100', ar: 'الموردون (ذمم دائنة)', en: 'Accounts payable', type: 'liability' },
    { code: '2200', ar: 'ضريبة القيمة المضافة — مخرجات', en: 'VAT output', type: 'liability' },
    { code: '2300', ar: 'دفعات مقدمة من العملاء', en: 'Customer deposits', type: 'liability' },
    { code: '3100', ar: 'رأس المال', en: 'Owner equity', type: 'equity' },
    { code: '3200', ar: 'الأرباح المبقاة', en: 'Retained earnings', type: 'equity' },
    { code: '4100', ar: 'المبيعات', en: 'Sales', type: 'revenue' },
    { code: '4200', ar: 'رسوم الشحن والخدمة', en: 'Shipping and fees', type: 'revenue' },
    { code: '4900', ar: 'مردودات وخصومات المبيعات', en: 'Sales returns', type: 'revenue' },
    { code: '5100', ar: 'تكلفة المبيعات', en: 'Cost of sales', type: 'expense' },
    { code: '5200', ar: 'رواتب وأجور', en: 'Salaries', type: 'expense' },
    { code: '5300', ar: 'إيجار', en: 'Rent', type: 'expense' },
    { code: '5400', ar: 'مرافق واتصالات', en: 'Utilities', type: 'expense' },
    { code: '5500', ar: 'تسويق وإعلان', en: 'Marketing', type: 'expense' },
    { code: '5600', ar: 'نقل ومواصلات', en: 'Transport', type: 'expense' },
    { code: '5700', ar: 'رسوم بنكية ودفع إلكتروني', en: 'Bank and card fees', type: 'expense' },
    { code: '5900', ar: 'مصروفات أخرى', en: 'Other expenses', type: 'expense' },
  ];
  const EXPENSE_CATEGORIES = { cogs: '5100', salaries: '5200', rent: '5300', utilities: '5400', marketing: '5500', transport: '5600', fees: '5700', other: '5900' };
  const cashAccount = (method) => (method === 'cash' ? '1100' : '1110');

  /* the books follow the documents: nothing is posted by hand except manual journals */
  function journal(state) {
    const out = [];
    const push = (date, ref, memo, lines, cur) => {
      const L = lines.filter((l) => l.dr || l.cr);
      if (L.length) out.push({ date, ref, memo, currency: cur, lines: L });
    };
    for (const d of state.docs || []) {
      if (d.void || d.type === 'estimate') continue;
      const t = totals(d), cur = t.currency;
      if (d.type === 'invoice') {
        const revenue = t.taxable - (d.taxMode === 'inclusive' ? 0 : 0);
        push(d.date, d.number, 'invoice', [
          { acc: '1200', dr: t.total },
          { acc: '4100', cr: revenue },
          { acc: '2200', cr: t.tax },
          { acc: '4200', cr: t.shipping + t.fee },
        ], cur);
        for (const p of d.payments || []) {
          const a = typeof p.amountMinor === 'number' ? p.amountMinor : toMinor(p.amount, cur);
          push(p.date || d.date, d.number, 'payment', [{ acc: cashAccount(p.method), dr: a }, { acc: '1200', cr: a }], cur);
        }
      } else if (d.type === 'receipt') {
        push(d.date, d.number, 'receipt', [
          { acc: cashAccount(d.method), dr: t.total }, { acc: '4100', cr: t.taxable }, { acc: '2200', cr: t.tax }, { acc: '4200', cr: t.shipping + t.fee },
        ], cur);
      } else if (d.type === 'credit') {
        push(d.date, d.number, 'credit', [{ acc: '4900', dr: t.taxable }, { acc: '2200', dr: t.tax }, { acc: '1200', cr: t.total }], cur);
      }
    }
    for (const e of state.expenses || []) {
      const cur = e.currency || 'SAR', amount = toMinor(e.amount, cur), vat = toMinor(e.vat || 0, cur);
      push(e.date, e.ref || 'EXP', 'expense', [
        { acc: EXPENSE_CATEGORIES[e.category] || '5900', dr: amount - vat }, { acc: '1300', dr: vat },
        { acc: e.unpaid ? '2100' : cashAccount(e.method), cr: amount },
      ], cur);
    }
    for (const j of state.journals || []) push(j.date, j.ref || 'JV', j.memo || 'manual', (j.lines || []).map((l) => ({ acc: l.acc, dr: toMinor(l.dr || 0, j.currency || 'SAR'), cr: toMinor(l.cr || 0, j.currency || 'SAR') })), j.currency || 'SAR');
    return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }
  function trialBalance(entries, cur, from, to) {
    const bal = {};
    for (const e of entries) {
      if (cur && e.currency !== cur) continue;
      if (from && e.date < from) continue; if (to && e.date > to) continue;
      for (const l of e.lines) { const b = bal[l.acc] || (bal[l.acc] = { dr: 0, cr: 0 }); b.dr += l.dr || 0; b.cr += l.cr || 0; }
    }
    const rows = ACCOUNTS.filter((a) => bal[a.code]).map((a) => ({ ...a, dr: bal[a.code].dr, cr: bal[a.code].cr, net: bal[a.code].dr - bal[a.code].cr }));
    const dr = rows.reduce((s, r) => s + r.dr, 0), cr = rows.reduce((s, r) => s + r.cr, 0);
    return { rows, dr, cr, balanced: dr === cr };
  }
  function statements(tb) {
    const sum = (type) => tb.rows.filter((r) => r.type === type).reduce((s, r) => s + r.net, 0);
    const revenue = -sum('revenue'), expenses = sum('expense'), profit = revenue - expenses;
    const assets = sum('asset'), liabilities = -sum('liability'), equity = -sum('equity') + profit;
    return { revenue, expenses, profit, assets, liabilities, equity, check: assets - liabilities - equity };
  }
  /* VAT return for a period: output on sales (net of credits), input on expenses */
  function vatReturn(state, from, to, cur) {
    let salesBase = 0, outputVat = 0, purchasesBase = 0, inputVat = 0, zeroRated = 0;
    for (const d of state.docs || []) {
      if (d.void || d.type === 'estimate' || (cur && (d.currency || 'SAR') !== cur)) continue;
      if (d.date < from || d.date > to) continue;
      const t = totals(d), sign = d.type === 'credit' ? -1 : 1;
      for (const tl of t.taxLines) { salesBase += sign * tl.base; outputVat += sign * tl.tax; }
      zeroRated += sign * (t.taxable - t.taxLines.reduce((s, x) => s + x.base, 0));
    }
    for (const e of state.expenses || []) {
      if ((cur && (e.currency || 'SAR') !== cur) || e.date < from || e.date > to) continue;
      const c = e.currency || 'SAR', vat = toMinor(e.vat || 0, c); purchasesBase += toMinor(e.amount, c) - vat; inputVat += vat;
    }
    return { from, to, salesBase, outputVat, zeroRated, purchasesBase, inputVat, net: outputVat - inputVat };
  }

  /* ---------- reports ---------- */
  function receivablesAging(docs, today) {
    const buckets = { current: 0, d30: 0, d60: 0, d90: 0, older: 0 }, rows = [];
    for (const d of docs) {
      if (d.type !== 'invoice' || d.void) continue;
      const t = totals(d); if (t.balance <= 0) continue;
      const late = d.dueDate ? daysBetween(d.dueDate, today) : 0;
      const k = late <= 0 ? 'current' : late <= 30 ? 'd30' : late <= 60 ? 'd60' : late <= 90 ? 'd90' : 'older';
      buckets[k] += t.balance; rows.push({ number: d.number, client: (d.client && d.client.name) || '', due: d.dueDate, late, balance: t.balance, bucket: k, currency: t.currency });
    }
    return { buckets, rows: rows.sort((a, b) => b.late - a.late) };
  }
  function salesBy(docs, key, from, to) {
    const map = new Map();
    for (const d of docs) {
      if (d.void || (d.type !== 'invoice' && d.type !== 'receipt') || (from && d.date < from) || (to && d.date > to)) continue;
      const t = totals(d);
      if (key === 'month') { const k = d.date.slice(0, 7); add(map, k, t.total, t.paid, 1); }
      else if (key === 'client') add(map, (d.client && d.client.name) || '—', t.total, t.paid, 1);
      else if (key === 'item') t.lines.forEach((l, i) => add(map, d.lines[i].name || '—', l.net, 0, Number(d.lines[i].qty || 0)));
    }
    return [...map.entries()].map(([k, v]) => ({ key: k, ...v }));
    function add(m, k, total, paid, count) { const v = m.get(k) || { total: 0, paid: 0, count: 0 }; v.total += total; v.paid += paid; v.count += count; m.set(k, v); }
  }
  function lastMonths(today, n) { const out = []; const d = new Date(today.slice(0, 7) + '-01T00:00:00Z'); for (let i = n - 1; i >= 0; i--) { const x = new Date(d); x.setUTCMonth(x.getUTCMonth() - i); out.push(x.toISOString().slice(0, 7)); } return out; }
  function dashboard(state, today, cur) {
    const docs = (state.docs || []).filter((d) => (d.currency || 'SAR') === cur);
    const months = lastMonths(today, 12), byMonth = Object.fromEntries(salesBy(docs, 'month').map((r) => [r.key, r.total]));
    const exp = {}; for (const e of state.expenses || []) if ((e.currency || 'SAR') === cur) { const k = e.date.slice(0, 7); exp[k] = (exp[k] || 0) + toMinor(e.amount, cur); }
    const aging = receivablesAging(docs, today);
    const ytd = today.slice(0, 4);
    const sales = docs.filter((d) => !d.void && (d.type === 'invoice' || d.type === 'receipt') && d.date.startsWith(ytd)).reduce((s, d) => s + totals(d).total, 0);
    const collected = docs.filter((d) => !d.void && d.type !== 'estimate').reduce((s, d) => s + (d.type === 'receipt' ? totals(d).total : (d.payments || []).filter((p) => (p.date || d.date).startsWith(ytd)).reduce((a, p) => a + toMinor(p.amount, cur), 0)), 0);
    const outstanding = Object.values(aging.buckets).reduce((a, b) => a + b, 0), overdue = outstanding - aging.buckets.current;
    const openEstimates = docs.filter((d) => d.type === 'estimate' && !d.void && !['accepted', 'declined', 'converted'].includes(d.estimateStatus || '')).length;
    return { months: months.map((m) => ({ month: m, sales: byMonth[m] || 0, expenses: exp[m] || 0 })), sales, collected, outstanding, overdue, openEstimates, aging };
  }

  /* ---------- audit procedures ---------- */
  /* first-digit (Benford) test: chi-square against log10(1+1/d); 8 degrees of freedom, 5% critical 15.51 */
  function benford(amounts) {
    const counts = Array(10).fill(0); let n = 0;
    for (const a of amounts) { const s = String(Math.abs(Math.trunc(a))).replace(/^0+/, ''); if (!s) continue; counts[+s[0]]++; n++; }
    const rows = []; let chi = 0;
    for (let d = 1; d <= 9; d++) { const exp = n * Math.log10(1 + 1 / d); rows.push({ digit: d, observed: counts[d], expected: exp }); if (exp > 0) chi += Math.pow(counts[d] - exp, 2) / exp; }
    return { n, rows, chi, critical: 15.51, conforms: n < 50 ? null : chi <= 15.51 };
  }
  function numberingGaps(docs, type, prefix) {
    const p = (prefix || PREFIX[type]) + '-', seen = new Map(), nums = [];
    for (const d of docs) if (d.type === type && typeof d.number === 'string' && d.number.startsWith(p)) {
      const n = parseInt(d.number.slice(p.length), 10); if (!Number.isFinite(n)) continue;
      seen.set(n, (seen.get(n) || 0) + 1); nums.push(n);
    }
    nums.sort((a, b) => a - b); const gaps = [], dups = [...seen.entries()].filter(([, c]) => c > 1).map(([n]) => formatNumber(type, n, prefix));
    for (let i = 1; i < nums.length; i++) for (let k = nums[i - 1] + 1; k < nums[i] && gaps.length < 200; k++) gaps.push(formatNumber(type, k, prefix));
    return { gaps, duplicates: dups };
  }
  /* materiality from a benchmark (ISA 320 practice ranges) */
  function materiality(base, benchmark) {
    const pct = { revenue: [0.5, 1], profit: [5, 10], assets: [1, 2], expenses: [0.5, 1] }[benchmark] || [1, 2];
    const overall = rdiv(Math.abs(base) * Math.round(pct[0] * 100), 10000);
    return { benchmark, pctLow: pct[0], pctHigh: pct[1], overall, performance: rdiv(overall * 75, 100), trivial: rdiv(overall * 5, 100) };
  }
  /* monetary-unit sampling: systematic selection with a seeded start, so the same seed gives the same sample */
  function musSample(items, n, seed) {
    const total = items.reduce((s, x) => s + Math.abs(x.amount), 0); if (!total || !n) return [];
    const interval = total / n; let r = (Math.abs(seed || 1) * 9301 + 49297) % 233280 / 233280;
    const picks = []; let cum = 0, next = r * interval, i = 0;
    for (const it of items) { cum += Math.abs(it.amount); while (next < cum && picks.length < n) { if (!picks.includes(it)) picks.push(it); next += interval; } i++; }
    return picks;
  }
  function auditChecks(state, today) {
    const docs = state.docs || [], findings = [];
    for (const type of ['invoice', 'receipt', 'credit']) {
      const g = numberingGaps(docs, type);
      if (g.duplicates.length) findings.push({ sev: 'high', code: 'dup', type, items: g.duplicates });
      if (g.gaps.length) findings.push({ sev: 'medium', code: 'gap', type, items: g.gaps.slice(0, 20), count: g.gaps.length });
    }
    const entries = journal(state);
    const unbalanced = entries.filter((e) => e.lines.reduce((s, l) => s + (l.dr || 0) - (l.cr || 0), 0) !== 0);
    if (unbalanced.length) findings.push({ sev: 'high', code: 'unbalanced', items: unbalanced.map((e) => e.ref) });
    const noClient = docs.filter((d) => d.type === 'invoice' && !d.void && !(d.client && d.client.name)).map((d) => d.number);
    if (noClient.length) findings.push({ sev: 'medium', code: 'noclient', items: noClient });
    const amounts = docs.filter((d) => !d.void && d.type === 'invoice').map((d) => totals(d).total);
    const round = docs.filter((d) => !d.void && d.type === 'invoice' && totals(d).total >= 100000 && totals(d).total % 100000 === 0).map((d) => d.number);
    if (round.length) findings.push({ sev: 'low', code: 'round', items: round });
    const weekend = docs.filter((d) => !d.void && d.type === 'invoice' && new Date(d.date + 'T00:00:00Z').getUTCDay() === 5).map((d) => d.number);
    if (weekend.length) findings.push({ sev: 'low', code: 'friday', items: weekend });
    const future = docs.filter((d) => !d.void && d.date > today).map((d) => d.number);
    if (future.length) findings.push({ sev: 'medium', code: 'future', items: future });
    if (amounts.length > 1) {
      const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length, sd = Math.sqrt(amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length);
      const outl = docs.filter((d) => !d.void && d.type === 'invoice' && sd > 0 && (totals(d).total - mean) / sd > 3).map((d) => d.number);
      if (outl.length) findings.push({ sev: 'medium', code: 'outlier', items: outl });
    }
    return { findings, benford: benford(amounts), entries: entries.length };
  }

  /* ---------- CSV ---------- */
  function csvCell(v) { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  const toCSV = (rows) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false; text = String(text).replace(/^﻿/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }
  /* rows with a header → objects, mapping Arabic or English header names to fields */
  function rowsToRecords(rows, fieldMap) {
    if (!rows.length) return [];
    const head = rows[0].map((h) => String(h).trim().toLowerCase());
    const idx = {}; for (const [field, names] of Object.entries(fieldMap)) { const i = head.findIndex((h) => names.includes(h)); if (i >= 0) idx[field] = i; }
    return rows.slice(1).map((r) => Object.fromEntries(Object.entries(idx).map(([f, i]) => [f, (r[i] || '').trim()]))).filter((o) => Object.values(o).some(Boolean));
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  return {
    CURRENCIES, DOC_TYPES, PREFIX, ACCOUNTS, EXPENSE_CATEGORIES,
    digits, toMinor, fromMinor, formatMoney, rdiv, bp,
    formatNumber, nextNumber, lineAmounts, totals, status, estimateToInvoice,
    iso, addDays, daysBetween, nextOccurrence, dueOccurrences,
    zatcaTLV, parseTLV, validVatSA,
    journal, trialBalance, statements, vatReturn,
    receivablesAging, salesBy, lastMonths, dashboard,
    benford, numberingGaps, materiality, musSample, auditChecks,
    csvCell, toCSV, parseCSV, rowsToRecords, uid,
  };
});
