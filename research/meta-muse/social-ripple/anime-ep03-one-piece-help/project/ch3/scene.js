/* One Piece help ep, ch3: Lesson 1 — people want to help far more than you think (Flynn & Lake 2008; Bohns 2016). */
(function () {
  const K = LONG({ keys: { help: 1, heard: 1, asked: 1, enough: 1, twenty: 1, "20": 1, strangers: 1, five: 1, ten: 1, "10": 1, fourteen: 1, thousand: 1, half: 1, small: 1, no: 1, yes: 1, head: 1 }, noCap: ["w1", "w6"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };

  // ---------- B0: he never heard her story ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("w2") - 0.4);
  const nami = mk(g0, "nami", X0 - 380, FL, 1.0, S("w2") - 0.3); nami.acc(0, "strawhat").face(0, "sad").face(F("w2", 0.8), "smile");
  const luffy = mk(g0, "luffy", X0 + 80, FL, 1.0, S("w2") - 0.2); luffy.acc(0, "none").face(0, "neutral").face(F("w2", 0.75), "grin").key(F("w2", 0.75), "fist", 0.3);
  L.thought(g0, X0 + 520, 300, 420, 200, F("w2", 0.2)); L.pop(g0, "her story?", X0 + 520, 300, 56, F("w2", 0.25), L.GREY, "Caveat", false); L.pop(g0, "never heard it.", X0 + 520, 365, 56, F("w2", 0.32), INKC, "Caveat", false);
  L.sign(g0, "she asked. that was enough.", X0 + 560, 640, 640, 100, F("w2", 0.75), { size: 54, rot: -3, fill: "#E3F2D6", color: L.GREEN });

  // ---------- B1: predicted 20, actual 10 ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("w3") - 0.4);
  L.tx(g1, "\"will you fill out a survey?\"", X1 - 820, 170, 84, F("w3", 0.25), 0.9);
  const kai = mk(g1, "kai", X1 - 700, FL, 0.9, S("w3") - 0.3); kai.face(0, "smile").key(F("w3", 0.3), { aR: -80, eR: -10 }, 0.3);
  L.tx(g1, "guess: ask 20", X1 - 420, 330, 64, F("w3", 0.45), 0.4, { font: "Patrick Hand", color: L.GREY });
  for (let i = 0; i < 20; i++) icon(g1, X1 - 400 + (i % 10) * 62, 370 + Math.floor(i / 10) * 100, F("w3", 0.48) + i * 0.02, "#D9D4CB", 0.9);
  L.tx(g1, "reality: about 10", X1 - 420, 640, 64, F("w3", 0.85), 0.4, { font: "Patrick Hand", color: RED });
  for (let i = 0; i < 10; i++) icon(g1, X1 - 400 + i * 62, 680, F("w3", 0.88) + i * 0.03, i % 2 ? "#D9D4CB" : "#7FB069", 0.9);
  L.pop(g1, "5 said yes", X1 + 420, 760, 64, F("w3", 0.95), L.GREEN, "Caveat", "pop");

  // ---------- B2: 14,000+ strangers; the chance of a yes ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "14,000+ strangers asked", X2 - 820, 170, 96, S("w4"), 0.8);
  L.tx(g2, "the yes we expect", X2 - 820, 330, 60, F("w4", 0.45), 0.4, { font: "Patrick Hand" }); L.tx(g2, "the yes we get", X2 - 820, 570, 60, F("w4", 0.7), 0.4, { font: "Patrick Hand" });
  ups.push(L.bars(g2, [{ x: X2 - 820, y: 350, len: 520, thick: 110, fill: "#B8B0A2", at: F("w4", 0.5), horizontal: true }, { x: X2 - 820, y: 590, len: 1040, thick: 110, fill: "#7FB069", at: F("w4", 0.75), horizontal: true }]));
  L.pop(g2, "underestimated by about half", X2 + 240, 450, 58, F("w4", 0.85), RED, "Caveat", "slap", -3);
  L.sign(g2, "small favors · mostly strangers", X2 - 480, 800, 640, 84, S("w5") + 0.1, { size: 46, rot: -2, fill: "#FFFDF6", color: L.GREY });
  L.pop(g2, "expect: NO", X2 + 240, 780, 80, F("w5", 0.62), RED, "Anton", "pop"); L.pop(g2, "get: YES", X2 + 610, 780, 80, F("w5", 0.8), L.GREEN, "Anton", "pop");

  const posters = [{ on: [S("w1") - 0.05, E("w1") + 0.45], shakeAt: F("w1", 0.7), lines: [{ txt: "LESSON #1", y: 260, size: 120, fill: "#9A958C", at: S("w1") }, { txt: "PEOPLE WANT TO HELP", y: 540, size: 180, at: F("w1", 0.3) }, { txt: "MORE THAN YOU THINK.", y: 800, size: 172, fill: RED, at: F("w1", 0.7), big: true }] },
    { on: [S("w6") - 0.05, K.D + 0.1], shakeAt: F("w6", 0.7), lines: [{ txt: "THE \"NO\"", y: 360, size: 230, at: F("w6", 0.05) }, { txt: "YOU'RE AFRAID OF", y: 560, size: 150, fill: "#9A958C", at: F("w6", 0.3) }, { txt: "IS MOSTLY", y: 760, size: 170, at: F("w6", 0.55) }, { txt: "IN YOUR HEAD.", y: 970, size: 190, fill: RED, at: F("w6", 0.72), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("w2", 0.2), X0 + 200, 500, 1.12, 1], [F("w2", 0.7), X0 + 150, 540, 1.08, -1], [S("w3") - 0.4, X1, 540, 1.0], [F("w3", 0.45), X1 - 100, 500, 1.1, 1], [F("w3", 0.85), X1 - 60, 620, 1.15, -1], [S("w4") - 0.4, X2, 540, 1.0], [F("w4", 0.7), X2 - 200, 520, 1.08, 1], [S("w5"), X2, 600, 1.05, -1]];
  K.run({ shots, posters, punches: [{ t: F("w3", 0.95), z: 1.06 }, { t: F("w4", 0.85), z: 1.08 }, { t: F("w5", 0.8), z: 1.06 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
