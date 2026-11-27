/* Naruto loneliness ep, ch5: Lesson 3 — one person can change the story (told via narration; acted by our own cast). */
(function () {
  const K = LONG({ keys: { sees: 1, teacher: 1, danger: 1, monster: 1, them: 1, burden: 1, alone: 1, away: 1, reaching: 1, pain: 1, change: 1, home: 1, precious: 1, protect: 1, somewhere: 1 }, noCap: ["s1", "s6"] });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, GREY = "#B8B0A2";
  const person = (p, x, s, at, col = GREY) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: FL - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${FL} Q${x - 70 * s},${FL - 250 * s} ${x},${FL - 270 * s} Q${x + 70 * s},${FL - 250 * s} ${x + 62 * s},${FL} Z`, fill: col }, g);
    I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });
  const defs = I.defs; const fl = el("filter", { id: "shade" }, defs); el("feColorMatrix", { type: "matrix", values: "0.35 0.1 0.1 0 0  0.1 0.3 0.1 0 0  0.15 0.15 0.45 0 0  0 0 0 1 0" }, fl);

  // ---------- B0: someone finally sees him ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, S("s2") - 0.4);
  const storm = el("g", {}, g0); I.fill(storm, el("path", { d: `M${X0 + 380},${460} q-40,-150 120,-160 q60,-110 210,-40 q150,-20 160,120 q110,60 30,170 q-60,70 -200,40 q-150,60 -260,-40 q-120,-20 -60,-90 z`, fill: "#5A5560", stroke: INKC, "stroke-width": 7, opacity: 0 }), S("s2"), 0.3, { sound: "whoosh" });
  I.path(storm, `M${X0 + 620},${520} l-60,140 l60,0 l-40,130`, F("s2", 0.2), 0.3, { w: 14, color: "#F2C230", loud: 1.3 });
  const mo = mk(g0, "mo", X0 - 460, FL, 1.0, S("s2") - 0.3); mo.key(0, "slump", 0).face(0, "sad").face(F("s2", 0.75), "wow").key(F("s2", 0.75), "look", 0.4);
  const nia = mk(g0, "nia", X0 - 1250, FL, 1.05, S("s2") - 0.2); nia.view(0, "side", 1).view(F("s2", 0.42), "front").move(F("s2", 0.12), X0 - 80, 0.8).face(0, "determined")
    .key(F("s2", 0.42), { aL: 100, eL: 0, aR: -100, eR: 0 }, 0.3).face(F("s2", 0.8), "smile").key(F("s2", 0.85), { aL: 70, eL: -30 }, 0.4);
  L.pop(g0, "one of us.", X0 - 260, 300, 90, F("s2", 0.85), RED, "Caveat", "pop");

  // ---------- B1: the mirror — the boy who pushed everyone away ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("s3") - 0.4);
  I.path(g1, `M${X1},${200} V${FL}`, S("s3"), 0.5, { w: 4, color: "#8A847A", attrs: { "stroke-dasharray": "14 12" } });
  const a = mk(g1, "mo", X1 - 380, FL, 1.0, S("s3")); a.face(0, "neutral").key(F("s3", 0.75), { aR: -80, eR: -10 }, 0.4).face(F("s3", 0.75), "smile");
  const shadowG = el("g", { filter: "url(#shade)" }, g1); const b = mk(shadowG, "mo", X1 + 380, FL, 1.0, F("s3", 0.12)); b.face(0, "determined").key(F("s3", 0.5), "cheer", 0.3).key(F("s3", 0.62), { aL: 30, eL: -60, aR: -30, eR: 60 }, 0.3);
  for (let i = 0; i < 5; i++) { const an = (-60 + i * 30) * Math.PI / 180; L.arrow(g1, X1 + 380 + Math.cos(an) * 200, 560 + Math.sin(an) * 200, X1 + 380 + Math.cos(an) * 330, 560 + Math.sin(an) * 330, F("s3", 0.55) + i * 0.04, { w: 6, color: "#5A5560", silent: i > 0 }); }
  L.pop(g1, "pushed everyone away", X1 + 380, 240, 54, F("s3", 0.55), "#5A5560", "Patrick Hand", false); L.pop(g1, "kept reaching out", X1 - 380, 240, 54, F("s3", 0.78), L.GREEN, "Patrick Hand", false);

  // ---------- B2: "I understand that pain" → he changes → welcomed home ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("s4") - 0.4);
  const m2 = mk(g2, "mo", X2 - 300, FL, 1.0, S("s4") - 0.3); m2.face(0, "smile").key(F("s4", 0.1), { aR: -75, eR: -5 }, 0.4);
  const sh2 = el("g", { filter: "url(#shade)" }, g2); const o2 = mk(sh2, "mo", X2 + 140, FL, 1.0, S("s4") - 0.3); o2.face(0, "sad").face(F("s4", 0.5), "smile").key(F("s4", 0.3), { aL: 75, eL: 5 }, 0.4);
  ups.push((t) => sh2.setAttribute("filter", t >= F("s4", 0.5) ? "" : "url(#shade)"));
  const crowd = [520, 680, 840].map((dx, i) => person(g2, X2 + dx, 0.85, F("s4", 0.72) + i * 0.08));
  for (let i = 0; i < 3; i++) I.path(g2, L.heart(X2 + 520 + i * 160, 380, 26), F("s4", 0.82) + i * 0.08, 0.2, { w: 5, color: RED, silent: i > 0 });
  L.pop(g2, "welcomed home", X2 + 680, 280, 64, F("s4", 0.85), RED, "Caveat", "pop");

  // ---------- B3: someone precious to protect ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("s5") - 0.4);
  const rue = mk(g3, "rue", X3 + 220, FL, 0.95, S("s5") - 0.3); rue.face(0, "smile");
  const m3 = mk(g3, "mo", X3 - 1100, FL, 1.0, S("s5") - 0.2); m3.view(0, "side", 1).view(F("s5", 0.45), "front").move(S("s5"), X3 - 120, 0.9).face(0, "determined").key(F("s5", 0.5), { aR: -100, eR: 0 }, 0.3);
  I.path(g3, L.heart(X3 + 60, 330, 60), F("s5", 0.7), 0.4, { w: 9, color: RED });
  L.pop(g3, "someone precious to protect", X3 + 60, 200, 64, F("s5", 0.6), INKC, "Caveat", false);

  const posters = [{ on: [S("s1") - 0.05, E("s1") + 0.45], shakeAt: F("s1", 0.7), lines: [{ txt: "LESSON #3", y: 260, size: 120, fill: "#9A958C", at: S("s1") }, { txt: "ONE PERSON CAN", y: 560, size: 210, at: F("s1", 0.35) }, { txt: "CHANGE THE STORY.", y: 820, size: 190, fill: RED, at: F("s1", 0.7), big: true }] },
    { on: [S("s6") - 0.05, K.D + 0.1], shakeAt: F("s6", 0.7), lines: [{ txt: "CONNECTION DIDN'T", y: 360, size: 160, at: F("s6", 0.05) }, { txt: "ERASE THE PAIN.", y: 560, size: 160, fill: "#9A958C", at: F("s6", 0.25) }, { txt: "IT GAVE IT", y: 780, size: 170, at: F("s6", 0.55) }, { txt: "SOMEWHERE TO GO.", y: 980, size: 170, fill: RED, at: F("s6", 0.7), big: true }] }];
  const shots = [[0, X0, 540, 1.0], [F("s2", 0.42), X0 - 260, 520, 1.15, 1], [F("s2", 0.8), X0 - 300, 470, 1.35], [S("s3") - 0.4, X1, 540, 1.0, -1], [S("s4") - 0.4, X2, 540, 1.0], [F("s4", 0.7), X2 + 300, 540, 1.05, 1], [S("s5") - 0.4, X3, 540, 1.0], [F("s5", 0.6), X3, 500, 1.2]];
  K.run({ shots, posters, punches: [{ t: F("s2", 0.42), z: 1.1 }, { t: F("s4", 0.5), z: 1.08 }], shakes: [{ t: F("s2", 0.2), a: 8 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
