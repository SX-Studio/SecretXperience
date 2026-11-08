const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.addInitScript(() => { window.__QA = []; });
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  const D = await p.evaluate(() => window.DUR); const ts = process.argv.slice(2).map(Number); const list = ts.length ? ts : Array.from({ length: Math.floor(D / 0.5) }, (_, i) => +(i * 0.5).toFixed(2));
  fs.mkdirSync('tools/ss', { recursive: true }); for (const f of fs.readdirSync('tools/ss')) fs.unlinkSync('tools/ss/' + f);
  let n = 0; for (const t of list) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t); await p.screenshot({ path: `tools/ss/${String(n++).padStart(3, '0')}_${t.toFixed(1)}.png` }); }
  const qa = await p.evaluate(() => window.__QA); console.log('QA issues:', JSON.stringify([...new Set(qa)].slice(0, 20))); console.log('frames', n, 'dur', D); await b.close(); })();
