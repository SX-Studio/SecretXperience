/* Episode 3 interiors: Mo's sandwich shop (x=300), Crumb Island Bank (x=400), Ana's apartment (x=500).
   window.EP3.interiors(W3) → { anchors:{shop,bank,apt}, occ:[...], update(t, env), shop:{...}, bank:{...}, apt:{...}, + flat aliases }
   Everything is procedural and seek-safe (pure function of t / env / setter state). See NOTES.md. */
(function () {
  window.EP3 = window.EP3 || {};
  window.EP3.interiors = function (W3) {
    const TH = W3.TH, SR = window.SR, scene = W3.scene, rng = SR.mulberry32;
    const PI = Math.PI, cl01 = (k) => Math.max(0, Math.min(1, k)), lerp = (a, b, k) => a + (b - a) * k;
    const sstep = (a, b, x) => { const k = cl01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
    const backOut = (k, s) => { const u = k - 1; return 1 + u * u * ((s + 1) * u + s); };
    const INK = "#1E1B22";
    const FONT = (px, w) => `${w || 900} ${px}px Outfit, Nunito, sans-serif`;
    const MONO = (px) => `bold ${px}px "DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace`;
    const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (c) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k))); return "#" + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
    const flick = (t, s) => 0.62 + 0.2 * Math.sin(t * 13.1 + s) + 0.12 * Math.sin(t * 23.7 + 1.3 + s * 2) + 0.06 * Math.sin(t * 41.3 + 2.1 + s);

    // ---------------------------------------------------------------- materials + geometry helpers
    const MC = {};
    const mat = (c) => MC[c] || (MC[c] = W3.toon(c));
    const asMat = (m) => (typeof m === "string" ? mat(m) : m);
    const texMat = (tex, o) => W3.toon("#FFFFFF", tex, o || {});
    const glowMat = (c, k) => W3.toon(c, null, { emissive: new TH.Color(c), emissiveIntensity: k === undefined ? 0.8 : k });
    function boxGeo(w, h, d, s) {
      const g = new TH.BoxGeometry(w, h, d);
      if (s) { const uv = g.attributes.uv, D = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
        for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) { const j = f * 4 + i; uv.setXY(j, uv.getX(j) * D[f][0] / s, uv.getY(j) * D[f][1] / s); } }
      return g; }
    function place(ms, x, y, z, o) { ms.position.set(x, y, z); if (o.rx || o.ry || o.rz) ms.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0, o.order || "XYZ"); if (o.sc) ms.scale.set(o.sc[0], o.sc[1], o.sc[2]); if (o.layer) ms.layers.set(o.layer); return ms; }
    function B(p, w, h, d, m, x, y, z, o) { o = o || {}; const ms = new TH.Mesh(boxGeo(w, h, d, o.s), asMat(m)); place(ms, x, y + h / 2, z, o); p.add(ms); return ms; }  // y = bottom
    function G(p, geo, m, x, y, z, o) { const ms = new TH.Mesh(geo, asMat(m)); place(ms, x, y, z, o || {}); p.add(ms); return ms; }
    function mergeG(list) {
      let nV = 0, nI = 0; list.forEach((g) => { nV += g.attributes.position.count; nI += g.index ? g.index.count : g.attributes.position.count; });
      const pos = new Float32Array(nV * 3), nor = new Float32Array(nV * 3), uv = new Float32Array(nV * 2), idx = new Uint32Array(nI); let vo = 0, io = 0;
      list.forEach((g) => { const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv; pos.set(P.array, vo * 3); nor.set(N.array, vo * 3); if (U) uv.set(U.array, vo * 2);
        if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i++) idx[io + i] = a[i] + vo; io += a.length; } else { for (let i = 0; i < P.count; i++) idx[io + i] = vo + i; io += P.count; }
        vo += P.count; g.dispose(); });
      const G2 = new TH.BufferGeometry(); G2.setAttribute("position", new TH.BufferAttribute(pos, 3)); G2.setAttribute("normal", new TH.BufferAttribute(nor, 3)); G2.setAttribute("uv", new TH.BufferAttribute(uv, 2)); G2.setIndex(new TH.BufferAttribute(idx, 1));
      G2.computeBoundingSphere(); return G2; }
    // list of boxes [w,h,d,x,yBottom,z,ry?,rx?,rz?]
    function MB(p, list, m, o) { o = o || {}; const geos = list.map((b) => { const g = boxGeo(b[0], b[1], b[2], o.s); if (b[7]) g.rotateX(b[7]); if (b[8]) g.rotateZ(b[8]); if (b[6]) g.rotateY(b[6]); g.translate(b[3], b[4] + b[1] / 2, b[5]); return g; }); return G(p, mergeG(geos), m, 0, 0, 0, o); }
    // list of [geometry, x, y, z, rx, ry, rz, sx, sy, sz]
    function MG(p, list, m, o) { const geos = list.map((b) => { const g = b[0]; const M = new TH.Matrix4().compose(new TH.Vector3(b[1], b[2], b[3]), new TH.Quaternion().setFromEuler(new TH.Euler(b[4] || 0, b[5] || 0, b[6] || 0)), new TH.Vector3(b[7] || 1, b[8] || b[7] || 1, b[9] || b[7] || 1)); g.applyMatrix4(M); return g; }); return G(p, mergeG(geos), m, 0, 0, 0, o || {}); }
    function wall(p, w, h, m, x, y, z, ry, s) { const g = new TH.PlaneGeometry(w, h); if (s) W3.uvScale(g, w / s, h / s); return G(p, g, m, x, y + h / 2, z, { ry }); }
    const Q = new TH.Object3D();
    function inst(p, geo, m, list) {
      const im = new TH.InstancedMesh(geo, asMat(m), list.length); im.frustumCulled = false;
      list.forEach((it, i) => { Q.position.set(it.p[0], it.p[1], it.p[2]); const r = it.r || [0, 0, 0]; Q.rotation.set(r[0], r[1], r[2], r[3] || "XYZ"); const s = it.s || [1, 1, 1]; Q.scale.set(s[0], s[1], s[2]); Q.updateMatrix(); im.setMatrixAt(i, Q.matrix); if (it.c) im.setColorAt(i, new TH.Color(it.c)); });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; p.add(im); return im; }
    function glow(p, color, size, x, y, z) { const s = W3.glow(color, size, 0, 0, 0); p.add(s); s.position.set(x, y, z); return s; }
    function plight(p, color, dist, x, y, z) { const L = new TH.PointLight(color, 0, dist, 1.3); L.position.set(x, y, z); p.add(L); return L; }
    function cyl(rt, rb, h, seg, open) { return new TH.CylinderGeometry(rt, rb, h, seg || 14, 1, !!open); }
    // world-space anchor helper
    const A = (x, y, z) => ({ x: +x.toFixed(3), y: +y.toFixed(3), z: +z.toFixed(3) });

    // ---------------------------------------------------------------- hand-painted textures
    function blot(g, w, h, r, n, cols, rmin, rmax, amin, amax) {
      for (let i = 0; i < n; i++) { const x = r() * w, y = r() * h, rad = rmin + r() * (rmax - rmin), c = cols[Math.floor(r() * cols.length)], a = amin + r() * (amax - amin);
        for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) { const X = x + dx, Y = y + dy; if (X + rad < 0 || X - rad > w || Y + rad < 0 || Y - rad > h) continue;
          const gr = g.createRadialGradient(X, Y, 0, X, Y, rad); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.fillRect(X - rad, Y - rad, rad * 2, rad * 2); } } }
    const speck = (g, w, h, r, n, col) => { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${col},${0.05 + r() * 0.1})`; const s = 1 + r() * 2; g.fillRect(r() * w, r() * h, s, s); } };
    const texPlaster = (base, seed) => W3.tex(256, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h); blot(g, w, h, r, 60, ["255,255,255", "140,80,70"], 14, 50, 0.04, 0.09); speck(g, w, h, r, 160, "110,60,50"); });
    function texBoards(base, n, seed, horiz, gapCol) {
      return W3.tex(512, 512, (g, w, h) => { const r = rng(seed); if (horiz) { g.translate(w / 2, h / 2); g.rotate(PI / 2); g.translate(-w / 2, -h / 2); }
        const bw = w / n;
        for (let i = 0; i < n; i++) { const c = shade(base, (r() - 0.5) * 0.22); const x0 = i * bw;
          for (let seg = 0; seg < 2; seg++) { const y0 = seg ? r() * h * 0.5 + h * 0.25 : 0; }
          g.fillStyle = c; g.fillRect(x0, 0, bw, h);
          const gr = g.createLinearGradient(x0, 0, x0 + bw, 0); gr.addColorStop(0, "rgba(255,240,220,0.18)"); gr.addColorStop(0.5, "rgba(255,240,220,0)"); gr.addColorStop(1, "rgba(60,30,20,0.16)"); g.fillStyle = gr; g.fillRect(x0, 0, bw, h);
          g.lineWidth = 2;
          for (let k = 0; k < 7; k++) { const xx = x0 + 6 + r() * (bw - 12), amp = 2 + r() * 5, ph = r() * 6, fr = 1 + Math.floor(r() * 3); g.strokeStyle = shade(c, -0.22 - r() * 0.12); g.globalAlpha = 0.35 + r() * 0.3;
            g.beginPath(); for (let y = 0; y <= h; y += 8) { const x = xx + Math.sin((y / h) * PI * 2 * fr + ph) * amp; y ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
          g.globalAlpha = 1;
          if (r() < 0.6) { const kx = x0 + bw * (0.3 + r() * 0.4), ky = r() * h; g.fillStyle = shade(c, -0.35); g.beginPath(); g.ellipse(kx, ky, 5, 9, 0, 0, PI * 2); g.fill(); g.strokeStyle = shade(c, -0.25); g.beginPath(); g.ellipse(kx, ky, 9, 16, 0, 0, PI * 2); g.stroke(); }
          g.fillStyle = gapCol || shade(base, -0.55); g.fillRect(x0, 0, 4, h);
          const jy = 40 + r() * (h - 80); g.fillRect(x0, jy, bw, 4); g.fillStyle = "rgba(255,240,220,0.25)"; g.fillRect(x0 + 4, 0, 2, h); }
      }); }
    function texTiles(base, grout, seed, cols, rows, var_) {
      return W3.tex(256, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = grout; g.fillRect(0, 0, w, h); const tw = w / cols, th = h / rows;
        for (let j = 0; j < rows; j++) for (let i = -1; i <= cols; i++) { const x = i * tw + (j % 2) * tw / 2, y = j * th, c = shade(base, (r() - 0.5) * (var_ || 0.14));
          g.fillStyle = c; g.beginPath(); g.roundRect(x + 3, y + 3, tw - 6, th - 6, 5); g.fill();
          g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(x + 8, y + 6, tw - 24, 3); g.fillStyle = "rgba(110,60,40,0.16)"; g.fillRect(x + 6, y + th - 9, tw - 12, 3); g.fillRect(x + tw - 9, y + 6, 3, th - 12); }
      }); }
    function texChecker(a, b, n, seed, marble) {
      return W3.tex(512, 512, (g, w, h) => { const r = rng(seed), s = w / n;
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const base = (i + j) % 2 ? a : b; g.fillStyle = shade(base, (r() - 0.5) * 0.07); g.fillRect(i * s, j * s, s, s);
          g.save(); g.beginPath(); g.rect(i * s, j * s, s, s); g.clip();
          if (marble) { for (let v = 0; v < 4; v++) { g.strokeStyle = shade(base, (r() < 0.5 ? -0.22 : 0.3)); g.globalAlpha = 0.35 + r() * 0.3; g.lineWidth = 1 + r() * 2.5; let x = i * s + r() * s, y = j * s;
              g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 10; k++) { x += (r() - 0.35) * s * 0.25; y += s * 0.11; g.lineTo(x, y); } g.stroke(); } g.globalAlpha = 1; }
          blot(g, w, h, r, 2, ["255,255,255", "90,60,60"], 10, s * 0.5, 0.04, 0.08);
          g.restore();
          g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(i * s + 3, j * s + 3, s - 6, 2); g.fillStyle = "rgba(60,40,50,0.15)"; g.fillRect(i * s + 3, j * s + s - 5, s - 6, 2); }
        g.strokeStyle = "rgba(70,50,60,0.45)"; g.lineWidth = 3; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
      }); }
    function texBrick(base, mortar, seed) {
      return W3.tex(256, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = mortar; g.fillRect(0, 0, w, h); const rows = 8, bh = h / rows, bw = w / 3;
        for (let j = 0; j < rows; j++) for (let i = -1; i <= 3; i++) { const x = i * bw + (j % 2) * bw / 2, y = j * bh, c = shade(base, (r() - 0.5) * 0.25);
          g.fillStyle = c; g.beginPath(); g.roundRect(x + 3, y + 3, bw - 6, bh - 6, 3); g.fill(); g.fillStyle = "rgba(255,220,190,0.28)"; g.fillRect(x + 5, y + 4, bw - 12, 3); g.fillStyle = "rgba(70,20,10,0.22)"; g.fillRect(x + 4, y + bh - 7, bw - 8, 3);
          for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(80,30,20,${0.1 + r() * 0.15})`; g.fillRect(x + 6 + r() * (bw - 14), y + 6 + r() * (bh - 14), 2, 2); } }
      }); }
    function texMosaic(cols, seed) {
      return W3.tex(256, 128, (g, w, h) => { const r = rng(seed); g.fillStyle = "#EFE2C4"; g.fillRect(0, 0, w, h); const s = 16;
        for (let j = 0; j < h / s; j++) for (let i = 0; i < w / s; i++) { const band = Math.floor(j / 2) % cols.length; const c = shade(cols[(band + (r() < 0.12 ? 1 : 0)) % cols.length], (r() - 0.5) * 0.18);
          g.fillStyle = c; g.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(i * s + 2, j * s + 2, s - 6, 2); } }); }
    function texShiny(base, seed, stripes) {
      return W3.tex(256, 256, (g, w, h) => { const r = rng(seed); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, shade(base, 0.18)); gr.addColorStop(1, shade(base, -0.06)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.save(); g.translate(w / 2, h / 2); g.rotate(-0.6); g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(-w, -h * 0.28, w * 2, 20); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(-w, -h * 0.12, w * 2, 9); if (stripes) { g.fillStyle = "rgba(255,255,255,0.22)"; g.fillRect(-w, h * 0.22, w * 2, 30); } g.restore();
        speck(g, w, h, r, 30, "255,255,255"); }, { clamp: true }); }
    const glassTex = W3.tex(128, 128, (g, w, h) => { g.fillStyle = "rgba(200,236,246,0.16)"; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2, h / 2); g.rotate(-0.7); g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(-w, -26, w * 2, 12); g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-w, -6, w * 2, 5); g.restore(); }, { clamp: true });
    const mGlass = new TH.MeshBasicMaterial({ map: glassTex, transparent: true, depthWrite: false, side: TH.DoubleSide, color: new TH.Color("#FFFFFF") });
    function glassPane(p, w, h, x, y, z, o) { const ms = G(p, new TH.PlaneGeometry(w, h), mGlass, x, y, z, Object.assign({ layer: 1 }, o || {})); ms.renderOrder = 2; return ms; }
    // text texture with transparent or coloured background (font-aware: redrawn once the web font loads)
    function textTex(w, h, draw) { return W3.fontTex(w, h, draw, [FONT(40)], { clamp: true }); }
    function plate(text, o) { return W3.label(text, Object.assign({ w: 512, h: 128, size: 70 }, o)); }

    // ---------------------------------------------------------------- shared props
    function makePlant(p, x, z, sc, seed, potCol) {
      const r = rng(seed), gp = new TH.Group(); gp.position.set(x, 0, z); gp.scale.setScalar(sc); p.add(gp);
      G(gp, cyl(0.24, 0.17, 0.42, 12), potCol || "#C8553D", 0, 0.21, 0); G(gp, cyl(0.27, 0.27, 0.07, 12), shade(potCol || "#C8553D", 0.12), 0, 0.42, 0); G(gp, cyl(0.22, 0.22, 0.02, 12), "#6A4A3A", 0, 0.44, 0);
      const L = []; const n = 11;
      for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2 + r() * 0.4, tilt = 0.35 + r() * 0.75, len = 0.55 + r() * 0.35;
        const dx = Math.sin(a), dz = Math.cos(a); L.push({ p: [dx * Math.sin(tilt) * len * 0.45, 0.45 + Math.cos(tilt) * len * 0.45, dz * Math.sin(tilt) * len * 0.45], r: [tilt, a, 0, "YXZ"], s: [0.11 + r() * 0.05, len * 0.5, 0.02], c: r() < 0.5 ? "#6FB04E" : "#8FCB62" }); }
      const leafGeo = new TH.SphereGeometry(1, 8, 6); inst(gp, leafGeo, mat("#FFFFFF"), L);
      return gp; }
    // ExtrudeGeometry for arch-topped shapes (with optional hole)
    function archShape(w, hs, holeW, holeHs, holeY) {
      const s = new TH.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, hs); s.absarc(0, hs, w / 2, 0, PI, false); s.lineTo(-w / 2, 0);
      if (holeW) { const hh = new TH.Path(); hh.moveTo(-holeW / 2, holeY); hh.lineTo(-holeW / 2, holeY + holeHs); hh.absarc(0, holeY + holeHs, holeW / 2, PI, 0, true); hh.lineTo(holeW / 2, holeY); hh.lineTo(-holeW / 2, holeY); s.holes.push(hh); }
      return s; }
    const extrude = (shape, depth, seg) => new TH.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: seg || 16 });

    // ---------------------------------------------------------------- room shell (dollhouse walls: inward-facing planes, details auto-hide when the camera is beyond a wall)
    const ROOMS = [];
    function room(cx, b) {
      const g = new TH.Group(); g.position.set(cx, 0, 0); scene.add(g);
      const W = {}; ["back", "left", "right", "front", "ceil"].forEach((k) => { W[k] = new TH.Group(); g.add(W[k]); });
      const R = Object.assign({ cx, g, W, front: "auto", lights: [] }, b); ROOMS.push(R); return R; }
    function hook(cam) {
      for (const R of ROOMS) { const lx = cam.position.x - R.cx, ly = cam.position.y, lz = cam.position.z, near = Math.abs(lx) < 45 && Math.abs(lz) < 45;
        R.g.visible = near; if (!near) continue;
        R.W.front.visible = R.front === "auto" ? lz < R.z1 - 0.02 : !!R.front; R.W.back.visible = lz > R.z0; R.W.left.visible = lx > R.x0; R.W.right.visible = lx < R.x1; R.W.ceil.visible = ly < R.h; } }
    const prevOBR = scene.onBeforeRender;
    scene.onBeforeRender = function (a, b, c, d) { if (prevOBR) prevOBR.call(this, a, b, c, d); hook(c); };

    // ================================================================= 1. MO'S SANDWICH SHOP (300, 0, 0)
    const shop = (function () {
      const CX = 300, R = room(CX, { x0: -4.5, x1: 4.5, z0: -3.5, z1: 3.5, h: 3.4 }), g = R.g, W = R.W;
      const S = { price: 10, drawer: 0 };
      // floor + shell
      B(g, 9.0, 0.12, 7.0, texMat(texChecker("#F2E6C8", "#4FA89E", 4, 21)), 0, -0.12, 0, { s: 2 });
      const mWain = texMat(texBoards("#A87448", 4, 41)), mTile = texMat(texTiles("#F6D77A", "#E8D9B6", 31, 2, 5)), mCoral = texMat(texPlaster("#F4A28C", 51)), mCeil = texMat(texPlaster("#F2E6C8", 61));
      wall(W.back, 9, 1.0, mWain, 0, 0, -3.5, 0, 0.8); wall(W.back, 9, 2.4, mTile, 0, 1.0, -3.5, 0, 0.6);
      wall(W.left, 7, 1.0, mWain, -4.5, 0, 0, PI / 2, 0.8); wall(W.left, 7, 2.4, mCoral, -4.5, 1.0, 0, PI / 2, 2);
      wall(W.right, 7, 1.0, mWain, 4.5, 0, 0, -PI / 2, 0.8); wall(W.right, 7, 2.4, mCoral, 4.5, 1.0, 0, -PI / 2, 2);
      G(W.ceil, W3.uvScale(new TH.PlaneGeometry(9, 7), 4.5, 3.5), mCeil, 0, 3.4, 0, { rx: PI / 2 });
      MB(W.ceil, [[9, 0.2, 0.24, 0, 3.2, -1.9], [9, 0.2, 0.24, 0, 3.2, 1.5]], texMat(texBoards("#9A6A44", 2, 44, true)), { s: 1 });
      // trims (baseboard dark wood, chair rail teal, crown cream)
      MB(g, [[9, 0.14, 0.05, 0, 0, -3.475], [0.05, 0.14, 7, -4.475, 0, 0], [0.05, 0.14, 7, 4.475, 0, 0]], "#6E4430");
      MB(g, [[9, 0.08, 0.08, 0, 0.96, -3.46], [0.08, 0.08, 7, -4.46, 0.96, 0], [0.08, 0.08, 7, 4.46, 0.96, 0]], "#2F8F8A");
      MB(g, [[9, 0.12, 0.1, 0, 3.28, -3.45], [0.1, 0.12, 7, -4.45, 3.28, 0], [0.1, 0.12, 7, 4.45, 3.28, 0], [9, 0.06, 0.16, 0, 3.22, -3.42], [0.16, 0.06, 7, -4.42, 3.22, 0], [0.16, 0.06, 7, 4.42, 3.22, 0]], "#FFF3D8");

      // ---- menu board (canvas, setPrice)
      const priceStr = () => "$" + (Math.round(S.price) === S.price ? String(S.price) : S.price.toFixed(2));
      function drawMenu(g2, w, h) {
        const r = rng(77); g2.fillStyle = "#28473F"; g2.fillRect(0, 0, w, h); blot(g2, w, h, r, 40, ["255,255,255"], 20, 90, 0.025, 0.06);
        g2.textAlign = "center"; g2.textBaseline = "middle";
        g2.font = FONT(58); g2.fillStyle = "#F6D77A"; g2.fillText("MO'S SANDWICHES", w / 2, 50);
        g2.strokeStyle = "rgba(246,215,122,0.7)"; g2.lineWidth = 4; g2.beginPath(); g2.moveTo(250, 88); g2.lineTo(w - 250, 88); g2.stroke();
        // ribbon with the main price line
        g2.fillStyle = "#F4A28C"; g2.beginPath(); g2.moveTo(90, 112); g2.lineTo(w - 90, 112); g2.lineTo(w - 120, 162); g2.lineTo(w - 90, 212); g2.lineTo(90, 212); g2.lineTo(120, 162); g2.closePath(); g2.fill();
        g2.fillStyle = "#D9705A"; g2.fillRect(90, 204, w - 180, 8);
        g2.font = FONT(84); g2.lineJoin = "round"; g2.strokeStyle = "#7A2E26"; g2.lineWidth = 10; const main = "SANDWICH  " + priceStr(); g2.strokeText(main, w / 2, 166); g2.fillStyle = "#FFF6E0"; g2.fillText(main, w / 2, 166);
        // other items
        const items = [["Crumb Soup", "$4", "#9FD8C2"], ["Coconut Fizz", "$3", "#8EC3E8"], ["Mystery Pickle", "???", "#C7B3E6"]];
        items.forEach(([n, p, c], i) => { const y = 262 + i * 52; g2.font = FONT(42, 800); g2.textAlign = "left"; g2.fillStyle = c; g2.fillText(n, 150, y); g2.textAlign = "right"; g2.fillText(p, w - 150, y);
          g2.fillStyle = "rgba(255,255,255,0.45)"; const x0 = 160 + g2.measureText(n).width * 0 + 330, x1 = w - 260; for (let x = x0; x < x1; x += 16) g2.fillRect(x, y + 12, 6, 4); });
        g2.textAlign = "center";
        // doodles: sandwich + stars
        const sw = (x, y, s) => { g2.save(); g2.translate(x, y); g2.scale(s, s); g2.lineWidth = 4; g2.strokeStyle = "#FFF6E0";
          g2.fillStyle = "#F6D77A"; g2.beginPath(); g2.ellipse(0, -14, 40, 14, 0, PI, 0); g2.fill(); g2.stroke(); g2.fillStyle = "#7DBA5A"; g2.beginPath(); for (let k = 0; k <= 8; k++) g2.lineTo(-42 + k * 10.5, -10 + (k % 2) * 7); g2.lineTo(42, -2); g2.lineTo(-42, -2); g2.fill();
          g2.fillStyle = "#E85B4A"; g2.fillRect(-36, -4, 72, 8); g2.fillStyle = "#F6D77A"; g2.beginPath(); g2.roundRect(-40, 4, 80, 14, 6); g2.fill(); g2.stroke(); g2.restore(); };
        sw(90, 56, 0.9); sw(w - 90, 56, 0.9);
        const star = (x, y, s, c) => { g2.fillStyle = c; g2.beginPath(); for (let k = 0; k < 10; k++) { const a = k * PI / 5 - PI / 2, rr = k % 2 ? s * 0.45 : s; g2.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g2.fill(); };
        star(70, 270, 16, "#F6D77A"); star(w - 70, 330, 14, "#F4A28C"); star(60, 380, 10, "#9FD8C2");
        g2.font = FONT(26, 700); g2.fillStyle = "rgba(255,246,224,0.75)"; g2.fillText("made with love since forever", w / 2, h - 22); }
      const menuTex = textTex(1024, 432, drawMenu);
      const mb = new TH.Group(); mb.position.set(0, 2.5, -3.5); W.back.add(mb);
      B(mb, 3.36, 1.46, 0.07, "#7A4E32", 0, -0.73, 0.035);
      MB(mb, [[3.36, 0.1, 0.12, 0, 0.63, 0.06], [3.36, 0.1, 0.12, 0, -0.73, 0.06], [0.1, 1.46, 0.12, -1.63, -0.73, 0.06], [0.1, 1.46, 0.12, 1.63, -0.73, 0.06]], "#B07A4E");
      G(mb, new TH.PlaneGeometry(3.16, 1.26), texMat(menuTex, { emissive: new TH.Color("#FFFFFF"), emissiveMap: menuTex, emissiveIntensity: 0.32 }), 0, -0.03, 0.075);
      // picture light over the board
      MB(mb, [[0.04, 0.04, 0.3, -0.9, 0.78, 0.18], [0.04, 0.04, 0.3, 0.9, 0.78, 0.18]], "#C9A04A");
      const mPicL = glowMat("#FFE7A8", 0.5); B(mb, 2.2, 0.07, 0.09, mPicL, 0, 0.8, 0.34);
      function setPrice(n) { S.price = n; const c = menuTex.image; drawMenu(c.getContext("2d"), c.width, c.height); menuTex.needsUpdate = true; drawReg(); }

      // ---- shelves under the board: bread + jars
      MB(W.back, [[3.1, 0.05, 0.32, 0, 1.18, -3.34], [3.1, 0.05, 0.32, 0, 1.56, -3.34], [0.05, 0.16, 0.26, -1.3, 1.02, -3.37], [0.05, 0.16, 0.26, 1.3, 1.02, -3.37], [0.05, 0.16, 0.26, -1.3, 1.4, -3.37], [0.05, 0.16, 0.26, 1.3, 1.4, -3.37]], "#8A5A3A");
      { const r = rng(5), L = [], J = [], Lid = [], Lab = [];
        for (let i = 0; i < 7; i++) { const x = -1.3 + i * 0.43 + (r() - 0.5) * 0.05; const big = r() < 0.5; L.push({ p: [x, 1.61 + (big ? 0.08 : 0.065), -3.33], r: [0, (r() - 0.5) * 0.5, 0], s: [big ? 0.19 : 0.16, big ? 0.09 : 0.075, 0.1], c: shade("#D99A52", (r() - 0.5) * 0.2) }); }
        const jc = ["#7DBA5A", "#D9453A", "#F2C14E", "#E8973A", "#C7B3E6"];
        for (let i = 0; i < 9; i++) { const x = -1.32 + i * 0.33, hh = 0.13 + r() * 0.06, c = jc[i % jc.length]; J.push({ p: [x, 1.23 + hh / 2, -3.33], s: [0.065, hh, 0.065], c }); Lid.push({ p: [x, 1.23 + hh + 0.015, -3.33], s: [0.07, 0.03, 0.07], c: i % 2 ? "#E0B04A" : "#E8E2D6" }); Lab.push({ p: [x, 1.23 + hh * 0.48, -3.33], s: [0.068, hh * 0.42, 0.068], c: "#FFF3D8" }); }
        inst(W.back, new TH.SphereGeometry(1, 12, 8), mat("#FFFFFF"), L);
        inst(W.back, cyl(1, 1, 1, 12), mat("#FFFFFF"), J); inst(W.back, cyl(1, 1, 1, 12), mat("#FFFFFF"), Lid); inst(W.back, cyl(1, 1, 1, 12), mat("#FFFFFF"), Lab); }
      // ---- side wall decor: poster (left), framed first dollar (right)
      { const pg = new TH.Group(); pg.position.set(-4.5, 1.45, 0.9); pg.rotation.y = PI / 2; W.left.add(pg);
        const tex = textTex(512, 640, (g2, w, h) => { g2.fillStyle = "#F6D77A"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#2FA7B8"; g2.beginPath(); g2.arc(w / 2, h * 0.47, 190, 0, PI * 2); g2.fill(); g2.fillStyle = "#8EC3E8"; g2.beginPath(); g2.arc(w / 2, h * 0.47, 150, 0, PI * 2); g2.fill();
          g2.save(); g2.translate(w / 2, h * 0.5); g2.scale(2.6, 2.6); g2.lineWidth = 4; g2.strokeStyle = INK; g2.fillStyle = "#F2C27A"; g2.beginPath(); g2.ellipse(0, -14, 44, 18, 0, PI, 0); g2.fill(); g2.stroke(); g2.fillStyle = "#7DBA5A"; g2.fillRect(-46, -12, 92, 8); g2.fillStyle = "#E85B4A"; g2.fillRect(-42, -4, 84, 8); g2.fillStyle = "#F6D77A"; g2.fillRect(-44, 4, 88, 7); g2.fillStyle = "#F2C27A"; g2.beginPath(); g2.roundRect(-44, 10, 88, 14, 6); g2.fill(); g2.stroke(); g2.restore();
          g2.fillStyle = "#C8553D"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.font = FONT(54); g2.fillText("BEST SANDWICH", w / 2, 70); g2.font = FONT(50); g2.fillStyle = "#2F6F73"; g2.fillText("IN THE OCEAN", w / 2, h - 66); });
        B(pg, 1.08, 1.32, 0.05, "#2F6F73", 0, 0, 0.025); G(pg, new TH.PlaneGeometry(0.96, 1.2), texMat(tex, { emissive: new TH.Color("#FFFFFF"), emissiveMap: tex, emissiveIntensity: 0.15 }), 0, 0.66, 0.052); }
      { const pg = new TH.Group(); pg.position.set(4.5, 1.6, 0.9); pg.rotation.y = -PI / 2; W.right.add(pg);
        const tex = textTex(512, 360, (g2, w, h) => { g2.fillStyle = "#F2E6C8"; g2.fillRect(0, 0, w, h); g2.save(); g2.translate(w / 2, h * 0.42); g2.rotate(-0.05); g2.fillStyle = "#9FC98A"; g2.fillRect(-180, -80, 360, 160); g2.strokeStyle = "#4E7A42"; g2.lineWidth = 6; g2.strokeRect(-168, -68, 336, 136);
          g2.fillStyle = "#4E7A42"; g2.beginPath(); g2.ellipse(0, 0, 46, 56, 0, 0, PI * 2); g2.fill(); g2.fillStyle = "#DDEFC8"; g2.font = FONT(72); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("1", 0, 4); g2.fillStyle = "#4E7A42"; g2.font = FONT(40); g2.fillText("$", -130, -40); g2.fillText("$", 130, 40); g2.restore();
          g2.fillStyle = "#7A4E32"; g2.font = FONT(38); g2.textAlign = "center"; g2.fillText("MO'S FIRST DOLLAR", w / 2, h - 44); });
        MB(pg, [[0.9, 0.08, 0.06, 0, 0.6, 0.03], [0.9, 0.08, 0.06, 0, -0.04, 0.03], [0.08, 0.72, 0.06, -0.41, -0.04, 0.03], [0.08, 0.72, 0.06, 0.41, -0.04, 0.03]], "#C9A04A");
        B(pg, 0.8, 0.6, 0.02, "#F2E6C8", 0, 0.0, 0.01); G(pg, new TH.PlaneGeometry(0.76, 0.54), texMat(tex), 0, 0.3, 0.025); }

      // ---- counter
      const mButcher = texMat(texBoards("#C99A66", 8, 81, true, "#8A5A3A"));
      B(g, 7.0, 1.0, 0.68, "#2F8F8A", 0, 0, -0.22);
      B(g, 7.12, 0.05, 0.8, mButcher, 0, 1.0, -0.2, { s: 0.9 });
      B(g, 7.0, 0.12, 0.05, "#6E4430", 0, 0, 0.14);
      B(g, 7.02, 0.07, 0.05, "#24706C", 0, 0.9, 0.14);
      MB(g, Array.from({ length: 7 }, (_, i) => [0.82, 0.62, 0.04, -3 + i, 0.2, 0.135]), "#9FD8C2");
      MB(g, Array.from({ length: 7 }, (_, i) => [0.6, 0.42, 0.03, -3 + i, 0.3, 0.165]), "#B9E6D4");
      // deli case on the counter (x -3.2 .. -1.0)
      const dx = -2.1, dz = -0.2;
      B(g, 2.2, 0.06, 0.74, "#C9D3DC", dx, 1.05, dz);
      MB(g, [0, 1, 2, 3].map((i) => [0.48, 0.035, 0.44, dx - 0.78 + i * 0.52, 1.11, dz + 0.02]), "#9EABB8");
      { const r = rng(9), y0 = 1.145, T = [], Tw = [], Le = [], Ch = [], Ha = [];
        const tx = dx - 0.78, lx = dx - 0.26, cx2 = dx + 0.26, hx = dx + 0.78;
        for (let i = 0; i < 7; i++) T.push({ p: [tx - 0.13 + (i % 4) * 0.085, y0 + 0.012 + Math.floor(i / 4) * 0.01, dz - 0.05 + Math.floor(i / 4) * 0.12 + (r() - 0.5) * 0.02], r: [0.25, 0, 0.1], s: [0.05, 0.016, 0.05] });
        for (let i = 0; i < 3; i++) Tw.push({ p: [tx - 0.12 + i * 0.11, y0 + 0.05, dz + 0.16], s: [0.055, 0.05, 0.055] });
        for (let i = 0; i < 9; i++) Le.push({ p: [lx + (r() - 0.5) * 0.3, y0 + 0.03 + r() * 0.03, dz + (r() - 0.5) * 0.3], r: [r() * 3, r() * 3, r() * 3], s: [0.09, 0.05, 0.08], c: r() < 0.5 ? "#6FB04E" : "#A6D86A" });
        for (let i = 0; i < 8; i++) Ch.push({ p: [cx2 - 0.1 + (i % 4) * 0.065, y0 + 0.008 + i * 0.006, dz - 0.08 + Math.floor(i / 4) * 0.15], r: [0, 0.3 * i, 0], s: [1, 1, 1], c: i % 3 ? "#F6C64A" : "#F2B23A" });
        for (let i = 0; i < 8; i++) Ha.push({ p: [hx - 0.1 + (i % 4) * 0.065, y0 + 0.007 + i * 0.005, dz - 0.07 + Math.floor(i / 4) * 0.15], r: [0.08, 0, -0.1], s: [1, 1, 1], c: i % 2 ? "#F2A0A8" : "#E88A96" });
        inst(g, cyl(1, 1, 1, 12), mat("#E8483A"), T); inst(g, new TH.SphereGeometry(1, 12, 8), mat("#E04232"), Tw);
        inst(g, new TH.IcosahedronGeometry(1, 0), mat("#FFFFFF"), Le); inst(g, new TH.BoxGeometry(0.11, 0.012, 0.11), mat("#FFFFFF"), Ch); inst(g, cyl(0.065, 0.065, 0.012, 12), mat("#FFFFFF"), Ha);
        // glass + steel frame
        const ang = -0.565, len = 0.486;
        glassPane(g, 2.16, len, dx, 1.315, dz + 0.21, { rx: ang });
        glassPane(g, 2.16, 0.44, dx, 1.52, dz - 0.14, { rx: -PI / 2 });
        glassPane(g, 0.7, 0.41, dx - 1.08, 1.315, dz - 0.07, { ry: PI / 2 }); glassPane(g, 0.7, 0.41, dx + 1.08, 1.315, dz - 0.07, { ry: PI / 2 });
        MB(g, [[2.2, 0.035, 0.035, dx, 1.5, dz + 0.08], [2.2, 0.035, 0.035, dx, 1.5, dz - 0.36], [2.2, 0.035, 0.035, dx, 1.1, dz + 0.34], [0.035, 0.42, 0.035, dx - 1.09, 1.1, dz - 0.36], [0.035, 0.42, 0.035, dx + 1.09, 1.1, dz - 0.36],
          [0.035, len, 0.035, dx - 1.09, 1.315 - len / 2, dz + 0.21, 0, ang], [0.035, len, 0.035, dx + 1.09, 1.315 - len / 2, dz + 0.21, 0, ang], [0.035, len, 0.035, dx, 1.315 - len / 2, dz + 0.21, 0, ang]], "#AEB9C6");
        // little price tags
        ["TOMATO", "LETTUCE", "CHEESE", "HAM"].forEach((n, i) => { const tt = plate(n, { w: 256, h: 96, size: 44, bg: "#FFF6E0", color: "#C8553D" }); G(g, new TH.PlaneGeometry(0.2, 0.075), texMat(tt), dx - 0.78 + i * 0.52, 1.13, dz + 0.378); }); }

      // ---- cash register (front faces Mo; drawer slides toward Mo and to the left on screen)
      const reg = new TH.Group(); reg.position.set(1.05, 1.05, -0.22); reg.rotation.y = -1.78; g.add(reg);
      const brass = texMat(texShiny("#CF9C4C", 3)), cream = "#F7ECD2";
      B(reg, 0.58, 0.03, 0.58, "#6E4430", 0, 0, 0);
      B(reg, 0.52, 0.17, 0.52, brass, 0, 0.03, 0);
      const drawer = new TH.Group(); reg.add(drawer);
      B(drawer, 0.46, 0.12, 0.5, "#F2E6C8", 0, 0.045, 0); B(drawer, 0.5, 0.14, 0.03, "#2F8F8A", 0, 0.035, 0.265); B(drawer, 0.12, 0.025, 0.03, "#E3AE4E", 0, 0.09, 0.285);
      MB(drawer, [[0.1, 0.008, 0.16, -0.15, 0.165, 0.05], [0.1, 0.008, 0.16, -0.04, 0.165, 0.06], [0.1, 0.008, 0.16, 0.07, 0.165, 0.04]], "#7DBA5A");
      inst(drawer, cyl(0.022, 0.022, 0.008, 10), mat("#F2C14E"), [0, 1, 2, 3, 4].map((i) => ({ p: [0.17 + (i % 2) * 0.03, 0.17, -0.1 + i * 0.05] })));
      B(reg, 0.48, 0.24, 0.32, brass, 0, 0.2, -0.09);
      const kb = B(reg, 0.48, 0.05, 0.25, cream, 0, 0.27, 0.15, { rx: 0.5 });
      inst(kb, new TH.BoxGeometry(0.075, 0.03, 0.05), mat("#FFFFFF"), Array.from({ length: 12 }, (_, i) => ({ p: [-0.165 + (i % 4) * 0.11, 0.035, -0.07 + Math.floor(i / 4) * 0.07], c: ["#F4A28C", "#F6D77A", "#9FD8C2", "#FFF6E0"][(i + Math.floor(i / 4)) % 4] })));
      const disp = new TH.Group(); disp.position.set(0, 0, -0.14); disp.rotation.y = 1.78; reg.add(disp);   // customer-facing price display
      B(disp, 0.06, 0.16, 0.06, brass, 0, 0.44, 0);
      B(disp, 0.34, 0.13, 0.1, brass, 0, 0.58, 0);
      const regTex = textTex(256, 96, (g2, w, h) => { g2.fillStyle = "#1F3A36"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#9CFFB0"; g2.font = MONO(64); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(priceStr() + (S.price < 100 ? ".00" : ""), w / 2, h / 2 + 4); });
      const drawReg = () => { const c = regTex.image; const g2 = c.getContext("2d"); g2.fillStyle = "#1F3A36"; g2.fillRect(0, 0, c.width, c.height); g2.fillStyle = "#9CFFB0"; g2.font = MONO(Math.min(64, 330 / (priceStr().length + 3))); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(priceStr() + (Math.round(S.price) === S.price ? ".00" : ""), c.width / 2, c.height / 2 + 4); regTex.needsUpdate = true; };
      const regScr = new TH.MeshBasicMaterial({ map: regTex });
      G(disp, new TH.PlaneGeometry(0.26, 0.085), regScr, 0, 0.645, 0.052); G(disp, new TH.PlaneGeometry(0.26, 0.085), regScr, 0, 0.645, -0.052, { ry: PI });
      const flag = new TH.Group(); disp.add(flag); const flagTex = plate("SALE", { w: 256, h: 112, size: 72, bg: "#E85B4A", color: "#FFF6E0", ink: "#7A2E26" });
      B(flag, 0.2, 0.09, 0.012, texMat(flagTex), 0, 0.62, 0);
      G(reg, cyl(0.02, 0.02, 0.12, 8).rotateZ(PI / 2), "#B07A3A", 0.3, 0.3, -0.05); B(reg, 0.02, 0.16, 0.03, "#B07A3A", 0.36, 0.22, -0.05); G(reg, new TH.SphereGeometry(0.035, 10, 8), "#E85B4A", 0.36, 0.22, -0.05);
      function setDrawer(k) { S.drawer = cl01(k); const e = S.drawer; drawer.position.z = e * 0.34; flag.position.y = sstep(0, 0.6, e) * 0.1; }
      setDrawer(0);
      // service bell, tip jar, baguette basket
      G(g, cyl(0.075, 0.08, 0.025, 16), "#6E4430", 1.75, 1.0625, 0.0); G(g, new TH.SphereGeometry(0.06, 16, 8, 0, PI * 2, 0, PI / 2), brass, 1.75, 1.075, 0.0); G(g, cyl(0.012, 0.012, 0.03, 8), "#C9A04A", 1.75, 1.145, 0.0);
      const tj = new TH.Group(); tj.position.set(2.35, 1.05, -0.12); g.add(tj);
      G(tj, cyl(0.1, 0.1, 0.26, 18, true), mGlass, 0, 0.13, 0, { layer: 1 }).renderOrder = 2;
      G(tj, cyl(0.1, 0.1, 0.015, 18), "#CFE9EE", 0, 0.0075, 0); G(tj, new TH.TorusGeometry(0.1, 0.012, 6, 20).rotateX(PI / 2), "#DDF2F5", 0, 0.26, 0);
      inst(tj, cyl(0.026, 0.026, 0.009, 10), mat("#F2C14E"), Array.from({ length: 11 }, (_, i) => ({ p: [Math.sin(i * 2.4) * 0.05, 0.02 + i * 0.006, Math.cos(i * 2.4) * 0.05], r: [Math.sin(i) * 0.3, 0, Math.cos(i * 1.7) * 0.3] })));
      MB(tj, [[0.07, 0.15, 0.005, -0.02, 0.06, 0.0, 0.3, 0, 0.25], [0.07, 0.14, 0.005, 0.03, 0.06, -0.02, -0.5, 0, -0.2]], "#7DBA5A");
      const tipTex = textTex(256, 160, (g2, w, h) => { g2.fillStyle = "#FFF6E0"; g2.beginPath(); g2.roundRect(4, 4, w - 8, h - 8, 20); g2.fill(); g2.strokeStyle = "#C8553D"; g2.lineWidth = 8; g2.stroke(); g2.fillStyle = "#C8553D"; g2.font = FONT(76); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("TIPS", w / 2, h / 2 - 10); g2.font = FONT(34); g2.fillStyle = "#2F8F8A"; g2.fillText("thank u!", w / 2, h - 30); });
      G(tj, new TH.PlaneGeometry(0.15, 0.094), texMat(tipTex, { transparent: true }), 0, 0.12, 0.103);
      { const bk = new TH.Group(); bk.position.set(3.05, 1.05, -0.28); g.add(bk);
        const wick = texMat(W3.tex(128, 64, (g2, w, h) => { g2.fillStyle = "#C99A5A"; g2.fillRect(0, 0, w, h); for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) { g2.fillStyle = (i + j) % 2 ? "#B07A3A" : "#DDB070"; g2.beginPath(); g2.ellipse(i * 16 + 8 + (j % 2) * 8, j * 16 + 8, 8, 6, 0, 0, PI * 2); g2.fill(); } }));
        G(bk, W3.uvScale(cyl(0.17, 0.13, 0.2, 14), 4, 1), wick, 0, 0.1, 0);
        inst(bk, new TH.CapsuleGeometry(0.042, 0.5, 4, 10), mat("#E2A862"), [[-0.06, 0.03, 0.2], [0.05, -0.04, -0.15], [0.0, 0.07, 0.05], [-0.04, -0.06, -0.3], [0.07, 0.05, 0.28]].map(([x, z, rz]) => ({ p: [x, 0.33, z], r: [z * 2.5, 0, rz] }))); }

      // ---- oven 1 (brick + mosaic dome, fire inside): back-left
      const o1 = new TH.Group(); o1.position.set(-2.7, 0, -2.9); g.add(o1);
      const mBrick = texMat(texBrick("#C8553D", "#EAD9BC", 91));
      B(o1, 1.7, 1.1, 1.2, mBrick, 0, 0, 0, { s: 0.8 });
      B(o1, 1.82, 0.07, 1.3, "#EBDDBF", 0, 1.1, 0.04);
      B(o1, 1.12, 0.5, 0.04, "#4A2C2A", 0, 0.28, 0.6);
      MB(o1, [[1.26, 0.08, 0.07, 0, 0.78, 0.6], [1.26, 0.06, 0.07, 0, 0.22, 0.6]], "#EBDDBF");
      inst(o1, cyl(0.068, 0.068, 0.08, 10).rotateX(PI / 2), mat("#D9A86A"), Array.from({ length: 12 }, (_, i) => ({ p: [-0.45 + (i % 6) * 0.18 + (Math.floor(i / 6) % 2) * 0.06, 0.4 + Math.floor(i / 6) * 0.14 + (i % 2) * 0.01, 0.62], c: i % 3 ? "#D9A86A" : "#C4925A" })));
      const domeGeo = W3.uvScale(new TH.SphereGeometry(0.8, 20, 10, 0, PI * 2, 0, PI / 2), 6, 2.5);
      G(o1, domeGeo, texMat(texMosaic(["#2F8F8A", "#F6D77A", "#C8553D", "#9FD8C2"], 92)), 0, 1.17, -0.06, { sc: [1, 0.92, 0.72] });
      const fac = W3.uvScale(extrude(archShape(1.32, 0.22, 0.66, 0.16, 0.06), 0.16, 14), 1.25, 1.25);
      G(o1, fac, mBrick, 0, 1.17, 0.44);
      G(o1, new TH.TorusGeometry(0.37, 0.05, 6, 16, PI), "#EBDDBF", 0, 1.17 + 0.22, 0.62);
      MB(o1, [[0.1, 0.22, 0.07, -0.37, 1.17, 0.62], [0.1, 0.22, 0.07, 0.37, 1.17, 0.62], [0.14, 0.14, 0.09, 0, 1.17 + 0.56, 0.62]], "#EBDDBF");
      const recess = new TH.Mesh(new TH.BoxGeometry(0.66, 0.5, 0.55), W3.toon("#5A2A26", null, { side: TH.BackSide, emissive: new TH.Color("#FF6A2A"), emissiveIntensity: 0.35 })); recess.position.set(0, 1.17 + 0.06 + 0.25, 0.44 - 0.27); recess.layers.set(1); o1.add(recess);
      MG(o1, [[cyl(0.04, 0.04, 0.42, 8), -0.02, 1.27, 0.25, 0, 0.5, PI / 2], [cyl(0.04, 0.04, 0.4, 8), 0.05, 1.27, 0.22, 0, -0.6, PI / 2]], "#6E4430");
      const fireO = glowMat("#FF7A2A", 1.1), fireI = glowMat("#FFD45A", 1.3);
      const flames = [[-0.13, 0.85, fireO, 0.09, 0.3], [0.02, 1.0, fireO, 0.1, 0.36], [0.15, 0.8, fireO, 0.08, 0.28], [-0.06, 0.7, fireI, 0.05, 0.2], [0.08, 0.75, fireI, 0.05, 0.22]].map(([x, s, m, rr, hh], i) => { const f = G(o1, new TH.ConeGeometry(rr, hh, 7), m, x, 1.3 + hh / 2, 0.26 + (i > 2 ? 0.05 : 0)); f.userData = { hh, s }; return f; });
      const fireGlow = glow(o1, "#FF8A3A", 1.5, 0, 1.45, 0.75);
      G(o1, cyl(0.15, 0.17, 1.6, 14), "#B86A4A", 0, 2.6, -0.2); MB(o1, [[0.4, 0.06, 0.4, 0, 2.3, -0.2], [0.4, 0.06, 0.4, 0, 3.0, -0.2]], "#7A4E32");
      const betty = plate("OLD BETTY", { w: 512, h: 112, size: 64, bg: "#2F8F8A", color: "#FFF6E0", ink: "#1E4A48" }); B(o1, 0.56, 0.12, 0.02, texMat(betty), 0, 0.92, 0.61);

      // ---- oven 2 (the new one): back-right, rises in with env.oven2, bow hides with env.oven2Bow
      const o2 = new TH.Group(); o2.position.set(2.7, 0, -2.9); g.add(o2);
      const mEn = texMat(texShiny("#8ED6C0", 7, true)), chrome = texMat(texShiny("#C9D3DE", 8)), chromeD = "#8E9AA8";
      MB(o2, [[0.08, 0.2, 0.08, -0.65, 0, -0.42], [0.08, 0.2, 0.08, 0.65, 0, -0.42], [0.08, 0.2, 0.08, -0.65, 0, 0.42], [0.08, 0.2, 0.08, 0.65, 0, 0.42]], chrome);
      B(o2, 1.5, 0.86, 1.0, mEn, 0, 0.2, 0);
      MB(o2, [[0.64, 0.58, 0.06, -0.37, 0.32, 0.52], [0.64, 0.58, 0.06, 0.37, 0.32, 0.52]], "#A6E2CF");
      MB(o2, [[0.2, 0.035, 0.06, -0.37, 0.8, 0.57], [0.2, 0.035, 0.06, 0.37, 0.8, 0.57]], chrome);
      B(o2, 1.66, 0.07, 1.16, chrome, 0, 1.05, 0);
      B(o2, 1.6, 0.84, 1.1, mEn, 0, 1.12, 0);
      B(o2, 1.08, 0.58, 0.06, chrome, -0.17, 1.24, 0.575);
      G(o2, new TH.PlaneGeometry(0.82, 0.3), new TH.MeshBasicMaterial({ color: new TH.Color("#FFB45A") }), -0.17, 1.5, 0.607);
      G(o2, new TH.PlaneGeometry(0.2, 0.3), new TH.MeshBasicMaterial({ color: new TH.Color("#FFE2A8") }), -0.42, 1.5, 0.608);
      G(o2, cyl(0.026, 0.026, 0.92, 10).rotateZ(PI / 2), chrome, -0.17, 1.74, 0.68); MB(o2, [[0.03, 0.03, 0.08, -0.55, 1.725, 0.63], [0.03, 0.03, 0.08, 0.21, 1.725, 0.63]], chrome);
      B(o2, 0.34, 0.66, 0.03, chromeD, 0.58, 1.2, 0.565);
      inst(o2, cyl(0.05, 0.05, 0.05, 14).rotateX(PI / 2), mat("#E85B4A"), [1.36, 1.5, 1.64].map((y) => ({ p: [0.58, y, 0.6] })));
      const tdisp = textTex(128, 64, (g2, w, h) => { g2.fillStyle = "#1F3A36"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#9CFFB0"; g2.font = MONO(40); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("450°", w / 2, h / 2 + 2); });
      G(o2, new TH.PlaneGeometry(0.22, 0.1), new TH.MeshBasicMaterial({ map: tdisp }), 0.58, 1.76, 0.582);
      B(o2, 1.72, 0.09, 1.22, chrome, 0, 1.95, 0); G(o2, cyl(0.1, 0.1, 0.5, 12), chrome, 0.4, 2.29, -0.3);
      const sb = plate("SUPERBAKE 3000", { w: 512, h: 96, size: 52, bg: "#E8EEF4", color: "#2F6F73", ink: "#8E9AA8" }); B(o2, 0.6, 0.1, 0.02, texMat(sb), 0, 0.92, 0.52);
      const bow = new TH.Group(); o2.add(bow); const red = W3.toon("#E23E3A");
      MB(bow, [[1.76, 0.025, 0.18, 0, 2.04, 0], [0.18, 0.025, 1.26, 0, 2.045, 0], [0.025, 0.95, 0.18, -0.865, 1.1, 0], [0.025, 0.95, 0.18, 0.865, 1.1, 0], [0.18, 0.95, 0.025, 0.62, 1.1, -0.6]], red);
      MG(bow, [[new TH.TorusGeometry(0.15, 0.05, 8, 18), -0.15, 2.2, 0, 0, 0, 0.55, 1, 0.75, 0.7], [new TH.TorusGeometry(0.15, 0.05, 8, 18), 0.15, 2.2, 0, 0, 0, -0.55, 1, 0.75, 0.7], [new TH.SphereGeometry(0.075, 10, 8), 0, 2.13, 0],
        [new TH.BoxGeometry(0.08, 0.02, 0.36), -0.1, 2.07, 0.2, 0, 0.45, 0], [new TH.BoxGeometry(0.08, 0.02, 0.36), 0.1, 2.07, 0.2, 0, -0.45, 0]], red);
      const tagT = plate("NEW!", { w: 256, h: 128, size: 80, bg: "#FFF6E0", color: "#E23E3A" }); B(bow, 0.2, 0.1, 0.006, texMat(tagT), 0.2, 1.96, 0.64, { rz: -0.25 });
      const sparks = [[-0.9, 1.9, 0.6], [0.9, 2.1, 0.5], [0.3, 2.45, 0.4], [-0.5, 1.3, 0.7], [0.95, 1.2, 0.65]].map(([x, y, z]) => glow(o2, "#FFFFFF", 0.35, x, y, z));

      // ---- pendant lamps
      const bulbM = glowMat("#FFE6A0", 0.6), pend = [], pX = [-2.4, 0, 2.4];
      MB(g, pX.map((x) => [0.02, 0.5, 0.02, x, 2.9, -0.2]), "#3A3440");
      pX.forEach((x, i) => { const c = ["#2F8F8A", "#F4A28C", "#F6D77A"][i]; G(g, cyl(0.09, 0.3, 0.26, 18, true), W3.toon(c, null, { side: TH.DoubleSide }), x, 2.78, -0.2); G(g, cyl(0.1, 0.1, 0.06, 14), "#E3AE4E", x, 2.92, -0.2);
        G(g, new TH.SphereGeometry(0.075, 12, 8), bulbM, x, 2.66, -0.2); pend.push(glow(g, "#FFD890", 0.8, x, 2.62, -0.2)); });

      // ---- customer side: bistro table + chairs, plant, mat
      G(g, cyl(0.42, 0.42, 0.04, 20), "#F2E6C8", -3.4, 0.74, 2.3); G(g, cyl(0.035, 0.035, 0.72, 8), "#3A3440", -3.4, 0.38, 2.3); G(g, cyl(0.26, 0.28, 0.04, 16), "#3A3440", -3.4, 0.02, 2.3);
      G(g, cyl(0.04, 0.05, 0.14, 10), "#8EC3E8", -3.35, 0.83, 2.25); G(g, new TH.SphereGeometry(0.05, 10, 8), "#F4A28C", -3.35, 0.95, 2.25);
      const chair = (x, z, ry) => { const cg = new TH.Group(); cg.position.set(x, 0, z); cg.rotation.y = ry; g.add(cg); MB(cg, [[0.04, 0.45, 0.04, -0.17, 0, -0.17], [0.04, 0.45, 0.04, 0.17, 0, -0.17], [0.04, 0.9, 0.04, -0.17, 0, 0.17], [0.04, 0.9, 0.04, 0.17, 0, 0.17], [0.4, 0.05, 0.4, 0, 0.45, 0], [0.4, 0.14, 0.04, 0, 0.72, 0.17]], "#2F8F8A"); };
      chair(-3.4, 1.65, 0); chair(-3.4, 2.95, PI);
      makePlant(g, 3.95, 2.6, 1.1, 12);
      B(g, 1.1, 0.015, 0.6, texMat(plate("WELCOME", { w: 512, h: 256, size: 90, bg: "#C8553D", color: "#F6D77A", ink: "#7A2E26" })), 2.5, 0, 2.95);

      // ---- front wall (door + big window) — auto-hidden when the camera is outside
      { const F = W.front, mF = mCoral, z = 3.5;
        [[0.9, 3.4, -4.05, 0], [4.6, 0.9, -1.3, 0], [4.6, 0.8, -1.3, 2.6], [0.9, 3.4, 1.45, 0], [1.2, 1.2, 2.5, 2.2], [1.4, 3.4, 3.8, 0]].forEach(([w, h, x, y]) => wall(F, w, h, mF, x, y, z, PI, 2));
        MB(F, [[9, 0.14, 0.05, 0, 0, 3.475]], "#6E4430");
        const tl = "#2F8F8A";
        MB(F, [[4.84, 0.12, 0.18, -1.3, 2.6, 3.5], [4.9, 0.08, 0.32, -1.3, 0.82, 3.42], [0.12, 1.7, 0.18, -3.66, 0.9, 3.5], [0.12, 1.7, 0.18, 1.06, 0.9, 3.5], [0.07, 1.7, 0.1, -2.07, 0.9, 3.5], [0.07, 1.7, 0.1, -0.53, 0.9, 3.5], [4.6, 0.06, 0.1, -1.3, 2.08, 3.5],
          [0.12, 2.3, 0.2, 1.84, 0, 3.5], [0.12, 2.3, 0.2, 3.16, 0, 3.5], [1.44, 0.12, 0.2, 2.5, 2.2, 3.5]], tl);
        glassPane(F, 4.6, 1.7, -1.3, 1.75, 3.52, { ry: PI });
        const deco = textTex(1024, 256, (g2, w, h) => { g2.clearRect(0, 0, w, h); g2.save(); g2.translate(w, 0); g2.scale(-1, 1); g2.font = FONT(150); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.lineWidth = 16; g2.strokeStyle = "rgba(200,85,61,0.9)"; g2.strokeText("MO'S", w / 2, h / 2); g2.fillStyle = "rgba(246,215,122,0.95)"; g2.fillText("MO'S", w / 2, h / 2); g2.restore(); });
        const dm = G(F, new TH.PlaneGeometry(1.6, 0.4), new TH.MeshBasicMaterial({ map: deco, transparent: true, depthWrite: false }), -1.3, 2.25, 3.49, { ry: PI, layer: 1 }); dm.renderOrder = 3;
        const door = new TH.Group(); door.position.set(2.5, 0, 3.47); F.add(door);
        MB(door, [[1.2, 0.9, 0.06, 0, 0, 0], [1.2, 0.16, 0.06, 0, 2.04, 0], [0.16, 1.2, 0.06, -0.52, 0.9, 0], [0.16, 1.2, 0.06, 0.52, 0.9, 0], [1.2, 0.08, 0.06, 0, 0.88, 0]], "#F6D77A");
        MB(door, [[0.7, 0.55, 0.03, 0, 0.18, -0.04]], "#F2C14E");
        glassPane(door, 0.9, 1.16, 0, 1.5, 0.0, { ry: PI });
        G(door, cyl(0.02, 0.02, 0.3, 8), "#C9A04A", -0.45, 1.05, -0.08); MB(door, [[0.03, 0.03, 0.06, -0.45, 1.17, -0.05], [0.03, 0.03, 0.06, -0.45, 0.9, -0.05]], "#C9A04A");
        const ca = plate("COME AGAIN!", { w: 512, h: 160, size: 70, bg: "#FFF6E0", color: "#2F8F8A" }); B(door, 0.42, 0.13, 0.01, texMat(ca), 0, 1.55, -0.05, { ry: PI });
        const bdTex = W3.tex(1024, 512, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5A9AE0"); gr.addColorStop(0.45, "#A8D2F2"); gr.addColorStop(0.62, "#FFE6C4"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
          g2.fillStyle = "#2FA7B8"; g2.fillRect(0, h * 0.62, w, h * 0.12); g2.fillStyle = "#F2D9A0"; g2.fillRect(0, h * 0.72, w, h * 0.06); g2.fillStyle = "#D8CDB8"; g2.fillRect(0, h * 0.78, w, h * 0.22);
          const r = rng(4); for (let i = 0; i < 7; i++) { const x = 40 + i * 150 + r() * 40, ww = 100 + r() * 30, hh = 110 + r() * 60; g2.fillStyle = ["#F4A28C", "#9FD8C2", "#F6D77A", "#8EC3E8", "#C7B3E6"][i % 5]; g2.fillRect(x, h * 0.74 - hh, ww, hh); g2.fillStyle = i % 2 ? "#C8553D" : "#2F8F8A"; g2.beginPath(); g2.moveTo(x - 10, h * 0.74 - hh); g2.lineTo(x + ww / 2, h * 0.74 - hh - 45); g2.lineTo(x + ww + 10, h * 0.74 - hh); g2.fill();
            g2.fillStyle = "#FFF6E0"; g2.fillRect(x + ww * 0.3, h * 0.74 - hh * 0.6, ww * 0.25, hh * 0.25); }
          g2.fillStyle = "#FFFFFF"; [[200, 90], [700, 60], [880, 130]].forEach(([x, y]) => { g2.beginPath(); g2.ellipse(x, y, 70, 22, 0, 0, PI * 2); g2.ellipse(x + 40, y - 12, 40, 22, 0, 0, PI * 2); g2.fill(); }); });
        R.backdrop = G(F, new TH.PlaneGeometry(26, 13), new TH.MeshBasicMaterial({ map: bdTex, fog: false }), 0, 3.0, 9.5, { ry: PI, layer: 1 }); }

      // ---- lights
      const L1 = plight(g, "#FFD9A6", 11, 0, 2.55, 0.3), L2 = plight(g, "#FFE6C8", 11, 0.4, 2.7, 2.6), L3 = plight(g, "#FF9A4A", 4.5, -2.7, 1.5, -1.9);
      const anchors = { moSpot: A(CX, 0, -1.6), customerSpot: A(CX, 0, 1.3), register: A(CX + 1.0, 1.05, -0.25), oven1: A(CX - 2.7, 1.45, -2.3), oven2: A(CX + 2.7, 1.45, -2.3),
        menu: A(CX, 2.47, -3.42), counter: A(CX, 1.05, -0.2), deli: A(CX - 2.1, 1.05, -0.2), tipJar: A(CX + 2.35, 1.05, -0.12), door: A(CX + 2.5, 0, 3.0), table: A(CX - 3.4, 0.76, 2.3) };
      const occ = { axis: "z", a0: -0.6, a1: 0.2, b0: CX - 3.5, b1: CX + 3.5, y: 1.05 };
      function update(t, env) {
        const n = cl01(env.night || 0);
        L1.intensity = 7 + 6 * n; L2.intensity = 5 + 1.5 * n; const fl = flick(t, 0); L3.intensity = (2.5 + 3 * n) * (0.75 + 0.4 * fl);
        bulbM.emissiveIntensity = 0.45 + 0.9 * n; pend.forEach((s) => (s.material.opacity = 0.35 + 0.65 * n)); mPicL.emissiveIntensity = 0.4 + 0.6 * n;
        flames.forEach((f, i) => { const k = flick(t * 1.1, i * 1.7); f.scale.set(0.85 + 0.25 * k, f.userData.s * (0.7 + 0.6 * k), 0.85 + 0.25 * k); f.position.y = 1.3 + f.userData.hh * f.scale.y / 2; });
        fireGlow.material.opacity = 0.55 + 0.35 * fl; fireGlow.scale.setScalar(1.3 + 0.3 * fl);
        const k2 = cl01(env.oven2 || 0), bowK = cl01(env.oven2Bow || 0); o2.visible = k2 > 0.002;
        if (o2.visible) { const e = backOut(k2, 1.9); o2.position.y = (e - 1) * 1.6; const s = lerp(0.25, 1, e); o2.scale.set(s, s * (1 + 0.1 * Math.sin(k2 * PI) * (1 - k2)), s);
          bow.visible = bowK < 0.999; bow.scale.setScalar(1 - sstep(0, 1, bowK)); bow.position.y = 2.1 * sstep(0, 1, bowK) * 0;
          sparks.forEach((sp, i) => { const tw = Math.max(0, Math.sin(t * 5.2 + i * 1.9)); sp.material.opacity = tw * sstep(0.85, 1, k2) * (1 - bowK); sp.scale.setScalar(0.15 + 0.35 * tw); }); }
        R.backdrop.material.color.set("#FFFFFF").lerp(new TH.Color("#3A4A88"), n * 0.85);
      }
      const api = { anchors, occ, update, setPrice, setDrawer, setFrontVisible(v) { R.front = v; }, room: R };
      return api;
    })();

    // ================================================================= 2. CRUMB ISLAND BANK (400, 0, 0)
    const bank = (function () {
      const CX = 400, R = room(CX, { x0: -5, x1: 5, z0: -3.4, z1: 4.4, h: 4.2 }), g = R.g, W = R.W;
      const S = { vault: 0, lines: ["CRUMB ISLAND BANK", "ACCOUNT: MO", "BALANCE:  $62.00", ">"], cur: -1 };
      B(g, 10, 0.12, 7.8, texMat(texChecker("#F2E6C8", "#7FBDB2", 4, 23, true)), 0, -0.12, 0.5, { s: 2.4 });
      const panelTex = W3.tex(256, 256, (g2, w, h) => { const r = rng(15); g2.fillStyle = "#9A6A44"; g2.fillRect(0, 0, w, h); for (let k = 0; k < 40; k++) { g2.strokeStyle = `rgba(70,40,25,${0.1 + r() * 0.15})`; g2.lineWidth = 1.5; const y0 = r() * h; g2.beginPath(); for (let x = 0; x <= w; x += 8) g2.lineTo(x, y0 + Math.sin(x * 0.03 + k) * 3); g2.stroke(); }
        g2.fillStyle = "rgba(60,30,20,0.35)"; g2.fillRect(28, 30, w - 56, 6); g2.fillRect(28, 30, 6, h - 60); g2.fillStyle = "rgba(255,230,200,0.25)"; g2.fillRect(28, h - 36, w - 56, 6); g2.fillRect(w - 34, 30, 6, h - 60); g2.fillStyle = "rgba(255,230,200,0.08)"; g2.fillRect(40, 42, w - 80, h - 84); });
      const damask = W3.tex(256, 256, (g2, w, h) => { const r = rng(17); g2.fillStyle = "#9FD8C2"; g2.fillRect(0, 0, w, h); blot(g2, w, h, r, 30, ["255,255,255"], 20, 60, 0.04, 0.08); g2.strokeStyle = "rgba(255,255,255,0.4)"; g2.lineWidth = 3;
        for (let i = -1; i < 3; i++) { g2.beginPath(); g2.moveTo(i * 128, 0); g2.lineTo(i * 128 + 256, 256); g2.stroke(); g2.beginPath(); g2.moveTo(i * 128 + 256, 0); g2.lineTo(i * 128, 256); g2.stroke(); }
        g2.fillStyle = "rgba(47,143,138,0.35)"; [[0, 0], [128, 128], [256, 0], [0, 256], [256, 256], [128, 0], [0, 128], [256, 128], [128, 256]].forEach(([x, y], i) => { g2.beginPath(); if ((x + y) % 256 === 0) { g2.moveTo(x, y - 14); g2.lineTo(x + 9, y); g2.lineTo(x, y + 14); g2.lineTo(x - 9, y); } else { g2.arc(x, y, 6, 0, PI * 2); } g2.fill(); }); });
      const mPanel = texMat(panelTex), mDam = texMat(damask), mCeil = texMat(texPlaster("#F7EDD6", 63));
      wall(W.back, 10, 1.3, mPanel, 0, 0, -3.4, 0, 1.3); wall(W.back, 10, 2.9, mDam, 0, 1.3, -3.4, 0, 1.0);
      wall(W.left, 7.8, 1.3, mPanel, -5, 0, 0.5, PI / 2, 1.3); wall(W.left, 7.8, 2.9, mDam, -5, 1.3, 0.5, PI / 2, 1.0);
      wall(W.right, 7.8, 1.3, mPanel, 5, 0, 0.5, -PI / 2, 1.3); wall(W.right, 7.8, 2.9, mDam, 5, 1.3, 0.5, -PI / 2, 1.0);
      G(W.ceil, W3.uvScale(new TH.PlaneGeometry(10, 7.8), 5, 3.9), mCeil, 0, 4.2, 0.5, { rx: PI / 2 });
      MB(W.ceil, [[10, 0.22, 0.26, 0, 3.98, -1.3], [10, 0.22, 0.26, 0, 3.98, 1.3], [10, 0.22, 0.26, 0, 3.98, 3.0], [0.26, 0.22, 7.8, -2.5, 3.98, 0.5], [0.26, 0.22, 7.8, 2.5, 3.98, 0.5]], "#EADBB8");
      MB(g, [[10, 0.16, 0.06, 0, 0, -3.37], [0.06, 0.16, 7.8, -4.97, 0, 0.5], [0.06, 0.16, 7.8, 4.97, 0, 0.5], [10, 0.08, 0.1, 0, 1.28, -3.35], [0.1, 0.08, 7.8, -4.95, 1.28, 0.5], [0.1, 0.08, 7.8, 4.95, 1.28, 0.5]], "#6E4430");
      MB(g, [[10, 0.14, 0.12, 0, 4.06, -3.34], [0.12, 0.14, 7.8, -4.94, 4.06, 0.5], [0.12, 0.14, 7.8, 4.94, 4.06, 0.5], [10, 0.08, 0.2, 0, 3.98, -3.3], [0.2, 0.08, 7.8, -4.9, 3.98, 0.5], [0.2, 0.08, 7.8, 4.9, 3.98, 0.5]], "#FFF3D8");
      // raised wainscot panels on the back wall (real edges)
      MB(W.back, Array.from({ length: 8 }, (_, i) => [0.98, 0.8, 0.07, -4.4 + i * 1.257, 0.25, -3.37]), "#A87448");
      // ---- sign
      const signTex = textTex(1024, 192, (g2, w, h) => { g2.fillStyle = "#2F6F73"; g2.fillRect(0, 0, w, h); g2.strokeStyle = "#F2C14E"; g2.lineWidth = 6; g2.strokeRect(14, 14, w - 28, h - 28); g2.lineWidth = 2; g2.strokeRect(24, 24, w - 48, h - 48);
        g2.textAlign = "center"; g2.textBaseline = "middle"; g2.font = FONT(84); g2.fillStyle = "#1E4A48"; g2.fillText("CRUMB ISLAND BANK", w / 2 + 4, 78); g2.fillStyle = "#F6D77A"; g2.fillText("CRUMB ISLAND BANK", w / 2, 74);
        g2.font = FONT(38, 800); g2.fillStyle = "#FFF3D8"; g2.fillText("—  EST. 1902  —", w / 2, 146); });
      const sg = new TH.Group(); sg.position.set(-1.2, 3.0, -3.4); W.back.add(sg);
      B(sg, 4.5, 0.92, 0.07, "#7A4E32", 0, 0, 0.035); MB(sg, [[4.5, 0.07, 0.11, 0, 0.85, 0.055], [4.5, 0.07, 0.11, 0, 0, 0.055], [0.07, 0.92, 0.11, -2.215, 0, 0.055], [0.07, 0.92, 0.11, 2.215, 0, 0.055]], "#E3AE4E");
      G(sg, new TH.PlaneGeometry(4.36, 0.8), texMat(signTex, { emissive: new TH.Color("#FFFFFF"), emissiveMap: signTex, emissiveIntensity: 0.25 }), 0, 0.46, 0.075);
      // ---- vault (x = 2.8)
      const VX = 2.8, VY = 1.45, mSteel = texMat(texShiny("#93A2B6", 21)), mSteelD = "#6E7B8E";
      const ring = new TH.Shape(); ring.absarc(0, 0, 1.5, 0, PI * 2, false); const hole = new TH.Path(); hole.absarc(0, 0, 1.2, 0, PI * 2, true); ring.holes.push(hole);
      G(W.back, extrude(ring, 0.6, 40), mSteel, VX, VY, -3.4);
      inst(W.back, cyl(0.055, 0.055, 0.05, 10).rotateX(PI / 2), mat(mSteelD), Array.from({ length: 18 }, (_, i) => ({ p: [VX + Math.cos(i * PI / 9) * 1.35, VY + Math.sin(i * PI / 9) * 1.35, -2.78] })));
      MB(W.back, [[0.3, 0.38, 0.32, VX - 1.42, VY + 0.35, -2.95], [0.3, 0.38, 0.32, VX - 1.42, VY - 0.73, -2.95]], mSteelD);
      const vin = W3.tex(256, 256, (g2, w, h) => { const gr = g2.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, "#FFE7A0"); gr.addColorStop(0.6, "#E8A64A"); gr.addColorStop(1, "#8A4E3A"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
        g2.fillStyle = "rgba(122,78,50,0.8)"; for (let i = 0; i < 4; i++) g2.fillRect(0, 40 + i * 52, w, 6); g2.fillStyle = "rgba(255,240,190,0.6)"; for (let i = 0; i < 18; i++) g2.fillRect(20 + (i % 6) * 36, 12 + Math.floor(i / 6) * 52, 22, 26); }, { clamp: true });
      const vback = new TH.MeshBasicMaterial({ map: vin, color: new TH.Color("#FFFFFF") });
      G(W.back, new TH.CircleGeometry(1.2, 32), vback, VX, VY, -3.39);
      B(W.back, 1.9, 0.05, 0.22, "#7A4E32", VX, VY - 0.55, -3.28); B(W.back, 1.9, 0.05, 0.22, "#7A4E32", VX, VY + 0.25, -3.28);
      inst(W.back, new TH.BoxGeometry(0.2, 0.07, 0.1), W3.toon("#F2C14E", null, { emissive: new TH.Color("#B87A1A"), emissiveIntensity: 0.3 }), [[-0.5, 0], [-0.28, 0], [-0.06, 0], [-0.39, 1], [-0.17, 1], [-0.28, 2]].map(([x, l]) => ({ p: [VX + x, VY - 0.5 + 0.035 + l * 0.07, -3.27] })));
      inst(W.back, new TH.BoxGeometry(0.16, 0.06, 0.09), mat("#7DBA5A"), [[0.25, 0], [0.45, 0], [0.35, 1], [-0.3, 2], [-0.1, 2], [0.15, 2], [-0.2, 3]].map(([x, l]) => ({ p: [VX + x, (l < 2 ? VY - 0.5 + 0.03 + l * 0.06 : VY + 0.3 + 0.03 + (l - 2) * 0.06), -3.27] })));
      MG(W.back, [[new TH.SphereGeometry(0.14, 12, 8), VX + 0.5, VY + 0.42, -3.27, 0, 0, 0, 1, 1.05, 0.7], [new TH.ConeGeometry(0.05, 0.08, 8), VX + 0.5, VY + 0.58, -3.27]], "#D8C49A");
      const vglow = glow(W.back, "#FFC860", 2.6, VX, VY, -3.0);
      const vp = new TH.Group(); vp.position.set(VX - 1.2, VY, -2.8); W.back.add(vp);
      const vdoor = new TH.Group(); vdoor.position.set(1.2, 0, -0.2); vp.add(vdoor);
      const vfTex = W3.tex(512, 512, (g2, w, h) => { const gr = g2.createRadialGradient(w * 0.4, h * 0.35, 20, w / 2, h / 2, w / 2); gr.addColorStop(0, "#DCE4EE"); gr.addColorStop(1, "#98A6B8"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
        g2.strokeStyle = "rgba(70,80,100,0.35)"; for (let i = 1; i < 30; i++) { g2.lineWidth = i % 5 ? 1 : 4; g2.beginPath(); g2.arc(w / 2, h / 2, i * 8.5, 0, PI * 2); g2.stroke(); }
        g2.fillStyle = "rgba(255,255,255,0.35)"; g2.save(); g2.translate(w / 2, h / 2); g2.rotate(-0.7); g2.fillRect(-w, -60, w * 2, 18); g2.restore(); }, { clamp: true });
      const vdGeo = cyl(1.18, 1.18, 0.3, 40).rotateX(PI / 2);
      G(vdoor, vdGeo, [mSteel, texMat(vfTex), mSteel], 0, 0, 0);
      G(vdoor, new TH.TorusGeometry(0.95, 0.05, 6, 40), mSteelD, 0, 0, 0.16);
      inst(vdoor, cyl(0.06, 0.06, 0.06, 10).rotateX(PI / 2), mat("#C9D3DE"), Array.from({ length: 12 }, (_, i) => ({ p: [Math.cos(i * PI / 6) * 1.05, Math.sin(i * PI / 6) * 1.05, 0.17] })));
      const wheel = new TH.Group(); wheel.position.set(0, 0, 0.32); vdoor.add(wheel);
      G(wheel, new TH.TorusGeometry(0.38, 0.045, 8, 28), "#E3AE4E", 0, 0, 0);
      MG(wheel, [0, 1, 2].map((i) => [cyl(0.03, 0.03, 0.92, 8), 0, 0, 0, 0, 0, i * PI / 3]), "#E3AE4E"); MG(wheel, [0, 1, 2, 3, 4, 5].map((i) => [new TH.SphereGeometry(0.06, 8, 6), Math.cos(i * PI / 3) * 0.46, Math.sin(i * PI / 3) * 0.46, 0]), "#E3AE4E");
      G(wheel, cyl(0.1, 0.12, 0.14, 14).rotateX(PI / 2), "#C9A04A", 0, 0, -0.08);
      G(vdoor, cyl(0.13, 0.13, 0.08, 20).rotateX(PI / 2), "#5E6A7C", 0, 0.62, 0.17);
      function setVault(k) { S.vault = cl01(k); vp.rotation.y = -sstep(0, 1, S.vault) * 1.85; wheel.rotation.z = -sstep(0, 0.35, S.vault) * PI * 1.5; }
      setVault(0);
      // ---- clock above the vault
      const clk = new TH.Group(); clk.position.set(VX, 3.47, -3.4); W.back.add(clk);
      const clkTex = textTex(256, 256, (g2, w, h) => { g2.fillStyle = "#FFF6E0"; g2.beginPath(); g2.arc(w / 2, h / 2, w / 2, 0, PI * 2); g2.fill(); g2.fillStyle = INK; for (let i = 0; i < 12; i++) { const a = i * PI / 6; g2.save(); g2.translate(w / 2 + Math.sin(a) * 104, h / 2 - Math.cos(a) * 104); g2.rotate(a); g2.fillRect(-3, -10, 6, i % 3 ? 12 : 22); g2.restore(); }
        g2.font = FONT(34); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillStyle = "#2F6F73"; [["12", 0], ["3", 3], ["6", 6], ["9", 9]].forEach(([s, i]) => { const a = i * PI / 6; g2.fillText(s, w / 2 + Math.sin(a) * 74, h / 2 - Math.cos(a) * 74 + 2); }); }, { clamp: true });
      G(clk, cyl(0.4, 0.4, 0.08, 32).rotateX(PI / 2), [mat("#E3AE4E"), texMat(clkTex), mat("#E3AE4E")], 0, 0, 0.05, { rz: PI / 2 });
      G(clk, new TH.TorusGeometry(0.4, 0.04, 8, 32), "#C9A04A", 0, 0, 0.09);
      const handG = (len, wd, c) => { const hg = new TH.Group(); hg.position.z = 0.1; clk.add(hg); const geo = new TH.BoxGeometry(wd, len, 0.015); geo.translate(0, len / 2 - 0.04, 0); hg.add(new TH.Mesh(geo, mat(c))); return hg; };
      const hH = handG(0.2, 0.035, INK), hM = handG(0.3, 0.025, INK), hS = handG(0.32, 0.01, "#D9453A"); hS.position.z = 0.11; hM.position.z = 0.105;
      // ---- founder portrait (left of sign, low)
      { const pg = new TH.Group(); pg.position.set(-4.0, 1.5, -3.4); W.back.add(pg);
        const ptex = textTex(256, 320, (g2, w, h) => { const gr = g2.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h / 2, h * 0.6); gr.addColorStop(0, "#5FA8A0"); gr.addColorStop(1, "#24504E"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
          g2.fillStyle = "#3A4A6A"; g2.beginPath(); g2.ellipse(w / 2, h * 0.86, 90, 70, 0, PI, 0); g2.fill(); g2.fillStyle = "#FFFFFF"; g2.beginPath(); g2.ellipse(w / 2, h * 0.62, 62, 70, 0, 0, PI * 2); g2.fill(); g2.beginPath(); g2.arc(w / 2, h * 0.42, 48, 0, PI * 2); g2.fill();
          g2.fillStyle = "#F2A23A"; g2.beginPath(); g2.moveTo(w / 2 + 30, h * 0.42); g2.lineTo(w / 2 + 84, h * 0.45); g2.lineTo(w / 2 + 30, h * 0.48); g2.fill(); g2.fillStyle = INK; g2.beginPath(); g2.arc(w / 2 + 14, h * 0.4, 6, 0, PI * 2); g2.fill();
          g2.strokeStyle = "#E3AE4E"; g2.lineWidth = 4; g2.beginPath(); g2.arc(w / 2 + 14, h * 0.4, 14, 0, PI * 2); g2.stroke(); g2.beginPath(); g2.moveTo(w / 2 + 14, h * 0.4 + 14); g2.lineTo(w / 2 + 6, h * 0.55); g2.stroke();
          g2.fillStyle = "#2A2833"; g2.fillRect(w / 2 - 40, h * 0.22, 80, 16); g2.fillRect(w / 2 - 26, h * 0.06, 52, 60); g2.fillStyle = "#C8553D"; g2.fillRect(w / 2 - 26, h * 0.2, 52, 8);
          g2.fillStyle = "#D9453A"; g2.beginPath(); g2.moveTo(w / 2, h * 0.74); g2.lineTo(w / 2 - 20, h * 0.7); g2.lineTo(w / 2 - 20, h * 0.78); g2.closePath(); g2.moveTo(w / 2, h * 0.74); g2.lineTo(w / 2 + 20, h * 0.7); g2.lineTo(w / 2 + 20, h * 0.78); g2.fill(); });
        B(pg, 0.86, 1.06, 0.06, "#E3AE4E", 0, 0, 0.03); MB(pg, [[0.86, 0.06, 0.1, 0, 1.0, 0.05], [0.86, 0.06, 0.1, 0, 0, 0.05], [0.06, 1.06, 0.1, -0.4, 0, 0.05], [0.06, 1.06, 0.1, 0.4, 0, 0.05]], "#C9A04A");
        G(pg, new TH.PlaneGeometry(0.72, 0.9), texMat(ptex), 0, 0.53, 0.062);
        B(pg, 0.4, 0.08, 0.02, texMat(plate("FOUNDER", { w: 256, h: 64, size: 40, bg: "#E3AE4E", color: "#4A2E22", border: false })), 0, -0.14, 0.02); }
      // ---- side windows (arched), panes tint with night
      const paneTex = W3.tex(128, 256, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#7FB6EA"); gr.addColorStop(0.7, "#CDE6F6"); gr.addColorStop(1, "#FFE6C4"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); g2.fillStyle = "rgba(255,255,255,0.4)"; g2.save(); g2.rotate(-0.5); g2.fillRect(-40, 90, 300, 14); g2.restore(); });
      const mPane = new TH.MeshBasicMaterial({ map: paneTex, color: new TH.Color("#FFFFFF") });
      const archWin = (grp, x, z, ry) => { const wg = new TH.Group(); wg.position.set(x, 1.45, z); wg.rotation.y = ry; grp.add(wg);
        const pane = new TH.ShapeGeometry(archShape(1.1, 1.5), 16); const uv = pane.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + 0.55) / 1.1, uv.getY(i) / 2.05); G(wg, pane, mPane, 0, 0, 0.01);
        const fr = extrude(archShape(1.34, 1.62, 1.1, 1.5, 0.12), 0.1, 16); fr.translate(0, -0.12, 0); G(wg, fr, "#FFF3D8", 0, 0, 0);
        MB(wg, [[0.06, 2.05, 0.1, 0, 0, 0.06], [1.1, 0.06, 0.1, 0, 1.0, 0.06]], "#FFF3D8"); B(wg, 1.4, 0.07, 0.22, "#FFF3D8", 0, -0.16, 0.08); };
      archWin(W.left, -5, -1.4, PI / 2); archWin(W.left, -5, 2.6, PI / 2); archWin(W.right, 5, -0.9, -PI / 2); archWin(W.right, 5, 2.6, -PI / 2);
      // ---- columns
      const flute = W3.tex(256, 64, (g2, w, h) => { g2.fillStyle = "#F7EDD6"; g2.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { const gr = g2.createLinearGradient(i * 32, 0, i * 32 + 32, 0); gr.addColorStop(0, "rgba(150,120,90,0.35)"); gr.addColorStop(0.5, "rgba(255,255,255,0.2)"); gr.addColorStop(1, "rgba(150,120,90,0.1)"); g2.fillStyle = gr; g2.fillRect(i * 32, 0, 32, h); } });
      flute.repeat.set(2, 1);
      [-4.1, 4.1].forEach((x) => { MB(g, [[0.74, 0.26, 0.74, x, 0, 0.6], [0.62, 0.1, 0.62, x, 0.26, 0.6], [0.62, 0.1, 0.62, x, 3.78, 0.6], [0.76, 0.2, 0.76, x, 3.88, 0.6], [0.66, 0.12, 0.66, x, 4.08, 0.6]], "#F2E6C8");
        G(g, cyl(0.25, 0.28, 3.42, 16), texMat(flute), x, 0.36 + 1.71, 0.6); });
      // ---- plants, rope queue, runner
      makePlant(g, -4.4, -2.8, 1.25, 31, "#2F8F8A"); makePlant(g, 4.4, 1.6, 1.25, 33, "#2F8F8A");
      const runTex = W3.tex(128, 512, (g2, w, h) => { g2.fillStyle = "#B8324A"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#E3AE4E"; g2.fillRect(8, 0, 8, h); g2.fillRect(w - 16, 0, 8, h); g2.fillStyle = "rgba(255,255,255,0.08)"; for (let y = 0; y < h; y += 32) g2.fillRect(28, y + 8, w - 56, 14); });
      B(g, 1.5, 0.012, 4.7, texMat(runTex), 0.6, 0, 2.0);
      const posts = [[-2.9, 3.6], [-2.9, 1.9], [-1.5, 1.9], [-1.5, 3.6]];
      MG(g, posts.flatMap(([x, z]) => [[cyl(0.17, 0.19, 0.05, 16), x, 0.025, z], [cyl(0.025, 0.025, 0.9, 8), x, 0.47, z], [new TH.SphereGeometry(0.055, 10, 8), x, 0.95, z]]), "#E3AE4E");
      MG(g, [[0, 1], [1, 2]].map(([a, b]) => { const P = posts[a], Q2 = posts[b]; const c = new TH.QuadraticBezierCurve3(new TH.Vector3(P[0], 0.86, P[1]), new TH.Vector3((P[0] + Q2[0]) / 2, 0.5, (P[1] + Q2[1]) / 2), new TH.Vector3(Q2[0], 0.86, Q2[1])); return [new TH.TubeGeometry(c, 16, 0.028, 6, false), 0, 0, 0]; }), "#B8324A");

      // ---- Mr. Penny's desk (top 0.78, x -1.4..1.4, z -1.3..-0.5)
      const mDesk = texMat(texBoards("#8A5A3A", 6, 71, true, "#5A3A26"));
      B(g, 2.9, 0.06, 0.86, mDesk, 0, 0.72, -0.9, { s: 1.2 });
      B(g, 2.3, 0.006, 0.56, "#3F7F5E", 0.05, 0.78, -1.0);
      B(g, 0.8, 0.7, 0.78, mDesk, -1.0, 0.02, -0.9, { s: 1.2 }); B(g, 0.8, 0.7, 0.78, mDesk, 1.0, 0.02, -0.9, { s: 1.2 });
      B(g, 1.24, 0.5, 0.04, mDesk, 0, 0.22, -0.56, { s: 1.2 });
      B(g, 2.82, 0.05, 0.82, "#5A3A26", 0, 0, -0.9);
      MB(g, [[0.62, 0.5, 0.03, -1.0, 0.12, -0.5], [0.62, 0.5, 0.03, 1.0, 0.12, -0.5], [1.0, 0.34, 0.03, 0, 0.3, -0.53]], "#A87448");
      MB(g, [-1.0, 1.0].flatMap((x) => [[0.66, 0.2, 0.03, x, 0.48, -1.3], [0.66, 0.2, 0.03, x, 0.26, -1.3], [0.66, 0.18, 0.03, x, 0.05, -1.3]]), "#A87448");
      MG(g, [-1.0, 1.0].flatMap((x) => [0.58, 0.36, 0.14].map((y) => [new TH.SphereGeometry(0.025, 8, 6), x, y, -1.33])), "#E3AE4E");
      // CRT terminal angled to the customer camera
      const term = new TH.Group(); term.position.set(-0.72, 0.786, -0.95); term.rotation.y = 0.52; g.add(term);
      const beige = texMat(texPlaster("#E9DDC2", 3));
      B(term, 0.36, 0.04, 0.3, "#CFC2A4", 0, 0, -0.05);
      B(term, 0.52, 0.46, 0.32, beige, 0, 0.04, 0.0, { s: 0.6 });
      B(term, 0.4, 0.34, 0.26, beige, 0, 0.09, -0.27, { s: 0.6 });
      MB(term, [[0.46, 0.04, 0.03, 0, 0.415, 0.17], [0.46, 0.04, 0.03, 0, 0.135, 0.17], [0.04, 0.32, 0.03, -0.215, 0.135, 0.17], [0.04, 0.32, 0.03, 0.215, 0.135, 0.17]], "#A89A7C");
      const scrTex = W3.tex(512, 384, () => {}, { clamp: true });
      const scrMat = new TH.MeshBasicMaterial({ map: scrTex });
      function drawScreen(on) { const c = scrTex.image, g2 = c.getContext("2d"), w = c.width, h = c.height;
        const gr = g2.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.62); gr.addColorStop(0, "#1C3A2E"); gr.addColorStop(1, "#0E1E18"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
        const n = Math.max(1, S.lines.length), fs = Math.min(46, Math.floor(255 / n / 1.42 * 1.3)); g2.font = MONO(fs); g2.textBaseline = "middle"; g2.textAlign = "left";
        let lx = 40, ly = 60; g2.shadowColor = "rgba(255,190,80,0.85)"; g2.shadowBlur = 12; g2.fillStyle = "#FFC45A";
        S.lines.forEach((s, i) => { ly = 84 + i * (fs * 1.42); g2.fillText(String(s), 34, ly); lx = 34 + g2.measureText(String(s)).width; });
        if (on) g2.fillRect(lx + 8, ly - fs * 0.45, fs * 0.55, fs * 0.9);
        g2.shadowBlur = 0; g2.fillStyle = "rgba(0,0,0,0.22)"; for (let y = 0; y < h; y += 4) g2.fillRect(0, y, w, 2);
        const v = g2.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(10,20,16,0.6)"); g2.fillStyle = v; g2.fillRect(0, 0, w, h);
        g2.fillStyle = "rgba(255,255,255,0.08)"; g2.beginPath(); g2.ellipse(w * 0.3, h * 0.2, w * 0.25, h * 0.08, -0.3, 0, PI * 2); g2.fill(); scrTex.needsUpdate = true; }
      drawScreen(true);
      G(term, new TH.PlaneGeometry(0.39, 0.29), scrMat, 0, 0.29, 0.162);
      B(term, 0.16, 0.012, 0.01, "#2A2833", -0.1, 0.075, 0.161); B(term, 0.025, 0.025, 0.01, glowMat("#7DFF9A", 1.0), 0.19, 0.07, 0.162);
      const keyTex = W3.tex(256, 96, (g2, w, h) => { g2.fillStyle = "#CFC2A4"; g2.fillRect(0, 0, w, h); for (let j = 0; j < 4; j++) for (let i = 0; i < 12; i++) { g2.fillStyle = j === 3 && i > 2 && i < 9 ? "#F2E9D4" : (i + j) % 7 ? "#F2E9D4" : "#E8A64A"; g2.fillRect(6 + i * 20.5, 6 + j * 22, 17, 18); }
        g2.fillStyle = "#F2E9D4"; g2.fillRect(70, 72, 120, 18); });
      B(term, 0.48, 0.035, 0.17, [mat("#CFC2A4"), mat("#CFC2A4"), texMat(keyTex), mat("#CFC2A4"), mat("#CFC2A4"), mat("#CFC2A4")], 0.02, -0.006, 0.34);
      function setScreen(lines) { S.lines = (Array.isArray(lines) ? lines : [String(lines)]).slice(0, 6); S.cur = -1; drawScreen(true); S.cur = 1; }
      // nameplate, papers, pen, stamp, banker's lamp
      const np = textTex(512, 128, (g2, w, h) => { g2.fillStyle = "#2F6F73"; g2.fillRect(0, 0, w, h); g2.strokeStyle = "#F2C14E"; g2.lineWidth = 8; g2.strokeRect(8, 8, w - 16, h - 16); g2.fillStyle = "#F6D77A"; g2.font = FONT(72); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("MR. PENNY", w / 2, h / 2 + 4); });
      B(g, 0.5, 0.03, 0.1, "#5A3A26", 0.32, 0.786, -0.62); B(g, 0.46, 0.115, 0.03, [mat("#E3AE4E"), mat("#E3AE4E"), mat("#E3AE4E"), mat("#E3AE4E"), texMat(np), mat("#E3AE4E")], 0.32, 0.8, -0.625, { rx: -0.3 });
      const paperTex = W3.tex(128, 176, (g2, w, h) => { g2.fillStyle = "#FBF6EA"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#2F6F73"; g2.fillRect(10, 10, 60, 10); g2.fillStyle = "rgba(60,60,80,0.4)"; for (let i = 0; i < 9; i++) g2.fillRect(10, 34 + i * 14, i % 3 === 2 ? 60 : 104, 4); g2.fillStyle = "rgba(60,60,80,0.6)"; g2.fillRect(60, 160, 56, 3); });
      const mPaper = texMat(paperTex); [[0.25, -1.02, 0.15, 0], [0.3, -0.98, -0.2, 1], [0.45, -1.14, 0.4, 2]].forEach(([x, z, ry, i]) => B(g, 0.21, 0.003, 0.29, mPaper, x, 0.786 + i * 0.004, z, { ry }));
      G(g, cyl(0.045, 0.05, 0.05, 12), "#2A2833", -0.05, 0.811, -1.15); G(g, cyl(0.008, 0.008, 0.16, 6), "#E3AE4E", -0.03, 0.88, -1.15, { rz: -0.4 });
      const stamp = new TH.Group(); stamp.position.set(0.95, 0.786, -0.95); g.add(stamp);
      B(stamp, 0.2, 0.025, 0.14, "#2F6F73", -0.2, 0, 0.05); B(stamp, 0.16, 0.006, 0.1, "#D9453A", -0.2, 0.025, 0.05);
      B(stamp, 0.16, 0.035, 0.12, "#D9453A", 0, 0, 0); B(stamp, 0.17, 0.06, 0.13, "#8A5A3A", 0, 0.035, 0); G(stamp, cyl(0.03, 0.035, 0.14, 10), "#A87448", 0, 0.165, 0); G(stamp, new TH.SphereGeometry(0.065, 12, 10), "#D9453A", 0, 0.27, 0);
      function setStamp(v) { stamp.visible = !!v; }
      const lampG = new TH.Group(); lampG.position.set(1.2, 0.786, -1.12); g.add(lampG);
      G(lampG, cyl(0.09, 0.1, 0.03, 16), "#E3AE4E", 0, 0.015, 0); G(lampG, cyl(0.015, 0.015, 0.3, 8), "#E3AE4E", 0, 0.18, 0);
      G(lampG, new TH.CylinderGeometry(0.11, 0.11, 0.38, 16, 1, false, 0, PI).rotateZ(PI / 2).rotateX(0), W3.toon("#2F8F5A", null, { side: TH.DoubleSide, emissive: new TH.Color("#1E6A44"), emissiveIntensity: 0.2 }), 0, 0.36, 0, { ry: -0.4 });
      const lampBulb = glowMat("#FFE6A0", 0.5); G(lampG, new TH.BoxGeometry(0.3, 0.02, 0.12), lampBulb, 0, 0.35, 0, { ry: -0.4 }); const lampGlow = glow(lampG, "#FFD890", 0.7, 0, 0.3, 0);
      // customer chair
      const chg = new TH.Group(); chg.position.set(0.7, 0, -0.05); g.add(chg);
      MB(chg, [[0.05, 0.45, 0.05, -0.22, 0, -0.22], [0.05, 0.45, 0.05, 0.22, 0, -0.22], [0.05, 1.05, 0.05, -0.22, 0, 0.22], [0.05, 1.05, 0.05, 0.22, 0, 0.22], [0.52, 0.06, 0.52, 0, 0.42, 0], [0.5, 0.06, 0.05, 0, 0.99, 0.22]], "#6E4430");
      MB(chg, [[0.48, 0.07, 0.48, 0, 0.48, 0], [0.42, 0.38, 0.05, 0, 0.58, 0.2]], "#B8324A");
      // pendant globes
      const globeM = glowMat("#FFF1CF", 0.5), gl = [];
      [[-1.3, 0.5], [1.7, 0.5]].forEach(([x, z]) => { B(g, 0.02, 0.6, 0.02, "#3A3440", x, 3.6, z); G(g, cyl(0.08, 0.1, 0.08, 12), "#E3AE4E", x, 3.56, z); G(g, new TH.SphereGeometry(0.22, 16, 12), globeM, x, 3.34, z); gl.push(glow(g, "#FFE2A8", 1.4, x, 3.34, z)); });
      // front wall with double door
      { const F = W.front, z = 4.4; [[4.2, 4.2, -2.9, 0], [4.2, 4.2, 2.9, 0], [1.6, 1.6, 0, 2.6]].forEach(([w, h, x, y]) => wall(F, w, h, mDam, x, y, z, PI, 1.0));
        MB(F, [[0.14, 2.7, 0.2, -0.87, 0, z], [0.14, 2.7, 0.2, 0.87, 0, z], [1.88, 0.14, 0.2, 0, 2.6, z]], "#E3AE4E");
        MB(F, [[0.78, 2.56, 0.07, -0.4, 0, z - 0.02], [0.78, 2.56, 0.07, 0.4, 0, z - 0.02]], "#7A4E32");
        MB(F, [[0.5, 1.2, 0.03, -0.4, 1.1, z - 0.06], [0.5, 1.2, 0.03, 0.4, 1.1, z - 0.06]], mPane); MB(F, [[0.04, 0.4, 0.06, -0.07, 1.0, z - 0.08], [0.04, 0.4, 0.06, 0.07, 1.0, z - 0.08]], "#E3AE4E"); }
      // lights
      const L1 = plight(g, "#FFE8C8", 13, 0.3, 3.4, 1.4), L2 = plight(g, "#FFD38A", 5, 1.0, 1.4, -0.7), L3 = plight(g, "#FFC860", 5, VX, VY, -3.15);
      const scrW = new TH.Vector3(0, 0.29, 0.162); g.updateMatrixWorld(true); scrW.applyMatrix4(term.matrixWorld);
      const anchors = { pennySpot: A(CX, 0, -1.75), customerSpot: A(CX + 0.7, 0, 0.35), screen: A(scrW.x, scrW.y, scrW.z), vault: A(CX + VX, VY, -2.8), desk: A(CX, 0.78, -0.9), chair: A(CX + 0.7, 0.48, -0.05),
        stamp: A(CX + 0.95, 0.786, -0.95), sign: A(CX - 1.2, 3.46, -3.32), nameplate: A(CX + 0.32, 0.86, -0.6), clock: A(CX + VX, 3.42, -3.3), door: A(CX, 0, 4.0) };
      const occ = { axis: "z", a0: -1.33, a1: -0.47, b0: CX - 1.45, b1: CX + 1.45, y: 0.78 };
      function update(t, env) {
        const n = cl01(env.night || 0);
        L1.intensity = 9 + 10 * n; L2.intensity = 1.2 + 3 * n; L3.intensity = 7 * sstep(0, 0.4, S.vault) * (0.9 + 0.1 * Math.sin(t * 2.3));
        globeM.emissiveIntensity = 0.5 + 0.7 * n; gl.forEach((s) => (s.material.opacity = 0.35 + 0.6 * n)); lampBulb.emissiveIntensity = 0.6 + 0.6 * n; lampGlow.material.opacity = 0.4 + 0.5 * n;
        vglow.material.opacity = sstep(0.05, 0.6, S.vault) * 0.9; vback.color.setScalar(0.35 + 0.65 * sstep(0, 0.5, S.vault));
        mPane.color.set("#FFFFFF").lerp(new TH.Color("#2A3A78"), n * 0.85);
        const on = Math.floor(t * 2) % 2 === 0 ? 1 : 0; if (on !== S.cur) { S.cur = on; drawScreen(!!on); }
        const sec = Math.floor(t), mins = 9 * 60 + 41 + t / 60; hS.rotation.z = -sec * PI / 30; hM.rotation.z = -(mins % 60) * PI / 30; hH.rotation.z = -((mins / 60) % 12) * PI / 6;
      }
      return { anchors, occ, update, setVault, setScreen, setStamp, setFrontVisible(v) { R.front = v; }, room: R };
    })();

    // ================================================================= 3. ANA'S APARTMENT (500, 0, 0)
    const apt = (function () {
      const CX = 500, R = room(CX, { x0: -3, x1: 3, z0: -2.5, z1: 2.5, h: 3.0 }), g = R.g, W = R.W;
      const S = { bills: 0.6, sky: 0, skyManual: false, skyDrawn: -1 };
      B(g, 6, 0.1, 5, texMat(texBoards("#B98258", 6, 101, true)), 0, -0.1, 0, { s: 1.4 });
      const paper = W3.tex(256, 256, (g2, w, h) => { const r = rng(55); g2.fillStyle = "#F6DE96"; g2.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { g2.fillStyle = "rgba(255,248,225,0.55)"; g2.fillRect(i * 64 + 8, 0, 22, h); }
        for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const x = i * 64 + 52, y = j * 64 + 20 + (i % 2) * 32; g2.fillStyle = "rgba(244,162,140,0.75)"; for (let k = 0; k < 5; k++) { g2.beginPath(); g2.arc(x + Math.cos(k * 1.256) * 5, y + Math.sin(k * 1.256) * 5, 3.5, 0, PI * 2); g2.fill(); } g2.fillStyle = "#E3AE4E"; g2.beginPath(); g2.arc(x, y, 2.5, 0, PI * 2); g2.fill(); }
        speck(g2, w, h, r, 80, "120,80,40"); });
      const mPaperW = texMat(paper), mLilac = texMat(texPlaster("#C7B3E6", 57)), mCeil = texMat(texPlaster("#F7EDD6", 59));
      wall(W.back, 6, 3, mPaperW, 0, 0, -2.5, 0, 0.9);
      wall(W.left, 5, 3, mLilac, -3, 0, 0, PI / 2, 2); wall(W.right, 5, 3, mLilac, 3, 0, 0, -PI / 2, 2);
      G(W.ceil, W3.uvScale(new TH.PlaneGeometry(6, 5), 3, 2.5), mCeil, 0, 3.0, 0, { rx: PI / 2 });
      MB(g, [[6, 0.13, 0.04, 0, 0, -2.48], [0.04, 0.13, 5, -2.98, 0, 0], [0.04, 0.13, 5, 2.98, 0, 0], [6, 0.1, 0.08, 0, 2.9, -2.46], [0.08, 0.1, 5, -2.96, 2.9, 0], [0.08, 0.1, 5, 2.96, 2.9, 0]], "#FFF6E6");
      // ---- window with painted sky (setWindowSky)
      const skyTex = W3.tex(384, 384, () => {}, { clamp: true });
      function drawSky(k) { const c = skyTex.image, g2 = c.getContext("2d"), w = c.width, h = c.height, r = rng(8);
        let gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#7FB6EA"); gr.addColorStop(0.45, "#F7C8B4"); gr.addColorStop(0.68, "#FFDDB0"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
        g2.fillStyle = "#FFE9A8"; g2.beginPath(); g2.arc(w * 0.68, h * 0.66, 34, 0, PI * 2); g2.fill(); g2.fillStyle = "rgba(255,240,200,0.4)"; g2.beginPath(); g2.arc(w * 0.68, h * 0.66, 56, 0, PI * 2); g2.fill();
        g2.globalAlpha = k; gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#0B1030"); gr.addColorStop(0.5, "#1C2A5A"); gr.addColorStop(0.75, "#3A3E72"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h);
        for (let i = 0; i < 60; i++) { g2.fillStyle = `rgba(255,255,240,${0.4 + r() * 0.6})`; const s = 1 + r() * 2.2; g2.fillRect(r() * w, r() * h * 0.62, s, s); }
        g2.fillStyle = "rgba(255,248,220,0.18)"; g2.beginPath(); g2.arc(w * 0.3, h * 0.24, 54, 0, PI * 2); g2.fill(); g2.fillStyle = "#FFF4D6"; g2.beginPath(); g2.arc(w * 0.3, h * 0.24, 34, 0, PI * 2); g2.fill();
        g2.fillStyle = "rgba(200,190,170,0.55)"; [[-10, -6, 7], [8, 10, 5], [12, -12, 4]].forEach(([x, y, rr]) => { g2.beginPath(); g2.arc(w * 0.3 + x, h * 0.24 + y, rr, 0, PI * 2); g2.fill(); });
        g2.globalAlpha = 1;
        const sea = lerpC("#2FA7B8", "#1A2A5A", k); g2.fillStyle = sea; g2.fillRect(0, h * 0.74, w, h * 0.26); g2.fillStyle = lerpC("#FFE9C0", "#8A90C0", k); for (let i = 0; i < 7; i++) g2.fillRect(w * 0.5 + (r() - 0.5) * 160, h * 0.77 + i * 9, 30 + r() * 50, 3);
        const sil = lerpC("#D69A8E", "#1E2244", k), win = lerpC("#FFF3D8", "#FFD27A", k), r2 = rng(3);
        for (let i = 0; i < 6; i++) { const x = -10 + i * 72 + r2() * 20, bw = 54 + r2() * 20, bh = 40 + r2() * 50; g2.fillStyle = sil; g2.fillRect(x, h * 0.86 - bh, bw, bh + h * 0.2); g2.beginPath(); g2.moveTo(x - 6, h * 0.86 - bh); g2.lineTo(x + bw / 2, h * 0.86 - bh - 22); g2.lineTo(x + bw + 6, h * 0.86 - bh); g2.fill();
          if (k > 0.3) { g2.fillStyle = win; g2.globalAlpha = (k - 0.3) / 0.7; for (let j = 0; j < 2; j++) if (r2() < 0.7) g2.fillRect(x + 10 + j * 22, h * 0.86 - bh + 12, 12, 12); g2.globalAlpha = 1; } }
        g2.fillStyle = sil; g2.save(); g2.translate(w * 0.86, h * 0.86); g2.fillRect(-4, -110, 8, 110); for (let a = 0; a < 6; a++) { g2.save(); g2.translate(0, -110); g2.rotate(-PI / 2 + (a - 2.5) * 0.5); g2.beginPath(); g2.ellipse(32, 0, 36, 8, 0, 0, PI * 2); g2.fill(); g2.restore(); } g2.restore();
        skyTex.needsUpdate = true; S.skyDrawn = k; }
      function lerpC(a, b, k) { return "#" + new TH.Color(a).lerp(new TH.Color(b), k).getHexString(); }
      drawSky(0);
      const winM = new TH.MeshBasicMaterial({ map: skyTex });
      G(W.back, new TH.PlaneGeometry(1.3, 1.3), winM, 0, 1.8, -2.49);
      MB(W.back, [[1.5, 0.1, 0.12, 0, 2.45, -2.46], [0.1, 1.3, 0.12, -0.7, 1.15, -2.46], [0.1, 1.3, 0.12, 0.7, 1.15, -2.46], [0.06, 1.3, 0.1, 0, 1.15, -2.44], [1.3, 0.06, 0.1, 0, 1.77, -2.44], [1.62, 0.07, 0.26, 0, 1.08, -2.38], [1.3, 0.12, 0.04, 0, 0.96, -2.48]], "#FFF6E6");
      glassPane(W.back, 1.3, 1.3, 0, 1.8, -2.45);
      const curtain = (x) => { const geo = new TH.PlaneGeometry(0.5, 1.8, 12, 1), P = geo.attributes.position; for (let i = 0; i < P.count; i++) P.setZ(i, Math.sin((P.getX(i) / 0.5 + 0.5) * PI * 5) * 0.035); geo.computeVertexNormals(); return G(W.back, geo, W3.toon("#F4A28C", null, { side: TH.DoubleSide }), x, 1.75, -2.36); };
      curtain(-0.98); curtain(0.98);
      G(W.back, cyl(0.02, 0.02, 2.5, 8).rotateZ(PI / 2), "#C9A04A", 0, 2.66, -2.36); MG(W.back, [[new TH.SphereGeometry(0.04, 10, 8), -1.27, 2.66, -2.36], [new TH.SphereGeometry(0.04, 10, 8), 1.27, 2.66, -2.36]], "#C9A04A");
      G(W.back, cyl(0.06, 0.05, 0.1, 10), "#F6D77A", 0.45, 1.2, -2.36); G(W.back, new TH.CapsuleGeometry(0.035, 0.08, 4, 8), "#6FB04E", 0.45, 1.31, -2.36);
      // calendar + photo
      const calTex = textTex(256, 352, (g2, w, h) => { g2.fillStyle = "#FFFDF4"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#8EC3E8"; g2.fillRect(0, 0, w, 120); g2.fillStyle = "#F2D9A0"; g2.fillRect(0, 92, w, 28); g2.fillStyle = "#2FA7B8"; g2.fillRect(0, 76, w, 18);
        g2.fillStyle = "#7DBA5A"; g2.save(); g2.translate(70, 92); g2.fillRect(-3, -60, 6, 60); for (let a = 0; a < 5; a++) { g2.save(); g2.translate(0, -60); g2.rotate(-PI / 2 + (a - 2) * 0.6); g2.beginPath(); g2.ellipse(22, 0, 24, 6, 0, 0, PI * 2); g2.fill(); g2.restore(); } g2.restore();
        g2.fillStyle = "#C8553D"; g2.font = FONT(34); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("NOVEMBER", w / 2, 146);
        g2.strokeStyle = "rgba(60,60,80,0.35)"; g2.lineWidth = 2; for (let j = 0; j < 5; j++) for (let i = 0; i < 7; i++) g2.strokeRect(10 + i * 34, 170 + j * 34, 34, 34);
        g2.font = FONT(14, 700); g2.fillStyle = "rgba(60,60,80,0.7)"; for (let d = 1; d <= 30; d++) { const i = (d + 5) % 7, j = Math.floor((d + 5) / 7); g2.fillText(String(d), 22 + i * 34, 180 + j * 34); }
        g2.strokeStyle = "#D9453A"; g2.lineWidth = 4; g2.beginPath(); g2.ellipse(10 + 6 * 34 + 17, 170 + 17, 18, 15, 0.2, 0, PI * 2); g2.stroke(); g2.beginPath(); g2.ellipse(10 + 3 * 34 + 17, 170 + 2 * 34 + 17, 18, 15, -0.2, 0, PI * 2); g2.stroke();
        g2.fillStyle = "#D9453A"; g2.font = FONT(22); g2.fillText("RENT!", 10 + 6 * 34 + 10, 168 - 14); });
      B(W.back, 0.42, 0.58, 0.012, texMat(calTex), -1.65, 1.35, -2.49); G(W.back, cyl(0.012, 0.012, 0.03, 6).rotateX(PI / 2), "#7A7A8A", -1.65, 1.96, -2.47);
      const phTex = W3.tex(256, 200, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#8EC3E8"); gr.addColorStop(0.6, "#FFE6C4"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); g2.fillStyle = "#2FA7B8"; g2.fillRect(0, h * 0.6, w, h * 0.15); g2.fillStyle = "#F2D9A0"; g2.fillRect(0, h * 0.75, w, h * 0.25);
        g2.fillStyle = "#F6D77A"; g2.beginPath(); g2.arc(w * 0.78, h * 0.25, 22, 0, PI * 2); g2.fill();
        [[0.38, "#3FA7A0", "#5A3A2A"], [0.58, "#E8834A", "#3A2A22"]].forEach(([x, c, hc]) => { g2.fillStyle = c; g2.fillRect(w * x - 14, h * 0.55, 28, 50); g2.fillStyle = "#F1EBDD"; g2.beginPath(); g2.arc(w * x, h * 0.47, 17, 0, PI * 2); g2.fill(); g2.fillStyle = hc; g2.beginPath(); g2.arc(w * x, h * 0.44, 17, PI, 0); g2.fill(); });
        g2.fillStyle = "#E85B4A"; g2.beginPath(); g2.arc(w * 0.48 - 5, h * 0.28, 7, 0, PI * 2); g2.arc(w * 0.48 + 5, h * 0.28, 7, 0, PI * 2); g2.fill(); g2.beginPath(); g2.moveTo(w * 0.48 - 12, h * 0.3); g2.lineTo(w * 0.48, h * 0.4); g2.lineTo(w * 0.48 + 12, h * 0.3); g2.fill(); });
      MB(W.back, [[0.58, 0.06, 0.05, 1.65, 2.06, -2.475], [0.58, 0.06, 0.05, 1.65, 1.6, -2.475], [0.06, 0.52, 0.05, 1.39, 1.6, -2.475], [0.06, 0.52, 0.05, 1.91, 1.6, -2.475]], "#C99A66");
      B(W.back, 0.5, 0.44, 0.01, "#FFF6E6", 1.65, 1.62, -2.495); G(W.back, new TH.PlaneGeometry(0.42, 0.33), texMat(phTex), 1.65, 1.84, -2.488);
      // ---- rug, table, chair
      const rugTex = W3.tex(256, 192, (g2, w, h) => { g2.fillStyle = "#C7B3E6"; g2.fillRect(0, 0, w, h); g2.fillStyle = "#F4A28C"; g2.fillRect(12, 12, w - 24, h - 24); g2.fillStyle = "#F6E6C8"; g2.fillRect(22, 22, w - 44, h - 44); g2.fillStyle = "#9FD8C2"; for (let i = 0; i < 6; i++) g2.fillRect(40 + i * 32, 30, 14, h - 60); g2.fillStyle = "#F4A28C"; for (let i = 0; i < 6; i++) g2.fillRect(40 + i * 32 + 14, 30, 4, h - 60); });
      B(g, 2.4, 0.012, 1.8, texMat(rugTex), 0, 0, -0.55);
      const mTab = texMat(texBoards("#D8B07A", 5, 111, true, "#9A6A44"));
      B(g, 1.2, 0.05, 0.8, mTab, 0, 0.7, -0.6, { s: 1.2 });
      MB(g, [[0.07, 0.7, 0.07, -0.52, 0, -0.93], [0.07, 0.7, 0.07, 0.52, 0, -0.93], [0.07, 0.7, 0.07, -0.52, 0, -0.27], [0.07, 0.7, 0.07, 0.52, 0, -0.27], [1.04, 0.08, 0.03, 0, 0.62, -0.27], [1.04, 0.08, 0.03, 0, 0.62, -0.93], [0.03, 0.08, 0.6, -0.52, 0.62, -0.6], [0.03, 0.08, 0.6, 0.52, 0.62, -0.6]], "#C99A66");
      const ch = new TH.Group(); ch.position.set(-0.5, 0, -1.4); ch.rotation.y = 0.35; g.add(ch);
      MB(ch, [[0.04, 0.44, 0.04, -0.18, 0, 0.18], [0.04, 0.44, 0.04, 0.18, 0, 0.18], [0.04, 0.95, 0.04, -0.18, 0, -0.18], [0.04, 0.95, 0.04, 0.18, 0, -0.18], [0.42, 0.04, 0.42, 0, 0.44, 0], [0.4, 0.06, 0.03, 0, 0.88, -0.18], [0.03, 0.36, 0.02, -0.08, 0.5, -0.18], [0.03, 0.36, 0.02, 0.0, 0.5, -0.18], [0.03, 0.36, 0.02, 0.08, 0.5, -0.18]], "#5FB8A4");
      B(ch, 0.36, 0.04, 0.36, "#F4A28C", 0, 0.48, 0.01);
      // ---- bills (atlas) — setBills(k): count + messiness
      const BILLS = [["RENT DUE", "OVERDUE", "#C8553D", "$1,250.00"], ["ELECTRIC", "OVERDUE", "#E8A03A", "$86.40"], ["CARD STATEMENT", "PAST DUE", "#2F6F73", "$2,318.77"], ["WATER", "DUE", "#2FA7B8", "$41.10"],
        ["PHONE", "OVERDUE", "#7A5AB0", "$64.99"], ["INTERNET", "DUE", "#3A8F5A", "$59.00"], ["CAR INSURANCE", "FINAL NOTICE", "#C8553D", "$310.00"], ["RENT", "LATE FEE", "#C8553D", "$75.00"],
        ["GAS", "OVERDUE", "#E8834A", "$38.25"], ["CARD STATEMENT", "MIN. DUE", "#2F6F73", "$35.00"], ["MEDICAL", "DUE", "#5A7AB0", "$180.00"], ["STREAMING", "OVERDUE", "#B8324A", "$15.99"]];
      // messy layout: the four headline bills fan out in a back row, the rest pile up in front of them
      const MESSY = [[-0.38, -0.8, 0.18], [-0.13, -0.8, -0.12], [0.12, -0.8, 0.08], [0.38, -0.8, -0.22], [-0.22, -0.48, 0.5], [0.2, -0.5, -0.45], [-0.05, -0.46, 0.15], [0.1, -0.42, -0.9], [-0.15, -0.52, -0.7], [0.25, -0.44, 0.3], [0.0, -0.5, 1.1], [-0.02, -0.4, -0.25]];
      const atlas = textTex(1024, 1024, (g2, w, h) => { g2.fillStyle = "#FBF6EA"; g2.fillRect(0, 0, w, h);
        BILLS.forEach(([title, stampT, col, amt], i) => { const x = (i % 4) * 256, y = Math.floor(i / 4) * 340, bg = ["#FBF6EA", "#F8ECE4", "#EEF5EE", "#FBF1D8"][i % 4]; g2.save(); g2.beginPath(); g2.rect(x, y, 256, 340); g2.clip();
          g2.fillStyle = bg; g2.fillRect(x, y, 256, 340); g2.fillStyle = col; g2.fillRect(x, y, 256, 58); g2.fillStyle = "#FFFFFF"; g2.font = FONT(title.length > 9 ? 25 : 34); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(title, x + 128, y + 31);
          g2.fillStyle = "rgba(60,60,80,0.45)"; for (let k = 0; k < 7; k++) g2.fillRect(x + 18, y + 80 + k * 18, k % 3 === 2 ? 120 : 210, 6);
          g2.fillStyle = "rgba(60,60,80,0.85)"; g2.font = FONT(22, 800); g2.textAlign = "left"; g2.fillText("AMOUNT DUE", x + 18, y + 228); g2.textAlign = "right"; g2.font = FONT(30); g2.fillText(amt, x + 238, y + 262); g2.fillRect(x + 18, y + 244, 220, 2);
          g2.translate(x + 128, y + 168); g2.rotate(-0.22 + (i % 3) * 0.1); g2.strokeStyle = "rgba(217,69,58,0.92)"; g2.fillStyle = "rgba(217,69,58,0.92)"; g2.lineWidth = 7; g2.font = FONT(stampT.length > 8 ? 30 : 44); g2.textAlign = "center"; const tw = g2.measureText(stampT).width;
          g2.strokeRect(-tw / 2 - 14, -30, tw + 28, 60); g2.lineWidth = 2; g2.strokeRect(-tw / 2 - 8, -24, tw + 16, 48); g2.fillText(stampT, 0, 3); g2.restore(); }); });
      const mBill = texMat(atlas), billGeos = BILLS.map((_, i) => { const geo = new TH.BoxGeometry(0.21, 0.004, 0.28), uv = geo.attributes.uv; const u0 = (i % 4) * 0.25, v1 = 1 - Math.floor(i / 4) * (340 / 1024), v0 = v1 - 340 / 1024;
        for (let j = 0; j < uv.count; j++) { const f = Math.floor(j / 4); if (f === 2) uv.setXY(j, u0 + uv.getX(j) * 0.25, v0 + uv.getY(j) * (v1 - v0)); else uv.setXY(j, 0.999, 0.001); } return geo; });
      const bills = [], rb = rng(42);
      BILLS.forEach((_, i) => { const m = new TH.Mesh(billGeos[i], mBill); g.add(m);
        bills.push({ m, neat: { x: (rb() - 0.5) * 0.025, z: -0.6 + (rb() - 0.5) * 0.025, ry: (rb() - 0.5) * 0.1 }, messy: { x: MESSY[i][0], z: MESSY[i][1], ry: MESSY[i][2] } }); });
      function setBills(k) { S.bills = cl01(k); const N = bills.length, mess = sstep(0.15, 1, S.bills);
        bills.forEach((b, i) => { const f = cl01(S.bills * N - i); b.m.visible = f > 0; if (!b.m.visible) return; const fall = (1 - f) * (1 - f);
          b.m.position.set(lerp(b.neat.x, b.messy.x, mess), 0.752 + i * 0.0055 + fall * 0.25, lerp(b.neat.z, b.messy.z, mess)); b.m.rotation.set(fall * 0.4, lerp(b.neat.ry, b.messy.ry, mess) + fall * 0.8, 0); }); }
      setBills(0.6);
      // phone + mug with steam
      B(g, 0.08, 0.012, 0.16, "#2A2840", -0.49, 0.75, -0.32, { ry: 0.3 });
      const phScr = textTex(128, 256, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5A6AD0"); gr.addColorStop(1, "#C7B3E6"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); g2.fillStyle = "#FFFFFF"; g2.font = FONT(34); g2.textAlign = "center"; g2.fillText("7:02", w / 2, 60);
        g2.fillStyle = "rgba(255,255,255,0.85)"; g2.beginPath(); g2.roundRect(10, 96, w - 20, 50, 10); g2.fill(); g2.fillStyle = "#D9453A"; g2.font = FONT(15); g2.fillText("PAYMENT DUE", w / 2, 116); g2.fillStyle = "#555"; g2.font = FONT(12, 700); g2.fillText("tap to view", w / 2, 134); });
      const phM = new TH.MeshBasicMaterial({ map: phScr }); G(g, new TH.PlaneGeometry(0.068, 0.14), phM, -0.49, 0.7625, -0.32, { rx: -PI / 2, rz: 0.3 });
      const mug = new TH.Group(); mug.position.set(0.48, 0.75, -0.3); g.add(mug);
      G(mug, cyl(0.048, 0.044, 0.11, 16), "#F4A28C", 0, 0.055, 0); G(mug, new TH.TorusGeometry(0.03, 0.009, 6, 12), "#F4A28C", 0.05, 0.06, 0); G(mug, cyl(0.042, 0.042, 0.005, 16), "#6A3E2A", 0, 0.1, 0);
      const steamTex = W3.tex(64, 128, (g2, w, h) => { g2.clearRect(0, 0, w, h); g2.filter = "blur(4px)"; g2.strokeStyle = "rgba(255,255,255,0.9)"; g2.lineWidth = 9; g2.lineCap = "round"; g2.beginPath(); for (let y = 118; y > 12; y -= 4) g2.lineTo(w / 2 + Math.sin(y * 0.07) * 12, y); g2.stroke(); g2.filter = "none"; }, { clamp: true });
      const steam = [0, 1, 2].map((i) => { const s = new TH.Sprite(new TH.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 })); s.layers.set(1); s.scale.set(0.08, 0.16, 1); mug.add(s); return s; });
      // ---- floor lamp
      const lampShade = W3.toon("#FFE9C2", null, { side: TH.DoubleSide, emissive: new TH.Color("#FFB860"), emissiveIntensity: 0.1 });
      G(g, cyl(0.17, 0.19, 0.04, 16), "#3A3440", -2.45, 0.02, -1.95); G(g, cyl(0.018, 0.018, 1.45, 8), "#3A3440", -2.45, 0.76, -1.95);
      G(g, cyl(0.17, 0.27, 0.34, 18, true), lampShade, -2.45, 1.62, -1.95); const lampBulb = glowMat("#FFE6A0", 0.6); G(g, new TH.SphereGeometry(0.06, 10, 8), lampBulb, -2.45, 1.53, -1.95);
      const lampGlow = glow(g, "#FFC870", 0.8, -2.45, 1.5, -1.95);
      // ---- couch (right wall, facing -x)
      const cg = new TH.Group(); cg.position.set(2.5, 0, 0.25); g.add(cg); const teal = "#3FA7A0";
      MB(cg, [[0.06, 0.1, 0.06, -0.32, 0, -0.85], [0.06, 0.1, 0.06, -0.32, 0, 0.85], [0.06, 0.1, 0.06, 0.32, 0, -0.85], [0.06, 0.1, 0.06, 0.32, 0, 0.85]], "#6E4430");
      B(cg, 0.8, 0.3, 1.9, teal, 0, 0.1, 0); B(cg, 0.24, 0.6, 1.9, teal, 0.28, 0.4, 0); MB(cg, [[0.8, 0.3, 0.18, 0, 0.4, -0.86], [0.8, 0.3, 0.18, 0, 0.4, 0.86]], "#36958F");
      MB(cg, [[0.56, 0.14, 0.74, -0.11, 0.4, -0.38], [0.56, 0.14, 0.74, -0.11, 0.4, 0.38]], "#5FBDB4");
      B(cg, 0.12, 0.34, 0.34, "#F4A28C", 0.1, 0.54, -0.5, { rx: 0.2, ry: 0.3 }); B(cg, 0.1, 0.3, 0.3, "#F6D77A", 0.1, 0.54, 0.55, { ry: -0.3 });
      makePlant(g, 2.45, -1.95, 1.1, 77, "#F4A28C");
      { const rw = W.right; B(rw, 0.22, 0.04, 1.2, "#C99A66", 2.89, 1.3, 0.25); MB(rw, [[0.18, 0.12, 0.03, 2.9, 1.18, -0.25], [0.18, 0.12, 0.03, 2.9, 1.18, 0.75]], "#A87448");
        const r = rng(91), bk = []; let z = -0.25; for (let i = 0; i < 9; i++) { const th = 0.035 + r() * 0.03, hh = 0.16 + r() * 0.08; bk.push({ p: [2.9, 1.34 + hh / 2, z + th / 2], s: [0.15, hh, th], r: [i === 8 ? 0.35 : 0, 0, 0], c: ["#F4A28C", "#2F8F8A", "#F6D77A", "#8EC3E8", "#C8553D", "#9FD8C2", "#7A5AB0"][i % 7] }); z += th + 0.005; }
        inst(rw, new TH.BoxGeometry(1, 1, 1), mat("#FFFFFF"), bk);
        G(rw, cyl(0.06, 0.05, 0.1, 10), "#FFF6E6", 2.9, 1.39, 0.55); G(rw, new TH.SphereGeometry(0.07, 8, 6), "#7DBA5A", 2.9, 1.49, 0.55);
        const fr = new TH.Group(); fr.position.set(2.98, 1.8, 0.25); fr.rotation.y = -PI / 2; rw.add(fr);
        MB(fr, [[0.62, 0.05, 0.04, 0, 0.42, 0.02], [0.62, 0.05, 0.04, 0, -0.05, 0.02], [0.05, 0.52, 0.04, -0.285, -0.05, 0.02], [0.05, 0.52, 0.04, 0.285, -0.05, 0.02]], "#FFF6E6");
        const art = W3.tex(256, 192, (g2, w, h) => { g2.fillStyle = "#F6E6C8"; g2.fillRect(0, 0, w, h); [["#F4A28C", 70, 100, 60], ["#2FA7B8", 160, 80, 50], ["#F6D77A", 120, 130, 40]].forEach(([c, x, y, rr]) => { g2.fillStyle = c; g2.beginPath(); g2.arc(x, y, rr, 0, PI * 2); g2.fill(); }); g2.strokeStyle = "#2F6F73"; g2.lineWidth = 6; g2.beginPath(); g2.moveTo(20, 160); g2.bezierCurveTo(90, 120, 160, 190, 236, 140); g2.stroke(); });
        G(fr, new TH.PlaneGeometry(0.52, 0.42), texMat(art), 0, 0.18, 0.025);
        const pts = [], N = 15; for (let i = 0; i < N; i++) { const u = i / (N - 1); pts.push({ p: [2.95, 2.62 - Math.sin(u * PI) * 0.22 - Math.sin(u * PI * 3) * 0.03, -0.75 + u * 2.0], c: ["#FFE27A", "#FFB0A0", "#A8F0D8", "#FFE27A"][i % 4] }); }
        R.fairyM = W3.toon("#FFFFFF", null, { emissive: new TH.Color("#FFE6A0"), emissiveIntensity: 0.3 });
        inst(rw, new TH.SphereGeometry(0.025, 8, 6), R.fairyM, pts);
        MG(rw, pts.slice(1).map((q, i) => { const a = pts[i].p, b = q.p, len = Math.hypot(b[1] - a[1], b[2] - a[2]); return [cyl(0.004, 0.004, len, 4), 2.955, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, Math.atan2(b[2] - a[2], b[1] - a[1]), 0, 0]; }), "#4A5A4A"); }
      // ---- kitchenette (left wall) + fridge
      B(g, 0.6, 0.86, 1.6, "#F2E6C8", -2.7, 0, 0.2); B(g, 0.66, 0.04, 1.66, "#8EC3E8", -2.68, 0.86, 0.2);
      MB(g, [[0.02, 0.62, 0.72, -2.395, 0.12, -0.18], [0.02, 0.62, 0.72, -2.395, 0.12, 0.58]], "#9FD8C2"); MB(g, [[0.03, 0.12, 0.03, -2.38, 0.55, 0.12], [0.03, 0.12, 0.03, -2.38, 0.55, 0.28]], "#C9A04A");
      B(g, 0.4, 0.006, 0.46, "#B8C4D0", -2.72, 0.9, 0.55); G(g, cyl(0.015, 0.015, 0.25, 8), "#C9D3DE", -2.92, 1.02, 0.55); G(g, cyl(0.013, 0.013, 0.16, 8).rotateZ(PI / 2), "#C9D3DE", -2.85, 1.14, 0.55);
      G(g, cyl(0.07, 0.09, 0.18, 14), "#E85B4A", -2.72, 0.99, -0.25); G(g, cyl(0.012, 0.02, 0.1, 8), "#E85B4A", -2.62, 1.0, -0.25, { rz: -0.9 });
      B(g, 0.35, 0.62, 1.6, "#F2E6C8", -2.825, 1.5, 0.2); MB(g, [[0.02, 0.54, 0.74, -2.645, 1.54, -0.18], [0.02, 0.54, 0.74, -2.645, 1.54, 0.58]], "#9FD8C2");
      B(g, 0.66, 1.5, 0.7, texMat(texShiny("#F6D77A", 19)), -2.67, 0, 1.4); B(g, 0.02, 0.012, 0.66, "#E3BE5A", -2.335, 1.0, 1.4); B(g, 0.03, 0.35, 0.03, "#C9D3DE", -2.32, 1.1, 1.13);
      inst(g, cyl(0.025, 0.025, 0.015, 10).rotateZ(PI / 2), mat("#FFFFFF"), [[1.3, 1.25, "#E85B4A"], [1.38, 1.6, "#2FA7B8"], [1.25, 1.65, "#7DBA5A"]].map(([y, z, c]) => ({ p: [-2.335, y, z], c })));
      B(g, 0.004, 0.18, 0.14, "#FFFDF4", -2.335, 1.12, 1.55, { rx: 0.1 });
      // ceiling light
      const ceilM = glowMat("#FFF1CF", 0.4); G(g, new TH.SphereGeometry(0.25, 16, 8, 0, PI * 2, PI / 2, PI / 2), ceilM, 0, 3.0, 0.4); G(g, cyl(0.27, 0.27, 0.03, 16), "#E3AE4E", 0, 2.985, 0.4);
      // ---- front wall + door
      { const F = W.front, z = 2.5; [[1.1, 3, -2.45, 0], [2.0, 3, -0.1, 0], [1.2, 0.8, 1.6, 2.2], [0.8, 3, 2.6, 0]].forEach(([w, h, x, y]) => wall(F, w, h, mLilac, x, y, z, PI, 2));
        MB(F, [[0.1, 2.25, 0.16, 0.95, 0, z], [0.1, 2.25, 0.16, 2.25, 0, z], [1.4, 0.1, 0.16, 1.6, 2.2, z]], "#FFF6E6"); B(F, 1.2, 2.2, 0.05, "#F4A28C", 1.6, 0, z + 0.01);
        MB(F, [[0.9, 0.7, 0.03, 1.6, 1.25, z - 0.02], [0.9, 0.8, 0.03, 1.6, 0.25, z - 0.02]], "#F7B8A4"); G(F, new TH.SphereGeometry(0.035, 10, 8), "#C9A04A", 1.1, 1.05, z - 0.05);
        B(F, 0.8, 0.05, 0.06, "#C99A66", -1.4, 1.75, z - 0.03); MG(F, [-1.7, -1.4, -1.1].map((x) => [cyl(0.015, 0.015, 0.08, 6).rotateX(PI / 2), x, 1.72, z - 0.08]), "#C9A04A");
        B(F, 0.36, 0.7, 0.06, "#2F8F8A", -1.4, 0.98, z - 0.12); }
      // ---- lights
      const L1 = plight(g, "#FFC878", 6.5, -2.1, 1.45, -1.5), L2 = plight(g, "#FFE6C8", 9, 0, 2.3, 0.8), L3 = plight(g, "#FFD8B8", 5, 0, 1.9, -1.7);
      function setWindowSky(k) { S.skyManual = true; S.sky = cl01(k); if (Math.abs(S.sky - S.skyDrawn) > 0.008 || (S.sky !== S.skyDrawn && (S.sky === 0 || S.sky === 1))) drawSky(S.sky); }
      const anchors = { anaSpot: A(CX + 0.35, 0, -1.45), table: A(CX, 0.75, -0.6), phone: A(CX - 0.49, 0.762, -0.32), window: A(CX, 1.8, -2.48), mug: A(CX + 0.48, 0.75, -0.3), bills: A(CX + 0.05, 0.75, -0.62),
        couch: A(CX + 2.3, 0.45, 0.25), lamp: A(CX - 2.45, 1.55, -1.95), chair: A(CX - 0.5, 0.48, -1.4), door: A(CX + 1.6, 0, 2.1), calendar: A(CX - 1.65, 1.64, -2.48), photo: A(CX + 1.65, 1.84, -2.48) };
      const occ = { axis: "z", a0: -1.0, a1: -0.2, b0: CX - 0.6, b1: CX + 0.6, y: 0.75 };
      const skyCol = (k) => new TH.Color("#FFD8B8").lerp(new TH.Color("#6A7AD8"), k);
      function update(t, env) {
        const n = cl01(env.night || 0); if (!S.skyManual && Math.abs(n - S.skyDrawn) > 0.008) drawSky(n); const sk = S.skyManual ? S.sky : n;
        L1.intensity = 2 + 5.5 * n; L2.intensity = 5.5 * (1 - n) + 1.3 * n; L3.intensity = 3.5 * (1 - sk) + 1.2 * sk; L3.color.copy(skyCol(sk));
        R.fairyM.emissiveIntensity = 0.25 + 1.0 * n; lampBulb.emissiveIntensity = 0.5 + 0.8 * n; lampShade.emissiveIntensity = 0.08 + 0.4 * n; lampGlow.material.opacity = 0.2 + 0.45 * n; ceilM.emissiveIntensity = 0.35 + 0.3 * n;
        steam.forEach((s, i) => { const u = (t * 0.32 + i / 3) % 1; s.position.set(Math.sin(t * 1.3 + i * 2) * 0.015, 0.14 + u * 0.22, 0); s.material.opacity = Math.sin(u * PI) * 0.55; s.scale.set(0.07 + u * 0.05, 0.14 + u * 0.06, 1); });
      }
      return { anchors, occ, update, setBills, setWindowSky, setFrontVisible(v) { R.front = v; }, room: R };
    })();

    return {
      anchors: { shop: shop.anchors, bank: bank.anchors, apt: apt.anchors },
      occ: [shop.occ, bank.occ, apt.occ],
      update(t, env) { env = env || {}; shop.update(t, env); bank.update(t, env); apt.update(t, env); },
      shop, bank, apt,
      setPrice: shop.setPrice, setDrawer: shop.setDrawer, setVault: bank.setVault, setScreen: bank.setScreen, setStamp: bank.setStamp, setBills: apt.setBills, setWindowSky: apt.setWindowSky,
      stats() { const out = {}; [["shop", shop], ["bank", bank], ["apt", apt]].forEach(([k, r]) => { let calls = 0, tris = 0, lights = 0;
        r.room.g.traverse((o) => { if (o.isLight) lights++; if (!o.isMesh && !o.isSprite) return; const geo = o.geometry, n = o.isInstancedMesh ? o.count : 1; const t = o.isSprite ? 2 : (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
          calls += Array.isArray(o.material) ? geo.groups.length : 1; tris += t * n; }); out[k] = { calls, tris: Math.round(tris), lights }; }); return out; },
      setFrontVisible(v, which) { (which ? [{ shop, bank, apt }[which]] : [shop, bank, apt]).forEach((r) => r.setFrontVisible(v)); },
    };
  };
})();
