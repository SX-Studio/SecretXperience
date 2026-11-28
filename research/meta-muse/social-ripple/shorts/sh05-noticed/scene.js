/* Short 5: "Surrounded. Still alone?" — lonely is not the same as alone (Naruto on the swing). First frame = cover; loops. */
(function () {
  const K = SHORT({ keys: { surrounded: 1, lonely: 1, alone: 1, gap: 1, want: 1, have: 1, crowd: 1, classroom: 1, chat: 1, kid: 1 }, noCap: ["n4"], fix: { n2: { 0: "Because" }, n5: { 0: "And" } } });
  const { S, E, W, T, I, Y, el, INKC, RED, clamp, ease } = K, L = LIB(K), C = CAST(I), N = NSHORT(K, L, C), { F, mk, person } = N, ink = K.ink;

  // ---------- B0: the cover — Naruto alone on the swing ----------
  const Y0 = Y(0); N.floor(Y0); N.hook(Y0, ["SURROUNDED.", 150], ["STILL ALONE?", 150], "NARUTO");
  N.swing(430, Y0, -2);
  const fam = [[800, 0.72, "#8F877A"], [900, 0.46, "#B8B0A2"]].map(([x, s, c]) => person(x, Y0 + 300, s, -2, c));
  N.ups.push((t) => { const u = t >= S("n4") ? 0 : ease(clamp((t - 0.4) / 2.6, 0, 1)); fam.forEach((g) => g.setAttribute("transform", `translate(${(u * 360).toFixed(1)},0)`)); });

  // ---------- B1: the gap ----------
  const Y1 = Y(1); N.floor(Y1);
  L.tx(ink, "lonely ≠ alone", 110, Y1 - 600, 110, S("n2") - 0.1, 0.6);
  I.path(ink, `M540,${Y1 - 200} m-300,0 a300,300 0 1,0 600,0 a300,300 0 1,0 -600,0`, F("n2", 0.35), 0.6, { w: 9, color: L.BLUE, attrs: { "stroke-dasharray": "24 14" } });
  I.fill(ink, el("circle", { cx: 540, cy: Y1 - 200, r: 105, fill: "#9CC3D9", stroke: INKC, "stroke-width": 6, opacity: 0 }), F("n2", 0.75), 0.25);
  L.pop(ink, "the connection you want", 540, Y1 - 525, 50, F("n2", 0.55), L.BLUE, "Patrick Hand", false); L.pop(ink, "what you have", 540, Y1 - 185, 40, F("n2", 0.8), INKC, "Patrick Hand", false);
  L.pop(ink, "the gap = loneliness", 620, Y1 + 150, 76, F("n2", 0.9), RED, "Caveat", "slap");
  const nia = mk(ink, "nia", 170, Y1 + 300, 0.6, S("n2") - 0.2); nia.face(0, "smile").say("n2").key(F("n2", 0.35), { aR: -110, eR: 0 }, 0.3);

  // ---------- B2: a crowd, a classroom, a group chat ----------
  const Y2 = Y(2); N.floor(Y2);
  [150, 330, 750, 930].forEach((x, i) => person(x, Y2 + 300, 0.85, S("n3") - 0.2 + i * 0.04));
  const mo = mk(ink, "mo", 540, Y2 + 300, 0.95, S("n3") - 0.3); mo.face(0, "sad").key(0, "slump", 0);
  [["in a crowd", -560, -4, 0.2], ["in a classroom", -430, 3, 0.5], ["in a group chat", -300, -3, 0.8]].forEach(([t, dy, r, f]) => L.sign(ink, t, 540, Y2 + dy, t.length * 30 + 90, 96, F("n3", f) - 0.1, { size: 60, rot: r, fill: "#FFFDF6" }));

  const posters = [{ on: [S("n4") - 0.05, E("n4") + 0.3], shakeAt: W("n4", -1), lines: [
    { txt: "BEING NOTICED", x: 90, y: 760, size: 160, at: S("n4") }, { txt: "IS NOT THE SAME AS", x: 90, y: 930, size: 104, fill: "#9A958C", at: F("n4", 0.4) }, { txt: "BEING KNOWN.", x: 90, y: 1170, size: 168, fill: RED, at: W("n4", -2), big: true }] }];
  const shots = [[0, 540, Y0 - 120, 1.05], [1.4, 500, Y0 - 100, 1.14, -1], [S("n2") - 0.35, 540, Y1 - 120, 1.05, 1], [F("n2", 0.7), 540, Y1 - 200, 1.2], [S("n3") - 0.35, 540, Y2 - 120, 1.05, -1], [F("n3", 0.5), 540, Y2 - 60, 1.22], [S("n4"), 540, Y0 - 120, 1.05]];
  K.run({ shots, posters, drift: 0.02, punches: [{ t: F("n2", 0.9), z: 1.08 }, { t: F("n3", 0.2), z: 1.06 }, { t: F("n3", 0.8), z: 1.06 }], extra: N.tick });
})();
