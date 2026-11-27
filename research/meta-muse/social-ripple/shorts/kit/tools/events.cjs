const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs'); fs.mkdirSync('tools', { recursive: true });
(async () => { const [w, h] = (process.env.WH || '1080x1920').split('x').map(Number); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve('index.html'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  const ev = await p.evaluate(() => JSON.stringify(window.__INK)); fs.writeFileSync('tools/events.json', ev); console.log('events', JSON.parse(ev).events.length);
  for (const t of process.argv.slice(2).map(Number)) { await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t); await p.screenshot({ path: `tools/s_${t}.png` }); }
  await b.close(); })();
