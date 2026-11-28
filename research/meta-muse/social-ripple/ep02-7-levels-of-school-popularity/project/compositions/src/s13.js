const D = T.D, G = 900, W = (id, w, n, f) => EP.W(T, id, w, n, f);
const world = el("g", {}, svg);
const bg = el("g", {}, world), backK = el("g", {}, world), backT = el("g", {}, world), chairL = el("g", {}, world), kidsL = el("g", {}, world), tabL = el("g", {}, world), walkL = el("g", {}, world), fx = el("g", {}, world), hud = el("g", {}, svg);
EP.cafeteria(svg, bg, G, { time: "12:31", menu: "Taco Wednesday", menuX: 1700, clockX: 2250 });
const BY = G - 140; const bTabs = [-500, 1500]; const bxs = []; bTabs.forEach((x) => { for (let i = 0; i < 4; i++) bxs.push(x + 90 + i * 180); });
const tSit = T.nia_seat_e + 0.3, tFree = T.jordan_free, tSaw = W("n27", "saw"), tScoot = T.marcus_scoot, tNot = T.n28 + 0.4;
const mIdx = 5; // Marcus sits at the back right table
const back = EP.kids(backK, { xs: bxs, y: BY, scale: 0.8, seed: 141, idp: "s13b", dur: D, quiet: false,
  turns: [[tNot, (i, x) => (x < 700 ? 1 : -1), "surprised"]], spec: (i) => (i === mIdx ? { opacity: [[0, 1], [tSaw + 0.6, 0]] } : { mood: [[0, "neutral", 0], [tNot + 0.6, "happy", 0.4]] }) });
bTabs.forEach((x, i) => EP.table(backT, x, 1000, BY, 0.8, 140 + i));
const JX = [200, 360, 520, 680, 840, 1000], jI = 2;
const chairs = JX.map((x) => EP.chair(chairL, x - 12, G + 40, 1.0, "#C9A227"));
const jordan = Character(kidsL, EP.cast("jordan", { id: "s13-j", x: [[0, JX[jI]]], y: [[0, G + 40]], noWalk: true, pose: [[0, "sitSlump", 0], [tFree - 0.2, "sit", 0.3], [tFree + 0.4, "shrug", 0.3], [T.jordan_free_e + 0.4, "sit", 0.3]],
  mood: [[0, "sad", 0], [T.nia_seat + 0.2, "surprised", 0.3], [tFree + 0.8, "tired", 0.3], [tSit + 0.2, "content", 0.4], [tNot, "happy", 0.5]], look: [[0, { x: 0, y: 0.8 }], [T.nia_seat, { x: -0.6, y: -0.3 }]], lips: [[tFree, "jordan_free"]] }));
const nia = Character(walkL, EP.cast("nia", { id: "s13-n", x: [[0, -500], [T.n26 + 0.3, -500], [T.nia_seat - 0.2, 360, "out"]], y: [[0, G + 70], [tSit - 0.3, G + 70], [tSit, G + 40]], prop: { kind: "tray", show: [[0, 1], [tSit - 0.1, 1], [tSit, 0]] },
  facing: [[0, 1]], pose: [[0, "hold", 0], [tSit, "sit", 0.3]], mood: [[0, "content", 0], [T.nia_seat, "happy", 0.2], [tFree + 0.4, "joy", 0.2], [tSit + 0.4, "happy", 0.4]], lips: [[T.nia_seat, "nia_seat"]] }));
const marcus = Character(walkL, EP.cast("marcus", { id: "s13-m", x: [[0, bxs[mIdx]], [tSaw + 0.5, bxs[mIdx]], [tScoot - 0.2, 840, "inOut"]], y: [[0, BY], [tSaw + 0.4, BY], [tSaw + 0.9, G + 70], [tScoot + 0.4, G + 70], [tScoot + 0.7, G + 40]],
  scaleT: [[0, 0.8], [tSaw + 0.4, 0.8], [tSaw + 0.9, 1.06]], facing: [[0, -1]], pose: [[0, "sit", 0], [tSaw + 0.3, "relaxed", 0.3], [tScoot + 0.5, "sit", 0.3]], mood: [[0, "neutral", 0], [tSaw - 0.3, "surprised", 0.2], [tSaw + 0.5, "content", 0.3], [tScoot, "joy", 0.2]], lips: [[tScoot, "marcus_scoot"]], look: [[0, { x: -0.8, y: 0.3 }]],
  opacity: [[0, 0], [tSaw + 0.5, 0], [tSaw + 0.55, 1]] }));
EP.table(tabL, 120, 1000, G + 40, 1, 145, { top: "#F2D28A" });
const crown = el("g", {}, tabL); el("rect", { x: 490, y: G - 66, width: 260, height: 48, rx: 10, fill: "#C9A227", stroke: PAL.ink, "stroke-width": 4 }, crown); EP.txt(crown, 620, G - 41, "TOP TABLE", 30, "#FFFFFF", { font: "Outfit" });
const b1 = Bubble(fx, { text: "Is this seat taken?", t0: T.nia_seat, t1: T.nia_seat_e + 0.8, side: 1 });
const b2 = Bubble(fx, { text: "It's… literally all free.", t0: tFree, t1: T.jordan_free_e + 1.0, side: 1 });
const b3 = Bubble(fx, { text: "Scoot over.", t0: tScoot, t1: T.marcus_scoot_e + 0.8, side: -1 });
const gold = Ripple(fx, { color: PAL.kind, t: tNot, dur: 1.8, maxR: 900, rings: 4, width: 10 });
const spark = FX.sparkles(fx), hearts = FX.hearts(fx);
const emptyTag = EP.Tag(fx, { t0: tFree + 0.5, t1: T.jordan_free_e + 1.4, texts: [[0, "SEATS FREE: 5", "#6B6F7A"]], lift: 0 });
const cam = Camera(world, [[0, { x: 600, y: 680, z: 1.55 }], [T.n26, { x: 520, y: 680, z: 1.5 }, "inOut"], [T.nia_seat - 0.3, { x: 470, y: 700, z: 1.7 }, "inOut"], [tFree, { x: 520, y: 700, z: 1.75 }, "linear"], [tFree + 0.5, { x: 820, y: 700, z: 1.45 }, "inOut"],
  [T.jordan_free_e + 0.8, { x: 500, y: 700, z: 1.6 }, "inOut"], [tSaw - 0.4, { x: 600, y: 680, z: 1.4 }, "linear"], [tSaw, { x: 1400, y: 620, z: 1.4 }, "inOut"], [tScoot - 0.3, { x: 800, y: 680, z: 1.4 }, "inOut"], [tNot, { x: 700, y: 660, z: 1.3 }, "inOut"], [D, { x: 900, y: 620, z: 0.95 }, "out"]]);
return (t) => {
  cam.update(t); back.update(t);
  if (t >= tSit - 0.15 && nia.g.parentNode !== kidsL) kidsL.appendChild(nia.g); if (t < tSit - 0.15 && nia.g.parentNode !== walkL) walkL.appendChild(nia.g);
  if (t >= tScoot + 0.35 && marcus.g.parentNode !== kidsL) kidsL.appendChild(marcus.g); if (t < tScoot + 0.35 && marcus.g.parentNode !== walkL) walkL.appendChild(marcus.g);
  const j = jordan.update(t), n = nia.update(t), m = marcus.update(t);
  chairs.forEach((c, i) => { const isN = i === 1, isM = i === 4; const k = isN ? clamp((t - tSit + 0.6) / 0.3, 0, 1) * (1 - clamp((t - tSit) / 0.3, 0, 1)) : isM ? clamp((t - tScoot + 0.5) / 0.3, 0, 1) * (1 - clamp((t - tScoot - 0.4) / 0.3, 0, 1)) : 0; c.set(-30 * k, 0); });
  b1.update(t, { x: n.headX, y: n.headY }); b2.update(t, { x: j.headX, y: j.headY }); b3.update(t, { x: m.headX, y: m.headY });
  emptyTag.update(t, { x: 820, y: G - 330 });
  gold.update(t, { x: m.headX, y: m.headY }); spark.update(t, j.headX, j.headY, tSit + 0.3, 110); hearts.update(t, n.headX + 60, n.headY - 50, tNot + 0.5);
};
