const { chromium } = require('playwright');
const fs = require('fs'); const { spawn } = require('child_process');
(async () => {
  const mode = process.argv[2];
  const tl = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console', m.type(), m.text().slice(0, 300)); });
  await page.goto('http://127.0.0.1:8765/flood.html');
  await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  await page.evaluate(t => window.setTimeline(t), tl);
  const canvas = await page.$('#out');
  if (mode === 'stills') {
    for (const t of process.argv.slice(3).map(Number)) {
      const t0 = Date.now(); await page.evaluate(t => window.render(t), t);
      await canvas.screenshot({ path: `still_${t.toFixed(1)}.jpg`, type: 'jpeg', quality: 88 });
      console.log('still', t, (Date.now() - t0) + 'ms');
    }
  } else {
    const fps = 30, n = Math.round(tl.total * fps);
    const start = Number(process.argv[3] || 0), end = Number(process.argv[4] || n);
    const outName = process.argv[5] || 'video_noaudio.mp4';
    const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
      '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', outName]);
    const t0 = Date.now();
    for (let f = start; f < end; f++) {
      await page.evaluate(t => window.render(t), f / fps);
      const buf = await canvas.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log('frame', f, '/', end, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('done', outName);
  }
  await browser.close();
})();
