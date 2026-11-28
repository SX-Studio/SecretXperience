/* One Piece help ep, ch1: the thought ("I can't ask"), host intro, title. Crew only. */
(function () {
  const K = LONG({ keys: { drowning: 1, help: 1, burden: 1, no: 1, alone: 1, famous: 1, backwards: 1, hard: 1, anyway: 1 }, noCap: ["u4"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });

  // ---------- B0: carrying it all alone ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, 0);
  const kai = mk(g0, "kai", X0 - 200, FL, 1.05, 0.0); kai.key(0, { aL: 168, eL: 8, aR: -168, eR: -8 }, 0).face(0, "strain");
  const boxes = el("g", {}, g0); [[0, 150, "#C9A66B"], [-18, 130, "#B8915A"], [14, 120, "#D4B27A"], [-6, 110, "#C9A66B"], [10, 96, "#B8915A"]].forEach(([dx, w, c], i) => { const y = 352 - i * 84; el("rect", { x: X0 - 200 + dx - w / 2, y, width: w, height: 80, rx: 4, fill: c, stroke: INKC, "stroke-width": 6 }, boxes); el("path", { d: `M${X0 - 200 + dx - w / 2},${y + 26} h${w}`, stroke: INKC, "stroke-width": 3 }, boxes); });
  ups.push((t) => boxes.setAttribute("transform", `rotate(${(Math.sin(t * 2.1) * 2.5).toFixed(2)} ${X0 - 200} 432)`));
  const rue = mk(g0, "rue", X0 + 250, FL, 1.0, 0.3); rue.face(0, "neutral").key(F("u1", 0.5), { aL: 70, eL: -20 }, 0.3).face(F("u1", 0.5), "smile");
  L.rect(g0, X0 - 80, 500, 250, 80, F("u1", 0.75), "#FFFDF6", { rx: 30, sound: "pop" }); L.pop(g0, "I'm fine!", X0 + 45, 555, 52, F("u1", 0.78), INKC, "Patrick Hand", false);
  [["\"don't be a burden\"", 0.1, 215, -3], ["\"they'll say no\"", 0.4, 335, 3], ["\"I've always done it alone\"", 0.7, 455, -2]].forEach(([t, f, y, r]) => L.sign(g0, t, X0 + 790, y, t.length * 25 + 80, 90, F("u2", f), { size: 48, rot: r, fill: "#FFFDF6", color: L.GREY }));
  rue.face(F("u2", 0.2), "sad");

  // ---------- B1: two famous scenes ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("u3") - 0.3);
  const nia = mk(g1, "nia", X1 - 540, FL, 1.05, S("u3") - 0.3); nia.face(0, "smile").say("u3").key(F("u3", 0.15), "point", 0.3).key(F("u3", 0.8), "stand", 0.3);
  L.sign(g1, "ONE PIECE", X1 + 120, 220, 480, 130, F("u3", 0.05), { font: "Anton", size: 100, fill: "#1E1B2E", color: "#F2C230", rot: -3 });
  [["EP 37", "Arlong Park", -150, 0.3], ["EP 278", "Enies Lobby", 420, 0.42]].forEach(([ep, nm, dx, f]) => { L.box(g1, X1 + dx - 230, 360, 460, 330, F("u3", f)); L.pop(g1, ep, X1 + dx, 490, 120, F("u3", f) + 0.15, RED, "Anton", "slap"); L.pop(g1, nm, X1 + dx, 610, 64, F("u3", f) + 0.25, INKC, "Caveat", false); });
  L.pop(g1, "…and the research says we've got it backwards", X1 + 130, 800, 54, F("u3", 0.68), L.GREY, "Patrick Hand", false);

  const posters = [{ on: [S("u4") - 0.05, K.D + 0.1], shakeAt: F("u4", 0.35), lines: [
    { txt: "WHY ASKING FOR HELP", y: 400, size: 170, at: S("u4") + 0.1 }, { txt: "IS SO HARD.", y: 640, size: 230, fill: RED, at: F("u4", 0.35), big: true },
    { txt: "and why you should do it anyway", y: 800, size: 66, font: "Patrick Hand", fill: "#9A958C", at: F("u4", 0.62) }] }];
  const shots = [[0, X0, 540, 1.0], [F("u1", 0.55), X0 - 60, 500, 1.2, -1], [S("u2") - 0.2, X0 + 300, 540, 1.0, 1], [S("u3") - 0.4, X1, 540, 1.0], [F("u3", 0.3), X1 + 40, 520, 1.06, -1]];
  K.run({ shots, posters, punches: [{ t: F("u1", 0.78), z: 1.06 }, { t: F("u2", 0.4), z: 1.05 }, { t: F("u3", 0.45), z: 1.06 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
