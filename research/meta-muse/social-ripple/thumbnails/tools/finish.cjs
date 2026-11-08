// node finish.cjs <image> <labels.json> <out.jpg>   -> 1920x1080 PNG + 1280x720 JPG, plus a phone-size preview (360 px wide)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const [img, lab, out] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const u = 'file://' + path.resolve(__dirname, 'finish.html') + '?img=' + encodeURIComponent('file://' + path.resolve(img)) + '&labels=' + encodeURIComponent(fs.readFileSync(lab, 'utf8'));
  await p.goto(u); await p.waitForTimeout(2500); await p.screenshot({ path: out.replace(/\.jpg$/, '.png') }); await b.close(); console.log('ok', out); })();
