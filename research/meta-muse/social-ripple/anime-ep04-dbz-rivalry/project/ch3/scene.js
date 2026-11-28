/* DBZ rivalry ep, ch3: Lesson 1 — you compare with people close to you (Festinger 1954, theory; Kilduff, Elfenbein & Staw 2010; Gerber, Wheeler & Suls 2018). */
(function () {
  const K = LONG({ keys: { compare: 1, close: 1, rival: 1, tyrant: 1, saiyan: 1, blood: 1, strength: 1, festinger: 1, ruler: 1, level: 1, basketball: 1, similar: 1, matched: 1, again: 1, up: 1, better: 1, smaller: 1 }, noCap: ["t1", "t6"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), CH = CHAR(K), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, floor = (g, x, at, w = 1100) => I.path(g, `M${x - w},${FL} H${x + w}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const win = (g, a, b) => { const w = el("g", {}, g); ups.push((t) => w.setAttribute("display", t >= a && t < b ? "inline" : "none")); return w; };
  const person = (p, x, fl, s, at, col = "#B8B0A2") => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: fl - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${fl} Q${x - 70 * s},${fl - 250 * s} ${x},${fl - 270 * s} Q${x + 70 * s},${fl - 250 * s} ${x + 62 * s},${fl} Z`, fill: col }, g); I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const icon = (p, x, y, at, col, s = 1) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: y, r: 20 * s, fill: col, stroke: INKC, "stroke-width": 4 }, g); el("path", { d: `M${x - 24 * s},${y + 78 * s} Q${x - 26 * s},${y + 26 * s} ${x},${y + 24 * s} Q${x + 26 * s},${y + 26 * s} ${x + 24 * s},${y + 78 * s} Z`, fill: col, stroke: INKC, "stroke-width": 4 }, g); I.fill(p, g, at, 0.12, { sound: false }); return g; };
  const flash = (p, cx, cy, at, r = 520) => { const c = el("circle", { cx, cy, r: 10, fill: "#FFFDF0", opacity: 0 }, p); ups.push((t) => { const u = clamp((t - at) / 0.5, 0, 1); c.setAttribute("opacity", u > 0 && u < 1 ? (1 - u) * 0.95 : 0); c.setAttribute("r", (40 + r * u).toFixed(0)); }); };
  const tick = (t) => { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); };
  // ---------- B0: who he picks ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("t2") - 0.4);
  I.path(g0, `M${X0 - 880},${FL} V${130}`, S("t2") - 0.2, 0.5, { w: 7, color: "#8A847A" }); for (let i = 0; i < 8; i++) I.path(g0, `M${X0 - 880},${FL - 40 - i * 100} h40`, S("t2") + i * 0.03, 0.1, { w: 5, color: "#8A847A", silent: true }); L.pop(g0, "power", X0 - 790, 120, 50, S("t2"), L.GREY, "Patrick Hand", false);
  const tyr = el("g", { opacity: 0 }, g0); el("path", { d: `M${X0 + 560},${330} q-60,-10 -70,-90 q-4,-90 70,-100 q74,10 70,100 q-10,80 -70,90 z`, fill: "#7A5AA8" }, tyr); el("path", { d: `M${X0 + 490},${180} l-50,-50 l60,14 z M${X0 + 630},${180} l50,-50 l-60,14 z`, fill: "#7A5AA8" }, tyr); el("path", { d: `M${X0 + 470},${330} h180`, stroke: "#8A847A", "stroke-width": 6 }, tyr); I.fill(g0, tyr, F("t2", 0.28), 0.3, { sound: "pop" });
  L.pop(g0, "the tyrant, far above", X0 + 560, 400, 50, F("t2", 0.3), L.GREY, "Patrick Hand", false);
  [[320, 0.5], [440, 0.44], [560, 0.52], [680, 0.46]].forEach(([dx, s], i) => person(g0, X0 + dx, FL, s, F("t2", 0.42) + i * 0.05)); L.pop(g0, "the fighters far below", X0 + 500, 640, 50, F("t2", 0.44), L.GREY, "Patrick Hand", false);
  I.path(g0, `M${X0 - 760},${FL - 250} H${X0 + 60}`, S("t2"), 0.4, { w: 6, color: "#8A847A" });
  const v0 = mk(g0, "vegetaCell", X0 - 560, FL - 250, 0.9, S("t2") - 0.2); v0.key(0, "arms", 0).face(0, "determined").key(F("t2", 0.55), { head: 8 }, 0.3);
  const gk0 = mk(g0, "goku", X0 - 180, FL - 250, 0.95, F("t2", 0.55)); gk0.face(0, "grin");
  I.path(g0, `M${X0 - 700},${FL - 180} v30 H${X0 - 40} v-30`, F("t2", 0.66), 0.4, { w: 6, color: RED });
  [["same blood", 0.68, -640], ["same trade", 0.78, -380], ["never far apart", 0.88, -80]].forEach(([s, f, dx]) => L.pop(g0, s, X0 + dx, FL - 118, 56, F("t2", f), RED, "Caveat", "pop"));

  // ---------- B1: Festinger — no ruler, so we use each other ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("t3") - 0.4);
  L.sign(g1, "1954 · Leon Festinger · a theory", X1 - 380, 160, 820, 100, S("t3") + 0.2, { size: 54, rot: -2, fill: "#FFFDF6", color: L.GREY });
  const kai = mk(g1, "kai", X1 - 420, FL, 1.0, S("t3") - 0.3); kai.face(0, "neutral").key(F("t3", 0.3), "think", 0.4).face(F("t3", 0.62), "wow").key(F("t3", 0.62), "look", 0.3);
  L.pop(g1, "how good am I?", X1 - 420, 330, 64, F("t3", 0.3), INKC, "Caveat", false);
  const rw = win(g1, F("t3", 0.48), F("t3", 0.66)); I.path(rw, `M${X1 - 180},${460} h360 v70 h-360 z M${X1 - 120},${460} v30 M${X1 - 60},${460} v30 M${X1},${460} v30 M${X1 + 60},${460} v30 M${X1 + 120},${460} v30`, F("t3", 0.48), 0.3, { w: 6 }); I.path(rw, `M${X1 - 200},${420} L${X1 + 200},${570} M${X1 + 200},${420} L${X1 - 200},${570}`, F("t3", 0.55), 0.25, { w: 10, color: RED }); L.pop(rw, "no ruler", X1, 640, 56, F("t3", 0.56), RED, "Caveat", false);
  const rue = mk(g1, "rue", X1 + 60, FL, 1.0, F("t3", 0.64)); rue.face(0, "smile"); const mo = mk(g1, "mo", X1 + 420, FL, 1.0, F("t3", 0.7)); mo.face(0, "neutral");
  I.path(g1, `M${X1 - 330},${404} H${X1 + 510}`, F("t3", 0.74), 0.4, { w: 6, color: L.BLUE, attrs: { "stroke-dasharray": "16 12" } }); L.pop(g1, "people close to our level", X1 + 240, 350, 56, F("t3", 0.86), L.BLUE, "Caveat", "pop");

  // ---------- B2: basketball — what makes a rival ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("t4") - 0.4);
  [-1, 1].forEach((d) => { I.path(g2, `M${X2 + d * 760},${FL} V${330} M${X2 + d * 760},${360} H${X2 + d * 640} M${X2 + d * 640},${330} v70`, S("t4"), 0.4, { w: 8, color: "#8A847A" }); I.path(g2, `M${X2 + d * 640},${400} h${-d * 90} l${d * 14},70 h${d * 62} z`, S("t4") + 0.2, 0.3, { w: 6, color: "#E07A3A" }); });
  const ball = el("circle", { r: 34, fill: "#E07A3A", stroke: INKC, "stroke-width": 6, opacity: 0 }, g2); ups.push((t) => { const v = t >= S("t4") && t < E("t4") + 0.6, p = ((t - S("t4")) / 1.6) % 2, u = p < 1 ? p : 2 - p; ball.setAttribute("opacity", v ? 1 : 0); ball.setAttribute("cx", (X2 - 560 + 1120 * u).toFixed(1)); ball.setAttribute("cy", (640 - Math.abs(Math.sin(u * Math.PI * 3)) * 220).toFixed(1)); });
  [["similar", 0.5], ["evenly matched", 0.66], ["met again and again", 0.82]].forEach(([s, f], i) => { L.rect(g2, X2 - 330, 200 + i * 120, 660, 96, F("t4", f), "#E3F2D6", { rx: 14, sound: "pop" }); L.pop(g2, "✓  " + s, X2, 268 + i * 120, 62, F("t4", f) + 0.05, L.GREEN, "Caveat", false); });
  L.pop(g2, "college basketball rivalries", X2, 150, 50, S("t4") + 0.3, L.GREY, "Patrick Hand", false);

  // ---------- B3: we look up ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("t5") - 0.4);
  L.pop(g3, "60 years of experiments", X3 - 420, 170, 60, S("t5") + 0.3, L.GREY, "Patrick Hand", false);
  for (let i = 0; i < 4; i++) { I.path(g3, `M${X3 - 100 + i * 220},${FL - i * 150} h220 v-150`, S("t5") + i * 0.08, 0.2, { w: 7, color: "#8A847A", silent: i > 0 }); if (i) icon(g3, X3 + 10 + i * 220, FL - i * 150 - 96, F("t5", 0.3) + i * 0.08, ["", "#D9D4CB", "#C9E2B8", "#F2C230"][i], 1.1); }
  const moW = el("g", {}, g3), m3 = mk(moW, "mo", X3 - 420, FL, 1.05, S("t5") - 0.3); m3.face(0, "neutral").key(F("t5", 0.42), "look", 0.3).key(F("t5", 0.42), { head: -18 }, 0.3).face(F("t5", 0.8), "sad").key(F("t5", 0.8), "slump", 0.4);
  ups.push((t) => { const u = ease(clamp((t - F("t5", 0.8)) / 0.7, 0, 1)); moW.setAttribute("transform", `translate(${X3 - 420},${FL}) scale(${(1 - 0.22 * u).toFixed(3)}) translate(${-(X3 - 420)},${-FL})`); });
  L.arrow(g3, X3 - 300, 560, X3 + 480, 260, F("t5", 0.46), { w: 8, color: RED }); L.pop(g3, "we look up", X3 - 60, 330, 70, F("t5", 0.5), RED, "Caveat", "pop", -20); L.pop(g3, "…and feel smaller", X3 - 380, 420, 60, F("t5", 0.84), INKC, "Caveat", false);

  const posters = [{ on: [S("t1") - 0.05, E("t1") + 0.5], shakeAt: F("t1", 0.6), lines: [{ txt: "LESSON #1", y: 260, size: 120, fill: "#9A958C", at: S("t1") }, { txt: "YOU ONLY COMPARE", y: 540, size: 200, at: F("t1", 0.3) }, { txt: "WITH PEOPLE CLOSE TO YOU.", y: 800, size: 144, fill: RED, at: F("t1", 0.6), big: true }] },
    { on: [S("t6") - 0.05, K.D + 0.1], shakeAt: F("t6", 0.72), lines: [{ txt: "COMPARING", y: 360, size: 220, at: F("t6", 0.05) }, { txt: "ISN'T A FLAW.", y: 580, size: 200, fill: "#9A958C", at: F("t6", 0.22) }, { txt: "IT'S HOW YOUR MIND", y: 800, size: 150, at: F("t6", 0.5) }, { txt: "TAKES A MEASUREMENT.", y: 980, size: 160, fill: RED, at: F("t6", 0.72), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [S("t2") + 0.2, X0 - 360, 440, 1.25, -1], [F("t2", 0.27), X0 + 420, 420, 1.15, 1], [F("t2", 0.42), X0 + 420, 620, 1.15], [F("t2", 0.56), X0 - 360, 470, 1.2, -1], [F("t2", 0.86), X0 - 60, 540, 1.0],
    [S("t3") - 0.4, X1 - 420, 600, 1.3], [F("t3", 0.28), X1 - 300, 480, 1.15, 1], [F("t3", 0.62), X1 + 40, 540, 1.02, -1], [S("t4") - 0.4, X2, 540, 1.0], [F("t4", 0.48), X2, 480, 1.12, 1],
    [S("t5") - 0.4, X3 - 60, 540, 1.0], [F("t5", 0.42), X3 + 120, 460, 1.1, -1], [F("t5", 0.78), X3 - 300, 600, 1.2, 1]];
  K.run({ shots, posters, punches: [{ t: F("t2", 0.66), z: 1.06 }, { t: F("t3", 0.55), z: 1.06 }, { t: F("t3", 0.86), z: 1.06 }, { t: F("t4", 0.82), z: 1.06 }], extra: tick });
})();
