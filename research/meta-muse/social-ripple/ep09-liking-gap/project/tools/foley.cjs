// exports footstep events (from the rig's own step counter while walking), the shot list and the story marks -> foley.json
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => { const D = window.DUR, Dr = window.__EP.Dr, last = {}, steps = [];
    for (let t = 0; t < D; t += 1 / 60) { const { cam, shot } = Dr.draw(t);
      for (const a of Object.values(Dr.actors)) { if (a.c.g.getAttribute('display') === 'none') { last[a.name] = null; continue; } const J = a.c.joints;
        if (J.walk > 0.2 && last[a.name] != null && J.step !== last[a.name]) { const [sx] = Dr.toScreen(cam, J.x, J.y); if (sx > -100 && sx < 2020) steps.push({ t: +t.toFixed(3), who: a.name, extra: a.extra, set: shot.set, x: Math.round(sx), sc: +(J.sc * cam.z).toFixed(2) }); }
        last[a.name] = J.step; } }
    return { steps, shots: Dr.shots.map((s) => [+s.t.toFixed(3), s.set, s.tag]), marks: window.__EP.marks, D }; });
  fs.writeFileSync('foley.json', JSON.stringify(r)); console.log('steps', r.steps.length, 'shots', r.shots.length); await b.close(); })();
