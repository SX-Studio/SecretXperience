const D = T.D, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
el("rect", { x: -200, y: -200, width: 2320, height: 1480, fill: "#FBF7EC" }, world);
for (let y = 60; y < 1200; y += 56) el("line", { x1: -200, y1: y, x2: 2120, y2: y, stroke: "#BFD8E8", "stroke-width": 3 }, world);
el("line", { x1: 230, y1: -200, x2: 230, y2: 1280, stroke: "#E9A3A3", "stroke-width": 4 }, world);
[[120, 200], [120, 540], [120, 880]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 26, fill: "#E8E1D2", stroke: "#CFC6B6", "stroke-width": 3 }, world));
// doodles
const dood = el("g", { fill: "none", stroke: "#3F7F87", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }, world);
el("path", { d: "M1620,220 l0,300 M1680,220 l0,300 M1620,260 h60 M1620,320 h60 M1620,380 h60 M1620,440 h60 M1620,500 h60", stroke: PAL.rude }, dood);
el("path", { d: "M1580,170 l40,-60 l30,40 l30,-40 l30,40 l30,-40 l40,60 z", stroke: PAL.kind }, dood);
el("path", { d: "M330,830 l20,40 l44,6 l-32,30 l8,44 l-40,-22 l-40,22 l8,-44 l-32,-30 l44,-6 z", stroke: PAL.kind }, dood);
el("path", { d: "M1500,860 q60,-60 120,0 t120,0", stroke: "#8C5E78" }, dood);
const stamp = (txt, x, y, size, col, t0, rot) => { const g = el("g", { opacity: 0 }, world); const t = EP.txt(g, 0, 0, txt, size, col, { font: "Outfit", attrs: { stroke: "#FBF7EC", "stroke-width": 16, "paint-order": "stroke", "stroke-linejoin": "round" } }); return (tt) => { const k = clamp((tt - t0) / 0.28, 0, 1); g.setAttribute("opacity", k > 0 ? 1 : 0); g.setAttribute("transform", `translate(${x},${y}) rotate(${rot}) scale(${k < 1 ? 2.2 - 1.2 * EASE.out(k) : 1})`); }; };
const parts = [stamp("THE 7 LEVELS", 960, 330, 150, PAL.ink, 0.05, -3), stamp("OF SCHOOL POPULARITY", 960, 510, 108, "#2F6F73", 0.45, -1.5), stamp("(and who really decides them)", 960, 670, 64, PAL.rude, 1.0, 1.5)];
const ep = el("g", {}, world); EP.txt(ep, 960, 900, "SOCIAL RIPPLE · EPISODE 2", 40, "#8E8A86", { font: "Outfit" });
const bf = Butterfly(world, { x: [[0, 1880], [D, 1360]], y: [[0, 760], [D, 860]], scale: 0.9, flap: 3 });
const cam = Camera(world, [[0, { x: 960, y: 540, z: 1.06 }], [D, { x: 960, y: 560, z: 1.0 }, "out"]], { shake: [[0.05, 0], [0.12, 8], [0.4, 0], [0.48, 5], [0.7, 0]] });
return (t) => { cam.update(t); parts.forEach((p) => p(t)); ep.setAttribute("opacity", clamp((t - 1.4) / 0.4, 0, 1)); bf.update(t); };
