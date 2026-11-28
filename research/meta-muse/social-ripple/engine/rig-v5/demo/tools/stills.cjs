const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto("file://" + path.resolve("index.html"), { waitUntil: "domcontentloaded" }); await p.waitForTimeout(2500);
  const ts = process.argv.slice(2).map(Number);
  for (const t of ts) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t); await p.screenshot({ path: `tools/st_${t.toFixed(1)}.png` }); }
  await b.close(); })();
