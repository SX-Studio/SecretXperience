/* Naruto loneliness ep, ch3: Lesson 1 — lonely is not the same as alone (Hawkley & Cacioppo 2010; Baumeister & Leary 1995). */
(function () {
  const K = LONG({ keys: { lonely: 1, alone: 1, surrounded: 1, saw: 1, isolated: 1, gap: 1, want: 1, have: 1, crowd: 1, classroom: 1, relationship: 1, frequent: 1, bond: 1, stay: 1, noticed: 1, known: 1 }, noCap: ["q1", "q6"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, GREY = "#B8B0A2";
  const person = (p, x, s, at, col = GREY, y = FL) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${y} Q${x - 70 * s},${y - 250 * s} ${x},${y - 270 * s} Q${x + 70 * s},${y - 250 * s} ${x + 62 * s},${y} Z`, fill: col }, g);
    I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });

  // ---------- B0: surrounded, not seen ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("q2") - 0.4);
  [-720, -520, -320, 320, 520, 720].forEach((dx, i) => person(g0, X0 + dx, 0.95, S("q2") + i * 0.05));
  const mo = mk(g0, "naruto", X0, FL, 0.95, S("q2") - 0.3); mo.key(0, "stand", 0).face(0, "neutral").face(F("q2", 0.6), "sad");
  L.sign(g0, "surrounded ✓", X0 - 520, 260, 340, 90, F("q2", 0.3), { size: 56, rot: -4, fill: "#E3F2D6", color: L.GREEN });
  L.sign(g0, "seen ✗", X0 + 520, 260, 240, 90, F("q2", 0.75), { size: 56, rot: 4, fill: "#FFD9C9", color: RED });

  // ---------- B1: loneliness = the gap ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("q3") - 0.4);
  const nia = mk(g1, "nia", X1 - 640, FL, 1.0, S("q3") - 0.3); nia.face(0, "smile").key(F("q3", 0.4), { aR: -95, eR: 0 }, 0.3);
  I.path(g1, `M${X1 + 330},${520} m-260,0 a260,260 0 1,0 520,0 a260,260 0 1,0 -520,0`, F("q3", 0.55), 0.6, { w: 8, color: L.BLUE, attrs: { "stroke-dasharray": "22 14" } });
  I.fill(g1, el("circle", { cx: X1 + 330, cy: 520, r: 90, fill: "#9CC3D9", stroke: INKC, "stroke-width": 6, opacity: 0 }), F("q3", 0.7), 0.25);
  L.pop(g1, "the connection you want", X1 + 330, 220, 52, F("q3", 0.6), L.BLUE, "Patrick Hand", false); L.pop(g1, "what you have", X1 + 330, 660, 44, F("q3", 0.75), INKC, "Patrick Hand", false);
  L.arrow(g1, X1 + 430, 520, X1 + 580, 520, F("q3", 0.85), { w: 7, color: RED }); L.pop(g1, "the gap = loneliness", X1 + 330, 860, 70, F("q3", 0.88), RED, "Caveat", "slap");
  L.tx(g1, "not simply being alone", X1 - 300, 180, 80, S("q3") + 0.2, 0.7);

  // ---------- B2: crowd · classroom · relationship ----------
  const X2 = X(2), g2 = B(2);
  const panel = (x, at, lb) => { L.box(g2, x - 270, 250, 540, 560, at, { w: 7 }); L.pop(g2, lb, x, 880, 60, at + 0.2, INKC, "Caveat", false); };
  panel(X2 - 600, F("q4", 0.25), "in a crowd"); [-150, -60, 60, 150].forEach((dx, i) => person(g2, X2 - 600 + dx, 0.5, F("q4", 0.28) + i * 0.04, GREY, 780));
  const m1 = mk(g2, "mo", X2 - 600, 780, 0.55, F("q4", 0.3)); m1.key(0, "pockets", 0).face(0, "sad");
  panel(X2, F("q4", 0.5), "in a classroom"); for (let i = 0; i < 3; i++) I.path(g2, `M${X2 - 210 + i * 150},${700} h110 M${X2 - 200 + i * 150},${700} v60 M${X2 - 110 + i * 150},${700} v60`, F("q4", 0.52) + i * 0.05, 0.2, { w: 6, color: "#8A5A2B", silent: i > 0 });
  const m2 = mk(g2, "mo", X2 + 160, 780, 0.5, F("q4", 0.55)); m2.key(0, "slump", 0).face(0, "sad");
  panel(X2 + 600, F("q4", 0.72), "even together"); const r3 = mk(g2, "rue", X2 + 520, 780, 0.5, F("q4", 0.74)); r3.face(0, "smile").key(0, { head: 10 }, 0);
  const m3 = mk(g2, "mo", X2 + 690, 780, 0.5, F("q4", 0.76)); m3.key(0, { head: -14 }, 0).face(0, "sad");

  // ---------- B3: frequent, not negative, a bond that lasts ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("q5") - 0.4);
  L.tx(g3, "the need to belong", X3 - 820, 170, 96, S("q5") - 0.1, 0.7);
  L.calendar(g3, X3 - 820, 260, 7, 2, 90, F("q5", 0.2), []);
  for (let i = 0; i < 14; i++) I.path(g3, L.heart(X3 - 820 + (i % 7) * 90 + 45, 260 + Math.floor(i / 7) * 90 + 50, 18), F("q5", 0.25) + i * 0.04, 0.12, { w: 4, color: RED, silent: i > 0 });
  L.pop(g3, "frequent · not negative", X3 - 505, 520, 52, F("q5", 0.35), INKC, "Patrick Hand", false);
  const mo4 = mk(g3, "mo", X3 + 200, FL, 0.95, F("q5", 0.5)); mo4.key(0, "pockets", 0).face(0, "neutral").face(F("q5", 0.85), "smile");
  const rue = mk(g3, "rue", X3 + 560, FL, 0.95, F("q5", 0.6)); rue.face(0, "smile").key(F("q5", 0.8), { aL: 60, eL: -20 }, 0.3);
  I.path(g3, `M${X3 + 260},${560} Q${X3 + 380},${470} ${X3 + 500},${560}`, F("q5", 0.75), 0.4, { w: 6, color: RED, attrs: { "stroke-dasharray": "10 8" } });
  L.pop(g3, "people who stay.", X3 + 380, 330, 80, F("q5", 0.85), RED, "Caveat", "pop");

  const posters = [{ on: [S("q1") - 0.05, E("q1") + 0.45], shakeAt: F("q1", 0.7), lines: [
      { txt: "LESSON #1", y: 260, size: 120, fill: "#9A958C", at: S("q1") }, { txt: "LONELY IS NOT", y: 560, size: 220, at: F("q1", 0.35) }, { txt: "THE SAME AS ALONE.", y: 820, size: 180, fill: RED, at: F("q1", 0.7), big: true }] },
    { on: [S("q6") - 0.05, K.D + 0.1], shakeAt: F("q6", 0.85), lines: [
      { txt: "BEING NOTICED", y: 380, size: 200, at: F("q6", 0.45) }, { txt: "IS NOT THE SAME AS", y: 580, size: 120, fill: "#9A958C", at: F("q6", 0.62) }, { txt: "BEING KNOWN.", y: 820, size: 220, fill: RED, at: F("q6", 0.85), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("q2", 0.55), X0, 480, 1.3, -1], [S("q3") - 0.4, X1, 540, 1.0, 1], [S("q4") - 0.4, X2, 560, 1.0], [S("q5") - 0.4, X3, 540, 1.0, -1], [F("q5", 0.75), X3 + 380, 540, 1.2]];
  K.run({ shots, posters, punches: [{ t: F("q3", 0.88), z: 1.1 }, { t: F("q4", 0.3), z: 1.06 }, { t: F("q4", 0.55), z: 1.06 }, { t: F("q4", 0.76), z: 1.06 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
