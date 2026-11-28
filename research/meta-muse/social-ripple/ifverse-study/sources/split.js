/* Two worlds: left = a bad mood rippling (stormy red), right = kindness rippling (golden dawn). */
window.SPLIT = (function () {
  const SR = window.SR, C = window.CINE; const { el, PAL } = SR;
  const RED = "#E2412F", GOLD = "#F2B33D";
  function worlds(svg, W, H, mid, horizon, s = 1) {
    const d = svg.querySelector("defs") || el("defs", {}, svg);
    const L = el("g", {}, svg), Rg = el("g", {}, svg);
    const cl = el("clipPath", { id: "clipL" }, d); el("rect", { x: -10, y: -10, width: mid + 10, height: H + 20 }, cl);
    const cr = el("clipPath", { id: "clipR" }, d); el("rect", { x: mid, y: -10, width: W - mid + 10, height: H + 20 }, cr);
    L.setAttribute("clip-path", "url(#clipL)"); Rg.setAttribute("clip-path", "url(#clipR)");
    C.sky(svg, L, W, H, [[0, "#0D0912"], [0.45, "#26121F"], [0.75, "#5A1A26"], [0.86, "#7A2A2A"], [1, "#0B0709"]]);
    C.sky(svg, Rg, W, H, [[0, "#1B1538"], [0.42, "#4A2C5E"], [0.7, "#E07A55"], [0.84, "#FFC77A"], [1, "#2A1A20"]]);
    C.pool(svg, Rg, mid + (W - mid) * 0.62, horizon, (W - mid) * 0.55, H * 0.22, "#FFE2A0", 0.7);
    // left: storm clouds + rain; right: stars fading into dawn
    const cloud = el("g", { opacity: 0.85 }, L), R = SR.mulberry32(4);
    for (let i = 0; i < 9; i++) { const x = R() * mid, y = (40 + R() * 220) * s, r = (50 + R() * 70) * s; el("circle", { cx: x, cy: y, r, fill: "#2B1A26" }, cloud); }
    const rain = el("g", { opacity: 0.35 }, L); for (let i = 0; i < 120 * s; i++) { const x = R() * mid, y = R() * H; el("line", { x1: x, y1: y, x2: x - 8 * s, y2: y + 26 * s, stroke: "#C9B6C8", "stroke-width": 1.6 * s }, rain); }
    C.stars(Rg, W, horizon * 0.5, 80, 12);
    // skylines
    const sky2 = (g, x0, x1, lit, col, seed) => { const RR = SR.mulberry32(seed); for (let x = x0; x < x1;) { const w = (60 + RR() * 90) * s, h = (40 + RR() * 150) * s; el("rect", { x, y: horizon - h, width: w, height: h + 2, fill: col }, g);
      for (let r = 0; r < h / (22 * s) - 1; r++) for (let c = 0; c < w / (18 * s) - 1; c++) if (RR() < lit) el("rect", { x: x + (6 + c * 18) * s, y: horizon - h + (8 + r * 22) * s, width: 8 * s, height: 11 * s, fill: "#FFC56B", opacity: 0.7 }, g); x += w + RR() * 6 * s; } };
    const cityL = el("g", { filter: C.blur(svg, 1.2 * s) }, L), cityR = el("g", { filter: C.blur(svg, 1.2 * s) }, Rg);
    sky2(cityL, -40, mid + 40, 0.06, "#140B12", 3); sky2(cityR, mid - 40, W + 40, 0.3, "#2A1830", 5);
    el("rect", { x: 0, y: horizon, width: W, height: H - horizon, fill: "#0C080D" }, L); el("rect", { x: 0, y: horizon, width: W, height: H - horizon, fill: "#2A1A22" }, Rg);
    C.pool(svg, Rg, mid + (W - mid) * 0.5, horizon + 40 * s, (W - mid) * 0.6, 120 * s, "#FFB060", 0.35);
    // the seam: a thin bright crack of light
    el("line", { x1: mid, y1: 0, x2: mid, y2: H, stroke: "#FFF3DA", "stroke-width": 2.5 * s, opacity: 0.55, filter: C.bloom(svg, 6 * s, 1.5) }, svg);
    return { L, R: Rg };
  }
  function rings(svg, g, cx, cy, n, r0, dr, color, s, side) {
    const gg = el("g", { filter: C.bloom(svg, 6 * s, 1.5) }, g);
    for (let k = 0; k < n; k++) { const r = (r0 + k * dr) * s; el("path", { d: `M${cx},${cy - r} A${r},${r} 0 0 ${side < 0 ? 0 : 1} ${cx},${cy + r}`, fill: "none", stroke: color, "stroke-width": Math.max(1.5, (7 - k) * s), opacity: Math.max(0.15, 0.95 - k * 0.15) }, gg); }
    return gg;
  }
  return { worlds, rings, RED, GOLD };
})();
