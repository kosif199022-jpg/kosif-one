// Writes docs/01–03 from src/kosif-data.js (the same data the in-app Capabilities screen shows) and the test evidence.
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url), read = (p) => fs.readFileSync(new URL(p, root), 'utf8');
const ctx = { self: {}, console }; ctx.self = ctx; vm.createContext(ctx);
for (const f of ['src/kosif-core.js', 'src/kosif-i18n.js', 'src/kosif-data.js']) vm.runInContext(read(f).replace('typeof self !== \'undefined\' ? self : this', 'self'), ctx);
const { REFERENCE_FEATURES, CAPABILITIES } = ctx.KOSIFData;
const label = { integrated: 'Integrated — works in the app, tested', bridged: 'Bridged — through the assistant, export or a link', external: 'Stays in KOSIF Omni / desktop', unavailable: 'Not available on web (reason given)' };
fs.mkdirSync(new URL('docs/', root), { recursive: true });

let md = '# 1. Reference app feature inventory — Invoice Simple\n\nSource: the App Store listing (id694831622), read 2026-10-09. The website invoicesimple.com refused automated reading (HTTP 403), so only features stated in the listing or in its user reviews are counted.\n\n| # | Feature | Where it lives in KOSIF | Status |\n|---|---|---|---|\n';
REFERENCE_FEATURES.forEach(([f, w, s], i) => (md += `| ${i + 1} | ${f} | ${w} | ${s} |\n`));
const rc = REFERENCE_FEATURES.reduce((o, [, , s]) => ((o[s] = (o[s] || 0) + 1), o), {});
md += `\n**Totals:** ${REFERENCE_FEATURES.length} features — ${rc.integrated || 0} integrated, ${rc.bridged || 0} bridged, ${rc.unavailable || 0} not reproducible in a web app without a server.\n`;
fs.writeFileSync(new URL('docs/01-reference-feature-inventory.md', root), md);

md = '# 2. Inventory of existing KOSIF capabilities\n\nFound on 2026-10-09 in: the `الاداة` folder (KOSIF Omni plugin and its 49 skills, KOSIF Think, KOSIF Atlas, 100 Super Skills, KOSIF Studio, KOSIF Motion, Higgsfield, WhatsApp bridge, Qawaem filing, research bundle), the SQC app (`s-kosif-dev`, elkosif0-cmd/cloude) and the memory index.\n\n| Family | Capability | Source |\n|---|---|---|\n';
for (const c of CAPABILITIES) md += `| ${c.fam} | ${c.en} — ${c.ar} | ${c.src} |\n`;
fs.writeFileSync(new URL('docs/02-kosif-capability-inventory.md', root), md);

md = '# 3. Capability-by-capability migration matrix\n\nEvery row is also on the in-app **Capabilities** screen, where the `check` column runs live against the page.\n\n| Capability | Source | Status | Live check | Note |\n|---|---|---|---|---|\n';
for (const c of CAPABILITIES) md += `| ${c.en} | ${c.src} | ${label[c.status]} | ${c.check || '—'} | ${c.note || ''} |\n`;
const cc = CAPABILITIES.reduce((o, c) => ((o[c.status] = (o[c.status] || 0) + 1), o), {});
md += `\n**Totals:** ${CAPABILITIES.length} capabilities — ${cc.integrated || 0} integrated, ${cc.bridged || 0} bridged, ${cc.external || 0} stay in KOSIF Omni, ${cc.unavailable || 0} not available on web.\n\nNothing was removed from the original tools: capabilities marked "stays in KOSIF Omni" keep working where they are; this web app does not replace them.\n`;
fs.writeFileSync(new URL('docs/03-migration-matrix.md', root), md);
console.log('docs written:', REFERENCE_FEATURES.length, 'reference features,', CAPABILITIES.length, 'capabilities');
