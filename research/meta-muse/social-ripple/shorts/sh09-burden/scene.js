/* Short 9: "Afraid you're a burden?" — Robin at Enies Lobby (One Piece ep 278); helpers are more willing and less bothered than we expect (Zhao & Epley 2022). First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { afraid: 1, burden: 1, twenty: 1, "20": 1, years: 1, sold: 1, deal: 1, safety: 1, crew: 1, anyway: 1, live: 1, gap: 1, photo: 1, willing: 1, bothered: 1, taking: 1, show: 1 }, noCap: ["b5"], fix: { b2: { 20: "friends'" }, b6: { 5: "believe," } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;

  // ---------- B0: the cover — Robin, cuffed, her crew far away ----------
  const Y0 = Y(0), FL0 = Y0 + 300; N.floor(Y0); N.hook(Y0, ["AFRAID YOU'RE", 138], ["A BURDEN?", 165], "ONE PIECE");
  const far = [[70, 0.52, "#A9A39A"], [170, 0.6, "#8F877A"], [280, 0.52, "#A9A39A"], [372, 0.46, "#B8B0A2"]].map(([x, s, c]) => person(x, FL0, s, -2, c));
  N.ups.push((t) => { const u = t >= S("b5") ? 0 : ease(clamp((t - 0.3) / 2.6, 0, 1)); far.forEach((g) => g.setAttribute("transform", `translate(${(u * 46).toFixed(1)},0)`)); });
  const robin0 = mk(ink, "robin", 740, FL0, 1.5, -2); robin0.key(0, "cuffed", 0).key(0, { head: 12 }, 0).face(0, "sad").key(0.5, { head: 24 }, 1.0).key(S("b5"), { head: 12 }, 0);

  // ---------- B1: twenty years; the deal ----------
  const Y1 = Y(1), FL1 = Y1 + 300; N.floor(Y1);
  L.tx(ink, "20 years on the run", 90, Y1 - 620, 92, S("b2") - 0.1, 0.7);
  const r1 = mk(ink, "robin", 150, FL1, 0.9, S("b2") - 0.3); r1.view(0, "side", 1).face(0, "sad").move(S("b2"), 330, T.b2[1] * 0.4).view(F("b2", 0.45), "front");
  const tr = [560, 730, 900].map((x, i) => person(x, FL1, 0.8, S("b2") + 0.1 + i * 0.08));
  N.ups.push((t) => tr.forEach((g, i) => { const u = ease(clamp((t - F("b2", 0.22) - i * 0.14) / 0.5, 0, 1)); g.setAttribute("transform", `translate(${(u * 70).toFixed(1)},${(-u * 24).toFixed(1)})`); g.setAttribute("opacity", (1 - 0.65 * u).toFixed(2)); }));
  L.pop(ink, "sold out, again and again", 700, Y1 - 60, 54, F("b2", 0.3), RED, "Caveat", false);
  L.box(ink, 130, Y1 - 540, 820, 330, F("b2", 0.5)); L.pop(ink, "THE DEAL", 540, Y1 - 450, 76, F("b2", 0.52), INKC, "Anton", "slap");
  L.pop(ink, "herself", 300, Y1 - 300, 80, F("b2", 0.7), RED, "Caveat", false); L.arrow(ink, 430, Y1 - 322, 560, Y1 - 322, F("b2", 0.76), { w: 7 }); L.pop(ink, "her friends", 760, Y1 - 330, 62, F("b2", 0.82), L.GREEN, "Caveat", false); L.pop(ink, "safe", 760, Y1 - 262, 50, F("b2", 0.9), L.GREEN, "Patrick Hand", false);

  // ---------- B2: the rooftop — "say it!" ----------
  const Y2 = Y(2), RF = Y2 + 300, TW = Y2 + 60;
  L.tx(ink, "episode 278", 90, Y2 - 620, 80, S("b3") - 0.1, 0.5, { color: L.GREY });
  I.path(ink, `M-100,${RF} H500 V${RF + 600} M-20,${RF} v-36 h80 v36 m110,0 v-36 h80 v36 m110,0 v-36 h80 v36`, S("b3") - 0.2, 0.6, { w: 8, color: "#5E8C7A" });
  I.path(ink, `M660,${TW + 700} V${TW} H1180 M660,${TW} v-44 H1180 M800,${TW - 44} V${Y2 - 560} H1180`, S("b3"), 0.7, { w: 8, color: "#8A847A" });
  [[40, "#A9A39A"], [440, "#8F877A"]].forEach(([x, c], i) => person(x, RF, 0.6, S("b3") + 0.1 + i * 0.06, c));
  const luffy = mk(ink, "luffyEL", 330, RF, 0.9, S("b3") - 0.1); luffy.key(0, "arms", 0).face(0, "determined").key(F("b3", 0.5), { aL: 146, eL: -14, aR: -146, eR: 14, head: -8 }, 0.2).face(F("b3", 0.5), "strain");
  const soge = mk(ink, "sogeking", 180, RF, 0.84, S("b3"));
  const robin = mk(ink, "robin", 930, TW, 0.86, S("b3") + 0.1); robin.key(0, "cuffed", 0).face(0, "sad").face(F("b3", 0.55), "wow").face(F("b3", 0.82), "strain").cry(F("b3", 0.78)).key(F("b3", 0.82), { head: -8 }, 0.3);
  const sw = el("g", {}, ink); N.ups.push((t) => sw.setAttribute("display", t < F("b3", 0.8) ? "inline" : "none")); L.pop(sw, "SAY IT!", 300, Y2 - 250, 140, F("b3", 0.52), RED, "Anton", "bigslam", -4);
  L.rect(ink, 430, Y2 - 500, 540, 130, F("b3", 0.84), "#FFFDF6", { rx: 44, sound: "pop" }); L.pop(ink, "I want to live!", 700, Y2 - 410, 86, F("b3", 0.86), RED, "Caveat", false);

  // ---------- B3: the photo study ----------
  const Y3 = Y(3), FL3 = Y3 + 300; N.floor(Y3);
  const rue = mk(ink, "rue", 250, FL3, 0.88, S("b4") - 0.3); rue.face(0, "neutral").key(F("b4", 0.22), { aR: -85, eR: -5 }, 0.3).face(F("b4", 0.75), "grin");
  const mo = mk(ink, "mo", 560, FL3, 0.88, F("b4", 0.16)); mo.face(0, "neutral").face(F("b4", 0.55), "smile").key(F("b4", 0.36), { aL: 70, eL: -80, aR: -70, eR: 80 }, 0.3);
  L.rect(ink, 362, FL3 - 328, 86, 58, F("b4", 0.26), "#3A3A44", { rx: 8, sound: "pop" }); I.fill(ink, el("circle", { cx: 405, cy: FL3 - 299, r: 15, fill: "#9CC3D9", stroke: INKC, "stroke-width": 4, opacity: 0 }), F("b4", 0.28), 0.15, { sound: false });
  L.pop(ink, "\"could you take my photo?\"", 540, Y3 - 150, 56, F("b4", 0.22), INKC, "Caveat", false);
  const rows = [["willing", 0.58, 520, 620, L.GREEN], ["bothered", 0.74, 225, 40, RED]], specs = [];
  rows.forEach(([lb, f, e2, a2, col], i) => { const y = Y3 - 600 + i * 210; L.tx(ink, lb, 300, y - 14, 58, F("b4", f) - 0.2, 0.3, { font: "Patrick Hand" }); L.pop(ink, "expected", 280, y + 46, 36, F("b4", f), L.GREY, "Patrick Hand", false, 0, "end"); L.pop(ink, "actual", 280, y + 110, 36, F("b4", f) + 0.1, INKC, "Patrick Hand", false, 0, "end");
    specs.push({ x: 300, y: y + 10, len: e2, thick: 48, fill: "#B8B0A2", at: F("b4", f), horizontal: true }, { x: 300, y: y + 74, len: a2, thick: 48, fill: col, at: F("b4", f) + 0.12, horizontal: true }); });
  N.ups.push(L.bars(ink, specs));

  const posters = [{ on: [S("b5") - 0.05, E("b5") + 0.3], shakeAt: F("b5", 0.72), lines: [
    { txt: "ASKING ISN'T", x: 90, y: 620, size: 160, at: S("b5") }, { txt: "TAKING.", x: 90, y: 830, size: 220, at: F("b5", 0.2) }, { txt: "IT'S LETTING SOMEONE", x: 90, y: 1010, size: 96, fill: "#9A958C", at: F("b5", 0.48) }, { txt: "SHOW UP FOR YOU.", x: 90, y: 1200, size: 122, fill: RED, at: F("b5", 0.72), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [1.2, 600, Y0 - 90, 1.14, 1], [S("b2") - 0.35, 540, Y1 - 120, 1.05, -1], [F("b2", 0.5), 540, Y1 - 165, 1.12], [S("b3") - 0.35, 540, Y2 - 120, 1.05, 1], [F("b3", 0.48), 360, Y2 - 20, 1.3, -1], [F("b3", 0.8), 810, Y2 - 180, 1.3, 1],
    [S("b4") - 0.35, 540, Y3 - 120, 1.05], [F("b4", 0.2), 480, Y3 + 20, 1.22, -1], [F("b4", 0.56), 540, Y3 - 200, 1.05, 1], [S("b6") - 0.25, 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, punches: [{ t: F("b2", 0.52), z: 1.07 }, { t: F("b3", 0.86), z: 1.08 }, { t: F("b4", 0.74), z: 1.06 }], shakes: [{ t: F("b3", 0.52), a: 12 }], extra: N.tick });
})();
