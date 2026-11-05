/* Ep6 props (original): golden "life threads" that grow from a person to everyone they've touched, plus a small HUD tally.
   EP6P.threads(W3, list, o)  list = [{ id, from:{x,y,z}, to:{x,y,z}, t0, grow, bright (0..1), arc, pull:[t0,t1], fade:[t0,t1] }]
     → { set(t, o) }   o.dim (0..1 global fade), o.focus (id → others dim), o.k (global brightness)
   EP6P.tally(svg, keys[[t, n]], {label}) → { update(t), g }
   Everything is a pure function of t (seek-safe). Threads live on render layer 1, so they skip the ink-edge pass and glow cleanly. */
(function () {
  const TH = window.THREE;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), ss = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
  const GOLD = new TH.Color("#FFC94A"), HALO = new TH.Color("#FF9E2C");
  function threads(W3, list, o = {}) {
    const root = new TH.Group(); root.name = "ep6-threads"; W3.scene.add(root);
    const SEG = o.seg || 64, items = [];
    list.forEach((d, i) => {
      const a = new TH.Vector3(d.from.x, d.from.y, d.from.z), b = new TH.Vector3(d.to.x, d.to.y, d.to.z), dist = a.distanceTo(b);
      const mid = a.clone().lerp(b, 0.5); mid.y += (d.arc ?? Math.min(6, 0.35 * dist + 0.6));
      const curve = new TH.QuadraticBezierCurve3(a, mid, b);
      const w = 0.012 + 0.05 * (d.bright ?? 0.5) + (d.thick || 0);
      const BL = d.normal ? TH.NormalBlending : TH.AdditiveBlending;   // normal blending reads on bright interiors, additive glows at night
      const core = new TH.Mesh(new TH.TubeGeometry(curve, SEG, w, 6, false), new TH.MeshBasicMaterial({ color: d.normal ? new TH.Color("#F2A20C") : GOLD.clone(), transparent: true, opacity: 0, blending: BL, depthWrite: false, fog: false }));
      const halo = new TH.Mesh(new TH.TubeGeometry(curve, SEG, w * 3.2, 6, false), new TH.MeshBasicMaterial({ color: d.normal ? new TH.Color("#FFE08A") : HALO.clone(), transparent: true, opacity: 0, blending: BL, depthWrite: false, fog: false }));
      core.layers.set(1); halo.layers.set(1); core.renderOrder = 5; halo.renderOrder = 4; root.add(core, halo);
      const spark = new TH.Sprite(new TH.SpriteMaterial({ map: W3.glowTex, color: GOLD.clone(), blending: TH.AdditiveBlending, depthWrite: false, fog: false, transparent: true, opacity: 0 }));
      spark.layers.set(1); spark.scale.setScalar(0.35 + 0.5 * (d.bright ?? 0.5)); root.add(spark);
      const N = core.geometry.index.count, NH = halo.geometry.index.count;
      items.push({ d, curve, core, halo, spark, N, NH, i });
    });
    return { root, items, set(t, s = {}) {
      const gk = s.k ?? 1; root.visible = gk > 0.001; if (!root.visible) return;
      items.forEach(({ d, curve, core, halo, spark, N, NH, i }) => {
        const g = ss((t - d.t0) / (d.grow || 1.2));                                      // growth along the curve (0..1)
        let pullK = 0; if (d.pull) pullK = ss((t - d.pull[0]) / 0.5) * (1 - ss((t - d.pull[1]) / 0.6));   // pulled → retracts + flickers
        const fade = d.fade ? 1 - ss((t - d.fade[0]) / Math.max(0.01, d.fade[1] - d.fade[0])) : 1;
        let grow = g * (1 - 0.92 * pullK);
        const focus = s.focus ? (s.focus === d.id ? 1 : 0.18) : 1;
        let near = 1; if (s.cam) { let dm = 1e9; for (let q = 0; q <= 8; q++) { const pp = curve.getPoint(q / 8); dm = Math.min(dm, Math.hypot(pp.x - s.cam[0], pp.y - s.cam[1], pp.z - s.cam[2])); } near = ss((dm - 1.0) / 4.5); }
        const flick = pullK > 0 ? 0.55 + 0.45 * Math.abs(Math.sin(t * 37 + i)) : 1;
        const br = (0.35 + 0.65 * (d.bright ?? 0.5)) * gk * (o.gain ?? 1) * near * focus * fade * flick * (1 + 0.12 * Math.sin(t * 2.4 + i * 1.7));
        const show = grow > 0.002 && br > 0.003; core.visible = halo.visible = spark.visible = show; if (!show) return;
        core.geometry.setDrawRange(0, Math.max(6, Math.floor((N * grow) / 6) * 6)); halo.geometry.setDrawRange(0, Math.max(6, Math.floor((NH * grow) / 6) * 6));
        core.material.opacity = clamp(0.95 * br, 0, 1); halo.material.opacity = clamp((d.normal ? 0.4 : 0.12) * br, 0, 1);
        // a spark runs out along the thread while it grows, then pulses toward the far end
        const u = g < 1 ? grow : ((t * (0.18 + 0.1 * ((i * 7) % 5) / 5) + i * 0.137) % 1) * grow;
        const p = curve.getPoint(clamp(u, 0, 1)); spark.position.copy(p); spark.material.opacity = clamp((g < 1 ? 1 : 0.7) * br * ss(u / 0.2), 0, 1);
      });
    } };
  }
  const NS = "http://www.w3.org/2000/svg", el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  function tally(svg, keys, o = {}) {
    const X = o.x ?? 70, Y = o.y ?? 56, g = el("g", { opacity: 0 }, svg);
    el("rect", { x: X, y: Y, width: 300, height: 104, rx: 22, fill: "#2B2140", stroke: "#FFC94A", "stroke-width": 5 }, g);
    const lab = el("text", { x: X + 150, y: Y + 34, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 22, fill: "#FFE3A0", "letter-spacing": 3 }, g); lab.textContent = o.label || "LIVES TOUCHED";
    const num = el("text", { x: X + 150, y: Y + 86, "text-anchor": "middle", "font-family": "Outfit", "font-weight": 900, "font-size": 50, fill: "#FFFFFF" }, g);
    keys = keys.slice().sort((a, b) => a[0] - b[0]);
    return { g, update(t) {
      let cur = null, prev = null; for (const k of keys) { if (k[0] <= t) { prev = cur; cur = k; } }
      const n = cur ? cur[1] : 0; g.setAttribute("opacity", n > 0 ? 1 : 0); if (!n) return;
      const u = clamp((t - cur[0]) / 0.35, 0, 1), sc = 1 + 0.18 * Math.sin(Math.PI * u) * (prev && prev[1] !== n ? 1 : 0);
      num.textContent = n.toLocaleString("en-US"); num.setAttribute("transform", `translate(${X + 150},${Y + 70}) scale(${sc.toFixed(3)}) translate(${-(X + 150)},${-(Y + 70)})`);
    } };
  }
  function noteIcon(svg) { const g = el("g", { display: "none" }, svg);   // folded thank-you note
    el("path", { d: "M-34,-24 L34,-24 L34,24 L-34,24 Z", fill: "#FFFDF6", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-34,-24 L0,4 L34,-24", fill: "none", stroke: "#1E1B22", "stroke-width": 4, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-6,8 C-14,0 -22,8 -12,16 L-6,21 L0,16 C10,8 2,0 -6,8 Z", fill: "#E2574C", transform: "translate(18,-2) scale(0.7)" }, g); return g; }
  window.EP6P = { threads, tally, noteIcon };
})();
