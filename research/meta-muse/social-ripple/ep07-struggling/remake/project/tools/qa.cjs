// QA sweep (every 0.25 s) + a still per shot (start+0.45 s and middle). Usage: node tools/qa.cjs [noshots]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.addInitScript(() => { window.__QA = []; });
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  const D = await p.evaluate(() => window.DUR);
  const qa = await p.evaluate((D) => { for (let t = 0; t < D; t += 0.25) window.__timelines.main.seek(t, false); return window.__QA; }, D);
  const by = {}; for (const m of qa) { const [t, ...rest] = m.split(' '); const k = rest.join(' ').replace(/\(-?\d+\)/, ''); (by[k] = by[k] || []).push(+t); }
  const lines = Object.entries(by).map(([k, ts]) => `${k}  x${ts.length}  [${ts[0].toFixed(2)}..${ts[ts.length - 1].toFixed(2)}]`); fs.writeFileSync('tools/qa.txt', lines.join('\n')); console.log('QA kinds:', lines.length); console.log(lines.slice(0, 60).join('\n'));
  const order = await p.evaluate(() => { const SC = window.SC, ks = Object.keys(SC).filter((k) => k !== 'END'); return window.__EP.Dr.shots.map((s) => { const sc = ks.filter((k) => SC[k] <= s.t + 1e-6).pop(); const tagSc = (s.tag || '').split(' ')[0]; return tagSc !== sc ? `${s.t.toFixed(2)} shot "${s.tag}" falls in ${sc}` : null; }).filter(Boolean); });
  console.log('scene-order problems:', order.length ? '\n' + order.join('\n') : 'none');
  if (process.argv[2] === 'noshots') return b.close();
  const shots = await p.evaluate(() => window.__EP.Dr.shots.map((s) => [s.t, s.t1, s.tag]));
  fs.mkdirSync('tools/ss', { recursive: true }); for (const f of fs.readdirSync('tools/ss')) fs.unlinkSync('tools/ss/' + f);
  let n = 0; for (const [t0, t1, tag] of shots) for (const t of [Math.min(t0 + 0.45, (t0 + t1) / 2), (t0 + t1) / 2 + Math.min(0.6, (t1 - t0) / 4)]) {
    await p.evaluate((t) => window.__timelines.main.seek(t, false), t);
    await p.screenshot({ path: `tools/ss/${String(n++).padStart(3, '0')}_${t.toFixed(2)}_${(tag || '').replace(/[^A-Za-z0-9]+/g, '-')}.png` }); }
  console.log('stills', n); await b.close(); })();
