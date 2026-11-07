const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const tJ = T.theo_joke, tG = T.theo_joke_e + 0.05, tL = T.theo_joke_e + 0.75, tC = W("n09", "currency"), tR = W("n09", "rich");
const world = el("g", {}, svg);
const bg = el("g", {}, world), backK = el("g", {}, world), backT = el("g", {}, world), kidsL = el("g", {}, world), hero = el("g", {}, world), tabL = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.cafeteria(svg, bg, G, { time: "12:12", menuX: 1500, clockX: 2050, bannerX: -200 });
const BY = G - 140; const bTabs = [-700, 200, 1700]; const bxs = []; bTabs.forEach((x) => { for (let i = 0; i < 4; i++) bxs.push(x + 90 + i * 180); });
EP.kids(backK, { xs: bxs, y: BY, scale: 0.8, seed: 51, idp: "s5b", dur: D }); bTabs.forEach((x, i) => EP.table(backT, x, 1000, BY, 0.8, 50 + i));
const reacts = (i) => ({ mood: [[0, "content", 0], [tJ, "neutral", 0.3], [tG, "annoyed", 0.15], [tL + i * 0.08, "joy", 0.15], [tR + 1.2, "happy", 0.4]],
  pose: i === 1 ? [[0, "sit", 0], [tG, "facepalm", 0.15], [tL, "sit", 0.25]] : [[0, "sit", 0]], squash: [[tL + i * 0.08, 0], [tL + 0.15 + i * 0.08, 0.1], [tL + 0.35 + i * 0.08, -0.04], [tL + 0.55, 0.08], [tL + 0.8, 0]], talk: [] });
const tbl = EP.kids(kidsL, { xs: [620, 780, 1160, 1320], y: G + 60, scale: 1.0, seed: 57, idp: "s5k", quiet: true, facing: (i, x) => (x < 960 ? 1 : -1), spec: (i) => reacts(i) });
const theo = Character(hero, EP.cast("theo", { id: "s5-theo", x: [[0, 960]], y: [[0, G - 10]], noWalk: true, facing: [[0, 1], [tJ - 0.3, 1], [tJ - 0.1, -1], [tL, -1], [tL + 0.15, 1]],
  pose: [[0, "relaxed", 0], [T.n08 + 0.6, "proud", 0.3], [tJ, "point", 0.2], [tJ + 1.0, "shrug", 0.2], [tG, "hipsHands", 0.2], [tL, "proud", 0.3], [tC, "holdBoth", 0.3], [tR, "proud", 0.3]],
  mood: [[0, "content", 0], [tJ, "joy", 0.2], [tG, "surprised", 0.2], [tL, "joy", 0.2]], lips: [[tJ, "theo_joke"]] }));
EP.table(tabL, 460, 1000, G + 60, 1, 59);
const card = EP.LevelCard(hud, { n: 3, name: "THE FUNNY ONE", t0: T.n08, t1: T.n08 + 2.4 });
const ladder = EP.Ladder(hud, { hide: T.n08 + 3.2, level: [[0, 2], [T.n08 + 0.2, 2], [T.n08 + 0.9, 3, "out"]] });
const joke = Bubble(fx, { text: "Pop quiz? More like… pop QUIT.", t0: tJ, t1: T.theo_joke_e + 0.6, side: 1 });
const groan = el("g", { opacity: 0 }, fx); EP.txt(groan, 0, 0, "UGHHH", 60, "#6B6F7A", { font: "Outfit", attrs: { stroke: "#FFF", "stroke-width": 12, "paint-order": "stroke" } });
const haha = [0, 1, 2].map(() => { const g = el("g", { opacity: 0 }, fx); EP.txt(g, 0, 0, "HA HA HA", 50, PAL.rude, { font: "Outfit", attrs: { stroke: "#FFF", "stroke-width": 10, "paint-order": "stroke" } }); return g; });
const coins = [0, 1, 2, 3].map(() => { const g = el("g", { opacity: 0 }, fx); el("circle", { r: 30, fill: PAL.kind, stroke: PAL.ink, "stroke-width": 5 }, g); EP.txt(g, 0, 2, "LOL", 22, PAL.ink, { font: "Outfit" }); return g; });
const bank = el("g", { opacity: 0 }, fx); EP.txt(bank, 0, 0, "LAUGHS: 9,999", 46, PAL.ink, { font: "Outfit", attrs: { stroke: PAL.kind, "stroke-width": 14, "paint-order": "stroke" } });
const spark = FX.sparkles(fx);
const cam = Camera(world, [[0, { x: 960, y: 640, z: 1.25 }], [tJ - 0.2, { x: 960, y: 620, z: 1.55 }, "inOut"], [tG, { x: 1000, y: 600, z: 1.75 }, "out"], [tL, { x: 960, y: 640, z: 1.35 }, "out"], [D, { x: 960, y: 640, z: 1.3 }, "linear"]], { shake: [[tL, 0], [tL + 0.05, 5], [tL + 1.0, 0, "out"]] });
return (t) => {
  cam.update(t); const P = tbl.update(t); const th = theo.update(t);
  joke.update(t, { x: th.headX, y: th.headY });
  const kg = clamp((t - tG) / 0.7, 0, 1); groan.setAttribute("opacity", kg > 0 && kg < 1 ? 1 : 0); groan.setAttribute("transform", `translate(${th.headX - 360},${th.headY - 40}) scale(${0.8 + 0.3 * kg})`);
  haha.forEach((h, i) => { const k = clamp((t - tL - i * 0.25) / 1.2, 0, 1); h.setAttribute("opacity", k > 0 && k < 1 ? 1 - k * 0.6 : 0); h.setAttribute("transform", `translate(${[560, 1380, 900][i]},${G - 240 - k * 80 - i * 30}) rotate(${[-10, 8, -4][i]}) scale(${0.8 + 0.2 * Math.sin(t * 20)})`); });
  coins.forEach((c, i) => { const p = P[i], k = clamp((t - tC - i * 0.15) / 0.7, 0, 1); const x = p.headX + (th.handX - p.headX) * k, y = p.headY - 60 + (th.handY - p.headY + 60) * k - Math.sin(k * Math.PI) * 160; c.setAttribute("opacity", k > 0 && k < 1 ? 1 : 0); c.setAttribute("transform", `translate(${x},${y}) scale(${1 - 0.3 * k})`); });
  const kb = clamp((t - tR) / 0.3, 0, 1); bank.setAttribute("opacity", kb * (1 - clamp((t - D + 0.4) / 0.4, 0, 1))); bank.setAttribute("transform", `translate(${th.headX},${th.headY - 170}) scale(${EASE.back(kb)})`);
  spark.update(t, th.headX, th.headY - 20, tR, 130);
  card.update(t); ladder.update(t);
};
