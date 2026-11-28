// node make.cjs spec.json [spec2.json ...] → <name>.png (1280x720) + <name>_phone.png (246x138) + sheet.png (all, phone size)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs'); const { execSync } = require('child_process');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', (e) => console.log('ERR', e.message)); const outs = [];
  for (const f of process.argv.slice(2)) { const spec = JSON.parse(fs.readFileSync(f, 'utf8')), dir = path.dirname(path.resolve(f)), name = path.join(dir, spec.name);
    const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap" rel="stylesheet"><script src="${spec.assets || 'assets'}/sr-engine-v1.js"></script><script src="${spec.assets || 'assets'}/sr-v3.js"></script><script src="${path.relative(dir, path.join(__dirname, 'studio.js'))}"></script><style>*{margin:0;padding:0;box-sizing:border-box}body{width:1280px;height:720px;overflow:hidden;background:#111}</style></head><body><script>TS.render(${JSON.stringify(spec)});</script></body></html>`;
    fs.writeFileSync(name + '.html', html); await p.goto('file://' + name + '.html'); await p.waitForTimeout(2200); await p.evaluate(async () => { await document.fonts.ready; }); await p.screenshot({ path: name + '.png' });
    execSync(`ffmpeg -y -v error -i "${name}.png" -vf scale=246:138 "${name}_phone.png"`); outs.push(name); console.log('ok', name + '.png'); }
  await b.close();
  if (outs.length > 1) { const ins = outs.map((n) => `-i "${n}_phone.png"`).join(' '); const lay = outs.map((_, i) => `${(i % 2) * 256}_${Math.floor(i / 2) * 148}`).join('|');
    execSync(`ffmpeg -y -v error ${ins} -filter_complex "xstack=inputs=${outs.length}:layout=${lay}:fill=white" "${path.join(path.dirname(outs[0]), 'sheet.png')}"`); console.log('sheet', path.join(path.dirname(outs[0]), 'sheet.png')); }
})();
