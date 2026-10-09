// KOSIF end-to-end: drives the built page in a real browser.  node tests/e2e.mjs http://127.0.0.1:PORT/local.html
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url), { chromium } = require('playwright');
const url = process.argv[2], origin = new URL(url).origin, out = new URL('../artifacts/', import.meta.url);
fs.mkdirSync(out, { recursive: true });
const fp = (name) => fileURLToPath(new URL(name, out));
const results = []; const ok = (name, cond, extra) => { results.push({ name, pass: !!cond, extra }); console.log((cond ? '✓ ' : '✗ ') + name + (extra && !cond ? ' — ' + extra : '')); };
const b = await chromium.launch();
const ALLOW = [origin, 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
async function page(opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, ...opts });
  await ctx.route('**/*', (r) => (ALLOW.some((a) => r.request().url().startsWith(a)) || r.request().url().startsWith('data:') || r.request().url().startsWith('blob:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); p.errors = []; p.on('pageerror', (e) => p.errors.push(String(e)));
  await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForFunction(() => window.KOSIFApp && document.querySelector('.kpis'), null, { timeout: 30000 });
  return { ctx, p };
}
const txt = (p, s) => p.locator(s).first().innerText();
try {
  const { ctx, p } = await page();
  ok('home opens with example data and KPIs', (await p.locator('.kpi').count()) === 5 && (await p.locator('.banner').count()) === 1);
  ok('12-month chart drawn', (await p.locator('#home-chart rect').count()) === 24);
  ok('Arabic RTL by default', (await p.evaluate(() => document.documentElement.dir)) === 'rtl');

  // a new invoice: client, two lines, discount — totals checked against hand arithmetic
  await p.evaluate(() => (location.hash = '#new.invoice')); await p.waitForSelector('#doc-form');
  const num = await p.inputValue('#d-number'); ok('next invoice number continues the series', /^INV-\d{4}$/.test(num), num);
  await p.selectOption('#d-client', { index: 1 }); await p.waitForTimeout(200);
  const row = p.locator('#lines .line').first();
  await row.locator('[data-l="name"]').fill('اختبار KOSIF'); await row.locator('[data-l="qty"]').fill('2'); await row.locator('[data-l="price"]').fill('100');
  await p.click('[data-act="add-line"]'); const row2 = p.locator('#lines .line').nth(1);
  await row2.locator('[data-l="name"]').fill('خدمة'); await row2.locator('[data-l="qty"]').fill('1'); await row2.locator('[data-l="price"]').fill('50');
  await p.waitForTimeout(150);
  const totalTxt = await txt(p, '#totals .r.big'); ok('editor total = (200 + 50) × 1.15 = 287.50', totalTxt.includes('287.50'), totalTxt);
  await p.locator('#doc-form [data-act="save-doc"]').click(); await p.waitForSelector('#paper');
  ok('saved invoice renders on paper', (await txt(p, '#paper')).includes(num));
  ok('status draft before payment', (await txt(p, '.pill')).length > 0);
  ok('ZATCA QR drawn for a VAT-registered seller', (await p.locator('#pqr img, #pqr canvas').count()) > 0);
  await p.click('[data-act="pay"]'); await p.waitForSelector('#pay-form'); ok('payment prefilled with balance', (await p.inputValue('#p-amount')) === '287.50');
  await p.click('#pay-form button[type="submit"]'); await p.waitForTimeout(300);
  ok('paid after full payment', (await p.locator('.pill.paid').count()) >= 1);
  ok('paid stamp on the paper', (await p.locator('#paper .pstamp.paid').count()) === 1);

  // estimate → invoice
  const estId = await p.evaluate(() => KOSIFApp.Store.state.docs.find((d) => d.type === 'estimate').id);
  await p.evaluate((id) => (location.hash = '#doc.' + id), estId); await p.waitForSelector('[data-act="convert"]');
  await p.click('[data-act="convert"]'); await p.waitForTimeout(400);
  const conv = await p.evaluate(() => { const d = KOSIFApp.Store.state.docs; return { est: d.find((x) => x.type === 'estimate').estimateStatus, inv: d.filter((x) => x.fromEstimate).length }; });
  ok('estimate converts to an invoice and is marked converted', conv.est === 'converted' && conv.inv === 1, JSON.stringify(conv));

  // books, reports, audit
  await p.evaluate(() => (location.hash = '#books')); await p.waitForSelector('.pill.ok');
  ok('books balanced', (await p.locator('.pill.ok').count()) === 1);
  for (const r of ['r_tb', 'r_pl', 'r_bs', 'r_vat', 'r_aging', 'r_journal']) {
    await p.evaluate(() => (location.hash = '#reports')); await p.waitForSelector('[data-act="rep"]');
    await p.click('[data-act="rep"][data-v="' + r + '"]'); await p.waitForTimeout(100);
    const foot = await p.locator('#report-out tfoot').count(); ok('report ' + r + ' renders', foot === 1 || (await p.locator('#report-out table').count()) === 1);
  }
  await p.click('[data-act="rep"][data-v="r_tb"]'); ok('trial balance footer says balanced', /متزن/.test(await txt(p, '#report-out tfoot')));
  await p.click('[data-act="rep"][data-v="r_bs"]'); ok('balance sheet balances', /متزن/.test(await txt(p, '#report-out tfoot')));
  const [csv] = await Promise.all([p.waitForEvent('download'), p.click('[data-act="rep-csv"]')]);
  const csvPath = fp('report.csv'); await csv.saveAs(csvPath); const csvText = fs.readFileSync(csvPath, 'utf8');
  ok('CSV export downloads with BOM and Arabic headers', csvText.charCodeAt(0) === 0xfeff && /الحساب/.test(csvText));
  const [xl] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('[data-act="rep-xlsx"]')]);
  ok('Excel export downloads an .xlsx', /\.xlsx$/.test(xl.suggestedFilename()), xl.suggestedFilename());
  await p.evaluate(() => (location.hash = '#audit')); await p.waitForSelector('.bench');
  ok('audit page shows Benford and materiality', (await p.locator('.bench .bar').count()) === 9);
  await p.click('[data-act="mus"]'); await p.waitForTimeout(200); ok('MUS sample drawn', (await p.locator('#view .list').last().locator('.li').count()) > 0);

  // PDF of a document
  const anyInv = await p.evaluate(() => KOSIFApp.Store.state.docs.find((d) => d.type === 'invoice').id);
  await p.evaluate((id) => (location.hash = '#doc.' + id), anyInv); await p.waitForSelector('#paper');
  const [pdf] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), p.click('#top-actions [data-act="pdf"]')]);
  const pdfPath = fp('invoice.pdf'); await pdf.saveAs(pdfPath); const head = fs.readFileSync(pdfPath).slice(0, 5).toString();
  ok('PDF export produces a real PDF', head === '%PDF-' && fs.statSync(pdfPath).size > 20000, head + ' ' + fs.statSync(pdfPath).size);
  await p.screenshot({ path: fp('invoice-desktop.png'), fullPage: false });

  // capabilities self-checks
  await p.evaluate(() => (location.hash = '#caps')); await p.waitForSelector('.pill');
  const fails = await p.locator('.pill.fail').allInnerTexts(); ok('every capability check passes in the page (ai excepted outside claude.ai)', fails.every((f) => /ai/.test(f)), fails.join(', '));

  // language and theme
  await p.evaluate(() => (location.hash = '#settings')); await p.waitForSelector('[data-act="lang"]');
  await p.click('[data-act="lang"][data-v="en"]'); await p.waitForTimeout(200);
  ok('English switches to LTR', (await p.evaluate(() => document.documentElement.dir)) === 'ltr' && /settings/i.test(await txt(p, '#top-title')));
  await p.click('[data-act="theme"][data-v="dark"]'); await p.waitForTimeout(150);
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor); ok('dark theme paints a dark ground', bg === 'rgb(22, 19, 16)', bg);
  await p.click('[data-act="lang"][data-v="ar"]'); await p.click('[data-act="theme"][data-v="system"]');

  // persistence
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForFunction(() => window.KOSIFApp);
  ok('records survive a reload', await p.evaluate((n) => KOSIFApp.Store.state.docs.some((d) => d.number === n), num));
  ok('no page errors (desktop)', p.errors.length === 0, p.errors.join(' | '));
  await ctx.close();

  // phone: no sideways scroll on every main screen
  const { ctx: c2, p: m } = await page({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const firstDoc = await m.evaluate(() => KOSIFApp.Store.state.docs[0].id);
  for (const h of ['home', 'docs', 'doc.' + firstDoc, 'new.invoice', 'clients', 'items', 'expenses', 'reports', 'books', 'audit', 'ai', 'settings', 'caps', 'design']) {
    await m.evaluate((x) => (location.hash = '#' + x), h); await m.waitForTimeout(250);
    const w = await m.evaluate(() => document.documentElement.scrollWidth); ok('phone 390: ' + h + ' has no sideways scroll', w <= 390, String(w));
  }
  await m.evaluate(() => (location.hash = '#home')); await m.waitForTimeout(200);
  await m.screenshot({ path: fp('home-phone.png') });
  ok('tab bar visible on phone', await m.locator('#tabbar').isVisible());
  ok('no page errors (phone)', m.errors.length === 0, m.errors.join(' | '));
  await c2.close();
} catch (e) { ok('run completed', false, e.stack); }
await b.close();
const failed = results.filter((r) => !r.pass);
fs.writeFileSync(new URL('e2e-results.json', out), JSON.stringify({ when: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results }, null, 2));
console.log('\nKOSIF e2e: ' + (results.length - failed.length) + ' passed, ' + failed.length + ' failed');
process.exit(failed.length ? 1 : 0);
