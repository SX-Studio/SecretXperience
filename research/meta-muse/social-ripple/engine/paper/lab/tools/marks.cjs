const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2000);
  const m = await p.evaluate(() => ({ marks: window.__SCENE.marks, cuts: window.__SCENE.shots.map((s) => s[0]), D: window.DUR })); fs.writeFileSync('assets/marks.json', JSON.stringify(m)); console.log(JSON.stringify(m)); await b.close(); })();
