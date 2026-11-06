/* Expression panels (prototype): manga-style full-frame reaction shots of the cast. TS.panel({mood: "gloom"|"joy"|"shock", ...}) */
(function () {
  const SR = window.SR, { el } = SR, TS = window.TS;
  TS.focusLines = (svg, cx, cy, col, n = 90, seed = 3) => { const r = SR.mulberry32(seed), g = el("g", {}, svg);
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, w = 0.004 + r() * 0.018, r0 = 260 + r() * 160, R = 1600;
      const p = (rr, aa) => `${cx + Math.cos(aa) * rr},${cy + Math.sin(aa) * rr}`; el("path", { d: `M${p(r0, a)} L${p(R, a - w)} L${p(R, a + w)} Z`, fill: col, opacity: 0.35 + r() * 0.5 }, g); } return g; };
  TS.gloom = (svg, x0, x1, y0, y1, col, seed = 5) => { const r = SR.mulberry32(seed), g = el("g", { opacity: 0.55 }, svg);
    for (let i = 0; i < 26; i++) { const x = x0 + r() * (x1 - x0), L = 80 + r() * 220, y = y0 + r() * (y1 - y0 - L); el("line", { x1: x, y1: y, x2: x, y2: y + L, stroke: col, "stroke-width": 3 + r() * 5, "stroke-linecap": "round" }, g); } return g; };
  TS.sparkBurst = (svg, cx, cy, n = 18, seed = 9) => { const r = SR.mulberry32(seed); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = 180 + r() * 420;
    const g = el("g", { transform: `translate(${cx + Math.cos(a) * d},${cy + Math.sin(a) * d * 0.7}) scale(${0.8 + r() * 1.6})` }, svg); el("path", { d: "M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4 Z", fill: "#FFF2B0" }, g); } };
})();
