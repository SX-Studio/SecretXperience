/* Solo Leveling ep, ch3: Lesson 1 — it takes longer than you think (Maltz 1960 origin; Lally et al. 2010). */
(function () {
  const K = LONG({ keys: { longer: 1, twenty: 1, "21": 1, days: 1, minimum: 1, habit: 1, london: 1, automatic: 1, water: 1, "66": 1, huge: 1, "18": 1, "254": 1, exercise: 1, failing: 1, schedule: 1, "1960": 1 }, noCap: ["c1"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [], ups = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: "21 days?" ----------
  const X0 = X(0), g0 = B(0);
  const j0 = fig(g0, "jinwoo", X0 - 600, 950, 1.05, S("c2") - 0.3, { mood: "neutral" }); j0.setMood(F("c2", 0.8), "serious");
  L.calendar(g0, X0 - 250, 260, 7, 3, 150, S("c2"), [...Array(21)].map((_, i) => [i, F("c2", 0.4) + i * 0.05, L.GREEN]));
  L.pop(g0, "21 DAYS?", X0 + 280, 900, 120, F("c2", 0.6), RED, "Anton", "slap", -3);

  // ---------- B1: where the number came from ----------
  const X1 = X(1), g1 = B(1);
  L.rect(g1, X1 - 820, 300, 300, 400, F("c3", 0.05), "#C9A66B", { rx: 6 }); L.pop(g1, "SELF-HELP", X1 - 670, 430, 58, F("c3", 0.1), INKC, "Anton", false); L.pop(g1, "1960", X1 - 670, 560, 80, F("c3", 0.14), RED, "Anton", false);
  fig(g1, "surgeon", X1 - 280, 950, 0.9, F("c3", 0.22), { mood: "smile", look: { hair: "#6B6359", top: "#F4F4F0", pants: "#4A4F5A", collar: "#9CC3D9" } });
  L.pop(g1, "a plastic surgeon", X1 - 280, 300, 56, F("c3", 0.25), L.GREY, "Patrick Hand", false);
  L.tx(g1, "\"a minimum of about", X1 + 20, 450, 80, F("c3", 0.45), 0.8); L.tx(g1, "21 days\"", X1 + 120, 570, 110, F("c3", 0.55), 0.5, { color: RED });
  L.pop(g1, "to change a self-image", X1 + 420, 680, 56, F("c3", 0.7), L.GREY, "Patrick Hand", false);
  I.path(g1, `M${X1 + 10},${420} L${X1 + 650},${460}`, F("c4", 0.3), 0.3, { w: 9, color: RED });
  L.sign(g1, "21 DAYS TO FORM A HABIT!", X1 + 380, 840, 700, 110, F("c4", 0.6), { font: "Anton", size: 60, rot: -3 });

  // ---------- B2: London, 2010 — one simple habit ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "London, 2010: they tested it", X2 - 820, 160, 96, S("c5") - 0.1, 0.9);
  fig(g2, "volunteer", X2 - 560, 950, 1.0, S("c5") + 0.2, { mood: "smile", pose: "point", look: { hair: "#7A4A2A", style: "long", top: "#7FB069", pants: "#3A3F4A" } });
  I.path(g2, `M${X2 - 260},${440} l20,180 h80 l20,-180 z`, F("c5", 0.35), 0.4, { w: 7 }); I.fill(g2, el("path", { d: `M${X2 - 252},${500} l12,116 h80 l12,-116 z`, fill: "#9CC3D9", opacity: 0 }), F("c5", 0.42), 0.2, { sound: "swish" });
  L.pop(g2, "water with lunch", X2 - 200, 720, 54, F("c5", 0.48), L.GREY, "Patrick Hand", false);
  L.box(g2, X2 + 120, 280, 700, 440, F("c5", 0.68)); L.pop(g2, "How automatic did it feel?", X2 + 470, 370, 52, F("c5", 0.72), INKC, "Patrick Hand", false);
  for (let i = 0; i < 7; i++) { I.circle(g2, X2 + 190 + i * 94, 500, 30, F("c5", 0.78) + i * 0.04, 0.12, { w: 5, silent: i > 0 }); L.pop(g2, String(i + 1), X2 + 190 + i * 94, 515, 40, F("c5", 0.78) + i * 0.04, INKC, "Anton", false); }
  L.pop(g2, "every day", X2 + 470, 650, 70, F("c5", 0.92), RED, "Caveat", false);

  // ---------- B3: the result — 66 days, but 18 → 254 ----------
  const X3 = X(3), g3 = B(3), ax = (d) => X3 - 760 + d * 5.8, base = 700;
  L.tx(g3, "days until it felt automatic", X3 - 820, 160, 90, S("c6") - 0.1, 0.9);
  I.path(g3, `M${ax(0)},${base} H${ax(270)}`, S("c6"), 0.5, { w: 7 }); [0, 50, 100, 150, 200, 250].forEach((d, i) => L.pop(g3, String(d), ax(d), base + 60, 40, S("c6") + 0.2 + i * 0.05, L.GREY, "Anton", false));
  I.path(g3, `M${ax(66)},${base} V${300}`, F("c6", 0.75), 0.4, { w: 10, color: RED }); L.pop(g3, "66", ax(66), 280, 120, F("c6", 0.85), RED, "Anton", "slap");
  L.pop(g3, "the middle point", ax(66) + 250, 380, 50, F("c6", 0.9), RED, "Patrick Hand", false);
  I.path(g3, `M${ax(18)},${base - 90} H${ax(254)}`, F("c7", 0.3), 0.8, { w: 8, color: L.GREY, attrs: { "stroke-dasharray": "18 12" } });
  I.fill(g3, el("circle", { cx: ax(18), cy: base - 90, r: 18, fill: L.GREEN, opacity: 0 }), F("c7", 0.42), 0.15); L.pop(g3, "18", ax(18), base - 130, 70, F("c7", 0.45), L.GREEN, "Anton", false);
  I.fill(g3, el("circle", { cx: ax(254), cy: base - 90, r: 18, fill: L.GREY, opacity: 0 }), F("c7", 0.8), 0.15); L.pop(g3, "254 (estimated)", ax(254) - 60, base - 130, 56, F("c7", 0.85), L.GREY, "Anton", false);
  const bx = X3 + 420; L.tx(g3, "eating / drinking", bx, 250, 48, S("c8"), 0.4, { font: "Patrick Hand" }); L.tx(g3, "exercise", bx, 380, 48, F("c8", 0.45), 0.3, { font: "Patrick Hand" });

  // ---------- B4: you're on schedule ----------
  const X4 = X(4), g4 = B(4);
  const j4 = fig(g4, "jinwoo", X4 - 500, 950, 1.1, S("c9") - 0.3, { mood: "sad" }); j4.setMood(F("c9", 0.6), "smile");
  L.tx(g4, "3 weeks in… still hard?", X4 - 100, 330, 96, S("c9"), 0.8);
  L.pop(g4, "not failing.", X4 + 300, 520, 90, F("c9", 0.45), INKC, "Caveat", false);
  L.sign(g4, "ON SCHEDULE ✓", X4 + 300, 720, 520, 130, F("c9", 0.75), { font: "Anton", size: 80, rot: -4, fill: "#E3F2D6", color: L.GREEN });

  const posters = [{ on: [S("c1") - 0.05, E("c1") + 0.45], slashAt: W("c1", -1), shakeAt: W("c1", -1), lines: [
    { txt: "LESSON #1", y: 260, size: 120, fill: "#9A958C", at: S("c1") }, { txt: "IT TAKES LONGER", y: 560, size: 200, at: W("c1", 2) }, { txt: "THAN YOU THINK.", y: 830, size: 200, fill: RED, at: W("c1", -1), big: true }] }];
  const shots = [[0, X0, 540, 1], [S("c3") - 0.4, X1, 540, 1], [S("c5") - 0.4, X2, 540, 1], [S("c6") - 0.4, X3, 540, 1], [S("c9") - 0.4, X4, 540, 1]];
  // exercise vs eating/drinking: small bars (59/65 vs 91 days, a non-significant difference: "tended to")
  ups.push(L.bars(g3, [{ x: bx, y: 265, len: 62 * 4, thick: 60, fill: "#9CC3D9", at: S("c8") + 0.2, horizontal: true }, { x: bx, y: 395, len: 91 * 4, thick: 60, fill: "#E0A030", at: F("c8", 0.55), horizontal: true }]));
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
