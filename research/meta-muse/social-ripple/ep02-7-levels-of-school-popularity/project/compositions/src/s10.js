const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const tB = T.n18 - 0.25;  // switch to camp
const A = el("g", {}, svg), B = el("g", { opacity: 0 }, svg), hud = el("g", {}, svg);
// ---- A: classroom whiteboard ----
const wa = el("g", {}, A);
el("rect", { x: -200, y: -200, width: 2320, height: 1480, fill: "#E8DFC9" }, wa);
el("rect", { x: -200, y: 940, width: 2320, height: 400, fill: "#C9B49A" }, wa);
el("rect", { x: 140, y: 80, width: 1640, height: 820, rx: 16, fill: "#FDFDFB", stroke: "#8E8A86", "stroke-width": 14 }, wa);
el("rect", { x: 160, y: 880, width: 1600, height: 22, rx: 6, fill: "#B9C2C9", stroke: PAL.ink, "stroke-width": 3 }, wa);
[[300, "#2F6F73"], [360, PAL.rude], [420, "#2F3E5C"]].forEach(([x, c]) => el("rect", { x, y: 868, width: 50, height: 14, rx: 4, fill: c }, wa));
const wr = [];
const Wt = (o) => { const w = EP.Write(wa, o); wr.push(w); return w; };
Wt({ x: 960, y: 170, text: "TWO KINDS OF POPULAR", size: 76, t0: W("n16", "two"), dur: 0.8, font: "Outfit" });
el("path", { d: "M960,250 V840", stroke: "#BDB4A4", "stroke-width": 5, "stroke-dasharray": "16 12" }, wa);
Wt({ x: 560, y: 300, text: "STATUS", size: 84, color: PAL.rude, t0: W("n17", "status"), dur: 0.5, font: "Outfit" });
Wt({ x: 1360, y: 300, text: "LIKEABILITY", size: 84, color: "#C9A227", t0: W("n17", "likeability"), dur: 0.6, font: "Outfit" });
[["👁  seen", "being"], ["⚡  powerful", "powerful"], ["🗣  talked about", "talked"]].forEach(([s, w], i) => Wt({ x: 330, y: 450 + i * 130, text: s, size: 58, anchor: "start", t0: W("n17", w), dur: 0.5 }));
[["😊  enjoyed", "enjoying"], ["🤝  trusted", "trusting"], ["🫂  included", "included"]].forEach(([s, w], i) => Wt({ x: 1120, y: 450 + i * 130, text: s, size: 58, anchor: "start", t0: W("n17", w), dur: 0.5 }));
const src1 = EP.Source(hud, { text: "Mitch Prinstein, Popular (2017) · UNC psychology", t0: T.n16 + 1.0, t1: tB - 0.3 });
// ---- B: summer camp at dusk ----
Scene2.sky(svg, B, "evening", 1920, 1080, { x: 1500, y: 300, r: 80 });
const world = el("g", {}, B);
el("rect", { x: -400, y: G - 40, width: 2800, height: 600, fill: "#6E8B5A" }, world);
for (let i = 0; i < 9; i++) Scene2.tree(world, -200 + i * 300, G - 40, 0.9 + (i % 3) * 0.15, "#3E6B4A");
const tent = (x, c) => { el("path", { d: `M${x - 160},${G + 60} L${x},${G - 170} L${x + 160},${G + 60} Z`, fill: c, stroke: PAL.ink, "stroke-width": 6 }, world); el("path", { d: `M${x},${G - 170} L${x - 40},${G + 60} L${x + 40},${G + 60} Z`, fill: EP.shade(c, -0.35), stroke: PAL.ink, "stroke-width": 4 }, world); };
tent(260, "#E58A3A"); tent(1660, "#4F7FB0");
const fire = el("g", { transform: `translate(960,${G + 90})` }, world);
el("path", { d: "M-60,10 L60,-10 M-60,-10 L60,10", stroke: "#7A5238", "stroke-width": 16, "stroke-linecap": "round" }, fire);
const flame = el("path", { fill: "#F2B33D", stroke: PAL.ink, "stroke-width": 4 }, fire);
const campers = [];
const order = [3, 0, 5, 1, 4, 2];  // final left-to-right rank order
for (let i = 0; i < 6; i++) campers.push(Character(world, { id: "s10-c" + i, color: ["#E58A3A", "#4F7FB0", "#9DB49A", "#D98C8C", "#9A8AB0", "#C2A27A"][i], outfit: ["tee", "hoodie", "tee", "jacket", "tee", "hoodie"][i], hair: ["cap", "short", "curly", "spiky", "none", "short"][i], hairColor: "#3B2B22", seed: 300 + i, scale: 0.92,
  x: [[0, 380 + i * 230], [W("n18", "pecking"), 380 + i * 230], [W("n18", "pecking") + 1.4, 380 + order.indexOf(i) * 230, "inOut"]], y: [[0, G + 120]], pose: [[0, "relaxed", 0]], mood: [[0, ["content", "worried", "happy", "neutral", "joy", "content"][i], 0]] }));
const badges = campers.map((c, i) => Badge(world, { text: String(order.indexOf(i) + 1), t0: W("n18", "pecking") + 1.5 + order.indexOf(i) * 0.1, color: ["#C9A227", "#6F8299", "#6F8299", "#6F8299", "#6F8299", "#6F8299"][order.indexOf(i)], r: 30 }));
const cal = el("g", {}, hud); el("rect", { x: 1560, y: 90, width: 260, height: 240, rx: 18, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 6 }, cal); el("rect", { x: 1560, y: 90, width: 260, height: 70, rx: 18, fill: PAL.rude, stroke: PAL.ink, "stroke-width": 6 }, cal);
EP.txt(cal, 1690, 126, "CAMP", 40, "#FFFFFF", { font: "Outfit" }); const day = EP.txt(cal, 1690, 250, "DAY 1", 64, PAL.ink, { font: "Outfit" });
const t3 = W("n18", "three", 0), t3b = W("n18", "three", 2, 0.6);
const stamp = el("g", { opacity: 0 }, hud); el("rect", { x: -260, y: -70, width: 520, height: 140, rx: 14, fill: "none", stroke: PAL.rude, "stroke-width": 10 }, stamp); EP.txt(stamp, 0, 4, "ONLY 3 DAYS!", 70, PAL.rude, { font: "Outfit" });
const wifi = el("g", { opacity: 0 }, hud); el("rect", { x: -300, y: -80, width: 600, height: 160, rx: 20, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 6 }, wifi);
EP.txt(wifi, 0, -30, "Wi-Fi password: ••••••••", 40, PAL.ink); el("rect", { x: -240, y: 20, width: 480, height: 26, rx: 13, fill: "#E5DED0", stroke: PAL.ink, "stroke-width": 3 }, wifi); const bar = el("rect", { x: -238, y: 22, width: 0, height: 22, rx: 11, fill: "#3F7F87" }, wifi);
const src2 = EP.Source(hud, { text: "Savin-Williams (1977), Animal Behaviour · 13-year-olds at summer camp", t0: tB + 1.0, t1: D - 0.3 });
const camA = Camera(wa, [[0, { x: 960, y: 520, z: 1.05 }], [T.n17, { x: 960, y: 500, z: 1.0 }, "inOut"], [tB, { x: 960, y: 500, z: 1.02 }, "linear"]]);
const camB = Camera(world, [[tB, { x: 1200, y: 760, z: 1.3 }], [D, { x: 960, y: 760, z: 1.15 }, "out"]]);
return (t) => {
  camA.update(t); camB.update(t); wr.forEach((w) => w.update(t));
  const kb = clamp((t - tB) / 0.35, 0, 1); A.setAttribute("opacity", 1 - kb); B.setAttribute("opacity", kb); A.setAttribute("transform", `translate(${-200 * kb},0)`);
  const f = Math.sin(t * 13) * 6, f2 = Math.cos(t * 17) * 5; flame.setAttribute("d", `M-40,0 Q-50,${-60 + f} -10,${-110 + f2} Q-5,-70 10,${-130 - f} Q50,${-60 - f2} 40,0 Z`);
  const cs = campers.map((c) => c.update(t)); badges.forEach((b, i) => b.update(t, { x: cs[i].headX, y: cs[i].headY + 10 }));
  const dd = t < tB + 0.8 ? 1 : t < t3 - 0.5 ? 2 : 3; day.textContent = "DAY " + dd; cal.setAttribute("opacity", kb); cal.setAttribute("transform", `rotate(${t > t3 - 0.6 && t < t3 ? Math.sin(t * 50) * 4 : 0},1690,210)`);
  const ks = clamp((t - t3b) / 0.3, 0, 1); stamp.setAttribute("opacity", ks * (1 - clamp((t - W("n18", "wifi") + 0.3) / 0.3, 0, 1))); stamp.setAttribute("transform", `translate(960,250) rotate(-6) scale(${ks > 0 ? 2 - EASE.out(ks) : 1})`);
  const kw = clamp((t - W("n18", "wifi") + 0.3) / 0.3, 0, 1); wifi.setAttribute("opacity", kw * (1 - clamp((t - D + 0.4) / 0.3, 0, 1))); wifi.setAttribute("transform", `translate(960,470) scale(${EASE.back(kw)})`); bar.setAttribute("width", 476 * Math.min(0.93, clamp((t - W("n18", "wifi")) / 1.2, 0, 1)));
  src1.update(t); src2.update(t);
};
