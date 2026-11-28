/* One Piece help ep, ch4: Lesson 2 — you're not the burden you think (Robin, eps 274–278; Zhao & Epley 2022). Enies Lobby outfits per the model sheet. */
(function () {
  const K = LONG({ keys: { burden: 1, robin: 1, twenty: 1, years: 1, destroyed: 1, sold: 1, deal: 1, safely: 1, fear: 1, abandoned: 1, rooftop: 1, flag: 1, live: 1, sea: 1, photo: 1, willing: 1, happier: 1, bothered: 1, taking: 1, show: 1 }, noCap: ["x1", "x8"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };

  // ---------- B0: twenty years on the run ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("x2") - 0.4);
  L.tx(g0, "20 years on the run", X0 - 820, 170, 100, S("x2") + 0.2, 0.8);
  I.path(g0, `M${X0 - 860},${FL} q60,-120 200,-110 q140,-10 190,110`, F("x2", 0.3), 0.5, { w: 7, color: "#6B8E4E" });
  const fire = el("g", {}, g0); [[-760, 0], [-680, -30], [-600, 0]].forEach(([dx, dy], i) => I.fill(fire, el("path", { d: `M${X0 + dx},${800 + dy} q-40,-80 10,-150 q10,60 40,40 q-10,-60 40,-90 q10,90 -30,200 z`, fill: i % 2 ? "#F2C230" : "#F28C28", opacity: 0 }), F("x2", 0.36) + i * 0.06, 0.2, { sound: i ? false : "whoosh" }));
  ups.push((t) => fire.setAttribute("opacity", (0.75 + 0.25 * Math.sin(t * 9)).toFixed(2))); L.pop(g0, "her home, destroyed", X0 - 680, 560, 46, F("x2", 0.4), L.GREY, "Patrick Hand", false);
  const robin0 = mk(g0, "robin", X0 - 260, FL, 1.0, S("x2") - 0.3); robin0.view(0, "side", 1).face(0, "sad").move(F("x2", 0.5), X0 + 380, T.x2[1] * 0.5 + 0.5);
  const tr = [80, 300, 520, 740].map((dx, i) => person(g0, X0 + dx, FL, 0.9, F("x2", 0.62) + i * 0.08));
  ups.push((t) => tr.forEach((g, i) => { const u = ease(clamp((t - F("x2", 0.72) - i * 0.12) / 0.5, 0, 1)); g.setAttribute("transform", `translate(0,${(-u * 30).toFixed(1)})`); g.setAttribute("opacity", (1 - 0.6 * u).toFixed(2)); }));
  L.pop(g0, "sold out, again and again", X0 + 420, 330, 56, F("x2", 0.8), RED, "Caveat", false);

  // ---------- B1: the deal, and the fear ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("x3") - 0.4);
  const robin1 = mk(g1, "robin", X1 - 420, FL, 1.05, S("x3") - 0.3); robin1.face(0, "neutral").key(F("x3", 0.6), "cuffed", 0.4).face(F("x3", 0.6), "sad").key(S("x4"), { head: 20 }, 0.5);
  L.box(g1, X1 + 20, 260, 820, 400, F("x3", 0.45)); L.pop(g1, "THE DEAL", X1 + 430, 350, 80, F("x3", 0.5), INKC, "Anton", "slap");
  L.pop(g1, "herself", X1 + 230, 520, 76, F("x3", 0.62), RED, "Caveat", false); L.arrow(g1, X1 + 350, 500, X1 + 500, 500, F("x3", 0.7), { w: 7 }); L.pop(g1, "her friends", X1 + 660, 500, 64, F("x3", 0.8), L.GREEN, "Caveat", false); L.pop(g1, "leave safely", X1 + 660, 570, 48, F("x3", 0.85), L.GREEN, "Patrick Hand", false);
  L.sign(g1, "\"a burden\"", X1 - 420, 260, 340, 100, F("x4", 0.45), { size: 60, rot: -4, fill: "#FFFDF6", color: L.GREY }); L.sign(g1, "abandoned again", X1 + 430, 780, 460, 90, F("x4", 0.75), { size: 54, rot: 3, fill: "#FFD9C9", color: RED });

  // ---------- B2: Enies Lobby — the rooftop, the flag, "I want to live" ----------
  const X2 = X(2), g2 = B(2), RF = 760;
  L.tx(g2, "episode 278", X2 - 900, 150, 80, S("x5") - 0.1, 0.5, { color: L.GREY });
  I.path(g2, `M${X2 - 960},${RF} H${X2 - 120} V${1100} M${X2 - 960},${RF} v-40 h90 v40 m120,0 v-40 h90 v40 m120,0 v-40 h90 v40 m120,0 v-40 h90 v40`, S("x5"), 0.7, { w: 8, color: "#5E8C7A" });
  I.path(g2, `M${X2 + 420},${1100} V${640} H${X2 + 960} M${X2 + 420},${640} v-50 H${X2 + 960} M${X2 + 600},${590} V${200} M${X2 + 600},${200} H${X2 + 960}`, S("x5") + 0.2, 0.8, { w: 8, color: "#8A847A" });
  const sil = [[-860, "#8F877A"], [-720, "#A9A39A"], [-200, "#A9A39A"], [-330, "#8F877A"]].map(([dx, c], i) => person(g2, X2 + dx, RF, 0.62, S("x5") + 0.3 + i * 0.06, c));
  const luffy = mk(g2, "luffyEL", X2 - 580, RF, 0.78, S("x5") + 0.2); luffy.key(0, "arms", 0).face(0, "determined").key(F("x5", 0.42), "point", 0.3).key(F("x5", 0.62), "arms", 0.3).face(F("x5", 0.72), "strain").key(F("x5", 0.72), "cheer", 0.2);
  const soge = mk(g2, "sogeking", X2 - 450, RF, 0.74, S("x5") + 0.35); soge.key(F("x5", 0.45), { aR: -100, eR: 0 }, 0.3);
  const robin = mk(g2, "robin", X2 + 720, 640, 0.78, S("x5") + 0.4); robin.key(0, "cuffed", 0).face(0, "sad").face(F("x5", 0.85), "wow").face(S("x6"), "strain").key(S("x6"), { head: -8 }, 0.3);
  // flag + flame
  const fx = X2 + 330, fy = 150; I.path(g2, `M${fx},${fy + 300} V${fy}`, S("x5") + 0.5, 0.3, { w: 8, color: "#6B6359" }); const flag = el("g", {}, g2); L.rect(flag, fx, fy, 220, 140, S("x5") + 0.6, "#FFFFFF", { rx: 2, sound: false });
  I.fill(flag, el("path", { d: `M${fx + 110},${fy + 70} m-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0 M${fx + 50},${fy + 70} h120 M${fx + 110},${fy + 20} v100`, fill: "none", stroke: "#2A3A6A", "stroke-width": 7, opacity: 0 }), S("x5") + 0.7, 0.2, { sound: false });
  [[50, 70], [170, 70], [110, 22], [110, 118]].forEach(([dx, dy]) => I.fill(flag, el("circle", { cx: fx + dx, cy: fy + dy, r: 11, fill: "#2A3A6A", opacity: 0 }), S("x5") + 0.75, 0.2, { sound: false }));
  const shot = el("circle", { r: 14, fill: "#F28C28", stroke: INKC, "stroke-width": 4, opacity: 0 }, g2), burn = el("g", { opacity: 0 }, g2), tS = F("x5", 0.48), tH = tS + 0.45;
  [[40, 0], [110, -20], [180, 0]].forEach(([dx, dy], i) => el("path", { d: `M${fx + dx - 30},${fy + 140 + dy} q-40,-80 10,-150 q10,60 40,40 q-10,-60 40,-90 q10,90 -30,200 z`, fill: i % 2 ? "#F2C230" : "#F28C28" }, burn));
  ups.push((t) => { const u = clamp((t - tS) / (tH - tS), 0, 1); shot.setAttribute("opacity", u > 0 && u < 1 ? 1 : 0); shot.setAttribute("cx", (X2 - 380 + (fx + 110 - (X2 - 380)) * u).toFixed(1)); shot.setAttribute("cy", (RF - 330 + (fy + 70 - (RF - 330)) * u - Math.sin(u * Math.PI) * 60).toFixed(1));
    const b = clamp((t - tH) / 0.4, 0, 1); burn.setAttribute("opacity", (b * (0.8 + 0.2 * Math.sin(t * 10))).toFixed(2)); flag.setAttribute("opacity", (1 - 0.75 * clamp((t - tH) / 1.2, 0, 1)).toFixed(2)); });
  L.pop(g2, "SAY IT!", X2 - 500, 345, 120, F("x5", 0.74), RED, "Anton", "bigslam", -4);
  L.rect(g2, X2 + 60, 400, 560, 120, F("x6", 0.05), "#FFFDF6", { rx: 40, sound: "pop" }); L.pop(g2, "I want to live!", X2 + 340, 482, 84, F("x6", 0.08), RED, "Caveat", false);
  robin.cry(F("x5", 0.92));

  // ---------- B3: the photo study ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("x7") - 0.4);
  const rue = mk(g3, "rue", X3 - 700, FL, 0.95, S("x7") - 0.3); rue.face(0, "neutral").key(F("x7", 0.25), { aR: -85, eR: -5 }, 0.3).face(F("x7", 0.8), "grin");
  const mo = mk(g3, "mo", X3 - 380, FL, 0.95, F("x7", 0.2)); mo.face(0, "neutral").face(F("x7", 0.6), "smile").key(F("x7", 0.4), { aL: 70, eL: -80, aR: -70, eR: 80 }, 0.3);
  L.rect(g3, X3 - 575, 520, 90, 60, F("x7", 0.3), "#3A3A44", { rx: 8, sound: "pop" }); I.fill(g3, el("circle", { cx: X3 - 530, cy: 550, r: 16, fill: "#9CC3D9", stroke: INKC, "stroke-width": 4, opacity: 0 }), F("x7", 0.32), 0.15, { sound: false });
  L.pop(g3, "\"could you take my photo?\"", X3 - 540, 300, 52, F("x7", 0.22), INKC, "Caveat", false);
  const rows = [["willing", 0.62, 300, 370, L.GREEN], ["happy to help", 0.74, 280, 340, L.GREEN], ["bothered", 0.86, 200, 40, RED]]; const specs = [];
  rows.forEach(([lb, f, e2, a2, col], i) => { const y = 300 + i * 190; L.tx(g3, lb, X3 + 20, y - 14, 54, F("x7", f) - 0.2, 0.3, { font: "Patrick Hand" }); L.pop(g3, "guessed", X3 - 10, y + 44, 34, F("x7", f), L.GREY, "Patrick Hand", false, 0, "end"); L.pop(g3, "actual", X3 - 10, y + 104, 34, F("x7", f) + 0.1, INKC, "Patrick Hand", false, 0, "end");
    specs.push({ x: X3 + 20, y: y + 10, len: e2 * 2, thick: 44, fill: "#B8B0A2", at: F("x7", f), horizontal: true }, { x: X3 + 20, y: y + 70, len: a2 * 2, thick: 44, fill: col, at: F("x7", f) + 0.12, horizontal: true }); });
  ups.push(L.bars(g3, specs));

  const posters = [{ on: [S("x1") - 0.05, E("x1") + 0.45], shakeAt: F("x1", 0.6), lines: [{ txt: "LESSON #2", y: 260, size: 120, fill: "#9A958C", at: S("x1") }, { txt: "YOU'RE NOT THE BURDEN", y: 540, size: 164, at: F("x1", 0.3) }, { txt: "YOU THINK YOU ARE.", y: 800, size: 190, fill: RED, at: F("x1", 0.6), big: true }] },
    { on: [S("x8") - 0.05, K.D + 0.1], shakeAt: F("x8", 0.75), lines: [{ txt: "ASKING ISN'T TAKING.", y: 400, size: 170, at: F("x8", 0.05) }, { txt: "IT'S LETTING SOMEONE", y: 640, size: 150, fill: "#9A958C", at: F("x8", 0.5) }, { txt: "SHOW UP FOR YOU.", y: 880, size: 200, fill: RED, at: F("x8", 0.75), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("x2", 0.3), X0 - 400, 560, 1.15, -1], [F("x2", 0.55), X0 + 300, 540, 1.05, 1], [S("x3") - 0.4, X1, 540, 1.0], [F("x3", 0.45), X1 + 200, 500, 1.1, -1], [S("x4"), X1 + 60, 480, 1.06, 1], [F("x4", 0.7), X1 + 40, 560, 1.04, -1],
    [S("x5") - 0.4, X2, 540, 1.0], [F("x5", 0.2), X2 - 480, 560, 1.3, -1], [tS - 0.2, X2 - 60, 440, 1.05, 1], [tH + 0.3, X2 + 330, 300, 1.4], [F("x5", 0.72), X2 - 480, 562, 1.35, -1], [F("x5", 0.9), X2 + 500, 470, 1.28, 1], [F("x6", 0.6), X2, 520, 1.0],
    [S("x7") - 0.4, X3 - 520, 600, 1.1], [F("x7", 0.2), X3 - 500, 600, 1.2, -1], [F("x7", 0.58), X3 + 220, 520, 1.1, 1]];
  K.run({ shots, posters, punches: [{ t: F("x3", 0.5), z: 1.06 }, { t: F("x4", 0.45), z: 1.07 }, { t: F("x6", 0.08), z: 1.1 }, { t: F("x7", 0.86), z: 1.06 }], shakes: [{ t: tH, a: 12 }, { t: F("x5", 0.74), a: 12 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
