const { chromium } = require('playwright');
const fs = require('fs'); const { spawn } = require('child_process');
(async () => {
  const mode = process.argv[2];                       // "stills" or "video"
  const tl = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + process.cwd() + '/scene.html');
  await page.evaluate(async () => { await document.fonts.load('900 80px "Inter Display"'); await document.fonts.load('800 40px Inter'); await document.fonts.load('600 26px Inter'); });
  await page.evaluate(t => window.setTimeline(t), tl);
  const canvas = await page.$('#c');
  if (mode === 'stills') {
    const times = process.argv.slice(3).map(Number);
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await canvas.screenshot({ path: `still_${t.toFixed(1)}.png` });
      console.log('still', t);
    }
  } else {
    const fps = 30, n = Math.round(tl.total * fps);
    const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
      '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', 'video_noaudio.mp4']);
    for (let f = 0; f < n; f++) {
      await page.evaluate(t => window.render(t), f / fps);
      const buf = await canvas.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log('frame', f, '/', n);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('video done');
  }
  await browser.close();
})();
