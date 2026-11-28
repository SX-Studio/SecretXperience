const { chromium } = require('playwright'); const path = require('path');
(async () => { const [proj, ...ts] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.addInitScript(() => { window.__timelines = {}; });
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto('file://' + path.resolve(proj, 'index.html')); await p.waitForFunction(() => window.__EP4 || window.__EP3, null, { timeout: 60000 });
  for (const t of ts.map(Number)) { const r = await p.evaluate((t) => { const E = window.__EP4; const o = {}; for (const id in E.CAST) { const b = E.CAST[id].b; const vis = b.o && b.o.vis ? b.o.vis(t) : null; const q = b.pos(t); o[id] = [q.x.toFixed(2), q.z.toFixed(2), b.outer.getAttribute("display")].join(","); } const c = E.camAt(t); return { cam: c.p.map((v) => v.toFixed(1)).join(','), o }; }, t); console.log(t, JSON.stringify(r)); }
  await b.close(); })();
