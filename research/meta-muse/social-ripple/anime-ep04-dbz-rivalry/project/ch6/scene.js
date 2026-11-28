/* DBZ rivalry ep, ch6: three suggestions (ours), care line, core truth, outro with Goku and Vegeta. */
(function () {
  const K = LONG({ keys: { suggest: 1, ours: 1, notice: 1, compare: 1, want: 1, stings: 1, learn: 1, ruler: 1, year: 1, worthless: 1, trust: 1, support: 1, comparing: 1, choose: 1, goku: 1 }, noCap: ["w6"], fix: { w4: { 0: "Three." } } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: three ways to use the comparison ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("w1") - 0.2);
  const nia = mk(g0, "nia", X0 - 760, FL, 0.95, S("w1") - 0.2); nia.face(0, "smile").say("w1").key(F("w1", 0.3), "point", 0.3).key(E("w1"), "stand", 0.3);
  CH.system(g0, X0 - 590, 190, 960, ["1. Notice who you compare with.", "2. Ask: what can I learn from them?", "3. Keep a second ruler: you, a year ago."], S("w1") + 0.3, { title: "[ COMPARING, MADE USEFUL ]", rowTimes: [S("w2"), S("w3"), S("w4")] });
  const mo = mk(g0, "mo", X0 + 560, FL, 0.92, S("w2") - 0.2); mo.face(0, "neutral").key(F("w2", 0.3), "look", 0.3).face(F("w3", 0.6), "smile").key(F("w3", 0.5), { aR: -80, eR: -20 }, 0.3).key(S("w4"), "stand", 0.3).face(F("w4", 0.6), "grin");
  const kai = mk(g0, "kai", X0 + 960, FL, 0.92, F("w2", 0.2)); kai.face(0, "grin").key(F("w3", 0.8), "wave", 0.3).key(S("w4"), "stand", 0.3);
  L.pop(win(g0, 0, S("w3")), "it tells you what you want", X0 + 730, 400, 48, F("w2", 0.62), L.BLUE, "Caveat", "pop");
  const bw = win(g0, S("w3"), S("w4")); L.rect(bw, X0 + 470, 340, 400, 84, F("w3", 0.62), "#FFFDF6", { rx: 30, sound: "pop" }); L.pop(bw, "how did you do it?", X0 + 670, 397, 46, F("w3", 0.64), INKC, "Patrick Hand", false);
  const hw = win(g0, S("w4"), 1e9); I.path(hw, `M${X0 + 720},${FL} V${340}`, S("w4"), 0.3, { w: 7, color: "#8A847A" }); [[FL - 340, "last year", L.GREY, 0.3], [FL - 460, "now", L.GREEN, 0.6]].forEach(([y, s, c, f]) => { I.path(hw, `M${X0 + 720},${y} h-60`, F("w4", f), 0.15, { w: 7, color: c }); L.pop(hw, s, X0 + 738, y + 14, 46, F("w4", f), c, "Caveat", false, 0, "start"); });

  // ---------- B1: care line ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("w5") - 0.4);
  const n2 = mk(g1, "nia", X1 - 420, FL, 1.05, S("w5") - 0.3); n2.face(0, "smile").say("w5").key(F("w5", 0.55), { aR: -60, eR: -30 }, 0.4);
  I.path(g1, L.heart(X1 + 300, 430, 120), F("w5", 0.4), 0.6, { w: 9, color: RED });
  L.pop(g1, "talk to someone you trust", X1 + 300, 700, 64, F("w5", 0.5), INKC, "Caveat", false); L.pop(g1, "free support lines in the description ↓", X1 + 300, 800, 46, F("w5", 0.74), L.GREY, "Patrick Hand", false);

  // ---------- B2: outro ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("w7") - 0.4, 1300);
  L.tx(g2, "who's your Goku? ↓", X2 - 420, 190, 100, S("w7"), 0.8);
  [["nia", -390, "wave", "smile"], ["kai", -130, "fist", "grin"], ["mo", 130, "stand", "smile"], ["rue", 390, "cheer", "grin"]].forEach(([n, dx, p, f], i) => { const h = mk(g2, n, X2 + dx, FL, 0.92, S("w7") + i * 0.15); h.face(0, f).key(S("w7") + i * 0.15 + 0.3, p, 0.3); if (n === "nia") h.say("w7"); });
  const gk = mk(g2, "goku", X2 - 690, FL, 0.92, S("w7") + 0.5); gk.face(0, "grin").key(S("w7") + 0.8, "wave", 0.3); const vg = mk(g2, "vegeta", X2 + 680, FL, 0.88, S("w7") + 0.7); vg.key(0, "arms", 0).face(0, "smirk");

  const posters = [{ on: [S("w6") - 0.05, E("w6") + 0.5], shakeAt: F("w6", 0.82), lines: [{ txt: "YOU'LL PROBABLY NEVER", y: 340, size: 150, at: F("w6", 0.03) }, { txt: "STOP COMPARING.", y: 540, size: 200, fill: "#9A958C", at: F("w6", 0.2) }, { txt: "BUT YOU CAN CHOOSE", y: 780, size: 170, at: F("w6", 0.5) }, { txt: "WHAT IT'S FOR.", y: 990, size: 210, fill: RED, at: F("w6", 0.82), big: true }] }];
  const shots = [[0, X0 - 200, 540, 1.0], [S("w2") - 0.2, X0 + 150, 540, 1.0, 1], [F("w2", 0.5), X0 + 640, 600, 1.25, -1], [S("w3") - 0.1, X0 - 60, 480, 1.1, 1], [F("w3", 0.5), X0 + 660, 600, 1.25, -1], [S("w4") - 0.1, X0 + 150, 540, 1.0, 1], [F("w4", 0.4), X0 + 520, 600, 1.25, -1],
    [S("w5") - 0.4, X1 - 360, 640, 1.35], [F("w5", 0.4), X1 - 40, 530, 1.08, 1], [S("w7") - 0.3, X2, 540, 1.0]];
  K.run({ shots, posters, punches: [{ t: S("w2"), z: 1.05 }, { t: S("w3"), z: 1.05 }, { t: S("w4"), z: 1.05 }], extra: tick });
})();
