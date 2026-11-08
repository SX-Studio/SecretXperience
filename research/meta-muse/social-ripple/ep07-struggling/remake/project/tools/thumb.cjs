const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  for (const v of ['A', 'B']) { await p.goto('file://' + path.resolve('thumb/thumb.html') + '?v=' + v); await p.waitForTimeout(2500); await p.screenshot({ path: `thumb/thumb-${v}.png` }); }
  await b.close(); })();
