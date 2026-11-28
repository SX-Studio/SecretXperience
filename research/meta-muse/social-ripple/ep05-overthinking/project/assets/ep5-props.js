/* Ep5 props (original): Bea's tray tower + cinnamon buns that can crash (and freeze mid-air), broom + sandwich hand icons.
   EP5P.trays(W3, n=3)  → { group, set(state) }  state = { pos:{x,y,z}, ry, k (0 = stacked in hands, 1 = landed), freeze (0..1 time-scale), t }
   EP5P.broomIcon(svg), EP5P.sandwichIcon(svg) → SVG <g> to place at a hand position */
(function () {
  const TH = window.THREE;
  function trays(W3, n = 3) {
    const g = new TH.Group(), trayM = W3.toon("#B9BEC6"), rimM = W3.toon("#8A909A"), bunM = W3.toon("#D9964E"), swirlM = W3.toon("#8A4E24"), icingM = W3.toon("#FFF4E0");
    const T = [], B = [];
    for (let i = 0; i < n; i++) { const tg = new TH.Group(); const base = new TH.Mesh(new TH.BoxGeometry(0.62, 0.025, 0.42), trayM); tg.add(base);
      [[0, 0.025, 0.21, 0.62, 0.03, 0.012], [0, 0.025, -0.21, 0.62, 0.03, 0.012], [0.31, 0.025, 0, 0.012, 0.03, 0.42], [-0.31, 0.025, 0, 0.012, 0.03, 0.42]].forEach(([x, y, z, w, h, d]) => { const r = new TH.Mesh(new TH.BoxGeometry(w, h, d), rimM); r.position.set(x, y, z); tg.add(r); });
      g.add(tg); T.push(tg);
      for (let j = 0; j < 6; j++) { const b = new TH.Group(); const body = new TH.Mesh(new TH.SphereGeometry(0.065, 14, 10), bunM); body.scale.set(1, 0.55, 1); b.add(body);
        const sw = new TH.Mesh(new TH.TorusGeometry(0.035, 0.009, 6, 16).rotateX(Math.PI / 2), swirlM); sw.position.y = 0.032; b.add(sw);
        const ic = new TH.Mesh(new TH.SphereGeometry(0.02, 8, 6), icingM); ic.position.y = 0.04; ic.scale.set(1.4, 0.4, 1.4); b.add(ic);
        g.add(b); B.push({ b, i, j, hx: -0.2 + (j % 3) * 0.2, hz: j < 3 ? -0.1 : 0.1 }); } }
    W3.scene.add(g);
    const R = (s) => { const x = Math.sin(s * 91.7) * 43758.5; return x - Math.floor(x); };
    return { group: g, set(st) { g.visible = !!st; if (!st) return; const k = st.k || 0, P = st.pos, ry = st.ry || 0, c = Math.cos(ry), s = Math.sin(ry);
      const W = (lx, ly, lz) => [P.x + lx * c + lz * s, P.y + ly, P.z - lx * s + lz * c];
      // stacked: trays at hand height 1.0 + i*0.12; landed: scattered on the ground, buns rolled out
      T.forEach((tg, i) => { const u = Math.min(1, Math.max(0, k * 1.15 - i * 0.07)), e = u * u; const hx = 0, hy = 1.0 + i * 0.12, hz = 0.35;
        const gx = (R(i + 1) - 0.5) * 1.2, gz = 0.55 + R(i + 7) * 0.9; const [x0, y0, z0] = W(hx, hy, hz), [x1, , z1] = W(gx, 0, gz);
        const arc = Math.sin(Math.PI * u) * (0.5 + i * 0.15); tg.position.set(x0 + (x1 - x0) * e, y0 + (0.02 + i * 0.03 - y0) * e + arc, z0 + (z1 - z0) * e);
        tg.rotation.set((R(i + 3) - 0.5) * 2.4 * u * (1 - u * 0.85), ry + (R(i + 5) - 0.5) * 1.6 * u, (R(i + 9) - 0.5) * 2.0 * u * (1 - u * 0.85)); });
      B.forEach(({ b, i, j, hx, hz }) => { const tg = T[i]; const u = Math.min(1, Math.max(0, k * 1.2 - i * 0.07 - j * 0.015)), e = u * u;
        const sx = tg.position.x + hx * c + hz * s, sy = tg.position.y + 0.05, sz = tg.position.z - hx * s + hz * c;
        const [gx, , gz] = W((R(i * 7 + j + 11) - 0.5) * 2.6, 0, 0.3 + R(i * 5 + j + 13) * 1.9);
        if (u <= 0.001) { b.position.set(sx, sy, sz); b.rotation.set(0, 0, 0); return; }
        const arc = Math.sin(Math.PI * u) * (0.7 + R(i + j * 3) * 0.6); b.position.set(sx + (gx - sx) * e, sy + (0.035 - sy) * e + arc, sz + (gz - sz) * e); b.rotation.set(u * 9 * (R(j + 2) - 0.5), u * 6, u * 7 * (R(j + 4) - 0.5)); });
    } };
  }
  const NS = "http://www.w3.org/2000/svg", el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  function broomIcon(svg) { const g = el("g", { display: "none" }, svg);
    el("line", { x1: 0, y1: -70, x2: 0, y2: 40, stroke: "#8A5A2E", "stroke-width": 9, "stroke-linecap": "round" }, g);
    el("path", { d: "M-26,40 L26,40 L36,92 L-36,92 Z", fill: "#E8B84A", stroke: "#1E1B22", "stroke-width": 5, "stroke-linejoin": "round" }, g);
    [-20, -8, 4, 16, 28].forEach((x) => el("line", { x1: x * 0.85, y1: 48, x2: x * 1.15, y2: 90, stroke: "#A8782A", "stroke-width": 3 }, g)); return g; }
  function sandwichIcon(svg) { const g = el("g", { display: "none" }, svg);
    el("path", { d: "M-38,4 Q0,-36 38,4 Z", fill: "#E8B06A", stroke: "#1E1B22", "stroke-width": 5 }, g);
    el("rect", { x: -40, y: 4, width: 80, height: 9, rx: 4, fill: "#7DBA5A", stroke: "#1E1B22", "stroke-width": 4 }, g);
    el("rect", { x: -38, y: 13, width: 76, height: 8, rx: 4, fill: "#E2574C", stroke: "#1E1B22", "stroke-width": 4 }, g);
    el("rect", { x: -38, y: 21, width: 76, height: 13, rx: 6, fill: "#E8B06A", stroke: "#1E1B22", "stroke-width": 5 }, g); return g; }
  window.EP5P = { trays, broomIcon, sandwichIcon };
})();
