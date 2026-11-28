const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const t1 = W("n36", "forward"), t2 = W("n36", "learn"), t3 = W("n36", "sit"), tC = T.n37, tOut = T.n38, tEnd = T.n38_e + 0.4;
const A = el("g", {}, svg), Bx = el("g", { opacity: 0 }, svg), hud = el("g", {}, svg);
const world = el("g", {}, A);
const bg = el("g", {}, world), backK = el("g", {}, world), backT = el("g", {}, world), chairL = el("g", {}, world), kidsL = el("g", {}, world), tabL = el("g", {}, world), fx = el("g", {}, world);
EP.cafeteria(svg, bg, G, { time: "12:10", menu: "Pizza Friday!", menuX: 1700, clockX: 2250 });
const BY = G - 140; const bTabs = [-500, 1500]; const bxs = []; bTabs.forEach((x) => { for (let i = 0; i < 4; i++) bxs.push(x + 90 + i * 180); });
EP.kids(backK, { xs: bxs, y: BY, scale: 0.8, seed: 161, idp: "s16b", dur: D, spec: () => ({ mood: [[0, "happy", 0]] }) }).people.forEach(() => {});
const backKids = { update: () => {} };
bTabs.forEach((x, i) => EP.table(backT, x, 1000, BY, 0.8, 160 + i));
const who = ["eli", "theo", "jordan", "nia", "marcus", "priya", "dev"];
const XS = [160, 310, 460, 610, 760, 910, 1060];
XS.forEach((x) => EP.chair(chairL, x - 12, G + 40, 1, "#C9A227").set(0, 0));
const crew = who.map((w, i) => { const base = w === "eli" ? { color: "#A5B86A", outfit: "hoodie", hair: "short", hairColor: "#8A5A35", glasses: true, pants: "#3A4A63", seed: 92, scale: 0.9 } : EP.cast(w, {});
  return Character(kidsL, Object.assign({}, base, { id: "s16-" + w, x: [[0, x0(i)]], y: [[0, G + 40]], noWalk: true, facing: [[0, i < 3 ? 1 : -1]], pose: [[0, w === "priya" ? "sit" : "sit", 0], [1.2 + i * 0.3, i % 2 ? "shrug" : "sit", 0.3], [2.4 + i * 0.3, "sit", 0.3]],
    mood: [[0, "happy", 0], [0.6 + i * 0.4, "joy", 0.2], [1.6 + i * 0.4, "happy", 0.3]], squash: [[0.6 + i * 0.4, 0], [0.75 + i * 0.4, 0.08], [0.95 + i * 0.4, 0]] })); });
function x0(i) { return XS[i]; }
EP.table(tabL, 80, 1100, G + 40, 1, 165, { top: "#F2D28A" });
const sign = el("g", {}, tabL); el("rect", { x: 460, y: G - 66, width: 300, height: 48, rx: 10, fill: "#3F7F87", stroke: PAL.ink, "stroke-width": 4 }, sign); EP.txt(sign, 610, G - 41, "ANYONE TABLE", 30, "#FFFFFF", { font: "Outfit" });
const spark = FX.sparkles(fx), hearts = FX.hearts(fx);
const haha = el("g", { opacity: 0 }, fx); EP.txt(haha, 0, 0, "HA HA HA", 54, "#C9A227", { font: "Outfit", attrs: { stroke: "#FFF", "stroke-width": 10, "paint-order": "stroke" } });
// checklist card
const list = el("g", { opacity: 0 }, hud);
el("rect", { x: 1060, y: 170, width: 780, height: 470, rx: 28, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 7 }, list);
EP.txt(list, 1450, 235, "THIS WEEK'S SIDE QUEST", 44, "#2F6F73", { font: "Outfit" });
const items = [["Don't forward one rumor", t1], ["Learn one Level 1's name", t2], ["Sit somewhere new", t3]].map(([s, t0], i) => { const y = 330 + i * 100; el("rect", { x: 1110, y: y - 30, width: 60, height: 60, rx: 10, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 5 }, list); EP.txt(list, 1200, y, s, 42, PAL.ink, { anchor: "start", weight: 900 }); const ck = el("path", { d: `M1120,${y} l18,20 l36,-46`, fill: "none", stroke: PAL.kind, "stroke-width": 12, "stroke-linecap": "round", "stroke-linejoin": "round" }, list); return [ck, t0 + 0.6]; });
const cmt = el("g", { opacity: 0 }, hud);
el("rect", { x: 1060, y: 680, width: 780, height: 200, rx: 28, fill: PAL.ink }, cmt);
EP.txt(cmt, 1450, 750, "Which level were you?", 52, "#FFFFFF", { font: "Outfit" }); EP.txt(cmt, 1450, 825, "Tell us in the comments 👇", 40, PAL.kind, { weight: 900 });
// ---- Bx: exterior zoom-out with the gold network ----
Scene2.sky(svg, Bx, "noon", 1920, 1080, { x: 1650, y: 160, r: 70 });
const ext = el("g", {}, Bx);
el("rect", { x: -800, y: G, width: 3600, height: 600, fill: "#8DB07A" }, ext);
for (let i = 0; i < 7; i++) Scene2.tree(ext, -500 + i * 420 + (i > 2 ? 700 : 0), G, 0.9, "#5E8F5F");
EP.exterior(svg, ext, G);
const lines = el("g", {}, ext); const pts = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) pts.push([410 + i * 160, G - 410 + r * 190]);
const segs = []; pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 260) segs.push([el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: PAL.kind, "stroke-width": 6, opacity: 0 }, lines), Math.abs(a[0] - 410 - 160 * 3) / 160 * 0.25]); }));
const bf = Butterfly(ext, { x: [[tOut, 960], [D, 1500]], y: [[tOut, G - 300], [D, 220]], scale: 1.3, flap: 3 });
const endT = el("g", { opacity: 0 }, hud);
el("rect", { x: 560, y: 760, width: 800, height: 210, rx: 30, fill: "rgba(30,27,34,0.85)" }, endT);
EP.txt(endT, 960, 830, "SOCIAL RIPPLE", 74, "#FFFFFF", { font: "Outfit" }); EP.txt(endT, 960, 910, "Make it ripple.", 46, PAL.kind, { weight: 900 });
const camA = Camera(world, [[0, { x: 620, y: 700, z: 1.55 }], [t1 - 0.6, { x: 900, y: 640, z: 1.25 }, "inOut"], [tOut, { x: 900, y: 640, z: 1.2 }, "linear"]]);
const camB = Camera(ext, [[tOut, { x: 960, y: 640, z: 2.4 }], [tOut + 5, { x: 960, y: 560, z: 1.0 }, "inOut"], [D, { x: 960, y: 540, z: 0.95 }, "linear"]]);
return (t) => {
  camA.update(t); camB.update(t);
  const ps = crew.map((c) => c.update(t));
  const kh = clamp((t - 0.5) / 1.8, 0, 1); haha.setAttribute("opacity", kh > 0 && kh < 1 ? 1 : 0); haha.setAttribute("transform", `translate(610,${G - 270 - kh * 60}) rotate(-6)`);
  spark.update(t, ps[3].headX, ps[3].headY, 1.0, 120); hearts.update(t, ps[2].headX, ps[2].headY - 40, 2.0);
  const kl = clamp((t - (t1 - 0.8)) / 0.4, 0, 1) * (1 - clamp((t - tOut) / 0.4, 0, 1)); list.setAttribute("opacity", kl); list.setAttribute("transform", `translate(${60 * (1 - kl)},0)`);
  items.forEach(([ck, t0]) => { const k = clamp((t - t0) / 0.3, 0, 1); ck.setAttribute("stroke-dasharray", "120"); ck.setAttribute("stroke-dashoffset", 120 * (1 - k)); });
  const kc = clamp((t - tC) / 0.4, 0, 1) * (1 - clamp((t - tOut) / 0.4, 0, 1)); cmt.setAttribute("opacity", kc); cmt.setAttribute("transform", `translate(0,${40 * (1 - kc)})`);
  const kx = clamp((t - tOut) / 0.6, 0, 1); A.setAttribute("opacity", 1 - kx); Bx.setAttribute("opacity", kx);
  segs.forEach(([l, d]) => l.setAttribute("opacity", clamp((t - tOut - 1.2 - d) / 0.4, 0, 1) * 0.9));
  bf.update(t);
  endT.setAttribute("opacity", clamp((t - tEnd) / 0.6, 0, 1));
};
