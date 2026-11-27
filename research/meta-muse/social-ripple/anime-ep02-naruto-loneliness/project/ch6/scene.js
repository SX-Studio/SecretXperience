/* Naruto loneliness ep, ch6: what helps (Masi et al. 2011; Epley & Schroeder 2014), the small step, care line, core truth, outro. Original cast only. */
(function () {
  const K = LONG({ keys: { helps: 1, fifty: 1, small: 1, negative: 1, thoughts: 1, nobody: 1, handful: 1, hint: 1, wrong: 1, stranger: 1, nicer: 1, message: 1, thought: 1, trust: 1, support: 1, seen: 1 }, noCap: ["t7"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });

  // ---------- B0: 50 studies; the promising one: catching negative thoughts ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("t1") - 0.2);
  L.tx(g0, "50 studies of what helps", X0 - 820, 170, 90, S("t1"), 0.8);
  for (let i = 0; i < 7; i++) L.rect(g0, X0 - 820 + i * 12, 640 - i * 40, 280, 54, F("t1", 0.3) + i * 0.05, "#FFFDF6", { rx: 4, sound: i ? false : "swish" });
  L.sign(g0, "overall: small effects", X0 - 640, 800, 460, 90, S("t2") + 0.1, { size: 52, rot: -3, fill: "#FFFDF6", color: L.GREY });
  const mo = mk(g0, "mo", X0 + 160, FL, 1.0, S("t2") - 0.2); mo.key(0, "pockets", 0).face(0, "sad").face(F("t2", 0.92), "wow");
  L.thought(g0, X0 + 560, 360, 560, 170, F("t2", 0.55)); L.pop(g0, "\"nobody wants to talk to me\"", X0 + 560, 380, 50, F("t2", 0.75), INKC, "Caveat", false);
  I.path(g0, `M${X0 + 300},${270} L${X0 + 820},${450} M${X0 + 820},${270} L${X0 + 300},${450}`, F("t2", 0.92), 0.3, { w: 12, color: RED, loud: 1.3 });
  L.sign(g0, "only a handful of studies: a hint, not a guarantee", X0 - 380, 300, 840, 80, S("t3"), { size: 40, rot: 2, fill: "#FFF6E6", color: L.GREY });

  // ---------- B1: the train — talking to a stranger ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("t4") - 0.4);
  I.path(g1, `M${X1 - 900},${260} h1800 M${X1 - 900},${300} h1800`, S("t4") - 0.2, 0.6, { w: 6, color: "#8A847A" });
  for (let i = 0; i < 4; i++) I.path(g1, `M${X1 - 760 + i * 460},${330} h300 v180 h-300 z`, S("t4") + i * 0.05, 0.25, { w: 5, color: "#9CC3D9", silent: i > 0 });
  const m1 = mk(g1, "mo", X1 - 200, FL, 0.95, S("t4") - 0.2); m1.face(0, "neutral").face(F("t4", 0.3), "talk").say("t4").key(F("t4", 0.3), { aR: -70, eR: -20 }, 0.3).face(F("t4", 0.55), "smile");
  const kai = mk(g1, "kai", X1 + 160, FL, 0.95, S("t4")); kai.face(0, "neutral").face(F("t4", 0.4), "smile").key(F("t4", 0.45), "wave", 0.3).key(F("t4", 0.7), "stand", 0.3);
  L.pop(g1, "a stranger", X1 + 160, 330, 50, F("t4", 0.25), L.GREY, "Patrick Hand", false);
  L.sign(g1, "nicer ride ✓", X1 - 20, 220, 320, 90, F("t4", 0.55), { size: 56, rot: -3, fill: "#E3F2D6", color: L.GREEN });
  L.pop(g1, "(others predicted the opposite)", X1 + 380, 680, 44, F("t4", 0.82), L.GREY, "Patrick Hand", false);

  // ---------- B2: your small step: one message ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("t5") - 0.4);
  const m2 = mk(g2, "mo", X2 - 560, FL, 1.0, S("t5") - 0.3); m2.face(0, "neutral").key(F("t5", 0.3), { aR: -130, eR: -110, head: 10 }, 0.3).face(F("t5", 0.6), "smile");
  L.phone(g2, X2 - 180, 280, F("t5", 0.35)); L.rect(g2, X2 - 160, 380, 220, 120, F("t5", 0.75), "#9CC3D9", { rx: 20, sound: "pop" });
  L.pop(g2, "hey, I thought", X2 - 50, 430, 34, F("t5", 0.78), INKC, "Patrick Hand", false); L.pop(g2, "of you", X2 - 50, 475, 34, F("t5", 0.8), INKC, "Patrick Hand", false);
  L.arrow(g2, X2 + 120, 430, X2 + 340, 430, F("t5", 0.85), { w: 7, color: L.BLUE, curve: [X2 + 230, 360] });
  const rue = mk(g2, "rue", X2 + 560, FL, 1.0, F("t5", 0.6)); rue.face(0, "neutral").face(F("t5", 0.92), "grin").key(F("t5", 0.92), "cheer", 0.3);
  L.sign(g2, "your small step", X2 - 560, 200, 380, 90, S("t5") + 0.1, { size: 56, rot: -3 });

  // ---------- B3: care line (calm) ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("t6") - 0.4);
  const nia = mk(g3, "nia", X3 - 420, FL, 1.05, S("t6") - 0.3); nia.face(0, "smile").say("t6").key(F("t6", 0.5), { aR: -60, eR: -30 }, 0.4);
  I.path(g3, L.heart(X3 + 300, 430, 120), F("t6", 0.4), 0.6, { w: 9, color: RED });
  L.pop(g3, "talk to someone you trust", X3 + 300, 700, 64, F("t6", 0.4), INKC, "Caveat", false);
  L.pop(g3, "free support lines in the description ↓", X3 + 300, 800, 46, F("t6", 0.75), L.GREY, "Patrick Hand", false);

  // ---------- B4: outro — who made you feel seen ----------
  const X4 = X(4), g4 = B(4); floor(g4, X4, S("t8") - 0.4);
  L.tx(g4, "who made you feel seen? ↓", X4 - 700, 190, 100, S("t8"), 0.8);
  [["nia", -600, "wave", "smile"], ["kai", -200, "fist", "grin"], ["mo", 200, "stand", "smile"], ["rue", 600, "cheer", "grin"]].forEach(([n, dx, p, f], i) => { const h = mk(g4, n, X4 + dx, FL, 0.95, S("t8") + i * 0.15); h.face(0, f).key(S("t8") + i * 0.15 + 0.3, p, 0.3); if (n === "nia") h.say("t8"); });

  const posters = [{ on: [S("t7") - 0.05, E("t7") + 0.5], shakeAt: F("t7", 0.7), lines: [{ txt: "HE BECAME STRONG", y: 400, size: 180, at: F("t7", 0.45) }, { txt: "BY REFUSING TO STOP", y: 620, size: 150, fill: "#9A958C", at: F("t7", 0.6) }, { txt: "REACHING OUT.", y: 860, size: 220, fill: RED, at: F("t7", 0.8), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("t2", 0.55), X0 + 300, 520, 1.12, 1], [S("t4") - 0.4, X1, 540, 1.0], [F("t4", 0.5), X1, 560, 1.15, -1], [S("t5") - 0.4, X2, 540, 1.0], [S("t6") - 0.4, X3, 540, 1.0], [F("t6", 0.5), X3, 520, 1.1], [S("t8") - 0.3, X4, 540, 1.0]];
  K.run({ shots, posters, punches: [{ t: F("t2", 0.92), z: 1.08 }, { t: F("t4", 0.55), z: 1.06 }, { t: F("t5", 0.75), z: 1.1, x: X2 - 50, y: 440 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
