/* DBZ rivalry ep, ch1: the thought (someone got what you wanted), Vegeta's entrance, title. */
(function () {
  const K = LONG({ keys: { wanted: 1, happy: 1, smaller: 1, bad: 1, feeling: 1, vegeta: 1, episodes: 1, comparing: 1, yourself: 1 }, noCap: ["r4"], fix: { r2: { 0: "Then" } } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: the post ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, 0);
  const moW = el("g", {}, g0), mo = mk(moW, "mo", X0 - 560, FL, 1.1, 0); mo.face(0, "neutral").key(0, { aR: -40, eR: -110, head: 6 }, 0).face(F("r1", 0.42), "sad").key(F("r1", 0.8), "slump", 0.5);
  el("rect", { x: X0 - 500, y: 560, width: 54, height: 92, rx: 8, fill: "#2A2A30", stroke: INKC, "stroke-width": 5 }, moW);
  ups.push((t) => { const u = ease(clamp((t - F("r1", 0.8)) / 0.7, 0, 1)); moW.setAttribute("transform", `translate(${X0 - 560},${FL}) scale(${(1 - 0.24 * u).toFixed(3)}) translate(${-(X0 - 560)},${-FL})`); });
  L.box(g0, X0 + 20, 200, 800, 600, 0.05); L.pop(g0, "new post", X0 + 150, 262, 44, 0.2, L.GREY, "Patrick Hand", false);
  const kai = mk(g0, "kai", X0 + 250, 700, 0.8, 0.15); kai.face(0, "grin").key(0.4, "cheer", 0.3);
  L.sign(g0, "I GOT THE JOB!", X0 + 560, 400, 440, 110, 0.5, { font: "Anton", size: 62, rot: -4 });
  [[X0 + 420, 560, "#F2C230", 12], [X0 + 520, 620, "#E0567A", -20], [X0 + 640, 540, "#5B8DB8", 30], [X0 + 720, 640, "#7FB069", -8], [X0 + 470, 690, "#E0567A", 40], [X0 + 680, 720, "#F2C230", -30]].forEach(([x, y, c, r], i) => L.rect(g0, x, y, 34, 16, 0.6 + i * 0.05, c, { rot: r, rx: 3, sound: false }));
  I.path(g0, L.heart(X0 + 80, 728, 34), 0.9, 0.3, { w: 6, color: RED }); L.pop(g0, "2,481", X0 + 165, 772, 44, 1.0, INKC, "Patrick Hand", false);
  L.pop(g0, "smaller.", X0 - 250, 640, 96, F("r1", 0.86), RED, "Caveat", "slap", -4);
  L.thought(g0, X0 - 520, 250, 700, 200, S("r2")); L.pop(g0, "\"why can't I just be", X0 - 520, 240, 54, F("r2", 0.15), INKC, "Caveat", false); L.pop(g0, "happy for him?\"", X0 - 520, 305, 54, F("r2", 0.3), INKC, "Caveat", false);

  // ---------- B1: its name is Vegeta ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("r3") - 0.3);
  const nia = mk(g1, "nia", X1 - 760, FL, 1.0, S("r3") - 0.3); nia.face(0, "smile").say("r3").key(F("r3", 0.1), "point", 0.3).key(F("r3", 0.62), "stand", 0.3);
  L.sign(g1, "DRAGON BALL Z", X1 - 300, 240, 600, 130, F("r3", 0.02), { font: "Anton", size: 92, fill: "#1E1B2E", color: "#F2C230", rot: -3 });
  L.pop(g1, "250 EPISODES", X1 - 300, 480, 124, F("r3", 0.3), RED, "Anton", "slap"); L.pop(g1, "on that exact feeling", X1 - 300, 570, 58, F("r3", 0.5), L.GREY, "Patrick Hand", false);
  ups.push(L.burst(g1, X1 + 330, 520, 230, 1300, F("r3", 0.7)));
  const veg = mk(g1, "vegetaArmor", X1 + 330, FL, 1.12, F("r3", 0.72)); veg.key(0, "arms", 0).face(0, "smirk");
  L.plate(g1, X1 + 740, 430, "VEGETA", F("r3", 0.8), { size: 96, sub: "prince of all Saiyans" });

  const posters = [{ on: [S("r4") - 0.05, K.D + 0.1], shakeAt: F("r4", 0.3), lines: [
    { txt: "WHY YOU CAN'T STOP", y: 400, size: 170, at: S("r4") + 0.1 }, { txt: "COMPARING YOURSELF.", y: 640, size: 178, fill: RED, at: F("r4", 0.3), big: true },
    { txt: "and what to do with it", y: 800, size: 66, font: "Patrick Hand", fill: "#9A958C", at: F("r4", 0.62) }] }];
  const shots = [[0, X0 - 60, 540, 1.0], [1.3, X0 + 300, 520, 1.2, 1], [F("r1", 0.4), X0 - 420, 560, 1.3, -1], [F("r1", 0.8), X0 - 380, 600, 1.15, 1], [S("r2") - 0.1, X0 - 440, 480, 1.2, -1], [S("r3") - 0.4, X1 - 300, 540, 1.05], [F("r3", 0.68), X1 + 240, 530, 1.02, 1]];
  K.run({ shots, posters, punches: [{ t: F("r1", 0.86), z: 1.06 }, { t: F("r3", 0.3), z: 1.06 }, { t: F("r3", 0.8), z: 1.1 }], shakes: [{ t: F("r3", 0.72), a: 12 }], extra: tick });
})();
