/* One Piece help ep, ch5: Lesson 3 — they can't see how hard it is to ask (Bohns & Flynn 2010). */
(function () {
  const K = LONG({ keys: { hard: 1, ask: 1, village: 1, knew: 1, crew: 1, words: 1, advisors: 1, thirteen: 1, "13": 1, eight: 1, "8": 1, awkward: 1, wait: 1, nothing: 1, door: 1, open: 1, knock: 1 }, noCap: ["y1", "y5"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const person = (p, x, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: FL - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${FL} Q${x - 70 * s},${FL - 250 * s} ${x},${FL - 270 * s} Q${x + 70 * s},${FL - 250 * s} ${x + 62 * s},${FL} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };

  // ---------- B0: they knew — but she had to say it ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("y2") - 0.4);
  I.path(g0, `M${X0},${220} V${FL}`, S("y2"), 0.4, { w: 4, color: "#8A847A", attrs: { "stroke-dasharray": "14 12" } });
  [-860, -720, -580].forEach((dx, i) => person(g0, X0 + dx, 0.75, S("y2") + i * 0.06)); const nami = mk(g0, "nami", X0 - 300, FL, 0.95, S("y2") - 0.2); nami.acc(0, "strawhat").face(0, "sad").face(F("y2", 0.85), "smile");
  L.pop(g0, "the village knew", X0 - 700, 540, 54, F("y2", 0.15), L.GREY, "Patrick Hand", false);
  [580, 720, 860].forEach((dx, i) => person(g0, X0 + dx, 0.75, F("y2", 0.3) + i * 0.06)); const robin = mk(g0, "robin", X0 + 300, FL, 0.95, F("y2", 0.3)); robin.face(0, "sad").face(F("y2", 0.9), "smile");
  L.pop(g0, "the crew came", X0 + 720, 540, 54, F("y2", 0.4), L.GREY, "Patrick Hand", false);
  L.rect(g0, X0 - 520, 250, 250, 96, F("y2", 0.8), "#FFFDF6", { rx: 34, sound: "pop" }); L.pop(g0, "help me.", X0 - 395, 316, 60, F("y2", 0.82), RED, "Caveat", false);
  L.rect(g0, X0 + 60, 250, 400, 96, F("y2", 0.9), "#FFFDF6", { rx: 34, sound: "pop" }); L.pop(g0, "I want to live!", X0 + 260, 316, 60, F("y2", 0.92), RED, "Caveat", false);

  // ---------- B1: advisors expected 13; fewer than 8 came ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("y3") - 0.4);
  const nia = mk(g1, "nia", X1 - 640, FL, 1.0, S("y3") - 0.3); nia.face(0, "smile").face(S("y4"), "neutral").key(F("y4", 0.4), "think", 0.4);
  L.sign(g1, "HELP DESK", X1 - 640, 250, 360, 100, S("y3"), { font: "Anton", size: 64, rot: -3 });
  L.tx(g1, "expected: about 13", X1 - 300, 330, 60, F("y3", 0.4), 0.4, { font: "Patrick Hand", color: L.GREY });
  for (let i = 0; i < 13; i++) icon(g1, X1 - 280 + i * 84, 370, F("y3", 0.42) + i * 0.03, "#D9D4CB", 1.0);
  L.tx(g1, "came: fewer than 8", X1 - 300, 600, 60, F("y3", 0.8), 0.4, { font: "Patrick Hand", color: RED });
  for (let i = 0; i < 7; i++) icon(g1, X1 - 280 + i * 84, 640, F("y3", 0.82) + i * 0.04, "#7FB069", 1.0); for (let i = 7; i < 13; i++) I.path(g1, `M${X1 - 280 + i * 84 - 22},${640 + 78} h44`, F("y3", 0.95) + (i - 7) * 0.03, 0.1, { w: 5, color: "#B8B0A2", silent: true });

  // ---------- B2: both sides waiting ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("y4") - 0.2);
  I.path(g2, `M${X2 - 60},${FL} V${300} H${X2 + 160} V${FL}`, S("y4"), 0.6, { w: 10, color: "#8A5A2B" }); I.fill(g2, el("circle", { cx: X2 + 120, cy: 620, r: 12, fill: INKC, opacity: 0 }), S("y4") + 0.4, 0.1, { sound: false });
  const rue = mk(g2, "rue", X2 + 520, FL, 0.95, S("y4") + 0.1); rue.face(0, "smile").face(F("y4", 0.7), "neutral").key(F("y4", 0.5), "think", 0.4);
  const mo = mk(g2, "mo", X2 - 480, FL, 0.95, S("y4") + 0.2); mo.face(0, "sad").key(F("y4", 0.2), { aR: -110, eR: -30 }, 0.4).key(F("y4", 0.45), "pockets", 0.4);
  L.pop(g2, "…", X2 + 520, 300, 120, F("y4", 0.62), L.GREY, "Caveat", false); L.pop(g2, "…", X2 - 480, 300, 120, F("y4", 0.78), L.GREY, "Caveat", false);
  I.circle(g2, X2 + 50, 180, 70, F("y4", 0.6), 0.3, { w: 7 }); const hand = el("line", { x1: X2 + 50, y1: 180, x2: X2 + 50, y2: 125, stroke: RED, "stroke-width": 7, "stroke-linecap": "round", opacity: 0 }, g2);
  ups.push((t) => { hand.setAttribute("opacity", t > F("y4", 0.65) ? 1 : 0); const a = (t * 220 - 90) * Math.PI / 180; hand.setAttribute("x2", (X2 + 50 + Math.cos(a) * 55).toFixed(1)); hand.setAttribute("y2", (180 + Math.sin(a) * 55).toFixed(1)); });

  const posters = [{ on: [S("y1") - 0.05, E("y1") + 0.45], shakeAt: F("y1", 0.6), lines: [{ txt: "LESSON #3", y: 260, size: 120, fill: "#9A958C", at: S("y1") }, { txt: "THEY CAN'T SEE", y: 540, size: 220, at: F("y1", 0.3) }, { txt: "HOW HARD IT IS TO ASK.", y: 800, size: 160, fill: RED, at: F("y1", 0.6), big: true }] },
    { on: [S("y5") - 0.05, K.D + 0.1], shakeAt: F("y5", 0.75), lines: [{ txt: "THE DOOR IS", y: 380, size: 200, at: F("y5", 0.05) }, { txt: "USUALLY OPEN.", y: 600, size: 200, fill: "#9A958C", at: F("y5", 0.25) }, { txt: "SOMEONE HAS TO KNOCK.", y: 860, size: 164, fill: RED, at: F("y5", 0.7), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("y2", 0.28), X0 + 50, 540, 1.02, 1], [F("y2", 0.78), X0, 500, 1.06, -1], [S("y3") - 0.4, X1, 540, 1.0], [F("y3", 0.4), X1 - 60, 520, 1.04, 1], [F("y3", 0.8), X1 - 40, 580, 1.06, -1], [S("y4") - 0.3, X2, 540, 1.0], [F("y4", 0.5), X2, 500, 1.1, 1]];
  K.run({ shots, posters, punches: [{ t: F("y2", 0.82), z: 1.06 }, { t: F("y3", 0.82), z: 1.06 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
