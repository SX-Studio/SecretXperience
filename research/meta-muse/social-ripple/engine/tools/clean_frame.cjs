// node clean_frame.cjs <project> <out.png> <t> [hideHud=1]  — renders one frame with the HUD hidden (for thumbnails)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const [proj, out, t, hide = '1'] = process.argv.slice(2); const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto('file://' + path.resolve(proj, 'index.html')); await p.waitForFunction(() => !!(window.__EP4 && window.__timelines.main), null, { timeout: 600000 });
  await p.evaluate(async () => { await document.fonts.ready; }); await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, +t);
  await p.waitForTimeout(800); await p.evaluate((t) => { window.__timelines.main.seek(t + 0.001, false); }, +t); await p.waitForTimeout(400);
  if (hide === '1') await p.evaluate(() => { document.getElementById('hud').style.visibility = 'hidden'; });
  await p.screenshot({ path: out }); await b.close(); console.log('ok', out); })();
