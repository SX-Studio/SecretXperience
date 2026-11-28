/* Solo Leveling ep, ch2: the setup — E-rank, family, the double dungeon, the System, the daily quest, the penalty zone. */
(function () {
  const K = LONG({ keys: { weakest: 1, coma: 1, sister: 1, bills: 1, double: 1, dungeon: 1, statues: 1, player: 1, daily: 1, quest: 1, hundred: 1, "100": 1, ten: 1, "10": 1, penalty: 1, zone: 1, centipedes: 1, four: 1, hours: 1, rewarded: 1, recovery: 1, three: 1, stat: 1, matters: 1, twice: 1 } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; }, ups = [];
  const PURPLE = "#5D4BE0";

  // ---------- B0: an E-rank hunter ----------
  const X0 = X(0), g0 = B(0);
  fig(g0, "jinwoo", X0 - 420, 950, 1.1, 0.0, { mood: "sad" });
  L.sign(g0, "E-RANK", X0 - 420, 200, 260, 100, F("b1", 0.35), { font: "Anton", size: 64, fill: "#D9D4CB", color: "#6B6359", rot: -4 });
  L.tx(g0, "\"the weakest hunter", X0 + 0, 420, 88, F("b1", 0.6), 0.8); L.tx(g0, "of all mankind\"", X0 + 60, 540, 88, F("b1", 0.75), 0.7);
  for (let i = 0; i < 3; i++) L.pop(g0, ["lol", "E-rank…", "again?"][i], X0 + 220 + i * 210, 760 + (i % 2) * 60, 54, F("b1", 0.8) + i * 0.12, L.GREY, "Patrick Hand", false, (i - 1) * 6);

  // ---------- B1: mother in hospital, his sister, the bills ----------
  const X1 = X(1), g1 = B(1);
  L.bed(g1, X1 - 480, 820, S("b2") + 0.2);
  I.fill(g1, el("circle", { cx: X1 - 650, cy: 640, r: 52, fill: "#F6D5B5", stroke: INKC, "stroke-width": 5, opacity: 0 }), S("b2") + 0.5, 0.2, { sound: false });
  I.fill(g1, el("path", { d: `M${X1 - 700},${640} q0,-70 60,-62 q50,4 50,50 q-40,-30 -110,12 z`, fill: "#2A221E", stroke: INKC, "stroke-width": 4, opacity: 0 }), S("b2") + 0.55, 0.2, { sound: false });
  I.path(g1, `M${X1 - 672},${646} q10,6 20,0 M${X1 - 640},${646} q10,6 20,0`, S("b2") + 0.6, 0.1, { w: 4, silent: true });
  L.pop(g1, "coma", X1 - 480, 520, 64, F("b2", 0.18), L.GREY, "Caveat", false);
  I.path(g1, `M${X1 - 820},${400} h80 l20,-40 l25,80 l25,-60 l20,20 h80`, F("b2", 0.2), 0.5, { w: 5, color: L.GREEN, silent: true });
  fig(g1, "jinwoo", X1 + 180, 950, 1.0, F("b2", 0.35), { mood: "serious" });
  fig(g1, "jinah", X1 + 420, 950, 0.82, F("b2", 0.45), { mood: "smile", look: { hair: "#1E1A1C", style: "long", top: "#2E3A5C", pants: "#2E3A5C", collar: "#FFFFFF", skirt: true, eye: "#3A2A2A" } });
  L.pop(g1, "his sister", X1 + 420, 300, 56, F("b2", 0.5), L.GREY, "Patrick Hand", false);
  for (let i = 0; i < 4; i++) L.sign(g1, "BILL $$$", X1 + 700 + (i % 2) * 70, 330 + i * 120, 220, 80, F("b2", 0.8) + i * 0.12, { size: 46, rot: (i % 2 ? 8 : -6), fill: "#FFFDF6", color: RED });

  // ---------- B2: the double dungeon ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "the double dungeon", X2 - 820, 160, 100, S("b3") - 0.1, 0.8);
  for (const d of [-1, 1]) I.path(g2, `M${X2 + d * 640},${900} V${260} M${X2 + d * 560},${900} V${260} M${X2 + d * 680},${260} h${d * -160}`, S("b3") + 0.1, 0.5, { w: 7, color: "#8A847A" });
  const statue = L.statue(g2, X2, 900, 0.95, F("b3", 0.3)); ups.push((t) => statue(t, F("b3", 0.62)));
  fig(g2, "jinwoo", X2 - 330, 960, 0.6, S("b3"), { mood: "sad" });
  L.pop(g2, "strange rules", X2 + 400, 330, 64, F("b3", 0.62), RED, "Caveat", false, 4);
  L.pop(g2, "no way out", X2 + 400, 430, 64, F("b3", 0.85), RED, "Caveat", false, -4);

  // ---------- B3: he stays behind — and becomes a player ----------
  const X3 = X(3), g3 = B(3);
  fig(g3, "jinwoo", X3 - 560, 950, 1.0, S("b4") - 0.3, { mood: "serious" });
  [["#7A5A3A", "#6C8EBF"], ["#2A2A2A", "#8E5A4A"], ["#B08A4A", "#4E7A5A"]].forEach(([h, t], i) => fig(g3, "hunter" + i, X3 - 200 + i * 170, 950, 0.62, S("b4") + i * 0.1, { mood: "sad", look: { hair: h, top: t } }));
  L.arrow(g3, X3 - 120, 400, X3 + 260, 400, F("b4", 0.25), { w: 8, color: L.GREY }); L.pop(g3, "escape", X3 + 70, 360, 54, F("b4", 0.3), L.GREY, "Patrick Hand", false);
  const q = C.system(g3, X3 + 300, 300, 560, ["Become a Player?", "YES  /  NO"], F("b4", 0.6), { title: "[ HIDDEN QUEST ]", rowGap: 0.4 });
  I.path(g3, `M${X3 + 325},${484} h110 v62 h-110 z`, F("b4", 0.9), 0.25, { w: 6, color: "#7CCBFF" });

  // ---------- B4: hospital — a window appears: daily quest ----------
  const X4 = X(4), g4 = B(4);
  I.path(g4, `M${X4 - 860},${200} h300 v260 h-300 z M${X4 - 710},${200} v260 M${X4 - 860},${330} h300`, S("b5") - 0.2, 0.5, { w: 6, color: "#8A847A" });
  const j4 = fig(g4, "jinwoo", X4 - 560, 950, 1.05, S("b5"), { mood: "neutral" }); j4.setMood(F("b5", 0.7), "serious");
  C.system(g4, X4 - 220, 240, 900, ["100  push-ups", "100  sit-ups", "100  squats", "10 km  run"], F("b5", 0.62), { rowTimes: [0, 0.25, 0.5, 0.75].map((f) => F("b6", f)) });

  // ---------- B5: the penalty zone ----------
  const X5 = X(5), g5 = B(5);
  L.tx(g5, "the penalty zone", X5 - 820, 160, 100, S("b7") + 0.2, 0.8, { color: RED });
  L.dunes(g5, X5 - 960, X5 + 960, 820, F("b7", 0.35)); I.circle(g5, X5 + 700, 260, 80, F("b7", 0.4), 0.4, { w: 7, color: "#E0A030" });
  const j5 = fig(g5, "jinwoo", X5 - 300, 950, 0.9, F("b7", 0.35), { mood: "shout" });
  L.centipede(g5, X5 + 60, 760, 12, F("b7", 0.68), 1); L.centipede(g5, X5 + 280, 640, 9, F("b7", 0.75), 1);
  L.sign(g5, "SURVIVE: 4:00:00", X5 + 380, 420, 440, 100, F("b7", 0.88), { font: "Anton", size: 58, fill: "#1E1B2E", color: "#FF6B5E", rot: 3 });

  // ---------- B6: reward ----------
  const X6 = X(6), g6 = B(6);
  const j6 = fig(g6, "jinwoo", X6 - 560, 950, 1.05, S("b8") - 0.3, { mood: "neutral" }); j6.setMood(F("b8", 0.5), "smile");
  C.system(g6, X6 - 220, 300, 820, ["Full recovery", "+3 stat points"], F("b8", 0.45), { title: "[ QUEST COMPLETE ]", rowGap: T.b8[1] * 0.25 });

  // ---------- B7: day after day (even twice) ----------
  const X7 = X(7), g7 = B(7);
  fig(g7, "jinwoo", X7 - 620, 950, 1.05, S("b9") - 0.3, { mood: "serious" });
  L.calendar(g7, X7 - 280, 220, 7, 5, 118, S("b9"), [...Array(30)].map((_, i) => [i, F("b9", 0.35) + i * (T.b9[1] * 0.45 / 30)]));
  L.pop(g7, "x2", X7 + 730, 900, 140, F("b9", 0.82), RED, "Anton", "slap", -10);

  const shots = [[0, X0, 540, 1], [S("b2") - 0.4, X1, 540, 1], [S("b3") - 0.4, X2, 540, 1], [S("b4") - 0.4, X3, 540, 1], [S("b5") - 0.4, X4, 540, 1], [S("b7") - 0.2, X5, 540, 1], [S("b8") - 0.4, X6, 540, 1], [S("b9") - 0.4, X7, 540, 1]];
  K.run({ shots, events: [{ type: "bigslam", at: F("b3", 0.62) }],
    extra(t) { ch.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
