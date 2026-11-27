const { chromium } = require('playwright'); const path = require('path');
(async () => { const [page, w, h, ...names] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  for (const n of names) { await p.goto('file://' + path.resolve(page) + '?n=' + n); await p.waitForFunction(() => window.READY, null, { timeout: 30000 }); await p.waitForTimeout(400); await p.screenshot({ path: `out_${n}.png` }); }
  await b.close(); })();
