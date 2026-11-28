/* Cinematic look helpers (dual rim, star glint, night sky, bloom, light shaft) built on SR/EP/V3. */
(function () {
  const SR = window.SR; const { el } = SR; let U = 1;
  const defs = (svg) => svg.querySelector("defs") || el("defs", {}, svg);
  const C = {};
  C.rim = (svg, color, dx, dy, w = 2.5, glow = 0.35) => {
    const id = "cr" + U++, f = el("filter", { id, x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs(svg));
    el("feMorphology", { in: "SourceAlpha", operator: "dilate", radius: w, result: "d" }, f); el("feOffset", { in: "d", dx, dy, result: "o" }, f);
    el("feFlood", { "flood-color": color, result: "c" }, f); el("feComposite", { in: "c", in2: "o", operator: "in", result: "co" }, f);
    el("feComposite", { in: "co", in2: "SourceAlpha", operator: "out", result: "r" }, f); el("feGaussianBlur", { in: "r", stdDeviation: 0.8, result: "rb" }, f);
    el("feGaussianBlur", { in: "co", stdDeviation: w * 5, result: "g" }, f);
    const ct = el("feComponentTransfer", { in: "g", result: "g2" }, f); el("feFuncA", { type: "linear", slope: glow }, ct);
    const m = el("feMerge", {}, f); ["g2", "SourceGraphic", "rb"].forEach((x) => el("feMergeNode", { in: x }, m)); return `url(#${id})`;
  };
  C.bloom = (svg, std = 10, k = 1) => { const id = "bm" + U++, f = el("filter", { id, x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs(svg));
    el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: std, result: "b" }, f); const ct = el("feComponentTransfer", { in: "b", result: "b2" }, f); el("feFuncA", { type: "linear", slope: k }, ct);
    const m = el("feMerge", {}, f); el("feMergeNode", { in: "b2" }, m); el("feMergeNode", { in: "SourceGraphic" }, m); return `url(#${id})`; };
  C.blur = (svg, std) => { const id = "cb" + U++, f = el("filter", { id, x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs(svg)); el("feGaussianBlur", { in: "SourceGraphic", stdDeviation: std }, f); return `url(#${id})`; };
  C.sky = (svg, g, W, H, stops) => { const id = "cs" + U++, lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs(svg)); stops.forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, lg)); el("rect", { x: -W, y: -H, width: W * 3, height: H * 3, fill: `url(#${id})` }, g); };
  C.stars = (g, W, H, n, seed = 3) => { const R = SR.mulberry32(seed); for (let i = 0; i < n; i++) el("circle", { cx: R() * W, cy: R() * H, r: R() < 0.1 ? 2.2 : 1.1, fill: "#FFFFFF", opacity: 0.3 + R() * 0.6 }, g); };
  C.pool = (svg, g, x, y, rx, ry, color, k) => { const id = "cp" + U++, rg = el("radialGradient", { id }, defs(svg)); el("stop", { offset: 0, "stop-color": color, "stop-opacity": k }, rg); el("stop", { offset: 1, "stop-color": color, "stop-opacity": 0 }, rg); return el("ellipse", { cx: x, cy: y, rx, ry, fill: `url(#${id})`, style: "mix-blend-mode:screen" }, g); };
  C.glint = (g, x, y, s = 1, color = "#FFF6D8") => { const gg = el("g", { transform: `translate(${x},${y}) scale(${s})` }, g); el("path", { d: "M0,-26 C3,-6 6,-3 26,0 C6,3 3,6 0,26 C-3,6 -6,3 -26,0 C-6,-3 -3,-6 0,-26 Z", fill: color }, gg); el("circle", { r: 5, fill: "#FFFFFF" }, gg); return gg; };
  C.shaft = (svg, g, pts, color = "#FFE2A8", k = 0.22) => { const id = "sh" + U++, lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs(svg)); el("stop", { offset: 0, "stop-color": color, "stop-opacity": k }, lg); el("stop", { offset: 1, "stop-color": color, "stop-opacity": 0 }, lg); return el("polygon", { points: pts, fill: `url(#${id})`, style: "mix-blend-mode:screen" }, g); };
  window.CINE = C;
})();
