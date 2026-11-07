const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  let ts = process.argv.slice(2).map(Number);
  if (!ts.length) ts = await p.evaluate(() => { const S = window.__EP7.SH, D = window.DUR; return S.map((s, i) => +(((s[0] + (i + 1 < S.length ? S[i + 1][0] : D)) / 2).toFixed(2))); });
  fs.mkdirSync('tools/ss', { recursive: true }); for (const f of fs.readdirSync('tools/ss')) fs.unlinkSync('tools/ss/' + f);
  let n = 0; for (const t of ts) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t); await p.screenshot({ path: `tools/ss/${String(n++).padStart(3, '0')}_${t}.png` }); }
  console.log(ts.join(' ')); await b.close(); })();
