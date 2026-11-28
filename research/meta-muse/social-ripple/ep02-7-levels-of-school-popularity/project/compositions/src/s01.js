const D = T.D, G = 900, tTurn = T.n02_e - 0.2, niaX = 560;
const world = el("g", {}, svg);
const bg = el("g", {}, world), backK = el("g", {}, world), backT = el("g", {}, world), mid = el("g", {}, world), frontK = el("g", {}, world), frontT = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.cafeteria(svg, bg, G, { time: "12:05" });
Set.door(bg, -560, G - 300, "#7A5238"); Set.door(bg, -420, G - 300, "#7A5238");
const BY = G - 140, BS = 0.8;
const bTabs = [-1100, -230, 640, 1510, 2380];
const bxs = []; bTabs.forEach((x) => { for (let i = 0; i < 4; i++) bxs.push(x + 90 + i * 180 + (i % 2) * 10); });
const side = (i, x) => (x < niaX ? 1 : -1);
const back = EP.kids(backK, { xs: bxs, y: BY, scale: BS, seed: 3, idp: "s1b", dur: tTurn, turns: [[tTurn, side, "surprised"]] });
bTabs.forEach((x, i) => EP.table(backT, x, 1000, BY, BS, 10 + i));
const nia = Character(mid, EP.cast("nia", { id: "s1-nia", x: [[0, -520], [T.n02 + 1.2, -520], [T.n02 + 5.0, niaX, "out"]], y: [[0, G + 20]], prop: { kind: "tray" },
  pose: [[0, "hold", 0]], mood: [[0, "content", 0], [tTurn, "worried", 0.2], [T.nia_hi + 0.1, "shock", 0.15], [T.nia_hi + 0.5, "worried", 0.3]], look: [[0, { x: 1, y: 0 }], [tTurn + 0.2, { x: 0.3, y: 0 }]],
  lips: [[T.nia_hi, "nia_hi"]], squash: [[tTurn, 0], [tTurn + 0.1, 0.12], [tTurn + 0.35, 0]] }));
const fxs = [1040, 1200, 1360, 1520, 1720, 1880, 2040, -1120, -960];
const front = EP.kids(frontK, { xs: fxs, y: G + 190, scale: 1.0, seed: 8, idp: "s1f", dur: tTurn, turns: [[tTurn, side, "surprised"]] });
EP.table(frontT, 960, 1150, G + 190, 1, 31); EP.table(frontT, -1200, 400, G + 190, 1, 32);
const ranks = [["#1 👑", PAL.mustard], ["#4", "#6F8299"], ["#2", "#8C5E78"], ["#3", "#3F7F87"], ["#5", "#6B6F7A"]];
const tags = bTabs.map((x, i) => EP.Tag(fx, { t0: T.n01 + 3.6 + i * 0.18, t1: T.n02 + 0.5, texts: [[0, ranks[i][0], ranks[i][1]]], lift: 0 }));
const qTag = EP.Tag(fx, { t0: T.n02 + 0.4, t1: T.n02 + 3.0, texts: [[0, "NO RANK YET", PAL.rude]], lift: 0 });
const sweat = FX.sweat(fx), dust = FX.dust(fx);
const hi = Bubble(fx, { text: "…hi?", t0: T.nia_hi, t1: T.nia_hi_e + 0.6, side: 1, size: 30 });
const buzz = [0, 1, 2, 3, 4].map(() => EP.Buzz(fx));
const ladder = EP.Ladder(hud, { show: [[0, 0], [T.n03 + 5.6, 0], [T.n03 + 6.1, 1, "out"]], level: [[0, 1], [T.n03 + 6.2, 1], [T.n03 + 8.6, 7, "inOut"]] });
const bf = Butterfly(fx, { x: [[0, 1180]], y: [[0, 300]], scale: 0.35, flap: 2.2 });
const vig = el("g", {}, svg); Scene2.vignette(svg, vig, 0.22);
const cam = Camera(world, [[0, { x: 1500, y: 700, z: 1.3 }], [T.n02, { x: 700, y: 700, z: 1.3 }, "inOut"], [T.n02 + 1.6, { x: -150, y: 720, z: 1.4 }, "inOut"], [T.n02 + 5.0, { x: 480, y: 720, z: 1.4 }, "inOut"],
  [tTurn, { x: 520, y: 720, z: 1.42 }, "linear"], [tTurn + 0.25, { x: 700, y: 660, z: 1.0 }, "out"], [T.nia_hi - 0.15, { x: 700, y: 660, z: 1.02 }, "linear"], [T.nia_hi + 0.05, { x: niaX + 40, y: 700, z: 1.9 }, "out"],
  [T.n03, { x: niaX + 40, y: 690, z: 1.85 }, "linear"], [T.n03 + 4, { x: 760, y: 660, z: 1.05 }, "inOut"], [D, { x: 820, y: 650, z: 1.0 }, "linear"]], { shake: [[tTurn, 0], [tTurn + 0.05, 6], [tTurn + 0.5, 0, "out"]] });
return (t) => {
  cam.update(t); back.update(t); front.update(t);
  const n = nia.update(t);
  bTabs.forEach((x, i) => tags[i].update(t, { x: x + 400, y: BY - 280 }));
  qTag.update(t, { x: n.headX, y: n.headY - 110 });
  sweat.update(t, n, t > tTurn && t < T.n03 + 1); dust.update(t, n, G + 20); hi.update(t, { x: n.headX, y: n.headY });
  [3, 7, 11, 14, 18].forEach((k, i) => { const p = back.people[k]; if (p) { const c = p.update(t); buzz[i].update(t, c.headX, c.headY - 60, T.n03 + 1.0 + i * 0.25, 0.9); } });
  ladder.update(t); bf.update(t);
};
