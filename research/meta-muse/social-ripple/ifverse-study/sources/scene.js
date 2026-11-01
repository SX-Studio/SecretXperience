window.buildRippleScene = function (svg, W, H, o) {
  const SR = window.SR, C = window.CINE, EP = window.EP; const { el, Character, PAL } = SR;
  const HZ = o.horizon, cx = o.cx;
  const sky = el("g", {}, svg); C.sky(svg, sky, W, H, [[0, "#0B0918"], [0.4, "#24183F"], [0.66, "#5A2A5C"], [0.8, "#C96A52"], [0.86, "#F2A25E"], [1, "#0D0A14"]]);
  C.stars(sky, W, HZ - 60, o.stars || 260, 9);
  if (o.moon) { C.pool(svg, sky, o.moon[0], o.moon[1], o.moon[2] * 4, o.moon[2] * 4, "#FFE9C4", 0.3); el("circle", { cx: o.moon[0], cy: o.moon[1], r: o.moon[2], fill: "#FFF1D6" }, sky); el("circle", { cx: o.moon[0] + o.moon[2] * 0.45, cy: o.moon[1] - o.moon[2] * 0.3, r: o.moon[2] * 0.92, fill: "#1D1533" }, sky); }
  C.pool(svg, sky, cx, HZ, W * 0.45, H * 0.16, "#FFB070", 0.55);
  // skyline silhouette with warm windows
  const city = el("g", { filter: C.blur(svg, o.cityBlur ?? 1.2) }, svg), R = SR.mulberry32(21);
  for (let x = -40; x < W + 40;) { const w = (60 + R() * 90) * o.s, h = (40 + R() * (R() < 0.15 ? 260 : 150)) * o.s; el("rect", { x, y: HZ - h, width: w, height: h + 2, fill: "#120D20" }, city);
    for (let r = 0; r < h / (22 * o.s) - 1; r++) for (let c = 0; c < w / (18 * o.s) - 1; c++) if (R() < 0.22) el("rect", { x: x + (6 + c * 18) * o.s, y: HZ - h + (8 + r * 22) * o.s, width: 8 * o.s, height: 11 * o.s, fill: R() < 0.75 ? "#FFC56B" : "#8FE0FF", opacity: 0.8 }, city);
    x += w + R() * 6 * o.s; }
  // water
  const water = el("g", {}, svg); const wid = "wg" + Math.random().toString(36).slice(2);
  const lg = el("linearGradient", { id: wid, x1: 0, y1: 0, x2: 0, y2: 1 }, svg.querySelector("defs") || el("defs", {}, svg)); [[0, "#3A2141"], [0.25, "#1A1226"], [1, "#07060C"]].forEach(([a, c]) => el("stop", { offset: a, "stop-color": c }, lg));
  el("rect", { x: 0, y: HZ, width: W, height: H - HZ, fill: `url(#${wid})` }, water);
  const refl = el("g", { filter: C.blur(svg, 6 * o.s), opacity: 0.5 }, water); for (let i = 0; i < 26; i++) { const x = R() * W; el("rect", { x, y: HZ + 6 * o.s + R() * 30 * o.s, width: (20 + R() * 60) * o.s, height: 4 * o.s, fill: R() < 0.7 ? "#FFC56B" : "#8FE0FF" }, refl); }
  // gold ripples spreading from the figure's feet (perspective ellipses), with bloom
  const fy = o.feetY, rip = el("g", { filter: C.bloom(svg, 8 * o.s, 1.6) }, svg);
  for (let k = 0; k < o.rings; k++) { const r = (o.r0 + k * o.dr) * o.s; el("ellipse", { cx, cy: fy, rx: r, ry: r * 0.22, fill: "none", stroke: k % 2 ? "#FFD27A" : PAL.kind, "stroke-width": Math.max(1.5, (6 - k * 0.6) * o.s), opacity: Math.max(0.12, 0.95 - k * 0.12) }, rip); }
  C.pool(svg, rip, cx, fy, o.r0 * 3 * o.s, o.r0 * 0.8 * o.s, "#FFC56B", 0.6);
  // the figure: Nia, small, standing on the water at the ripple's centre, dual rim light
  const fg = el("g", {}, svg);
  const outer = el("g", { filter: C.rim(svg, "#8FE8FF", -5 * o.s, -1, 1.2 * o.s, 0.3) }, fg), inner = el("g", { filter: C.rim(svg, "#FFB04A", 5 * o.s, -2, 1.3 * o.s, 0.5) }, outer);
  const n = Character(inner, EP.cast("nia", { id: "br-n", scale: o.figScale, x: [[0, cx]], y: [[0, fy]], noWalk: true, facing: [[0, o.facing || 1]], pose: [[0, o.pose || "relaxed", 0]], mood: [[0, "happy", 0]], look: [[0, { x: 0.3, y: -0.6 }]] }));
  const p = n.update(0.3);
  // butterfly, glowing
  const bfl = el("g", { filter: C.bloom(svg, 4 * o.s, 1.3) }, svg); SR.Butterfly(bfl, { x: [[0, o.bf[0]]], y: [[0, o.bf[1]]], scale: o.bf[2], flap: 2 }).update(0.2);
  const post = el("g", {}, svg); C.pool(svg, post, cx, fy - 40 * o.s, 300 * o.s, 200 * o.s, "#FFB060", 0.15);
  return { p };
};
