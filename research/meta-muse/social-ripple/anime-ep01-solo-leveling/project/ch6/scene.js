/* Solo Leveling ep, ch6: Lesson 4 — missing a day is not the end (Lally et al. 2010). */
(function () {
  const K = LONG({ keys: { missing: 1, end: 1, forgets: 1, hardest: 1, fight: 1, penalty: 1, zone: 1, recover: 1, stronger: 1, win: 1, single: 1, day: 1, materially: 1, story: 1, point: 1, survive: 1, tomorrow: 1 }, noCap: ["f1"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };
  const knight = (p, x, y, at) => { I.fill(p, el("path", { d: `M${x - 110},${y} L${x - 90},${y - 300} Q${x},${y - 340} ${x + 90},${y - 300} L${x + 110},${y} Z`, fill: "#2B2A33", stroke: INKC, "stroke-width": 6, opacity: 0 }), at, 0.25, { sound: "slap" });
    I.fill(p, el("path", { d: `M${x - 75},${y - 300} Q${x - 80},${y - 470} ${x},${y - 480} Q${x + 80},${y - 470} ${x + 75},${y - 300} Z`, fill: "#3A3946", stroke: INKC, "stroke-width": 6, opacity: 0 }), at + 0.1, 0.25, { sound: false });
    I.fill(p, el("path", { d: `M${x},${y - 480} q60,-90 160,-60 q-60,10 -90,70 q-30,-10 -70,-10 z`, fill: "#C62F2A", stroke: INKC, "stroke-width": 5, opacity: 0 }), at + 0.2, 0.25, { sound: false });
    I.path(p, `M${x - 50},${y - 390} h100`, at + 0.3, 0.2, { w: 9, color: "#FF3B2E" }); I.path(p, `M${x + 120},${y - 40} L${x + 170},${y - 420}`, at + 0.35, 0.3, { w: 12, color: "#8E95A3" }); };

  // ---------- B0: he forgets, right before the hardest fight ----------
  const X0 = X(0), g0 = B(0);
  const j0 = fig(g0, "jinwoo", X0 - 620, 950, 1.05, S("f2") - 0.3, { mood: "serious", daggers: true }); j0.setMood(F("f2", 0.45), "sad");
  L.calendar(g0, X0 - 300, 240, 5, 2, 120, S("f2"), [0, 1, 2, 3, 4, 5, 6, 8, 9].map((i, k) => [i, S("f2") + 0.3 + k * 0.05]));
  L.pop(g0, "?", X0, 455, 100, F("f2", 0.45), RED, "Caveat", "pop");
  L.pop(g0, "forgot", X0, 560, 70, F("f2", 0.5), RED, "Caveat", false, -4);
  knight(g0, X0 + 560, 950, F("f2", 0.75)); L.pop(g0, "the hardest fight", X0 + 560, 330, 56, F("f2", 0.85), L.GREY, "Patrick Hand", false);

  // ---------- B1: pulled into the penalty zone — and comes back stronger ----------
  const X1 = X(1), g1 = B(1);
  L.tx(g1, "the penalty zone… mid-battle", X1 - 820, 160, 90, S("f3") - 0.1, 0.9, { color: RED });
  L.dunes(g1, X1 - 960, X1 + 960, 860, F("f3", 0.2)); L.centipede(g1, X1 + 260, 800, 10, F("f3", 0.3), 1);
  const j1 = fig(g1, "jinwoo", X1 - 380, 950, 1.0, F("f3", 0.15), { mood: "shout" }); j1.setMood(F("f3", 0.6), "serious"); j1.setGlow(F("f3", 0.6), true);
  for (let i = 0; i < 3; i++) L.arrow(g1, X1 - 120 + i * 60, 620, X1 - 120 + i * 60, 420, F("f3", 0.62) + i * 0.08, { w: 9, color: "#7B6CFF", silent: i > 0 });
  L.sign(g1, "LEVEL UP", X1 + 320, 430, 360, 110, F("f3", 0.7), { font: "Anton", size: 72, fill: "#1E1B2E", color: "#BFB4FF", rot: -4 });
  L.pop(g1, "…and wins.", X1 + 320, 620, 84, F("f3", 0.92), INKC, "Caveat", "slap");

  // ---------- B2: real life — one missed day didn't derail habit formation ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "the London study", X2 - 820, 160, 96, S("f4") - 0.1, 0.6);
  I.path(g2, `M${X2 - 760},${820} H${X2 + 760} M${X2 - 760},${820} V${300}`, F("f4", 0.3), 0.4, { w: 7 });
  L.pop(g2, "how automatic", X2 - 650, 280, 44, F("f4", 0.32), L.GREY, "Patrick Hand", false);
  I.path(g2, `M${X2 - 760},${800} C${X2 - 400},${560} ${X2},${450} ${X2 + 300},${410} S${X2 + 700},${380} ${X2 + 760},${375}`, F("f4", 0.45), 1.0, { w: 9, color: L.GREEN });
  I.path(g2, `M${X2 - 180},${820} v-20 M${X2 - 140},${820} v-20`, F("f4", 0.6), 0.1, { w: 6, silent: true }); L.pop(g2, "missed a day", X2 - 160, 880, 52, F("f4", 0.62), RED, "Patrick Hand", false);
  L.sign(g2, "didn't materially affect it", X2 + 320, 640, 640, 100, F("f4", 0.85), { size: 56, rot: -3, fill: "#E3F2D6", color: L.GREEN });

  // ---------- B3: the story we tell ourselves ----------
  const X3 = X(3), g3 = B(3);
  fig(g3, "you", X3 - 420, 950, 1.05, S("f5") - 0.3, { mood: "sad", look: { hair: "#3B2A20", style: "spiky", top: "#5D4BE0", pants: "#2A2A30" } });
  L.thought(g3, X3 + 280, 380, 760, 260, F("f5", 0.3)); L.pop(g3, "\"I already broke it…", X3 + 280, 360, 64, F("f5", 0.55), INKC, "Caveat", false); L.pop(g3, "so what's the point?\"", X3 + 280, 450, 64, F("f5", 0.75), INKC, "Caveat", false);
  I.path(g3, `M${X3 - 60},${200} L${X3 + 620},${560} M${X3 + 620},${200} L${X3 - 60},${560}`, E("f5") - 0.2, 0.3, { w: 14, color: RED, loud: 1.4 });

  // ---------- B4: survive it; back to the quest ----------
  const X4 = X(4), g4 = B(4);
  L.tx(g4, "one missed day = a penalty zone.", X4 - 820, 180, 90, S("f6"), 0.9);
  fig(g4, "jinwoo", X4 - 560, 950, 1.05, S("f6") - 0.2, { mood: "serious", glow: true });
  L.sign(g4, "SURVIVE IT ✓", X4 - 60, 450, 400, 100, F("f6", 0.45), { font: "Anton", size: 64, fill: "#E3F2D6", color: L.GREEN, rot: -4 });
  C.system(g4, X4 + 230, 330, 640, ["Tomorrow:", "back to the quest."], F("f6", 0.6), { rowTimes: [F("f6", 0.65), F("f6", 0.8)] });

  const posters = [{ on: [S("f1") - 0.05, E("f1") + 0.45], shakeAt: F("f1", 0.75), lines: [
    { txt: "LESSON #4", y: 260, size: 120, fill: "#9A958C", at: S("f1") }, { txt: "MISSING A DAY", y: 560, size: 210, at: F("f1", 0.4) }, { txt: "IS NOT THE END.", y: 830, size: 200, fill: RED, at: F("f1", 0.75), big: true }] }];
  const shots = [[0, X0, 540, 1], [S("f3") - 0.4, X1, 540, 1], [S("f4") - 0.4, X2, 540, 1], [S("f5") - 0.4, X3, 540, 1], [S("f6") - 0.4, X4, 540, 1]];
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); } });
})();
