/* Social Ripple ep3: hero props + FX factories + the Yap stone-money diorama.
   const P = EP3.props(W3);  every factory returns { group, update?(...) } and adds group to W3.scene (opts.parent overrides, null = detached).
   Deterministic: no Math.random / Date / rAF. Everything animated is a pure function of the arguments passed to update(). */
(function () {
  window.EP3 = window.EP3 || {};
  window.EP3.props = function (W3) {
    const TH = W3.TH, SR = window.SR, R32 = SR.mulberry32, INK = "#1E1B22";
    const T = (c, map, o) => W3.toon(c, map, o);
    const clamp01 = (k) => (k < 0 ? 0 : k > 1 ? 1 : k), seg = (s, a, b) => clamp01((s - a) / (b - a)), sst = W3.sstep, lerp = W3.lerp;
    const eOut = (k) => 1 - Math.pow(1 - k, 3), eIn = (k) => k * k * k;
    const F = (px, fam) => `900 ${px}px ${fam || "Outfit"}, Nunito, sans-serif`;
    const FONTS = ["900 64px Outfit", "900 64px Nunito"];
    const _m = new TH.Matrix4(), _q = new TH.Quaternion(), _q2 = new TH.Quaternion(), _p = new TH.Vector3(), _s = new TH.Vector3(), _e = new TH.Euler(), UP = new TH.Vector3(0, 1, 0);
    const newGroup = (o = {}) => { const g = new TH.Group(); const p = o.parent !== undefined ? o.parent : W3.scene; if (p) p.add(g); return g; };
    const put = (par, m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); par.add(m); return m; };
    const mesh = (geo, mat) => new TH.Mesh(geo, mat);
    const mix = (a, b, k) => "#" + new TH.Color(a).lerp(new TH.Color(b), k).getHexString();
    // ---------- 2D helpers ----------
    function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function fitFont(g, s, maxW, px, fam) { g.font = F(px, fam); const w = g.measureText(s).width; if (w > maxW) { px = Math.floor(px * maxW / w); g.font = F(px, fam); } return px; }
    function spaced(g, s, x, y, sp) { try { g.letterSpacing = sp + "px"; } catch (e) {} g.fillText(s, x + sp / 2, y); try { g.letterSpacing = "0px"; } catch (e) {} }
    // ---------- 3D shape helpers ----------
    function rrShape(w, h, r) { const s = new TH.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
    function blobShape(a, b, p, n, amp, freq, ph = 0) { const s = new TH.Shape(); for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), k = 1 + amp * Math.sin(t * freq + ph);
        const x = a * k * Math.sign(c) * Math.pow(Math.abs(c), 2 / p), y = b * k * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / p); if (i) s.lineTo(x, y); else s.moveTo(x, y); } s.closePath(); return s; }
    // flat-lying extrusion: shape XY → world XZ, thickness along +y starting at y=0
    function slab(shape, depth, bevel = 0, curveSegments = 8) { const g = new TH.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments }); g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0); return g; }
    const lathe = (pts, n) => new TH.LatheGeometry(pts.map(([r, y]) => new TH.Vector2(Math.max(r, 0.0001), y)), n);
    const flat = (geo) => { const g = geo.index ? geo.toNonIndexed() : geo; g.computeVertexNormals(); return g; };
    function planarUV(geo, sx, sz, ox = 0.5, oz = 0.5) { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / sx + ox, -p.getZ(i) / sz + oz); uv.needsUpdate = true; return geo; }
    function polarRing(r0, r1, n, rep) { const pos = [], uv = [], idx = []; for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); pos.push(c * r0, 0, -s * r0, c * r1, 0, -s * r1); uv.push((i / n) * rep, 0, (i / n) * rep, 1);
        if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
      const g = new TH.BufferGeometry(); g.setAttribute("position", new TH.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new TH.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
    function stick(par, a, b, r, mat, seg = 8) { const A = new TH.Vector3(...a), B = new TH.Vector3(...b), d = B.clone().sub(A), L = d.length(); const m = mesh(new TH.CylinderGeometry(r, r, L, seg), mat);
      m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); par.add(m); return m; }

    // =====================================================================================
    // shared engraving: the little sandwich (bill portrait)
    function engravedSandwich(g, cx, cy, s, ink, mid, paper) {
      g.save(); g.translate(cx, cy); g.scale(s, s); g.lineJoin = "round"; g.lineCap = "round";
      const hatch = (path, ang, gap, lw, col) => { g.save(); path(); g.clip(); g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); const c = Math.cos(ang), sn = Math.sin(ang);
        for (let k = -200; k <= 200; k += gap) { g.moveTo(-200 * c - k * sn, -200 * sn + k * c); g.lineTo(200 * c - k * sn, 200 * sn + k * c); } g.stroke(); g.restore(); };
      const layer = (path, fillC, ang, gap) => { path(); g.fillStyle = fillC; g.fill(); hatch(path, ang, gap, 1.1, mid); path(); g.strokeStyle = ink; g.lineWidth = 3.2; g.stroke(); };
      // bottom bread
      const bread = () => rr(g, -72, 46, 144, 26, 10); layer(bread, paper, 0.0, 4.2);
      // ham (wavy)
      const ham = () => { g.beginPath(); g.moveTo(-78, 34); for (let x = -78; x <= 78; x += 4) g.lineTo(x, 34 + Math.sin(x * 0.2) * 2.4); for (let x = 78; x >= -78; x -= 4) g.lineTo(x, 48 + Math.sin(x * 0.17 + 1) * 2.4); g.closePath(); };
      layer(ham, paper, -0.5, 3.6);
      // cheese with drips
      const cheese = () => { g.beginPath(); g.moveTo(-74, 26); g.lineTo(74, 26); g.lineTo(74, 34); [[60, 48], [26, 44], [-18, 50], [-52, 43]].forEach(([x, d]) => { g.lineTo(x + 7, 34); g.quadraticCurveTo(x + 6, d, x, d); g.quadraticCurveTo(x - 6, d, x - 7, 34); }); g.lineTo(-74, 34); g.closePath(); };
      layer(cheese, paper, 0.6, 5.5);
      // tomatoes
      const tom = () => { g.beginPath(); [-50, -2, 46].forEach((x) => { g.moveTo(x + 26, 27); g.ellipse(x, 22, 26, 7, 0, 0, Math.PI * 2); }); };
      layer(tom, paper, -1.0, 3.2);
      // lettuce frill
      const let_ = () => { g.beginPath(); g.moveTo(-84, 16); for (let x = -84; x <= 84; x += 3) g.lineTo(x, 12 + Math.sin(x * 0.42) * 4.5 + (Math.abs(x) > 76 ? 4 : 0)); g.lineTo(84, 20); for (let x = 84; x >= -84; x -= 3) g.lineTo(x, 21 + Math.sin(x * 0.3 + 2) * 2); g.closePath(); };
      layer(let_, paper, 1.2, 4.0);
      // bun dome with curved hatching
      const bun = () => { g.beginPath(); g.moveTo(-78, 14); g.bezierCurveTo(-80, -64, 80, -64, 78, 14); g.closePath(); };
      bun(); g.fillStyle = paper; g.fill();
      g.save(); bun(); g.clip(); g.strokeStyle = mid; g.lineWidth = 1.15; for (let k = 0; k < 16; k++) { const e = k / 15; g.beginPath(); g.ellipse(0, 18, 76 - e * 62, 70 - e * 64, 0, Math.PI, Math.PI * 2); g.stroke(); }
      g.beginPath(); g.rect(-200, -200, 400, 400); g.ellipse(-22, -20, 58, 32, -0.25, 0, Math.PI * 2); g.clip("evenodd"); g.lineWidth = 1; g.beginPath(); for (let k = -110; k < 90; k += 3.4) { g.moveTo(k, 16); g.lineTo(k + 26, -40); } g.stroke(); g.restore();
      // highlight clearing on the bun
      g.save(); bun(); g.clip(); g.fillStyle = paper; g.beginPath(); g.ellipse(-26, -22, 22, 9, -0.35, 0, Math.PI * 2); g.fill(); g.restore();
      bun(); g.strokeStyle = ink; g.lineWidth = 3.4; g.stroke();
      // sesame
      const rs = R32(5); g.fillStyle = paper; g.strokeStyle = ink; g.lineWidth = 1.6; for (let i = 0; i < 16; i++) { const a = rs() * Math.PI, rad = 0.35 + rs() * 0.5; const x = Math.cos(a) * 62 * rad * 1.1, y = 4 - Math.sin(a) * 48 * rad - 6; if (Math.abs(x - 18) < 6) continue; g.beginPath(); g.ellipse(x, y, 4, 2.2, rs() - 0.5, 0, Math.PI * 2); g.fill(); g.stroke(); }
      // toothpick + olive
      g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(18, -6); g.lineTo(22, -78); g.stroke();
      g.beginPath(); g.ellipse(22, -76, 11, 13, 0.1, 0, Math.PI * 2); g.fillStyle = paper; g.fill(); hatch(() => { g.beginPath(); g.ellipse(22, -76, 11, 13, 0.1, 0, Math.PI * 2); }, 0.8, 2.6, 1, mid); g.beginPath(); g.ellipse(22, -76, 11, 13, 0.1, 0, Math.PI * 2); g.lineWidth = 3; g.stroke();
      g.beginPath(); g.arc(22, -76, 4, 0, Math.PI * 2); g.fillStyle = ink; g.fill();
      g.beginPath(); g.moveTo(22, -88); g.lineTo(14, -100); g.lineTo(30, -100); g.closePath(); g.fillStyle = paper; g.fill(); g.lineWidth = 2.4; g.stroke();
      g.restore();
    }
    function rosette(g, cx, cy, R, col, lw, n = 18) { g.save(); g.strokeStyle = col; g.lineWidth = lw; for (let k = 0; k < 6; k++) { g.beginPath();
        for (let i = 0; i <= 360; i++) { const t = (i / 360) * Math.PI * 2, r = R * (0.5 + 0.13 * Math.sin(n * t + (k * Math.PI) / 3)); const x = cx + Math.cos(t) * r, y = cy + Math.sin(t) * r; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.restore(); }
    function guillocheBand(g, x0, y0, x1, y1, col, freq, amp) { const horiz = Math.abs(x1 - x0) > Math.abs(y1 - y0); g.save(); g.strokeStyle = col; g.lineWidth = 1.2;
      for (let k = 0; k < 6; k++) { g.beginPath(); const L = horiz ? x1 - x0 : y1 - y0; for (let i = 0; i <= L; i += 2) { const o = Math.sin(i * freq + (k * Math.PI) / 3) * amp; horiz ? (i ? g.lineTo(x0 + i, y0 + o) : g.moveTo(x0 + i, y0 + o)) : (i ? g.lineTo(x0 + o, y0 + i) : g.moveTo(x0 + o, y0 + i)); } g.stroke(); } g.restore(); }

    // =====================================================================================
    // 1. BANKNOTE
    const BILL = { paper: "#E2EDD6", ink: "#1D5A4E", mid: "#3C8A76", light: "#8CC3AE", red: "#B8432F", gold: "#D9A441" };
    function billFrame(g, w, h) {
      const c = BILL; g.fillStyle = c.paper; g.fillRect(0, 0, w, h);
      const gr = g.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, w * 0.62); gr.addColorStop(0, "rgba(255,255,236,0.55)"); gr.addColorStop(1, "rgba(120,170,140,0.28)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      // fine background waves
      g.strokeStyle = "rgba(60,138,118,0.22)"; g.lineWidth = 1; for (let k = 0; k < 30; k++) { g.beginPath(); for (let x = 0; x <= w; x += 4) { const y = h / 2 + Math.sin(x * 0.012 + k * 0.21) * h * 0.36 * Math.cos(k * 0.1) + Math.sin(x * 0.047 + k) * 9; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      // frame: outer solid, guilloche band, inner line
      g.strokeStyle = c.ink; g.lineWidth = 7; g.strokeRect(10, 10, w - 20, h - 20);
      g.fillStyle = "rgba(29,90,78,0.12)"; g.fillRect(14, 14, w - 28, 28); g.fillRect(14, h - 42, w - 28, 28); g.fillRect(14, 42, 28, h - 84); g.fillRect(w - 42, 42, 28, h - 84);
      guillocheBand(g, 14, 28, w - 14, 28, c.mid, 0.09, 9); guillocheBand(g, 14, h - 28, w - 14, h - 28, c.mid, 0.09, 9); guillocheBand(g, 28, 42, 28, h - 42, c.mid, 0.09, 9); guillocheBand(g, w - 28, 42, w - 28, h - 42, c.mid, 0.09, 9);
      g.lineWidth = 3; g.strokeRect(44, 44, w - 88, h - 88);
      // corner rosettes with "10"
      [[96, 92], [w - 96, 92], [96, h - 92], [w - 96, h - 92]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 50, 0, Math.PI * 2); g.fillStyle = c.paper; g.fill(); rosette(g, x, y, 78, c.mid, 1.1, 14); g.beginPath(); g.arc(x, y, 50, 0, Math.PI * 2); g.lineWidth = 4; g.strokeStyle = c.ink; g.stroke();
        g.beginPath(); g.arc(x, y, 30, 0, Math.PI * 2); g.fillStyle = c.paper; g.fill(); g.lineWidth = 2; g.stroke(); g.fillStyle = c.ink; g.font = F(40); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("10", x, y + 2); });
    }
    function bigTen(g, x, y, px, col) { const pc = document.createElement("canvas"); pc.width = pc.height = 12; const p = pc.getContext("2d"); p.fillStyle = BILL.light; p.fillRect(0, 0, 12, 12); p.strokeStyle = BILL.mid; p.lineWidth = 1.4; p.beginPath(); p.moveTo(0, 12); p.lineTo(12, 0); p.moveTo(-6, 6); p.lineTo(6, -6); p.moveTo(6, 18); p.lineTo(18, 6); p.stroke();
      g.save(); g.font = F(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = g.createPattern(pc, "repeat"); g.fillText("10", x, y); g.lineWidth = 6; g.strokeStyle = col; g.lineJoin = "round"; g.strokeText("10", x, y); g.restore(); }
    function drawBillFront(g, w, h, serial) {
      const c = BILL; billFrame(g, w, h); g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = c.ink; g.font = F(48); spaced(g, "CRUMB ISLAND", w / 2, 70, 7);
      g.font = F(14, "Nunito"); g.fillStyle = c.mid; spaced(g, "THIS NOTE IS LEGAL TENDER FOR ALL SANDWICHES, PUBLIC AND PRIVATE", w / 2, 100, 1.5);
      // portrait oval
      const ox = w / 2, oy = 220; g.save(); g.beginPath(); g.ellipse(ox, oy, 110, 98, 0, 0, Math.PI * 2); g.fillStyle = "#EEF4E6"; g.fill(); g.clip();
      g.strokeStyle = "rgba(60,138,118,0.42)"; g.lineWidth = 1; for (let k = 0; k < 40; k++) { g.beginPath(); g.ellipse(ox, oy + 20, 8 + k * 4, 6 + k * 3.4, 0, 0, Math.PI * 2); g.stroke(); }
      engravedSandwich(g, ox, oy + 10, 0.94, c.ink, c.mid, "#F4F7EC"); g.restore();
      g.beginPath(); g.ellipse(ox, oy, 110, 98, 0, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = c.ink; g.stroke(); g.beginPath(); g.ellipse(ox, oy, 119, 107, 0, 0, Math.PI * 2); g.lineWidth = 2; g.stroke();
      // ribbon under portrait
      g.fillStyle = c.paper; g.beginPath(); g.moveTo(ox - 104, 322); g.lineTo(ox + 104, 322); g.lineTo(ox + 92, 336); g.lineTo(ox + 104, 350); g.lineTo(ox - 104, 350); g.lineTo(ox - 92, 336); g.closePath(); g.fill(); g.lineWidth = 2.5; g.strokeStyle = c.ink; g.stroke();
      g.fillStyle = c.ink; g.font = F(17); spaced(g, "THE SANDWICH", ox, 337, 3);
      g.font = F(36); spaced(g, "TEN DOLLARS", w / 2, 372, 9);
      // gold seal (left)
      const sx = 238, sy = 238; g.save(); g.translate(sx, sy); g.beginPath(); for (let i = 0; i < 96; i++) { const a = (i / 96) * Math.PI * 2, r = i % 2 ? 60 : 66; i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fillStyle = c.gold; g.fill(); g.lineWidth = 2; g.strokeStyle = "#8A5A1E"; g.stroke();
      g.beginPath(); g.arc(0, 0, 50, 0, Math.PI * 2); g.lineWidth = 2; g.stroke(); g.beginPath(); g.arc(0, 0, 34, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "#7A4E16"; g.font = F(10); const ring = "BANK OF CRUMB ISLAND • EST. 1902 • "; for (let i = 0; i < ring.length; i++) { const a = (i / ring.length) * Math.PI * 2 - Math.PI / 2; g.save(); g.rotate(a + Math.PI / 2); g.fillText(ring[i], 0, -42); g.restore(); }
      g.font = F(30); g.fillText("CI", 0, 2); g.restore();
      g.font = F(13, "Nunito"); g.fillStyle = c.mid; g.fillText("SERIES 2026", sx, 330);
      // signature scribble (right)
      g.save(); g.strokeStyle = c.ink; g.lineWidth = 2.2; g.beginPath(); g.moveTo(730, 296); for (let i = 0; i < 40; i++) g.lineTo(730 + i * 3.2, 292 + Math.sin(i * 0.9) * 7 - i * 0.2); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.moveTo(722, 306); g.lineTo(870, 306); g.stroke();
      g.font = F(12, "Nunito"); g.fillStyle = c.mid; g.fillText("TREASURER OF LUNCH", 796, 320); g.restore();
      bigTen(g, 800, 214, 150, c.ink);
      // serials
      g.fillStyle = c.red; g.font = `bold 26px "Courier New", monospace`; g.fillText(serial, 262, 136); g.fillText(serial, 790, 132);
    }
    function drawBillBack(g, w, h) {
      const c = BILL; billFrame(g, w, h); g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = c.ink; g.font = F(46); spaced(g, "CRUMB ISLAND", w / 2, 76, 7);
      g.font = F(30); spaced(g, "IN SANDWICH WE TRUST", w / 2, 384, 5);
      // island vignette
      const ox = 344, oy = 226; g.save(); g.beginPath(); g.ellipse(ox, oy, 186, 112, 0, 0, Math.PI * 2); g.fillStyle = "#EEF4E6"; g.fill(); g.clip();
      g.strokeStyle = "rgba(60,138,118,0.5)"; g.lineWidth = 1; for (let y = 120; y < 250; y += 5) { g.beginPath(); g.moveTo(ox - 200, y); g.lineTo(ox + 200, y); g.stroke(); } // sky
      for (let i = 0; i < 18; i++) { const a = Math.PI + (i / 17) * Math.PI; g.beginPath(); g.moveTo(ox + 70, 238); g.lineTo(ox + 70 + Math.cos(a) * 160, 238 + Math.sin(a) * 160); g.stroke(); }
      g.fillStyle = "#EEF4E6"; g.beginPath(); g.arc(ox + 70, 238, 30, Math.PI, 0); g.fill(); g.lineWidth = 2.5; g.strokeStyle = c.ink; g.stroke();
      g.fillStyle = c.light; g.fillRect(ox - 200, 250, 400, 100); g.strokeStyle = c.mid; for (let y = 254; y < 340; y += 6) { g.beginPath(); for (let x = ox - 200; x < ox + 200; x += 6) g.lineTo(x, y + Math.sin(x * 0.15 + y) * 1.4); g.stroke(); }
      g.beginPath(); g.moveTo(ox - 150, 262); g.quadraticCurveTo(ox - 60, 196, ox + 40, 228); g.quadraticCurveTo(ox + 100, 240, ox + 130, 262); g.closePath(); g.fillStyle = "#F4F7EC"; g.fill(); g.lineWidth = 3; g.strokeStyle = c.ink; g.stroke();
      g.save(); g.clip(); g.strokeStyle = c.mid; g.lineWidth = 1; for (let x = ox - 160; x < ox + 140; x += 4) { g.beginPath(); g.moveTo(x, 270); g.lineTo(x + 20, 200); g.stroke(); } g.restore();
      // tiny shop + palms
      g.fillStyle = "#F4F7EC"; g.strokeStyle = c.ink; g.lineWidth = 2.5; g.fillRect(ox - 34, 196, 44, 30); g.strokeRect(ox - 34, 196, 44, 30); g.beginPath(); g.moveTo(ox - 40, 198); g.lineTo(ox - 12, 178); g.lineTo(ox + 16, 198); g.closePath(); g.fill(); g.stroke(); g.strokeRect(ox - 18, 208, 10, 18);
      [[ox - 96, 222, -0.2], [ox - 70, 210, 0.15]].forEach(([x, y, l]) => { g.beginPath(); g.moveTo(x, y + 12); g.quadraticCurveTo(x + l * 40, y - 30, x + l * 50, y - 60); g.lineWidth = 4; g.stroke(); const tx = x + l * 50, ty = y - 60; g.lineWidth = 2.5;
        for (let k = 0; k < 6; k++) { const a = -Math.PI + (k / 5) * Math.PI; g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + Math.cos(a) * 26, ty - 14 + Math.sin(a) * 6, tx + Math.cos(a) * 40, ty + 10); g.stroke(); } });
      g.restore(); g.beginPath(); g.ellipse(ox, oy, 186, 112, 0, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = c.ink; g.stroke();
      bigTen(g, 744, 222, 196, c.ink);
      g.font = F(20); g.fillStyle = c.ink; spaced(g, "TEN", 744, 322, 12);
    }
    function makeBill(opts = {}) {
      const g = newGroup(opts), BW = 0.156, BH = 0.066, NX = 26, NY = 8, seed = opts.seed || 1;
      const rs = R32(seed * 977 + 13); const serial = opts.serial || ("C" + String(Math.floor(rs() * 1e8)).padStart(8, "0") + "I");
      const texF = W3.fontTex(1024, 440, (c, w, h) => drawBillFront(c, w, h, serial), FONTS, { clamp: true });
      const texB = W3.fontTex(1024, 440, (c, w, h) => drawBillBack(c, w, h), FONTS, { clamp: true });
      const gF = new TH.PlaneGeometry(BW, BH, NX, NY), pos = gF.attributes.position, base = Float32Array.from(pos.array);
      const gB = new TH.BufferGeometry(); gB.setAttribute("position", pos); const uvB = gF.attributes.uv.clone(); for (let i = 0; i < uvB.count; i++) uvB.setX(i, 1 - uvB.getX(i)); gB.setAttribute("uv", uvB);
      const nB = gF.attributes.normal.clone(); gB.setAttribute("normal", nB); const idx = gF.index.array, rev = new Uint16Array(idx.length); for (let i = 0; i < idx.length; i += 3) { rev[i] = idx[i]; rev[i + 1] = idx[i + 2]; rev[i + 2] = idx[i + 1]; } gB.setIndex(new TH.BufferAttribute(rev, 1));
      const front = mesh(gF, T("#FFFFFF", texF, { emissive: "#FFFFFF", emissiveMap: texF, emissiveIntensity: 0.12 })), back = mesh(gB, T("#FFFFFF", texB, { emissive: "#FFFFFF", emissiveMap: texB, emissiveIntensity: 0.12 }));
      g.add(front, back); const ph = rs() * 6;
      function shape(t, fl, bend) { for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], u = x / (BW / 2), v = y / (BH / 2);
          let z = -bend * BW * 0.075 * u * u - bend * BH * 0.04 * v * v;
          z += fl * BW * 0.04 * Math.sin(u * 2.4 - t * 5.0 + ph) * (0.3 + 0.7 * (u + 1) / 2) + fl * BW * 0.014 * Math.sin(v * 2.0 + u * 1.4 - t * 3.6 + ph);
          pos.setXYZ(i, x, y + fl * BW * 0.005 * Math.sin(u * 3 - t * 5 + ph), z); }
        pos.needsUpdate = true; gF.computeVertexNormals(); const nf = gF.attributes.normal.array, nb = nB.array; for (let i = 0; i < nf.length; i++) nb[i] = -nf[i]; nB.needsUpdate = true; }
      shape(0, 0, opts.bend ?? 1);
      return { group: g, front, back, size: [BW, BH], serial, update(t, o = {}) { shape(t, o.flutter ?? 0, o.bend ?? opts.bend ?? 1); } };
    }

    // =====================================================================================
    // 2. SANDWICH (long axis = x, 0.24 m; sits on y = 0)
    function makeSandwich(opts = {}) {
      const g = newGroup(opts); let y = 0;
      // bottom bread
      const bg = slab(rrShape(0.226, 0.116, 0.034), 0.024, 0.006); put(g, mesh(bg, [T("#F6DCA6"), T("#C98A3C")])); y = 0.036;
      // ham: two wavy folds
      [[0.0, 0.0], [0.4, 0.004]].forEach(([ph, dy], i) => { const hg = slab(blobShape(0.124, 0.066, 3.2, 90, 0.035, 9, ph), 0.007, 0.0025); const m = put(g, mesh(hg, [T(i ? "#F7AAB2" : "#F39AA4"), T("#DE6F80")]), 0.004 * (i ? -1 : 1), y + dy + i * 0.004, 0); m.rotation.y = i ? 0.05 : -0.04; });
      y += 0.022;
      // cheese: 2 squares on the diagonal, corners drooping + drips
      const chM = T("#FFC93C", null, { emissive: "#7A4A00", emissiveIntensity: 0.12 });
      [-0.054, 0.054].forEach((cx, i) => { const cg = new TH.BoxGeometry(0.128, 0.005, 0.128, 12, 1, 12); cg.rotateY(Math.PI / 4 + (i ? 0.08 : -0.06)); const p = cg.attributes.position;
        const tips = [null, null]; for (let k = 0; k < p.count; k++) { const z = p.getZ(k), x = p.getX(k) + cx, oz = Math.max(0, Math.abs(z) - 0.052), ox = Math.max(0, Math.abs(x) - 0.112), over = oz + ox;
          p.setZ(k, oz > 0 ? Math.sign(z) * (0.052 + oz * 0.78) : z); p.setX(k, (ox > 0 ? Math.sign(x) * (0.112 + ox * 0.6) : x) - cx); p.setY(k, p.getY(k) - over * 1.05 - over * over * 5);
          const sd = z > 0 ? 0 : 1; if (!tips[sd] || p.getY(k) < tips[sd][1]) tips[sd] = [p.getX(k), p.getY(k), p.getZ(k)]; }
        cg.computeVertexNormals(); put(g, mesh(cg, chM), cx, y, 0);
        tips.forEach(([tx, ty, tz], j) => { const d = mesh(lathe([[0.0001, -0.022], [0.0042, -0.018], [0.0058, -0.01], [0.005, -0.003], [0.0065, 0.004]], 10), chM); put(g, d, cx + tx, y + ty + 0.002, tz + Math.sign(tz) * 0.002); d.scale.set(1, (i + j) % 2 ? 0.75 : 1.2, 1); }); });
      y += 0.008;
      // tomato slices (textured caps)
      const tomTex = W3.tex(256, 256, (c) => { c.fillStyle = "#E23F2E"; c.fillRect(0, 0, 256, 256); c.beginPath(); c.arc(128, 128, 110, 0, Math.PI * 2); c.fillStyle = "#F0604A"; c.fill(); c.lineWidth = 8; c.strokeStyle = "#D93526"; c.stroke();
        for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; c.save(); c.translate(128 + Math.cos(a) * 58, 128 + Math.sin(a) * 58); c.rotate(a); c.beginPath(); c.ellipse(0, 0, 34, 22, 0, 0, Math.PI * 2); c.fillStyle = "#F99A6E"; c.fill();
          c.fillStyle = "#FFE3A0"; for (let s = -1; s <= 1; s++) { c.beginPath(); c.ellipse(s * 12, 4 * (s % 2), 6, 4, 0.4, 0, Math.PI * 2); c.fill(); } c.restore(); }
        c.beginPath(); c.arc(128, 128, 26, 0, Math.PI * 2); c.fillStyle = "#F57C5E"; c.fill(); }, { clamp: true });
      const tomCap = T("#FFFFFF", tomTex), tomSide = T("#E23F2E");
      [[-0.082, 0.03, 0.1], [-0.04, -0.034, -0.05], [0.0, 0.032, 0.08], [0.042, -0.033, -0.1], [0.085, 0.028, 0.06]].forEach(([x, z, r]) => { const m = put(g, mesh(new TH.CylinderGeometry(0.035, 0.035, 0.011, 24), [tomSide, tomCap, tomCap]), x, y + 0.0055, z); m.rotation.set(r * 0.5, r * 3, r); });
      y += 0.012;
      // lettuce frill
      const lg = slab(blobShape(0.134, 0.074, 3.0, 220, 0.045, 23), 0.004, 0, 1); { const p = lg.attributes.position; for (let k = 0; k < p.count; k++) { const x = p.getX(k), z = p.getZ(k), a = Math.atan2(z, x), rn = Math.hypot(x / 0.134, z / 0.074), w = sst(clamp01((rn - 0.72) / 0.36));
          p.setY(k, p.getY(k) + (0.0105 * Math.sin(a * 19) + 0.004 * Math.sin(a * 7 + 1)) * w - 0.002 * w); } lg.computeVertexNormals(); }
      put(g, mesh(lg, [T("#86D152"), T("#5DAE3A")]), 0, y, 0); y += 0.006;
      // top bun: lathe dome scaled long
      const prof = [[0, 0], [0.056, 0], [0.0635, 0.0025], [0.0672, 0.009]]; for (let i = 1; i <= 14; i++) { const a = (i / 14) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a); prof.push([0.068 * Math.pow(c, 2 / 2.5), 0.009 + 0.058 * Math.pow(s, 2 / 2.3)]); }
      const nP = prof.length, bunTex = W3.tex(8, 256, (c, w, h) => { const vb = 1 / (nP - 1); const yb = (1 - vb * 1.5) * h; c.fillStyle = "#F7DFAE"; c.fillRect(0, yb, w, h - yb);
        const gr = c.createLinearGradient(0, yb, 0, 0); gr.addColorStop(0, "#F2C878"); gr.addColorStop(0.18, "#E9A94E"); gr.addColorStop(0.6, "#D98A35"); gr.addColorStop(1, "#C9772A"); c.fillStyle = gr; c.fillRect(0, 0, w, yb); }, { clamp: true });
      const bunGeo = lathe(prof, 48); bunGeo.scale(1.77, 1, 0.95); const bun = put(g, mesh(bunGeo, T("#FFFFFF", bunTex)), 0, y, 0);
      // sesame (instanced)
      const SN = 64, sesG = new TH.SphereGeometry(1, 8, 5), ses = new TH.InstancedMesh(sesG, T("#FFF4D8"), SN), rs = R32(41); let n = 0;
      const surf = (a, th) => { const c = Math.cos(a), s = Math.sin(a); const r = 0.068 * Math.pow(c, 0.8), yy = 0.009 + 0.058 * Math.pow(s, 2 / 2.3); return new TH.Vector3(Math.cos(th) * r * 1.77, y + yy, Math.sin(th) * r * 0.95); };
      for (let tries = 0; n < SN && tries < 600; tries++) { const a = 0.28 + rs() * 1.18, th = rs() * Math.PI * 2; const P = surf(a, th); if (Math.hypot(P.x - 0.03, P.z - 0.004) < 0.012) continue;
        const nrm = surf(a + 0.01, th).sub(P).cross(surf(a, th + 0.01).sub(P)).normalize(); if (nrm.y < 0) nrm.negate();
        _q.setFromUnitVectors(UP, nrm); _q2.setFromAxisAngle(UP, rs() * Math.PI); _q.multiply(_q2); _m.compose(P.addScaledVector(nrm, 0.0008), _q, _s.set(0.0058, 0.0022, 0.0034)); ses.setMatrixAt(n++, _m); }
      ses.count = n; g.add(ses);
      const top = y + 0.009 + 0.058;
      // toothpick + olive + frill
      const pick = new TH.Group(); pick.position.set(0.03, 0, 0.004); pick.rotation.z = -0.1; g.add(pick);
      put(pick, mesh(new TH.CylinderGeometry(0.0022, 0.0022, 0.16, 8), T("#EBCB95")), 0, 0.06 + 0.08, 0);
      const ol = put(pick, mesh(new TH.SphereGeometry(0.0135, 18, 12), T("#7FA03A")), 0, top + 0.03, 0); ol.scale.set(1, 1.25, 1);
      [1, -1].forEach((s) => { const p = put(pick, mesh(new TH.CylinderGeometry(0.0055, 0.0055, 0.004, 12), T("#E2402F")), 0, top + 0.03, s * 0.0125); p.rotation.x = Math.PI / 2; });
      const fr = put(pick, mesh(new TH.ConeGeometry(0.009, 0.02, 8, 1, true), T("#E8463A", null, { side: TH.DoubleSide })), 0, 0.226, 0); fr.rotation.x = Math.PI;
      put(pick, mesh(new TH.SphereGeometry(0.004, 8, 6), T("#FFC93C")), 0, 0.222, 0);
      return { group: g, size: [0.24, top + 0.06, 0.135], top, update() {} };
    }

    // =====================================================================================
    // 3/4. COINS
    const coinTex = W3.tex(256, 256, (c) => { c.fillStyle = "#F7C04A"; c.fillRect(0, 0, 256, 256); c.beginPath(); c.arc(128, 128, 96, 0, Math.PI * 2); c.fillStyle = "#FFD36A"; c.fill();
      c.fillStyle = "#D99528"; c.beginPath(); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 20 : 46; c.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } c.closePath(); c.fill();
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; c.beginPath(); c.arc(128 + Math.cos(a) * 80, 128 + Math.sin(a) * 80, 3.5, 0, Math.PI * 2); c.fill(); } }, { clamp: true });
    const coinMat = T("#FFFFFF", coinTex, { emissive: "#6A3E00", emissiveIntensity: 0.35 });
    const coinGeos = {};
    function coinGeo(r) { if (coinGeos[r]) return coinGeos[r]; const h = r * 0.12;
      const P = [[0, -h * 0.5], [r * 0.7, -h * 0.5], [r * 0.75, -h], [r * 0.92, -h], [r, -h * 0.6], [r, h * 0.6], [r * 0.92, h], [r * 0.75, h], [r * 0.7, h * 0.5], [0, h * 0.5]];
      const g = planarUV(lathe(P, 28), 2 * r, 2 * r); return (coinGeos[r] = flat(g)); }
    function makeCoin(opts = {}) { const g = newGroup(opts), r = opts.r || 0.04; const m = put(g, mesh(coinGeo(r), coinMat)); return { group: g, mesh: m, r }; }
    function makeCoinPile(n = 30, opts = {}) {
      const g = newGroup(opts), r = opts.r || 0.04, h = r * 0.24, rs = R32(opts.seed || 3), im = new TH.InstancedMesh(coinGeo(r), coinMat, n); g.add(im);
      const nStack = Math.round(n * 0.55), stacks = Math.max(1, Math.round(nStack / 9)); let k = 0;
      for (let s = 0; s < stacks && k < nStack; s++) { const a = s * 2.4, d = s ? r * (1.6 + 0.6 * Math.sqrt(s)) : 0, cx = Math.cos(a) * d, cz = Math.sin(a) * d, cnt = Math.min(nStack - k, Math.round(nStack / stacks) + (s === 0 ? 3 : 0));
        for (let j = 0; j < cnt; j++) { _e.set((rs() - 0.5) * 0.06, rs() * 6.28, (rs() - 0.5) * 0.06); _q.setFromEuler(_e); _m.compose(_p.set(cx + (rs() - 0.5) * r * 0.12, h / 2 + j * h * 0.98, cz + (rs() - 0.5) * r * 0.12), _q, _s.set(1, 1, 1)); im.setMatrixAt(k++, _m); } }
      const Rm = r * (2.4 + Math.sqrt(n - k) * 0.55);
      for (let j = 0; k < n; j++) { const a = rs() * 6.28, d = Math.sqrt(rs()) * Rm, x = Math.cos(a) * d, z = Math.sin(a) * d; const yy = Math.max(0, (1 - d / Rm)) * r * 0.9 + h / 2 + rs() * h;
        _e.set((rs() - 0.5) * 0.7, rs() * 6.28, (rs() - 0.5) * 0.7); _q.setFromEuler(_e); _m.compose(_p.set(x, yy, z), _q, _s.set(1, 1, 1)); im.setMatrixAt(k++, _m); }
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere && im.computeBoundingSphere(); return { group: g, mesh: im }; }
    function makeCoinBurst(n = 24, seed = 1, opts = {}) {
      const g = newGroup(opts), r = opts.r || 0.04, H = opts.height ?? 1.1, SP = opts.spread ?? 1.2, rs = R32(seed * 31 + 7), im = new TH.InstancedMesh(coinGeo(r), coinMat, n); im.frustumCulled = false; g.add(im);
      const C = []; for (let i = 0; i < n; i++) { const a = rs() * Math.PI * 2, d = SP * (0.25 + 0.75 * Math.sqrt(rs())), Ti = 0.5 + rs() * 0.32, hi = H * (0.55 + 0.45 * rs()), l = rs() * 0.12;
        const ax = new TH.Vector3(rs() - 0.5, rs() * 0.4, rs() - 0.5).normalize(); C.push({ dx: Math.cos(a) * d, dz: Math.sin(a) * d, Ti, hi, l, ax, w: (6 + rs() * 10) * (rs() < 0.5 ? -1 : 1), yaw: rs() * 6.28, q0: new TH.Quaternion().setFromEuler(new TH.Euler(rs() * 0.4, rs() * 6.28, rs() * 0.4)), slide: 0.08 + rs() * 0.1 }); }
      const qa = new TH.Quaternion(), qf = new TH.Quaternion();
      function update(k) { for (let i = 0; i < n; i++) { const c = C[i], tt = k - c.l; if (tt <= 0 || k <= 0) { _m.makeScale(0, 0, 0); im.setMatrixAt(i, _m); continue; }
          const sc = Math.min(1, tt / 0.03); const tf = Math.min(tt, c.Ti), u = tf / c.Ti; let x = c.dx * u, z = c.dz * u, y = 4 * c.hi * u * (1 - u) + r * 0.12;
          qa.setFromAxisAngle(c.ax, c.w * tf).premultiply(_q2.identity()).multiply(c.q0);
          if (tt > c.Ti) { const v = tt - c.Ti, b = Math.min(1, v / 0.08); const sl = c.slide * (1 - Math.exp(-v * 18)); x += c.dx * sl; z += c.dz * sl; y = r * 0.12 + Math.abs(Math.sin(v * 40)) * Math.exp(-v * 30) * c.hi * 0.05;
            qf.setFromEuler(_e.set(0, c.yaw, 0)); qa.slerp(qf, sst(b)); }
          _m.compose(_p.set(x, y, z), qa, _s.set(sc, sc, sc)); im.setMatrixAt(i, _m); }
        im.instanceMatrix.needsUpdate = true; }
      update(0); return { group: g, mesh: im, update };
    }

    // =====================================================================================
    // 5. MONEY-FLOW ARC (layer 1, unlit)
    function makeArc(from, to, opts = {}) {
      const g = newGroup(opts), A = new TH.Vector3(from.x, from.y, from.z), B = new TH.Vector3(to.x, to.y, to.z), L = A.distanceTo(B);
      const h = opts.h ?? L * 0.35, Cp = A.clone().add(B).multiplyScalar(0.5); Cp.y += 2 * h; const curve = new TH.QuadraticBezierCurve3(A, Cp, B);
      const S = opts.segs || 48, RS = 6, r = opts.r || Math.max(0.04, L * 0.007);
      const core = new TH.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, depthWrite: false }), halo = new TH.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, depthWrite: false, blending: TH.AdditiveBlending });
      const gc = new TH.TubeGeometry(curve, S, r, RS, false), gh = opts.halo === false ? null : new TH.TubeGeometry(curve, S, r * 2.6, RS, false);
      const mc = mesh(gc, core); mc.layers.set(1); mc.renderOrder = 4; g.add(mc); let mh = null; if (gh) { mh = mesh(gh, halo); mh.layers.set(1); mh.renderOrder = 3; g.add(mh); }
      const pk = W3.glow("#FFFFFF", r * 16, 0, 0, 0); g.add(pk); pk.renderOrder = 5; const bead = mesh(new TH.SphereGeometry(r * 1.9, 10, 8), new TH.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true })); bead.layers.set(1); bead.renderOrder = 5; if (opts.bead !== false) g.add(bead);
      let op = opts.opacity ?? 1, col = opts.color || "#FFC24A";
      function setColor(c) { col = c; core.color.set(mix(c, "#FFFFFF", 0.3)); halo.color.set(c); pk.material.color.set(c); bead.material.color.set(mix(c, "#FFFFFF", 0.7)); }
      function setOpacity(o) { op = o; core.opacity = o; halo.opacity = 0.4 * o; pk.material.opacity = o; bead.material.opacity = o; }
      function setProgress(a, b) { a = clamp01(a); b = clamp01(b); const i0 = Math.floor(a * S), i1 = Math.ceil(b * S), cnt = Math.max(0, i1 - i0) * RS * 6;
        gc.setDrawRange(i0 * RS * 6, cnt); if (gh) gh.setDrawRange(i0 * RS * 6, cnt); mc.visible = cnt > 0; if (mh) mh.visible = cnt > 0;
        const head = b > a + 1e-4 && b < 0.9999; pk.visible = bead.visible = head && opts.packet !== false; if (head) { const P = curve.getPoint(b); pk.position.copy(P); bead.position.copy(P); } }
      setColor(col); setOpacity(op); setProgress(0, 1);
      return { group: g, curve, setProgress, setColor, setOpacity, update(t) { if (pk.visible) { const s = r * 16 * (1 + 0.15 * Math.sin(t * 12)); pk.scale.set(s, s, 1); } } };
    }

    // =====================================================================================
    // 6. RIPPLE (flat expanding ring, layer 1)
    function makeRipple(color = "#FFFFFF", opts = {}) {
      const g = newGroup(opts), R = opts.r || 3, n = opts.rings || 2, base = opts.opacity ?? 0.85, rings = [];
      for (let i = 0; i < n; i++) { const m = mesh(new TH.RingGeometry(i ? 0.93 : 0.86, 1, 72, 1).rotateX(-Math.PI / 2), new TH.MeshBasicMaterial({ color, transparent: true, depthWrite: false, opacity: 0 })); m.layers.set(1); m.renderOrder = 6; g.add(m); rings.push(m); }
      function update(k) { rings.forEach((m, i) => { const u = (k - i * 0.16) / (1 - i * 0.16); if (u <= 0 || u >= 1) { m.visible = false; return; } m.visible = true; const s = lerp(0.06, 1, eOut(u)) * R * (1 - i * 0.18); m.scale.set(s, 1, s); m.material.opacity = Math.pow(1 - u, 1.4) * base * (i ? 0.7 : 1); }); }
      update(0); return { group: g, update };
    }

    // =====================================================================================
    // 7. FLOATING PAPER CARD
    function makeCard(text, opts = {}) {
      const g = newGroup(opts), W = opts.w || 1.6, H = opts.h || 0.7, D = opts.depth || 0.03, CW = 1024, CH = Math.round((1024 * H) / W);
      let txt = String(text), sub = opts.sub || "", col = opts.color || INK, bg = opts.bg || "#FFF4DC";
      const draw = (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); const bw = Math.round(h * 0.075), rad = h * 0.16;
        c.fillStyle = mix(bg, "#C9A878", 0.25); rr(c, bw * 0.5, h * 0.62, w - bw, h * 0.38 - bw * 0.5, rad); c.fill();
        c.fillStyle = bg; rr(c, bw * 0.5, bw * 0.5, w - bw, h * 0.86, rad); c.fill();
        c.lineWidth = bw; c.strokeStyle = opts.ink || INK; rr(c, bw / 2, bw / 2, w - bw, h - bw, rad); c.stroke();
        c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle"; const hasSub = !!sub; const px = fitFont(c, txt, w - bw * 4, Math.round(h * (hasSub ? 0.5 : 0.62)));
        c.fillText(txt, w / 2, h * (hasSub ? 0.42 : 0.53)); if (hasSub) { c.fillStyle = mix(col, bg, 0.3); fitFont(c, sub, w - bw * 5, Math.round(h * 0.16)); c.fillText(sub, w / 2, h * 0.76); } };
      const tex = W3.fontTex(CW, CH, draw, FONTS, { clamp: true });
      const geo = new TH.ExtrudeGeometry(rrShape(W, H, H * 0.16), { depth: D, bevelEnabled: false, curveSegments: 6 }); geo.translate(0, 0, -D / 2);
      { const p = geo.attributes.position, uv = geo.attributes.uv, nm = geo.attributes.normal; for (let i = 0; i < p.count; i++) { if (nm.getZ(i) > 0.9) uv.setXY(i, p.getX(i) / W + 0.5, p.getY(i) / H + 0.5); else if (nm.getZ(i) < -0.9) uv.setXY(i, 0.003, 0.003); } }
      const face = T("#FFFFFF", tex, { emissive: "#FFFFFF", emissiveMap: tex, emissiveIntensity: opts.glow ?? 0.32 });
      const m = put(g, mesh(geo, [face, T(opts.edge || "#2A2430")]));
      function setText(s, o = {}) { txt = String(s); if (o.sub !== undefined) sub = o.sub; if (o.color) col = o.color; if (o.bg) bg = o.bg; const c = tex.image.getContext("2d"); c.clearRect(0, 0, CW, CH); draw(c, CW, CH); tex.needsUpdate = true; }
      return { group: g, mesh: m, setText, size: [W, H], update(t, o = {}) { if (o.bob) { m.position.y = Math.sin(t * 2.2) * H * 0.04 * o.bob; m.rotation.z = Math.sin(t * 1.7) * 0.03 * o.bob; } },
        faceCamera(cam) { g.quaternion.copy(cam.quaternion); } };
    }

    // =====================================================================================
    // 8. STAMP + APPROVED decal
    function approvedTex(word = "APPROVED", col = "#D23A32") { return W3.fontTex(512, 220, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 14; rr(c, 12, 12, w - 24, h - 24, 26); c.stroke(); c.lineWidth = 5; rr(c, 32, 32, w - 64, h - 64, 14); c.stroke();
        c.textAlign = "center"; c.textBaseline = "middle"; fitFont(c, word, w - 110, 100); c.fillText(word, w / 2, h / 2 + 6);
        const r = R32(77); c.globalCompositeOperation = "destination-out"; for (let i = 0; i < 520; i++) { c.globalAlpha = 0.25 + 0.75 * r(); c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * r() * 4, 0, Math.PI * 2); c.fill(); }
        c.globalAlpha = 0.5; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); const y = r() * h; c.moveTo(r() * w * 0.3, y); c.lineTo(w * (0.6 + r() * 0.4), y + (r() - 0.5) * 10); c.stroke(); } c.globalCompositeOperation = "source-over"; c.globalAlpha = 1; }, FONTS, { clamp: true }); }
    function makeDecal(par, w, h, word, col) { const m = mesh(new TH.PlaneGeometry(w, h).rotateX(-Math.PI / 2), T("#FFFFFF", approvedTex(word, col), { transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })); m.layers.set(1); m.renderOrder = 3; par.add(m); return m; }
    function makeStamp(opts = {}) {
      const g = newGroup(opts), st = new TH.Group(); g.add(st); const ang = opts.angle ?? -0.16;
      put(st, mesh(slab(rrShape(0.1, 0.046, 0.006), 0.006, 0.0015), T("#5E2A32")));
      put(st, mesh(slab(rrShape(0.112, 0.056, 0.012), 0.022, 0.004), [T("#C99059"), T("#A8703E")]), 0, 0.009, 0);
      put(st, mesh(new TH.BoxGeometry(0.06, 0.004, 0.0565), T("#D23A32")), 0, 0.0255, 0);
      put(st, mesh(lathe([[0, 0], [0.019, 0], [0.019, 0.006], [0.012, 0.012], [0.01, 0.05], [0.014, 0.058], [0.0001, 0.06]], 20), T("#8A5A36")), 0, 0.035, 0);
      const kn = put(st, mesh(new TH.SphereGeometry(0.027, 22, 14), T("#D8453A")), 0, 0.112, 0); kn.scale.set(1, 0.82, 1);
      put(st, mesh(new TH.CylinderGeometry(0.02, 0.02, 0.005, 20), T("#E8C35A")), 0, 0.093, 0);
      const decal = makeDecal(g, 0.104, 0.046, opts.word || "APPROVED", opts.inkColor); decal.position.y = 0.0006; decal.rotation.y = ang; st.rotation.y = ang;
      function update(k) { k = clamp01(k); let y, sq = 1; if (k < 0.35) y = lerp(0.2, 0, eIn(k / 0.35)); else if (k < 0.5) { y = 0; sq = 1 - 0.09 * Math.sin(Math.PI * (k - 0.35) / 0.15); } else y = lerp(0, 0.22, eOut((k - 0.5) / 0.5));
        st.position.y = y + 0.0012; st.scale.set(1 + (1 - sq) * 0.4, sq, 1 + (1 - sq) * 0.4); st.rotation.z = (k > 0.5 ? (k - 0.5) * 0.3 : 0); decal.visible = k >= 0.38; decal.material.opacity = 1; }
      update(opts.k ?? 0.0); return { group: g, stamp: st, decal, update };
    }

    // =====================================================================================
    // 9. LOAN PAPER on a clipboard (lies flat, face +y, top edge toward -z)
    function makeLoanPaper(opts = {}) {
      const g = newGroup(opts), PW = 0.215, PH = 0.28, CW = 640, CH = 834;
      const grain = W3.tex(256, 256, (c) => { c.fillStyle = "#C28A54"; c.fillRect(0, 0, 256, 256); const r = R32(9); for (let i = 0; i < 70; i++) { c.strokeStyle = r() < 0.5 ? "rgba(140,90,50,0.35)" : "rgba(230,180,120,0.3)"; c.lineWidth = 1 + r() * 2; c.beginPath(); const y = r() * 256; c.moveTo(0, y); c.bezierCurveTo(80, y + (r() - 0.5) * 20, 170, y + (r() - 0.5) * 20, 256, y + (r() - 0.5) * 10); c.stroke(); } });
      grain.repeat.set(4, 3);
      put(g, mesh(slab(rrShape(0.25, 0.34, 0.016), 0.006, 0.002), [T("#FFFFFF", grain), T("#9A6A44")]));
      const sheet = W3.fontTex(CW, CH, (c, w, h) => { c.fillStyle = "#FBF6EA"; c.fillRect(0, 0, w, h); c.textBaseline = "middle";
        c.fillStyle = "#2E7D6B"; c.beginPath(); c.arc(70, 84, 26, 0, Math.PI * 2); c.fill(); c.fillStyle = "#FBF6EA"; c.font = F(24); c.textAlign = "center"; c.fillText("CI", 70, 86);
        c.textAlign = "left"; c.fillStyle = "#2E7D6B"; c.font = F(20); spaced(c, "BANK OF CRUMB ISLAND", 110, 84, 2);
        c.fillStyle = INK; c.font = F(52); c.fillText("LOAN AGREEMENT", 46, 170); c.fillRect(46, 206, w - 92, 5);
        c.fillStyle = "#EAF4EC"; rr(c, 46, 236, w - 92, 132, 18); c.fill(); c.lineWidth = 5; c.strokeStyle = "#2E7D6B"; c.stroke();
        c.fillStyle = "#2E7D6B"; c.font = F(20, "Nunito"); c.fillText("AMOUNT", 74, 268); c.fillStyle = INK; c.font = F(96); c.fillText("$1,000", 72, 326);
        const r = R32(21); c.fillStyle = "#B9B2A2"; let y = 410; for (let l = 0; l < 13; l++) { if (l === 6) { c.fillStyle = INK; c.font = F(22); c.fillText("TERMS", 46, y + 4); c.fillStyle = "#B9B2A2"; y += 38; continue; }
          let x = 46; const end = l === 5 || l === 12 ? 300 + r() * 120 : w - 46 - r() * 30; while (x < end) { const ww = 18 + r() * 60; c.fillRect(x, y - 5, Math.min(ww, end - x), 10); x += ww + 10; } y += 28; }
        c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(80, 772); c.lineTo(370, 772); c.moveTo(430, 772); c.lineTo(w - 46, 772); c.stroke();
        c.fillStyle = INK; c.font = F(40); c.fillText("X", 46, 752); c.font = F(16, "Nunito"); c.fillStyle = "#6A6458"; c.fillText("BORROWER SIGNATURE", 80, 796); c.fillText("DATE", 430, 796); }, FONTS, { clamp: true });
      const side = T("#EDE4D0"), pm = [side, side, T("#FFFFFF", sheet, { emissive: "#FFFFFF", emissiveMap: sheet, emissiveIntensity: 0.15 }), side, side, side];
      put(g, mesh(new TH.BoxGeometry(PW, 0.0016, PH, 1, 1, 1), pm), 0, 0.0108, 0.014);
      // clip
      const steel = T("#C9D3DB"), stD = T("#8C98A4");
      put(g, mesh(slab(rrShape(0.12, 0.034, 0.008), 0.008, 0.002), steel), 0, 0.011, -0.148);
      const lev = put(g, mesh(new TH.TorusGeometry(0.026, 0.0045, 8, 20, Math.PI), steel), 0, 0.024, -0.146); lev.rotation.set(-Math.PI / 2 + 0.5, 0, 0);
      [-0.045, 0.045].forEach((x) => put(g, mesh(new TH.CylinderGeometry(0.005, 0.005, 0.006, 10), stD), x, 0.022, -0.152));
      // signature (reveals left to right)
      const sigTex = W3.tex(512, 128, (c, w, h) => { c.strokeStyle = "#2B3A8C"; c.lineWidth = 7; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(14, 84);
        for (let i = 0; i <= 120; i++) { const t = i / 120, x = 14 + t * 480, y = 70 + Math.sin(t * 24) * 26 * (1 - t * 0.5) - Math.sin(t * 5) * 14 + (t > 0.85 ? (t - 0.85) * 120 : 0); c.lineTo(x, y); } c.stroke(); c.beginPath(); c.moveTo(60, 100); c.quadraticCurveTo(250, 120, 470, 92); c.stroke(); }, { clamp: true });
      const sx0 = ((90 / CW) - 0.5) * PW, sw = (270 / CW) * PW, sz = ((752 / CH) - 0.5) * PH + 0.014;
      const sig = mesh(new TH.PlaneGeometry(1, sw * 0.26).rotateX(-Math.PI / 2), T("#FFFFFF", sigTex, { transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })); sig.layers.set(1); sig.renderOrder = 3; put(g, sig, 0, 0.0122, sz);
      const dec = makeDecal(g, 0.11, 0.048, "APPROVED"); dec.position.set(0.045, 0.0124, 0.062); dec.rotation.y = 0.22;
      function setSign(k) { k = clamp01(k); sig.visible = k > 0.001; sig.scale.x = Math.max(k, 0.001) * sw; sig.position.x = sx0 + (sw * k) / 2; sigTex.repeat.x = k; sigTex.offset.x = 0; }
      function setStamp(k) { dec.visible = k > 0; dec.material.opacity = clamp01(k * 4); }
      setSign(opts.sign ?? 0); setStamp(opts.stamp ?? 0);
      return { group: g, setSign, setStamp, decal: dec, stampSpot: { x: 0.045, y: 0.0124, z: 0.062 }, update(t, o = {}) { if (o.sign !== undefined) setSign(o.sign); if (o.stamp !== undefined) setStamp(o.stamp); } };
    }

    // =====================================================================================
    // 10. PIGGY BANK (faces +x, stands on y = 0, ~0.37 m long)
    function makePiggy(opts = {}) {
      const g = newGroup(opts), body = new TH.Group(); g.add(body); const pk = T(opts.color || "#F6A7B9"), pd = T("#EC8DA5"), dk = T("#C9577A"), eye = T("#2A2230");
      const b = put(body, mesh(new TH.SphereGeometry(0.14, 32, 22), pk), 0, 0.18, 0); b.scale.set(1.25, 1, 1);
      [[0.09, 0.075], [0.09, -0.075], [-0.09, 0.075], [-0.09, -0.075]].forEach(([x, z]) => { put(body, mesh(new TH.CylinderGeometry(0.033, 0.036, 0.1, 14), pd), x, 0.05, z); put(body, mesh(new TH.CylinderGeometry(0.037, 0.037, 0.012, 14), dk), x, 0.006, z); });
      const sn = put(body, mesh(new TH.CylinderGeometry(0.048, 0.052, 0.05, 22), [pd, T("#F4B3C3"), pd]), 0.185, 0.17, 0); sn.rotation.z = -Math.PI / 2;
      [0.018, -0.018].forEach((z) => { const n = put(body, mesh(new TH.CylinderGeometry(0.008, 0.008, 0.006, 10), dk), 0.209, 0.17, z); n.rotation.z = -Math.PI / 2; n.scale.set(1, 1, 1.4); });
      [0.058, -0.058].forEach((z) => { put(body, mesh(new TH.SphereGeometry(0.015, 14, 10), eye), 0.135, 0.245, z); put(body, mesh(new TH.SphereGeometry(0.005, 8, 6), T("#FFFFFF", null, { emissive: "#FFFFFF", emissiveIntensity: 0.6 })), 0.146, 0.252, z * 0.94);
        const ck = put(body, mesh(new TH.SphereGeometry(0.022, 12, 8), T("#F27E9F")), 0.15, 0.2, z * 1.55); ck.scale.set(0.35, 0.6, 1);
        const ear = put(body, mesh(new TH.ConeGeometry(0.04, 0.075, 4), pd), 0.06, 0.315, z * 1.35); ear.rotation.set(Math.sign(z) * 0.45, 0, -0.35); });
      const tail = new TH.Curve(); tail.getPoint = (t, v = new TH.Vector3()) => v.set(-0.172 - t * 0.04, 0.2 + Math.sin(t * Math.PI * 3) * 0.018 + t * 0.02, Math.cos(t * Math.PI * 3) * 0.018 - 0.018);
      put(body, mesh(new TH.TubeGeometry(tail, 30, 0.006, 6), pd));
      const ring = rrShape(0.08, 0.026, 0.01); ring.holes.push(rrShape(0.058, 0.009, 0.0045)); put(body, mesh(slab(ring, 0.006, 0.0015), T("#E8C35A")), 0, 0.312, 0);
      put(body, mesh(new TH.BoxGeometry(0.058, 0.02, 0.009), T("#2A2030")), 0, 0.31, 0);
      return { group: g, body, slot: { x: 0, y: 0.32, z: 0 }, update(t, o = {}) { const k = o.bounce || 0; const s = 1 + Math.sin(k * Math.PI) * 0.08; body.scale.set(1 + (s - 1) * 0.5, 2 - s, 1 + (s - 1) * 0.5); } };
    }

    // =====================================================================================
    // 11. PIZZA OVEN on wheels with a red bow (front = +z, stands on y = 0)
    function makeOven(opts = {}) {
      const g = newGroup(opts), steel = T("#C3CDD6"), steelD = T("#8D99A6"), rub = T("#3A3440"), red = T("#E23B4A"), redD = T("#B82A3A");
      // cart
      put(g, mesh(new TH.BoxGeometry(1.2, 0.07, 0.86), steel), 0, 0.815, 0);
      [[-0.55, -0.38], [0.55, -0.38], [-0.55, 0.38], [0.55, 0.38]].forEach(([x, z]) => put(g, mesh(new TH.BoxGeometry(0.06, 0.62, 0.06), steelD), x, 0.5, z));
      put(g, mesh(new TH.BoxGeometry(1.14, 0.04, 0.8), steelD), 0, 0.3, 0);
      const logs = new TH.InstancedMesh(new TH.CylinderGeometry(0.055, 0.055, 0.7, 10), [T("#9A6A44"), T("#E8C08A"), T("#E8C08A")], 9), rl = R32(4);
      for (let i = 0; i < 9; i++) { const row = i < 5 ? 0 : 1, k = row ? i - 5 : i; _e.set(0, 0.04 * (rl() - 0.5), Math.PI / 2); _q.setFromEuler(_e); _m.compose(_p.set((rl() - 0.5) * 0.08, 0.375 + row * 0.095, -0.24 + k * 0.115 + row * 0.055), _q, _s.set(1, 1, 1)); logs.setMatrixAt(i, _m); }
      logs.count = 9; g.add(logs);
      const wheels = []; [[-0.5, 0.42], [0.5, 0.42], [-0.5, -0.42], [0.5, -0.42]].forEach(([x, z]) => { const w = new TH.Group(); w.position.set(x, 0.15, z); g.add(w); wheels.push(w);
        const t = put(w, mesh(new TH.CylinderGeometry(0.15, 0.15, 0.07, 24), rub)); t.rotation.x = Math.PI / 2; const hb = put(w, mesh(new TH.CylinderGeometry(0.075, 0.075, 0.085, 16), steel)); hb.rotation.x = Math.PI / 2; const c = put(w, mesh(new TH.CylinderGeometry(0.025, 0.025, 0.1, 10), red)); c.rotation.x = Math.PI / 2; });
      stick(g, [-0.62, 0.85, -0.38], [-0.82, 1.0, -0.38], 0.02, steelD); stick(g, [-0.62, 0.85, 0.38], [-0.82, 1.0, 0.38], 0.02, steelD); stick(g, [-0.82, 1.0, -0.42], [-0.82, 1.0, 0.42], 0.028, T("#2A2430"));
      // tiled base block
      const tile = W3.tex(256, 128, (c, w, h) => { c.fillStyle = "#F2E6C8"; c.fillRect(0, 0, w, h); const r = R32(2); for (let y = 0; y < 4; y++) for (let x = 0; x < 8; x++) { c.fillStyle = ["#2F8F8A", "#3AA39A", "#F2E6C8", "#E9DDBA"][Math.floor(r() * 4)]; c.fillRect(x * 32 + 3, y * 32 + 3, 26, 26); } });
      tile.repeat.set(2, 1); put(g, mesh(new TH.BoxGeometry(1.04, 0.24, 0.8), T("#FFFFFF", tile)), 0, 0.97, 0);
      put(g, mesh(new TH.BoxGeometry(1.1, 0.04, 0.86), T("#C8553D")), 0, 1.105, 0);
      // dome with mosaic + shine
      const mos = W3.tex(512, 256, (c, w, h) => { c.fillStyle = "#F2E6C8"; c.fillRect(0, 0, w, h); const r = R32(8); for (let y = 0; y < 16; y++) for (let x = 0; x < 32; x++) { const k = r(); c.fillStyle = k < 0.55 ? "#C8553D" : k < 0.85 ? "#D9684C" : "#E8A04A"; c.fillRect(x * 16 + 1.5, y * 16 + 1.5, 13, 13); } });
      const domeY = 1.125, DR = 0.47, dome = put(g, mesh(new TH.SphereGeometry(DR, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2), T("#FFFFFF", mos)), 0, domeY, -0.02); dome.scale.set(1, 0.84, 0.92);
      const shine = put(g, mesh(new TH.SphereGeometry(DR * 1.006, 12, 6, -0.9, 0.36, 0.42, 0.42), new TH.MeshBasicMaterial({ color: "#FFF6E8", transparent: true, opacity: 0.75, fog: true })), 0, domeY, -0.02); shine.scale.copy(dome.scale); shine.layers.set(1);
      // vestibule + arch mouth
      const arch = (w, hh) => { const s = new TH.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, hh - w / 2); s.absarc(0, hh - w / 2, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, 0); return s; };
      const vg = new TH.ExtrudeGeometry(arch(0.56, 0.42), { depth: 0.24, bevelEnabled: false, curveSegments: 16 }); put(g, mesh(vg, [T("#C8553D"), T("#B5472F")]), 0, domeY, 0.2);
      const trimS = arch(0.52, 0.38); trimS.holes.push((() => { const s = arch(0.36, 0.27); return new TH.Path(s.getPoints(16).map((p) => p.setY(p.y + 0.025))); })());
      put(g, mesh(new TH.ExtrudeGeometry(trimS, { depth: 0.03, bevelEnabled: false, curveSegments: 16 }), T("#E8B54A", null, { emissive: "#5A3A00", emissiveIntensity: 0.3 })), 0, domeY, 0.44);
      put(g, mesh(new TH.ShapeGeometry(arch(0.37, 0.3), 16), T("#2A1A1E")), 0, domeY, 0.443);
      const fire = put(g, mesh(new TH.ShapeGeometry((() => { const s = new TH.Shape(); s.moveTo(-0.15, 0); for (let i = 0; i <= 8; i++) { const x = -0.15 + (i / 8) * 0.3; s.lineTo(x, i % 2 ? 0.11 : 0.05); } s.lineTo(0.15, 0); return s; })()), T("#FF8A2A", null, { emissive: "#FF6A1A", emissiveIntensity: 1.2 })), 0, domeY + 0.03, 0.446);
      const glow = W3.glow("#FF9A3A", 0.6, 0, domeY + 0.12, 0.52); g.add(glow);
      // chimney
      put(g, mesh(new TH.CylinderGeometry(0.055, 0.06, 0.5, 16), steel), 0.12, domeY + 0.5, -0.16); put(g, mesh(new TH.CylinderGeometry(0.075, 0.075, 0.05, 16), steelD), 0.12, domeY + 0.27, -0.16);
      put(g, mesh(new TH.ConeGeometry(0.12, 0.08, 16), steelD), 0.12, domeY + 0.8, -0.16);
      // ribbon bands + bow
      [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((ph) => { const b = put(g, mesh(new TH.SphereGeometry(DR * 1.014, 4, 12, ph - 0.075, 0.15, 0, Math.PI / 2), red), 0, domeY, -0.02); b.scale.copy(dome.scale); });
      const bowY = domeY + DR * 0.84 + 0.02, bow = new TH.Group(); bow.position.set(0, bowY, -0.02); g.add(bow);
      put(bow, mesh(new TH.SphereGeometry(0.05, 16, 10), red), 0, 0.03, 0);
      [1, -1].forEach((s) => { const l = put(bow, mesh(new TH.TorusGeometry(0.085, 0.032, 10, 24), red), s * 0.1, 0.08, 0); l.rotation.set(0, 0.25 * s, s * 0.55); l.scale.set(1, 0.7, 1);
        const tl = new TH.Shape(); tl.moveTo(-0.03, 0); tl.lineTo(0.03, 0); tl.lineTo(0.035, -0.2); tl.lineTo(0, -0.17); tl.lineTo(-0.035, -0.2); tl.closePath(); const tm = put(bow, mesh(new TH.ExtrudeGeometry(tl, { depth: 0.012, bevelEnabled: false }), redD), s * 0.03, 0.02, 0.04); tm.rotation.set(-0.5, 0, s * 0.5); });
      // "NEW!" tag
      const tag = put(g, mesh(new TH.BoxGeometry(0.2, 0.1, 0.008), [T("#F2E6C8"), T("#F2E6C8"), T("#F2E6C8"), T("#F2E6C8"), T("#FFFFFF", W3.label("NEW!", { w: 256, h: 128, size: 82, bg: "#FFF4DC", color: "#D23A32" })), T("#F2E6C8")]), 0.36, domeY + 0.3, 0.42);
      tag.rotation.set(0.05, -0.25, 0.14); stick(g, [0.31, domeY + 0.35, 0.42], [0.14, bowY + 0.06, 0.02], 0.004, T("#D23A32"));
      return { group: g, wheels, update(t, env = {}) { const n = env.night || 0, f = 1 + 0.18 * Math.sin(t * 13.1) + 0.1 * Math.sin(t * 7.3 + 1); fire.material.emissiveIntensity = 1.1 * f; glow.material.opacity = (0.55 + 0.45 * n) * f; const s = 0.6 + 0.5 * n; glow.scale.set(s, s, 1); if (env.roll !== undefined) wheels.forEach((w) => (w.rotation.z = -env.roll / 0.15)); } };
    }

    // =====================================================================================
    // 12. YAP DIORAMA at (600, 0, 0)
    function buildYap() {
      const D = new TH.Group(); D.position.set(600, 0, 0); W3.scene.add(D);
      const WATER = -0.35, IC = { x: 0, z: -8 }, SX = 1.3, rs = R32(606);
      const prof = [[0, 0.6], [3, 0.57], [6, 0.49], [9, 0.35], [11.5, 0.2], [13.3, 0.04], [14.4, -0.14], [15.3, -0.42], [16.6, -0.85], [18.6, -1.6], [21.5, -2.6], [27, -3.8]];
      const profR = prof.slice().reverse();
      function islandY(x, z) { const r = Math.hypot((x - IC.x) / SX, z - IC.z); for (let i = 1; i < prof.length; i++) if (r <= prof[i][0]) { const a = prof[i - 1], b = prof[i], k = (r - a[0]) / (b[0] - a[0]); return lerp(a[1], b[1], k); } return -3.8; }
      // island texture: planar (x,z) over a 72 m square, painted sand / wet band / wavy grass
      const ISZ = 72, TXN = 2048, toC = (x, z) => [(x / ISZ + 0.5) * TXN, (z / ISZ + 0.5) * TXN];
      const ell = (c, rad, wob) => { c.beginPath(); for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2, r = rad + (wob ? wob(a) : 0); const [x, y] = toC(Math.cos(a) * r * SX, Math.sin(a) * r); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); };
      const islTex = W3.tex(TXN, TXN, (c, w, h) => { const r = R32(17); c.fillStyle = "#CDBB8A"; c.fillRect(0, 0, w, h);
        ell(c, 15.1); c.fillStyle = "#E1BF82"; c.fill(); ell(c, 14.55, (a) => 0.12 * Math.sin(a * 31)); c.fillStyle = "#F2D9A0"; c.fill();
        for (let i = 0; i < 26000; i++) { const x = r() * w, y = r() * h; c.fillStyle = r() < 0.5 ? "rgba(255,244,210,0.6)" : "rgba(190,150,95,0.32)"; c.fillRect(x, y, 1.5 + r() * 2.5, 1.5 + r() * 2); }
        for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h; c.fillStyle = "rgba(255,248,225,0.35)"; c.beginPath(); c.ellipse(x, y, 20 + r() * 50, 8 + r() * 20, r() * 3, 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = "rgba(255,255,255,0.55)"; c.lineWidth = 5; ell(c, 14.75, (a) => 0.1 * Math.sin(a * 19)); c.stroke();
        const gw = (a) => 0.45 * Math.sin(a * 9) + 0.25 * Math.sin(a * 23 + 1); ell(c, 7.2, gw); c.fillStyle = "#7DBA5A"; c.fill();
        c.save(); ell(c, 7.2, gw); c.clip(); for (let i = 0; i < 70; i++) { const [x, y] = toC((r() - 0.5) * 18, (r() - 0.5) * 14); c.fillStyle = r() < 0.5 ? "rgba(150,210,110,0.45)" : "rgba(90,160,70,0.4)"; c.beginPath(); c.ellipse(x, y, 30 + r() * 70, 20 + r() * 40, r() * 3, 0, Math.PI * 2); c.fill(); }
          for (let i = 0; i < 16000; i++) { const [x, y] = toC((r() - 0.5) * 22, (r() - 0.5) * 16); const a = -Math.PI / 2 + (r() - 0.5) * 1.2, l = 5 + r() * 8; c.strokeStyle = r() < 0.5 ? "#68A846" : "#97CF6E"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); } c.restore();
        c.strokeStyle = "#5E9E44"; c.lineWidth = 7; ell(c, 7.2, gw); c.stroke(); });
      const islG = lathe(profR, 72); islG.scale(SX, 1, 1); planarUV(islG, ISZ, ISZ); const isl = put(D, mesh(islG, T("#FFFFFF", islTex)), IC.x, 0, IC.z);
      // seabed + water (vertex-coloured lagoon, translucent)
      put(D, mesh(new TH.CircleGeometry(420, 40).rotateX(-Math.PI / 2), T("#2C8E9C")), 0, -4.7, 0);
      const radii = [0, 10, 13.5, 15, 16.2, 17.5, 19.5, 22, 26, 32, 40, 52, 70, 95, 130, 180, 250, 400], NS = 72, wp = [], wc = [], wuv = [], wi = [], col = new TH.Color();
      const wcol = (rad) => { const st = [[14.5, "#A6EFE0"], [17, "#7FE0D6"], [22, "#4CC9CC"], [34, "#33B0C0"], [70, "#2A9DB4"], [400, "#2289A8"]]; if (rad <= st[0][0]) return col.set(st[0][1]); for (let i = 1; i < st.length; i++) if (rad <= st[i][0]) return col.set(st[i - 1][1]).lerp(new TH.Color(st[i][1]), (rad - st[i - 1][0]) / (st[i][0] - st[i - 1][0])); return col.set("#2289A8"); };
      radii.forEach((rad, j) => { for (let i = 0; i <= NS; i++) { const a = (i / NS) * Math.PI * 2, x = Math.cos(a) * rad * SX + IC.x, z = -Math.sin(a) * rad + IC.z; wp.push(x, 0, z); wuv.push(x / 9, z / 9); wcol(rad); wc.push(col.r, col.g, col.b);
          if (j < radii.length - 1 && i < NS) { const k = j * (NS + 1) + i, k2 = k + NS + 1; wi.push(k, k2, k + 1, k + 1, k2, k2 + 1); } } });
      const wg = new TH.BufferGeometry(); wg.setAttribute("position", new TH.Float32BufferAttribute(wp, 3)); wg.setAttribute("color", new TH.Float32BufferAttribute(wc, 3)); wg.setAttribute("uv", new TH.Float32BufferAttribute(wuv, 2)); wg.setIndex(wi); wg.computeVertexNormals();
      const wTex = W3.tex(256, 256, (c, w, h) => { c.fillStyle = "#E4EEF0"; c.fillRect(0, 0, w, h); const r = R32(23); c.strokeStyle = "#FFFFFF"; c.lineWidth = 3; c.lineCap = "round"; for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, l = 14 + r() * 26; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + l / 2, y - 5, x + l, y); c.stroke(); } });
      const waterMat = T("#FFFFFF", wTex, { vertexColors: true, transparent: true, opacity: 0.87 }), water = put(D, mesh(wg, waterMat), 0, WATER, 0); water.renderOrder = -2;
      // shore foam (polar ring, layer 1)
      const foamTex = W3.tex(1024, 64, (c, w, h) => { c.clearRect(0, 0, w, h); const r = R32(31); c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 8) c.lineTo(x, h * (0.45 + 0.18 * Math.sin(x * 0.05) + 0.1 * Math.sin(x * 0.13))); c.lineTo(w, h); c.closePath(); c.fill();
        c.globalCompositeOperation = "destination-out"; for (let i = 0; i < 420; i++) { c.beginPath(); c.arc(r() * w, h * (0.55 + r() * 0.45), 1 + r() * 3, 0, Math.PI * 2); c.fill(); } c.globalCompositeOperation = "source-over"; });
      const foam = mesh(polarRing(14.55, 15.9, 160, 6), new TH.MeshBasicMaterial({ color: "#FFFFFF", map: foamTex, transparent: true, depthWrite: false, opacity: 0.85 })); foam.layers.set(1); foam.renderOrder = 2; put(D, foam, IC.x, WATER + 0.02, IC.z); foam.scale.set(SX, 1, 1);
      // background islets
      [[-70, -95, 1.0], [86, -120, 0.8], [-150, -60, 0.6]].forEach(([x, z, s]) => { const m = put(D, mesh(lathe([[16, -3], [10, -0.6], [7, 0.1], [3.5, 0.45], [0, 0.55]], 24), T("#E9CF92")), x, 0, z); m.scale.set(s * 1.4, 1, s); const gm = put(D, mesh(lathe([[5.2, 0.2], [3, 0.6], [0, 0.75]], 20), T("#7DBA5A")), x, 0, z); gm.scale.set(s * 1.4, 1, s); });
      // ---------- palms (instanced trunks / fronds / coconuts) ----------
      const palms = [[-7, -4, 6.0, 1.6, 0.9], [-2.5, -9.5, 6.8, -0.6, 0.4], [7.8, -5.2, 5.6, 1.4, 1.0], [-11, -12, 6.4, -1.2, -0.3], [10.5, -13, 7.0, 0.8, -0.2], [1.2, -16, 6.2, 0.2, -1.0], [-14.5, -5.5, 5.2, -1.5, 0.7],
        [-70, -95, 5.5, 0.8, 0.4], [-66, -97, 4.6, -0.7, 0.2], [86, -120, 5.0, 0.6, 0.5], [-150, -60, 4.0, 0.4, 0.3]];
      const NSEG = 11, NFR = 9, trunkG = new TH.CylinderGeometry(0.15, 0.2, 1, 9); trunkG.translate(0, 0.5, 0);
      const trunks = new TH.InstancedMesh(trunkG, T("#A9825A"), palms.length * NSEG);
      // frond geometry: serrated leaflets on a drooping midrib along +x, both sides
      const frG = (() => { const P = [], n = 13, mid = (s) => [s, 0.42 * s - 0.82 * s * s, 0]; const add = (a, b, c) => P.push(...a, ...b, ...c);
        for (let i = 0; i < n; i++) { const s0 = i / n, s1 = (i + 1) / n, m0 = mid(s0), m1 = mid(s1); const w = 0.3 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.1 + s1 * 0.95)), 0.7);
          [1, -1].forEach((sd) => { const tp = mid(Math.min(1.02, s1 + 0.07)); const T3 = [tp[0], tp[1] - w * 0.42, sd * w]; if (sd > 0) { add(m0, m1, T3); add(m0, T3, m1); } else { add(m0, T3, m1); add(m0, m1, T3); } }); }
        const g = new TH.BufferGeometry(); g.setAttribute("position", new TH.Float32BufferAttribute(P, 3)); g.computeVertexNormals(); return g; })();
      const fronds = new TH.InstancedMesh(frG, T("#FFFFFF"), palms.length * NFR); fronds.frustumCulled = false;
      const nuts = new TH.InstancedMesh(new TH.SphereGeometry(0.17, 10, 8), T("#7A5232"), palms.length * 3);
      const crowns = new TH.InstancedMesh(new TH.SphereGeometry(0.26, 10, 8), T("#6E8A3A"), palms.length);
      const frondBase = []; const fc = ["#4FA548", "#5DB552", "#3F9640", "#67BD58"];
      palms.forEach(([x, z, hgt, lx, lz], pi) => { const by = (Math.abs(x) > 40 ? 0.5 : islandY(x, z)) - 0.15, B = new TH.Vector3(x, by, z), Tp = new TH.Vector3(x + lx, by + hgt, z + lz), C = new TH.Vector3(x, by + hgt * 0.6, z);
        const cv = new TH.QuadraticBezierCurve3(B, C, Tp);
        for (let k = 0; k < NSEG; k++) { const s = k / NSEG, a = cv.getPoint(s), b = cv.getPoint((k + 1) / NSEG), d = b.clone().sub(a), L = d.length(); _q.setFromUnitVectors(UP, d.normalize()); const sc = lerp(1.15, 0.72, s); _m.compose(a, _q, _s.set(sc, L * 1.12, sc)); trunks.setMatrixAt(pi * NSEG + k, _m); }
        _m.compose(Tp, _q.identity(), _s.set(1, 0.8, 1)); crowns.setMatrixAt(pi, _m);
        for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2 + pi; _m.compose(_p.set(Tp.x + Math.cos(a) * 0.22, Tp.y - 0.26, Tp.z + Math.sin(a) * 0.22), _q.identity(), _s.set(1, 1, 1)); nuts.setMatrixAt(pi * 3 + k, _m); }
        for (let k = 0; k < NFR; k++) { const yaw = (k / NFR) * Math.PI * 2 + rs() * 0.4 + pi, pitch = (k % 3 === 0 ? 0.55 : k % 3 === 1 ? 0.15 : -0.12) + (rs() - 0.5) * 0.15, len = (2.6 + rs() * 0.8) * (hgt / 6.2);
          frondBase.push({ P: Tp.clone(), yaw, pitch, len, ph: rs() * 6.28 }); fronds.setColorAt(pi * NFR + k, new TH.Color(fc[(k + pi) % 4])); } });
      [trunks, crowns, nuts].forEach((m) => { m.instanceMatrix.needsUpdate = true; D.add(m); }); D.add(fronds); fronds.instanceColor.needsUpdate = true;
      function swayPalms(t) { frondBase.forEach((f, i) => { _e.set(0, f.yaw, f.pitch + 0.045 * Math.sin(t * 1.3 + f.ph) + 0.02 * Math.sin(t * 2.9 + f.ph * 2), "YZX"); _q.setFromEuler(_e); _m.compose(f.P, _q, _s.set(f.len, f.len, f.len)); fronds.setMatrixAt(i, _m); }); fronds.instanceMatrix.needsUpdate = true; }
      swayPalms(0);
      // ---------- hut ----------
      const hut = new TH.Group(), hx = 4.6, hz = -12.4; hut.position.set(hx, islandY(hx, hz) - 0.05, hz); D.add(hut);
      const plank = W3.tex(256, 256, (c, w, h) => { c.fillStyle = "#C99A62"; c.fillRect(0, 0, w, h); const r = R32(5); for (let i = 0; i < 8; i++) { c.fillStyle = r() < 0.5 ? "#D1A46C" : "#C0905A"; c.fillRect(i * 32 + 2, 0, 28, h); c.fillStyle = "#7E5532"; c.fillRect(i * 32, 0, 3, h);
          c.strokeStyle = "rgba(120,80,45,0.35)"; c.lineWidth = 1.5; for (let k = 0; k < 4; k++) { c.beginPath(); const x = i * 32 + 6 + r() * 20; c.moveTo(x, 0); c.bezierCurveTo(x + 4, h * 0.3, x - 4, h * 0.6, x + 2, h); c.stroke(); } } });
      const wood = T("#9A6A44"), woodD = T("#7A5232");
      put(hut, mesh(new TH.BoxGeometry(4.8, 0.22, 3.5), T("#B88A5A")), 0, 0.42, -0.1);
      [[-2.2, -1.75], [2.2, -1.75], [-2.2, 1.5], [2.2, 1.5], [0, 1.5], [0, -1.75]].forEach(([x, z]) => put(hut, mesh(new TH.BoxGeometry(0.2, 0.5, 0.2), woodD), x, 0.18, z));
      put(hut, mesh(new TH.BoxGeometry(4.0, 2.3, 3.0), T("#FFFFFF", plank)), 0, 1.68, -0.1);
      [[-2, 1.4], [2, 1.4], [-2, -1.6], [2, -1.6]].forEach(([x, z]) => put(hut, mesh(new TH.BoxGeometry(0.22, 2.4, 0.22), wood), x, 1.72, z));
      put(hut, mesh(new TH.BoxGeometry(4.25, 0.18, 0.24), wood), 0, 2.86, 1.42);
      const doorMat = T("#3A2A22", null, { emissive: "#FFB25A", emissiveIntensity: 0 }); put(hut, mesh(new TH.BoxGeometry(1.0, 1.9, 0.08), doorMat), -1.0, 1.48, 1.39);
      [[-1.55, 1.48, 0.12, 1.98], [-0.45, 1.48, 0.12, 1.98]].forEach(([x, y, w, hh]) => put(hut, mesh(new TH.BoxGeometry(w, hh, 0.14), woodD), x, y, 1.42)); put(hut, mesh(new TH.BoxGeometry(1.24, 0.14, 0.14), woodD), -1.0, 2.47, 1.42);
      const winMat = T("#3A2A22", null, { emissive: "#FFB25A", emissiveIntensity: 0 }); put(hut, mesh(new TH.BoxGeometry(0.08, 0.62, 0.8), winMat), 2.0, 1.9, -0.1);
      put(hut, mesh(new TH.BoxGeometry(0.22, 0.1, 1.0), woodD), 2.06, 1.55, -0.1); const sh = put(hut, mesh(new TH.BoxGeometry(0.06, 0.7, 0.42), T("#2F8F8A")), 2.2, 1.9, 0.56); sh.rotation.y = -0.9;
      const thatch = W3.tex(256, 256, (c, w, h) => { c.fillStyle = "#D9B266"; c.fillRect(0, 0, w, h); const r = R32(12); for (let i = 0; i < 700; i++) { const x = r() * w, y = r() * h; c.strokeStyle = ["#C99A4A", "#E8C77E", "#B8893E", "#EDD08E"][Math.floor(r() * 4)]; c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 3, y + 14 + r() * 22); c.stroke(); }
        for (let k = 0; k < 4; k++) { c.fillStyle = "rgba(120,80,30,0.45)"; c.fillRect(0, k * 64 + 56, w, 8); } }); thatch.repeat.set(4, 1);
      const roofM = T("#FFFFFF", thatch); const r1 = put(hut, mesh(new TH.CylinderGeometry(0.01, 3.9, 2.2, 4, 1), roofM), 0, 3.9, -0.1); r1.rotation.y = Math.PI / 4; r1.scale.set(1, 1, 0.82);
      const r0 = put(hut, mesh(new TH.CylinderGeometry(3.9, 4.05, 0.26, 4, 1, true), T("#C49A48", null, { side: TH.DoubleSide })), 0, 2.72, -0.1); r0.rotation.y = Math.PI / 4; r0.scale.set(1, 1, 0.82);
      const r2 = put(hut, mesh(new TH.CylinderGeometry(0.01, 1.7, 1.1, 4, 1), roofM), 0, 4.62, -0.1); r2.rotation.y = Math.PI / 4; r2.scale.set(1, 1, 0.82);
      put(hut, mesh(new TH.SphereGeometry(0.2, 8, 6), T("#B8893E")), 0, 5.15, -0.1);
      const lantern = put(hut, mesh(new TH.BoxGeometry(0.18, 0.26, 0.18), T("#E8B54A", null, { emissive: "#FFB24A", emissiveIntensity: 0.2 })), -2.0, 2.3, 1.58);
      const lglow = W3.glow("#FFB24A", 1.6, 0, 0, 0); hut.add(lglow); lglow.position.set(-2.0, 2.3, 1.75);
      const plight = new TH.PointLight(0xffb060, 0, 14, 1.6); plight.position.set(-1.5, 2.4, 2.6); hut.add(plight);
      // ---------- rai stones ----------
      const limeTex = W3.tex(512, 256, (c, w, h) => { c.fillStyle = "#E9E1CB"; c.fillRect(0, 0, w, h); const r = R32(44); for (let i = 0; i < 160; i++) { c.fillStyle = r() < 0.6 ? "rgba(205,192,160,0.55)" : "rgba(250,246,232,0.6)"; c.beginPath(); c.ellipse(r() * w, r() * h, 4 + r() * 22, 3 + r() * 12, r() * 3, 0, Math.PI * 2); c.fill(); }
        for (let i = 0; i < 900; i++) { c.fillStyle = r() < 0.75 ? "rgba(150,135,105,0.55)" : "rgba(130,150,120,0.45)"; c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * r() * 3.2, 0, Math.PI * 2); c.fill(); } }); limeTex.repeat.set(3, 1);
      const limeM = T("#FFFFFF", limeTex);
      function raiGeo(Dm) { const ro = Dm / 2, ri = Dm * 0.11, t1 = 0.06 + Dm * 0.085, t2 = Dm * 0.045, b = Math.min(0.08, t2 * 0.6);
        const P = [[ro - b, t2], [ro * 0.6, (t1 + t2) * 0.52], [ri + 0.06, t1], [ri, t1 - 0.05], [ri - 0.01, 0], [ri, -t1 + 0.05], [ri + 0.06, -t1], [ro * 0.6, -(t1 + t2) * 0.52], [ro - b, -t2], [ro, -t2 + b], [ro + 0.005, 0], [ro, t2 - b], [ro - b, t2]];
        const g = lathe(P, 44); g.rotateX(Math.PI / 2); return g; }
      const stones = [];
      function raiStone(Dm, par) { const m = mesh(raiGeo(Dm), limeM); par.add(m); return m; }
      [[3.5, -2.5, -8.75, -0.17, 0.08], [2.4, 4.6 + 0.9, -10.66, -0.2, 0.0], [1.6, -7.0, -3.5, -0.2, 0.18], [1.15, 7.7, -4.75, -0.22, -0.25]].forEach(([Dm, x, z, lean, yaw]) => {
        const m = raiStone(Dm, D); m.rotation.order = "YXZ"; m.rotation.set(lean, yaw, 0); const R = Dm / 2; m.position.set(x, islandY(x, z) + R * Math.cos(lean) - 0.1 - Dm * 0.03, z); stones.push({ x: 600 + x, y: m.position.y, z, d: Dm }); });
      // ---------- details: rocks, grass tufts, bushes + flowers, starfish, beached canoe ----------
      const rocks = new TH.InstancedMesh(new TH.DodecahedronGeometry(1, 0), T("#FFFFFF"), 18); let nr = 0;
      for (let i = 0; i < 18; i++) { const a = -0.2 + (i / 18) * Math.PI * 2 + rs() * 0.2, rad = 14.6 + rs() * 1.2, x = Math.cos(a) * rad * SX, z = IC.z - Math.sin(a) * rad; if (z > 5 && Math.abs(x) < 6) continue; const s = 0.25 + rs() * 0.55;
        _e.set(rs() * 3, rs() * 3, rs() * 3); _q.setFromEuler(_e); _m.compose(_p.set(x, islandY(x, z) + s * 0.25, z), _q, _s.set(s * 1.3, s * 0.8, s)); rocks.setMatrixAt(nr, _m); rocks.setColorAt(nr++, new TH.Color(rs() < 0.5 ? "#9AA2AC" : "#848D99")); }
      rocks.count = nr; D.add(rocks);
      const tuftG = new TH.ConeGeometry(0.07, 0.65, 4, 1); tuftG.translate(0, 0.32, 0); const NT = 34 * 4, tufts = new TH.InstancedMesh(tuftG, T("#7CC251"), NT); let ti = 0;
      for (let i = 0; i < 34; i++) { const a = rs() * Math.PI * 2, rad = 6.5 + rs() * 3.5, x = Math.cos(a) * rad * SX, z = IC.z - Math.sin(a) * rad, y = islandY(x, z) - 0.05;
        for (let k = 0; k < 4; k++) { _e.set((rs() - 0.5) * 0.9, rs() * 6, (rs() - 0.5) * 0.9); _q.setFromEuler(_e); const s = 0.7 + rs() * 0.6; _m.compose(_p.set(x + (rs() - 0.5) * 0.3, y, z + (rs() - 0.5) * 0.3), _q, _s.set(s, s, s)); tufts.setMatrixAt(ti++, _m); } }
      D.add(tufts);
      const bushes = new TH.InstancedMesh(new TH.IcosahedronGeometry(1, 1), T("#4E9A42"), 9), flowers = new TH.InstancedMesh(new TH.SphereGeometry(0.12, 8, 6), T("#E8463A", null, { emissive: "#8A1A10", emissiveIntensity: 0.2 }), 30); let fi = 0;
      [[1.2, -10.4], [2.0, -10.0], [8.3, -11.0], [-4.6, -11.5], [-5.4, -11.0], [9.5, -8.5], [-9.5, -8.0], [-1, -14], [12, -6]].forEach(([x, z], i) => { const s = 0.55 + (i % 3) * 0.18, y = islandY(x, z) + s * 0.55; _m.compose(_p.set(x, y, z), _q.identity(), _s.set(s * 1.2, s, s * 1.1)); bushes.setMatrixAt(i, _m);
        for (let k = 0; k < 3 && fi < 30; k++) { const a = rs() * 6.28; _m.compose(_p.set(x + Math.cos(a) * s * 0.95, y + (rs() - 0.2) * s * 0.6, z + Math.sin(a) * s * 0.95), _q.identity(), _s.set(1, 1, 1)); flowers.setMatrixAt(fi++, _m); } });
      flowers.count = fi; D.add(bushes, flowers);
      const star = new TH.Shape(); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.1 : 0.26; i ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(Math.cos(a) * r, Math.sin(a) * r); } star.closePath();
      [[2.6, 4.6, 0.3], [-3.2, 5.6, 1.4]].forEach(([x, z, r]) => { const m = put(D, mesh(slab(star, 0.04, 0.02, 2), T("#F08A5D")), x, islandY(x, z) - 0.01, z); m.rotation.y = r; });
      const canoe = new TH.Group(); canoe.position.set(9.5, islandY(9.5, 2.4) + 0.12, 2.4); canoe.rotation.set(0, 0.55, 0.05); D.add(canoe);
      const hull = put(canoe, mesh(new TH.SphereGeometry(1, 22, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), T("#9A6A44")), 0, 0.42, 0); hull.scale.set(2.6, 0.5, 0.42);
      const deck = put(canoe, mesh(new TH.CircleGeometry(1, 22).rotateX(-Math.PI / 2), T("#5A3A26")), 0, 0.4, 0); deck.scale.set(2.5, 1, 0.38);
      put(canoe, mesh(new TH.TorusGeometry(1, 0.05, 6, 28).rotateX(Math.PI / 2), T("#C8553D")), 0, 0.43, 0).scale.set(2.58, 1, 0.42);
      const fl = put(canoe, mesh(new TH.SphereGeometry(1, 14, 8), T("#B88A5A")), 0, 0.12, 1.7); fl.scale.set(1.5, 0.14, 0.15);
      [-0.9, 0.9].forEach((x) => { stick(canoe, [x, 0.48, 0.2], [x, 0.36, 1.72], 0.045, woodD); stick(canoe, [x, 0.1, 1.7], [x, 0.4, 1.7], 0.04, woodD); });
      // ---------- raft + big rai stone ----------
      const RZ = 20, raft = new TH.Group(); raft.position.set(0, WATER, RZ); D.add(raft);
      const bam = W3.tex(64, 512, (c, w, h) => { c.fillStyle = "#CFAE62"; c.fillRect(0, 0, w, h); for (let i = 0; i < 11; i++) { const y = (i + 0.5) * (h / 11); c.fillStyle = "#9A7A3A"; c.fillRect(0, y - 3, w, 6); c.fillStyle = "#E3C988"; c.fillRect(0, y + 3, w, 3); } c.fillStyle = "rgba(255,240,190,0.4)"; c.fillRect(0, 0, w * 0.3, h); });
      const logG = new TH.CylinderGeometry(0.17, 0.17, 5.4, 12); logG.rotateZ(Math.PI / 2); const logs = new TH.InstancedMesh(logG, [T("#FFFFFF", bam), T("#E3C988"), T("#E3C988")], 9);
      for (let i = 0; i < 9; i++) { _m.compose(_p.set((i % 2 ? 0.12 : -0.08), 0.05, -1.36 + i * 0.34), _q.identity(), _s.set(1, 1, 1)); logs.setMatrixAt(i, _m); } raft.add(logs);
      [-2.2, 0, 2.2].forEach((x) => { const b = put(raft, mesh(new TH.CylinderGeometry(0.09, 0.09, 3.3, 10), T("#B08A48")), x, 0.29, 0); b.rotation.x = Math.PI / 2; });
      [-0.27, 0.27].forEach((z) => put(raft, mesh(new TH.BoxGeometry(0.7, 0.2, 0.18), woodD), 0, 0.45, z));
      put(raft, mesh(new TH.CylinderGeometry(0.07, 0.08, 4.4, 10), wood), 2.3, 2.4, 0.95);
      const sailS = new TH.Shape(); sailS.moveTo(0, 0); sailS.quadraticCurveTo(-0.5, 1.9, 0.3, 3.7); sailS.quadraticCurveTo(1.2, 2.5, 2.6, 3.1); sailS.quadraticCurveTo(1.7, 1.2, 0, 0);
      const weave = W3.tex(128, 128, (c, w, h) => { c.fillStyle = "#EAD6A4"; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#D9BE84" : "#EFDDB0"; c.fillRect(i * 16, 0, 8, h); c.fillStyle = "rgba(150,110,60,0.25)"; c.fillRect(0, i * 16, w, 2); } c.fillStyle = "#C8553D"; c.fillRect(0, 56, w, 10); });
      weave.repeat.set(0.8, 0.8); const sail = put(raft, mesh(new TH.ExtrudeGeometry(sailS, { depth: 0.03, bevelEnabled: false, curveSegments: 14 }), [T("#FFFFFF", weave), T("#8A6236")]), 2.32, 0.9, 0.95); sail.rotation.y = -0.7;
      const pad = put(raft, mesh(new TH.BoxGeometry(1.6, 0.05, 0.16), wood), -1.6, 0.34, -1.0); pad.rotation.y = 0.4; put(raft, mesh(new TH.TorusGeometry(0.22, 0.06, 6, 16).rotateX(Math.PI / 2), T("#C9A86A")), -1.9, 0.3, 0.9);
      const BIG = 3.0, BR = BIG / 2, deckY = 0.37, bigRig = new TH.Group(); D.add(bigRig); const big = raiStone(BIG, bigRig);
      const ropes = new TH.Group(); raft.add(ropes); const ropeM = T("#C9A86A"); [[-1.7, -1.4], [1.7, -1.4], [-1.7, 1.4], [1.7, 1.4]].forEach(([x, z]) => stick(ropes, [0, deckY + BR + 0.25, z * 0.12], [x, 0.3, z], 0.03, ropeM, 5));
      // ---------- splash FX ----------
      const rip = [0, 1, 2].map((i) => makeRipple("#FFFFFF", { parent: D, r: 7 + i * 2.5, rings: 2, opacity: 0.8 })), wake = makeRipple("#E8FFFB", { parent: D, r: 4.2, rings: 1, opacity: 0.55 });
      const foamPatch = mesh(new TH.CircleGeometry(1, 28).rotateX(-Math.PI / 2), new TH.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, depthWrite: false, opacity: 0 })); foamPatch.layers.set(1); foamPatch.renderOrder = 5; D.add(foamPatch);
      const NDROP = 22, drops = new TH.InstancedMesh(new TH.SphereGeometry(1, 8, 6), T("#F2FFFD", null, { emissive: "#A8E8F0", emissiveIntensity: 0.4 }), NDROP); drops.frustumCulled = false; D.add(drops);
      const DR = []; for (let i = 0; i < NDROP; i++) DR.push({ a: (i / NDROP) * Math.PI * 2 + rs() * 0.3, v: 2 + rs() * 3, up: 3.5 + rs() * 4.5, s: 0.08 + rs() * 0.14, r0: 0.8 + rs() * 0.8 });
      const NB = 26, bubs = new TH.InstancedMesh(new TH.SphereGeometry(1, 10, 7), T("#E8FBFF", null, { emissive: "#BFF4FF", emissiveIntensity: 0.3 }), NB); bubs.frustumCulled = false; D.add(bubs);
      const BB = []; for (let i = 0; i < NB; i++) BB.push({ s0: 0.56 + (i / NB) * 0.4 + rs() * 0.02, dx: (rs() - 0.5) * 1.6, dz: (rs() - 0.5) * 1.6, sz: 0.07 + rs() * 0.12, rise: 16 + rs() * 10 });
      // ---------- sink choreography ----------
      const S_TIP = 0.3, S_OFF = 0.56, S_SPL = 0.465;
      const rollIn = (s) => -0.26 * sst(seg(s, 0.02, 0.3)) + 0.035 * Math.sin(seg(s, 0.02, 0.3) * Math.PI * 4) * (1 - seg(s, 0.2, 0.3));
      const mRaft = new TH.Matrix4(), mLoc = new TH.Matrix4(), mTmp = new TH.Matrix4(), vP = new TH.Vector3(), qS = new TH.Quaternion(), vS = new TH.Vector3();
      function stoneFrame(t, s, out) { const fade = 1 - seg(s, 0.5, 0.6); const y = WATER + (0.055 * Math.sin(t * 1.25) - 0.06) * fade, rx = rollIn(s) + 0.025 * Math.sin(t * 0.9 + 1) * fade, rz = 0.02 * Math.sin(t * 0.7) * fade;
        _q.setFromEuler(_e.set(rx, 0, rz)); return out.compose(_p.set(0, y, RZ), _q, _s.set(1, 1, 1)); }
      function stoneLocal(s, out) { const u = seg(s, S_TIP, S_OFF), lean = -0.06 * seg(s, 0.14, S_TIP), phi = -(Math.PI / 2) * u * u, pz = -0.1 - 3.2 * Math.pow(u, 1.4), py = deckY - 1.7 * Math.pow(seg(u, 0.6, 1), 1.5);
        _q.setFromEuler(_e.set(phi + lean, 0, 0)); mTmp.compose(_p.set(0, py, pz), _q, _s.set(1, 1, 1)); return out.copy(mTmp).multiply(mLoc.makeTranslation(0, BR, 0)); }
      function stoneWorld(t, s, out) { stoneFrame(t, s, mRaft); stoneLocal(s, out); out.premultiply(mRaft); if (s > S_OFF) { const v = seg(s, S_OFF, 0.97), e = sst(v); out.decompose(vP, qS, vS); vP.y += (-4.4 - vP.y) * e; vP.z -= 0.9 * e; vP.x += 0.3 * e;
          _q.setFromEuler(_e.set(0.25 * e, 0.5 * e, 0.12 * Math.sin(v * 5))); qS.multiply(_q); out.compose(vP, qS, vS); } return out; }
      const splashAt = (() => { const m = new TH.Matrix4(); stoneWorld(0, 1.0, m); stoneFrame(0, S_OFF, mRaft); stoneLocal(S_OFF, m); m.premultiply(mRaft); const p = new TH.Vector3().setFromMatrixPosition(m); return { x: p.x, z: p.z }; })();
      rip.forEach((r) => r.group.position.set(splashAt.x, WATER + 0.03, splashAt.z)); foamPatch.position.set(splashAt.x, WATER + 0.025, splashAt.z); drops.position.set(splashAt.x, WATER, splashAt.z); wake.group.position.set(0, WATER + 0.02, RZ);
      const mS = new TH.Matrix4(), cPos = new TH.Vector3();
      function update(t, env = {}) {
        const s = clamp01(env.sink || 0), n = env.night || 0;
        swayPalms(t); wTex.offset.set(t * 0.012, t * 0.007); foam.scale.set(SX * (1 + 0.006 * Math.sin(t * 1.1)), 1, 1 + 0.006 * Math.sin(t * 1.1)); foamTex.offset.x = t * 0.004; foam.material.opacity = 0.7 + 0.15 * Math.sin(t * 1.1);
        // raft
        let roll = rollIn(s); if (s > 0.45) { const u = s - 0.45; roll = rollIn(0.45) * Math.exp(-7 * u) * Math.cos(22 * u); }
        raft.position.y = WATER + 0.055 * Math.sin(t * 1.25) - 0.06 + 0.12 * sst(seg(s, 0.45, 0.7)); raft.rotation.set(roll + 0.025 * Math.sin(t * 0.9 + 1), 0, 0.02 * Math.sin(t * 0.7));
        ropes.visible = s < 0.27; wake.update(((t * 0.25) % 1));
        // stone
        stoneWorld(t, s, mS); mS.decompose(big.position, big.quaternion, big.scale); cPos.copy(big.position); big.visible = cPos.y > -4.0;
        // splash, ripples, droplets, bubbles
        rip.forEach((r, i) => r.update(seg(s, S_SPL + i * 0.05, S_SPL + i * 0.05 + 0.42)));
        const fk = seg(s, S_SPL, S_SPL + 0.3); foamPatch.visible = fk > 0 && fk < 1; foamPatch.material.opacity = 0.85 * (1 - fk); const fs = 2.2 + 1.6 * eOut(fk); foamPatch.scale.set(fs * 1.2, 1, fs);
        const dk = seg(s, S_SPL, S_SPL + 0.16);
        for (let i = 0; i < NDROP; i++) { const d = DR[i], tt = dk * 1.1; let y = d.up * tt - 9 * tt * tt; const vis = dk > 0 && dk < 1 && y > -0.05; const rad = d.r0 + d.v * tt; _m.compose(_p.set(Math.cos(d.a) * rad * 1.3, Math.max(0, y), Math.sin(d.a) * rad), _q.identity(), _s.setScalar(vis ? d.s * (1 - dk * 0.5) : 0)); drops.setMatrixAt(i, _m); }
        drops.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < NB; i++) { const b = BB[i], age = s - b.s0; let sc = 0, y = 0, sq = 1; if (age > 0) { stoneWorld(t, b.s0, mTmp); vP.setFromMatrixPosition(mTmp); y = vP.y + age * b.rise;
            if (y < WATER - 0.05) sc = b.sz; else if ((y - WATER) / b.rise < 0.035) { y = WATER; sc = b.sz * 1.6; sq = 0.5; } }
          if (sc > 0) _m.compose(_p.set(vP.x + b.dx + Math.sin(age * 40 + i) * 0.1, y, vP.z + b.dz), _q.identity(), _s.set(sc, sc * sq, sc)); else _m.makeScale(0, 0, 0); bubs.setMatrixAt(i, _m); }
        bubs.instanceMatrix.needsUpdate = true;
        // night
        doorMat.emissiveIntensity = n * 0.9; winMat.emissiveIntensity = n * 1.0; lantern.material.emissiveIntensity = 0.2 + n * 1.4; lglow.visible = n > 0.02; lglow.material.opacity = n; plight.intensity = n * 6;
      }
      update(0, {});
      const W = (x, y, z) => ({ x: 600 + x, y, z });
      return { group: D, update, islandY: (x, z) => islandY(x - 600, z), stones, splash: W(splashAt.x, WATER, splashAt.z),
        anchors: { raft: W(0, WATER, RZ), beach: W(-1.5, islandY(-1.5, 4.5), 4.5), cam1: W(-6.5, islandY(-6.5, 5) + 1.65, 5), cam1Look: W(0, 1.2, RZ), camWide: W(17, 8.5, 42), camWideLook: W(0, 1.0, 2), hut: W(hx, hut.position.y, hz + 1.9), stoneBig: W(-2.5, 1.9, -8.2) } };
    }

    const yap = buildYap();
    return { makeBill, makeSandwich, makeCoin, makeCoinPile, makeCoinBurst, makeArc, makeRipple, makeCard, makeStamp, makeLoanPaper, makePiggy, makeOven, yap, anchors: yap.anchors, update(t, env) { yap.update(t, env); } };
  };
})();
