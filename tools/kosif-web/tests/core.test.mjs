// KOSIF core — every expected value below is computed by hand, not by the code under test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const K = createRequire(import.meta.url)('../src/kosif-core.js');

const inv = (over) => ({ type: 'invoice', number: 'INV-0001', date: '2026-10-01', dueDate: '2026-10-15', currency: 'SAR', taxMode: 'exclusive', lines: [], payments: [], ...over });

test('money: typed amounts in Arabic or Latin digits become integer minor units', () => {
  assert.equal(K.toMinor('1,250.50', 'SAR'), 125050);
  assert.equal(K.toMinor('١٬٢٥٠٫٥', 'SAR'), 125050);
  assert.equal(K.toMinor('12.345', 'KWD'), 12345);
  assert.equal(K.toMinor('abc', 'SAR'), 0);
  assert.equal(K.formatMoney(125050, 'SAR', 'en'), '1,250.50 SAR');
  assert.equal(K.formatMoney(125050, 'USD', 'en'), '$1,250.50');
  assert.match(K.formatMoney(125050, 'SAR', 'ar'), /1,250\.50 ر\.س/);
});

test('totals: exclusive VAT 15% with a line discount, a document discount and shipping', () => {
  // 3 × 100.00 = 300.00, line discount 10% = 30.00 → 270.00; 1 × 50.00 = 50.00 → subtotal 320.00
  // document discount 20.00 → 300.00 taxable; VAT 45.00; shipping 10.00 → total 355.00
  const t = K.totals(inv({ lines: [{ name: 'A', qty: 3, price: '100', discount: { type: 'pct', value: 10 } }, { name: 'B', qty: 1, price: '50' }], discount: { type: 'amount', value: '20' }, shipping: '10' }));
  assert.equal(t.subtotal, 32000); assert.equal(t.lineDiscount, 3000); assert.equal(t.discount, 2000);
  assert.equal(t.taxable, 30000); assert.equal(t.tax, 4500); assert.equal(t.total, 35500); assert.equal(t.balance, 35500);
});

test('totals: inclusive prices extract VAT (115.00 → 100.00 + 15.00)', () => {
  const t = K.totals(inv({ taxMode: 'inclusive', lines: [{ name: 'A', qty: 1, price: '115' }] }));
  assert.equal(t.taxable, 10000); assert.equal(t.tax, 1500); assert.equal(t.total, 11500);
});

test('totals: mixed rates and a zero-rated line keep separate tax lines', () => {
  const t = K.totals(inv({ lines: [{ name: 'A', qty: 2, price: '100' }, { name: 'B', qty: 1, price: '100', taxRateBp: 500 }, { name: 'C', qty: 1, price: '40', taxable: false }] }));
  assert.deepEqual(t.taxLines.map((x) => [x.rateBp, x.base, x.tax]), [[500, 10000, 500], [1500, 20000, 3000]]);
  assert.equal(t.tax, 3500); assert.equal(t.total, 34000 + 3500);
});

test('totals: card fee, deposit and partial payment', () => {
  // 100.00 + 15% = 115.00; 3% card fee = 3.45 → 118.45; deposit 50% = 59.23 (half of 118.45 rounded); paid 40.00
  const t = K.totals(inv({ lines: [{ name: 'A', qty: 1, price: '100' }], cardFeePct: 3, deposit: { type: 'pct', value: 50 }, payments: [{ amount: '40', date: '2026-10-02' }] }));
  assert.equal(t.fee, 345); assert.equal(t.total, 11845); assert.equal(t.deposit, 5923); assert.equal(t.paid, 4000); assert.equal(t.balance, 7845);
});

test('fractional quantities and 3-decimal currencies round half away from zero', () => {
  const t = K.totals(inv({ currency: 'KWD', lines: [{ name: 'A', qty: 1.5, price: '2.335' }] }));
  // 1.5 × 2.335 = 3.5025 → 3.503 (3503 fils); VAT 15% = 525.45 → 525
  assert.equal(t.subtotal, 3503); assert.equal(t.tax, 525);
});

test('status follows payments and the due date', () => {
  const base = inv({ lines: [{ name: 'A', qty: 1, price: '100' }] });
  assert.equal(K.status(base, '2026-10-05'), 'draft');
  assert.equal(K.status({ ...base, sent: true }, '2026-10-05'), 'sent');
  assert.equal(K.status({ ...base, sent: true }, '2026-10-20'), 'overdue');
  assert.equal(K.status({ ...base, payments: [{ amount: '50' }] }, '2026-10-05'), 'partial');
  assert.equal(K.status({ ...base, payments: [{ amount: '115' }] }, '2026-10-20'), 'paid');
  assert.equal(K.status({ ...base, void: true }, '2026-10-20'), 'void');
});

test('numbering continues past the highest number; an estimate converts to the next invoice', () => {
  const docs = [inv({ number: 'INV-0001' }), inv({ number: 'INV-0007' }), { type: 'estimate', number: 'EST-0002' }];
  assert.equal(K.nextNumber(docs, 'invoice'), 'INV-0008');
  assert.equal(K.nextNumber(docs, 'estimate'), 'EST-0003');
  const est = { type: 'estimate', number: 'EST-0002', currency: 'SAR', lines: [{ name: 'A', qty: 1, price: '10' }], estimateStatus: 'accepted', client: { name: 'X' } };
  const i = K.estimateToInvoice(est, docs, '2026-10-09', 30);
  assert.equal(i.type, 'invoice'); assert.equal(i.number, 'INV-0008'); assert.equal(i.dueDate, '2026-11-08'); assert.equal(i.fromEstimate, 'EST-0002'); assert.equal(i.client.name, 'X');
});

test('recurring schedule: monthly from Jan 31 clamps through month ends', () => {
  assert.equal(K.nextOccurrence('2026-01-15', 'monthly'), '2026-02-15');
  assert.equal(K.nextOccurrence('2026-01-15', 'weekly'), '2026-01-22');
  const r = K.dueOccurrences({ next: '2026-07-01', freq: 'monthly' }, '2026-10-09');
  assert.deepEqual(r.dates, ['2026-07-01', '2026-08-01', '2026-09-01', '2026-10-01']); assert.equal(r.next, '2026-11-01');
});

test('ZATCA QR: TLV round-trips Arabic seller names and fixed decimals', () => {
  const b64 = K.zatcaTLV('شركة الوادي', '310122393500003', '2026-10-09T10:00:00Z', 11500, 1500, 'SAR');
  assert.deepEqual(K.parseTLV(b64).map((x) => x.value), ['شركة الوادي', '310122393500003', '2026-10-09T10:00:00Z', '115.00', '15.00']);
  assert.equal(K.parseTLV(b64)[0].tag, 1);
  assert.equal(K.validVatSA('310122393500003'), true); assert.equal(K.validVatSA('123'), false);
});

const state = () => ({
  docs: [
    inv({ number: 'INV-0001', lines: [{ name: 'A', qty: 2, price: '100' }], payments: [{ amount: '115', date: '2026-10-05', method: 'cash' }] }),
    inv({ number: 'INV-0002', date: '2026-09-01', dueDate: '2026-09-10', lines: [{ name: 'B', qty: 1, price: '1000' }] }),
    { type: 'receipt', number: 'RCT-0001', date: '2026-10-03', currency: 'SAR', taxMode: 'inclusive', method: 'card', lines: [{ name: 'C', qty: 1, price: '230' }] },
    { type: 'estimate', number: 'EST-0001', date: '2026-10-03', currency: 'SAR', lines: [{ name: 'D', qty: 1, price: '999' }] },
  ],
  expenses: [{ date: '2026-10-04', category: 'rent', amount: '1150', vat: '150', method: 'bank' }],
});

test('the books balance and the statements tie out', () => {
  const tb = K.trialBalance(K.journal(state()), 'SAR');
  assert.equal(tb.balanced, true);
  const s = K.statements(tb);
  // sales 200 + 1000 + 200 (receipt net) = 1400.00; expenses 1000.00 → profit 400.00
  assert.equal(s.revenue, 140000); assert.equal(s.expenses, 100000); assert.equal(s.profit, 40000); assert.equal(s.check, 0);
  const ar = tb.rows.find((r) => r.code === '1200');
  assert.equal(ar.net, 23000 + 115000 - 11500); // INV-1 230.00 + INV-2 1150.00 − paid 115.00
});

test('VAT return: output on sales, input on expenses, net payable', () => {
  const v = K.vatReturn(state(), '2026-09-01', '2026-10-31', 'SAR');
  assert.equal(v.outputVat, 3000 + 15000 + 3000); assert.equal(v.inputVat, 15000); assert.equal(v.net, 6000);
});

test('aging puts an unpaid September invoice 29 days late into 1–30', () => {
  const a = K.receivablesAging(state().docs, '2026-10-09');
  assert.equal(a.buckets.d30, 115000); assert.equal(a.buckets.current, 11500); assert.equal(a.rows[0].number, 'INV-0002');
});

test('audit: numbering gaps and duplicates, Benford, materiality, MUS sample', () => {
  const g = K.numberingGaps([inv({ number: 'INV-0001' }), inv({ number: 'INV-0004' }), inv({ number: 'INV-0004' })], 'invoice');
  assert.deepEqual(g.gaps, ['INV-0002', 'INV-0003']); assert.deepEqual(g.duplicates, ['INV-0004']);
  const b = K.benford([123, 145, 178, 210, 290, 315]);
  assert.equal(b.n, 6); assert.equal(b.rows[0].observed, 3); assert.equal(b.conforms, null);
  const m = K.materiality(10000000, 'revenue'); // 0.5% of 100,000.00 = 500.00
  assert.equal(m.overall, 50000); assert.equal(m.performance, 37500); assert.equal(m.trivial, 2500);
  const items = Array.from({ length: 20 }, (_, i) => ({ id: i, amount: (i + 1) * 100 }));
  const s1 = K.musSample(items, 5, 7), s2 = K.musSample(items, 5, 7);
  assert.equal(s1.length, 5); assert.deepEqual(s1.map((x) => x.id), s2.map((x) => x.id));
  const checks = K.auditChecks({ docs: [inv({ number: 'INV-0001', client: { name: 'a' } }), inv({ number: 'INV-0003', client: null })] }, '2026-10-09');
  assert.ok(checks.findings.some((f) => f.code === 'gap')); assert.ok(checks.findings.some((f) => f.code === 'noclient'));
});

test('CSV: formulas are neutralised, quotes and Arabic round-trip', () => {
  const csv = K.toCSV([['الاسم', 'note'], ['شركة "النور"', '=1+1']]);
  const rows = K.parseCSV(csv);
  assert.deepEqual(rows, [['الاسم', 'note'], ['شركة "النور"', "'=1+1"]]);
  const recs = K.rowsToRecords([['Name', 'البريد'], ['Ali', 'a@x.co']], { name: ['name', 'الاسم'], email: ['email', 'البريد'] });
  assert.deepEqual(recs, [{ name: 'Ali', email: 'a@x.co' }]);
});
