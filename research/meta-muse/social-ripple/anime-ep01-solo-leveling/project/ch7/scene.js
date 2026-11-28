/* Solo Leveling ep, ch7: how much of life is habit (Wood, Quinn & Kashy 2002) + "Arise" + your daily quest + outro. */
(function () {
  const K = LONG({ keys: { habits: 1, third: 1, half: 1, every: 1, day: 1, place: 1, arise: 1, hundreds: 1, ordinary: 1, mornings: 1, quest: 1, small: 1, when: 1, track: 1, miss: 1, "66": 1, sixty: 1, six: 1, comment: 1, anime: 1, next: 1 } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CHAR(K), F = (i, f) => S(i) + f * T[i][1], ch = [], ups = [];
  const fig = (...a) => { const h = C.draw(...a); ch.push(h); return h; };

  // ---------- B0: a third to a half of what we do ----------
  const X0 = X(0), g0 = B(0);
  L.tx(g0, "how much of life is habit?", X0 - 820, 160, 100, S("g1") - 0.1, 0.9);
  const cx0 = X0 - 300, cy0 = 560, R0 = 260; I.circle(g0, cx0, cy0, R0, S("g2"), 0.5, { w: 9 });
  const wedge = el("path", { d: "", fill: "#7B6CFF", stroke: INKC, "stroke-width": 7, opacity: 0 }, g0);
  ups.push((t) => { const u = ease(clamp((t - F("g2", 0.15)) / 1.0, 0, 1)), a1 = -Math.PI / 2 + u * 0.42 * Math.PI * 2; if (u <= 0) { wedge.setAttribute("opacity", 0); return; }
    wedge.setAttribute("opacity", 1); wedge.setAttribute("d", `M${cx0},${cy0} L${cx0},${cy0 - R0} A${R0},${R0} 0 ${u * 0.42 > 0.5 ? 1 : 0},1 ${(cx0 + Math.cos(a1) * R0).toFixed(1)},${(cy0 + Math.sin(a1) * R0).toFixed(1)} Z`); });
  L.pop(g0, "a third", X0 + 330, 420, 100, F("g2", 0.3), "#5D4BE0", "Anton", "pop"); L.pop(g0, "to a half", X0 + 330, 560, 100, F("g2", 0.42), "#5D4BE0", "Anton", false);
  L.pop(g0, "almost every day, same place", X0 + 330, 720, 56, F("g2", 0.75), L.GREY, "Patrick Hand", false);

  // ---------- B1: ARISE — built from ordinary mornings ----------
  const X1 = X(1), g1 = B(1);
  const j1 = fig(g1, "jinwoo", X1 - 120, 950, 1.1, S("g3") - 0.3, { mood: "serious", glow: false, pose: "point" }); j1.setGlow(F("g3", 0.3), true);
  for (let i = 0; i < 6; i++) { const sx = X1 + (i < 3 ? -820 + i * 170 : 330 + (i - 3) * 190), at = F("g3", 0.32) + i * 0.07;
    I.fill(g1, el("path", { d: `M${sx},${960} q0,-150 50,-210 q-36,-50 0,-100 q50,-36 86,0 q36,50 0,100 q50,60 50,210 z`, fill: "#2A2440", stroke: "#7B6CFF", "stroke-width": 6, opacity: 0 }), at, 0.3, { sound: i ? false : "whoosh" });
    I.fill(g1, el("path", { d: `M${sx + 56},${700} l14,-4 M${sx + 80},${700} l14,4`, stroke: "#B9AEFF", "stroke-width": 6, opacity: 0 }), at + 0.1, 0.2, { sound: false }); }
  L.pop(g1, "ARISE.", X1 - 120, 230, 170, F("g3", 0.3), "#5D4BE0", "Anton", "bigslam");
  for (let i = 0; i < 10; i++) L.rect(g1, X1 + 360 + (i % 5) * 64, 300 + Math.floor(i / 5) * 70, 54, 54, F("g3", 0.62) + i * 0.05, "#FFFDF6", { rx: 4, sound: i ? false : "swish" });
  L.pop(g1, "hundreds of ordinary mornings", X1 + 520, 520, 50, F("g3", 0.8), INKC, "Patrick Hand", false);

  // ---------- B2: your daily quest ----------
  const X2 = X(2), g2 = B(2);
  fig(g2, "you", X2 - 640, 950, 1.0, S("g4") - 0.3, { mood: "smile", look: { hair: "#3B2A20", style: "spiky", top: "#5D4BE0", pants: "#2A2A30" } });
  C.system(g2, X2 - 300, 200, 1000, ["1. Pick one small thing.", "2. Decide exactly when.", "3. Track it.", "4. Missed a day? Come back."], F("g4", 0.05), { title: "[ YOUR DAILY QUEST ]", rowTimes: [F("g4", 0.15), F("g4", 0.38), F("g4", 0.6), F("g4", 0.72)] });

  // ---------- B3: give it 66 days ----------
  const X3 = X(3), g3 = B(3);
  L.pop(g3, "DAY 1 / 66", X3, 560, 260, S("g5") + 0.1, RED, "Anton", "bigslam");
  L.pop(g3, "then tell me how it went", X3, 760, 80, F("g5", 0.6), INKC, "Caveat", false);

  // ---------- B4: outro — comment + which anime next ----------
  const X4 = X(4), g4 = B(4);
  L.tx(g4, "comment your daily quest ↓", X4 - 820, 170, 100, S("g6"), 0.9);
  fig(g4, "jinwoo", X4 - 560, 950, 0.95, S("g6") + 0.2, { mood: "smile" });
  fig(g4, "naruto", X4, 950, 0.95, F("g6", 0.6), { mood: "grin", pose: "fist" });
  fig(g4, "luffy", X4 + 560, 950, 0.95, F("g6", 0.72), { mood: "grin" });
  L.pop(g4, "who's next?", X4 + 300, 330, 90, F("g6", 0.85), RED, "Caveat", "pop", -4);

  const shots = [[0, X0, 540, 1], [S("g3") - 0.4, X1, 540, 1], [S("g4") - 0.4, X2, 540, 1], [S("g5") - 0.3, X3, 540, 1], [S("g6") - 0.3, X4, 540, 1]];
  // end card poster: Social Ripple sign-off
  const posters = [{ on: [S("g7") - 0.05, K.D + 0.1], lines: [{ txt: "SOCIAL", x: 960, anchor: "middle", y: 470, size: 230, at: S("g7") }, { txt: "RIPPLE", x: 960, anchor: "middle", y: 720, size: 230, fill: RED, at: S("g7") + 0.35, big: true }, { txt: "anime  ×  psychology", x: 960, anchor: "middle", font: "Patrick Hand", y: 860, size: 70, fill: "#9A958C", at: S("g7") + 0.8 }] }];
  K.run({ shots, posters, extra(t) { ch.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
