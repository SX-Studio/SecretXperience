const { chromium } = require('playwright'); const path = require('path');
(async () => { const [proj, id, a, b] = process.argv.slice(2); const br = await chromium.launch(); const p = await br.newPage(); await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto('file://' + path.resolve(proj, 'index.html')); await p.waitForFunction(() => window.__EP4, null, { timeout: 60000 });
  const r = await p.evaluate(([id, a, b]) => { const c = window.__EP4.CAST[id]; return { P: c.tr.P.filter((k) => k[0] >= a && k[0] <= b).map((k) => [k[0].toFixed(3), k[1].x.toFixed(2), k[1].z.toFixed(2), k[2] || '']), vis: c.vis.map((v) => v.map((x) => x.toFixed(2))) }; }, [id, +a, +b]);
  console.log(JSON.stringify(r)); await br.close(); })();
