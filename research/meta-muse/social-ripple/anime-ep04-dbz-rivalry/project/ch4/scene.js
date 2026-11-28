/* DBZ rivalry ep, ch4: Lesson 2 — a rival can push you or poison you (Kilduff 2014, soft wording; Kilduff, Galinsky, Gallo & Reade 2016; van de Ven, Zeelenberg & Pieters 2009/2011). Majin Vegeta, eps 228–229. */
(function () {
  const K = LONG({ keys: { push: 1, poison: 1, real: 1, runners: 1, faster: 1, rival: 1, link: 1, proof: 1, other: 1, yellow: 1, cards: 1, lie: 1, four: 1, darkest: 1, family: 1, purpose: 1, crowd: 1, envy: 1, up: 1, down: 1, harder: 1 }, noCap: ["u1", "u6"], fix: { u3: { 0: "But" } } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: the push ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("u2") - 0.4, 1300);
  const au = L.aura(g0, X0 - 660, FL + 10, 480, 840, "#F7D54A", S("u2") - 0.1); ups.push(au.update);
  const v0 = mk(g0, "vegetaCellSSJ", X0 - 660, FL, 1.0, S("u2") - 0.3); v0.face(0, "smirk").key(0, "arms", 0).key(F("u2", 0.12), "fist", 0.3);
  L.pop(g0, "THE PUSH", X0 - 300, 300, 120, F("u2", 0.02), L.GREEN, "Anton", "slap", -4); L.pop(g0, "because of Goku", X0 - 300, 390, 60, F("u2", 0.2), INKC, "Caveat", false);
  I.path(g0, `M${X0 - 150},${FL - 6} H${X0 + 1200} M${X0 + 980},${FL} V${FL - 330}`, F("u2", 0.3), 0.5, { w: 5, color: "#8A847A", attrs: { "stroke-dasharray": "22 14" } }); L.pop(g0, "amateur runners", X0 + 420, 230, 54, F("u2", 0.32), L.GREY, "Patrick Hand", false);
  const rue = mk(g0, "rue", X0 + 60, FL, 0.85, F("u2", 0.3)); rue.view(0, "side", 1).face(0, "determined").move(F("u2", 0.36), X0 + 900, T.u2[1] * 0.46).view(F("u2", 0.84), "front").face(F("u2", 0.84), "grin");
  const kai = mk(g0, "kai", X0 - 100, FL, 0.85, F("u2", 0.3)); kai.view(0, "side", 1).face(0, "strain").move(F("u2", 0.36), X0 + 760, T.u2[1] * 0.44).view(F("u2", 0.84), "front").face(F("u2", 0.84), "grin");
  L.sign(g0, "a little faster with a rival in the race", X0 + 420, 380, 900, 96, F("u2", 0.56), { size: 52, rot: -2, fill: "#E3F2D6", color: L.GREEN }); L.sign(g0, "a link, not proof", X0 + 420, 500, 420, 80, F("u2", 0.88), { size: 46, rot: 2, fill: "#FFFDF6", color: L.GREY });

  // ---------- B1: the other side ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("u3") - 0.4);
  L.pop(g1, "THE POISON", X1 - 520, 190, 110, F("u3", 0.06), RED, "Anton", "slap", -3);
  L.pop(g1, "7 seasons of Italian football", X1 - 440, 300, 54, F("u3", 0.18), L.GREY, "Patrick Hand", false);
  const cards = (y, n, at, lb, val) => { L.pop(g1, lb, X1 - 860, y + 58, 50, at, INKC, "Patrick Hand", false, 0, "start"); for (let i = 0; i < n; i++) L.rect(g1, X1 - 480 + i * 74, y, 54, 78, at + 0.1 + i * 0.06, "#F2C230", { rx: 6, rot: -6 + (i % 3) * 5, sound: i ? false : "pop" }); L.pop(g1, val, X1 + 30, y + 64, 70, at + 0.5, RED, "Anton", false); };
  cards(360, 6, F("u3", 0.34), "same-city rivals", "6.0"); cards(500, 4, F("u3", 0.42), "other matches", "4.3"); L.pop(g1, "yellow cards per match", X1 - 440, 660, 46, F("u3", 0.46), L.GREY, "Patrick Hand", false);
  L.pop(g1, "who lied to win a little money?", X1 + 530, 230, 50, F("u3", 0.56), L.GREY, "Patrick Hand", false);
  ups.push(L.bars(g1, [{ x: X1 + 330, y: 800, len: 430, thick: 150, fill: "#D8322A", at: F("u3", 0.72) }, { x: X1 + 580, y: 800, len: 104, thick: 150, fill: "#B8B0A2", at: F("u3", 0.8) }]));
  L.pop(g1, "50%", X1 + 405, 350 + 0, 76, F("u3", 0.76), RED, "Anton", "pop"); L.pop(g1, "12%", X1 + 655, 680, 70, F("u3", 0.84), INKC, "Anton", "pop"); L.pop(g1, "to a rival", X1 + 405, 860, 46, F("u3", 0.72), INKC, "Patrick Hand", false); L.pop(g1, "to others", X1 + 655, 860, 46, F("u3", 0.8), INKC, "Patrick Hand", false);
  L.pop(g1, "(small experiment, 70 students)", X1 + 530, 930, 40, F("u3", 0.9), L.GREY, "Patrick Hand", false);

  // ---------- B2: Majin Vegeta ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("u4") - 0.4, 1300);
  L.tx(g2, "episodes 228–229", X2 - 900, 150, 70, S("u4") - 0.1, 0.5, { color: L.GREY });
  const tM = F("u4", 0.52), fam = [[-640, 0.86, "#E3B9C8"], [-540, 0.5, "#C9B8E0"]].map(([dx, s, c]) => person(g2, X2 + dx, FL, s, F("u4", 0.2), c)); L.pop(win(g2, 0, tM), "at peace", X2 - 590, 480, 60, F("u4", 0.24), L.GREEN, "Caveat", false);
  ups.push((t) => { const u = ease(clamp((t - tM) / 0.8, 0, 1)); fam.forEach((g) => { g.setAttribute("transform", `translate(${(-260 * u).toFixed(1)},0)`); g.setAttribute("opacity", (1 - 0.7 * u).toFixed(2)); }); });
  const au2 = L.aura(g2, X2 - 300, FL + 10, 500, 860, "#B05AD0", tM + 0.05); ups.push(au2.update);
  const va = mk(win(g2, 0, tM + 0.08), "vegeta", X2 - 300, FL, 1.0, S("u4") - 0.3); va.face(0, "determined").key(F("u4", 0.4), { aL: 34, eL: -84, aR: -34, eR: 84, head: -6 }, 0.3).face(F("u4", 0.44), "strain");
  const vb = mk(win(g2, tM + 0.08, 1e9), "vegetaMajin", X2 - 300, FL, 1.0, S("u4") - 0.3); vb.face(0, "smirk").key(0, { aL: 34, eL: -84, aR: -34, eR: 84 }, 0).key(F("u4", 0.66), { aR: -92, eR: 0 }, 0.2).key(F("u4", 0.84), "arms", 0.3);
  I.path(win(g2, 0, tM + 0.3), `M${X2 + 300},${120} q-200,40 -260,180 q-60,120 -240,60 q-90,-40 -100,-140`, F("u4", 0.4), 0.5, { w: 9, color: "#B05AD0", attrs: { "stroke-dasharray": "6 16" } });
  flash(g2, X2 - 300, 500, tM); L.plate(g2, X2 - 300, 238, "MAJIN VEGETA", tM + 0.25, { size: 64 }); L.sign(g2, "on purpose", X2 + 40, 330, 340, 96, F("u4", 0.56), { size: 60, rot: 4, fill: "#FFD9C9", color: RED });
  const tK = F("u4", 0.7); for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) person(g2, X2 + 380 + i * 80 + r * 40, 600 - r * 120, 0.34, F("u4", 0.6) + (i + r * 9) * 0.01, r ? "#A9A39A" : "#8F877A");
  I.path(g2, `M${X2 + 340},${610} H${X2 + 1100} M${X2 + 380},${490} H${X2 + 1100}`, F("u4", 0.6), 0.3, { w: 6, color: "#8A847A", silent: true });
  const bl = el("line", { x1: X2 - 180, y1: 520, x2: X2 + 700, y2: 500, stroke: "#F7D54A", "stroke-width": 44, "stroke-linecap": "round", opacity: 0 }, g2); ups.push((t) => { const u = (t - tK) / 0.5; bl.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); }); flash(g2, X2 + 720, 500, tK + 0.1, 420);
  const gk = mk(g2, "gokuSSJ", X2 + 560, FL, 1.0, F("u4", 0.84)); gk.acc(0, "halo").face(0, "determined");

  // ---------- B3: two kinds of envy ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("u5") - 0.4, 1300);
  L.pop(g3, "two kinds of envy", X3, 110, 76, S("u5") + 0.1, INKC, "Caveat", false);
  [[-540, "#E3F2D6"], [540, "#FFD9C9"]].forEach(([dx, c], i) => L.rect(g3, X3 + dx - 130, FL - 220, 260, 220, F("u5", 0.18) + i * 0.25, c, { rx: 6, sound: "pop" }));
  const kT = mk(g3, "kai", X3 - 540, FL - 220, 0.8, F("u5", 0.18)); kT.face(0, "grin").key(0.1, "cheer", 0.3); const rU = mk(g3, "rue", X3 - 860, FL, 0.85, F("u5", 0.2)); rU.face(0, "determined").key(F("u5", 0.24), "look", 0.3).key(F("u5", 0.3), "fist", 0.3).face(F("u5", 0.76), "grin");
  L.arrow(g3, X3 - 800, 520, X3 - 640, 400, F("u5", 0.3), { w: 9, color: L.GREEN }); L.sign(g3, "\"I want to get up there too\"", X3 - 500, 215, 700, 96, F("u5", 0.28), { size: 50, rot: -3, fill: "#E3F2D6", color: L.GREEN });
  const nT = mk(g3, "nia", X3 + 540, FL - 220, 0.8, F("u5", 0.43)); nT.face(0, "smile"); const mD = mk(g3, "mo", X3 + 240, FL, 0.9, F("u5", 0.45)); mD.face(0, "tired").key(F("u5", 0.5), "arms", 0.3);
  L.arrow(g3, X3 + 460, 400, X3 + 330, 560, F("u5", 0.54), { w: 9, color: RED }); L.sign(g3, "\"I want them brought down\"", X3 + 500, 215, 680, 96, F("u5", 0.52), { size: 50, rot: 3, fill: "#FFD9C9", color: RED });
  L.pop(g3, "✓ worked harder", X3 - 190, 640, 60, F("u5", 0.84), L.GREEN, "Caveat", "pop"); L.pop(g3, "(small experiments with students)", X3, 960, 42, F("u5", 0.74), L.GREY, "Patrick Hand", false);

  const posters = [{ on: [S("u1") - 0.05, E("u1") + 0.5], shakeAt: F("u1", 0.62), lines: [{ txt: "LESSON #2", y: 260, size: 120, fill: "#9A958C", at: S("u1") }, { txt: "A RIVAL CAN PUSH YOU", y: 540, size: 176, at: F("u1", 0.3) }, { txt: "OR POISON YOU.", y: 800, size: 220, fill: RED, at: F("u1", 0.62), big: true }] },
    { on: [S("u6") - 0.05, K.D + 0.1], shakeAt: F("u6", 0.74), lines: [{ txt: "A RIVAL MAKES YOU BETTER", y: 340, size: 146, at: F("u6", 0.03) }, { txt: "WHILE YOU WANT TO CLIMB.", y: 520, size: 146, fill: "#9A958C", at: F("u6", 0.25) }, { txt: "AND WORSE THE MOMENT", y: 760, size: 150, at: F("u6", 0.52) }, { txt: "YOU WANT THEM TO FALL.", y: 950, size: 160, fill: RED, at: F("u6", 0.74), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [S("u2") - 0.3, X0 - 480, 500, 1.2], [F("u2", 0.3), X0 + 260, 540, 1.0, 1], [F("u2", 0.56), X0 + 440, 520, 1.1, -1], [F("u2", 0.84), X0 + 620, 600, 1.2, 1],
    [S("u3") - 0.4, X1, 540, 1.0], [F("u3", 0.2), X1 - 400, 500, 1.15, -1], [F("u3", 0.54), X1 + 480, 620, 1.12, 1], [F("u3", 0.9), X1 + 100, 560, 1.0],
    [S("u4") - 0.4, X2 - 200, 540, 1.0], [F("u4", 0.18), X2 - 440, 560, 1.2, -1], [tM - 0.4, X2 - 280, 470, 1.3, 1], [F("u4", 0.6), X2 + 200, 540, 1.0, -1], [F("u4", 0.84), X2 + 140, 580, 1.12, 1],
    [S("u5") - 0.4, X3, 540, 1.0], [F("u5", 0.2), X3 - 560, 520, 1.15, -1], [F("u5", 0.45), X3 + 420, 520, 1.15, 1], [F("u5", 0.72), X3, 540, 1.0]];
  K.run({ shots, posters, punches: [{ t: F("u2", 0.56), z: 1.06 }, { t: F("u3", 0.76), z: 1.08 }, { t: tM, z: 1.1 }, { t: F("u5", 0.84), z: 1.06 }], shakes: [{ t: tM, a: 14 }, { t: tK, a: 16 }], extra: tick });
})();
