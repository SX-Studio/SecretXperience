const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const t2 = T.n20 - 0.3, t3 = T.n21 - 0.2, tR = W("n21", "researchers"), tN = W("n21", "new", 0, 0.85);
const A = el("g", {}, svg), Bp = el("g", { opacity: 0 }, svg), C3 = el("g", { opacity: 0 }, svg), hud = el("g", {}, svg);
// ---- A: the town at night, phones lighting windows ----
Scene2.sky(svg, A, "night", 1920, 1080, { x: 1600, y: 170, r: 60, color: "#DCE6F5", core: "#F4F6FB" });
const town = el("g", {}, A);
const R = mulberry32(5), wins = [];
for (let i = 0; i < 7; i++) { const x = -40 + i * 290, h = 360 + R() * 220, c = ["#3A4763", "#4A4060", "#35505A"][i % 3];
  el("rect", { x, y: G - h, width: 250, height: h, fill: c, stroke: PAL.ink, "stroke-width": 5 }, town);
  el("path", { d: `M${x - 20},${G - h} L${x + 125},${G - h - 110} L${x + 270},${G - h} Z`, fill: EP.shade(c, -0.3), stroke: PAL.ink, "stroke-width": 5 }, town);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) { const w = el("rect", { x: x + 40 + k * 100, y: G - h + 60 + r * 140, width: 70, height: 90, fill: "#2A3045", stroke: PAL.ink, "stroke-width": 4 }, town); wins.push({ w, t: T.n19 + 1.0 + R() * (t2 - T.n19 - 1.2) }); } }
el("rect", { x: -200, y: G, width: 2400, height: 400, fill: "#232A3B" }, town);
const clock = el("g", {}, A); el("rect", { x: 660, y: 70, width: 600, height: 150, rx: 20, fill: "rgba(14,13,16,0.75)" }, clock); EP.txt(clock, 960, 120, "TUESDAY", 40, "#BFD8E8", { font: "Outfit" }); EP.txt(clock, 960, 178, "9:04 PM", 66, "#FFFFFF", { font: "Outfit" });
const camA = Camera(town, [[0, { x: 960, y: 600, z: 1.0 }], [t2, { x: 960, y: 640, z: 1.15 }, "inOut"]]);
// ---- B: the message ----
el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#1C2233" }, Bp);
const reacts = ["💀💀💀", "NO WAYYY", "i KNEW it", "screenshot this 📸", "😭😭😭", "who saw them??", "fr fr"];
const msgs = [[T.n20 + 0.05, "Priya", "jordan's new sneakers are FAKE 💀", "#9A8AB0"]];
reacts.forEach((r, i) => msgs.push([W("n20", "nobody") - 0.6 + i * 0.42, ["Dev", "Theo", "Kyle", "Ava", "Sam", "Leo", "Mia"][i], r, ["#C2A27A", "#E58A3A", "#6F8299", "#D98C8C", "#4F7FB0", "#A5B86A", "#8C5E78"][i]]));
const phone = EP.Phone(Bp, { x: 960, y: 560, s: 0.95, title: "grade 9 🔥 (148)", msgs });
const chk = el("g", { opacity: 0 }, Bp); el("rect", { x: -190, y: -42, width: 380, height: 84, rx: 42, fill: "#6B6F7A", stroke: PAL.ink, "stroke-width": 5 }, chk); EP.txt(chk, 0, 2, "FACT-CHECK: 0", 40, "#E5DED0", { font: "Outfit" });
// ---- C: the network + truth-vs-rumour race ----
el("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#F4EEE2" }, C3);
const netG = el("g", {}, C3);
const net = EP.Network(netG, { cols: 13, rows: 7, x: 140, y: 180, w: 1640, h: 760, seed: 31 });
const src = Math.floor(net.N.length / 2) + 2;
const count = el("g", {}, C3); el("rect", { x: 620, y: 40, width: 680, height: 110, rx: 24, fill: PAL.ink }, count); const ct = EP.txt(count, 960, 96, "", 56, "#FFFFFF", { font: "Outfit" });
const race = el("g", { opacity: 0 }, C3); el("rect", { x: 980, y: 300, width: 860, height: 520, rx: 26, fill: "#FFFFFF", stroke: PAL.ink, "stroke-width": 6 }, race);
EP.txt(race, 1410, 360, "How far it spreads", 44, PAL.ink, { font: "Outfit" });
EP.txt(race, 1020, 480, "TRUTH", 44, "#3F7F87", { font: "Outfit", anchor: "start" }); EP.txt(race, 1020, 650, "RUMOR", 44, PAL.rude, { font: "Outfit", anchor: "start" });
const bT = el("rect", { x: 1200, y: 452, width: 0, height: 56, rx: 12, fill: "#3F7F87", stroke: PAL.ink, "stroke-width": 4 }, race), bR = el("rect", { x: 1200, y: 622, width: 0, height: 56, rx: 12, fill: PAL.rude, stroke: PAL.ink, "stroke-width": 4 }, race);
const nb = el("g", { opacity: 0 }, race); el("path", { d: "M0,-50 L12,-16 L48,-16 L20,6 L30,42 L0,20 L-30,42 L-20,6 L-48,-16 L-12,-16 Z", fill: PAL.kind, stroke: PAL.ink, "stroke-width": 4 }, nb); EP.txt(nb, 0, 4, "NEW", 22, PAL.ink, { font: "Outfit" });
const srcC = EP.Source(hud, { text: "Vosoughi, Roy & Aral (2018), Science · ~126,000 stories on Twitter", t0: tR + 0.4, t1: D - 0.2 });
return (t) => {
  camA.update(t);
  wins.forEach((w) => { const on = t > w.t; w.w.setAttribute("fill", on ? "#7FB8E8" : "#2A3045"); });
  const kb = clamp((t - t2) / 0.3, 0, 1), kc = clamp((t - t3) / 0.3, 0, 1);
  A.setAttribute("opacity", 1 - kb); Bp.setAttribute("opacity", kb * (1 - kc)); C3.setAttribute("opacity", kc);
  phone.update(t, { z: 1 + 0.15 * EASE.out(clamp((t - T.n20) / 0.5, 0, 1)), shake: t > T.n20 && t < T.n20 + 0.4 ? 1 : 0 });
  const kk = clamp((t - W("n20", "nobody", 0)) / 0.3, 0, 1); chk.setAttribute("opacity", kk); chk.setAttribute("transform", `translate(960,${1000})`);
  const shrink = clamp((t - tR + 0.3) / 0.6, 0, 1);
  netG.setAttribute("transform", `translate(${-40 * shrink},${260 * shrink}) scale(${1 - 0.45 * shrink})`);
  net.update(t, [{ src, t0: T.n21 + 0.2, speed: 0.32, color: PAL.rude }]);
  const shots = t < T.n21 + 0.2 ? 1 : t < W("n21", "ten", 0, 0.2) ? 1 : t < W("n21", "ten", 1, 0.35) ? 10 : Math.round(10 + 138 * clamp((t - W("n21", "ten", 1, 0.35)) / 1.2, 0, 1));
  ct.textContent = "screenshots: " + shots; count.setAttribute("opacity", 1 - shrink);
  race.setAttribute("opacity", shrink); const kr = clamp((t - tR - 0.6) / 2.5, 0, 1); bT.setAttribute("width", 260 * EASE.out(kr)); bR.setAttribute("width", 600 * EASE.out(kr));
  const kn = clamp((t - tN) / 0.3, 0, 1); nb.setAttribute("opacity", kn); nb.setAttribute("transform", `translate(${1200 + 600 * EASE.out(kr) + 40},650) scale(${EASE.back(kn) * 1.4}) rotate(${Math.sin(t * 6) * 8})`);
  srcC.update(t);
};
