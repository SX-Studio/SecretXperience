const D = T.D, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const tB = W("n29", "small") - 0.3, tC = T.n30, tC1 = W("n30", "strongest") - 0.3, tRef = W("n31", "social"), tL5 = W("n31", "level"), tRum = W("n31", "rumors"), tNorm = W("n31", "normal");
const bgR = el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#F4EEE2" }, svg);
const A = el("g", {}, svg), B = el("g", { opacity: 0 }, svg), C3 = el("g", { opacity: 0 }, svg), hud = el("g", {}, svg);
// ---- A: New Jersey, 56 schools ----
const NJ = [[200, 40], [420, 120], [430, 260], [470, 300], [480, 420], [460, 560], [420, 700], [330, 860], [300, 900], [260, 820], [180, 760], [120, 700], [160, 600], [110, 520], [170, 440], [130, 360], [190, 300], [120, 200]];
const mapG = el("g", { transform: "translate(560,70) scale(1.05)" }, A);
el("path", { d: "M" + NJ.map((p) => p.join(",")).join(" L") + " Z", fill: "#CFE3D6", stroke: PAL.ink, "stroke-width": 7, "stroke-linejoin": "round" }, mapG);
EP.txt(A, 1400, 360, "NEW JERSEY", 60, "#2F6F73", { font: "Outfit", anchor: "start" });
const inPoly = (x, y) => { let c = false; for (let i = 0, j = NJ.length - 1; i < NJ.length; j = i++) { const [xi, yi] = NJ[i], [xj, yj] = NJ[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const R = mulberry32(56), dots = []; while (dots.length < 56) { const x = 110 + R() * 380, y = 40 + R() * 860; if (inPoly(x, y)) dots.push(el("circle", { cx: x, cy: y, r: 0, fill: "#2F6F73", stroke: PAL.ink, "stroke-width": 3 }, mapG)); }
const tF = W("n29", "fifty"); const lab = el("g", { opacity: 0 }, A); EP.txt(lab, 1400, 470, "56 middle schools", 56, PAL.ink, { font: "Outfit", anchor: "start" }); EP.txt(lab, 1400, 540, "24,191 students", 44, "#6B6F7A", { anchor: "start" });
// ---- B: one school as a network ----
const net = EP.Network(B, { cols: 13, rows: 7, x: 140, y: 140, w: 1640, h: 800, seed: 44 });
const hubs = net.N.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
const seed = [hubs[0], hubs[1] ?? 10, 30, 31].filter((x) => x != null);
const rings = seed.map(() => el("circle", { r: 0, fill: "none", stroke: PAL.kind, "stroke-width": 6 }, B));
const mega = el("g", { opacity: 0 }, B); el("path", { d: "M-30,-14 L20,-40 L20,40 L-30,14 Z M-44,-14 h14 v28 h-14 z", fill: PAL.kind, stroke: PAL.ink, "stroke-width": 4 }, mega);
const l5 = hubs.map((i) => EP.Tag(B, { t0: tL5, t1: D, texts: [[0, "LV 5", PAL.rude]], lift: 0, size: 30 }));
// ---- C: the result ----
el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "rgba(244,238,226,0.85)" }, C3);
const card = el("g", {}, C3); el("rect", { x: 460, y: 120, width: 1000, height: 820, rx: 30, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 7 }, card);
EP.txt(card, 960, 200, "Conflict reports after 1 year", 50, PAL.ink, { font: "Outfit" });
el("line", { x1: 560, y1: 820, x2: 1360, y2: 820, stroke: PAL.ink, "stroke-width": 5 }, card);
const bar1 = el("rect", { x: 620, width: 260, rx: 10, fill: "#6F8299", stroke: PAL.ink, "stroke-width": 5 }, card), bar2 = el("rect", { x: 1040, width: 260, rx: 10, fill: PAL.kind, stroke: PAL.ink, "stroke-width": 5 }, card);
EP.txt(card, 750, 870, "Normal schools", 34, PAL.ink); EP.txt(card, 1170, 870, "Students took a stand", 34, PAL.ink);
const minus = el("g", { opacity: 0 }, card); EP.txt(minus, 0, 0, "−30%", 110, PAL.rude, { font: "Outfit", attrs: { stroke: "#FFFFFF", "stroke-width": 14, "paint-order": "stroke" } });
const src = EP.Source(hud, { text: "Paluck, Shepherd & Aronow (2016), PNAS · 56 New Jersey middle schools", t0: T.n29 + 1.5, t1: D - 0.2 });
const camB = Camera(B, [[tB, { x: 960, y: 540, z: 1.25 }], [tC, { x: 960, y: 540, z: 1.0 }, "out"], [D, { x: 960, y: 540, z: 1.05 }, "linear"]]);
return (t) => {
  const kb = clamp((t - tB) / 0.4, 0, 1), kc = clamp((t - tC) / 0.35, 0, 1) * (1 - clamp((t - tC1) / 0.35, 0, 1));
  A.setAttribute("opacity", 1 - kb); A.setAttribute("transform", `translate(960,540) scale(${1 + 1.5 * EASE.in(kb)}) translate(-960,-540)`); B.setAttribute("opacity", kb); C3.setAttribute("opacity", kc);
  dots.forEach((d, i) => { const k = clamp((t - tF - i * 0.03) / 0.25, 0, 1); d.setAttribute("r", 11 * EASE.back(k)); d.setAttribute("fill", t > W("n29", "took") ? PAL.kind : "#2F6F73"); });
  lab.setAttribute("opacity", clamp((t - tF - 0.6) / 0.4, 0, 1));
  camB.update(t);
  net.update(t, [{ src: seed[0], t0: tB + 0.6, speed: 0.0, cap: 0, color: PAL.kind }, { src: seed[1], t0: tB + 0.7, speed: 0, cap: 0, color: PAL.kind }, { src: seed[2], t0: tB + 0.8, speed: 0, cap: 0, color: PAL.kind }, { src: seed[3], t0: tB + 0.9, speed: 0, cap: 0, color: PAL.kind },
    { src: 47, t0: tRum, speed: 0.12, cap: 2, color: PAL.rude }, ...hubs.map((h, i) => ({ src: h, t0: tNorm + i * 0.1, speed: 0.22, color: PAL.kind }))]);
  seed.forEach((s, i) => { const n = net.N[s]; const k = ((t - tB - 0.6) % 1.4) / 1.4; rings[i].setAttribute("cx", n.x); rings[i].setAttribute("cy", n.y); rings[i].setAttribute("r", t > tB + 0.6 ? 20 + 50 * k : 0); rings[i].setAttribute("opacity", 1 - k); });
  const n0 = net.N[seed[0]], km = clamp((t - W("n29", "stand")) / 0.3, 0, 1); mega.setAttribute("opacity", km); mega.setAttribute("transform", `translate(${n0.x + 60},${n0.y - 50}) scale(${1.4 * EASE.back(km)}) rotate(${-15 + Math.sin(t * 8) * 6})`);
  hubs.forEach((h, i) => l5[i].update(t, { x: net.N[h].x, y: net.N[h].y - 60 }));
  const kr = clamp((t - tC - 0.5) / 0.8, 0, 1), kd = clamp((t - W("n30", "thirty") + 0.2) / 0.8, 0, 1);
  const h1 = 520 * EASE.out(kr), h2 = 520 * EASE.out(kr) * (1 - 0.3 * EASE.inOut(kd));
  bar1.setAttribute("y", 820 - h1); bar1.setAttribute("height", h1); bar2.setAttribute("y", 820 - h2); bar2.setAttribute("height", h2);
  const km2 = clamp((t - W("n30", "thirty") - 0.5) / 0.3, 0, 1); minus.setAttribute("opacity", km2); minus.setAttribute("transform", `translate(1170,${820 - h2 - 90}) scale(${km2 ? 1.6 - 0.6 * EASE.out(km2) : 1})`);
  src.update(t);
};
