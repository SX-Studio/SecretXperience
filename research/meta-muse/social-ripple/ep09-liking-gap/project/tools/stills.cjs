// a still per shot (just after the cut and late in the shot). Usage: node tools/stills.cjs [from-shot-index] [to]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  const shots = await p.evaluate(() => window.__EP.Dr.shots.map((s) => [s.t, s.t1, s.tag || '']));
  const a = +(process.argv[2] || 0), z = +(process.argv[3] || shots.length); fs.mkdirSync('tools/ss', { recursive: true });
  for (let i = a; i < z; i++) { const [t0, t1, tag] = shots[i]; let k = 0;
    for (const t of [Math.min(t0 + 0.45, (t0 + t1) / 2), Math.max(t0 + 0.5, t1 - 0.35)]) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t);
      await p.screenshot({ path: `tools/ss/${String(i).padStart(2, '0')}${'ab'[k++]}_${t.toFixed(2)}_${tag.replace(/[^A-Za-z0-9]+/g, '-')}.png`, timeout: 60000 }); } process.stdout.write(i + ' '); }
  console.log('done'); await b.close(); })();
