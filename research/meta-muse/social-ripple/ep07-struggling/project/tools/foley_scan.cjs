const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.addInitScript(() => { window.__WANT_FOLEY = true; });
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  const out = await p.evaluate(() => JSON.stringify({ steps: window.__FOLEY, shots: window.__EP7.SH.map((s) => [s[0], s[1]]) }));
  fs.writeFileSync('foley.json', out); const o = JSON.parse(out); console.log('steps', o.steps.length, 'shots', o.shots.length); await b.close(); })();
