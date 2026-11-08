// node qa_ep5.cjs <proj> <outdir> [shotStep=3]  — consistency QA: slides/teleports, HUD overlaps, bubbles over faces, off-screen text, page errors, stills
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const [proj, out, stepS = '3', T0 = '0', T1 = '9999', doMot = '1'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto('file://' + path.resolve(proj, 'index.html')); await p.waitForFunction(() => !!(window.__EP4 && window.__timelines.main), null, { timeout: 600000 });
  await p.evaluate(async () => { await document.fonts.ready; });
  const DD = await p.evaluate(() => window.__timelines.main.duration()); const D = Math.min(DD, +T1), A0 = +T0;
  // 1) motion: per-0.05s position deltas for visible characters while the camera is continuous
  const mot = doMot !== '1' ? [] : await p.evaluate((D) => { const E = window.__EP4, out = [], prev = {}; let pc = null;
    for (let t = 0; t <= D; t += 0.05) { const c = E.camAt(t), cut = pc && Math.hypot(c.p[0] - pc[0], c.p[1] - pc[1], c.p[2] - pc[2]) > 0.6; pc = c.p.slice();
      for (const id in E.CAST) { const bb = E.CAST[id].b; const v = bb.vis ? bb.vis(t) : true; if (!v || !bb.pos) { delete prev[id]; continue; } const q = bb.pos(t);
        if (prev[id] && !cut) { const d = Math.hypot(q.x - prev[id].x, q.z - prev[id].z); if (d > 0.3) out.push(`${t.toFixed(2)} ${id} moved ${d.toFixed(2)}m in 0.05s (${(d / 0.05).toFixed(1)} m/s)`); }
        prev[id] = { x: q.x, z: q.z }; } } return out; }, DD);
  // 2) HUD: seek every 0.25s, collect visible HUD groups + faces
  const hud = []; const seen = new Set();
  for (let t = A0 + 0.05; !process.env.NOHUD && t < D; t += +(process.env.HUDSTEP || 0.25)) {
    const r = await p.evaluate((t) => { const E = window.__EP4; window.__timelines.main.seek(t, false); const svg = document.getElementById('hud'); const items = [];
      const visible = (n) => { for (let e = n; e && e !== svg; e = e.parentNode) { if (e.getAttribute && e.getAttribute('display') === 'none') return false; const o = e.getAttribute && e.getAttribute('opacity'); if (o !== null && o !== undefined && o !== '' && +o < 0.35) return false; } return true; };
      [...svg.children].forEach((g, i) => { if (i === 0 || g.tagName === 'defs' || !visible(g)) return; const txt = [...g.querySelectorAll('text')].filter(visible).map((x) => x.textContent).join(' ').trim(); const rc = g.getBoundingClientRect(); if (rc.width < 4 || rc.height < 4 || rc.width * rc.height > 1920 * 1080 * 0.5) return; items.push({ i, txt: txt.slice(0, 40), r: [rc.left, rc.top, rc.right, rc.bottom] }); });
      const off = [...svg.querySelectorAll('text')].filter(visible).map((x) => { const rc = x.getBoundingClientRect(); return rc.width > 0 && (rc.left < 0 || rc.right > 1920 || rc.top < 0 || rc.bottom > 1080) ? x.textContent.slice(0, 40) : null; }).filter(Boolean);
      const faces = E.W3.faceRects(t, E.camAt).map((f) => ({ id: f.id, r: [f.x0, f.y0, f.x1, f.y1] })); return { items, off, faces }; }, t);
    const ov = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    for (let i = 0; i < r.items.length; i++) for (let j = i + 1; j < r.items.length; j++) { const A = r.items[i], B = r.items[j], o = ov(A.r, B.r); if (o > 400 && (A.txt || B.txt)) { const k = `ov|${A.txt}|${B.txt}`; if (!seen.has(k)) { seen.add(k); hud.push(`${t.toFixed(2)} HUD OVERLAP ${o | 0}px²: "${A.txt}" x "${B.txt}"`); } } }
    for (const it of r.items) if (it.txt) for (const f of r.faces) { const o = ov(it.r, f.r), fa = (f.r[2] - f.r[0]) * (f.r[3] - f.r[1]); if (fa > 0 && o / fa > 0.25) { const k = `face|${it.txt}|${f.id}`; if (!seen.has(k)) { seen.add(k); hud.push(`${t.toFixed(2)} COVERS FACE ${f.id} (${Math.round(100 * o / fa)}%): "${it.txt}"`); } } }
    for (const x of r.off) { const k = `off|${x}`; if (!seen.has(k)) { seen.add(k); hud.push(`${t.toFixed(2)} OFF-SCREEN TEXT: "${x}"`); } }
  }
  const rep = ['PAGE ERRORS:', ...[...new Set(errs)], '', 'MOTION:', ...mot, '', 'HUD:', ...hud].join('\n'); fs.writeFileSync(path.join(out, `report_${A0}.txt`), rep); console.log(rep);
  // 3) stills
  if (+stepS < 1000) for (let t = Math.ceil((A0 - 0.5) / +stepS) * +stepS + 0.5; t < D; t += +stepS) { await p.evaluate((t) => window.__timelines.main.seek(t, false), t); await p.waitForTimeout(150); await p.evaluate((t) => window.__timelines.main.seek(t + 0.001, false), t); await p.waitForTimeout(120);
    await p.screenshot({ path: path.join(out, `f_${t.toFixed(1).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 70 }); }
  await b.close(); })();
