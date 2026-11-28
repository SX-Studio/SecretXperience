/* SR FX3D: environment effects for the SR3D world (pure functions of t).
   const FX = SRFX.create(W3);
   FX.crack({ pos, normal, w, h, color, open:[t0,t1], close:[t2,t3], seed })  → glowing jagged rift in a wall that opens, breathes, collapses to a line and zips shut (spark + bloom)
   FX.dust({ center, size, n, color })      → slow drifting motes that catch the light
   FX.rays({ pos, dir, len, width, color, k }) → soft god-ray shafts (additive)
   FX.rain({ center, size, n, speed })      → falling streaks
   Each returns { update(t, k?) }; call FX.update(t) once per frame to update all. */
(function () {
  const TH = window.THREE;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), sst = (k) => k * k * (3 - 2 * k), eIn = (k) => k * k * k, eOut = (k) => 1 - Math.pow(1 - k, 3);
  function create(W3) {
    const FX = { list: [] }, R = (seed) => window.SR.mulberry32(seed);
    // ---------- crack / rift ----------
    FX.crack = (o) => {
      const g = new TH.Group(), r = R(o.seed || 7), N = 22, w = o.w || 2.2, h = o.h || 3.0, col = new TH.Color(o.color || "#FFE6A0");
      // jagged outline points on an ellipse, with alternating spikes
      const base = []; for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2, j = i % 2 ? 0.55 + r() * 0.25 : 0.9 + r() * 0.18; base.push([Math.cos(a) * j * w / 2, Math.sin(a) * j * h / 2]); }
      const mkShapeGeo = () => { const geo = new TH.BufferGeometry(), pos = new Float32Array((N + 1) * 3), idx = []; for (let i = 0; i < N; i++) idx.push(N, i, (i + 1) % N); geo.setAttribute("position", new TH.BufferAttribute(pos, 3)); geo.setIndex(idx); return geo; };
      const inner = new TH.Mesh(mkShapeGeo(), new TH.MeshBasicMaterial({ color: col, fog: false })); const rim = new TH.Mesh(mkShapeGeo(), new TH.MeshBasicMaterial({ color: new TH.Color("#1E1830"), fog: false }));
      const core = new TH.Mesh(mkShapeGeo(), new TH.MeshBasicMaterial({ color: new TH.Color("#FFF4D6"), fog: false }));
      rim.position.z = 0.002; inner.position.z = 0.006; core.position.z = 0.01; g.add(rim); g.add(inner); g.add(core); [rim, inner, core].forEach((m) => { m.layers.set(1); m.renderOrder = 2; m.material.depthWrite = false; });
      const glow = new TH.Sprite(new TH.SpriteMaterial({ map: W3.glowTex, color: col, blending: TH.AdditiveBlending, depthWrite: false, fog: false, transparent: true })); glow.layers.set(1); g.add(glow);
      const spark = new TH.Sprite(new TH.SpriteMaterial({ map: W3.glowTex, color: new TH.Color("#FFFFFF"), blending: TH.AdditiveBlending, depthWrite: false, fog: false, transparent: true, opacity: 0 })); spark.layers.set(1); g.add(spark);
      // orbiting debris shards (Ifverse-style low-gravity geometry)
      const nD = 14, shards = new TH.InstancedMesh(new TH.TetrahedronGeometry(0.09, 0), W3.toon("#EDE6DA"), nD), M4 = new TH.Matrix4(), q = new TH.Quaternion(), e = new TH.Euler(), sv = new TH.Vector3(), pv = new TH.Vector3();
      const deb = Array.from({ length: nD }, () => ({ a: r() * 6.28, rr: 0.7 + r() * 0.5, sp: 0.4 + r() * 0.6, z: 0.1 + r() * 0.5, s: 0.5 + r() * 1.2, ph: r() * 6 })); g.add(shards);
      // place on the wall
      const n = new TH.Vector3(o.normal ? o.normal.x : 0, o.normal ? o.normal.y || 0 : 0, o.normal ? o.normal.z : 1).normalize();
      g.position.set(o.pos.x, o.pos.y, o.pos.z); g.lookAt(o.pos.x + n.x, o.pos.y + n.y, o.pos.z + n.z); W3.scene.add(g);
      const setGeo = (mesh, sx, sy, grow, zipTop, zipBot) => { const p = mesh.geometry.attributes.position; for (let i = 0; i < N; i++) { let [x, y] = base[i]; x = x * sx * grow; y = y * sy * grow; y = clamp(y, -h / 2 * zipBot, h / 2 * zipTop); p.setXYZ(i, x, y, 0); } p.setXYZ(N, 0, 0, 0); p.needsUpdate = true; mesh.geometry.computeBoundingSphere(); };
      const hair = new TH.Group(), hairMat = new TH.MeshBasicMaterial({ color: new TH.Color("#2A2036"), fog: false }), hairs = [];
      for (let k = 0; k < 9; k++) { const a0 = (k / 9) * Math.PI * 2 + r() * 0.4; let x = Math.cos(a0) * w * 0.42, y = Math.sin(a0) * h * 0.42, a = a0; const pts = [[x, y]];
        for (let j = 0; j < 5; j++) { a += (r() - 0.5) * 1.1; const L = (0.12 + r() * 0.22) * (w + h) * 0.5; x += Math.cos(a) * L; y += Math.sin(a) * L; pts.push([x, y]); }
        const segs = []; for (let j = 0; j < pts.length - 1; j++) { const [x0, y0] = pts[j], [x1, y1] = pts[j + 1], len = Math.hypot(x1 - x0, y1 - y0), wd = 0.022 * (1 - j / pts.length) + 0.006;
          const m = new TH.Mesh(new TH.PlaneGeometry(1, 1), hairMat); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0.004); m.rotation.z = Math.atan2(y1 - y0, x1 - x0); m.scale.set(len, wd, 1); hair.add(m); segs.push({ m, len, j }); }
        hairs.push(segs); }
      g.add(hair);
      const it = { g, update(t) {
        const [o0, o1] = o.open || [-1, 0], [c0, c1] = o.close || [1e9, 1e9 + 1];
        const op = clamp((t - o0) / Math.max(0.01, o1 - o0), 0, 1), breathe = 1 + 0.04 * Math.sin(t * 4.2) + 0.02 * Math.sin(t * 11);
        // closing: 0..0.45 collapse to a vertical line, 0.45..0.85 zip from both ends, 0.85..1 spark
        const ck = clamp((t - c0) / Math.max(0.01, c1 - c0), 0, 1);
        const sx = op * (ck < 0.45 ? 1 - eIn(ck / 0.45) * 0.97 : 0.03), zip = ck < 0.45 ? 1 : 1 - eIn(clamp((ck - 0.45) / 0.4, 0, 1));
        const vis = op > 0 && ck < 0.86; g.visible = op > 0 && ck < 1;
        [rim, inner, core].forEach((m) => (m.visible = vis));
        if (vis) { setGeo(rim, sx * 1.06 + 0.025, 1.04, breathe, zip, zip); setGeo(inner, sx, 1, breathe, zip, zip); setGeo(core, sx * 0.55, 0.72, breathe, zip, zip); }
        inner.material.color.copy(col).multiplyScalar(1 + 0.15 * Math.sin(t * 13));
        glow.material.opacity = (vis ? 0.55 : 0) * (0.85 + 0.15 * Math.sin(t * 9)); glow.scale.set(w * 2.6 * Math.max(0.25, sx) * breathe, h * 1.6 * zip * breathe, 1); glow.position.z = 0.05;
        const sk = clamp((ck - 0.8) / 0.2, 0, 1); spark.material.opacity = ck > 0.78 && ck < 1 ? Math.sin(sk * Math.PI) * 1.2 : 0; spark.scale.setScalar(0.4 + 1.6 * Math.sin(sk * Math.PI)); spark.position.z = 0.08;
        const grow = op * (1 - clamp((ck - 0.1) / 0.75, 0, 1)); hairs.forEach((segs) => segs.forEach(({ m, len, j }) => { const v = clamp(grow * segs.length - j, 0, 1); m.visible = v > 0.01; m.scale.x = len * v; }));
        deb.forEach((d, i) => { const a = d.a + t * d.sp, rr = d.rr * Math.max(sx, 0.2) * (1 - 0.5 * ck), x = Math.cos(a) * rr * w * 0.6, y = Math.sin(a) * rr * h * 0.45 + Math.sin(t * 1.3 + d.ph) * 0.08;
          pv.set(x, y, d.z); e.set(t * d.sp * 2 + d.ph, t * d.sp + d.ph, 0); q.setFromEuler(e); const vs = op * (1 - eIn(ck)) * d.s; sv.set(vs, vs, vs); M4.compose(pv, q, sv); shards.setMatrixAt(i, M4); });
        shards.instanceMatrix.needsUpdate = true; } };
      FX.list.push(it); return it;
    };
    // ---------- dust motes ----------
    FX.dust = (o) => { const n = o.n || 220, r = R(o.seed || 3), pos = new Float32Array(n * 3), seeds = []; for (let i = 0; i < n; i++) seeds.push([r(), r(), r(), r() * 6.28, 0.2 + r() * 0.5]);
      const geo = new TH.BufferGeometry(); geo.setAttribute("position", new TH.BufferAttribute(pos, 3));
      const pts = new TH.Points(geo, new TH.PointsMaterial({ size: o.pt || 0.035, map: W3.glowTex, color: new TH.Color(o.color || "#FFF2D0"), transparent: true, opacity: o.k ?? 0.8, blending: TH.AdditiveBlending, depthWrite: false })); pts.layers.set(1); W3.scene.add(pts);
      const c = o.center, s = o.size; const it = { pts, update(t, k = 1) { pts.material.opacity = (o.k ?? 0.8) * k; for (let i = 0; i < n; i++) { const [a, b, d, ph, v] = seeds[i];
        pos[i * 3] = c.x + (a - 0.5) * s.x + Math.sin(t * 0.3 * v + ph) * 0.25; pos[i * 3 + 1] = c.y + (((b + t * 0.02 * v) % 1) - 0.5) * s.y + Math.sin(t * 0.5 + ph) * 0.1; pos[i * 3 + 2] = c.z + (d - 0.5) * s.z + Math.cos(t * 0.25 * v + ph) * 0.25; }
        geo.attributes.position.needsUpdate = true; } }; FX.list.push(it); return it; };
    // ---------- god rays ----------
    FX.rays = (o) => { const g = new TH.Group(), n = o.n || 5, r = R(o.seed || 5), mats = [];
      const tex = W3.tex(64, 256, (cx, w, h) => { const gr = cx.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)"); cx.fillStyle = gr; cx.fillRect(0, 0, w, h); const g2 = cx.createLinearGradient(0, 0, w, 0); g2.addColorStop(0, "rgba(0,0,0,1)"); g2.addColorStop(0.5, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,1)"); cx.globalCompositeOperation = "destination-out"; cx.fillStyle = g2; cx.fillRect(0, 0, w, h); }, { clamp: true });
      for (let i = 0; i < n; i++) { const m = new TH.MeshBasicMaterial({ map: tex, color: new TH.Color(o.color || "#FFE2A8"), transparent: true, blending: TH.AdditiveBlending, depthWrite: false, side: TH.DoubleSide, fog: false }); mats.push(m);
        const pl = new TH.Mesh(new TH.PlaneGeometry((o.width || 0.6) * (0.6 + r() * 0.8), o.len || 4), m); pl.position.set((r() - 0.5) * (o.spread || 1.2), -(o.len || 4) / 2, (r() - 0.5) * 0.4); pl.rotation.y = r() * Math.PI; pl.layers.set(1); g.add(pl); }
      g.position.set(o.pos.x, o.pos.y, o.pos.z); const d = o.dir || { x: 0.3, y: -1, z: 0.2 }; g.lookAt(o.pos.x + d.x, o.pos.y + d.y, o.pos.z + d.z); g.rotateX(Math.PI / 2); W3.scene.add(g);
      const it = { g, update(t, k = 1) { mats.forEach((m, i) => (m.opacity = (o.k ?? 0.22) * k * (0.75 + 0.25 * Math.sin(t * 0.7 + i * 1.7)))); } }; FX.list.push(it); return it; };
    // ---------- rain ----------
    FX.rain = (o) => { const n = o.n || 600, r = R(o.seed || 9), pos = new Float32Array(n * 6), seeds = []; for (let i = 0; i < n; i++) seeds.push([r(), r(), r()]);
      const geo = new TH.BufferGeometry(); geo.setAttribute("position", new TH.BufferAttribute(pos, 3));
      const lines = new TH.LineSegments(geo, new TH.LineBasicMaterial({ color: new TH.Color(o.color || "#B8D0F0"), transparent: true, opacity: 0.55, fog: false })); lines.layers.set(1); W3.scene.add(lines);
      const c = o.center, s = o.size, sp = o.speed || 9, L = o.len || 0.35;
      const it = { lines, update(t, k = 1) { lines.visible = k > 0.01; lines.material.opacity = 0.55 * k; for (let i = 0; i < n; i++) { const [a, b, d] = seeds[i], y = c.y + s.y / 2 - (((b * s.y + t * sp) % s.y)), x = c.x + (a - 0.5) * s.x, z = c.z + (d - 0.5) * s.z;
        pos.set([x, y, z, x - 0.04, y - L, z], i * 6); } geo.attributes.position.needsUpdate = true; } }; FX.list.push(it); return it; };
    FX.update = (t) => FX.list.forEach((f) => f.update(t));
    return FX;
  }
  window.SRFX = { create };
})();
