const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  for (const f of process.argv.slice(2)) { await p.goto('file://' + path.resolve(f)); await p.waitForTimeout(2500); await p.evaluate(async () => { await document.fonts.ready; }); await p.screenshot({ path: f.replace('.html', '.png') }); console.log('ok', f); }
  await b.close(); })();
