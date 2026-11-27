/* Naruto loneliness ep, ch1: the thought ("surrounded, still alone"), host intro, title. Original cast only. */
(function () {
  const K = LONG({ keys: { surrounded: 1, alone: 1, popular: 1, naruto: 1, village: 1, look: 1, loneliness: 1, helps: 1 }, noCap: ["o4"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, GREY = "#B8B0A2";
  const person = (p, x, s, at, col = GREY) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: FL - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${FL} Q${x - 70 * s},${FL - 250 * s} ${x},${FL - 270 * s} Q${x + 70 * s},${FL - 250 * s} ${x + 62 * s},${FL} Z`, fill: col }, g);
    I.fill(p, g, at, 0.25, { sound: false }); return g; };

  // ---------- B0: surrounded, still alone ----------
  const X0 = X(0), g0 = B(0);
  I.path(g0, `M${X0 - 1100},${FL} H${X0 + 1100}`, 0, 0.6, { w: 5, color: "#8A847A", silent: true });
  const crowd = [-700, -520, -330, 330, 520, 700, -860, 860].map((dx, i) => person(g0, X0 + dx, 0.9 + (i % 3) * 0.08, 0.05 + i * 0.05));
  const mo = mk(g0, "mo", X0, FL, 1.05, 0.0); mo.key(0, "pockets", 0).face(0, "neutral").face(F("o1", 0.75), "sad").key(F("o1", 0.75), { head: 10 }, 0.5);
  [["lol", -560, 330], ["who's coming?", 520, 280], ["😂😂", -380, 220], ["same", 380, 420], ["omw", -720, 470]].forEach(([t, dx, y], i) => { const at = F("o1", 0.25) + i * 0.08;
    const bw = Math.max(150, t.length * 26 + 60); L.rect(g0, X0 + dx - bw / 2, y - 50, bw, 74, at, "#FFFDF6", { rx: 30, sound: i ? false : "pop" }); L.pop(g0, t, X0 + dx, y, 44, at + 0.03, INKC, "Patrick Hand", false); });
  const dim = el("rect", { x: X0 - 1200, y: -100, width: 2400, height: 1300, fill: "#F5EEDC", opacity: 0 }, g0); g0.appendChild(mo.root);
  ups.push((t) => dim.setAttribute("opacity", (0.72 * clamp((t - F("o1", 0.7)) / 0.6, 0, 1)).toFixed(2)));

  // ---------- B1: host Nia ----------
  const X1 = X(1), g1 = B(1);
  I.path(g1, `M${X1 - 1100},${FL} H${X1 + 1100}`, S("o2") - 0.3, 0.5, { w: 5, color: "#8A847A", silent: true });
  const nia = mk(g1, "nia", X1 - 520, FL, 1.05, S("o2") - 0.3); nia.face(0, "smile").say("o2").key(S("o2"), "wave", 0.3).key(F("o2", 0.4), "point", 0.3).key(F("o2", 0.85), "stand", 0.3);
  L.tx(g1, "you're in good company.", X1 - 180, 300, 90, F("o2", 0.1), 0.8);
  L.pop(g1, "one of the most popular anime heroes ever", X1 + 300, 460, 54, F("o2", 0.5), L.GREY, "Patrick Hand", false);
  L.sign(g1, "NARUTO", X1 + 300, 620, 420, 130, F("o2", 0.62), { font: "Anton", size: 100, fill: "#1E1B2E", color: "#F2C230", rot: -3 });
  L.pop(g1, "(the story, told — not drawn)", X1 + 300, 760, 42, F("o2", 0.75), L.GREY, "Patrick Hand", false);

  // ---------- B2: a village full of people ----------
  const X2 = X(2), g2 = B(2);
  L.tx(g2, "a village full of people", X2 - 820, 170, 96, S("o3") - 0.1, 0.8);
  I.path(g2, `M${X2 - 960},${560} l120,-90 l120,90 v340 M${X2 - 700},${600} l90,-70 l90,70 v300 M${X2 + 500},${560} l120,-90 l120,90 v340 M${X2 + 760},${600} l90,-70 l90,70 v300`, S("o3"), 0.8, { w: 6, color: "#A9A39A" });
  I.path(g2, `M${X2 - 1100},${FL} H${X2 + 1100}`, S("o3"), 0.5, { w: 5, color: "#8A847A", silent: true });
  const vil = [-480, -330, -180, 200, 350, 500].map((dx, i) => person(g2, X2 + dx, 0.7, F("o3", 0.2) + i * 0.06));
  const mo2 = mk(g2, "mo", X2, FL, 0.82, S("o3") - 0.2); mo2.key(0, "stand", 0).face(0, "neutral").key(F("o3", 0.7), "slump", 0.5).face(F("o3", 0.7), "sad");
  // villagers turn away: their heads slide to the side (backs to Mo)
  ups.push((t) => { const u = clamp((t - F("o3", 0.65)) / 0.5, 0, 1); vil.forEach((g, i) => g.setAttribute("transform", `translate(${((i < 3 ? -1 : 1) * 40 * u).toFixed(1)},0)`)); });
  L.pop(g2, "…and almost no one would look at him.", X2, 330, 60, F("o3", 0.75), RED, "Caveat", false);

  // ---------- title poster ----------
  const posters = [{ on: [S("o4") - 0.05, K.D + 0.1], shakeAt: F("o4", 0.55), lines: [
    { txt: "WHY YOU FEEL ALONE", y: 420, size: 170, at: S("o4") + 0.1 },
    { txt: "EVEN AROUND PEOPLE.", y: 640, size: 170, fill: RED, at: F("o4", 0.55), big: true },
    { txt: "what Naruto's story (and real research) teach us", y: 820, size: 60, font: "Patrick Hand", fill: "#9A958C", at: F("o4", 0.8) }] }];
  const shots = [[0, X0, 540, 1.0], [F("o1", 0.7), X0, 470, 1.35, -1], [S("o2") - 0.4, X1, 540, 1.0, 1], [S("o3") - 0.4, X2, 540, 1.0], [F("o3", 0.65), X2, 520, 1.2, -1]];
  K.run({ shots, posters, punches: [{ t: F("o1", 0.9), z: 1.08 }, { t: F("o2", 0.62), z: 1.1, x: X1 + 300, y: 620 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
