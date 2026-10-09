// Build: dist/ holds exactly what is published (index.html is the page body; the Artifact tool adds the skeleton),
// and dist/local.html wraps the same page in the skeleton for local browser tests.
import fs from 'node:fs';
const root = new URL('../', import.meta.url), src = new URL('src/', root), dist = new URL('dist/', root);
fs.mkdirSync(dist, { recursive: true });
for (const f of ['index.html', 'kosif.css', 'kosif-core.js', 'kosif-i18n.js', 'kosif-data.js', 'kosif-app.js']) fs.copyFileSync(new URL(f, src), new URL(f, dist));
const page = fs.readFileSync(new URL('index.html', src), 'utf8');
const skeleton = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui;background:#fbfbfa}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
fs.writeFileSync(new URL('local.html', dist), skeleton + page + '</body></html>');
const size = ['index.html', 'kosif.css', 'kosif-core.js', 'kosif-i18n.js', 'kosif-data.js', 'kosif-app.js'].reduce((s, f) => s + fs.statSync(new URL(f, dist)).size, 0);
console.log('built dist/ —', (size / 1024).toFixed(1), 'KB');
