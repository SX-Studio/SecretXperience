/* Ep10 ch1: what self-deception is + the four tricks. */
(function () {
  const K = LONG({ keys: { contradiction: 1, truth: 1, lie: 1, knows: 1, psychologists: 1, caught: 1, lying: 1, checking: 1, arguing: 1, rigging: 1, four: 1, tricks: 1, secret: 1 }, noCap: ["d5"] });
  const { S, E, W, I, X, B, el, fig, INKC, HI, RED } = K, L = LIB(K);

  // ---------- B0: a contradiction ----------
  const X0 = X(0), g0 = B(0);
  K.hi(g0, X0 - 770, 150, 230, 50, W("d1", 0) + 0.3);
  L.tx(g0, "self-deception", X0 - 780, 190, 130, S("d1") - 0.2, 0.8);
  L.tx(g0, "= a contradiction?", X0 + 60, 185, 84, W("d1", 4), 0.7, { color: L.GREY });
  const liar = fig(g0, X0 - 470, 820, 1.05, S("d2") - 0.3, { mood: "neutral" }); liar.setMood(W("d2", 8), "worried");
  L.thought(g0, X0 - 640, 330, 260, 150, W("d2", 5) - 0.3); L.pop(g0, "TRUTH", X0 - 640, 352, 70, W("d2", 5), RED, "Anton");
  const you = fig(g0, X0 + 480, 820, 1.05, S("d2"), { mood: "smile" });
  L.arrow(g0, X0 - 300, 520, X0 + 300, 520, W("d2", 1), { w: 7 }); L.pop(g0, "a lie", X0, 490, 72, W("d2", 1) + 0.2, INKC, "Caveat", false);
  I.path(g0, `M${X0 + 360},${380} l240,320 M${X0 + 600},${380} l-240,320`, W("d2", 15), 0.3, { w: 12, color: RED, loud: 1.3 });
  L.arrow(g0, X0 - 330, 470, X0 - 380, 330, W("d2", 17), { curve: [X0 - 60, 230], color: RED, w: 9 });
  L.pop(g0, "?", X0 - 170, 330, 200, W("d2", -1), RED, "Caveat");

  // ---------- B1: caught in simple experiments ----------
  const X1 = X(1), g1 = B(1);
  L.tx(g1, "caught… in surprisingly simple experiments", X1 - 800, 190, 84, S("d3") - 0.1, 1.2);
  L.bucket(g1, X1 - 560, 420, W("d3", 3)); L.pop(g1, "ice water", X1 - 560, 830, 60, W("d3", 3) + 0.5, L.GREY, "Patrick Hand", false);
  L.button(g1, X1, 360, W("d3", 8)); L.pop(g1, "one click", X1, 830, 60, W("d3", 8) + 0.5, L.GREY, "Patrick Hand", false);
  L.strip(g1, X1 + 540, 330, 60, 330, W("d3", 10), 8); L.pop(g1, "a strip of paper", X1 + 570, 830, 60, W("d3", 10) + 0.3, L.GREY, "Patrick Hand", false);

  // ---------- B2: it doesn't look like lying ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "it almost never looks like lying", X2 - 800, 175, 90, S("d4") - 0.1, 1.0);
  [[X2 - 850, W("d4", 10) - 0.2], [X2 - 270, W("d4", 12) - 0.1], [X2 + 310, W("d4", 17) - 0.1]].forEach(([x, at]) => L.box(g2, x, 250, 540, 560, at, { w: 7 }));
  I.path(g2, `M${X2 - 700},${520} q120,90 240,0 M${X2 - 690},${535} l-20,30 M${X2 - 580},${560} l0,36 M${X2 - 470},${535} l20,30`, W("d4", 10), 0.4, { w: 9 });
  L.pop(g2, "not checking", X2 - 580, 760, 62, W("d4", 11), INKC, "Patrick Hand", false);
  I.path(g2, `M${X2 - 200},${330} h400 q30,0 30,30 v120 q0,30 -30,30 h-260 l-60,50 l10,-50 h-90 q-30,0 -30,-30 v-120 q0,-30 30,-30 z`, W("d4", 13), 0.45, { w: 7 });
  L.pop(g2, "\"no way.\"", X2, 450, 80, W("d4", 14), RED, "Caveat", false);
  L.pop(g2, "arguing with bad news", X2, 760, 54, W("d4", 16), INKC, "Patrick Hand", false);
  I.path(g2, `M${X2 + 420},${300} h320 v400 h-320 z`, W("d4", 18), 0.4, { w: 6 }); for (let i = 0; i < 4; i++) I.path(g2, `M${X2 + 460},${370 + i * 70} h${i % 2 ? 180 : 230}`, W("d4", 18) + 0.2 + i * 0.05, 0.15, { w: 4, color: L.GREY, silent: true });
  L.pop(g2, "A+", X2 + 660, 650, 120, W("d4", 19), RED, "Caveat", "slap", -8);
  I.path(g2, `M${X2 + 780},${640} l-110,-110 l-14,-36 l36,14 l110,110 z`, W("d4", 19) + 0.2, 0.3, { w: 6, color: "#B07A2A", silent: true });
  L.pop(g2, "rigging the test", X2 + 580, 760, 60, W("d4", 21), INKC, "Patrick Hand", false);

  // ---------- poster: four tricks to keep a secret from you ----------
  const posters = [{ on: [S("d5") - 0.05, K.D + 0.1], slashAt: W("d5", 11), shakeAt: W("d5", 11), lines: [
    { txt: "TODAY:", y: 230, size: 110, fill: "#9A958C", at: S("d5") },
    { txt: "4 TRICKS", y: 500, size: 240, at: W("d5", 1) },
    { txt: "TO KEEP A SECRET", y: 690, size: 140, at: W("d5", 7) },
    { txt: "FROM YOU.", y: 950, size: 240, fill: RED, at: W("d5", 11), big: true }] }];
  const shots = [[0, X0, 540, 1], [S("d3") - 0.4, X1, 540, 1], [S("d4") - 0.4, X2, 540, 1]];
  K.run({ shots, posters });
})();
