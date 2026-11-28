/* Naruto loneliness ep, ch2: the story, told in narration; Mo stands in for the situations (generic props only). */
(function () {
  const K = LONG({ keys: { episode: 1, baby: 1, sealed: 1, adults: 1, distance: 1, copied: 1, loud: 1, paints: 1, invisible: 1, swing: 1, himself: 1, watching: 1 } });
  const { S, E, W, T, I, X, B, el, INKC, HI, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), F = (i, f) => S(i) + f * T[i][1], cast = [], ups = [];
  const mk = (...a) => { const h = C.make(...a); cast.push(h); return h; };
  const FL = 900, GREY = "#B8B0A2", DARK = "#8F877A";
  const person = (p, x, s, at, col = GREY) => { const g = el("g", { opacity: 0 }, p); el("circle", { cx: x, cy: FL - 330 * s, r: 52 * s, fill: col }, g); el("path", { d: `M${x - 62 * s},${FL} Q${x - 70 * s},${FL - 250 * s} ${x},${FL - 270 * s} Q${x + 70 * s},${FL - 250 * s} ${x + 62 * s},${FL} Z`, fill: col }, g);
    I.fill(p, g, at, 0.25, { sound: false }); return g; };
  const floor = (g, x, at) => I.path(g, `M${x - 1100},${FL} H${x + 1100}`, at, 0.5, { w: 5, color: "#8A847A", silent: true });

  // ---------- B0: a baby, and something sealed inside ----------
  const X0 = X(0), g0 = B(0); floor(g0, X0, 0);
  L.tx(g0, "episode 1", X0 - 820, 170, 90, 0.0, 0.5, { color: L.GREY });
  I.path(g0, `M${X0 - 260},${700} q260,160 520,0 M${X0 - 240},${700} v120 M${X0 + 240},${700} v120 M${X0 - 300},${820} h600`, F("p1", 0.25), 0.6, { w: 8, color: "#8A5A2B" });
  I.fill(g0, el("ellipse", { cx: X0, cy: 680, rx: 120, ry: 70, fill: "#FFFDF6", stroke: INKC, "stroke-width": 6, opacity: 0 }), F("p1", 0.35), 0.25);
  I.fill(g0, el("circle", { cx: X0 + 70, cy: 650, r: 44, fill: "#F2C9A0", stroke: INKC, "stroke-width": 5, opacity: 0 }), F("p1", 0.4), 0.25, { sound: false });
  const glow = el("path", { d: `M${X0 - 20},${700} q-40,-80 10,-150 q10,60 40,40 q-10,-60 40,-90 q10,90 -30,200 z`, fill: "#F28C28", opacity: 0 }, g0);
  ups.push((t) => { const u = clamp((t - F("p1", 0.7)) / 0.4, 0, 1); glow.setAttribute("opacity", (u * (0.55 + 0.25 * Math.sin(t * 6))).toFixed(2)); });
  L.pop(g0, "a dangerous fox spirit, sealed inside", X0, 300, 64, F("p1", 0.7), "#C8601E", "Caveat", "whoosh");

  // ---------- B1: adults keep their distance; kids copy ----------
  const X1 = X(1), g1 = B(1); floor(g1, X1, S("p2") - 0.4);
  const kid = mk(g1, "naruto", X1, FL, 0.8, S("p2") - 0.3); kid.key(0, "stand", 0).face(0, "neutral").face(F("p2", 0.55), "sad").key(F("p2", 0.55), "slump", 0.5);
  const adults = [-560, -360, 360, 560].map((dx, i) => person(g1, X1 + dx, 1.1, S("p2") + i * 0.08, DARK));
  [["shh", -460, 300], ["don't talk about it", 460, 280]].forEach(([t, dx, y], i) => { const at = F("p2", 0.12) + i * 0.15, bw = t.length * 26 + 70;
    L.rect(g1, X1 + dx - bw / 2, y - 50, bw, 74, at, "#FFFDF6", { rx: 30, sound: "pop" }); L.pop(g1, t, X1 + dx, y, 44, at + 0.03, INKC, "Patrick Hand", false); });
  const kids = [-760, -230, 230, 760].map((dx, i) => person(g1, X1 + dx, 0.62, F("p2", 0.7) + i * 0.06, GREY));
  ups.push((t) => { const u = ease(clamp((t - F("p2", 0.35)) / 0.8, 0, 1)), v = ease(clamp((t - F("p2", 0.8)) / 0.7, 0, 1));
    adults.forEach((g, i) => g.setAttribute("transform", `translate(${((i < 2 ? -1 : 1) * 160 * u).toFixed(1)},0)`)); kids.forEach((g, i) => g.setAttribute("transform", `translate(${((i < 2 ? -1 : 1) * 120 * v).toFixed(1)},0)`)); });
  L.pop(g1, "kids copied them", X1, 330, 64, F("p2", 0.85), RED, "Caveat", false);

  // ---------- B2: loud — paint on the carved cliff ----------
  const X2 = X(2), g2 = B(2); floor(g2, X2, S("p3") - 0.4);
  I.path(g2, `M${X2 - 900},${FL} L${X2 - 820},${260} Q${X2},${180} ${X2 + 820},${260} L${X2 + 900},${FL}`, S("p3") - 0.3, 0.7, { w: 8, color: "#8A847A" });
  [-480, 0, 480].forEach((dx, i) => { const cx = X2 + dx, at = S("p3") + i * 0.12; I.path(g2, `M${cx - 120},${520} Q${cx - 120},${320} ${cx},${320} Q${cx + 120},${320} ${cx + 120},${520} Q${cx},${600} ${cx - 120},${520}`, at, 0.4, { w: 6, color: "#A9A39A" });
    I.path(g2, `M${cx - 55},${430} h30 M${cx + 25},${430} h30 M${cx - 30},${505} h60`, at + 0.2, 0.2, { w: 6, color: "#A9A39A", silent: true }); });
  const tagger = mk(g2, "naruto", X2 - 120, FL, 0.85, S("p3")); tagger.face(0, "grin").key(F("p3", 0.3), "wave", 0.25).key(F("p3", 0.42), "point", 0.2).key(F("p3", 0.54), "wave", 0.2).key(F("p3", 0.66), "point", 0.2).key(F("p3", 0.8), "cheer", 0.3);
  [["#E04A3A", -480], ["#3A8FE0", -470], ["#F2C230", 0], ["#4E8A3A", 10], ["#E04A3A", 480], ["#B05AE0", 470]].forEach(([col, dx], i) => I.path(g2, `M${X2 + dx - 90},${380 + (i % 2) * 70} q40,-60 90,0 t90,10`, F("p3", 0.32) + i * 0.07, 0.25, { w: 16, color: col, loud: 1.2 }));
  L.sign(g2, "better yelled at than invisible", X2 + 400, 760, 640, 100, F("p3", 0.82), { size: 52, rot: -3, fill: "#FFFDF6", color: RED });

  // ---------- B3: the swing ----------
  const X3 = X(3), g3 = B(3); floor(g3, X3, S("p4") - 0.4);
  I.path(g3, `M${X3 - 640},${FL} L${X3 - 520},${360} L${X3 - 400},${FL} M${X3 - 130},${FL} L${X3 - 10},${360} L${X3 + 110},${FL} M${X3 - 540},${370} H${X3 + 10}`, S("p4") - 0.3, 0.7, { w: 9, color: "#8A5A2B" });
  const swing = el("g", {}, g3); I.path(swing, `M${X3 - 330},${372} V${700} M${X3 - 190},${372} V${700}`, S("p4"), 0.4, { w: 5, color: INKC, silent: true }); L.rect(swing, X3 - 350, 694, 180, 22, S("p4") + 0.1, "#A0703A", { rx: 4, sound: false });
  const sw = mk(swing, "naruto", X3 - 260, 700 + 170 * 0.78 - 74 * 0.78 + 4, 0.78, S("p4") + 0.1); sw.view(0, "side", 1).key(0, "sit", 0).face(0, "neutral").face(F("p4", 0.55), "sad").key(F("p4", 0.55), { head: 18 }, 0.6);
  ups.push((t) => swing.setAttribute("transform", `rotate(${(Math.sin(t * 1.3) * 3).toFixed(2)} ${X3 - 260} 372)`));
  const fams = [[360, 0.95, DARK], [470, 0.6, GREY], [700, 1.0, DARK], [800, 0.58, GREY]].map(([dx, s2, col], i) => person(g3, X3 + dx, s2, F("p4", 0.22) + i * 0.06, col));
  ups.push((t) => { const u = ease(clamp((t - F("p4", 0.45)) / 1.6, 0, 1)); fams.forEach((g) => g.setAttribute("transform", `translate(${(u * 420).toFixed(1)},0)`)); });
  L.pop(g3, "by himself.", X3 - 260, 300, 70, F("p4", 0.7), RED, "Caveat", false);

  const shots = [[0, X0, 540, 1.0], [S("p2") - 0.4, X1, 540, 1.0, 1], [F("p2", 0.55), X1, 560, 1.18, -1], [S("p3") - 0.4, X2, 540, 1.0], [S("p4") - 0.4, X3, 540, 1.0, -1], [F("p4", 0.65), X3 - 220, 600, 1.4]];
  K.run({ shots, punches: [{ t: F("p1", 0.72), z: 1.1 }, { t: F("p3", 0.35), z: 1.08 }], extra(t) { cast.forEach((h) => h.update(t)); ups.forEach((u) => u(t)); } });
})();
