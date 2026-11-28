const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  for (const t of process.argv.slice(2).map(Number)) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t); const a = Date.now(); await p.screenshot({ path: `tools/one_${t}.png`, timeout: 60000 }); console.log(t, Date.now() - a, 'ms'); }
  await b.close(); })();
