/* One Piece help ep, ch6: what to do (our suggestions), care line, core truth, outro. Crew only. */
(function () {
  const K = LONG({ keys: { suggest: 1, ours: 1, small: 1, specific: 1, ten: 1, minutes: 1, one: 1, person: 1, direct: 1, hint: 1, decide: 1, call: 1, heavy: 1, trust: 1, support: 1, weaker: 1, alone: 1, ask: 1 }, noCap: ["z6"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });

  // ---------- B0: three ways to make asking easier; Kai finally asks ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("z1") - 0.2);
  const nia = mk(g0, "nia", X0 - 690, FL, 0.95, S("z1") - 0.2); nia.face(0, "smile").say("z1").key(F("z1", 0.3), "point", 0.3).key(E("z1"), "stand", 0.3);
  CH.system(g0, X0 - 520, 200, 900, ["1. Small and specific.", "2. One person, not the room.", "3. Let them decide."], S("z1") + 0.3, { title: "[ ASKING, MADE EASIER ]", rowTimes: [S("z2"), S("z3"), S("z4")] });
  const kai = mk(g0, "kai", X0 + 620, FL, 0.9, S("z2") - 0.2); kai.key(0, { aL: 168, eL: 8, aR: -168, eR: -8 }, 0).face(0, "strain").face(F("z2", 0.7), "smile").key(E("z2") + 0.4, { aL: 150, eL: 30, aR: -150, eR: -30 }, 0.4).face(E("z2") + 0.5, "grin");
  const stack = (dx, n, base) => { const g = el("g", { opacity: 0 }, g0); for (let i = 0; i < n; i++) el("rect", { x: X0 + dx - 60, y: base - i * 70, width: 120, height: 66, rx: 4, fill: i % 2 ? "#B8915A" : "#C9A66B", stroke: INKC, "stroke-width": 5 }, g); return g; };
  const big = stack(620, 5, 430), half = stack(620, 2, 430), other = stack(880, 3, 500); I.fill(g0, big, S("z2") - 0.1, 0.2, { sound: false });
  const rue = mk(g0, "rue", X0 + 1500, FL, 0.9, F("z2", 0.5)); rue.view(0, "side", -1).move(F("z2", 0.55), X0 + 880, 0.8).view(E("z2") + 0.1, "front").face(0, "smile").key(E("z2") + 0.4, { aL: 150, eL: 30, aR: -150, eR: -30 }, 0.4).face(E("z2") + 0.5, "grin");
  ups.push((t) => { const sw = t >= E("z2") + 0.4; big.setAttribute("display", sw ? "none" : "inline"); half.setAttribute("opacity", sw ? 1 : 0); other.setAttribute("opacity", sw ? 1 : 0); });
  L.rect(g0, X0 + 225, 530, 300, 80, F("z2", 0.72), "#FFFDF6", { rx: 30, sound: "pop" }); L.pop(g0, "10 minutes?", X0 + 375, 585, 50, F("z2", 0.74), INKC, "Patrick Hand", false);

  // ---------- B1: care line ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("z5") - 0.4);
  const n2 = mk(g1, "nia", X1 - 420, FL, 1.05, S("z5") - 0.3); n2.face(0, "smile").say("z5").key(F("z5", 0.55), { aR: -60, eR: -30 }, 0.4);
  I.path(g1, L.heart(X1 + 300, 430, 120), F("z5", 0.5), 0.6, { w: 9, color: RED });
  L.pop(g1, "talk to someone you trust", X1 + 300, 700, 64, F("z5", 0.55), INKC, "Caveat", false); L.pop(g1, "free support lines in the description ↓", X1 + 300, 800, 46, F("z5", 0.78), L.GREY, "Patrick Hand", false);

  // ---------- B2: outro ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("z7") - 0.4);
  L.tx(g2, "what could you ask for this week? ↓", X2 - 820, 190, 88, S("z7"), 0.9);
  [["nia", -600, "wave", "smile"], ["kai", -200, "fist", "grin"], ["mo", 200, "stand", "smile"], ["rue", 600, "cheer", "grin"]].forEach(([n, dx, p, f], i) => { const h = mk(g2, n, X2 + dx, FL, 0.95, S("z7") + i * 0.15); h.face(0, f).key(S("z7") + i * 0.15 + 0.3, p, 0.3); if (n === "nia") h.say("z7"); });

  const posters = [{ on: [S("z6") - 0.05, E("z6") + 0.5], shakeAt: F("z6", 0.8), lines: [{ txt: "SHE DIDN'T GET WEAKER", y: 380, size: 160, at: F("z6", 0.05) }, { txt: "WHEN SHE ASKED.", y: 580, size: 160, fill: "#9A958C", at: F("z6", 0.25) }, { txt: "SHE STOPPED", y: 800, size: 190, at: F("z6", 0.6) }, { txt: "FIGHTING ALONE.", y: 1000, size: 190, fill: RED, at: F("z6", 0.8), big: true }] }];
  const shots = [[0, X0 - 200, 540, 1.0], [S("z2") - 0.2, X0 + 100, 540, 1.0, 1], [F("z2", 0.6), X0 + 640, 585, 1.15, -1], [S("z3") - 0.1, X0 + 100, 525, 1.01, 1], [S("z4") - 0.1, X0 + 115, 545, 1.0, -1], [S("z5") - 0.4, X1, 540, 1.0], [F("z5", 0.55), X1, 520, 1.1], [S("z7") - 0.3, X2, 540, 1.0]];
  K.run({ shots, posters, punches: [{ t: S("z2"), z: 1.05 }, { t: S("z3"), z: 1.05 }, { t: S("z4"), z: 1.05 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
