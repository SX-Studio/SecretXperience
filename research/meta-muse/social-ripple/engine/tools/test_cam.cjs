// node test_cam.cjs <project> <out.png> <t> '<json cam {p,l,f}>' [extraJS]  — seek, then re-render with a custom camera (HUD hidden)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const [proj, out, t, camJ, extra] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.log('PAGEERR', e.message)); await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto('file://' + path.resolve(proj, 'index.html')); await p.waitForFunction(() => !!(window.__EP4 && window.__timelines.main), null, { timeout: 600000 });
  await p.evaluate(async () => { await document.fonts.ready; });
  await p.evaluate(([t, camJ, extra]) => { const E = window.__EP4; if (extra) eval(extra); window.__timelines.main.seek(t, false); const k = Object.assign({ dof: 0, fn: 50, ff: 320, e: "lin" }, JSON.parse(camJ)); const ca = E.W3.keys([Object.assign({ t: 0 }, k), Object.assign({}, k, { t: 1, p: k.p.slice(), l: k.l.slice() })]); E.W3.frame(t, ca(0.5), {}); document.getElementById('hud').style.visibility = 'hidden'; }, [+t, camJ, extra || '']);
  await p.waitForTimeout(500); await p.screenshot({ path: out }); await b.close(); console.log('ok'); })();
