/* Social Ripple ep3 set: CRUMB ISLAND, town exteriors. World origin = centre of the town square (fountain). Metres, Y up.
   const town = EP3.town(W3)  →  { anchors, buildings, occ, update(t, env), setPrice(n) }
   env: { night 0..1, boom 0..1, bust 0..1 }. Everything is a pure function of t + env (seek-safe). Static geometry is baked
   (merged per material) to keep draw calls low; animated parts live in their own small groups. */
(function () {
  window.EP3 = window.EP3 || {};
  window.EP3.town = function (W3) {
    const THREE = W3.TH, TH = THREE, SR = window.SR;
    const rng = SR.mulberry32(3031);
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const ss = (a, b, v) => { const k = clamp01((v - a) / (b - a)); return k * k * (3 - 2 * k); };
    const backOut = (k) => { if (k <= 0) return 0; if (k >= 1) return 1; const s = 2.2, u = k - 1; return 1 + u * u * ((s + 1) * u + s); };
    const pop = (v, d, len = 0.18) => backOut(clamp01((v - d) / len));          // staggered pop-in with overshoot
    const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
      return "#" + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
    const INK = "#1E1B22";
    const C = { coral: "#F4A28C", mint: "#9FD8C2", butter: "#F6D77A", sky: "#8EC3E8", lilac: "#C7B3E6", cream: "#F2E6C8", terra: "#C8553D", teal: "#2F8F8A",
      wood: "#9A6A44", sand: "#F2D9A0", grass: "#7DBA5A", sea: "#2FA7B8", stone: "#D9CDB8", trim: "#FFF7EA", post: "#2E5B5F", red: "#E2574C", pink: "#F3A6B8", peach: "#F7BE8E" };
    const root = new TH.Group(); root.name = "town-static"; W3.scene.add(root);   // baked at the end
    const dyn = new TH.Group(); dyn.name = "town-dyn"; W3.scene.add(dyn);         // animated / toggled
    const nightMats = [];   // [material, base, perNight] → emissiveIntensity = base + night * perNight
    const glows = [];       // [sprite, size, kind]

    // ---------- materials (cached so the baker can merge by material) ----------
    const MC = {};
    const M = (color, map, o) => { const k = color + "|" + (map ? map.uuid : "") + "|" + (o ? JSON.stringify(o) : "");
      if (!MC[k]) { MC[k] = W3.toon(color, map, o ? Object.assign({}, o, o.emissive ? { emissive: new TH.Color(o.emissive) } : {}) : undefined); if (!o) MC[k].userData.vc = 1; } return MC[k]; };
    const glowMat = (color, emissive, base, perNight, map) => { const m = W3.toon(color, map || null, { emissive: new TH.Color(emissive), emissiveIntensity: base }); nightMats.push([m, base, perNight]); return m; };

    // ---------- hand-painted canvas textures ----------
    const T = (w, h, draw) => W3.tex(w, h, draw);
    const pr = (seed) => SR.mulberry32(seed);
    const texStucco = T(256, 256, (g, w, h) => { const r = pr(11); g.fillStyle = "#F6F4F1"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { g.fillStyle = r() < 0.5 ? "rgba(120,90,80,0.05)" : "rgba(255,255,255,0.25)"; const x = r() * w, y = r() * h, s = 4 + r() * 18; g.beginPath(); g.ellipse(x, y, s, s * (0.4 + r() * 0.5), r() * 3, 0, 7); g.fill(); }
      g.strokeStyle = "rgba(110,80,80,0.18)"; g.lineWidth = 1.2; for (let i = 0; i < 6; i++) { let x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 18; y += 4 + r() * 8; g.lineTo(x, y); } g.stroke(); } });
    const texSiding = T(256, 256, (g, w, h) => { const r = pr(12); g.fillStyle = "#F7F5F2"; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 32) { g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(0, y + 2, w, 3); g.fillStyle = "rgba(90,60,80,0.22)"; g.fillRect(0, y + 27, w, 5);
        for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(120,90,80,0.07)"; g.fillRect(r() * w, y + 6 + r() * 18, 20 + r() * 60, 2); } } });
    const texTile = T(256, 256, (g, w, h) => { const r = pr(13); g.fillStyle = "#D8D2CC"; g.fillRect(0, 0, w, h);
      for (let row = 0; row < 9; row++) { const y = row * 32 - 8, off = row % 2 ? 16 : 0;
        for (let x = -32 + off; x < w + 32; x += 32) { const v = 222 + Math.floor(r() * 33); g.fillStyle = `rgb(${v},${v - 4},${v - 8})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 32, y); g.lineTo(x + 32, y + 26); g.arc(x + 16, y + 26, 16, 0, Math.PI); g.closePath(); g.fill();
          g.strokeStyle = "rgba(70,40,40,0.35)"; g.lineWidth = 3; g.beginPath(); g.arc(x + 16, y + 26, 16, 0.15, Math.PI - 0.15); g.stroke();
          g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(x + 5, y + 4, 4, 18); } } });
    const texPlank = T(256, 256, (g, w, h) => { const r = pr(14); g.fillStyle = "#EDE3D8"; g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 32) { const v = 0.9 + r() * 0.1; g.fillStyle = `rgba(${Math.round(237 * v)},${Math.round(227 * v)},${Math.round(216 * v)},1)`; g.fillRect(x, 0, 32, h);
        g.strokeStyle = "rgba(90,55,30,0.18)"; g.lineWidth = 1.5; for (let k = 0; k < 4; k++) { const gx = x + 5 + r() * 22; g.beginPath(); g.moveTo(gx, 0); g.bezierCurveTo(gx + 4, h * 0.3, gx - 4, h * 0.6, gx + 2, h); g.stroke(); }
        g.fillStyle = "rgba(70,40,30,0.45)"; g.fillRect(x, 0, 3, h); const ky = r() * h; g.fillStyle = "rgba(90,55,30,0.3)"; g.beginPath(); g.ellipse(x + 16, ky, 3, 6, 0, 0, 7); g.fill();
        g.fillStyle = "rgba(70,40,30,0.5)"; g.beginPath(); g.arc(x + 8, 10 + r() * 6, 2, 0, 7); g.arc(x + 24, 10 + r() * 6, 2, 0, 7); g.fill(); } });
    const texCobble = T(512, 512, (g, w, h) => { const r = pr(15); g.fillStyle = "#9E8D78"; g.fillRect(0, 0, w, h);
      const cols = ["#E6D6BA", "#D9C6A6", "#CDB99B", "#EADFC8", "#CBB8A4", "#DDC9AE", "#D4C0B4", "#C8BCA0"];
      for (let row = 0; row < 16; row++) { const y = row * 32, off = (row % 2) * 20; for (let x = -39.385 + off; x < w + 40; x += 39.385) {
        const ww = 34 + r() * 4, hh = 26 + r() * 3, cx = x + 20 + (r() - 0.5) * 3, cy = y + 16 + (r() - 0.5) * 3;
        const draw = (dx, dy) => { g.beginPath(); g.roundRect(cx - ww / 2 + dx, cy - hh / 2 + dy, ww, hh, 11); g.fill(); };
        g.fillStyle = "rgba(80,60,50,0.35)"; draw(2, 3); g.fillStyle = cols[Math.floor(r() * cols.length)]; draw(0, 0);
        g.fillStyle = "rgba(255,255,255,0.28)"; g.beginPath(); g.ellipse(cx - 6, cy - 5, ww * 0.28, hh * 0.18, -0.2, 0, 7); g.fill(); } } });
    const texStone = T(256, 256, (g, w, h) => { const r = pr(16); g.fillStyle = "#8F8478"; g.fillRect(0, 0, w, h);
      for (let row = 0; row < 8; row++) { const y = row * 32, off = (row % 2) * 32; for (let x = -64 + off; x < w + 64; x += 64) { const v = 205 + Math.floor(r() * 40);
        g.fillStyle = `rgb(${v},${v - 6},${v - 16})`; g.beginPath(); g.roundRect(x + 2, y + 2, 60, 28, 6); g.fill(); g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(x + 6, y + 5, 30, 4); } } });
    const texGrass = T(512, 512, (g, w, h) => { const r = pr(17); g.fillStyle = "#7DBA5A"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) { g.fillStyle = r() < 0.5 ? "rgba(140,205,100,0.35)" : "rgba(95,160,70,0.3)"; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 50, 12 + r() * 26, r() * 3, 0, 7); g.fill(); }
      for (let i = 0; i < 700; i++) { const x = r() * w, y = r() * h; g.strokeStyle = r() < 0.55 ? "rgba(70,135,55,0.75)" : "rgba(160,215,110,0.8)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3 + r() * 2, y - 7 - r() * 5); g.moveTo(x + 2, y); g.lineTo(x + 4 + r() * 2, y - 6 - r() * 4); g.stroke(); }
      for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h; g.fillStyle = ["#FFF4D0", "#FFD6E0", "#FFE680"][i % 3]; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.26) * 3, y + Math.sin(k * 1.26) * 3, 2.2, 0, 7); g.fill(); } g.fillStyle = "#F2A93B"; g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); } });
    const texSand = T(256, 256, (g, w, h) => { const r = pr(18); g.fillStyle = "#F2D9A0"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { g.fillStyle = r() < 0.5 ? "rgba(200,160,100,0.35)" : "rgba(255,250,230,0.5)"; g.fillRect(r() * w, r() * h, 2, 2); }
      g.strokeStyle = "rgba(210,175,110,0.5)"; g.lineWidth = 2; for (let i = 0; i < 10; i++) { const y = r() * h; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y - 8, w * 0.6, y + 8, w, y); g.stroke(); } });
    const texSea = T(256, 256, (g, w, h) => { const r = pr(19); g.fillStyle = "#2FA7B8"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(40,140,170,0.13)"; g.beginPath(); g.ellipse(r() * w, r() * h, 30 + r() * 40, 10 + r() * 14, 0, 0, 7); g.fill(); }
      g.lineCap = "round"; for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, s = 8 + r() * 12; g.strokeStyle = r() < 0.7 ? "rgba(170,235,240,0.75)" : "rgba(255,255,255,0.85)"; g.lineWidth = 2.5;
        g.beginPath(); g.moveTo(x - s, y); g.quadraticCurveTo(x - s / 2, y - 5, x, y); g.quadraticCurveTo(x + s / 2, y - 5, x + s, y); g.stroke(); } });
    const texFoam = T(512, 64, (g, w, h) => { const r = pr(20); g.clearRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < 160; i++) { const x = r() * w, y = h * (0.25 + r() * 0.5); g.beginPath(); g.ellipse(x, y, 6 + r() * 16, 4 + r() * 7, 0, 0, 7); g.fill(); }
      g.fillRect(0, h * 0.42, w, h * 0.16); });
    const stripes = (c1, c2, n, seed) => T(256, 64, (g, w, h) => { const sw = w / n; for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? c2 : c1; g.fillRect(i * sw, 0, sw + 1, h); }
      const r = pr(seed || 21); for (let i = 0; i < 60; i++) { g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(r() * w, r() * h, 6 + r() * 14, 2); } g.fillStyle = "rgba(60,30,40,0.18)"; g.fillRect(0, h - 6, w, 6); });
    const texGlass = T(128, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#FFFFFF"); gr.addColorStop(1, "#C9D8E6"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.moveTo(20, 0); g.lineTo(48, 0); g.lineTo(0, 64); g.lineTo(0, 30); g.fill(); g.beginPath(); g.moveTo(62, 0); g.lineTo(72, 0); g.lineTo(0, 92); g.lineTo(0, 80); g.fill(); }, { clamp: true });
    texGlass.wrapS = texGlass.wrapT = TH.ClampToEdgeWrapping;
    [texPlank, texStucco, texSiding, texTile, texCobble, texStone, texGrass, texSand].forEach((t) => { t.anisotropy = 4; });

    // ---------- geometry helpers ----------
    // world-scaled UVs for a box: 1 texture tile = `tile` metres on every face
    const boxUV = (geo, w, h, d, tile) => { const uv = geo.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile); } uv.needsUpdate = true; return geo; };
    // box with its BOTTOM at y
    const bx = (p, w, h, d, mat, x, y, z, o = {}) => { const g = new TH.BoxGeometry(w, h, d); if (o.tile) boxUV(g, w, h, d, o.tile);
      const m = new TH.Mesh(g, typeof mat === "string" ? M(mat) : mat); m.position.set(x, y + h / 2, z); if (o.ry) m.rotation.y = o.ry; if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; p.add(m); return m; };
    const cyl = (p, rt, rb, h, mat, x, y, z, seg = 12, o = {}) => { const g = new TH.CylinderGeometry(rt, rb, h, seg, 1, !!o.open); if (o.uv) W3.uvScale(g, o.uv[0], o.uv[1]);
      const m = new TH.Mesh(g, typeof mat === "string" ? M(mat) : mat); m.position.set(x, y + h / 2, z); if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; if (o.ry) m.rotation.y = o.ry; p.add(m); return m; };
    const sph = (p, r, mat, x, y, z, sx = 1, sy = 1, sz = 1, seg = 10) => { const m = new TH.Mesh(new TH.SphereGeometry(r, seg, Math.max(6, seg * 0.6 | 0)), typeof mat === "string" ? M(mat) : mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); p.add(m); return m; };
    const atp = (m, x, y, z) => { m.position.set(x, y, z); return m; };
    const grp = (p, x, y, z, ry = 0) => { const g = new TH.Group(); g.position.set(x, y, z); g.rotation.y = ry; p.add(g); return g; };
    // prism (gable attic) whose triangle spans local z (-d/2..d/2), apex h, extruded along local x (length w), base at y=0
    const prism = (w, d, h) => { const s = new TH.Shape(); s.moveTo(-d / 2, 0); s.lineTo(d / 2, 0); s.lineTo(0, h); s.closePath();
      const g = new TH.ExtrudeGeometry(s, { depth: w, bevelEnabled: false }); g.rotateY(Math.PI / 2); g.translate(-w / 2, 0, 0); return g; };
    // sign board: box whose front (+z) face shows a label
    const signMats = [];
    const sign = (p, text, w, h, x, y, z, o = {}) => { const cw = 1024, chh = Math.max(96, Math.round(cw * h / w)); const len = Math.max(4, text.length);
      const size = o.size || Math.round(Math.min(chh * 0.62, cw * 1.25 / (len * 0.66)));
      const tex = W3.label(text, { w: cw, h: chh, size, bg: o.bg || "#FFF3DC", color: o.color || INK, border: o.border, ink: o.ink });
      const front = W3.toon("#FFFFFF", tex, { emissive: new TH.Color("#FFFFFF"), emissiveMap: tex, emissiveIntensity: 0.0 }); if (o.lit !== false) nightMats.push([front, 0.0, 0.55]); signMats.push(front);
      const d = o.d || 0.12, sg = grp(p, x, y, z, o.ry || 0); bx(sg, w, h, d, M(o.frame || C.wood, texPlank), 0, 0, 0, { tile: 1 });
      const pl = new TH.Mesh(new TH.PlaneGeometry(w * 0.985, h * 0.97), front); pl.position.set(0, h / 2, d / 2 + 0.008); pl.userData.keep = 1; sg.add(pl); return sg; };
    // a window: frame, glass (glows at night), cross mullions, sill, optional shutters + flower box. Local front = +z, centred at x, bottom at y
    const winMat = glowMat("#BFE3F0", "#FFC46A", 0.0, 1.25, texGlass);
    const flowerCols = ["#F2607A", "#FFD24A", "#FF8E5A", "#C77DE0", "#FFFFFF"];
    const flowerSpots = [];   // world positions filled later via instancing
    const win = (p, w, h, x, y, z, o = {}) => { const fr = o.frame || C.trim, t = 0.1;
      bx(p, w + 0.2, t, 0.16, fr, x, y + h, z); bx(p, w + 0.34, 0.1, 0.26, fr, x, y - 0.1, z + 0.04); bx(p, t, h, 0.16, fr, x - w / 2 - 0.05, y, z); bx(p, t, h, 0.16, fr, x + w / 2 + 0.05, y, z);
      bx(p, w, h, 0.05, o.mat || winMat, x, y, z - 0.03);
      if (!o.noCross) { bx(p, 0.06, h, 0.09, fr, x, y, z); bx(p, w, 0.06, 0.09, fr, x, y + h * 0.55, z); }
      if (o.shutter) { bx(p, w * 0.42, h + 0.05, 0.06, o.shutter, x - w / 2 - 0.12 - w * 0.21, y - 0.02, z + 0.02); bx(p, w * 0.42, h + 0.05, 0.06, o.shutter, x + w / 2 + 0.12 + w * 0.21, y - 0.02, z + 0.02);
        for (const sx of [-1, 1]) for (let k = 1; k < 4; k++) bx(p, w * 0.36, 0.035, 0.03, shade(o.shutter, -0.18), x + sx * (w / 2 + 0.12 + w * 0.21), y + (h * k) / 4, z + 0.06); }
      if (o.box) { bx(p, w + 0.1, 0.24, 0.3, o.box, x, y - 0.36, z + 0.18); flowerSpots.push([p, x, y - 0.1, z + 0.18, w + 0.05]); } };
    const door = (p, w, h, x, z, col, o = {}) => { const fr = o.frame || C.trim;
      bx(p, w + 0.3, 0.14, 0.18, fr, x, h, z); bx(p, 0.14, h, 0.18, fr, x - w / 2 - 0.07, 0, z); bx(p, 0.14, h, 0.18, fr, x + w / 2 + 0.07, 0, z);
      bx(p, w, h, 0.1, M(col, texPlank), x, 0, z, { tile: 1.2 });
      bx(p, w * 0.62, h * 0.3, 0.05, winMat, x, h * 0.6, z + 0.04); bx(p, w * 0.7, 0.05, 0.06, fr, x, h * 0.58, z + 0.06);
      bx(p, w * 0.3, h * 0.28, 0.05, shade(col, -0.15), x - w * 0.18, h * 0.12, z + 0.06); bx(p, w * 0.3, h * 0.28, 0.05, shade(col, -0.15), x + w * 0.18, h * 0.12, z + 0.06);
      sph(p, 0.05, "#F2C14E", x + w * 0.36, h * 0.47, z + 0.09, 1, 1, 1, 8);
      if (!o.noStep) bx(p, w + 0.6, 0.12, 0.6, M(C.stone, texStone), x, 0, z + 0.3, { tile: 1.5 }); };
    const gableRoof = (p, w, d, y, pitch, oh, roofCol, gableCol, gableMap, o = {}) => {   // ridge along local x
      const at = new TH.Mesh(prism(w, d, pitch), M(gableCol, gableMap)); W3.uvScale(at.geometry, 1 / 2.2, 1 / 2.2); at.position.y = y; p.add(at);
      const a = Math.atan2(pitch, d / 2), hs = d / 2 + oh, L = hs / Math.cos(a), th = 0.2, rm = M(roofCol, texTile);
      for (const s of [-1, 1]) { const g = new TH.BoxGeometry(w + oh * 2, th, L); boxUV(g, w + oh * 2, th, L, 1.6); const m = new TH.Mesh(g, rm);
        m.rotation.x = s * a; m.position.set(0, y + pitch - (L / 2) * Math.sin(a) + th / 2 / Math.cos(a), s * (L / 2) * Math.cos(a)); p.add(m); }
      bx(p, w + oh * 2 + 0.1, 0.16, 0.34, shade(roofCol, -0.18), 0, y + pitch + 0.02, 0);
      if (o.chimney) { const [cx, cz] = o.chimney; bx(p, 0.6, pitch + 0.9, 0.6, M("#C98B6B", texStone), cx, y + pitch * 0.35, cz, { tile: 1 }); bx(p, 0.76, 0.16, 0.76, "#8E5A48", cx, y + pitch * 1.25 + 0.9, cz); } };

    // =====================================================================================
    // ISLAND, SEA, HILL + LIGHTHOUSE
    // =====================================================================================
    const HILL = { x: -30, z: -32 }, hd = Math.hypot(HILL.x, HILL.z), hdx = HILL.x / hd, hdz = HILL.z / hd;
    const baseR = (th) => { const dx = Math.sin(th), dz = Math.cos(th); const n = 0.9 * Math.sin(3 * th + 1) + 0.6 * Math.sin(5 * th + 2) + 0.45 * Math.sin(9 * th + 0.5) + 0.25 * Math.sin(17 * th + 1.3);
      return 45 + 2.6 * n + 16 * Math.pow(Math.max(0, dx * hdx + dz * hdz), 3); };
    const islandR = (th) => { const b = baseR(th), ph = Math.abs(Math.atan2(Math.sin(th), Math.cos(th)));   // ph = angle from +z (the harbour side)
      if (ph < 0.722) return Math.min(b, 17 / Math.cos(ph)); if (ph < 1.31) return Math.min(b, 22.7 + (b - 22.7) * ss(0.722, 1.31, ph)); return b; };
    const beachW = (th) => { const ph = Math.abs(Math.atan2(Math.sin(th), Math.cos(th))); return 1.2 + 3.6 * ss(0.62, 0.95, ph); };
    const NI = 200, outline = []; for (let i = 0; i < NI; i++) { const th = (i / NI) * Math.PI * 2 - Math.PI; outline.push([th, islandR(th), beachW(th)]); }
    {   // grass top (flat, y = 0)
      const s = new TH.Shape(); outline.forEach(([th, r], i) => { const x = Math.sin(th) * r, z = Math.cos(th) * r; i ? s.lineTo(x, -z) : s.moveTo(x, -z); });
      const g = new TH.ShapeGeometry(s); g.rotateX(-Math.PI / 2); W3.uvScale(g, 1 / 7, 1 / 7); const m = new TH.Mesh(g, M("#FFFFFF", texGrass)); root.add(m);
      // sand beach: 4 rings sloping from under the grass edge to below the sea
      const prof = [[-0.35, -0.03], [0.5, -0.2], [0.68, -0.5], [1.35, -3.3]], P = [], U = [], I = [];
      outline.forEach(([th, r, w], i) => { prof.forEach(([f, y], k) => { const rr = r + (f < 0 ? f : f * w); P.push(Math.sin(th) * rr, y, Math.cos(th) * rr); U.push((i / NI) * 2 * Math.PI * 46 / 5, rr / 5); }); });
      const nk = prof.length; for (let i = 0; i < NI; i++) { const j = (i + 1) % NI; for (let k = 0; k < nk - 1; k++) { const a = i * nk + k, b = j * nk + k; I.push(a, b, a + 1, b, b + 1, a + 1); } }
      const sg = new TH.BufferGeometry(); sg.setAttribute("position", new TH.Float32BufferAttribute(P, 3)); sg.setAttribute("uv", new TH.Float32BufferAttribute(U, 2)); sg.setIndex(I); sg.computeVertexNormals();
      root.add(new TH.Mesh(sg.index ? sg : sg, M("#FFFFFF", texSand)));
      // shoreline foam (layer 1: no ink), drifts with t
      const FP = [], FU = [], FI = []; outline.forEach(([th, r, w], i) => { [0.44, 0.74].forEach((f, k) => { const rr = r + f * w; FP.push(Math.sin(th) * rr, -0.31, Math.cos(th) * rr); FU.push((i / NI) * 60, k); }); });
      for (let i = 0; i < NI; i++) { const j = (i + 1) % NI; FI.push(i * 2, j * 2, i * 2 + 1, j * 2, j * 2 + 1, i * 2 + 1); }
      const fg = new TH.BufferGeometry(); fg.setAttribute("position", new TH.Float32BufferAttribute(FP, 3)); fg.setAttribute("uv", new TH.Float32BufferAttribute(FU, 2)); fg.setIndex(FI); fg.computeVertexNormals();
      var foamMat = new TH.MeshBasicMaterial({ map: texFoam, transparent: true, depthWrite: false, opacity: 0.8, color: 0xffffff }); var foam = W3.add(new TH.Mesh(fg, foamMat), 0, 0, 0, 1, dyn); foam.renderOrder = 3;
    }
    // sea: huge, slightly translucent (shallows show the sand), texture ripples with t
    texSea.repeat.set(1, 1); const seaG = new TH.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2); W3.uvScale(seaG, 3000 / 11, 3000 / 11);
    const seaMat = W3.toon("#FFFFFF", texSea, { transparent: true, opacity: 0.84 }); const sea = W3.add(new TH.Mesh(seaG, seaMat), 0, -0.35, 0, 0, dyn); sea.renderOrder = 2;
    root.add(atp(new TH.Mesh(new TH.CircleGeometry(420, 48).rotateX(-Math.PI / 2), M("#1A7A90")), 0, -3.0, 0));   // seabed under the translucent sea
    // hill (lathe dome with a flat top for the lighthouse)
    { const pts = []; for (let i = 0; i <= 14; i++) { const r = 14 * (1 - i / 14); pts.push(new TH.Vector2(Math.max(r, 0.001), -0.15 + 6.15 * (1 - ss(2.6, 14, r)))); }
      const g = new TH.LatheGeometry(pts, 36); W3.uvScale(g, 9, 2.5); root.add(atp(new TH.Mesh(g, M("#FFFFFF", texGrass)), HILL.x, 0, HILL.z)); }
    // lighthouse
    const lhTex = T(64, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#F6F0E2" : "#E2574C"; g.fillRect(0, (i * h) / 8, w, h / 8 + 1); }
      const r = pr(22); for (let i = 0; i < 80; i++) { g.fillStyle = "rgba(120,60,60,0.10)"; g.fillRect(r() * w, r() * h, 8 + r() * 10, 2); } });
    const lhA = Math.atan2(-HILL.x, -HILL.z), LH = grp(root, HILL.x, 6, HILL.z, lhA);
    cyl(LH, 2.0, 2.3, 0.7, M(C.stone, texStone), 0, -0.5, 0, 16, { uv: [4, 0.4] });
    cyl(LH, 1.15, 1.55, 6.3, M("#FFFFFF", lhTex), 0, 0.2, 0, 16);
    bx(LH, 0.8, 1.6, 0.4, M(C.teal, texPlank), 0, 0.2, 1.38, { rx: -0.06 }); bx(LH, 1.1, 0.14, 0.5, C.trim, 0, 1.8, 1.36);
    [[2.6, 1.3], [4.4, 1.2]].forEach(([y, rr]) => { bx(LH, 0.4, 0.55, 0.3, winMat, 0, y, rr); bx(LH, 0.55, 0.08, 0.36, C.trim, 0, y - 0.08, rr); });
    cyl(LH, 1.7, 1.45, 0.3, "#3E6E72", 0, 6.45, 0, 16);
    const rail = new TH.Mesh(new TH.TorusGeometry(1.6, 0.05, 6, 24).rotateX(Math.PI / 2), M("#3E6E72")); rail.position.y = 7.25; LH.add(rail);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; cyl(LH, 0.04, 0.04, 0.5, "#3E6E72", Math.cos(a) * 1.6, 6.75, Math.sin(a) * 1.6, 5); }
    const lhLampMat = glowMat("#FFF3C0", "#FFD25A", 0.15, 2.2);
    cyl(LH, 0.8, 0.8, 1.15, lhLampMat, 0, 6.75, 0, 12); for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; bx(LH, 0.07, 1.15, 0.07, "#3E6E72", Math.cos(a) * 0.82, 6.75, Math.sin(a) * 0.82); }
    cyl(LH, 0.02, 1.2, 1.0, C.red, 0, 7.9, 0, 12); sph(LH, 0.16, "#F2C14E", 0, 9.0, 0); cyl(LH, 0.03, 0.03, 0.5, "#3E6E72", 0, 8.85, 0, 5);
    const lhGlow = W3.glow("#FFE08A", 3, HILL.x, 13.35, HILL.z); glows.push([lhGlow, "lh"]); lhGlow.parent.remove(lhGlow); dyn.add(lhGlow);
    // rotating beam (night only)
    const beamTex = T(4, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#FFFFFF"); gr.addColorStop(0.35, "#6A6A6A"); gr.addColorStop(1, "#000000"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); beamTex.wrapS = beamTex.wrapT = TH.ClampToEdgeWrapping;
    const beamMat = new TH.MeshBasicMaterial({ map: beamTex, color: new TH.Color("#FFE9A8"), transparent: true, opacity: 0, blending: TH.AdditiveBlending, depthWrite: false, side: TH.DoubleSide, fog: false });
    const beam = new TH.Group(); beam.position.set(HILL.x, 13.35, HILL.z); dyn.add(beam);
    for (const s of [0, Math.PI]) { const g = new TH.ConeGeometry(3.2, 34, 16, 1, true); g.translate(0, -17, 0); g.rotateZ(Math.PI / 2); const m = new TH.Mesh(g, beamMat); m.rotation.y = s; m.layers.set(1); beam.add(m); }

    // =====================================================================================
    // TOWN SQUARE: cobble disc, fountain, benches, lamps, paths
    // =====================================================================================
    const cobM = M("#FFFFFF", texCobble), stoneM = M(C.stone, texStone);
    { const g = new TH.CylinderGeometry(11.4, 11.5, 0.04, 64); W3.uvScale(g, 6, 6); root.add(atp(new TH.Mesh(g, stoneM), 0, 0.02, 0)); }
    { const g = new TH.CylinderGeometry(11, 11, 0.08, 64); W3.uvScale(g, 22 / 4, 22 / 4); root.add(atp(new TH.Mesh(g, cobM), 0, 0.04, 0)); }
    { const g = new TH.CylinderGeometry(3.1, 3.1, 0.04, 40); W3.uvScale(g, 2, 2); root.add(atp(new TH.Mesh(g, M("#E9C9A0", texStone)), 0, 0.1, 0)); }
    // radial accent: 8 stone spokes from fountain ring
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; const m = bx(root, 0.42, 0.016, 7.4, M("#EAD8B8", texStone), Math.sin(a) * 6.9, 0.08, Math.cos(a) * 6.9, { tile: 1.2 }); m.rotation.y = a; }
    bx(root, 28, 0.06, 2.6, M("#EADCC4", texStone), 0, 0, -8.75, { tile: 1.6 });     // north sidewalk
    bx(root, 4, 0.06, 4.4, cobM, 0, 0, 12.6, { tile: 4 });                       // road south to the harbour
    bx(root, 0.25, 0.12, 4.4, stoneM, -2.1, 0, 12.6, { tile: 1.5 }); bx(root, 0.25, 0.12, 4.4, stoneM, 2.1, 0, 12.6, { tile: 1.5 });
    bx(root, 2.6, 0.06, 2.6, M("#EADCC4", texStone), -11.6, 0, 3, { tile: 1.6 });   // yard entrance pad
    // fountain
    const FT = grp(root, 0, 0.12, 0);
    cyl(FT, 1.6, 1.7, 0.6, M("#EADBC4", texStone), 0, 0, 0, 28, { uv: [5, 0.6] });
    const rim = new TH.Mesh(new TH.TorusGeometry(1.56, 0.13, 8, 36).rotateX(Math.PI / 2), M("#F4E9D6")); rim.position.y = 0.62; FT.add(rim);
    cyl(FT, 0.28, 0.36, 1.25, M("#EADBC4", texStone), 0, 0.5, 0, 12);
    cyl(FT, 0.8, 0.32, 0.32, M("#F4E9D6"), 0, 1.55, 0, 20); cyl(FT, 0.16, 0.2, 0.55, "#EADBC4", 0, 1.86, 0, 10);
    cyl(FT, 0.42, 0.14, 0.2, M("#F4E9D6"), 0, 2.38, 0, 16); sph(FT, 0.17, "#F2C14E", 0, 2.72, 0, 1, 1.3, 1);
    const waterTex = texSea.clone(); waterTex.needsUpdate = true;
    const waterM = W3.toon("#BFF3F6", waterTex, { emissive: new TH.Color("#2FA7B8"), emissiveIntensity: 0.15 });
    const water = W3.add(new TH.Mesh(new TH.CylinderGeometry(1.46, 1.46, 0.05, 28), waterM), 0, 0.64, 0, 0, dyn);
    W3.add(new TH.Mesh(new TH.CylinderGeometry(0.66, 0.66, 0.04, 20), waterM), 0, 1.98, 0, 0, dyn);
    const curtTex = T(64, 128, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`; g.fillRect((i * w) / 18, 0, 2, h); }
      g.fillStyle = "rgba(220,250,255,0.35)"; g.fillRect(0, 0, w, h); });
    curtTex.repeat.set(6, 1); const curtM = new TH.MeshBasicMaterial({ map: curtTex, transparent: true, depthWrite: false, opacity: 0.75, side: TH.DoubleSide });
    const curtain = W3.add(new TH.Mesh(new TH.CylinderGeometry(0.8, 1.15, 1.16, 24, 1, true), curtM), 0, 1.25, 0, 1, dyn);
    const jet = W3.add(new TH.Mesh(new TH.CylinderGeometry(0.05, 0.1, 0.5, 8, 1, true), curtM), 0, 3.0, 0, 1, dyn);
    // benches (face the fountain)
    const benchM = M("#C98A52", texPlank), ironM = M(C.post);
    const bench = (x, z, ry) => { const b = grp(root, x, 0.06, z, ry);
      for (const sx of [-0.75, 0.75]) { bx(b, 0.08, 0.42, 0.5, ironM, sx, 0, 0); bx(b, 0.08, 0.5, 0.08, ironM, sx, 0.42, -0.24, { rx: -0.12 }); bx(b, 0.1, 0.06, 0.58, ironM, sx, 0.38, 0); }
      for (let k = 0; k < 3; k++) bx(b, 1.8, 0.06, 0.15, benchM, 0, 0.44, -0.18 + k * 0.17, { tile: 1.5 });
      for (let k = 0; k < 2; k++) bx(b, 1.8, 0.14, 0.05, benchM, 0, 0.62 + k * 0.2, -0.27 - k * 0.03, { tile: 1.5, rx: -0.12 }); };
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + (i * Math.PI) / 2, x = Math.sin(a) * 5.0, z = Math.cos(a) * 5.0; bench(x, z, Math.atan2(-x, -z)); }
    // street lamps
    const lampMat = glowMat("#FFF6D8", "#FFC25A", 0.05, 2.4), LAMPS = [[-4.6, -8.9], [4.6, -8.9], [-6.4, 8.9], [6.4, 8.9]];
    LAMPS.forEach(([x, z]) => { const L = grp(root, x, 0.06, z);
      cyl(L, 0.2, 0.26, 0.45, ironM, 0, 0, 0, 10); cyl(L, 0.075, 0.09, 3.1, ironM, 0, 0.45, 0, 8); cyl(L, 0.14, 0.14, 0.12, ironM, 0, 1.3, 0, 8); cyl(L, 0.13, 0.13, 0.1, ironM, 0, 3.4, 0, 8);
      bx(L, 0.4, 0.08, 0.4, ironM, 0, 3.5, 0); bx(L, 0.34, 0.5, 0.34, lampMat, 0, 3.58, 0); for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) bx(L, 0.05, 0.5, 0.05, ironM, dx * 0.17, 3.58, dz * 0.17);
      const cap = new TH.Mesh(new TH.ConeGeometry(0.36, 0.34, 4), ironM); cap.rotation.y = Math.PI / 4; cap.position.y = 4.25; L.add(cap); sph(L, 0.06, "#F2C14E", 0, 4.47, 0, 1, 1, 1, 6);
      const gl = W3.glow("#FFD27A", 1.5, x, 3.9, z); gl.parent.remove(gl); dyn.add(gl); glows.push([gl, "lamp"]); });

    // =====================================================================================
    // NORTH ROW: MO'S SANDWICHES · CRUMB ISLAND BANK · BEA'S BAKERY  (fronts face +z at z ≈ -10)
    // =====================================================================================
    // painted shop-window interiors (lit at night through their emissive map)
    const display = (kind, seed) => { const t = T(256, 192, (g, w, h) => { const r = pr(seed); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#FFE7BC"); gr.addColorStop(1, "#F1B57E"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = "#B27A4E"; [70, 136].forEach((y) => g.fillRect(0, y, w, 8)); g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(0, 0, w, 10);
        for (const y of [70, 136]) for (let x = 14; x < w - 20; x += 46) { const cx = x + 20 + r() * 4;
          if (kind === "mo") { // stacked sandwich triangles
            const L = [["#E9B86A", 7], ["#7CC15A", 4], ["#E2574C", 4], ["#F6D24A", 3], ["#E9B86A", 7]]; let yy = y; L.forEach(([c, hh]) => { g.fillStyle = c; g.beginPath(); g.moveTo(cx - 18, yy); g.lineTo(cx + 18, yy); g.lineTo(cx + 14, yy - hh); g.lineTo(cx - 14, yy - hh); g.fill(); yy -= hh; });
            g.strokeStyle = "rgba(60,30,30,0.6)"; g.lineWidth = 2; g.strokeRect(cx - 18, yy, 36, y - yy); }
          else { g.fillStyle = ["#D9944A", "#E8B062", "#C97E3E"][Math.floor(r() * 3)]; g.beginPath(); g.ellipse(cx, y - 11, 19, 11, 0, Math.PI, 0); g.fill(); g.strokeStyle = "rgba(80,40,20,0.6)"; g.lineWidth = 2; g.stroke();
            g.strokeStyle = "rgba(255,240,200,0.9)"; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(cx + k * 8 - 3, y - 17); g.lineTo(cx + k * 8 + 3, y - 9); g.stroke(); } } }
        g.fillStyle = "#E2574C"; g.beginPath(); g.arc(w - 34, 30, 22, 0, 7); g.fill(); g.fillStyle = "#FFF6E0"; g.font = "900 15px Outfit, Nunito, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(kind === "mo" ? "FRESH" : "HOT", w - 34, 31);
        g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.moveTo(30, 0); g.lineTo(70, 0); g.lineTo(10, h); g.lineTo(-30, h); g.fill(); }, { clamp: true });
      t.wrapS = t.wrapT = TH.ClampToEdgeWrapping; const m = W3.toon("#FFFFFF", t, { emissive: new TH.Color("#FFFFFF"), emissiveMap: t, emissiveIntensity: 0.08 }); nightMats.push([m, 0.08, 0.95]); return m; };
    const awning = (p, w, x, y, z, out, drop, tex, valCol) => { const a = Math.atan2(drop, out), L = Math.hypot(out, drop), m = M("#FFFFFF", tex);
      const g = new TH.BoxGeometry(w, 0.07, L); const s = bx(p, w, 0.07, L, m, x, y - drop / 2 - 0.035, z + out / 2); s.rotation.x = a; s.geometry = g;
      bx(p, w, 0.3, 0.05, m, x, y - drop - 0.3, z + out); const n = Math.round(w / 0.45);
      for (let i = 0; i < n; i++) { const sc = new TH.Mesh(new TH.CylinderGeometry(w / n / 2, w / n / 2, 0.05, 10, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2), M(i % 2 ? "#FFF6EA" : valCol)); sc.position.set(x - w / 2 + (i + 0.5) * (w / n), y - drop - 0.3, z + out); p.add(sc); }
 };
    const flowerPot = (p, x, z, col) => { cyl(p, 0.28, 0.22, 0.42, M("#D9774E", texStone), x, 0.04, z, 10); sph(p, 0.34, "#5FA34A", x, 0.62, z, 1, 0.8, 1, 8); flowerSpots.push([p, x, 0.7, z, 0.5]); };

    // ---------- MO'S SANDWICHES ----------
    const MO = grp(root, -9, 0, -12.75);
    { const W = 7, D = 5.5, H = 4.2, F = D / 2, wallM = M(C.coral, texStucco);
      bx(MO, W + 0.12, 0.45, D + 0.12, M(shade(C.coral, -0.25), texStone), 0, 0, 0, { tile: 1.4 });
      bx(MO, W, H - 0.45, D, wallM, 0, 0.45, 0, { tile: 2.2 });
      for (const sx of [-1, 1]) bx(MO, 0.36, H, 0.36, C.trim, sx * (W / 2 - 0.1), 0, F - 0.1);
      bx(MO, W + 0.4, 0.28, D + 0.4, C.trim, 0, H, 0); bx(MO, W + 0.2, 0.12, D + 0.2, shade(C.coral, -0.2), 0, H - 0.12, 0);
      for (const [w, d, x, z] of [[W + 0.2, 0.3, 0, F - 0.05], [W + 0.2, 0.3, 0, -F + 0.05], [0.3, D, -W / 2 + 0.05, 0], [0.3, D, W / 2 - 0.05, 0]]) bx(MO, w, 0.55, d, M(C.coral, texStucco), x, H + 0.28, z, { tile: 2 });
      bx(MO, W - 0.4, 0.1, D - 0.4, M("#E6D3B0", texStone), 0, H + 0.2, 0, { tile: 1.5 });
      // storefront
      const dm = display("mo", 31);
      for (const sx of [-1, 1]) { const x = sx * 2.0; bx(MO, 2.2, 0.75, 0.2, M(shade(C.coral, -0.3), texPlank), x, 0.25, F, { tile: 1 }); bx(MO, 2.0, 1.75, 0.06, dm, x, 1.0, F - 0.02);
        bx(MO, 2.3, 0.12, 0.2, C.trim, x, 2.75, F + 0.02); bx(MO, 0.12, 1.85, 0.2, C.trim, x - 1.08, 0.95, F + 0.02); bx(MO, 0.12, 1.85, 0.2, C.trim, x + 1.08, 0.95, F + 0.02); bx(MO, 2.3, 0.1, 0.3, C.trim, x, 0.95, F + 0.06); bx(MO, 0.06, 1.75, 0.1, C.trim, x, 1.0, F + 0.01); }
      door(MO, 1.2, 2.25, 0, F + 0.04, C.teal);
      awning(MO, 6.6, 0, 3.25, F + 0.05, 1.35, 0.55, stripes("#E2574C", "#FFF6EA", 16, 32), "#E2574C");
      sign(MO, "MO'S SANDWICHES", 6.3, 0.78, 0, 3.32, F + 0.12, { bg: "#FFF3DC", color: "#C8553D" });
      for (const sx of [-1, 1]) { bx(MO, 0.14, 0.3, 0.14, C.post, sx * 0.95, 2.45, F + 0.12); bx(MO, 0.18, 0.24, 0.18, lampMat, sx * 0.95, 2.18, F + 0.14); }
      flowerPot(MO, -3.2, F + 0.45); flowerPot(MO, 3.2, F + 0.45);
      for (const sx of [-1, 1]) { const sg = grp(MO, sx * W / 2, 0, 0, sx * Math.PI / 2); win(sg, 1.1, 1.3, -0.9, 1.6, 0.02, { shutter: C.teal, box: C.wood }); }
      // the big 3D sandwich on the roof
      const SW = grp(MO, 0, H + 0.55, -0.4); SW.rotation.x = 0.42; SW.position.y += 1.15;
      for (const sx of [-1, 1]) { cyl(MO, 0.08, 0.08, 1.6, C.post, sx * 1.0, H + 0.3, -0.6, 6); }
      const bread = M("#F2C98A"), crust = M("#C98B48");
      bx(SW, 3.3, 0.32, 2.1, crust, 0, -0.32, 0); bx(SW, 3.1, 0.06, 1.9, bread, 0, -0.02, 0);
      const wavy = (a, b, amp, n, depth, col, y, seed) => { const s = new TH.Shape(), N = 64; for (let i = 0; i <= N; i++) { const th = (i / N) * Math.PI * 2, rr = 1 + amp * Math.sin(n * th + seed);
          const x = Math.sign(Math.cos(th)) * Math.pow(Math.abs(Math.cos(th)), 0.6) * a * rr, z = Math.sign(Math.sin(th)) * Math.pow(Math.abs(Math.sin(th)), 0.6) * b * rr; i ? s.lineTo(x, z) : s.moveTo(x, z); }
        const g = new TH.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 4 }); g.rotateX(Math.PI / 2); const m = new TH.Mesh(g, M(col)); m.position.y = y + depth; SW.add(m); };
      wavy(1.85, 1.25, 0.07, 14, 0.12, "#7CC15A", 0.04, 0);
      wavy(1.7, 1.12, 0.04, 9, 0.12, "#F29AA5", 0.16, 1);
      for (const [x, z] of [[-1.1, 0.75], [0, 0.85], [1.1, 0.75], [-0.6, -0.6], [0.7, -0.6]]) cyl(SW, 0.48, 0.48, 0.12, "#E2574C", x, 0.28, z, 14);
      { const ch = bx(SW, 2.6, 0.07, 2.6, "#F6CF3E", 0, 0.4, 0); ch.rotation.y = Math.PI / 4; ch.scale.z = 0.72; }
      bx(SW, 3.3, 0.3, 2.1, crust, 0, 0.47, 0); bx(SW, 3.1, 0.05, 1.9, bread, 0, 0.44, 0); sph(SW, 1, M("#DFA255"), 0, 0.76, 0, 1.62, 0.36, 1.02, 18);
      cyl(SW, 0.03, 0.03, 1.3, "#F2E6C8", 0.5, 0.7, 0.2, 5); sph(SW, 0.17, "#6E9F3A", 0.5, 2.0, 0.2); bx(SW, 0.36, 0.22, 0.02, "#E2574C", 0.71, 1.68, 0.2);
    }
    // chalkboard A-frame (price is live: setPrice(n))
    let price = 10;
    const chalkDraw = (g, w, h) => { g.fillStyle = "#2E3B36"; g.fillRect(0, 0, w, h); const r = pr(33);
      for (let i = 0; i < 160; i++) { g.fillStyle = "rgba(255,255,255,0.05)"; g.fillRect(r() * w, r() * h, 10 + r() * 30, 2); }
      g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#F4F1EA"; g.font = "900 40px Outfit, Nunito, sans-serif"; g.fillText("SANDWICH", w / 2, 62);
      g.strokeStyle = "#F4F1EA"; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 92); g.lineTo(w - 40, 92); g.stroke();
      // doodle sandwich
      const L = [["#F2C98A", 12], ["#9AD86A", 6], ["#F28A7A", 6], ["#F6D24A", 5], ["#F2C98A", 12]]; let y = 200; L.forEach(([c, hh]) => { g.fillStyle = c; g.beginPath(); g.moveTo(w / 2 - 54, y); g.lineTo(w / 2 + 54, y); g.lineTo(w / 2 + 46, y - hh); g.lineTo(w / 2 - 46, y - hh); g.fill(); y -= hh; });
      g.fillStyle = "#F6D77A"; g.font = `900 ${price >= 100 ? 84 : 104}px Outfit, Nunito, sans-serif`; g.fillText("$" + price, w / 2, 278);
      g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 2; g.strokeRect(12, 12, w - 24, h - 24); };
    const chalkTex = W3.fontTex(256, 352, chalkDraw, ["900 40px Outfit"], { clamp: true });
    const chalkM = W3.toon("#FFFFFF", chalkTex, { emissive: new TH.Color("#FFFFFF"), emissiveMap: chalkTex, emissiveIntensity: 0.12 }); nightMats.push([chalkM, 0.12, 0.35]);
    const CB = grp(root, -6.6, 0.06, -8.4);
    for (const s of [1, -1]) { const b = grp(CB, 0, 0, s * 0.22); b.rotation.x = -s * 0.2; bx(b, 0.78, 1.12, 0.05, M("#B07A4C", texPlank), 0, 0, s * 0.03, { tile: 1 });
      if (s > 0) { const pl = new TH.Mesh(new TH.PlaneGeometry(0.64, 0.88), chalkM); pl.position.set(0, 0.6, 0.06); b.add(pl); pl.userData.keep = 1; }
      else { const pl = new TH.Mesh(new TH.PlaneGeometry(0.64, 0.88), chalkM); pl.position.set(0, 0.6, -0.06); pl.rotation.y = Math.PI; b.add(pl); } }
    const setPrice = (n) => { const v = Math.round(n); if (v === price) return; price = v; redrawChalk(); };
    function redrawChalk() { const c = chalkTex.image, g = c.getContext("2d"); g.clearRect(0, 0, c.width, c.height); chalkDraw(g, c.width, c.height); chalkTex.needsUpdate = true; }

    // ---------- CRUMB ISLAND BANK ----------
    const BK = grp(root, 0, 0, -14.25);
    { const W = 7.4, D = 5.5, H = 5.0, F = D / 2, wallM = M(C.cream, texStucco), stM = M("#E9DFC9", texStone), colM = M("#FBF4E4");
      bx(BK, W + 0.2, 0.8, D + 0.2, stM, 0, 0, 0, { tile: 1.4 }); bx(BK, W, H - 0.8, D, wallM, 0, 0.8, 0, { tile: 2.4 });
      for (const sx of [-1, 1]) for (const zz of [F - 0.15, -F + 0.15]) bx(BK, 0.42, H - 0.8, 0.42, colM, sx * (W / 2 - 0.12), 0.8, zz);
      bx(BK, W + 0.5, 0.35, D + 0.5, colM, 0, H, 0); bx(BK, W + 0.3, 0.14, D + 0.3, "#E2D6BC", 0, H - 0.14, 0);
      // portico: platform + 2 steps down to z = -10
      bx(BK, 6.8, 0.45, 0.8, stM, 0, 0, F + 0.4, { tile: 1.2 }); bx(BK, 7.2, 0.3, 0.45, stM, 0, 0, F + 1.0, { tile: 1.2 }); bx(BK, 7.6, 0.15, 0.5, stM, 0, 0, F + 1.45, { tile: 1.2 });
      for (const x of [-2.85, -1.05, 1.05, 2.85]) { bx(BK, 0.66, 0.22, 0.66, colM, x, 0.45, F + 0.4); cyl(BK, 0.23, 0.28, 3.55, colM, x, 0.67, F + 0.4, 14); bx(BK, 0.7, 0.2, 0.7, colM, x, 4.22, F + 0.4);
        const t = new TH.Mesh(new TH.TorusGeometry(0.27, 0.06, 6, 14).rotateX(Math.PI / 2), colM); t.position.set(x, 0.92, F + 0.4); BK.add(t); }
      bx(BK, 7.0, 0.7, 1.2, colM, 0, 4.42, F + 0.25); bx(BK, 7.3, 0.16, 1.4, "#E2D6BC", 0, 5.12, F + 0.25);
      sign(BK, "CRUMB ISLAND BANK", 6.2, 0.5, 0, 4.52, F + 0.89, { bg: "#FBF4E4", color: "#2F6F73", border: false, frame: "#FBF4E4", d: 0.04 });
      { const s = new TH.Shape(); s.moveTo(-3.65, 0); s.lineTo(3.65, 0); s.lineTo(0, 1.35); s.closePath(); const g = new TH.ExtrudeGeometry(s, { depth: 1.2, bevelEnabled: false }); const m = new TH.Mesh(g, colM); m.position.set(0, 5.28, F - 0.35); BK.add(m);
        const a = Math.atan2(1.35, 3.65), L = Math.hypot(3.65, 1.35) + 0.3; for (const sx of [-1, 1]) { const r = bx(BK, L, 0.18, 1.45, "#E2D6BC", sx * 1.82, 5.28 + 0.6, F + 0.25); r.rotation.z = -sx * a; }
        const coin = new TH.Mesh(new TH.CylinderGeometry(0.36, 0.36, 0.1, 20).rotateX(Math.PI / 2), M("#F2C14E")); coin.position.set(0, 5.75, F + 0.9); BK.add(coin);
        const ring = new TH.Mesh(new TH.TorusGeometry(0.26, 0.04, 6, 20), M("#D99A2B")); ring.position.set(0, 5.75, F + 0.96); BK.add(ring); }
      // hip roof + gold cupola
      const roof = new TH.Mesh(new TH.ConeGeometry(1, 1.5, 4), M(C.teal, texTile)); roof.rotation.y = Math.PI / 4; roof.scale.set((W + 0.6) / 2 / 0.7071, 1, (D + 0.4) / 2 / 0.7071); roof.position.set(0, H + 0.35 + 0.75, -0.15); W3.uvScale(roof.geometry, 4, 3); BK.add(roof);
      cyl(BK, 0.55, 0.6, 0.8, colM, 0, H + 1.2, -0.3, 12); sph(BK, 0.6, "#F2C14E", 0, H + 2.0, -0.3, 1, 0.9, 1, 14); cyl(BK, 0.03, 0.03, 0.6, "#D99A2B", 0, H + 2.5, -0.3, 5); sph(BK, 0.09, "#F2C14E", 0, H + 3.12, -0.3, 1, 1, 1, 6);
      // double door with fanlight
      bx(BK, 1.9, 2.75, 0.16, colM, 0, 0.45, F + 0.02); bx(BK, 0.78, 2.5, 0.08, M("#2F6F73", texPlank), -0.4, 0.45, F + 0.08); bx(BK, 0.78, 2.5, 0.08, M("#2F6F73", texPlank), 0.4, 0.45, F + 0.08);
      for (const sx of [-1, 1]) { bx(BK, 0.5, 0.9, 0.04, "#3E8285", sx * 0.4, 1.9, F + 0.12); bx(BK, 0.5, 0.8, 0.04, "#3E8285", sx * 0.4, 0.75, F + 0.12); sph(BK, 0.05, "#F2C14E", sx * 0.1, 1.7, F + 0.15, 1, 1, 1, 6); }
      { const fan = new TH.Mesh(new TH.CylinderGeometry(0.78, 0.78, 0.06, 16, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2), winMat); fan.position.set(0, 3.0, F + 0.05); BK.add(fan); }
      for (const sx of [-1, 1]) { win(BK, 0.95, 1.9, sx * 1.95, 1.2, F + 0.02, { noCross: false }); bx(BK, 1.25, 0.2, 0.22, colM, sx * 1.95, 3.25, F + 0.04); }
      for (const sx of [-1, 1]) { const sg = grp(BK, sx * W / 2, 0, 0, sx * Math.PI / 2); win(sg, 0.95, 1.9, -1.2, 1.2, 0.02); win(sg, 0.95, 1.9, 1.2, 1.2, 0.02); }
      flowerPot(BK, -3.55, F + 1.55); flowerPot(BK, 3.55, F + 1.55);
    }

    // ---------- BEA'S BAKERY ----------
    const BE = grp(root, 9, 0, -12.75);
    { const W = 7, D = 5.5, H = 3.9, F = D / 2, wallM = M(C.butter, texSiding);
      bx(BE, W + 0.12, 0.45, D + 0.12, M("#D9A85A", texStone), 0, 0, 0, { tile: 1.4 }); bx(BE, W, H - 0.45, D, wallM, 0, 0.45, 0, { tile: 2.0 });
      for (const sx of [-1, 1]) for (const zz of [F - 0.1, -F + 0.1]) bx(BE, 0.3, H, 0.3, C.trim, sx * (W / 2 - 0.08), 0, zz);
      bx(BE, W + 0.3, 0.2, D + 0.3, C.trim, 0, H, 0);
      const rg = grp(BE, 0, 0, 0, Math.PI / 2); gableRoof(rg, D + 0.2, W + 0.2, H + 0.2, 2.3, 0.45, C.terra, C.butter, texSiding, { chimney: [-1.2, -2.0] });
      const dm = display("bea", 37);
      for (const sx of [-1, 1]) { const x = sx * 2.1; bx(BE, 2.1, 0.7, 0.2, M("#C98A52", texPlank), x, 0.3, F, { tile: 1 }); bx(BE, 1.9, 1.6, 0.06, dm, x, 1.0, F - 0.02);
        bx(BE, 2.2, 0.12, 0.2, C.trim, x, 2.6, F + 0.02); bx(BE, 0.12, 1.7, 0.2, C.trim, x - 1.02, 0.95, F + 0.02); bx(BE, 0.12, 1.7, 0.2, C.trim, x + 1.02, 0.95, F + 0.02); bx(BE, 2.2, 0.1, 0.3, C.trim, x, 0.95, F + 0.06); }
      door(BE, 1.2, 2.25, 0, F + 0.04, "#E2574C");
      awning(BE, 6.6, 0, 3.1, F + 0.05, 1.25, 0.5, stripes(C.teal, "#FFF6EA", 16, 34), C.teal);
      sign(BE, "BEA'S BAKERY", 4.6, 0.8, 0, 4.15, F + 0.2, { bg: "#FFF3DC", color: "#2F8F8A" });
      { const rw = new TH.Mesh(new TH.CylinderGeometry(0.42, 0.42, 0.1, 18).rotateX(Math.PI / 2), winMat); rw.position.set(0, 5.35, F + 0.12); BE.add(rw);
        const rr = new TH.Mesh(new TH.TorusGeometry(0.45, 0.07, 6, 18), M(C.trim)); rr.position.set(0, 5.35, F + 0.16); BE.add(rr); }
      // hanging loaf sign on an iron arm
      bx(BE, 0.1, 0.1, 1.5, C.post, -3.1, 3.55, F + 0.7); const lf = grp(BE, -3.1, 2.75, F + 1.15);
      cyl(lf, 0.015, 0.015, 0.55, C.post, -0.35, 0.3, 0, 4); cyl(lf, 0.015, 0.015, 0.55, C.post, 0.35, 0.3, 0, 4);
      sph(lf, 0.5, "#E0A050", 0, 0.12, 0, 1.45, 0.62, 0.62, 16); for (let k = -1; k <= 1; k++) { const sl = bx(lf, 0.08, 0.04, 0.5, "#FBE3B0", k * 0.35, 0.39, 0.0); sl.rotation.y = 0.6; sl.rotation.x = 0.0; }
      flowerPot(BE, -3.2, F + 0.45); flowerPot(BE, 3.2, F + 0.45);
      for (const sx of [-1, 1]) { const sg = grp(BE, sx * W / 2, 0, 0, sx * Math.PI / 2); win(sg, 1.1, 1.3, 0, 1.6, 0.02, { shutter: C.teal, box: C.wood }); }
    }

    // =====================================================================================
    // EAST: THE CRAB SHACK (13, 0, 3) facing -x · tables + umbrellas react to env.bust
    // =====================================================================================
    const pickets = [];   // [x, z, ry, h] → one InstancedMesh
    const fenceRun = (x1, z1, x2, z2, h = 0.85, col = "#FFF7EA") => { const L = Math.hypot(x2 - x1, z2 - z1), ry = Math.atan2(x2 - x1, z2 - z1), n = Math.max(2, Math.round(L / 0.3));
      for (let i = 0; i <= n; i++) { const k = i / n; pickets.push([x1 + (x2 - x1) * k, z1 + (z2 - z1) * k, ry, h]); }
      for (const y of [0.25, 0.6]) { const r = bx(root, 0.05, 0.08, L, col, (x1 + x2) / 2, y * h / 0.85, (z1 + z2) / 2); r.rotation.y = ry; r.position.x += Math.cos(ry) * -0.04; r.position.z -= Math.sin(ry) * -0.04; } };
    const CRA = -Math.PI / 2, CR = grp(root, 13, 0, 3, CRA);
    const crabDyn = grp(dyn, 13, 0, 3, CRA);
    { const W = 7, D = 4.8, H = 3.5, F = D / 2, wallM = M(C.lilac, texSiding);
      bx(CR, W + 0.15, 0.4, D + 0.15, M("#8E7AB0", texStone), 0, 0, 0, { tile: 1.4 }); bx(CR, W, H - 0.4, D, wallM, 0, 0.4, 0, { tile: 1.8 });
      for (const sx of [-1, 1]) for (const zz of [F - 0.1, -F + 0.1]) bx(CR, 0.28, H, 0.28, C.trim, sx * (W / 2 - 0.08), 0, zz);
      bx(CR, W + 0.3, 0.18, D + 0.3, C.trim, 0, H, 0);
      gableRoof(CR, W + 0.3, D + 0.3, H + 0.18, 1.9, 0.5, C.teal, C.lilac, texSiding, { chimney: [2.2, -0.8] });
      bx(CR, W + 0.4, 0.22, 1.3, M("#B5875A", texPlank), 0, 0, F + 0.65, { tile: 1.2 });   // porch deck
      door(CR, 1.2, 2.25, 0, F + 0.04, C.sky, { noStep: true });
      for (const sx of [-1, 1]) win(CR, 1.2, 1.15, sx * 2.2, 1.25, F + 0.02, { shutter: "#4F8FC0", box: "#4F8FC0" });
      sign(CR, "THE CRAB SHACK", 5.4, 0.72, 0, 2.62, F + 0.13, { bg: "#FFF3DC", color: "#D8473C" });
      const ring = new TH.Mesh(new TH.TorusGeometry(0.34, 0.1, 8, 18), M("#F25C4C")); ring.position.set(-3.2, 2.85, F + 0.14); CR.add(ring);
      for (let k = 0; k < 4; k++) { const b = bx(CR, 0.12, 0.2, 0.06, "#FFF7EA", -3.2 + Math.cos(k * Math.PI / 2 + 0.78) * 0.34, 2.75 + Math.sin(k * Math.PI / 2 + 0.78) * 0.34, F + 0.22); b.rotation.z = k * Math.PI / 2 + 0.78; }
      for (const sx of [-1, 1]) { const sg = grp(CR, sx * W / 2, 0, 0, sx * Math.PI / 2); const pw = new TH.Mesh(new TH.CylinderGeometry(0.4, 0.4, 0.1, 16).rotateX(Math.PI / 2), winMat); pw.position.set(0, 2.0, 0.04); sg.add(pw);
        const pr2 = new TH.Mesh(new TH.TorusGeometry(0.42, 0.08, 6, 16), M("#F2C14E")); pr2.position.set(0, 2.0, 0.08); sg.add(pr2); }
      // big crab on the ridge
      const cb = grp(CR, 0, H + 0.18 + 1.9 + 0.05, 0); const cm = M("#F25C4C"), cd = M("#D8473C");
      sph(cb, 0.9, cm, 0, 0.35, 0, 1.25, 0.55, 0.85, 16); for (const sx of [-1, 1]) { cyl(cb, 0.05, 0.05, 0.45, cd, sx * 0.3, 0.6, 0.45, 6); sph(cb, 0.14, "#FFF7EA", sx * 0.3, 1.08, 0.45, 1, 1, 1, 8); sph(cb, 0.07, INK, sx * 0.3, 1.1, 0.57, 1, 1, 1, 6);
        const arm = bx(cb, 0.7, 0.14, 0.14, cd, sx * 1.35, 0.4, 0.45); arm.rotation.z = sx * 0.6; sph(cb, 0.3, cm, sx * 1.65, 0.95, 0.55, 1, 0.75, 0.5, 10);
        for (let k = 0; k < 3; k++) { const lg = bx(cb, 0.6, 0.09, 0.09, cd, sx * 1.1, 0.05, -0.3 + k * 0.3); lg.rotation.z = -sx * 0.5; } }
    }
    const CLOSED = grp(crabDyn, 0, 2.05, 2.4 + 0.16); { cyl(CLOSED, 0.008, 0.008, 0.3, C.post, -0.18, -0.02, 0, 4).rotation.z = 0.5; cyl(CLOSED, 0.008, 0.008, 0.3, C.post, 0.18, -0.02, 0, 4).rotation.z = -0.5;
      const cs = sign(CLOSED, "CLOSED", 0.8, 0.34, 0, -0.38, 0, { bg: "#E2574C", color: "#FFF6EA", frame: "#FFF6EA", d: 0.03, lit: false }); }
    CLOSED.scale.setScalar(0.001);
    // patio tables (world coords), umbrellas fold + chairs go up on env.bust
    const gingham = T(64, 64, (g, w, h) => { g.fillStyle = "#FFF6EA"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(226,87,76,0.55)"; for (let i = 0; i < 4; i++) { g.fillRect(i * 16, 0, 8, h); g.fillRect(0, i * 16, w, 8); } });
    gingham.repeat.set(1, 1); const tableTop = M("#FFFFFF", gingham), chairM = M("#4F8FC0"), chairW = M("#FFF7EA");
    const umbTex = [stripes("#F25C4C", "#FFF6EA", 12, 40), stripes("#2F8F8A", "#FFF6EA", 12, 41), stripes("#F6C94A", "#FFF6EA", 12, 42)];
    const tables = [], chairs = [];
    [[8.3, -0.4], [8.3, 6.4], [11.8, 8.7]].forEach(([x, z], ti) => { const tg = grp(root, x, 0.06, z);
      cyl(tg, 0.32, 0.36, 0.05, ironM, 0, 0, 0, 12); cyl(tg, 0.05, 0.05, 2.35, "#FFF7EA", 0, 0, 0, 6); cyl(tg, 0.07, 0.07, 0.7, ironM, 0, 0.05, 0, 8); { const g = new TH.CylinderGeometry(0.6, 0.6, 0.06, 20); const m = new TH.Mesh(g, tableTop); m.position.y = 0.76; tg.add(m); }
      const ug = grp(dyn, x, 2.42, z); const can = new TH.Mesh(new TH.ConeGeometry(1.35, 0.55, 12, 1, false), M("#FFFFFF", umbTex[ti])); can.position.y = -0.2; ug.add(can);
      const tip = sph(ug, 0.07, "#FFF7EA", 0, 0.1, 0, 1, 1, 1, 6); tables.push({ ug, can, x, z, ph: ti * 0.7 });
      for (let c = 0; c < 3; c++) { const a = ti * 0.9 + (c / 3) * Math.PI * 2, ch = grp(dyn, x + Math.sin(a) * 0.9, 0.06, z + Math.cos(a) * 0.9, a + Math.PI);
        bx(ch, 0.46, 0.06, 0.44, chairM, 0, 0.44, 0); for (const [lx, lz] of [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]]) bx(ch, 0.05, 0.44, 0.05, chairW, lx, 0, lz);
        bx(ch, 0.46, 0.42, 0.05, chairM, 0, 0.5, -0.2); bx(ch, 0.04, 0.42, 0.04, chairW, -0.2, 0.5, -0.21); bx(ch, 0.04, 0.42, 0.04, chairW, 0.2, 0.5, -0.21);
        chairs.push({ ch, x0: x + Math.sin(a) * 0.9, z0: z + Math.cos(a) * 0.9, x1: x + Math.sin(a) * 0.45, z1: z + Math.cos(a) * 0.45, a, i: ti * 3 + c }); } });

    // =====================================================================================
    // WEST: KAI'S BUILDING CO. yard (-13, 0, 3) facing +x · ANA'S COTTAGE (-14, 0, 12) facing +x
    // =====================================================================================
    const KA = grp(root, -13, 0, 3, Math.PI / 2);
    { bx(KA, 6.4, 0.04, 4.0, M("#E3C48E", texSand), 0, 0, 0.6, { tile: 3 });
      const sh = grp(KA, 0, 0, -2.6), W = 5.2, D = 3.2, H = 2.9, F = D / 2, pl = M(C.sky, texPlank);
      bx(sh, W, H, D, pl, 0, 0, 0, { tile: 1.6 }); for (const sx of [-1, 1]) for (const zz of [F - 0.08, -F + 0.08]) bx(sh, 0.2, H, 0.2, C.trim, sx * (W / 2 - 0.05), 0, zz);
      gableRoof(sh, W + 0.1, D + 0.1, H, 1.3, 0.4, C.terra, C.sky, texPlank);
      bx(sh, 2.4, 2.3, 0.08, M("#E9B04A", texPlank), -0.6, 0, F + 0.02, { tile: 1.4 }); bx(sh, 2.5, 0.12, 0.14, C.trim, -0.6, 2.3, F + 0.03);
      for (const sx of [-1, 1]) { const zb = bx(sh, 0.12, 1.5, 0.05, C.trim, -0.6 + sx * 0.6, 0.4, F + 0.08); zb.rotation.z = sx * 0.62; } bx(sh, 0.04, 2.3, 0.1, C.trim, -0.6, 0, F + 0.08);
      win(sh, 0.9, 0.8, 1.7, 1.2, F + 0.02, { shutter: "#E9B04A" });
      sign(sh, "KAI'S BUILDING CO.", 5.0, 0.7, 0, 3.05, F + 0.25, { bg: "#F6D77A", color: "#2E5B5F" });
      for (const sx of [-1, 1]) cyl(sh, 0.05, 0.05, 0.6, C.post, sx * 2.2, 2.75, F + 0.2, 5);
      // lumber stack
      const lg = grp(KA, 1.8, 0, 0.6); const lc = ["#C98A52", "#B97A44", "#D9A06A", "#A86E3E"]; const rr = pr(51);
      for (let l = 0; l < 2; l++) bx(lg, 1.7, 0.1, 0.12, "#7A5232", 0, 0, -0.9 + l * 1.8);
      for (let layer = 0; layer < 5; layer++) for (let i = 0; i < 5 - (layer > 2 ? 1 : 0); i++) bx(lg, 0.26, 0.11, 2.7, M(lc[Math.floor(rr() * 4)], texPlank), -0.6 + i * 0.29 + (layer > 2 ? 0.15 : 0), 0.1 + layer * 0.12, (rr() - 0.5) * 0.25, { tile: 1 });
      // sawhorse + plank, toolbox, ladder leaning on the shed
      const sw = grp(KA, -1.6, 0, 1.3, 0.3); for (const sx of [-1, 1]) { for (const lz of [-1, 1]) { const l = bx(sw, 0.06, 0.75, 0.06, "#8A5A35", sx * 0.45, 0, lz * 0.12); l.rotation.x = lz * 0.18; } }
      bx(sw, 1.2, 0.08, 0.1, "#8A5A35", 0, 0.72, 0); bx(sw, 2.2, 0.05, 0.28, M("#D9A06A", texPlank), 0.1, 0.8, 0, { tile: 1 });
      bx(KA, 0.6, 0.3, 0.3, "#E2574C", -1.0, 0.04, 2.1); bx(KA, 0.3, 0.06, 0.06, "#2E5B5F", -1.0, 0.36, 2.1);
      const ld = grp(KA, 2.3, 0.04, -0.05); ld.rotation.x = -0.32; for (const sx of [-1, 1]) bx(ld, 0.07, 3.0, 0.07, "#E9B04A", sx * 0.25, 0, 0); for (let k = 0; k < 8; k++) bx(ld, 0.5, 0.05, 0.05, "#E9B04A", 0, 0.3 + k * 0.35, 0);
    }
    fenceRun(-16.4, 6.4, -10.6, 6.4); fenceRun(-10.6, 6.4, -10.6, 4.6); fenceRun(-10.6, 1.4, -10.6, -0.4); fenceRun(-10.6, -0.4, -16.4, -0.4);
    const anaWinMat = glowMat("#BFE3F0", "#FFC46A", 0.0, 2.2, texGlass);
    const AN = grp(root, -14, 0, 12, Math.PI / 2);
    { const W = 4.2, D = 4.0, H = 2.8, F = D / 2;
      bx(AN, W + 0.12, 0.35, D + 0.12, M("#7FB8A2", texStone), 0, 0, 0, { tile: 1.2 }); bx(AN, W, H - 0.35, D, M(C.mint, texSiding), 0, 0.35, 0, { tile: 1.6 });
      for (const sx of [-1, 1]) for (const zz of [F - 0.08, -F + 0.08]) bx(AN, 0.22, H, 0.22, C.trim, sx * (W / 2 - 0.05), 0, zz);
      bx(AN, W + 0.24, 0.16, D + 0.24, C.trim, 0, H, 0);
      const rg = grp(AN, 0, 0, 0, Math.PI / 2); gableRoof(rg, D + 0.2, W + 0.2, H + 0.16, 1.9, 0.4, C.terra, C.mint, texSiding, { chimney: [-0.9, 1.1] });
      door(AN, 1.0, 2.1, -0.65, F + 0.04, "#F6D77A");
      win(AN, 0.85, 0.95, 1.2, 1.15, F + 0.02, { mat: anaWinMat, shutter: C.coral, box: C.wood });
      { const rw = new TH.Mesh(new TH.CylinderGeometry(0.3, 0.3, 0.08, 16).rotateX(Math.PI / 2), anaWinMat); rw.position.set(0, H + 0.95, F + 0.14); AN.add(rw); const rr2 = new TH.Mesh(new TH.TorusGeometry(0.32, 0.06, 6, 16), M(C.trim)); rr2.position.set(0, H + 0.95, F + 0.17); AN.add(rr2); }
      cyl(AN, 0.04, 0.04, 1.0, C.wood, 1.9, 0, F + 2.75, 6); bx(AN, 0.3, 0.26, 0.42, "#4F8FC0", 1.9, 1.0, F + 2.75); bx(AN, 0.04, 0.16, 0.12, "#E2574C", 2.07, 1.15, F + 2.65);
      bx(AN, 1.4, 0.04, 2.0, M(C.stone, texStone), -0.65, 0, F + 1.2, { tile: 1 });
      for (const sx of [-1, 1]) { const sg = grp(AN, sx * W / 2, 0, 0, sx * Math.PI / 2); win(sg, 0.8, 0.9, 0, 1.15, 0.02, { mat: sx < 0 ? anaWinMat : winMat, shutter: C.coral }); }
    }
    fenceRun(-11.6, 9.4, -9.6, 9.4); fenceRun(-9.6, 9.4, -9.6, 12.0); fenceRun(-9.6, 13.3, -9.6, 14.6); fenceRun(-9.6, 14.6, -11.6, 14.6);

    // =====================================================================================
    // RING HOUSES (12) in pastel colours, facing the square
    // =====================================================================================
    const HOUSES = [[-24, -7], [-21, -19], [-9.5, -26], [5, -27], [17.5, -21], [26, -10.5], [28, 2], [23.5, 13], [-26.5, 5], [-33, -16], [33, -21], [13, -35], [-4, -37]];
    const wallCols = [C.coral, C.mint, C.butter, C.sky, C.lilac, C.cream, C.peach, C.pink], doorCols = [C.teal, "#E2574C", "#4F8FC0", "#F6D77A", "#8E6AC0"];
    const hr = pr(77);
    const houseGroups = [], housesRoot = new TH.Group(); housesRoot.name = "town-houses"; W3.scene.add(housesRoot);   // separate so each house can vanish (ep6)
    HOUSES.forEach(([x, z], i) => { const ry = Math.atan2(-x, -z), h = grp(housesRoot, x, 0, z, ry); houseGroups.push(h);
      const W = 4.6 + hr() * 1.6, D = 4.0 + hr() * 1.0, H = 2.9 + hr() * 0.9, F = D / 2, wc = wallCols[i % wallCols.length], rc = i % 3 === 1 ? C.teal : C.terra, tex = i % 2 ? texSiding : texStucco;
      bx(h, W + 0.12, 0.35, D + 0.12, M(shade(wc, -0.25), texStone), 0, 0, 0, { tile: 1.3 }); bx(h, W, H - 0.35, D, M(wc, tex), 0, 0.35, 0, { tile: 1.8 });
      for (const sx of [-1, 1]) for (const zz of [F - 0.08, -F + 0.08]) bx(h, 0.22, H, 0.22, C.trim, sx * (W / 2 - 0.05), 0, zz);
      bx(h, W + 0.24, 0.16, D + 0.24, C.trim, 0, H, 0);
      const frontGable = i % 2 === 0; const chim = hr() < 0.6 ? [W * 0.25, -0.6] : null;
      if (frontGable) { const rg = grp(h, 0, 0, 0, Math.PI / 2); gableRoof(rg, D + 0.2, W + 0.2, H + 0.16, 1.6 + hr() * 0.5, 0.4, rc, wc, tex, chim ? { chimney: [0.6, -W * 0.25] } : {});
        win(h, 0.6, 0.6, 0, H + 0.6, F + 0.14, { noCross: true }); }
      else gableRoof(h, W + 0.2, D + 0.2, H + 0.16, 1.5 + hr() * 0.5, 0.4, rc, wc, tex, chim ? { chimney: chim } : {});
      const dx = (hr() < 0.5 ? -1 : 1) * (W * 0.22); door(h, 1.0, 2.1, dx, F + 0.04, doorCols[i % doorCols.length]);
      const sh = hr() < 0.7 ? [C.teal, "#4F8FC0", "#E2574C", "#FFF7EA"][i % 4] : null;
      win(h, 0.9, 0.95, -dx, 1.15, F + 0.02, { shutter: sh, box: hr() < 0.7 ? C.wood : null });
      for (const sx of [-1, 1]) { const sg = grp(h, sx * W / 2, 0, 0, sx * Math.PI / 2); win(sg, 0.8, 0.9, 0, 1.15, 0.02, { shutter: sh }); }
      if (i % 3 !== 2) { const fz = F + 2.0, fx = W / 2 + 0.4; const P = (lx, lz) => [x + Math.cos(ry) * lx + Math.sin(ry) * lz, z - Math.sin(ry) * lx + Math.cos(ry) * lz];
        const a = P(-fx, F + 0.1), b = P(-fx, fz), c = P(dx - 0.7, fz), d = P(dx + 0.7, fz), e = P(fx, fz), f = P(fx, F + 0.1);
        fenceRun(a[0], a[1], b[0], b[1]); fenceRun(b[0], b[1], c[0], c[1]); fenceRun(d[0], d[1], e[0], e[1]); fenceRun(e[0], e[1], f[0], f[1]); }
    });

    // =====================================================================================
    // HARBOUR: stone quay z 14..17, wooden pier (0, 0.45, 17 → 38), boats, crates, barrels, nets
    // =====================================================================================
    bx(root, 32, 1.92, 3.0, M("#E2D6C0", texStone), 0, -1.8, 15.5, { tile: 1.4 });
    bx(root, 32.3, 0.12, 0.5, M("#F2E8D6", texStone), 0, 0.12, 16.8, { tile: 1.2 });
    for (const x of [-14, -9, -4, 4.5, 9, 14]) { cyl(root, 0.15, 0.17, 0.42, "#3E5F66", x, 0.24, 16.75, 10); sph(root, 0.17, "#3E5F66", x, 0.66, 16.75, 1, 0.6, 1, 10); }
    bx(root, 3.4, 0.16, 0.8, M("#B5875A", texPlank), 0, 0.12, 16.6, { tile: 1 });
    // pier: planks instanced, stringers + posts baked
    const plankG = new TH.BoxGeometry(3.0, 0.07, 0.27); boxUV(plankG, 3, 0.07, 0.27, 1.5); const NP = 70;
    const planks = new TH.InstancedMesh(plankG, M("#FFFFFF", texPlank), NP); { const r = pr(61), m4 = new TH.Matrix4(), col = new TH.Color();
      for (let i = 0; i < NP; i++) { m4.makeRotationY((r() - 0.5) * 0.02); m4.setPosition((r() - 0.5) * 0.06, 0.415, 17.15 + i * 0.3); planks.setMatrixAt(i, m4); col.set(["#B98A5C", "#A97C50", "#C79A68", "#B38254"][Math.floor(r() * 4)]); planks.setColorAt(i, col); } }
    W3.add(planks, 0, 0, 0, 0, dyn);
    for (const x of [-1.2, 0, 1.2]) bx(root, 0.16, 0.22, 21, "#7A5232", x, 0.16, 27.5);
    for (let i = 0; i < 8; i++) { const z = 17.6 + i * 2.85; for (const sx of [-1, 1]) { cyl(root, 0.15, 0.16, 3.2, M("#8A6040", texPlank), sx * 1.62, -2.3, z, 8); sph(root, 0.15, "#8A6040", sx * 1.62, 0.9, z, 1, 0.5, 1, 8); }
      bx(root, 3.4, 0.14, 0.18, "#7A5232", 0, 0.18, z); }
    for (const sx of [-1, 1]) { const r = bx(root, 0.06, 0.06, 20, "#E9D8B0", sx * 1.62, 0.72, 27.6); }
    { const L = grp(root, 1.2, 0.45, 37.6); cyl(L, 0.06, 0.07, 2.3, ironM, 0, 0, 0, 8); bx(L, 0.3, 0.42, 0.3, lampMat, 0, 2.3, 0); const cp = new TH.Mesh(new TH.ConeGeometry(0.3, 0.28, 4), ironM); cp.rotation.y = Math.PI / 4; cp.position.y = 2.86; L.add(cp);
      const gl = W3.glow("#FFD27A", 1.3, 1.2, 2.96, 37.6); gl.parent.remove(gl); dyn.add(gl); glows.push([gl, "lamp"]);
      const lr = new TH.Mesh(new TH.TorusGeometry(0.3, 0.09, 8, 16), M("#F25C4C")); lr.position.set(-1.5, 0.95, 36.8); lr.rotation.y = Math.PI / 2; root.add(lr); }
    // quay props
    const crate = (p, x, y, z, s = 0.62, ry = 0, col = "#C98A52") => { const c = grp(p, x, y, z, ry); bx(c, s, s, s, M(col, texPlank), 0, 0, 0, { tile: 0.62 });
      for (const sy of [0.06, s - 0.12]) bx(c, s + 0.04, 0.08, s + 0.04, shade(col, -0.25), 0, sy, 0); return c; };
    const barrel = (p, x, y, z, col = "#B07A4C", fish) => { cyl(p, 0.36, 0.32, 0.85, M(col, texPlank), x, y, z, 12, { uv: [3, 1] });
      for (const by of [0.15, 0.62]) { const t = new TH.Mesh(new TH.TorusGeometry(0.355, 0.035, 5, 14).rotateX(Math.PI / 2), M("#5E6A70")); t.position.set(x, y + by, z); p.add(t); }
      if (fish) { cyl(p, 0.3, 0.3, 0.05, "#7FD3DB", x, y + 0.72, z, 12); for (let k = 0; k < 4; k++) { const a = k * 1.6; const f = sph(p, 0.2, ["#8EC3E8", "#F4A28C", "#C7B3E6", "#9FD8C2"][k], x + Math.cos(a) * 0.14, y + 0.82, z + Math.sin(a) * 0.14, 1, 0.45, 0.4, 8); f.rotation.set(0.5, a, 0.9); } } };
    crate(root, -7.4, 0.12, 15.0); crate(root, -6.7, 0.12, 15.2, 0.6, 0.3, "#D9A06A"); crate(root, -7.1, 0.74, 15.1, 0.55, 0.15, "#B97A44");
    barrel(root, -5.6, 0.12, 14.9, "#B07A4C", true); barrel(root, -4.9, 0.12, 15.5, "#9A6A44", true); barrel(root, 3.2, 0.12, 15.0, "#9A6A44", true); barrel(root, 3.9, 0.12, 14.7);
    crate(root, 5.2, 0.12, 15.3, 0.6, 0.4, "#4F8FC0"); crate(root, 5.9, 0.12, 15.0, 0.6, -0.2, "#C98A52");
    { const net = sph(root, 1, M("#6E9F8A", T(64, 64, (g, w, h) => { g.fillStyle = "#8FC2A8"; g.fillRect(0, 0, w, h); g.strokeStyle = "#3F6E5C"; g.lineWidth = 3; for (let i = 0; i < w; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 16, h); g.moveTo(i + 16, 0); g.lineTo(i, h); g.stroke(); } })), -7.0, 0.12, 15.1, 0.95, 0.75, 0.8, 12);
      W3.uvScale(net.geometry, 4, 3); }
    for (const [x, z, c] of [[-9.5, 15.2, "#F25C4C"], [-9.9, 15.6, "#FFF6EA"], [7.4, 15.2, "#F6C94A"]]) sph(root, 0.24, c, x, 0.36, z, 1, 1.2, 1, 10);
    { const t = new TH.Mesh(new TH.TorusGeometry(0.32, 0.09, 6, 16).rotateX(Math.PI / 2), M("#E9D8B0")); t.position.set(8.2, 0.21, 15.3); root.add(t); const t2 = t.clone(); t2.position.y = 0.36; t2.scale.setScalar(0.85); root.add(t2); }
    // lobster pots
    for (const [x, z] of [[10.5, 15.0], [11.2, 15.2], [10.8, 15.0]]) { const lp = grp(root, x, 0.12, z, x); bx(lp, 0.6, 0.4, 0.5, M("#E9B04A", texPlank), 0, 0, 0); for (let k = 0; k < 3; k++) bx(lp, 0.62, 0.05, 0.52, "#8A5A35", 0, 0.08 + k * 0.12, 0); }

    // ---------- boats ----------
    const boatG = (L, B, Hh) => { const s = new TH.Shape(); const hb = B / 2;
      s.moveTo(-hb * 0.82, L / 2); s.lineTo(hb * 0.82, L / 2); s.quadraticCurveTo(hb * 1.02, L * 0.05, hb, -L * 0.12); s.quadraticCurveTo(hb * 0.9, -L * 0.42, 0, -L / 2); s.quadraticCurveTo(-hb * 0.9, -L * 0.42, -hb, -L * 0.12); s.quadraticCurveTo(-hb * 1.02, L * 0.05, -hb * 0.82, L / 2);
      const g = new TH.ExtrudeGeometry(s, { depth: Hh, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 2, curveSegments: 8 }); g.rotateX(-Math.PI / 2); return g; };
    const boat = (o) => { const g = new TH.Group(), L = o.L, B = o.B; dyn.add(g);
      const low = new TH.Mesh(boatG(L * 0.94, B * 0.86, 0.42), M(o.low)); low.position.y = -0.5; g.add(low);
      const up = new TH.Mesh(boatG(L, B, 0.42), M(o.up)); up.position.y = -0.05; g.add(up);
      const st = new TH.Mesh(boatG(L * 1.005, B * 1.005, 0.08), M(o.stripe)); st.position.y = 0.12; g.add(st);
      const dk = new TH.Mesh(boatG(L * 0.9, B * 0.84, 0.05), M("#FFFFFF", texPlank)); W3.uvScale(dk.geometry, 1.5, 1.5); dk.position.y = 0.4; g.add(dk);
      const deckY = 0.52;
      if (o.cabin) { const cb = grp(g, 0, deckY, -L * 0.12); bx(cb, B * 0.6, 1.1, L * 0.24, M(o.cabin, texPlank), 0, 0, 0, { tile: 1 });
        for (const sx of [-1, 1]) bx(cb, 0.05, 0.38, L * 0.14, winMat, sx * B * 0.3, 0.55, 0); bx(cb, B * 0.42, 0.38, 0.05, winMat, 0, 0.55, L * 0.12);
        bx(cb, B * 0.72, 0.12, L * 0.3, M(o.roof, texTile), 0, 1.1, 0); if (o.mast) { cyl(cb, 0.05, 0.06, 1.9, "#FFF7EA", 0, 1.2, -0.2, 6); bx(cb, 0.04, 0.35, 0.5, o.stripe, 0, 2.7, 0.05); sph(cb, 0.08, "#F6C94A", 0, 3.15, -0.2, 1, 1, 1, 6); }
        const lr = new TH.Mesh(new TH.TorusGeometry(0.22, 0.07, 6, 14), M("#F25C4C")); lr.position.set(B * 0.31, 0.5, -L * 0.04); lr.rotation.y = Math.PI / 2; cb.add(lr); }
      else { for (const z of [-L * 0.22, L * 0.18]) bx(g, B * 0.8, 0.06, 0.3, M("#C98A52", texPlank), 0, 0.42, z); for (const sx of [-1, 1]) { const oar = bx(g, 0.06, 0.05, L * 0.75, "#E9B04A", sx * B * 0.28, 0.5, 0); oar.rotation.y = sx * 0.12; } }
      if (o.crates) { crate(g, -B * 0.18, deckY, L * 0.26, 0.45, 0.2, "#4F8FC0"); crate(g, B * 0.2, deckY, L * 0.3, 0.42, -0.3); barrel(g, B * 0.15, deckY, L * 0.12, "#9A6A44", true); }
      for (const [k, fz] of [[0, -0.38], [1, -0.22], [2, 0.3]]) for (const sx of [-1, 1]) sph(g, 0.13, k % 2 ? "#FFF6EA" : "#F25C4C", sx * (B / 2 + 0.06 - (fz > 0.2 ? 0.12 : 0)), 0.1, fz * L, 1, 1.3, 1, 8);
      if (o.name) for (const sx of [-1, 1]) { const ng = grp(g, sx * (B / 2 + 0.075), 0.0, L * 0.06, sx * Math.PI / 2); sign(ng, o.name, 2.0, 0.33, 0, 0.02, 0, { bg: "#FFF6EA", color: "#2E5B5F", d: 0.04, frame: o.stripe, lit: false }); }
      g.userData = Object.assign({ deckY }, o); return g; };
    const BOATS = [
      boat({ name: "THE LUCKY FIN", L: 6.0, B: 2.3, up: "#FFF6EA", low: "#E2574C", stripe: C.teal, cabin: C.sky, roof: C.terra, mast: true, crates: true, x: 3.05, z: 28, ry: 0, ph: 0 }),
      boat({ L: 3.4, B: 1.4, up: "#FFF6EA", low: "#8EC3E8", stripe: "#F6C94A", x: -3.0, z: 22.5, ry: 0.15, ph: 1.7 }),
      boat({ L: 4.8, B: 2.0, up: "#F6D77A", low: "#2F8F8A", stripe: "#FFF6EA", cabin: "#FFF6EA", roof: C.teal, x: -3.6, z: 32.5, ry: -0.08, ph: 3.1 }),
      boat({ L: 4.6, B: 1.9, up: "#C7B3E6", low: "#FFF6EA", stripe: "#F25C4C", cabin: "#F4A28C", roof: C.terra, mast: true, x: 3.3, z: 35.0, ry: 0.05, ph: 2.3, boom: 0.62 }),
      boat({ L: 3.6, B: 1.5, up: "#9FD8C2", low: "#FFF6EA", stripe: "#F6C94A", x: -3.2, z: 27.4, ry: -0.2, ph: 0.9, boom: 0.74 }),
    ];
    const boatPose = (b, t) => { const u = b.userData; return { y: -0.35 + 0.07 * Math.sin(t * 1.25 + u.ph) + 0.02 * Math.sin(t * 2.7 + u.ph * 2), rz: 0.035 * Math.sin(t * 1.05 + u.ph), rx: 0.02 * Math.sin(t * 0.85 + u.ph + 1) }; };

    // =====================================================================================
    // BOOM DECORATIONS: festoon lights, bunting, 3 market stalls, NEW OVEN! banner (+2 boats above)
    // =====================================================================================
    { const fp = grp(root, -10.2, 0, -1.2); cyl(fp, 0.07, 0.09, 4.5, M("#B5875A", texPlank), 0, 0, 0, 8); sph(fp, 0.12, "#F2C14E", 0, 4.55, 0, 1, 1, 1, 8); bx(fp, 0.04, 0.4, 0.6, "#F25C4C", 0, 3.95, 0.32); }
    const cat = (A, B, sag) => (k) => new TH.Vector3(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k - sag * 4 * k * (1 - k), A[2] + (B[2] - A[2]) * k);
    const STR = [[[-6.0, 4.3, -9.95], [6.4, 4.3, 8.9], 1.0, 0.02], [[6.0, 4.3, -9.95], [-6.4, 4.3, 8.9], 1.0, 0.1], [[-4.6, 4.3, -8.9], [10.5, 3.45, -0.3], 0.8, 0.18], [[4.6, 4.3, -8.9], [-10.2, 4.3, -1.2], 0.8, 0.26]];
    const BULBC = ["#FFE08A", "#FF9A7A", "#9FE0FF", "#C7F28A", "#FFB3D9", "#FFD0A0"].map((c) => new TH.Color(c));
    const bulbs = []; const wires = [];
    STR.forEach(([A, B, sag, d0], si) => { const f = cat(A, B, sag), L = Math.hypot(B[0] - A[0], B[2] - A[2]), n = Math.round(L / 0.6);
      const pts = []; for (let i = 0; i <= 24; i++) pts.push(f(i / 24)); const tg = new TH.TubeGeometry(new TH.CatmullRomCurve3(pts), 48, 0.014, 4, false);
      const w = new TH.Mesh(tg, M("#3A3A48")); dyn.add(w); wires.push([w, tg.index.count, d0]);
      for (let i = 1; i < n; i++) { const p = f(i / n); bulbs.push({ p, c: BULBC[(i + si) % BULBC.length], d: d0 + 0.22 * (i / n) }); } });
    const bulbMesh = new TH.InstancedMesh(new TH.SphereGeometry(0.09, 8, 6), new TH.MeshBasicMaterial({ color: 0xffffff }), bulbs.length); dyn.add(bulbMesh);
    bulbs.forEach((b, i) => bulbMesh.setColorAt(i, b.c));
    const gp = new Float32Array(bulbs.length * 3), gc = new Float32Array(bulbs.length * 3); bulbs.forEach((b, i) => gp.set([b.p.x, b.p.y - 0.02, b.p.z], i * 3));
    const glowG = new TH.BufferGeometry(); glowG.setAttribute("position", new TH.BufferAttribute(gp, 3)); glowG.setAttribute("color", new TH.BufferAttribute(gc, 3));
    const bulbGlow = new TH.Points(glowG, new TH.PointsMaterial({ map: W3.glowTex, size: 0.85, sizeAttenuation: true, vertexColors: true, transparent: true, blending: TH.AdditiveBlending, depthWrite: false, fog: false }));
    bulbGlow.layers.set(1); dyn.add(bulbGlow);
    // bunting
    const BUNT = [[[-12.3, 3.95, -9.75], [12.3, 3.95, -9.75], 0.75, 0.08], [[-6.4, 3.9, 8.9], [6.4, 3.9, 8.9], 0.6, 0.2], [[10.5, 3.3, 6.6], [6.4, 3.9, 8.9], 0.3, 0.3]];
    const FLAGC = ["#F25C4C", "#F6C94A", "#2FA7B8", "#9FD8C2", "#C7B3E6", "#FFF6EA", "#F4A28C"].map((c) => new TH.Color(c));
    const flags = [];
    BUNT.forEach(([A, B, sag, d0], bi) => { const f = cat(A, B, sag), L = Math.hypot(B[0] - A[0], B[2] - A[2]), n = Math.round(L / 0.48), ry = Math.atan2(-(B[2] - A[2]), B[0] - A[0]);
      const pts = []; for (let i = 0; i <= 16; i++) pts.push(f(i / 16)); const tg = new TH.TubeGeometry(new TH.CatmullRomCurve3(pts), 32, 0.012, 4, false); const w = new TH.Mesh(tg, M("#F2E6C8")); dyn.add(w); wires.push([w, tg.index.count, d0]);
      for (let i = 1; i < n; i++) flags.push({ p: f(i / n), ry, c: FLAGC[(i + bi * 3) % FLAGC.length], d: d0 + 0.25 * (i / n), ph: i * 0.7 }); });
    const flagShape = new TH.Shape(); flagShape.moveTo(-0.19, 0); flagShape.lineTo(0.19, 0); flagShape.lineTo(0, -0.42); flagShape.closePath();
    const flagG = new TH.ExtrudeGeometry(flagShape, { depth: 0.014, bevelEnabled: false }); flagG.translate(0, 0, -0.007);
    const flagMesh = new TH.InstancedMesh(flagG, M("#FFFFFF"), flags.length); flags.forEach((f, i) => flagMesh.setColorAt(i, f.c)); dyn.add(flagMesh);
    // market stalls
    const stall = (x, z, label, kind, d) => { const g = grp(dyn, x, 0.06, z, Math.atan2(-x, -z)); const top = kind === "fish" ? C.sky : kind === "fruit" ? "#F6C94A" : C.pink;
      bx(g, 2.4, 0.95, 0.9, M(kind === "fish" ? "#4F8FC0" : kind === "fruit" ? "#E2574C" : C.teal, texPlank), 0, 0, 0, { tile: 1.2 }); bx(g, 2.55, 0.08, 1.05, M("#E9C9A0", texPlank), 0, 0.95, 0, { tile: 1.2 });
      for (const [px, pz] of [[-1.15, -0.45], [1.15, -0.45], [-1.15, 0.45], [1.15, 0.45]]) bx(g, 0.08, 2.35, 0.08, "#FFF7EA", px, 0, pz);
      const tx = stripes(top, "#FFF6EA", 10, 50 + d * 100); for (const s of [-1, 1]) { const sl = bx(g, 2.8, 0.06, 0.8, M("#FFFFFF", tx), 0, 2.48, s * 0.34); sl.rotation.x = s * 0.42; }
      for (let i = 0; i < 6; i++) { const sc = new TH.Mesh(new TH.CylinderGeometry(0.233, 0.233, 0.04, 10, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2), M(i % 2 ? "#FFF6EA" : top)); sc.position.set(-1.4 + (i + 0.5) * (2.8 / 6), 2.22, 0.72); g.add(sc); }
      sign(g, label, 1.7, 0.36, 0, 2.62, 0.62, { bg: "#FFF3DC", color: "#2E5B5F", d: 0.05 });
      const r = pr(90 + d * 100); for (let i = 0; i < 3; i++) { const bxx = -0.8 + i * 0.8; crate(g, bxx, 1.03, 0.05, 0.5, 0, "#C98A52");
        for (let k = 0; k < 5; k++) { const ox = bxx + (r() - 0.5) * 0.3, oz = 0.05 + (r() - 0.5) * 0.3;
          if (kind === "fruit") sph(g, 0.1, ["#FF9A3A", "#E2574C", "#9AD86A", "#F6D24A"][i], ox, 1.6, oz, 1, 1, 1, 8);
          else if (kind === "fish") { const f = sph(g, 0.2, ["#8EC3E8", "#F4A28C", "#C7B3E6"][i], ox, 1.6, oz, 1, 0.4, 0.45, 8); f.rotation.y = r() * 3; }
          else sph(g, 0.09, flowerCols[(k + i) % 5], ox, 1.62 + r() * 0.1, oz, 1, 1, 1, 6); } }
      return { g, d }; };
    const STALLS = [stall(-7.6, 2.6, "FRUIT", "fruit", 0.3), stall(-4.3, 8.2, "FRESH FISH", "fish", 0.42), stall(3.2, 8.5, "FLOWERS", "flowers", 0.54)];
    const banner = grp(dyn, -9, 4.36, -9.72); { const bb = grp(banner, 0, 0, 0); bx(bb, 4.6, 0.64, 0.03, "#E2574C", 0, 0, 0); sign(bb, "NEW OVEN!", 4.4, 0.56, 0, 0.04, 0.0, { bg: "#E2574C", color: "#FFF3DC", frame: "#E2574C", d: 0.02, ink: "#FFF3DC" });
      for (const sx of [-1, 1]) cyl(bb, 0.02, 0.02, 0.5, "#F2E6C8", sx * 2.4, 0.2, -0.05, 4, { rz: sx * 1.1 }); }

    // =====================================================================================
    // VEGETATION + SMALL INSTANCED DETAIL: palms, bushes, round trees, flowers, fence pickets
    // =====================================================================================
    const mergeGeos = (items, withColor) => { let n = 0; const parts = items.map(([g, m]) => { const q = g.index ? g.toNonIndexed() : g.clone(); q.applyMatrix4(m);
        if (!q.attributes.uv) q.setAttribute("uv", new TH.BufferAttribute(new Float32Array(q.attributes.position.count * 2), 2)); if (!q.attributes.normal) q.computeVertexNormals(); n += q.attributes.position.count; return q; });
      const P = new Float32Array(n * 3), N = new Float32Array(n * 3), U = new Float32Array(n * 2), CL = withColor ? new Float32Array(n * 3) : null; let o = 0;
      parts.forEach((q, i) => { const c = q.attributes.position.count; P.set(q.attributes.position.array, o * 3); N.set(q.attributes.normal.array, o * 3); U.set(q.attributes.uv.array, o * 2);
        if (CL) { const col = items[i][2]; for (let k = 0; k < c; k++) CL.set([col.r, col.g, col.b], (o + k) * 3); } o += c; q.dispose(); });
      const g = new TH.BufferGeometry(); g.setAttribute("position", new TH.BufferAttribute(P, 3)); g.setAttribute("normal", new TH.BufferAttribute(N, 3)); g.setAttribute("uv", new TH.BufferAttribute(U, 2));
      if (CL) g.setAttribute("color", new TH.BufferAttribute(CL, 3)); g.computeBoundingSphere(); return g; };
    const mtx = (x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) => new TH.Matrix4().compose(new TH.Vector3(x, y, z), new TH.Quaternion().setFromEuler(new TH.Euler(rx, ry, rz, "YXZ")), new TH.Vector3(sx, sy, sz));
    // blocked areas for scatter
    const blocked = (x, z, pad = 0) => { if (Math.hypot(x, z) < 12.5 + pad) return true; if (x > -14 - pad && x < 14 + pad && z > -17 - pad && z < -7 - pad) return true;
      if (x > 6 && x < 17 + pad && z > -2 - pad && z < 10.5 + pad) return true; if (x > -18 - pad && x < -9 && z > -1.5 - pad && z < 15.5 + pad) return true; if (z > 9.5 - pad && Math.abs(x) < 3 + pad) return true;
      if (z > 12.5 - pad && Math.abs(x) < 18) return true; if (Math.hypot(x - HILL.x, z - HILL.z) < 14 + pad) return true;
      for (const [hx, hz] of HOUSES) if (Math.hypot(x - hx, z - hz) < 4.6 + pad) return true; const th = Math.atan2(x, z); if (Math.hypot(x, z) > islandR(th) - 2.5) return true; return false; };
    // palms
    const PALMS = [[-10.6, -7.2], [10.9, -7.6], [-4.6, -14.6], [4.6, -14.6], [-13.9, -14.2], [13.9, -14.2], [16.6, 9.6], [16.4, -2.6], [-12.6, 8.0], [-18, -3], [-16.4, 13.4], [15.6, 13.2], [-19, 9.6], [20.5, 6.5],
      [-27, 14], [27, -28], [36, 9], [39, -5], [-39, 0], [-38, -12], [0, -43], [21, -35], [9, -31], [-19.5, 12.5], [30, 16], [-30, 8]];
    const trunkItems = [], TS = 7, TH0 = 5.2; for (let i = 0; i < TS; i++) { const k0 = i / TS, k1 = (i + 1) / TS, x0 = 1.0 * k0 * k0, x1 = 1.0 * k1 * k1, y0 = TH0 * k0, y1 = TH0 * k1;
      const g = new TH.CylinderGeometry(0.15 - 0.03 * k1, 0.19 - 0.03 * k0, Math.hypot(x1 - x0, y1 - y0) * 1.04, 8); W3.uvScale(g, 1, 1); trunkItems.push([g, mtx((x0 + x1) / 2, (y0 + y1) / 2, 0, 0, 0, -Math.atan2(x1 - x0, y1 - y0))]); }
    const trunkG = mergeGeos(trunkItems), TOP = new TH.Vector3(1.0, TH0, 0);
    const ringTex = T(32, 64, (g, w, h) => { g.fillStyle = "#C9A06E"; g.fillRect(0, 0, w, h); g.fillStyle = "#9C7448"; g.fillRect(0, h - 16, w, 16); g.fillStyle = "rgba(255,240,210,0.4)"; g.fillRect(0, 0, w, 6); });
    const leafG = (() => { const P = [], I = [], N = 7, L = 2.7; for (let i = 0; i <= N; i++) { const t = i / N, y = 0.55 * t - 1.35 * t * t, z = t * L, w = 0.34 * Math.sin(Math.PI * Math.min(1, t * 1.12)) + 0.03, rib = 0.1 * (1 - t);
        P.push(-w, y - 0.04, z, 0, y + rib, z, w, y - 0.04, z, -w, y - 0.08, z, 0, y + rib - 0.05, z, w, y - 0.08, z); }
      for (let i = 0; i < N; i++) { const a = i * 6, b = a + 6; I.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2); I.push(a + 3, a + 4, b + 3, a + 4, b + 4, b + 3, a + 4, a + 5, b + 4, a + 5, b + 5, b + 4); }
      const g = new TH.BufferGeometry(); g.setAttribute("position", new TH.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g; })();
    const pr2 = pr(101), trunkIM = new TH.InstancedMesh(trunkG, M("#FFFFFF", ringTex), PALMS.length), leafIM = new TH.InstancedMesh(leafG, M("#FFFFFF"), PALMS.length * 8), nutIM = new TH.InstancedMesh(new TH.SphereGeometry(0.15, 8, 6), M("#7A5232"), PALMS.length * 3);

    const LEAFC = ["#4FA84A", "#5DB653", "#3E9A48", "#6CC05A"].map((c) => new TH.Color(c)); let li = 0;
    PALMS.forEach(([x, z], i) => { const s = 0.82 + pr2() * 0.4, ry = pr2() * Math.PI * 2, pm = mtx(x, -0.1, z, 0, ry, 0, s); trunkIM.setMatrixAt(i, pm);
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + pr2() * 0.4, lm = new TH.Matrix4().multiplyMatrices(pm, mtx(TOP.x, TOP.y, TOP.z, -0.25 + pr2() * 0.35, a, 0, 0.85 + pr2() * 0.3)); leafIM.setMatrixAt(li, lm); leafIM.setColorAt(li, LEAFC[(k + i) % 4]); li++; }
      for (let k = 0; k < 3; k++) { const a = k * 2.1; nutIM.setMatrixAt(i * 3 + k, new TH.Matrix4().multiplyMatrices(pm, mtx(TOP.x + Math.cos(a) * 0.2, TOP.y - 0.22, Math.sin(a) * 0.2))); } });
    [trunkIM, leafIM, nutIM].forEach((m) => dyn.add(m));
    // bushes + round trees (one instanced blob mesh) + tree trunks
    const blobs = [], trunks = []; const sr = pr(131), BC = ["#5FA34A", "#6DB352", "#4E9440", "#7FC25A", "#5AA060"].map((c) => new TH.Color(c));
    const handBush = [[-13.3, -10.4], [13.3, -10.4], [-5.0, -10.9], [5.0, -10.9], [-16.8, 7.0], [-17, -0.6], [15.9, -0.8], [15.9, 6.9], [-16.3, 15.3], [16.6, 14.8], [-12.3, 15.8], [6.6, 14.6], [-6.3, 13.6], [12, 12.4], [-12, 12.4]];
    handBush.forEach(([x, z]) => blobs.push([x, z, 0.55 + sr() * 0.35]));
    for (let n = 0, tries = 0; n < 70 && tries < 3000; tries++) { const th = sr() * Math.PI * 2, rr = 12 + sr() * 36, x = Math.sin(th) * rr, z = Math.cos(th) * rr; if (blocked(x, z, 0.6)) continue; blobs.push([x, z, 0.5 + sr() * 0.5]); n++; }
    for (let n = 0, tries = 0; n < 24 && tries < 3000; tries++) { const th = sr() * Math.PI * 2, rr = 14 + sr() * 32, x = Math.sin(th) * rr, z = Math.cos(th) * rr; if (blocked(x, z, 1.2)) continue; trunks.push([x, z, 0.9 + sr() * 0.5]); n++; }
    const blobIM = new TH.InstancedMesh(new TH.IcosahedronGeometry(1, 1), M("#FFFFFF"), blobs.length + trunks.length * 3), trunkRIM = new TH.InstancedMesh(new TH.CylinderGeometry(0.14, 0.2, 1, 7).translate(0, 0.5, 0), M("#8A6040"), trunks.length);
    let bi2 = 0; blobs.forEach(([x, z, s]) => { blobIM.setMatrixAt(bi2, mtx(x, s * 0.45, z, 0, sr() * 3, 0, s, s * 0.8, s)); blobIM.setColorAt(bi2++, BC[Math.floor(sr() * 5)]); });
    trunks.forEach(([x, z, s], i) => { trunkRIM.setMatrixAt(i, mtx(x, 0, z, 0, 0, 0, s, s * 2.2, s)); const c = BC[Math.floor(sr() * 5)];
      [[0, 2.9, 0, 1.25], [0.55, 2.4, 0.3, 0.9], [-0.5, 2.5, -0.2, 0.85]].forEach(([ox, oy, oz, ss2]) => { blobIM.setMatrixAt(bi2, mtx(x + ox * s, oy * s, z + oz * s, 0, sr() * 3, 0, ss2 * s)); blobIM.setColorAt(bi2++, c); }); });
    dyn.add(blobIM); dyn.add(trunkRIM);
    // flowers (window boxes, pots, gardens)
    const fl = []; root.updateMatrixWorld(true); const v3 = new TH.Vector3();
    flowerSpots.forEach(([p, x, y, z, w]) => { const n = Math.max(3, Math.round(w / 0.16)); for (let i = 0; i < n; i++) { v3.set(x - w / 2 + (i + 0.5) * (w / n), y + (i % 2) * 0.06, z + ((i % 3) - 1) * 0.06); p.localToWorld(v3); fl.push([v3.x, v3.y, v3.z, i]); } });
    blobs.slice(0, 40).forEach(([x, z, s], i) => { for (let k = 0; k < 4; k++) { const a = k * 1.7 + i; fl.push([x + Math.cos(a) * s * 0.75, s * 0.75 - 0.05 + (k % 2) * 0.1, z + Math.sin(a) * s * 0.75, i + k]); } });
    const flowerIM = new TH.InstancedMesh(new TH.IcosahedronGeometry(0.085, 0), M("#FFFFFF"), fl.length); const FC = flowerCols.map((c) => new TH.Color(c));
    fl.forEach(([x, y, z, k], i) => { flowerIM.setMatrixAt(i, mtx(x, y, z, 0, k, 0, 1)); flowerIM.setColorAt(i, FC[k % 5]); }); dyn.add(flowerIM);
    // fence pickets
    const picketG = mergeGeos([[new TH.BoxGeometry(0.09, 1, 0.035), mtx(0, 0.5, 0)], [new TH.ConeGeometry(0.064, 0.12, 4), mtx(0, 1.06, 0, 0, Math.PI / 4, 0)]]);
    const picketIM = new TH.InstancedMesh(picketG, M(C.trim), pickets.length); pickets.forEach(([x, z, ry, h], i) => picketIM.setMatrixAt(i, mtx(x, 0, z, 0, ry + Math.PI / 2, 0, 1, h * 0.92, 1))); dyn.add(picketIM);

    // =====================================================================================
    // BAKE static meshes (merge per material), local lights, update, anchors
    // =====================================================================================
    // static meshes are merged per material; plain cached colours (M(color, map)) share one vertex-coloured material per texture
    const VCM = {}; const vcMat = (map) => { const k = map ? map.uuid : "-"; if (!VCM[k]) VCM[k] = W3.toon("#FFFFFF", map, { vertexColors: true }); return VCM[k]; };
    const bake = (G) => { G.updateMatrixWorld(true); const inv = new TH.Matrix4().copy(G.matrixWorld).invert(), by = new Map(), kill = [];
      G.traverse((o) => { if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.userData.keep || o.layers.mask !== 1 || o.material.transparent) return;
        const mat = o.material.userData.vc ? vcMat(o.material.map) : o.material; if (!by.has(mat)) by.set(mat, []); by.get(mat).push([o.geometry, new TH.Matrix4().multiplyMatrices(inv, o.matrixWorld), o.material.color]); kill.push(o); });
      kill.forEach((o) => { o.parent.remove(o); o.geometry.dispose(); }); by.forEach((items, mat) => G.add(new TH.Mesh(mergeGeos(items, !!mat.vertexColors), mat))); };
    bake(root); houseGroups.forEach(bake); BOATS.forEach(bake); STALLS.forEach((s) => bake(s.g)); chairs.forEach((c) => bake(c.ch)); bake(banner);
    BOATS.forEach((b) => { const u = b.userData; b.position.set(u.x, -0.35, u.z); b.rotation.order = "YXZ"; b.rotation.y = u.ry; });
    chairs.forEach((c) => { c.ch.rotation.order = "YZX"; });
    // local lights (≤ 3), scaled by env.night
    const PL = [[0xffc27a, 0, 4.6, 1.5, 24, 60], [0xffb866, -9, 2.6, -8.2, 9, 14], [0xffc06a, -11.0, 1.7, 10.8, 6, 4.5]].map(([c, x, y, z, d, k]) => { const l = new TH.PointLight(c, 0, d, 1.4); l.position.set(x, y, z); W3.scene.add(l); l.userData.k = k; return l; });

    const m4 = new TH.Matrix4(), q4 = new TH.Quaternion(), e4 = new TH.Euler(), s4 = new TH.Vector3(), p4 = new TH.Vector3(), cA = new TH.Color();
    let lastBoom = -1;
    function update(t, env = {}) {
      const n = clamp01(env.night || 0), b = clamp01(env.boom || 0), u = clamp01(env.bust || 0);
      for (const [m, base, per] of nightMats) m.emissiveIntensity = base + n * per;
      for (const [g, kind] of glows) { if (kind === "lh") { const s = 2.2 + 5 * n; g.scale.set(s, s, 1); g.material.opacity = 0.25 + 0.75 * n; } else { const s = 0.8 + 1.7 * n; g.scale.set(s, s, 1); g.material.opacity = 0.12 + 0.88 * n; } }
      beam.rotation.y = t * 0.8; beamMat.opacity = 0.5 * n; beam.visible = n > 0.02;
      PL.forEach((l) => { l.intensity = l.userData.k * n; l.visible = n > 0.01; });
      // water
      texSea.offset.set(t * 0.012, Math.sin(t * 0.25) * 0.03); waterTex.offset.set(t * 0.06, t * 0.035); curtTex.offset.y = -t * 0.9; texFoam.offset.x = t * 0.004;
      foamMat.opacity = 0.62 + 0.22 * Math.sin(t * 1.3); water.position.y = 0.64 + 0.01 * Math.sin(t * 3); jet.scale.y = 1 + 0.12 * Math.sin(t * 7);
      // boats (boom boats pop in)
      for (const bt of BOATS) { const ud = bt.userData, ps = boatPose(bt, t); let k = 1; if (ud.boom !== undefined) { k = pop(b, ud.boom, 0.2); bt.visible = k > 0.001; }
        bt.position.y = ps.y - (1 - Math.min(1, k)) * 0.6; bt.rotation.z = ps.rz; bt.rotation.x = ps.rx; bt.scale.setScalar(Math.max(0.001, k)); }
      // boom decorations (cheap: only refresh instances when boom changes)
      if (b !== lastBoom) { lastBoom = b;
        for (const [w, cnt, d0] of wires) { const k = clamp01((b - d0) / 0.22); w.visible = k > 0; w.geometry.setDrawRange(0, Math.floor((cnt * k) / 6) * 6); }
        bulbs.forEach((bl, i) => { const k = pop(b, bl.d, 0.12); m4.compose(bl.p, q4.identity(), s4.setScalar(Math.max(0.0001, k))); bulbMesh.setMatrixAt(i, m4); }); bulbMesh.instanceMatrix.needsUpdate = true;
        STALLS.forEach((s) => { const k = pop(b, s.d, 0.2); s.g.visible = k > 0.001; s.g.scale.setScalar(Math.max(0.001, k)); });
        { const k = pop(b, 0.5, 0.2); banner.visible = k > 0.001; banner.scale.set(Math.max(0.001, k), Math.max(0.001, Math.min(1.2, 0.3 + k)), 1); } }
      { const gc2 = glowG.attributes.color.array, gk = 0.18 + 0.9 * n; bulbs.forEach((bl, i) => { const k = clamp01(pop(b, bl.d, 0.12)) * gk * (0.85 + 0.15 * Math.sin(t * 2.3 + i)); gc2[i * 3] = bl.c.r * k; gc2[i * 3 + 1] = bl.c.g * k; gc2[i * 3 + 2] = bl.c.b * k; }); glowG.attributes.color.needsUpdate = true; bulbGlow.visible = b > 0.01; }
      flagMesh.visible = b > 0.01; if (b > 0.01) { flags.forEach((f, i) => { const k = pop(b, f.d, 0.14); e4.set(0.12 * Math.sin(t * 2.2 + f.ph), f.ry, 0, "YXZ"); m4.compose(f.p, q4.setFromEuler(e4), s4.setScalar(Math.max(0.0001, k))); flagMesh.setMatrixAt(i, m4); }); flagMesh.instanceMatrix.needsUpdate = true; }
      // bust: CLOSED sign, umbrellas fold, chairs up on the tables
      { const k = backOut(clamp01((u - 0.08) / 0.25)); CLOSED.visible = k > 0.001; CLOSED.scale.set(1, Math.max(0.001, k), 1); CLOSED.rotation.z = 0.06 * Math.sin(t * 1.7) * k; }
      tables.forEach((tb, i) => { const k = ss(0.15 + i * 0.08, 0.5 + i * 0.08, u); tb.can.scale.set(1 - 0.84 * k, 1 + 1.5 * k, 1 - 0.84 * k); tb.can.position.y = -0.2 - 0.6 * k; });
      chairs.forEach((c) => { const k = ss(0.3 + c.i * 0.035, 0.55 + c.i * 0.035, u); c.ch.position.set(c.x0 + (c.x1 - c.x0) * k, 0.06 + (1.35 - 0.06) * k + Math.sin(Math.PI * k) * 0.45, c.z0 + (c.z1 - c.z0) * k); c.ch.rotation.set(0, c.a + Math.PI, Math.PI * k); });
    }
    update(0, { night: 0, boom: 0, bust: 0 });

    const finnBoat = (t) => { const bt = BOATS[0], ps = boatPose(bt, t), u = bt.userData; return { x: u.x, y: ps.y + u.deckY, z: u.z + 0.7 }; };
    const anchors = {
      moDoor: { x: -9, y: 0, z: -9.9 }, bankDoor: { x: 0, y: 0, z: -10.2 }, beaDoor: { x: 9, y: 0, z: -9.9 }, crabDoor: { x: 10.3, y: 0, z: 3 }, kaiYard: { x: -11.4, y: 0, z: 3 }, anaDoor: { x: -11.7, y: 0, z: 12.65 },
      fountain: { x: 0, y: 0, z: 0 }, fountainEdge: { x: 0, y: 0, z: 2.1 }, squareCenter: { x: 0, y: 0, z: 0 }, pierEnd: { x: 0, y: 0.45, z: 37.3 }, pierStart: { x: 0, y: 0.45, z: 17.4 }, quay: { x: 0, y: 0.12, z: 15.5 },
      chalkboard: { x: -6.6, y: 0, z: -8.4 }, lighthouse: { x: HILL.x, y: 6, z: HILL.z }, aerialTarget: { x: 0, y: 0, z: 2 }, finnBoat,
      crabTables: tables.map((tb) => ({ x: tb.x, y: 0, z: tb.z })),
    };
    const buildings = [
      { name: "MO'S SANDWICHES", x: -9, z: -12.75, door: anchors.moDoor, roofY: 6.6 },
      { name: "CRUMB ISLAND BANK", x: 0, z: -14.25, door: anchors.bankDoor, roofY: 7.4 },
      { name: "BEA'S BAKERY", x: 9, z: -12.75, door: anchors.beaDoor, roofY: 6.4 },
      { name: "THE CRAB SHACK", x: 13, z: 3, door: anchors.crabDoor, roofY: 6.2 },
      { name: "KAI'S BUILDING CO.", x: -15.6, z: 3, door: anchors.kaiYard, roofY: 4.4 },
      { name: "ANA'S COTTAGE", x: -14, z: 12, door: anchors.anaDoor, roofY: 4.9 },
      { name: "THE LUCKY FIN", x: 3.05, z: 28, door: { x: 1.4, y: 0.45, z: 28 }, roofY: 2.0 },
    ];
    return { anchors, buildings, occ: [], update, setPrice, root, dyn, houses: houseGroups, housePos: HOUSES };
  };
})();
